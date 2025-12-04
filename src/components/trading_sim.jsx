import React, { useState, useEffect, useRef } from 'react';
import Header from "./header";
import SideNavs from "./side_navs";

// --- CONFIGURATION & HELPERS ---

const TICK_RATE_DEFAULT = 100;
const INITIAL_CASH = 10000;
const COMMISSION = 0.001; 

const THEME = {
  bg: '#f8fafc', 
  text: '#1e293b', 
  primary: '#2563eb', 
  secondary: '#3b82f6', 
  accent: '#0ea5e9', 
  danger: '#ef4444',
  success: '#10b981',
  warning: '#f59e0b',
  cardBg: '#ffffff',
  border: '#e2e8f0', 
  terminalBg: '#0f172a', 
  terminalText: '#e2e8f0',
};

// Expanded Agent Roster with different "Personalities" (Learning Rates / Risk profiles)
const AGENT_TEMPLATES = [
  { id: 1, name: "Snow-Alpha", type: "Balanced (DQN)", color: "#3b82f6", lr: 0.01, risk: 'med' },
  { id: 2, name: "Ice-Beta", type: "Scalper (Fast)", color: "#0ea5e9", lr: 0.05, risk: 'high' },
  { id: 3, name: "Frost-Gamma", type: "Trend (Slow)", color: "#6366f1", lr: 0.001, risk: 'low' },
  { id: 4, name: "Glacier-X", type: "Deep-Hold", color: "#8b5cf6", lr: 0.005, risk: 'med' },
  { id: 5, name: "Avalanche-Z", type: "Aggressive", color: "#f43f5e", lr: 0.08, risk: 'high' },
  { id: 6, name: "Polar-Prime", type: "Conservative", color: "#10b981", lr: 0.0005, risk: 'low' },
];

const fmt = (num) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(num);

// --- NEURAL NETWORK CLASS ---
class MicroNet {
  constructor(weights = null, bias = null, learningRate = 0.01) {
    // 4 Inputs: [PctChange, DistSMA, Volatility, BiasInput]
    this.weights = weights || [Math.random()-0.5, Math.random()-0.5, Math.random()-0.5, Math.random()-0.5]; 
    this.bias = bias !== null ? bias : Math.random()-0.5;
    this.learningRate = learningRate;
  }

  predict(inputs) {
    let sum = this.bias;
    for (let i = 0; i < inputs.length; i++) {
      sum += inputs[i] * this.weights[i];
    }
    return 1 / (1 + Math.exp(-sum)); // Sigmoid
  }

  train(inputs, target) {
    const prediction = this.predict(inputs);
    const error = target - prediction;
    
    // Gradient Descent
    for (let i = 0; i < this.weights.length; i++) {
      this.weights[i] += error * inputs[i] * this.learningRate;
    }
    this.bias += error * this.learningRate;
    return Math.abs(error);
  }

  exportWeights() {
    return JSON.stringify({ w: this.weights, b: this.bias });
  }
}

// --- CHART COMPONENTS ---

