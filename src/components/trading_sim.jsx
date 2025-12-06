import React, { useState, useEffect, useRef } from 'react';
import Header from "./header";
import SideNavs from "./side_navs";

// ============================================================================
// CONFIGURATION & CONSTANTS
// ============================================================================

const CONFIG = {
  TICK_RATE_DEFAULT: 100,
  INITIAL_CASH: 10000,
  COMMISSION: 0.001,
  INPUT_SIZE: 7,
  ACTION_SIZE: 3,
  HIDDEN_SIZE: 32,
  HIDDEN_SIZE_2: 16,
  DISCOUNT_FACTOR: 0.95,
  EPSILON_START: 1.0,
  EPSILON_DECAY: 0.9995,
  MIN_EPSILON: 0.01,
};

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

const AGENT_TEMPLATES = [
  {
    id: 1,
    name: "Snow-Alpha",
    type: "DDQN (Balanced)",
    color: "#3b82f6",
    lr: 0.005,
    hiddenSize: 32,
    hiddenSize2: 16,
    risk: 'med',
    rewardType: 'balanced',
    stateFeatures: 'standard',
    description: "Balanced Deep Double Q-Network. General-purpose trader with moderate risk tolerance.",
    strategy: "DDQN with full backprop. Balanced reward function considers P&L, position management, and risk."
  },
  {
    id: 2,
    name: "Ice-Beta",
    type: "DDQN (Scalper)",
    color: "#0ea5e9",
    lr: 0.01,
    hiddenSize: 24,
    hiddenSize2: 12,
    risk: 'high',
    rewardType: 'scalper',
    stateFeatures: 'short-term',
    description: "High-frequency DDQN optimized for quick trades. Targets small, frequent profits.",
    strategy: "Fast learning rate, rewards trade frequency and quick exits. Prefers short-term volatility signals."
  },
  {
    id: 3,
    name: "Frost-Gamma",
    type: "DDQN (Trend)",
    color: "#6366f1",
    lr: 0.002,
    hiddenSize: 40,
    hiddenSize2: 20,
    risk: 'low',
    rewardType: 'trend',
    stateFeatures: 'long-term',
    description: "Conservative trend-following DDQN. Waits for strong trends and holds winners.",
    strategy: "Slow learning, rewards holding profitable positions. Uses longer SMA periods for trend detection."
  },
  {
    id: 4,
    name: "Glacier-X",
    type: "DDQN (Deep-Hold)",
    color: "#8b5cf6",
    lr: 0.003,
    hiddenSize: 32,
    hiddenSize2: 16,
    risk: 'med',
    rewardType: 'momentum',
    stateFeatures: 'momentum',
    description: "Position trader that seeks extended hold periods with strong momentum.",
    strategy: "Rewards staying in trending positions. Penalty for premature exits during momentum."
  },
  {
    id: 5,
    name: "Avalanche-Z",
    type: "DDQN (Aggressive)",
    color: "#f43f5e",
    lr: 0.015,
    hiddenSize: 28,
    hiddenSize2: 14,
    risk: 'high',
    rewardType: 'aggressive',
    stateFeatures: 'volatility',
    description: "Ultra-aggressive DDQN that swings for home runs. High risk, high reward.",
    strategy: "Very fast learning, amplified rewards for large gains. Thrives in volatile conditions."
  },
  {
    id: 6,
    name: "Polar-Prime",
    type: "DDQN (Conservative)",
    color: "#10b981",
    lr: 0.001,
    hiddenSize: 48,
    hiddenSize2: 24,
    risk: 'low',
    rewardType: 'conservative',
    stateFeatures: 'risk-aware',
    description: "Ultra-conservative DDQN focused on capital preservation.",
    strategy: "Slowest learning, largest network. Strong penalty for losses, rewards risk-adjusted returns."
  },
  {
    id: 7,
    name: "Blizzard-Omega",
    type: "DDQN (Momentum)",
    color: "#ec4899",
    lr: 0.007,
    hiddenSize: 32,
    hiddenSize2: 16,
    risk: 'high',
    rewardType: 'momentum',
    stateFeatures: 'momentum',
    description: "Momentum specialist that detects and rides strong directional moves.",
    strategy: "Optimized for detecting price acceleration. Rewards quick entry on breakouts."
  },
  {
    id: 8,
    name: "Tundra-Sigma",
    type: "DDQN (Mean Reversion)",
    color: "#14b8a6",
    lr: 0.004,
    hiddenSize: 32,
    hiddenSize2: 16,
    risk: 'med',
    rewardType: 'mean-reversion',
    stateFeatures: 'mean-reversion',
    description: "Mean reversion specialist. Profits from price overshoots and reversals.",
    strategy: "Rewards counter-trend entries when price deviates from SMA. Best in range-bound markets."
  },
  {
    id: 9,
    name: "Arctic-Delta",
    type: "DDQN (Volatility)",
    color: "#f97316",
    lr: 0.008,
    hiddenSize: 28,
    hiddenSize2: 14,
    risk: 'high',
    rewardType: 'volatility',
    stateFeatures: 'volatility',
    description: "Volatility hunter that thrives in chaotic market conditions.",
    strategy: "Heavy weighting on volatility signals. Enters aggressively during breakouts."
  },
  {
    id: 10,
    name: "Permafrost-Theta",
    type: "DDQN (Contrarian)",
    color: "#a855f7",
    lr: 0.005,
    hiddenSize: 32,
    hiddenSize2: 16,
    risk: 'med',
    rewardType: 'contrarian',
    stateFeatures: 'contrarian',
    description: "Contrarian DDQN that fades extremes and profits from reversals.",
    strategy: "Counter-intuitive approach. Buys when others sell, sells when others buy."
  },
  {
    id: 11,
    name: "Buy & Hold",
    type: "Benchmark",
    color: "#64748b",
    lr: 0,
    risk: 'passive',
    rewardType: 'none',
    stateFeatures: 'none',
    description: "Pure buy-and-hold benchmark strategy.",
    strategy: "Buys maximum position on first tick and holds indefinitely. Zero trading after initial purchase."
  },
  {
    id: 12,
    name: "Dip-Buyer",
    type: "Rule-Based",
    color: "#fb923c",
    lr: 0,
    risk: 'med',
    rewardType: 'none',
    stateFeatures: 'none',
    description: "Simple rule-based dip-buying strategy. Buys 2% below SMA5.",
    strategy: "Monitors SMA distance. Buys when price drops 2% below SMA5, sells on 1.5% profit."
  }
];

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const fmt = (num) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(num);

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

// ============================================================================
// MACHINE LEARNING CLASSES
// ============================================================================

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

class DoubleDQN {
  constructor(inputs, outputs, hidden1, hidden2, learningRate, discountFactor) {
    this.inputs = inputs;
    this.outputs = outputs;
    this.hidden1 = hidden1;
    this.hidden2 = hidden2;
    this.lr = learningRate;
    this.gamma = discountFactor;

    this.q_network = this._createNetwork(inputs, outputs, hidden1, hidden2);
    this.target_network = this._createNetwork(inputs, outputs, hidden1, hidden2);
    this.updateTargetNetwork();

    this.buffer = new ReplayBuffer();
    this.batchSize = 32;
    this.targetUpdateFrequency = 50;
    this.stepCounter = 0;
    
    // STRICTER gradient clipping
    this.gradientClipValue = 0.5; // Reduced from 1.0
    
    // Weight clipping to prevent explosion
    this.weightClipValue = 10.0; // Hard cap at ±10
    
    // Learning rate decay
    this.initialLr = learningRate;
    this.minLr = learningRate * 0.01; // Even lower minimum
    this.lrDecay = 0.9998; // Faster decay
  }

