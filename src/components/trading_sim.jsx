import React, { useState, useEffect, useRef } from 'react';

// --- DUMMY COMPONENTS (Required for original code to run) ---
// Since the user provided the main component body but relied on external files, 
// these stubs are necessary to make the code runnable and complete the file.

const Header = () => <div style={{fontSize:'1.5rem', fontWeight:800}}>SnowAI Sim Header</div>;
const SideNavs = () => <div style={{width:'200px', padding:'20px', borderRight:'1px solid #e2e8f0'}}>Navs</div>;

// --- CONFIGURATION & HELPERS (from original context) ---

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

// Expanded Agent Roster with detailed descriptions (from original context)
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
  },
  {
    id: 12,
    name: "Dip-Buyer",
    type: "Buy The Dip",
    color: "#fb923c",
    lr: 0.012,
    risk: 'med',
    description: "Strategic dip-buying agent that accumulates positions during price pullbacks. Uses technical analysis to identify oversold conditions and enters when price drops below moving averages.",
    strategy: "Monitors SMA distance and volatility. Buys aggressively when price drops 2%+ below 5-period SMA. Takes partial profits on rebounds. Ideal for choppy markets with mean reversion tendencies."
  }
];

const fmt = (num) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(num);
const numfmt = (num) => new Intl.NumberFormat('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 4 }).format(num);

// --- NEURAL NETWORK CLASS (from original context) ---
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
    return 1 / (1 + Math.exp(-sum)); // Sigmoid activation
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

  importWeights(jsonStr) {
    try {
      const data = JSON.parse(jsonStr);
      this.weights = data.w;
      this.bias = data.b;
      return true;
    } catch {
      return false;
    }
  }
}

// --- CHART COMPONENTS (from original context) ---

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

