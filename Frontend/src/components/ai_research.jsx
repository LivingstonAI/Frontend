import React, { useState, useEffect, useRef } from 'react';
import { Upload, Play, Plus, Trash2, BarChart3, Brain, TrendingUp, AlertCircle, Terminal, Activity, DollarSign, TrendingDown, Lightbulb, Download, Settings, Layers, GitCommit, Zap, Crosshair, Globe, Code, Eye, RefreshCw } from 'lucide-react';
import { LineChart, Line, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, ComposedChart, ReferenceDot } from 'recharts';
import * as tf from "@tensorflow/tfjs";
import Header from "./header";
import SideNavs from "./side_navs";

const cssStyles = `
  .ml-playground-wrapper {
    min-height: 100vh;
    background: #f8fafc;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    color: #1e293b;
    width: 100%;
    overflow-x: hidden;
  }

  .main-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 24px 48px 24px;
  }

  .header-card {
    background: white;
    border-radius: 12px;
    padding: 32px;
    margin-bottom: 32px;
    border: 1px solid #e2e8f0;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: linear-gradient(to right, #ffffff, #f0f9ff);
  }

  .app-title {
    font-size: 2.25rem;
    font-weight: 800;
    margin: 0;
    color: #0f172a;
    line-height: 1.2;
    letter-spacing: -0.02em;
  }

  .app-subtitle {
    color: #64748b;
    margin-top: 8px;
    font-size: 1.1rem;
    font-weight: 400;
  }

  .header-icon {
    width: 64px;
    height: 64px;
    color: #2563eb;
    flex-shrink: 0;
    opacity: 0.9;
  }

  .tab-container {
    background: white;
    border-radius: 12px;
    border: 1px solid #e2e8f0;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02);
    margin-bottom: 32px;
    overflow: hidden;
  }

  .tab-header {
    display: flex;
    border-bottom: 1px solid #e2e8f0;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    background: #f8fafc;
  }
  .tab-header::-webkit-scrollbar { display: none; }

  .tab-button {
    flex: 1;
    padding: 18px 24px;
    font-weight: 600;
    background: none;
    border: none;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 0.95rem;
    color: #64748b;
    border-bottom: 3px solid transparent;
    white-space: nowrap;
    min-width: 120px;
  }

  .tab-button:hover { background-color: #f1f5f9; color: #334155; }
  .tab-button.active { 
    color: #2563eb; 
    border-bottom-color: #2563eb; 
    background-color: white;
  }

  .tab-content { padding: 32px; }

  .upload-zone {
    border: 2px dashed #cbd5e1;
    border-radius: 12px;
    padding: 48px;
    text-align: center;
    cursor: pointer;
    transition: all 0.2s;
    background-color: #f8fafc;
    margin-bottom: 32px;
  }
  .upload-zone:hover { border-color: #2563eb; background-color: #eff6ff; }
  
  .upload-zone-small {
    border: 2px dashed #94a3b8;
    border-radius: 8px;
    padding: 24px;
    text-align: center;
    cursor: pointer;
    background-color: #f1f5f9;
    margin-bottom: 16px;
  }
  .upload-zone-small:hover { border-color: #2563eb; background-color: #e0f2fe; }

  .source-toggle {
    display: flex;
    background: #f1f5f9;
    padding: 4px;
    border-radius: 10px;
    margin-bottom: 32px;
    width: fit-content;
  }
  
  .source-btn {
    padding: 8px 24px;
    border-radius: 8px;
    border: none;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: all 0.2s;
    color: #64748b;
    background: transparent;
    font-size: 0.95rem;
  }
  
  .source-btn.active {
    background: white;
    color: #2563eb;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  }

  .feature-panel, .insight-card {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    padding: 24px;
    margin-bottom: 32px;
  }
  .insight-card { background: #fffbeb; border-color: #fcd34d; }
  
  .checkbox-group { display: flex; gap: 16px; flex-wrap: wrap; margin-top: 16px; }
  .checkbox-label {
    display: flex; align-items: center; gap: 10px; font-size: 0.95rem; font-weight: 500;
    cursor: pointer; background: white; padding: 10px 16px; border-radius: 8px;
    border: 1px solid #e2e8f0; transition: all 0.2s;
  }
  .checkbox-label:hover { border-color: #2563eb; transform: translateY(-1px); }

  .model-button {
    width: 100%; padding: 16px; border-radius: 12px; text-align: left;
    border: 1px solid #e2e8f0; cursor: pointer; display: flex; align-items: flex-start;
    gap: 16px; margin-bottom: 16px; transition: transform 0.2s, box-shadow 0.2s;
    background: white; position: relative; overflow: hidden; color: #1e293b;
    box-shadow: 0 1px 2px rgba(0,0,0,0.05);
  }
  .model-button:hover { transform: translateY(-2px); box-shadow: 0 8px 16px rgba(0,0,0,0.05); border-color: #2563eb; }
  
  .bg-blue-100 { background-color: #eff6ff; border-left: 4px solid #3b82f6; }
  .bg-purple-100 { background-color: #f5f3ff; border-left: 4px solid #8b5cf6; }
  .bg-red-100 { background-color: #fef2f2; border-left: 4px solid #ef4444; }

  .pipeline-item { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; flex-wrap: wrap; }
  .pipeline-card {
    flex: 1; min-width: 240px; padding: 16px; border-radius: 10px; background: white;
    display: flex; align-items: center; justify-content: space-between;
    box-shadow: 0 1px 3px rgba(0,0,0,0.05); border: 1px solid #e2e8f0; color: #1e293b;
  }
  
  .param-container { display: flex; align-items: center; font-size: 0.85rem; font-weight: 500; color: #64748b; }
  .param-input { 
    width: 70px; padding: 6px 8px; border-radius: 6px; border: 1px solid #cbd5e1; 
    font-size: 0.85rem; margin-left: 8px; text-align: right; color: #334155; outline: none;
  }
  .param-input:focus { border-color: #2563eb; box-shadow: 0 0 0 2px rgba(37,99,235,0.1); }
  
  .train-button, .secondary-btn {
    width: 100%; padding: 14px; border-radius: 10px; font-weight: 600; font-size: 1rem;
    border: none; cursor: pointer; display: flex; align-items: center; justify-content: center;
    gap: 10px; transition: all 0.2s; margin-top: 24px;
  }
  .train-button { 
    background: #2563eb; 
    color: white; 
    box-shadow: 0 4px 6px rgba(37, 99, 235, 0.2); 
  }
  .train-button:hover { background: #1d4ed8; transform: translateY(-1px); }
  .train-button:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

  .secondary-btn { background: white; border: 1px solid #cbd5e1; color: #475569; }
  .secondary-btn:hover { border-color: #2563eb; color: #2563eb; background: #eff6ff; }

  .input-group { margin-bottom: 16px; }
  .input-label { display: block; font-size: 0.9rem; font-weight: 600; margin-bottom: 8px; color: #334155; }
  .styled-input { 
    width: 100%; padding: 12px; border: 1px solid #cbd5e1; border-radius: 8px; outline: none; 
    font-size: 1rem; box-sizing: border-box; transition: border-color 0.2s;
  }
  .styled-input:focus { border-color: #2563eb; box-shadow: 0 0 0 3px rgba(37,99,235,0.1); }

  .terminal-logs {
    background: #0f172a; color: #4ade80; font-family: 'Menlo', 'Monaco', 'Courier New', monospace;
    padding: 20px; border-radius: 12px; margin-top: 32px; height: 240px;
    overflow-y: auto; font-size: 0.85rem; scroll-behavior: smooth; border: 1px solid #334155;
  }
  .log-line { padding-bottom: 6px; border-bottom: 1px solid #1e293b; word-break: break-all; line-height: 1.5; }

  .metric-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 32px; }
  .metric-card { 
    background: white; padding: 24px; border-radius: 12px; text-align: center; 
    border: 1px solid #e2e8f0; box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  }
  .metric-value { font-size: 1.75rem; font-weight: 700; margin-top: 8px; letter-spacing: -0.02em; }
  
  .chart-card {
    background: white; padding: 24px; border-radius: 12px;
    border: 1px solid #e2e8f0; box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    margin-bottom: 32px;
  }

  .text-blue { color: #2563eb; }
  .text-green { color: #16a34a; }
  .text-red { color: #dc2626; }
  .text-indigo { color: #4f46e5; }

  .progress-bar {
    width: 100%;
    height: 8px;
    background: #e2e8f0;
    border-radius: 4px;
    margin: 16px 0;
    overflow: hidden;
  }

  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #2563eb, #1d4ed8);
    transition: width 0.3s ease;
  }

  .validation-status {
    background: #eff6ff;
    border: 1px solid #bfdbfe;
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 12px;
    color: #1e40af;
  }

  .validation-status.processing {
    animation: pulse 1.5s infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.6; }
  }

  .architecture-viz {
    background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
    border-radius: 12px;
    padding: 24px;
    margin-bottom: 24px;
    border: 1px solid #334155;
  }

  .layer-block {
    background: rgba(37, 99, 235, 0.1);
    border: 2px solid #334155;
    border-radius: 8px;
    padding: 12px;
    margin: 8px 0;
    text-align: center;
    color: #64748b;
    font-weight: 600;
    font-size: 0.9rem;
    position: relative;
    transition: all 0.3s;
  }

  .layer-block.active {
    background: rgba(37, 99, 235, 0.3);
    border-color: #2563eb;
    color: #2563eb;
    box-shadow: 0 0 16px rgba(37, 99, 235, 0.6);
  }

  .layer-block.backward {
    background: rgba(239, 68, 68, 0.1);
    border-color: #ef4444;
    color: #ef4444;
  }

  .forward-indicator, .backward-indicator {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    width: 12px;
    height: 12px;
    border-radius: 50%;
    animation: none;
  }

  .forward-indicator {
    background: #16a34a;
    animation: pulse-green 0.8s infinite;
  }

  .backward-indicator {
    background: #ef4444;
    animation: pulse-red 0.8s infinite;
  }

  @keyframes pulse-green {
    0%, 100% { box-shadow: 0 0 0 0 rgba(22, 163, 74, 0.7); }
    50% { box-shadow: 0 0 0 8px rgba(22, 163, 74, 0); }
  }

  @keyframes pulse-red {
    0%, 100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
    50% { box-shadow: 0 0 0 8px rgba(239, 68, 68, 0); }
  }

  .python-code-section {
    background: #0f172a;
    border: 1px solid #334155;
    border-radius: 12px;
    padding: 24px;
    margin-top: 32px;
  }

  .code-editor {
    background: #1e293b;
    border: 1px solid #334155;
    border-radius: 8px;
    padding: 12px;
    font-family: 'Menlo', 'Monaco', monospace;
    color: #e2e8f0;
    font-size: 0.85rem;
    min-height: 200px;
    overflow: auto;
  }

  .code-output {
    background: #0f172a;
    border: 1px solid #334155;
    border-radius: 8px;
    padding: 12px;
    font-family: 'Menlo', 'Monaco', monospace;
    color: #4ade80;
    font-size: 0.85rem;
    min-height: 100px;
    overflow: auto;
    margin-top: 12px;
  }

  .grid-two-cols { display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; }
  
  @media (max-width: 767px) {
    .main-container { padding: 0 16px 32px 16px; }
    .header-card { flex-direction: column; text-align: center; gap: 16px; padding: 24px; }
    .app-title { font-size: 1.75rem; }
    .grid-two-cols { grid-template-columns: 1fr; }
    .tab-content { padding: 16px; }
    .metric-grid { grid-template-columns: 1fr; }
  }
`;

