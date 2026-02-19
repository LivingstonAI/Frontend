import Header from "./header";
import SideNavs from "./side_navs";
import AIModelBuilder from "./ai_model_builder";
import React, { useEffect, useState, useRef, useCallback } from "react";

// Light theme (default)
const lightTheme = {
  bg: {
    primary: '#ffffff',
    secondary: '#f8fafc',
    tertiary: '#f1f5f9',
    elevated: '#ffffff',
    modal: '#ffffff'
  },
  blue: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a'
  },
  accent: {
    cyan: '#06b6d4',
    purple: '#8b5cf6',
    green: '#10b981',
    red: '#ef4444',
    orange: '#f59e0b',
    pink: '#ec4899'
  },
  text: {
    primary: '#0f172a',
    secondary: '#475569',
    tertiary: '#94a3b8',
    muted: '#cbd5e1'
  },
  border: {
    light: '#e2e8f0',
    medium: '#cbd5e1',
    heavy: '#94a3b8'
  }
};

// Dark theme
const darkTheme = {
  bg: {
    primary: '#0a0e1a',
    secondary: '#121827',
    tertiary: '#1a2234',
    elevated: '#1e2740',
    modal: '#0f1421'
  },
  blue: {
    50: '#e6f1ff',
    100: '#b3d9ff',
    200: '#80c1ff',
    300: '#4da9ff',
    400: '#1a91ff',
    500: '#0077e6',
    600: '#005db3',
    700: '#004380',
    800: '#00294d',
    900: '#000f1a'
  },
  accent: {
    cyan: '#00d4ff',
    purple: '#a78bfa',
    green: '#10b981',
    red: '#ef4444',
    orange: '#f59e0b',
    pink: '#ec4899'
  },
  text: {
    primary: '#e5e7eb',
    secondary: '#9ca3af',
    tertiary: '#6b7280',
    muted: '#4b5563'
  },
  border: {
    light: '#1f2937',
    medium: '#374151',
    heavy: '#4b5563'
  }
};

