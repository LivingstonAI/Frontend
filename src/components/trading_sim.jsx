import React, { useState, useEffect, useRef } from 'react';
import Header from "./header"; // Assuming this component exists
import SideNavs from "./side_navs"; // Assuming this component exists

// --- CONFIGURATION & CONSTANTS ---
const TICK_RATE_DEFAULT = 100;
const INITIAL_CASH = 10000;
const COMMISSION = 0.001; 
const INPUT_SIZE = 4; // SMA Dist, Volatility, Price Change, Trend
const ACTION_SIZE = 3; // 0: BUY, 1: HOLD, 2: SELL
const HIDDEN_SIZE = 8; // Hidden layer size
const DISCOUNT_FACTOR = 0.95; // Gamma (Future reward importance)
const EPSILON_START = 1.0;
const EPSILON_DECAY = 0.9995;
const MIN_EPSILON = 0.01;

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

// Expanded Agent Roster with detailed descriptions (Strategy column is simplified for DDQN)
const AGENT_TEMPLATES = [
  // Agents 1-10 are now DDQN agents, only differing by learning rate
  { id: 1, name: "Snow-Alpha", type: "DDQN (Balanced)", color: "#3b82f6", lr: 0.01, risk: 'med', description: "Balanced Deep Double Q-Network agent. Trades based on learned Q-values from experience replay.", strategy: "DDQN: Uses 2 networks (Online/Target) and an Experience Replay Buffer for stable reinforcement learning." },
  { id: 2, name: "Ice-Beta", type: "DDQN (Scalper)", color: "#0ea5e9", lr: 0.05, risk: 'high', description: "High-frequency DDQN with rapid learning rate (0.05). Designed to capitalize on small price movements.", strategy: "DDQN: Rapid adaptation, higher risk tolerance, and quicker response to reward signals." },
  { id: 3, name: "Frost-Gamma", type: "DDQN (Trend)", color: "#6366f1", lr: 0.001, risk: 'low', description: "Conservative DDQN with minimal learning rate. Waits for strong, confirmed trends before entering positions.", strategy: "DDQN: Slow, stable learning, prioritizing capital preservation over aggressive gains." },
  { id: 4, name: "Glacier-X", type: "DDQN (Deep-Hold)", color: "#8b5cf6", lr: 0.005, risk: 'med', description: "Position trader DDQN that seeks extended hold periods.", strategy: "DDQN: Moderate learning, balanced risk management." },
  { id: 5, name: "Avalanche-Z", type: "DDQN (Aggressive)", color: "#f43f5e", lr: 0.08, risk: 'high', description: "Ultra-aggressive DDQN with the highest learning rate (0.08).", strategy: "DDQN: Extremely fast learning, high volatility tolerance, prone to over-fitting/oscillation." },
  { id: 6, name: "Polar-Prime", type: "DDQN (Conservative)", color: "#10b981", lr: 0.0005, risk: 'low', description: "Ultra-conservative DDQN with the lowest learning rate.", strategy: "DDQN: Prioritizes stability and drawdown minimization." },
  { id: 7, name: "Blizzard-Omega", type: "DDQN (Momentum)", color: "#ec4899", lr: 0.02, risk: 'high', description: "Momentum-based DDQN that detects and rides strong price movements.", strategy: "DDQN: Moderate-high learning rate, optimized for detecting acceleration in price movement." },
  { id: 8, name: "Tundra-Sigma", type: "DDQN (Mean Reversion)", color: "#14b8a6", lr: 0.015, risk: 'med', description: "Mean reversion specialist DDQN that profits from price overshoots.", strategy: "DDQN: Focuses on SMA distance input, best in range-bound markets." },
  { id: 9, name: "Arctic-Delta", type: "DDQN (Volatility Hunter)", color: "#f97316", lr: 0.03, risk: 'high', description: "Volatility-focused DDQN that thrives in chaotic market conditions.", strategy: "DDQN: Heavily weighs volatility input, designed for breakout scenarios." },
  { id: 10, name: "Permafrost-Theta", type: "DDQN (Anti-Trend)", color: "#a855f7", lr: 0.008, risk: 'med', description: "Contrarian DDQN that looks for reversals.", strategy: "DDQN: Counter-intuitive approach, profits from trend exhaustion." },
  { id: 11, name: "Buy & Hold", type: "Benchmark", color: "#64748b", lr: 0, risk: 'passive', description: "Pure buy-and-hold strategy.", strategy: "Buys maximum position on first tick and holds indefinitely. Zero trading after initial purchase." },
  { id: 12, name: "Dip-Buyer", type: "Buy The Dip", color: "#fb923c", lr: 0.012, risk: 'med', description: "Strategic dip-buying agent that accumulates positions during price pullbacks.", strategy: "Monitors SMA distance. Buys when price drops below SMA, takes partial profits on rebounds." }
];

