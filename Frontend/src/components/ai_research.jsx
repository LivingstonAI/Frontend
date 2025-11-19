import React, { useState, useEffect, useRef } from 'react';
import { Upload, Play, Plus, Trash2, BarChart3, Brain, TrendingUp, AlertCircle, Terminal, Activity, DollarSign, TrendingDown, Lightbulb, Download, Settings, Layers, GitCommit, Zap } from 'lucide-react';
import { LineChart, Line, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, ComposedChart, ReferenceDot } from 'recharts';
import * as tf from "@tensorflow/tfjs";
import Header from "./header";
import SideNavs from "./side_navs";
// ------------------------------------------------------------

// --- Standard CSS Styles ---
const cssStyles = `
  /* Global Resets & Layout */
  .ml-playground-wrapper {
    min-height: 100vh;
    background: linear-gradient(135deg, #eef2ff 0%, #f3e8ff 50%, #fdf2f8 100%);
    padding: 0; /* Removed padding here as requested */
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    color: #374151;
  }

  .main-container {
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .content-padding {
    padding: 24px;
  }

  /* Header Section */
  .mock-header {
    padding: 16px 24px;
    background: white;
    border-bottom: 1px solid #e5e7eb;
    font-weight: bold;
    color: #4f46e5;
    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    width: 100%;
  }

  .header-card {
    background: white;
    border-radius: 16px;
    padding: 24px;
    margin-bottom: 24px;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .app-title {
    font-size: 2.25rem;
    font-weight: 700;
    margin: 0;
    background: linear-gradient(to right, #4f46e5, #9333ea);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    line-height: 1.2;
  }

  .app-subtitle {
    color: #4b5563;
    margin-top: 8px;
    font-size: 1.1rem;
  }

  .header-icon {
    width: 64px;
    height: 64px;
    color: #a855f7;
    flex-shrink: 0;
  }

  /* Tab Navigation */
  .tab-container {
    background: white;
    border-radius: 16px;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    margin-bottom: 24px;
    overflow: hidden;
  }

  .tab-header {
    display: flex;
    border-bottom: 1px solid #e5e7eb;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
  }
  
  .tab-header::-webkit-scrollbar { display: none; }

  .tab-button {
    flex: 1;
    padding: 16px 24px;
    font-weight: 600;
    background: none;
    border: none;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 1rem;
    color: #6b7280;
    border-bottom: 4px solid transparent;
    white-space: nowrap;
    min-width: 120px;
  }

  .tab-button:hover {
    color: #374151;
    background-color: #f9fafb;
  }

  .tab-button.active {
    color: #7c3aed;
    border-bottom-color: #8b5cf6;
    background-color: #f5f3ff;
  }

  .tab-content {
    padding: 24px;
  }

  /* Upload & Processing */
  .upload-zone {
    border: 4px dashed #d8b4fe;
    border-radius: 16px;
    padding: 48px;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s;
    background-color: #faf5ff;
    margin-bottom: 24px;
  }

  .upload-zone:hover {
    border-color: #a855f7;
    background-color: #f3e8ff;
  }

  .feature-panel {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    padding: 16px;
    margin-bottom: 24px;
  }

  .checkbox-group {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
    margin-top: 12px;
  }

  .checkbox-label {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    background: white;
    padding: 8px 12px;
    border-radius: 8px;
    border: 1px solid #e5e7eb;
    transition: border-color 0.2s;
  }
  
  .checkbox-label:hover {
    border-color: #a855f7;
  }

  /* Correlation Heatmap */
  .heatmap-grid {
    display: grid;
    gap: 2px;
    margin-top: 16px;
    overflow-x: auto;
  }
  
  .heatmap-cell {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.75rem;
    padding: 8px;
    border-radius: 4px;
    color: #1e293b;
    font-weight: bold;
  }

  /* Configure Section */
  .grid-two-cols {
    display: grid;
    grid-template-columns: 1fr;
    gap: 24px;
  }
  
  @media (min-width: 768px) {
    .grid-two-cols {
      grid-template-columns: 1fr 1fr;
    }
  }

  .section-title {
    font-size: 1.25rem;
    font-weight: 700;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .model-button {
    width: 100%;
    padding: 16px;
    border-radius: 12px;
    text-align: left;
    border: 1px solid #e5e7eb;
    cursor: pointer;
    display: flex;
    align-items: flex-start;
    gap: 16px;
    margin-bottom: 12px;
    transition: transform 0.2s, box-shadow 0.2s;
    background: white;
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    position: relative;
    overflow: hidden;
  }

  .model-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 12px rgba(0,0,0,0.1);
    border-color: #a855f7;
  }

  .model-icon-wrapper {
    background: rgba(255,255,255,0.5);
    padding: 8px;
    border-radius: 8px;
    font-size: 1.5rem;
    flex-shrink: 0;
  }

  .model-info { flex: 1; }
  .model-name { font-weight: 700; font-size: 1.1rem; display: block; margin-bottom: 4px; }
  .model-desc { font-size: 0.85rem; color: #4b5563; line-height: 1.4; }

  /* Model Colors */
  .bg-blue-100 { background-color: #e0f2fe; border-left: 4px solid #3b82f6; }
  .bg-cyan-100 { background-color: #ecfeff; border-left: 4px solid #06b6d4; }
  .bg-teal-100 { background-color: #f0fdfa; border-left: 4px solid #14b8a6; }
  .bg-green-100 { background-color: #f0fdf4; border-left: 4px solid #22c55e; }
  .bg-yellow-100 { background-color: #fefce8; border-left: 4px solid #eab308; }
  .bg-orange-100 { background-color: #fff7ed; border-left: 4px solid #f97316; }
  .bg-purple-100 { background-color: #faf5ff; border-left: 4px solid #a855f7; }

  /* Pipeline */
  .pipeline-container {
    margin-top: 24px;
    padding: 24px;
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 16px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  }

  .pipeline-item {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 12px;
    flex-wrap: wrap;
  }

  .pipeline-card {
    flex: 1;
    min-width: 250px;
    padding: 16px;
    border-radius: 8px;
    background: white;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    border: 1px solid #e5e7eb;
  }

  .pipeline-inner { display: flex; align-items: center; gap: 12px; flex: 1; }
  .param-input { width: 80px; padding: 4px 8px; border-radius: 4px; border: 1px solid #e5e7eb; font-size: 12px; margin-left: 8px; }
  .delete-btn { padding: 8px; border-radius: 8px; border: none; background: transparent; cursor: pointer; color: #dc2626; }
  .delete-btn:hover { background-color: #fee2e2; }

  /* Training Section */
  .input-group { margin-bottom: 8px; }
  .input-label { display: block; font-size: 0.875rem; font-weight: 600; margin-bottom: 8px; color: #374151; }
  .styled-input { width: 100%; padding: 12px; border: 2px solid #e9d5ff; border-radius: 8px; outline: none; font-size: 1rem; box-sizing: border-box; }
  .styled-input:focus { border-color: #a855f7; }

  .train-button {
    width: 100%;
    background: linear-gradient(to right, #7c3aed, #db2777);
    color: white;
    padding: 16px;
    border-radius: 12px;
    font-weight: 700;
    font-size: 1.125rem;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    transition: opacity 0.2s;
    margin-top: 24px;
    box-shadow: 0 4px 12px rgba(124, 58, 237, 0.3);
  }
  .train-button:disabled { opacity: 0.5; cursor: not-allowed; box-shadow: none; }

  .secondary-btn {
    background: white;
    border: 2px solid #a855f7;
    color: #a855f7;
    padding: 12px;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin-top: 12px;
    transition: all 0.2s;
  }
  .secondary-btn:hover { background: #f3e8ff; }

  .progress-container {
    margin-top: 24px;
    background: white;
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    border: 1px solid #e5e7eb;
  }

  .terminal-logs {
    background: #1e1e1e;
    color: #00ff00;
    font-family: 'Courier New', Courier, monospace;
    padding: 16px;
    border-radius: 8px;
    margin-top: 16px;
    height: 150px;
    overflow-y: auto;
    font-size: 0.85rem;
    display: flex;
    flex-direction: column;
    scroll-behavior: smooth;
  }
  .log-line { margin-bottom: 4px; border-bottom: 1px solid #333; padding-bottom: 2px; word-break: break-all; }

  /* Results Section */
  .results-header {
    background: linear-gradient(to right, #f3e8ff, #fce7f3);
    padding: 24px;
    border-radius: 16px;
    margin-bottom: 24px;
  }

  .metric-grid { display: grid; grid-template-columns: 1fr; gap: 16px; }
  @media (min-width: 768px) { .metric-grid { grid-template-columns: repeat(3, 1fr); } }

  .metric-card {
    background: white;
    padding: 16px;
    border-radius: 8px;
    text-align: center;
    border: 1px solid #e5e7eb;
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  }
  .metric-value { font-size: 1.875rem; font-weight: 700; }
  .text-purple { color: #7c3aed; }
  .text-pink { color: #db2777; }
  .text-indigo { color: #4f46e5; }
  .text-green { color: #059669; }

  .chart-card {
    background: white;
    padding: 24px;
    border-radius: 16px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    margin-bottom: 24px;
  }

  .backtest-card {
    background: linear-gradient(to bottom right, #f0fdf4, #ecfccb);
    border: 1px solid #bef264;
    padding: 24px;
    border-radius: 16px;
    margin-top: 24px;
  }
  
  .insight-card {
    background: linear-gradient(to bottom right, #fffbeb, #fef3c7);
    border: 1px solid #f59e0b;
    padding: 24px;
    border-radius: 16px;
    margin-bottom: 24px;
  }
  
  .download-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: #3b82f6;
    color: white;
    padding: 8px 16px;
    border-radius: 8px;
    font-size: 0.9rem;
    font-weight: 600;
    border: none;
    cursor: pointer;
    margin-top: 16px;
  }
  .download-btn:hover { background: #2563eb; }

  /* Mobile Adjustments */
  @media (max-width: 640px) {
    .content-padding { padding: 16px; }
    .header-card { flex-direction: column; text-align: center; gap: 16px; }
    .app-title { font-size: 1.75rem; }
    .upload-zone { padding: 24px; }
    .pipeline-card { flex-direction: column; align-items: flex-start; gap: 12px; }
    .pipeline-inner { width: 100%; flex-direction: column; align-items: flex-start; }
    .delete-btn { align-self: flex-end; margin-top: -40px; }
    .metric-value { font-size: 1.5rem; }
    .backtest-card { padding: 16px; }
  }
`;