  _createNetwork(inputs, outputs, hidden1, hidden2) {
    // He initialization for ReLU networks (better than Xavier for ReLU)
    const heInit = (fanIn) => {
      const std = Math.sqrt(2.0 / fanIn);
      return (Math.random() * 2 - 1) * std;
    };

    return {
      w1: Array.from({ length: inputs }, () => 
        Array(hidden1).fill(0).map(() => heInit(inputs))),
      b1: Array(hidden1).fill(0.01), // Small positive bias
      w2: Array.from({ length: hidden1 }, () => 
        Array(hidden2).fill(0).map(() => heInit(hidden1))),
      b2: Array(hidden2).fill(0.01),
      w3: Array.from({ length: hidden2 }, () => 
        Array(outputs).fill(0).map(() => heInit(hidden2))),
      b3: Array(outputs).fill(0)
    };
  }

  updateTargetNetwork() {
    this.target_network = JSON.parse(JSON.stringify(this.q_network));
  }

  predict(inputArray, network = this.q_network) {
    // Layer 1: Input -> Hidden1 (ReLU)
    const hidden1 = network.b1.map((b, i) => {
      const sum = inputArray.reduce((acc, val, j) => acc + val * network.w1[j][i], 0) + b;
      return Math.max(0, sum);
    });

    // Layer 2: Hidden1 -> Hidden2 (ReLU)
    const hidden2 = network.b2.map((b, i) => {
      const sum = hidden1.reduce((acc, val, j) => acc + val * network.w2[j][i], 0) + b;
      return Math.max(0, sum);
    });

    // Layer 3: Hidden2 -> Output (Linear)
    return network.b3.map((b, i) => {
      return hidden2.reduce((acc, val, j) => acc + val * network.w3[j][i], 0) + b;
    });
  }

  remember(state, action, reward, nextState, done) {
    this.buffer.add(state, action, reward, nextState, done);
  }

  // Clip gradients to prevent explosion
  _clipGradient(grad) {
    const magnitude = Math.abs(grad);
    if (magnitude > this.gradientClipValue) {
      return (grad / magnitude) * this.gradientClipValue;
    }
    return grad;
  }
  
  // Clip weights to prevent explosion
  _clipWeight(weight) {
    if (weight > this.weightClipValue) return this.weightClipValue;
    if (weight < -this.weightClipValue) return -this.weightClipValue;
    return weight;
  }

  // Check for NaN and replace with small value
  _checkNaN(value, replacement = 0.001) {
    if (isNaN(value) || !isFinite(value)) {
      return replacement;
    }
    return this._clipWeight(value); // Also clip to prevent explosion
  }

  train() {
    if (this.buffer.size() < this.batchSize) return;

    const batch = this.buffer.sample(this.batchSize);
    let totalLoss = 0;

    // Learning rate decay
    const currentLr = Math.max(this.minLr, this.lr * Math.pow(this.lrDecay, this.stepCounter));

    for (const [state, action, reward, nextState, done] of batch) {
      // Forward pass to get current Q-values and intermediate activations
      const hidden1 = this.q_network.b1.map((b, i) => {
        const sum = state.reduce((acc, val, j) => acc + val * this.q_network.w1[j][i], 0) + b;
        return Math.max(0, sum);
      });

      const hidden2 = this.q_network.b2.map((b, i) => {
        const sum = hidden1.reduce((acc, val, j) => acc + val * this.q_network.w2[j][i], 0) + b;
        return Math.max(0, sum);
      });

      const qValues = this.q_network.b3.map((b, i) => {
        return hidden2.reduce((acc, val, j) => acc + val * this.q_network.w3[j][i], 0) + b;
      });

      // DDQN target calculation
      const onlineNextQ = this.predict(nextState, this.q_network);
      const targetNextQ = this.predict(nextState, this.target_network);

      let targetQ = reward;
      if (!done) {
        const bestActionOnline = onlineNextQ.reduce((maxIndex, currentQ, i) =>
          currentQ > onlineNextQ[maxIndex] ? i : maxIndex, 0);
        targetQ += this.gamma * targetNextQ[bestActionOnline];
      }

      // Huber loss for more stable training (less sensitive to outliers)
      const error = targetQ - qValues[action];
      const delta = 1.0;
      const huberLoss = Math.abs(error) <= delta 
        ? 0.5 * error * error 
        : delta * (Math.abs(error) - 0.5 * delta);
      
      totalLoss += huberLoss;

      // === BACKPROPAGATION WITH GRADIENT CLIPPING ===

      // Output layer gradients
      const outputGrads = Array(this.outputs).fill(0);
      // Use sign for Huber loss derivative
      outputGrads[action] = Math.abs(error) <= delta ? error : delta * Math.sign(error);
      outputGrads[action] = this._clipGradient(outputGrads[action]);

      // Update W3 (Hidden2 -> Output) and B3
      for (let i = 0; i < this.outputs; i++) {
        for (let j = 0; j < this.hidden2; j++) {
          const weightGrad = this._clipGradient(outputGrads[i] * hidden2[j]);
          const update = currentLr * weightGrad;
          this.q_network.w3[j][i] = this._checkNaN(this.q_network.w3[j][i] + update);
        }
        const biasUpdate = currentLr * outputGrads[i];
        this.q_network.b3[i] = this._checkNaN(this.q_network.b3[i] + biasUpdate);
      }

      // Backprop to Hidden2
      const hidden2Grads = Array(this.hidden2).fill(0);
      for (let j = 0; j < this.hidden2; j++) {
        for (let i = 0; i < this.outputs; i++) {
          hidden2Grads[j] += outputGrads[i] * this.q_network.w3[j][i];
        }
        hidden2Grads[j] = this._clipGradient(hidden2Grads[j]);
        // ReLU derivative
        if (hidden2[j] <= 0) hidden2Grads[j] = 0;
      }

      // Update W2 (Hidden1 -> Hidden2) and B2
      for (let i = 0; i < this.hidden2; i++) {
        for (let j = 0; j < this.hidden1; j++) {
          const weightGrad = this._clipGradient(hidden2Grads[i] * hidden1[j]);
          const update = currentLr * weightGrad;
          this.q_network.w2[j][i] = this._checkNaN(this.q_network.w2[j][i] + update);
        }
        const biasUpdate = currentLr * hidden2Grads[i];
        this.q_network.b2[i] = this._checkNaN(this.q_network.b2[i] + biasUpdate);
      }

      // Backprop to Hidden1
      const hidden1Grads = Array(this.hidden1).fill(0);
      for (let j = 0; j < this.hidden1; j++) {
        for (let i = 0; i < this.hidden2; i++) {
          hidden1Grads[j] += hidden2Grads[i] * this.q_network.w2[j][i];
        }
        hidden1Grads[j] = this._clipGradient(hidden1Grads[j]);
        // ReLU derivative
        if (hidden1[j] <= 0) hidden1Grads[j] = 0;
      }

      // Update W1 (Input -> Hidden1) and B1
      for (let i = 0; i < this.hidden1; i++) {
        for (let j = 0; j < this.inputs; j++) {
          const weightGrad = this._clipGradient(hidden1Grads[i] * state[j]);
          const update = currentLr * weightGrad;
          this.q_network.w1[j][i] = this._checkNaN(this.q_network.w1[j][i] + update);
        }
        const biasUpdate = currentLr * hidden1Grads[i];
        this.q_network.b1[i] = this._checkNaN(this.q_network.b1[i] + biasUpdate);
      }
    }

    this.stepCounter++;
    if (this.stepCounter % this.targetUpdateFrequency === 0) {
      this.updateTargetNetwork();
    }

    return totalLoss / this.batchSize;
  }
}

// ============================================================================
// TRADING LOGIC
// ============================================================================

