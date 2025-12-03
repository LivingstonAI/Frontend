import React, { useState, useEffect, useRef, useMemo } from 'react';
import Header from "./header";
import SideNavs from "./side_navs";


// --- CONFIGURATION & HELPERS ---

const TICK_RATE_DEFAULT = 200; // Faster default for training
const TICKS_PER_DAY = 50; 
const INITIAL_CASH = 10000;
const COMMISSION = 0.001; 

const THEME = {
  bg: '#f8fafc', // Slate 50
  text: '#1e293b', // Slate 800
  primary: '#2563eb', // Blue 600
  secondary: '#3b82f6', // Blue 500
  accent: '#0ea5e9', // Sky 500
  danger: '#ef4444',
  success: '#10b981',
  cardBg: '#ffffff',
  border: '#e2e8f0', // Slate 200
  terminalBg: '#1e293b', // Slate 800 (Dark Blue)
  terminalText: '#e2e8f0',
};

const AGENT_TEMPLATES = [
  { id: 1, name: "Snow-Alpha", type: "DQN-Lite", color: "#3b82f6" },
  { id: 2, name: "Ice-Beta", type: "MeanRev", color: "#0ea5e9" },
  { id: 3, name: "Frost-Gamma", type: "TrendNet", color: "#6366f1" },
  { id: 4, name: "Glacier-X", type: "LSTM-Sim", color: "#8b5cf6" },
];

const fmt = (num) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(num);
const fmtInt = (num) => new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(num);

// --- SIMPLE NEURAL NETWORK CLASS (Vanilla JS implementation of "TensorFlow-like" logic) ---
class MicroNet {
  constructor() {
    this.weights = [Math.random(), Math.random(), Math.random(), Math.random()]; // 4 inputs
    this.bias = Math.random();
    this.learningRate = 0.01;
  }

  predict(inputs) {
    // Dot product + bias
    let sum = this.bias;
    for (let i = 0; i < inputs.length; i++) {
      sum += inputs[i] * this.weights[i];
    }
    // Sigmoid activation
    return 1 / (1 + Math.exp(-sum)); 
  }

  train(inputs, target) {
    const prediction = this.predict(inputs);
    const error = target - prediction;
    
    // Simple Gradient Descent
    for (let i = 0; i < this.weights.length; i++) {
      this.weights[i] += error * inputs[i] * this.learningRate;
    }
    this.bias += error * this.learningRate;
    return Math.abs(error); // Return loss
  }
}

// --- SVG CANDLESTICK CHART COMPONENTS ---

