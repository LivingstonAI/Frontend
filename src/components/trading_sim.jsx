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

// Expanded Agent Roster with detailed descriptions
const AGENT_TEMPLATES = [
  { 
    id: 1, 
    name: "Snow-Alpha", 
    type: "Balanced (DQN)", 
    color: "#3b82f6", 
    lr: 0.01, 
    risk: 'med',
    description: "A balanced Deep Q-Network agent that uses moderate learning rates and medium-risk tolerance. Analyzes price changes, SMA distance, and volatility to make informed trading decisions. Best for steady market conditions.",
    strategy: "Uses sigmoid activation with 4-input neural network. Buys when confidence > 65%, sells when < 35%. Applies 95% of cash per trade."
  },
  { 
    id: 2, 
    name: "Ice-Beta", 
    type: "Scalper (Fast)", 
    color: "#0ea5e9", 
    lr: 0.05, 
    risk: 'high',
    description: "High-frequency scalping agent with rapid learning rate (0.05). Designed to capitalize on small price movements with quick entries and exits. Thrives in volatile markets with frequent micro-trends.",
    strategy: "Aggressive learning rate allows quick adaptation. Takes many small positions, ideal for sideways or choppy markets. High risk, high reward approach."
  },
  { 
    id: 3, 
    name: "Frost-Gamma", 
    type: "Trend (Slow)", 
    color: "#6366f1", 
    lr: 0.001, 
    risk: 'low',
    description: "Conservative trend-following agent with minimal learning rate. Waits for strong, confirmed trends before entering positions. Low-risk approach suitable for long-term holds and stable growth.",
    strategy: "Patient strategy with slow weight updates. Filters out noise and focuses on macro trends. Lower trade frequency but higher accuracy on direction."
  },
  { 
    id: 4, 
    name: "Glacier-X", 
    type: "Deep-Hold", 
    color: "#8b5cf6", 
    lr: 0.005, 
    risk: 'med',
    description: "Position trader that seeks extended hold periods. Moderate learning rate balances adaptation with stability. Focuses on capturing larger price swings rather than day-to-day noise.",
    strategy: "Medium-term holds with balanced risk management. Aims for fewer but more substantial gains. Works well in trending markets."
  },
  { 
    id: 5, 
    name: "Avalanche-Z", 
    type: "Aggressive", 
    color: "#f43f5e", 
    lr: 0.08, 
    risk: 'high',
    description: "Ultra-aggressive agent with the highest learning rate (0.08). Rapidly adapts to market changes and takes bold positions. High volatility tolerance makes it suitable for extreme market conditions.",
    strategy: "Extremely fast learning with high sensitivity to recent data. Can generate significant gains or losses quickly. Best for experienced users monitoring closely."
  },
  { 
    id: 6, 
    name: "Polar-Prime", 
    type: "Conservative", 
    color: "#10b981", 
    lr: 0.0005, 
    risk: 'low',
    description: "Ultra-conservative agent with the lowest learning rate. Prioritizes capital preservation over aggressive gains. Ideal for risk-averse strategies and bear market protection.",
    strategy: "Very slow adaptation minimizes overreaction to noise. Focuses on high-confidence setups only. Suitable for portfolio stability and drawdown minimization."
  },
  { 
    id: 7, 
    name: "Blizzard-Omega", 
    type: "Momentum", 
    color: "#ec4899", 
    lr: 0.02, 
    risk: 'high',
    description: "Momentum-based agent that detects and rides strong price movements. Uses moderate-high learning rate to quickly identify momentum shifts and capitalize on breakouts.",
    strategy: "Optimized for detecting acceleration in price movement. Enters positions during strong momentum and exits when momentum fades. Performs well in trending markets."
  },
  { 
    id: 8, 
    name: "Tundra-Sigma", 
    type: "Mean Reversion", 
    color: "#14b8a6", 
    lr: 0.015, 
    risk: 'med',
    description: "Mean reversion specialist that profits from price overshoots. Identifies when price deviates significantly from moving average and trades the snap-back.",
    strategy: "Focuses on SMA distance input. Buys when price drops below SMA, sells when above. Works best in range-bound markets with clear support/resistance."
  },
  { 
    id: 9, 
    name: "Arctic-Delta", 
    type: "Volatility Hunter", 
    color: "#f97316", 
    lr: 0.03, 
    risk: 'high',
    description: "Volatility-focused agent that thrives in chaotic market conditions. Uses higher learning rate to adapt to rapid volatility changes and exploit uncertainty.",
    strategy: "Heavily weighs volatility input in decision making. Increases position sizing during high volatility. Designed for breakout and breakdown scenarios."
  },
  { 
    id: 10, 
    name: "Permafrost-Theta", 
    type: "Anti-Trend", 
    color: "#a855f7", 
    lr: 0.008, 
    risk: 'med',
    description: "Contrarian agent that fades trends and looks for reversals. Inverted logic compared to trend followers - sells strength, buys weakness.",
    strategy: "Counter-intuitive approach that profits from trend exhaustion. Best in markets with frequent reversals and false breakouts. Requires strong risk management."
  },
  {
    id: 11,
    name: "Buy & Hold",
    type: "Benchmark",
    color: "#64748b",
    lr: 0,
    risk: 'passive',
    description: "Pure buy-and-hold strategy that purchases at market start and never sells. Serves as a passive benchmark to measure active strategies against. No AI involved - simply holds position through all market conditions.",
    strategy: "Buys maximum position on first tick with available capital and holds indefinitely. Zero trading after initial purchase. Represents market beta exposure."
  }
];

