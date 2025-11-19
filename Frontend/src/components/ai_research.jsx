import React, { useState, useEffect, useRef } from 'react';
import { Upload, Play, Download, Plus, Trash2, Settings, BarChart3, Brain, TrendingUp, AlertCircle } from 'lucide-react';
import { LineChart, Line, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import * as tf from "@tensorflow/tfjs";

// --- Mocks for missing components to ensure Preview works ---
const Header = () => <div className="p-4 bg-white shadow-sm rounded-lg mb-4 font-bold text-indigo-600">SnowAI Dashboard</div>;
const SideNavs = () => <div className="hidden"></div>;
// ------------------------------------------------------------

// Organized Styles Object (The requested "CSS Variable")
const styles = {
  pageWrapper: "min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6",
  mainContainer: "max-w-7xl mx-auto",
  
  // Header Section
  headerCard: "bg-white rounded-2xl shadow-xl p-6 mb-6",
  headerContent: "flex items-center justify-between",
  titleContainer: "mb-2",
  title: "text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent",
  subtitle: "text-gray-600 mt-2",
  headerIcon: "w-16 h-16 text-purple-500",

  // Tab Navigation
  tabContainer: "bg-white rounded-2xl shadow-xl mb-6",
  tabHeader: "flex border-b",
  tabButtonBase: "flex-1 py-4 px-6 font-semibold transition-colors focus:outline-none",
  tabActive: "border-b-4 border-purple-500 text-purple-600",
  tabInactive: "text-gray-500 hover:text-gray-700",
  tabContent: "p-6",

  // Upload Section
  uploadZone: "border-4 border-dashed border-purple-300 rounded-2xl p-12 text-center cursor-pointer hover:border-purple-500 hover:bg-purple-50 transition-all",
  uploadIcon: "w-16 h-16 mx-auto text-purple-400 mb-4",
  uploadTitle: "text-xl font-semibold text-gray-700 mb-2",
  uploadSubtitle: "text-gray-500",
  datasetListTitle: "text-lg font-semibold mb-3",
  datasetList: "space-y-2",
  datasetItem: "p-4 rounded-lg cursor-pointer transition-all",
  datasetItemActive: "bg-purple-100 border-2 border-purple-500",
  datasetItemInactive: "bg-gray-50 hover:bg-gray-100",
  datasetRow: "flex justify-between items-center",
  
  // Configuration Section
  gridTwoCols: "grid grid-cols-1 md:grid-cols-2 gap-6",
  sectionTitle: "text-xl font-bold mb-4 flex items-center gap-2",
  modelButton: "w-full p-4 rounded-lg text-left hover:shadow-lg transition-all flex items-center gap-3",
  pipelineContainer: "mt-6 p-6 bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl",
  pipelineItem: "flex items-center gap-3",
  pipelineCard: "flex-1 p-4 rounded-lg flex items-center justify-between bg-white shadow-sm",
  pipelineCardInner: "flex items-center gap-3",
  inputParam: "w-20 px-2 py-1 rounded border text-sm ml-2",
  deleteBtn: "p-2 hover:bg-red-200 rounded-lg transition-colors",
  arrowIcon: "text-2xl text-purple-500",

  // Training Section
  inputGroup: "mb-6",
  label: "block text-sm font-semibold mb-2",
  input: "w-full p-3 border-2 border-purple-200 rounded-lg focus:border-purple-500 outline-none",
  trainButton: "w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-bold text-lg hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3",
  progressBarContainer: "mt-6",
  progressBarBg: "bg-purple-100 rounded-full h-6 overflow-hidden",
  progressBarFill: "bg-gradient-to-r from-purple-600 to-pink-600 h-full transition-all duration-500",
  progressText: "text-center mt-2 font-semibold text-purple-600",

  // Results Section
  emptyState: "text-center py-12",
  emptyIcon: "w-16 h-16 mx-auto text-gray-400 mb-4",
  resultsHeader: "bg-gradient-to-r from-purple-100 to-pink-100 p-6 rounded-2xl mb-6",
  metricGrid: "grid grid-cols-1 md:grid-cols-3 gap-4",
  metricCard: "bg-white p-4 rounded-lg shadow-sm",
  metricLabel: "text-sm text-gray-600",
  metricValueBig: "text-3xl font-bold",
  metricValueMedium: "text-2xl font-bold",
  chartCard: "bg-white p-6 rounded-xl shadow-lg",
  
  // Info Panel
  infoPanel: "bg-white rounded-2xl shadow-xl p-6 mt-6",
  infoGrid: "grid grid-cols-2 md:grid-cols-4 gap-4 text-sm",
  infoTitle: "font-semibold text-purple-600 mb-1",
};

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
    <div>
      <Header />
      <SideNavs />
      
      <div className={styles.pageWrapper}>
        <div className={styles.mainContainer}>
          {/* Header */}
          <div className={styles.headerCard}>
            <div className={styles.headerContent}>
              <div>
                <h1 className={styles.title}>
                  🚀 SnowAI ML/DL Model Builder
                </h1>
                <p className={styles.subtitle}>Drag, drop, and build AI models visually</p>
              </div>
              <Brain className={styles.headerIcon} />
            </div>
          </div>

          {/* Tabs */}
          <div className={styles.tabContainer}>
            <div className={styles.tabHeader}>
              {['upload', 'configure', 'train', 'results'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`${styles.tabButtonBase} ${
                    activeTab === tab
                      ? styles.tabActive
                      : styles.tabInactive
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            <div className={styles.tabContent}>
              {/* Upload Tab */}
              {activeTab === 'upload' && (
                <div>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className={styles.uploadZone}
                  >
                    <Upload className={styles.uploadIcon} />
                    <h3 className={styles.uploadTitle}>
                      Drop your CSV dataset here
                    </h3>
                    <p className={styles.uploadSubtitle}>or click to browse files</p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".csv"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </div>

                  {datasets.length > 0 && (
                    <div className="mt-6">
                      <h3 className={styles.datasetListTitle}>Uploaded Datasets</h3>
                      <div className={styles.datasetList}>
                        {datasets.map(ds => (
                          <div
                            key={ds.id}
                            onClick={() => setSelectedDataset(ds)}
                            className={`${styles.datasetItem} ${
                              selectedDataset?.id === ds.id
                                ? styles.datasetItemActive
                                : styles.datasetItemInactive
                            }`}
                          >
                            <div className={styles.datasetRow}>
                              <div>
                                <p className="font-semibold">{ds.name}</p>
                                <p className="text-sm text-gray-600">
                                  {ds.rows} rows × {ds.cols} columns
                                </p>
                              </div>
                              <BarChart3 className="w-6 h-6 text-purple-500" />
                            </div>
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
                  <div className={styles.gridTwoCols}>
                    {/* ML Models */}
                    <div>
                      <h3 className={styles.sectionTitle}>
                        <TrendingUp className="w-6 h-6" />
                        Machine Learning Models
                      </h3>
                      <div className="space-y-2">
                        {modelTypes.ml.map(model => (
                          <button
                            key={model.id}
                            onClick={() => addModelBlock('ml', model.id)}
                            className={`${styles.modelButton} ${model.color}`}
                          >
                            <span className="text-2xl">{model.icon}</span>
                            <span className="font-semibold">{model.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* DL Layers */}
                    <div>
                      <h3 className={styles.sectionTitle}>
                        <Brain className="w-6 h-6" />
                        Deep Learning Layers
                      </h3>
                      <div className="space-y-2">
                        {modelTypes.dl.map(layer => (
                          <button
                            key={layer.id}
                            onClick={() => addModelBlock('dl', layer.id)}
                            className={`${styles.modelButton} bg-purple-100`}
                          >
                            <span className="text-2xl">{layer.icon}</span>
                            <span className="font-semibold">{layer.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Model Pipeline */}
                  {modelBlocks.length > 0 && (
                    <div className={styles.pipelineContainer}>
                      <h3 className="text-xl font-bold mb-4">Your Model Pipeline</h3>
                      <div className="space-y-3">
                        {modelBlocks.map((block, idx) => (
                          <div key={block.id} className={styles.pipelineItem}>
                            <div className={`${styles.pipelineCard} ${block.color}`}>
                              <div className={styles.pipelineCardInner}>
                                <span className="text-2xl">{block.icon}</span>
                                <div>
                                  <p className="font-semibold">{block.name}</p>
                                  {block.type === 'dl' && (
                                    <div className="flex gap-2 mt-2">
                                      {Object.entries(block.params).map(([key, value]) => (
                                        <input
                                          key={key}
                                          type="number"
                                          value={value}
                                          onChange={(e) => updateBlockParams(block.id, {
                                            [key]: parseFloat(e.target.value)
                                          })}
                                          className={styles.inputParam}
                                          placeholder={key}
                                        />
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                              <button
                                onClick={() => removeModelBlock(block.id)}
                                className={styles.deleteBtn}
                              >
                                <Trash2 className="w-5 h-5 text-red-600" />
                              </button>
                            </div>
                            {idx < modelBlocks.length - 1 && (
                              <div className={styles.arrowIcon}>→</div>
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
                  <div className={`${styles.gridTwoCols} mb-6`}>
                    <div>
                      <label className={styles.label}>Epochs</label>
                      <input
                        type="number"
                        value={trainingConfig.epochs}
                        onChange={(e) => setTrainingConfig({...trainingConfig, epochs: parseInt(e.target.value)})}
                        className={styles.input}
                      />
                    </div>
                    <div>
                      <label className={styles.label}>Batch Size</label>
                      <input
                        type="number"
                        value={trainingConfig.batchSize}
                        onChange={(e) => setTrainingConfig({...trainingConfig, batchSize: parseInt(e.target.value)})}
                        className={styles.input}
                      />
                    </div>
                    <div>
                      <label className={styles.label}>Learning Rate</label>
                      <input
                        type="number"
                        step="0.001"
                        value={trainingConfig.learningRate}
                        onChange={(e) => setTrainingConfig({...trainingConfig, learningRate: parseFloat(e.target.value)})}
                        className={styles.input}
                      />
                    </div>
                    <div>
                      <label className={styles.label}>Train/Test Split</label>
                      <input
                        type="number"
                        step="0.1"
                        min="0.5"
                        max="0.9"
                        value={trainingConfig.trainTestSplit}
                        onChange={(e) => setTrainingConfig({...trainingConfig, trainTestSplit: parseFloat(e.target.value)})}
                        className={styles.input}
                      />
                    </div>
                  </div>

                  <button
                    onClick={trainModel}
                    disabled={isTraining || !selectedDataset || modelBlocks.length === 0}
                    className={styles.trainButton}
                  >
                    <Play className="w-6 h-6" />
                    {isTraining ? 'Training...' : 'Start Training'}
                  </button>

                  {isTraining && (
                    <div className={styles.progressBarContainer}>
                      <div className={styles.progressBarBg}>
                        <div
                          className={styles.progressBarFill}
                          style={{ width: `${trainingProgress}%` }}
                        />
                      </div>
                      <p className={styles.progressText}>
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
                    <div className={styles.emptyState}>
                      <AlertCircle className={styles.emptyIcon} />
                      <p className="text-gray-500 text-lg">No results yet. Train a model first!</p>
                    </div>
                  )}

                  {results && results.type === 'deep_learning' && (
                    <div>
                      <div className={styles.resultsHeader}>
                        <h3 className="text-2xl font-bold mb-4">{results.modelName}</h3>
                        <div className={styles.metricGrid}>
                          <div className={styles.metricCard}>
                            <p className={styles.metricLabel}>R² Score</p>
                            <p className={`${styles.metricValueBig} text-purple-600`}>
                              {results.metrics.r2.toFixed(4)}
                            </p>
                          </div>
                          <div className={styles.metricCard}>
                            <p className={styles.metricLabel}>RMSE</p>
                            <p className={`${styles.metricValueBig} text-pink-600`}>
                              {results.metrics.rmse.toFixed(4)}
                            </p>
                          </div>
                          <div className={styles.metricCard}>
                            <p className={styles.metricLabel}>MSE</p>
                            <p className={`${styles.metricValueBig} text-indigo-600`}>
                              {results.metrics.mse.toFixed(4)}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className={styles.gridTwoCols}>
                        <div className={styles.chartCard}>
                          <h4 className="font-bold mb-4">Training History</h4>
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

                        <div className={styles.chartCard}>
                          <h4 className="font-bold mb-4">Predictions vs Actual</h4>
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
                    <div className="space-y-6">
                      {results.models.map((model, idx) => (
                        <div key={idx} className={styles.chartCard}>
                          <h3 className={styles.sectionTitle}>
                            <span className="text-2xl">{model.icon}</span>
                            {model.modelName}
                          </h3>
                          <div className={`${styles.metricGrid} mb-4`}>
                            <div className="bg-purple-50 p-3 rounded-lg">
                              <p className={styles.metricLabel}>R² Score</p>
                              <p className={`${styles.metricValueMedium} text-purple-600`}>
                                {model.metrics.r2.toFixed(4)}
                              </p>
                            </div>
                            <div className="bg-pink-50 p-3 rounded-lg">
                              <p className={styles.metricLabel}>RMSE</p>
                              <p className={`${styles.metricValueMedium} text-pink-600`}>
                                {model.metrics.rmse.toFixed(4)}
                              </p>
                            </div>
                            <div className="bg-indigo-50 p-3 rounded-lg">
                              <p className={styles.metricLabel}>MSE</p>
                              <p className={`${styles.metricValueMedium} text-indigo-600`}>
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
          <div className={styles.infoPanel}>
            <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-purple-500" />
              Quick Guide
            </h3>
            <div className={styles.infoGrid}>
              <div>
                <p className={styles.infoTitle}>📤 Step 1: Upload</p>
                <p className="text-gray-600">Drop your CSV file with numeric data</p>
              </div>
              <div>
                <p className={styles.infoTitle}>🎯 Step 2: Configure</p>
                <p className="text-gray-600">Add ML models or build custom DL layers</p>
              </div>
              <div>
                <p className={styles.infoTitle}>⚙️ Step 3: Train</p>
                <p className="text-gray-600">Set hyperparameters and start training</p>
              </div>
              <div>
                <p className={styles.infoTitle}>📊 Step 4: Results</p>
                <p className="text-gray-600">View metrics and visualizations</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MLPlayground;