/** Renders a full-width, detailed chart for the main view. */
const MainCandleChart = ({ data, agents, width, height }) => {
  const displayData = data.slice(-100); // Only display last 100 for performance/clarity

  if (!displayData || displayData.length < 2) return <div style={{color: THEME.text, padding:'20px', textAlign:'center'}}>Awaiting Live Data or Running Backtest...</div>;

  const maxPrice = Math.max(...displayData.map(d => d.h));
  const minPrice = Math.min(...displayData.map(d => d.l));
  const range = maxPrice - minPrice || 1;
  
  // Ensure labels show max 4 decimals or fewer for readability
  const decimalPlaces = Math.max(0, 4 - Math.floor(Math.log10(range)));
  
  const scaleY = (p) => height - ((p - minPrice) / range) * height;
  const candleWidth = (width / displayData.length) * 0.7;

  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} style={{overflow:'visible'}}>
      
      {/* Price Labels & Grid Lines */}
      {[...Array(5)].map((_, i) => {
        const price = minPrice + (range / 4) * i;
        const y = scaleY(price);
        return (
          <g key={i}>
            <line x1="0" y1={y} x2={width} y2={y} stroke="#334155" strokeDasharray="2,2" strokeOpacity="0.3" />
            <text x={width + 5} y={y + 3} fontSize="10" fill="#94a3b8">
              {price.toFixed(decimalPlaces)}
            </text>
          </g>
        );
      })}

      {/* Candlesticks */}
      {displayData.map((d, i) => {
        const x = i * (width / displayData.length);
        const yOpen = scaleY(d.o);
        const yClose = scaleY(d.c);
        const yHigh = scaleY(d.h);
        const yLow = scaleY(d.l);
        const isGreen = d.c >= d.o;
        
        return (
          <g key={i}>
            {/* Wick */}
            <line x1={x + candleWidth/2} y1={yHigh} x2={x + candleWidth/2} y2={yLow} stroke={isGreen ? THEME.success : THEME.danger} strokeWidth="1" />
            {/* Body */}
            <rect 
              x={x} 
              y={Math.min(yOpen, yClose)} 
              width={candleWidth} 
              height={Math.abs(yClose - yOpen) || 1} 
              fill={isGreen ? THEME.success : THEME.danger} 
            />
          </g>
        );
      })}
      
      {/* Agent Trade Markers Overlay */}
      {agents.filter(a => a.isActive).map(agent => (
        agent.history.slice(-10).map((t, i) => { // Only plot last 10 trades per agent
          const globalIndex = data.findIndex(d => d.t === t.t);
          if (globalIndex === -1 || globalIndex < data.length - 100) return null; // Only plot if visible
          
          const localIndex = globalIndex - (data.length - displayData.length);
          const x = localIndex * (width / displayData.length) + (candleWidth / 2);
          const y = scaleY(t.price);
          
          return (
            <text 
              key={`${agent.id}-${i}`} 
              x={x} 
              y={y + (t.type === 'BUY' ? 15 : -10)} // Offset to avoid covering the candle
              fontSize="16" 
              fill={t.type === 'BUY' ? THEME.success : THEME.danger}
              opacity="0.8"
            >
              {t.type === 'BUY' ? '▲' : '▼'}
            </text>
          );
        })
      ))}
    </svg>
  );
};


/** Renders a small chart for the agent card. */
const MiniCandleChart = ({ data, trades, width, height }) => {
  if (!data || data.length < 2) return <div style={{color: '#666', fontSize:'10px'}}>Gathering Data...</div>;

  const maxPrice = Math.max(...data.map(d => d.h));
  const minPrice = Math.min(...data.map(d => d.l));
  const range = maxPrice - minPrice || 1;
  
  const scaleY = (p) => height - ((p - minPrice) / range) * height;
  const candleWidth = (width / data.length) * 0.7;

  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} style={{overflow:'visible'}}>
      {data.map((d, i) => {
        const x = i * (width / data.length);
        const yOpen = scaleY(d.o);
        const yClose = scaleY(d.c);
        const yHigh = scaleY(d.h);
        const yLow = scaleY(d.l);
        const isGreen = d.c >= d.o;
        
        return (
          <g key={i}>
            {/* Wick */}
            <line x1={x + candleWidth/2} y1={yHigh} x2={x + candleWidth/2} y2={yLow} stroke={isGreen ? THEME.success : THEME.danger} strokeWidth="1" />
            {/* Body */}
            <rect 
              x={x} 
              y={Math.min(yOpen, yClose)} 
              width={candleWidth} 
              height={Math.abs(yClose - yOpen) || 1} 
              fill={isGreen ? THEME.success : THEME.danger} 
            />
          </g>
        );
      })}
      
      {/* Trade Markers Overlay (Only latest one) */}
      {trades.length > 0 && trades.slice(-1).map((t, i) => {
          const y = scaleY(t.price);
          
          // Calculate x position for the last candle shown
          const lastIndex = data.length - 1;
          const x = lastIndex * (width / data.length);

         return (
           <text key={i} x={x + candleWidth} y={y + 5} fontSize="14" fill={t.type === 'BUY' ? THEME.success : THEME.danger}>
             {t.type === 'BUY' ? '▲' : '▼'}
           </text>
         )
      })}
    </svg>
  );
};