/** Renders a full-width, detailed chart for the main view with Trade Overlays */
const MainCandleChart = ({ data, agents, width, height }) => {
  const displayData = data.slice(-100); 

  if (!displayData || displayData.length < 2) return (
    <div style={{color: '#94a3b8', padding:'40px', textAlign:'center', fontSize:'14px'}}>
        Waiting for market data...
    </div>
  );

  const maxPrice = Math.max(...displayData.map(d => d.h));
  const minPrice = Math.min(...displayData.map(d => d.l));
  const range = maxPrice - minPrice || 1;
  const scaleY = (p) => height - ((p - minPrice) / range) * height;
  const candleWidth = (width / displayData.length) * 0.7;

  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} style={{overflow:'visible'}}>
      {/* Grid Lines & Labels */}
      {[...Array(5)].map((_, i) => {
        const price = minPrice + (range / 4) * i;
        const y = scaleY(price);
        return (
          <g key={i}>
            <line x1="0" y1={y} x2={width} y2={y} stroke="#334155" strokeDasharray="2,2" strokeOpacity="0.3" />
            <text x={width + 5} y={y + 3} fontSize="10" fill="#64748b">{price.toFixed(2)}</text>
          </g>
        );
      })}

      {/* Candles */}
      {displayData.map((d, i) => {
        const x = i * (width / displayData.length);
        const yOpen = scaleY(d.o);
        const yClose = scaleY(d.c);
        const yHigh = scaleY(d.h);
        const yLow = scaleY(d.l);
        const isGreen = d.c >= d.o;
        
        return (
          <g key={i}>
            <line x1={x + candleWidth/2} y1={yHigh} x2={x + candleWidth/2} y2={yLow} stroke={isGreen ? THEME.success : THEME.danger} strokeWidth="1" />
            <rect x={x} y={Math.min(yOpen, yClose)} width={candleWidth} height={Math.abs(yClose - yOpen) || 1} fill={isGreen ? THEME.success : THEME.danger} />
          </g>
        );
      })}

      {/* Agent Trade Markers Overlay */}
      {agents.filter(a => a.isActive).map(agent => (
        agent.history.slice(-10).map((t, i) => {
          // Find the index of this trade in the current displayData
          const globalIndex = data.findIndex(d => d.t === t.t);
          if (globalIndex === -1 || globalIndex < data.length - 100) return null; // Skip if not visible
          
          const localIndex = globalIndex - (data.length - displayData.length);
          const x = localIndex * (width / displayData.length) + (candleWidth / 2);
          const y = scaleY(t.price);
          
          return (
            <text 
              key={`${agent.id}-${i}`} 
              x={x} 
              y={y + (t.type === 'BUY' ? 15 : -10)}
              fontSize="14" 
              fill={t.type === 'BUY' ? THEME.success : THEME.danger}
              textAnchor="middle"
              opacity="0.9"
            >
              {t.type === 'BUY' ? '▲' : '▼'}
            </text>
          );
        })
      ))}
    </svg>
  );
};

/** Renders a small chart for the agent card with latest trade marker */
const MiniCandleChart = ({ data, trades, width, height }) => {
  if (!data || data.length < 2) return (
    <div style={{color: '#475569', fontSize:'10px', height: '100%', display:'flex', alignItems:'center', justifyContent:'center'}}>
        Initializing...
    </div>
  );

  const maxPrice = Math.max(...data.map(d => d.h));
  const minPrice = Math.min(...data.map(d => d.l));
  const range = maxPrice - minPrice || 1;
  const scaleY = (p) => height - ((p - minPrice) / range) * height;
  const candleWidth = (width / data.length) * 0.8;

  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} style={{overflow:'visible'}}>
      {data.map((d, i) => {
        const x = i * (width / data.length);
        const isGreen = d.c >= d.o;
        return (
          <rect key={i} x={x} y={scaleY(Math.max(d.o, d.c))} width={candleWidth} height={Math.abs(scaleY(d.o) - scaleY(d.c)) || 1} fill={isGreen ? THEME.success : THEME.danger} opacity={0.8} />
        );
      })}
      
      {/* Latest Trade Marker */}
      {trades.length > 0 && trades.slice(-1).map((t, i) => {
         const y = scaleY(t.price);
         const lastIndex = data.length - 1;
         const x = lastIndex * (width / data.length);
         return (
           <text key={i} x={x} y={y + (t.type === 'BUY' ? 12 : -5)} fontSize="14" fill={t.type === 'BUY' ? THEME.success : THEME.danger} textAnchor="middle">
             {t.type === 'BUY' ? '▲' : '▼'}
           </text>
         )
      })}
    </svg>
  );
};