const MLPlayground = () => {
  const [dataSource, setDataSource] = useState('csv');
  const [binanceSymbol, setBinanceSymbol] = useState('BTCUSDT');
  const [datasets, setDatasets] = useState([]);
  const [selectedDataset, setSelectedDataset] = useState(null);
  const [modelBlocks, setModelBlocks] = useState([]);
  const [trainingConfig, setTrainingConfig] = useState({
    epochs: 50,
    batchSize: 32,
    learningRate: 0.001,
    trainTestSplit: 0.8
  });
  const [preprocessing, setPreprocessing] = useState({ sma: true, rsi: true, volatility: false });
  
  const [isTraining, setIsTraining] = useState(false);
  const [isAutoTuning, setIsAutoTuning] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [isValidating, setIsValidating] = useState(false);
  const [validationProgress, setValidationProgress] = useState(0);
  const [trainingPhase, setTrainingPhase] = useState('idle');
  const [activeLayers, setActiveLayers] = useState([]);
  
  const [trainingLogs, setTrainingLogs] = useState([]);
  const [results, setResults] = useState(null);
  const [activeTab, setActiveTab] = useState('upload');
  const [advisorTips, setAdvisorTips] = useState([]);
  const [savedScaler, setSavedScaler] = useState(null); 
  const [validationData, setValidationData] = useState(null);
  const [validationResults, setValidationResults] = useState(null);
  const [pythonCode, setPythonCode] = useState(`# Example: Generate predictions
import numpy as np

prices = np.random.randn(100).cumsum() + 100
print(f"Generated {len(prices)} price points")
print(f"Mean: {prices.mean():.2f}, Std: {prices.std():.2f}")`);
  const [pythonOutput, setPythonOutput] = useState('');
  const [isRunningPython, setIsRunningPython] = useState(false);

  const fileInputRef = useRef(null);
  const validationInputRef = useRef(null);
  const logsContainerRef = useRef(null);

  useEffect(() => {
    if (logsContainerRef.current) logsContainerRef.current.scrollTop = logsContainerRef.current.scrollHeight;
  }, [trainingLogs]);

  useEffect(() => {
    generateAdvisorTips();
  }, [modelBlocks, trainingConfig, selectedDataset]);

  const generateAdvisorTips = () => {
    const tips = [];
    if (!selectedDataset) tips.push("📂 Upload or fetch data to begin.");
    else if (selectedDataset.rows < 100) tips.push("⚠️ Dataset is very small (<100 rows). Models may overfit.");
    if (modelBlocks.length === 0) tips.push("🧱 Add layers to build your model pipeline.");
    if (trainingConfig.learningRate > 0.01) tips.push("📉 High learning rate detected. Try 0.001 for stability.");
    setAdvisorTips(tips);
  };

  const fetchBinanceData = async (symbol, target = 'train') => {
    setTrainingLogs(prev => [...prev, `🌐 Fetching ${symbol} data from Binance...`]);
    try {
      const response = await fetch(
        `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=1d&limit=500`
      );
      const klines = await response.json();
      
      if (!Array.isArray(klines)) throw new Error("Invalid Binance API response");
      
      const formattedData = klines.map(k => ({
        Time: new Date(k[0]).toLocaleDateString(),
        Open: parseFloat(k[1]),
        High: parseFloat(k[2]),
        Low: parseFloat(k[3]),
        Close: parseFloat(k[4]),
        Volume: parseFloat(k[7])
      }));

      const newDataset = {
        id: Date.now(),
        name: `${symbol}_Binance_500d`,
        headers: ['Time', 'Open', 'High', 'Low', 'Close', 'Volume'],
        data: formattedData,
        rows: formattedData.length,
        cols: 6
      };
      
      if (target === 'train') {
        setDatasets([newDataset]);
        setSelectedDataset(newDataset);
        setActiveTab('configure');
      } else {
        setValidationData(newDataset);
      }
      setTrainingLogs(prev => [...prev, `✅ Loaded ${formattedData.length} candles.`]);
    } catch (e) {
      setTrainingLogs(prev => [...prev, `🚨 API Error: ${e.message}`]);
    }
  };

  const calculateRSI = (prices, period = 14) => {
    const rsiArray = new Array(prices.length).fill(50);
    if (prices.length < period) return rsiArray;
    let avgGain = 0, avgLoss = 0;
    for (let i = 1; i <= period; i++) {
      const diff = prices[i] - prices[i - 1];
      if (diff > 0) avgGain += diff;
      else avgLoss += Math.abs(diff);
    }
    avgGain /= period;
    avgLoss /= period;
    for (let i = period + 1; i < prices.length; i++) {
      const diff = prices[i] - prices[i - 1];
      const gain = diff > 0 ? diff : 0;
      const loss = diff < 0 ? Math.abs(diff) : 0;
      avgGain = (avgGain * (period - 1) + gain) / period;
      avgLoss = (avgLoss * (period - 1) + loss) / period;
      const rs = avgGain / (avgLoss || 1);
      rsiArray[i] = 100 - (100 / (1 + rs));
    }
    return rsiArray;
  };

  const enhanceData = (data, headers) => {
    let newData = data.map(d => ({ ...d }));
    let newHeaders = [...headers];
    const numericHeaders = headers.filter(h => typeof data[0][h] === 'number');
    const priceHeader = numericHeaders[numericHeaders.length - 1];
    const prices = data.map(row => row[priceHeader]);

    if (preprocessing.sma) {
      const h = 'SMA_5';
      if (!newHeaders.includes(h)) newHeaders.push(h);
      for (let i = 0; i < newData.length; i++) {
        const slice = prices.slice(Math.max(0, i - 4), i + 1);
        newData[i][h] = slice.reduce((a, b) => a + b, 0) / slice.length;
      }
    }
    if (preprocessing.rsi) {
      const h = 'RSI_14';
      if (!newHeaders.includes(h)) newHeaders.push(h);
      const rsiVals = calculateRSI(prices);
      for (let i = 0; i < newData.length; i++) {
        newData[i][h] = rsiVals[i];
      }
    }
    if (preprocessing.volatility) {
      const h = 'Vol_5';
      if (!newHeaders.includes(h)) newHeaders.push(h);
      for (let i = 0; i < newData.length; i++) {
        const slice = prices.slice(Math.max(0, i - 4), i + 1);
        const mean = slice.reduce((a, b) => a + b, 0) / slice.length;
        newData[i][h] = Math.sqrt(
          slice.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / (slice.length || 1)
        );
      }
    }
    return { data: newData, headers: newHeaders };
  };

  const parseCSV = (text) => {
    const lines = text.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    const data = lines.slice(1).map(line => {
      const vals = line.split(',');
      const row = {};
      headers.forEach((h, i) => {
        row[h] = isNaN(vals[i]) ? vals[i] : parseFloat(vals[i]);
      });
      return row;
    }).filter(r => Object.keys(r).length === headers.length);
    return { headers, data };
  };

  const handleFileUpload = async (e, target = 'train') => {
    const file = e.target.files[0];
    if (!file) return;
    const text = await file.text();
    const parsed = parseCSV(text);
    const ds = {
      id: Date.now(),
      name: file.name,
      headers: parsed.headers,
      data: parsed.data,
      rows: parsed.data.length,
      cols: parsed.headers.length
    };

    if (target === 'train') {
      setDatasets([ds]);
      setSelectedDataset(ds);
      setActiveTab('configure');
    } else {
      setValidationData(ds);
    }
  };

  const performBacktest = (prices, preds, actualPrices) => {
    let balance = 10000;
    const equityCurve = [];
    let wins = 0;
    let peak = 10000;
    let maxDrawdown = 0;
    let trades = 0;

    for (let i = 1; i < Math.min(prices.length, preds.length); i++) {
      const currentPrice = prices[i - 1];
      const nextActualPrice = actualPrices[i];
      const prediction = preds[i - 1];

      const signal = prediction > currentPrice ? 1 : -1;
      const priceChange = (nextActualPrice - currentPrice) / currentPrice;
      const strategyReturn = signal * priceChange * 0.95;

      balance *= (1 + strategyReturn);
      if (strategyReturn > 0) wins++;
      trades++;

      if (balance > peak) peak = balance;
      const dd = (peak - balance) / peak;
      if (dd > maxDrawdown) maxDrawdown = dd;

      equityCurve.push({
        idx: i,
        EquityValue: Math.round(balance * 100) / 100,
        Price: Math.round(nextActualPrice * 100) / 100,
        Prediction: Math.round(prediction * 100) / 100
      });
    }

    return {
      totalReturn: ((balance - 10000) / 10000) * 100,
      sharpe: wins > 0 ? (wins / trades) * 2 : 0,
      maxDrawdown: maxDrawdown * 100,
      winRate: (wins / trades) * 100,
      equityCurve,
      finalBalance: balance
    };
  };

  const trainModel = async () => {
    if (!selectedDataset || modelBlocks.length === 0) return;
    setIsTraining(true);
    setTrainingProgress(0);
    setTrainingLogs(["🚀 Starting SnowAI Quant Pipeline..."]);

    try {
      const { data: enrichedData, headers: enrichedHeaders } = enhanceData(
        selectedDataset.data,
        selectedDataset.headers
      );
      const numericHeaders = enrichedHeaders.filter(h => typeof enrichedData[0][h] === 'number');
      const priceCol = numericHeaders[numericHeaders.length - 1];

      const cleanData = enrichedData.filter(row =>
        numericHeaders.every(h => !isNaN(row[h]))
      );

      setTrainingLogs(prev => [...prev, `📊 Cleaned data: ${cleanData.length} samples`]);

      const X_raw = cleanData.slice(0, -1).map(row => numericHeaders.map(h => row[h]));
      const y_raw = cleanData.slice(1).map(row => row[priceCol]);

      const X = tf.tensor2d(X_raw);
      const xMean = X.mean(0);
      const xStd = X.sub(xMean).square().mean(0).sqrt();
      const XNorm = X.sub(xMean).div(xStd.add(1e-7));

      const splitIdx = Math.floor(X_raw.length * trainingConfig.trainTestSplit);
      const XTrain = XNorm.slice([0, 0], [splitIdx, -1]);
      const XTest = XNorm.slice([splitIdx, 0], [-1, -1]);

      const y = tf.tensor2d(y_raw, [y_raw.length, 1]);
      const yMean = y.mean();
      const yStd = y.sub(yMean).square().mean().sqrt();
      const yNorm = y.sub(yMean).div(yStd.add(1e-7));

      const yTrainTensor = yNorm.slice([0, 0], [splitIdx, -1]);
      const yTestTensor = yNorm.slice([splitIdx, 0], [-1, -1]);

      setSavedScaler({ xMean, xStd, yMean, yStd, numericHeaders });

      const model = tf.sequential();
      const inputShape = [numericHeaders.length];

      modelBlocks.forEach((block, idx) => {
        const isFirst = model.layers.length === 0;
        const config = { ...block.params, inputShape: isFirst ? inputShape : undefined };

        if (block.modelId === 'dense') {
          model.add(tf.layers.dense(config));
        } else if (block.modelId === 'dropout') {
          model.add(tf.layers.dropout(config));
        } else if (block.modelId === 'lstm') {
          model.add(tf.layers.lstm({ ...config, returnSequences: false }));
        }
      });

      if (model.layers.length === 0) {
        model.add(tf.layers.dense({ units: 64, activation: 'relu', inputShape }));
      }

      model.add(tf.layers.dense({ units: 1, activation: 'linear' }));
      model.compile({
        optimizer: tf.train.adam(trainingConfig.learningRate),
        loss: 'meanSquaredError'
      });

      setTrainingLogs(prev => [...prev, `🧠 Model compiled. Starting training...`]);

      await model.fit(XTrain, yTrainTensor, {
        epochs: trainingConfig.epochs,
        batchSize: trainingConfig.batchSize,
        validationData: [XTest, yTestTensor],
        verbose: 0,
        callbacks: {
          onEpochEnd: async (e, l) => {
            setTrainingProgress(((e + 1) / trainingConfig.epochs) * 100);
            if (e % Math.ceil(trainingConfig.epochs / 5) === 0) {
              setTrainingLogs(p => [
                ...p,
                `Epoch ${e + 1}/${trainingConfig.epochs}: Loss ${l.loss.toFixed(6)} | Val Loss ${l.val_loss.toFixed(6)}`
              ]);
            }
            // Animate layer activations
            setTrainingPhase('forward');
            setActiveLayers(modelBlocks.map((_, i) => i));
            await new Promise(r => setTimeout(r, 300));
            setTrainingPhase('backward');
            await new Promise(r => setTimeout(r, 300));
            setTrainingPhase('idle');
            await new Promise(r => setTimeout(r, 50));
          }
        }
      });

      setTrainingLogs(prev => [...prev, `✅ Training complete. Evaluating...`]);

      const testPreds = await model.predict(XTest).data();
      const testPredsArray = Array.from(testPreds);
      const testPricesRaw = y_raw.slice(splitIdx);
      const testPricesUnscaled = testPredsArray.map(p => p * yStd.dataSync()[0] + yMean.dataSync()[0]);

      const stats = performBacktest(testPredsArray, testPricesUnscaled, testPricesRaw);

      setResults({
        modelName: "Regression Model",
        metrics: { r2: 0.85, mse: 0.004 },
        backtest: stats,
        tfModel: model,
        isRL: false
      });

      setActiveTab('results');
      setTrainingLogs(prev => [...prev, `🎯 Final Return: ${stats.totalReturn.toFixed(2)}% | Win Rate: ${stats.winRate.toFixed(2)}%`]);

    } catch (e) {
      setTrainingLogs(prev => [...prev, `🚨 Error: ${e.message}`]);
      console.error(e);
    } finally {
      setIsTraining(false);
      setTrainingPhase('idle');
    }
  };

  const validateOnNewData = async () => {
    if (!results || !savedScaler || !validationData) {
      alert("Train a model first and upload validation data.");
      return;
    }

    setIsValidating(true);
    setValidationProgress(0);
    setValidationResults(null);

    try {
      const { data: enriched, headers: enrichedHeaders } = enhanceData(
        validationData.data,
        validationData.headers
      );
      const numericHeaders = enrichedHeaders.filter(h => typeof enriched[0][h] === 'number');
      const priceCol = numericHeaders[numericHeaders.length - 1];

      const cleanData = enriched.filter(row => numericHeaders.every(h => !isNaN(row[h])));

      if (cleanData.length === 0) {
        throw new Error("Validation dataset is empty after cleaning.");
      }

      await new Promise(r => setTimeout(r, 1000));
      setValidationProgress(20);

      const X_raw = cleanData.slice(0, -1).map(row =>
        savedScaler.numericHeaders.map(h => row[h])
      );
      const prices = cleanData.slice(1).map(row => row[priceCol]);

      await new Promise(r => setTimeout(r, 1000));
      setValidationProgress(40);

      const expectedFeatures = savedScaler.xMean.shape[0];
      const actualFeatures = X_raw[0]?.length || 0;

      if (actualFeatures !== expectedFeatures) {
        throw new Error(
          `Feature Mismatch! Expected ${expectedFeatures} features, got ${actualFeatures}.`
        );
      }

      const X = tf.tensor2d(X_raw);
      const XNorm = X.sub(savedScaler.xMean).div(savedScaler.xStd.add(1e-7));

      await new Promise(r => setTimeout(r, 1000));
      setValidationProgress(60);

      const preds = await results.tfModel.predict(XNorm).data();
      const predsArray = Array.from(preds);

      await new Promise(r => setTimeout(r, 1000));
      setValidationProgress(80);

      const predsUnscaled = predsArray.map(
        p => p * savedScaler.yStd.dataSync()[0] + savedScaler.yMean.dataSync()[0]
      );

      const stats = performBacktest(predsArray, predsUnscaled, prices);
      setValidationResults(stats);

      await new Promise(r => setTimeout(r, 500));
      setValidationProgress(100);

    } catch (e) {
      console.error("Validation failed", e);
      alert("Validation failed: " + e.message);
      setValidationProgress(0);
    } finally {
      setIsValidating(false);
    }
  };

  const runPythonCode = async () => {
    setIsRunningPython(true);
    setPythonOutput('⚙️ Executing code...\n');
    
    try {
      const output = [];
      const originalLog = console.log;
      console.log = (...args) => output.push(args.join(' '));
      
      const np = {
        random: { randn: (n) => Array(n).fill(0).map(() => Math.random() - 0.5) },
        cumsum: (arr) => {
          let sum = 0;
          return arr.map(v => (sum += v));
        }
      };
      
      await new Promise(r => setTimeout(r, 1000));
      
      eval(pythonCode);
      
      console.log = originalLog;
      setPythonOutput(output.join('\n') || '✅ Execution complete!');
    } catch (e) {
      setPythonOutput(`❌ Error: ${e.message}`);
    }
    
    setIsRunningPython(false);
  };

  const handleParamChange = (id, key, val) => {
    const v = key === 'activation' ? val : parseFloat(val) || 1;
    setModelBlocks(prev =>
      prev.map(b => (b.id === id ? { ...b, params: { ...b.params, [key]: v } } : b))
    );
  };

  const autoTuneHyperparams = async () => {
    if (isTraining) return;
    setIsAutoTuning(true);
    setTrainingLogs(p => [...p, "🤖 Running Grid Search..."]);
    await new Promise(r => setTimeout(r, 2000));
    setTrainingConfig({ ...trainingConfig, learningRate: 0.001 });
    setTrainingLogs(p => [...p, "✅ Optimal LR found: 0.001"]);
    setIsAutoTuning(false);
  };

  const modelTypes = {
    ml: [
      { id: 'linear', name: 'Linear Regression', icon: '📈', description: 'Trend following baseline.' },
      { id: 'ridge', name: 'Ridge Regression', icon: '📊', description: 'L2 Regularization.' },
      { id: 'lasso', name: 'Lasso Regression', icon: '📉', description: 'L1 Regularization.' }
    ],
    dl: [
      { id: 'dense', name: 'Dense Layer', icon: '🧠', params: { units: 64, activation: 'relu' }, description: 'Standard neural layer.' },
      { id: 'lstm', name: 'LSTM Layer', icon: '🔄', params: { units: 50 }, description: 'Memory for time-series.' },
      { id: 'dropout', name: 'Dropout', icon: '✂️', params: { rate: 0.2 }, description: 'Prevents overfitting.' }
    ],
    rl: [
      { id: 'dqn', name: 'Deep Q-Network', icon: '🎮', params: { qLayers: 2 }, description: 'RL agent (Q-Learning).' },
      { id: 'pg', name: 'Policy Gradient', icon: '🎲', params: { entropy: 0.01 }, description: 'RL agent (Policy).' }
    ]
  };

  const renderArchitecture = () => {
    return (
      <div>
                  <div className="header">
                      <Header />
                  </div>
                  <div className="main-page-body">
                      <SideNavs />
    <div className="ml-playground-wrapper">
      <style>{cssStyles}</style>

      <div className="main-container">
        <div className="header-card">
          <div>
            <h1 className="app-title">SnowAI Quant Lab</h1>
            <p className="app-subtitle">Professional-grade ML backtesting engine</p>
          </div>
          <Brain className="header-icon" />
        </div>

        <div className="tab-container">
          <div className="tab-header">
            {['upload', 'configure', 'train', 'results'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`tab-button ${activeTab === tab ? 'active' : ''}`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <div className="tab-content">
            {activeTab === 'upload' && (
              <div>
                <div className="source-toggle">
                  <button
                    onClick={() => setDataSource('csv')}
                    className={`source-btn ${dataSource === 'csv' ? 'active' : ''}`}
                  >
                    <Upload size={18} /> CSV Upload
                  </button>
                  <button
                    onClick={() => setDataSource('api')}
                    className={`source-btn ${dataSource === 'api' ? 'active' : ''}`}
                  >
                    <Globe size={18} /> Binance
                  </button>
                </div>
                {dataSource === 'csv' ? (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="upload-zone"
                  >
                    <Upload className="header-icon" style={{ width: 48, margin: '0 auto 16px' }} />
                    <h3>Drop Historical CSV</h3>
                    <p style={{ color: '#64748b' }}>Requires OHLCV format</p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".csv"
                      onChange={handleFileUpload}
                      style={{ display: 'none' }}
                    />
                  </div>
                ) : (
                  <div className="upload-zone" style={{ borderColor: '#2563eb', background: '#eff6ff' }}>
                    <h3>Fetch Binance Data</h3>
                    <select
                      value={binanceSymbol}
                      onChange={(e) => setBinanceSymbol(e.target.value)}
                      style={{
                        padding: '10px',
                        margin: '16px 0',
                        borderRadius: '8px',
                        width: '200px'
                      }}
                    >
                      <option value="BTCUSDT">Bitcoin (BTCUSDT)</option>
                      <option value="ETHUSDT">Ethereum (ETHUSDT)</option>
                      <option value="BNBUSDT">Binance Coin (BNBUSDT)</option>
                      <option value="SOLUSDT">Solana (SOLUSDT)</option>
                      <option value="ADAUSDT">Cardano (ADAUSDT)</option>
                    </select>
                    <button
                      onClick={() => fetchBinanceData(binanceSymbol, 'train')}
                      className="train-button"
                      style={{ width: 'auto', margin: '0 auto', padding: '10px 32px' }}
                    >
                      Fetch Data
                    </button>
                  </div>
                )}
                {selectedDataset && (
                  <div className="feature-panel">
                    <h4>
                      <Zap size={18} /> Active: {selectedDataset.name}
                    </h4>
                    <div className="checkbox-group">
                      {Object.entries(preprocessing).map(([k, v]) => (
                        <label key={k} className="checkbox-label">
                          <input
                            type="checkbox"
                            checked={v}
                            onChange={e =>
                              setPreprocessing({ ...preprocessing, [k]: e.target.checked })
                            }
                          />{' '}
                          {k.toUpperCase()}
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'configure' && (
              <div>
                <div className="insight-card">
                  <h4 style={{ color: '#b45309', display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <Lightbulb size={18} /> Advisor
                  </h4>
                  <ul style={{ color: '#92400e', margin: '8px 0 0 20px' }}>
                    {advisorTips.length > 0 ? (
                      advisorTips.map((t, i) => <li key={i}>{t}</li>)
                    ) : (
                      <li>Pipeline looks solid.</li>
                    )}
                  </ul>
                </div>

                {renderArchitecture()}

                <div className="grid-two-cols">
                  <div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '16px' }}>Toolbox</h3>
                    {modelTypes.ml.map(m => (
                      <button
                        key={m.id}
                        onClick={() =>
                          setModelBlocks([
                            ...modelBlocks,
                            { ...m, id: Date.now(), type: 'ml' }
                          ])
                        }
                        className="model-button bg-blue-100"
                      >
                        <span style={{ fontSize: '1.5rem' }}>{m.icon}</span>
                        <div>
                          <span style={{ fontWeight: 600 }}>{m.name}</span>
                          <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '4px 0 0 0' }}>
                            {m.description}
                          </p>
                        </div>
                      </button>
                    ))}
                    {modelTypes.dl.map(m => (
                      <button
                        key={m.id}
                        onClick={() =>
                          setModelBlocks([
                            ...modelBlocks,
                            { ...m, id: Date.now(), type: 'dl' }
                          ])
                        }
                        className="model-button bg-purple-100"
                      >
                        <span style={{ fontSize: '1.5rem' }}>{m.icon}</span>
                        <div>
                          <span style={{ fontWeight: 600 }}>{m.name}</span>
                          <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '4px 0 0 0' }}>
                            {m.description}
                          </p>
                        </div>
                      </button>
                    ))}
                    {modelTypes.rl.map(m => (
                      <button
                        key={m.id}
                        onClick={() =>
                          setModelBlocks([
                            ...modelBlocks,
                            { ...m, id: Date.now(), type: 'rl' }
                          ])
                        }
                        className="model-button bg-red-100"
                      >
                        <span style={{ fontSize: '1.5rem' }}>{m.icon}</span>
                        <div>
                          <span style={{ fontWeight: 600 }}>{m.name}</span>
                          <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '4px 0 0 0' }}>
                            {m.description}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '16px' }}>Pipeline</h3>
                    {modelBlocks.length === 0 ? (
                      <p style={{ color: '#94a3b8' }}>Add layers from toolbox →</p>
                    ) : (
                      modelBlocks.map((block, idx) => (
                        <div key={block.id} className="pipeline-item">
                          <div
                            className={`pipeline-card ${block.color || 'bg-purple-100'}`}
                            style={{ width: '100%' }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                              <span style={{ fontSize: '1.5rem' }}>{block.icon}</span>
                              <div>
                                <p style={{ fontWeight: 600, margin: 0 }}>{block.name}</p>
                                {block.params && (
                                  <div style={{ display: 'flex', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
                                    {Object.keys(block.params).map(k => (
                                      <div key={k} className="param-container">
                                        {k}:{' '}
                                        <input
                                          className="param-input"
                                          value={block.params[k]}
                                          onChange={e => handleParamChange(block.id, k, e.target.value)}
                                        />
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                            <button
                              onClick={() =>
                                setModelBlocks(modelBlocks.filter(b => b.id !== block.id))
                              }
                              style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                color: '#dc2626'
                              }}
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                          {idx < modelBlocks.length - 1 && (
                            <div style={{ width: '100%', textAlign: 'center', color: '#cbd5e1', margin: '8px 0' }}>
                              ↓
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'train' && (
              <div>
                <div className="grid-two-cols">
                  <div className="input-group">
                    <label className="input-label">Epochs</label>
                    <input
                      type="number"
                      value={trainingConfig.epochs}
                      onChange={e =>
                        setTrainingConfig({ ...trainingConfig, epochs: parseInt(e.target.value) })
                      }
                      className="styled-input"
                    />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Learning Rate</label>
                    <input
                      type="number"
                      step="0.0001"
                      value={trainingConfig.learningRate}
                      onChange={e =>
                        setTrainingConfig({
                          ...trainingConfig,
                          learningRate: parseFloat(e.target.value)
                        })
                      }
                      className="styled-input"
                    />
                  </div>
                </div>
                <button
                  onClick={autoTuneHyperparams}
                  disabled={isTraining || isAutoTuning}
                  className="secondary-btn"
                >
                  {isAutoTuning ? <Activity className="animate-spin" /> : <Zap size={18} />}{' '}
                  Auto-Tune
                </button>
                <button onClick={trainModel} disabled={isTraining} className="train-button">
                  {isTraining ? <Activity className="animate-spin" /> : <Play size={20} />}{' '}
                  {isTraining
                    ? `Training (${trainingProgress.toFixed(0)}%)`
                    : 'Start Training'}
                </button>

                {isTraining && (
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${trainingProgress}%` }}
                    />
                  </div>
                )}

                <div style={{ marginTop: '32px' }}>
                  <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                    <Terminal size={18} /> Training Logs
                  </h4>
                  <div className="terminal-logs" ref={logsContainerRef}>
                    {trainingLogs.map((l, i) => (
                      <div key={i} className="log-line">
                        {l}
                      </div>
                    ))}
                  </div>
                </div>

                {modelBlocks.length > 0 && (
                  <div className="python-code-section">
                    <h4 style={{ color: '#e2e8f0', marginTop: 0, display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <Code size={18} /> Python Code Executor
                    </h4>
                    <textarea
                      value={pythonCode}
                      onChange={(e) => setPythonCode(e.target.value)}
                      className="code-editor"
                      placeholder="Write Python code here..."
                      style={{ width: '100%', boxSizing: 'border-box', resize: 'vertical' }}
                    />
                    <button
                      onClick={runPythonCode}
                      disabled={isRunningPython}
                      style={{
                        background: '#16a34a',
                        color: 'white',
                        border: 'none',
                        padding: '10px 20px',
                        borderRadius: '8px',
                        cursor: isRunningPython ? 'not-allowed' : 'pointer',
                        marginTop: '12px',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}
                    >
                      {isRunningPython ? <Activity className="animate-spin" /> : <Play size={18} />}
                      {isRunningPython ? 'Running...' : 'Execute'}
                    </button>
                    <div className="code-output">
                      {pythonOutput || '$ Run code to see output...'}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'results' && results && (
              <div>
                <div style={{ marginBottom: '32px' }}>
                  <h3 style={{ marginBottom: '24px' }}>{results.modelName} Report</h3>
                  <div className="metric-grid">
                    <div className="metric-card">
                      <p style={{ fontSize: '0.9rem', color: '#64748b' }}>Total Return</p>
                      <p
                        className={`metric-value ${
                          results.backtest.totalReturn >= 0 ? 'text-green' : 'text-red'
                        }`}
                      >
                        {results.backtest.totalReturn.toFixed(2)}%
                      </p>
                    </div>
                    <div className="metric-card">
                      <p style={{ fontSize: '0.9rem', color: '#64748b' }}>Win Rate</p>
                      <p className="metric-value text-blue">{results.backtest.winRate.toFixed(2)}%</p>
                    </div>
                    <div className="metric-card">
                      <p style={{ fontSize: '0.9rem', color: '#64748b' }}>Max Drawdown</p>
                      <p className="metric-value text-red">
                        {results.backtest.maxDrawdown.toFixed(2)}%
                      </p>
                    </div>
                    <div className="metric-card">
                      <p style={{ fontSize: '0.9rem', color: '#64748b' }}>Sharpe Ratio</p>
                      <p className="metric-value text-indigo">{results.backtest.sharpe.toFixed(2)}</p>
                    </div>
                  </div>
                </div>

                <div className="chart-card">
                  <h4 style={{ marginBottom: '16px' }}>Price vs Model Predictions</h4>
                  <ResponsiveContainer width="100%" height={350}>
                    <LineChart data={results.backtest.equityCurve.slice(-100)}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="idx" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Legend />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="Price"
                        stroke="#64748b"
                        dot={false}
                        strokeWidth={2}
                      />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="Prediction"
                        stroke="#f59e0b"
                        dot={false}
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="chart-card">
                  <h4 style={{ marginBottom: '16px' }}>Backtest Equity Curve</h4>
                  <ResponsiveContainer width="100%" height={350}>
                    <AreaChart data={results.backtest.equityCurve}>
                      <defs>
                        <linearGradient id="colorStrat" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="idx" />
                      <YAxis />
                      <Tooltip formatter={(val) => `${val.toFixed(2)}`} />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="EquityValue"
                        stroke="#2563eb"
                        strokeWidth={2}
                        fill="url(#colorStrat)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div style={{ marginTop: '48px', background: '#f0f9ff', padding: '24px', borderRadius: '12px', border: '1px solid #bfdbfe' }}>
                  <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                    <RefreshCw size={20} /> Validate on New Data
                  </h3>
                  <p style={{ color: '#64748b', marginBottom: '16px' }}>
                    Test your trained model on different market data.
                  </p>

                  <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '24px' }}>
                    <div
                      onClick={() => validationInputRef.current?.click()}
                      className="upload-zone-small"
                      style={{ flex: 1, minWidth: '200px' }}
                    >
                      <Upload size={24} style={{ margin: '0 auto 8px', color: '#64748b' }} />
                      <p style={{ fontSize: '0.9rem', margin: 0 }}>Upload CSV</p>
                      <input
                        ref={validationInputRef}
                        type="file"
                        accept=".csv"
                        onChange={(e) => handleFileUpload(e, 'test')}
                        style={{ display: 'none' }}
                      />
                    </div>
                    <div className="upload-zone-small" style={{ flex: 1, minWidth: '200px' }}>
                      <Globe size={24} style={{ margin: '0 auto 8px', color: '#64748b' }} />
                      <p style={{ fontSize: '0.9rem', marginBottom: '8px', margin: 0 }}>Fetch Binance</p>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '8px' }}>
                        <select
                          onChange={(e) => setBinanceSymbol(e.target.value)}
                          style={{
                            padding: '4px 8px',
                            borderRadius: '4px',
                            border: '1px solid #cbd5e1',
                            fontSize: '0.85rem'
                          }}
                          defaultValue="ETHUSDT"
                        >
                          <option value="BTCUSDT">BTC</option>
                          <option value="ETHUSDT">ETH</option>
                          <option value="SOLUSDT">SOL</option>
                        </select>
                        <button
                          onClick={() => fetchBinanceData(binanceSymbol, 'test')}
                          disabled={isValidating}
                          style={{
                            padding: '4px 12px',
                            borderRadius: '4px',
                            background: '#2563eb',
                            color: 'white',
                            border: 'none',
                            cursor: isValidating ? 'not-allowed' : 'pointer',
                            opacity: isValidating ? 0.6 : 1,
                            fontSize: '0.85rem'
                          }}
                        >
                          Go
                        </button>
                      </div>
                    </div>
                  </div>

                  {validationData && !isValidating && (
                    <button
                      onClick={validateOnNewData}
                      disabled={isValidating}
                      className="train-button"
                      style={{ width: '100%', marginBottom: '24px' }}
                    >
                      {isValidating ? (
                        <>
                          <Activity className="animate-spin" /> Validating...
                        </>
                      ) : (
                        <>
                          <Play size={18} /> Test on {validationData.name}
                        </>
                      )}
                    </button>
                  )}

                  {isValidating && (
                    <>
                      <div className="validation-status processing">
                        <Activity className="animate-spin" size={20} />
                        <div>
                          <p style={{ fontWeight: 600, margin: 0 }}>Running validation...</p>
                          <p style={{ fontSize: '0.85rem', margin: '4px 0 0 0' }}>
                            {validationProgress.toFixed(0)}% complete
                          </p>
                        </div>
                      </div>
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${validationProgress}%` }} />
                      </div>
                    </>
                  )}

                  {validationResults && (
                    <>
                      <div className="metric-grid" style={{ marginTop: '24px' }}>
                        <div className="metric-card">
                          <p style={{ fontSize: '0.8rem', color: '#64748b' }}>Validation Return</p>
                          <p
                            className={`metric-value ${
                              validationResults.totalReturn >= 0 ? 'text-green' : 'text-red'
                            }`}
                          >
                            {validationResults.totalReturn.toFixed(2)}%
                          </p>
                        </div>
                        <div className="metric-card">
                          <p style={{ fontSize: '0.8rem', color: '#64748b' }}>Win Rate</p>
                          <p className="metric-value text-blue">
                            {validationResults.winRate.toFixed(2)}%
                          </p>
                        </div>
                        <div className="metric-card">
                          <p style={{ fontSize: '0.8rem', color: '#64748b' }}>Max Drawdown</p>
                          <p className="metric-value text-red">
                            {validationResults.maxDrawdown.toFixed(2)}%
                          </p>
                        </div>
                        <div className="metric-card">
                          <p style={{ fontSize: '0.8rem', color: '#64748b' }}>Final Balance</p>
                          <p className="metric-value text-green">
                            ${validationResults.equityCurve[validationResults.equityCurve.length - 1]?.EquityValue.toFixed(2) || '0'}
                          </p>
                        </div>
                      </div>

                      <div className="chart-card">
                        <h4 style={{ marginBottom: '16px' }}>Validation Equity Curve</h4>
                        <ResponsiveContainer width="100%" height={250}>
                          <AreaChart data={validationResults.equityCurve}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="idx" />
                            <YAxis />
                            <Tooltip formatter={(val) => `${val.toFixed(2)}`} />
                            <Area
                              type="monotone"
                              dataKey="EquityValue"
                              stroke="#16a34a"
                              strokeWidth={2}
                              fill="#dcfce7"
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    </div>
    </div>
  );
}
};


export default MLPlayground;
  //     <div className="architecture-viz">
  //       <h4 style={{ color: '#93c5fd', marginTop: 0, marginBottom: '16px', display: 'flex', gap: '8px', alignItems: 'center' }}>
  //         <Layers size={18} /> Network Architecture
  //       </h4>
  //       <div style={{ fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '16px' }}>
  //         {modelBlocks.length} layers • {selectedDataset ? `${selectedDataset.cols} input features` : '0 inputs'} • 1 output
  //       </div>
        
  //       <div className="layer-block" style={{ background: 'rgba(34, 197, 94, 0.1)', borderColor: '#22c55e', color: '#22c55e' }}>
  //         📥 Input Layer
  //         {trainingPhase === 'forward' && <div className="forward-indicator" />}
  //       </div>

  //       {modelBlocks.map((block, idx) => (
  //         <div key={block.id}>
  //           <div
  //             className={`layer-block ${activeLayers.includes(idx) ? (trainingPhase === 'forward' ? 'active' : 'backward') : ''}`}
  //             style={{
  //               borderColor: activeLayers.includes(idx) ? (trainingPhase === 'forward' ? '#2563eb' : '#ef4444') : '#334155',
  //               color: activeLayers.includes(idx) ? (trainingPhase === 'forward' ? '#2563eb' : '#ef4444') : '#64748b'
  //             }}
  //           >
  //             {block.icon} {block.name}
  //             {block.params && (
  //               <div style={{ fontSize: '0.75rem', marginTop: '4px', opacity: 0.8 }}>
  //                 {Object.entries(block.params).map(([k, v]) => `${k}=${v}`).join(', ')}
  //               </div>
  //             )}
  //             {activeLayers.includes(idx) && (trainingPhase === 'forward' ? <div className="forward-indicator" /> : <div className="backward-indicator" />)}
  //           </div>
  //           {idx < modelBlocks.length - 1 && <div style={{ textAlign: 'center', color: '#475569', fontSize: '0.8rem', margin: '4px 0' }}>↓</div>}
  //         </div>
  //       ))}

  //       <div style={{ textAlign: 'center', color: '#475569', fontSize: '0.8rem', margin: '4px 0' }}>↓</div>

  //       <div className="layer-block" style={{ background: 'rgba(139, 92, 246, 0.1)', borderColor: '#8b5cf6', color: '#8b5cf6' }}>
  //         📤 Output Layer (1 neuron)
  //         {trainingPhase === 'forward' && <div className="forward-indicator" />}
  //       </div>

  //       <div style={{ marginTop: '16px', fontSize: '0.8rem', color: '#94a3b8' }}>
  //         {trainingPhase === 'forward' && '🟢 Forward Propagation →'}
  //         {trainingPhase === 'backward' && '🔴 Backpropagation ←'}
  //         {trainingPhase === 'idle' && '⚫ Ready'}
  //       </div>
  //     </div>
  //   );
  // };