// --- STYLES OBJECT (Updated for new layout) ---
const styles = {
  app: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    backgroundColor: THEME.bg,
    color: THEME.text,
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  header: {
    backgroundColor: '#fff',
    borderBottom: `1px solid ${THEME.border}`,
    padding: '12px 24px',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
  },
  logo: {
    fontSize: '20px',
    fontWeight: '800',
    color: THEME.primary,
    letterSpacing: '-0.5px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  main: {
    display: 'flex',
    flex: 1,
    overflow: 'hidden',
  },
  sidebar: {
    width: '300px',
    backgroundColor: '#fff',
    borderRight: `1px solid ${THEME.border}`,
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    overflowY: 'auto',
  },
  sectionTitle: {
    fontSize: '12px',
    fontWeight: '700',
    color: '#64748b', // Slate 500
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '12px',
  },
  controlGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#475569',
  },
  input: {
    padding: '8px 12px',
    borderRadius: '6px',
    border: `1px solid ${THEME.border}`,
    fontSize: '13px',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
  },
  contentArea: {
    flex: 1,
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    overflowY: 'auto',
    backgroundColor: '#f1f5f9', // Slate 100
  },
  chartContainer: {
    backgroundColor: THEME.terminalBg,
    color: THEME.terminalText,
    borderRadius: '12px',
    padding: '16px',
    height: '350px',
    border: `1px solid ${THEME.border}`,
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
  },
  agentGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    gridAutoRows: '400px',
    gap: '24px',
    flexShrink: 0,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    border: `1px solid ${THEME.border}`,
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    transition: 'all 0.2s ease',
  },
  cardHeader: {
    padding: '16px',
    borderBottom: `1px solid ${THEME.border}`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  terminal: {
    flex: 1,
    backgroundColor: THEME.terminalBg,
    color: THEME.terminalText,
    fontFamily: '"JetBrains Mono", "Fira Code", monospace',
    fontSize: '11px',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
  },
  chartArea: {
    height: '120px',
    marginBottom: '12px',
    borderBottom: '1px dashed #334155',
    position: 'relative',
  },
  logArea: {
    flex: 1,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
  btn: {
    padding: '10px 16px',
    borderRadius: '8px',
    border: 'none',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '13px',
    transition: 'opacity 0.2s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
  },
  btnPrimary: {
    backgroundColor: THEME.primary,
    color: '#fff',
    '&:hover': { opacity: 0.9 },
  },
  btnSecondary: {
    backgroundColor: '#fff',
    border: `1px solid ${THEME.border}`,
    color: '#475569',
    '&:hover': { backgroundColor: '#f1f5f9' },
  },
  modalOverlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.6)', // Slate 900 / 60%
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
    backdropFilter: 'blur(4px)',
  },
  modalContent: {
    width: '90%',
    maxWidth: '1000px',
    height: '80vh',
    backgroundColor: '#fff',
    borderRadius: '16px',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  }
};

// --- MAIN COMPONENT ---

