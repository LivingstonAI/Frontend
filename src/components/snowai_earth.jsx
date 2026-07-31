import Header from "./header";
import SideNavs from "./side_navs";
import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import Globe from 'react-globe.gl';
import * as d3 from 'd3';
import { Eye, TrendingUp, TrendingDown, AlertTriangle, DollarSign, Star, BarChart3, Search, Clock, Layers, Maximize2, Minimize2, RefreshCw } from 'lucide-react';
import { createChart, CandlestickSeries, LineSeries, LineStyle } from 'lightweight-charts';

const geoUrl = "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson";

// ---------------------------------------------------------------------------
// Design tokens (light, professional palette -- ties into SnowAI's existing
// blue accent rather than introducing a new brand color)
// ---------------------------------------------------------------------------
const COLORS = {
    bg: '#f7f8fa',
    surface: '#ffffff',
    border: '#e4e7ec',
    borderStrong: '#d0d5dd',
    ink: '#111827',
    inkMuted: '#5b6472',
    inkFaint: '#94a3b8',
    accent: '#2563eb',
    accentHover: '#1d4ed8',
    accentSoft: '#eff6ff',
    accentBorder: '#bfdbfe',
    positive: '#16a34a',
    positiveSoft: '#f0fdf4',
    positiveBorder: '#bbf7d0',
    caution: '#b45309',
    cautionSoft: '#fffbeb',
    cautionBorder: '#fde68a',
    negative: '#dc2626',
    negativeSoft: '#fef2f2',
    negativeBorder: '#fecaca',
    neutralSoft: '#f1f5f9',
    neutralBorder: '#e2e8f0',
    mono: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',
};

// ---------------------------------------------------------------------------
// Dedicated dark palette for the 2D map + globe viewport, so land masses
// actually have contrast against the ocean/void instead of washing out on
// white. Kept separate from COLORS (which still drives cards/modals/text)
// so the rest of the UI doesn't change.
// ---------------------------------------------------------------------------
const MAP_COLORS = {
    void: '#0b1220',
    land: '#1c293e',
    landHasData: '#0f3d2e',
    landSelected: '#1d3f78',
    border: '#33415a',
    borderHover: '#3b82f6',
    borderSelected: '#60a5fa',
    point: '#60a5fa',
    pointStroke: '#0b1220',
};

const getRecStyle = (rec) => {
    const r = (rec || '').toUpperCase();
    if (r.includes('STRONG BUY') || r.includes('BULLISH')) return { background: COLORS.positiveSoft, color: COLORS.positive, border: `1px solid ${COLORS.positiveBorder}` };
    if (r.includes('BUY')) return { background: COLORS.accentSoft, color: COLORS.accent, border: `1px solid ${COLORS.accentBorder}` };
    if (r.includes('WATCH') || r.includes('NEUTRAL')) return { background: COLORS.cautionSoft, color: COLORS.caution, border: `1px solid ${COLORS.cautionBorder}` };
    if (r.includes('SELL') || r.includes('AVOID') || r.includes('BEARISH')) return { background: COLORS.negativeSoft, color: COLORS.negative, border: `1px solid ${COLORS.negativeBorder}` };
    return { background: COLORS.neutralSoft, color: COLORS.inkMuted, border: `1px solid ${COLORS.neutralBorder}` };
};

// Maps the ISO code on each city marker back to the country name that's
// actually stored on SnowGlobalStockPick.country (marker "name" is a city,
// e.g. "Tokyo", not the country, e.g. "Japan"). US intentionally maps to
// the full "United States of America" -- that's the form the world.geojson
// polygons use and the form saved picks are keyed against, so clicking any
// US marker (New York, Chicago, etc.) resolves the same way a polygon click
// on the US landmass does, and both pull the same saved data.
const isoToCountryName = {
    US: 'United States of America', CN: 'China', GB: 'United Kingdom', DE: 'Germany',
    FR: 'France', BE: 'Belgium', CH: 'Switzerland', NL: 'Netherlands',
    JP: 'Japan', SG: 'Singapore', KR: 'South Korea', IN: 'India',
    AU: 'Australia', AE: 'United Arab Emirates', RU: 'Russia', IL: 'Israel',
    SA: 'Saudi Arabia', TR: 'Turkey', CA: 'Canada', BR: 'Brazil',
    MX: 'Mexico', AR: 'Argentina', ZA: 'South Africa', EG: 'Egypt',
    NG: 'Nigeria', TW: 'Taiwan', TH: 'Thailand', MY: 'Malaysia',
    AT: 'Austria', SE: 'Sweden', DK: 'Denmark', NO: 'Norway',
    PL: 'Poland', CZ: 'Czech Republic', IT: 'Italy', ES: 'Spain',
    PT: 'Portugal', IE: 'Ireland', LU: 'Luxembourg', MC: 'Monaco'
};

// A handful of common aliases that show up either on the geoJSON polygons
// or in what someone might have typed into the search box -- normalized to
// whatever full name the rest of the app (and the DB) standardizes on.
const COUNTRY_NAME_OVERRIDES = {
    'usa': 'United States of America',
    'us': 'United States of America',
    'u.s.a.': 'United States of America',
    'u.s.': 'United States of America',
    'united states': 'United States of America',
    'america': 'United States of America',
    'uk': 'United Kingdom',
    'u.k.': 'United Kingdom',
    'great britain': 'United Kingdom',
    's. korea': 'South Korea',
    'republic of korea': 'South Korea',
    'uae': 'United Arab Emirates',
};

const normalizeCountryName = (name) => {
    if (!name) return name;
    const key = name.trim().toLowerCase();
    return COUNTRY_NAME_OVERRIDES[key] || name;
};

// ---------------------------------------------------------------------------
// Chart helpers shared by every chart in this file (country-picks panel,
// Asset Explorer, and the "chart all visible" grid) -- one interval list,
// one EMA implementation, one session-aware coloring pass.
// ---------------------------------------------------------------------------
const ASSET_INTERVALS = ['1m', '5m', '15m', '30m', '1H', '4H', '1D', '1W', '1M'];
const ASSET_INTRADAY_INTERVALS = new Set(['1m', '5m', '15m', '30m', '1H', '4H']);

const EMA_LINES = [
    { period: 20, color: '#f59e0b' },
    { period: 50, color: '#3b82f6' },
    { period: 200, color: '#a855f7' },
];

const addCandleSeries = (chart, options) => (
    typeof chart.addCandlestickSeries === 'function'
        ? chart.addCandlestickSeries(options)
        : chart.addSeries(CandlestickSeries, options)
);

const addLine = (chart, options) => (
    typeof chart.addLineSeries === 'function'
        ? chart.addLineSeries(options)
        : chart.addSeries(LineSeries, options)
);

// Simple client-side EMA over closing price -- good enough for a visual
// overlay in an explorer tool. Skips periods longer than the candle count
// so a 200-EMA doesn't render as a flat line on a thin 1m/5d pull.
function computeEMA(candles, period) {
    if (!candles || candles.length < period) return [];
    const k = 2 / (period + 1);
    let emaPrev = candles[0].close;
    const out = [{ time: candles[0].time, value: emaPrev }];
    for (let i = 1; i < candles.length; i++) {
        emaPrev = candles[i].close * k + emaPrev * (1 - k);
        out.push({ time: candles[i].time, value: emaPrev });
    }
    return out;
}