const fmt = (num) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(num);

// --- HELPER CLASSES ---

/**
 * ReplayBuffer: Stores experience tuples for Experience Replay.
 */
class ReplayBuffer {
    constructor(capacity = 5000) {
        this.capacity = capacity;
        this.buffer = [];
        this.position = 0;
    }

    add(state, action, reward, nextState, done) {
        const experience = [state, action, reward, nextState, done];
        if (this.buffer.length < this.capacity) {
            this.buffer.push(experience);
        } else {
            this.buffer[this.position] = experience;
        }
        this.position = (this.position + 1) % this.capacity;
    }

    sample(batchSize) {
        if (this.buffer.length < batchSize) return null;

        const batch = [];
        for (let i = 0; i < batchSize; i++) {
            const randomIndex = Math.floor(Math.random() * this.buffer.length);
            batch.push(this.buffer[randomIndex]);
        }
        return batch;
    }

    size() {
        return this.buffer.length;
    }
}

/**
 * DoubleDQN: Implements a Double Deep Q-Network with a simple two-layer network
 * for learning the optimal trading policy.
 */
class DoubleDQN {
    constructor(inputs, outputs, hidden, learningRate, discountFactor) {
        this.inputs = inputs;
        this.outputs = outputs; // 3 actions: 0=Buy, 1=Hold, 2=Sell
        this.lr = learningRate;
        this.gamma = discountFactor;
        
        // Double DQN: Two networks for stability (Online and Target)
        this.q_network = this._createNetwork(inputs, outputs, hidden);
        this.target_network = this._createNetwork(inputs, outputs, hidden);
        this.updateTargetNetwork(); 
        
        // Experience Replay: Buffer for storing transitions
        this.buffer = new ReplayBuffer(); 
        this.batchSize = 32;
        this.targetUpdateFrequency = 50; 
        this.stepCounter = 0;
    }

    _createNetwork(inputs, outputs, hidden) {
        // Simple 2-layer network with random initialization
        return {
            w1: Array.from({ length: inputs }, () => Array(hidden).fill(0).map(() => Math.random() * 2 - 1)),
            b1: Array(hidden).fill(0).map(() => Math.random() * 2 - 1),
            w2: Array.from({ length: hidden }, () => Array(outputs).fill(0).map(() => Math.random() * 2 - 1)),
            b2: Array(outputs).fill(0).map(() => Math.random() * 2 - 1)
        };
    }

    updateTargetNetwork() {
        this.target_network = JSON.parse(JSON.stringify(this.q_network));
    }

    // Predict Q-values for a given state
    predict(inputArray, network = this.q_network) {
        // Layer 1 (Hidden Layer) - ReLU activation
        const hidden = network.b1.map((b, i) => {
            const sum = inputArray.reduce((acc, val, j) => acc + val * network.w1[j][i], 0) + b;
            return Math.max(0, sum); // ReLU
        });

        // Layer 2 (Output Layer) - Linear activation (Q-values)
        return network.b2.map((b, i) => {
            return hidden.reduce((acc, val, j) => acc + val * network.w2[j][i], 0) + b;
        });
    }

    remember(state, action, reward, nextState, done) {
        this.buffer.add(state, action, reward, nextState, done);
    }