const calculateInputs = (allCandles, currentPrice, agent) => {
  if (allCandles.length < 20) return Array(CONFIG.INPUT_SIZE).fill(0);

  const stateType = agent.stateFeatures || 'standard';

  const sma5 = calculateSMA(allCandles, 5);
  const sma20 = calculateSMA(allCandles, 20);
  const sma50 = calculateSMA(allCandles, 50);
  const volatility10 = calculateVolatility(allCandles, 10);

  const prevClose = allCandles[allCandles.length - 2]?.c || currentPrice;
  const priceChange = (currentPrice - prevClose) / prevClose;

  let smaDist = 0;
  if (stateType === 'long-term' || stateType === 'trend') {
    smaDist = sma50 ? (currentPrice - sma50) / sma50 : 0;
  } else if (stateType === 'mean-reversion') {
    smaDist = sma20 ? (currentPrice - sma20) / sma20 : 0;
  } else {
    smaDist = sma20 ? (currentPrice - sma20) / sma20 : 0;
  }
  smaDist = Math.max(-1, Math.min(1, smaDist * 10));

  const maxVol = allCandles.slice(-50).reduce((max, d, i, arr) => {
    if (i < 10) return max;
    const vol = calculateVolatility(arr.slice(0, i + 1), 10);
    return Math.max(max, vol);
  }, 0.001);
  let normVolatility = volatility10 / maxVol;
  if (stateType === 'volatility') {
    normVolatility *= 1.5;
  }
  normVolatility = Math.min(1, normVolatility);

  const maxChange = allCandles.slice(-20).reduce((max, d, i, arr) => {
    if (i === 0) return max;
    const change = Math.abs((d.c - arr[i - 1].c) / arr[i - 1].c);
    return Math.max(max, change);
  }, 0.01);
  let normPriceChange = priceChange / maxChange;
  if (stateType === 'short-term' || stateType === 'scalper') {
    normPriceChange *= 1.5;
  }
  normPriceChange = Math.max(-1, Math.min(1, normPriceChange));

  let trend = 0;
  if (sma5 && sma20 && sma50) {
    if (stateType === 'contrarian') {
      trend = sma5 < sma20 ? 0.5 : -0.5;
      trend += sma20 < sma50 ? 0.5 : -0.5;
    } else {
      trend = sma5 > sma20 ? 0.5 : -0.5;
      trend += sma20 > sma50 ? 0.5 : -0.5;
    }
  }

  const positionSize = agent.shares > 0 ?
    (agent.shares * currentPrice) / agent.portfolioValue : 0;

  let unrealizedPnL = 0;
  const lastBuyTrade = [...agent.history].reverse().find(h => h.type === 'BUY');
  if (lastBuyTrade && agent.shares > 0) {
    unrealizedPnL = (currentPrice - lastBuyTrade.price) / lastBuyTrade.price;
    unrealizedPnL = Math.max(-1, Math.min(1, unrealizedPnL * 10));
  }

  let momentum = 0;
  if (allCandles.length >= 10) {
    const recentChanges = allCandles.slice(-10).map((d, i, arr) => {
      if (i === 0) return 0;
      return (d.c - arr[i - 1].c) / arr[i - 1].c;
    });
    const avgChange = recentChanges.reduce((a, b) => a + b, 0) / recentChanges.length;
    momentum = Math.max(-1, Math.min(1, avgChange * 100));

    if (stateType === 'momentum') {
      momentum *= 1.5;
    }
  }

  return [smaDist, normVolatility, normPriceChange, trend, positionSize, unrealizedPnL, momentum];
};

const calculateReward = (agent, action, pnl, currentPrice, allCandles) => {
  const rewardType = agent.rewardType || 'balanced';
  let reward = 0;

  const lastBuyTrade = [...agent.history].reverse().find(h => h.type === 'BUY');
  const holdTime = lastBuyTrade ? allCandles.length - allCandles.findIndex(c => c.t === lastBuyTrade.t) : 0;

  // Normalize PnL to percentage of initial cash for stability
  const pnlPercent = pnl / CONFIG.INITIAL_CASH * 100;

  switch (rewardType) {
    case 'scalper':
      if (action === 2 && pnl > 0) {
        reward = pnlPercent * (holdTime < 10 ? 1.5 : 1.0);
      } else if (action === 2 && pnl < 0) {
        reward = pnlPercent * 2; // Stronger penalty for losses
      } else if (action === 0) {
        reward = -0.1;
      } else if (action === 1 && agent.shares > 0) {
        reward = -0.02 * holdTime; // Penalty for holding
      }
      break;

    case 'trend':
      if (action === 2 && pnl > 0) {
        reward = pnlPercent * (1 + holdTime / 50);
      } else if (action === 2 && pnl < 0) {
        reward = pnlPercent * 1.5;
      } else if (action === 1 && agent.shares > 0) {
        const unrealized = lastBuyTrade ? (currentPrice - lastBuyTrade.price) / lastBuyTrade.price : 0;
        reward = unrealized > 0 ? 0.05 : -0.03;
      } else if (action === 0) {
        reward = -0.03;
      }
      break;

    case 'momentum':
      if (action === 0) {
        const sma5 = calculateSMA(allCandles, 5);
        const sma20 = calculateSMA(allCandles, 20);
        if (sma5 && sma20 && sma5 > sma20) {
          reward = 0.1;
        } else {
          reward = -0.2;
        }
      } else if (action === 2) {
        reward = pnlPercent;
      }
      break;

    case 'mean-reversion':
      if (action === 0) {
        const sma20 = calculateSMA(allCandles, 20);
        if (sma20 && currentPrice < sma20 * 0.98) {
          reward = 0.15;
        }
      } else if (action === 2 && pnl > 0 && holdTime < 20) {
        reward = pnlPercent * 1.5;
      } else if (action === 2 && pnl < 0) {
        reward = pnlPercent * 1.5;
      }
      break;

    case 'aggressive':
      if (action === 2) {
        reward = pnlPercent * 1.5; // Amplified but not crazy
      } else if (action === 0) {
        reward = -0.05;
      }
      break;

    case 'conservative':
      if (action === 2 && pnl < 0) {
        reward = pnlPercent * 3; // Heavy penalty
      } else if (action === 2 && pnl > 0) {
        reward = pnlPercent * 0.8;
      } else if (action === 1 && agent.shares > 0) {
        reward = 0.01;
      }
      break;

    case 'volatility':
      const volatility = calculateVolatility(allCandles, 10);
      const avgVol = allCandles.slice(-50).reduce((sum, d, i, arr) => {
        if (i < 10) return sum;
        return sum + calculateVolatility(arr.slice(0, i + 1), 10);
      }, 0) / Math.max(1, allCandles.length - 10);

      if (volatility > avgVol * 1.2) {
        if (action === 0 || (action === 2 && Math.abs(pnl) > CONFIG.INITIAL_CASH * 0.01)) {
          reward = 0.15;
        }
      }
      if (action === 2) {
        reward += pnlPercent;
      }
      break;

    case 'contrarian':
      if (action === 0) {
        const sma5 = calculateSMA(allCandles, 5);
        const sma20 = calculateSMA(allCandles, 20);
        if (sma5 && sma20 && sma5 < sma20) {
          reward = 0.12;
        }
      } else if (action === 2) {
        reward = pnlPercent * 1.2;
      }
      break;

    case 'balanced':
    default:
      if (action === 2) {
        reward = pnlPercent;
      } else if (action === 0) {
        reward = -0.05;
      } else if (action === 1 && agent.shares > 0) {
        const unrealized = lastBuyTrade ? (currentPrice - lastBuyTrade.price) / lastBuyTrade.price : 0;
        reward = unrealized * 0.05;
      }
      break;
  }

  // Clip reward to prevent extreme values
  return Math.max(-10, Math.min(10, reward));
};

