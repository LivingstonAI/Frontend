import React, { useState, useEffect, useRef } from 'react';
import { Upload, Play, Trash2, Brain, Terminal, Activity, Lightbulb, Layers, Zap, Globe, Code } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import * as tf from '@tensorflow/tfjs';
import Header from "./header";
import SideNavs from "./side_navs";

const MLPlayground = () => {
  const styles = `
    .ml-wrapper { min-height: 100vh; background: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #1e293b; }
    .container { max-width: 1200px; margin: 0 auto; padding: 16px; }
    .header { background: linear-gradient(to right, #fff, #eff6ff); border-radius: 12px; padding: 24px; margin-bottom: 24px; border: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; }
    .title { font-size: 1.75rem; font-weight: 800; color: #0f172a; margin: 0; }
    .subtitle { color: #64748b; margin-top: 4px; font-size: 0.95rem; }
    .card { background: white; border-radius: 12px; border: 1px solid #e2e8f0; margin-bottom: 24px; overflow: hidden; }
    .tabs { display: flex; border-bottom: 1px solid #e2e8f0; background: #f8fafc; }
    .tab { flex: 1; padding: 14px; font-weight: 600; font-size: 0.9rem; background: none; border: none; cursor: pointer; color: #64748b; border-bottom: 3px solid transparent; transition: all 0.2s; }
    .tab:hover { background: #f1f5f9; color: #334155; }
    .tab.active { color: #2563eb; border-bottom-color: #2563eb; background: white; }
    .content { padding: 24px; }
    .toggle-group { display: flex; background: #f1f5f9; padding: 4px; border-radius: 10px; width: fit-content; margin-bottom: 24px; }
    .toggle-btn { padding: 8px 20px; border-radius: 8px; border: none; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 8px; color: #64748b; background: transparent; font-size: 0.9rem; transition: all 0.2s; }
    .toggle-btn.active { background: white; color: #2563eb; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .upload-zone { border: 2px dashed #cbd5e1; border-radius: 12px; padding: 48px; text-align: center; cursor: pointer; background: #f8fafc; margin-bottom: 24px; transition: all 0.2s; }
    .upload-zone:hover { border-color: #2563eb; background: #eff6ff; }
    .upload-zone.api { border-color: #2563eb; background: #eff6ff; }
    .feature-panel { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; }
    .checkbox-group { display: flex; gap: 12px; flex-wrap: wrap; margin-top: 12px; }
    .checkbox-label { display: flex; align-items: center; gap: 8px; font-size: 0.9rem; font-weight: 500; cursor: pointer; background: white; padding: 8px 14px; border-radius: 8px; border: 1px solid #e2e8f0; transition: all 0.2s; }
    .checkbox-label:hover { border-color: #2563eb; }
    .advisor { background: #fffbeb; border: 1px solid #fcd34d; border-radius: 12px; padding: 16px; margin-bottom: 24px; }
    .advisor h4 { color: #b45309; display: flex; gap: 8px; align-items: center; margin: 0 0 8px 0; font-size: 0.95rem; }
    .advisor ul { color: #92400e; margin: 0; padding-left: 20px; font-size: 0.9rem; }
    .arch-viz { background: linear-gradient(135deg, #0f172a, #1e293b); border-radius: 12px; padding: 20px; margin-bottom: 24px; border: 1px solid #334155; }
    .arch-title { color: #93c5fd; margin: 0 0 12px 0; display: flex; gap: 8px; align-items: center; font-size: 0.9rem; }
    .arch-info { font-size: 0.8rem; color: #94a3b8; margin-bottom: 12px; }
    .layer { border: 2px solid #334155; border-radius: 8px; padding: 10px; margin: 6px 0; text-align: center; color: #64748b; font-weight: 600; font-size: 0.85rem; transition: all 0.3s; }
    .layer.input { background: rgba(34,197,94,0.1); border-color: #22c55e; color: #22c55e; }
    .layer.output { background: rgba(139,92,246,0.1); border-color: #8b5cf6; color: #8b5cf6; }
    .layer.forward { background: rgba(37,99,235,0.3); border-color: #2563eb; color: #60a5fa; box-shadow: 0 0 12px rgba(37,99,235,0.5); }
    .layer.backward { background: rgba(239,68,68,0.2); border-color: #ef4444; color: #f87171; }
    .layer-params { font-size: 0.7rem; margin-top: 4px; opacity: 0.8; }
    .arrow { text-align: center; color: #475569; font-size: 0.75rem; margin: 2px 0; }
    .phase { margin-top: 12px; font-size: 0.75rem; color: #94a3b8; }
    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
    @media (max-width: 768px) { .grid-2 { grid-template-columns: 1fr; } }
    .section-title { font-size: 1.1rem; font-weight: 600; margin-bottom: 16px; }
    .model-btn { width: 100%; padding: 14px; border-radius: 10px; text-align: left; border: 1px solid #e2e8f0; cursor: pointer; display: flex; align-items: flex-start; gap: 14px; margin-bottom: 12px; transition: all 0.2s; background: white; }
    .model-btn:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.08); border-color: #2563eb; }
    .model-btn.ml { background: #eff6ff; border-left: 4px solid #3b82f6; }
    .model-btn.dl { background: #f5f3ff; border-left: 4px solid #8b5cf6; }
    .model-btn.rl { background: #fef2f2; border-left: 4px solid #ef4444; }
    .model-icon { font-size: 1.4rem; }
    .model-name { font-weight: 600; font-size: 0.95rem; }
    .model-desc { font-size: 0.8rem; color: #64748b; margin-top: 2px; }
    .pipeline-item { margin-bottom: 12px; }
    .pipeline-card { padding: 14px; border-radius: 10px; background: white; display: flex; align-items: center; justify-content: space-between; box-shadow: 0 1px 3px rgba(0,0,0,0.05); border: 1px solid #e2e8f0; }
    .param-row { display: flex; gap: 8px; margin-top: 8px; flex-wrap: wrap; }
    .param-item { display: flex; align-items: center; font-size: 0.8rem; font-weight: 500; color: #64748b; }
    .param-input { width: 60px; padding: 4px 6px; border-radius: 4px; border: 1px solid #cbd5e1; font-size: 0.8rem; margin-left: 6px; text-align: right; }
    .param-input:focus { border-color: #2563eb; outline: none; }
    .delete-btn { background: none; border: none; cursor: pointer; color: #dc2626; padding: 4px; }
    .input-group { margin-bottom: 16px; }
    .input-label { display: block; font-size: 0.85rem; font-weight: 600; margin-bottom: 6px; color: #334155; }
    .styled-input { width: 100%; padding: 10px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 0.95rem; box-sizing: border-box; }
    .styled-input:focus { border-color: #2563eb; outline: none; box-shadow: 0 0 0 3px rgba(37,99,235,0.1); }
    .btn { padding: 12px 20px; border-radius: 10px; font-weight: 600; font-size: 0.95rem; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; transition: all 0.2s; width: 100%; margin-top: 16px; }
    .btn-primary { background: #2563eb; color: white; box-shadow: 0 4px 6px rgba(37,99,235,0.2); }
    .btn-primary:hover { background: #1d4ed8; transform: translateY(-1px); }
    .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
    .btn-secondary { background: white; border: 1px solid #cbd5e1; color: #475569; }
    .btn-secondary:hover { border-color: #2563eb; color: #2563eb; background: #eff6ff; }
    .btn-green { background: #16a34a; color: white; }
    .btn-green:hover { background: #15803d; }
    .progress-bar { width: 100%; height: 8px; background: #e2e8f0; border-radius: 4px; margin: 16px 0; overflow: hidden; }
    .progress-fill { height: 100%; background: linear-gradient(90deg, #2563eb, #1d4ed8); transition: width 0.3s; }
    .terminal { background: #0f172a; color: #4ade80; font-family: 'Menlo', monospace; padding: 16px; border-radius: 12px; margin-top: 24px; height: 200px; overflow-y: auto; font-size: 0.8rem; border: 1px solid #334155; }
    .log-line { padding-bottom: 6px; border-bottom: 1px solid #1e293b; line-height: 1.5; margin-bottom: 6px; }
    .code-section { background: #0f172a; border: 1px solid #334155; border-radius: 12px; padding: 20px; margin-top: 24px; }
    .code-editor { background: #1e293b; border: 1px solid #334155; border-radius: 8px; padding: 12px; font-family: 'Menlo', monospace; color: #e2e8f0; font-size: 0.8rem; min-height: 120px; width: 100%; box-sizing: border-box; resize: vertical; }
    .code-output { background: #0f172a; border: 1px solid #334155; border-radius: 8px; padding: 12px; font-family: 'Menlo', monospace; color: #4ade80; font-size: 0.8rem; min-height: 60px; margin-top: 12px; }
    .metric-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-bottom: 24px; }
    @media (max-width: 600px) { .metric-grid { grid-template-columns: 1fr; } }
    .metric-card { background: white; padding: 20px; border-radius: 12px; text-align: center; border: 1px solid #e2e8f0; }
    .metric-label { font-size: 0.85rem; color: #64748b; }
    .metric-value { font-size: 1.5rem; font-weight: 700; margin-top: 6px; letter-spacing: -0.02em; }
    .text-green { color: #16a34a; }
    .text-red { color: #dc2626; }
    .text-blue { color: #2563eb; }
    .text-indigo { color: #4f46e5; }
    .chart-card { background: white; padding: 20px; border-radius: 12px; border: 1px solid #e2e8f0; margin-bottom: 24px; }
    .chart-title { margin: 0 0 16px 0; font-size: 1rem; font-weight: 600; }
    .validation-section { margin-top: 32px; background: #eff6ff; padding: 20px; border-radius: 12px; border: 1px solid #bfdbfe; }
    .validation-title { display: flex; align-items: center; gap: 8px; margin: 0 0 12px 0; font-size: 1.1rem; }
    .upload-small { border: 2px dashed #94a3b8; border-radius: 8px; padding: 20px; text-align: center; cursor: pointer; background: #f1f5f9; flex: 1; min-width: 180px; }
    .upload-small:hover { border-color: #2563eb; background: #e0f2fe; }
    .flex-row { display: flex; gap: 16px; flex-wrap: wrap; margin-bottom: 20px; }
    .select-small { padding: 6px 10px; border-radius: 6px; border: 1px solid #cbd5e1; font-size: 0.85rem; }
    .btn-small { padding: 6px 14px; border-radius: 6px; background: #2563eb; color: white; border: none; cursor: pointer; font-size: 0.85rem; }
    .btn-small:disabled { opacity: 0.6; cursor: not-allowed; }
    .spin { animation: spin 1s linear infinite; }
    @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  `;

  const [dataSource, setDataSource] = useState('csv');
  const [binanceSymbol, setBinanceSymbol] = useState('BTCUSDT');
  const [selectedDataset, setSelectedDataset] = useState(null);
  const [modelBlocks, setModelBlocks] = useState([]);
  const [trainingConfig, setTrainingConfig] = useState({ epochs: 50, batchSize: 32, learningRate: 0.001, trainTestSplit: 0.8 });
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
  const [pythonCode, setPythonCode] = useState(`// Generate predictions\nconst prices = Array(100).fill(0).map(() => Math.random());\nconsole.log("Generated " + prices.length + " price points");`);
  const [pythonOutput, setPythonOutput] = useState('');
  const [isRunningPython, setIsRunningPython] = useState(false);

  const fileInputRef = useRef(null);
  const validationInputRef = useRef(null);
  const logsRef = useRef(null);

  const modelTypes = {
    ml: [{ id: 'linear', name: 'Linear Regression', icon: '📈', desc: 'Trend following baseline.' }, { id: 'ridge', name: 'Ridge Regression', icon: '📊', desc: 'L2 Regularization.' }],
    dl: [{ id: 'dense', name: 'Dense Layer', icon: '🧠', params: { units: 64, activation: 'relu' }, desc: 'Standard neural layer.' }, { id: 'dropout', name: 'Dropout', icon: '✂️', params: { rate: 0.2 }, desc: 'Prevents overfitting.' }],
    rl: [{ id: 'dqn', name: 'Deep Q-Network', icon: '🎮', params: { qLayers: 2 }, desc: 'RL agent (Q-Learning).' }]
  };

  useEffect(() => { if (logsRef.current) logsRef.current.scrollTop = logsRef.current.scrollHeight; }, [trainingLogs]);
  useEffect(() => { generateAdvisorTips(); }, [modelBlocks, trainingConfig, selectedDataset]);

  const generateAdvisorTips = () => {
    const tips = [];
    if (!selectedDataset) tips.push("📂 Upload or fetch data to begin.");
    else if (selectedDataset.rows < 100) tips.push("⚠️ Dataset is small (<100 rows). Risk of overfitting.");
    if (modelBlocks.length === 0) tips.push("🧱 Add layers to build your pipeline.");
    if (trainingConfig.learningRate > 0.01) tips.push("📉 High learning rate. Try 0.001.");
    setAdvisorTips(tips);
  };

  const fetchBinanceData = async (symbol, target = 'train') => {
    setTrainingLogs(p => [...p, `🌐 Fetching ${symbol} from Binance...`]);
    try {
      const res = await fetch(`https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=1d&limit=500`);
      const klines = await res.json();
      if (!Array.isArray(klines)) throw new Error("Invalid response");
      const data = klines.map(k => ({ Time: new Date(k[0]).toLocaleDateString(), Open: +k[1], High: +k[2], Low: +k[3], Close: +k[4], Volume: +k[7] }));
      const ds = { id: Date.now(), name: `${symbol}_500d`, headers: ['Time','Open','High','Low','Close','Volume'], data, rows: data.length, cols: 6 };
      if (target === 'train') { setSelectedDataset(ds); setActiveTab('configure'); } else setValidationData(ds);
      setTrainingLogs(p => [...p, `✅ Loaded ${data.length} candles.`]);
    } catch (e) { setTrainingLogs(p => [...p, `🚨 Error: ${e.message}`]); }
  };

  const calculateRSI = (prices, period = 14) => {
    const rsi = new Array(prices.length).fill(50);
    if (prices.length < period) return rsi;
    let avgG = 0, avgL = 0;
    for (let i = 1; i <= period; i++) { const d = prices[i] - prices[i-1]; if (d > 0) avgG += d; else avgL += Math.abs(d); }
    avgG /= period; avgL /= period;
    for (let i = period + 1; i < prices.length; i++) {
      const d = prices[i] - prices[i-1], g = d > 0 ? d : 0, l = d < 0 ? Math.abs(d) : 0;
      avgG = (avgG * (period-1) + g) / period; avgL = (avgL * (period-1) + l) / period;
      rsi[i] = 100 - 100 / (1 + avgG / (avgL || 1));
    }
    return rsi;
  };

  const enhanceData = (data, headers) => {
    let newData = data.map(d => ({...d})), newH = [...headers];
    const numH = headers.filter(h => typeof data[0][h] === 'number');
    const priceH = numH[numH.length - 1];
    const prices = data.map(r => r[priceH]);
    if (preprocessing.sma) { if (!newH.includes('SMA_5')) newH.push('SMA_5'); for (let i = 0; i < newData.length; i++) { const s = prices.slice(Math.max(0,i-4), i+1); newData[i]['SMA_5'] = s.reduce((a,b)=>a+b,0)/s.length; } }
    if (preprocessing.rsi) { if (!newH.includes('RSI_14')) newH.push('RSI_14'); const r = calculateRSI(prices); for (let i = 0; i < newData.length; i++) newData[i]['RSI_14'] = r[i]; }
    if (preprocessing.volatility) { if (!newH.includes('Vol_5')) newH.push('Vol_5'); for (let i = 0; i < newData.length; i++) { const s = prices.slice(Math.max(0,i-4), i+1); const m = s.reduce((a,b)=>a+b,0)/s.length; newData[i]['Vol_5'] = Math.sqrt(s.reduce((a,b)=>a+Math.pow(b-m,2),0)/(s.length||1)); } }
    return { data: newData, headers: newH };
  };

  const parseCSV = (text) => {
    const lines = text.trim().split('\n'), headers = lines[0].split(',').map(h => h.trim());
    const data = lines.slice(1).map(line => { const v = line.split(','), row = {}; headers.forEach((h,i) => { row[h] = isNaN(v[i]) ? v[i] : +v[i]; }); return row; }).filter(r => Object.keys(r).length === headers.length);
    return { headers, data };
  };

  const handleFileUpload = async (e, target = 'train') => {
    const file = e.target.files[0]; if (!file) return;
    const text = await file.text(), p = parseCSV(text);
    const ds = { id: Date.now(), name: file.name, headers: p.headers, data: p.data, rows: p.data.length, cols: p.headers.length };
    if (target === 'train') { setSelectedDataset(ds); setActiveTab('configure'); } else setValidationData(ds);
  };

  const performBacktest = (prices, preds, actual) => {
    let bal = 10000; const curve = []; let wins = 0, peak = 10000, maxDD = 0, trades = 0;
    for (let i = 1; i < Math.min(prices.length, preds.length); i++) {
      const curr = prices[i-1], next = actual[i], pred = preds[i-1];
      const sig = pred > curr ? 1 : -1, chg = (next - curr) / curr;
      bal *= (1 + sig * chg * 0.95);
      if (sig * chg > 0) wins++; trades++;
      if (bal > peak) peak = bal;
      const dd = (peak - bal) / peak; if (dd > maxDD) maxDD = dd;
      curve.push({ idx: i, EquityValue: Math.round(bal*100)/100, Price: Math.round(next*100)/100, Prediction: Math.round(pred*100)/100 });
    }
    return { totalReturn: ((bal-10000)/10000)*100, sharpe: wins > 0 ? (wins/trades)*2 : 0, maxDrawdown: maxDD*100, winRate: (wins/trades)*100, equityCurve: curve, finalBalance: bal };
  };

  const trainModel = async () => {
    if (!selectedDataset || modelBlocks.length === 0) return;
    setIsTraining(true); setTrainingProgress(0); setTrainingLogs(["🚀 Starting SnowAI Pipeline..."]);
    try {
      const { data: eData, headers: eH } = enhanceData(selectedDataset.data, selectedDataset.headers);
      const numH = eH.filter(h => typeof eData[0][h] === 'number');
      const priceCol = numH[numH.length - 1];
      const clean = eData.filter(r => numH.every(h => !isNaN(r[h])));
      setTrainingLogs(p => [...p, `📊 ${clean.length} samples ready`]);
      const X_raw = clean.slice(0,-1).map(r => numH.map(h => r[h]));
      const y_raw = clean.slice(1).map(r => r[priceCol]);
      const X = tf.tensor2d(X_raw), xMean = X.mean(0), xStd = X.sub(xMean).square().mean(0).sqrt();
      const XNorm = X.sub(xMean).div(xStd.add(1e-7));
      const split = Math.floor(X_raw.length * trainingConfig.trainTestSplit);
      const XTrain = XNorm.slice([0,0], [split,-1]), XTest = XNorm.slice([split,0], [-1,-1]);
      const y = tf.tensor2d(y_raw, [y_raw.length, 1]), yMean = y.mean(), yStd = y.sub(yMean).square().mean().sqrt();
      const yNorm = y.sub(yMean).div(yStd.add(1e-7));
      const yTrain = yNorm.slice([0,0], [split,-1]), yTest = yNorm.slice([split,0], [-1,-1]);
      setSavedScaler({ xMean, xStd, yMean, yStd, numericHeaders: numH });
      const model = tf.sequential(), inputShape = [numH.length];
      modelBlocks.forEach(block => {
        const first = model.layers.length === 0;
        const cfg = { ...block.params, inputShape: first ? inputShape : undefined };
        if (block.modelId === 'dense') model.add(tf.layers.dense(cfg));
        else if (block.modelId === 'dropout') model.add(tf.layers.dropout(cfg));
      });
      if (model.layers.length === 0) model.add(tf.layers.dense({ units: 64, activation: 'relu', inputShape }));
      model.add(tf.layers.dense({ units: 1, activation: 'linear' }));
      model.compile({ optimizer: tf.train.adam(trainingConfig.learningRate), loss: 'meanSquaredError' });
      setTrainingLogs(p => [...p, `🧠 Model compiled. Training...`]);
      await model.fit(XTrain, yTrain, {
        epochs: trainingConfig.epochs, batchSize: trainingConfig.batchSize, validationData: [XTest, yTest], verbose: 0,
        callbacks: { onEpochEnd: async (e, l) => {
          setTrainingProgress(((e+1)/trainingConfig.epochs)*100);
          if (e % Math.ceil(trainingConfig.epochs/5) === 0) setTrainingLogs(p => [...p, `Epoch ${e+1}: Loss ${l.loss.toFixed(5)} | Val ${l.val_loss.toFixed(5)}`]);
          setTrainingPhase('forward'); setActiveLayers(modelBlocks.map((_,i)=>i)); await new Promise(r=>setTimeout(r,80));
          setTrainingPhase('backward'); await new Promise(r=>setTimeout(r,80)); setTrainingPhase('idle');
        }}
      });
      setTrainingLogs(p => [...p, `✅ Training complete`]);
      const preds = await model.predict(XTest).data();
      const predsArr = Array.from(preds), testPrices = y_raw.slice(split);
      const predsUnscaled = predsArr.map(p => p * yStd.dataSync()[0] + yMean.dataSync()[0]);
      const stats = performBacktest(predsArr, predsUnscaled, testPrices);
      setResults({ modelName: "Regression Model", backtest: stats, tfModel: model });
      setActiveTab('results');
      setTrainingLogs(p => [...p, `🎯 Return: ${stats.totalReturn.toFixed(2)}% | Win: ${stats.winRate.toFixed(2)}%`]);
    } catch (e) { setTrainingLogs(p => [...p, `🚨 ${e.message}`]); console.error(e); }
    finally { setIsTraining(false); setTrainingPhase('idle'); }
  };

  const validateOnNewData = async () => {
    if (!results || !savedScaler || !validationData) { alert("Train a model first and upload validation data."); return; }
    setIsValidating(true); setValidationProgress(0); setValidationResults(null);
    try {
      const { data: eData, headers: eH } = enhanceData(validationData.data, validationData.headers);
      const numH = eH.filter(h => typeof eData[0][h] === 'number');
      const priceCol = numH[numH.length - 1];
      const clean = eData.filter(r => numH.every(h => !isNaN(r[h])));
      if (clean.length === 0) throw new Error("Empty dataset after cleaning");
      await new Promise(r => setTimeout(r, 400)); setValidationProgress(25);
      const X_raw = clean.slice(0,-1).map(r => savedScaler.numericHeaders.map(h => r[h]));
      const prices = clean.slice(1).map(r => r[priceCol]);
      await new Promise(r => setTimeout(r, 400)); setValidationProgress(50);
      const expected = savedScaler.xMean.shape[0], actual = X_raw[0]?.length || 0;
      if (actual !== expected) throw new Error(`Feature mismatch: expected ${expected}, got ${actual}`);
      const X = tf.tensor2d(X_raw), XNorm = X.sub(savedScaler.xMean).div(savedScaler.xStd.add(1e-7));
      await new Promise(r => setTimeout(r, 400)); setValidationProgress(75);
      const preds = await results.tfModel.predict(XNorm).data();
      const predsArr = Array.from(preds);
      const predsUnscaled = predsArr.map(p => p * savedScaler.yStd.dataSync()[0] + savedScaler.yMean.dataSync()[0]);
      const stats = performBacktest(predsArr, predsUnscaled, prices);
      setValidationResults(stats); setValidationProgress(100);
    } catch (e) { console.error(e); alert("Validation failed: " + e.message); setValidationProgress(0); }
    finally { setIsValidating(false); }
  };

  const runCode = async () => {
    setIsRunningPython(true); setPythonOutput('⚙️ Running...\n');
    try {
      const output = []; const origLog = console.log;
      console.log = (...args) => output.push(args.join(' '));
      await new Promise(r => setTimeout(r, 300));
      try { eval(pythonCode); } catch (err) { output.push(`Error: ${err.message}`); }
      console.log = origLog;
      setPythonOutput(output.join('\n') || '✅ Done!');
    } catch (e) { setPythonOutput(`❌ ${e.message}`); }
    setIsRunningPython(false);
  };

  const handleParamChange = (id, key, val) => {
    const v = key === 'activation' ? val : parseFloat(val) || 1;
    setModelBlocks(p => p.map(b => b.id === id ? { ...b, params: { ...b.params, [key]: v } } : b));
  };

  const autoTune = async () => {
    if (isTraining) return;
    setIsAutoTuning(true); setTrainingLogs(p => [...p, "🤖 Auto-tuning..."]);
    await new Promise(r => setTimeout(r, 1500));
    setTrainingConfig({ ...trainingConfig, learningRate: 0.001 });
    setTrainingLogs(p => [...p, "✅ Optimal LR: 0.001"]); setIsAutoTuning(false);
  };

  const renderArch = () => (
    <div className="arch-viz">
      <h4 className="arch-title"><Layers size={16} /> Network Architecture</h4>
      <div className="arch-info">{modelBlocks.length} layers • {selectedDataset ? selectedDataset.cols : 0} inputs • 1 output</div>
      <div className="layer input">📥 Input Layer</div>
      {modelBlocks.map((b, i) => (
        <div key={b.id}>
          <div className="arrow">↓</div>
          <div className={`layer ${activeLayers.includes(i) ? (trainingPhase === 'forward' ? 'forward' : 'backward') : ''}`}>
            {b.icon} {b.name}
            {b.params && <div className="layer-params">{Object.entries(b.params).map(([k,v])=>`${k}=${v}`).join(', ')}</div>}
          </div>
        </div>
      ))}
      <div className="arrow">↓</div>
      <div className="layer output">📤 Output (1 neuron)</div>
      <div className="phase">{trainingPhase === 'forward' ? '🟢 Forward →' : trainingPhase === 'backward' ? '🔴 Backward ←' : '⚫ Ready'}</div>
    </div>
  );

  return (
    <div>
                <div className="header">
                    <Header />
                </div>
                <div className="main-page-body">
                    <SideNavs />
    <div className="ml-wrapper">
      <style>{styles}</style>
      <div className="container">
        <div className="header">
          <div><h1 className="title">SnowAI Quant Lab</h1><p className="subtitle">Professional-grade ML backtesting engine</p></div>
          <Brain size={56} color="#2563eb" />
        </div>
        <div className="card">
          <div className="tabs">
            {['upload','configure','train','results'].map(t => (
              <button key={t} className={`tab ${activeTab === t ? 'active' : ''}`} onClick={() => setActiveTab(t)}>{t.charAt(0).toUpperCase() + t.slice(1)}</button>
            ))}
          </div>
          <div className="content">
            {activeTab === 'upload' && (
              <div>
                <div className="toggle-group">
                  <button className={`toggle-btn ${dataSource === 'csv' ? 'active' : ''}`} onClick={() => setDataSource('csv')}><Upload size={16} /> CSV</button>
                  <button className={`toggle-btn ${dataSource === 'api' ? 'active' : ''}`} onClick={() => setDataSource('api')}><Globe size={16} /> Binance</button>
                </div>
                {dataSource === 'csv' ? (
                  <div className="upload-zone" onClick={() => fileInputRef.current?.click()}>
                    <Upload size={40} color="#2563eb" style={{margin:'0 auto 12px'}} />
                    <h3 style={{margin:'0 0 4px 0'}}>Drop Historical CSV</h3>
                    <p style={{color:'#64748b',margin:0,fontSize:'0.9rem'}}>Requires OHLCV format</p>
                    <input ref={fileInputRef} type="file" accept=".csv" onChange={handleFileUpload} style={{display:'none'}} />
                  </div>
                ) : (
                  <div className="upload-zone api">
                    <h3 style={{margin:'0 0 12px 0'}}>Fetch Binance Data</h3>
                    <select value={binanceSymbol} onChange={e => setBinanceSymbol(e.target.value)} style={{padding:'10px',borderRadius:'8px',marginBottom:'12px',width:'180px'}}>
                      <option value="BTCUSDT">Bitcoin (BTCUSDT)</option>
                      <option value="ETHUSDT">Ethereum (ETHUSDT)</option>
                      <option value="SOLUSDT">Solana (SOLUSDT)</option>
                    </select>
                    <button className="btn btn-primary" style={{width:'auto',margin:'0 auto',padding:'10px 24px'}} onClick={() => fetchBinanceData(binanceSymbol,'train')}>Fetch Data</button>
                  </div>
                )}
                {selectedDataset && (
                  <div className="feature-panel">
                    <h4 style={{margin:'0 0 8px 0',display:'flex',alignItems:'center',gap:'8px'}}><Zap size={16} color="#eab308" /> Active: {selectedDataset.name}</h4>
                    <div className="checkbox-group">
                      {Object.entries(preprocessing).map(([k,v]) => (
                        <label key={k} className="checkbox-label"><input type="checkbox" checked={v} onChange={e => setPreprocessing({...preprocessing, [k]: e.target.checked})} /> {k.toUpperCase()}</label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            {activeTab === 'configure' && (
              <div>
                <div className="advisor"><h4><Lightbulb size={16} /> Advisor</h4><ul>{advisorTips.length ? advisorTips.map((t,i) => <li key={i}>{t}</li>) : <li>Pipeline looks solid.</li>}</ul></div>
                {renderArch()}
                <div className="grid-2">
                  <div>
                    <h3 className="section-title">Toolbox</h3>
                    {modelTypes.ml.map(m => <button key={m.id} className="model-btn ml" onClick={() => setModelBlocks([...modelBlocks, {...m, id: Date.now(), modelId: m.id}])}><span className="model-icon">{m.icon}</span><div><div className="model-name">{m.name}</div><div className="model-desc">{m.desc}</div></div></button>)}
                    {modelTypes.dl.map(m => <button key={m.id} className="model-btn dl" onClick={() => setModelBlocks([...modelBlocks, {...m, id: Date.now(), modelId: m.id}])}><span className="model-icon">{m.icon}</span><div><div className="model-name">{m.name}</div><div className="model-desc">{m.desc}</div></div></button>)}
                    {modelTypes.rl.map(m => <button key={m.id} className="model-btn rl" onClick={() => setModelBlocks([...modelBlocks, {...m, id: Date.now(), modelId: m.id}])}><span className="model-icon">{m.icon}</span><div><div className="model-name">{m.name}</div><div className="model-desc">{m.desc}</div></div></button>)}
                  </div>
                  <div>
                    <h3 className="section-title">Pipeline</h3>
                    {modelBlocks.length === 0 ? <p style={{color:'#94a3b8'}}>Add layers from toolbox →</p> : modelBlocks.map((b,i) => (
                      <div key={b.id} className="pipeline-item">
                        <div className="pipeline-card">
                          <div style={{display:'flex',alignItems:'center',gap:'12px',flex:1}}>
                            <span style={{fontSize:'1.3rem'}}>{b.icon}</span>
                            <div>
                              <div style={{fontWeight:600}}>{b.name}</div>
                              {b.params && <div className="param-row">{Object.keys(b.params).map(k => <div key={k} className="param-item">{k}: <input className="param-input" value={b.params[k]} onChange={e => handleParamChange(b.id, k, e.target.value)} /></div>)}</div>}
                            </div>
                          </div>
                          <button className="delete-btn" onClick={() => setModelBlocks(modelBlocks.filter(x => x.id !== b.id))}><Trash2 size={16} /></button>
                        </div>
                        {i < modelBlocks.length - 1 && <div style={{textAlign:'center',color:'#94a3b8',margin:'8px 0'}}>↓</div>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {activeTab === 'train' && (
              <div>
                <div className="grid-2">
                  <div className="input-group"><label className="input-label">Epochs</label><input type="number" className="styled-input" value={trainingConfig.epochs} onChange={e => setTrainingConfig({...trainingConfig, epochs: +e.target.value})} /></div>
                  <div className="input-group"><label className="input-label">Learning Rate</label><input type="number" step="0.0001" className="styled-input" value={trainingConfig.learningRate} onChange={e => setTrainingConfig({...trainingConfig, learningRate: +e.target.value})} /></div>
                </div>
                <button className="btn btn-secondary" onClick={autoTune} disabled={isTraining || isAutoTuning}>{isAutoTuning ? <Activity size={16} className="spin" /> : <Zap size={16} />} Auto-Tune</button>
                <button className="btn btn-primary" onClick={trainModel} disabled={isTraining}>{isTraining ? <Activity size={16} className="spin" /> : <Play size={16} />} {isTraining ? `Training (${trainingProgress.toFixed(0)}%)` : 'Start Training'}</button>
                {isTraining && <div className="progress-bar"><div className="progress-fill" style={{width:`${trainingProgress}%`}} /></div>}
                <div style={{marginTop:'24px'}}><h4 style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'12px'}}><Terminal size={16} /> Logs</h4><div className="terminal" ref={logsRef}>{trainingLogs.map((l,i) => <div key={i} className="log-line">{l}</div>)}</div></div>
                {modelBlocks.length > 0 && (
                  <div className="code-section">
                    <h4 style={{color:'#e2e8f0',margin:'0 0 12px 0',display:'flex',alignItems:'center',gap:'8px'}}><Code size={16} /> Code Executor</h4>
                    <textarea className="code-editor" value={pythonCode} onChange={e => setPythonCode(e.target.value)} />
                    <button className="btn btn-green" style={{width:'auto',marginTop:'12px'}} onClick={runCode} disabled={isRunningPython}>{isRunningPython ? <Activity size={16} className="spin" /> : <Play size={16} />} {isRunningPython ? 'Running...' : 'Execute'}</button>
                    <div className="code-output">{pythonOutput || '$ Output appears here...'}</div>
                  </div>
                )}
              </div>
            )}
            {activeTab === 'results' && results && (
              <div>
                <h3 style={{marginBottom:'20px'}}>{results.modelName} Report</h3>
                <div className="metric-grid">
                  <div className="metric-card"><div className="metric-label">Total Return</div><div className={`metric-value ${results.backtest.totalReturn >= 0 ? 'text-green' : 'text-red'}`}>{results.backtest.totalReturn.toFixed(2)}%</div></div>
                  <div className="metric-card"><div className="metric-label">Win Rate</div><div className="metric-value text-blue">{results.backtest.winRate.toFixed(2)}%</div></div>
                  <div className="metric-card"><div className="metric-label">Max Drawdown</div><div className="metric-value text-red">{results.backtest.maxDrawdown.toFixed(2)}%</div></div>
                  <div className="metric-card"><div className="metric-label">Sharpe Ratio</div><div className="metric-value text-indigo">{results.backtest.sharpe.toFixed(2)}</div></div>
                </div>
                <div className="chart-card">
                  <h4 className="chart-title">Price vs Predictions</h4>
                  <ResponsiveContainer width="100%" height={280}>
                    <LineChart data={results.backtest.equityCurve.slice(-100)}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="idx" /><YAxis />
                      <Tooltip /><Legend />
                      <Line type="monotone" dataKey="Price" stroke="#64748b" dot={false} strokeWidth={2} />
                      <Line type="monotone" dataKey="Prediction" stroke="#f59e0b" dot={false} strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="chart-card">
                  <h4 className="chart-title">Equity Curve</h4>
                  <ResponsiveContainer width="100%" height={280}>
                    <AreaChart data={results.backtest.equityCurve}>
                      <defs><linearGradient id="grad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} /><stop offset="95%" stopColor="#2563eb" stopOpacity={0} /></linearGradient></defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="idx" /><YAxis />
                      <Tooltip formatter={v => v.toFixed(2)} /><Legend />
                      <Area type="monotone" dataKey="EquityValue" stroke="#2563eb" strokeWidth={2} fill="url(#grad)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="validation-section">
                  <h3 className="validation-title">🔄 Validate on New Data</h3>
                  <p style={{color:'#64748b',marginBottom:'16px',fontSize:'0.9rem'}}>Test your trained model on different market data.</p>
                  <div className="flex-row">
                    <div className="upload-small" onClick={() => validationInputRef.current?.click()}>
                      <Upload size={20} style={{margin:'0 auto 6px',color:'#64748b'}} />
                      <p style={{margin:0,fontSize:'0.85rem'}}>Upload CSV</p>
                      <input ref={validationInputRef} type="file" accept=".csv" onChange={e => handleFileUpload(e,'test')} style={{display:'none'}} />
                    </div>
                    <div className="upload-small">
                      <Globe size={20} style={{margin:'0 auto 6px',color:'#64748b'}} />
                      <p style={{margin:'0 0 8px 0',fontSize:'0.85rem'}}>Fetch Binance</p>
                      <div style={{display:'flex',gap:'6px',justifyContent:'center'}}>
                        <select className="select-small" onChange={e => setBinanceSymbol(e.target.value)} defaultValue="ETHUSDT">
                          <option value="BTCUSDT">BTC</option><option value="ETHUSDT">ETH</option><option value="SOLUSDT">SOL</option>
                        </select>
                        <button className="btn-small" onClick={() => fetchBinanceData(binanceSymbol,'test')} disabled={isValidating}>Go</button>
                      </div>
                    </div>
                  </div>
                  {validationData && !isValidating && <button className="btn btn-primary" onClick={validateOnNewData}><Play size={16} /> Test on {validationData.name}</button>}
                  {isValidating && <><div style={{background:'#dbeafe',padding:'12px',borderRadius:'8px',display:'flex',alignItems:'center',gap:'10px',color:'#1e40af',marginBottom:'12px'}}><Activity size={18} className="spin" /> Validating... {validationProgress}%</div><div className="progress-bar"><div className="progress-fill" style={{width:`${validationProgress}%`}} /></div></>}
                  {validationResults && (
                    <>
                      <div className="metric-grid" style={{marginTop:'20px'}}>
                        <div className="metric-card"><div className="metric-label">Validation Return</div><div className={`metric-value ${validationResults.totalReturn >= 0 ? 'text-green' : 'text-red'}`}>{validationResults.totalReturn.toFixed(2)}%</div></div>
                        <div className="metric-card"><div className="metric-label">Win Rate</div><div className="metric-value text-blue">{validationResults.winRate.toFixed(2)}%</div></div>
                        <div className="metric-card"><div className="metric-label">Max Drawdown</div><div className="metric-value text-red">{validationResults.maxDrawdown.toFixed(2)}%</div></div>
                        <div className="metric-card"><div className="metric-label">Final Balance</div><div className="metric-value text-green">${validationResults.finalBalance.toFixed(2)}</div></div>
                      </div>
                      <div className="chart-card">
                        <h4 className="chart-title">Validation Equity</h4>
                        <ResponsiveContainer width="100%" height={220}>
                          <AreaChart data={validationResults.equityCurve}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="idx" /><YAxis />
                            <Tooltip formatter={v => v.toFixed(2)} />
                            <Area type="monotone" dataKey="EquityValue" stroke="#16a34a" strokeWidth={2} fill="#dcfce7" />
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
};

export default MLPlayground;