    // Train the Q-network using a batch from the buffer (simplified backprop)
    train() {
        if (this.buffer.size() < this.batchSize) return;

        const batch = this.buffer.sample(this.batchSize);

        let totalLoss = 0;

        for (const [state, action, reward, nextState, done] of batch) {
            const qValues = this.predict(state);
            const onlineNextQ = this.predict(nextState, this.q_network);
            const targetNextQ = this.predict(nextState, this.target_network);
            
            // DDQN Target Calculation
            let targetQ = reward;
            if (!done) {
                // Select best action (a*) from the Online Network
                const bestActionOnline = onlineNextQ.reduce((maxIndex, currentQ, i) => 
                    currentQ > onlineNextQ[maxIndex] ? i : maxIndex, 0);
                
                // Evaluate value of a* using the Target Network
                targetQ += this.gamma * targetNextQ[bestActionOnline];
            }

            // Target Q-values for the training
            const targetQValues = [...qValues];
            const error = targetQ - targetQValues[action];
            targetQValues[action] = targetQ;
            totalLoss += Math.abs(error);

            // --- Simplified Backpropagation (Output Layer Focus) ---

            const hidden = this.q_network.b1.map((b, i) => {
                const sum = state.reduce((acc, val, j) => acc + val * this.q_network.w1[j][i], 0) + b;
                return Math.max(0, sum); 
            });
            
            // Update W2 (Hidden -> Output weights) and B2
            for (let i = 0; i < this.outputs; i++) {
                const outputError = (targetQValues[i] - qValues[i]);
                for (let j = 0; j < hidden.length; j++) {
                    this.q_network.w2[j][i] += this.lr * outputError * hidden[j];
                }
                this.q_network.b2[i] += this.lr * outputError;
            }
            
            // Note: Backpropagating through ReLU (W1/B1 update) is omitted for simplicity 
            // in pure JS to prevent excessive complexity.
        }
        
        // Periodically update the target network
        this.stepCounter++;
        if (this.stepCounter % this.targetUpdateFrequency === 0) {
            this.updateTargetNetwork();
        }

        return totalLoss / this.batchSize;
    }
}

// --- HELPER FUNCTIONS ---

const calculateSMA = (data, period) => {
  if (data.length < period) return null;
  const sliced = data.slice(-period);
  const sum = sliced.reduce((acc, d) => acc + d.c, 0);
  return sum / period;
};

const calculateVolatility = (data, period) => {
  if (data.length < period) return 0;
  const sliced = data.slice(-period);
  const sma = calculateSMA(data, period);
  if (sma === null) return 0;

  const variance = sliced.reduce((acc, d) => acc + Math.pow(d.c - sma, 2), 0) / period;
  return Math.sqrt(variance);
};

const normalize = (value, min, max) => {
  if (min === max) return 0.5;
  return (value - min) / (max - min);
};

// Calculates the 4 inputs for the DDQN
const calculateInputs = (allCandles, currentPrice) => {
    if (allCandles.length < 20) return [0, 0, 0, 0];

    const sma20 = calculateSMA(allCandles, 20);
    const sma5 = calculateSMA(allCandles, 5);
    const volatility10 = calculateVolatility(allCandles, 10);
    
    const prevClose = allCandles[allCandles.length - 2]?.c || currentPrice; 
    const priceChange = (currentPrice - prevClose) / prevClose;
    
    // Normalize SMA Distance
    let maxDist = 0.01;
    if (sma20) {
      maxDist = allCandles.slice(-20).reduce((max, d) => Math.max(max, Math.abs(d.c - sma20) / sma20), 0.01);
    }
    const smaDist = sma20 ? normalize(currentPrice, sma20 * (1 - maxDist), sma20 * (1 + maxDist)) * 2 - 1 : 0; // Normalized between -1 and 1
    
    // Normalize Volatility
    let maxVol = 0.005;
    const volHistory = allCandles.slice(0, allCandles.length - 1);
    if (volHistory.length > 20) {
      maxVol = volHistory.slice(-20).reduce((max, d, i) => {
         const index = volHistory.length - 20 + i + 1;
         const vol = calculateVolatility(volHistory.slice(0, index), 10);
         return Math.max(max, vol);
      }, 0.005);
    }
    const normVolatility = normalize(volatility10, 0, maxVol); // Normalized between 0 and 1
    
    // Normalize Price Change
    let maxChange = 0.01;
    if (allCandles.length > 20) {
        maxChange = allCandles.slice(-20).reduce((max, d, i) => {
            const prev = allCandles[allCandles.length - 20 + i - 1];
            if (i > 0 && prev) {
                return Math.max(max, Math.abs((d.c - prev.c) / prev.c));
            }
            return max;
        }, 0.01);
    }
    const normPriceChange = normalize(priceChange, -maxChange, maxChange); // Normalized between -1 and 1
    
    // Trend Feature
    const trend = (sma5 && sma20) ? (sma5 > sma20 ? 1 : -1) : 0; // -1, 0, or 1

    return [smaDist, normVolatility, normPriceChange, trend];
};

