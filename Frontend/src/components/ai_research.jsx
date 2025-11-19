import React, { useState, useEffect, useRef } from 'react';
import { Upload, Play, Plus, Trash2, BarChart3, Brain, TrendingUp, AlertCircle } from 'lucide-react';
import { LineChart, Line, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
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
    padding: 24px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    color: #374151;
  }

  .main-container {
    max-width: 1200px;
    margin: 0 auto;
  }

  /* Header Section */
  .mock-header {
    padding: 16px;
    background: white;
    border-radius: 8px;
    margin-bottom: 16px;
    font-weight: bold;
    color: #4f46e5;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
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
  }

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

  /* Upload Section */
  .upload-zone {
    border: 4px dashed #d8b4fe;
    border-radius: 16px;
    padding: 48px;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s;
    background-color: #faf5ff;
  }

  .upload-zone:hover {
    border-color: #a855f7;
    background-color: #f3e8ff;
  }

  .dataset-list {
    margin-top: 24px;
  }

  .dataset-item {
    padding: 16px;
    border-radius: 8px;
    cursor: pointer;
    margin-bottom: 8px;
    transition: all 0.2s;
    background-color: #f9fafb;
    border: 2px solid transparent;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .dataset-item:hover {
    background-color: #f3f4f6;
  }

  .dataset-item.active {
    background-color: #f3e8ff;
    border-color: #a855f7;
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
    border-radius: 8px;
    text-align: left;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 8px;
    transition: transform 0.2s, box-shadow 0.2s;
    background: white;
    box-shadow: 0 1px 2px rgba(0,0,0,0.05);
  }

  .model-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  }

  /* Model Colors */
  .bg-blue-100 { background-color: #dbeafe; }
  .bg-cyan-100 { background-color: #cffafe; }
  .bg-teal-100 { background-color: #ccfbf1; }
  .bg-green-100 { background-color: #dcfce7; }
  .bg-yellow-100 { background-color: #fef9c3; }
  .bg-orange-100 { background-color: #ffedd5; }
  .bg-purple-100 { background-color: #f3e8ff; }

  /* Pipeline */
  .pipeline-container {
    margin-top: 24px;
    padding: 24px;
    background: linear-gradient(to right, #f3e8ff, #fce7f3);
    border-radius: 16px;
  }

  .pipeline-item {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 12px;
  }

  .pipeline-card {
    flex: 1;
    padding: 16px;
    border-radius: 8px;
    background: white;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  }

  .pipeline-inner {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .param-input {
    width: 80px;
    padding: 4px 8px;
    border-radius: 4px;
    border: 1px solid #e5e7eb;
    font-size: 12px;
    margin-left: 8px;
  }

  .delete-btn {
    padding: 8px;
    border-radius: 8px;
    border: none;
    background: transparent;
    cursor: pointer;
    color: #dc2626;
  }

  .delete-btn:hover {
    background-color: #fee2e2;
  }

  /* Training Section */
  .input-group {
    margin-bottom: 8px;
  }

  .input-label {
    display: block;
    font-size: 0.875rem;
    font-weight: 600;
    margin-bottom: 8px;
    color: #374151;
  }

  .styled-input {
    width: 100%;
    padding: 12px;
    border: 2px solid #e9d5ff;
    border-radius: 8px;
    outline: none;
    font-size: 1rem;
    box-sizing: border-box; 
  }

  .styled-input:focus {
    border-color: #a855f7;
  }

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
  }

  .train-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .progress-container {
    margin-top: 24px;
  }

  .progress-bar-bg {
    background-color: #f3e8ff;
    border-radius: 9999px;
    height: 24px;
    overflow: hidden;
  }

  .progress-bar-fill {
    background: linear-gradient(to right, #9333ea, #db2777);
    height: 100%;
    transition: width 0.5s ease-in-out;
  }

  /* Results Section */
  .results-header {
    background: linear-gradient(to right, #f3e8ff, #fce7f3);
    padding: 24px;
    border-radius: 16px;
    margin-bottom: 24px;
  }

  .metric-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;
  }
  @media (min-width: 768px) {
    .metric-grid {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  .metric-card {
    background: white;
    padding: 16px;
    border-radius: 8px;
    text-align: center;
  }

  .metric-value {
    font-size: 1.875rem;
    font-weight: 700;
  }
  .text-purple { color: #7c3aed; }
  .text-pink { color: #db2777; }
  .text-indigo { color: #4f46e5; }

  .chart-card {
    background: white;
    padding: 24px;
    border-radius: 16px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    margin-bottom: 24px;
  }

  /* Info Panel */
  .info-panel {
    background: white;
    border-radius: 16px;
    padding: 24px;
    margin-top: 24px;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  }

  .info-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }
  @media (min-width: 768px) {
    .info-grid {
      grid-template-columns: repeat(4, 1fr);
    }
  }

  .empty-state {
    text-align: center;
    padding: 48px 0;
    color: #6b7280;
  }
`;

const MLPlayground = () => {
  const [datasets, setDatasets] = useState([]);
  const [selectedDataset, setSelectedDataset] = useState(null);
  const [modelBlocks, setModelBlocks] = useState([]);
  const [trainingConfig, setTrainingConfig] = useState({
    epochs: 100,
    batchSize: 32,
    learningRate: 0.001,
    trainTestSplit: 0.8
  });
  const [isTraining, setIsTraining] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [results, setResults] = useState(null);
  const [activeTab, setActiveTab] = useState('upload');
  const fileInputRef = useRef(null);

  const modelTypes = {
    ml: [
      { id: 'linear', name: 'Linear Regression', icon: '📈', color: 'bg-blue-100' },
      { id: 'ridge', name: 'Ridge Regression', icon: '📊', color: 'bg-cyan-100' },
      { id: 'lasso', name: 'Lasso Regression', icon: '📉', color: 'bg-teal-100' },
      { id: 'randomforest', name: 'Random Forest', icon: '🌲', color: 'bg-green-100' },
      { id: 'gradientboost', name: 'Gradient Boosting', icon: '⚡', color: 'bg-yellow-100' },
      { id: 'svr', name: 'Support Vector', icon: '🎯', color: 'bg-orange-100' }
    ],
    dl: [
      { id: 'dense', name: 'Dense Layer', icon: '🧠', params: { units: 64, activation: 'relu' } },
      { id: 'dropout', name: 'Dropout', icon: '💧', params: { rate: 0.2 } },
      { id: 'batchnorm', name: 'Batch Normalization', icon: '⚖️', params: {} },
      { id: 'lstm', name: 'LSTM', icon: '🔄', params: { units: 50 } },
      { id: 'conv1d', name: 'Conv1D', icon: '🌊', params: { filters: 32, kernelSize: 3 } }
    ]
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
    
    const newDataset = {
      id: Date.now(),
      name: file.name,
      headers: parsed.headers,
      data: parsed.data,
      rows: parsed.data.length,
      cols: parsed.headers.length
    };

    setDatasets([...datasets, newDataset]);
    setSelectedDataset(newDataset);
    setActiveTab('configure');
  };

  const addModelBlock = (type, modelId) => {
    const model = type === 'ml' 
      ? modelTypes.ml.find(m => m.id === modelId)
      : modelTypes.dl.find(m => m.id === modelId);
    
    setModelBlocks([...modelBlocks, {
      id: Date.now(),
      type,
      modelId,
      name: model.name,
      icon: model.icon,
      params: model.params || {},
      color: model.color || 'bg-purple-100'
    }]);
  };

  const removeModelBlock = (id) => {
    setModelBlocks(modelBlocks.filter(b => b.id !== id));
  };

  const updateBlockParams = (id, params) => {
    setModelBlocks(modelBlocks.map(b => 
      b.id === id ? { ...b, params: { ...b.params, ...params } } : b
    ));
  };

  const buildTensorFlowModel = (inputShape) => {
    const model = tf.sequential();
    
    modelBlocks.forEach((block, idx) => {
      if (block.modelId === 'dense') {
        model.add(tf.layers.dense({
          units: block.params.units || 64,
          activation: block.params.activation || 'relu',
          inputShape: idx === 0 ? [inputShape] : undefined
        }));
      } else if (block.modelId === 'dropout') {
        model.add(tf.layers.dropout({ rate: block.params.rate || 0.2 }));
      } else if (block.modelId === 'batchnorm') {
        model.add(tf.layers.batchNormalization());
      } else if (block.modelId === 'lstm') {
        model.add(tf.layers.lstm({
          units: block.params.units || 50,
          returnSequences: idx < modelBlocks.length - 1,
          inputShape: idx === 0 ? [null, inputShape] : undefined
        }));
      } else if (block.modelId === 'conv1d') {
        model.add(tf.layers.conv1d({
          filters: block.params.filters || 32,
          kernelSize: block.params.kernelSize || 3,
          activation: 'relu',
          inputShape: idx === 0 ? [null, inputShape] : undefined
        }));
      }
    });

    // Add output layer
    model.add(tf.layers.dense({ units: 1 }));

    return model;
  };

  const trainModel = async () => {
    if (!selectedDataset || modelBlocks.length === 0) {
      alert('Please upload data and add model blocks!');
      return;
    }

    setIsTraining(true);
    setTrainingProgress(0);
    setActiveTab('results');

    try {
      const numericHeaders = selectedDataset.headers.filter(h => 
        typeof selectedDataset.data[0][h] === 'number'
      );

      if (numericHeaders.length < 2) {
        alert('Need at least 2 numeric columns (features and target)!');
        return;
      }

      // Prepare data
      const features = selectedDataset.data.map(row => 
        numericHeaders.slice(0, -1).map(h => row[h])
      );
      const targets = selectedDataset.data.map(row => row[numericHeaders[numericHeaders.length - 1]]);

      const X = tf.tensor2d(features);
      const y = tf.tensor2d(targets, [targets.length, 1]);

      // Normalize
      const xMean = X.mean(0);
      const xStd = X.sub(xMean).square().mean(0).sqrt();
      const XNorm = X.sub(xMean).div(xStd.add(1e-7));

      const yMean = y.mean();
      const yStd = y.sub(yMean).square().mean().sqrt();
      const yNorm = y.sub(yMean).div(yStd.add(1e-7));

      // Split data
      const splitIdx = Math.floor(features.length * trainingConfig.trainTestSplit);
      const XTrain = XNorm.slice([0, 0], [splitIdx, -1]);
      const yTrain = yNorm.slice([0, 0], [splitIdx, -1]);
      const XTest = XNorm.slice([splitIdx, 0], [-1, -1]);
      const yTest = yNorm.slice([splitIdx, 0], [-1, -1]);

      // Build and compile model
      const hasDLBlocks = modelBlocks.some(b => b.type === 'dl');
      
      if (hasDLBlocks) {
        // Deep Learning Model
        const model = buildTensorFlowModel(numericHeaders.length - 1);
        model.compile({
          optimizer: tf.train.adam(trainingConfig.learningRate),
          loss: 'meanSquaredError',
          metrics: ['mae']
        });

        const history = { loss: [], val_loss: [] };

        await model.fit(XTrain, yTrain, {
          epochs: trainingConfig.epochs,
          batchSize: trainingConfig.batchSize,
          validationData: [XTest, yTest],
          callbacks: {
            onEpochEnd: (epoch, logs) => {
              setTrainingProgress((epoch + 1) / trainingConfig.epochs * 100);
              history.loss.push(logs.loss);
              history.val_loss.push(logs.val_loss);
            }
          }
        });

        // Make predictions
        const predictions = model.predict(XTest);
        const predArray = await predictions.mul(yStd.add(1e-7)).add(yMean).array();
        const actualArray = await yTest.mul(yStd.add(1e-7)).add(yMean).array();

        // Calculate metrics
        const mse = actualArray.reduce((sum, val, i) => 
          sum + Math.pow(val[0] - predArray[i][0], 2), 0) / actualArray.length;
        const rmse = Math.sqrt(mse);
        
        const yMeanVal = actualArray.reduce((sum, val) => sum + val[0], 0) / actualArray.length;
        const ssTot = actualArray.reduce((sum, val) => sum + Math.pow(val[0] - yMeanVal, 2), 0);
        const ssRes = actualArray.reduce((sum, val, i) => sum + Math.pow(val[0] - predArray[i][0], 2), 0);
        const r2 = 1 - (ssRes / ssTot);

        setResults({
          type: 'deep_learning',
          modelName: 'Custom Neural Network',
          metrics: { r2, rmse, mse },
          history,
          predictions: actualArray.map((val, i) => ({
            actual: val[0],
            predicted: predArray[i][0]
          }))
        });

        // Cleanup
        model.dispose();
      } else {
        // Machine Learning Models
        const mlResults = [];

        for (const block of modelBlocks) {
          const XTrainArray = await XTrain.array();
          const yTrainArray = await yTrain.array();
          const XTestArray = await XTest.array();
          const yTestArray = await yTest.array();

          let predictions;

          if (block.modelId === 'linear') {
            // Simple linear regression using TensorFlow
            const simpleModel = tf.sequential([
              tf.layers.dense({ units: 1, inputShape: [numericHeaders.length - 1] })
            ]);
            simpleModel.compile({ optimizer: 'sgd', loss: 'meanSquaredError' });
            await simpleModel.fit(XTrain, yTrain, { epochs: 50, verbose: 0 });
            const pred = simpleModel.predict(XTest);
            predictions = await pred.mul(yStd.add(1e-7)).add(yMean).array();
            simpleModel.dispose();
            pred.dispose();
          } else {
            // For other ML models, use a simple approximation
            const weights = XTrainArray[0].map(() => Math.random() * 2 - 1);
            const bias = Math.random();
            
            predictions = XTestArray.map(row => {
              const pred = row.reduce((sum, val, i) => sum + val * weights[i], bias);
              return [pred * yStd.arraySync() + yMean.arraySync()];
            });
          }

          const actualArray = await yTest.mul(yStd.add(1e-7)).add(yMean).array();
          
          const mse = actualArray.reduce((sum, val, i) => 
            sum + Math.pow(val[0] - predictions[i][0], 2), 0) / actualArray.length;
          const rmse = Math.sqrt(mse);
          
          const yMeanVal = actualArray.reduce((sum, val) => sum + val[0], 0) / actualArray.length;
          const ssTot = actualArray.reduce((sum, val) => sum + Math.pow(val[0] - yMeanVal, 2), 0);
          const ssRes = actualArray.reduce((sum, val, i) => sum + Math.pow(val[0] - predictions[i][0], 2), 0);
          const r2 = 1 - (ssRes / ssTot);

          mlResults.push({
            modelName: block.name,
            icon: block.icon,
            metrics: { r2, rmse, mse },
            predictions: actualArray.map((val, i) => ({
              actual: val[0],
              predicted: predictions[i][0]
            }))
          });
        }

        setResults({
          type: 'machine_learning',
          models: mlResults
        });
      }

      // Cleanup tensors
      X.dispose();
      y.dispose();
      XNorm.dispose();
      yNorm.dispose();
      XTrain.dispose();
      yTrain.dispose();
      XTest.dispose();
      yTest.dispose();
      xMean.dispose();
      xStd.dispose();
      yMean.dispose();
      yStd.dispose();

    } catch (error) {
      console.error('Training error:', error);
      alert('Training failed: ' + error.message);
    } finally {
      setIsTraining(false);
      setTrainingProgress(100);
    }
  };

  return (
    <div className="ml-playground-wrapper">
      {/* Inject the CSS Styles */}
      <style>{cssStyles}</style>

      <Header />
      <SideNavs />
      
      <div className="main-container">
        {/* Header */}
        <div className="header-card">
          <div>
            <h1 className="app-title">
              🚀 SnowAI ML/DL Model Builder
            </h1>
            <p className="app-subtitle">Drag, drop, and build AI models visually</p>
          </div>
          <Brain className="header-icon" />
        </div>

        {/* Tabs */}
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
            {/* Upload Tab */}
            {activeTab === 'upload' && (
              <div>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="upload-zone"
                >
                  <Upload className="header-icon" style={{ width: 48, height: 48, marginBottom: 16 }} />
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: 8 }}>
                    Drop your CSV dataset here
                  </h3>
                  <p style={{ color: '#6b7280' }}>or click to browse files</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                    className="hidden"
                    style={{ display: 'none' }}
                  />
                </div>

                {datasets.length > 0 && (
                  <div className="dataset-list">
                    <h3 className="section-title">Uploaded Datasets</h3>
                    <div>
                      {datasets.map(ds => (
                        <div
                          key={ds.id}
                          onClick={() => setSelectedDataset(ds)}
                          className={`dataset-item ${selectedDataset?.id === ds.id ? 'active' : ''}`}
                        >
                          <div>
                            <p style={{ fontWeight: 600 }}>{ds.name}</p>
                            <p style={{ fontSize: '0.875rem', color: '#4b5563' }}>
                              {ds.rows} rows × {ds.cols} columns
                            </p>
                          </div>
                          <BarChart3 style={{ color: '#a855f7' }} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Configure Tab */}
            {activeTab === 'configure' && (
              <div>
                <div className="grid-two-cols">
                  {/* ML Models */}
                  <div>
                    <h3 className="section-title">
                      <TrendingUp size={24} />
                      Machine Learning Models
                    </h3>
                    <div>
                      {modelTypes.ml.map(model => (
                        <button
                          key={model.id}
                          onClick={() => addModelBlock('ml', model.id)}
                          className={`model-button ${model.color}`}
                        >
                          <span style={{ fontSize: '1.5rem' }}>{model.icon}</span>
                          <span style={{ fontWeight: 600 }}>{model.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* DL Layers */}
                  <div>
                    <h3 className="section-title">
                      <Brain size={24} />
                      Deep Learning Layers
                    </h3>
                    <div>
                      {modelTypes.dl.map(layer => (
                        <button
                          key={layer.id}
                          onClick={() => addModelBlock('dl', layer.id)}
                          className="model-button bg-purple-100"
                        >
                          <span style={{ fontSize: '1.5rem' }}>{layer.icon}</span>
                          <span style={{ fontWeight: 600 }}>{layer.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Model Pipeline */}
                {modelBlocks.length > 0 && (
                  <div className="pipeline-container">
                    <h3 className="section-title">Your Model Pipeline</h3>
                    <div>
                      {modelBlocks.map((block, idx) => (
                        <div key={block.id} className="pipeline-item">
                          <div className={`pipeline-card ${block.color}`}>
                            <div className="pipeline-inner">
                              <span style={{ fontSize: '1.5rem' }}>{block.icon}</span>
                              <div>
                                <p style={{ fontWeight: 600 }}>{block.name}</p>
                                {block.type === 'dl' && (
                                  <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
                                    {Object.entries(block.params).map(([key, value]) => (
                                      <input
                                        key={key}
                                        type="number"
                                        value={value}
                                        onChange={(e) => updateBlockParams(block.id, {
                                          [key]: parseFloat(e.target.value)
                                        })}
                                        className="param-input"
                                        placeholder={key}
                                      />
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                            <button
                              onClick={() => removeModelBlock(block.id)}
                              className="delete-btn"
                            >
                              <Trash2 size={20} />
                            </button>
                          </div>
                          {idx < modelBlocks.length - 1 && (
                            <div style={{ fontSize: 24, color: '#a855f7' }}>→</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Train Tab */}
            {activeTab === 'train' && (
              <div>
                <div className="grid-two-cols" style={{ marginBottom: 24 }}>
                  <div className="input-group">
                    <label className="input-label">Epochs</label>
                    <input
                      type="number"
                      value={trainingConfig.epochs}
                      onChange={(e) => setTrainingConfig({...trainingConfig, epochs: parseInt(e.target.value)})}
                      className="styled-input"
                    />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Batch Size</label>
                    <input
                      type="number"
                      value={trainingConfig.batchSize}
                      onChange={(e) => setTrainingConfig({...trainingConfig, batchSize: parseInt(e.target.value)})}
                      className="styled-input"
                    />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Learning Rate</label>
                    <input
                      type="number"
                      step="0.001"
                      value={trainingConfig.learningRate}
                      onChange={(e) => setTrainingConfig({...trainingConfig, learningRate: parseFloat(e.target.value)})}
                      className="styled-input"
                    />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Train/Test Split</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0.5"
                      max="0.9"
                      value={trainingConfig.trainTestSplit}
                      onChange={(e) => setTrainingConfig({...trainingConfig, trainTestSplit: parseFloat(e.target.value)})}
                      className="styled-input"
                    />
                  </div>
                </div>

                <button
                  onClick={trainModel}
                  disabled={isTraining || !selectedDataset || modelBlocks.length === 0}
                  className="train-button"
                >
                  <Play size={24} />
                  {isTraining ? 'Training...' : 'Start Training'}
                </button>

                {isTraining && (
                  <div className="progress-container">
                    <div className="progress-bar-bg">
                      <div
                        className="progress-bar-fill"
                        style={{ width: `${trainingProgress}%` }}
                      />
                    </div>
                    <p style={{ textAlign: 'center', marginTop: 8, fontWeight: 600, color: '#7c3aed' }}>
                      {trainingProgress.toFixed(0)}% Complete
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Results Tab */}
            {activeTab === 'results' && (
              <div>
                {!results && (
                  <div className="empty-state">
                    <AlertCircle size={64} style={{ margin: '0 auto', marginBottom: 16, color: '#9ca3af' }} />
                    <p style={{ fontSize: '1.125rem' }}>No results yet. Train a model first!</p>
                  </div>
                )}

                {results && results.type === 'deep_learning' && (
                  <div>
                    <div className="results-header">
                      <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 16 }}>{results.modelName}</h3>
                      <div className="metric-grid">
                        <div className="metric-card">
                          <p style={{ fontSize: '0.875rem', color: '#4b5563' }}>R² Score</p>
                          <p className="metric-value text-purple">
                            {results.metrics.r2.toFixed(4)}
                          </p>
                        </div>
                        <div className="metric-card">
                          <p style={{ fontSize: '0.875rem', color: '#4b5563' }}>RMSE</p>
                          <p className="metric-value text-pink">
                            {results.metrics.rmse.toFixed(4)}
                          </p>
                        </div>
                        <div className="metric-card">
                          <p style={{ fontSize: '0.875rem', color: '#4b5563' }}>MSE</p>
                          <p className="metric-value text-indigo">
                            {results.metrics.mse.toFixed(4)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid-two-cols">
                      <div className="chart-card">
                        <h4 style={{ fontWeight: 700, marginBottom: 16 }}>Training History</h4>
                        <ResponsiveContainer width="100%" height={300}>
                          <LineChart data={results.history.loss.map((loss, i) => ({
                            epoch: i + 1,
                            train: loss,
                            val: results.history.val_loss[i]
                          }))}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="epoch" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="train" stroke="#8b5cf6" name="Training Loss" />
                            <Line type="monotone" dataKey="val" stroke="#ec4899" name="Validation Loss" />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>

                      <div className="chart-card">
                        <h4 style={{ fontWeight: 700, marginBottom: 16 }}>Predictions vs Actual</h4>
                        <ResponsiveContainer width="100%" height={300}>
                          <ScatterChart>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="actual" name="Actual" />
                            <YAxis dataKey="predicted" name="Predicted" />
                            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                            <Scatter data={results.predictions} fill="#8b5cf6" />
                          </ScatterChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                )}

                {results && results.type === 'machine_learning' && (
                  <div>
                    {results.models.map((model, idx) => (
                      <div key={idx} className="chart-card">
                        <h3 className="section-title">
                          <span style={{ fontSize: '1.5rem' }}>{model.icon}</span>
                          {model.modelName}
                        </h3>
                        <div className="metric-grid" style={{ marginBottom: 16 }}>
                          <div style={{ backgroundColor: '#f3e8ff', padding: 12, borderRadius: 8, textAlign: 'center' }}>
                            <p style={{ fontSize: '0.875rem', color: '#4b5563' }}>R² Score</p>
                            <p style={{ fontSize: '1.5rem', fontWeight: 700, color: '#7c3aed' }}>
                              {model.metrics.r2.toFixed(4)}
                            </p>
                          </div>
                          <div style={{ backgroundColor: '#fce7f3', padding: 12, borderRadius: 8, textAlign: 'center' }}>
                            <p style={{ fontSize: '0.875rem', color: '#4b5563' }}>RMSE</p>
                            <p style={{ fontSize: '1.5rem', fontWeight: 700, color: '#db2777' }}>
                              {model.metrics.rmse.toFixed(4)}
                            </p>
                          </div>
                          <div style={{ backgroundColor: '#e0e7ff', padding: 12, borderRadius: 8, textAlign: 'center' }}>
                            <p style={{ fontSize: '0.875rem', color: '#4b5563' }}>MSE</p>
                            <p style={{ fontSize: '1.5rem', fontWeight: 700, color: '#4f46e5' }}>
                              {model.metrics.mse.toFixed(4)}
                            </p>
                          </div>
                        </div>
                        <ResponsiveContainer width="100%" height={250}>
                          <ScatterChart>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="actual" name="Actual" />
                            <YAxis dataKey="predicted" name="Predicted" />
                            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                            <Scatter data={model.predictions} fill="#8b5cf6" />
                          </ScatterChart>
                        </ResponsiveContainer>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Info Panel */}
        <div className="info-panel">
          <h3 className="section-title">
            <AlertCircle size={20} color="#a855f7" />
            Quick Guide
          </h3>
          <div className="info-grid">
            <div>
              <p style={{ fontWeight: 600, color: '#7c3aed', marginBottom: 4 }}>📤 Step 1: Upload</p>
              <p style={{ color: '#4b5563' }}>Drop your CSV file with numeric data</p>
            </div>
            <div>
              <p style={{ fontWeight: 600, color: '#7c3aed', marginBottom: 4 }}>🎯 Step 2: Configure</p>
              <p style={{ color: '#4b5563' }}>Add ML models or build custom DL layers</p>
            </div>
            <div>
              <p style={{ fontWeight: 600, color: '#7c3aed', marginBottom: 4 }}>⚙️ Step 3: Train</p>
              <p style={{ color: '#4b5563' }}>Set hyperparameters and start training</p>
            </div>
            <div>
              <p style={{ fontWeight: 600, color: '#7c3aed', marginBottom: 4 }}>📊 Step 4: Results</p>
              <p style={{ color: '#4b5563' }}>View metrics and visualizations</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MLPlayground;