const getStyles = (theme) => ({
  pageContainer: {
    minHeight: '100vh',
    background: `linear-gradient(135deg, ${theme.bg.secondary} 0%, ${theme.blue[50]} 100%)`,
    color: theme.text.primary
  },
  mainContainer: {
    width: '100%',
    maxWidth: '100%',
    margin: 0,
    padding: '0 20px'
  },
  header: {
    background: theme.bg.elevated,
    color: theme.text.primary,
    padding: '20px 25px',
    borderRadius: '12px',
    marginBottom: '20px',
    textAlign: 'center',
    fontSize: '1.8rem',
    fontWeight: '700',
    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
    border: `1px solid ${theme.border.light}`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '15px'
  },
  themeToggle: {
    padding: '10px 20px',
    background: theme.bg.tertiary,
    border: `2px solid ${theme.border.medium}`,
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '600',
    color: theme.text.primary,
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  tradingModeSelector: {
    display: 'flex',
    gap: '15px',
    marginBottom: '20px',
    flexWrap: 'wrap',
    alignItems: 'center',
    background: theme.bg.elevated,
    padding: '15px',
    borderRadius: '12px',
    border: `1px solid ${theme.border.light}`,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
  },
  modeButton: {
    padding: '12px 24px',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '0.95rem',
    fontWeight: '700',
    transition: 'all 0.3s ease',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  modeButtonActive: {
    background: `linear-gradient(135deg, ${theme.blue[500]} 0%, ${theme.blue[600]} 100%)`,
    color: 'white',
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 16px rgba(59, 130, 246, 0.4)'
  },
  modeButtonInactive: {
    background: theme.bg.tertiary,
    color: theme.text.secondary,
    border: `2px solid ${theme.border.medium}`
  },
  controlPanel: {
    background: theme.bg.elevated,
    padding: '20px',
    borderRadius: '12px',
    marginBottom: '20px',
    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
    border: `1px solid ${theme.border.light}`
  },
  sectionTitle: {
    fontSize: '1.1rem',
    fontWeight: '700',
    color: theme.blue[700],
    marginBottom: '12px',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  chartContainer: {
    background: theme.bg.elevated,
    borderRadius: '15px',
    padding: '25px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    border: `1px solid ${theme.border.light}`,
    marginBottom: '25px',
    position: 'relative'
  },
  chartTitle: {
    fontSize: '1.4rem',
    fontWeight: '700',
    color: theme.text.primary,
    marginBottom: '15px',
    textAlign: 'center'
  },
  chartControls: {
    display: 'flex',
    gap: '10px',
    marginBottom: '15px',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center'
  },
  priceDisplay: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: theme.bg.tertiary,
    padding: '15px 20px',
    borderRadius: '10px',
    marginBottom: '15px',
    border: `1px solid ${theme.border.light}`,
    flexWrap: 'wrap',
    gap: '15px'
  },
  currentPrice: {
    fontSize: '1.8rem',
    fontWeight: '800',
    color: theme.blue[600]
  },
  modal: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px',
    backdropFilter: 'blur(4px)'
  },
  modalContent: {
    background: theme.bg.modal,
    borderRadius: '20px',
    padding: '30px',
    maxWidth: '800px',
    width: '100%',
    maxHeight: '90vh',
    overflow: 'auto',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
    border: `2px solid ${theme.border.medium}`
  },
  tradeModalOverlay: {
    position: 'absolute',
    top: '80px',
    left: '25px',
    width: '350px',
    maxWidth: 'calc(100% - 50px)',
    background: theme.bg.elevated,
    borderRadius: '15px',
    padding: '20px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
    border: `2px solid ${theme.blue[400]}`,
    zIndex: 10
  },
  formGroup: {
    marginBottom: '12px'
  },
  label: {
    display: 'block',
    marginBottom: '6px',
    fontSize: '0.85rem',
    fontWeight: '600',
    color: theme.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  input: {
    width: '100%',
    padding: '10px',
    background: theme.bg.tertiary,
    border: `2px solid ${theme.border.medium}`,
    borderRadius: '8px',
    color: theme.text.primary,
    fontSize: '0.95rem',
    transition: 'all 0.3s ease',
    outline: 'none',
    boxSizing: 'border-box'
  },
  select: {
    width: '100%',
    padding: '10px',
    background: theme.bg.tertiary,
    border: `2px solid ${theme.border.medium}`,
    borderRadius: '8px',
    color: theme.text.primary,
    fontSize: '0.95rem',
    cursor: 'pointer',
    outline: 'none',
    boxSizing: 'border-box'
  },
  buttonPrimary: {
    width: '100%',
    padding: '12px',
    background: `linear-gradient(135deg, ${theme.blue[500]} 0%, ${theme.blue[600]} 100%)`,
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '0.95rem',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
  },
  buttonSecondary: {
    padding: '10px 20px',
    background: theme.bg.tertiary,
    color: theme.text.primary,
    border: `2px solid ${theme.border.medium}`,
    borderRadius: '8px',
    fontSize: '0.9rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  searchBar: {
    width: '100%',
    padding: '14px',
    background: theme.bg.tertiary,
    border: `2px solid ${theme.border.medium}`,
    borderRadius: '12px',
    color: theme.text.primary,
    fontSize: '1rem',
    marginBottom: '20px',
    outline: 'none',
    transition: 'all 0.3s ease',
    boxSizing: 'border-box'
  },
  assetButton: {
    margin: '5px',
    padding: '10px 18px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '600',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    textTransform: 'uppercase',
    letterSpacing: '0.3px'
  },
  assetButtonActive: {
    background: `linear-gradient(135deg, ${theme.blue[500]} 0%, ${theme.blue[600]} 100%)`,
    color: 'white',
    transform: 'translateY(-2px) scale(1.05)',
    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)'
  },
  assetButtonInactive: {
    background: theme.bg.tertiary,
    color: theme.text.secondary,
    border: `2px solid ${theme.border.light}`
  },
  badge: {
    display: 'inline-block',
    padding: '6px 14px',
    borderRadius: '20px',
    fontSize: '0.85rem',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  statCard: {
    background: theme.bg.tertiary,
    padding: '20px',
    borderRadius: '12px',
    textAlign: 'center',
    border: `1px solid ${theme.border.light}`,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
  },
  statValue: {
    fontSize: '2rem',
    fontWeight: '800',
    marginBottom: '8px'
  },
  statLabel: {
    fontSize: '0.9rem',
    color: theme.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  tradeCard: {
    background: theme.bg.tertiary,
    padding: '20px',
    borderRadius: '12px',
    marginBottom: '15px',
    border: `1px solid ${theme.border.light}`,
    transition: 'all 0.3s ease'
  },
  loadingSpinner: {
    width: '50px',
    height: '50px',
    border: `4px solid ${theme.border.light}`,
    borderTop: `4px solid ${theme.blue[500]}`,
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    margin: '20px auto'
  }
});
// ─── Open Position Card ────────────────────────────────────────────────────
function OpenPositionCard({ trade, currentPrice, theme, styles, onNavigate, onEdit, onClose, isCurrentAsset }) {
    const entryPrice = parseFloat(trade.entry_price);
    const qty        = parseFloat(trade.quantity);

    let unrealisedPnL = null;
    let unrealisedPct = null;

    if (currentPrice && entryPrice) {
        if (trade.order_type === 'BUY') {
            unrealisedPnL = (currentPrice - entryPrice) * qty;
            unrealisedPct = ((currentPrice - entryPrice) / entryPrice) * 100;
        } else {
            unrealisedPnL = (entryPrice - currentPrice) * qty;
            unrealisedPct = ((entryPrice - currentPrice) / entryPrice) * 100;
        }
    }

    const pnlColour = unrealisedPnL === null ? theme.text.tertiary
        : unrealisedPnL >= 0 ? theme.accent.green : theme.accent.red;

    return (
        <div style={{
            background: theme.bg.tertiary,
            border: `1px solid ${isCurrentAsset ? theme.blue[400] : theme.border.light}`,
            borderLeft: `5px solid ${trade.order_type === 'BUY' ? theme.accent.green : theme.accent.red}`,
            borderRadius: '12px',
            padding: '16px 20px',
            display: 'grid',
            gridTemplateColumns: '1fr auto',
            gap: '12px',
            alignItems: 'center'
        }}>
            {/* Left: info */}
            <div>
                {/* Asset name — clickable */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
                    <button
                        onClick={onNavigate}
                        style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: 0,
                            color: theme.blue[isCurrentAsset ? 400 : 600],
                            fontSize: '1.05rem',
                            fontWeight: '700',
                            textDecoration: 'underline',
                            textUnderlineOffset: '3px'
                        }}
                        title="Navigate to this asset's chart"
                    >
                        {trade.asset_name || trade.asset_symbol}
                    </button>
                    <span style={{ fontSize: '0.8rem', color: theme.text.tertiary }}>{trade.asset_symbol}</span>
                    {isCurrentAsset && (
                        <span style={{ fontSize: '0.75rem', background: theme.blue[500], color: 'white', padding: '2px 8px', borderRadius: '10px', fontWeight: '600' }}>
                            Viewing
                        </span>
                    )}
                    <span style={{
                        fontSize: '0.8rem',
                        background: trade.order_type === 'BUY' ? `${theme.accent.green}25` : `${theme.accent.red}25`,
                        color: trade.order_type === 'BUY' ? theme.accent.green : theme.accent.red,
                        padding: '2px 10px', borderRadius: '10px', fontWeight: '700'
                    }}>
                        {trade.order_type}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: theme.text.tertiary }}>
                        {trade.asset_class}
                    </span>
                </div>

                {/* Price row */}
                <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', fontSize: '0.9rem' }}>
                    <div>
                        <span style={{ color: theme.text.tertiary }}>Entry </span>
                        <strong style={{ color: theme.text.primary }}>${entryPrice.toFixed(2)}</strong>
                    </div>
                    {currentPrice && (
                        <div>
                            <span style={{ color: theme.text.tertiary }}>Current </span>
                            <strong style={{ color: theme.blue[600] }}>${currentPrice.toFixed(2)}</strong>
                        </div>
                    )}
                    <div>
                        <span style={{ color: theme.text.tertiary }}>Qty </span>
                        <strong style={{ color: theme.text.primary }}>{qty}</strong>
                    </div>
                    {trade.stop_loss && (
                        <div>
                            <span style={{ color: theme.text.tertiary }}>SL </span>
                            <strong style={{ color: theme.accent.red }}>${parseFloat(trade.stop_loss).toFixed(2)}</strong>
                        </div>
                    )}
                    {trade.take_profit && (
                        <div>
                            <span style={{ color: theme.text.tertiary }}>TP </span>
                            <strong style={{ color: theme.accent.green }}>${parseFloat(trade.take_profit).toFixed(2)}</strong>
                        </div>
                    )}
                </div>

                {/* Unrealised P&L */}
                {unrealisedPnL !== null && (
                    <div style={{ marginTop: '8px', fontSize: '0.95rem', fontWeight: '700', color: pnlColour }}>
                        Unrealised P&L: {unrealisedPnL >= 0 ? '+' : ''}${unrealisedPnL.toFixed(2)} ({unrealisedPct >= 0 ? '+' : ''}{unrealisedPct.toFixed(2)}%)
                    </div>
                )}
                {!currentPrice && (
                    <div style={{ marginTop: '8px', fontSize: '0.85rem', color: theme.text.tertiary, fontStyle: 'italic' }}>
                        Navigate to this asset to see live P&L
                    </div>
                )}

                <div style={{ marginTop: '6px', fontSize: '0.8rem', color: theme.text.tertiary }}>
                    Opened {new Date(trade.entry_timestamp).toLocaleString()}
                </div>
            </div>

            {/* Right: action buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '120px' }}>
                <button
                    onClick={onNavigate}
                    style={{
                        ...styles.buttonSecondary,
                        padding: '8px 14px',
                        fontSize: '0.85rem',
                        background: `linear-gradient(135deg, ${theme.blue[500]} 0%, ${theme.blue[600]} 100%)`,
                        color: 'white',
                        border: 'none',
                        whiteSpace: 'nowrap'
                    }}
                >
                    📈 View Chart
                </button>
                <button
                    onClick={onEdit}
                    style={{
                        ...styles.buttonSecondary,
                        padding: '8px 14px',
                        fontSize: '0.85rem',
                        whiteSpace: 'nowrap'
                    }}
                >
                    ✏️ Edit
                </button>
                <button
                    onClick={onClose}
                    style={{
                        ...styles.buttonSecondary,
                        padding: '8px 14px',
                        fontSize: '0.85rem',
                        background: theme.accent.red,
                        color: 'white',
                        border: 'none',
                        whiteSpace: 'nowrap'
                    }}
                >
                    🔴 Close
                </button>
            </div>
        </div>
    );
}

export default function Charts() {
    const BACKEND_API_URL = 'https://backend-production-c0ab.up.railway.app';
    
    const chartContainerRef = useRef(null);
    const chartRef = useRef(null);
    const candlestickSeriesRef = useRef(null);
    const lineSeriesRef = useRef(null);
    const backtestIntervalRef = useRef(null);
    const lastScrollPositionRef = useRef(null);
    const batchOnCompleteRef = useRef(null); // called by backtest loop when all candles exhausted
    
    // Theme state
    const [isDarkTheme, setIsDarkTheme] = useState(false);
    const theme = isDarkTheme ? darkTheme : lightTheme;
    const styles = getStyles(theme);
    
    const [tradingMode, setTradingMode] = useState('LIVE');
    const [selectedAsset, setSelectedAsset] = useState('BTCUSD');
    const [selectedAssetInfo, setSelectedAssetInfo] = useState(null);
    const [chartType, setChartType] = useState('candlestick');
    const [timeframe, setTimeframe] = useState('1H');
    const [isLoading, setIsLoading] = useState(true);
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const [tvLoaded, setTvLoaded] = useState(false);
    const [currentPrice, setCurrentPrice] = useState(0);
    const [priceChange, setPriceChange] = useState(0);
    const [marketData, setMarketData] = useState([]);
    const [error, setError] = useState('');
    
    // Trade execution states
    const [showTradePanel, setShowTradePanel] = useState(false);
    const [orderType, setOrderType] = useState('BUY');
    const [quantity, setQuantity] = useState(1);
    const [stopLoss, setStopLoss] = useState('');
    const [takeProfit, setTakeProfit] = useState('');
    const [slPct, setSlPct] = useState('');
    const [tpPct, setTpPct] = useState('');
    const [tradeNotes, setTradeNotes] = useState('');
    
    // Trade history states
    const [tradeHistory, setTradeHistory] = useState([]);
    const [showTradeHistory, setShowTradeHistory] = useState(false);
    const [tradeStats, setTradeStats] = useState(null);
    
    // Asset selection modal
    const [showAssetModal, setShowAssetModal] = useState(false);

    // Backtest watchlist
    const [showWatchlistModal, setShowWatchlistModal] = useState(false);
    const [watchlistAssets, setWatchlistAssets]       = useState([]);
    const [watchlistLoading, setWatchlistLoading]     = useState(false);

    // Batch "Test All" state
    const [batchTestRunning, setBatchTestRunning]         = useState(false);
    const [batchTestQueue,   setBatchTestQueue]           = useState([]);
    const [batchTestCurrent, setBatchTestCurrent]         = useState(null);
    const [batchTestResults, setBatchTestResults]         = useState([]);
    const [batchTestStopped, setBatchTestStopped]         = useState(false);
    const [showBatchModelPicker, setShowBatchModelPicker] = useState(false);
    const [batchTestModel,       setBatchTestModel]       = useState(null); // model chosen for this batch run
    const [batchTestTp,          setBatchTestTp]          = useState('8');  // TP % for entire batch
    const [batchTestSl,          setBatchTestSl]          = useState('4');  // SL % for entire batch
    const [batchAssetLimit,      setBatchAssetLimit]      = useState('');   // limit number of assets (blank = all)

    // Timeframe sensitivity test state
    const [tfSensitivityMode,    setTfSensitivityMode]    = useState(false);
    const [tfSensitivityQueue,   setTfSensitivityQueue]   = useState([]);
    const [tfSensitivityResults, setTfSensitivityResults] = useState([]);
    const [showTfResults,        setShowTfResults]         = useState(false);

    // Generated code viewer (for AI backtest)
    const [showGeneratedCode,    setShowGeneratedCode]    = useState(false);
    const [generatedCodeData,    setGeneratedCodeData]    = useState(null); // {code, modelName}
    const [watchlistAddForm, setWatchlistAddForm]     = useState({ symbol: '', name: '', asset_class: 'Stocks', yfinance_symbol: '', notes: '' });
    const [watchlistAddOpen, setWatchlistAddOpen]     = useState(false);
    const [watchlistSaving, setWatchlistSaving]       = useState(false);
    const [assetSearchQuery, setAssetSearchQuery] = useState('');
    const [allAssets, setAllAssets] = useState({});
    
    // Overall performance states
    const [showOverallPerformance, setShowOverallPerformance] = useState(false);
    const [overallStats, setOverallStats] = useState(null);
    const [assetClassStats, setAssetClassStats] = useState({});
    const [assetBreakdown, setAssetBreakdown] = useState([]);
    
    // Open positions across all assets
    const [allOpenPositions, setAllOpenPositions] = useState([]);
    const [showOpenPositions, setShowOpenPositions] = useState(false);
    const [loadingOpenPositions, setLoadingOpenPositions] = useState(false);

    // Market Stability Score panel
    const [mssData, setMssData] = useState(null);
    const [loadingMss, setLoadingMss] = useState(false);
    const [showMssPanel, setShowMssPanel] = useState(false);
    const [mssLookback, setMssLookback] = useState(60);
    
    // Loading and error states
    const [isExecutingTrade, setIsExecutingTrade] = useState(false);
    const [errorMessage, setErrorMessage]   = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // ── Toast notification system ─────────────────────────────────────────────
    const [toasts, setToasts] = useState([]);
    const toastIdRef = useRef(0);

    const addToast = useCallback((message, type = 'info', duration = 3500) => {
        const id = ++toastIdRef.current;
        setToasts(prev => [...prev, { id, message, type, duration }]);
        setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), duration + 400);
    }, []);

    // Intercept the existing setters so every existing call site becomes a toast automatically
    const wrappedSetSuccess = useCallback((msg) => {
        setSuccessMessage(msg);
        if (msg) addToast(msg, 'success');
    }, [addToast]);

    const wrappedSetError = useCallback((msg) => {
        setErrorMessage(msg);
        if (msg) addToast(msg, 'error');
    }, [addToast]);
    
    // Edit position state
    const [editingTrade, setEditingTrade] = useState(null);
    const [editForm, setEditForm] = useState({});
    
    // Stock info states
    const [showStockInfo, setShowStockInfo] = useState(false);
    const [stockInfo, setStockInfo] = useState(null);
    const [loadingStockInfo, setLoadingStockInfo] = useState(false);
    
    // LLM Model Creator states
    const [showModelCreator, setShowModelCreator] = useState(false);
    const [modelPrompt, setModelPrompt] = useState('');
    const [generatedCode, setGeneratedCode] = useState('');
    const [isGeneratingCode, setIsGeneratingCode] = useState(false);
    const [OPENAI_API_KEY, setOPENAI_API_KEY] = useState('');
    
    // Backtest states
    const [backtestMode, setBacktestMode] = useState(false);
    const [backtestSession, setBacktestSession] = useState(null);
    const [backtestSpeed, setBacktestSpeed] = useState(1);
    const [backtestCurrentIndex, setBacktestCurrentIndex] = useState(0);
    const [backtestBalance, setBacktestBalance] = useState(10000);
    const [backtestTrades, setBacktestTrades] = useState([]);
    const [backtestPaused, setBacktestPaused] = useState(false);
    const [backtestData, setBacktestData] = useState([]);
    const [showSaveBacktestModal, setShowSaveBacktestModal] = useState(false);
    const [backtestTradeHistory, setBacktestTradeHistory] = useState({});
    const [backtestEquityCurve, setBacktestEquityCurve] = useState([]);

    // Strategy model selection for backtest
    const [forwardTestModels, setForwardTestModels] = useState([]);
    const [selectedBacktestModel, setSelectedBacktestModel] = useState(null);
    const [backtestModelTp, setBacktestModelTp] = useState('8');
    const [backtestModelSl, setBacktestModelSl] = useState('4');
    const [backtestModelOpen, setBacktestModelOpen] = useState(false);
    const [showBacktestConfig, setShowBacktestConfig] = useState(false);
    const [expandedModelCode, setExpandedModelCode] = useState(null);
    const [codePreviewPrompt, setCodePreviewPrompt] = useState(null); // { modelId, modelCode, modelNotes }
    const [codePreviewModel,  setCodePreviewModel]  = useState(null); // same shape — full screen view

    const timeframes = {
        '1M': { label: '1 Minute', interval: '1m', binanceInterval: '1m', yfinancePeriod: '1d', updateInterval: 10000 },
        '5M': { label: '5 Minutes', interval: '5m', binanceInterval: '5m', yfinancePeriod: '5d', updateInterval: 10000 },
        '15M': { label: '15 Minutes', interval: '15m', binanceInterval: '15m', yfinancePeriod: '1mo', updateInterval: 10000 },
        '1H': { label: '1 Hour', interval: '1h', binanceInterval: '1h', yfinancePeriod: '3mo', updateInterval: 10000 },
        '4H': { label: '4 Hours', interval: '4h', binanceInterval: '4h', yfinancePeriod: '6mo', updateInterval: 10000 },
        '1D': { label: '1 Day', interval: '1d', binanceInterval: '1d', yfinancePeriod: '2y', updateInterval: 10000 },
        '1W': { label: '1 Week', interval: '1w', binanceInterval: '1w', yfinancePeriod: '10y', updateInterval: 10000 }
    };

    const assetClasses = {
        'Crypto': [
            { symbol: 'BTCUSD', name: 'Bitcoin', binanceSymbol: 'BTCUSDT', yfinanceSymbol: 'BTC-USD', assetClass: 'Crypto' },
            { symbol: 'ETHUSD', name: 'Ethereum', binanceSymbol: 'ETHUSDT', yfinanceSymbol: 'ETH-USD', assetClass: 'Crypto' },
            { symbol: 'ADAUSD', name: 'Cardano', binanceSymbol: 'ADAUSDT', yfinanceSymbol: 'ADA-USD', assetClass: 'Crypto' },
            { symbol: 'SOLUSD', name: 'Solana', binanceSymbol: 'SOLUSDT', yfinanceSymbol: 'SOL-USD', assetClass: 'Crypto' }
        ],
        'Indices': [
            { symbol: 'SPX', name: 'S&P 500', binanceSymbol: null, yfinanceSymbol: '^GSPC', assetClass: 'Indices' },
            { symbol: 'NDX', name: 'NASDAQ 100', binanceSymbol: null, yfinanceSymbol: '^NDX', assetClass: 'Indices' },
            { symbol: 'DJI', name: 'Dow Jones', binanceSymbol: null, yfinanceSymbol: '^DJI', assetClass: 'Indices' }
        ],
        'Forex': [
            { symbol: 'EURUSD', name: 'Euro/USD', binanceSymbol: null, yfinanceSymbol: 'EURUSD=X', assetClass: 'Forex' },
            { symbol: 'GBPUSD', name: 'GBP/USD', binanceSymbol: null, yfinanceSymbol: 'GBPUSD=X', assetClass: 'Forex' },
            { symbol: 'USDJPY', name: 'USD/JPY', binanceSymbol: null, yfinanceSymbol: 'JPY=X', assetClass: 'Forex' }
        ],
        'Stocks': [
            { symbol: 'AAPL', name: 'Apple Inc.', binanceSymbol: null, yfinanceSymbol: 'AAPL', assetClass: 'Stocks' },
            { symbol: 'GOOGL', name: 'Alphabet Inc.', binanceSymbol: null, yfinanceSymbol: 'GOOGL', assetClass: 'Stocks' },
            { symbol: 'TSLA', name: 'Tesla Inc.', binanceSymbol: null, yfinanceSymbol: 'TSLA', assetClass: 'Stocks' },
            { symbol: 'MSFT', name: 'Microsoft', binanceSymbol: null, yfinanceSymbol: 'MSFT', assetClass: 'Stocks' }
        ],
        'Commodities': [
            { symbol: 'XAUUSD', name: 'Gold', binanceSymbol: null, yfinanceSymbol: 'GC=F', assetClass: 'Commodities' },
            { symbol: 'XAGUSD', name: 'Silver', binanceSymbol: null, yfinanceSymbol: 'SI=F', assetClass: 'Commodities' },
            { symbol: 'USOIL', name: 'US Oil (WTI)', binanceSymbol: null, yfinanceSymbol: 'CL=F', assetClass: 'Commodities' }
        ]
    };

    // Fetch all assets from backend
    useEffect(() => {
        const fetchAllAssets = async () => {
            try {
                const response = await fetch(`${BACKEND_API_URL}/api/mss/asset-lists/`);
                const result = await response.json();
                if (result.success) {
                    setAllAssets(result.asset_lists);
                }
            } catch (error) {
                console.error('Error fetching asset lists:', error);
            }
        };
        fetchAllAssets();
    }, []);

    // Get current asset info
    const getCurrentAssetInfo = () => {
        // First check in basic asset classes
        for (const category of Object.values(assetClasses)) {
            const asset = category.find(a => a.symbol === selectedAsset);
            if (asset) return asset;
        }
        
        // Then check in all assets loaded from backend
        for (const [category, symbols] of Object.entries(allAssets)) {
            if (symbols.includes(selectedAsset)) {
                return {
                    symbol: selectedAsset,
                    name: selectedAsset,
                    yfinanceSymbol: selectedAsset,
                    binanceSymbol: null,
                    assetClass: category.charAt(0).toUpperCase() + category.slice(1)
                };
            }
        }
        
        return { symbol: selectedAsset, name: selectedAsset, assetClass: 'Unknown' };
    };

    useEffect(() => {
        setSelectedAssetInfo(getCurrentAssetInfo());
        // Clear trade history + chart overlays when switching assets
        setTradeHistory([]);
        setTradeStats(null);
        // Clear MSS so it doesn't show stale data for previous asset
        setMssData(null);
        setShowMssPanel(false);
        // Clear chart markers + price lines for old asset
        const series = candlestickSeriesRef.current || lineSeriesRef.current;
        if (series) {
            try { series.setMarkers([]); } catch(e) {}
        }
    }, [selectedAsset, allAssets]);

    // Fetch OpenAI API key
    useEffect(() => {
        const fetchOpenAIKey = async () => {
            try {
                const response = await fetch(`${BACKEND_API_URL}/get_openai_key`);
                if (response.ok) {
                    const { OPENAI_API_KEY } = await response.json();
                    setOPENAI_API_KEY(OPENAI_API_KEY);
                }
            } catch (error) {
                console.error('Error fetching OpenAI key:', error);
            }
        };
        fetchOpenAIKey();
    }, []);
    
    // Generate model code using LLM
    const generateModelCode = async () => {
        if (!modelPrompt.trim()) {
            wrappedSetError('Please enter a description for your model');
            setTimeout(() => wrappedSetError(''), 3000);
            return;
        }
        
        setIsGeneratingCode(true);
        wrappedSetError('');
        
        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${OPENAI_API_KEY}`
                },
                body: JSON.stringify({
                    model: 'gpt-4',
                    messages: [
                        {
                            role: 'system',
                            content: 'You are an expert Python/Django developer specializing in creating trading models and backend APIs. Generate clean, production-ready code with proper error handling and documentation.'
                        },
                        {
                            role: 'user',
                            content: `Create a Django model and API endpoint for: ${modelPrompt}\n\nProvide:\n1. Django model class with all fields\n2. API view function\n3. URL pattern\n4. Brief usage instructions`
                        }
                    ],
                    temperature: 0.7,
                    max_tokens: 2000
                })
            });
            
            const data = await response.json();
            
            if (data.choices && data.choices[0]) {
                setGeneratedCode(data.choices[0].message.content);
                wrappedSetSuccess('✅ Code generated successfully!');
                setTimeout(() => wrappedSetSuccess(''), 3000);
            } else {
                wrappedSetError('Failed to generate code');
                setTimeout(() => wrappedSetError(''), 3000);
            }
        } catch (error) {
            console.error('Error generating code:', error);
            wrappedSetError(`Failed to generate code: ${error.message}`);
            setTimeout(() => wrappedSetError(''), 3000);
        } finally {
            setIsGeneratingCode(false);
        }
    };

    // Load TradingView Lightweight Charts
    useEffect(() => {
        const loadTradingViewCharts = async () => {
            if (window.LightweightCharts) {
                setTvLoaded(true);
                return;
            }

            try {
                const script = document.createElement('script');
                script.src = 'https://unpkg.com/lightweight-charts@4.1.3/dist/lightweight-charts.standalone.production.js';
                script.crossOrigin = 'anonymous';
                script.onload = () => {
                    setTimeout(() => {
                        if (window.LightweightCharts) {
                            setTvLoaded(true);
                        }
                    }, 500);
                };
                document.head.appendChild(script);
            } catch (error) {
                console.error('Error loading TradingView Lightweight Charts:', error);
                setTvLoaded(false);
            }
        };

        loadTradingViewCharts();
    }, []);

    // Fetch market data
    const fetchMarketData = async (isInitial = false) => {
        if (isInitial) {
            setIsLoading(true);
        }
        const assetInfo = getCurrentAssetInfo();
        
        try {
            let data;
            if (assetInfo.binanceSymbol) {
                const response = await fetch(
                    `https://api.binance.com/api/v3/klines?symbol=${assetInfo.binanceSymbol}&interval=${timeframes[timeframe].binanceInterval}&limit=1000`
                );
                const rawData = await response.json();
                data = Array.isArray(rawData) ? rawData.map((kline) => ({
                    time: Math.floor(kline[0] / 1000),
                    open: parseFloat(kline[1]),
                    high: parseFloat(kline[2]),
                    low: parseFloat(kline[3]),
                    close: parseFloat(kline[4]),
                    volume: parseFloat(kline[5])
                })) : [];
            } else {
                const response = await fetch(`${BACKEND_API_URL}/api/snowai-market-ohlc/`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        symbol: assetInfo.yfinanceSymbol,
                        interval: timeframes[timeframe].interval,
                        period: timeframes[timeframe].yfinancePeriod
                    })
                });
                const result = await response.json();
                data = result.data || [];
            }
            
            // Guard: never set undefined/null — always an array
            if (!Array.isArray(data) || data.length === 0) {
                console.warn(`fetchMarketData: no data for ${assetInfo.symbol}`);
                return;
            }

            setMarketData(data);
            setBacktestData(data);
            
            const latest = data[data.length - 1];
            const first  = data[0];
            setCurrentPrice(latest.close);
            setPriceChange(((latest.close - first.close) / first.close) * 100);
            
        } catch (error) {
            console.error('Error fetching market data:', error);
            setError(`Failed to fetch data: ${error.message}`);
        } finally {
            if (isInitial) {
                setIsLoading(false);
                setIsInitialLoad(false);
            }
        }
    };

    useEffect(() => {
        if (tvLoaded && tradingMode === 'LIVE' && !backtestMode) {
            fetchMarketData(true); // Initial load with loading spinner
            
            const interval = setInterval(() => {
                fetchMarketData(false); // Subsequent updates without loading spinner
            }, timeframes[timeframe].updateInterval);
            
            return () => clearInterval(interval);
        }
    }, [selectedAsset, timeframe, tvLoaded, tradingMode, backtestMode]);

    // Initialize chart ONCE
    useEffect(() => {
        if (!tvLoaded || !chartContainerRef.current || !Array.isArray(marketData) || marketData.length === 0) return;

        try {
            // Save current scroll position before recreating chart
            if (chartRef.current) {
                const timeScale = chartRef.current.timeScale();
                const visibleRange = timeScale.getVisibleLogicalRange();
                if (visibleRange) {
                    lastScrollPositionRef.current = visibleRange;
                }
                chartRef.current.remove();
            }
            chartContainerRef.current.innerHTML = '';

            // Create new chart
            const chart = window.LightweightCharts.createChart(chartContainerRef.current, {
                width: chartContainerRef.current.clientWidth,
                height: 500,
                layout: {
                    background: { type: 'solid', color: theme.bg.elevated },
                    textColor: theme.text.secondary,
                },
                grid: {
                    vertLines: { color: theme.border.light },
                    horzLines: { color: theme.border.light },
                },
                crosshair: {
                    mode: window.LightweightCharts.CrosshairMode.Normal,
                },
                rightPriceScale: {
                    borderColor: theme.border.medium,
                },
                timeScale: {
                    borderColor: theme.border.medium,
                    timeVisible: true,
                    secondsVisible: false,
                    rightOffset: 5,
                    barSpacing: 6,
                    minBarSpacing: 3,
                },
            });

            // Create series based on chart type
            if (chartType === 'candlestick') {
                const candleSeries = chart.addCandlestickSeries({
                    upColor: theme.accent.green,
                    downColor: theme.accent.red,
                    borderVisible: false,
                    wickUpColor: theme.accent.green,
                    wickDownColor: theme.accent.red,
                });
                candlestickSeriesRef.current = candleSeries;
                lineSeriesRef.current = null;
                
                // Set initial data
                candleSeries.setData(marketData);
            } else {
                const lineSeries = chart.addLineSeries({
                    color: theme.blue[500],
                    lineWidth: 3,
                });
                lineSeriesRef.current = lineSeries;
                candlestickSeriesRef.current = null;
                
                // Set initial data
                lineSeries.setData(marketData.map(d => ({ time: d.time, value: d.close })));
            }

            // Restore scroll position if it exists (but NOT during backtest)
            if (lastScrollPositionRef.current && !backtestMode) {
                setTimeout(() => {
                    chart.timeScale().setVisibleLogicalRange(lastScrollPositionRef.current);
                }, 100);
            } else {
                chart.timeScale().fitContent();
            }
            
            chartRef.current = chart;

        } catch (error) {
            console.error('Error initializing chart:', error);
        }
    }, [tvLoaded, chartType, Array.isArray(marketData) && marketData.length > 0, isDarkTheme]);

    // Update chart data WITHOUT recreating chart (only when data changes, not on every render)
    useEffect(() => {
        if (!chartRef.current || !Array.isArray(marketData) || marketData.length === 0) return;
        
        // Only update if we already have a series reference (chart is initialized)
        if (!candlestickSeriesRef.current && !lineSeriesRef.current) return;

        try {
            if (chartType === 'candlestick' && candlestickSeriesRef.current) {
                candlestickSeriesRef.current.setData(marketData);
            } else if (chartType === 'line' && lineSeriesRef.current) {
                lineSeriesRef.current.setData(marketData.map(d => ({ time: d.time, value: d.close })));
            }

            // Add trade markers + price lines for current asset (live only, not backtest)
            const activeSeries = candlestickSeriesRef.current || lineSeriesRef.current;
            if (activeSeries) {
                // Always clear old markers first
                try { activeSeries.setMarkers([]); } catch(e) {}

                if (tradeHistory.length > 0 && !backtestMode) {
                    const assetTrades = tradeHistory.filter(t => t.asset_symbol === selectedAsset);
                    const markers = [];

                    assetTrades.forEach(trade => {
                        if (!trade.entry_timestamp) return;
                        const entryTime = Math.floor(new Date(trade.entry_timestamp).getTime() / 1000);
                        const isBuy     = trade.order_type === 'BUY';
                        const isClosed  = trade.status === 'CLOSED';
                        const isWin     = isClosed && trade.profit_loss > 0;
                        const entryPx   = parseFloat(trade.entry_price);
                        const qty       = parseFloat(trade.quantity);

                        // Entry arrow
                        markers.push({
                            time:     entryTime,
                            position: isBuy ? 'belowBar' : 'aboveBar',
                            color:    isBuy ? theme.accent.green : theme.accent.red,
                            shape:    isBuy ? 'arrowUp' : 'arrowDown',
                            text:     `${trade.order_type} $${entryPx.toFixed(2)} ×${qty}`
                        });

                        if (isClosed && trade.exit_timestamp) {
                            const exitTime = Math.floor(new Date(trade.exit_timestamp).getTime() / 1000);
                            const pl = parseFloat(trade.profit_loss || 0);
                            markers.push({
                                time:     exitTime,
                                position: isBuy ? 'aboveBar' : 'belowBar',
                                color:    isWin ? theme.accent.green : theme.accent.red,
                                shape:    'circle',
                                text:     `EXIT ${isWin ? '+' : ''}$${pl.toFixed(2)}`
                            });
                        }

                        if (!isClosed) {
                            // Horizontal price lines for open positions
                            try {
                                activeSeries.createPriceLine({
                                    price: entryPx,
                                    color: isBuy ? theme.accent.green : theme.accent.red,
                                    lineWidth: 2,
                                    lineStyle: 0,
                                    axisLabelVisible: true,
                                    title: `${trade.order_type} Entry`
                                });
                                if (trade.stop_loss) {
                                    activeSeries.createPriceLine({
                                        price: parseFloat(trade.stop_loss),
                                        color: '#ef4444',
                                        lineWidth: 1,
                                        lineStyle: 2,
                                        axisLabelVisible: true,
                                        title: 'SL'
                                    });
                                }
                                if (trade.take_profit) {
                                    activeSeries.createPriceLine({
                                        price: parseFloat(trade.take_profit),
                                        color: '#22c55e',
                                        lineWidth: 1,
                                        lineStyle: 2,
                                        axisLabelVisible: true,
                                        title: 'TP'
                                    });
                                }
                            } catch(e) {}
                        }
                    });

                    // LightweightCharts requires markers sorted by time
                    markers.sort((a, b) => a.time - b.time);
                    try { activeSeries.setMarkers(markers); } catch(e) {}
                }
            }

            // NEVER restore scroll position during backtest
            if (!backtestMode && lastScrollPositionRef.current) {
                setTimeout(() => {
                    chartRef.current.timeScale().setVisibleLogicalRange(lastScrollPositionRef.current);
                }, 10);
            }

        } catch (error) {
            console.error('Error updating chart data:', error);
        }
    }, [marketData, tradeHistory, backtestMode, selectedAsset]);

    // Execute trade
    const executeTrade = async () => {
        if (!currentPrice) {
            wrappedSetError('Wait for price data to load');
            setTimeout(() => wrappedSetError(''), 3000);
            return;
        }

        setIsExecutingTrade(true);
        wrappedSetError('');
        wrappedSetSuccess('');

        // If in backtest mode, handle locally without API call
        if (backtestMode) {
            try {
                const tradeId = `BACKTEST_${Date.now()}`;
                // Size position to full current balance so % moves track equity correctly
                const backtestQty = backtestBalance / currentPrice;
                const newTrade = {
                    trade_id: tradeId,
                    asset_symbol: selectedAssetInfo.symbol,
                    asset_name: selectedAssetInfo.name,
                    asset_class: selectedAssetInfo.assetClass,
                    order_type: orderType,
                    entry_price: currentPrice,
                    quantity: backtestQty,
                    balance_at_entry: backtestBalance,
                    stop_loss: stopLoss ? parseFloat(stopLoss) : null,
                    take_profit: takeProfit ? parseFloat(takeProfit) : null,
                    // Store raw % targets if they were entered as pct
                    tp_pct: tpPct ? parseFloat(tpPct) : (takeProfit ? ((Math.abs(parseFloat(takeProfit) - currentPrice) / currentPrice) * 100) : null),
                    sl_pct: slPct ? parseFloat(slPct) : (stopLoss  ? ((Math.abs(parseFloat(stopLoss)   - currentPrice) / currentPrice) * 100) : null),
                    status: 'OPEN',
                    entry_timestamp: new Date().toISOString(),
                    profit_loss: null,
                    profit_loss_percentage: null,
                    notes: tradeNotes,
                    is_backtest: true
                };
                
                // Store per asset
                const currentAsset = selectedAssetInfo.symbol;
                const assetTrades = backtestTradeHistory[currentAsset] || [];
                setBacktestTradeHistory({
                    ...backtestTradeHistory,
                    [currentAsset]: [...assetTrades, newTrade]
                });
                
                wrappedSetSuccess(`✅ ${orderType} order placed in backtest!`);
                setTimeout(() => wrappedSetSuccess(''), 3000);
                setStopLoss('');
                setTakeProfit('');
                setSlPct('');
                setTpPct('');
                setTradeNotes('');
                setShowTradePanel(false);
            } catch (error) {
                wrappedSetError(`❌ Error: ${error.message}`);
                setTimeout(() => wrappedSetError(''), 3000);
            } finally {
                setIsExecutingTrade(false);
            }
            return;
        }

        // Live trading - use API
        try {
            const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            const assetInfo = getCurrentAssetInfo();
            
            const response = await fetch(`${BACKEND_API_URL}/api/snowai-execute-trade-order-placement/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    asset_symbol: assetInfo.symbol,
                    asset_name: assetInfo.name,
                    asset_class: assetInfo.assetClass,
                    order_type: orderType,
                    entry_price: currentPrice,
                    quantity: quantity,
                    stop_loss: stopLoss || null,
                    take_profit: takeProfit || null,
                    timezone: timezone,
                    notes: tradeNotes,
                    is_paper_trade: true
                })
            });
            
            const result = await response.json();
            
            if (result.success) {
                wrappedSetSuccess(`✅ ${orderType} order placed successfully!`);
                setTimeout(() => wrappedSetSuccess(''), 3000);
                setStopLoss('');
                setTakeProfit('');
                setTradeNotes('');
                setShowTradePanel(false);
                fetchTradeHistory();
            } else {
                wrappedSetError(`❌ Error: ${result.error}`);
                setTimeout(() => wrappedSetError(''), 3000);
            }
        } catch (error) {
            console.error('Error executing trade:', error);
            wrappedSetError(`❌ Failed to execute trade: ${error.message}`);
            setTimeout(() => wrappedSetError(''), 3000);
        } finally {
            setIsExecutingTrade(false);
        }
    };

    // Fetch trade history
    const fetchTradeHistory = async () => {
        try {
            const assetInfo = getCurrentAssetInfo();
            const response = await fetch(
                `${BACKEND_API_URL}/api/snowai-fetch-trade-history-for-asset/?asset_symbol=${assetInfo.symbol}`
            );
            const result = await response.json();
            
            if (result.success) {
                setTradeHistory(result.trades);
                setTradeStats(result.statistics);
            }
        } catch (error) {
            console.error('Error fetching trade history:', error);
        }
    };

    // Fetch overall performance
    const fetchOverallPerformance = async () => {
        try {
            const response = await fetch(`${BACKEND_API_URL}/api/snowai-fetch-overall-trading-performance/`);
            const result = await response.json();
            
            if (result.success) {
                setOverallStats(result.overall_statistics);
                setAssetClassStats(result.asset_class_breakdown);
                setAssetBreakdown(result.asset_breakdown);
            }
        } catch (error) {
            console.error('Error fetching overall performance:', error);
        }
    };

    // Fetch all open positions across all assets
    const fetchAllOpenPositions = async () => {
        setLoadingOpenPositions(true);
        try {
            const response = await fetch(`${BACKEND_API_URL}/api/snowai-fetch-all-open-positions/`);
            const result = await response.json();
            if (result.success) {
                setAllOpenPositions(result.open_positions);
            } else {
                // Fallback: fetch from already-loaded trade history
                setAllOpenPositions([]);
            }
        } catch (error) {
            console.error('Error fetching open positions:', error);
            setAllOpenPositions([]);
        } finally {
            setLoadingOpenPositions(false);
        }
    };

    // Fetch Market Stability Score for the currently viewed asset
    const fetchMss = async () => {
        if (!selectedAssetInfo) return;
        setLoadingMss(true);
        setMssData(null);
        try {
            const sym = selectedAssetInfo.yfinanceSymbol || selectedAssetInfo.symbol;
            const response = await fetch(`${BACKEND_API_URL}/api/mss/calculate/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ symbols: [sym], period: mssLookback })
            });
            const result = await response.json();
            if (result.success && result.data && result.data.length > 0) {
                setMssData(result.data[0]);
                setShowMssPanel(true);
            } else {
                setMssData(null);
                wrappedSetError('Could not compute MSS for this asset.');
                setTimeout(() => wrappedSetError(''), 3000);
            }
        } catch (e) {
            wrappedSetError(`MSS fetch error: ${e.message}`);
            setTimeout(() => wrappedSetError(''), 3000);
        } finally {
            setLoadingMss(false);
        }
    };

    // Switch to a different asset (same as selecting from the search modal)
    const switchToAsset = (assetSymbol, assetClass) => {
        // Find asset info in allAssets
        const classKey = assetClass?.toLowerCase() || '';
        const assetList = allAssets[classKey] || [];
        const found = assetList.find(a => a.symbol === assetSymbol);
        
        if (found) {
            setSelectedAsset(found.symbol);
            setSelectedTimeframe('1H');
            setShowOpenPositions(false);
        } else {
            // If not in loaded list, just set the symbol directly
            setSelectedAsset(assetSymbol);
            setSelectedTimeframe('1H');
            setShowOpenPositions(false);
        }
        
        // Clear scroll position so new asset fits content
        lastScrollPositionRef.current = null;
    };

    // Edit position
    const openEditPosition = (trade) => {
        setEditingTrade(trade);
        setEditForm({
            quantity: trade.quantity,
            stop_loss: trade.stop_loss || '',
            take_profit: trade.take_profit || '',
            notes: trade.notes || '',
            order_type: trade.order_type,
            entry_price: trade.entry_price
        });
    };

    const saveEditPosition = async () => {
        if (!editingTrade) return;

        // Backtest trade — update locally per-asset
        if (editingTrade.trade_id.startsWith('BACKTEST_')) {
            const currentAsset = editingTrade.asset_symbol;
            const assetTrades = backtestTradeHistory[currentAsset] || [];
            const updatedTrades = assetTrades.map(t =>
                t.trade_id === editingTrade.trade_id
                    ? {
                        ...t,
                        quantity: parseFloat(editForm.quantity) || t.quantity,
                        stop_loss: editForm.stop_loss ? parseFloat(editForm.stop_loss) : null,
                        take_profit: editForm.take_profit ? parseFloat(editForm.take_profit) : null,
                        notes: editForm.notes,
                        order_type: editForm.order_type,
                        entry_price: parseFloat(editForm.entry_price) || t.entry_price
                    }
                    : t
            );
            setBacktestTradeHistory({ ...backtestTradeHistory, [currentAsset]: updatedTrades });
            wrappedSetSuccess('✅ Backtest position updated!');
            setTimeout(() => wrappedSetSuccess(''), 3000);
            setEditingTrade(null);
            return;
        }

        // Live trade — use API
        setIsExecutingTrade(true);
        try {
            const response = await fetch(`${BACKEND_API_URL}/api/snowai-edit-trade-order/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    trade_id: editingTrade.trade_id,
                    quantity: parseFloat(editForm.quantity),
                    stop_loss: editForm.stop_loss ? parseFloat(editForm.stop_loss) : null,
                    take_profit: editForm.take_profit ? parseFloat(editForm.take_profit) : null,
                    notes: editForm.notes,
                    order_type: editForm.order_type,
                    entry_price: parseFloat(editForm.entry_price)
                })
            });
            const result = await response.json();
            if (result.success) {
                wrappedSetSuccess('✅ Position updated!');
                setTimeout(() => wrappedSetSuccess(''), 3000);
                fetchTradeHistory();
            } else {
                wrappedSetError(`❌ Error: ${result.error}`);
                setTimeout(() => wrappedSetError(''), 3000);
            }
        } catch (error) {
            wrappedSetError(`❌ Failed to update position: ${error.message}`);
            setTimeout(() => wrappedSetError(''), 3000);
        } finally {
            setIsExecutingTrade(false);
            setEditingTrade(null);
        }
    };

    // Fetch stock info
    const fetchStockInfo = async () => {
        setLoadingStockInfo(true);
        setStockInfo(null);
        const assetInfo = getCurrentAssetInfo();
        
        try {
            const response = await fetch(`${BACKEND_API_URL}/api/snowai-fetch-stock-info/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    symbol: assetInfo.yfinanceSymbol || assetInfo.symbol
                })
            });
            
            const result = await response.json();
            
            if (result.success) {
                setStockInfo(result.data);
                setShowStockInfo(true);
            } else {
                wrappedSetError(`Failed to fetch stock info: ${result.error}`);
                setTimeout(() => wrappedSetError(''), 3000);
            }
        } catch (error) {
            console.error('Error fetching stock info:', error);
            wrappedSetError(`Failed to fetch stock info: ${error.message}`);
            setTimeout(() => wrappedSetError(''), 3000);
        } finally {
            setLoadingStockInfo(false);
        }
    };

    // Close trade
    const closeTrade = async (tradeId) => {
        // Check if it's a backtest trade
        if (tradeId.startsWith('BACKTEST_')) {
            const currentAsset = selectedAssetInfo.symbol;
            const assetTrades = backtestTradeHistory[currentAsset] || [];
            
            let newBalance = backtestBalance;
            
            const updatedTrades = assetTrades.map(trade => {
                if (trade.trade_id === tradeId && trade.status === 'OPEN') {
                    const exitPrice = currentPrice;
                    let profitLoss;

                    if (trade.order_type === 'BUY') {
                        profitLoss = (exitPrice - trade.entry_price) * trade.quantity;
                    } else {
                        profitLoss = (trade.entry_price - exitPrice) * trade.quantity;
                    }

                    // % of equity at entry — not price movement %
                    const balanceAtEntry = trade.balance_at_entry || trade.entry_price * trade.quantity;
                    const profitLossPct  = (profitLoss / balanceAtEntry) * 100;

                    newBalance = backtestBalance + profitLoss;
                    
                    return {
                        ...trade,
                        status: 'CLOSED',
                        exit_price: exitPrice,
                        exit_timestamp: new Date().toISOString(),
                        exit_reason: 'MANUAL',
                        profit_loss: profitLoss,
                        profit_loss_percentage: profitLossPct
                    };
                }
                return trade;
            });
            
            // Update all states together
            setBacktestTradeHistory({
                ...backtestTradeHistory,
                [currentAsset]: updatedTrades
            });
            
            setBacktestBalance(newBalance);
            
            setBacktestEquityCurve([...backtestEquityCurve, {
                timestamp: new Date().toISOString(),
                balance: newBalance,
                profitLoss: newBalance - backtestBalance
            }]);
            
            wrappedSetSuccess(`✅ Backtest trade closed! New balance: $${newBalance.toFixed(2)}`);
            setTimeout(() => wrappedSetSuccess(''), 3000);
            return;
        }
        
        // Live trade - use API
        setIsExecutingTrade(true);
        try {
            const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            
            const response = await fetch(`${BACKEND_API_URL}/api/snowai-close-trade-order-execution/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    trade_id: tradeId,
                    exit_price: currentPrice,
                    exit_reason: 'MANUAL',
                    timezone: timezone
                })
            });
            
            const result = await response.json();
            
            if (result.success) {
                wrappedSetSuccess('✅ Trade closed successfully!');
                setTimeout(() => wrappedSetSuccess(''), 3000);
                fetchTradeHistory();
            } else {
                wrappedSetError(`❌ Error closing trade: ${result.error}`);
                setTimeout(() => wrappedSetError(''), 3000);
            }
        } catch (error) {
            console.error('Error closing trade:', error);
            wrappedSetError(`❌ Failed to close trade: ${error.message}`);
            setTimeout(() => wrappedSetError(''), 3000);
        } finally {
            setIsExecutingTrade(false);
        }
    };

    // Start backtest - proper implementation
    const startBacktest = async () => {
        wrappedSetError('');
        
        // Always fetch fresh data for the current asset before starting backtest
        const assetInfo = getCurrentAssetInfo();
        let freshData = [];
        
        try {
            addToast('Loading chart data for backtest…', 'info', 2500);
            
            if (assetInfo.binanceSymbol) {
                const response = await fetch(
                    `https://api.binance.com/api/v3/klines?symbol=${assetInfo.binanceSymbol}&interval=${timeframes[timeframe].binanceInterval}&limit=500`
                );
                const rawData = await response.json();
                freshData = Array.isArray(rawData) ? rawData.map((kline) => ({
                    time: Math.floor(kline[0] / 1000),
                    open: parseFloat(kline[1]),
                    high: parseFloat(kline[2]),
                    low: parseFloat(kline[3]),
                    close: parseFloat(kline[4]),
                    volume: parseFloat(kline[5])
                })) : [];
            } else {
                const response = await fetch(`${BACKEND_API_URL}/api/snowai-market-ohlc/`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        symbol: assetInfo.yfinanceSymbol || assetInfo.symbol,
                        interval: timeframes[timeframe].interval,
                        period: timeframes[timeframe].yfinancePeriod
                    })
                });
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                const result = await response.json();
                freshData = result.data || [];
            }
        } catch (error) {
            addToast(`⚠ Skipping ${assetInfo.symbol} — ${error.message}`, 'warning', 4000);
            // If in batch mode, skip this asset and advance the queue
            if (batchTestRunning && batchOnCompleteRef.current) {
                batchOnCompleteRef.current = null;
                setBatchTestResults(prev => [...prev, {
                    symbol: assetInfo.symbol, trades: 0, pl: 0, plPct: 0, error: error.message,
                }]);
                await deleteWatchlistAsset(batchTestQueue[0]?.id);
                setBatchTestQueue(prev => prev.slice(1));
            }
            return false;
        }
        
        if (!freshData || freshData.length < 2) {
            addToast(`⚠ Skipping ${assetInfo.symbol} — no data`, 'warning', 3000);
            // Batch: skip and advance
            if (batchTestRunning) {
                batchOnCompleteRef.current = null;
                setBatchTestResults(prev => [...prev, {
                    symbol: assetInfo.symbol, trades: 0, pl: 0, plPct: 0, error: 'No data',
                }]);
                await deleteWatchlistAsset(batchTestQueue[0]?.id);
                setBatchTestQueue(prev => prev.slice(1));
            }
            return;
        }
        
        // ── Success — data loaded, start the visual backtest ──────────────────
        wrappedSetSuccess('');
        setBacktestData(freshData);
        setBacktestMode(true);
        setBacktestCurrentIndex(0);
        setBacktestBalance(10000);
        setBacktestEquityCurve([]);
        setBacktestTrades([]);
        setBacktestPaused(false);
        
        // Start chart from first candle
        if (candlestickSeriesRef.current) {
            candlestickSeriesRef.current.setData([freshData[0]]);
        } else if (lineSeriesRef.current) {
            lineSeriesRef.current.setData([{ time: freshData[0].time, value: freshData[0].close }]);
        }
        
        setCurrentPrice(freshData[0].close);
        
        try {
            const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
            const response = await fetch(`${BACKEND_API_URL}/api/snowai-start-paper-trading-backtest/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    asset_symbol: assetInfo.symbol,
                    asset_name: assetInfo.name,
                    timeframe: timeframe,
                    start_date: new Date(freshData[0].time * 1000).toISOString(),
                    end_date: new Date(freshData[freshData.length - 1].time * 1000).toISOString(),
                    initial_balance: 10000,
                    timezone: tz
                })
            });
            const result = await response.json();
            if (result.success) setBacktestSession(result.session_data);
        } catch (error) {
            console.error('Error registering backtest session:', error);
        }
    };

    // Backtest loop - show candles one by one, optionally fire model signal
    useEffect(() => {
        if (backtestMode && !backtestPaused && backtestCurrentIndex < backtestData.length) {
            backtestIntervalRef.current = setTimeout(async () => {
                const newIndex = backtestCurrentIndex + 1;
                
                if (newIndex < backtestData.length) {
                    const visibleData = backtestData.slice(0, newIndex + 1);
                    
                    if (candlestickSeriesRef.current) {
                        candlestickSeriesRef.current.setData(visibleData);
                    } else if (lineSeriesRef.current) {
                        lineSeriesRef.current.setData(visibleData.map(d => ({ time: d.time, value: d.close })));
                    }
                    
                    const currentCandle = backtestData[newIndex];
                    setCurrentPrice(currentCandle.close);
                    setBacktestCurrentIndex(newIndex);

                    // ── Auto-trade from selected model ─────────────────────────────
                    if (selectedBacktestModel && !backtestModelOpen) {
                        const result = await runBacktestModelSignal(
                            selectedBacktestModel.cleaned_model_code,
                            visibleData
                        );
                        if (result.signal === 'buy' || result.signal === 'sell') {
                            const orderType = result.signal === 'buy' ? 'BUY' : 'SELL';
                            const price     = currentCandle.close;
                            // Model's set_take_profit / set_stop_loss take precedence over UI sliders
                            const tpVal  = result.take_profit || parseFloat(backtestModelTp) || 8;
                            const slVal  = result.stop_loss   || parseFloat(backtestModelSl)  || 4;
                            const tpType = result.take_profit_type || 'PERCENTAGE';
                            const slType = result.stop_loss_type   || 'PERCENTAGE';

                            // Compute actual price levels
                            let tp, sl;
                            if (tpType === 'PERCENTAGE') {
                                tp = orderType === 'BUY' ? price * (1 + tpVal/100) : price * (1 - tpVal/100);
                            } else {
                                // PRICE — treat value as absolute price distance
                                tp = orderType === 'BUY' ? price + tpVal : price - tpVal;
                            }
                            if (slType === 'PERCENTAGE') {
                                sl = orderType === 'BUY' ? price * (1 - slVal/100) : price * (1 + slVal/100);
                            } else {
                                sl = orderType === 'BUY' ? price - slVal : price + slVal;
                            }

                            const newTrade = {
                                trade_id:        `BACKTEST_MODEL_${Date.now()}`,
                                asset_symbol:    selectedAsset,
                                asset_name:      selectedAssetInfo?.name || selectedAsset,
                                asset_class:     selectedAssetInfo?.assetClass || 'Unknown',
                                order_type:      orderType,
                                entry_price:     price,
                                // Quantity = full balance ÷ price → so P&L tracks equity %, not raw price dollars
                                quantity:        backtestBalance / price,
                                balance_at_entry: backtestBalance,
                                stop_loss:       sl,
                                take_profit:     tp,
                                // Store the original % targets for display
                                tp_pct:          tpType === 'PERCENTAGE' ? tpVal : ((Math.abs(tp - price) / price) * 100),
                                sl_pct:          slType === 'PERCENTAGE' ? slVal : ((Math.abs(sl - price) / price) * 100),
                                entry_timestamp: new Date(currentCandle.time * 1000).toISOString(),
                                status:          'OPEN',
                                profit_loss:     null,
                                profit_loss_percentage: null,
                                is_model_trade:  true,
                                model_id:        selectedBacktestModel.model_id,
                            };

                            const currentAsset = selectedAsset;
                            const assetTrades  = backtestTradeHistory[currentAsset] || [];
                            setBacktestTradeHistory(prev => ({ ...prev, [currentAsset]: [...assetTrades, newTrade] }));
                            setBacktestModelOpen(true);
                            addToast(`🤖 Model signal: ${orderType} @ $${price.toFixed(4)}`, 'warning', 3500);
                            setTimeout(() => wrappedSetSuccess(''), 3000);
                        }
                    }

                    // ── Check open model positions for TP/SL ──────────────────────
                    if (backtestModelOpen) {
                        const currentAsset = selectedAsset;
                        const assetTrades  = backtestTradeHistory[currentAsset] || [];
                        const updatedTrades = assetTrades.map(trade => {
                            if (trade.status !== 'OPEN' || !trade.is_model_trade) return trade;
                            const price = currentCandle.close;
                            const isBuy = trade.order_type === 'BUY';
                            const hitTp = isBuy ? price >= trade.take_profit : price <= trade.take_profit;
                            const hitSl = isBuy ? price <= trade.stop_loss   : price >= trade.stop_loss;
                            if (hitTp || hitSl) {
                                // P&L in dollars (quantity already sized to full balance / entry_price)
                                const pl = isBuy
                                    ? (price - trade.entry_price) * trade.quantity
                                    : (trade.entry_price - price) * trade.quantity;
                                // P&L as % of equity at entry — what you actually care about
                                const balanceAtEntry = trade.balance_at_entry || trade.entry_price * trade.quantity;
                                const plPct = (pl / balanceAtEntry) * 100;
                                setBacktestModelOpen(false);
                                return {
                                    ...trade,
                                    status: 'CLOSED',
                                    exit_price: price,
                                    exit_timestamp: new Date(currentCandle.time * 1000).toISOString(),
                                    profit_loss: pl,
                                    profit_loss_percentage: plPct,
                                    exit_reason: hitTp ? 'TP' : 'SL',
                                };
                            }
                            return trade;
                        });
                        const newBalance = updatedTrades.reduce((bal, t) => {
                            if (t.status==='CLOSED' && assetTrades.find(o => o.trade_id===t.trade_id && o.status==='OPEN'))
                                return bal + t.profit_loss;
                            return bal;
                        }, backtestBalance);
                        setBacktestTradeHistory(prev => ({ ...prev, [currentAsset]: updatedTrades }));
                        if (newBalance !== backtestBalance) {
                            setBacktestBalance(newBalance);
                            setBacktestEquityCurve(prev => [...prev, { time: currentCandle.time, value: newBalance }]);
                        }
                    }
                } else {
                    // ── All candles exhausted ──────────────────────────────────
                    // If we're in batch mode, fire the completion callback
                    if (batchOnCompleteRef.current) {
                        batchOnCompleteRef.current();
                    }
                }
                
            }, backtestSpeed * 1000);
        }
        
        return () => { if (backtestIntervalRef.current) clearTimeout(backtestIntervalRef.current); };
    }, [backtestMode, backtestPaused, backtestCurrentIndex, backtestSpeed, backtestData, selectedBacktestModel, backtestModelOpen]);

    // ── Batch test orchestrator ───────────────────────────────────────────────
    // Uses the real on-screen backtest — sets the asset, sets the model, calls
    // startBacktest(), then waits for all candles to finish (batchOnCompleteRef).
    // The user sees every candle animate exactly like a normal backtest.
    useEffect(() => {
        if (!batchTestRunning || batchTestStopped) {
            if (batchTestRunning && batchTestQueue.length === 0) {
                setBatchTestRunning(false);
                setBatchTestCurrent(null);
                batchOnCompleteRef.current = null;
                addToast(`✅ Batch test complete — ${batchTestResults.length} assets tested`, 'success', 5000);
            }
            return;
        }
        if (batchTestQueue.length === 0) {
            setBatchTestRunning(false);
            setBatchTestCurrent(null);
            batchOnCompleteRef.current = null;
            addToast(`✅ Batch test complete — ${batchTestResults.length} assets tested`, 'success', 5000);
            return;
        }
        // Don't start a new asset while one is still running on screen
        if (backtestMode) return;

        const asset = batchTestQueue[0];
        setBatchTestCurrent(asset);

        // Wire the completion callback BEFORE starting so the loop can call it
        batchOnCompleteRef.current = async () => {
            // All candles done — grab closed trades for this asset
            const symbol      = asset.yfinance_symbol || asset.symbol;
            const assetTrades = backtestTradeHistoryRef.current?.[symbol] || [];
            const closed      = assetTrades.filter(t => t.status === 'CLOSED');

            const modelId = batchTestModel?.model_id || 'unknown';
            for (const trade of closed) {
                await saveAssetResultsToAccountTrades(symbol, [trade], modelId);
            }

            const totalPl  = closed.reduce((s, t) => s + (t.profit_loss || 0), 0);
            const totalPct = closed.reduce((s, t) => s + (t.profit_loss_percentage || 0), 0);
            setBatchTestResults(prev => [...prev, {
                symbol: asset.symbol, trades: closed.length, pl: totalPl, plPct: totalPct,
            }]);

            addToast(`${asset.symbol} done — ${closed.length} trades, ${totalPl >= 0 ? '+' : ''}$${totalPl.toFixed(2)}`, 'info', 3000);
            await deleteWatchlistAsset(asset.id);

            // Stop the current backtest (will trigger finalizeBacktestStop → fetchMarketData)
            // then advance the queue — the queue change re-runs this effect for the next asset
            finalizeBacktestStop();
            setBatchTestQueue(prev => prev.slice(1));
            batchOnCompleteRef.current = null;
        };

        // Set asset + model + timeframe then start the visual backtest
        const yfsym = asset.yfinance_symbol || asset.symbol;
        setSelectedAsset(yfsym);
        setSelectedBacktestModel(batchTestModel);
        setBacktestModelTp(batchTestTp);
        setBacktestModelSl(batchTestSl);
        // Speed is NOT reset — user's slider setting persists across assets
        // Small delay so asset/chart state settles before startBacktest fires
        setTimeout(() => { startBacktest(); }, 600);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [batchTestRunning, batchTestStopped, batchTestQueue, backtestMode]);

    // Keep a ref to backtestTradeHistory so the async batchOnCompleteRef callback
    // can read the latest value without a stale closure
    const backtestTradeHistoryRef = useRef({});
    useEffect(() => {
        backtestTradeHistoryRef.current = backtestTradeHistory;
    }, [backtestTradeHistory]);

    // ── Timeframe Sensitivity orchestrator ────────────────────────────────────
    // Same asset, same model, different timeframe each run.
    // Piggybacks on the same backtest loop — just overrides `timeframe` before each start.
    useEffect(() => {
        if (!tfSensitivityMode || tfSensitivityQueue.length === 0 || backtestMode) return;

        const entry = tfSensitivityQueue[0];
        const tf    = entry._overrideTimeframe;

        batchOnCompleteRef.current = async () => {
            const symbol      = entry.yfinance_symbol || entry.symbol;
            const assetTrades = backtestTradeHistoryRef.current?.[symbol] || [];
            const closed      = assetTrades.filter(t => t.status === 'CLOSED');
            const totalPl     = closed.reduce((s, t) => s + (t.profit_loss || 0), 0);
            const wins        = closed.filter(t => (t.profit_loss || 0) > 0).length;

            setTfSensitivityResults(prev => [...prev, {
                timeframe: tf,
                trades:    closed.length,
                wins,
                winRate:   closed.length ? ((wins / closed.length) * 100).toFixed(1) : '—',
                pl:        totalPl,
                plPct:     closed.length ? (closed.reduce((s,t) => s + (t.profit_loss_percentage || 0), 0) / closed.length).toFixed(2) : '—',
            }]);

            addToast(`${tf} done — ${closed.length} trades · ${totalPl >= 0 ? '+' : ''}$${totalPl.toFixed(2)}`, 'info', 3000);
            finalizeBacktestStop();
            setTfSensitivityQueue(prev => prev.slice(1));
            batchOnCompleteRef.current = null;

            if (tfSensitivityQueue.length <= 1) {
                // Last timeframe done
                setTfSensitivityMode(false);
                setShowTfResults(true);
                addToast('✅ Timeframe sensitivity test complete!', 'success', 4000);
            }
        };

        // Override timeframe then start
        setTimeframe(tf);
        setTimeout(() => startBacktest(), 600);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tfSensitivityMode, tfSensitivityQueue, backtestMode]);

    // Fetch saved forward-test models from SnowAIForwardTestingModel
    // ── Backtest Watchlist ─────────────────────────────────────────────────────
    const fetchWatchlist = async () => {
        setWatchlistLoading(true);
        try {
            const r = await fetch(`${BACKEND_API_URL}/api/backtest-watchlist/`);
            const d = await r.json();
            if (d.success) setWatchlistAssets(d.assets || []);
        } catch(e) { console.error('Watchlist fetch error:', e); }
        finally { setWatchlistLoading(false); }
    };

    const addWatchlistAsset = async () => {
        if (!watchlistAddForm.symbol || !watchlistAddForm.name) return;
        setWatchlistSaving(true);
        try {
            const r = await fetch(`${BACKEND_API_URL}/api/backtest-watchlist/add/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...watchlistAddForm,
                    symbol: watchlistAddForm.symbol.toUpperCase(),
                    yfinance_symbol: watchlistAddForm.yfinance_symbol || watchlistAddForm.symbol.toUpperCase(),
                })
            });
            const d = await r.json();
            if (d.success) {
                await fetchWatchlist();
                setWatchlistAddForm({ symbol: '', name: '', asset_class: 'Stocks', yfinance_symbol: '', notes: '' });
                setWatchlistAddOpen(false);
            }
        } catch(e) { console.error('Watchlist add error:', e); }
        finally { setWatchlistSaving(false); }
    };

    const deleteWatchlistAsset = async (id) => {
        try {
            const r = await fetch(`${BACKEND_API_URL}/api/backtest-watchlist/delete/${id}/`, { method: 'DELETE' });
            const d = await r.json();
            if (d.success) setWatchlistAssets(prev => prev.filter(a => a.id !== id));
        } catch(e) { console.error('Watchlist delete error:', e); }
    };

    const selectWatchlistAsset = (asset) => {
        const match = allAssets.find(a =>
            a.symbol === asset.symbol ||
            a.symbol === asset.yfinance_symbol ||
            a.yfinanceSymbol === asset.yfinance_symbol
        );
        if (match) setSelectedAsset(match.symbol);
        else setSelectedAsset(asset.yfinance_symbol || asset.symbol);
        setShowWatchlistModal(false);
    };

    // Save a single asset's backtest results to AccountTrades
    const saveAssetResultsToAccountTrades = async (assetSymbol, assetTrades, modelId) => {
        const closed = assetTrades.filter(t => t.status === 'CLOSED');
        if (closed.length === 0) return { saved: 0 };
        let saved = 0;
        for (const trade of closed) {
            try {
                const entryDate = new Date(trade.entry_timestamp);
                const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
                const dayEntered = days[entryDate.getDay()];
                const rawAmount = Math.abs(parseFloat((trade.profit_loss || 0).toFixed(4)));
                const outcome   = (trade.profit_loss || 0) >= 0 ? 'Win' : 'Loss';
                // Store as POSITIVE regardless — equity curve logic elsewhere handles negation for Loss
                const amount    = rawAmount;

                await fetch(`${BACKEND_API_URL}/api/backtest-save-account-trade/`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        asset:                  assetSymbol,
                        order_type:             trade.order_type,
                        strategy:               modelId || 'SnowAI Model',
                        outcome,
                        amount,
                        profit_loss_percentage: parseFloat((trade.profit_loss_percentage || 0).toFixed(4)),
                        entry_price:            trade.entry_price,
                        exit_price:             trade.exit_price,
                        take_profit:            trade.take_profit,
                        stop_loss:              trade.stop_loss,
                        tp_pct:                 trade.tp_pct,
                        sl_pct:                 trade.sl_pct,
                        exit_reason:            trade.exit_reason || 'MANUAL',
                        day_of_week_entered:    dayEntered,
                        date_entered:           trade.entry_timestamp,
                    })
                });
                saved++;
            } catch(e) { console.error('saveAccountTrade error:', e); }
        }
        return { saved };
    };

    // ── Batch Test All ────────────────────────────────────────────────────────
    const startBatchTest = async (modelToUse) => {
        await fetchWatchlist();
        // Queue will be set from fresh watchlist in the effect below
        setBatchTestRunning(true);
        setBatchTestStopped(false);
        setBatchTestResults([]);
        setShowWatchlistModal(false);
    };

    const stopBatchTest = () => {
        setBatchTestStopped(true);
        setBatchTestRunning(false);
        setBatchTestCurrent(null);
        batchOnCompleteRef.current = null; // prevent auto-advance after stop
        if (backtestMode) finalizeBacktestStop(); // stop visual backtest if running
    };

    const fetchForwardTestModels = async () => {
        try {
            const r = await fetch(`${BACKEND_API_URL}/api/snowai-list-forward-test-models/`);
            const d = await r.json();
            console.log('📦 forwardTestModels raw response:', d);
            if (d.success) {
                console.log('📦 first model keys:', d.models?.[0] ? Object.keys(d.models[0]) : 'none');
                setForwardTestModels(d.models || []);
            }
        } catch (e) { console.error('Error fetching forward test models:', e); }
    };

    // Run the selected model's code against candles[0..currentIndex] via a backend exec call
    // Returns { signal: 'buy'|'sell'|null, tp: number, sl: number }
    const runBacktestModelSignal = async (modelCode, dataset) => {
        try {
            const r = await fetch(`${BACKEND_API_URL}/api/snowai-run-backtest-model-signal/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    code: modelCode,
                    dataset: dataset,            // OHLCV rows
                    take_profit: parseFloat(backtestModelTp) || 8,
                    stop_loss:   parseFloat(backtestModelSl)  || 4,
                })
            });
            const d = await r.json();
            return d.success ? d : { signal: null };
        } catch(e) { return { signal: null }; }
    };

    // Stop backtest
    const stopBacktest = () => {
        const currentAsset = selectedAssetInfo.symbol;
        const currentAssetTrades = backtestTradeHistory[currentAsset] || [];
        
        if (currentAssetTrades.length > 0) {
            setShowSaveBacktestModal(true);
        } else {
            finalizeBacktestStop();
        }
    };
    
    const finalizeBacktestStop = () => {
        setBacktestMode(false);
        setBacktestPaused(false);
        setBacktestCurrentIndex(0);
        setShowSaveBacktestModal(false);
        setBacktestBalance(10000);
        setBacktestEquityCurve([]);
        setBacktestModelOpen(false);
        setShowBacktestConfig(false);

        // Clear chart markers
        const series = candlestickSeriesRef.current || lineSeriesRef.current;
        if (series) {
            try { series.setMarkers([]); } catch(e) {}
        }

        // Re-fetch live market data fresh — restoring from stale backtestData state
        // causes blank charts when switching assets after save
        setTimeout(() => fetchMarketData(true), 100);
    };
    
    const saveBacktestResults = async () => {
        const currentAsset = selectedAssetInfo.symbol;
        const currentAssetTrades = backtestTradeHistory[currentAsset] || [];
        
        // Save backtest trades to live database
        try {
            for (const trade of currentAssetTrades) {
                if (trade.status === 'CLOSED') {
                    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
                    
                    // First create the trade
                    const createResponse = await fetch(`${BACKEND_API_URL}/api/snowai-execute-trade-order-placement/`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            asset_symbol: trade.asset_symbol,
                            asset_name: trade.asset_name,
                            asset_class: trade.asset_class,
                            order_type: trade.order_type,
                            entry_price: trade.entry_price,
                            quantity: trade.quantity,
                            stop_loss: trade.stop_loss,
                            take_profit: trade.take_profit,
                            timezone: timezone,
                            notes: `${trade.notes || ''} [BACKTEST]`,
                            is_paper_trade: true
                        })
                    });
                    
                    const createResult = await createResponse.json();
                    
                    // Then close it with the exit data
                    if (createResult.success && trade.exit_price) {
                        await fetch(`${BACKEND_API_URL}/api/snowai-close-trade-order-execution/`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                trade_id: createResult.trade_id,
                                exit_price: trade.exit_price,
                                exit_reason: trade.exit_reason || 'MANUAL',
                                timezone: timezone
                            })
                        });
                    }
                }
            }
            
            // Clear this asset's backtest history after saving
            const updatedHistory = { ...backtestTradeHistory };
            delete updatedHistory[currentAsset];
            setBacktestTradeHistory(updatedHistory);
            
            wrappedSetSuccess('✅ Backtest results saved successfully!');
            setTimeout(() => wrappedSetSuccess(''), 3000);
            finalizeBacktestStop();
        } catch (error) {
            console.error('Error saving backtest results:', error);
            wrappedSetError('❌ Error saving backtest results');
            setTimeout(() => wrappedSetError(''), 3000);
        }
    };

    // Filter assets for search
    const getFilteredAssets = () => {
        const filtered = {};
        
        for (const [category, symbols] of Object.entries(allAssets)) {
            const matches = symbols.filter(symbol => 
                symbol.toLowerCase().includes(assetSearchQuery.toLowerCase())
            );
            if (matches.length > 0) {
                filtered[category] = matches;
            }
        }
        
        return filtered;
    };

    return (
        <div style={styles.pageContainer}>
            <style>
                {`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }

                    @keyframes toastIn {
                        from { opacity: 0; transform: translateX(60px) scale(0.9); }
                        to   { opacity: 1; transform: translateX(0)    scale(1);   }
                    }

                    @keyframes toastProgress {
                        from { transform: scaleX(1); }
                        to   { transform: scaleX(0); }
                    }
                    
                    input:focus, select:focus {
                        border-color: ${theme.blue[500]} !important;
                        box-shadow: 0 0 0 3px ${theme.blue[100]} !important;
                    }
                    
                    button:hover {
                        transform: translateY(-2px);
                        box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
                    }
                    
                    @media (max-width: 768px) {
                        .main-page-body {
                            flex-direction: column;
                        }
                        
                        div[style*="gridTemplateColumns"] {
                            grid-template-columns: 1fr !important;
                        }
                    }
                    
                    @media (max-width: 480px) {
                        .chart-container {
                            padding: 15px !important;
                        }
                        
                        .trade-modal-overlay {
                            width: 90% !important;
                            right: 5% !important;
                        }
                    }
                `}
            </style>
            
            <div className="header">
                <Header />
            </div>
            
            <div className="main-page-body">
                <SideNavs />
                
                <div style={styles.mainContainer}>
                    <div style={styles.header}>
                        <div style={{ fontSize: '1.8rem', fontWeight: '700' }}>
                            ⚡ SnowAI Professional Trading Terminal
                        </div>
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                            <button
                                onClick={() => setShowModelCreator(true)}
                                style={{
                                    ...styles.themeToggle,
                                    background: `linear-gradient(135deg, ${theme.accent.purple} 0%, #6d28d9 100%)`,
                                    color: 'white',
                                    border: 'none'
                                }}
                            >
                                🤖 AI Model Creator
                            </button>
                            <button
                                onClick={() => setIsDarkTheme(!isDarkTheme)}
                                style={styles.themeToggle}
                            >
                                {isDarkTheme ? '☀️ Light Mode' : '🌙 Dark Mode'}
                            </button>
                        </div>
                    </div>
                    
                    <div style={styles.tradingModeSelector}>
                        <span style={styles.sectionTitle}>📊 Trading Mode</span>
                        <button
                            style={{
                                ...styles.modeButton,
                                ...(tradingMode === 'LIVE' ? styles.modeButtonActive : styles.modeButtonInactive)
                            }}
                            onClick={() => {
                                setTradingMode('LIVE');
                                setBacktestMode(false);
                            }}
                        >
                            🔴 Live Trading
                        </button>
                        <button
                            style={{
                                ...styles.modeButton,
                                ...(tradingMode === 'BACKTEST' ? styles.modeButtonActive : styles.modeButtonInactive)
                            }}
                            onClick={() => setTradingMode('BACKTEST')}
                        >
                            ⏮️ Paper Trading / Backtest
                        </button>
                    </div>
                    
                    {error && (
                        <div style={{ 
                            background: `${theme.accent.red}20`,
                            border: `2px solid ${theme.accent.red}`,
                            color: theme.accent.red,
                            padding: '15px',
                            borderRadius: '12px',
                            marginBottom: '20px'
                        }}>
                            {error}
                        </div>
                    )}
                    
                    {/* Batch Test Running Banner */}
                    {batchTestRunning && (
                        <div style={{
                            background: `linear-gradient(135deg, ${theme.accent.purple}25, ${theme.accent.purple}10)`,
                            border: `2px solid ${theme.accent.purple}`,
                            borderRadius: '14px', padding: '16px 20px', marginBottom: '16px',
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            boxShadow: `0 0 24px ${theme.accent.purple}30`,
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                                <div style={{ width: '12px', height: '12px', borderRadius: '50%',
                                    background: theme.accent.purple,
                                    animation: 'spin 1s linear infinite',
                                    boxShadow: `0 0 10px ${theme.accent.purple}` }} />
                                <div>
                                    <div style={{ fontWeight: '800', color: theme.accent.purple, fontSize: '1rem', letterSpacing: '-0.01em' }}>
                                        🚀 Batch test running — {batchTestCurrent?.symbol || '…'}
                                    </div>
                                    <div style={{ fontSize: '0.8rem', color: theme.text.secondary, marginTop: '3px' }}>
                                        {batchTestResults.length} done · {batchTestQueue.length} remaining
                                        <span style={{ opacity: 0.5, marginLeft: '8px' }}>· speed slider controls pace</span>
                                    </div>
                                </div>
                            </div>
                            <button onClick={stopBatchTest} style={{
                                padding: '10px 22px',
                                background: theme.accent.red,
                                color: 'white', border: 'none', borderRadius: '10px',
                                fontWeight: '800', fontSize: '1rem', cursor: 'pointer',
                                boxShadow: `0 4px 14px ${theme.accent.red}50`,
                                letterSpacing: '0.02em',
                                flexShrink: 0,
                            }}>⏹ STOP</button>
                        </div>
                    )}

                    <div style={styles.controlPanel}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                            <div style={styles.sectionTitle}>
                                🎯 Current Asset: {selectedAssetInfo?.name || selectedAsset}
                            </div>
                            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                {selectedAssetInfo?.assetClass === 'Stocks' && (
                                    <button
                                        onClick={fetchStockInfo}
                                        disabled={loadingStockInfo}
                                        style={{
                                            ...styles.buttonSecondary,
                                            background: loadingStockInfo ? theme.bg.tertiary : `linear-gradient(135deg, ${theme.accent.cyan} 0%, #0891b2 100%)`,
                                            color: loadingStockInfo ? theme.text.secondary : 'white',
                                            border: 'none',
                                            cursor: loadingStockInfo ? 'not-allowed' : 'pointer'
                                        }}
                                    >
                                        {loadingStockInfo ? '⏳ Loading...' : '📊 Stock Info'}
                                    </button>
                                )}
                                {/* MSS button + lookback input — always visible together */}
                                <div style={{ display: 'flex', alignItems: 'center', borderRadius: '8px', overflow: 'hidden', border: `1px solid ${theme.border.medium}` }}>
                                    {/* Free number input with "d" suffix */}
                                    <input
                                        type="number" min="5" max="730" value={mssLookback}
                                        onChange={e => setMssLookback(Math.max(5, parseInt(e.target.value) || 60))}
                                        onKeyDown={e => { if (e.key === 'Enter') fetchMss(); }}
                                        style={{
                                            width: '46px', padding: '8px 4px 8px 10px',
                                            background: theme.bg.tertiary, border: 'none', outline: 'none',
                                            color: theme.text.primary, fontSize: '0.85rem', textAlign: 'right',
                                        }}
                                    />
                                    <span style={{ padding: '0 6px 0 2px', background: theme.bg.tertiary, color: theme.text.tertiary, fontSize: '0.78rem', lineHeight: '36px', borderRight: `1px solid ${theme.border.medium}` }}>d</span>
                                    <button
                                        onClick={() => { if (showMssPanel && mssData) { setShowMssPanel(false); } else { fetchMss(); } }}
                                        disabled={loadingMss}
                                        style={{
                                            ...styles.buttonSecondary,
                                            borderRadius: 0, border: 'none',
                                            background: loadingMss ? theme.bg.tertiary : showMssPanel ? `linear-gradient(135deg,${theme.accent.purple},#6d28d9)` : `linear-gradient(135deg,${theme.accent.orange},#b45309)`,
                                            color: loadingMss ? theme.text.secondary : 'white',
                                            cursor: loadingMss ? 'not-allowed' : 'pointer',
                                            whiteSpace: 'nowrap',
                                        }}
                                    >
                                        {loadingMss ? '⏳' : showMssPanel ? '📉 Hide MSS' : '📉 Market Score'}
                                    </button>
                                </div>
                                <button
                                    onClick={() => { setShowWatchlistModal(true); fetchWatchlist(); }}
                                    style={{
                                        ...styles.buttonSecondary,
                                        background: `linear-gradient(135deg, #d97706 0%, #b45309 100%)`,
                                        color: 'white',
                                        border: 'none'
                                    }}
                                >
                                    ⭐ Watchlist
                                </button>
                                <button
                                    onClick={() => setShowAssetModal(true)}
                                    style={{
                                        ...styles.buttonSecondary,
                                        background: `linear-gradient(135deg, ${theme.blue[500]} 0%, ${theme.blue[600]} 100%)`,
                                        color: 'white',
                                        border: 'none'
                                    }}
                                >
                                    🔍 Search & Select Asset
                                </button>
                            </div>
                        </div>
                        
                        {/* MSS Panel — inline, shown when user clicks Market Score */}
                        {showMssPanel && mssData && (() => {
                            const mss = mssData.mss;
                            const cat = mssData.category; // stable / choppy / volatile
                            const catColor = cat === 'stable' ? theme.accent.green : cat === 'choppy' ? theme.accent.orange : theme.accent.red;
                            const catIcon  = cat === 'stable' ? '✅' : cat === 'choppy' ? '⚠️' : '🚨';
                            const mssBarWidth = `${Math.min(mss, 100)}%`;
                            return (
                                <div style={{ background: theme.bg.tertiary, borderRadius: '12px', padding: '16px 18px', marginBottom: '14px', border: `1px solid ${catColor}40` }}>
                                    {/* Header */}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                                        <div>
                                            <span style={{ fontWeight: '700', color: theme.text.primary, fontSize: '0.95rem' }}>📉 Market Stability Score</span>
                                            <span style={{ marginLeft: '10px', fontSize: '0.78rem', color: theme.text.tertiary }}>{mssLookback}d · {mssData.symbol}</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', flexWrap: 'wrap' }}>
                                            {/* Quick re-fetch chips */}
                                            {[14, 20, 30, 60, 90, 180].map(d => (
                                                <button key={d} onClick={() => { setMssLookback(d); setTimeout(fetchMss, 0); }}
                                                    style={{ padding: '3px 8px', fontSize: '0.72rem', borderRadius: '5px',
                                                        border: `1px solid ${mssLookback===d ? catColor : theme.border.medium}`,
                                                        background: mssLookback===d ? `${catColor}20` : theme.bg.elevated,
                                                        color: mssLookback===d ? catColor : theme.text.secondary, cursor: 'pointer' }}>
                                                    {d}d
                                                </button>
                                            ))}
                                            <span style={{ fontSize: '1.4rem', fontWeight: '800', color: catColor, marginLeft: '4px' }}>{mss.toFixed(1)}</span>
                                            <span style={{ fontSize: '0.8rem', fontWeight: '700', color: catColor, background: `${catColor}18`, padding: '3px 10px', borderRadius: '10px' }}>{catIcon} {mssData.status}</span>
                                            <button onClick={() => setShowMssPanel(false)} style={{ background: 'transparent', border: 'none', color: theme.text.tertiary, cursor: 'pointer', fontSize: '1.2rem', lineHeight: 1 }}>×</button>
                                        </div>
                                    </div>

                                    {/* MSS progress bar */}
                                    <div style={{ background: theme.bg.elevated, borderRadius: '8px', height: '10px', marginBottom: '14px', overflow: 'hidden' }}>
                                        <div style={{ width: mssBarWidth, height: '100%', borderRadius: '8px', background: `linear-gradient(90deg, ${catColor}80, ${catColor})`, transition: 'width 0.6s ease' }} />
                                    </div>

                                    {/* Metric grid */}
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '8px' }}>
                                        {[
                                            ['R²', `${(mssData.r_squared * 100).toFixed(1)}%`, 'Trend clarity', theme.blue[600]],
                                            ['Consistency', `${(mssData.trend_consistency * 100).toFixed(1)}%`, 'Directional %', theme.accent.cyan],
                                            ['Strength',    `${(mssData.trend_strength * 100).toFixed(1)}%`, 'Slope magnitude', theme.accent.purple],
                                            ['Volatility',  `${(mssData.volatility * 100).toFixed(2)}%`, 'Daily σ', mssData.volatility > 0.03 ? theme.accent.red : theme.accent.green],
                                            ['Liquidity',   `${mssData.liquidity_factor}×`, 'Vol factor', theme.accent.orange],
                                            ['Price Δ',     `${mssData.price_change >= 0 ? '+' : ''}${mssData.price_change.toFixed(2)}%`, '60-day return', mssData.price_change >= 0 ? theme.accent.green : theme.accent.red],
                                        ].map(([label, value, sub, color]) => (
                                            <div key={label} style={{ background: theme.bg.elevated, borderRadius: '8px', padding: '10px 12px', textAlign: 'center' }}>
                                                <div style={{ fontSize: '0.68rem', color: theme.text.tertiary, textTransform: 'uppercase', marginBottom: '2px' }}>{label}</div>
                                                <div style={{ fontSize: '1rem', fontWeight: '700', color }}>{value}</div>
                                                <div style={{ fontSize: '0.65rem', color: theme.text.tertiary, marginTop: '1px' }}>{sub}</div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Trading verdict */}
                                    <div style={{ marginTop: '12px', padding: '10px 14px', background: `${catColor}12`, borderRadius: '8px', border: `1px solid ${catColor}30`, fontSize: '0.84rem', color: theme.text.secondary }}>
                                        <strong style={{ color: catColor }}>{catIcon} {cat === 'stable' ? 'Good conditions' : cat === 'choppy' ? 'Trade cautiously' : 'Avoid trading'}: </strong>
                                        {cat === 'stable'   && `Trending market with clear direction. MSS ${mss.toFixed(0)} ≥ 47. R² of ${(mssData.r_squared*100).toFixed(0)}% shows strong trend clarity.`}
                                        {cat === 'choppy'   && `Market is in between — some trend present but not ideal. Consider tighter stops. MSS ${mss.toFixed(0)} is 30–47.`}
                                        {cat === 'volatile' && `Choppy, unpredictable price action. MSS ${mss.toFixed(0)} < 30. High volatility (${(mssData.volatility*100).toFixed(2)}% daily σ) reduces edge.`}
                                    </div>
                                </div>
                            );
                        })()}

                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '15px' }}>
                            <span style={{ color: theme.text.secondary, fontWeight: '600' }}>⏰ Timeframe:</span>
                            {Object.keys(timeframes).map(key => (
                                <button
                                    key={key}
                                    onClick={() => setTimeframe(key)}
                                    style={{
                                        padding: '8px 16px',
                                        border: 'none',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        fontSize: '0.9rem',
                                        fontWeight: '600',
                                        transition: 'all 0.3s ease',
                                        ...(timeframe === key ? {
                                            background: `linear-gradient(135deg, ${theme.accent.orange} 0%, #d97706 100%)`,
                                            color: 'white',
                                            boxShadow: '0 4px 12px rgba(245, 158, 11, 0.4)'
                                        } : {
                                            background: theme.bg.tertiary,
                                            color: theme.text.secondary,
                                            border: `1px solid ${theme.border.light}`
                                        })
                                    }}
                                >
                                    {key}
                                </button>
                            ))}
                        </div>
                    </div>
                    
                    {isLoading && isInitialLoad && (
                        <div style={{ textAlign: 'center', padding: '40px' }}>
                            <div style={styles.loadingSpinner}></div>
                            <p style={{ color: theme.text.secondary, marginTop: '20px' }}>
                                Loading market data...
                            </p>
                        </div>
                    )}
                    
                    {!isInitialLoad && Array.isArray(marketData) && marketData.length > 0 && (
                        <>
                            <div style={styles.priceDisplay}>
                                <div>
                                    <div style={styles.currentPrice}>
                                        ${currentPrice.toLocaleString(undefined, { 
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 8
                                        })}
                                    </div>
                                    <div style={{ color: theme.text.secondary, fontSize: '1.1rem' }}>
                                        {selectedAssetInfo?.name} • {timeframes[timeframe].label}
                                    </div>
                                </div>
                                <div style={{
                                    fontSize: '1.5rem',
                                    fontWeight: '800',
                                    color: priceChange >= 0 ? theme.accent.green : theme.accent.red
                                }}>
                                    {priceChange >= 0 ? '▲' : '▼'} {Math.abs(priceChange).toFixed(2)}%
                                </div>
                            </div>
                            
                            <div style={styles.chartContainer}>
                                <div style={styles.chartTitle}>
                                    📈 {selectedAssetInfo?.name} ({selectedAsset})
                                </div>
                                
                                <div style={styles.chartControls}>
                                    <button
                                        onClick={() => setChartType('candlestick')}
                                        style={{
                                            ...styles.modeButton,
                                            ...(chartType === 'candlestick' ? styles.modeButtonActive : styles.modeButtonInactive),
                                            width: 'auto',
                                            padding: '10px 20px'
                                        }}
                                    >
                                        🕯️ Candlestick
                                    </button>
                                    <button
                                        onClick={() => setChartType('line')}
                                        style={{
                                            ...styles.modeButton,
                                            ...(chartType === 'line' ? styles.modeButtonActive : styles.modeButtonInactive),
                                            width: 'auto',
                                            padding: '10px 20px'
                                        }}
                                    >
                                        📊 Line Chart
                                    </button>
                                    
                                    <button
                                        onClick={() => setShowTradePanel(!showTradePanel)}
                                        style={{
                                            ...styles.modeButton,
                                            background: `linear-gradient(135deg, ${theme.accent.green} 0%, #059669 100%)`,
                                            color: 'white',
                                            width: 'auto',
                                            padding: '10px 20px'
                                        }}
                                    >
                                        💼 {showTradePanel ? 'Hide' : 'Show'} Trade Panel
                                    </button>
                                    
                                    <button
                                        onClick={() => {
                                            setShowTradeHistory(true);
                                            if (!backtestMode) {
                                                fetchTradeHistory();
                                            }
                                        }}
                                        style={{
                                            ...styles.buttonSecondary,
                                            background: `linear-gradient(135deg, ${theme.blue[500]} 0%, ${theme.blue[600]} 100%)`,
                                            color: 'white',
                                            border: 'none',
                                            padding: '10px 20px'
                                        }}
                                    >
                                        📊 Trade History
                                    </button>
                                    
                                    <button
                                        onClick={() => {
                                            setShowOpenPositions(true);
                                            if (!backtestMode) fetchAllOpenPositions();
                                        }}
                                        style={{
                                            ...styles.buttonSecondary,
                                            background: `linear-gradient(135deg, ${theme.accent.orange} 0%, #b45309 100%)`,
                                            color: 'white',
                                            border: 'none',
                                            padding: '10px 20px'
                                        }}
                                    >
                                        📂 Open Positions
                                    </button>
                                    
                                    <button
                                        onClick={() => {
                                            setShowOverallPerformance(true);
                                            fetchOverallPerformance();
                                        }}
                                        style={{
                                            ...styles.buttonSecondary,
                                            background: `linear-gradient(135deg, ${theme.accent.purple} 0%, #6d28d9 100%)`,
                                            color: 'white',
                                            border: 'none',
                                            padding: '10px 20px'
                                        }}
                                    >
                                        🏆 Performance
                                    </button>
                                    
                                    <button
                                        onClick={() => setShowModelCreator(true)}
                                        style={{
                                            ...styles.buttonSecondary,
                                            background: `linear-gradient(135deg, ${theme.accent.pink} 0%, #db2777 100%)`,
                                            color: 'white',
                                            border: 'none',
                                            padding: '10px 20px'
                                        }}
                                    >
                                        🤖 AI Model Builder
                                    </button>
                                    
                                    {tradingMode === 'BACKTEST' && !backtestMode && (
                                        <button
                                            onClick={() => { fetchForwardTestModels(); setShowBacktestConfig(prev => !prev); }}
                                            style={{
                                                ...styles.buttonSecondary,
                                                background: `linear-gradient(135deg, ${theme.accent.cyan} 0%, #0891b2 100%)`,
                                                color: 'white',
                                                border: 'none',
                                                padding: '10px 20px'
                                            }}
                                        >
                                            ⚡ Start Backtest
                                        </button>
                                    )}
                                </div>
                                
                                {/* ── Pre-backtest config panel ─────────────────────────── */}
                                {tradingMode === 'BACKTEST' && !backtestMode && showBacktestConfig && (
                                    <div style={{ background: theme.bg.tertiary, borderRadius: '12px', padding: '20px', marginBottom: '12px', border: `2px solid ${theme.accent.cyan}40` }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                            <h3 style={{ margin: 0, color: theme.text.primary, fontSize: '1rem' }}>⚙️ Backtest Configuration</h3>
                                            <button onClick={() => setShowBacktestConfig(false)} style={{ background: 'transparent', border: 'none', color: theme.text.tertiary, cursor: 'pointer', fontSize: '1.3rem' }}>×</button>
                                        </div>

                                        {/* Speed control */}
                                        <div style={{ marginBottom: '16px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                                                <label style={styles.label}>⏱ Candle Speed</label>
                                                <span style={{ fontWeight: '700', color: theme.accent.cyan, fontSize: '0.95rem' }}>
                                                    {backtestSpeed < 1 ? `${(backtestSpeed * 1000).toFixed(0)}ms` : `${backtestSpeed}s`} / candle
                                                </span>
                                            </div>
                                            <input type="range" min="0.05" max="10" step="0.05" value={backtestSpeed}
                                                onChange={e => setBacktestSpeed(parseFloat(e.target.value))}
                                                style={{ width: '100%', accentColor: theme.accent.cyan }} />
                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: theme.text.tertiary, marginTop: '2px' }}>
                                                <span>50ms (fastest)</span><span>5s</span><span>10s (slowest)</span>
                                            </div>
                                            {/* Quick preset buttons */}
                                            <div style={{ display: 'flex', gap: '6px', marginTop: '8px', flexWrap: 'wrap' }}>
                                                {[['50ms',0.05],['200ms',0.2],['500ms',0.5],['1s',1],['2s',2],['5s',5]].map(([label,val]) => (
                                                    <button key={label} onClick={() => setBacktestSpeed(val)}
                                                        style={{ padding: '4px 10px', fontSize: '0.75rem', borderRadius: '6px', border: `1px solid ${backtestSpeed===val ? theme.accent.cyan : theme.border.medium}`,
                                                            background: backtestSpeed===val ? `${theme.accent.cyan}20` : theme.bg.elevated,
                                                            color: backtestSpeed===val ? theme.accent.cyan : theme.text.secondary, cursor: 'pointer' }}>
                                                        {label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Strategy model selector */}
                                        <div style={{ marginBottom: '16px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                                                <label style={styles.label}>🤖 Strategy Model (optional)</label>
                                                <button onClick={fetchForwardTestModels} style={{ fontSize: '0.75rem', color: theme.accent.cyan, background: 'transparent', border: 'none', cursor: 'pointer' }}>🔄 Refresh</button>
                                            </div>
                                            {forwardTestModels.length === 0 ? (
                                                <div style={{ fontSize: '0.82rem', color: theme.text.tertiary, padding: '10px', background: theme.bg.elevated, borderRadius: '8px', textAlign: 'center' }}>
                                                    No models found in SnowAIForwardTestingModel — run manually or save a model first.
                                                </div>
                                            ) : (
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '520px', overflowY: 'auto', paddingRight: '2px' }}>
                                                    {/* None option */}
                                                    <div onClick={() => setSelectedBacktestModel(null)}
                                                        style={{ padding: '10px 12px', borderRadius: '8px', cursor: 'pointer',
                                                            border: `2px solid ${!selectedBacktestModel ? theme.accent.cyan : theme.border.light}`,
                                                            background: !selectedBacktestModel ? `${theme.accent.cyan}12` : theme.bg.elevated }}>
                                                        <span style={{ fontSize: '0.85rem', fontWeight: '600', color: !selectedBacktestModel ? theme.accent.cyan : theme.text.secondary }}>
                                                            🖐 Manual only — no auto-trading
                                                        </span>
                                                    </div>

                                                    {forwardTestModels.map((m, idx) => {
                                                        const modelId    = m.model_id || m.id || `model-${idx}`;
                                                        const modelCode  = m.cleaned_model_code || m.code || m.model_code || '';
                                                        const modelNotes = m.notes || m.description || '';
                                                        const modelDate  = m.created_at || m.date || '';
                                                        const isSelected = selectedBacktestModel?.model_id === modelId;
                                                        return (
                                                            <div key={modelId} style={{
                                                                display: 'flex', alignItems: 'center', gap: '10px',
                                                                padding: '11px 14px', borderRadius: '10px',
                                                                border: `2px solid ${isSelected ? theme.accent.purple : theme.border.light}`,
                                                                background: isSelected ? `${theme.accent.purple}12` : theme.bg.elevated,
                                                            }}>
                                                                {/* Left: model info */}
                                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                                    <div style={{ fontWeight: '700', fontSize: '0.9rem',
                                                                        color: isSelected ? theme.accent.purple : theme.text.primary,
                                                                        display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                                        {modelId}
                                                                        {isSelected && (
                                                                            <span style={{ fontSize: '0.68rem', fontWeight: '700',
                                                                                background: `${theme.accent.purple}25`, color: theme.accent.purple,
                                                                                padding: '1px 8px', borderRadius: '8px', letterSpacing: '0.03em' }}>
                                                                                ACTIVE
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                    {modelNotes && (
                                                                        <div style={{ fontSize: '0.75rem', color: theme.text.secondary, marginTop: '2px' }}>{modelNotes}</div>
                                                                    )}
                                                                    <div style={{ fontSize: '0.7rem', color: theme.text.tertiary, marginTop: '2px' }}>
                                                                        {modelDate ? new Date(modelDate).toLocaleDateString() : ''}
                                                                        {modelCode ? ` · ${modelCode.split('\n').length} lines` : ''}
                                                                    </div>
                                                                </div>

                                                                {/* Right: actions */}
                                                                <div style={{ display: 'flex', gap: '7px', flexShrink: 0 }}>
                                                                    {/* 👁 Code button */}
                                                                    <button
                                                                        onClick={e => { e.stopPropagation(); setCodePreviewPrompt({ modelId, modelCode, modelNotes }); }}
                                                                        style={{
                                                                            padding: '6px 12px', fontSize: '0.8rem', borderRadius: '7px',
                                                                            border: `1px solid ${theme.border.medium}`,
                                                                            background: theme.bg.tertiary,
                                                                            color: theme.text.secondary,
                                                                            cursor: 'pointer', fontWeight: '600',
                                                                            display: 'flex', alignItems: 'center', gap: '5px',
                                                                        }}>
                                                                        👁 Code
                                                                    </button>
                                                                    {/* ✓ Use / ✕ Remove */}
                                                                    <button
                                                                        onClick={e => { e.stopPropagation(); setSelectedBacktestModel(isSelected ? null : { ...m, model_id: modelId, cleaned_model_code: modelCode }); }}
                                                                        style={{
                                                                            padding: '6px 14px', fontSize: '0.8rem', borderRadius: '7px', fontWeight: '700',
                                                                            cursor: 'pointer',
                                                                            background: isSelected ? 'transparent' : `linear-gradient(135deg,${theme.accent.purple},#6d28d9)`,
                                                                            color: isSelected ? theme.accent.red : 'white',
                                                                            border: isSelected ? `1.5px solid ${theme.accent.red}` : 'none',
                                                                        }}>
                                                                        {isSelected ? '✕ Remove' : '✓ Use'}
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>

                                        {/* TP / SL for auto-model — only shown when a model is selected */}
                                        {selectedBacktestModel && (
                                            <div style={{ marginBottom: '16px', padding: '14px', background: `${theme.accent.purple}10`, borderRadius: '10px', border: `1px solid ${theme.accent.purple}30` }}>
                                                <div style={{ fontSize: '0.82rem', fontWeight: '600', color: theme.accent.purple, marginBottom: '10px' }}>
                                                    🤖 Auto-trade settings for <strong>{selectedBacktestModel.model_id}</strong>
                                                </div>
                                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                                    <div>
                                                        <label style={styles.label}>Take Profit %</label>
                                                        <input type="number" value={backtestModelTp} onChange={e => setBacktestModelTp(e.target.value)} min="0" step="0.5"
                                                            style={styles.input} placeholder="8" />
                                                        {currentPrice > 0 && <div style={{ fontSize:'0.75rem', color:theme.accent.green, marginTop:'2px' }}>
                                                            TP @ ${(currentPrice * (1 + parseFloat(backtestModelTp||0)/100)).toFixed(4)}
                                                        </div>}
                                                    </div>
                                                    <div>
                                                        <label style={styles.label}>Stop Loss %</label>
                                                        <input type="number" value={backtestModelSl} onChange={e => setBacktestModelSl(e.target.value)} min="0" step="0.5"
                                                            style={styles.input} placeholder="4" />
                                                        {currentPrice > 0 && <div style={{ fontSize:'0.75rem', color:theme.accent.red, marginTop:'2px' }}>
                                                            SL @ ${(currentPrice * (1 - parseFloat(backtestModelSl||0)/100)).toFixed(4)}
                                                        </div>}
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        <button onClick={() => { setShowBacktestConfig(false); startBacktest(); }}
                                            style={{ ...styles.buttonPrimary, width: '100%', background: `linear-gradient(135deg, ${theme.accent.cyan} 0%, #0891b2 100%)` }}>
                                            ⚡ Launch Backtest{selectedBacktestModel ? ` with ${selectedBacktestModel.model_id}` : ' — Manual Mode'}
                                        </button>
                                    </div>
                                )}

                                <div 
                                    ref={chartContainerRef}
                                    style={{ 
                                        width: '100%',
                                        height: '500px',
                                        borderRadius: '10px',
                                        overflow: 'hidden',
                                        position: 'relative',
                                        display: 'block'
                                    }}
                                />
                                
                                {showTradePanel && (
                                    <div style={styles.tradeModalOverlay}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                                            <h3 style={{ margin: 0, color: theme.blue[700] }}>💼 Execute Trade</h3>
                                            <button onClick={() => setShowTradePanel(false)} style={{ background: 'transparent', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: theme.text.secondary }}>×</button>
                                        </div>

                                        {/* BUY / SELL toggle */}
                                        <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
                                            {['BUY','SELL'].map(t => (
                                                <button key={t} onClick={() => {
                                                    setOrderType(t);
                                                    // Recalc SL/TP when direction flips
                                                    if (slPct) {
                                                        const sl = t === 'BUY' ? currentPrice*(1-parseFloat(slPct)/100) : currentPrice*(1+parseFloat(slPct)/100);
                                                        setStopLoss(sl.toFixed(4));
                                                    }
                                                    if (tpPct) {
                                                        const tp = t === 'BUY' ? currentPrice*(1+parseFloat(tpPct)/100) : currentPrice*(1-parseFloat(tpPct)/100);
                                                        setTakeProfit(tp.toFixed(4));
                                                    }
                                                }}
                                                style={{ flex:1, padding:'10px', border:'none', borderRadius:'8px', fontWeight:'700', cursor:'pointer',
                                                    background: orderType===t ? (t==='BUY'?theme.accent.green:theme.accent.red) : theme.bg.tertiary,
                                                    color: orderType===t ? 'white' : theme.text.secondary,
                                                    border: `2px solid ${orderType===t ? 'transparent' : theme.border.medium}`
                                                }}>{t==='BUY' ? '🟢 BUY' : '🔴 SELL'}</button>
                                            ))}
                                        </div>

                                        {/* Quantity */}
                                        <div style={styles.formGroup}>
                                            <label style={styles.label}>Quantity</label>
                                            <input type="number" style={styles.input} value={quantity} onChange={e => setQuantity(parseFloat(e.target.value))} min="0.01" step="0.01" />
                                        </div>

                                        {/* Stop Loss — price OR % */}
                                        <div style={styles.formGroup}>
                                            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'6px' }}>
                                                <label style={{...styles.label, margin:0}}>Stop Loss</label>
                                                <div style={{ display:'flex', gap:'6px' }}>
                                                    <input type="number" placeholder="%" value={slPct} min="0" step="0.1"
                                                        onChange={e => {
                                                            setSlPct(e.target.value);
                                                            if (e.target.value && currentPrice) {
                                                                const sl = orderType==='BUY' ? currentPrice*(1-parseFloat(e.target.value)/100) : currentPrice*(1+parseFloat(e.target.value)/100);
                                                                setStopLoss(sl.toFixed(4));
                                                            } else { setStopLoss(''); }
                                                        }}
                                                        style={{...styles.input, width:'70px', padding:'6px 8px', fontSize:'0.85rem', textAlign:'center'}} />
                                                    <span style={{ color:theme.text.tertiary, lineHeight:'34px', fontSize:'0.8rem' }}>%</span>
                                                </div>
                                            </div>
                                            <input type="number" style={styles.input} placeholder="Price level (or use % above)" value={stopLoss}
                                                onChange={e => { setStopLoss(e.target.value); setSlPct(''); }} step="0.0001" />
                                            {stopLoss && <div style={{ fontSize:'0.78rem', color:theme.accent.red, marginTop:'3px' }}>SL @ ${parseFloat(stopLoss).toFixed(4)} · Risk: ${Math.abs((parseFloat(stopLoss)-currentPrice)*quantity).toFixed(2)}</div>}
                                        </div>

                                        {/* Take Profit — price OR % */}
                                        <div style={styles.formGroup}>
                                            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'6px' }}>
                                                <label style={{...styles.label, margin:0}}>Take Profit</label>
                                                <div style={{ display:'flex', gap:'6px' }}>
                                                    <input type="number" placeholder="%" value={tpPct} min="0" step="0.1"
                                                        onChange={e => {
                                                            setTpPct(e.target.value);
                                                            if (e.target.value && currentPrice) {
                                                                const tp = orderType==='BUY' ? currentPrice*(1+parseFloat(e.target.value)/100) : currentPrice*(1-parseFloat(e.target.value)/100);
                                                                setTakeProfit(tp.toFixed(4));
                                                            } else { setTakeProfit(''); }
                                                        }}
                                                        style={{...styles.input, width:'70px', padding:'6px 8px', fontSize:'0.85rem', textAlign:'center'}} />
                                                    <span style={{ color:theme.text.tertiary, lineHeight:'34px', fontSize:'0.8rem' }}>%</span>
                                                </div>
                                            </div>
                                            <input type="number" style={styles.input} placeholder="Price level (or use % above)" value={takeProfit}
                                                onChange={e => { setTakeProfit(e.target.value); setTpPct(''); }} step="0.0001" />
                                            {takeProfit && <div style={{ fontSize:'0.78rem', color:theme.accent.green, marginTop:'3px' }}>TP @ ${parseFloat(takeProfit).toFixed(4)} · Gain: ${Math.abs((parseFloat(takeProfit)-currentPrice)*quantity).toFixed(2)}</div>}
                                        </div>

                                        {/* R:R ratio */}
                                        {stopLoss && takeProfit && (
                                            <div style={{ padding:'10px', background:`${theme.accent.cyan}15`, borderRadius:'8px', marginBottom:'12px', fontSize:'0.85rem', textAlign:'center' }}>
                                                <span style={{ color:theme.text.secondary }}>Risk/Reward: </span>
                                                <strong style={{ color:theme.accent.cyan }}>
                                                    1 : {(Math.abs(parseFloat(takeProfit)-currentPrice) / Math.abs(parseFloat(stopLoss)-currentPrice)).toFixed(2)}
                                                </strong>
                                            </div>
                                        )}

                                        <div style={styles.formGroup}>
                                            <label style={styles.label}>Notes (Optional)</label>
                                            <input type="text" style={styles.input} placeholder="Trade notes..." value={tradeNotes} onChange={e => setTradeNotes(e.target.value)} />
                                        </div>

                                        <button style={{...styles.buttonPrimary, opacity: isExecutingTrade ? 0.6 : 1,
                                            background: orderType==='BUY' ? `linear-gradient(135deg,${theme.accent.green},#059669)` : `linear-gradient(135deg,${theme.accent.red},#b91c1c)`
                                        }} onClick={executeTrade} disabled={isExecutingTrade}>
                                            {isExecutingTrade ? '⏳ Executing...' : `${orderType==='BUY'?'🟢':'🔴'} ${orderType} @ $${currentPrice.toFixed(4)}`}
                                        </button>
                                    </div>
                                )}
                                
                                {backtestMode && (() => {
                                    const currentAsset = selectedAsset;
                                    const assetTrades  = backtestTradeHistory[currentAsset] || [];
                                    const closed = assetTrades.filter(t => t.status === 'CLOSED');
                                    const open   = assetTrades.filter(t => t.status === 'OPEN');
                                    const totalPl = closed.reduce((s,t) => s + (t.profit_loss||0), 0);
                                    const wins    = closed.filter(t => (t.profit_loss||0) > 0).length;
                                    const wr      = closed.length > 0 ? ((wins/closed.length)*100).toFixed(0) : '—';
                                    const pct     = backtestData.length > 0 ? ((backtestCurrentIndex/backtestData.length)*100).toFixed(1) : 0;
                                    return (
                                        <div style={{ marginTop: '12px', background: theme.bg.tertiary, borderRadius: '10px', padding: '12px 16px', border: `2px solid ${theme.blue[400]}` }}>
                                            {/* Progress bar */}
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                                                <div style={{ flex: 1, background: theme.bg.elevated, borderRadius: '6px', height: '7px', overflow: 'hidden' }}>
                                                    <div style={{ width: `${pct}%`, height: '100%', background: `linear-gradient(90deg, ${theme.accent.cyan}, ${theme.blue[500]})`, transition: 'width 0.3s' }} />
                                                </div>
                                                <span style={{ fontSize: '0.78rem', color: theme.text.tertiary, whiteSpace: 'nowrap' }}>{backtestCurrentIndex}/{backtestData.length}</span>
                                                <span style={{ fontSize: '0.78rem', color: theme.accent.cyan, fontWeight: '700', whiteSpace: 'nowrap' }}>{pct}%</span>
                                            </div>

                                            {/* Stats row */}
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))', gap: '6px', marginBottom: '10px' }}>
                                                {[
                                                    ['Balance',  `$${backtestBalance.toFixed(2)}`, totalPl>=0?theme.accent.green:theme.accent.red],
                                                    ['P&L',      `${totalPl>=0?'+':''}$${totalPl.toFixed(2)}`, totalPl>=0?theme.accent.green:theme.accent.red],
                                                    ['Win Rate', `${wr}%`, theme.accent.cyan],
                                                    ['Trades',   `${closed.length}/${assetTrades.length}`, theme.text.primary],
                                                    ['Open',     open.length, theme.blue[500]],
                                                    ['Speed',    backtestSpeed<1?`${(backtestSpeed*1000).toFixed(0)}ms`:`${backtestSpeed}s`, theme.accent.orange],
                                                ].map(([l,v,c]) => (
                                                    <div key={l} style={{ background: theme.bg.elevated, borderRadius: '7px', padding: '6px 8px', textAlign: 'center' }}>
                                                        <div style={{ fontSize: '0.65rem', color: theme.text.tertiary, textTransform: 'uppercase' }}>{l}</div>
                                                        <div style={{ fontSize: '0.88rem', fontWeight: '700', color: c }}>{v}</div>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Speed scrubber (live, while running) */}
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                                                <span style={{ fontSize: '0.75rem', color: theme.text.tertiary, whiteSpace: 'nowrap' }}>⏱ Speed:</span>
                                                <input type="range" min="0.05" max="10" step="0.05" value={backtestSpeed}
                                                    onChange={e => setBacktestSpeed(parseFloat(e.target.value))}
                                                    style={{ flex: 1, accentColor: theme.accent.cyan }} />
                                                <span style={{ fontSize: '0.78rem', color: theme.accent.cyan, fontWeight: '700', minWidth: '40px' }}>
                                                    {backtestSpeed<1?`${(backtestSpeed*1000).toFixed(0)}ms`:`${backtestSpeed}s`}
                                                </span>
                                            </div>

                                            {/* Active model badge */}
                                            {selectedBacktestModel && (
                                                <div style={{ fontSize: '0.78rem', color: theme.accent.purple, background: `${theme.accent.purple}12`, padding: '5px 10px', borderRadius: '6px', marginBottom: '10px' }}>
                                                    🤖 Auto-trading: <strong>{selectedBacktestModel.model_id}</strong> · TP {backtestModelTp}% · SL {backtestModelSl}%
                                                    {backtestModelOpen && <span style={{ color: theme.blue[500], marginLeft: '8px' }}>● Position open</span>}
                                                </div>
                                            )}

                                            {/* Pause / Stop */}
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <button onClick={() => setBacktestPaused(!backtestPaused)}
                                                    style={{ ...styles.buttonSecondary, flex: 1 }}>
                                                    {backtestPaused ? '▶️ Resume' : '⏸️ Pause'}
                                                </button>
                                                <button onClick={stopBacktest}
                                                    style={{ ...styles.buttonSecondary, flex: 0.5, background: theme.accent.red, color: 'white', border: 'none' }}>
                                                    ⏹️ Stop
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })()}
                            </div>
                        </>
                    )}
                    
                    {/* ── Code Preview Prompt Modal ───────────────────────────── */}
                    {codePreviewPrompt && (
                        <div style={{ ...styles.modal, zIndex: 1100 }} onClick={() => setCodePreviewPrompt(null)}>
                            <div onClick={e => e.stopPropagation()} style={{
                                background: theme.bg.secondary, borderRadius: '16px',
                                padding: '32px 36px', maxWidth: '420px', width: '90%',
                                border: `1px solid ${theme.border.medium}`,
                                boxShadow: '0 25px 60px rgba(0,0,0,0.35)',
                                textAlign: 'center',
                            }}>
                                <div style={{ fontSize: '2.4rem', marginBottom: '14px' }}>👁</div>
                                <h3 style={{ margin: '0 0 10px', color: theme.text.primary, fontSize: '1.1rem', fontWeight: '700' }}>
                                    View model code?
                                </h3>
                                <p style={{ margin: '0 0 24px', color: theme.text.secondary, fontSize: '0.9rem', lineHeight: '1.5' }}>
                                    Want to see the code for{' '}
                                    <span style={{ fontWeight: '700', color: theme.accent.purple, fontFamily: 'monospace' }}>
                                        {codePreviewPrompt.modelId}
                                    </span>
                                    {codePreviewPrompt.modelNotes ? (
                                        <span style={{ color: theme.text.tertiary }}>{' '}— {codePreviewPrompt.modelNotes}</span>
                                    ) : null}
                                    ?
                                </p>
                                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                                    <button
                                        onClick={() => { setCodePreviewModel(codePreviewPrompt); setCodePreviewPrompt(null); }}
                                        style={{
                                            padding: '10px 28px', borderRadius: '9px', fontWeight: '700', fontSize: '0.9rem',
                                            background: `linear-gradient(135deg,${theme.accent.purple},#6d28d9)`,
                                            color: 'white', border: 'none', cursor: 'pointer',
                                        }}>
                                        Yes, show me
                                    </button>
                                    <button
                                        onClick={() => setCodePreviewPrompt(null)}
                                        style={{
                                            padding: '10px 22px', borderRadius: '9px', fontWeight: '600', fontSize: '0.9rem',
                                            background: 'transparent', color: theme.text.secondary,
                                            border: `1.5px solid ${theme.border.medium}`, cursor: 'pointer',
                                        }}>
                                        No thanks
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ── Full Code Viewer Modal ───────────────────────────────── */}
                    {codePreviewModel && (
                        <div style={{ ...styles.modal, zIndex: 1100 }} onClick={() => setCodePreviewModel(null)}>
                            <div onClick={e => e.stopPropagation()} style={{
                                background: theme.bg.secondary, borderRadius: '14px',
                                width: '92%', maxWidth: '780px',
                                border: `1px solid ${theme.border.medium}`,
                                boxShadow: '0 25px 60px rgba(0,0,0,0.4)',
                                overflow: 'hidden', display: 'flex', flexDirection: 'column',
                                maxHeight: '85vh',
                            }}>
                                {/* Modal header */}
                                <div style={{
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                    padding: '16px 20px', borderBottom: `1px solid ${theme.border.light}`,
                                    background: theme.bg.tertiary, flexShrink: 0,
                                }}>
                                    <div>
                                        <div style={{ fontWeight: '800', fontSize: '1rem', color: theme.accent.purple, fontFamily: 'monospace' }}>
                                            👁 {codePreviewModel.modelId}
                                        </div>
                                        {codePreviewModel.modelNotes && (
                                            <div style={{ fontSize: '0.78rem', color: theme.text.secondary, marginTop: '2px' }}>{codePreviewModel.modelNotes}</div>
                                        )}
                                        <div style={{ fontSize: '0.72rem', color: theme.text.tertiary, marginTop: '2px' }}>
                                            {codePreviewModel.modelCode ? `${codePreviewModel.modelCode.split('\n').length} lines` : 'no code'}
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                        <button
                                            onClick={() => navigator.clipboard.writeText(codePreviewModel.modelCode || '')}
                                            style={{ fontSize: '0.8rem', color: theme.accent.cyan, background: 'transparent', border: `1px solid ${theme.accent.cyan}`, borderRadius: '7px', padding: '5px 12px', cursor: 'pointer' }}>
                                            📋 Copy
                                        </button>
                                        <button
                                            onClick={() => setCodePreviewModel(null)}
                                            style={{ background: 'transparent', border: 'none', color: theme.text.tertiary, fontSize: '1.6rem', cursor: 'pointer', lineHeight: 1 }}>
                                            ×
                                        </button>
                                    </div>
                                </div>
                                {/* Code block */}
                                <pre style={{
                                    margin: 0, padding: '20px 24px',
                                    background: isDarkTheme ? '#0d1117' : '#f6f8fa',
                                    color: isDarkTheme ? '#e6edf3' : '#24292f',
                                    fontSize: '0.85rem', lineHeight: '1.75',
                                    fontFamily: '"Fira Code","JetBrains Mono","Cascadia Code",Consolas,monospace',
                                    overflowY: 'auto', overflowX: 'auto',
                                    whiteSpace: 'pre', tabSize: 4,
                                    flex: 1,
                                }}>
                                    <code>{codePreviewModel.modelCode || '# No code stored for this model'}</code>
                                </pre>
                            </div>
                        </div>
                    )}

                    {/* ── Timeframe Sensitivity Results ─────────────────────── */}
                    {showTfResults && tfSensitivityResults.length > 0 && (
                        <div style={{ ...styles.modal, zIndex: 1100 }} onClick={() => setShowTfResults(false)}>
                            <div onClick={e => e.stopPropagation()} style={{
                                background: theme.bg.secondary, borderRadius: '18px',
                                padding: '28px 32px', width: '90%', maxWidth: '580px',
                                border: `1px solid ${theme.border.medium}`,
                                boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                                    <div>
                                        <div style={{ fontWeight: '800', fontSize: '1.15rem', color: theme.text.primary }}>⏱ Timeframe Sensitivity</div>
                                        <div style={{ fontSize: '0.82rem', color: theme.text.tertiary, marginTop: '4px' }}>
                                            {selectedAsset} · {batchTestModel?.model_id} · {batchTestTp}% TP / {batchTestSl}% SL
                                        </div>
                                    </div>
                                    <button onClick={() => setShowTfResults(false)}
                                        style={{ background: 'transparent', border: 'none', color: theme.text.tertiary, fontSize: '1.6rem', cursor: 'pointer', lineHeight: 1 }}>×</button>
                                </div>

                                {/* Best timeframe callout */}
                                {(() => {
                                    const best = [...tfSensitivityResults].sort((a, b) => b.pl - a.pl)[0];
                                    return best ? (
                                        <div style={{ padding: '14px 18px', borderRadius: '12px', marginBottom: '20px',
                                            background: `${theme.accent.green}15`, border: `1px solid ${theme.accent.green}40` }}>
                                            <div style={{ fontSize: '0.78rem', color: theme.accent.green, fontWeight: '700', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>🏆 Best Timeframe</div>
                                            <div style={{ fontWeight: '800', fontSize: '1.4rem', color: theme.accent.green }}>{best.timeframe}</div>
                                            <div style={{ fontSize: '0.83rem', color: theme.text.secondary, marginTop: '2px' }}>
                                                {best.trades} trades · {best.winRate}% win rate · +${parseFloat(best.pl).toFixed(2)} P&L
                                            </div>
                                        </div>
                                    ) : null;
                                })()}

                                {/* Results table */}
                                <div style={{ borderRadius: '10px', overflow: 'hidden', border: `1px solid ${theme.border.light}` }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr 1fr 1fr 1fr', background: theme.bg.tertiary, padding: '10px 14px' }}>
                                        {['TF', 'Trades', 'Win Rate', 'P&L', 'Avg P&L%'].map(h => (
                                            <div key={h} style={{ fontSize: '0.72rem', fontWeight: '700', color: theme.text.tertiary, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</div>
                                        ))}
                                    </div>
                                    {[...tfSensitivityResults].sort((a, b) => b.pl - a.pl).map((r, i) => {
                                        const isTop = i === 0;
                                        return (
                                            <div key={r.timeframe} style={{ display: 'grid', gridTemplateColumns: '80px 1fr 1fr 1fr 1fr',
                                                padding: '12px 14px', alignItems: 'center',
                                                borderTop: `1px solid ${theme.border.light}`,
                                                background: isTop ? `${theme.accent.green}08` : 'transparent' }}>
                                                <div style={{ fontWeight: '800', fontSize: '0.95rem', color: isTop ? theme.accent.green : theme.text.primary }}>
                                                    {r.timeframe} {isTop ? '🏆' : ''}
                                                </div>
                                                <div style={{ color: theme.text.secondary, fontSize: '0.88rem' }}>{r.trades}</div>
                                                <div style={{ color: parseFloat(r.winRate) >= 50 ? theme.accent.green : theme.accent.red, fontWeight: '600', fontSize: '0.88rem' }}>
                                                    {r.winRate}%
                                                </div>
                                                <div style={{ color: r.pl >= 0 ? theme.accent.green : theme.accent.red, fontWeight: '700', fontSize: '0.88rem' }}>
                                                    {r.pl >= 0 ? '+' : ''}${parseFloat(r.pl).toFixed(2)}
                                                </div>
                                                <div style={{ color: parseFloat(r.plPct) >= 0 ? theme.accent.green : theme.accent.red, fontSize: '0.88rem' }}>
                                                    {r.plPct >= 0 ? '+' : ''}{r.plPct}%
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                <button onClick={() => setShowTfResults(false)} style={{
                                    marginTop: '20px', width: '100%', padding: '12px', borderRadius: '10px',
                                    background: theme.bg.tertiary, border: `1px solid ${theme.border.medium}`,
                                    color: theme.text.secondary, fontWeight: '600', cursor: 'pointer', fontSize: '0.9rem',
                                }}>Close</button>
                            </div>
                        </div>
                    )}

                    {/* ── Batch Test Model Picker ─────────────────────────── */}
                    {showBatchModelPicker && (
                        <div style={{ ...styles.modal, zIndex: 1100 }} onClick={() => setShowBatchModelPicker(false)}>
                            <div onClick={e => e.stopPropagation()} style={{
                                background: theme.bg.secondary, borderRadius: '16px',
                                padding: '28px 32px', width: '90%', maxWidth: '520px',
                                border: `1px solid ${theme.border.medium}`,
                                boxShadow: '0 25px 60px rgba(0,0,0,0.4)',
                            }}>
                                {/* Header */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                                    <div>
                                        <div style={{ fontWeight: '800', fontSize: '1.1rem', color: theme.text.primary }}>🚀 Test All Assets</div>
                                        <div style={{ fontSize: '0.82rem', color: theme.text.tertiary, marginTop: '4px' }}>
                                            {watchlistAssets.length} assets · {batchTestTp}% TP / {batchTestSl}% SL · 1Y daily data
                                        </div>
                                    </div>
                                    <button onClick={() => setShowBatchModelPicker(false)}
                                        style={{ background: 'transparent', border: 'none', color: theme.text.tertiary, fontSize: '1.6rem', cursor: 'pointer', lineHeight: 1 }}>×</button>
                                </div>

                                <div style={{ height: '1px', background: theme.border.light, margin: '18px 0' }} />

                                {/* Model list */}
                                <div style={{ marginBottom: '6px', fontSize: '0.8rem', fontWeight: '700', color: theme.text.secondary, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                                    Choose a model
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '320px', overflowY: 'auto', marginBottom: '20px' }}>
                                    {forwardTestModels.length === 0 ? (
                                        <div style={{ padding: '20px', textAlign: 'center', color: theme.text.tertiary, fontSize: '0.85rem', background: theme.bg.tertiary, borderRadius: '10px' }}>
                                            No models found — save a model first
                                        </div>
                                    ) : forwardTestModels.map((m, idx) => {
                                        const modelId    = m.model_id || m.id || `model-${idx}`;
                                        const modelCode  = m.cleaned_model_code || m.code || m.model_code || '';
                                        const modelNotes = m.notes || m.description || '';
                                        const modelDate  = m.created_at || m.date || '';
                                        const isPicked   = batchTestModel?.model_id === modelId;
                                        return (
                                            <div key={modelId}
                                                onClick={() => setBatchTestModel({ ...m, model_id: modelId, cleaned_model_code: modelCode })}
                                                style={{
                                                    padding: '12px 14px', borderRadius: '10px', cursor: 'pointer',
                                                    border: `2px solid ${isPicked ? theme.accent.purple : theme.border.light}`,
                                                    background: isPicked ? `${theme.accent.purple}15` : theme.bg.tertiary,
                                                    transition: 'border-color 0.15s',
                                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                                }}>
                                                <div style={{ minWidth: 0 }}>
                                                    <div style={{ fontWeight: '700', fontSize: '0.9rem', color: isPicked ? theme.accent.purple : theme.text.primary, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                        {modelId}
                                                        {isPicked && <span style={{ fontSize: '0.68rem', background: `${theme.accent.purple}25`, color: theme.accent.purple, padding: '1px 8px', borderRadius: '8px' }}>SELECTED</span>}
                                                    </div>
                                                    {modelNotes && <div style={{ fontSize: '0.75rem', color: theme.text.secondary, marginTop: '2px' }}>{modelNotes}</div>}
                                                    <div style={{ fontSize: '0.7rem', color: theme.text.tertiary, marginTop: '2px' }}>
                                                        {modelDate ? new Date(modelDate).toLocaleDateString() : ''}
                                                        {modelCode ? ` · ${modelCode.split('\n').length} lines` : ''}
                                                    </div>
                                                </div>
                                                <div style={{
                                                    width: '20px', height: '20px', borderRadius: '50%', flexShrink: 0,
                                                    border: `2px solid ${isPicked ? theme.accent.purple : theme.border.medium}`,
                                                    background: isPicked ? theme.accent.purple : 'transparent',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                }}>
                                                    {isPicked && <span style={{ color: 'white', fontSize: '0.65rem', fontWeight: '900' }}>✓</span>}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* TP / SL controls for entire batch */}
                                <div style={{ marginBottom: '18px' }}>
                                    <div style={{ marginBottom: '6px', fontSize: '0.8rem', fontWeight: '700', color: theme.text.secondary, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                                        TP / SL for batch
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                        <div style={{ background: theme.bg.tertiary, padding: '10px 12px', borderRadius: '10px', border: `1px solid ${theme.border.light}` }}>
                                            <div style={{ fontSize: '0.72rem', color: theme.text.tertiary, marginBottom: '4px', fontWeight: '600' }}>Take Profit %</div>
                                            <input type="number" value={batchTestTp} onChange={e => setBatchTestTp(e.target.value)}
                                                min="0" step="0.5"
                                                style={{ width: '100%', padding: '6px 8px', fontSize: '0.9rem', fontWeight: '700',
                                                    background: theme.bg.elevated, color: theme.accent.green,
                                                    border: `1px solid ${theme.border.medium}`, borderRadius: '6px' }} />
                                        </div>
                                        <div style={{ background: theme.bg.tertiary, padding: '10px 12px', borderRadius: '10px', border: `1px solid ${theme.border.light}` }}>
                                            <div style={{ fontSize: '0.72rem', color: theme.text.tertiary, marginBottom: '4px', fontWeight: '600' }}>Stop Loss %</div>
                                            <input type="number" value={batchTestSl} onChange={e => setBatchTestSl(e.target.value)}
                                                min="0" step="0.5"
                                                style={{ width: '100%', padding: '6px 8px', fontSize: '0.9rem', fontWeight: '700',
                                                    background: theme.bg.elevated, color: theme.accent.red,
                                                    border: `1px solid ${theme.border.medium}`, borderRadius: '6px' }} />
                                        </div>
                                    </div>
                                </div>

                                {/* Asset limit */}
                                <div style={{ marginBottom: '18px' }}>
                                    <div style={{ marginBottom: '6px', fontSize: '0.8rem', fontWeight: '700', color: theme.text.secondary, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                                        Limit assets (optional)
                                    </div>
                                    <div style={{ background: theme.bg.tertiary, padding: '10px 12px', borderRadius: '10px', border: `1px solid ${theme.border.light}` }}>
                                        <div style={{ fontSize: '0.72rem', color: theme.text.tertiary, marginBottom: '4px', fontWeight: '600' }}>
                                            Test only first N assets (blank = all {watchlistAssets.length})
                                        </div>
                                        <input type="number" value={batchAssetLimit} onChange={e => setBatchAssetLimit(e.target.value)}
                                            placeholder={`All ${watchlistAssets.length} assets`}
                                            min="1" max={watchlistAssets.length}
                                            style={{ width: '100%', padding: '6px 8px', fontSize: '0.9rem', fontWeight: '600',
                                                background: theme.bg.elevated, color: theme.text.primary,
                                                border: `1px solid ${theme.border.medium}`, borderRadius: '6px' }} />
                                    </div>
                                </div>

                                {/* Start button */}
                                <button
                                    disabled={!batchTestModel}
                                    onClick={() => {
                                        if (!batchTestModel) return;
                                        const limit = parseInt(batchAssetLimit) || watchlistAssets.length;
                                        const queue = watchlistAssets.slice(0, limit);
                                        setBatchTestQueue(queue);
                                        setBatchTestResults([]);
                                        setBatchTestStopped(false);
                                        setBatchTestRunning(true);
                                        setShowBatchModelPicker(false);
                                        setShowWatchlistModal(false);
                                        addToast(`Batch test started with model ${batchTestModel.model_id} · ${queue.length} assets · ${batchTestTp}% TP / ${batchTestSl}% SL`, 'info', 4500);
                                    }}
                                    style={{
                                        width: '100%', padding: '13px', borderRadius: '10px', fontWeight: '800',
                                        fontSize: '0.95rem', cursor: batchTestModel ? 'pointer' : 'not-allowed',
                                        background: batchTestModel ? `linear-gradient(135deg,${theme.accent.purple},#6d28d9)` : theme.bg.tertiary,
                                        color: batchTestModel ? 'white' : theme.text.tertiary,
                                        border: 'none', transition: 'opacity 0.15s',
                                        opacity: batchTestModel ? 1 : 0.5,
                                    }}>
                                    {batchTestModel ? `🚀 Start — ${batchTestModel.model_id}` : 'Select a model above'}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* ── Backtest Watchlist Modal ───────────────────────────── */}
                    {showWatchlistModal && (
                        <div style={styles.modal} onClick={() => setShowWatchlistModal(false)}>
                            <div style={{ ...styles.modalContent, maxWidth: '680px' }} onClick={e => e.stopPropagation()}>

                                {/* Header */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                    <h2 style={{ margin: 0, color: theme.text.primary, fontSize: '1.2rem' }}>⭐ Backtest Watchlist</h2>
                                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                                        {/* Once-off: seed stocks */}
                                        <button onClick={async () => {
                                            addToast('Seeding stock universe…', 'info', 2000);
                                            const r = await fetch(`${BACKEND_API_URL}/api/backtest-create-snowai-account/`, { method: 'POST' });
                                            const res = await fetch(`${BACKEND_API_URL}/api/backtest-bulk-fill-watchlist/`, { method: 'POST' });
                                            const d = await res.json();
                                            if (d.success) addToast(`Added ${d.added} stocks (${d.skipped} already existed)`, 'success');
                                            else addToast('Failed to seed stocks', 'error');
                                            await fetchWatchlist();
                                        }} style={{ ...styles.buttonSecondary, fontSize: '0.78rem', background: theme.bg.tertiary, border: `1px solid ${theme.border.medium}`, color: theme.text.secondary }}>
                                            📦 Fill Stocks
                                        </button>
                                        {/* Delete all AccountTrades + re-seed watchlist */}
                                        <button onClick={async () => {
                                            if (!window.confirm('Delete ALL batch trade entries from the database and re-seed the watchlist for a fresh run?')) return;
                                            addToast('Wiping trade entries…', 'info', 2000);
                                            const delRes = await fetch(`${BACKEND_API_URL}/api/backtest-delete-all-trades/`, { method: 'DELETE' });
                                            const delData = await delRes.json();
                                            // Also re-seed watchlist with all stocks
                                            await fetch(`${BACKEND_API_URL}/api/backtest-bulk-fill-watchlist/`, { method: 'POST' });
                                            await fetchWatchlist();
                                            if (delData.success) addToast(`🗑 Deleted ${delData.deleted} trade(s) · Watchlist re-seeded`, 'success', 4000);
                                            else addToast('Error deleting trades', 'error');
                                        }} style={{ ...styles.buttonSecondary, fontSize: '0.78rem', background: `${theme.accent.red}15`, border: `1px solid ${theme.accent.red}50`, color: theme.accent.red }}>
                                            🗑 Reset & Re-seed
                                        </button>
                                        {/* Fix Loss positives — once-off repair */}
                                        <button onClick={async () => {
                                            if (!window.confirm('Fix all existing Loss trades to have POSITIVE amounts?\n\n(Equity curve logic elsewhere handles the negation — amounts should be stored positive.)')) return;
                                            addToast('Fixing loss trades…', 'info', 2000);
                                            const res = await fetch(`${BACKEND_API_URL}/api/backtest-fix-loss-positives/`, { method: 'POST' });
                                            const data = await res.json();
                                            if (data.success) addToast(`✅ ${data.message}`, 'success', 4000);
                                            else addToast('Error fixing trades', 'error');
                                        }} style={{ ...styles.buttonSecondary, fontSize: '0.78rem', background: `${theme.accent.orange}15`, border: `1px solid ${theme.accent.orange}50`, color: theme.accent.orange }}>
                                            🔧 Fix Loss Positives
                                        </button>
                                        {/* Test All button */}
                                        {!batchTestRunning ? (
                                            <button onClick={() => {
                                                if (watchlistAssets.length === 0) return;
                                                fetchForwardTestModels();
                                                setShowBatchModelPicker(true);
                                            }} style={{ ...styles.buttonSecondary, background: `linear-gradient(135deg,${theme.accent.purple},#6d28d9)`, color: 'white', border: 'none', fontSize: '0.85rem', fontWeight: '700' }}>
                                                🚀 Test All
                                            </button>
                                        ) : (
                                            <button onClick={stopBatchTest}
                                                style={{ ...styles.buttonSecondary, background: theme.accent.red, color: 'white', border: 'none', fontSize: '0.85rem', fontWeight: '700' }}>
                                                ⏹ Stop Testing
                                            </button>
                                        )}
                                        <button onClick={() => setWatchlistAddOpen(p => !p)}
                                            style={{ ...styles.buttonSecondary, background: `linear-gradient(135deg,${theme.accent.green},#059669)`, color: 'white', border: 'none', fontSize: '0.85rem' }}>
                                            {watchlistAddOpen ? '✕ Cancel' : '＋ Add Asset'}
                                        </button>
                                        <button onClick={() => setShowWatchlistModal(false)}
                                            style={{ background: 'transparent', border: 'none', color: theme.text.tertiary, fontSize: '1.8rem', cursor: 'pointer', lineHeight: 1 }}>×</button>
                                    </div>
                                </div>

                                {/* Batch test status banner */}
                                {batchTestRunning && (
                                    <div style={{ marginBottom: '16px', padding: '12px 16px', background: `${theme.accent.purple}15`,
                                        border: `1px solid ${theme.accent.purple}40`, borderRadius: '10px',
                                        display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <div>
                                            <div style={{ fontWeight: '700', color: theme.accent.purple, fontSize: '0.9rem' }}>
                                                🚀 Batch test running…
                                            </div>
                                            {batchTestCurrent && (
                                                <div style={{ fontSize: '0.8rem', color: theme.text.secondary, marginTop: '2px' }}>
                                                    Testing <strong>{batchTestCurrent.symbol}</strong> — {batchTestQueue.length} remaining
                                                </div>
                                            )}
                                        </div>
                                        <div style={{ fontSize: '0.8rem', color: theme.text.tertiary }}>
                                            {batchTestResults.length} done
                                        </div>
                                    </div>
                                )}

                                {/* Batch results summary (after stop or finish) */}
                                {batchTestResults.length > 0 && !batchTestRunning && (
                                    <div style={{ marginBottom: '16px', padding: '14px 16px', background: theme.bg.tertiary, borderRadius: '10px', border: `1px solid ${theme.border.light}` }}>
                                        <div style={{ fontWeight: '700', color: theme.text.primary, marginBottom: '10px' }}>
                                            📊 Batch Test Results — {batchTestResults.length} assets
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '200px', overflowY: 'auto' }}>
                                            {batchTestResults.map(r => (
                                                <div key={r.symbol} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem',
                                                    padding: '5px 8px', background: theme.bg.elevated, borderRadius: '6px' }}>
                                                    <span style={{ fontWeight: '600', color: theme.text.primary }}>{r.symbol}</span>
                                                    <span style={{ color: theme.text.tertiary }}>{r.trades} trades</span>
                                                    <span style={{ fontWeight: '700', color: r.pl >= 0 ? theme.accent.green : theme.accent.red }}>
                                                        {r.pl >= 0 ? '+' : ''}${r.pl.toFixed(2)} ({r.plPct >= 0 ? '+' : ''}{r.plPct.toFixed(2)}%)
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                        {/* Average */}
                                        {batchTestResults.length > 0 && (() => {
                                            const avgPl = batchTestResults.reduce((s,r) => s + r.pl, 0) / batchTestResults.length;
                                            const avgPct = batchTestResults.reduce((s,r) => s + r.plPct, 0) / batchTestResults.length;
                                            return (
                                                <div style={{ marginTop: '10px', padding: '8px', background: `${theme.accent.purple}15`, borderRadius: '7px',
                                                    display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: '700' }}>
                                                    <span style={{ color: theme.accent.purple }}>Average per asset</span>
                                                    <span style={{ color: avgPl >= 0 ? theme.accent.green : theme.accent.red }}>
                                                        {avgPl >= 0 ? '+' : ''}${avgPl.toFixed(2)} ({avgPct >= 0 ? '+' : ''}{avgPct.toFixed(2)}%)
                                                    </span>
                                                </div>
                                            );
                                        })()}
                                    </div>
                                )}

                                {/* Add form */}
                                {watchlistAddOpen && (
                                    <div style={{ marginBottom: '20px', padding: '18px', background: theme.bg.tertiary, borderRadius: '12px', border: `1px solid ${theme.accent.green}30` }}>
                                        <div style={{ fontWeight: '700', color: theme.accent.green, marginBottom: '14px', fontSize: '0.9rem' }}>＋ New Watchlist Asset</div>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                                            <div>
                                                <label style={styles.label}>Symbol *</label>
                                                <input style={styles.input} placeholder="e.g. AAPL" value={watchlistAddForm.symbol}
                                                    onChange={e => setWatchlistAddForm(p => ({ ...p, symbol: e.target.value.toUpperCase() }))} />
                                            </div>
                                            <div>
                                                <label style={styles.label}>Name *</label>
                                                <input style={styles.input} placeholder="e.g. Apple Inc." value={watchlistAddForm.name}
                                                    onChange={e => setWatchlistAddForm(p => ({ ...p, name: e.target.value }))} />
                                            </div>
                                            <div>
                                                <label style={styles.label}>Asset Class</label>
                                                <select style={styles.input} value={watchlistAddForm.asset_class}
                                                    onChange={e => setWatchlistAddForm(p => ({ ...p, asset_class: e.target.value }))}>
                                                    {['Stocks','Crypto','Forex','ETF','Commodities','Indices','Other'].map(c => (
                                                        <option key={c} value={c}>{c}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
                                                <label style={styles.label}>yFinance Symbol <span style={{ color: theme.text.tertiary }}>(if different)</span></label>
                                                <input style={styles.input} placeholder="e.g. BTC-USD" value={watchlistAddForm.yfinance_symbol}
                                                    onChange={e => setWatchlistAddForm(p => ({ ...p, yfinance_symbol: e.target.value }))} />
                                            </div>
                                        </div>
                                        <div style={{ marginBottom: '12px' }}>
                                            <label style={styles.label}>Notes (optional)</label>
                                            <input style={styles.input} placeholder="Why is this on your radar?" value={watchlistAddForm.notes}
                                                onChange={e => setWatchlistAddForm(p => ({ ...p, notes: e.target.value }))} />
                                        </div>
                                        <button onClick={addWatchlistAsset} disabled={watchlistSaving || !watchlistAddForm.symbol || !watchlistAddForm.name}
                                            style={{ ...styles.buttonPrimary, opacity: (watchlistSaving || !watchlistAddForm.symbol || !watchlistAddForm.name) ? 0.5 : 1,
                                                background: `linear-gradient(135deg,${theme.accent.green},#059669)` }}>
                                            {watchlistSaving ? '⏳ Saving...' : '✓ Save Asset'}
                                        </button>
                                    </div>
                                )}

                                {/* Asset list grouped by class */}
                                {watchlistLoading ? (
                                    <div style={{ textAlign: 'center', padding: '30px', color: theme.text.tertiary }}>⏳ Loading watchlist...</div>
                                ) : watchlistAssets.length === 0 ? (
                                    <div style={{ textAlign: 'center', padding: '40px 20px', color: theme.text.tertiary }}>
                                        <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>⭐</div>
                                        <div style={{ fontWeight: '600', marginBottom: '6px' }}>Watchlist is empty</div>
                                        <div style={{ fontSize: '0.85rem' }}>Add assets you want quick access to for backtesting</div>
                                    </div>
                                ) : (() => {
                                    // Group by asset_class
                                    const groups = watchlistAssets.reduce((acc, a) => {
                                        (acc[a.asset_class] = acc[a.asset_class] || []).push(a);
                                        return acc;
                                    }, {});
                                    const classColours = {
                                        Stocks: theme.blue[500], Crypto: theme.accent.orange,
                                        Forex: theme.accent.cyan, ETF: theme.accent.purple,
                                        Commodities: theme.accent.green, Indices: theme.accent.pink || '#ec4899',
                                        Other: theme.text.tertiary,
                                    };
                                    return (
                                        <div style={{ maxHeight: '500px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                            {Object.entries(groups).map(([cls, assets]) => (
                                                <div key={cls}>
                                                    {/* Group header */}
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px',
                                                        paddingBottom: '6px', borderBottom: `2px solid ${classColours[cls] || theme.border.medium}40` }}>
                                                        <span style={{ fontWeight: '800', fontSize: '0.88rem', color: classColours[cls] || theme.text.primary }}>{cls}</span>
                                                        <span style={{ fontSize: '0.75rem', color: theme.text.tertiary }}>{assets.length} asset{assets.length !== 1 ? 's' : ''}</span>
                                                    </div>
                                                    {/* Asset cards */}
                                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '8px' }}>
                                                        {assets.map(asset => (
                                                            <div key={asset.id} style={{
                                                                background: theme.bg.tertiary, borderRadius: '10px', padding: '12px 14px',
                                                                border: `1px solid ${theme.border.light}`, position: 'relative',
                                                                cursor: 'pointer', transition: 'border-color 0.15s',
                                                            }}
                                                            onMouseEnter={e => e.currentTarget.style.borderColor = classColours[cls] || theme.accent.cyan}
                                                            onMouseLeave={e => e.currentTarget.style.borderColor = theme.border.light}>
                                                                {/* Main content — click to navigate */}
                                                                <div onClick={() => selectWatchlistAsset(asset)} style={{ paddingRight: '28px' }}>
                                                                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '4px' }}>
                                                                        <span style={{ fontWeight: '800', fontSize: '1rem', color: theme.text.primary }}>{asset.symbol}</span>
                                                                        <span style={{ fontSize: '0.72rem', color: classColours[cls] || theme.text.tertiary,
                                                                            background: `${classColours[cls]}18`, padding: '1px 7px', borderRadius: '8px' }}>
                                                                            {asset.asset_class}
                                                                        </span>
                                                                    </div>
                                                                    <div style={{ fontSize: '0.82rem', color: theme.text.secondary, marginBottom: asset.notes ? '4px' : 0 }}>{asset.name}</div>
                                                                    {asset.notes && <div style={{ fontSize: '0.74rem', color: theme.text.tertiary, fontStyle: 'italic' }}>{asset.notes}</div>}
                                                                    <div style={{ fontSize: '0.72rem', color: theme.text.tertiary, marginTop: '6px' }}>
                                                                        Click to load →
                                                                    </div>
                                                                </div>
                                                                {/* Delete button */}
                                                                <button
                                                                    onClick={e => { e.stopPropagation(); deleteWatchlistAsset(asset.id); }}
                                                                    style={{ position: 'absolute', top: '8px', right: '8px',
                                                                        background: 'transparent', border: 'none', color: theme.text.tertiary,
                                                                        cursor: 'pointer', fontSize: '1rem', lineHeight: 1, padding: '2px 4px',
                                                                        borderRadius: '4px' }}
                                                                    title="Remove from watchlist"
                                                                >
                                                                    🗑
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    );
                                })()}
                            </div>
                        </div>
                    )}

                    {/* Asset Selection Modal */}
                    {showAssetModal && (
                        <div style={styles.modal} onClick={() => setShowAssetModal(false)}>
                            <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                                    <h2 style={{ color: theme.blue[700], margin: 0 }}>
                                        🔍 Search & Select Asset
                                    </h2>
                                    <button
                                        onClick={() => setShowAssetModal(false)}
                                        style={{
                                            background: 'transparent',
                                            border: 'none',
                                            color: theme.text.primary,
                                            fontSize: '2rem',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        ×
                                    </button>
                                </div>
                                
                                <input
                                    type="text"
                                    placeholder="🔍 Search assets (e.g., AAPL, BTC, EURUSD)..."
                                    style={styles.searchBar}
                                    value={assetSearchQuery}
                                    onChange={(e) => setAssetSearchQuery(e.target.value)}
                                    autoFocus
                                />
                                
                                <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
                                    {Object.entries(getFilteredAssets()).map(([category, symbols]) => (
                                        <div key={category} style={{ marginBottom: '25px' }}>
                                            <h3 style={{ 
                                                color: theme.blue[600], 
                                                marginBottom: '12px',
                                                textTransform: 'uppercase',
                                                fontSize: '1.1rem',
                                                letterSpacing: '1px'
                                            }}>
                                                {category}
                                            </h3>
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                                {symbols.map(symbol => (
                                                    <button
                                                        key={symbol}
                                                        onClick={() => {
                                                            setSelectedAsset(symbol);
                                                            setShowAssetModal(false);
                                                            setAssetSearchQuery('');
                                                        }}
                                                        style={{
                                                            ...styles.assetButton,
                                                            ...(selectedAsset === symbol ? styles.assetButtonActive : styles.assetButtonInactive)
                                                        }}
                                                    >
                                                        {symbol}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {/* Trade History Modal */}
                    {showTradeHistory && (
                        <div style={styles.modal} onClick={() => setShowTradeHistory(false)}>
                            <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                                    <h2 style={{ color: theme.blue[700], margin: 0 }}>
                                        📊 {backtestMode ? 'Backtest' : 'Live'} Trade History - {selectedAssetInfo?.name}
                                    </h2>
                                    <button
                                        onClick={() => setShowTradeHistory(false)}
                                        style={{
                                            background: 'transparent',
                                            border: 'none',
                                            color: theme.text.primary,
                                            fontSize: '2rem',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        ×
                                    </button>
                                </div>
                                
                                {!backtestMode && tradeStats && (
                                    <div style={{ 
                                        display: 'grid', 
                                        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
                                        gap: '15px',
                                        marginBottom: '25px'
                                    }}>
                                        <div style={styles.statCard}>
                                            <div style={{ ...styles.statValue, color: theme.blue[600] }}>
                                                {tradeStats.closed_trades || 0}
                                            </div>
                                            <div style={styles.statLabel}>Closed Trades</div>
                                        </div>
                                        <div style={styles.statCard}>
                                            <div style={{ ...styles.statValue, color: theme.accent.green }}>
                                                {tradeStats.winning_trades || 0}
                                            </div>
                                            <div style={styles.statLabel}>Winners</div>
                                        </div>
                                        <div style={styles.statCard}>
                                            <div style={{ ...styles.statValue, color: theme.accent.red }}>
                                                {tradeStats.losing_trades || 0}
                                            </div>
                                            <div style={styles.statLabel}>Losers</div>
                                        </div>
                                        <div style={styles.statCard}>
                                            <div style={{ ...styles.statValue, color: theme.accent.cyan }}>
                                                {tradeStats.win_rate || 0}%
                                            </div>
                                            <div style={styles.statLabel}>Win Rate</div>
                                        </div>
                                        <div style={styles.statCard}>
                                            <div style={{ 
                                                ...styles.statValue, 
                                                color: (tradeStats.net_profit || 0) >= 0 ? theme.accent.green : theme.accent.red 
                                            }}>
                                                ${(tradeStats.net_profit || 0).toFixed(2)}
                                            </div>
                                            <div style={styles.statLabel}>Net P&L</div>
                                        </div>
                                    </div>
                                )}
                                
                                {backtestMode && backtestEquityCurve.length > 0 && (
                                    <div style={styles.statCard}>
                                        <div style={{ ...styles.statValue, color: backtestBalance >= 10000 ? theme.accent.green : theme.accent.red }}>
                                            ${backtestBalance.toFixed(2)}
                                        </div>
                                        <div style={styles.statLabel}>Current Equity</div>
                                        <div style={{ marginTop: '10px', color: theme.text.secondary }}>
                                            Starting: $10,000.00
                                        </div>
                                        <div style={{ 
                                            marginTop: '5px', 
                                            color: backtestBalance >= 10000 ? theme.accent.green : theme.accent.red,
                                            fontWeight: '600'
                                        }}>
                                            P&L: {backtestBalance >= 10000 ? '+' : ''}${(backtestBalance - 10000).toFixed(2)}
                                        </div>
                                    </div>
                                )}
                                
                                {/* Asset equity summary (live mode only) */}
                                {!backtestMode && tradeHistory.length > 0 && (() => {
                                    const assetTrades = tradeHistory.filter(t => t.asset_symbol === selectedAsset);
                                    const closed  = assetTrades.filter(t => t.status === 'CLOSED');
                                    const open    = assetTrades.filter(t => t.status === 'OPEN');
                                    const realisedPnL = closed.reduce((s, t) => s + parseFloat(t.profit_loss || 0), 0);
                                    const unrealisedPnL = open.reduce((s, t) => {
                                        const ep = parseFloat(t.entry_price), qty = parseFloat(t.quantity);
                                        if (!currentPrice || !ep) return s;
                                        return s + (t.order_type === 'BUY'
                                            ? (currentPrice - ep) * qty
                                            : (ep - currentPrice) * qty);
                                    }, 0);
                                    const totalPnL = realisedPnL + unrealisedPnL;
                                    return (
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px', marginBottom: '20px', padding: '16px', background: theme.bg.tertiary, borderRadius: '12px', border: `1px solid ${theme.border.light}` }}>
                                            <div>
                                                <div style={{ fontSize: '0.75rem', color: theme.text.tertiary, textTransform: 'uppercase', marginBottom: '4px' }}>Closed Trades</div>
                                                <div style={{ fontSize: '1.1rem', fontWeight: '700', color: theme.text.primary }}>{closed.length}</div>
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '0.75rem', color: theme.text.tertiary, textTransform: 'uppercase', marginBottom: '4px' }}>Open Trades</div>
                                                <div style={{ fontSize: '1.1rem', fontWeight: '700', color: theme.blue[600] }}>{open.length}</div>
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '0.75rem', color: theme.text.tertiary, textTransform: 'uppercase', marginBottom: '4px' }}>Realised P&L</div>
                                                <div style={{ fontSize: '1.1rem', fontWeight: '700', color: realisedPnL >= 0 ? theme.accent.green : theme.accent.red }}>
                                                    {realisedPnL >= 0 ? '+' : ''}${realisedPnL.toFixed(2)}
                                                </div>
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '0.75rem', color: theme.text.tertiary, textTransform: 'uppercase', marginBottom: '4px' }}>Unrealised P&L</div>
                                                <div style={{ fontSize: '1.1rem', fontWeight: '700', color: unrealisedPnL >= 0 ? theme.accent.green : theme.accent.red }}>
                                                    {unrealisedPnL >= 0 ? '+' : ''}${unrealisedPnL.toFixed(2)}
                                                </div>
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '0.75rem', color: theme.text.tertiary, textTransform: 'uppercase', marginBottom: '4px' }}>Total P&L</div>
                                                <div style={{ fontSize: '1.2rem', fontWeight: '800', color: totalPnL >= 0 ? theme.accent.green : theme.accent.red }}>
                                                    {totalPnL >= 0 ? '+' : ''}${totalPnL.toFixed(2)}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })()}
                                
                                {/* Trade rows — split by model vs manual in backtest mode */}
                                <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
                                    {backtestMode ? (() => {
                                        const allTrades = backtestTradeHistory[selectedAssetInfo?.symbol] || [];
                                        const modelTrades  = allTrades.filter(t => t.is_model_trade);
                                        const manualTrades = allTrades.filter(t => !t.is_model_trade);

                                        const renderTradeCard = (trade) => {
                                            const isOpen = trade.status === 'OPEN';
                                            const ep     = parseFloat(trade.entry_price);
                                            const qty    = parseFloat(trade.quantity);
                                            const balAtEntry = trade.balance_at_entry || (ep * qty);

                                            // Live unrealised P&L (open trades only)
                                            let uPnL = null, uPct = null;
                                            if (isOpen && currentPrice && ep && trade.asset_symbol === selectedAsset) {
                                                uPnL = trade.order_type === 'BUY'
                                                    ? (currentPrice - ep) * qty
                                                    : (ep - currentPrice) * qty;
                                                // Equity % — P&L relative to balance at entry
                                                uPct = (uPnL / balAtEntry) * 100;
                                            }

                                            const pl = parseFloat(trade.profit_loss || 0);
                                            // Stored equity %, or compute on the fly if missing
                                            const plPct = trade.profit_loss_percentage != null
                                                ? parseFloat(trade.profit_loss_percentage)
                                                : (trade.profit_loss != null ? (pl / balAtEntry) * 100 : null);

                                            const borderColour = isOpen
                                                ? (uPnL === null ? theme.blue[400] : uPnL >= 0 ? theme.accent.green : theme.accent.red)
                                                : (trade.profit_loss !== null ? (pl > 0 ? theme.accent.green : theme.accent.red) : theme.border.light);

                                            return (
                                                <div key={trade.trade_id} style={{ ...styles.tradeCard, borderLeft: `5px solid ${borderColour}`, marginBottom: '10px' }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                                            <span style={{ ...styles.badge, background: trade.order_type === 'BUY' ? theme.accent.green : theme.accent.red, color: 'white' }}>{trade.order_type}</span>
                                                            <span style={{ ...styles.badge, background: isOpen ? theme.blue[500] : theme.bg.tertiary, color: isOpen ? 'white' : theme.text.secondary }}>{trade.status}</span>
                                                            {trade.exit_reason && (
                                                                <span style={{ fontSize: '0.75rem', fontWeight: '800', letterSpacing: '0.04em',
                                                                    color: trade.exit_reason === 'TP' ? theme.accent.green : trade.exit_reason === 'SL' ? theme.accent.red : theme.text.secondary }}>
                                                                    {trade.exit_reason}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div style={{ fontSize: '0.8rem', color: theme.text.tertiary }}>{new Date(trade.entry_timestamp).toLocaleString()}</div>
                                                    </div>
                                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(105px,1fr))', gap: '8px' }}>
                                                        <div>
                                                            <div style={{ color: theme.text.tertiary, fontSize: '0.78rem' }}>Entry</div>
                                                            <div style={{ color: theme.text.primary, fontWeight: '600' }}>${ep.toFixed(4)}</div>
                                                        </div>
                                                        {trade.exit_price && (
                                                            <div>
                                                                <div style={{ color: theme.text.tertiary, fontSize: '0.78rem' }}>Exit</div>
                                                                <div style={{ color: theme.text.primary, fontWeight: '600' }}>${parseFloat(trade.exit_price).toFixed(4)}</div>
                                                            </div>
                                                        )}
                                                        {trade.take_profit && (
                                                            <div>
                                                                <div style={{ color: theme.text.tertiary, fontSize: '0.78rem' }}>TP</div>
                                                                <div style={{ color: theme.accent.green, fontWeight: '600' }}>
                                                                    ${parseFloat(trade.take_profit).toFixed(4)}
                                                                    {trade.tp_pct != null && (
                                                                        <span style={{ fontSize: '0.72rem', opacity: 0.75, marginLeft: '3px' }}>
                                                                            ({parseFloat(trade.tp_pct).toFixed(2)}%)
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )}
                                                        {trade.stop_loss && (
                                                            <div>
                                                                <div style={{ color: theme.text.tertiary, fontSize: '0.78rem' }}>SL</div>
                                                                <div style={{ color: theme.accent.red, fontWeight: '600' }}>
                                                                    ${parseFloat(trade.stop_loss).toFixed(4)}
                                                                    {trade.sl_pct != null && (
                                                                        <span style={{ fontSize: '0.72rem', opacity: 0.75, marginLeft: '3px' }}>
                                                                            ({parseFloat(trade.sl_pct).toFixed(2)}%)
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )}
                                                        {!isOpen && trade.profit_loss !== null && (
                                                            <div>
                                                                <div style={{ color: theme.text.tertiary, fontSize: '0.78rem' }}>P&L (equity)</div>
                                                                <div style={{ color: pl >= 0 ? theme.accent.green : theme.accent.red, fontWeight: '700' }}>
                                                                    {pl >= 0 ? '+' : ''}${pl.toFixed(2)}
                                                                    {plPct != null && (
                                                                        <span style={{ fontSize: '0.82rem', marginLeft: '4px' }}>
                                                                            ({plPct >= 0 ? '+' : ''}{plPct.toFixed(2)}%)
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )}
                                                        {isOpen && uPnL !== null && (
                                                            <div>
                                                                <div style={{ color: theme.text.tertiary, fontSize: '0.78rem' }}>Live P&L (equity)</div>
                                                                <div style={{ color: uPnL >= 0 ? theme.accent.green : theme.accent.red, fontWeight: '700' }}>
                                                                    {uPnL >= 0 ? '+' : ''}${uPnL.toFixed(2)}
                                                                    <span style={{ fontSize: '0.82rem', marginLeft: '4px' }}>
                                                                        ({uPct >= 0 ? '+' : ''}{uPct?.toFixed(2)}%)
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        };

                                        return (
                                            <div>
                                                {/* ── Model trades section ── */}
                                                <div style={{ marginBottom: '20px' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', paddingBottom: '8px', borderBottom: `2px solid ${theme.accent.purple}40` }}>
                                                        <span style={{ fontSize: '0.95rem', fontWeight: '800', color: theme.accent.purple }}>🤖 Model Trades</span>
                                                        <span style={{ fontSize: '0.78rem', color: theme.text.tertiary }}>
                                                            {modelTrades.length} trades · {modelTrades.filter(t => t.status === 'CLOSED').length} closed · {' '}
                                                            P&L: <span style={{ fontWeight: '700', color: (() => { const s = modelTrades.reduce((a,t) => a + parseFloat(t.profit_loss||0), 0); return s >= 0 ? theme.accent.green : theme.accent.red; })() }}>
                                                                {(() => { const s = modelTrades.reduce((a,t) => a + parseFloat(t.profit_loss||0), 0); return `${s >= 0 ? '+' : ''}$${s.toFixed(2)}`; })()}
                                                            </span>
                                                        </span>
                                                    </div>
                                                    {modelTrades.length === 0
                                                        ? <div style={{ fontSize: '0.85rem', color: theme.text.tertiary, padding: '12px', background: theme.bg.tertiary, borderRadius: '8px', textAlign: 'center' }}>No model signals fired yet</div>
                                                        : modelTrades.map(renderTradeCard)
                                                    }
                                                </div>

                                                {/* ── Manual trades section ── */}
                                                <div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', paddingBottom: '8px', borderBottom: `2px solid ${theme.blue[400]}40` }}>
                                                        <span style={{ fontSize: '0.95rem', fontWeight: '800', color: theme.blue[500] }}>✍️ Manual Trades</span>
                                                        <span style={{ fontSize: '0.78rem', color: theme.text.tertiary }}>
                                                            {manualTrades.length} trades · {manualTrades.filter(t => t.status === 'CLOSED').length} closed · {' '}
                                                            P&L: <span style={{ fontWeight: '700', color: (() => { const s = manualTrades.reduce((a,t) => a + parseFloat(t.profit_loss||0), 0); return s >= 0 ? theme.accent.green : theme.accent.red; })() }}>
                                                                {(() => { const s = manualTrades.reduce((a,t) => a + parseFloat(t.profit_loss||0), 0); return `${s >= 0 ? '+' : ''}$${s.toFixed(2)}`; })()}
                                                            </span>
                                                        </span>
                                                    </div>
                                                    {manualTrades.length === 0
                                                        ? <div style={{ fontSize: '0.85rem', color: theme.text.tertiary, padding: '12px', background: theme.bg.tertiary, borderRadius: '8px', textAlign: 'center' }}>No manual trades placed yet</div>
                                                        : manualTrades.map(renderTradeCard)
                                                    }
                                                </div>
                                            </div>
                                        );
                                    })()

                                    : tradeHistory.map(trade => {
                                        const isOpen = trade.status === 'OPEN';
                                        const ep  = parseFloat(trade.entry_price);
                                        const qty = parseFloat(trade.quantity);
                                        let uPnL = null, uPct = null;
                                        if (isOpen && currentPrice && ep && trade.asset_symbol === selectedAsset) {
                                            uPnL = trade.order_type === 'BUY' ? (currentPrice - ep) * qty : (ep - currentPrice) * qty;
                                            uPct = trade.order_type === 'BUY' ? ((currentPrice - ep) / ep) * 100 : ((ep - currentPrice) / ep) * 100;
                                        }
                                        const borderColour = isOpen
                                            ? (uPnL === null ? theme.blue[400] : uPnL >= 0 ? theme.accent.green : theme.accent.red)
                                            : (trade.profit_loss !== null && trade.profit_loss !== undefined
                                                ? (trade.profit_loss > 0 ? theme.accent.green : theme.accent.red)
                                                : theme.border.light);
                                        return (
                                        <div 
                                            key={trade.trade_id}
                                            style={{
                                                ...styles.tradeCard,
                                                borderLeft: `5px solid ${borderColour}`
                                            }}
                                        >
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                                <div>
                                                    <span style={{
                                                        ...styles.badge,
                                                        background: trade.order_type === 'BUY' ? theme.accent.green : theme.accent.red,
                                                        color: 'white'
                                                    }}>
                                                        {trade.order_type}
                                                    </span>
                                                    <span style={{
                                                        ...styles.badge,
                                                        background: trade.status === 'OPEN' ? theme.blue[500] : theme.bg.tertiary,
                                                        color: trade.status === 'OPEN' ? 'white' : theme.text.secondary,
                                                        marginLeft: '10px'
                                                    }}>
                                                        {trade.status}
                                                    </span>
                                                </div>
                                                <div style={{ fontSize: '0.9rem', color: theme.text.tertiary }}>
                                                    {new Date(trade.entry_timestamp).toLocaleString()}
                                                </div>
                                            </div>
                                            
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                                                <div>
                                                    <div style={{ color: theme.text.tertiary, fontSize: '0.85rem' }}>Entry Price</div>
                                                    <div style={{ color: theme.text.primary, fontSize: '1.1rem', fontWeight: '600' }}>
                                                        ${ep ? ep.toFixed(2) : 'N/A'}
                                                    </div>
                                                </div>
                                                {trade.exit_price && (
                                                    <div>
                                                        <div style={{ color: theme.text.tertiary, fontSize: '0.85rem' }}>Exit Price</div>
                                                        <div style={{ color: theme.text.primary, fontSize: '1.1rem', fontWeight: '600' }}>
                                                            ${parseFloat(trade.exit_price).toFixed(2)}
                                                        </div>
                                                    </div>
                                                )}
                                                {isOpen && currentPrice && trade.asset_symbol === selectedAsset && (
                                                    <div>
                                                        <div style={{ color: theme.text.tertiary, fontSize: '0.85rem' }}>Current Price</div>
                                                        <div style={{ color: theme.blue[600], fontSize: '1.1rem', fontWeight: '600' }}>
                                                            ${currentPrice.toFixed(2)}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                            
                                            {/* Realised P&L (closed trades) */}
                                            {trade.profit_loss !== null && trade.profit_loss !== undefined && (
                                                <div style={{
                                                    padding: '10px',
                                                    background: trade.profit_loss >= 0 ? `${theme.accent.green}20` : `${theme.accent.red}20`,
                                                    borderRadius: '8px',
                                                    marginBottom: '10px'
                                                }}>
                                                    <div style={{ fontSize: '0.75rem', color: theme.text.tertiary, marginBottom: '2px' }}>Realised P&L</div>
                                                    <div style={{ 
                                                        fontSize: '1.3rem', 
                                                        fontWeight: '800',
                                                        color: trade.profit_loss >= 0 ? theme.accent.green : theme.accent.red 
                                                    }}>
                                                        {trade.profit_loss >= 0 ? '+' : ''}${parseFloat(trade.profit_loss).toFixed(2)}&nbsp;
                                                        <span style={{ fontSize: '1rem' }}>
                                                            ({trade.profit_loss_percentage >= 0 ? '+' : ''}{parseFloat(trade.profit_loss_percentage || 0).toFixed(2)}%)
                                                        </span>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Unrealised P&L (open trades on current asset) */}
                                            {uPnL !== null && (
                                                <div style={{
                                                    padding: '10px',
                                                    background: uPnL >= 0 ? `${theme.accent.green}15` : `${theme.accent.red}15`,
                                                    border: `1px solid ${uPnL >= 0 ? theme.accent.green : theme.accent.red}`,
                                                    borderRadius: '8px',
                                                    marginBottom: '10px'
                                                }}>
                                                    <div style={{ fontSize: '0.75rem', color: theme.text.tertiary, marginBottom: '2px' }}>Unrealised P&L (Live)</div>
                                                    <div style={{ 
                                                        fontSize: '1.3rem', 
                                                        fontWeight: '800',
                                                        color: uPnL >= 0 ? theme.accent.green : theme.accent.red
                                                    }}>
                                                        {uPnL >= 0 ? '+' : ''}${uPnL.toFixed(2)}&nbsp;
                                                        <span style={{ fontSize: '1rem' }}>({uPct >= 0 ? '+' : ''}{uPct.toFixed(2)}%)</span>
                                                    </div>
                                                </div>
                                            )}
                                            
                                            {trade.status === 'OPEN' && (
                                                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                                    <button
                                                        onClick={() => openEditPosition(trade)}
                                                        style={{
                                                            ...styles.buttonSecondary,
                                                            flex: 1,
                                                            background: `linear-gradient(135deg, ${theme.blue[500]} 0%, ${theme.blue[600]} 100%)`,
                                                            color: 'white',
                                                            border: 'none'
                                                        }}
                                                    >
                                                        ✏️ Edit Position
                                                    </button>
                                                    <button
                                                        onClick={() => closeTrade(trade.trade_id)}
                                                        style={{
                                                            ...styles.buttonSecondary,
                                                            flex: 1,
                                                            background: theme.accent.red,
                                                            color: 'white',
                                                            border: 'none'
                                                        }}
                                                    >
                                                        🔴 Close Position
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}
                    {showOverallPerformance && overallStats && (
                        <div style={styles.modal} onClick={() => setShowOverallPerformance(false)}>
                            <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                                    <h2 style={{ color: theme.blue[700], margin: 0 }}>
                                        🏆 Overall Trading Performance
                                    </h2>
                                    <button
                                        onClick={() => setShowOverallPerformance(false)}
                                        style={{
                                            background: 'transparent',
                                            border: 'none',
                                            color: theme.text.primary,
                                            fontSize: '2rem',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        ×
                                    </button>
                                </div>
                                
                                <div style={{ 
                                    display: 'grid', 
                                    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
                                    gap: '15px',
                                    marginBottom: '30px'
                                }}>
                                    <div style={styles.statCard}>
                                        <div style={{ ...styles.statValue, color: theme.blue[600] }}>
                                            {overallStats.total_trades}
                                        </div>
                                        <div style={styles.statLabel}>Total Trades</div>
                                    </div>
                                    <div style={styles.statCard}>
                                        <div style={{ ...styles.statValue, color: theme.accent.green }}>
                                            {overallStats.winning_trades}
                                        </div>
                                        <div style={styles.statLabel}>Winners</div>
                                    </div>
                                    <div style={styles.statCard}>
                                        <div style={{ ...styles.statValue, color: theme.accent.cyan }}>
                                            {overallStats.win_rate}%
                                        </div>
                                        <div style={styles.statLabel}>Win Rate</div>
                                    </div>
                                    <div style={styles.statCard}>
                                        <div style={{ 
                                            ...styles.statValue, 
                                            color: overallStats.net_profit >= 0 ? theme.accent.green : theme.accent.red 
                                        }}>
                                            ${overallStats.net_profit.toFixed(2)}
                                        </div>
                                        <div style={styles.statLabel}>Net P&L</div>
                                    </div>
                                    <div style={styles.statCard}>
                                        <div style={{ ...styles.statValue, color: theme.accent.purple }}>
                                            {overallStats.profit_factor}
                                        </div>
                                        <div style={styles.statLabel}>Profit Factor</div>
                                    </div>
                                </div>
                                
                                <div style={{ marginBottom: '20px' }}>
                                    <h3 style={{ color: theme.blue[600], marginBottom: '15px' }}>
                                        Asset Class Breakdown
                                    </h3>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                                        {Object.entries(assetClassStats).map(([assetClass, stats]) => (
                                            <div key={assetClass} style={styles.statCard}>
                                                <h4 style={{ color: theme.text.primary, marginBottom: '10px' }}>
                                                    {assetClass}
                                                </h4>
                                                <div style={{ fontSize: '0.9rem', color: theme.text.secondary }}>
                                                    <div>Trades: {stats.total_trades}</div>
                                                    <div>Win Rate: {stats.win_rate}%</div>
                                                    <div style={{ 
                                                        color: stats.net_profit >= 0 ? theme.accent.green : theme.accent.red,
                                                        fontWeight: '700',
                                                        marginTop: '5px'
                                                    }}>
                                                        P&L: ${stats.net_profit}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                
                                <div>
                                    <h3 style={{ color: theme.blue[600], marginBottom: '15px' }}>
                                        Per Asset Performance
                                    </h3>
                                    
                                    <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                                        {assetBreakdown.map(asset => (
                                            <div key={asset.asset_symbol} style={styles.tradeCard}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <div>
                                                        <h4 style={{ color: theme.text.primary, margin: '0 0 5px 0' }}>
                                                            {asset.asset_symbol} - {asset.asset_name}
                                                        </h4>
                                                        <span style={{ 
                                                            ...styles.badge,
                                                            background: theme.blue[100],
                                                            color: theme.blue[700]
                                                        }}>
                                                            {asset.asset_class}
                                                        </span>
                                                    </div>
                                                    <div style={{
                                                        fontSize: '1.5rem',
                                                        fontWeight: '800',
                                                        color: asset.net_profit >= 0 ? theme.accent.green : theme.accent.red
                                                    }}>
                                                        ${asset.net_profit.toFixed(2)}
                                                    </div>
                                                </div>
                                                <div style={{ 
                                                    display: 'grid', 
                                                    gridTemplateColumns: 'repeat(4, 1fr)', 
                                                    gap: '10px',
                                                    marginTop: '15px',
                                                    fontSize: '0.9rem'
                                                }}>
                                                    <div>
                                                        <div style={{ color: theme.text.tertiary }}>Trades</div>
                                                        <div style={{ color: theme.text.primary, fontWeight: '600' }}>
                                                            {asset.total_trades}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div style={{ color: theme.text.tertiary }}>Winners</div>
                                                        <div style={{ color: theme.accent.green, fontWeight: '600' }}>
                                                            {asset.winning_trades}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div style={{ color: theme.text.tertiary }}>Losers</div>
                                                        <div style={{ color: theme.accent.red, fontWeight: '600' }}>
                                                            {asset.losing_trades}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div style={{ color: theme.text.tertiary }}>Win Rate</div>
                                                        <div style={{ color: theme.accent.cyan, fontWeight: '600' }}>
                                                            {asset.win_rate}%
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {/* Open Positions Modal */}
                    {showOpenPositions && (
                        <div style={styles.modal} onClick={() => setShowOpenPositions(false)}>
                            <div style={{...styles.modalContent, maxWidth: '900px'}} onClick={e => e.stopPropagation()}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                                    <div>
                                        <h2 style={{ color: theme.text.primary, margin: '0 0 4px 0' }}>
                                            📂 Open Positions
                                        </h2>
                                        <p style={{ color: theme.text.secondary, margin: 0, fontSize: '0.9rem' }}>
                                            {backtestMode ? 'Current backtest session' : 'All live open positions across assets'} · Click an asset to navigate to its chart
                                        </p>
                                    </div>
                                    <button onClick={() => setShowOpenPositions(false)} style={{ background: 'transparent', border: 'none', color: theme.text.primary, fontSize: '2rem', cursor: 'pointer' }}>×</button>
                                </div>

                                {/* Backtest open positions */}
                                {backtestMode && (() => {
                                    const allBtOpen = Object.entries(backtestTradeHistory)
                                        .flatMap(([sym, trades]) => trades.filter(t => t.status === 'OPEN'));
                                    return allBtOpen.length === 0 ? (
                                        <div style={{ textAlign: 'center', padding: '40px', color: theme.text.tertiary }}>
                                            No open backtest positions
                                        </div>
                                    ) : (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '60vh', overflowY: 'auto' }}>
                                            {allBtOpen.map(trade => (
                                                <OpenPositionCard
                                                    key={trade.trade_id}
                                                    trade={trade}
                                                    currentPrice={trade.asset_symbol === selectedAsset ? currentPrice : null}
                                                    theme={theme}
                                                    styles={styles}
                                                    onNavigate={() => switchToAsset(trade.asset_symbol, trade.asset_class)}
                                                    onEdit={() => { setShowOpenPositions(false); openEditPosition(trade); }}
                                                    onClose={() => { closeTrade(trade.trade_id); }}
                                                    isCurrentAsset={trade.asset_symbol === selectedAsset}
                                                />
                                            ))}
                                        </div>
                                    );
                                })()}

                                {/* Live open positions */}
                                {!backtestMode && (
                                    loadingOpenPositions ? (
                                        <div style={{ textAlign: 'center', padding: '40px' }}>
                                            <div style={styles.loadingSpinner} />
                                            <p style={{ color: theme.text.secondary, marginTop: '15px' }}>Loading open positions...</p>
                                        </div>
                                    ) : allOpenPositions.length === 0 ? (
                                        <div style={{ textAlign: 'center', padding: '40px', color: theme.text.tertiary }}>
                                            <div style={{ fontSize: '3rem', marginBottom: '15px' }}>📭</div>
                                            <p>No open positions found</p>
                                        </div>
                                    ) : (
                                        <>
                                            {/* Summary row */}
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', marginBottom: '20px' }}>
                                                <div style={styles.statCard}>
                                                    <div style={{ ...styles.statValue, fontSize: '1.6rem', color: theme.blue[600] }}>{allOpenPositions.length}</div>
                                                    <div style={styles.statLabel}>Open Positions</div>
                                                </div>
                                                <div style={styles.statCard}>
                                                    <div style={{ ...styles.statValue, fontSize: '1.6rem', color: theme.accent.green }}>
                                                        {allOpenPositions.filter(t => t.order_type === 'BUY').length}
                                                    </div>
                                                    <div style={styles.statLabel}>Long (BUY)</div>
                                                </div>
                                                <div style={styles.statCard}>
                                                    <div style={{ ...styles.statValue, fontSize: '1.6rem', color: theme.accent.red }}>
                                                        {allOpenPositions.filter(t => t.order_type === 'SELL').length}
                                                    </div>
                                                    <div style={styles.statLabel}>Short (SELL)</div>
                                                </div>
                                                <div style={styles.statCard}>
                                                    <div style={{ ...styles.statValue, fontSize: '1.6rem', color: theme.accent.purple }}>
                                                        {new Set(allOpenPositions.map(t => t.asset_symbol)).size}
                                                    </div>
                                                    <div style={styles.statLabel}>Assets</div>
                                                </div>
                                            </div>

                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '50vh', overflowY: 'auto' }}>
                                                {allOpenPositions.map(trade => (
                                                    <OpenPositionCard
                                                        key={trade.trade_id}
                                                        trade={trade}
                                                        currentPrice={trade.asset_symbol === selectedAsset ? currentPrice : null}
                                                        theme={theme}
                                                        styles={styles}
                                                        onNavigate={() => switchToAsset(trade.asset_symbol, trade.asset_class)}
                                                        onEdit={() => { setShowOpenPositions(false); openEditPosition(trade); }}
                                                        onClose={() => { closeTrade(trade.trade_id); setAllOpenPositions(p => p.filter(t => t.trade_id !== trade.trade_id)); }}
                                                        isCurrentAsset={trade.asset_symbol === selectedAsset}
                                                    />
                                                ))}
                                            </div>
                                        </>
                                    )
                                )}
                            </div>
                        </div>
                    )}

                    {/* Edit Position Modal */}
                    {editingTrade && (() => {
                        const entryPx = parseFloat(editingTrade.entry_price);
                        const qty     = parseFloat(editingTrade.quantity);
                        const isSameAsset = editingTrade.asset_symbol === selectedAsset;
                        let uPnL = null, uPct = null;
                        if (isSameAsset && currentPrice && entryPx) {
                            uPnL = editingTrade.order_type === 'BUY'
                                ? (currentPrice - entryPx) * qty
                                : (entryPx - currentPrice) * qty;
                            uPct = editingTrade.order_type === 'BUY'
                                ? ((currentPrice - entryPx) / entryPx) * 100
                                : ((entryPx - currentPrice) / entryPx) * 100;
                        }
                        return (
                        <div style={styles.modal} onClick={() => setEditingTrade(null)}>
                            <div style={{...styles.modalContent, maxWidth: '520px'}} onClick={e => e.stopPropagation()}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                    <h2 style={{ color: theme.blue[700], margin: 0 }}>✏️ Edit Open Position</h2>
                                    <button onClick={() => setEditingTrade(null)} style={{ background: 'transparent', border: 'none', color: theme.text.primary, fontSize: '2rem', cursor: 'pointer' }}>×</button>
                                </div>

                                {/* Asset + trade ID */}
                                <div style={{ background: theme.bg.tertiary, padding: '12px 16px', borderRadius: '10px', marginBottom: '16px', fontSize: '0.9rem', color: theme.text.secondary }}>
                                    <strong style={{ color: theme.text.primary }}>{editingTrade.asset_name}</strong> · <span style={{ fontSize: '0.8rem' }}>{editingTrade.trade_id}</span>
                                </div>

                                {/* Live Unrealised P&L card */}
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: '1fr 1fr',
                                    gap: '10px',
                                    marginBottom: '20px'
                                }}>
                                    <div style={{ ...styles.statCard, padding: '14px' }}>
                                        <div style={{ fontSize: '0.8rem', color: theme.text.tertiary, marginBottom: '4px', textTransform: 'uppercase' }}>Entry Price</div>
                                        <div style={{ fontSize: '1.2rem', fontWeight: '700', color: theme.text.primary }}>${entryPx.toFixed(2)}</div>
                                    </div>
                                    <div style={{ ...styles.statCard, padding: '14px' }}>
                                        <div style={{ fontSize: '0.8rem', color: theme.text.tertiary, marginBottom: '4px', textTransform: 'uppercase' }}>Current Price</div>
                                        <div style={{ fontSize: '1.2rem', fontWeight: '700', color: theme.blue[600] }}>
                                            {isSameAsset ? `$${currentPrice.toFixed(2)}` : '—'}
                                        </div>
                                    </div>
                                    <div style={{
                                        ...styles.statCard,
                                        padding: '14px',
                                        gridColumn: '1 / -1',
                                        background: uPnL === null ? theme.bg.tertiary : uPnL >= 0 ? `${theme.accent.green}18` : `${theme.accent.red}18`,
                                        border: `1px solid ${uPnL === null ? theme.border.light : uPnL >= 0 ? theme.accent.green : theme.accent.red}`
                                    }}>
                                        <div style={{ fontSize: '0.8rem', color: theme.text.tertiary, marginBottom: '4px', textTransform: 'uppercase' }}>Unrealised P&L</div>
                                        {uPnL !== null ? (
                                            <div style={{ fontSize: '1.4rem', fontWeight: '800', color: uPnL >= 0 ? theme.accent.green : theme.accent.red }}>
                                                {uPnL >= 0 ? '+' : ''}${uPnL.toFixed(2)}&nbsp;
                                                <span style={{ fontSize: '1rem' }}>({uPct >= 0 ? '+' : ''}{uPct.toFixed(2)}%)</span>
                                            </div>
                                        ) : (
                                            <div style={{ fontSize: '0.9rem', color: theme.text.tertiary, fontStyle: 'italic' }}>
                                                Navigate to {editingTrade.asset_symbol} to see live P&L
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Order Type</label>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        {['BUY', 'SELL'].map(type => (
                                            <button
                                                key={type}
                                                onClick={() => setEditForm({ ...editForm, order_type: type })}
                                                style={{
                                                    flex: 1,
                                                    padding: '10px',
                                                    border: 'none',
                                                    borderRadius: '8px',
                                                    fontWeight: '700',
                                                    cursor: 'pointer',
                                                    background: editForm.order_type === type
                                                        ? (type === 'BUY' ? theme.accent.green : theme.accent.red)
                                                        : theme.bg.secondary,
                                                    color: editForm.order_type === type ? 'white' : theme.text.secondary,
                                                    border: `2px solid ${editForm.order_type === type ? 'transparent' : theme.border.medium}`
                                                }}
                                            >
                                                {type === 'BUY' ? '🟢' : '🔴'} {type}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Entry Price */}
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Entry Price</label>
                                    <input
                                        type="number"
                                        step="any"
                                        value={editForm.entry_price}
                                        onChange={e => setEditForm({ ...editForm, entry_price: e.target.value })}
                                        style={styles.input}
                                    />
                                </div>

                                {/* Quantity */}
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Quantity</label>
                                    <input
                                        type="number"
                                        step="any"
                                        min="0"
                                        value={editForm.quantity}
                                        onChange={e => setEditForm({ ...editForm, quantity: e.target.value })}
                                        style={styles.input}
                                    />
                                </div>

                                {/* Stop Loss */}
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Stop Loss (optional)</label>
                                    <input
                                        type="number"
                                        step="any"
                                        value={editForm.stop_loss}
                                        onChange={e => setEditForm({ ...editForm, stop_loss: e.target.value })}
                                        placeholder="Leave blank to remove"
                                        style={styles.input}
                                    />
                                </div>

                                {/* Take Profit */}
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Take Profit (optional)</label>
                                    <input
                                        type="number"
                                        step="any"
                                        value={editForm.take_profit}
                                        onChange={e => setEditForm({ ...editForm, take_profit: e.target.value })}
                                        placeholder="Leave blank to remove"
                                        style={styles.input}
                                    />
                                </div>

                                {/* Notes */}
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Notes</label>
                                    <textarea
                                        value={editForm.notes}
                                        onChange={e => setEditForm({ ...editForm, notes: e.target.value })}
                                        placeholder="Optional trade notes..."
                                        style={{ ...styles.input, minHeight: '80px', resize: 'vertical', fontFamily: 'inherit' }}
                                    />
                                </div>

                                <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                                    <button
                                        onClick={saveEditPosition}
                                        disabled={isExecutingTrade}
                                        style={{
                                            ...styles.buttonPrimary,
                                            flex: 1,
                                            opacity: isExecutingTrade ? 0.6 : 1,
                                            cursor: isExecutingTrade ? 'not-allowed' : 'pointer'
                                        }}
                                    >
                                        {isExecutingTrade ? '⏳ Saving...' : '💾 Save Changes'}
                                    </button>
                                    <button
                                        onClick={() => setEditingTrade(null)}
                                        style={{ ...styles.buttonSecondary, flex: 0.4 }}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                        );
                    })()}

                    {/* Save Backtest Modal */}
                    {showSaveBacktestModal && (
                        <div style={styles.modal} onClick={() => setShowSaveBacktestModal(false)}>
                            <div style={{...styles.modalContent, maxWidth: '500px'}} onClick={(e) => e.stopPropagation()}>
                                <h2 style={{ color: theme.blue[700], marginTop: 0 }}>
                                    💾 Save Backtest Results?
                                </h2>
                                <p style={{ color: theme.text.secondary, marginBottom: '25px' }}>
                                    You have {(backtestTradeHistory[selectedAssetInfo?.symbol] || []).filter(t => t.status === 'CLOSED').length} closed trade(s) for <strong>{selectedAssetInfo?.name}</strong> from this backtest session.
                                    Would you like to save them to your trading history?
                                </p>
                                <div style={{ display: 'flex', gap: '15px' }}>
                                    <button
                                        onClick={saveBacktestResults}
                                        style={{
                                            ...styles.buttonPrimary,
                                            background: `linear-gradient(135deg, ${theme.accent.green} 0%, #059669 100%)`
                                        }}
                                    >
                                        ✅ Yes, Save Results
                                    </button>
                                    <button
                                        onClick={finalizeBacktestStop}
                                        style={{
                                            ...styles.buttonSecondary,
                                            flex: 1
                                        }}
                                    >
                                        ❌ No, Discard
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {/* LLM Model Creator Modal */}
                    {showModelCreator && (
                        <div style={styles.modal} onClick={() => setShowModelCreator(false)}>
                            <div style={{...styles.modalContent, maxWidth: '1000px'}} onClick={(e) => e.stopPropagation()}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                                    <h2 style={{ color: theme.blue[700], margin: 0 }}>
                                        🤖 AI Model Creator
                                    </h2>
                                    <button
                                        onClick={() => setShowModelCreator(false)}
                                        style={{
                                            background: 'transparent',
                                            border: 'none',
                                            color: theme.text.primary,
                                            fontSize: '2rem',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        ×
                                    </button>
                                </div>
                                
                                <p style={{ color: theme.text.secondary, marginBottom: '20px' }}>
                                    Describe the trading model you want to create in plain English, and AI will generate the Django backend code for you.
                                </p>
                                
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Model Description</label>
                                    <textarea
                                        value={modelPrompt}
                                        onChange={(e) => setModelPrompt(e.target.value)}
                                        placeholder="Example: Create a model to track daily stock performance with fields for symbol, date, open, high, low, close, volume, and percentage change. Include an API endpoint to fetch the last 30 days of data for a given symbol."
                                        style={{
                                            ...styles.input,
                                            minHeight: '120px',
                                            resize: 'vertical',
                                            fontFamily: 'inherit'
                                        }}
                                    />
                                </div>
                                
                                <button
                                    onClick={generateModelCode}
                                    disabled={isGeneratingCode}
                                    style={{
                                        ...styles.buttonPrimary,
                                        opacity: isGeneratingCode ? 0.6 : 1,
                                        background: `linear-gradient(135deg, ${theme.accent.purple} 0%, #6d28d9 100%)`
                                    }}
                                >
                                    {isGeneratingCode ? '🔄 Generating Code...' : '✨ Generate Model Code'}
                                </button>
                                
                                {generatedCode && (
                                    <div style={{ marginTop: '25px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                            <h3 style={{ color: theme.text.primary, margin: 0 }}>Generated Code:</h3>
                                            <button
                                                onClick={() => {
                                                    navigator.clipboard.writeText(generatedCode);
                                                    addToast('Code copied to clipboard', 'info', 2000);
                                                    setTimeout(() => wrappedSetSuccess(''), 3000);
                                                }}
                                                style={styles.buttonSecondary}
                                            >
                                                📋 Copy Code
                                            </button>
                                        </div>
                                        <pre style={{
                                            background: theme.bg.tertiary,
                                            padding: '20px',
                                            borderRadius: '10px',
                                            overflow: 'auto',
                                            maxHeight: '400px',
                                            border: `1px solid ${theme.border.medium}`,
                                            fontSize: '0.9rem',
                                            lineHeight: '1.5'
                                        }}>
                                            <code style={{ color: theme.text.primary }}>
                                                {generatedCode}
                                            </code>
                                        </pre>
                                        
                                        <div style={{
                                            marginTop: '15px',
                                            padding: '15px',
                                            background: `${theme.accent.cyan}20`,
                                            borderRadius: '10px',
                                            border: `1px solid ${theme.accent.cyan}`
                                        }}>
                                            <p style={{ margin: 0, color: theme.text.secondary, fontSize: '0.9rem' }}>
                                                💡 <strong>Next Steps:</strong> Copy this code and add it to your Django backend. 
                                                Make sure to run migrations after adding the model, and update your URLs to include the new endpoint.
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                    
                    {/* Stock Info Modal */}
                    {showStockInfo && stockInfo && (
                        <div style={styles.modal} onClick={() => setShowStockInfo(false)}>
                            <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                                    <h2 style={{ color: theme.blue[700], margin: 0 }}>
                                        📊 {stockInfo.longName || selectedAssetInfo?.name}
                                    </h2>
                                    <button
                                        onClick={() => setShowStockInfo(false)}
                                        style={{
                                            background: 'transparent',
                                            border: 'none',
                                            color: theme.text.primary,
                                            fontSize: '2rem',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        ×
                                    </button>
                                </div>
                                
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '20px' }}>
                                    {stockInfo.currentPrice && (
                                        <div style={styles.statCard}>
                                            <div style={{ ...styles.statValue, color: theme.blue[600] }}>
                                                ${stockInfo.currentPrice.toFixed(2)}
                                            </div>
                                            <div style={styles.statLabel}>Current Price</div>
                                        </div>
                                    )}
                                    {stockInfo.marketCap && (
                                        <div style={styles.statCard}>
                                            <div style={{ ...styles.statValue, color: theme.accent.purple, fontSize: '1.5rem' }}>
                                                ${(stockInfo.marketCap / 1e9).toFixed(2)}B
                                            </div>
                                            <div style={styles.statLabel}>Market Cap</div>
                                        </div>
                                    )}
                                    {stockInfo.peRatio && (
                                        <div style={styles.statCard}>
                                            <div style={{ ...styles.statValue, color: theme.accent.cyan }}>
                                                {stockInfo.peRatio.toFixed(2)}
                                            </div>
                                            <div style={styles.statLabel}>P/E Ratio</div>
                                        </div>
                                    )}
                                    {stockInfo.dividendYield && (
                                        <div style={styles.statCard}>
                                            <div style={{ ...styles.statValue, color: theme.accent.green }}>
                                                {(stockInfo.dividendYield * 100).toFixed(2)}%
                                            </div>
                                            <div style={styles.statLabel}>Dividend Yield</div>
                                        </div>
                                    )}
                                </div>
                                
                                <div style={styles.tradeCard}>
                                    <h3 style={{ color: theme.text.primary, marginTop: 0 }}>Company Info</h3>
                                    {stockInfo.sector && (
                                        <p><strong>Sector:</strong> {stockInfo.sector}</p>
                                    )}
                                    {stockInfo.industry && (
                                        <p><strong>Industry:</strong> {stockInfo.industry}</p>
                                    )}
                                    {stockInfo.website && (
                                        <p><strong>Website:</strong> <a href={stockInfo.website} target="_blank" rel="noopener noreferrer" style={{ color: theme.blue[500] }}>{stockInfo.website}</a></p>
                                    )}
                                    {stockInfo.summary && (
                                        <p style={{ marginTop: '15px', lineHeight: '1.6' }}>{stockInfo.summary}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {/* AI Model Builder Modal */}
                    {showModelCreator && (
                        <div style={styles.modal} onClick={() => setShowModelCreator(false)}>
                            <div style={{...styles.modalContent, maxWidth: '1000px'}} onClick={(e) => e.stopPropagation()}>
                                <button
                                    onClick={() => setShowModelCreator(false)}
                                    style={{
                                        position: 'absolute',
                                        top: '20px',
                                        right: '20px',
                                        background: 'transparent',
                                        border: 'none',
                                        color: theme.text.primary,
                                        fontSize: '2rem',
                                        cursor: 'pointer',
                                        zIndex: 10
                                    }}
                                >
                                    ×
                                </button>
                                <AIModelBuilder 
                                    theme={theme} 
                                    styles={styles}
                                    BACKEND_API_URL={BACKEND_API_URL}
                                    onBacktestModel={({ code, modelName, asset, tp, sl }) => {
                                        // Close the builder panel, set up backtest, fire it
                                        setShowModelCreator(false);
                                        // Store code for the viewer
                                        setGeneratedCodeData({ code, modelName });
                                        // Create a temporary model object the backtest loop can use
                                        const tempModel = {
                                            model_id: modelName || 'preview',
                                            cleaned_model_code: code,
                                        };
                                        if (asset) setSelectedAsset(asset);
                                        setSelectedBacktestModel(tempModel);
                                        setBacktestModelTp(String(tp || 8));
                                        setBacktestModelSl(String(sl || 4));
                                        setTimeout(() => {
                                            startBacktest();
                                            // Show code viewer after backtest starts
                                            setTimeout(() => setShowGeneratedCode(true), 800);
                                        }, 400);
                                    }}
                                    onTimeframeSensitivity={({ code, modelName, asset, tp, sl }) => {
                                        // Close builder, run timeframe sweep via batch mechanism
                                        setShowModelCreator(false);
                                        const sym = asset || selectedAsset;
                                        setSelectedAsset(sym);
                                        const tempModel = {
                                            model_id: modelName || 'tf_test',
                                            cleaned_model_code: code,
                                        };
                                        setSelectedBacktestModel(tempModel);
                                        setBacktestModelTp(String(tp || 8));
                                        setBacktestModelSl(String(sl || 4));
                                        // Build a fake queue — one entry per timeframe
                                        const tfQueue = ['1D','4H','1H','15M','5M'].map(tf => ({
                                            id: `tf_${tf}`,
                                            symbol: sym,
                                            name: `${sym} ${tf}`,
                                            yfinance_symbol: sym,
                                            _overrideTimeframe: tf,
                                            _isTfTest: true,
                                        }));
                                        setBatchTestModel(tempModel);
                                        setBatchTestTp(String(tp || 8));
                                        setBatchTestSl(String(sl || 4));
                                        setBatchTestResults([]);
                                        setBatchTestStopped(false);
                                        setTfSensitivityMode(true);
                                        setTfSensitivityQueue(tfQueue);
                                        addToast(`Running ${sym} across 5 timeframes…`, 'info', 3000);
                                    }}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* ── Floating generated code viewer — shows during AI backtest ── */}
            {showGeneratedCode && generatedCodeData && (
                <div style={{
                    position: 'fixed', bottom: '24px', right: '24px', zIndex: 9997,
                    width: '380px', maxHeight: '60vh',
                    background: theme.bg.elevated, borderRadius: '14px',
                    border: `1px solid ${theme.border.medium}`,
                    boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
                    display: 'flex', flexDirection: 'column',
                    animation: 'toastIn 0.3s cubic-bezier(0.34,1.56,0.64,1)',
                }}>
                    {/* Header */}
                    <div style={{ padding: '14px 16px', borderBottom: `1px solid ${theme.border.light}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <div style={{ fontWeight: '800', fontSize: '0.95rem', color: theme.text.primary }}>📝 Generated Code</div>
                            <div style={{ fontSize: '0.72rem', color: theme.text.tertiary, marginTop: '2px' }}>{generatedCodeData.modelName}</div>
                        </div>
                        <button onClick={() => setShowGeneratedCode(false)}
                            style={{ background: 'transparent', border: 'none', color: theme.text.tertiary, fontSize: '1.4rem', cursor: 'pointer', lineHeight: 1 }}>×</button>
                    </div>
                    {/* Code */}
                    <div style={{ flex: 1, overflow: 'auto', padding: '12px' }}>
                        <pre style={{
                            margin: 0, padding: '12px', borderRadius: '8px',
                            background: theme.bg.tertiary, color: theme.text.primary,
                            fontSize: '0.8rem', lineHeight: '1.5',
                            border: `1px solid ${theme.border.light}`,
                            whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                        }}><code>{generatedCodeData.code}</code></pre>
                    </div>
                    {/* Copy button */}
                    <div style={{ padding: '10px 12px', borderTop: `1px solid ${theme.border.light}` }}>
                        <button onClick={() => {
                            navigator.clipboard.writeText(generatedCodeData.code);
                            addToast('Code copied!', 'info', 2000);
                        }} style={{
                            width: '100%', padding: '8px', borderRadius: '8px',
                            background: `linear-gradient(135deg,${theme.blue[500]},${theme.blue[600]})`,
                            color: 'white', border: 'none', fontWeight: '600',
                            cursor: 'pointer', fontSize: '0.85rem',
                        }}>📋 Copy Code</button>
                    </div>
                </div>
            )}

            {/* ── Floating STOP button — always visible during batch ────── */}
            {batchTestRunning && (
                <div style={{
                    position: 'fixed', bottom: '24px', left: '24px', zIndex: 9998,
                    animation: 'toastIn 0.3s cubic-bezier(0.34,1.56,0.64,1)',
                }}>
                    <button onClick={stopBatchTest} style={{
                        padding: '14px 28px',
                        background: `linear-gradient(135deg, #dc2626, #991b1b)`,
                        color: 'white', border: '2px solid #ef4444',
                        borderRadius: '14px', fontWeight: '900', fontSize: '1.1rem',
                        cursor: 'pointer', letterSpacing: '0.04em',
                        boxShadow: '0 8px 32px rgba(220,38,38,0.55), 0 0 0 4px rgba(220,38,38,0.15)',
                        display: 'flex', alignItems: 'center', gap: '10px',
                        transition: 'transform 0.1s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
                        <span style={{ fontSize: '1.3rem' }}>⏹</span>
                        <div style={{ textAlign: 'left', lineHeight: 1.2 }}>
                            <div>STOP BATCH</div>
                            <div style={{ fontSize: '0.65rem', fontWeight: '400', opacity: 0.8 }}>
                                {batchTestResults.length} done · {batchTestQueue.length} left
                            </div>
                        </div>
                    </button>
                </div>
            )}

            {/* ── Toast notifications ──────────────────────────────────────────
                Fixed stack in bottom-right corner. Auto-dismisses with a
                shrinking progress bar. Stacks multiple toasts independently. */}
            <div style={{
                position: 'fixed', bottom: '24px', right: '24px',
                display: 'flex', flexDirection: 'column-reverse', gap: '10px',
                zIndex: 9999, pointerEvents: 'none',
            }}>
                {toasts.map(toast => {
                    const cfg = {
                        success: { bg: '#166534', border: '#22c55e', icon: '✓', bar: '#22c55e' },
                        error:   { bg: '#7f1d1d', border: '#ef4444', icon: '✕', bar: '#ef4444' },
                        info:    { bg: '#1e3a5f', border: '#60a5fa', icon: 'ℹ', bar: '#60a5fa' },
                        warning: { bg: '#78350f', border: '#f59e0b', icon: '⚠', bar: '#f59e0b' },
                    }[toast.type] || { bg: '#1e293b', border: '#64748b', icon: '•', bar: '#64748b' };

                    // Strip leading emoji/symbol prefixes already in message (✅ ❌ 🤖 etc)
                    const cleanMsg = toast.message.replace(/^[\u{1F300}-\u{1FAFF}✅❌⚠️ℹ️✓✕⏳🤖📊🔄]+\s*/u, '');

                    return (
                        <div key={toast.id} style={{
                            pointerEvents: 'all',
                            minWidth: '280px', maxWidth: '380px',
                            background: cfg.bg,
                            border: `1px solid ${cfg.border}40`,
                            borderLeft: `4px solid ${cfg.border}`,
                            borderRadius: '10px',
                            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                            overflow: 'hidden',
                            animation: 'toastIn 0.25s cubic-bezier(0.34,1.56,0.64,1)',
                        }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '12px 14px' }}>
                                <span style={{
                                    width: '20px', height: '20px', borderRadius: '50%',
                                    background: `${cfg.border}25`, border: `1.5px solid ${cfg.border}`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '0.7rem', fontWeight: '900', color: cfg.border,
                                    flexShrink: 0, marginTop: '1px',
                                }}>{cfg.icon}</span>
                                <span style={{
                                    fontSize: '0.85rem', lineHeight: '1.45',
                                    color: '#f1f5f9', fontWeight: '500', flex: 1,
                                }}>{cleanMsg}</span>
                                <button
                                    onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
                                    style={{
                                        background: 'transparent', border: 'none',
                                        color: '#94a3b8', cursor: 'pointer',
                                        fontSize: '1rem', lineHeight: 1, padding: '0 0 0 4px',
                                        flexShrink: 0,
                                    }}>×</button>
                            </div>
                            {/* Progress bar */}
                            <div style={{ height: '3px', background: `${cfg.border}20` }}>
                                <div style={{
                                    height: '100%', background: cfg.border,
                                    animation: `toastProgress ${toast.duration}ms linear forwards`,
                                    transformOrigin: 'left',
                                }} />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