const formatMarketCap = (n) => {
    if (!n && n !== 0) return null;
    if (n >= 1e12) return `$${(n / 1e12).toFixed(2)}T`;
    if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
    if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`;
    return `$${n.toLocaleString()}`;
};

const hexToRgba = (hex, alpha) => {
    const h = hex.replace('#', '');
    const r = parseInt(h.substring(0, 2), 16);
    const g = parseInt(h.substring(2, 4), 16);
    const b = parseInt(h.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

// Dims pre/post-market (and anything else the backend didn't tag 'regular')
// candles instead of introducing a third color -- direction still reads at
// a glance (dim green/dim red) while extended-hours bars visually recede
// behind the regular session. Backend only attaches `session` on intraday
// pulls, so daily+ candles pass through untouched.
const buildSessionAwareCandles = (candles) => candles.map(c => {
    if (!c.session || c.session === 'regular') return c;
    const isUp = c.close >= c.open;
    const dim = isUp ? hexToRgba(COLORS.positive, 0.4) : hexToRgba(COLORS.negative, 0.4);
    return { ...c, color: dim, borderColor: dim, wickColor: dim };
});

const hasExtendedHours = (candles) => !!candles && candles.some(c => c.session && c.session !== 'regular');

// Live unrealized P&L for a TradePosition against whatever the chart's
// current last-close is (not the DB's `current_price`, which is only as
// fresh as whatever separately polls it). `dollar_per_unit` comes from the
// backend, derived from the SL/TP distance the same way the standalone
// Trade Position tracker computes it.
const computePositionPnL = (position, currentPrice) => {
    if (currentPrice == null || position.dollar_per_unit == null || position.entry_price == null) return null;
    const diff = currentPrice - position.entry_price;
    const directional = position.direction === 'short' ? -diff : diff;
    const dollars = directional * position.dollar_per_unit;
    const pct = position.entry_price ? (directional / position.entry_price) * 100 : null;
    return { dollars, pct };
};

// "Last saved" date formatting shared by the country-picks modal and the
// Asset Explorer's country/sector/last-saved grouping.
const formatLastSaved = (dateStr) => {
    if (!dateStr) return null;
    const d = new Date(dateStr + 'T00:00:00');
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
};

const LauraModalContent = ({
    isMobile,
    searchQuery,
    setSearchQuery,
    searchLoading,
    searchError,
    handleGeopoliticalSearch,
    lauraMessages,
    lauraLoading,
    messagesEndRef,
    lauraError,
    availableVoices,
    selectedVoice,
    handleVoiceChange,
    imagePreview,
    handleImageUpload,
    setSelectedImage,
    setImagePreview,
    lauraInput,
    setLauraInput,
    handleLauraQuery,
    handleNewLauraConversation,
    isSpeaking,
    speakMessage,
    stopSpeaking,
    styles,
    setShowLaura,
    fileInputRef
}) => {
    return (
        <div style={styles.lauraModal} onClick={(e) => {
            if (e.target === e.currentTarget) {
                setShowLaura(false);
            }
        }}>
            <div style={styles.lauraContent}>
                <div style={styles.lauraHeader}>
                    <h3 style={styles.lauraTitle}>
                        <span style={styles.lauraAvatar}>L</span>
                        Laura, your AI assistant
                    </h3>
                    <button
                        style={styles.lauraCloseButton}
                        onClick={() => setShowLaura(false)}
                    >
                        ×
                    </button>
                </div>

                <div style={styles.lauraMessagesContainer}>
                    {/* Web search */}
                    <div style={styles.searchContainer}>
                        <div style={styles.searchTitle}>
                            <Search size={14} /> Web search
                        </div>
                        <div style={styles.searchInputGroup}>
                            <input
                                type="text"
                                placeholder="Search news, markets, or companies..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && !searchLoading && handleGeopoliticalSearch()}
                                style={styles.searchInput}
                            />
                            <button
                                onClick={handleGeopoliticalSearch}
                                disabled={searchLoading}
                                style={styles.searchButton}
                            >
                                {searchLoading ? 'Searching...' : 'Search'}
                            </button>
                        </div>
                        {searchError && (
                            <div style={styles.lauraError}>{searchError}</div>
                        )}
                    </div>

                    {/* Chat Messages */}
                    {lauraMessages.length === 0 && (
                        <div style={{
                            textAlign: 'center',
                            padding: '40px 20px',
                            color: COLORS.inkMuted,
                            fontSize: isMobile ? '13px' : '14px'
                        }}>
                            Ask Laura about any country's stock picks you've saved,
                            <br />
                            or use the search above to look something up on the web.
                        </div>
                    )}

                    {lauraMessages.map((msg, idx) => (
                        <div key={idx} style={styles.lauraMessage(msg.role === 'user')}>
                            <div style={styles.lauraMessageBubble(msg.role === 'user')}>
                                {msg.content}
                                {msg.image && (
                                    <img src={msg.image} alt="Uploaded" style={styles.messageImage} />
                                )}
                            </div>
                            {msg.role === 'assistant' && (
                                <button
                                    style={styles.speakButton}
                                    onClick={() => isSpeaking ? stopSpeaking() : speakMessage(msg.content)}
                                >
                                    {isSpeaking ? 'Stop' : 'Play'}
                                </button>
                            )}
                        </div>
                    ))}

                    {lauraLoading && (
                        <div style={styles.lauraMessage(false)}>
                            <div style={{
                                ...styles.lauraMessageBubble(false),
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px'
                            }}>
                                <div style={styles.miniSpinner}></div>
                                Thinking...
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                <div style={styles.lauraInputContainer}>
                    {lauraError && (
                        <div style={styles.lauraError}>{lauraError}</div>
                    )}

                    <div style={styles.imageUploadContainer}>
                        <select
                            value={selectedVoice?.name || ''}
                            onChange={handleVoiceChange}
                            style={styles.voiceSelector}
                        >
                            <option value="">Voice for playback</option>
                            {availableVoices.map((voice, idx) => (
                                <option key={idx} value={voice.name}>
                                    {voice.name} ({voice.lang})
                                </option>
                            ))}
                        </select>

                        <label style={styles.imageUploadButton}>
                            Attach image
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                style={{ display: 'none' }}
                            />
                        </label>

                        {imagePreview && (
                            <div style={styles.imagePreviewContainer}>
                                <img src={imagePreview} alt="Preview" style={styles.imagePreviewThumb} />
                                <button
                                    style={styles.removeImageButton}
                                    onClick={() => {
                                        setSelectedImage(null);
                                        setImagePreview(null);
                                    }}
                                >
                                    ×
                                </button>
                            </div>
                        )}
                    </div>

                    <textarea
                        placeholder="Ask Laura anything..."
                        value={lauraInput}
                        onChange={(e) => setLauraInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                if (!lauraLoading) {
                                    handleLauraQuery();
                                }
                            }
                        }}
                        style={styles.lauraInput}
                    />
                    <div style={styles.lauraButtonContainer}>
                        <button
                            onClick={handleLauraQuery}
                            disabled={lauraLoading || (!lauraInput.trim() && !imagePreview)}
                            style={{
                                ...styles.lauraSendButton,
                                opacity: lauraLoading || (!lauraInput.trim() && !imagePreview) ? 0.5 : 1
                            }}
                        >
                            {lauraLoading ? 'Sending...' : 'Send'}
                        </button>
                        <button
                            onClick={handleNewLauraConversation}
                            style={styles.lauraNewChatButton}
                        >
                            New chat
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ---------------------------------------------------------------------------
// Asset Explorer -- cross-references the Trend Scanner's own data
// (SnowVaultTickerMeta / SnowVaultWatchlistAsset / SnowVaultScannerHistory)
// against the Global Stock Picker (SnowGlobalStockPick, the Country-Sector
// Drill picks) to surface tickers BOTH systems independently landed on --
// flagged as "cross-referenced" and organized by country (from the Global
// Picker match) > sector > last-saved. Tickers only known to the Trend
// Scanner fall into a "Trend Scanner only" bucket, grouped by sector.
//
// Chart panel: lower timeframes down to 1m, pre/post-market bars included
// and dimmed on the candles so extended hours visually recede without a
// third color, EMA20/50/200 overlay, and a fullscreen mode with a
// free-floating (no card/box) colored price readout superimposed directly
// on the chart.
//
// Self-contained on purpose: it owns all of its own state via its own hooks,
// the same way LauraModalContent above is its own component -- SnowAIEarth
// just mounts it and hands it isOpen/onClose/baseUrl.
// ---------------------------------------------------------------------------
const AssetExplorerModal = ({ isOpen, onClose, baseUrl }) => {
    const [isMobile, setIsMobile] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);

    // Search / cross-reference
    const [query, setQuery] = useState('');
    const [sectorFilter, setSectorFilter] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [crossOnly, setCrossOnly] = useState(false);
    const [sectors, setSectors] = useState([]);
    const [categories, setCategories] = useState([]);
    const [assets, setAssets] = useState([]);
    const [searching, setSearching] = useState(false);
    const [searchError, setSearchError] = useState('');
    const searchDebounceRef = useRef(null);

    // Selected asset + chart
    const [selectedAsset, setSelectedAsset] = useState(null);
    const [interval, setInterval_] = useState('1D');
    const [candles, setCandles] = useState(null);
    const [chartLoading, setChartLoading] = useState(false);
    const [chartError, setChartError] = useState('');
    const [chartLastRefreshed, setChartLastRefreshed] = useState(null);
    const [assetPositions, setAssetPositions] = useState([]);

    const chartContainerRef = useRef(null);
    const chartInstanceRef = useRef(null);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth <= 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // ------------------------------------------------------------------
    // Search / cross-reference
    // ------------------------------------------------------------------
    const runSearch = useCallback(async (q, sector, category, crossOnlyFlag) => {
        setSearching(true);
        setSearchError('');
        try {
            const response = await fetch(`${baseUrl}/api/snowvault/assets/search/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ q, sector, category, cross_only: crossOnlyFlag }),
            });
            const data = await response.json();
            if (data.success) {
                setAssets(data.assets || []);
            } else {
                setSearchError(data.error || 'Search failed.');
                setAssets([]);
            }
        } catch (error) {
            setSearchError("Couldn't reach the server.");
            setAssets([]);
        } finally {
            setSearching(false);
        }
    }, [baseUrl]);

    useEffect(() => {
        if (!isOpen) return;

        // Sectors/categories once per open
        fetch(`${baseUrl}/api/snowvault/assets/sectors/`)
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setSectors(data.sectors || []);
                    setCategories(data.categories || []);
                }
            })
            .catch(() => {});

        // Initial browsable list
        runSearch('', '', '', false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) return;
        if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
        searchDebounceRef.current = setTimeout(() => {
            runSearch(query, sectorFilter, categoryFilter, crossOnly);
        }, 350);
        return () => clearTimeout(searchDebounceRef.current);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [query, sectorFilter, categoryFilter, crossOnly]);

    // Group results: country (from the Global Picker match) > sector > list,
    // sorted by last_saved desc within each leaf. Tickers with no country
    // match (Trend Scanner only) fall into a separate sector-only bucket.
    const groupedAssets = useMemo(() => {
        const byCountry = new Map();
        const noCountryBySector = new Map();

        assets.forEach(asset => {
            const sectorKey = asset.sector || 'Other';
            if (asset.country) {
                if (!byCountry.has(asset.country)) byCountry.set(asset.country, new Map());
                const sectorMap = byCountry.get(asset.country);
                if (!sectorMap.has(sectorKey)) sectorMap.set(sectorKey, []);
                sectorMap.get(sectorKey).push(asset);
            } else {
                if (!noCountryBySector.has(sectorKey)) noCountryBySector.set(sectorKey, []);
                noCountryBySector.get(sectorKey).push(asset);
            }
        });

        const sortByLastSaved = (list) => [...list].sort((a, b) => {
            if (!a.last_saved && !b.last_saved) return a.ticker.localeCompare(b.ticker);
            if (!a.last_saved) return 1;
            if (!b.last_saved) return -1;
            return b.last_saved.localeCompare(a.last_saved);
        });

        const countryGroups = Array.from(byCountry.entries())
            .sort((a, b) => a[0].localeCompare(b[0]))
            .map(([country, sectorMap]) => ({
                country,
                flag: Array.from(sectorMap.values()).flat().find(a => a.flag)?.flag || '🌍',
                sectors: Array.from(sectorMap.entries())
                    .sort((a, b) => a[0].localeCompare(b[0]))
                    .map(([sector, list]) => ({ sector, assets: sortByLastSaved(list) })),
            }));

        const otherSectors = Array.from(noCountryBySector.entries())
            .sort((a, b) => a[0].localeCompare(b[0]))
            .map(([sector, list]) => ({ sector, assets: sortByLastSaved(list) }));

        return { countryGroups, otherSectors };
    }, [assets]);

    // ------------------------------------------------------------------
    // Chart data
    // ------------------------------------------------------------------
    const fetchChart = useCallback(async (ticker, intervalKey) => {
        setChartLoading(true);
        setChartError('');
        try {
            const response = await fetch(`${baseUrl}/api/snowvault/assets/chart-data/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ symbol: ticker, interval: intervalKey }),
            });
            const data = await response.json();
            if (data.success && Array.isArray(data.candles) && data.candles.length > 0) {
                setCandles(data.candles);
                setChartLastRefreshed(new Date());
            } else {
                setChartError(data.error || 'No chart data available.');
            }
        } catch (error) {
            setChartError("Couldn't reach the chart data endpoint.");
        } finally {
            setChartLoading(false);
        }
    }, [baseUrl]);

    // TradePosition rows for whatever ticker is selected -- entry/SL/TP +
    // live P&L superimposed on the chart. Quiet failure (no positions, or
    // the endpoint isn't wired up) just means no overlay renders.
    const fetchAssetPositions = useCallback(async (ticker) => {
        try {
            const response = await fetch(`${baseUrl}/api/snow-trade-positions/by-asset/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ asset: ticker }),
            });
            const data = await response.json();
            setAssetPositions(data.success ? (data.positions || []) : []);
        } catch (error) {
            setAssetPositions([]);
        }
    }, [baseUrl]);

    const selectAsset = (asset) => {
        setSelectedAsset(asset);
        setCandles(null);
        fetchChart(asset.ticker, interval);
        fetchAssetPositions(asset.ticker);
    };

    const changeInterval = (intervalKey) => {
        if (intervalKey === interval) return;
        setCandles(null);
        setInterval_(intervalKey);
        if (selectedAsset) fetchChart(selectedAsset.ticker, intervalKey);
    };

    // Refresh deliberately keeps the existing chart/positions on screen
    // (no clearing candles first) so it doesn't flash blank -- just the
    // refresh icon spins until the new data swaps in.
    const refreshChart = () => {
        if (!selectedAsset || chartLoading) return;
        fetchChart(selectedAsset.ticker, interval);
        fetchAssetPositions(selectedAsset.ticker);
    };

    // ------------------------------------------------------------------
    // Build / rebuild the chart whenever candles change
    // ------------------------------------------------------------------
    useEffect(() => {
        if (!candles || !chartContainerRef.current) return;

        if (chartInstanceRef.current) {
            chartInstanceRef.current.remove();
            chartInstanceRef.current = null;
        }

        const container = chartContainerRef.current;
        const isIntraday = ASSET_INTRADAY_INTERVALS.has(interval);

        const chart = createChart(container, {
            width: container.clientWidth,
            height: container.clientHeight,
            layout: { background: { color: MAP_COLORS.void }, textColor: '#cbd5e1' },
            grid: {
                vertLines: { color: 'rgba(148, 163, 184, 0.08)' },
                horzLines: { color: 'rgba(148, 163, 184, 0.08)' },
            },
            rightPriceScale: { borderColor: MAP_COLORS.border },
            timeScale: { borderColor: MAP_COLORS.border, timeVisible: isIntraday, secondsVisible: false },
        });

        const candleSeries = addCandleSeries(chart, {
            upColor: COLORS.positive,
            downColor: COLORS.negative,
            borderVisible: false,
            wickUpColor: COLORS.positive,
            wickDownColor: COLORS.negative,
        });
        candleSeries.setData(buildSessionAwareCandles(candles));

        // Superimpose EMA20/50/200 on the same price scale
        EMA_LINES.forEach(({ period, color }) => {
            const emaData = computeEMA(candles, period);
            if (emaData.length === 0) return;
            const line = addLine(chart, {
                color,
                lineWidth: 1,
                priceLineVisible: false,
                lastValueVisible: false,
                crosshairMarkerVisible: false,
            });
            line.setData(emaData);
        });

        // Superimpose entry/SL/TP for up to 3 positions on this ticker
        assetPositions.slice(0, 3).forEach((pos, idx) => {
            const isLong = pos.direction === 'long';
            const fade = idx === 0 ? 1 : 0.55;
            if (pos.entry_price != null) {
                candleSeries.createPriceLine({
                    price: pos.entry_price,
                    color: hexToRgba('#94a3b8', fade),
                    lineWidth: 1,
                    lineStyle: LineStyle.Solid,
                    axisLabelVisible: true,
                    title: `${isLong ? 'Long' : 'Short'} entry`,
                });
            }
            if (pos.sl_price != null) {
                candleSeries.createPriceLine({
                    price: pos.sl_price,
                    color: hexToRgba(COLORS.negative, fade),
                    lineWidth: 1,
                    lineStyle: LineStyle.Dashed,
                    axisLabelVisible: true,
                    title: 'SL',
                });
            }
            if (pos.tp_price != null) {
                candleSeries.createPriceLine({
                    price: pos.tp_price,
                    color: hexToRgba(COLORS.positive, fade),
                    lineWidth: 1,
                    lineStyle: LineStyle.Dashed,
                    axisLabelVisible: true,
                    title: 'TP',
                });
            }
        });

        chart.timeScale().fitContent();
        chartInstanceRef.current = chart;

        const handleResize = () => {
            chart.applyOptions({ width: container.clientWidth, height: container.clientHeight });
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            if (chartInstanceRef.current) {
                chartInstanceRef.current.remove();
                chartInstanceRef.current = null;
            }
        };
    }, [candles, interval, assetPositions]);

    // Resize the chart when fullscreen is toggled -- the container's own
    // dimensions change without a window resize event firing.
    useEffect(() => {
        if (!chartInstanceRef.current || !chartContainerRef.current) return;
        const timer = setTimeout(() => {
            const container = chartContainerRef.current;
            if (container && chartInstanceRef.current) {
                chartInstanceRef.current.applyOptions({
                    width: container.clientWidth,
                    height: container.clientHeight,
                });
            }
        }, 50);
        return () => clearTimeout(timer);
    }, [isFullscreen]);

    const handleClose = () => {
        if (chartInstanceRef.current) {
            chartInstanceRef.current.remove();
            chartInstanceRef.current = null;
        }
        setIsFullscreen(false);
        setSelectedAsset(null);
        setCandles(null);
        setChartError('');
        setAssetPositions([]);
        setChartLastRefreshed(null);
        onClose && onClose();
    };

    const lastCandle = candles && candles.length > 0 ? candles[candles.length - 1] : null;
    const prevCandle = candles && candles.length > 1 ? candles[candles.length - 2] : null;
    const changeAbs = lastCandle && prevCandle ? lastCandle.close - prevCandle.close : null;
    const changePct = changeAbs !== null && prevCandle.close ? (changeAbs / prevCandle.close) * 100 : null;
    const priceUp = changeAbs === null || changeAbs >= 0;
    const lastCandleLabel = lastCandle
        ? (typeof lastCandle.time === 'number'
            ? new Date(lastCandle.time * 1000).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
            : new Date(lastCandle.time + 'T00:00:00').toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }))
        : null;
    const showExtendedHoursNote = hasExtendedHours(candles);

    const styles = useMemo(() => ({
        modal: {
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            background: 'rgba(15, 23, 42, 0.5)', display: 'flex', justifyContent: 'center',
            alignItems: isFullscreen ? 'center' : (isMobile ? 'flex-start' : 'center'),
            zIndex: 10005, backdropFilter: 'blur(4px)', padding: isFullscreen ? 0 : (isMobile ? '4px' : '20px'),
        },
        content: {
            background: COLORS.surface, borderRadius: isFullscreen ? 0 : '14px', border: isFullscreen ? 'none' : `1px solid ${COLORS.border}`,
            boxShadow: isFullscreen ? 'none' : '0 20px 60px rgba(0,0,0,0.2)',
            width: isFullscreen ? '100%' : (isMobile ? '100%' : '1080px'),
            height: isFullscreen ? '100%' : (isMobile ? '100%' : '680px'),
            maxWidth: '100vw', maxHeight: '100vh',
            display: 'flex', flexDirection: 'column', overflow: 'hidden',
        },
        header: {
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '16px 20px', borderBottom: `1px solid ${COLORS.border}`, flexShrink: 0,
        },
        title: { fontSize: '1.05rem', fontWeight: '700', color: COLORS.ink, margin: 0 },
        closeButton: {
            background: 'none', border: 'none', color: COLORS.inkMuted, fontSize: '28px', cursor: 'pointer',
            padding: 0, width: '36px', height: '36px', borderRadius: '6px', display: 'flex',
            justifyContent: 'center', alignItems: 'center', fontWeight: '300',
        },
        layout: { display: 'flex', flexDirection: isMobile ? 'column' : 'row', flex: 1, overflow: 'hidden' },

        // Search / results rail
        rail: {
            width: isMobile ? '100%' : '360px', flexShrink: 0, display: 'flex', flexDirection: 'column',
            borderRight: isMobile ? 'none' : `1px solid ${COLORS.border}`,
            borderBottom: isMobile ? `1px solid ${COLORS.border}` : 'none',
            height: isMobile ? (selectedAsset ? '240px' : '100%') : '100%',
            background: COLORS.surface,
        },
        searchBox: { padding: '12px 14px', borderBottom: `1px solid ${COLORS.border}` },
        searchInputWrap: {
            display: 'flex', alignItems: 'center', gap: '8px', background: COLORS.bg,
            border: `1px solid ${COLORS.border}`, borderRadius: '8px', padding: '9px 12px', marginBottom: '8px',
        },
        searchInput: { flex: 1, border: 'none', background: 'transparent', outline: 'none', fontSize: '13px', color: COLORS.ink },
        filterRow: { display: 'flex', gap: '6px', marginBottom: '8px' },
        filterSelect: {
            flex: 1, padding: '6px 8px', borderRadius: '6px', border: `1px solid ${COLORS.border}`,
            background: COLORS.surface, color: COLORS.inkMuted, fontSize: '11px', outline: 'none',
        },
        crossOnlyRow: {
            display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: COLORS.inkMuted,
            cursor: 'pointer', userSelect: 'none',
        },
        resultsList: { flex: 1, overflowY: 'auto', padding: '8px' },
        groupHeader: {
            display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: '700',
            color: COLORS.ink, textTransform: 'uppercase', letterSpacing: '0.4px',
            margin: '14px 6px 4px 6px', paddingTop: '6px', borderTop: `1px solid ${COLORS.border}`,
        },
        subGroupHeader: {
            fontSize: '10px', fontWeight: '700', color: COLORS.inkFaint, textTransform: 'uppercase',
            letterSpacing: '0.4px', margin: '8px 6px 2px 6px',
        },
        resultCard: {
            padding: '10px 12px', borderRadius: '8px', border: `1px solid transparent`, cursor: 'pointer', marginBottom: '4px',
        },
        resultCardActive: { background: COLORS.accentSoft, border: `1px solid ${COLORS.accentBorder}` },
        resultCardCross: { borderLeft: `3px solid #7c3aed` },
        resultHeaderRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' },
        resultTicker: { fontFamily: COLORS.mono, fontWeight: '700', fontSize: '13px', color: COLORS.ink },
        resultName: { fontSize: '11px', color: COLORS.inkMuted, marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
        resultMetaRow: { display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px', flexWrap: 'wrap' },
        resultChip: {
            fontSize: '10px', color: COLORS.inkMuted, background: COLORS.neutralSoft,
            border: `1px solid ${COLORS.neutralBorder}`, borderRadius: '999px', padding: '2px 8px',
        },
        crossBadge: {
            fontSize: '10px', color: '#7c3aed', background: 'rgba(124, 58, 237, 0.1)',
            border: '1px solid rgba(124, 58, 237, 0.3)', borderRadius: '999px', padding: '2px 8px', fontWeight: '700',
        },
        signalBadge: { padding: '2px 8px', borderRadius: '999px', fontSize: '10px', fontWeight: '700' },
        emptyRail: { textAlign: 'center', padding: '40px 16px', color: COLORS.inkFaint, fontSize: '12px' },

        // Detail / chart pane
        detailPane: { flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 },
        detailHeader: {
            display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px',
            padding: '14px 18px', borderBottom: `1px solid ${COLORS.border}`, flexShrink: 0,
        },
        detailTitleRow: { display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' },
        detailTicker: { fontFamily: COLORS.mono, fontSize: '1.2rem', fontWeight: '700', color: COLORS.ink, margin: 0 },
        detailSubtitle: { fontSize: '12px', color: COLORS.inkMuted, marginTop: '3px' },
        fullscreenButton: {
            display: 'flex', alignItems: 'center', gap: '5px', padding: '7px 12px', borderRadius: '8px',
            border: `1px solid ${COLORS.border}`, background: COLORS.surface, color: COLORS.inkMuted,
            fontSize: '11px', fontWeight: '600', cursor: 'pointer', flexShrink: 0,
        },
        refreshButton: {
            display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px',
            borderRadius: '8px', border: `1px solid ${COLORS.border}`, background: COLORS.surface,
            color: COLORS.inkMuted, cursor: 'pointer', flexShrink: 0,
        },
        refreshSpinning: { animation: 'chartRefreshSpin 0.9s linear infinite' },
        intervalRow: {
            display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 18px',
            borderBottom: `1px solid ${COLORS.border}`, flexShrink: 0,
            overflowX: 'auto', WebkitOverflowScrolling: 'touch', flexWrap: isMobile ? 'nowrap' : 'wrap',
        },
        intervalButton: {
            padding: '5px 11px', borderRadius: '999px', border: `1px solid ${COLORS.neutralBorder}`, background: COLORS.neutralSoft,
            color: COLORS.inkMuted, fontSize: '11px', fontWeight: '700', cursor: 'pointer', flexShrink: 0, whiteSpace: 'nowrap',
        },
        intervalButtonActive: { background: COLORS.accent, borderColor: COLORS.accent, color: '#fff' },
        extendedHoursNote: { fontSize: '10px', color: COLORS.inkFaint, padding: '0 18px 8px', flexShrink: 0 },
        chartWrap: { flex: 1, position: 'relative', background: MAP_COLORS.void, minHeight: isMobile ? '380px' : '260px' },
        chartCanvas: { width: '100%', height: '100%' },

        // Superimposed price/change readout -- lives directly on the chart,
        // no card/border/blur, colored by direction, text-shadow for
        // legibility against whatever's under it.
        hud: {
            position: 'absolute', top: '10px', left: '14px', zIndex: 5, pointerEvents: 'none',
            maxWidth: isMobile ? '55%' : '320px', textShadow: '0 1px 4px rgba(0,0,0,0.85)',
        },
        hudRow: { display: 'flex', alignItems: 'baseline', gap: '8px', flexWrap: 'wrap' },
        hudPrice: (up) => ({ fontFamily: COLORS.mono, fontSize: '19px', fontWeight: '700', color: up ? '#4ade80' : '#f87171' }),
        hudChange: (up) => ({ fontFamily: COLORS.mono, fontSize: '12px', fontWeight: '700', color: up ? '#4ade80' : '#f87171' }),
        hudMeta: { fontSize: '10px', color: '#cbd5e1', marginTop: '3px' },
        hudBadgeRow: { display: 'flex', gap: '5px', marginTop: '6px', flexWrap: 'wrap', pointerEvents: 'auto' },

        // Superimposed position (entry/SL/TP/live P&L) readout -- top-right,
        // same free-floating no-box treatment as the price HUD.
        positionHud: {
            position: 'absolute', top: '10px', right: '14px', zIndex: 5, pointerEvents: 'none',
            maxWidth: isMobile ? '42%' : '260px', textShadow: '0 1px 4px rgba(0,0,0,0.85)',
            display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'flex-end',
        },
        positionHudRow: { display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', justifyContent: 'flex-end' },
        positionDirectionBadge: (isLong) => ({
            fontSize: '9px', fontWeight: '800', letterSpacing: '0.4px', padding: '1px 6px', borderRadius: '4px',
            background: isLong ? 'rgba(74, 222, 128, 0.18)' : 'rgba(248, 113, 113, 0.18)',
            color: isLong ? '#4ade80' : '#f87171',
        }),
        positionHudEntry: { fontFamily: COLORS.mono, fontSize: '10px', color: '#e2e8f0' },
        positionHudPnl: (up) => ({ fontFamily: COLORS.mono, fontSize: '11px', fontWeight: '700', color: up ? '#4ade80' : '#f87171' }),
        positionHudMore: { fontSize: '9px', color: '#94a3b8' },

        emptyDetail: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: COLORS.inkFaint, gap: '10px' },
        loadingWrap: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' },
        spinner: {
            width: '32px', height: '32px', border: `3px solid ${MAP_COLORS.border}`, borderTop: `3px solid ${COLORS.accent}`,
            borderRadius: '50%', animation: 'assetExplorerSpin 1s linear infinite',
        },
    }), [isMobile, isFullscreen, selectedAsset]);

    if (!isOpen) return null;

    const renderAssetCard = (asset) => {
        const active = selectedAsset?.ticker === asset.ticker;
        const signalLabel = asset.latest_scan?.ai_verdict || asset.latest_scan?.signal || asset.latest_scan?.direction;
        return (
            <div
                key={asset.ticker}
                style={{
                    ...styles.resultCard,
                    ...(active ? styles.resultCardActive : {}),
                    ...(asset.cross_referenced ? styles.resultCardCross : {}),
                }}
                onClick={() => selectAsset(asset)}
            >
                <div style={styles.resultHeaderRow}>
                    <div>
                        <span style={styles.resultTicker}>{asset.ticker}</span>
                        {asset.in_watchlist && <Star size={11} style={{ marginLeft: '6px' }} fill={COLORS.accent} color={COLORS.accent} />}
                    </div>
                    {typeof asset.latest_scan?.score === 'number' && (
                        <span style={{ fontSize: '11px', color: COLORS.inkMuted, fontFamily: COLORS.mono }}>
                            {asset.latest_scan.score.toFixed(1)}
                        </span>
                    )}
                </div>
                {asset.name && asset.name !== asset.ticker && (
                    <div style={styles.resultName}>{asset.name}</div>
                )}
                <div style={styles.resultMetaRow}>
                    {asset.cross_referenced && <span style={styles.crossBadge}>🔗 In both</span>}
                    {asset.category && <span style={styles.resultChip}>{asset.category}</span>}
                    {signalLabel && (
                        <span style={{ ...styles.signalBadge, ...getRecStyle(signalLabel) }}>{signalLabel}</span>
                    )}
                    {asset.last_saved && <span style={styles.resultChip}>Saved {formatLastSaved(asset.last_saved)}</span>}
                </div>
            </div>
        );
    };

    return (
        <div style={styles.modal} onClick={(e) => { if (e.target === e.currentTarget && !isFullscreen) handleClose(); }}>
            <div style={styles.content}>
                <div style={styles.header}>
                    <h3 style={styles.title}>Asset explorer</h3>
                    <button style={styles.closeButton} onClick={handleClose}>×</button>
                </div>

                <div style={styles.layout}>
                    {/* Search + cross-reference rail */}
                    <div style={styles.rail}>
                        <div style={styles.searchBox}>
                            <div style={styles.searchInputWrap}>
                                <Search size={14} color={COLORS.inkFaint} />
                                <input
                                    type="text"
                                    placeholder="Search ticker, name, sector, or country..."
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    style={styles.searchInput}
                                />
                            </div>
                            <div style={styles.filterRow}>
                                <select
                                    value={sectorFilter}
                                    onChange={(e) => setSectorFilter(e.target.value)}
                                    style={styles.filterSelect}
                                >
                                    <option value="">All sectors</option>
                                    {sectors.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                                <select
                                    value={categoryFilter}
                                    onChange={(e) => setCategoryFilter(e.target.value)}
                                    style={styles.filterSelect}
                                >
                                    <option value="">All categories</option>
                                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <label style={styles.crossOnlyRow}>
                                <input
                                    type="checkbox"
                                    checked={crossOnly}
                                    onChange={(e) => setCrossOnly(e.target.checked)}
                                />
                                🔗 Opportunities only (saved in both Trend Scanner &amp; Global Picker)
                            </label>
                        </div>

                        <div style={styles.resultsList}>
                            {searching && assets.length === 0 && (
                                <div style={styles.emptyRail}>Searching...</div>
                            )}
                            {searchError && (
                                <div style={{ ...styles.emptyRail, color: COLORS.negative }}>{searchError}</div>
                            )}
                            {!searching && !searchError && assets.length === 0 && (
                                <div style={styles.emptyRail}>
                                    No assets match yet. Try a different ticker, name, sector, or country.
                                </div>
                            )}

                            {groupedAssets.countryGroups.map(group => (
                                <div key={group.country}>
                                    <div style={styles.groupHeader}>
                                        <span>{group.flag}</span>
                                        <span>{group.country}</span>
                                    </div>
                                    {group.sectors.map(sub => (
                                        <div key={sub.sector}>
                                            <div style={styles.subGroupHeader}>{sub.sector}</div>
                                            {sub.assets.map(renderAssetCard)}
                                        </div>
                                    ))}
                                </div>
                            ))}

                            {groupedAssets.otherSectors.length > 0 && (
                                <div>
                                    <div style={styles.groupHeader}>
                                        <Layers size={12} />
                                        <span>Trend Scanner only</span>
                                    </div>
                                    {groupedAssets.otherSectors.map(sub => (
                                        <div key={sub.sector}>
                                            <div style={styles.subGroupHeader}>{sub.sector}</div>
                                            {sub.assets.map(renderAssetCard)}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Chart / detail pane */}
                    <div style={styles.detailPane}>
                        {!selectedAsset && (
                            <div style={styles.emptyDetail}>
                                <BarChart3 size={32} color={COLORS.inkFaint} />
                                <div>Pick an asset on the left to chart it.</div>
                            </div>
                        )}

                        {selectedAsset && (
                            <>
                                <div style={styles.detailHeader}>
                                    <div>
                                        <div style={styles.detailTitleRow}>
                                            <h4 style={styles.detailTicker}>{selectedAsset.ticker}</h4>
                                            {selectedAsset.in_watchlist && <Star size={14} fill={COLORS.accent} color={COLORS.accent} />}
                                            {selectedAsset.cross_referenced && <span style={styles.crossBadge}>🔗 In both</span>}
                                        </div>
                                        <div style={styles.detailSubtitle}>
                                            {selectedAsset.name}
                                            {selectedAsset.country && <> · {selectedAsset.flag} {selectedAsset.country}</>}
                                            {selectedAsset.sector && <> · {selectedAsset.sector}</>}
                                            {formatMarketCap(selectedAsset.market_cap) && <> · Mkt cap {formatMarketCap(selectedAsset.market_cap)}</>}
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <button
                                            style={styles.refreshButton}
                                            onClick={refreshChart}
                                            disabled={chartLoading}
                                            title={chartLastRefreshed ? `Last refreshed ${chartLastRefreshed.toLocaleTimeString()}` : 'Refresh'}
                                        >
                                            <RefreshCw size={13} style={chartLoading ? styles.refreshSpinning : undefined} />
                                        </button>
                                        <button style={styles.fullscreenButton} onClick={() => setIsFullscreen(f => !f)}>
                                            {isFullscreen ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
                                            {isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
                                        </button>
                                    </div>
                                </div>

                                <div style={styles.intervalRow}>
                                    <Layers size={13} color={COLORS.inkMuted} style={{ flexShrink: 0 }} />
                                    {ASSET_INTERVALS.map(tf => (
                                        <button
                                            key={tf}
                                            style={{ ...styles.intervalButton, ...(tf === interval ? styles.intervalButtonActive : {}) }}
                                            onClick={() => changeInterval(tf)}
                                        >
                                            {tf}
                                        </button>
                                    ))}
                                </div>

                                {showExtendedHoursNote && (
                                    <div style={styles.extendedHoursNote}>Dimmed candles = pre/post-market</div>
                                )}

                                <div style={styles.chartWrap}>
                                    {chartLoading && !candles && (
                                        <div style={styles.loadingWrap}>
                                            <div style={styles.spinner}></div>
                                        </div>
                                    )}
                                    {!chartLoading && chartError && !candles && (
                                        <div style={styles.emptyDetail}>
                                            <AlertTriangle size={28} color={COLORS.caution} />
                                            <div style={{ color: '#cbd5e1', fontSize: '13px', textAlign: 'center', padding: '0 20px' }}>{chartError}</div>
                                        </div>
                                    )}
                                    {candles && (
                                        <>
                                            {/* Superimposed asset data -- directly on the chart, color-coded, no box */}
                                            <div style={styles.hud}>
                                                <div style={styles.hudRow}>
                                                    {lastCandle && <span style={styles.hudPrice(priceUp)}>{lastCandle.close.toFixed(2)}</span>}
                                                    {changeAbs !== null && (
                                                        <span style={styles.hudChange(priceUp)}>
                                                            {priceUp ? <TrendingUp size={11} style={{ verticalAlign: 'middle' }} /> : <TrendingDown size={11} style={{ verticalAlign: 'middle' }} />}
                                                            {' '}{priceUp ? '+' : ''}{changeAbs.toFixed(2)} ({changePct.toFixed(2)}%)
                                                        </span>
                                                    )}
                                                </div>
                                                {lastCandleLabel && <div style={styles.hudMeta}>As of {lastCandleLabel} · {interval}</div>}
                                                {selectedAsset.latest_scan && (
                                                    <div style={styles.hudBadgeRow}>
                                                        {selectedAsset.latest_scan.ai_verdict && (
                                                            <span style={{ ...styles.signalBadge, ...getRecStyle(selectedAsset.latest_scan.ai_verdict) }}>
                                                                {selectedAsset.latest_scan.ai_verdict}
                                                            </span>
                                                        )}
                                                        {typeof selectedAsset.latest_scan.ai_opportunity_score === 'number' && (
                                                            <span style={styles.resultChip}>AI score {selectedAsset.latest_scan.ai_opportunity_score}</span>
                                                        )}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Superimposed position details -- entry/SL/TP/live P&L for any
                                                TradePosition rows saved against this ticker */}
                                            {assetPositions.length > 0 && (
                                                <div style={styles.positionHud}>
                                                    {assetPositions.slice(0, 3).map(pos => {
                                                        const pnl = computePositionPnL(pos, lastCandle?.close);
                                                        const isLong = pos.direction === 'long';
                                                        return (
                                                            <div key={pos.id} style={styles.positionHudRow}>
                                                                <span style={styles.positionDirectionBadge(isLong)}>{isLong ? 'LONG' : 'SHORT'}</span>
                                                                <span style={styles.positionHudEntry}>Entry {pos.entry_price}</span>
                                                                {pnl && pnl.dollars != null && (
                                                                    <span style={styles.positionHudPnl(pnl.dollars >= 0)}>
                                                                        {pnl.dollars >= 0 ? '+' : ''}{pnl.dollars.toFixed(2)}
                                                                        {pnl.pct != null && <> ({pnl.pct >= 0 ? '+' : ''}{pnl.pct.toFixed(2)}%)</>}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                                    {assetPositions.length > 3 && (
                                                        <div style={styles.positionHudMore}>+{assetPositions.length - 3} more position{assetPositions.length - 3 !== 1 ? 's' : ''}</div>
                                                    )}
                                                </div>
                                            )}

                                            <div ref={chartContainerRef} style={styles.chartCanvas}></div>
                                        </>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes assetExplorerSpin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default function SnowAIEarth() {
    const baseUrl = 'https://backend-production-c0ab.up.railway.app';
    const [view3D, setView3D] = useState(true);
    const [selectedCountry, setSelectedCountry] = useState('');
    const [countries, setCountries] = useState([]);
    const [worldData, setWorldData] = useState({ features: [] });
    const [globeTheme, setGlobeTheme] = useState('night');
    const [isMobile, setIsMobile] = useState(false);
    const [geoJsonData, setGeoJsonData] = useState(null);
    const svgRef = useRef();
    const globeRef = useRef();
    const mapContainerRef = useRef();
    const zoomRef = useRef();
    const [searchCountry, setSearchCountry] = useState('');
    const [autoRotate, setAutoRotate] = useState(true);
    const [showMediaCenter, setShowMediaCenter] = useState(false);
    const [showAssetExplorer, setShowAssetExplorer] = useState(false);
    const [videoUrl, setVideoUrl] = useState('');
    const [isVideoPlaying, setIsVideoPlaying] = useState(false);
    const [showLaura, setShowLaura] = useState(false);
    const [lauraMessages, setLauraMessages] = useState([]);
    const [lauraInput, setLauraInput] = useState('');
    const [lauraLoading, setLauraLoading] = useState(false);
    const [lauraError, setLauraError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [searchLoading, setSearchLoading] = useState(false);
    const [searchError, setSearchError] = useState('');
    const [OPENAI_API_KEY, setOPENAI_API_KEY] = useState("");
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [availableVoices, setAvailableVoices] = useState([]);
    const [selectedVoice, setSelectedVoice] = useState(null);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);

    // Stock-pick data (replaces the old "economic analysis" state)
    const [countryStockData, setCountryStockData] = useState({});
    const [loadingStockData, setLoadingStockData] = useState(false);
    const [showStockModal, setShowStockModal] = useState(false);
    const [dataSummary, setDataSummary] = useState({ totalCountries: 0, totalPicks: 0 });
    const [availableCountriesSet, setAvailableCountriesSet] = useState(new Set());
    const [savedCountriesList, setSavedCountriesList] = useState([]);

    // Date / sector browsing within the stock modal
    const [selectedDateKey, setSelectedDateKey] = useState(null);
    const [selectedSector, setSelectedSector] = useState('All');
    const [countryRailSearch, setCountryRailSearch] = useState('');
    const [stockSearchQuery, setStockSearchQuery] = useState('');

    // Lightweight-charts panel for an individual stock
    const [chartStock, setChartStock] = useState(null); // { symbol, name, country } | null
    const [chartData, setChartData] = useState(null);
    const [chartLoading, setChartLoading] = useState(false);
    const [chartError, setChartError] = useState('');
    const [chartTimeframe, setChartTimeframe] = useState('1D');
    const [chartFullscreen, setChartFullscreen] = useState(false);
    const [chartPositions, setChartPositions] = useState([]);
    const [chartLastRefreshed, setChartLastRefreshed] = useState(null);
    const chartContainerRef = useRef(null);
    const chartInstanceRef = useRef(null);

    // "Chart all visible" grid for the currently filtered stock list
    const [showMultiChart, setShowMultiChart] = useState(false);
    const [multiChartInterval, setMultiChartInterval] = useState('1D');
    const [multiChartData, setMultiChartData] = useState({});   // symbol -> candles[] | 'error'
    const [multiChartLoading, setMultiChartLoading] = useState(false);
    const [multiChartError, setMultiChartError] = useState('');
    const multiChartContainerRefs = useRef({});
    const multiChartInstanceRefs = useRef({});

    const globeThemes = {
        'night': {
            name: 'Night',
            globeImage: "//unpkg.com/three-globe/example/img/earth-night.jpg",
            bumpImage: "//unpkg.com/three-globe/example/img/earth-topology.png",
            background: "//unpkg.com/three-globe/example/img/night-sky.png"
        },
        'satellite': {
            name: 'Satellite',
            globeImage: "//unpkg.com/three-globe/example/img/earth-blue-marble.jpg",
            bumpImage: "//unpkg.com/three-globe/example/img/earth-topology.png",
            background: "//unpkg.com/three-globe/example/img/night-sky.png"
        },
        'day': {
            name: 'Day',
            globeImage: "//unpkg.com/three-globe/example/img/earth-day.jpg",
            bumpImage: "//unpkg.com/three-globe/example/img/earth-topology.png",
            background: "//unpkg.com/three-globe/example/img/night-sky.png"
        }
    };

    const countryData = [
        { name: 'Washington D.C.', lat: 38.9072, lng: -77.0369, iso: 'US', type: 'Political' },
        { name: 'New York', lat: 40.7128, lng: -74.0060, iso: 'US', type: 'Financial' },
        { name: 'San Francisco', lat: 37.7749, lng: -122.4194, iso: 'US', type: 'Tech' },
        { name: 'Los Angeles', lat: 34.0522, lng: -118.2437, iso: 'US', type: 'Economic' },
        { name: 'Chicago', lat: 41.8781, lng: -87.6298, iso: 'US', type: 'Financial' },

        { name: 'Beijing', lat: 39.9042, lng: 116.4074, iso: 'CN', type: 'Political' },
        { name: 'Shanghai', lat: 31.2304, lng: 121.4737, iso: 'CN', type: 'Financial' },
        { name: 'Shenzhen', lat: 22.5431, lng: 114.0579, iso: 'CN', type: 'Tech' },
        { name: 'Hong Kong', lat: 22.3193, lng: 114.1694, iso: 'CN', type: 'Financial' },

        { name: 'London', lat: 51.5074, lng: -0.1278, iso: 'GB', type: 'Financial' },
        { name: 'Frankfurt', lat: 50.1109, lng: 8.6821, iso: 'DE', type: 'Financial' },
        { name: 'Paris', lat: 48.8566, lng: 2.3522, iso: 'FR', type: 'Economic' },
        { name: 'Brussels', lat: 50.8503, lng: 4.3517, iso: 'BE', type: 'Political' },
        { name: 'Geneva', lat: 46.2044, lng: 6.1432, iso: 'CH', type: 'Financial' },
        { name: 'Zurich', lat: 47.3769, lng: 8.5417, iso: 'CH', type: 'Financial' },
        { name: 'Berlin', lat: 52.5200, lng: 13.4050, iso: 'DE', type: 'Political' },
        { name: 'Amsterdam', lat: 52.3676, lng: 4.9041, iso: 'NL', type: 'Financial' },

        { name: 'Tokyo', lat: 35.6762, lng: 139.6503, iso: 'JP', type: 'Financial' },
        { name: 'Singapore', lat: 1.3521, lng: 103.8198, iso: 'SG', type: 'Financial' },
        { name: 'Seoul', lat: 37.5665, lng: 126.9780, iso: 'KR', type: 'Tech' },
        { name: 'Mumbai', lat: 19.0760, lng: 72.8777, iso: 'IN', type: 'Financial' },
        { name: 'New Delhi', lat: 28.6139, lng: 77.2090, iso: 'IN', type: 'Political' },
        { name: 'Sydney', lat: -33.8688, lng: 151.2093, iso: 'AU', type: 'Financial' },
        { name: 'Dubai', lat: 25.2048, lng: 55.2708, iso: 'AE', type: 'Financial' },

        { name: 'Moscow', lat: 55.7558, lng: 37.6173, iso: 'RU', type: 'Political' },
        { name: 'St. Petersburg', lat: 59.9343, lng: 30.3351, iso: 'RU', type: 'Economic' },

        { name: 'Tel Aviv', lat: 32.0853, lng: 34.7818, iso: 'IL', type: 'Tech' },
        { name: 'Riyadh', lat: 24.7136, lng: 46.6753, iso: 'SA', type: 'Political' },
        { name: 'Istanbul', lat: 41.0082, lng: 28.9784, iso: 'TR', type: 'Economic' },

        { name: 'Toronto', lat: 43.6532, lng: -79.3832, iso: 'CA', type: 'Financial' },
        { name: 'São Paulo', lat: -23.5505, lng: -46.6333, iso: 'BR', type: 'Financial' },
        { name: 'Mexico City', lat: 19.4326, lng: -99.1332, iso: 'MX', type: 'Political' },
        { name: 'Buenos Aires', lat: -34.6037, lng: -58.3816, iso: 'AR', type: 'Economic' },

        { name: 'Johannesburg', lat: -26.2041, lng: 28.0473, iso: 'ZA', type: 'Financial' },
        { name: 'Cairo', lat: 30.0444, lng: 31.2357, iso: 'EG', type: 'Political' },
        { name: 'Lagos', lat: 6.5244, lng: 3.3792, iso: 'NG', type: 'Economic' },

        { name: 'Vancouver', lat: 49.2827, lng: -123.1207, iso: 'CA', type: 'Economic' },
        { name: 'Miami', lat: 25.7617, lng: -80.1918, iso: 'US', type: 'Financial' },
        { name: 'Boston', lat: 42.3601, lng: -71.0589, iso: 'US', type: 'Tech' },
        { name: 'Seattle', lat: 47.6062, lng: -122.3321, iso: 'US', type: 'Tech' },
        { name: 'Austin', lat: 30.2672, lng: -97.7431, iso: 'US', type: 'Tech' },
        { name: 'Taipei', lat: 25.0330, lng: 121.5654, iso: 'TW', type: 'Tech' },
        { name: 'Bangkok', lat: 13.7563, lng: 100.5018, iso: 'TH', type: 'Economic' },
        { name: 'Kuala Lumpur', lat: 3.1390, lng: 101.6869, iso: 'MY', type: 'Economic' },
        { name: 'Vienna', lat: 48.2082, lng: 16.3738, iso: 'AT', type: 'Political' },
        { name: 'Stockholm', lat: 59.3293, lng: 18.0686, iso: 'SE', type: 'Tech' },
        { name: 'Copenhagen', lat: 55.6761, lng: 12.5683, iso: 'DK', type: 'Economic' },
        { name: 'Oslo', lat: 59.9139, lng: 10.7522, iso: 'NO', type: 'Economic' },
        { name: 'Warsaw', lat: 52.2297, lng: 21.0122, iso: 'PL', type: 'Political' },
        { name: 'Prague', lat: 50.0755, lng: 14.4378, iso: 'CZ', type: 'Economic' },
        { name: 'Milan', lat: 45.4642, lng: 9.1900, iso: 'IT', type: 'Financial' },
        { name: 'Madrid', lat: 40.4168, lng: -3.7038, iso: 'ES', type: 'Political' },
        { name: 'Lisbon', lat: 38.7223, lng: -9.1393, iso: 'PT', type: 'Economic' },
        { name: 'Dublin', lat: 53.3498, lng: -6.2603, iso: 'IE', type: 'Tech' },
        { name: 'Luxembourg', lat: 49.6116, lng: 6.1319, iso: 'LU', type: 'Financial' },
        { name: 'Monaco', lat: 43.7384, lng: 7.4246, iso: 'MC', type: 'Financial' }
    ].map(c => ({ ...c, name: c.name, color: COLORS.accent }));

    useEffect(() => {
        setCountries(countryData);

        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        fetch(geoUrl)
            .then(res => res.json())
            .then(data => {
                setGeoJsonData(data);
                setWorldData(data);
            })
            .catch(err => {
                console.error('Error loading world data:', err);
                setWorldData({ features: [] });
                setGeoJsonData({ features: [] });
            });

        fetchDataFromAPI();
        fetchCountriesSummary();

        const loadVoices = () => {
            const voices = window.speechSynthesis.getVoices();
            setAvailableVoices(voices);

            const savedVoiceName = localStorage.getItem('lauraVoice');
            if (savedVoiceName) {
                const savedVoice = voices.find(v => v.name === savedVoiceName);
                if (savedVoice) setSelectedVoice(savedVoice);
            } else if (voices.length > 0) {
                setSelectedVoice(voices[0]);
            }
        };

        loadVoices();
        if (speechSynthesis.onvoiceschanged !== undefined) {
            speechSynthesis.onvoiceschanged = loadVoices;
        }

        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const fetchDataFromAPI = async () => {
        try {
            const response = await fetch(`${baseUrl}/get_openai_key`);
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const { OPENAI_API_KEY } = await response.json();
            setOPENAI_API_KEY(OPENAI_API_KEY);
        } catch (error) {
            console.error("Error fetching OpenAI key:", error);
        }
    };

    const fetchCountriesSummary = async () => {
        try {
            const response = await fetch(`${baseUrl}/api/snow-global-stock-picks/countries-summary/`);
            const data = await response.json();
            if (data.success) {
                setDataSummary({
                    totalCountries: data.countries.length,
                    totalPicks: data.countries.reduce((sum, c) => sum + (c.total_picks || 0), 0)
                });
                setAvailableCountriesSet(new Set(data.countries.map(c => c.country.toLowerCase())));
                setSavedCountriesList(
                    [...data.countries].sort((a, b) => a.country.localeCompare(b.country))
                );
            }
        } catch (error) {
            console.error('Error fetching countries summary:', error);
        }
    };

    // Loose match: "Japan" should register as having data even if the map's
    // resolved name and the DB's saved name differ slightly.
    const countryHasData = useCallback((name) => {
        if (!name) return false;
        const lower = normalizeCountryName(name).toLowerCase();
        if (availableCountriesSet.has(lower)) return true;
        for (const c of availableCountriesSet) {
            if (lower.includes(c) || c.includes(lower)) return true;
        }
        return false;
    }, [availableCountriesSet]);

    const resolveCountryName = (point) => normalizeCountryName(isoToCountryName[point.iso] || point.name);

    const handleCountrySearch = () => {
        if (!searchCountry.trim() || !globeRef.current) return;

        let targetCountry = countryData.find(country =>
            country.name.toLowerCase().includes(searchCountry.toLowerCase())
        );

        if (targetCountry) {
            globeRef.current.pointOfView({
                lat: targetCountry.lat,
                lng: targetCountry.lng,
                altitude: 2.5
            }, 2000);

            setSelectedCountry(resolveCountryName(targetCountry));
            setSearchCountry('');
            return;
        }

        const foundFeature = worldData.features?.find(feature => {
            const countryName = feature.properties?.NAME || feature.properties?.name || '';
            return countryName.toLowerCase().includes(searchCountry.toLowerCase());
        });

        if (foundFeature && foundFeature.properties) {
            const coords = foundFeature.geometry.coordinates;
            let lat = 0, lng = 0;

            if (foundFeature.geometry.type === 'Polygon') {
                const coordArray = coords[0];
                coordArray.forEach(coord => {
                    lng += coord[0];
                    lat += coord[1];
                });
                lng /= coordArray.length;
                lat /= coordArray.length;
            } else if (foundFeature.geometry.type === 'MultiPolygon') {
                let totalPoints = 0;
                coords.forEach(polygon => {
                    polygon[0].forEach(coord => {
                        lng += coord[0];
                        lat += coord[1];
                        totalPoints++;
                    });
                });
                lng /= totalPoints;
                lat /= totalPoints;
            }

            globeRef.current.pointOfView({ lat, lng, altitude: 2.5 }, 2000);

            const countryName = foundFeature.properties.NAME || foundFeature.properties.name;
            setSelectedCountry(normalizeCountryName(countryName));
            setSearchCountry('');
        } else {
            alert(`Couldn't find "${searchCountry}" on the map. Try a different spelling.`);
        }
    };

    const drawD3Map = useCallback(() => {
        if (!geoJsonData || !geoJsonData.features || !svgRef.current || !mapContainerRef.current) {
            return;
        }

        const svg = d3.select(svgRef.current);
        const existingContent = svg.selectAll("g").size();

        // Only build the map once -- selection/highlight updates happen in a
        // separate effect below so we never have to tear this down and
        // rebuild it (that rebuild was what made the 2D map "disappear").
        if (existingContent > 0) {
            return;
        }

        svg.selectAll("*").remove();

        const container = mapContainerRef.current;
        const width = container.clientWidth;
        const height = container.clientHeight;

        if (width <= 0 || height <= 0) {
            return;
        }

        svg.attr("width", width).attr("height", height);

        const projection = d3.geoNaturalEarth1()
            .scale(isMobile ? width / 9 : width / 10)
            .translate([width / 2, height / 2]);

        const path = d3.geoPath().projection(projection);

        const zoom = d3.zoom()
            .scaleExtent([0.5, 8])
            .on("zoom", (event) => {
                g.attr("transform", event.transform);
            });

        zoomRef.current = zoom;
        svg.call(zoom);

        const g = svg.append("g");

        g.append("g")
            .selectAll("path")
            .data(geoJsonData.features)
            .enter()
            .append("path")
            .attr("d", path)
            .attr("class", "country-path")
            .attr("fill", MAP_COLORS.land)
            .attr("stroke", MAP_COLORS.border)
            .attr("stroke-width", 0.6)
            .style("cursor", "pointer")
            .on("mouseover", function () {
                d3.select(this).attr("stroke-width", 1.4).attr("stroke", MAP_COLORS.borderHover);
            })
            .on("mouseout", function (event, d) {
                const countryName = normalizeCountryName(d.properties?.NAME || d.properties?.name);
                d3.select(this)
                    .attr("stroke-width", 0.6)
                    .attr("stroke", countryName === selectedCountry ? MAP_COLORS.borderSelected : MAP_COLORS.border);
            })
            .on("click", function (event, d) {
                event.stopPropagation();
                const countryName = normalizeCountryName(d.properties?.NAME || d.properties?.name || 'Unknown Country');
                handleCountryClick(countryName);
            });

        g.append("g")
            .selectAll("circle")
            .data(countries)
            .enter()
            .append("circle")
            .attr("cx", d => {
                const coords = projection([d.lng, d.lat]);
                return coords ? coords[0] : 0;
            })
            .attr("cy", d => {
                const coords = projection([d.lng, d.lat]);
                return coords ? coords[1] : 0;
            })
            .attr("r", isMobile ? 3 : 4)
            .attr("fill", MAP_COLORS.point)
            .attr("stroke", MAP_COLORS.pointStroke)
            .attr("stroke-width", 1.5)
            .style("cursor", "pointer")
            .style("filter", "drop-shadow(0 1px 3px rgba(96, 165, 250, 0.6))")
            .on("click", function (event, d) {
                event.stopPropagation();
                handleCountryClick(resolveCountryName(d));
            })
            .append("title")
            .text(d => `${d.name} (${resolveCountryName(d)})`);

        // Initial coloring pass for "has data" + selected state
        updateD3Colors();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [geoJsonData, isMobile, countries]);

    // Recolors the already-drawn map when the selection or the "which
    // countries have data" set changes -- no rebuild, so nothing disappears.
    const updateD3Colors = useCallback(() => {
        if (!svgRef.current) return;
        const svg = d3.select(svgRef.current);
        svg.selectAll('path.country-path')
            .attr('fill', function (d) {
                const countryName = normalizeCountryName(d.properties?.NAME || d.properties?.name);
                if (countryName === selectedCountry) return MAP_COLORS.landSelected;
                if (countryHasData(countryName)) return MAP_COLORS.landHasData;
                return MAP_COLORS.land;
            })
            .attr('stroke', function (d) {
                const countryName = normalizeCountryName(d.properties?.NAME || d.properties?.name);
                return countryName === selectedCountry ? MAP_COLORS.borderSelected : MAP_COLORS.border;
            });
    }, [selectedCountry, countryHasData]);

    useEffect(() => {
        updateD3Colors();
    }, [updateD3Colors]);

    const resetZoom = () => {
        if (zoomRef.current && svgRef.current) {
            d3.select(svgRef.current)
                .transition()
                .duration(750)
                .call(zoomRef.current.transform, d3.zoomIdentity);
        }
    };

    useEffect(() => {
        if (!view3D && geoJsonData) {
            const timer = setTimeout(() => {
                drawD3Map();
            }, 100);

            return () => clearTimeout(timer);
        }
    }, [view3D, geoJsonData, drawD3Map]);

    useEffect(() => {
        const handleResize = () => {
            if (!view3D) {
                const timer = setTimeout(() => {
                    drawD3Map();
                }, 200);
                return () => clearTimeout(timer);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [view3D, drawD3Map]);

    const fetchCountryStockPicks = async (countryName) => {
        setLoadingStockData(true);
        try {
            const response = await fetch(`${baseUrl}/api/snow-global-stock-picks/by-country/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ country: countryName, history: true })
            });
            const data = await response.json();
            setCountryStockData(prev => ({ ...prev, [countryName]: data }));
            return data;
        } catch (error) {
            console.error('Error fetching stock picks:', error);
            setCountryStockData(prev => ({
                ...prev,
                [countryName]: { success: false, error: "Couldn't reach the server. Please try again." }
            }));
            return null;
        } finally {
            setLoadingStockData(false);
        }
    };

    const handleCountryClick = async (countryNameOrPoint) => {
        const rawName = typeof countryNameOrPoint === 'string' ? countryNameOrPoint : countryNameOrPoint.name;
        const countryName = normalizeCountryName(rawName);
        setSelectedCountry(countryName);
        setShowStockModal(true);
        setSelectedDateKey(null);
        setSelectedSector('All');
        setStockSearchQuery('');
        if (!countryStockData[countryName]) {
            await fetchCountryStockPicks(countryName);
        }
    };

    const handleCloseStockModal = () => {
        setShowStockModal(false);
        setSelectedCountry('');
        setSelectedDateKey(null);
        setSelectedSector('All');
        setStockSearchQuery('');
        setCountryRailSearch('');
        closeMultiChart();
    };

    const handlePolygonClick = (polygon) => {
        const countryName = normalizeCountryName(polygon.properties?.NAME || polygon.properties?.name || 'Unknown Country');
        handleCountryClick(countryName);
    };

    const extractYouTubeId = (url) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const handlePlayVideo = () => {
        const videoId = extractYouTubeId(videoUrl);
        if (videoId) {
            setIsVideoPlaying(true);
        } else {
            alert("That doesn't look like a valid YouTube link. Please check the URL.");
        }
    };

    const handleCloseMediaCenter = () => {
        setShowMediaCenter(false);
        setVideoUrl('');
        setIsVideoPlaying(false);
    };

    const handleLauraQuery = async () => {
        if (!lauraInput.trim() && !selectedImage) return;

        const currentInput = lauraInput;
        const currentImage = selectedImage;

        setLauraInput('');
        setSelectedImage(null);
        setImagePreview(null);

        setLauraLoading(true);
        setLauraError('');

        const userMessage = {
            role: 'user',
            content: currentInput,
            image: imagePreview
        };

        const updatedMessages = [...lauraMessages, userMessage];
        setLauraMessages(updatedMessages);

        setTimeout(() => scrollToBottom(), 100);

        let context = "Stock picks you've saved so far:\n\n";
        Object.entries(countryStockData).forEach(([country, data]) => {
            if (data && data.success && data.total_stocks > 0) {
                context += `${country}: ${JSON.stringify(data.stocks)}\n`;
            }
        });

        const messages = [
            {
                role: "system",
                content: `You are Laura, a helpful AI research assistant for a solo stock market researcher. Here's what they have saved so far:\n\n${context}`
            },
            ...updatedMessages.filter(m => !m.image).map(m => ({
                role: m.role,
                content: m.content
            })),
            {
                role: "user",
                content: currentInput || "Analyze this image"
            }
        ];

        const requestBody = {
            model: "gpt-4o-mini",
            messages,
            max_tokens: 1000
        };

        try {
            if (currentImage) {
                const reader = new FileReader();
                reader.onloadend = async () => {
                    const base64Image = reader.result.split(',')[1];
                    requestBody.messages[requestBody.messages.length - 1] = {
                        role: "user",
                        content: [
                            { type: "text", text: currentInput || "Analyze this image" },
                            { type: "image_url", image_url: { url: `data:image/jpeg;base64,${base64Image}` } }
                        ]
                    };
                    await sendToOpenAI(requestBody);
                };
                reader.onerror = () => {
                    setLauraError('That image failed to upload.');
                    setLauraLoading(false);
                };
                reader.readAsDataURL(currentImage);
            } else {
                await sendToOpenAI(requestBody);
            }
        } catch (error) {
            setLauraError("Couldn't reach Laura. Please try again.");
            setLauraMessages(prev => [...prev, { role: 'assistant', content: "Sorry, something went wrong on my end." }]);
        } finally {
            setLauraLoading(false);
            setTimeout(() => scrollToBottom(), 100);
        }
    };

    const sendToOpenAI = async (requestBody) => {
        try {
            const response = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${OPENAI_API_KEY}`
                },
                body: JSON.stringify(requestBody)
            });

            const data = await response.json();

            if (data.error) {
                setLauraError(data.error.message || 'Something went wrong. Please try again.');
                setLauraMessages(prev => [...prev, {
                    role: 'assistant',
                    content: "Sorry, I couldn't process that. Please try again."
                }]);
            } else {
                const assistantMessage = {
                    role: 'assistant',
                    content: data.choices[0].message.content
                };
                setLauraMessages(prev => [...prev, assistantMessage]);
            }
        } catch (error) {
            setLauraError('Connection to OpenAI failed.');
            setLauraMessages(prev => [...prev, {
                role: 'assistant',
                content: "Sorry, I couldn't connect. Please check the API key and try again."
            }]);
        } finally {
            setLauraLoading(false);
            setTimeout(() => scrollToBottom(), 100);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // NOTE: this calls the Anthropic API directly from the browser with no
    // auth header, so it will 401 as-is. Left as-is since it's unrelated to
    // this change, but worth routing through your Django backend (like the
    // OpenAI key already is) if you want this search to actually work.
    const handleGeopoliticalSearch = async () => {
        if (!searchQuery.trim()) return;

        setSearchLoading(true);
        setSearchError('');

        try {
            const response = await fetch("https://api.anthropic.com/v1/messages", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "anthropic-version": "2023-06-01"
                },
                body: JSON.stringify({
                    model: "claude-sonnet-4-20250514",
                    max_tokens: 2048,
                    messages: [
                        {
                            role: "user",
                            content: `Search and provide a detailed analysis on: ${searchQuery}`
                        }
                    ],
                    tools: [
                        { type: "web_search_20250305", name: "web_search" }
                    ]
                })
            });

            const data = await response.json();

            if (data.error) {
                setSearchError(data.error.message || 'That search failed. Please try again.');
            } else {
                const fullResponse = data.content
                    .map(item => (item.type === "text" ? item.text : ""))
                    .filter(Boolean)
                    .join("\n");

                setLauraMessages(prev => [...prev,
                    { role: 'user', content: `Search: ${searchQuery}` },
                    { role: 'assistant', content: fullResponse || 'No results found. Try rewording your search.' }
                ]);
                setSearchQuery('');
                setShowLaura(true);
            }
        } catch (error) {
            setSearchError("Couldn't reach the search service.");
        } finally {
            setSearchLoading(false);
        }
    };

    const handleNewLauraConversation = () => {
        setLauraMessages([{
            role: 'assistant',
            content: "Hi, I'm Laura. Ask me about any country's saved stock picks, or use the search box above to look something up."
        }]);
        setLauraError('');
        setSelectedImage(null);
        setImagePreview(null);
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleVoiceChange = (e) => {
        const voiceName = e.target.value;
        const voice = availableVoices.find(v => v.name === voiceName);
        setSelectedVoice(voice);
        localStorage.setItem('lauraVoice', voiceName);
    };

    const speakMessage = (text) => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            if (selectedVoice) {
                utterance.voice = selectedVoice;
            }
            utterance.onstart = () => setIsSpeaking(true);
            utterance.onend = () => setIsSpeaking(false);
            utterance.onerror = () => setIsSpeaking(false);
            window.speechSynthesis.speak(utterance);
        }
    };

    const stopSpeaking = () => {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
    };

    // ------------------------------------------------------------------
    // Group a country's (history=true) stock list by date_saved (desc),
    // then by sector within each date. Because SnowGlobalStockPick has a
    // unique_together on (symbol, country, sector, date_saved), each
    // date+sector bucket is already the "latest" snapshot for that day --
    // no extra de-duping needed once you're looking at a single date.
    // ------------------------------------------------------------------
    const dateGroups = useMemo(() => {
        const data = countryStockData[selectedCountry];
        if (!data || !data.success || !Array.isArray(data.stocks)) return [];

        const byDate = new Map();
        data.stocks.forEach(stock => {
            const dateKey = stock.date_saved || 'Unknown';
            if (!byDate.has(dateKey)) byDate.set(dateKey, []);
            byDate.get(dateKey).push(stock);
        });

        return Array.from(byDate.entries())
            .sort((a, b) => (a[0] < b[0] ? 1 : a[0] > b[0] ? -1 : 0))
            .map(([date, stocks]) => {
                const sortedStocks = [...stocks].sort((a, b) => (
                    (a.sector || '').localeCompare(b.sector || '') ||
                    (b.top_pick === a.top_pick ? 0 : b.top_pick ? 1 : -1) ||
                    (b.conviction || 0) - (a.conviction || 0)
                ));
                const sectors = Array.from(new Set(sortedStocks.map(s => s.sector || 'Other'))).sort();
                return { date, stocks: sortedStocks, sectors };
            });
    }, [countryStockData, selectedCountry]);

    // Default to the most recent date whenever the country (or its data) changes
    useEffect(() => {
        if (dateGroups.length > 0) {
            const stillValid = dateGroups.some(g => g.date === selectedDateKey);
            if (!stillValid) {
                setSelectedDateKey(dateGroups[0].date);
                setSelectedSector('All');
            }
        }
    }, [dateGroups]); // eslint-disable-line react-hooks/exhaustive-deps

    const activeDateGroup = dateGroups.find(g => g.date === selectedDateKey) || dateGroups[0] || null;
    const visibleStocks = activeDateGroup
        ? (selectedSector === 'All'
            ? activeDateGroup.stocks
            : activeDateGroup.stocks.filter(s => (s.sector || 'Other') === selectedSector))
        : [];
    const searchedVisibleStocks = stockSearchQuery.trim()
        ? visibleStocks.filter(s => {
            const q = stockSearchQuery.trim().toLowerCase();
            return (s.symbol || '').toLowerCase().includes(q) || (s.name || '').toLowerCase().includes(q);
        })
        : visibleStocks;
    const filteredSavedCountriesList = countryRailSearch.trim()
        ? savedCountriesList.filter(c => c.country.toLowerCase().includes(countryRailSearch.trim().toLowerCase()))
        : savedCountriesList;

    const formatDateLabel = (dateStr, isLatest) => {
        if (!dateStr || dateStr === 'Unknown') return 'Unknown date';
        const d = new Date(dateStr + 'T00:00:00');
        const label = isNaN(d.getTime())
            ? dateStr
            : d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
        return isLatest ? `Latest · ${label}` : label;
    };

    // ------------------------------------------------------------------
    // Lightweight-charts panel for a single stock symbol
    // ------------------------------------------------------------------
    const fetchChartData = async (symbol, country, timeframe) => {
        setChartError('');
        setChartLoading(true);

        try {
            const response = await fetch(`${baseUrl}/api/snow-global-stock-picks/chart-data/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ symbol, country, timeframe })
            });
            const data = await response.json();
            if (data.success && Array.isArray(data.candles) && data.candles.length > 0) {
                setChartData(data.candles);
                setChartLastRefreshed(new Date());
            } else {
                setChartError(data.error || 'No chart data available for this symbol yet.');
            }
        } catch (error) {
            setChartError("Couldn't reach the chart data endpoint.");
        } finally {
            setChartLoading(false);
        }
    };

    // TradePosition rows for whatever symbol is on the chart -- entry/SL/TP
    // lines + live P&L superimposed on top of the candles. Failing quietly
    // here (no positions found, or the endpoint isn't wired up yet) just
    // means no overlay renders; it shouldn't block the chart itself.
    const fetchChartPositions = async (symbol) => {
        try {
            const response = await fetch(`${baseUrl}/api/snow-trade-positions/by-asset/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ asset: symbol })
            });
            const data = await response.json();
            setChartPositions(data.success ? (data.positions || []) : []);
        } catch (error) {
            setChartPositions([]);
        }
    };

    const openStockChart = (stock) => {
        const country = selectedCountry;
        setChartData(null);
        setChartStock({ symbol: stock.symbol, name: stock.name, country });
        setChartTimeframe('1D');
        fetchChartData(stock.symbol, country, '1D');
        fetchChartPositions(stock.symbol);
    };

    const handleChartTimeframeChange = (timeframe) => {
        if (timeframe === chartTimeframe || !chartStock) return;
        setChartData(null);
        setChartTimeframe(timeframe);
        fetchChartData(chartStock.symbol, chartStock.country, timeframe);
    };

    // Refresh deliberately does NOT clear chartData first -- the old chart
    // (and positions) stay visible with just the refresh icon spinning,
    // then swap in once the new data arrives, instead of flashing blank.
    const refreshStockChart = () => {
        if (!chartStock || chartLoading) return;
        fetchChartData(chartStock.symbol, chartStock.country, chartTimeframe);
        fetchChartPositions(chartStock.symbol);
    };

    const closeStockChart = () => {
        if (chartInstanceRef.current) {
            chartInstanceRef.current.remove();
            chartInstanceRef.current = null;
        }
        setChartStock(null);
        setChartData(null);
        setChartError('');
        setChartTimeframe('1D');
        setChartFullscreen(false);
        setChartPositions([]);
        setChartLastRefreshed(null);
    };

    // Resize the single-stock chart when fullscreen toggles.
    useEffect(() => {
        if (!chartInstanceRef.current || !chartContainerRef.current) return;
        const timer = setTimeout(() => {
            const container = chartContainerRef.current;
            if (container && chartInstanceRef.current) {
                chartInstanceRef.current.applyOptions({
                    width: container.clientWidth,
                    height: container.clientHeight,
                });
            }
        }, 50);
        return () => clearTimeout(timer);
    }, [chartFullscreen]);

    // ------------------------------------------------------------------
    // "Chart all visible" -- bulk-fetches candles for every stock currently
    // shown in the date/sector/search-filtered list and renders a grid of
    // mini charts instead of one at a time.
    // ------------------------------------------------------------------
    const openMultiChart = async (symbols) => {
        setShowMultiChart(true);
        setMultiChartError('');
        if (!symbols || symbols.length === 0) {
            setMultiChartError('No stocks in the current view to chart.');
            return;
        }
        setMultiChartLoading(true);
        try {
            const response = await fetch(`${baseUrl}/api/snow-global-stock-picks/bulk-chart-data/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ symbols, interval: multiChartInterval })
            });
            const data = await response.json();
            if (data.success) {
                setMultiChartData(data.results || {});
            } else {
                setMultiChartError(data.error || "Couldn't load charts.");
            }
        } catch (error) {
            setMultiChartError("Couldn't reach the chart data endpoint.");
        } finally {
            setMultiChartLoading(false);
        }
    };

    const closeMultiChart = () => {
        Object.values(multiChartInstanceRefs.current).forEach(chart => {
            if (chart) chart.remove();
        });
        multiChartInstanceRefs.current = {};
        setShowMultiChart(false);
        setMultiChartData({});
        setMultiChartError('');
    };


    useEffect(() => {
        if (!chartData || !chartContainerRef.current) return;

        if (chartInstanceRef.current) {
            chartInstanceRef.current.remove();
            chartInstanceRef.current = null;
        }

        const isIntraday = ASSET_INTRADAY_INTERVALS.has(chartTimeframe);

        const container = chartContainerRef.current;
        const chart = createChart(container, {
            width: container.clientWidth,
            height: container.clientHeight,
            layout: {
                background: { color: MAP_COLORS.void },
                textColor: '#cbd5e1',
            },
            grid: {
                vertLines: { color: 'rgba(148, 163, 184, 0.08)' },
                horzLines: { color: 'rgba(148, 163, 184, 0.08)' },
            },
            rightPriceScale: { borderColor: MAP_COLORS.border },
            timeScale: {
                borderColor: MAP_COLORS.border,
                timeVisible: isIntraday,
                secondsVisible: false,
            },
        });

        const candleSeries = addCandleSeries(chart, {
            upColor: COLORS.positive,
            downColor: COLORS.negative,
            borderVisible: false,
            wickUpColor: COLORS.positive,
            wickDownColor: COLORS.negative,
        });

        candleSeries.setData(buildSessionAwareCandles(chartData));

        // Superimpose entry/SL/TP for up to 3 positions on this symbol.
        chartPositions.slice(0, 3).forEach((pos, idx) => {
            const isLong = pos.direction === 'long';
            const fade = idx === 0 ? 1 : 0.55;
            if (pos.entry_price != null) {
                candleSeries.createPriceLine({
                    price: pos.entry_price,
                    color: hexToRgba('#94a3b8', fade),
                    lineWidth: 1,
                    lineStyle: LineStyle.Solid,
                    axisLabelVisible: true,
                    title: `${isLong ? 'Long' : 'Short'} entry`,
                });
            }
            if (pos.sl_price != null) {
                candleSeries.createPriceLine({
                    price: pos.sl_price,
                    color: hexToRgba(COLORS.negative, fade),
                    lineWidth: 1,
                    lineStyle: LineStyle.Dashed,
                    axisLabelVisible: true,
                    title: 'SL',
                });
            }
            if (pos.tp_price != null) {
                candleSeries.createPriceLine({
                    price: pos.tp_price,
                    color: hexToRgba(COLORS.positive, fade),
                    lineWidth: 1,
                    lineStyle: LineStyle.Dashed,
                    axisLabelVisible: true,
                    title: 'TP',
                });
            }
        });

        chart.timeScale().fitContent();
        chartInstanceRef.current = chart;


        const handleResize = () => {
            chart.applyOptions({ width: container.clientWidth, height: container.clientHeight });
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            if (chartInstanceRef.current) {
                chartInstanceRef.current.remove();
                chartInstanceRef.current = null;
            }
        };
    }, [chartData, chartTimeframe, chartPositions]);

    const StockChartPanel = () => {
        if (!chartStock) return null;

        const lastCandle = chartData && chartData.length > 0 ? chartData[chartData.length - 1] : null;
        const prevCandle = chartData && chartData.length > 1 ? chartData[chartData.length - 2] : null;
        const changeAbs = lastCandle && prevCandle ? lastCandle.close - prevCandle.close : null;
        const changePct = changeAbs !== null && prevCandle.close ? (changeAbs / prevCandle.close) * 100 : null;
        const priceUp = changeAbs === null || changeAbs >= 0;
        const lastCandleLabel = lastCandle
            ? (typeof lastCandle.time === 'number'
                ? new Date(lastCandle.time * 1000).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
                : new Date(lastCandle.time + 'T00:00:00').toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }))
            : null;
        const showExtendedHoursNote = hasExtendedHours(chartData);

        return (
            <div style={styles.chartModal} onClick={(e) => { if (e.target === e.currentTarget && !chartFullscreen) closeStockChart(); }}>
                <div style={chartFullscreen ? styles.chartModalContentFullscreen : styles.chartModalContent}>
                    <div style={styles.chartModalHeader}>
                        <div>
                            <h3 style={styles.chartModalTitle}>{chartStock.symbol}</h3>
                            <div style={styles.stockModalSubtitle}>{chartStock.name}</div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <button
                                style={styles.refreshButton}
                                onClick={refreshStockChart}
                                disabled={chartLoading}
                                title={chartLastRefreshed ? `Last refreshed ${chartLastRefreshed.toLocaleTimeString()}` : 'Refresh'}
                            >
                                <RefreshCw size={13} style={chartLoading ? styles.refreshSpinning : undefined} />
                            </button>
                            <button style={styles.fullscreenButtonSmall} onClick={() => setChartFullscreen(f => !f)}>
                                {chartFullscreen ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
                                {!isMobile && (chartFullscreen ? 'Exit fullscreen' : 'Fullscreen')}
                            </button>
                            <button style={styles.stockModalClose} onClick={closeStockChart}>×</button>
                        </div>
                    </div>

                    <div style={styles.chartTimeframeRow}>
                        {ASSET_INTERVALS.map(tf => (
                            <button
                                key={tf}
                                style={{
                                    ...styles.chartTimeframeButton,
                                    ...(tf === chartTimeframe ? styles.chartTimeframeButtonActive : {})
                                }}
                                onClick={() => handleChartTimeframeChange(tf)}
                            >
                                {tf}
                            </button>
                        ))}
                    </div>

                    {showExtendedHoursNote && (
                        <div style={styles.extendedHoursNote}>Dimmed candles = pre/post-market</div>
                    )}

                    <div style={styles.chartModalBody}>
                        {chartLoading && !chartData && (
                            <div style={styles.loadingWrap}>
                                <div style={styles.spinner}></div>
                                <div style={{ color: COLORS.inkMuted, marginTop: '12px' }}>Loading chart...</div>
                            </div>
                        )}
                        {!chartLoading && chartError && (
                            <div style={styles.emptyStateWrap}>
                                <AlertTriangle size={30} color={COLORS.caution} />
                                <div style={styles.emptyStateTitle}>Couldn't load chart</div>
                                <p style={styles.emptyStateText}>{chartError}</p>
                            </div>
                        )}
                        {!chartError && chartData && (
                            <>
                                {/* Superimposed price/change -- directly on the chart, color-coded, no box */}
                                <div style={styles.chartHud}>
                                    <div style={styles.chartHudRow}>
                                        {lastCandle && <span style={styles.chartHudPrice(priceUp)}>{lastCandle.close.toFixed(2)}</span>}
                                        {changeAbs !== null && (
                                            <span style={styles.chartHudChange(priceUp)}>
                                                {priceUp ? <TrendingUp size={11} style={{ verticalAlign: 'middle' }} /> : <TrendingDown size={11} style={{ verticalAlign: 'middle' }} />}
                                                {' '}{priceUp ? '+' : ''}{changeAbs.toFixed(2)} ({changePct.toFixed(2)}%)
                                            </span>
                                        )}
                                    </div>
                                    {lastCandleLabel && <div style={styles.chartHudMeta}>As of {lastCandleLabel} · {chartTimeframe}</div>}
                                </div>

                                {/* Superimposed position details -- entry/SL/TP/live P&L for any
                                    TradePosition rows saved against this symbol */}
                                {chartPositions.length > 0 && (
                                    <div style={styles.positionHud}>
                                        {chartPositions.slice(0, 3).map(pos => {
                                            const pnl = computePositionPnL(pos, lastCandle?.close);
                                            const isLong = pos.direction === 'long';
                                            return (
                                                <div key={pos.id} style={styles.positionHudRow}>
                                                    <span style={styles.positionDirectionBadge(isLong)}>{isLong ? 'LONG' : 'SHORT'}</span>
                                                    <span style={styles.positionHudEntry}>Entry {pos.entry_price}</span>
                                                    {pnl && pnl.dollars != null && (
                                                        <span style={styles.positionHudPnl(pnl.dollars >= 0)}>
                                                            {pnl.dollars >= 0 ? '+' : ''}{pnl.dollars.toFixed(2)}
                                                            {pnl.pct != null && <> ({pnl.pct >= 0 ? '+' : ''}{pnl.pct.toFixed(2)}%)</>}
                                                        </span>
                                                    )}
                                                </div>
                                            );
                                        })}
                                        {chartPositions.length > 3 && (
                                            <div style={styles.positionHudMore}>+{chartPositions.length - 3} more position{chartPositions.length - 3 !== 1 ? 's' : ''}</div>
                                        )}
                                    </div>
                                )}

                                <div ref={chartContainerRef} style={styles.chartCanvas}></div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    // ------------------------------------------------------------------
    // "Chart all visible" grid -- one mini candlestick chart per symbol
    // currently shown in the country modal's date/sector/search-filtered
    // list, so you can scan a whole country/sector at once instead of
    // opening stocks one at a time.
    // ------------------------------------------------------------------
    useEffect(() => {
        if (!showMultiChart) return;

        const symbols = Object.keys(multiChartData);
        symbols.forEach(symbol => {
            const result = multiChartData[symbol];
            const container = multiChartContainerRefs.current[symbol];
            if (!result || !result.success || !container) return;

            if (multiChartInstanceRefs.current[symbol]) {
                multiChartInstanceRefs.current[symbol].remove();
                multiChartInstanceRefs.current[symbol] = null;
            }

            const isIntraday = ASSET_INTRADAY_INTERVALS.has(multiChartInterval);
            const chart = createChart(container, {
                width: container.clientWidth,
                height: container.clientHeight,
                layout: { background: { color: MAP_COLORS.void }, textColor: '#cbd5e1' },
                grid: { vertLines: { visible: false }, horzLines: { visible: false } },
                rightPriceScale: { borderColor: MAP_COLORS.border },
                timeScale: { borderColor: MAP_COLORS.border, timeVisible: isIntraday, secondsVisible: false },
                handleScroll: false,
                handleScale: false,
            });
            const candleSeries = addCandleSeries(chart, {
                upColor: COLORS.positive,
                downColor: COLORS.negative,
                borderVisible: false,
                wickUpColor: COLORS.positive,
                wickDownColor: COLORS.negative,
            });
            candleSeries.setData(buildSessionAwareCandles(result.candles));
            chart.timeScale().fitContent();
            multiChartInstanceRefs.current[symbol] = chart;
        });

        return () => {
            // Only tear down on interval change / grid close (handled by
            // closeMultiChart) -- this effect re-runs per data/interval
            // change and rebuilds fresh instances above.
        };
    }, [multiChartData, multiChartInterval, showMultiChart]);

    const changeMultiChartInterval = (intervalKey) => {
        if (intervalKey === multiChartInterval) return;
        Object.values(multiChartInstanceRefs.current).forEach(chart => { if (chart) chart.remove(); });
        multiChartInstanceRefs.current = {};
        setMultiChartInterval(intervalKey);
        const symbols = Object.keys(multiChartData);
        if (symbols.length > 0) openMultiChart(symbols);
    };

    const MultiChartGrid = () => {
        const symbols = Object.keys(multiChartData);
        return (
            <div style={styles.multiChartModal} onClick={(e) => { if (e.target === e.currentTarget) closeMultiChart(); }}>
                <div style={styles.multiChartContent}>
                    <div style={styles.multiChartHeader}>
                        <div>
                            <h3 style={styles.stockModalTitle}>Chart all visible</h3>
                            <div style={styles.stockModalSubtitle}>{selectedCountry}{symbols.length > 0 && <> · {symbols.length} symbols</>}</div>
                        </div>
                        <button style={styles.stockModalClose} onClick={closeMultiChart}>×</button>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px 0' }}>
                        <button
                            style={styles.chartAllButton}
                            onClick={() => openMultiChart(symbols)}
                            disabled={multiChartLoading || symbols.length === 0}
                        >
                            <RefreshCw size={12} style={multiChartLoading ? styles.refreshSpinning : undefined} /> Refresh all
                        </button>
                    </div>

                    <div style={styles.chartTimeframeRow}>
                        {ASSET_INTERVALS.map(tf => (
                            <button
                                key={tf}
                                style={{
                                    ...styles.chartTimeframeButton,
                                    ...(tf === multiChartInterval ? styles.chartTimeframeButtonActive : {})
                                }}
                                onClick={() => changeMultiChartInterval(tf)}
                            >
                                {tf}
                            </button>
                        ))}
                    </div>

                    <div style={styles.multiChartBody}>
                        {multiChartLoading && (
                            <div style={styles.loadingWrap}>
                                <div style={styles.spinner}></div>
                                <div style={{ color: COLORS.inkMuted, marginTop: '12px' }}>Loading charts...</div>
                            </div>
                        )}
                        {!multiChartLoading && multiChartError && (
                            <div style={styles.emptyStateWrap}>
                                <AlertTriangle size={30} color={COLORS.caution} />
                                <div style={styles.emptyStateTitle}>Couldn't load charts</div>
                                <p style={styles.emptyStateText}>{multiChartError}</p>
                            </div>
                        )}
                        {!multiChartLoading && !multiChartError && symbols.length > 0 && (
                            <div style={styles.multiChartGrid}>
                                {symbols.map(symbol => {
                                    const result = multiChartData[symbol];
                                    const candles = result && result.success ? result.candles : null;
                                    const lastCandle = candles && candles.length > 0 ? candles[candles.length - 1] : null;
                                    const prevCandle = candles && candles.length > 1 ? candles[candles.length - 2] : null;
                                    const changeAbs = lastCandle && prevCandle ? lastCandle.close - prevCandle.close : null;
                                    const priceUp = changeAbs === null || changeAbs >= 0;
                                    return (
                                        <div key={symbol} style={styles.multiChartCard}>
                                            <div style={styles.multiChartCardCanvasWrap}>
                                                {candles ? (
                                                    <>
                                                        <div style={styles.multiChartHud}>
                                                            <span style={styles.multiChartHudSymbol}>{symbol}</span>
                                                            {lastCandle && (
                                                                <span style={styles.multiChartHudPrice(priceUp)}>
                                                                    {lastCandle.close.toFixed(2)}
                                                                    {changeAbs !== null && <> {priceUp ? '▲' : '▼'} {Math.abs(changeAbs).toFixed(2)}</>}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div
                                                            ref={(el) => { multiChartContainerRefs.current[symbol] = el; }}
                                                            style={styles.multiChartCanvas}
                                                        ></div>
                                                    </>
                                                ) : (
                                                    <div style={styles.multiChartCardError}>
                                                        <span style={styles.multiChartHudSymbol}>{symbol}</span>
                                                        <span style={{ fontSize: '11px', color: COLORS.inkFaint }}>
                                                            {result && result.error ? result.error : 'No data'}
                                                        </span>
                                                    </div>
                                                )}
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
    };

    // ------------------------------------------------------------------
    // Country stock-picks modal (replaces the old "intel brief" modal)
    // ------------------------------------------------------------------
    const renderCountryStockModal = () => {
        const data = countryStockData[selectedCountry];

        return (
            <div style={styles.stockModal} onClick={(e) => {
                if (e.target === e.currentTarget) handleCloseStockModal();
            }}>
                <div style={styles.stockModalContent}>
                    <div style={styles.stockModalHeader}>
                        <div>
                            <h3 style={styles.stockModalTitle}>
                                <span style={{ fontSize: '22px', marginRight: '8px' }}>{data?.flag || '🌍'}</span>
                                {selectedCountry}
                            </h3>
                            {activeDateGroup && (
                                <div style={styles.stockModalSubtitle}>
                                    {searchedVisibleStocks.length} stock{searchedVisibleStocks.length !== 1 ? 's' : ''} shown
                                    {selectedSector !== 'All' && <> · {selectedSector}</>}
                                    {' '}· {formatDateLabel(activeDateGroup.date, activeDateGroup.date === dateGroups[0]?.date)}
                                </div>
                            )}
                        </div>
                        <button style={styles.stockModalClose} onClick={handleCloseStockModal}>×</button>
                    </div>

                    <div style={styles.stockModalLayout}>
                        {/* Saved-countries rail so you can jump between any country without leaving the modal */}
                        {savedCountriesList.length > 0 && (
                            <div style={styles.countryRail}>
                                <div style={styles.countryRailLabel}>Saved countries</div>
                                <div style={styles.countryRailSearchWrap}>
                                    <Search size={12} color={COLORS.inkFaint} />
                                    <input
                                        type="text"
                                        placeholder="Search countries..."
                                        value={countryRailSearch}
                                        onChange={(e) => setCountryRailSearch(e.target.value)}
                                        style={styles.countryRailSearchInput}
                                    />
                                </div>
                                <div style={styles.countryRailList}>
                                    {filteredSavedCountriesList.map((c) => (
                                        <button
                                            key={c.country}
                                            style={{
                                                ...styles.countryRailItem,
                                                ...(c.country === selectedCountry ? styles.countryRailItemActive : {})
                                            }}
                                            onClick={() => handleCountryClick(c.country)}
                                        >
                                            <span style={{ marginRight: '6px' }}>{c.flag || '🌍'}</span>
                                            <span style={styles.countryRailName}>{c.country}</span>
                                            <span style={styles.countryRailCount}>{c.total_picks}</span>
                                        </button>
                                    ))}
                                    {filteredSavedCountriesList.length === 0 && (
                                        <div style={styles.countryRailEmpty}>No countries match "{countryRailSearch}"</div>
                                    )}
                                </div>
                            </div>
                        )}

                        <div style={styles.stockModalBody}>
                            {loadingStockData && !data && (
                                <div style={styles.loadingWrap}>
                                    <div style={styles.spinner}></div>
                                    <div style={{ color: COLORS.inkMuted, marginTop: '12px' }}>Loading saved picks...</div>
                                </div>
                            )}

                            {data && !data.success && (
                                <div style={styles.emptyStateWrap}>
                                    <div style={styles.emptyStateTitle}>Something went wrong</div>
                                    <p style={styles.emptyStateText}>{data.error || 'Please try again.'}</p>
                                </div>
                            )}

                            {data && data.success && dateGroups.length === 0 && (
                                <div style={styles.emptyStateWrap}>
                                    <Search size={36} color={COLORS.inkFaint} />
                                    <div style={styles.emptyStateTitle}>No stock picks saved yet</div>
                                    <p style={styles.emptyStateText}>
                                        Run your scanner and save results for {selectedCountry} to see them here.
                                    </p>
                                </div>
                            )}

                            {data && data.success && dateGroups.length > 0 && activeDateGroup && (
                                <div>
                                    {/* Date tabs -- ordered most-recent first */}
                                    <div style={styles.dateTabsRow}>
                                        <Clock size={13} color={COLORS.inkMuted} />
                                        {dateGroups.map((g, idx) => (
                                            <button
                                                key={g.date}
                                                style={{
                                                    ...styles.dateTab,
                                                    ...(g.date === selectedDateKey ? styles.dateTabActive : {})
                                                }}
                                                onClick={() => { setSelectedDateKey(g.date); setSelectedSector('All'); }}
                                            >
                                                {formatDateLabel(g.date, idx === 0)}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Sector filter chips for the selected date */}
                                    <div style={styles.sectorChipsRow}>
                                        <Layers size={13} color={COLORS.inkMuted} />
                                        <button
                                            style={{
                                                ...styles.sectorChip,
                                                ...(selectedSector === 'All' ? styles.sectorChipActive : {})
                                            }}
                                            onClick={() => setSelectedSector('All')}
                                        >
                                            All sectors
                                        </button>
                                        {activeDateGroup.sectors.map(sector => (
                                            <button
                                                key={sector}
                                                style={{
                                                    ...styles.sectorChip,
                                                    ...(selectedSector === sector ? styles.sectorChipActive : {})
                                                }}
                                                onClick={() => setSelectedSector(sector)}
                                            >
                                                {sector}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Search within this country's list + chart everything currently visible */}
                                    <div style={styles.stockSearchRow}>
                                        <div style={styles.stockSearchWrap}>
                                            <Search size={13} color={COLORS.inkFaint} />
                                            <input
                                                type="text"
                                                placeholder="Search this list by ticker or name..."
                                                value={stockSearchQuery}
                                                onChange={(e) => setStockSearchQuery(e.target.value)}
                                                style={styles.stockSearchInput}
                                            />
                                        </div>
                                        <button
                                            style={styles.chartAllButton}
                                            onClick={() => openMultiChart(searchedVisibleStocks.map(s => s.symbol))}
                                            disabled={searchedVisibleStocks.length === 0}
                                        >
                                            <BarChart3 size={13} /> Chart all visible ({searchedVisibleStocks.length})
                                        </button>
                                    </div>

                                    {data.market_outlook && (
                                        <div style={styles.outlookBox}>
                                            <div style={styles.outlookLabel}>Market outlook</div>
                                            <p style={styles.outlookText}>{data.market_outlook}</p>
                                        </div>
                                    )}

                                    <div style={styles.stockList}>
                                        {searchedVisibleStocks.length === 0 && stockSearchQuery.trim() && (
                                            <div style={styles.emptyStateWrap}>
                                                <Search size={28} color={COLORS.inkFaint} />
                                                <div style={styles.emptyStateTitle}>No matches</div>
                                                <p style={styles.emptyStateText}>Nothing in this view matches "{stockSearchQuery}".</p>
                                            </div>
                                        )}
                                        {searchedVisibleStocks.map((stock, idx) => {
                                            const recStyle = getRecStyle(stock.rec);
                                            const showSectorHeading = selectedSector === 'All' && (
                                                idx === 0 || (searchedVisibleStocks[idx - 1].sector || 'Other') !== (stock.sector || 'Other')
                                            );
                                            return (
                                                <React.Fragment key={stock.id || idx}>
                                                    {showSectorHeading && (
                                                        <div style={styles.sectorHeading}>{stock.sector || 'Other'}</div>
                                                    )}
                                                    <div style={styles.stockCard}>
                                                        <div style={styles.stockCardHeader}>
                                                            <div>
                                                                <span style={styles.stockSymbol}>{stock.symbol}</span>
                                                                <span style={styles.stockName}>{stock.name}</span>
                                                                {stock.top_pick && (
                                                                    <span style={styles.topPickBadge}>
                                                                        <Star size={11} fill={COLORS.accent} color={COLORS.accent} /> Top pick
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <span style={{ ...styles.recBadge, ...recStyle }}>{stock.rec}</span>
                                                        </div>

                                                        {stock.top_pick && stock.top_pick_reason && (
                                                            <p style={styles.topPickReason}>{stock.top_pick_reason}</p>
                                                        )}

                                                        <div style={styles.statRow}>
                                                            {typeof stock.conviction === 'number' && (
                                                                <div style={styles.convictionWrap}>
                                                                    <div style={styles.convictionLabelRow}>
                                                                        <BarChart3 size={12} color={COLORS.inkMuted} />
                                                                        <span>Conviction {stock.conviction}/10</span>
                                                                    </div>
                                                                    <div style={styles.convictionTrack}>
                                                                        <div style={{
                                                                            ...styles.convictionFill,
                                                                            width: `${Math.max(0, Math.min(10, stock.conviction)) * 10}%`
                                                                        }}></div>
                                                                    </div>
                                                                </div>
                                                            )}
                                                            {stock.price_at_save && (
                                                                <div style={styles.statItem}>
                                                                    <DollarSign size={12} color={COLORS.inkMuted} /> {stock.price_at_save}
                                                                </div>
                                                            )}
                                                            {stock.market_cap && (
                                                                <div style={styles.statItem}>Mkt cap: {stock.market_cap}</div>
                                                            )}
                                                            {stock.analyst_target && (
                                                                <div style={styles.statItem}>
                                                                    <TrendingUp size={12} color={COLORS.inkMuted} /> Target: {stock.analyst_target}
                                                                </div>
                                                            )}
                                                        </div>

                                                        {stock.thesis && (
                                                            <p style={styles.thesisText}>{stock.thesis}</p>
                                                        )}

                                                        {stock.risk && (
                                                            <div style={styles.riskBox}>
                                                                <AlertTriangle size={13} color={COLORS.caution} />
                                                                <span>{stock.risk}</span>
                                                            </div>
                                                        )}

                                                        {Array.isArray(stock.catalysts) && stock.catalysts.length > 0 && (
                                                            <div style={styles.catalystWrap}>
                                                                {stock.catalysts.map((c, i) => (
                                                                    <span key={i} style={styles.catalystChip}>{c}</span>
                                                                ))}
                                                            </div>
                                                        )}

                                                        <div style={styles.stockCardFooter}>
                                                            {stock.sub_sector && <span>{stock.sub_sector}</span>}
                                                            {stock.article_count ? <span>Based on {stock.article_count} article{stock.article_count !== 1 ? 's' : ''}</span> : null}
                                                            {stock.tf_context && <span>{stock.tf_context}</span>}
                                                            <button style={styles.chartLinkButton} onClick={() => openStockChart(stock)}>
                                                                <BarChart3 size={11} /> Chart
                                                            </button>
                                                        </div>
                                                    </div>
                                                </React.Fragment>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const MediaCenterModal = () => {
        const videoId = isVideoPlaying ? extractYouTubeId(videoUrl) : null;

        return (
            <div style={styles.mediaCenterModal} onClick={(e) => {
                if (e.target === e.currentTarget) {
                    handleCloseMediaCenter();
                }
            }}>
                <div style={styles.mediaCenterContent}>
                    <div style={styles.mediaCenterHeader}>
                        <h3 style={styles.mediaCenterTitle}>Media center</h3>
                        <button style={styles.mediaCloseButton} onClick={handleCloseMediaCenter}>×</button>
                    </div>

                    <div style={styles.mediaWarning}>
                        Paste a YouTube link below to play it here.
                    </div>

                    {!isVideoPlaying && (
                        <div style={styles.mediaInputContainer}>
                            <input
                                type="text"
                                placeholder="https://www.youtube.com/watch?v=..."
                                value={videoUrl}
                                onChange={(e) => setVideoUrl(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handlePlayVideo()}
                                style={styles.mediaInput}
                            />
                            <button onClick={handlePlayVideo} style={styles.mediaButton}>
                                Play video
                            </button>
                        </div>
                    )}

                    {isVideoPlaying && videoId ? (
                        <div>
                            <div style={styles.videoContainer}>
                                <iframe
                                    key={videoId}
                                    style={styles.videoIframe}
                                    src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
                                    title="Video player"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            </div>
                            <button
                                onClick={() => {
                                    setIsVideoPlaying(false);
                                    setVideoUrl('');
                                }}
                                style={{ ...styles.mediaButton, marginTop: '15px', background: COLORS.inkMuted }}
                            >
                                Stop video
                            </button>
                        </div>
                    ) : !isVideoPlaying ? (
                        <div style={{ textAlign: 'center', padding: '40px 20px', color: COLORS.inkFaint }}>
                            No video playing.
                        </div>
                    ) : null}
                </div>
            </div>
        );
    };

    const styles = useMemo(() => ({
        container: {
            background: COLORS.bg,
            minHeight: '100vh',
            color: COLORS.ink,
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        },
        mainPageBody: { display: 'flex', flexDirection: 'column' },
        mainBodyInfo: {
            padding: isMobile ? '15px' : '30px',
            maxWidth: '1400px',
            margin: '0 auto',
            width: '100%'
        },
        pageHeader: { marginBottom: '24px' },
        pageTitle: {
            fontSize: isMobile ? '1.5rem' : '1.9rem',
            fontWeight: '700',
            color: COLORS.ink,
            margin: 0
        },
        pageSubtitle: { fontSize: '14px', color: COLORS.inkMuted, marginTop: '6px' },
        summaryBar: {
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginTop: '14px',
            fontSize: '13px',
            color: COLORS.inkMuted,
            background: COLORS.surface,
            border: `1px solid ${COLORS.border}`,
            borderRadius: '8px',
            padding: '10px 14px',
            width: 'fit-content'
        },
        controlsContainer: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: '20px',
            gap: '12px',
            background: COLORS.surface,
            padding: '16px',
            borderRadius: '10px',
            border: `1px solid ${COLORS.border}`
        },
        toggleContainer: {
            display: 'flex', gap: '6px', background: COLORS.neutralSoft, padding: '4px',
            borderRadius: '8px', flexWrap: 'wrap', justifyContent: 'center'
        },
        themeContainer: {
            display: 'flex', gap: '6px', alignItems: 'center', background: COLORS.neutralSoft,
            padding: '4px', borderRadius: '8px', flexWrap: 'wrap', justifyContent: 'center'
        },
        controlLabel: { fontSize: '12px', color: COLORS.inkMuted, fontWeight: '600', marginRight: '4px' },
        toggleButton: {
            padding: isMobile ? '8px 16px' : '9px 20px', border: 'none', borderRadius: '6px',
            fontSize: isMobile ? '12px' : '13px', fontWeight: '600', cursor: 'pointer',
            transition: 'all 0.2s ease', whiteSpace: 'nowrap'
        },
        themeButton: {
            padding: '7px 14px', border: 'none', borderRadius: '6px', fontSize: '12px',
            fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s ease', whiteSpace: 'nowrap'
        },
        activeButton: { background: COLORS.accent, color: '#fff' },
        inactiveButton: { background: 'transparent', color: COLORS.inkMuted },
        searchContainer: {
            background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: '10px',
            padding: isMobile ? '14px' : '16px', marginBottom: '16px'
        },
        searchTitle: {
            display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: '600',
            color: COLORS.ink, marginBottom: '10px'
        },
        searchInputGroup: { display: 'flex', gap: '10px', flexDirection: isMobile ? 'column' : 'row' },
        lauraButton: {
            position: 'fixed', bottom: '30px', right: isMobile ? '95px' : '110px',
            width: isMobile ? '50px' : '58px', height: isMobile ? '50px' : '58px', borderRadius: '50%',
            background: COLORS.accent, border: '3px solid #fff', color: '#fff',
            fontSize: isMobile ? '18px' : '20px', cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(37, 99, 235, 0.35)', display: 'flex', justifyContent: 'center',
            alignItems: 'center', zIndex: 9998, transition: 'transform 0.2s ease', fontWeight: '700'
        },
        lauraModal: {
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            background: 'rgba(15, 23, 42, 0.4)', display: 'flex', justifyContent: 'center',
            alignItems: 'center', zIndex: 10003, backdropFilter: 'blur(4px)'
        },
        lauraContent: {
            background: COLORS.surface, borderRadius: '14px', border: `1px solid ${COLORS.border}`,
            boxShadow: '0 20px 60px rgba(0,0,0,0.15)', width: isMobile ? '95%' : '650px',
            height: isMobile ? '90vh' : '85vh', maxWidth: '95vw', display: 'flex',
            flexDirection: 'column', overflow: 'hidden'
        },
        lauraHeader: {
            background: COLORS.surface, padding: isMobile ? '15px 20px' : '18px 22px',
            borderBottom: `1px solid ${COLORS.border}`, display: 'flex', justifyContent: 'space-between',
            alignItems: 'center'
        },
        lauraTitle: {
            fontSize: isMobile ? '1rem' : '1.1rem', fontWeight: '700', color: COLORS.ink, margin: 0,
            display: 'flex', alignItems: 'center', gap: '10px'
        },
        lauraAvatar: {
            width: '28px', height: '28px', borderRadius: '50%', background: COLORS.accent, color: '#fff',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '700'
        },
        lauraCloseButton: {
            background: 'none', border: 'none', color: COLORS.inkMuted, fontSize: '28px', cursor: 'pointer',
            padding: '0', width: '36px', height: '36px', borderRadius: '6px', display: 'flex',
            justifyContent: 'center', alignItems: 'center', fontWeight: '300'
        },
        lauraMessagesContainer: { flex: 1, overflowY: 'auto', padding: isMobile ? '15px' : '20px', background: COLORS.bg },
        lauraMessage: (isUser) => ({ marginBottom: '15px', display: 'flex', flexDirection: 'column', alignItems: isUser ? 'flex-end' : 'flex-start' }),
        lauraMessageBubble: (isUser) => ({
            maxWidth: '80%', padding: isMobile ? '10px 14px' : '12px 16px', borderRadius: '12px',
            background: isUser ? COLORS.accent : COLORS.surface,
            border: isUser ? 'none' : `1px solid ${COLORS.border}`,
            color: isUser ? '#fff' : COLORS.ink, fontSize: isMobile ? '13px' : '14px', lineHeight: '1.5',
            wordWrap: 'break-word', whiteSpace: 'pre-wrap'
        }),
        messageImage: { maxWidth: '200px', maxHeight: '200px', borderRadius: '8px', marginTop: '8px', border: `1px solid ${COLORS.border}` },
        speakButton: {
            marginTop: '8px', padding: '5px 10px', background: COLORS.neutralSoft, border: `1px solid ${COLORS.border}`,
            borderRadius: '6px', color: COLORS.inkMuted, fontSize: '11px', cursor: 'pointer', fontWeight: '600'
        },
        miniSpinner: {
            width: '16px', height: '16px', border: `2px solid ${COLORS.border}`, borderTop: `2px solid ${COLORS.accent}`,
            borderRadius: '50%', animation: 'spin 1s linear infinite'
        },
        lauraInputContainer: { padding: isMobile ? '12px' : '15px', background: COLORS.surface, borderTop: `1px solid ${COLORS.border}`, display: 'flex', flexDirection: 'column', gap: '8px' },
        lauraInput: {
            width: '100%', padding: isMobile ? '8px 12px' : '10px 14px', background: COLORS.bg,
            border: `1px solid ${COLORS.border}`, borderRadius: '8px', color: COLORS.ink,
            fontSize: isMobile ? '13px' : '14px', outline: 'none', resize: 'vertical',
            minHeight: isMobile ? '44px' : '50px', maxHeight: '100px', fontFamily: 'inherit', lineHeight: '1.5'
        },
        imageUploadContainer: { display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' },
        imageUploadButton: {
            padding: '6px 12px', background: COLORS.neutralSoft, border: `1px solid ${COLORS.border}`,
            borderRadius: '6px', color: COLORS.inkMuted, fontSize: '11px', cursor: 'pointer', fontWeight: '600'
        },
        imagePreviewContainer: { position: 'relative', display: 'inline-block' },
        imagePreviewThumb: { width: '50px', height: '50px', borderRadius: '6px', objectFit: 'cover', border: `1px solid ${COLORS.border}` },
        removeImageButton: {
            position: 'absolute', top: '-6px', right: '-6px', width: '20px', height: '20px', borderRadius: '50%',
            background: COLORS.negative, border: 'none', color: '#fff', fontSize: '12px', cursor: 'pointer',
            display: 'flex', justifyContent: 'center', alignItems: 'center'
        },
        voiceSelector: {
            padding: '6px 10px', background: COLORS.bg, border: `1px solid ${COLORS.border}`, borderRadius: '6px',
            color: COLORS.ink, fontSize: '11px', outline: 'none', cursor: 'pointer'
        },
        lauraButtonContainer: { display: 'flex', gap: '10px' },
        lauraSendButton: {
            flex: 1, padding: isMobile ? '10px 16px' : '11px 20px', background: COLORS.accent, border: 'none',
            borderRadius: '8px', color: '#fff', fontSize: isMobile ? '12px' : '14px', fontWeight: '600', cursor: 'pointer'
        },
        lauraNewChatButton: {
            padding: isMobile ? '10px 16px' : '11px 20px', background: 'transparent', border: `1px solid ${COLORS.border}`,
            borderRadius: '8px', color: COLORS.inkMuted, fontSize: isMobile ? '12px' : '14px', fontWeight: '600', cursor: 'pointer'
        },
        lauraError: {
            background: COLORS.negativeSoft, border: `1px solid ${COLORS.negativeBorder}`, borderRadius: '8px',
            padding: '10px', color: COLORS.negative, fontSize: isMobile ? '11px' : '12px', marginBottom: '10px'
        },
        searchInput: {
            flex: 1, padding: isMobile ? '10px 14px' : '11px 16px', background: COLORS.bg,
            border: `1px solid ${COLORS.border}`, borderRadius: '8px', color: COLORS.ink,
            fontSize: isMobile ? '13px' : '14px', outline: 'none'
        },
        searchButton: {
            padding: isMobile ? '10px 20px' : '11px 22px', background: COLORS.accent, border: 'none',
            borderRadius: '8px', color: '#fff', fontSize: isMobile ? '12px' : '13px', fontWeight: '600',
            cursor: 'pointer', whiteSpace: 'nowrap'
        },
        viewContainer: {
            width: '100%', height: `calc(100vh - ${isMobile ? '380px' : '330px'})`, position: 'relative',
            borderRadius: '10px', overflow: 'hidden', border: `1px solid ${COLORS.border}`,
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            background: MAP_COLORS.void
        },
        countryLabel: {
            position: 'absolute', top: '16px', left: '50%', transform: 'translateX(-50%)',
            background: COLORS.surface, color: COLORS.ink, padding: '9px 20px', borderRadius: '8px',
            fontSize: isMobile ? '13px' : '14px', fontWeight: '600', zIndex: 1000, border: `1px solid ${COLORS.border}`,
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
        },
        mapContainer: { width: '100%', height: '100%', background: MAP_COLORS.void, position: 'relative' },
        svgMap: { width: '100%', height: '100%', display: 'block' },
        loadingOverlay: {
            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
            background: 'rgba(255,255,255,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center',
            zIndex: 9999, borderRadius: '10px'
        },
        loadingContent: {
            background: COLORS.surface, padding: '32px 40px', borderRadius: '12px', textAlign: 'center',
            border: `1px solid ${COLORS.border}`, boxShadow: '0 8px 24px rgba(0,0,0,0.08)'
        },
        loadingSpinner: {
            width: '40px', height: '40px', border: `3px solid ${COLORS.border}`, borderTop: `3px solid ${COLORS.accent}`,
            borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px'
        },
        loadingText: { fontSize: '13px', color: COLORS.ink, fontWeight: '600' },

        // ---- Country stock-picks modal ----
        stockModal: {
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            background: 'rgba(15, 23, 42, 0.45)', display: 'flex', justifyContent: 'center', alignItems: 'center',
            zIndex: 10001, backdropFilter: 'blur(4px)', padding: isMobile ? '10px' : '20px'
        },
        stockModalContent: {
            background: COLORS.surface, borderRadius: '14px', border: `1px solid ${COLORS.border}`,
            boxShadow: '0 20px 60px rgba(0,0,0,0.18)', width: isMobile ? '100%' : '920px', maxWidth: '95vw',
            maxHeight: '88vh', overflow: 'hidden', display: 'flex', flexDirection: 'column'
        },
        stockModalHeader: {
            display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
            padding: '20px 24px', borderBottom: `1px solid ${COLORS.border}`
        },
        stockModalTitle: { fontSize: isMobile ? '1.15rem' : '1.3rem', fontWeight: '700', margin: 0, color: COLORS.ink, display: 'flex', alignItems: 'center' },
        stockModalSubtitle: { fontSize: '13px', color: COLORS.inkMuted, marginTop: '4px' },
        stockModalClose: {
            background: 'none', border: 'none', color: COLORS.inkMuted, fontSize: '28px', cursor: 'pointer',
            padding: '0', width: '36px', height: '36px', borderRadius: '6px', display: 'flex',
            justifyContent: 'center', alignItems: 'center', fontWeight: '300', flexShrink: 0
        },
        stockModalLayout: { display: 'flex', flexDirection: isMobile ? 'column' : 'row', overflow: 'hidden', flex: 1 },
        stockModalBody: { padding: isMobile ? '16px' : '24px', overflowY: 'auto', background: COLORS.bg, flex: 1 },

        // Saved-countries rail
        countryRail: {
            width: isMobile ? '100%' : '200px', flexShrink: 0, borderRight: isMobile ? 'none' : `1px solid ${COLORS.border}`,
            borderBottom: isMobile ? `1px solid ${COLORS.border}` : 'none', background: COLORS.surface,
            overflowY: isMobile ? 'visible' : 'auto', maxHeight: isMobile ? '140px' : 'none', padding: '12px'
        },
        countryRailLabel: { fontSize: '11px', fontWeight: '700', color: COLORS.inkFaint, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px', padding: '0 4px' },
        countryRailList: { display: 'flex', flexDirection: isMobile ? 'row' : 'column', gap: '4px', overflowX: isMobile ? 'auto' : 'visible', flexWrap: isMobile ? 'nowrap' : 'wrap' },
        countryRailItem: {
            display: 'flex', alignItems: 'center', gap: '2px', padding: '8px 10px', borderRadius: '8px',
            border: 'none', background: 'transparent', color: COLORS.inkMuted, fontSize: '12px', fontWeight: '600',
            cursor: 'pointer', textAlign: 'left', whiteSpace: 'nowrap', width: isMobile ? 'auto' : '100%'
        },
        countryRailItemActive: { background: COLORS.accentSoft, color: COLORS.accent },
        countryRailName: { flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' },
        countryRailCount: { fontSize: '10px', color: COLORS.inkFaint, marginLeft: '6px' },
        countryRailSearchWrap: {
            display: 'flex', alignItems: 'center', gap: '6px', background: COLORS.bg,
            border: `1px solid ${COLORS.border}`, borderRadius: '7px', padding: '6px 9px', marginBottom: '8px'
        },
        countryRailSearchInput: { flex: 1, border: 'none', background: 'transparent', outline: 'none', fontSize: '11px', color: COLORS.ink, minWidth: 0 },
        countryRailEmpty: { fontSize: '11px', color: COLORS.inkFaint, padding: '8px 4px' },

        // Stock-list search + "chart all visible"
        stockSearchRow: { display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '14px', alignItems: 'center' },
        stockSearchWrap: {
            display: 'flex', alignItems: 'center', gap: '7px', background: COLORS.surface,
            border: `1px solid ${COLORS.border}`, borderRadius: '8px', padding: '8px 12px', flex: '1 1 220px', minWidth: 0
        },
        stockSearchInput: { flex: 1, border: 'none', background: 'transparent', outline: 'none', fontSize: '12px', color: COLORS.ink, minWidth: 0 },
        chartAllButton: {
            display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '8px',
            border: 'none', background: COLORS.ink, color: '#fff', fontSize: '12px', fontWeight: '700',
            cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0
        },

        // "Chart all visible" grid modal
        multiChartModal: {
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            background: 'rgba(15, 23, 42, 0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center',
            zIndex: 10006, backdropFilter: 'blur(4px)', padding: isMobile ? '8px' : '20px'
        },
        multiChartContent: {
            background: COLORS.surface, borderRadius: '14px', border: `1px solid ${COLORS.border}`,
            boxShadow: '0 20px 60px rgba(0,0,0,0.25)', width: isMobile ? '100%' : '95vw', maxWidth: '1400px',
            height: isMobile ? '92vh' : '85vh', overflow: 'hidden', display: 'flex', flexDirection: 'column'
        },
        multiChartHeader: {
            display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
            padding: '16px 20px', borderBottom: `1px solid ${COLORS.border}`
        },
        multiChartBody: { flex: 1, overflowY: 'auto', background: COLORS.bg, padding: isMobile ? '10px' : '16px' },
        multiChartGrid: {
            display: 'grid', gap: '12px',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(300px, 1fr))'
        },
        multiChartCard: {
            background: MAP_COLORS.void, border: `1px solid ${COLORS.border}`, borderRadius: '10px', overflow: 'hidden'
        },
        multiChartCardCanvasWrap: { position: 'relative', height: isMobile ? '220px' : '200px' },
        multiChartCanvas: { width: '100%', height: '100%' },
        multiChartCardError: { height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '6px' },
        multiChartHud: {
            position: 'absolute', top: '8px', left: '10px', zIndex: 5, pointerEvents: 'none',
            display: 'flex', flexDirection: 'column', gap: '2px', textShadow: '0 1px 3px rgba(0,0,0,0.85)'
        },
        multiChartHudSymbol: { fontFamily: COLORS.mono, fontSize: '12px', fontWeight: '700', color: '#f8fafc' },
        multiChartHudPrice: (up) => ({ fontFamily: COLORS.mono, fontSize: '11px', fontWeight: '700', color: up ? '#4ade80' : '#f87171' }),

        // Date tabs + sector chips
        dateTabsRow: { display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginBottom: '10px' },
        dateTab: {
            padding: '6px 12px', borderRadius: '999px', border: `1px solid ${COLORS.border}`, background: COLORS.surface,
            color: COLORS.inkMuted, fontSize: '11px', fontWeight: '600', cursor: 'pointer', whiteSpace: 'nowrap'
        },
        dateTabActive: { background: COLORS.accent, borderColor: COLORS.accent, color: '#fff' },
        sectorChipsRow: { display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginBottom: '16px' },
        sectorChip: {
            padding: '5px 11px', borderRadius: '999px', border: `1px solid ${COLORS.neutralBorder}`, background: COLORS.neutralSoft,
            color: COLORS.inkMuted, fontSize: '11px', fontWeight: '600', cursor: 'pointer', whiteSpace: 'nowrap'
        },
        sectorChipActive: { background: COLORS.ink, borderColor: COLORS.ink, color: '#fff' },

        outlookBox: {
            background: COLORS.accentSoft, border: `1px solid ${COLORS.accentBorder}`, borderRadius: '10px',
            padding: '14px 16px', marginBottom: '20px'
        },
        outlookLabel: { fontSize: '11px', fontWeight: '700', color: COLORS.accent, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' },
        outlookText: { fontSize: '13px', color: COLORS.ink, lineHeight: '1.6', margin: 0 },
        stockList: { display: 'flex', flexDirection: 'column', gap: '10px' },
        sectorHeading: {
            fontSize: '12px', fontWeight: '700', color: COLORS.inkMuted, textTransform: 'uppercase',
            letterSpacing: '0.5px', margin: '14px 0 2px 0'
        },
        stockCard: {
            background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: '10px', padding: '16px'
        },
        stockCardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px', flexWrap: 'wrap' },
        stockSymbol: { fontFamily: COLORS.mono, fontWeight: '700', fontSize: '14px', color: COLORS.ink, marginRight: '8px' },
        stockName: { fontSize: '13px', color: COLORS.inkMuted },
        topPickBadge: {
            display: 'inline-flex', alignItems: 'center', gap: '4px', marginLeft: '10px', fontSize: '11px',
            fontWeight: '600', color: COLORS.accent
        },
        topPickReason: { fontSize: '12px', color: COLORS.accent, fontStyle: 'italic', margin: '6px 0 0 0' },
        recBadge: { padding: '5px 12px', borderRadius: '999px', fontSize: '11px', fontWeight: '700', whiteSpace: 'nowrap' },
        statRow: { display: 'flex', gap: '16px', flexWrap: 'wrap', margin: '12px 0', alignItems: 'flex-end' },
        convictionWrap: { minWidth: '140px' },
        convictionLabelRow: { display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: COLORS.inkMuted, marginBottom: '5px' },
        convictionTrack: { width: '100%', height: '5px', background: COLORS.neutralSoft, borderRadius: '4px', overflow: 'hidden' },
        convictionFill: { height: '100%', background: COLORS.accent, borderRadius: '4px' },
        statItem: { display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: COLORS.inkMuted, fontFamily: COLORS.mono },
        thesisText: { fontSize: '13px', color: COLORS.ink, lineHeight: '1.6', margin: '4px 0' },
        riskBox: {
            display: 'flex', alignItems: 'flex-start', gap: '7px', background: COLORS.cautionSoft,
            border: `1px solid ${COLORS.cautionBorder}`, borderRadius: '8px', padding: '9px 12px',
            fontSize: '12px', color: '#7c3a00', margin: '8px 0'
        },
        catalystWrap: { display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '8px' },
        catalystChip: {
            fontSize: '11px', color: COLORS.inkMuted, background: COLORS.neutralSoft,
            border: `1px solid ${COLORS.neutralBorder}`, borderRadius: '999px', padding: '3px 10px'
        },
        stockCardFooter: {
            display: 'flex', gap: '14px', flexWrap: 'wrap', alignItems: 'center', marginTop: '12px', paddingTop: '10px',
            borderTop: `1px solid ${COLORS.border}`, fontSize: '11px', color: COLORS.inkFaint
        },
        chartLinkButton: {
            display: 'inline-flex', alignItems: 'center', gap: '4px', marginLeft: 'auto', padding: '4px 10px',
            borderRadius: '6px', border: `1px solid ${COLORS.accentBorder}`, background: COLORS.accentSoft,
            color: COLORS.accent, fontSize: '11px', fontWeight: '700', cursor: 'pointer'
        },
        loadingWrap: { textAlign: 'center', padding: '60px 20px' },
        spinner: {
            width: '36px', height: '36px', border: `3px solid ${COLORS.border}`, borderTop: `3px solid ${COLORS.accent}`,
            borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto'
        },
        emptyStateWrap: { textAlign: 'center', padding: '50px 20px' },
        emptyStateTitle: { fontSize: '15px', fontWeight: '700', color: COLORS.ink, margin: '10px 0 6px 0' },
        emptyStateText: { fontSize: '13px', color: COLORS.inkMuted, margin: 0, lineHeight: '1.6' },

        // ---- Stock chart modal (lightweight-charts) ----
        chartModal: {
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            background: 'rgba(15, 23, 42, 0.55)', display: 'flex', justifyContent: 'center',
            alignItems: chartFullscreen ? 'center' : (isMobile ? 'flex-start' : 'center'),
            zIndex: 10004, backdropFilter: 'blur(4px)',
            padding: chartFullscreen ? 0 : (isMobile ? '6px' : '20px')
        },
        chartModalContent: {
            background: COLORS.surface, borderRadius: '14px', border: `1px solid ${COLORS.border}`,
            boxShadow: '0 20px 60px rgba(0,0,0,0.25)', width: isMobile ? '100%' : '760px', maxWidth: '95vw',
            height: isMobile ? '94vh' : '560px', overflow: 'hidden', display: 'flex', flexDirection: 'column'
        },
        chartModalContentFullscreen: {
            background: COLORS.surface, borderRadius: 0, border: 'none', boxShadow: 'none',
            width: '100%', height: '100%', maxWidth: '100vw', maxHeight: '100vh',
            overflow: 'hidden', display: 'flex', flexDirection: 'column'
        },
        chartModalHeader: {
            display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
            padding: '16px 20px', borderBottom: `1px solid ${COLORS.border}`
        },
        chartModalTitle: { fontSize: '1.1rem', fontWeight: '700', margin: 0, color: COLORS.ink, fontFamily: COLORS.mono },
        fullscreenButtonSmall: {
            display: 'flex', alignItems: 'center', gap: '5px', padding: '7px 10px', borderRadius: '8px',
            border: `1px solid ${COLORS.border}`, background: COLORS.surface, color: COLORS.inkMuted,
            fontSize: '11px', fontWeight: '600', cursor: 'pointer', flexShrink: 0
        },
        refreshButton: {
            display: 'flex', alignItems: 'center', justifyContent: 'center', width: '30px', height: '30px',
            borderRadius: '8px', border: `1px solid ${COLORS.border}`, background: COLORS.surface,
            color: COLORS.inkMuted, cursor: 'pointer', flexShrink: 0
        },
        refreshSpinning: { animation: 'chartRefreshSpin 0.9s linear infinite' },
        chartTimeframeRow: {
            display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 20px',
            borderBottom: `1px solid ${COLORS.border}`, background: COLORS.surface,
            overflowX: 'auto', WebkitOverflowScrolling: 'touch', flexWrap: isMobile ? 'nowrap' : 'wrap'
        },
        chartTimeframeButton: {
            padding: '5px 12px', borderRadius: '999px', border: `1px solid ${COLORS.neutralBorder}`, background: COLORS.neutralSoft,
            color: COLORS.inkMuted, fontSize: '11px', fontWeight: '700', cursor: 'pointer', flexShrink: 0, whiteSpace: 'nowrap'
        },
        chartTimeframeButtonActive: { background: COLORS.accent, borderColor: COLORS.accent, color: '#fff' },
        extendedHoursNote: { fontSize: '10px', color: COLORS.inkFaint, padding: '0 20px 8px', background: COLORS.surface },
        chartModalBody: { flex: 1, background: MAP_COLORS.void, position: 'relative', display: 'flex', flexDirection: 'column', minHeight: isMobile ? '380px' : '260px' },
        chartCanvas: { width: '100%', height: '100%' },

        // Superimposed price/change readout, directly on the chart -- no
        // card, no border, no blur. Color-coded by direction; text-shadow
        // keeps it legible over the candles underneath.
        chartHud: {
            position: 'absolute', top: '10px', left: '14px', zIndex: 5, pointerEvents: 'none',
            maxWidth: isMobile ? '55%' : '320px', textShadow: '0 1px 4px rgba(0,0,0,0.85)'
        },
        chartHudRow: { display: 'flex', alignItems: 'baseline', gap: '8px', flexWrap: 'wrap' },
        chartHudPrice: (up) => ({ fontFamily: COLORS.mono, fontSize: '19px', fontWeight: '700', color: up ? '#4ade80' : '#f87171' }),
        chartHudChange: (up) => ({ fontFamily: COLORS.mono, fontSize: '12px', fontWeight: '700', color: up ? '#4ade80' : '#f87171' }),
        chartHudMeta: { fontSize: '10px', color: '#cbd5e1', marginTop: '3px' },

        // Superimposed position (entry/SL/TP/live P&L) readout -- top-right,
        // same free-floating no-box treatment as the price HUD.
        positionHud: {
            position: 'absolute', top: '10px', right: '14px', zIndex: 5, pointerEvents: 'none',
            maxWidth: isMobile ? '42%' : '260px', textShadow: '0 1px 4px rgba(0,0,0,0.85)',
            display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'flex-end'
        },
        positionHudRow: { display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', justifyContent: 'flex-end' },
        positionDirectionBadge: (isLong) => ({
            fontSize: '9px', fontWeight: '800', letterSpacing: '0.4px', padding: '1px 6px', borderRadius: '4px',
            background: isLong ? 'rgba(74, 222, 128, 0.18)' : 'rgba(248, 113, 113, 0.18)',
            color: isLong ? '#4ade80' : '#f87171'
        }),
        positionHudEntry: { fontFamily: COLORS.mono, fontSize: '10px', color: '#e2e8f0' },
        positionHudPnl: (up) => ({ fontFamily: COLORS.mono, fontSize: '11px', fontWeight: '700', color: up ? '#4ade80' : '#f87171' }),
        positionHudMore: { fontSize: '9px', color: '#94a3b8' },

        // ---- Media center ----
        mediaCenterButton: {
            position: 'fixed', bottom: '30px', right: '30px', width: isMobile ? '50px' : '58px',
            height: isMobile ? '50px' : '58px', borderRadius: '50%', background: COLORS.ink,
            border: '3px solid #fff', color: '#fff', fontSize: isMobile ? '18px' : '20px', cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(0,0,0,0.2)', display: 'flex', justifyContent: 'center', alignItems: 'center',
            zIndex: 9998, transition: 'transform 0.2s ease'
        },
        assetExplorerButton: {
            position: 'fixed', bottom: '30px', right: isMobile ? '160px' : '190px',
            width: isMobile ? '50px' : '58px', height: isMobile ? '50px' : '58px', borderRadius: '50%',
            background: '#7c3aed', border: '3px solid #fff', color: '#fff', cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(124, 58, 237, 0.35)', display: 'flex', justifyContent: 'center',
            alignItems: 'center', zIndex: 9998, transition: 'transform 0.2s ease'
        },
        mediaCenterModal: {
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(15, 23, 42, 0.5)',
            display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10002, backdropFilter: 'blur(4px)'
        },
        mediaCenterContent: {
            background: COLORS.surface, borderRadius: '14px', border: `1px solid ${COLORS.border}`,
            boxShadow: '0 20px 60px rgba(0,0,0,0.18)', width: isMobile ? '95%' : '900px', maxWidth: '95vw',
            maxHeight: '90vh', overflow: 'auto', padding: isMobile ? '15px' : '25px'
        },
        mediaCenterHeader: {
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px',
            paddingBottom: '14px', borderBottom: `1px solid ${COLORS.border}`
        },
        mediaCenterTitle: { fontSize: isMobile ? '1.05rem' : '1.2rem', fontWeight: '700', color: COLORS.ink, margin: 0 },
        mediaCloseButton: {
            background: 'none', border: 'none', color: COLORS.inkMuted, fontSize: '28px', cursor: 'pointer',
            padding: '0', width: '36px', height: '36px', borderRadius: '6px', display: 'flex',
            justifyContent: 'center', alignItems: 'center', fontWeight: '300'
        },
        mediaInputContainer: { marginBottom: '16px' },
        mediaInput: {
            width: '100%', padding: isMobile ? '10px 14px' : '11px 16px', background: COLORS.bg,
            border: `1px solid ${COLORS.border}`, borderRadius: '8px', color: COLORS.ink,
            fontSize: isMobile ? '12px' : '14px', outline: 'none', marginBottom: '10px'
        },
        mediaButton: {
            width: '100%', padding: isMobile ? '10px 20px' : '11px 24px', background: COLORS.accent, border: 'none',
            borderRadius: '8px', color: '#fff', fontSize: isMobile ? '12px' : '14px', fontWeight: '600', cursor: 'pointer'
        },
        videoContainer: {
            position: 'relative', width: '100%', paddingBottom: '56.25%', height: 0, overflow: 'hidden',
            borderRadius: '10px', border: `1px solid ${COLORS.border}`
        },
        videoIframe: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' },
        mediaWarning: {
            background: COLORS.neutralSoft, border: `1px solid ${COLORS.border}`, borderRadius: '8px',
            padding: isMobile ? '10px' : '12px', marginBottom: '14px', fontSize: isMobile ? '12px' : '13px',
            color: COLORS.inkMuted
        }
    }), [isMobile, view3D, chartFullscreen]);

    const getGlobeSize = () => {
        const baseSize = isMobile ?
            Math.min(window.innerWidth - 40, 400) :
            Math.min(window.innerWidth * 0.45, window.innerHeight * 0.55, 650);

        return { width: baseSize, height: baseSize };
    };

    const currentTheme = globeThemes[globeTheme];
    const globeSize = getGlobeSize();

    useEffect(() => {
        if (globeRef.current && globeRef.current.controls) {
            globeRef.current.controls().autoRotate = autoRotate;
            globeRef.current.controls().autoRotateSpeed = 0.5;
        }
    }, [autoRotate]);

    const LoadingOverlay = () => (
        <div style={styles.loadingOverlay}>
            <div style={styles.loadingContent}>
                <div style={styles.loadingSpinner}></div>
                <div style={styles.loadingText}>Loading {selectedCountry}...</div>
            </div>
        </div>
    );

    return (
        <div style={styles.container}>
            <Header />
            <SideNavs />

            <div style={styles.mainPageBody}>
                <div style={styles.mainBodyInfo}>
                    <div style={styles.pageHeader}>
                        <h1 style={styles.pageTitle}>Global stock map</h1>
                        <p style={styles.pageSubtitle}>Click a country to see the stock picks you've saved for it.</p>
                        <div style={styles.summaryBar}>
                            <TrendingUp size={14} color={COLORS.accent} />
                            {dataSummary.totalCountries} countries · {dataSummary.totalPicks} stock picks saved
                        </div>
                    </div>

                    <div style={styles.controlsContainer}>
                        <div style={styles.toggleContainer}>
                            <button
                                style={{ ...styles.toggleButton, ...(view3D ? styles.inactiveButton : styles.activeButton) }}
                                onClick={() => setView3D(false)}
                            >
                                2D map
                            </button>
                            <button
                                style={{ ...styles.toggleButton, ...(view3D ? styles.activeButton : styles.inactiveButton) }}
                                onClick={() => setView3D(true)}
                            >
                                3D globe
                            </button>
                        </div>

                        {view3D && (
                            <div style={styles.themeContainer}>
                                <span style={styles.controlLabel}>View:</span>
                                {Object.entries(globeThemes).map(([key, theme]) => (
                                    <button
                                        key={key}
                                        style={{ ...styles.themeButton, ...(globeTheme === key ? styles.activeButton : styles.inactiveButton) }}
                                        onClick={() => setGlobeTheme(key)}
                                    >
                                        {theme.name}
                                    </button>
                                ))}
                            </div>
                        )}

                        {!view3D && (
                            <button style={{ ...styles.toggleButton, ...styles.inactiveButton }} onClick={resetZoom}>
                                Reset view
                            </button>
                        )}

                        {view3D && (
                            <button
                                style={{ ...styles.toggleButton, ...(autoRotate ? styles.activeButton : styles.inactiveButton) }}
                                onClick={() => setAutoRotate(!autoRotate)}
                            >
                                {autoRotate ? 'Stop rotation' : 'Auto rotate'}
                            </button>
                        )}
                    </div>

                    {view3D && (
                        <div style={styles.searchContainer}>
                            <div style={styles.searchInputGroup}>
                                <input
                                    type="text"
                                    placeholder="Search for a country..."
                                    value={searchCountry}
                                    onChange={(e) => setSearchCountry(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleCountrySearch()}
                                    style={styles.searchInput}
                                />
                                <button onClick={handleCountrySearch} style={styles.searchButton}>Search</button>
                            </div>
                        </div>
                    )}

                    {selectedCountry && !showStockModal && (
                        <div style={styles.countryLabel}>Selected: {selectedCountry}</div>
                    )}

                    <div style={styles.viewContainer}>
                        {view3D ? (
                            <Globe
                                ref={globeRef}
                                globeImageUrl={currentTheme.globeImage}
                                bumpImageUrl={currentTheme.bumpImage}
                                backgroundImageUrl={currentTheme.background}

                                polygonsData={worldData.features || []}
                                polygonAltitude={0.006}
                                polygonCapColor={(d) => {
                                    const name = normalizeCountryName(d.properties?.NAME || d.properties?.name);
                                    if (name === selectedCountry) return 'rgba(37, 99, 235, 0.55)';
                                    if (countryHasData(name)) return 'rgba(16, 185, 129, 0.28)';
                                    return 'rgba(148, 163, 184, 0.18)';
                                }}
                                polygonSideColor={() => 'rgba(37, 99, 235, 0.08)'}
                                polygonStrokeColor={() => 'rgba(148, 163, 184, 0.4)'}
                                polygonLabel={({ properties }) => `
                                    <div style="
                                        background: #ffffff;
                                        color: #111827;
                                        padding: 8px 14px;
                                        border-radius: 6px;
                                        font-size: 13px;
                                        font-weight: 600;
                                        max-width: 200px;
                                        border: 1px solid #e4e7ec;
                                    ">
                                        ${properties?.NAME || properties?.name || 'Unknown territory'}
                                    </div>
                                `}
                                onPolygonClick={handlePolygonClick}

                                pointsData={countries}
                                pointAltitude={0.01}
                                pointColor={() => COLORS.accent}
                                pointRadius={isMobile ? 0.15 : 0.2}
                                pointLabel={d => {
                                    const fullCountry = resolveCountryName(d);
                                    const hasData = countryHasData(fullCountry);
                                    return `
                                        <div style="
                                            background: #ffffff;
                                            color: #111827;
                                            padding: 10px 14px;
                                            border-radius: 8px;
                                            font-size: 12px;
                                            border: 1px solid #e4e7ec;
                                        ">
                                            <div style="font-weight: 700; margin-bottom: 3px;">${d.name}</div>
                                            <div style="color: #5b6472; margin-bottom: 4px;">${d.type} hub · ${fullCountry}</div>
                                            <div style="color: ${hasData ? '#16a34a' : '#94a3b8'}; font-weight: 600;">
                                                ${hasData ? 'Stock picks saved' : 'No picks saved yet'}
                                            </div>
                                        </div>
                                    `;
                                }}
                                onPointClick={(point) => handleCountryClick(resolveCountryName(point))}

                                showAtmosphere={true}
                                atmosphereColor="#2563eb"
                                atmosphereAltitude={0.2}

                                enablePointerInteraction={true}

                                controlsAutoRotate={autoRotate}
                                controlsAutoRotateSpeed={0.5}
                                controlsEnableZoom={true}
                                controlsEnablePan={true}

                                animateIn={true}

                                width={globeSize.width}
                                height={globeSize.height}
                            />
                        ) : (
                            <div ref={mapContainerRef} style={styles.mapContainer}>
                                <svg ref={svgRef} style={styles.svgMap}></svg>
                            </div>
                        )}

                        {loadingStockData && !showStockModal && <LoadingOverlay />}
                    </div>
                </div>
            </div>

            <button
                style={styles.mediaCenterButton}
                onClick={() => setShowMediaCenter(true)}
                title="Media center"
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.08)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
            >
                ▶
            </button>

            <button
                style={styles.assetExplorerButton}
                onClick={() => setShowAssetExplorer(true)}
                title="Asset explorer"
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.08)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
            >
                <BarChart3 size={22} />
            </button>

            <button
                style={styles.lauraButton}
                onClick={() => {
                    setShowLaura(true);
                    if (lauraMessages.length === 0) {
                        handleNewLauraConversation();
                    }
                }}
                title="Laura AI assistant"
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.08)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
            >
                L
            </button>

            {showMediaCenter && <MediaCenterModal />}
            {showStockModal && renderCountryStockModal()}
            {chartStock && <StockChartPanel />}
            {showMultiChart && <MultiChartGrid />}
            {showAssetExplorer && (
                <AssetExplorerModal
                    isOpen={showAssetExplorer}
                    onClose={() => setShowAssetExplorer(false)}
                    baseUrl={baseUrl}
                />
            )}
            {showLaura && <LauraModalContent
                isMobile={isMobile}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                searchLoading={searchLoading}
                searchError={searchError}
                handleGeopoliticalSearch={handleGeopoliticalSearch}
                lauraMessages={lauraMessages}
                lauraLoading={lauraLoading}
                messagesEndRef={messagesEndRef}
                lauraError={lauraError}
                availableVoices={availableVoices}
                selectedVoice={selectedVoice}
                handleVoiceChange={handleVoiceChange}
                imagePreview={imagePreview}
                handleImageUpload={handleImageUpload}
                setSelectedImage={setSelectedImage}
                setImagePreview={setImagePreview}
                lauraInput={lauraInput}
                setLauraInput={setLauraInput}
                handleLauraQuery={handleLauraQuery}
                handleNewLauraConversation={handleNewLauraConversation}
                isSpeaking={isSpeaking}
                speakMessage={speakMessage}
                stopSpeaking={stopSpeaking}
                styles={styles}
                setShowLaura={setShowLaura}
                fileInputRef={fileInputRef}
            />}

            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }

                @keyframes chartRefreshSpin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(-360deg); }
                }

                *::-webkit-scrollbar { width: 8px; height: 8px; }
                *::-webkit-scrollbar-track { background: ${COLORS.bg}; }
                *::-webkit-scrollbar-thumb { background: ${COLORS.borderStrong}; border-radius: 4px; }
                *::-webkit-scrollbar-thumb:hover { background: ${COLORS.inkFaint}; }

                input::placeholder { color: ${COLORS.inkFaint}; }
                button:active { transform: scale(0.98); }
            `}</style>
        </div>
    );
}