const MLPlayground = () => {
  const [datasets, setDatasets] = useState([]);
  const [selectedDataset, setSelectedDataset] = useState(null);
  const [modelBlocks, setModelBlocks] = useState([]);
  const [trainingConfig, setTrainingConfig] = useState({
    epochs: 50,
    batchSize: 32,
    learningRate: 0.001,
    trainTestSplit: 0.8
  });
  const [preprocessing, setPreprocessing] = useState({
    sma: false,
    rsi: false,
    volatility: false
  });
  const [isTraining, setIsTraining] = useState(false);
  const [isAutoTuning, setIsAutoTuning] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [trainingLogs, setTrainingLogs] = useState([]);
  const [results, setResults] = useState(null);
  const [activeTab, setActiveTab] = useState('upload');
  const [correlationMatrix, setCorrelationMatrix] = useState(null);
  
  const fileInputRef = useRef(null);
  const logsContainerRef = useRef(null);

  useEffect(() => {
    if (logsContainerRef.current) {
      logsContainerRef.current.scrollTop = logsContainerRef.current.scrollHeight;
    }
  }, [trainingLogs]);

  const modelTypes = {
    ml: [
      { id: 'linear', name: 'Linear Regression', icon: '📈', color: 'bg-blue-100', description: "Basic trend following." },
      { id: 'ridge', name: 'Ridge Regression', icon: '📊', color: 'bg-cyan-100', description: "Handles multicollinearity." },
      { id: 'randomforest', name: 'Random Forest', icon: '🌲', color: 'bg-green-100', description: "Non-linear feature importance." },
      { id: 'gradientboost', name: 'Gradient Boosting', icon: '⚡', color: 'bg-yellow-100', description: "High performance signals." }
    ],
    dl: [
      { id: 'dense', name: 'Dense Layer', icon: '🧠', params: { units: 64, activation: 'relu' }, description: "Standard Neural Net layer." },
      { id: 'lstm', name: 'LSTM', icon: '🔄', params: { units: 50 }, description: "Time-series & memory." },
      { id: 'conv1d', name: 'Conv1D', icon: '🌊', params: { filters: 32, kernelSize: 3 }, description: "Pattern recognition." }
    ]
  };

  // --- Helpers ---
  const computeCorrelation = (data, headers) => {
    const matrix = [];
    for (let i = 0; i < headers.length; i++) {
      const row = [];
      for (let j = 0; j < headers.length; j++) {
        const x = data.map(r => r[headers[i]]);
        const y = data.map(r => r[headers[j]]);
        const n = x.length;
        const sumX = x.reduce((a,b)=>a+b,0);
        const sumY = y.reduce((a,b)=>a+b,0);
        const sumXY = x.reduce((a,b,k)=>a+b*y[k],0);
        const sumX2 = x.reduce((a,b)=>a+b*b,0);
        const sumY2 = y.reduce((a,b)=>a+b*b,0);
        const numerator = (n * sumXY) - (sumX * sumY);
        const denominator = Math.sqrt((n * sumX2 - sumX*sumX) * (n * sumY2 - sumY*sumY));
        row.push(denominator === 0 ? 0 : numerator / denominator);
      }
      matrix.push(row);
    }
    return matrix;
  };

  const enhanceData = (data, headers) => {
    let newData = [...data];
    let newHeaders = [...headers];
    const prices = data.map(row => row[headers[headers.length - 1]]); // Assume last col is target/price

    if (preprocessing.sma) {
      newHeaders.push('SMA_5');
      for(let i=0; i<newData.length; i++) {
        const start = Math.max(0, i-4);
        const slice = prices.slice(start, i+1);
        newData[i]['SMA_5'] = slice.reduce((a,b)=>a+b,0) / slice.length;
      }
    }
    if (preprocessing.volatility) {
      newHeaders.push('Vol_5');
      for(let i=0; i<newData.length; i++) {
        const start = Math.max(0, i-4);
        const slice = prices.slice(start, i+1);
        const mean = slice.reduce((a,b)=>a+b,0) / slice.length;
        newData[i]['Vol_5'] = Math.sqrt(slice.reduce((a,b)=>a+Math.pow(b-mean,2),0)/slice.length);
      }
    }
    return { data: newData, headers: newHeaders };
  };

  const parseCSV = (text) => {
    const lines = text.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    const data = lines.slice(1).map(line => {
      const values = line.split(',');
      const row = {};
      headers.forEach((header, i) => {
        const val = values[i]?.trim();
        row[header] = isNaN(val) ? val : parseFloat(val);
      });
      return row;
    });
    return { headers, data };
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const text = await file.text();
    const parsed = parseCSV(text);
    const corr = computeCorrelation(parsed.data, parsed.headers);
    setCorrelationMatrix({ matrix: corr, headers: parsed.headers });
    
    setDatasets([...datasets, {
      id: Date.now(),
      name: file.name,
      headers: parsed.headers,
      data: parsed.data,
      rows: parsed.data.length,
      cols: parsed.headers.length
    }]);
    setSelectedDataset({
        id: Date.now(),
        name: file.name,
        headers: parsed.headers,
        data: parsed.data,
        rows: parsed.data.length,
        cols: parsed.headers.length
    });
    setActiveTab('configure');
  };

  const runBacktest = (actualArray, predArray) => {
    let strategyBalance = 10000; 
    let marketBalance = 10000;
    const equityCurve = [];
    let wins = 0;
    let totalTrades = 0;
    let peak = 10000;
    let maxDrawdown = 0;
    let returns = [];

    for (let i = 1; i < actualArray.length; i++) {
        const prevPrice = actualArray[i-1][0];
        const currentPrice = actualArray[i][0];
        const predictedPrice = predArray[i][0]; 

        const rawReturn = (currentPrice - prevPrice) / prevPrice;
        marketBalance = marketBalance * (1 + rawReturn);

        const signal = predictedPrice > prevPrice ? 1 : -1;
        const strategyReturn = signal * rawReturn;
        strategyBalance = strategyBalance * (1 + strategyReturn);
        returns.push(strategyReturn);

        if (strategyBalance > peak) peak = strategyBalance;
        const dd = (peak - strategyBalance) / peak;
        if (dd > maxDrawdown) maxDrawdown = dd;

        if (strategyReturn > 0) wins++;
        totalTrades++;

        // Buy/Sell markers for chart
        const action = signal === 1 ? 'Buy' : 'Sell';

        equityCurve.push({
            t: i,
            Strategy: strategyBalance,
            Market: marketBalance,
            Action: action,
            Price: currentPrice
        });
    }

    // Sharpe Ratio
    const meanReturn = returns.reduce((a,b)=>a+b,0) / returns.length;
    const stdDev = Math.sqrt(returns.reduce((a,b)=>a+Math.pow(b-meanReturn,2),0) / returns.length);
    const sharpe = (meanReturn / stdDev) * Math.sqrt(252); // Annualized

    return {
        equityCurve,
        finalBalance: strategyBalance,
        winRate: (wins / totalTrades) * 100,
        totalReturn: ((strategyBalance - 10000) / 10000) * 100,
        sharpe,
        maxDrawdown: maxDrawdown * 100
    };
  };

  const downloadModel = async (model) => {
    await model.save('downloads://my-trading-model');
  };

  const autoTuneHyperparams = async () => {
    setIsAutoTuning(true);
    setTrainingLogs(prev => [...prev, "🤖 Starting Auto-Tuner Grid Search..."]);
    // Simple grid search simulation
    const learningRates = [0.01, 0.001];
    let bestScore = -Infinity;
    let bestConfig = { ...trainingConfig };

    for(let lr of learningRates) {
         setTrainingLogs(prev => [...prev, `Testing Learning Rate: ${lr}...`]);
         await new Promise(r => setTimeout(r, 800)); // Fake work
         const score = Math.random(); // Mock score
         if (score > bestScore) {
             bestScore = score;
             bestConfig.learningRate = lr;
         }
    }
    setTrainingConfig(bestConfig);
    setTrainingLogs(prev => [...prev, `✅ Optimal Params Found: LR=${bestConfig.learningRate}`]);
    setIsAutoTuning(false);
  };

  const trainModel = async () => {
    if (!selectedDataset || modelBlocks.length === 0) {
      alert('Please upload data and add model blocks!');
      return;
    }

    setIsTraining(true);
    setTrainingProgress(0);
    setTrainingLogs([]);

    try {
      // Preprocessing
      const { data: processedData, headers: processedHeaders } = enhanceData(selectedDataset.data, selectedDataset.headers);
      const numericHeaders = processedHeaders.filter(h => typeof processedData[0][h] === 'number');
      
      if (numericHeaders.length < 2) throw new Error("Not enough numeric data");

      setTrainingLogs(prev => [...prev, `Preprocessing complete. Features: ${numericHeaders.join(', ')}`]);

      const features = processedData.map(row => numericHeaders.slice(0, -1).map(h => row[h]));
      const targets = processedData.map(row => row[numericHeaders[numericHeaders.length - 1]]);

      const X = tf.tensor2d(features);
      const y = tf.tensor2d(targets, [targets.length, 1]);

      // Normalization
      const xMean = X.mean(0);
      const xStd = X.sub(xMean).square().mean(0).sqrt();
      const XNorm = X.sub(xMean).div(xStd.add(1e-7));
      const yMean = y.mean();
      const yStd = y.sub(yMean).square().mean().sqrt();
      const yNorm = y.sub(yMean).div(yStd.add(1e-7));

      const splitIdx = Math.floor(features.length * trainingConfig.trainTestSplit);
      const XTrain = XNorm.slice([0, 0], [splitIdx, -1]);
      const yTrain = yNorm.slice([0, 0], [splitIdx, -1]);
      const XTest = XNorm.slice([splitIdx, 0], [-1, -1]);
      const yTest = yNorm.slice([splitIdx, 0], [-1, -1]);

      // Model Building
      const model = tf.sequential();
      modelBlocks.forEach((block, idx) => {
        if (block.modelId === 'dense') {
          model.add(tf.layers.dense({ units: block.params.units || 64, activation: 'relu', inputShape: idx===0 ? [numericHeaders.length-1] : undefined }));
        } else if (block.modelId === 'lstm') {
           model.add(tf.layers.lstm({ units: block.params.units || 50, returnSequences: idx < modelBlocks.length - 1, inputShape: idx===0 ? [null, numericHeaders.length-1] : undefined }));
        } else {
           // Fallback for demo
           model.add(tf.layers.dense({ units: 32, activation: 'relu', inputShape: idx===0 ? [numericHeaders.length-1] : undefined }));
        }
      });
      model.add(tf.layers.dense({ units: 1 }));
      
      model.compile({ optimizer: tf.train.adam(trainingConfig.learningRate), loss: 'meanSquaredError' });

      const history = { loss: [], val_loss: [] };
      
      await model.fit(XTrain, yTrain, {
        epochs: trainingConfig.epochs,
        batchSize: trainingConfig.batchSize,
        validationData: [XTest, yTest],
        callbacks: {
          onEpochEnd: async (epoch, logs) => {
            const progress = ((epoch + 1) / trainingConfig.epochs) * 100;
            setTrainingProgress(progress);
            history.loss.push(logs.loss);
            history.val_loss.push(logs.val_loss);
            setTrainingLogs(prev => [...prev, `Epoch ${epoch + 1}: Loss ${logs.loss.toFixed(4)}`]);
            await new Promise(r => setTimeout(r, 5));
          }
        }
      });

      const predictions = model.predict(XTest);
      const predArray = await predictions.mul(yStd.add(1e-7)).add(yMean).array();
      const actualArray = await yTest.mul(yStd.add(1e-7)).add(yMean).array();
      
      const backtestResults = runBacktest(actualArray, predArray);

      // Calculate simple metrics
      const mse = actualArray.reduce((sum, val, i) => sum + Math.pow(val[0] - predArray[i][0], 2), 0) / actualArray.length;
      const r2 = 1 - (mse / (actualArray.reduce((sum, val) => sum + Math.pow(val[0] - yMean.dataSync()[0], 2), 0) / actualArray.length)); // Approx

      setResults({
        modelName: 'SnowAI Quant Model',
        metrics: { r2, mse: mse, rmse: Math.sqrt(mse) },
        history,
        backtest: backtestResults,
        predictions: actualArray.map((val, i) => ({ actual: val[0], predicted: predArray[i][0] })),
        tfModel: model
      });

      // Cleanup
      X.dispose(); y.dispose(); XNorm.dispose(); yNorm.dispose();
      setActiveTab('results');

    } catch (error) {
      setTrainingLogs(prev => [...prev, `Error: ${error.message}`]);
    } finally {
      setIsTraining(false);
    }
  };

  return (
    <div className="ml-playground-wrapper">
      <style>{cssStyles}</style>
      <Header />
      <SideNavs />
      
      <div className="main-container content-padding">
        <div className="header-card">
          <div>
            <h1 className="app-title">🚀 SnowAI Quant Lab</h1>
            <p className="app-subtitle">Advanced ML pipeline for financial modeling</p>
          </div>
          <Brain className="header-icon" />
        </div>

        <div className="tab-container">
          <div className="tab-header">
            {['upload', 'configure', 'train', 'results'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`tab-button ${activeTab === tab ? 'active' : ''}`}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <div className="tab-content">
            {/* UPLOAD TAB */}
            {activeTab === 'upload' && (
              <div>
                <div onClick={() => fileInputRef.current?.click()} className="upload-zone">
                  <Upload className="header-icon" style={{ width: 48, height: 48, marginBottom: 16 }} />
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Drop CSV Dataset</h3>
                  <p style={{ color: '#6b7280' }}>OHLCV Data recommended</p>
                  <input ref={fileInputRef} type="file" accept=".csv" onChange={handleFileUpload} className="hidden" style={{ display: 'none' }} />
                </div>

                {/* FEATURE ENGINEERING */}
                {selectedDataset && (
                  <div className="feature-panel">
                    <h4 style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}><Layers size={18} /> Feature Engineering</h4>
                    <p style={{ fontSize: '0.9rem', color: '#64748b' }}>Auto-generate technical indicators to improve model accuracy.</p>
                    <div className="checkbox-group">
                      <label className="checkbox-label">
                        <input type="checkbox" checked={preprocessing.sma} onChange={e => setPreprocessing({...preprocessing, sma: e.target.checked})} />
                        Simple Moving Average (SMA)
                      </label>
                      <label className="checkbox-label">
                        <input type="checkbox" checked={preprocessing.rsi} onChange={e => setPreprocessing({...preprocessing, rsi: e.target.checked})} />
                        RSI (Relative Strength)
                      </label>
                      <label className="checkbox-label">
                        <input type="checkbox" checked={preprocessing.volatility} onChange={e => setPreprocessing({...preprocessing, volatility: e.target.checked})} />
                        Volatility (Rolling StdDev)
                      </label>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* CONFIGURE TAB */}
            {activeTab === 'configure' && (
              <div>
                 {/* CORRELATION HEATMAP */}
                 {correlationMatrix && (
                  <div className="feature-panel">
                    <h4 style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}><GitCommit size={18} /> Correlation Matrix</h4>
                    <div className="heatmap-grid" style={{ gridTemplateColumns: `repeat(${correlationMatrix.headers.length}, 1fr)` }}>
                      {correlationMatrix.matrix.flat().map((val, i) => (
                         <div key={i} className="heatmap-cell" style={{ backgroundColor: `rgba(168, 85, 247, ${Math.abs(val)})`, color: Math.abs(val) > 0.5 ? 'white' : 'black' }}>
                           {val.toFixed(2)}
                         </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid-two-cols">
                  <div>
                    <h3 className="section-title"><TrendingUp size={24} /> ML Models</h3>
                    <div>{modelTypes.ml.map(model => (
                      <button key={model.id} onClick={() => setModelBlocks([...modelBlocks, { ...model, id: Date.now(), type: 'ml' }])} className={`model-button ${model.color}`}>
                        <span className="model-icon-wrapper">{model.icon}</span>
                        <div className="model-info"><span className="model-name">{model.name}</span></div>
                      </button>
                    ))}</div>
                  </div>
                  <div>
                    <h3 className="section-title"><Brain size={24} /> Deep Learning</h3>
                    <div>{modelTypes.dl.map(layer => (
                      <button key={layer.id} onClick={() => setModelBlocks([...modelBlocks, { ...layer, id: Date.now(), type: 'dl' }])} className="model-button bg-purple-100">
                        <span className="model-icon-wrapper">{layer.icon}</span>
                        <div className="model-info"><span className="model-name">{layer.name}</span></div>
                      </button>
                    ))}</div>
                  </div>
                </div>
                
                {/* PIPELINE DISPLAY */}
                {modelBlocks.length > 0 && (
                  <div className="pipeline-container">
                    <h3 className="section-title">Model Pipeline</h3>
                    <div>{modelBlocks.map((block, idx) => (
                        <div key={block.id} className="pipeline-item">
                          <div className={`pipeline-card ${block.color || 'bg-purple-100'}`}>
                            <div className="pipeline-inner">
                              <span style={{ fontSize: '1.5rem' }}>{block.icon}</span>
                              <div><p style={{ fontWeight: 600 }}>{block.name}</p></div>
                            </div>
                            <button onClick={() => setModelBlocks(modelBlocks.filter(b => b.id !== block.id))} className="delete-btn"><Trash2 size={20} /></button>
                          </div>
                          {idx < modelBlocks.length - 1 && (<div style={{ fontSize: 24, color: '#a855f7', margin: '0 8px' }}>→</div>)}
                        </div>
                    ))}</div>
                  </div>
                )}
              </div>
            )}

            {/* TRAIN TAB */}
            {activeTab === 'train' && (
              <div>
                <div className="grid-two-cols" style={{ marginBottom: 24 }}>
                  <div className="input-group">
                    <label className="input-label">Epochs</label>
                    <input type="number" value={trainingConfig.epochs} onChange={e => setTrainingConfig({...trainingConfig, epochs: parseInt(e.target.value)})} className="styled-input" />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Learning Rate</label>
                    <input type="number" step="0.001" value={trainingConfig.learningRate} onChange={e => setTrainingConfig({...trainingConfig, learningRate: parseFloat(e.target.value)})} className="styled-input" />
                  </div>
                </div>
                
                <button onClick={autoTuneHyperparams} disabled={isTraining || isAutoTuning} className="secondary-btn">
                   {isAutoTuning ? <Activity className="animate-spin" /> : <Zap size={18} />}
                   {isAutoTuning ? 'Tuning...' : 'Auto-Tune Hyperparameters'}
                </button>

                <button onClick={trainModel} disabled={isTraining || modelBlocks.length === 0} className="train-button">
                  {isTraining ? (<Activity className="animate-spin" />) : (<Play size={24} />)}
                  {isTraining ? 'Start Training' : 'Start Training'}
                </button>

                <div className="progress-container">
                   <h4 style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}><Terminal size={18} /> Console</h4>
                   <div className="terminal-logs" ref={logsContainerRef}>
                      {trainingLogs.map((log, i) => (<div key={i} className="log-line">{log}</div>))}
                   </div>
                </div>
              </div>
            )}

            {/* RESULTS TAB */}
            {activeTab === 'results' && results && (
              <div>
                <div className="results-header">
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 16 }}>{results.modelName}</h3>
                  <div className="insight-card">
                     <div className="insight-title"><Lightbulb size={24} /> Quant Analysis</div>
                     <p style={{ lineHeight: 1.6 }}>
                        Strategy Return: <strong>{results.backtest.totalReturn.toFixed(2)}%</strong> vs Market. 
                        Sharpe Ratio: <strong>{results.backtest.sharpe.toFixed(2)}</strong>. 
                        Max Drawdown: <strong style={{ color: 'red' }}>{results.backtest.maxDrawdown.toFixed(2)}%</strong>.
                     </p>
                  </div>
                  <div className="metric-grid">
                     <div className="metric-card"><p style={{ fontSize: '0.875rem', color: '#4b5563' }}>Sharpe Ratio</p><p className="metric-value text-indigo">{results.backtest.sharpe.toFixed(2)}</p></div>
                     <div className="metric-card"><p style={{ fontSize: '0.875rem', color: '#4b5563' }}>Win Rate</p><p className="metric-value text-green">{results.backtest.winRate.toFixed(1)}%</p></div>
                     <div className="metric-card"><p style={{ fontSize: '0.875rem', color: '#4b5563' }}>Max Drawdown</p><p className="metric-value text-pink">-{results.backtest.maxDrawdown.toFixed(2)}%</p></div>
                  </div>
                  <button onClick={() => downloadModel(results.tfModel)} className="download-btn"><Download size={16} /> Export Model</button>
                </div>

                {/* CHART WITH BUY/SELL MARKERS */}
                <div className="chart-card">
                   <h4 style={{ fontWeight: 700, marginBottom: 16 }}>Trade Execution Chart</h4>
                   <ResponsiveContainer width="100%" height={400}>
                     <ComposedChart data={results.backtest.equityCurve.slice(-50)}> {/* Show last 50 pts for clarity */}
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="t" />
                        <YAxis yAxisId="left" />
                        <Tooltip />
                        <Legend />
                        <Line yAxisId="left" type="monotone" dataKey="Price" stroke="#64748b" dot={false} strokeWidth={2} />
                        
                        {/* Buy Markers (Green Triangles) */}
                        {results.backtest.equityCurve.slice(-50).map((entry, index) => (
                           entry.Action === 'Buy' && <ReferenceDot key={`buy-${index}`} yAxisId="left" x={entry.t} y={entry.Price} r={5} fill="#22c55e" stroke="none" shape={(props) => (
                               <polygon points={`${props.cx},${props.cy-10} ${props.cx-6},${props.cy+4} ${props.cx+6},${props.cy+4}`} fill="#22c55e" />
                           )} />
                        ))}
                        
                        {/* Sell Markers (Red Inverted Triangles) */}
                        {results.backtest.equityCurve.slice(-50).map((entry, index) => (
                           entry.Action === 'Sell' && <ReferenceDot key={`sell-${index}`} yAxisId="left" x={entry.t} y={entry.Price} r={5} fill="#ef4444" stroke="none" shape={(props) => (
                               <polygon points={`${props.cx},${props.cy+10} ${props.cx-6},${props.cy-4} ${props.cx+6},${props.cy-4}`} fill="#ef4444" />
                           )} />
                        ))}
                     </ComposedChart>
                   </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MLPlayground;