export default function SnowAITradingSim() {
  // --- STATE ---
  const [isRunning, setIsRunning] = useState(false);
  const [dataSource, setDataSource] = useState('BINANCE'); // 'BINANCE' | 'UPLOAD'
  const [customData, setCustomData] = useState([]); // Raw uploaded data
  const [dataIndex, setDataIndex] = useState(0); // For iterating through custom data
  
  const [btcPrice, setBtcPrice] = useState(0);
  const [candles, setCandles] = useState([]); // Display candles
  
  // Params
  const [stopLossPct, setStopLossPct] = useState(2.5);
  const [takeProfitPct, setTakeProfitPct] = useState(5.0);
  const [speed, setSpeed] = useState(TICK_RATE_DEFAULT);
  
  // Modals
  const [selectedAgentId, setSelectedAgentId] = useState(null);

  // Function to generate a clean slate for an agent
  const createInitialAgentState = (template) => ({
    ...template,
    isActive: false,
    cash: INITIAL_CASH,
    shares: 0,
    portfolioValue: INITIAL_CASH,
    prevValue: INITIAL_CASH,
    history: [], // [{date, type, price, pnl}]
    logs: [],
    loss: 0,
    brain: new MicroNet(), 
    candles: [], // Local view of candles
    lastAction: 'INIT'
  });

  const [agents, setAgents] = useState(() => 
    AGENT_TEMPLATES.map(createInitialAgentState)
  );

  // Refs
  const wsRef = useRef(null);
  const candlesRef = useRef([]); // Store global candle history (mutable for loop)
  
  // --- DATA HANDLING ---

  // Custom File Upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      // Simple CSV Parse (Assumes: Time,Open,High,Low,Close OR just Close)
      const lines = text.trim().split('\n');
      const parsed = lines.map((line, i) => {
        if (i === 0 && isNaN(line.split(',')[0])) return null; // Skip header
        const parts = line.split(',');
        if (parts.length >= 5) {
            return {
                // Use index for time if not a valid timestamp, helps with chart rendering
                t: isNaN(Number(parts[0])) ? i : Number(parts[0]), 
                o: parseFloat(parts[1]), 
                h: parseFloat(parts[2]), 
                l: parseFloat(parts[3]), 
                c: parseFloat(parts[4])
            };
        } else {
            // Treat single value as close price
            const val = parseFloat(parts[0]);
            return { t: i, o: val, h: val, l: val, c: val };
        }
      }).filter(Boolean);

      setCustomData(parsed);
      setDataSource('UPLOAD');
      // Reset simulation state for backtesting
      resetSimulation();
    };
    reader.readAsText(file);
  };
  
  // Reset function for backtesting
  const resetSimulation = () => {
    setIsRunning(false);
    setDataIndex(0);
    setCandles([]);
    setBtcPrice(0);
    candlesRef.current = [];
    setAgents(AGENT_TEMPLATES.map(createInitialAgentState));
  };


  // Binance Connection / Disconnection
  useEffect(() => {
    if (dataSource === 'BINANCE') {
        wsRef.current = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@kline_1s'); // 1s klines for fast updates
        wsRef.current.onmessage = (event) => {
            const msg = JSON.parse(event.data);
            if (msg.e === 'kline') {
                const k = msg.k;
                const newCandle = {
                    t: k.t,
                    o: parseFloat(k.o),
                    h: parseFloat(k.h),
                    l: parseFloat(k.l),
                    c: parseFloat(k.c)
                };
                
                const current = candlesRef.current;
                
                // If it's the same candle (time), update it, else push new
                if (current.length > 0 && current[current.length - 1].t === newCandle.t) {
                    current[current.length - 1] = newCandle;
                } else {
                    current.push(newCandle);
                }
                
                // Keep the ref updated and set price for live feed
                candlesRef.current = current;
                setBtcPrice(newCandle.c);
            }
        };
    } else {
        if (wsRef.current) wsRef.current.close();
    }
    return () => { if (wsRef.current) wsRef.current.close(); };
  }, [dataSource]);

  // Game Loop
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
        let currentCandle = null;

        if (dataSource === 'UPLOAD') {
            if (dataIndex >= customData.length) {
                setIsRunning(false);
                // Show alert using custom modal pattern since window.alert is disallowed
                setAgents(prev => prev.map(a => ({
                  ...a, 
                  logs: [...a.logs.slice(-5), {msg: `Backtest Complete. Total Ticks: ${dataIndex}`, type:'info'}]
                })));
                return;
            }
            currentCandle = customData[dataIndex];
            
            // Update global candles for upload mode
            const current = candlesRef.current;
            current.push(currentCandle);
            candlesRef.current = current;
            
            setBtcPrice(currentCandle.c);
            setDataIndex(prev => prev + 1);
        } else {
            // Binance mode: just peek at latest
            const c = candlesRef.current;
            if (c.length > 0) currentCandle = c[c.length - 1];
        }

        if (currentCandle) {
            setCandles(candlesRef.current.slice(-100)); // Update UI state with max 100 for global chart
            updateAgents(currentCandle, candlesRef.current);
        }

    }, speed);

    return () => clearInterval(interval);
  }, [isRunning, speed, dataSource, dataIndex, customData]);

  // --- AGENT LOGIC (THE "BRAIN") ---

  const updateAgents = (priceData, history) => {
    setAgents(prev => prev.map(agent => {
        if (!agent.isActive) return agent;

        // 1. Prepare Inputs for Neural Net
        const len = history.length;
        if (len < 5) return agent;

        const currentPrice = priceData.c;
        // Find a valid previous price (skip if it's the first data point in history)
        const prevCandle = history[len - 2];
        const prevPrice = prevCandle ? prevCandle.c : currentPrice;
        
        // Input 1: Normalized % Change
        const pctChange = (currentPrice - prevPrice) / prevPrice;
        
        // Input 2: Distance from SMA (5-period)
        const relevantHistory = history.slice(-5);
        const sma = relevantHistory.length > 0 ? relevantHistory.reduce((acc, v) => acc + v.c, 0) / relevantHistory.length : currentPrice;
        const distSMA = (currentPrice - sma) / sma;

        // Run Prediction (Forward Pass)
        const inputs = [pctChange * 10, distSMA * 10, Math.random(), 1]; // Scaled inputs
        const prediction = agent.brain.predict(inputs); // 0 to 1

        let action = "HOLD";
        let newCash = agent.cash;
        let newShares = agent.shares;
        let pnl = 0;
        let tradeType = null;
        let newLogs = [...agent.logs];

        // 2. Trading Logic with SL/TP
        // Check SL/TP on existing position
        if (agent.shares > 0) {
            // Find the entry price of the *most recent* buy trade
            const entryTrade = agent.history.findLast(h => h.type === 'BUY');
            const entryPrice = entryTrade?.price || currentPrice;
            
            const currentPnlPct = ((currentPrice - entryPrice) / entryPrice) * 100;

            if (currentPnlPct <= -stopLossPct) {
                action = "SL_TRIGGER";
            } else if (currentPnlPct >= takeProfitPct) {
                action = "TP_TRIGGER";
            }
        }

        // Neural Net Decision to Enter/Exit
        if (action === "HOLD") {
            if (prediction > 0.7 && newCash > currentPrice * 0.01 && newShares === 0) action = "BUY"; // Only buy if flat
            else if (prediction < 0.3 && newShares > 0) action = "SELL";
        }

        // Execute Action
        if ((action === "BUY") && newCash > 0) {
            const amt = (newCash * 0.5) / currentPrice; // Buy with 50% cash
            if (amt > 0.00001) {
                newShares += amt;
                newCash -= amt * currentPrice * (1 + COMMISSION);
                tradeType = 'BUY';
                newLogs.push({ msg: `BUY @ ${currentPrice.toFixed(2)} (Pred: ${prediction.toFixed(2)})`, type: 'success', t: priceData.t });
            }
        } else if ((action === "SELL" || action === "SL_TRIGGER" || action === "TP_TRIGGER") && newShares > 0) {
            const entryTrade = agent.history.findLast(h => h.type === 'BUY');
            const entryPrice = entryTrade?.price || 0;
            
            const amt = newShares;
            
            newShares = 0;
            newCash += amt * currentPrice * (1 - COMMISSION);
            tradeType = 'SELL';
            pnl = (amt * currentPrice) - (amt * entryPrice);
            
            const label = action === "SL_TRIGGER" ? "🛑 STOP LOSS" : action === "TP_TRIGGER" ? "💎 TAKE PROFIT" : "SELL";
            newLogs.push({ msg: `${label} @ ${currentPrice.toFixed(2)} (PnL: ${fmt(pnl)})`, type: action.includes("SL") ? 'danger' : 'success', t: priceData.t });
        }

        // 3. "Training" Step (Backprop)
        // Simple RL: if portfolio value increased, reinforce (target=1), otherwise penalize (target=0)
        const newVal = newCash + (newShares * currentPrice);
        let target = 0.5;
        if (newVal > agent.prevValue) target = 1; 
        else if (newVal < agent.prevValue) target = 0; 
        
        const loss = agent.brain.train(inputs, target);

        // Update Agent State
        const newHistory = tradeType ? [...agent.history, { date: new Date().toLocaleTimeString(), t: priceData.t, type: tradeType, price: currentPrice, pnl }] : agent.history;

        return {
            ...agent,
            cash: newCash,
            shares: newShares,
            portfolioValue: newVal,
            prevValue: newVal, 
            loss: loss,
            history: newHistory,
            logs: newLogs.slice(-6), // Keep logs clean
            candles: history.slice(-20), // Keep local short history for chart
            lastAction: action
        };
    }));
  };

  const toggleAgent = (id) => {
    setAgents(prev => prev.map(a => a.id === id ? { 
      ...a, 
      isActive: !a.isActive, 
      logs: a.isActive ? a.logs : [...a.logs, {msg: "Agent Activated...", type:'info'}] 
    } : a));
  };

  // --- RENDER HELPERS ---
  const getAgentDetail = () => agents.find(a => a.id === selectedAgentId);

  return (
    <div>
        <div className="header">
            <Header />
        </div>
        <div className="main-page-body">
            <SideNavs />
    <div style={styles.app}>
      
      {/* HEADER */}
      <header style={styles.header}>
        <div style={styles.logo}>
          <span>❄️</span> SnowAI <span style={{color:'#94a3b8', fontWeight: 400}}>Trading Lab</span>
        </div>
        
        <div style={{display:'flex', gap:'20px', alignItems:'center'}}>
           <div style={{textAlign:'right'}}>
              <div style={styles.label}>BTC/USDT</div>
              <div style={{fontSize:'16px', fontWeight:'700', color: THEME.primary}}>{fmt(btcPrice)}</div>
           </div>
           
           <button 
             style={{...styles.btn, ...(isRunning ? {backgroundColor: THEME.danger, color:'white'} : styles.btnPrimary)}}
             onClick={() => setIsRunning(!isRunning)}
           >
             {isRunning ? 'STOP SIMULATION' : 'START SIMULATION'}
           </button>
        </div>
      </header>

      <div style={styles.main}>
        
        {/* SIDEBAR CONTROLS */}
        <div style={styles.sidebar}>
          
          <div>
            <div style={styles.sectionTitle}>Data Source</div>
            <div style={{display:'flex', gap:'10px', marginBottom:'10px'}}>
                <button 
                  style={{...styles.btn, flex:1, ...(dataSource === 'BINANCE' ? styles.btnPrimary : styles.btnSecondary)}}
                  onClick={() => {setDataSource('BINANCE'); resetSimulation();}}
                >
                  Live Binance
                </button>
                <button 
                  style={{...styles.btn, flex:1, ...(dataSource === 'UPLOAD' ? styles.btnPrimary : styles.btnSecondary)}}
                  onClick={() => document.getElementById('fileUpload').click()}
                >
                  Upload CSV
                </button>
                <input type="file" id="fileUpload" hidden accept=".csv,.txt" onChange={handleFileUpload} />
            </div>
            {dataSource === 'UPLOAD' && (
                <div style={{fontSize:'11px', color: customData.length > 0 ? THEME.success : THEME.danger}}>
                    {customData.length > 0 ? `Dataset Loaded: ${customData.length} pts. Ticks: ${dataIndex} / ${customData.length}` : "No file loaded"}
                </div>
            )}
          </div>
          
          {dataSource === 'UPLOAD' && customData.length > 0 && (
            <button 
              style={{...styles.btn, ...styles.btnSecondary, color: THEME.danger}}
              onClick={resetSimulation}
            >
              🔄 RESET BACKTEST
            </button>
          )}

          <div>
            <div style={styles.sectionTitle}>Risk Parameters</div>
            <div style={styles.controlGroup}>
                <div style={styles.label}>Take Profit (%)</div>
                <input 
                  type="number" 
                  style={styles.input} 
                  value={takeProfitPct}
                  onChange={(e) => setTakeProfitPct(Number(e.target.value))}
                />
            </div>
            <div style={{...styles.controlGroup, marginTop:'10px'}}>
                <div style={styles.label}>Stop Loss (%)</div>
                <input 
                  type="number" 
                  style={styles.input} 
                  value={stopLossPct}
                  onChange={(e) => setStopLossPct(Number(e.target.value))}
                />
            </div>
          </div>

          <div>
            <div style={styles.sectionTitle}>Simulation Speed</div>
            <input 
                type="range" 
                min="50" max="1000" step="50" 
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
                style={{width:'100%'}} 
            />
            <div style={{textAlign:'right', fontSize:'11px', color:'#64748b'}}>{speed}ms / tick</div>
          </div>

        </div>

        {/* MAIN CONTENT AREA (Chart + Agents) */}
        <div style={styles.contentArea}>
          
          {/* GLOBAL CHART VIEW */}
          <div style={styles.chartContainer}>
              <div style={{color:THEME.accent, fontWeight:'700', fontSize:'14px', marginBottom:'10px'}}>
                Global BTC/USDT Price Action (Last {Math.min(candles.length, 100)} Ticks)
              </div>
              <MainCandleChart data={candles} agents={agents} width={900} height={300} />
          </div>

          {/* AGENT TERMINALS */}
          <div style={styles.agentGrid}>
            {agents.map(agent => (
              <div key={agent.id} style={{...styles.card, opacity: agent.isActive ? 1 : 0.7, transform: agent.isActive ? 'scale(1)' : 'scale(0.98)'}}>
                
                <div style={styles.cardHeader}>
                   <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
                      <div style={{width:'12px', height:'12px', borderRadius:'50%', backgroundColor: agent.isActive ? THEME.success : '#cbd5e1'}}></div>
                      <div>
                          <div style={{fontWeight:'700', fontSize:'15px'}}>{agent.name}</div>
                          <div style={{fontSize:'11px', color: THEME.primary}}>{agent.type}</div>
                      </div>
                   </div>
                   <div style={{textAlign:'right'}}>
                      <div style={{fontWeight:'700', color: agent.portfolioValue >= INITIAL_CASH ? THEME.success : THEME.danger}}>
                          {fmt(agent.portfolioValue)}
                      </div>
                      <div style={{fontSize:'10px', color:'#64748b'}}>
                          ROI: {((agent.portfolioValue - INITIAL_CASH)/INITIAL_CASH * 100).toFixed(2)}%
                      </div>
                   </div>
                </div>

                {/* TERMINAL VIEW */}
                <div style={styles.terminal} onClick={() => !agent.isActive && toggleAgent(agent.id)}>
                  
                  {!agent.isActive && (
                      <div style={{position:'absolute', top:0,left:0,right:0,bottom:0, display:'flex', alignItems:'center', justifyContent:'center', backgroundColor:'rgba(0,0,0,0.4)', zIndex:10, cursor:'pointer'}}>
                          <button style={{...styles.btnPrimary, padding: '12px 20px'}}>INITIALIZE AGENT</button>
                      </div>
                  )}

                  {/* VISUALIZATION (Mini-Chart) */}
                  <div style={styles.chartArea}>
                      <MiniCandleChart data={agent.candles} trades={agent.history} width={300} height={120} />
                  </div>

                  {/* METRICS */}
                  <div style={{display:'flex', justifyContent:'space-between', marginBottom:'10px', fontSize:'10px', fontFamily:'monospace', color:'#94a3b8'}}>
                      <span>LOSS: <span style={{color: '#f87171'}}>{agent.loss.toFixed(6)}</span></span>
                      <span>SHARES: {agent.shares.toFixed(4)}</span>
                      <span>TICKS: {agent.candles.length}</span>
                  </div>

                  {/* LOGS */}
                  <div style={styles.logArea}>
                      {agent.logs.map((log, i) => (
                          <div key={i} style={{marginBottom:'4px', color: log.type === 'danger' ? '#f87171' : log.type === 'success' ? '#4ade80' : '#e2e8f0'}}>
                              {`> ${log.msg}`}
                          </div>
                      ))}
                      <div style={{color: THEME.accent}}>{`> _`}</div>
                  </div>

                </div>
                
                <div style={{padding:'10px', borderTop:`1px solid ${THEME.border}`, backgroundColor:'#f8fafc', display:'flex', justifyContent:'space-between'}}>
                  <button style={{...styles.btnSecondary, fontSize:'11px', padding:'6px 10px'}} onClick={() => toggleAgent(agent.id)}>
                      {agent.isActive ? 'PAUSE' : 'RESUME'}
                  </button>
                  <button style={{...styles.btnSecondary, fontSize:'11px', padding:'6px 10px'}} onClick={() => setSelectedAgentId(agent.id)}>
                      FULL ANALYSIS ↗
                  </button>
                </div>

              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FULL SCREEN ANALYSIS MODAL */}
      {selectedAgentId && (
          <div style={styles.modalOverlay} onClick={() => setSelectedAgentId(null)}>
              <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
                  <div style={{padding:'20px', borderBottom:`1px solid ${THEME.border}`, display:'flex', justifyContent:'space-between'}}>
                      <h2 style={{margin:0}}>{getAgentDetail().name} Analysis</h2>
                      <button onClick={() => setSelectedAgentId(null)} style={{border:'none', background:'none', fontSize:'20px', cursor:'pointer'}}>×</button>
                  </div>
                  <div style={{padding:'24px', flex:1, overflowY:'auto'}}>
                      <div style={{display:'flex', gap:'20px', marginBottom:'24px'}}>
                          <div style={{padding:'16px', backgroundColor:'#f1f5f9', borderRadius:'8px', flex:1}}>
                              <div style={styles.label}>Net Profit</div>
                              <div style={{fontSize:'24px', fontWeight:'bold', color: getAgentDetail().portfolioValue >= INITIAL_CASH ? THEME.success : THEME.danger}}>
                                  {fmt(getAgentDetail().portfolioValue - INITIAL_CASH)}
                              </div>
                          </div>
                          <div style={{padding:'16px', backgroundColor:'#f1f5f9', borderRadius:'8px', flex:1}}>
                              <div style={styles.label}>Total Trades</div>
                              <div style={{fontSize:'24px', fontWeight:'bold'}}>{getAgentDetail().history.filter(h => h.type === 'BUY').length} / {getAgentDetail().history.filter(h => h.type === 'SELL').length} (B/S)</div>
                          </div>
                          <div style={{padding:'16px', backgroundColor:'#f1f5f9', borderRadius:'8px', flex:1}}>
                              <div style={styles.label}>Strategy Model</div>
                              <div style={{fontSize:'24px', fontWeight:'bold', color: THEME.primary}}>{getAgentDetail().type}</div>
                          </div>
                      </div>
                      
                      <h3>Trade History ({getAgentDetail().history.length} events)</h3>
                      <table style={{width:'100%', borderCollapse:'collapse', fontSize:'14px'}}>
                          <thead>
                              <tr style={{textAlign:'left', borderBottom:`2px solid ${THEME.border}`}}>
                                  <th style={{padding:'8px'}}>Time</th>
                                  <th style={{padding:'8px'}}>Type</th>
                                  <th style={{padding:'8px'}}>Price</th>
                                  <th style={{padding:'8px'}}>PnL (if Sell)</th>
                              </tr>
                          </thead>
                          <tbody>
                              {getAgentDetail().history.map((h, i) => (
                                  <tr key={i} style={{borderBottom:`1px solid ${THEME.border}`}}>
                                      <td style={{padding:'8px', color:'#64748b'}}>{h.date}</td>
                                      <td style={{padding:'8px', fontWeight:'bold', color: h.type === 'BUY' ? THEME.success : THEME.danger}}>{h.type}</td>
                                      <td style={{padding:'8px'}}>{fmt(h.price)}</td>
                                      <td style={{padding:'8px', color: h.pnl > 0 ? THEME.success : h.pnl < 0 ? THEME.danger : '#64748b'}}>
                                          {h.pnl !== 0 ? fmt(h.pnl) : '-'}
                                      </td>
                                  </tr>
                              ))}
                          </tbody>
                      </table>
                  </div>
              </div>
          </div>
      )}
        </div>
        </div>
    </div>

  );
}