const getAction = (qValues, epsilon, shares) => {
  const isExploring = Math.random() < epsilon;
  let action = 1;

  if (isExploring) {
    action = Math.floor(Math.random() * CONFIG.ACTION_SIZE);
  } else {
    action = qValues.reduce((maxIndex, currentQ, i) =>
      currentQ > qValues[maxIndex] ? i : maxIndex, 0);
  }

  if (shares > 0 && action === 0) action = 1;
  if (shares === 0 && action === 2) action = 1;

  return action;
};

// ============================================================================
// CHART COMPONENTS
// ============================================================================

const MainCandleChart = ({ data, agents, width, height }) => {
  const displayData = data.slice(-100);
  const actualWidth = width;

  if (!displayData || displayData.length < 2) return (
    <div style={{ color: '#94a3b8', padding: '40px', textAlign: 'center', fontSize: '14px' }}>
      Waiting for market data...
    </div>
  );

  const maxPrice = Math.max(...displayData.map(d => d.h));
  const minPrice = Math.min(...displayData.map(d => d.l));
  const range = maxPrice - minPrice || 1;
  const scaleY = (p) => height - ((p - minPrice) / range) * height;
  const candleWidth = (actualWidth / displayData.length) * 0.7;

  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${actualWidth} ${height}`} style={{ overflow: 'visible', maxWidth: '100%' }}>
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
            <line x1={x + candleWidth / 2} y1={yHigh} x2={x + candleWidth / 2} y2={yLow} stroke={isGreen ? THEME.success : THEME.danger} strokeWidth="1" />
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
    <div style={{ color: '#475569', fontSize: '10px', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      Initializing...
    </div>
  );

  const maxPrice = Math.max(...data.map(d => d.h));
  const minPrice = Math.min(...data.map(d => d.l));
  const range = maxPrice - minPrice || 1;
  const scaleY = (p) => height - ((p - minPrice) / range) * height;
  const candleWidth = (width / data.length) * 0.8;

  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} style={{ overflow: 'visible', maxWidth: '100%' }}>
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
    <div style={{ color: '#94a3b8', fontSize: '12px', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
      <line x1="0" y1={scaleY(CONFIG.INITIAL_CASH)} x2={width} y2={scaleY(CONFIG.INITIAL_CASH)} stroke="#64748b" strokeDasharray="2,2" opacity="0.5" />
      <polyline points={points} fill="none" stroke={color} strokeWidth="2" />
      <text x={width - 40} y={scaleY(CONFIG.INITIAL_CASH) - 5} fontSize="10" fill="#64748b">Start</text>
    </svg>
  );
};

const WeightsDisplay = ({ weights, bias, agentId }) => {
  const [showFullWeights, setShowFullWeights] = useState(false);
  
  if (!weights || !weights.w1 || !Array.isArray(weights.w1)) {
    return null;
  }

  const w1 = weights.w1.flat().slice(0, 4);
  const b1 = bias?.b1?.[0] ?? 0;

  if (w1.length === 0 || w1.some(v => v === null || v === undefined)) {
    return null;
  }

  const copyWeights = () => {
    const weightsData = {
      w1: weights.w1,
      b1: weights.b1,
      w2: weights.w2,
      b2: weights.b2,
      w3: weights.w3,
      b3: weights.b3
    };
    navigator.clipboard.writeText(JSON.stringify(weightsData, null, 2));
    alert('Weights copied to clipboard! 📋');
  };

  return (
    <div style={{ display: 'inline-block' }}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setShowFullWeights(true);
        }}
        style={{
          backgroundColor: '#1e293b',
          color: '#94a3b8',
          border: 'none',
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '10px',
          cursor: 'pointer',
          fontFamily: 'monospace'
        }}
        title="View full weights"
      >
        🧠 [{w1.map(v => v.toFixed(2)).join(',')}...]
      </button>

      {showFullWeights && (
        <WeightsModal
          weights={weights}
          bias={bias}
          agentId={agentId}
          onClose={() => setShowFullWeights(false)}
          onCopy={copyWeights}
        />
      )}
    </div>
  );
};

const WeightsModal = ({ weights, bias, agentId, onClose, onCopy }) => {
  const [updateKey, setUpdateKey] = useState(0);

  // Force re-render every 500ms to show live updates
  useEffect(() => {
    const interval = setInterval(() => {
      setUpdateKey(prev => prev + 1);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const renderWeightMatrix = (matrix, label, colorize = true) => {
    if (!matrix || !Array.isArray(matrix)) return null;

    return (
      <div style={{ marginBottom: '16px' }}>
        <div style={{ fontSize: '11px', fontWeight: '600', color: '#64748b', marginBottom: '8px' }}>
          {label} ({matrix.length} × {matrix[0]?.length || 0})
        </div>
        <div style={{
          backgroundColor: '#0f172a',
          padding: '12px',
          borderRadius: '8px',
          maxHeight: '200px',
          overflowY: 'auto',
          fontFamily: 'monospace',
          fontSize: '10px',
          color: '#e2e8f0'
        }}>
          {matrix.map((row, i) => (
            <div key={`${i}-${updateKey}`} style={{ marginBottom: '4px', whiteSpace: 'nowrap', overflowX: 'auto' }}>
              {Array.isArray(row) ? (
                row.map((val, j) => (
                  <span
                    key={j}
                    style={{
                      color: colorize ? (val > 0 ? '#4ade80' : val < 0 ? '#f87171' : '#94a3b8') : '#e2e8f0',
                      marginRight: '8px',
                      display: 'inline-block',
                      minWidth: '60px'
                    }}
                  >
                    {val.toFixed(4)}
                  </span>
                ))
              ) : (
                <span style={{ color: colorize ? (row > 0 ? '#4ade80' : row < 0 ? '#f87171' : '#94a3b8') : '#e2e8f0' }}>
                  {row.toFixed(4)}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const getWeightStats = (matrix) => {
    const flat = Array.isArray(matrix[0]) ? matrix.flat() : matrix;
    const positive = flat.filter(v => v > 0).length;
    const negative = flat.filter(v => v < 0).length;
    const zero = flat.filter(v => v === 0).length;
    const avg = flat.reduce((a, b) => a + b, 0) / flat.length;
    const max = Math.max(...flat);
    const min = Math.min(...flat);
    
    return { positive, negative, zero, avg, max, min, total: flat.length };
  };

  return (
    <div 
      style={styles.modalOverlay} 
      onClick={onClose}
    >
      <div 
        style={{ 
          ...styles.modalContent, 
          maxWidth: '800px',
          maxHeight: '90vh'
        }} 
        onClick={e => e.stopPropagation()}
      >
        <div style={styles.cardHeader}>
          <div>
            <h2 style={{ margin: 0, fontSize: '16px', fontWeight: '700' }}>
              🧠 Neural Network Weights (Live)
            </h2>
            <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
              Agent ID: {agentId} • Updates every 500ms
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button
              onClick={onCopy}
              style={{
                ...styles.btn,
                ...styles.btnSecondary,
                fontSize: '11px',
                padding: '6px 10px'
              }}
            >
              📋 Copy JSON
            </button>
            <button 
              onClick={onClose} 
              style={{ 
                border: 'none', 
                background: 'none', 
                fontSize: '24px', 
                cursor: 'pointer', 
                color: '#64748b' 
              }}
            >
              ×
            </button>
          </div>
        </div>

        <div style={{ padding: '20px', overflowY: 'auto', flex: 1 }}>
          {/* Weight Statistics */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '12px', 
            marginBottom: '24px' 
          }}>
            {['w1', 'w2', 'w3'].map(layer => {
              const stats = getWeightStats(weights[layer]);
              return (
                <div 
                  key={layer}
                  style={{
                    backgroundColor: '#f8fafc',
                    padding: '12px',
                    borderRadius: '8px',
                    border: `1px solid ${THEME.border}`
                  }}
                >
                  <div style={{ fontSize: '12px', fontWeight: '700', marginBottom: '8px', color: THEME.primary }}>
                    Layer {layer.slice(1)} Statistics
                  </div>
                  <div style={{ fontSize: '10px', color: '#64748b', lineHeight: '1.6' }}>
                    <div>Total: {stats.total}</div>
                    <div style={{ color: THEME.success }}>Positive: {stats.positive}</div>
                    <div style={{ color: THEME.danger }}>Negative: {stats.negative}</div>
                    <div>Avg: {stats.avg.toFixed(4)}</div>
                    <div>Range: [{stats.min.toFixed(3)}, {stats.max.toFixed(3)}]</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Layer 1: Input -> Hidden1 */}
          {renderWeightMatrix(weights.w1, `W1: Input (${CONFIG.INPUT_SIZE}) → Hidden1`)}
          {renderWeightMatrix([bias.b1], 'B1: Hidden1 Bias')}

          {/* Layer 2: Hidden1 -> Hidden2 */}
          {renderWeightMatrix(weights.w2, 'W2: Hidden1 → Hidden2')}
          {renderWeightMatrix([bias.b2], 'B2: Hidden2 Bias')}

          {/* Layer 3: Hidden2 -> Output */}
          {renderWeightMatrix(weights.w3, `W3: Hidden2 → Output (${CONFIG.ACTION_SIZE})`)}
          {renderWeightMatrix([bias.b3], 'B3: Output Bias')}

          {/* Network Architecture Diagram */}
          <div style={{
            marginTop: '24px',
            padding: '16px',
            backgroundColor: '#fef3c7',
            borderRadius: '8px',
            border: '1px solid #fbbf24'
          }}>
            <div style={{ fontSize: '11px', fontWeight: '600', color: '#92400e', marginBottom: '8px' }}>
              📐 Network Architecture
            </div>
            <div style={{ 
              fontFamily: 'monospace', 
              fontSize: '11px', 
              color: '#78350f',
              lineHeight: '1.8'
            }}>
              Input ({CONFIG.INPUT_SIZE}) → ReLU → Hidden1 ({weights.w1[0].length}) → ReLU → Hidden2 ({weights.w2[0].length}) → Linear → Output ({CONFIG.ACTION_SIZE})
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// MODAL COMPONENTS
// ============================================================================

const ModelInfoModal = ({ agent, onClose }) => {
  if (!agent) return null;

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={{ ...styles.modalContent, maxWidth: '600px' }} onClick={e => e.stopPropagation()}>
        <div style={styles.cardHeader}>
          <div>
            <h2 style={{ margin: 0, fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: agent.color }}></span>
              {agent.name}
            </h2>
            <div style={{ fontSize: '12px', color: agent.color, marginTop: '4px' }}>{agent.type}</div>
          </div>
          <button onClick={onClose} style={{ border: 'none', background: 'none', fontSize: '24px', cursor: 'pointer', color: '#64748b' }}>×</button>
        </div>

        <div style={{ padding: '24px', overflowY: 'auto' }}>
          <div style={{ marginBottom: '20px' }}>
            <div style={{ ...styles.label, marginBottom: '8px' }}>DESCRIPTION</div>
            <p style={{ margin: 0, lineHeight: '1.6', color: '#475569' }}>{agent.description}</p>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <div style={{ ...styles.label, marginBottom: '8px' }}>STRATEGY DETAILS</div>
            <p style={{ margin: 0, lineHeight: '1.6', color: '#475569' }}>{agent.strategy}</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
            <div style={{ padding: '12px', backgroundColor: '#f8fafc', borderRadius: '8px', border: `1px solid ${THEME.border}` }}>
              <div style={styles.label}>LEARNING RATE</div>
              <div style={{ fontSize: '18px', fontWeight: '700', color: THEME.primary }}>{agent.lr}</div>
              <div style={{ fontSize: '10px', color: '#64748b', marginTop: '4px' }}>
                {agent.lr >= 0.01 ? 'Very Fast' : agent.lr >= 0.005 ? 'Fast' : agent.lr >= 0.002 ? 'Moderate' : agent.lr > 0 ? 'Slow' : 'N/A'}
              </div>
            </div>

            <div style={{ padding: '12px', backgroundColor: '#f8fafc', borderRadius: '8px', border: `1px solid ${THEME.border}` }}>
              <div style={styles.label}>RISK PROFILE</div>
              <div style={{ fontSize: '18px', fontWeight: '700', color: agent.risk === 'high' ? THEME.danger : agent.risk === 'med' ? THEME.warning : agent.risk === 'passive' ? '#64748b' : THEME.success }}>
                {agent.risk === 'high' ? 'HIGH' : agent.risk === 'med' ? 'MEDIUM' : agent.risk === 'passive' ? 'PASSIVE' : 'LOW'}
              </div>
            </div>
          </div>

          {agent.model && (
            <div style={{ marginBottom: '20px' }}>
              <div style={{ ...styles.label, marginBottom: '8px' }}>NETWORK ARCHITECTURE</div>
              <div style={{ backgroundColor: THEME.terminalBg, padding: '12px', borderRadius: '8px', fontFamily: 'monospace', fontSize: '12px', color: THEME.terminalText }}>
                Input Layer: {CONFIG.INPUT_SIZE} neurons<br />
                Hidden Layer 1: {agent.hiddenSize || agent.model.hidden1} neurons (ReLU)<br />
                Hidden Layer 2: {agent.hiddenSize2 || agent.model.hidden2} neurons (ReLU)<br />
                Output Layer: {CONFIG.ACTION_SIZE} neurons (Linear)
              </div>
            </div>
          )}

          <div style={{ padding: '16px', backgroundColor: '#fef3c7', borderRadius: '8px', border: '1px solid #fbbf24' }}>
            <div style={{ fontSize: '12px', fontWeight: '600', color: '#92400e', marginBottom: '8px' }}>⚠️ BEHAVIORAL CHARACTERISTICS</div>
            <ul style={{ margin: 0, paddingLeft: '20px', color: '#78350f', fontSize: '12px', lineHeight: '1.6' }}>
              {agent.rewardType === 'scalper' && (
                <>
                  <li>Optimized for frequent, small profits</li>
                  <li>Penalized for holding positions too long</li>
                  <li>Emphasizes short-term price action</li>
                </>
              )}
              {agent.rewardType === 'trend' && (
                <>
                  <li>Rewards holding winning positions longer</li>
                  <li>Uses longer-term trend indicators</li>
                  <li>Patient entry and exit strategy</li>
                </>
              )}
              {agent.rewardType === 'momentum' && (
                <>
                  <li>Detects and rides directional moves</li>
                  <li>Rewards quick entry on breakouts</li>
                  <li>Amplifies momentum signals</li>
                </>
              )}
              {agent.rewardType === 'mean-reversion' && (
                <>
                  <li>Buys dips, sells peaks</li>
                  <li>Emphasizes SMA distance</li>
                  <li>Best in range-bound markets</li>
                </>
              )}
              {agent.rewardType === 'aggressive' && (
                <>
                  <li>Amplified rewards for large gains</li>
                  <li>Accepts larger drawdowns</li>
                  <li>Thrives in volatile conditions</li>
                </>
              )}
              {agent.rewardType === 'conservative' && (
                <>
                  <li>Heavy penalty for losses</li>
                  <li>Capital preservation focus</li>
                  <li>Rewards risk-adjusted returns</li>
                </>
              )}
              {agent.rewardType === 'volatility' && (
                <>
                  <li>Specialized for chaotic markets</li>
                  <li>Heavy weighting on volatility signals</li>
                  <li>Aggressive during breakouts</li>
                </>
              )}
              {agent.rewardType === 'contrarian' && (
                <>
                  <li>Fades trends and extremes</li>
                  <li>Inverted trend signals</li>
                  <li>Profits from reversals</li>
                </>
              )}
              {agent.rewardType === 'balanced' && (
                <>
                  <li>General-purpose trader</li>
                  <li>Balanced risk-reward approach</li>
                  <li>Adapts to various market conditions</li>
                </>
              )}
              {agent.rewardType === 'none' && (
                <>
                  <li>Rule-based or passive strategy</li>
                  <li>No machine learning involved</li>
                  <li>Benchmark comparison agent</li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatisticsModal = ({ agents, onClose, assetPrice, startPrice }) => {
  const agentStats = agents.map(agent => {
    const wins = agent.history.filter(h => h.type === 'SELL' && h.pnl > 0).length;
    const losses = agent.history.filter(h => h.type === 'SELL' && h.pnl < 0).length;
    const totalTrades = wins + losses;
    const winRate = totalTrades > 0 ? (wins / totalTrades) * 100 : 0;
    const returns = ((agent.portfolioValue - CONFIG.INITIAL_CASH) / CONFIG.INITIAL_CASH) * 100;

    return {
      ...agent,
      winRate,
      returns,
      totalTrades,
      wins,
      losses
    };
  });

  const sortedByWinRate = [...agentStats].sort((a, b) => b.winRate - a.winRate);
  const sortedByReturns = [...agentStats].sort((a, b) => b.returns - a.returns);

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={{ ...styles.modalContent, maxWidth: '1000px', maxHeight: '90vh' }} onClick={e => e.stopPropagation()}>
        <div style={styles.cardHeader}>
          <h2 style={{ margin: 0, fontSize: '18px' }}>📊 Simulation Statistics</h2>
          <button onClick={onClose} style={{ border: 'none', background: 'none', fontSize: '24px', cursor: 'pointer', color: '#64748b' }}>×</button>
        </div>

        <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '700', color: THEME.primary }}>🏆 Win Rate Rankings</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ textAlign: 'left', color: '#64748b', borderBottom: `2px solid ${THEME.border}` }}>
                    <th style={{ padding: '10px' }}>Rank</th>
                    <th style={{ padding: '10px' }}>Agent</th>
                    <th style={{ padding: '10px' }}>Win Rate</th>
                    <th style={{ padding: '10px' }}>Wins</th>
                    <th style={{ padding: '10px' }}>Losses</th>
                    <th style={{ padding: '10px' }}>Total Trades</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedByWinRate.map((agent, index) => (
                    <tr key={agent.id} style={{ borderBottom: `1px solid ${THEME.border}`, backgroundColor: index < 3 ? '#fef3c7' : 'transparent' }}>
                      <td style={{ padding: '10px', fontWeight: '700' }}>
                        {index === 0 && '🥇'}
                        {index === 1 && '🥈'}
                        {index === 2 && '🥉'}
                        {index > 2 && `#${index + 1}`}
                      </td>
                      <td style={{ padding: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: agent.color }}></span>
                          {agent.name}
                        </div>
                      </td>
                      <td style={{ padding: '10px', fontWeight: '700', fontSize: '15px', color: agent.winRate >= 60 ? THEME.success : agent.winRate >= 40 ? THEME.warning : THEME.danger }}>
                        {agent.winRate.toFixed(1)}%
                      </td>
                      <td style={{ padding: '10px', color: THEME.success }}>{agent.wins}</td>
                      <td style={{ padding: '10px', color: THEME.danger }}>{agent.losses}</td>
                      <td style={{ padding: '10px' }}>{agent.totalTrades}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div style={{ marginBottom: '32px' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '700', color: THEME.primary }}>💰 Returns Rankings</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ textAlign: 'left', color: '#64748b', borderBottom: `2px solid ${THEME.border}` }}>
                    <th style={{ padding: '10px' }}>Rank</th>
                    <th style={{ padding: '10px' }}>Agent</th>
                    <th style={{ padding: '10px' }}>Returns %</th>
                    <th style={{ padding: '10px' }}>Portfolio Value</th>
                    <th style={{ padding: '10px' }}>Net P&L</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedByReturns.map((agent, index) => (
                    <tr key={agent.id} style={{ borderBottom: `1px solid ${THEME.border}`, backgroundColor: index < 3 ? '#dcfce7' : 'transparent' }}>
                      <td style={{ padding: '10px', fontWeight: '700' }}>
                        {index === 0 && '🥇'}
                        {index === 1 && '🥈'}
                        {index === 2 && '🥉'}
                        {index > 2 && `#${index + 1}`}
                      </td>
                      <td style={{ padding: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: agent.color }}></span>
                          {agent.name}
                        </div>
                      </td>
                      <td style={{ padding: '10px', fontWeight: '700', fontSize: '15px', color: agent.returns >= 0 ? THEME.success : THEME.danger }}>
                        {agent.returns >= 0 ? '+' : ''}{agent.returns.toFixed(2)}%
                      </td>
                      <td style={{ padding: '10px', fontWeight: '600' }}>{fmt(agent.portfolioValue)}</td>
                      <td style={{ padding: '10px', color: agent.returns >= 0 ? THEME.success : THEME.danger }}>
                        {fmt(agent.portfolioValue - CONFIG.INITIAL_CASH)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '700', color: THEME.primary }}>📈 Equity Curves</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
              {agentStats.map(agent => (
                <div key={agent.id} style={{ padding: '16px', backgroundColor: '#f8fafc', borderRadius: '8px', border: `1px solid ${THEME.border}` }}>
                  <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: agent.color }}></span>
                    <span style={{ fontSize: '12px', fontWeight: '600' }}>{agent.name}</span>
                    <span style={{ marginLeft: 'auto', fontSize: '12px', fontWeight: '700', color: agent.returns >= 0 ? THEME.success : THEME.danger }}>
                      {agent.returns >= 0 ? '+' : ''}{agent.returns.toFixed(1)}%
                    </span>
                  </div>
                  <div style={{ height: '120px', backgroundColor: '#fff', borderRadius: '4px', padding: '8px' }}>
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

// ============================================================================
// STYLES
// ============================================================================

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
    position: 'relative',
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
    display: 'block'
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
}`;

// ============================================================================
// MAIN COMPONENT
// ============================================================================

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
  const [speed, setSpeed] = useState(CONFIG.TICK_RATE_DEFAULT);
  const [modelInfoAgent, setModelInfoAgent] = useState(null);
  const [showStatistics, setShowStatistics] = useState(false);

  const createInitialAgentState = (template) => ({
    ...template,
    isActive: true,
    cash: CONFIG.INITIAL_CASH,
    shares: 0,
    portfolioValue: CONFIG.INITIAL_CASH,
    prevValue: CONFIG.INITIAL_CASH,
    history: [],
    logs: [{ msg: "Agent Activated. Monitoring markets...", type: 'info' }],
    loss: 0,
    model: (template.id === 11 || template.id === 12) ? null : new DoubleDQN(
      CONFIG.INPUT_SIZE,
      CONFIG.ACTION_SIZE,
      template.hiddenSize || CONFIG.HIDDEN_SIZE,
      template.hiddenSize2 || CONFIG.HIDDEN_SIZE_2,
      template.lr,
      CONFIG.DISCOUNT_FACTOR
    ),
    epsilon: CONFIG.EPSILON_START,
    currentState: null,
    lastAction: 1,
    hasBoughtInitial: (template.id === 11 || template.id === 12) ? false : true,
    equityCurve: [CONFIG.INITIAL_CASH],
    persistentMemory: false
  });

  const [agents, setAgents] = useState(() => AGENT_TEMPLATES.map(createInitialAgentState));
  const wsRef = useRef(null);
  const candlesRef = useRef([]);
  const logRefs = useRef({});
  const chartRef = useRef(null);

  useEffect(() => {
    Object.values(logRefs.current).forEach(ref => {
      if (ref) {
        ref.scrollTop = ref.scrollHeight;
      }
    });
  }, [agents]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Stop everything first
    setIsRunning(false);
    
    const newAssetName = file.name.replace(/\.[^/.]+$/, "").toUpperCase();
    setAssetName(newAssetName);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
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

        if (parsed.length === 0) {
          alert('No valid data found in CSV');
          return;
        }

        setCustomData(parsed);
        setDataSource('UPLOAD');
        
        // Reset after data is loaded
        setTimeout(() => resetSimulation(), 100);
        
      } catch (error) {
        console.error('Error parsing CSV:', error);
        alert('Error parsing CSV file. Check console for details.');
      }
    };
    
    reader.onerror = () => {
      alert('Error reading file');
    };
    
    reader.readAsText(file);
    
    // Clear the file input so you can upload the same file again
    e.target.value = '';
  };

  const resetSimulation = () => {
    // Stop simulation first
    setIsRunning(false);
    
    // Clear WebSocket if exists
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    
    // Reset all state
    setDataIndex(0);
    setCandles([]);
    setAssetPrice(0);
    setStartPrice(null);
    candlesRef.current = [];
    setShowStatistics(false);
    
    // Reset agents with optional persistent memory
    setAgents(prev => AGENT_TEMPLATES.map((template, idx) => {
      const existing = prev[idx];
      const newState = createInitialAgentState(template);

      if (existing && existing.persistentMemory && existing.model) {
        try {
          const existingModel = existing.model;
          newState.model.q_network = JSON.parse(JSON.stringify(existingModel.q_network));
          newState.model.target_network = JSON.parse(JSON.stringify(existingModel.target_network));
          newState.persistentMemory = true;
          newState.logs = [{ msg: "Agent Restarted with Persistent Weights", type: 'info' }];
        } catch (error) {
          console.error('Error preserving model weights:', error);
          newState.logs = [{ msg: "Agent Restarted (weights reset due to error)", type: 'warning' }];
        }
      }
      return newState;
    }));
  };

  useEffect(() => {
    if (dataSource === 'BINANCE') {
      setAssetName('BTC');
      
      // Clean up existing WebSocket
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      
      // Create new WebSocket
      try {
        wsRef.current = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@kline_1s');

        wsRef.current.onmessage = (event) => {
          try {
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
          } catch (error) {
            console.error('WebSocket message error:', error);
          }
        };

        wsRef.current.onerror = (error) => {
          console.error('WebSocket error:', error);
        };

        wsRef.current.onclose = () => {
          console.log('WebSocket closed');
        };
        
      } catch (error) {
        console.error('WebSocket creation error:', error);
      }
    } else {
      // Close WebSocket when switching to UPLOAD mode
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    }
    
    return () => { 
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [dataSource]);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      try {
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
        setCandles(allCandles.slice(-100));

      setAgents(prevAgents => prevAgents.map(agent => {
        if (!agent.isActive) return agent;

        // Keep reference to the model to preserve training state
        const agentModel = agent.model;
        let action = 1;
        let reward = 0;

        const nextState = calculateInputs(allCandles, currentPrice, agent);
        const lastBuyPrice = agent.history.find(h => h.type === 'BUY')?.price;
        const previousState = agent.currentState;

        if (agent.id === 11) {
          if (!agent.hasBoughtInitial && currentPrice > 0) {
            action = 0;
          } else {
            action = 1;
          }
        } else if (agent.id === 12) {
          const sma5 = calculateSMA(allCandles, 5);
          if (!agent.hasBoughtInitial && currentPrice > 0) {
            action = 0;
          } else if (sma5 && currentPrice < sma5 * 0.98 && agent.shares === 0) {
            action = 0;
          } else if (lastBuyPrice && currentPrice > lastBuyPrice * 1.015 && agent.shares > 0) {
            action = 2;
          } else {
            action = 1;
          }
        }
        else if (agentModel) {
          const qValues = agentModel.predict(nextState);
          action = getAction(qValues, agent.epsilon, agent.shares);

          if (previousState) {
            reward = calculateReward(agent, agent.lastAction, 0, currentPrice, allCandles);
            agentModel.remember(previousState, agent.lastAction, reward, nextState, false);
            const trainLoss = agentModel.train();
            if (trainLoss !== undefined) {
              agent.loss = trainLoss; // Update loss directly on agent reference
            }
          }

          agent.epsilon = Math.max(CONFIG.MIN_EPSILON, agent.epsilon * CONFIG.EPSILON_DECAY);
        }

        let pnl = 0;
        let tradeType = null;
        let newShares = agent.shares;
        let newCash = agent.cash;
        let newLogs = [...agent.logs.slice(-20)];
        let newHistory = [...agent.history];

        // STOP LOSS / TAKE PROFIT CHECK (BEFORE ACTION EXECUTION)
        if (agent.id !== 11 && agent.shares > 0 && lastBuyPrice) {
          const unrealizedPnlPct = ((currentPrice - lastBuyPrice) / lastBuyPrice) * 100;

          if (unrealizedPnlPct >= takeProfitPct) {
            action = 2; // Force SELL
            tradeType = 'SELL_TP';
            newLogs.push({ msg: `✅ Take Profit Hit! (+${unrealizedPnlPct.toFixed(2)}%)`, type: 'success' });
          } else if (unrealizedPnlPct <= -stopLossPct) {
            action = 2; // Force SELL
            tradeType = 'SELL_SL';
            newLogs.push({ msg: `🛑 Stop Loss Hit! (-${Math.abs(unrealizedPnlPct).toFixed(2)}%)`, type: 'danger' });
          }
        }

        // Execute Action
        if (action === 0) {
          let cashToUse = newCash;
          if (agent.id === 11) {
            cashToUse = newCash;
          } else if (agent.id === 12 && !agent.hasBoughtInitial) {
            cashToUse = newCash * 0.25;
          } else {
            cashToUse = newCash * 0.98;
          }

          const sharesToBuy = cashToUse / currentPrice * (1 - CONFIG.COMMISSION);

          newShares += sharesToBuy;
          newCash -= cashToUse;

          newHistory.push({ type: 'BUY', price: currentPrice, amount: sharesToBuy, t: currentCandle.t });
          newLogs.push({ msg: `BUY: ${sharesToBuy.toFixed(4)} @ ${currentPrice.toFixed(2)}`, type: 'success' });
          agent.hasBoughtInitial = true;
          tradeType = 'BUY';

        } else if (action === 2) {
          const sharesToSell = newShares;

          let totalCost = 0;
          let remainingShares = sharesToSell;

          let tempHistory = [];
          for (let i = 0; i < newHistory.length; i++) {
            const item = newHistory[i];
            if (item.type === 'BUY') {
              const sharesFromThisBuy = Math.min(remainingShares, item.amount);
              totalCost += sharesFromThisBuy * item.price / (1 - CONFIG.COMMISSION);
              remainingShares -= sharesFromThisBuy;
              if (sharesFromThisBuy < item.amount) {
                tempHistory.push({ ...item, amount: item.amount - sharesFromThisBuy });
              }
            } else {
              tempHistory.push(item);
            }
          }

          const saleAmount = sharesToSell * currentPrice * (1 - CONFIG.COMMISSION);
          pnl = saleAmount - totalCost;

          newCash += saleAmount;
          newShares = 0;

          newHistory = [...tempHistory.filter(h => h.type === 'SELL' || h.amount > 0)];
          newHistory.push({ type: 'SELL', price: currentPrice, amount: sharesToSell, t: currentCandle.t, pnl: pnl });
          newLogs.push({ msg: `SELL (${tradeType || 'AI'}): PnL ${fmt(pnl)}`, type: pnl >= 0 ? 'success' : 'danger' });
          tradeType = tradeType || 'SELL';

          if (agentModel) {
            reward = calculateReward(agent, action, pnl, currentPrice, allCandles);
          }
        } else {
          tradeType = 'HOLD';
        }

        const finalPortfolioValue = newCash + newShares * currentPrice;
        const newEquityCurve = [...agent.equityCurve, finalPortfolioValue];

        // Return updated agent with preserved model reference
        return {
          ...agent,
          model: agentModel, // Preserve the actual model instance
          cash: newCash,
          shares: newShares,
          portfolioValue: finalPortfolioValue,
          prevValue: agent.portfolioValue,
          history: newHistory,
          logs: newLogs,
          candles: allCandles.slice(-30),
          lastAction: action,
          currentState: nextState,
          equityCurve: newEquityCurve,
        };
      }));
      } catch (error) {
        console.error('Game loop error:', error);
        setIsRunning(false);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [isRunning, speed, dataSource, dataIndex, customData, startPrice, stopLossPct, takeProfitPct]);

  const toggleAgent = (id) => {
    setAgents(prev => prev.map(a => a.id === id ? {
      ...a,
      isActive: !a.isActive,
      logs: a.isActive ? [...a.logs, { msg: "Paused.", type: 'warning' }] : [...a.logs, { msg: "Agent Activated.", type: 'info' }]
    } : a));
  };

  const togglePersistentMemory = (id) => {
    setAgents(prev => prev.map(a => {
      if (a.id !== id) return a;

      const isNowPersistent = !a.persistentMemory;
      let newModel = a.model;

      if (isNowPersistent && a.model) {
        newModel.updateTargetNetwork();
      }

      return {
        ...a,
        persistentMemory: isNowPersistent,
        model: newModel,
        logs: [...a.logs, { msg: `Persistent Memory: ${isNowPersistent ? 'ENABLED' : 'DISABLED'}`, type: isNowPersistent ? 'info' : 'warning' }]
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
            <div style={{ fontSize: '18px', fontWeight: '800', color: THEME.primary, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>❄️</span> SnowAI <span style={{ color: '#94a3b8', fontWeight: 400 }}>Training Sim v3.0 (Full DDQN)</span>
            </div>
            <div className="header-controls">
              <div style={{ textAlign: 'right' }}>
                <div style={styles.label}>{assetName} PRICE</div>
                <div style={{ fontSize: '16px', fontWeight: '700', fontFamily: 'monospace' }}>{fmt(assetPrice)}</div>
              </div>
              <button
                style={{ ...styles.btn, ...styles.btnSecondary }}
                onClick={() => setShowStatistics(true)}
                disabled={candles.length === 0}
              >
                📊 STATS
              </button>
              <button
                style={{ ...styles.btn, ...(isRunning ? { backgroundColor: THEME.danger, color: 'white' } : styles.btnPrimary), width: '120px' }}
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
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button style={{ ...styles.btn, flex: 1, ...(dataSource === 'BINANCE' ? styles.btnPrimary : styles.btnSecondary) }} onClick={() => { setDataSource('BINANCE'); resetSimulation(); }}>Live ({assetName})</button>
                  <button style={{ ...styles.btn, flex: 1, ...(dataSource === 'UPLOAD' ? styles.btnPrimary : styles.btnSecondary) }} onClick={() => document.getElementById('fileUpload').click()}>CSV Upload</button>
                </div>
                <input type="file" id="fileUpload" hidden accept=".csv,.txt" onChange={handleFileUpload} />
              </div>
              <div>
                <div style={styles.label}>RISK SETTINGS</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <span style={{ fontSize: '10px', color: '#64748b' }}>Take Profit %</span>
                    <input type="number" style={styles.input} value={takeProfitPct} onChange={(e) => setTakeProfitPct(Number(e.target.value))} />
                  </div>
                  <div>
                    <span style={{ fontSize: '10px', color: '#64748b' }}>Stop Loss %</span>
                    <input type="number" style={styles.input} value={stopLossPct} onChange={(e) => setStopLossPct(Number(e.target.value))} />
                  </div>
                </div>
              </div>

              <div>
                <div style={styles.label}>SPEED ({speed}ms)</div>
                <input type="range" min="20" max="1000" step="10" value={speed} onChange={(e) => setSpeed(Number(e.target.value))} style={{ width: '100%' }} />
              </div>

              <div style={{ marginTop: 'auto', paddingTop: '20px', borderTop: `1px solid ${THEME.border}` }}>
                <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '10px' }}>MODEL ROSTER</div>
                {agents.map(a => (
                  <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', fontSize: '12px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: a.color }}></div>
                    <span style={{ flex: 1, cursor: 'pointer' }} onClick={() => setModelInfoAgent(a)} title="Click for details">{a.name}</span>
                    <span style={{ color: a.portfolioValue >= CONFIG.INITIAL_CASH ? THEME.success : THEME.danger }}>{((a.portfolioValue - CONFIG.INITIAL_CASH) / CONFIG.INITIAL_CASH * 100).toFixed(1)}%</span>
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
                  <div key={agent.id} style={{ ...styles.card, opacity: agent.isActive ? 1 : 0.85 }}>
                    <div style={styles.cardHeader}>
                      <div>
                        <div style={{ fontWeight: '700', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {agent.name}
                          <button
                            onClick={() => setModelInfoAgent(agent)}
                            style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '14px', padding: '0', color: '#64748b' }}
                            title="Model Info"
                          >
                            ℹ️
                          </button>
                          {agent.model && agent.model.q_network && <WeightsDisplay weights={agent.model.q_network} bias={agent.model.q_network} agentId={agent.id} />}
                        </div>
                        <div style={{ fontSize: '11px', color: agent.color }}>{agent.type}</div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: '700', color: agent.portfolioValue >= CONFIG.INITIAL_CASH ? THEME.success : THEME.danger }}>{fmt(agent.portfolioValue)}</div>
                      </div>
                    </div>

                    <div style={styles.terminal} onClick={() => !agent.isActive && toggleAgent(agent.id)}>
                      {!agent.isActive && <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.1)', zIndex: 2, cursor: 'pointer' }}><span style={{ backgroundColor: THEME.primary, color: 'white', padding: '6px 12px', borderRadius: '20px', fontSize: '11px' }}>Click to Start</span></div>}

                      <div style={{ height: '80px', marginBottom: '8px', borderBottom: '1px dashed #334155' }}>
                        <MiniCandleChart data={agent.candles} trades={agent.history} width={280} height={80} />
                      </div>

                      <div
                        ref={el => logRefs.current[agent.id] = el}
                        style={styles.logArea}
                      >
                        {agent.logs.map((log, i) => (
                          <div key={i} style={{ marginBottom: '2px', color: log.type === 'danger' ? '#f87171' : log.type === 'success' ? '#4ade80' : log.type === 'warning' ? '#fbbf24' : '#94a3b8' }}>
                            {`> ${log.msg}`}
                          </div>
                        ))}
                        {agent.model && <div style={{ marginTop: '4px', color: '#64748b', fontSize: '10px' }}>
                          {`Buffer: ${agent.model.buffer.size()} | ε: ${agent.epsilon.toFixed(3)} | Loss: ${agent.loss.toFixed(4)}`}
                        </div>}
                      </div>
                    </div>

                    <div style={styles.cardFooter}>
                      <button style={{ ...styles.btn, ...styles.btnSecondary, flex: 1 }} onClick={() => toggleAgent(agent.id)}>
                        {agent.isActive ? '⏸ PAUSE' : '▶ RESUME'}
                      </button>
                      {agent.model && (
                        <button
                          style={{ ...styles.btn, ...styles.btnSecondary, flex: 1, color: agent.persistentMemory ? THEME.primary : '#475569' }}
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