const fmt = (num) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(num);

// --- NEURAL NETWORK CLASS ---
class MicroNet {
  constructor(weights = null, bias = null, learningRate = 0.01) {
    this.weights = weights || [Math.random()-0.5, Math.random()-0.5, Math.random()-0.5, Math.random()-0.5]; 
    this.bias = bias !== null ? bias : Math.random()-0.5;
    this.learningRate = learningRate;
  }

  predict(inputs) {
    let sum = this.bias;
    for (let i = 0; i < inputs.length; i++) {
      sum += inputs[i] * this.weights[i];
    }
    return 1 / (1 + Math.exp(-sum));
  }

  train(inputs, target) {
    const prediction = this.predict(inputs);
    const error = target - prediction;
    
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

      {agents.filter(a => a.isActive && a.id !== 11).map(agent => (
        agent.history.slice(-10).map((t, i) => {
          const globalIndex = data.findIndex(d => d.t === t.t);
          if (globalIndex === -1 || globalIndex < data.length - 100) return null;
          
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

// --- MODEL INFO MODAL ---
const ModelInfoModal = ({ agent, onClose }) => {
  if (!agent) return null;
  
  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={{...styles.modalContent, maxWidth: '600px'}} onClick={e => e.stopPropagation()}>
        <div style={styles.cardHeader}>
          <div>
            <h2 style={{margin:0, fontSize:'18px', display:'flex', alignItems:'center', gap:'8px'}}>
              <span style={{width:'12px', height:'12px', borderRadius:'50%', backgroundColor: agent.color}}></span>
              {agent.name}
            </h2>
            <div style={{fontSize:'12px', color: agent.color, marginTop:'4px'}}>{agent.type}</div>
          </div>
          <button onClick={onClose} style={{border:'none', background:'none', fontSize:'24px', cursor:'pointer', color:'#64748b'}}>×</button>
        </div>
        
        <div style={{padding:'24px', overflowY:'auto'}}>
          <div style={{marginBottom:'20px'}}>
            <div style={{...styles.label, marginBottom:'8px'}}>DESCRIPTION</div>
            <p style={{margin:0, lineHeight:'1.6', color:'#475569'}}>{agent.description}</p>
          </div>
          
          <div style={{marginBottom:'20px'}}>
            <div style={{...styles.label, marginBottom:'8px'}}>STRATEGY DETAILS</div>
            <p style={{margin:0, lineHeight:'1.6', color:'#475569'}}>{agent.strategy}</p>
          </div>
          
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px', marginBottom:'20px'}}>
            <div style={{padding:'12px', backgroundColor:'#f8fafc', borderRadius:'8px', border:`1px solid ${THEME.border}`}}>
              <div style={styles.label}>LEARNING RATE</div>
              <div style={{fontSize:'18px', fontWeight:'700', color: THEME.primary}}>{agent.lr}</div>
              <div style={{fontSize:'10px', color:'#64748b', marginTop:'4px'}}>
                {agent.lr >= 0.05 ? 'Very Fast' : agent.lr >= 0.01 ? 'Fast' : agent.lr >= 0.005 ? 'Moderate' : agent.lr > 0 ? 'Slow' : 'N/A'}
              </div>
            </div>
            
            <div style={{padding:'12px', backgroundColor:'#f8fafc', borderRadius:'8px', border:`1px solid ${THEME.border}`}}>
              <div style={styles.label}>RISK PROFILE</div>
              <div style={{fontSize:'18px', fontWeight:'700', color: agent.risk === 'high' ? THEME.danger : agent.risk === 'med' ? THEME.warning : agent.risk === 'passive' ? '#64748b' : THEME.success}}>
                {agent.risk === 'high' ? 'HIGH' : agent.risk === 'med' ? 'MEDIUM' : agent.risk === 'passive' ? 'PASSIVE' : 'LOW'}
              </div>
            </div>
          </div>
          
          <div style={{padding:'16px', backgroundColor:'#fef3c7', borderRadius:'8px', border:'1px solid #fbbf24'}}>
            <div style={{fontSize:'12px', fontWeight:'600', color:'#92400e', marginBottom:'8px'}}>⚠️ RECOMMENDED USE CASES</div>
            <ul style={{margin:0, paddingLeft:'20px', color:'#78350f', fontSize:'12px', lineHeight:'1.6'}}>
              {agent.risk === 'high' && <li>High volatility markets</li>}
              {agent.risk === 'high' && <li>Short timeframes (1-5 min)</li>}
              {agent.risk === 'high' && <li>Active monitoring required</li>}
              {agent.risk === 'med' && <li>Balanced market conditions</li>}
              {agent.risk === 'med' && <li>Medium timeframes (5-30 min)</li>}
              {agent.risk === 'med' && <li>Moderate oversight needed</li>}
              {agent.risk === 'low' && <li>Stable trending markets</li>}
              {agent.risk === 'low' && <li>Long timeframes (30+ min)</li>}
              {agent.risk === 'low' && <li>Minimal intervention</li>}
              {agent.risk === 'passive' && <li>Long-term holding</li>}
              {agent.risk === 'passive' && <li>Benchmark comparison</li>}
              {agent.risk === 'passive' && <li>Zero maintenance</li>}
            </ul>
          </div>
        </div>
      </div>
    </div>
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
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '12px'
  },
  main: { 
    display: 'flex', 
    flex: 1, 
    overflow: 'hidden',
    flexDirection: 'row'
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
  
  card: { 
    backgroundColor: '#fff', 
    borderRadius: '12px', 
    border: `1px solid ${THEME.border}`, 
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', 
    display: 'flex', 
    flexDirection: 'column', 
    height: '420px',
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
    overflow: 'hidden',
    minHeight: 0
  },
  logArea: { 
    flex: 1, 
    overflowY: 'auto', 
    display: 'flex', 
    flexDirection: 'column', 
    justifyContent: 'flex-start',
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

const mobileStyles = `
  @media (max-width: 768px) {
    .main-wrapper {
      flex-direction: column !important;
    }
    .sidebar {
      width: 100% !important;
      border-right: none !important;
      border-bottom: 1px solid #e2e8f0 !important;
      max-height: 300px;
    }
    .agent-grid {
      grid-template-columns: 1fr !important;
    }
    .header-controls {
      width: 100%;
      justify-content: space-between;
    }
    .modal-content {
      width: 95% !important;
      max-height: 90vh !important;
    }
  }
`;

// --- MAIN COMPONENT ---

export default function SnowAITradingSim() {
  const [isRunning, setIsRunning] = useState(false);
  const [dataSource, setDataSource] = useState('BINANCE');
  const [customData, setCustomData] = useState([]);
  const [dataIndex, setDataIndex] = useState(0);
  
  const [btcPrice, setBtcPrice] = useState(0);
  const [startPrice, setStartPrice] = useState(null);
  const [candles, setCandles] = useState([]);
  
  const [stopLossPct, setStopLossPct] = useState(2.5);
  const [takeProfitPct, setTakeProfitPct] = useState(5.0);
  const [speed, setSpeed] = useState(TICK_RATE_DEFAULT);
  
  const [selectedAgentId, setSelectedAgentId] = useState(null);
  const [modelInfoAgent, setModelInfoAgent] = useState(null);

  const createInitialAgentState = (template) => ({
    ...template,
    isActive: true,
    cash: INITIAL_CASH,
    shares: 0,
    portfolioValue: INITIAL_CASH,
    prevValue: INITIAL_CASH,
    history: [], 
    logs: [{msg: "Agent Activated. Monitoring markets...", type:'info'}],
    loss: 0,
    brain: template.id === 11 ? null : new MicroNet(null, null, template.lr),
    candles: [],
    lastAction: 'WAIT',
    hasBoughtInitial: template.id === 11 ? false : true
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

  // --- AGENT LOGIC ---
  const updateAgents = (priceData, history) => {
    setAgents(prev => prev.map(agent => {
      if (!agent.isActive) return agent;

      // Buy & Hold Logic
      if (agent.id === 11) {
        if (!agent.hasBoughtInitial && priceData.c > 0) {
          const amt = (INITIAL_CASH * 0.999) / priceData.c;
          const newShares = amt;
          const newCash = INITIAL_CASH - (amt * priceData.c * (1 + COMMISSION));
          const currentVal = newCash + (newShares * priceData.c);
          
          return {
            ...agent,
            hasBoughtInitial: true,
            cash: newCash,
            shares: newShares,
            portfolioValue: currentVal,
            prevValue: currentVal,
            history: [{ date: new Date().toLocaleTimeString(), t: priceData.t, type: 'BUY', price: priceData.c, pnl: 0 }],
            logs: [{msg: "Agent Activated. Monitoring markets...", type:'info'}, {msg: `BUY @ ${fmt(priceData.c)} - HOLDING FOREVER`, type: 'success'}],
            candles: history.slice(-30)
          };
        } else {
          const currentVal = agent.cash + (agent.shares * priceData.c);
          return {
            ...agent,
            portfolioValue: currentVal,
            candles: history.slice(-30)
          };
        }
      }

      // Regular AI Agent Logic
      const len = history.length;
      if (len < 5) return agent;
      const currentPrice = priceData.c;
      const prevCandle = history[len - 2] || priceData;
      
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

      if (agent.shares > 0) {
          const entryTrade = agent.history.findLast(h => h.type === 'BUY');
          const entryPrice = entryTrade?.price || currentPrice;
          const currentPnlPct = ((currentPrice - entryPrice) / entryPrice) * 100;

          if (currentPnlPct <= -stopLossPct) action = "SL_TRIGGER";
          else if (currentPnlPct >= takeProfitPct) action = "TP_TRIGGER";
      }

      if (action === "HOLD") {
          if (prediction > 0.5 && newCash > currentPrice * 0.01 && newShares === 0) action = "BUY";
          else if (prediction < 0.35 && newShares > 0) action = "SELL";
      }

      if (action === "BUY" && newCash > 0) {
          const amt = (newCash * 0.95) / currentPrice;
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

    }, speed); return () => clearInterval(interval);
} , [isRunning, speed, dataSource, dataIndex, customData, startPrice, stopLossPct, takeProfitPct]); // Added dependencies

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
    <>
      <style>{mobileStyles}</style>
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
              <div className="header-controls" style={{display:'flex', gap:'24px', alignItems:'center'}}>
                <div style={{textAlign:'right'}}>
                  <div style={styles.label}>BTC PRICE</div>
                  <div style={{fontSize:'16px', fontWeight:'700', fontFamily:'monospace'}}>{fmt(btcPrice)}</div>
                </div>
                <button style={{...styles.btn, ...(isRunning ? {backgroundColor: THEME.danger, color:'white'} : styles.btnPrimary), width:'120px'}} onClick={() => setIsRunning(!isRunning)}>
                  {isRunning ? 'STOP' : 'START SIM'}
                </button>
              </div>
            </header>
            <div className="main-wrapper" style={styles.main}>
              <div className="sidebar" style={styles.sidebar}>
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
                        <span style={{flex:1, cursor:'pointer'}} onClick={() => setModelInfoAgent(a)} title="Click for details">{a.name}</span>
                        <span style={{color: a.portfolioValue >= INITIAL_CASH ? THEME.success : THEME.danger}}>{((a.portfolioValue - INITIAL_CASH)/INITIAL_CASH*100).toFixed(1)}%</span>
                      </div>
                  ))}
                </div>
              </div>

              <div style={styles.contentArea}>
                <div style={styles.chartContainer}>
                    <MainCandleChart data={candles} agents={agents} width={800} height={300} />
                </div>

                <div className="agent-grid" style={styles.agentGrid}>
                  {agents.map(agent => (
                    <div key={agent.id} style={{...styles.card, opacity: agent.isActive ? 1 : 0.85}}>
                      <div style={styles.cardHeader}>
                         <div>
                             <div style={{fontWeight:'700', fontSize:'14px', display:'flex', alignItems:'center', gap:'8px'}}>
                               {agent.name}
                               <button 
                                 onClick={() => setModelInfoAgent(agent)}
                                 style={{border:'none', background:'none', cursor:'pointer', fontSize:'14px', padding:'0', color:'#64748b'}}
                                 title="Model Info"
                                >
                                  ℹ️
                               </button>
                             </div>
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

            {/* MODEL INFO MODAL */}
            {modelInfoAgent && (
              <ModelInfoModal agent={modelInfoAgent} onClose={() => setModelInfoAgent(null)} />
            )}

            {/* ANALYSIS MODAL */}
            {selectedAgentId && (
              <div style={styles.modalOverlay} onClick={() => setSelectedAgentId(null)}>
                 <div className="modal-content" style={styles.modalContent} onClick={e => e.stopPropagation()}>
                    <div style={styles.cardHeader}>
                        <h2 style={{margin:0, fontSize:'18px'}}>🧠 Neural Analysis: {getAgentDetail().name}</h2>
                        <button onClick={() => setSelectedAgentId(null)} style={{border:'none', background:'none', fontSize:'20px', cursor:'pointer'}}>×</button>
                    </div>
                    
                    <div style={{padding:'24px', flex:1, overflowY:'auto'}}>
                       <div style={{display:'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap:'16px', marginBottom:'24px'}}>
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

                       {getAgentDetail().brain && (
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
                                 e.target.style.color = '#4ade80';
                                 setTimeout(() => e.target.style.color = '#22d3ee', 500);
                             }}
                             >
                                 {getAgentDetail().brain.exportWeights()}
                                 <div style={{position:'absolute', right:'10px', top:'10px', color:'white', opacity:0.5}}>CLICK TO COPY</div>
                             </div>
                         </div>
                       )}

                       <div style={styles.label}>RECENT TRADE LOG</div>
                       <div style={{overflowX:'auto'}}>
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
               </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}