// --- STYLES ---
const styles = {
  app: { 
    fontFamily: 'Inter, system-ui, sans-serif', 
    backgroundColor: THEME.bg, 
    color: THEME.text, 
    minHeight: '100vh', 
    display: 'flex', 
    flexDirection: 'column' 
  },
  header: { 
    backgroundColor: '#fff', 
    borderBottom: `1px solid ${THEME.border}`, 
    padding: '12px 24px', 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center' 
  },
  main: { 
    display: 'flex', 
    flex: 1, 
    overflow: 'hidden' 
  },
  sidebar: { 
    width: '280px', 
    backgroundColor: '#fff', 
    borderRight: `1px solid ${THEME.border}`, 
    padding: '20px', 
    display: 'flex', 
    flexDirection: 'column', 
    gap: '24px', 
    overflowY: 'auto' 
  },
  contentArea: { 
    flex: 1, 
    padding: '24px', 
    display: 'flex', 
    flexDirection: 'column', 
    gap: '24px', 
    overflowY: 'auto', 
    backgroundColor: '#f1f5f9' 
  },
  chartContainer: { 
    backgroundColor: THEME.terminalBg, 
    color: THEME.terminalText, 
    borderRadius: '12px', 
    padding: '16px', 
    height: '320px', 
    border: `1px solid ${THEME.border}`, 
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' 
  },
  agentGrid: { 
    display: 'grid', 
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
    gap: '20px', 
    paddingBottom: '40px' 
  },
  
  // Card Styles
  card: { 
    backgroundColor: '#fff', 
    borderRadius: '12px', 
    border: `1px solid ${THEME.border}`, 
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', 
    display: 'flex', 
    flexDirection: 'column', 
    height: '420px', // Fixed height
    overflow: 'hidden', 
    position: 'relative',
    transition: 'transform 0.2s'
  },
  cardHeader: { 
    padding: '12px 16px', 
    borderBottom: `1px solid ${THEME.border}`, 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    backgroundColor: '#fff' 
  },
  terminal: { 
    flex: 1, 
    backgroundColor: THEME.terminalBg, 
    color: THEME.terminalText, 
    fontFamily: '"JetBrains Mono", monospace', 
    fontSize: '11px', 
    padding: '12px', 
    display: 'flex', 
    flexDirection: 'column', 
    overflow: 'hidden', // Contain internals
    minHeight: 0 // Flexbox fix
  },
  logArea: { 
    flex: 1, 
    overflowY: 'auto', 
    display: 'flex', 
    flexDirection: 'column', 
    justifyContent: 'flex-end', 
    marginTop: '10px' 
  },
  cardFooter: { 
    padding: '12px', 
    backgroundColor: '#f8fafc', 
    borderTop: `1px solid ${THEME.border}`, 
    display: 'flex', 
    justifyContent: 'space-between',
    gap: '10px',
    zIndex: 5
  },
  
  // UI Elements
  btn: { 
    padding: '8px 14px', 
    borderRadius: '6px', 
    border: 'none', 
    fontWeight: '600', 
    cursor: 'pointer', 
    fontSize: '12px', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    gap: '6px' 
  },
  btnPrimary: { 
    backgroundColor: THEME.primary, 
    color: '#fff' 
  },
  btnSecondary: { 
    backgroundColor: '#fff', 
    border: `1px solid ${THEME.border}`, 
    color: '#475569' 
  },
  input: { 
    padding: '8px', 
    borderRadius: '6px', 
    border: `1px solid ${THEME.border}`, 
    fontSize: '13px', 
    width: '100%', 
    boxSizing: 'border-box' 
  },
  label: { 
    fontSize: '11px', 
    fontWeight: '600', 
    color: '#64748b', 
    marginBottom: '4px', 
    display:'block' 
  },
  
  modalOverlay: { 
    position: 'fixed', 
    top: 0, left: 0, right: 0, bottom: 0, 
    backgroundColor: 'rgba(15, 23, 42, 0.75)', 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    zIndex: 100, 
    backdropFilter: 'blur(4px)' 
  },
  modalContent: { 
    width: '90%', 
    maxWidth: '900px', 
    maxHeight: '85vh', 
    backgroundColor: '#fff', 
    borderRadius: '16px', 
    display: 'flex', 
    flexDirection: 'column', 
    overflow: 'hidden', 
    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' 
  }
};

// --- MAIN COMPONENT ---

