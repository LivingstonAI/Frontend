import React, { useEffect, useState, useRef } from "react";
import Header from "./header";
import SideNavs from "./side_navs";
import AIModelBuilder from "./ai_model_builder.jsx";

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
    
    // Loading and error states
    const [isExecutingTrade, setIsExecutingTrade] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    
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
    const [backtestSpeed, setBacktestSpeed] = useState(5); // 5 seconds per candle
    const [backtestCurrentIndex, setBacktestCurrentIndex] = useState(0);
    const [backtestBalance, setBacktestBalance] = useState(10000);
    const [backtestTrades, setBacktestTrades] = useState([]);
    const [backtestPaused, setBacktestPaused] = useState(false);
    const [backtestData, setBacktestData] = useState([]);
    const [showSaveBacktestModal, setShowSaveBacktestModal] = useState(false);
    const [backtestTradeHistory, setBacktestTradeHistory] = useState({});
    const [backtestEquityCurve, setBacktestEquityCurve] = useState([]);

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
            setErrorMessage('Please enter a description for your model');
            setTimeout(() => setErrorMessage(''), 3000);
            return;
        }
        
        setIsGeneratingCode(true);
        setErrorMessage('');
        
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
                setSuccessMessage('✅ Code generated successfully!');
                setTimeout(() => setSuccessMessage(''), 3000);
            } else {
                setErrorMessage('Failed to generate code');
                setTimeout(() => setErrorMessage(''), 3000);
            }
        } catch (error) {
            console.error('Error generating code:', error);
            setErrorMessage(`Failed to generate code: ${error.message}`);
            setTimeout(() => setErrorMessage(''), 3000);
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
                data = rawData.map((kline) => ({
                    time: Math.floor(kline[0] / 1000),
                    open: parseFloat(kline[1]),
                    high: parseFloat(kline[2]),
                    low: parseFloat(kline[3]),
                    close: parseFloat(kline[4]),
                    volume: parseFloat(kline[5])
                }));
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
                data = result.data;
            }
            
            setMarketData(data);
            setBacktestData(data); // Store for backtest
            
            if (data.length > 0) {
                const latest = data[data.length - 1];
                const first = data[0];
                setCurrentPrice(latest.close);
                setPriceChange(((latest.close - first.close) / first.close) * 100);
            }
            
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
        if (!tvLoaded || !chartContainerRef.current || marketData.length === 0) return;

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
    }, [tvLoaded, chartType, marketData.length > 0, isDarkTheme]);

    // Update chart data WITHOUT recreating chart (only when data changes, not on every render)
    useEffect(() => {
        if (!chartRef.current || marketData.length === 0) return;
        
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
            setErrorMessage('Wait for price data to load');
            setTimeout(() => setErrorMessage(''), 3000);
            return;
        }

        setIsExecutingTrade(true);
        setErrorMessage('');
        setSuccessMessage('');

        // If in backtest mode, handle locally without API call
        if (backtestMode) {
            try {
                const tradeId = `BACKTEST_${Date.now()}`;
                const newTrade = {
                    trade_id: tradeId,
                    asset_symbol: selectedAssetInfo.symbol,
                    asset_name: selectedAssetInfo.name,
                    asset_class: selectedAssetInfo.assetClass,
                    order_type: orderType,
                    entry_price: currentPrice,
                    quantity: quantity,
                    stop_loss: stopLoss || null,
                    take_profit: takeProfit || null,
                    status: 'OPEN',
                    entry_timestamp: new Date().toISOString(),
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
                
                setSuccessMessage(`✅ ${orderType} order placed in backtest!`);
                setTimeout(() => setSuccessMessage(''), 3000);
                setStopLoss('');
                setTakeProfit('');
                setSlPct('');
                setTpPct('');
                setTradeNotes('');
                setShowTradePanel(false);
            } catch (error) {
                setErrorMessage(`❌ Error: ${error.message}`);
                setTimeout(() => setErrorMessage(''), 3000);
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
                setSuccessMessage(`✅ ${orderType} order placed successfully!`);
                setTimeout(() => setSuccessMessage(''), 3000);
                setStopLoss('');
                setTakeProfit('');
                setTradeNotes('');
                setShowTradePanel(false);
                fetchTradeHistory();
            } else {
                setErrorMessage(`❌ Error: ${result.error}`);
                setTimeout(() => setErrorMessage(''), 3000);
            }
        } catch (error) {
            console.error('Error executing trade:', error);
            setErrorMessage(`❌ Failed to execute trade: ${error.message}`);
            setTimeout(() => setErrorMessage(''), 3000);
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
            setSuccessMessage('✅ Backtest position updated!');
            setTimeout(() => setSuccessMessage(''), 3000);
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
                setSuccessMessage('✅ Position updated!');
                setTimeout(() => setSuccessMessage(''), 3000);
                fetchTradeHistory();
            } else {
                setErrorMessage(`❌ Error: ${result.error}`);
                setTimeout(() => setErrorMessage(''), 3000);
            }
        } catch (error) {
            setErrorMessage(`❌ Failed to update position: ${error.message}`);
            setTimeout(() => setErrorMessage(''), 3000);
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
                setErrorMessage(`Failed to fetch stock info: ${result.error}`);
                setTimeout(() => setErrorMessage(''), 3000);
            }
        } catch (error) {
            console.error('Error fetching stock info:', error);
            setErrorMessage(`Failed to fetch stock info: ${error.message}`);
            setTimeout(() => setErrorMessage(''), 3000);
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
                    let profitLoss, profitLossPct;
                    
                    if (trade.order_type === 'BUY') {
                        profitLoss = (exitPrice - trade.entry_price) * trade.quantity;
                        profitLossPct = ((exitPrice - trade.entry_price) / trade.entry_price) * 100;
                    } else {
                        profitLoss = (trade.entry_price - exitPrice) * trade.quantity;
                        profitLossPct = ((trade.entry_price - exitPrice) / trade.entry_price) * 100;
                    }
                    
                    // Calculate new balance
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
            
            setSuccessMessage(`✅ Backtest trade closed! New balance: $${newBalance.toFixed(2)}`);
            setTimeout(() => setSuccessMessage(''), 3000);
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
                setSuccessMessage('✅ Trade closed successfully!');
                setTimeout(() => setSuccessMessage(''), 3000);
                fetchTradeHistory();
            } else {
                setErrorMessage(`❌ Error closing trade: ${result.error}`);
                setTimeout(() => setErrorMessage(''), 3000);
            }
        } catch (error) {
            console.error('Error closing trade:', error);
            setErrorMessage(`❌ Failed to close trade: ${error.message}`);
            setTimeout(() => setErrorMessage(''), 3000);
        } finally {
            setIsExecutingTrade(false);
        }
    };

    // Start backtest - proper implementation
    const startBacktest = async () => {
        setErrorMessage('');
        
        // Always fetch fresh data for the current asset before starting backtest
        const assetInfo = getCurrentAssetInfo();
        let freshData = [];
        
        try {
            setSuccessMessage('⏳ Loading chart data for backtest...');
            
            if (assetInfo.binanceSymbol) {
                const response = await fetch(
                    `https://api.binance.com/api/v3/klines?symbol=${assetInfo.binanceSymbol}&interval=${timeframes[timeframe].binanceInterval}&limit=500`
                );
                const rawData = await response.json();
                freshData = rawData.map((kline) => ({
                    time: Math.floor(kline[0] / 1000),
                    open: parseFloat(kline[1]),
                    high: parseFloat(kline[2]),
                    low: parseFloat(kline[3]),
                    close: parseFloat(kline[4]),
                    volume: parseFloat(kline[5])
                }));
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
                const result = await response.json();
                freshData = result.data || [];
            }
        } catch (error) {
            setErrorMessage(`❌ Failed to load data: ${error.message}`);
            setTimeout(() => setErrorMessage(''), 4000);
            return;
        }
        
        if (!freshData || freshData.length < 2) {
            setErrorMessage('❌ Not enough data to backtest this asset/timeframe');
            setTimeout(() => setErrorMessage(''), 4000);
            return;
        }
        
        setSuccessMessage('');
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

    // Backtest loop - show candles one by one
    useEffect(() => {
        if (backtestMode && !backtestPaused && backtestCurrentIndex < backtestData.length) {
            backtestIntervalRef.current = setTimeout(() => {
                const newIndex = backtestCurrentIndex + 1;
                
                if (newIndex < backtestData.length) {
                    // Update chart with candles up to current index
                    const visibleData = backtestData.slice(0, newIndex + 1);
                    
                    if (candlestickSeriesRef.current) {
                        candlestickSeriesRef.current.setData(visibleData);
                    } else if (lineSeriesRef.current) {
                        lineSeriesRef.current.setData(visibleData.map(d => ({ time: d.time, value: d.close })));
                    }
                    
                    const currentCandle = backtestData[newIndex];
                    setCurrentPrice(currentCandle.close);
                    setBacktestCurrentIndex(newIndex);
                    
                    // DO NOT touch the chart position at all during backtest
                }
                
            }, backtestSpeed * 1000);
        }
        
        return () => {
            if (backtestIntervalRef.current) {
                clearTimeout(backtestIntervalRef.current);
            }
        };
    }, [backtestMode, backtestPaused, backtestCurrentIndex, backtestSpeed, backtestData]);

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
        
        // Clear chart markers
        const series = candlestickSeriesRef.current || lineSeriesRef.current;
        if (series) {
            try { series.setMarkers([]); } catch(e) {}
        }
        
        // Restore full market data
        if (candlestickSeriesRef.current && marketData.length > 0) {
            candlestickSeriesRef.current.setData(marketData);
        } else if (lineSeriesRef.current && marketData.length > 0) {
            lineSeriesRef.current.setData(marketData.map(d => ({ time: d.time, value: d.close })));
        }
        
        if (marketData.length > 0) {
            setCurrentPrice(marketData[marketData.length - 1].close);
        }
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
            
            setSuccessMessage('✅ Backtest results saved successfully!');
            setTimeout(() => setSuccessMessage(''), 3000);
            finalizeBacktestStop();
        } catch (error) {
            console.error('Error saving backtest results:', error);
            setErrorMessage('❌ Error saving backtest results');
            setTimeout(() => setErrorMessage(''), 3000);
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
                    
                    {/* Success Message */}
                    {successMessage && (
                        <div style={{ 
                            background: `${theme.accent.green}20`,
                            border: `2px solid ${theme.accent.green}`,
                            color: theme.accent.green,
                            padding: '15px',
                            borderRadius: '12px',
                            marginBottom: '20px',
                            fontWeight: '600'
                        }}>
                            {successMessage}
                        </div>
                    )}
                    
                    {/* Error Message */}
                    {errorMessage && (
                        <div style={{ 
                            background: `${theme.accent.red}20`,
                            border: `2px solid ${theme.accent.red}`,
                            color: theme.accent.red,
                            padding: '15px',
                            borderRadius: '12px',
                            marginBottom: '20px',
                            fontWeight: '600'
                        }}>
                            {errorMessage}
                        </div>
                    )}
                    
                    <div style={styles.controlPanel}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                            <div style={styles.sectionTitle}>
                                🎯 Current Asset: {selectedAssetInfo?.name || selectedAsset}
                            </div>
                            <div style={{ display: 'flex', gap: '10px' }}>
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
                    
                    {!isInitialLoad && marketData.length > 0 && (
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
                                            onClick={startBacktest}
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
                                
                                {backtestMode && (
                                    <div style={{
                                        marginTop: '15px',
                                        padding: '15px',
                                        background: theme.bg.tertiary,
                                        borderRadius: '10px',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        border: `2px solid ${theme.blue[400]}`
                                    }}>
                                        <div>
                                            <strong style={{ color: theme.blue[600] }}>Backtest Progress:</strong>{' '}
                                            {backtestCurrentIndex} / {backtestData.length} candles
                                        </div>
                                        <div>
                                            <strong style={{ color: theme.blue[600] }}>Balance:</strong>{' '}
                                            ${backtestBalance.toFixed(2)}
                                        </div>
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <button
                                                onClick={() => setBacktestPaused(!backtestPaused)}
                                                style={styles.buttonSecondary}
                                            >
                                                {backtestPaused ? '▶️ Resume' : '⏸️ Pause'}
                                            </button>
                                            <button
                                                onClick={stopBacktest}
                                                style={{
                                                    ...styles.buttonSecondary,
                                                    background: theme.accent.red,
                                                    color: 'white',
                                                    border: 'none'
                                                }}
                                            >
                                                ⏹️ Stop
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
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
                                
                                <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
                                    {(backtestMode 
                                        ? (backtestTradeHistory[selectedAssetInfo?.symbol] || [])
                                        : tradeHistory
                                    ).map(trade => {
                                        // Compute live unrealised P&L for open trades
                                        const isOpen = trade.status === 'OPEN';
                                        const ep  = parseFloat(trade.entry_price);
                                        const qty = parseFloat(trade.quantity);
                                        let uPnL = null, uPct = null;
                                        if (isOpen && currentPrice && ep && trade.asset_symbol === selectedAsset) {
                                            uPnL = trade.order_type === 'BUY'
                                                ? (currentPrice - ep) * qty
                                                : (ep - currentPrice) * qty;
                                            uPct = trade.order_type === 'BUY'
                                                ? ((currentPrice - ep) / ep) * 100
                                                : ((ep - currentPrice) / ep) * 100;
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
                    
                    {/* Overall Performance Modal */}
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
                                                    setSuccessMessage('✅ Code copied to clipboard!');
                                                    setTimeout(() => setSuccessMessage(''), 3000);
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
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}