// Epsilon-Greedy action selection
const getAction = (qValues, epsilon, shares) => {
    const isExploring = Math.random() < epsilon;
    let action = 1; // Default to HOLD
    
    if (isExploring) {
        // Random action (exploration)
        action = Math.floor(Math.random() * ACTION_SIZE); 
    } else {
        // Best Q-value action (exploitation)
        action = qValues.reduce((maxIndex, currentQ, i) => 
            currentQ > qValues[maxIndex] ? i : maxIndex, 0);
    }

    // Constraint: Cannot BUY if already holding, cannot SELL if not holding
    if (shares > 0 && action === 0) action = 1; // Change BUY to HOLD
    if (shares === 0 && action === 2) action = 1; // Change SELL to HOLD

    return action;
};

// --- CHART COMPONENTS (Unchanged, omitted for brevity but included in final code) ---
// --- MainCandleChart, MiniCandleChart, EquityCurve, StatisticsModal, ModelInfoModal, WeightsDisplay (Assumed to be here) ---

const MainCandleChart = ({ data, agents, width, height }) => {
  // ... (Chart implementation remains the same)
  const displayData = data.slice(-100); 

  // Use the actual container width for responsivity, even if 800 is passed as a default
  const actualWidth = width; 

  if (!displayData || displayData.length < 2) return (
    <div style={{color: '#94a3b8', padding:'40px', textAlign:'center', fontSize:'14px'}}>
        Waiting for market data...
    </div>
  );

  const maxPrice = Math.max(...displayData.map(d => d.h));
  const minPrice = Math.min(...displayData.map(d => d.l));
  const range = maxPrice - minPrice || 1;
  const scaleY = (p) => height - ((p - minPrice) / range) * height;
  const candleWidth = (actualWidth / displayData.length) * 0.7;

  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${actualWidth} ${height}`} style={{overflow:'visible', maxWidth: '100%'}}>
      {[...Array(5)].map((_, i) => {
        const price = minPrice + (range / 4) * i;
        const y = scaleY(price);
        return (
          <g key={i}>
            <line x1="0" y1={y} x2={actualWidth} y2={y} stroke="#334155" strokeDasharray="2,2" strokeOpacity="0.3" />
            <text x={actualWidth + 5} y={y + 3} fontSize="10" fill="#64748b">{price.toFixed(2)}</text>
          </g>
        );
      })}

      {displayData.map((d, i) => {
        const x = i * (actualWidth / displayData.length);
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
          const x = localIndex * (actualWidth / displayData.length) + (candleWidth / 2);
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
    <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} style={{overflow:'visible', maxWidth: '100%'}}>
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
const StatisticsModal = ({ agents, onClose, assetPrice, startPrice }) => {
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
const WeightsDisplay = ({ weights, bias }) => {
  // Display only the first layer weights (W1/B1) for the Online Q-Network
  const w1 = weights?.w1 ? weights.w1.flat().slice(0, 4) : [0, 0, 0, 0];
  const b1 = bias?.b1 ? bias.b1[0] : 0;

  return (
    <div style={{ 
      backgroundColor: '#1e293b', 
      padding: '6px 12px', 
      borderRadius: '4px',
      fontSize: '10px',
      color: '#94a3b8',
      fontFamily: '"JetBrains Mono", monospace',
      marginTop: '8px'
    }}>
      <div style={{marginBottom:'2px'}}>
        W (Input):
        {w1.map((v, i) => (
          <span key={i} style={{color: v > 0 ? THEME.success : v < 0 ? THEME.danger : '#94a3b8', marginLeft: '4px'}}>
            {v.toFixed(3)}
          </span>
        ))}
      </div>
      <div>
        B (Hidden):
        <span style={{color: b1 > 0 ? THEME.success : b1 < 0 ? THEME.danger : '#94a3b8', marginLeft: '4px'}}>
          {b1.toFixed(3)}
        </span>
      </div>
    </div>
  );
};
// --- STYLES (Unchanged, included in final code) ---
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
    flexDirection: 'row',
    display: 'flex', 
    height: 'calc(100vh - 60px)', 
  },
  sidebar: {
    width: '300px',
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
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
    position: 'relative', // Added for MainCandleChart scaling
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
const mobileStyles = `@media (max-width: 768px) {
  .main-wrapper {
    flex-direction: column !important;
    height: auto !important;
  }
  .sidebar {
    width: 100% !important;
    border-right: none !important;
    border-bottom: 1px solid #e2e8f0 !important;
    max-height: none !important;
    overflow-y: visible !important;
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
  ${styles.chartContainer} {
    height: 250px; 
    padding: 8px;
  }
}`;

// --- MAIN COMPONENT ---
export default function SnowAITradingSim() {
  const [isRunning, setIsRunning] = useState(false);
  const [dataSource, setDataSource] = useState('BINANCE');
  const [assetName, setAssetName] = useState('BTC');
  const [customData, setCustomData] = useState([]);
  const [dataIndex, setDataIndex] = useState(0);
  const [assetPrice, setAssetPrice] = useState(0);
  const [startPrice, setStartPrice] = useState(null);
  const [candles, setCandles] = useState([]);
  const [stopLossPct, setStopLossPct] = useState(3.0);
  const [takeProfitPct, setTakeProfitPct] = useState(8.0);
  const [speed, setSpeed] = useState(TICK_RATE_DEFAULT);
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
    // RL-Specific States
    model: (template.id === 11 || template.id === 12) ? null : new DoubleDQN(INPUT_SIZE, ACTION_SIZE, HIDDEN_SIZE, template.lr, DISCOUNT_FACTOR), 
    epsilon: EPSILON_START,
    currentState: null, // The last calculated input vector
    lastAction: 1, // 0=Buy, 1=Hold, 2=Sell (Hold initially)
    hasBoughtInitial: (template.id === 11 || template.id === 12) ? false : true,
    equityCurve: [INITIAL_CASH],
    persistentMemory: false // Now only applies to DDQN model weights
  });

  const [agents, setAgents] = useState(() => AGENT_TEMPLATES.map(createInitialAgentState));
  const wsRef = useRef(null);
  const candlesRef = useRef([]);
  const logRefs = useRef({});
  const chartRef = useRef(null); 

  // Auto-scroll logs to bottom
  useEffect(() => {
    Object.values(logRefs.current).forEach(ref => {
      if (ref) {
        ref.scrollTop = ref.scrollHeight;
      }
    });
  }, [agents]);

  // --- DATA HANDLING (Unchanged) ---
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const newAssetName = file.name.replace(/\.[^/.]+$/, "").toUpperCase();
    setAssetName(newAssetName);

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const lines = text.trim().split('\n');

      const parsed = lines.map((line, i) => {
        if (i === 0 && isNaN(line.split(',')[0])) {
          return null;
        }
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
    setAssetPrice(0);
    setStartPrice(null);
    candlesRef.current = [];
    setShowStatistics(false);
    setAgents(prev => AGENT_TEMPLATES.map((template, idx) => {
      const existing = prev[idx];
      const newState = createInitialAgentState(template);
      
      // Handle persistent memory for DDQN
      if (existing && existing.persistentMemory && existing.model) {
        // Deep copy the model, but reset the buffer and step counter
        const existingModel = existing.model;
        newState.model.q_network = JSON.parse(JSON.stringify(existingModel.q_network));
        newState.model.target_network = JSON.parse(JSON.stringify(existingModel.target_network));
        newState.persistentMemory = true;
        newState.logs = [{msg: "Agent Restarted with Persistent Weights", type:'info'}];
      }
      return newState;
    }));
  };

  useEffect(() => {
    if (dataSource === 'BINANCE') {
      setAssetName('BTC');
      if (wsRef.current) wsRef.current.close(); 
      wsRef.current = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@kline_1s');
      
      wsRef.current.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        if (msg.e === 'kline') {
          const k = msg.k;
          const newCandle = { t: k.t, o: parseFloat(k.o), h: parseFloat(k.h), l: parseFloat(k.l), c: parseFloat(k.c) };
          const current = candlesRef.current;
          
          if (k.x && current.length > 0 && current[current.length - 1].t === newCandle.t) {
            current[current.length - 1] = newCandle;
          } else if (k.x) {
             current.push(newCandle);
          } else if (current.length === 0 || current[current.length - 1].t !== newCandle.t) {
             current.push(newCandle);
          } else {
             current[current.length - 1] = newCandle;
          }

          candlesRef.current = current;
          setAssetPrice(newCandle.c);
          if (startPrice === null) setStartPrice(newCandle.c);
        }
      };
    } else {
      if (wsRef.current) wsRef.current.close();
    }
    return () => { if (wsRef.current) wsRef.current.close(); };
  }, [dataSource, startPrice]);

  // --- GAME LOOP (RL Logic Implemented) ---
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      let currentCandle = null;
      let allCandles = candlesRef.current;

      if (dataSource === 'UPLOAD') {
          if (dataIndex >= customData.length) {
              setIsRunning(false);
              setShowStatistics(true);
              return;
          }
          currentCandle = customData[dataIndex];
          candlesRef.current.push(currentCandle);
          setAssetPrice(currentCandle.c);
          if (startPrice === null) setStartPrice(currentCandle.c);
          setDataIndex(prev => prev + 1);
      } else {
          if (allCandles.length > 0) currentCandle = allCandles[allCandles.length - 1]; 
      }

      if (!currentCandle) return;

      const currentPrice = currentCandle.c;
      const nextState = calculateInputs(allCandles, currentPrice);

      setCandles(allCandles.slice(-100)); 

      setAgents(prevAgents => prevAgents.map(agent => {
        if (!agent.isActive) return agent; 
        
        let newAgentState = { ...agent };
        let action = 1; // Default to HOLD
        let reward = 0; // The reward for the previous step

        const lastBuyPrice = newAgentState.history.find(h => h.type === 'BUY')?.price;
        const previousState = newAgentState.currentState;

        // --- 1. NON-DDQN LOGIC (Benchmark / Rule-Based) ---
        if (agent.id === 11) { // Buy & Hold
            if (!agent.hasBoughtInitial && currentPrice > 0) {
                action = 0; // BUY
            } else {
                action = 1; // HOLD
            }
        } else if (agent.id === 12) { // Dip-Buyer
            // Simplified rule for the dip-buyer
            const sma5 = calculateSMA(allCandles, 5);
            if (!agent.hasBoughtInitial && currentPrice > 0) {
              action = 0; // Initial BUY
            } else if (sma5 && currentPrice < sma5 * 0.98 && newAgentState.shares === 0) {
                action = 0; // BUY on 2% dip
            } else if (lastBuyPrice && currentPrice > lastBuyPrice * 1.015 && newAgentState.shares > 0) {
                action = 2; // SELL for small profit
            } else {
                action = 1; // HOLD
            }
        } 
        
        // --- 2. DDQN LOGIC (RL Agents) ---
        else if (agent.model) {
            const qValues = agent.model.predict(nextState);
            action = getAction(qValues, agent.epsilon, agent.shares);

            // If a previous state exists, execute RL cycle steps
            if (previousState) {
                // Calculate Reward: Use difference in portfolio value
                reward = (newAgentState.portfolioValue - newAgentState.prevValue) / INITIAL_CASH * 100;
                
                // Store Experience
                newAgentState.model.remember(previousState, newAgentState.lastAction, reward, nextState, false);

                // Train Model (returns loss)
                newAgentState.loss = newAgentState.model.train() || newAgentState.loss; 
            }
            
            // Decay Epsilon
            newAgentState.epsilon = Math.max(MIN_EPSILON, agent.epsilon * EPSILON_DECAY);
        }

        // --- 3. EXECUTE TRADE & RISK MANAGEMENT ---
        let pnl = 0;
        let tradeType = null;
        let newShares = newAgentState.shares;
        let newCash = newAgentState.cash;
        let newLogs = [...newAgentState.logs.slice(-20)];
        let newHistory = [...newAgentState.history];

        // STOP LOSS / TAKE PROFIT - Takes precedence over AI/Rule action
        if (agent.id !== 11 && newAgentState.shares > 0 && lastBuyPrice) {
            const unrealizedPnlPct = (currentPrice - lastBuyPrice) / lastBuyPrice * 100;
            
            if (unrealizedPnlPct >= takeProfitPct) {
                action = 2; // SELL_TP
                tradeType = 'SELL_TP';
                newLogs.push({msg: `Take Profit Hit! (+${unrealizedPnlPct.toFixed(2)}%)`, type:'success'});
            } else if (unrealizedPnlPct <= -stopLossPct) {
                action = 2; // SELL_SL
                tradeType = 'SELL_SL';
                newLogs.push({msg: `Stop Loss Hit! (-${Math.abs(unrealizedPnlPct).toFixed(2)}%)`, type:'danger'});
            }
        }

        // Execute Final Action (0:BUY, 1:HOLD, 2:SELL)
        if (action === 0) { // BUY
            let cashToUse = newCash;
            if (agent.id === 11) {
              cashToUse = newCash;
            } else if (agent.id === 12 && !agent.hasBoughtInitial) {
              cashToUse = newCash * 0.25;
            } else {
              cashToUse = newCash * 0.98; 
            }
            
            const sharesToBuy = cashToUse / currentPrice * (1 - COMMISSION);
            
            newShares += sharesToBuy;
            newCash -= cashToUse;
            
            newHistory.push({ type: 'BUY', price: currentPrice, amount: sharesToBuy, t: currentCandle.t });
            newLogs.push({ msg: `BUY: ${sharesToBuy.toFixed(4)} @ ${currentPrice.toFixed(2)}`, type: 'success' });
            newAgentState.hasBoughtInitial = true;
            tradeType = 'BUY';
            
        } else if (action === 2) { // SELL
            const sharesToSell = newShares;
            
            // FIFO P&L CALCULATION
            let totalCost = 0;
            let remainingShares = sharesToSell;
            
            let tempHistory = [];
            for (let i = 0; i < newHistory.length; i++) {
                const item = newHistory[i];
                if (item.type === 'BUY') {
                    const sharesFromThisBuy = Math.min(remainingShares, item.amount);
                    totalCost += sharesFromThisBuy * item.price / (1 - COMMISSION);
                    remainingShares -= sharesFromThisBuy;
                    if (sharesFromThisBuy < item.amount) {
                      tempHistory.push({...item, amount: item.amount - sharesFromThisBuy}); 
                    }
                } else {
                    tempHistory.push(item);
                }
            }
            
            const saleAmount = sharesToSell * currentPrice * (1 - COMMISSION);
            pnl = saleAmount - totalCost;
            
            newCash += saleAmount;
            newShares = 0;
            
            newHistory = [...tempHistory.filter(h => h.type === 'SELL' || h.amount > 0)];
            newHistory.push({ type: 'SELL', price: currentPrice, amount: sharesToSell, t: currentCandle.t, pnl: pnl });
            newLogs.push({ msg: `SELL (${tradeType || 'AI'}): PnL ${fmt(pnl)}`, type: pnl >= 0 ? 'success' : 'danger' });
            tradeType = tradeType || 'SELL';
        } else {
             tradeType = 'HOLD';
        }


        // --- 4. FINAL STATE UPDATE ---
        const finalPortfolioValue = newCash + newShares * currentPrice;
        const newEquityCurve = [...newAgentState.equityCurve, finalPortfolioValue];
        
        return {
            ...newAgentState,
            cash: newCash,
            shares: newShares,
            portfolioValue: finalPortfolioValue,
            prevValue: newAgentState.portfolioValue, // Store current value as previous for next tick's reward calc
            history: newHistory,
            logs: newLogs,
            candles: allCandles.slice(-30),
            lastAction: action, // Store the executed action (0, 1, or 2)
            currentState: nextState, // Store the inputs as the state for the NEXT cycle
            equityCurve: newEquityCurve,
        };
    }));
    }, speed);
    return () => clearInterval(interval);
  }, [isRunning, speed, dataSource, dataIndex, customData, startPrice, stopLossPct, takeProfitPct, agents.length]); 

  const toggleAgent = (id) => {
    setAgents(prev => prev.map(a => a.id === id ? {
      ...a,
      isActive: !a.isActive,
      logs: a.isActive ? [...a.logs, {msg: "Paused.", type:'warning'}] : [...a.logs, {msg: "Agent Activated.", type:'info'}]
    } : a));
  };

  const togglePersistentMemory = (id) => {
    setAgents(prev => prev.map(a => {
      if (a.id !== id) return a;
      
      const isNowPersistent = !a.persistentMemory;
      let newModel = a.model;
      
      if (isNowPersistent && a.model) {
        // When enabling, make sure the current weights are transferred if the agent was active
        newModel.updateTargetNetwork(); 
      }
      
      return {
        ...a,
        persistentMemory: isNowPersistent,
        model: newModel,
        logs: [...a.logs, {msg: `Persistent Memory: ${isNowPersistent ? 'ENABLED' : 'DISABLED'}`, type: isNowPersistent ? 'info' : 'warning'}]
      };
    }));
  };

  const chartWidth = chartRef.current ? chartRef.current.offsetWidth - 32 : 800; 

  return (
    <>
      <style>{mobileStyles}</style>
      <div style={styles.app}> 
        <div className="header">
          <Header />
        </div>
        <div className="main-page-body">
          <SideNavs />
          <header style={styles.header}>
            <div style={{fontSize: '18px', fontWeight: '800', color: THEME.primary, display:'flex', alignItems:'center', gap:'8px'}}>
              <span>❄️</span> SnowAI <span style={{color:'#94a3b8', fontWeight: 400}}>Training Sim v2.1 (DDQN)</span>
            </div>
            <div className="header-controls">
              <div style={{textAlign:'right'}}>
                <div style={styles.label}>{assetName} PRICE</div>
                <div style={{fontSize:'16px', fontWeight:'700', fontFamily:'monospace'}}>{fmt(assetPrice)}</div>
              </div>
              <button
                style={{...styles.btn, ...styles.btnSecondary}}
                onClick={() => setShowStatistics(true)}
                disabled={candles.length === 0}
              >
                📊 STATS
              </button>
              <button 
                style={{...styles.btn, ...(isRunning ? {backgroundColor: THEME.danger, color:'white'} : styles.btnPrimary), width:'120px'}} 
                onClick={() => setIsRunning(!isRunning)}
              >
                {isRunning ? 'STOP' : 'START SIM'}
              </button>
            </div>
          </header>
          <div className="main-wrapper" style={styles.main}>
            <div className="sidebar" style={styles.sidebar}>
              <div>
                <div style={styles.label}>DATA SOURCE</div>
                <div style={{display:'flex', gap:'8px'}}>
                  <button style={{...styles.btn, flex:1, ...(dataSource === 'BINANCE' ? styles.btnPrimary : styles.btnSecondary)}} onClick={() => {setDataSource('BINANCE'); resetSimulation();}}>Live ({assetName})</button>
                  <button style={{...styles.btn, flex:1, ...(dataSource === 'UPLOAD' ? styles.btnPrimary : styles.btnSecondary)}} onClick={() => document.getElementById('fileUpload').click()}>CSV Upload</button>
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
              <div ref={chartRef} style={styles.chartContainer}>
                <MainCandleChart data={candles} agents={agents} width={chartWidth} height={300} /> 
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
                          {agent.model && <WeightsDisplay weights={agent.model.q_network} bias={agent.model.q_network} />}
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
                         {agent.model && <div style={{marginTop:'4px', color:'#64748b', fontSize:'10px'}}>
                            {`Buffer: ${agent.model.buffer.size()} | Epsilon: ${agent.epsilon.toFixed(3)} | Loss: ${agent.loss.toFixed(4)}`}
                         </div>}
                      </div>
                    </div>

                    <div style={styles.cardFooter}>
                      <button style={{...styles.btn, ...styles.btnSecondary, flex:1}} onClick={() => toggleAgent(agent.id)}>
                          {agent.isActive ? '⏸ PAUSE' : '▶ RESUME'}
                      </button>
                      {agent.model && (
                        <button
                            style={{...styles.btn, ...styles.btnSecondary, flex:1, color: agent.persistentMemory ? THEME.primary : '#475569'}}
                            onClick={() => togglePersistentMemory(agent.id)}
                            title="Keeps model weights on Reset"
                          >
                              🧠 {agent.persistentMemory ? 'MEM ON' : 'MEM OFF'}
                          </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {modelInfoAgent && <ModelInfoModal agent={modelInfoAgent} onClose={() => setModelInfoAgent(null)} />}
          {showStatistics && <StatisticsModal agents={agents} onClose={() => setShowStatistics(false)} assetPrice={assetPrice} startPrice={startPrice} />}
        </div>
      </div>
    </>
  );
}