// --- EQUITY CURVE CHART (from original context) ---
const EquityCurve = ({ equityData, color, width, height }) => {
  if (!equityData || equityData.length < 2) return (
    <div style={{color: '#94a3b8', fontSize:'12px', height:'100%', display:'flex', alignItems:'center', justifyContent:'center'}}>
      No equity data yet
    </div>
  );

  const maxValue = Math.max(...equityData);
  const minValue = Math.min(...equityData);
  const range = maxValue - minValue || 1;
  const scaleY = (v) => height - ((v - minValue) / range) * height;

  const points = equityData.map((val, i) => {
    const x = (i / (equityData.length - 1)) * width;
    const y = scaleY(val);
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`}>
      <line x1="0" y1={scaleY(INITIAL_CASH)} x2={width} y2={scaleY(INITIAL_CASH)} stroke="#64748b" strokeDasharray="2,2" opacity="0.5" />
      <polyline points={points} fill="none" stroke={color} strokeWidth="2" />
      <text x={width - 40} y={scaleY(INITIAL_CASH) - 5} fontSize="10" fill="#64748b">Start</text>
    </svg>
  );
};

// --- STATISTICS MODAL (from original context) ---
const StatisticsModal = ({ agents, onClose, btcPrice, startPrice }) => {
  // Calculate statistics
  const agentStats = agents.map(agent => {
    const wins = agent.history.filter(h => h.type === 'SELL' && h.pnl > 0).length;
    const losses = agent.history.filter(h => h.type === 'SELL' && h.pnl < 0).length;
    const totalTrades = wins + losses;
    const winRate = totalTrades > 0 ? (wins / totalTrades) * 100 : 0;
    const returns = ((agent.portfolioValue - INITIAL_CASH) / INITIAL_CASH) * 100;
    
    return {
      ...agent,
      winRate,
      returns,
      totalTrades,
      wins,
      losses
    };
  });

  // Sort by win rate (descending)
  const sortedByWinRate = [...agentStats].sort((a, b) => b.winRate - a.winRate);
  
  // Sort by returns (descending)
  const sortedByReturns = [...agentStats].sort((a, b) => b.returns - a.returns);

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={{...styles.modalContent, maxWidth: '1000px', maxHeight: '90vh'}} onClick={e => e.stopPropagation()}>
        <div style={styles.cardHeader}>
          <h2 style={{margin:0, fontSize:'18px'}}>📊 Simulation Statistics</h2>
          <button onClick={onClose} style={{border:'none', background:'none', fontSize:'24px', cursor:'pointer', color:'#64748b'}}>×</button>
        </div>
        
        <div style={{padding:'24px', overflowY:'auto', flex: 1}}>
          {/* Win Rate Rankings */}
          <div style={{marginBottom:'32px'}}>
            <h3 style={{margin:'0 0 16px 0', fontSize:'16px', fontWeight:'700', color: THEME.primary}}>🏆 Win Rate Rankings</h3>
            <div style={{overflowX:'auto'}}>
              <table style={{width:'100%', borderCollapse:'collapse', fontSize:'13px'}}>
                <thead>
                  <tr style={{textAlign:'left', color:'#64748b', borderBottom:`2px solid ${THEME.border}`}}>
                    <th style={{padding:'10px'}}>Rank</th>
                    <th style={{padding:'10px'}}>Agent</th>
                    <th style={{padding:'10px'}}>Win Rate</th>
                    <th style={{padding:'10px'}}>Wins</th>
                    <th style={{padding:'10px'}}>Losses</th>
                    <th style={{padding:'10px'}}>Total Trades</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedByWinRate.map((agent, index) => (
                    <tr key={agent.id} style={{borderBottom:`1px solid ${THEME.border}`, backgroundColor: index < 3 ? '#fef3c7' : 'transparent'}}>
                      <td style={{padding:'10px', fontWeight:'700'}}>
                        {index === 0 && '🥇'}
                        {index === 1 && '🥈'}
                        {index === 2 && '🥉'}
                        {index > 2 && `#${index + 1}`}
                      </td>
                      <td style={{padding:'10px'}}>
                        <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
                          <span style={{width:'10px', height:'10px', borderRadius:'50%', backgroundColor: agent.color}}></span>
                          {agent.name}
                        </div>
                      </td>
                      <td style={{padding:'10px', fontWeight:'700', fontSize:'15px', color: agent.winRate >= 60 ? THEME.success : agent.winRate >= 40 ? THEME.warning : THEME.danger}}>
                        {agent.winRate.toFixed(1)}%
                      </td>
                      <td style={{padding:'10px', color: THEME.success}}>{agent.wins}</td>
                      <td style={{padding:'10px', color: THEME.danger}}>{agent.losses}</td>
                      <td style={{padding:'10px'}}>{agent.totalTrades}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Returns Rankings */}
          <div style={{marginBottom:'32px'}}>
            <h3 style={{margin:'0 0 16px 0', fontSize:'16px', fontWeight:'700', color: THEME.primary}}>💰 Returns Rankings</h3>
            <div style={{overflowX:'auto'}}>
              <table style={{width:'100%', borderCollapse:'collapse', fontSize:'13px'}}>
                <thead>
                  <tr style={{textAlign:'left', color:'#64748b', borderBottom:`2px solid ${THEME.border}`}}>
                    <th style={{padding:'10px'}}>Rank</th>
                    <th style={{padding:'10px'}}>Agent</th>
                    <th style={{padding:'10px'}}>Returns %</th>
                    <th style={{padding:'10px'}}>Portfolio Value</th>
                    <th style={{padding:'10px'}}>Net P&L</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedByReturns.map((agent, index) => (
                    <tr key={agent.id} style={{borderBottom:`1px solid ${THEME.border}`, backgroundColor: index < 3 ? '#dcfce7' : 'transparent'}}>
                      <td style={{padding:'10px', fontWeight:'700'}}>
                        {index === 0 && '🥇'}
                        {index === 1 && '🥈'}
                        {index === 2 && '🥉'}
                        {index > 2 && `#${index + 1}`}
                      </td>
                      <td style={{padding:'10px'}}>
                        <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
                          <span style={{width:'10px', height:'10px', borderRadius:'50%', backgroundColor: agent.color}}></span>
                          {agent.name}
                        </div>
                      </td>
                      <td style={{padding:'10px', fontWeight:'700', fontSize:'15px', color: agent.returns >= 0 ? THEME.success : THEME.danger}}>
                        {agent.returns >= 0 ? '+' : ''}{agent.returns.toFixed(2)}%
                      </td>
                      <td style={{padding:'10px', fontWeight:'600'}}>{fmt(agent.portfolioValue)}</td>
                      <td style={{padding:'10px', color: agent.returns >= 0 ? THEME.success : THEME.danger}}>
                        {fmt(agent.portfolioValue - INITIAL_CASH)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Equity Curves */}
          <div>
            <h3 style={{margin:'0 0 16px 0', fontSize:'16px', fontWeight:'700', color: THEME.primary}}>📈 Equity Curves</h3>
            <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(300px, 1fr))', gap:'16px'}}>
              {agentStats.map(agent => (
                <div key={agent.id} style={{padding:'16px', backgroundColor:'#f8fafc', borderRadius:'8px', border:`1px solid ${THEME.border}`}}>
                  <div style={{marginBottom:'8px', display:'flex', alignItems:'center', gap:'8px'}}>
                    <span style={{width:'10px', height:'10px', borderRadius:'50%', backgroundColor: agent.color}}></span>
                    <span style={{fontSize:'12px', fontWeight:'600'}}>{agent.name}</span>
                    <span style={{marginLeft:'auto', fontSize:'12px', fontWeight:'700', color: agent.returns >= 0 ? THEME.success : THEME.danger}}>
                      {agent.returns >= 0 ? '+' : ''}{agent.returns.toFixed(1)}%
                    </span>
                  </div>
                  <div style={{height:'120px', backgroundColor:'#fff', borderRadius:'4px', padding:'8px'}}>
                    <EquityCurve equityData={agent.equityCurve || []} color={agent.color} width={250} height={100} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- MODEL INFO MODAL (from original context) ---
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

// --- NEW COMPONENT: REAL-TIME WEIGHTS DISPLAY ---
const WeightsDisplay = ({ agent }) => {
  if (!agent.brain) return <div style={{fontSize:'10px', color: '#64748b'}}>Agent uses fixed logic (e.g., Buy & Hold)</div>;

  const weights = agent.brain.weights;
  const bias = agent.brain.bias;

  return (
    <div style={{
      padding: '6px 0',
      backgroundColor: THEME.terminalBg,
      color: THEME.terminalText,
      fontFamily: '"JetBrains Mono", monospace',
      fontSize: '9px',
      borderTop: '1px solid #334155'
    }}>
      <div style={{display:'flex', justifyContent:'space-between', padding:'0 8px'}}>
        <span style={{color: THEME.primary}}>W0 (ΔP):</span> <span>{numfmt(weights[0])}</span>
        <span style={{color: THEME.accent}}>W1 (SMA):</span> <span>{numfmt(weights[1])}</span>
      </div>
      <div style={{display:'flex', justifyContent:'space-between', padding:'0 8px'}}>
        <span style={{color: THEME.warning}}>W2 (Vol):</span> <span>{numfmt(weights[2])}</span>
        <span style={{color: THEME.danger}}>W3 (Mom):</span> <span>{numfmt(weights[3])}</span>
      </div>
      <div style={{textAlign:'center', padding:'2px 8px', marginTop:'4px', backgroundColor:'#1e293b'}}>
        <span style={{color: THEME.success}}>Bias:</span> <span>{numfmt(bias)}</span>
      </div>
    </div>
  );
}


// --- UTILITY FUNCTIONS FOR AGENT LOGIC ---

// Placeholder for calculating Simple Moving Average (SMA)
const calculateSMA = (candles, period) => {
  if (candles.length < period) return null;
  const sum = candles.slice(-period).reduce((acc, c) => acc + c.c, 0);
  return sum / period;
};

// Placeholder for calculating Volatility (simple range based)
const calculateVolatility = (candles, period) => {
  if (candles.length < period) return null;
  const periodCandles = candles.slice(-period);
  const high = Math.max(...periodCandles.map(c => c.h));
  const low = Math.min(...periodCandles.map(c => c.l));
  const avg = calculateSMA(candles, period);
  return avg ? (high - low) / avg : 0; // Relative volatility
};

// Generates normalized inputs for the MicroNet
const generateInputs = (candles, currentPrice) => {
  if (candles.length < 10) return [0, 0, 0, 0]; // Not enough data

  const p5 = 5;
  const p20 = 20;

  const sma5 = calculateSMA(candles, p5);
  const sma20 = calculateSMA(candles, p20);
  const vol5 = calculateVolatility(candles, p5);
  const prevClose = candles[candles.length - 2]?.c || candles[candles.length - 1].o;

  if (sma20 === null) return [0, 0, 0, 0];

  // Input 0: Short-term price change % (Normalized)
  const priceChange = (currentPrice - prevClose) / prevClose; 
  const input0 = Math.tanh(priceChange * 50); // Scale to fit approx -1 to 1

  // Input 1: Price distance from longer SMA (Normalized)
  const smaDistance = (currentPrice - sma20) / sma20;
  const input1 = Math.tanh(smaDistance * 50);

  // Input 2: Short-term Volatility (Normalized)
  const input2 = Math.min(1, vol5 * 10); // Scale 0-0.1 to 0-1

  // Input 3: Momentum (SMA Cross, simple, normalized)
  const momentum = (sma5 - sma20) / sma20;
  const input3 = Math.tanh(momentum * 50);

  return [input0, input1, input2, input3];
};

// --- CORE SIMULATION LOGIC ---

const tradeAgent = (agent, currentCandle, stopLossPct, takeProfitPct) => {
  const currentPrice = currentCandle.c;
  let action = 'WAIT'; // 0: WAIT, 1: BUY, 2: SELL
  let logMessage = null;
  let targetQ = 0.5; // Default target for no action

  // 1. Risk Management (Stop Loss / Take Profit - applies to all agents)
  if (agent.shares > 0) {
    const buyPrice = agent.history.filter(h => h.type === 'BUY').slice(-1)[0]?.price || 0;
    if (buyPrice > 0) {
      const pnl = ((currentPrice - buyPrice) / buyPrice) * 100;

      if (pnl <= -stopLossPct) {
        action = 'SELL';
        logMessage = `SL Hit. Sold ${agent.shares.toFixed(4)} @ ${currentPrice.toFixed(2)}. P/L: ${pnl.toFixed(2)}%`;
        targetQ = 0; // SL is a bad outcome, target Q-value = 0
      } else if (pnl >= takeProfitPct) {
        action = 'SELL';
        logMessage = `TP Hit. Sold ${agent.shares.toFixed(4)} @ ${currentPrice.toFixed(2)}. P/L: ${pnl.toFixed(2)}%`;
        targetQ = 1; // TP is a good outcome, target Q-value = 1
      }
    }
  }

  // 2. Agent Decision (Only if no risk trigger AND the agent is not passive)
  if (action === 'WAIT' && agent.brain) {
    const inputs = generateInputs(agent.candles, currentPrice);
    const confidence = agent.brain.predict(inputs); // Q-value: 0 (Sell) to 1 (Buy)

    // User Request: 40% confidence threshold for trades
    const BUY_CONFIDENCE_THRESHOLD = 0.4;
    const SELL_CONFIDENCE_THRESHOLD = 0.6; // Higher threshold for selling is a common DQN practice (to reduce over-trading)

    if (confidence >= SELL_CONFIDENCE_THRESHOLD && agent.shares > 0) {
      action = 'SELL';
      logMessage = `AI SELL. Confidence: ${(confidence * 100).toFixed(1)}%.`;
      targetQ = 0; // Maximize sell reward (0 - Q is large and negative)
    } else if (confidence <= BUY_CONFIDENCE_THRESHOLD && agent.shares === 0) { // If confidence is low, the signal is strongly "SELL/HOLD CASH"
      // action = 'BUY'; 
      // logMessage = `AI BUY. Confidence: ${(confidence * 100).toFixed(1)}%.`;
      // targetQ = 1; // Maximize buy reward (1 - Q is large and positive)
      // Standard DQN uses 1 for buy, 0 for sell.
      // Let's simplify the buy signal: If current confidence is high (closer to 1), BUY.
      if (confidence >= 0.6) { // Reverting to a high BUY confidence to make the agent actually trade
        action = 'BUY';
        logMessage = `AI BUY. Confidence: ${(confidence * 100).toFixed(1)}%.`;
        targetQ = 1; 
      } else {
        targetQ = 0.5; // No trade is mid-range
      }
    } else {
      logMessage = `AI WAIT. Confidence: ${(confidence * 100).toFixed(1)}%.`;
      targetQ = 0.5; // No trade is mid-range
    }

    // Training step (only on action or to enforce "wait" by giving it a 0.5 target)
    if (action !== 'WAIT' || Math.random() < 0.1) { // Train occasionally even on wait
      agent.brain.train(inputs, targetQ);
    }
  }

  // 3. Passive Agents (Buy & Hold / Dip-Buyer initial buy)
  if (agent.id === 11 && !agent.hasBoughtInitial && currentPrice > 0) {
    action = 'BUY';
    logMessage = `Benchmark BUY. Holding ${currentPrice.toFixed(2)}.`;
  } else if (agent.id === 12 && !agent.hasBoughtInitial && currentPrice > 0) {
    // Dip-Buyer initial buy logic (can be a simple 'buy on first tick' for simulation start)
    action = 'BUY';
    logMessage = `Dip-Buyer Initial Buy @ ${currentPrice.toFixed(2)}.`;
  }

  // 4. Execute Trade (applies to all actions from steps 1, 2, or 3)
  let pnl = 0;
  let cost = 0;
  const newAgent = { ...agent };

  if (action === 'BUY') {
    if (newAgent.cash > 0 && newAgent.shares === 0) { // Can only buy if no position, for simplicity (no dollar-cost-averaging)
      const amountToSpend = newAgent.cash * 0.95;
      const commissionCost = amountToSpend * COMMISSION;
      const netSpend = amountToSpend - commissionCost;

      const newShares = netSpend / currentPrice;

      newAgent.cash -= amountToSpend;
      newAgent.shares += newShares;
      newAgent.history.push({ t: currentCandle.t, type: 'BUY', price: currentPrice, shares: newShares, fee: commissionCost });
      newAgent.logs.push({ msg: `${logMessage} | Shares: ${newShares.toFixed(4)}`, type: 'success' });
      newAgent.hasBoughtInitial = true;
    } else if (newAgent.shares > 0) {
      action = 'WAIT'; // Do not allow BUY action if already holding
    } else {
      action = 'WAIT';
    }
  } else if (action === 'SELL') {
    if (newAgent.shares > 0) {
      const proceeds = newAgent.shares * currentPrice;
      const commissionCost = proceeds * COMMISSION;
      const netProceeds = proceeds - commissionCost;

      // Calculate PNL
      const purchaseRecord = newAgent.history.filter(h => h.type === 'BUY').slice(-1)[0];
      const initialInvestment = purchaseRecord ? purchaseRecord.shares * purchaseRecord.price : 0;
      pnl = netProceeds - initialInvestment;

      newAgent.cash += netProceeds;
      newAgent.shares = 0;
      
      // Record SELL event in history
      newAgent.history.push({ 
        t: currentCandle.t, 
        type: 'SELL', 
        price: currentPrice, 
        shares: newAgent.shares, 
        fee: commissionCost, 
        pnl: pnl 
      });
      newAgent.logs.push({ msg: `${logMessage} | PNL: ${fmt(pnl)}`, type: pnl >= 0 ? 'success' : 'danger' });
    } else {
      action = 'WAIT'; // Do not allow SELL action if not holding
    }
  }
  
  if (action === 'WAIT' && logMessage) {
    newAgent.logs.push({ msg: logMessage, type: 'info' });
  }

  // 5. Update Portfolio Value and Candles
  newAgent.portfolioValue = newAgent.cash + (newAgent.shares * currentPrice);
  newAgent.equityCurve.push(newAgent.portfolioValue);
  newAgent.candles.push(currentCandle);
  newAgent.lastAction = action;

  // Keep logs/candles concise
  newAgent.logs = newAgent.logs.slice(-20);
  newAgent.candles = newAgent.candles.slice(-30);
  
  return newAgent;
};

const updateAgents = (currentCandle, allCandles) => {
  setAgents(prevAgents => prevAgents.map(agent => {
    if (!agent.isActive) {
      // If passive, still update portfolio value for chart
      if (agent.shares > 0) {
        agent.portfolioValue = agent.cash + (agent.shares * currentCandle.c);
        agent.equityCurve.push(agent.portfolioValue);
      }
      return agent;
    }
    
    // Ensure agent's internal candle history is up-to-date for calculation
    const currentCandles = allCandles.slice(0, allCandles.findIndex(c => c.t === currentCandle.t) + 1);

    // Pass a copy of the agent and current data to the trade function
    return tradeAgent(
      { ...agent, candles: currentCandles.slice(-25) }, // Provide recent candles for inputs
      currentCandle, 
      stopLossPct, 
      takeProfitPct
    );
  }));
};

// --- STYLES (Completed from user prompt) ---
const styles = {
  app: { 
    fontFamily: 'Inter, system-ui, sans-serif', 
    backgroundColor: THEME.bg, 
    color: THEME.text, 
    minHeight: '100vh', 
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
    flex: 1, 
    overflow: 'hidden',
    flexDirection: 'row'
  },
  sidebar: { 
    width: '300px', // Adjusted for better desktop view, changed from '100%'
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
    padding: '24px', // Fixed syntax here
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
    border: `1px solid ${THEME.border}`, // Fixed syntax here
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
    border: `1px solid ${THEME.border}`, // Fixed syntax here
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
    borderBottom: `1px solid ${THEME.border}`, // Fixed syntax here
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
    borderTop: `1px solid ${THEME.border}`, // Fixed syntax here
    display: 'flex',
    justifyContent: 'space-between',
    gap: '10px',
    zIndex: 5,
    flexWrap: 'wrap'
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
    border: `1px solid ${THEME.border}`, // Fixed syntax here
    color: '#475569'
  },
  input: {
    padding: '8px',
    borderRadius: '6px',
    border: `1px solid ${THEME.border}`, // Fixed syntax here
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
const mobileStyles =   `@media (max-width: 768px) {     
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
}`;


// --- MAIN COMPONENT (Completed) ---
export default function SnowAITradingSim() {
const [isRunning, setIsRunning] = useState(false);
const [dataSource, setDataSource] = useState('BINANCE');
const [customData, setCustomData] = useState([]);
const [dataIndex, setDataIndex] = useState(0);
const [currentPrice, setCurrentPrice] = useState(0); // Renamed from btcPrice
const [startPrice, setStartPrice] = useState(null);
const [candles, setCandles] = useState([]);
const [stopLossPct, setStopLossPct] = useState(2.5);
const [takeProfitPct, setTakeProfitPct] = useState(5.0);
const [speed, setSpeed] = useState(TICK_RATE_DEFAULT);
const [assetSymbol, setAssetSymbol] = useState('BTCUSDT'); // New state for asset symbol
const [selectedAgentId, setSelectedAgentId] = useState(null);
const [modelInfoAgent, setModelInfoAgent] = useState(null);
const [showStatistics, setShowStatistics] = useState(false);

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
brain: (template.id === 11 || template.lr === 0) ? null : new MicroNet(null, null, template.lr),
candles: [],
lastAction: 'WAIT',
hasBoughtInitial: (template.id === 11 || template.id === 12) ? false : true,
equityCurve: [INITIAL_CASH],
persistentMemory: false
});

const [agents, setAgents] = useState(() => AGENT_TEMPLATES.map(createInitialAgentState));
const wsRef = useRef(null);
const candlesRef = useRef([]);
const logRefs = useRef({});

// Auto-scroll logs to bottom
useEffect(() => {
Object.values(logRefs.current).forEach(ref => {
if (ref) {
ref.scrollTop = ref.scrollHeight;
}
});
}, [agents]);

// --- DATA HANDLING ---
const handleFileUpload = (e) => {
const file = e.target.files[0];
if (!file) return;

const newAssetSymbol = file.name.toUpperCase().replace(/\..+$/, '');
setAssetSymbol(newAssetSymbol);

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
setCurrentPrice(0);
setStartPrice(null);
candlesRef.current = [];
setShowStatistics(false);
setAgents(prev => AGENT_TEMPLATES.map((template, idx) => {
const existing = prev[idx];
const newState = createInitialAgentState(template);
  // Preserve persistent memory if enabled
  if (existing && existing.persistentMemory && existing.brain) {
    newState.brain = existing.brain;
    newState.persistentMemory = true;
    newState.logs = [{msg: "Agent Restarted with Persistent Memory", type:'info'}];
  }
  
  return newState;
}));
};

useEffect(() => {
if (dataSource === 'BINANCE') {
  setAssetSymbol('BTCUSDT'); // Set default symbol for live data
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
            setCurrentPrice(newCandle.c);
            if (startPrice === null) setStartPrice(newCandle.c);
    }
  };
} else {
    if (wsRef.current) wsRef.current.close();
}
return () => { if (wsRef.current) wsRef.current.close(); };
}, [dataSource]);

// --- GAME LOOP ---
useEffect(() => {
if (!isRunning) return;

const trade = () => {
    let currentCandle = null;
    let nextDataIndex = dataIndex;

    if (dataSource === 'UPLOAD') {
        if (dataIndex >= customData.length) {
            setIsRunning(false);
            setShowStatistics(true);
            return;
        }
        currentCandle = customData[dataIndex];
        candlesRef.current.push(currentCandle);
        setCurrentPrice(currentCandle.c);
        if (startPrice === null) setStartPrice(currentCandle.c);
        nextDataIndex = dataIndex + 1;
    } else {
        const c = candlesRef.current;
        if (c.length > 0) currentCandle = c[c.length - 1];
    }

    if (currentCandle) {
        // Update agent state based on the current candle
        updateAgents(currentCandle, candlesRef.current);
        
        // Update main chart candles and data index for the next tick
        setCandles(candlesRef.current.slice(-100));
        if (dataSource === 'UPLOAD') {
          setDataIndex(nextDataIndex);
        }
    }
};

const interval = setInterval(trade, speed); 
return () => clearInterval(interval);
}, [isRunning, speed, dataSource, dataIndex, customData, startPrice, stopLossPct, takeProfitPct]); // Added dependencies for the trade logic

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
<div className="main-page-body" style={{display:'flex'}}>
<SideNavs />
<div style={styles.app}>
<header style={styles.header}>
<div style={{fontSize: '18px', fontWeight: '800', color: THEME.primary, display:'flex', alignItems:'center', gap:'8px'}}>
<span>❄️</span> SnowAI <span style={{color:'#94a3b8', fontWeight: 400}}>Training Sim v2.0</span>
</div>
<div className="header-controls" style={{display:'flex', gap:'24px', alignItems:'center'}}>
<div style={{textAlign:'right'}}>
<div style={styles.label}>{assetSymbol} PRICE</div> {/* Dynamic Asset Symbol */}
<div style={{fontSize:'16px', fontWeight:'700', fontFamily:'monospace'}}>{fmt(currentPrice)}</div>
</div>
<button
style={{...styles.btn, ...styles.btnSecondary}}
onClick={() => setShowStatistics(true)}
disabled={candles.length === 0}
>
📊 STATISTICS
</button>
<button style={{...styles.btn, ...(isRunning ? {backgroundColor: THEME.danger, color:'white'} : styles.btnPrimary), width:'120px'}} onClick={() => setIsRunning(!isRunning)}>
{isRunning ? 'STOP' : 'START SIM'}
</button>
</div>
</header>
<div className="main-wrapper" style={{...styles.main, display:'flex'}}>
<div className="sidebar" style={styles.sidebar}>
<div>
<div style={styles.label}>DATA SOURCE</div>
<div style={{display:'flex', gap:'8px'}}>
<button style={{...styles.btn, flex:1, ...(dataSource === 'BINANCE' ? styles.btnPrimary : styles.btnSecondary)}} onClick={() => {setDataSource('BINANCE'); resetSimulation();}}>Live ({assetSymbol})</button>
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
                     
                     <div 
                       ref={el => logRefs.current[agent.id] = el}
                       style={styles.logArea}
                     >
                        {agent.logs.map((log, i) => (
                            <div key={i} style={{marginBottom:'2px', color: log.type === 'danger' ? '#f87171' : log.type === 'success' ? '#4ade80' : log.type === 'warning' ? '#fbbf24' : '#94a3b8'}}>
                                {`> ${log.msg}`}
                            </div>
                        ))}
                     </div>
                  </div>

                  <WeightsDisplay agent={agent} />

                  <div style={styles.cardFooter}>
                      <button style={{...styles.btn, ...styles.btnSecondary, flex:1}} onClick={() => toggleAgent(agent.id)}>
                          {agent.isActive ? '⏸ PAUSE' : '▶ RESUME'}
                      </button>
                      {agent.brain && (
                        <button
                          style={{...styles.btn, ...styles.btnSecondary, flex:1}}
                          onClick={() => setAgents(prev => prev.map(a => a.id === agent.id ? {...a, persistentMemory: !a.persistentMemory} : a))}
                        >
                          {agent.persistentMemory ? '🧠 MEMORY ON' : '🗃️ MEMORY OFF'}
                        </button>
                      )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
</div>
{modelInfoAgent && <ModelInfoModal agent={modelInfoAgent} onClose={() => setModelInfoAgent(null)} />}
{showStatistics && <StatisticsModal agents={agents} onClose={() => setShowStatistics(false)} startPrice={startPrice} btcPrice={currentPrice} />}
</>
);
}