export default function SnowAITradingSim() {
  const [isRunning, setIsRunning] = useState(false);
  const [dataSource, setDataSource] = useState('BINANCE');
  const [customData, setCustomData] = useState([]);
  const [dataIndex, setDataIndex] = useState(0);
  
  const [btcPrice, setBtcPrice] = useState(0);
  const [startPrice, setStartPrice] = useState(null); // For Buy & Hold calc
  const [candles, setCandles] = useState([]);
  
  const [stopLossPct, setStopLossPct] = useState(2.5);
  const [takeProfitPct, setTakeProfitPct] = useState(5.0);
  const [speed, setSpeed] = useState(TICK_RATE_DEFAULT);
  
  const [selectedAgentId, setSelectedAgentId] = useState(null);

  // Initialize Agents
  const createInitialAgentState = (template) => ({
    ...template,
    isActive: false,
    cash: INITIAL_CASH,
    shares: 0,
    portfolioValue: INITIAL_CASH,
    prevValue: INITIAL_CASH,
    history: [], 
    logs: [{msg: "System Initialized. Waiting...", type:'info'}],
    loss: 0,
    brain: new MicroNet(null, null, template.lr), 
    candles: [],
    lastAction: 'WAIT'
  });

  const [agents, setAgents] = useState(() => AGENT_TEMPLATES.map(createInitialAgentState));
  
  const wsRef = useRef(null);
  const candlesRef = useRef([]);

  // --- DATA HANDLING ---

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const lines = text.trim().split('\n');
      const parsed = lines.map((line, i) => {
        if (i === 0 && isNaN(line.split(',')[0])) return null;
        const parts = line.split(',');
        if (parts.length >= 5) {
            return { t: i, o: parseFloat(parts[1]), h: parseFloat(parts[2]), l: parseFloat(parts[3]), c: parseFloat(parts[4]) };
        } else {
            const val = parseFloat(parts[0]);
            return { t: i, o: val, h: val, l: val, c: val };
        }
      }).filter(Boolean);
      setCustomData(parsed);
      setDataSource('UPLOAD');
      resetSimulation();
    };
    reader.readAsText(file);
  };
  
  const resetSimulation = () => {
    setIsRunning(false);
    setDataIndex(0);
    setCandles([]);
    setBtcPrice(0);
    setStartPrice(null);
    candlesRef.current = [];
    setAgents(AGENT_TEMPLATES.map(createInitialAgentState));
  };

  useEffect(() => {
    if (dataSource === 'BINANCE') {
        wsRef.current = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@kline_1s');
        wsRef.current.onmessage = (event) => {
            const msg = JSON.parse(event.data);
            if (msg.e === 'kline') {
                const k = msg.k;
                const newCandle = { t: k.t, o: parseFloat(k.o), h: parseFloat(k.h), l: parseFloat(k.l), c: parseFloat(k.c) };
                
                const current = candlesRef.current;
                if (current.length > 0 && current[current.length - 1].t === newCandle.t) {
                    current[current.length - 1] = newCandle;
                } else {
                    current.push(newCandle);
                }
                candlesRef.current = current;
                setBtcPrice(newCandle.c);
                if (startPrice === null) setStartPrice(newCandle.c);
            }
        };
    } else {
        if (wsRef.current) wsRef.current.close();
    }
    return () => { if (wsRef.current) wsRef.current.close(); };
  }, [dataSource, startPrice]);

  // --- GAME LOOP ---

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
        let currentCandle = null;

        if (dataSource === 'UPLOAD') {
            if (dataIndex >= customData.length) {
                setIsRunning(false);
                return;
            }
            currentCandle = customData[dataIndex];
            candlesRef.current.push(currentCandle);
            setBtcPrice(currentCandle.c);
            if (startPrice === null) setStartPrice(currentCandle.c);
            setDataIndex(prev => prev + 1);
        } else {
            const c = candlesRef.current;
            if (c.length > 0) currentCandle = c[c.length - 1];
        }

        if (currentCandle) {
            setCandles(candlesRef.current.slice(-100));
            updateAgents(currentCandle, candlesRef.current);
        }

    }, speed);

    return () => clearInterval(interval);
  }, [isRunning, speed, dataSource, dataIndex, customData, startPrice]);

  // --- AGENT LOGIC ---

  const updateAgents = (priceData, history) => {
    setAgents(prev => prev.map(agent => {
        if (!agent.isActive) return agent;

        // 1. Prepare Inputs
        const len = history.length;
        if (len < 5) return agent;
        const currentPrice = priceData.c;
        const prevCandle = history[len - 2] || priceData;
        
        // Input: Pct Change, Dist from SMA, Volatility, Bias
        const pctChange = (currentPrice - prevCandle.c) / prevCandle.c;
        const sma = history.slice(-5).reduce((acc, v) => acc + v.c, 0) / 5;
        const distSMA = (currentPrice - sma) / sma;
        const volatility = (priceData.h - priceData.l) / priceData.c;
        
        const inputs = [pctChange * 10, distSMA * 10, volatility * 10, 1];
        const prediction = agent.brain.predict(inputs); 

        let action = "HOLD";
        let newCash = agent.cash;
        let newShares = agent.shares;
        let pnl = 0;
        let tradeType = null;
        let newLogs = [...agent.logs];

        // 2. Risk Management (Hard Rules override AI)
        if (agent.shares > 0) {
            const entryTrade = agent.history.findLast(h => h.type === 'BUY');
            const entryPrice = entryTrade?.price || currentPrice;
            const currentPnlPct = ((currentPrice - entryPrice) / entryPrice) * 100;

            if (currentPnlPct <= -stopLossPct) action = "SL_TRIGGER";
            else if (currentPnlPct >= takeProfitPct) action = "TP_TRIGGER";
        }

        // 3. AI Decision
        if (action === "HOLD") {
            if (prediction > 0.65 && newCash > currentPrice * 0.01 && newShares === 0) action = "BUY";
            else if (prediction < 0.35 && newShares > 0) action = "SELL";
        }

        // 4. Execution
        if (action === "BUY" && newCash > 0) {
            const amt = (newCash * 0.95) / currentPrice; // Go heavy
            newShares += amt;
            newCash -= amt * currentPrice * (1 + COMMISSION);
            tradeType = 'BUY';
            newLogs.push({ msg: `BUY @ ${fmt(currentPrice)} (Conf: ${(prediction*100).toFixed(0)}%)`, type: 'success' });
        } else if ((action === "SELL" || action.includes("TRIGGER")) && newShares > 0) {
            const entryTrade = agent.history.findLast(h => h.type === 'BUY');
            const entryPrice = entryTrade?.price || 0;
            const amt = newShares;
            newShares = 0;
            newCash += amt * currentPrice * (1 - COMMISSION);
            tradeType = 'SELL';
            pnl = (amt * currentPrice) - (amt * entryPrice);
            
            const label = action === "SL_TRIGGER" ? "🛑 STOP" : action === "TP_TRIGGER" ? "💎 TAKE PROFIT" : "SELL";
            newLogs.push({ msg: `${label} @ ${fmt(currentPrice)} PnL: ${fmt(pnl)}`, type: pnl > 0 ? 'success' : 'danger' });
        }

        // 5. Training
        // If portfolio grew, good job.
        const currentVal = newCash + (newShares * currentPrice);
        let target = 0.5;
        if (currentVal > agent.prevValue) target = 1; 
        else if (currentVal < agent.prevValue) target = 0; 
        
        const loss = agent.brain.train(inputs, target);

        const newHistory = tradeType ? [...agent.history, { date: new Date().toLocaleTimeString(), t: priceData.t, type: tradeType, price: currentPrice, pnl }] : agent.history;

        return {
            ...agent,
            cash: newCash,
            shares: newShares,
            portfolioValue: currentVal,
            prevValue: currentVal, 
            loss: loss,
            history: newHistory,
            logs: newLogs.slice(-20),
            candles: history.slice(-30),
            lastAction: action
        };
    }));
  };

  const toggleAgent = (id) => {
    setAgents(prev => prev.map(a => a.id === id ? { 
      ...a, 
      isActive: !a.isActive, 
      logs: a.isActive ? [...a.logs, {msg: "Paused.", type:'warning'}] : [...a.logs, {msg: "Agent Activated.", type:'info'}] 
    } : a));
  };

  const getAgentDetail = () => agents.find(a => a.id === selectedAgentId);

  // --- RENDER ---
  return (
    <div>
        <div className="header">
            <Header />
        </div>
        <div className="main-page-body">
            <SideNavs />
    <div style={styles.app}>
      <header style={styles.header}>
        <div style={{fontSize: '18px', fontWeight: '800', color: THEME.primary, display:'flex', alignItems:'center', gap:'8px'}}>
          <span>❄️</span> SnowAI <span style={{color:'#94a3b8', fontWeight: 400}}>Training Sim v2.0</span>
        </div>
        <div style={{display:'flex', gap:'24px', alignItems:'center'}}>
           <div style={{textAlign:'right'}}>
              <div style={styles.label}>BTC PRICE</div>
              <div style={{fontSize:'16px', fontWeight:'700', fontFamily:'monospace'}}>{fmt(btcPrice)}</div>
           </div>
           <button style={{...styles.btn, ...(isRunning ? {backgroundColor: THEME.danger, color:'white'} : styles.btnPrimary), width:'120px'}} onClick={() => setIsRunning(!isRunning)}>
             {isRunning ? 'STOP' : 'START SIM'}
           </button>
        </div>
      </header>

      <div style={styles.main}>
        {/* SIDEBAR */}
        <div style={styles.sidebar}>
          <div>
            <div style={styles.label}>DATA SOURCE</div>
            <div style={{display:'flex', gap:'8px'}}>
                <button style={{...styles.btn, flex:1, ...(dataSource === 'BINANCE' ? styles.btnPrimary : styles.btnSecondary)}} onClick={() => {setDataSource('BINANCE'); resetSimulation();}}>Live</button>
                <button style={{...styles.btn, flex:1, ...(dataSource === 'UPLOAD' ? styles.btnPrimary : styles.btnSecondary)}} onClick={() => document.getElementById('fileUpload').click()}>CSV</button>
            </div>
            <input type="file" id="fileUpload" hidden accept=".csv,.txt" onChange={handleFileUpload} />
          </div>

          <div>
            <div style={styles.label}>RISK SETTINGS</div>
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px'}}>
                <div>
                    <span style={{fontSize:'10px', color:'#64748b'}}>Take Profit %</span>
                    <input type="number" style={styles.input} value={takeProfitPct} onChange={(e) => setTakeProfitPct(Number(e.target.value))} />
                </div>
                <div>
                    <span style={{fontSize:'10px', color:'#64748b'}}>Stop Loss %</span>
                    <input type="number" style={styles.input} value={stopLossPct} onChange={(e) => setStopLossPct(Number(e.target.value))} />
                </div>
            </div>
          </div>
          
          <div>
             <div style={styles.label}>SPEED ({speed}ms)</div>
             <input type="range" min="20" max="1000" step="10" value={speed} onChange={(e) => setSpeed(Number(e.target.value))} style={{width:'100%'}} />
          </div>

          <div style={{marginTop:'auto', paddingTop:'20px', borderTop:`1px solid ${THEME.border}`}}>
            <div style={{fontSize:'11px', color:'#94a3b8', marginBottom:'10px'}}>MODEL ROSTER</div>
            {agents.map(a => (
                <div key={a.id} style={{display:'flex', alignItems:'center', gap:'8px', marginBottom:'6px', fontSize:'12px'}}>
                    <div style={{width:'8px', height:'8px', borderRadius:'50%', backgroundColor: a.color}}></div>
                    <span style={{flex:1}}>{a.name}</span>
                    <span style={{color: a.portfolioValue >= INITIAL_CASH ? THEME.success : THEME.danger}}>{((a.portfolioValue - INITIAL_CASH)/INITIAL_CASH*100).toFixed(1)}%</span>
                </div>
            ))}
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div style={styles.contentArea}>
          <div style={styles.chartContainer}>
              <MainCandleChart data={candles} agents={agents} width={800} height={300} />
          </div>

          <div style={styles.agentGrid}>
            {agents.map(agent => (
              <div key={agent.id} style={{...styles.card, opacity: agent.isActive ? 1 : 0.85}}>
                <div style={styles.cardHeader}>
                   <div>
                       <div style={{fontWeight:'700', fontSize:'14px'}}>{agent.name}</div>
                       <div style={{fontSize:'11px', color: agent.color}}>{agent.type}</div>
                   </div>
                   <div style={{textAlign:'right'}}>
                       <div style={{fontWeight:'700', color: agent.portfolioValue >= INITIAL_CASH ? THEME.success : THEME.danger}}>{fmt(agent.portfolioValue)}</div>
                   </div>
                </div>

                <div style={styles.terminal} onClick={() => !agent.isActive && toggleAgent(agent.id)}>
                   {!agent.isActive && <div style={{position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', backgroundColor:'rgba(0,0,0,0.1)', zIndex:2, cursor:'pointer'}}><span style={{backgroundColor: THEME.primary, color:'white', padding:'6px 12px', borderRadius:'20px', fontSize:'11px'}}>Click to Start</span></div>}
                   
                   <div style={{height: '80px', marginBottom: '8px', borderBottom: '1px dashed #334155'}}>
                        <MiniCandleChart data={agent.candles} trades={agent.history} width={280} height={80} />
                   </div>
                   
                   <div style={styles.logArea}>
                      {agent.logs.map((log, i) => (
                          <div key={i} style={{marginBottom:'2px', color: log.type === 'danger' ? '#f87171' : log.type === 'success' ? '#4ade80' : log.type === 'warning' ? '#fbbf24' : '#94a3b8'}}>
                              {`> ${log.msg}`}
                          </div>
                      ))}
                      <div ref={el => el?.scrollIntoView({behavior:'smooth'})} />
                   </div>
                </div>

                <div style={styles.cardFooter}>
                    <button style={{...styles.btnSecondary, flex:1}} onClick={() => toggleAgent(agent.id)}>
                        {agent.isActive ? '⏸ PAUSE' : '▶ RESUME'}
                    </button>
                    <button style={{...styles.btnPrimary, flex:1}} onClick={() => setSelectedAgentId(agent.id)}>
                        ANALYSIS
                    </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ANALYSIS MODAL */}
      {selectedAgentId && (
        <div style={styles.modalOverlay} onClick={() => setSelectedAgentId(null)}>
           <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
              <div style={styles.cardHeader}>
                  <h2 style={{margin:0, fontSize:'18px'}}>🧠 Neural Analysis: {getAgentDetail().name}</h2>
                  <button onClick={() => setSelectedAgentId(null)} style={{border:'none', background:'none', fontSize:'20px', cursor:'pointer'}}>×</button>
              </div>
              
              <div style={{padding:'24px', flex:1, overflowY:'auto'}}>
                 {/* METRICS ROW */}
                 <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr', gap:'16px', marginBottom:'24px'}}>
                    <div style={{padding:'16px', backgroundColor:'#f8fafc', borderRadius:'8px', border:`1px solid ${THEME.border}`}}>
                        <div style={styles.label}>NET PROFIT</div>
                        <div style={{fontSize:'20px', fontWeight:'700', color: getAgentDetail().portfolioValue >= INITIAL_CASH ? THEME.success : THEME.danger}}>
                            {fmt(getAgentDetail().portfolioValue - INITIAL_CASH)}
                        </div>
                    </div>
                    
                    <div style={{padding:'16px', backgroundColor:'#f8fafc', borderRadius:'8px', border:`1px solid ${THEME.border}`}}>
                        <div style={styles.label}>BUY & HOLD BENCHMARK</div>
                        {(() => {
                            const bhVal = startPrice ? (INITIAL_CASH / startPrice) * btcPrice : INITIAL_CASH;
                            const diff = getAgentDetail().portfolioValue - bhVal;
                            return (
                                <div>
                                    <div style={{fontSize:'20px', fontWeight:'700', color:'#334155'}}>{fmt(bhVal)}</div>
                                    <div style={{fontSize:'11px', color: diff >= 0 ? THEME.success : THEME.danger}}>
                                        {diff > 0 ? `Beating B&H by ${fmt(diff)}` : `Losing to B&H by ${fmt(Math.abs(diff))}`}
                                    </div>
                                </div>
                            )
                        })()}
                    </div>

                    <div style={{padding:'16px', backgroundColor:'#f8fafc', borderRadius:'8px', border:`1px solid ${THEME.border}`}}>
                        <div style={styles.label}>UNREALIZED PnL</div>
                        <div style={{fontSize:'20px', fontWeight:'700'}}>
                            {fmt(getAgentDetail().shares * btcPrice)}
                        </div>
                        <div style={{fontSize:'11px', color:'#64748b'}}>Current Share Value</div>
                    </div>

                    <div style={{padding:'16px', backgroundColor:'#f8fafc', borderRadius:'8px', border:`1px solid ${THEME.border}`}}>
                        <div style={styles.label}>WIN RATE</div>
                        {(() => {
                            const wins = getAgentDetail().history.filter(h => h.pnl > 0).length;
                            const total = getAgentDetail().history.filter(h => h.type === 'SELL').length;
                            return (
                                <div style={{fontSize:'20px', fontWeight:'700', color: THEME.primary}}>
                                    {total > 0 ? ((wins/total)*100).toFixed(0) : 0}%
                                </div>
                            )
                        })()}
                    </div>
                 </div>

                 {/* MODEL WEIGHTS EXPORT */}
                 <div style={{marginBottom:'24px'}}>
                     <div style={styles.label}>MODEL WEIGHTS (COPY TO SAVE)</div>
                     <div style={{
                         padding:'12px', 
                         backgroundColor: '#0f172a', 
                         color:'#22d3ee', 
                         fontFamily:'monospace', 
                         borderRadius:'6px', 
                         fontSize:'11px', 
                         wordBreak:'break-all',
                         cursor:'pointer', 
                         position:'relative'
                     }}
                     onClick={(e) => {
                         navigator.clipboard.writeText(getAgentDetail().brain.exportWeights());
                         e.target.style.color = '#4ade80'; // flash green
                         setTimeout(() => e.target.style.color = '#22d3ee', 500);
                     }}
                     >
                         {getAgentDetail().brain.exportWeights()}
                         <div style={{position:'absolute', right:'10px', top:'10px', color:'white', opacity:0.5}}>CLICK TO COPY</div>
                     </div>
                 </div>

                 <div style={styles.label}>RECENT TRADE LOG</div>
                 <table style={{width:'100%', borderCollapse:'collapse', fontSize:'13px'}}>
                     <thead>
                         <tr style={{textAlign:'left', color:'#64748b', borderBottom:`1px solid ${THEME.border}`}}>
                             <th style={{padding:'8px'}}>Time</th>
                             <th style={{padding:'8px'}}>Type</th>
                             <th style={{padding:'8px'}}>Price</th>
                             <th style={{padding:'8px'}}>PnL</th>
                         </tr>
                     </thead>
                     <tbody>
                         {getAgentDetail().history.slice().reverse().map((h, i) => (
                             <tr key={i} style={{borderBottom:`1px solid ${THEME.border}`}}>
                                 <td style={{padding:'8px'}}>{h.date}</td>
                                 <td style={{padding:'8px', fontWeight:'bold', color: h.type === 'BUY' ? THEME.success : THEME.danger}}>{h.type}</td>
                                 <td style={{padding:'8px'}}>{fmt(h.price)}</td>
                                 <td style={{padding:'8px', color: h.pnl > 0 ? THEME.success : h.pnl < 0 ? THEME.danger : '#94a3b8'}}>{h.pnl !== 0 ? fmt(h.pnl) : '-'}</td>
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