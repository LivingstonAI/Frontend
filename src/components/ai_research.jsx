import React, { useState, useEffect, useRef } from 'react';
import { Upload, Play, Trash2, Brain, Activity, Zap, Globe, Code, RefreshCw, Layers, Terminal, Save, Download, Cpu, Gamepad2, LayoutTemplate, AlertTriangle, Eye } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import * as tf from "@tensorflow/tfjs";
import Header from "./header";
import SideNavs from "./side_navs";


// --- CSS STYLES ---
const cssStyles = `
  .title h1 { margin: 0; font-size: 1.8rem; color: #0f172a; }
  .title p { margin: 4px 0 0; color: #64748b; }
  
  .tabs { display: flex; background: white; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; margin-bottom: 24px; }
  .tab { flex: 1; padding: 16px; border: none; background: none; font-weight: 600; color: #64748b; cursor: pointer; transition: all 0.2s; border-bottom: 3px solid transparent; }
  .tab:hover { background: #f1f5f9; }
  .tab.active { color: #2563eb; border-bottom-color: #2563eb; background: #eff6ff; }
  
  .card { background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; margin-bottom: 24px; }
  .btn { padding: 10px 20px; border-radius: 8px; border: none; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: 0.2s; justify-content: center; }
  .btn-primary { background: #2563eb; color: white; }
  .btn-primary:hover { background: #1d4ed8; }
  .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
  .btn-outline { background: white; border: 1px solid #cbd5e1; color: #475569; }
  .btn-outline:hover { border-color: #2563eb; color: #2563eb; }
  .btn-ghost { background: transparent; color: #64748b; padding: 6px 12px; font-size: 0.9rem; }
  .btn-ghost:hover { background: #f1f5f9; color: #1e293b; }

  .upload-box { border: 2px dashed #cbd5e1; border-radius: 12px; padding: 40px; text-align: center; cursor: pointer; background: #f8fafc; transition: 0.2s; }
  .upload-box:hover { border-color: #2563eb; background: #eff6ff; }
  
  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
  .model-item { border: 1px solid #e2e8f0; padding: 12px; border-radius: 8px; margin-bottom: 12px; cursor: pointer; display: flex; align-items: center; gap: 12px; background: white; transition: 0.2s; }
  .model-item:hover { border-color: #2563eb; transform: translateY(-2px); }
  
  .pipeline-node { background: white; border: 1px solid #e2e8f0; padding: 16px; border-radius: 8px; margin-bottom: 8px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; }
  .pipeline-inputs { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; }
  .pipeline-input-group { display: flex; align-items: center; gap: 6px; font-size: 0.85rem; color: #64748b; }
  .mini-input { width: 70px; padding: 4px 8px; border: 1px solid #cbd5e1; border-radius: 4px; }
  
  .terminal { background: #0f172a; color: #4ade80; padding: 16px; border-radius: 8px; font-family: monospace; height: 200px; overflow-y: auto; font-size: 0.85rem; scroll-behavior: smooth; }
  .viz-box { background: linear-gradient(135deg, #0f172a, #1e293b); padding: 20px; border-radius: 12px; color: white; text-align: center; margin-top: 20px; overflow: hidden; position: relative; }
  
  .metric-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px; }
  .metric-box { background: #f8fafc; padding: 16px; border-radius: 8px; text-align: center; border: 1px solid #e2e8f0; }
  .metric-val { font-size: 1.5rem; font-weight: 700; margin-top: 4px; }
  .text-green { color: #16a34a; } .text-red { color: #dc2626; } .text-blue { color: #2563eb; }

  .python-editor { background: #1e1e1e; color: #d4d4d4; border: 1px solid #333; border-radius: 8px; padding: 16px; font-family: monospace; min-height: 500px; width: 100%; margin-bottom: 16px; resize: vertical; font-size: 14px; line-height: 1.5; }
  .section-header { display: flex; align-items: center; gap: 8px; margin-bottom: 16px; color: #334155; font-weight: 600; font-size: 1.1rem; }
  .select-input { padding: 8px 12px; border-radius: 6px; border: 1px solid #cbd5e1; background: white; cursor: pointer; }

  /* Animations for NN Viz */
  .neuron { transition: fill 0.3s; }
  .synapse { transition: stroke 0.3s, stroke-width 0.3s; stroke-opacity: 0.4; }
  .synapse.active-fwd { stroke: #4ade80; stroke-width: 2; stroke-opacity: 1; }
  .synapse.active-bwd { stroke: #ef4444; stroke-width: 2; stroke-opacity: 1; }
  .neuron.active { fill: #fff; filter: drop-shadow(0 0 8px rgba(255,255,255,0.8)); }

  @media (max-width: 1024px) { .python-editor { min-height: 350px; } }
  @media (max-width: 768px) { .grid-2 { grid-template-columns: 1fr; } .metric-grid { grid-template-columns: 1fr 1fr; } }
`;

// --- GAME SCRIPTS ---
const GAME_SCRIPTS = {
  default: `import numpy as np

# --- Neural Network from Scratch ---
print("🚀 Training a simple Neural Net using pure NumPy...")

X = np.array([[0,0], [0,1], [1,0], [1,1]])
y = np.array([[0], [1], [1], [0]])

w1 = np.random.randn(2, 4)
w2 = np.random.randn(4, 1)

def sigmoid(x): return 1 / (1 + np.exp(-x))
def d_sigmoid(x): return x * (1 - x)

for i in range(1500):
    l1 = sigmoid(np.dot(X, w1))
    l2 = sigmoid(np.dot(l1, w2))
    l2_e = y - l2
    l2_d = l2_e * d_sigmoid(l2)
    l1_e = l2_d.dot(w2.T)
    l1_d = l1_e * d_sigmoid(l1)
    w2 += l1.T.dot(l2_d)
    w1 += X.T.dot(l1_d)

print(f"✨ Final Loss: {np.mean(np.abs(l2_e)):.4f}")
print("Predictions:\\n", l2.T)`,

  guess: `# --- Interactive Guessing Game ---
import random

print("🎮 Welcome to Guess the Number!")
print("I am thinking of a number between 1 and 100...")

secret = random.randint(1, 100)
attempts = 0

while True:
    # Input uses browser prompt. If you cancel, the loop breaks.
    guess_str = input(f"Attempt {attempts+1} - Enter guess: ")
    
    if not guess_str: break 
    
    try:
        guess = int(guess_str)
        attempts += 1
        
        if guess < secret:
            print(f"❌ Too low! ({guess})")
        elif guess > secret:
            print(f"❌ Too high! ({guess})")
        else:
            print(f"🎉 CORRECT! The number was {secret}.")
            break
    except:
        print("⚠️ Please enter a valid number.")
        
print("Game Over.")`,

  tictactoe: `# --- Tic Tac Toe ---
board = [' ' for _ in range(9)]

def print_board():
    print(f" {board[0]} | {board[1]} | {board[2]} ")
    print("-----------")
    print(f" {board[3]} | {board[4]} | {board[5]} ")
    print("-----------")
    print(f" {board[6]} | {board[7]} | {board[8]} ")

def is_winner(p):
    win_cond = [(0,1,2),(3,4,5),(6,7,8),(0,3,6),(1,4,7),(2,5,8),(0,4,8),(2,4,6)]
    return any(board[a]==board[b]==board[c]==p for a,b,c in win_cond)

current = 'X'
print("⭕❌ Tic-Tac-Toe")
print("Positions are 0-8 (0 is top-left)")

for turn in range(9):
    print_board()
    try:
        # Input uses browser prompt. Enter the position (0-8)
        move = input(f"Player {current}, enter pos (0-8): ")
        if not move: break
        idx = int(move)
        if 0 <= idx <= 8 and board[idx] == ' ':
            board[idx] = current
            if is_winner(current):
                print_board()
                print(f"🎉 Player {current} Wins!")
                break
            current = 'O' if current == 'X' else 'X'
        else:
            print("⚠️ Invalid spot or position taken!")
    except:
        print("⚠️ Invalid input!")
else:
    print("Draw!")`,

  snake: `# --- ASCII Snake ---
# Input direction when prompted: w, a, s, d
import random

W, H = 10, 10
snake = [(5,5)]
food = (2,2)
score = 0

def print_grid():
    grid = [['.' for _ in range(W)] for _ in range(H)]
    grid[food[1]][food[0]] = '🍎'
    for x,y in snake:
        if 0<=x<W and 0<=y<H: grid[y][x] = '🟩'
    print("\\n" * 2)
    for row in grid:
        print(" ".join(row))
    print(f"Score: {score} | Pos: {snake[0]}")

print("🐍 Snake Game (Text Mode)")
print("Controls: w (up), s (down), a (left), d (right)")

while True:
    print_grid()
    # Input uses browser prompt. Enter w, a, s, or d
    move = input("Move (w/a/s/d): ").lower()
    if not move: break
    
    head_x, head_y = snake[0]
    if move == 'w': head_y -= 1
    elif move == 's': head_y += 1
    elif move == 'a': head_x -= 1
    elif move == 'd': head_x += 1
    
    new_head = (head_x, head_y)
    
    if new_head in snake or head_x < 0 or head_x >= W or head_y < 0 or head_y >= H:
        print("💀 Game Over!")
        break
        
    snake.insert(0, new_head)
    
    if new_head == food:
        score += 1
        food = (random.randint(0,W-1), random.randint(0,H-1))
    else:
        snake.pop() # Remove tail`
};

// --- VISUALIZER COMPONENT ---
const NetworkVisualizer = ({ layers, activePhase, activeLayerIdx }) => {
    // FIX: Centering the visualization
    const canvasWidth = 600;
    const canvasHeight = 300;
    const H_MARGIN = 50; // Margin on both sides
    const H_RANGE = canvasWidth - 2 * H_MARGIN; // 500
    
    // Total columns to draw: Input (1) + Hidden (layers.length) + Output (1)
    const totalColumns = layers.length + 2; 
    
    // Width of the interval between columns
    const intervalWidth = totalColumns > 1 ? H_RANGE / (totalColumns - 1) : H_RANGE; 

    // Helper to limit visual neurons per layer
    const getVisualUnits = (count) => Math.min(count, 8);
    
    const nodes = [];
    const links = [];

    // Function to calculate X position for a layer index (0=Input, N+1=Output)
    const getLayerX = (lIdx) => H_MARGIN + lIdx * intervalWidth; 

    // Input Layer (lIdx = 0)
    const inputCount = 5;
    for(let i=0; i<inputCount; i++) {
        nodes.push({ id: `L0-N${i}`, x: getLayerX(0), y: (canvasHeight/(inputCount+1))*(i+1), layer: 0 });
    }

    // Hidden & Output Layers (lIdx = 1 to layers.length + 1)
    layers.forEach((layer, lIdx) => {
        const actualIdx = lIdx + 1; // 1, 2, 3...
        const unitCount = layer.params.units || 1; 
        const vizCount = getVisualUnits(unitCount);
        const isOutput = actualIdx === layers.length + 1;

        for(let i=0; i<vizCount; i++) {
            nodes.push({ 
                id: `L${actualIdx}-N${i}`, 
                x: getLayerX(actualIdx), 
                y: (canvasHeight/(vizCount+1))*(i+1),
                layer: actualIdx
            });
        }
    });

    // Output Layer (If not explicitly defined in blocks, the last block will be treated as output)
    const finalLayerIdx = layers.length + 1;
    if (layers.length > 0 && layers[layers.length - 1].type !== 'dense') {
        // Add a final explicit output node if the last block isn't already a final dense layer
        nodes.push({ 
            id: `L${finalLayerIdx}-N0`, 
            x: getLayerX(finalLayerIdx), 
            y: canvasHeight / 2, 
            layer: finalLayerIdx,
        });
    }

    // Generate Links
    nodes.forEach(node => {
        if(node.layer > 0) {
            const prevLayerNodes = nodes.filter(n => n.layer === node.layer - 1);
            prevLayerNodes.forEach(prev => {
                links.push({
                    source: prev,
                    target: node,
                    layerIdx: node.layer - 1 // Link belongs to the gap BEFORE this layer
                });
            });
        }
    });

    return (
        <div className="viz-box">
            <h4 style={{color:'white', margin:0, marginBottom:12, display:'flex', alignItems:'center', gap:8, justifyContent:'center'}}>
                <Eye size={16}/> Neural Network State
                {activePhase === 'forward' && <span style={{fontSize:'0.8rem', color:'#4ade80'}}>● Forward Prop</span>}
                {activePhase === 'backward' && <span style={{fontSize:'0.8rem', color:'#ef4444'}}>● Back Prop</span>}
            </h4>
            <svg width="100%" height="300" viewBox={`0 0 ${canvasWidth} ${canvasHeight}`}>
                {/* Links */}
                {links.map((link, i) => (
                    <line 
                        key={i}
                        x1={link.source.x} y1={link.source.y}
                        x2={link.target.x} y2={link.target.y}
                        className={`synapse ${
                            activeLayerIdx === link.layerIdx 
                                ? (activePhase === 'forward' ? 'active-fwd' : 'active-bwd') 
                                : ''
                        }`}
                        stroke="#475569"
                        strokeWidth="1"
                    />
                ))}
                {/* Nodes */}
                {nodes.map(node => (
                    <circle 
                        key={node.id}
                        cx={node.x} cy={node.y} r="8"
                        className={`neuron ${activeLayerIdx === node.layer-1 || activeLayerIdx === node.layer ? 'active' : ''}`}
                        fill={node.layer === 0 ? '#22c55e' : (node.layer === finalLayerIdx ? '#ef4444' : '#3b82f6')}
                        stroke="white"
                        strokeWidth="2"
                    />
                ))}
            </svg>
            <div style={{display:'flex', justifyContent:'space-between', color:'#94a3b8', fontSize:'0.8rem', padding:'0 40px'}}>
                <span>Input</span>
                {layers.slice(0, layers.length > 0 ? layers.length - 1 : 0).map((l, i) => <span key={i}>Hidden {i + 1}</span>)}
                <span>Output</span>
            </div>
        </div>
    );
};

const MLPlayground = () => {
  // --- STATE ---
  const [activeTab, setActiveTab] = useState('upload');
  const [datasets, setDatasets] = useState([]);
  const [selectedDataset, setSelectedDataset] = useState(null);
  const [validationDataset, setValidationDataset] = useState(null);
  const [modelBlocks, setModelBlocks] = useState([]);
  const [trainingConfig, setTrainingConfig] = useState({ epochs: 50, learningRate: 0.001, split: 0.8 });
  const [cryptoSymbol, setCryptoSymbol] = useState("BTCUSDT");
  
  const [isTraining, setIsTraining] = useState(false);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState([]);
  const [results, setResults] = useState(null);
  const [trainedModel, setTrainedModel] = useState(null);
  
  // Viz State
  const [activePhase, setActivePhase] = useState('idle');
  const [activeLayerIdx, setActiveLayerIdx] = useState(-1);

  // Python State
  const [pyodide, setPyodide] = useState(null);
  const [pyOutput, setPyOutput] = useState("Initializing environment...");
  const [isPyRunning, setIsPyRunning] = useState(false);
  const [pyCode, setPyCode] = useState(GAME_SCRIPTS.default);

  const fileInputRef = useRef(null);
  const validationFileRef = useRef(null);
  const logsContainerRef = useRef(null);

  // --- EFFECTS ---
  useEffect(() => {
    if (logsContainerRef.current) {
        const { scrollHeight, clientHeight } = logsContainerRef.current;
        logsContainerRef.current.scrollTop = scrollHeight - clientHeight;
    }
  }, [logs]);

  useEffect(() => {
    return () => { if(trainedModel) trainedModel.dispose(); }
  }, [trainedModel]);

  // Load Pyodide with Fixed Input Handler
  useEffect(() => {
    const loadPy = async () => {
      if (window.pyodide) { setPyodide(window.pyodide); setPyOutput("Ready (Cached)"); return; }
      try {
        setPyOutput("⏳ Loading Python Kernel (WASM)...");
        const script = document.createElement('script');
        script.src = "https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js";
        script.async = true;
        script.onload = async () => {
          try {
            const py = await window.loadPyodide({
                // FIX: Ensure that canceling the browser prompt doesn't cause an EOFError.
                // It returns null, which Python interprets as end-of-file. We return "" instead.
                stdin: () => window.prompt("Python Input (Appears in a separate browser window/dialog):") || "" 
            });
            await py.loadPackage("numpy");
            setPyodide(py);
            setPyOutput("✅ Python Ready (with Numpy & Interactive Input)");
          } catch (e) { setPyOutput(`❌ Init Fail: ${e.message}`); }
        };
        document.body.appendChild(script);
      } catch (e) { setPyOutput(`❌ Loader Error: ${e.message}`); }
    };
    loadPy();
  }, []);

  // --- HELPER FUNCTIONS ---
  const updateModelParam = (index, key, value) => {
    const newBlocks = [...modelBlocks];
    newBlocks[index].params[key] = parseFloat(value) || 0;
    setModelBlocks(newBlocks);
  };

  const loadGameScript = (key) => {
    setPyCode(GAME_SCRIPTS[key]);
    setPyOutput(`Loaded ${key}. Click Run, and when prompted for input, use the browser's dialog box!`);
  };

  const runPython = async () => {
    if (!pyodide) return;
    setIsPyRunning(true);
    setPyOutput("Running...");
    try {
      // Direct output to the state
      pyodide.setStdout({ batched: (msg) => setPyOutput(prev => (prev === "Running..." ? "" : prev) + msg + "\n") });
      // Run the code
      await pyodide.runPythonAsync(pyCode);
    } catch (e) { setPyOutput(`❌ Error:\n${e}`); }
    setIsPyRunning(false);
  };

  const parseCSV = (text) => {
    const lines = text.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    const data = lines.slice(1).map(line => {
      const vals = line.split(',');
      const row = {};
      headers.forEach((h, i) => row[h] = parseFloat(vals[i]) || 0);
      return row;
    });
    return { headers, data };
  };

  const handleFileUpload = async (e, isValidation = false) => {
    const file = e.target.files[0];
    if (!file) return;
    const text = await file.text();
    const { headers, data } = parseCSV(text);
    const ds = { id: Date.now(), name: file.name, headers, data };
    
    if (isValidation) {
      setValidationDataset(ds);
      setLogs(p => [...p, `📂 Loaded Validation CSV: ${file.name}`]);
    } else {
      setDatasets([ds]);
      setSelectedDataset(ds);
      setActiveTab('configure');
      setLogs(p => [...p, `📂 Loaded Training CSV: ${file.name} (${data.length} rows)`]);
    }
  };

  const fetchBinance = async (isValidation = false) => {
    setLogs(p => [...p, `🌐 Fetching ${cryptoSymbol} for ${isValidation ? 'Validation' : 'Training'}...`]);
    try {
      const res = await fetch(`https://api.binance.com/api/v3/klines?symbol=${cryptoSymbol}&interval=1d&limit=365`);
      const json = await res.json();
      if(!Array.isArray(json)) throw new Error("Invalid API Response");
      
      const data = json.map(k => ({
        Open: parseFloat(k[1]),
        High: parseFloat(k[2]),
        Low: parseFloat(k[3]),
        Close: parseFloat(k[4]),
        Volume: parseFloat(k[7])
      }));
      const ds = { id: Date.now(), name: `${cryptoSymbol}_${isValidation?'Test':'Train'}`, headers: Object.keys(data[0]), data };
      
      if (isValidation) {
        setValidationDataset(ds);
        setLogs(p => [...p, "✅ Validation Data loaded."]);
      } else {
        setDatasets([ds]);
        setSelectedDataset(ds);
        setActiveTab('configure');
        setLogs(p => [...p, "✅ Training Data loaded."]);
      }
    } catch (e) { setLogs(p => [...p, `❌ API Error: ${e.message}`]); }
  };

  // --- DOWNLOAD FUNCTIONS ---
  const downloadModel = async () => {
    if(!trainedModel) { alert("No model trained yet!"); return; }
    await trainedModel.save('downloads://snowai-model');
  };

  const downloadCode = () => {
    const pyScript = `
import tensorflow as tf
from tensorflow.keras import layers, models

# Auto-Generated by SnowAI Quant Lab
def build_model(input_shape):
    model = models.Sequential()
    model.add(layers.Input(shape=input_shape))
    
${modelBlocks.map(b => {
    if(b.type==='dense') return `    model.add(layers.Dense(${b.params.units}, activation='${b.params.activation}'))`;
    if(b.type==='lstm') return `    model.add(layers.LSTM(${b.params.units}, return_sequences=${b.params.return_sequences ? 'True' : 'False'}))`;
    if(b.type==='dropout') return `    model.add(layers.Dropout(${b.params.rate}))`;
    if(b.type==='conv1d') return `    model.add(layers.Conv1D(filters=${b.params.filters}, kernel_size=${b.params.kernel_size}, activation='relu'))`;
    return '';
}).join('\n')}
    model.add(layers.Dense(1))
    
    model.compile(optimizer=tf.keras.optimizers.Adam(learning_rate=${trainingConfig.learningRate}),
                  loss='mse')
    return model

print("✅ Model Architecture Ready")
`;
    const blob = new Blob([pyScript], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'snowai_model_arch.py';
    a.click();
  };

  // --- BACKTEST ENGINE ---
  const runPrediction = (model, dataset, windowSize, min, max) => {
      const priceCol = dataset.headers.find(h => h.toLowerCase().includes('close')) || dataset.headers[dataset.headers.length-1];
      const rawData = dataset.data.map(r => r[priceCol]);
      
      // Normalize using Training Scale
      const tensorData = tf.tensor1d(rawData);
      const normalized = tensorData.sub(min).div(max.sub(min));
      const values = normalized.dataSync();
      
      const X_arr = [];
      for(let i = windowSize; i < values.length; i++) {
        X_arr.push(values.slice(i-windowSize, i));
      }
      const X = tf.tensor2d(X_arr);
      
      const preds = model.predict(X).dataSync();
      const actuals = rawData.slice(windowSize);
      
      const minVal = min.dataSync()[0];
      const maxVal = max.dataSync()[0];
      const unscale = (n) => n * (maxVal - minVal) + minVal;

      const resultData = [];
      let balance = 10000;
      let wins = 0;
      let maxBal = 10000;
      let minBal = 10000;
      let tradeCount = 0;
      const fee = 0.001; 

      for(let i=0; i<preds.length; i++) {
        const predPrice = unscale(preds[i]);
        const actualPrice = actuals[i];
        const prevPrice = rawData[windowSize + i - 1];

        if (!isFinite(predPrice) || !isFinite(actualPrice) || !prevPrice) continue;

        const predMove = (predPrice - prevPrice) / prevPrice;
        let signal = 0;
        if (predMove > 0.005) signal = 1;
        else if (predMove < -0.005) signal = -1;

        const actualMove = (actualPrice - prevPrice) / prevPrice;
        
        let pnl = 0;
        if (signal !== 0) {
            pnl = balance * signal * actualMove;
            pnl -= balance * fee;
            tradeCount++;
            if (pnl > 0) wins++;
        }
        
        balance += pnl;
        if(balance > maxBal) maxBal = balance;
        if(balance < minBal) minBal = balance;

        resultData.push({
          idx: i,
          Actual: Math.round(actualPrice),
          Predicted: Math.round(predPrice),
          Equity: Math.round(balance)
        });
      }
      
      const totalReturn = ((balance - 10000) / 10000) * 100;
      const winRate = tradeCount > 0 ? (wins / tradeCount) * 100 : 0;
      const maxDrawdown = ((maxBal - minBal) / maxBal) * 100;
      
      return { totalReturn, winRate, maxDrawdown, chartData: resultData };
  };

  const trainModel = async () => {
    if (!selectedDataset || modelBlocks.length === 0) {
      alert("Please select a dataset and add model layers.");
      return;
    }
    
    setIsTraining(true);
    setProgress(0);
    setLogs(p => [...p, "🚀 Starting Training..."]);

    try {
      const priceCol = selectedDataset.headers.find(h => h.toLowerCase().includes('close')) || selectedDataset.headers[selectedDataset.headers.length-1];
      const rawData = selectedDataset.data.map(r => r[priceCol]);
      
      const tensorData = tf.tensor1d(rawData);
      const min = tensorData.min();
      const max = tensorData.max();
      const normalized = tensorData.sub(min).div(max.sub(min));
      const values = normalized.dataSync();

      const windowSize = 5;
      const X_arr = [];
      const y_arr = [];
      
      for(let i = windowSize; i < values.length; i++) {
        X_arr.push(values.slice(i-windowSize, i));
        y_arr.push(values[i]);
      }

      const X = tf.tensor2d(X_arr);
      const y = tf.tensor2d(y_arr, [y_arr.length, 1]);

      const splitIdx = Math.floor(X_arr.length * trainingConfig.split);
      const X_train = X.slice([0,0], [splitIdx, -1]);
      const y_train = y.slice([0,0], [splitIdx, -1]);
      const X_test = X.slice([splitIdx, 0], [-1, -1]);

      const model = tf.sequential();
      
      modelBlocks.forEach((b, i) => {
        const config = { ...b.params, inputShape: i === 0 ? [windowSize] : undefined };
        
        // --- LAYER CONSTRUCTION ---
        if(b.type === 'dense') model.add(tf.layers.dense(config));
        if(b.type === 'dropout') model.add(tf.layers.dropout(config));
        if(b.type === 'lstm') {
           if(i===0) model.add(tf.layers.reshape({targetShape: [windowSize, 1], inputShape: [windowSize]}));
           model.add(tf.layers.lstm(config));
        }
        if(b.type === 'conv1d') {
           if(i===0) model.add(tf.layers.reshape({targetShape: [windowSize, 1], inputShape: [windowSize]}));
           model.add(tf.layers.conv1d(config));
           model.add(tf.layers.flatten());
        }
        // Reinforcement Learning Placeholders (Architectural only for this demo)
        if(b.type === 'dqn') {
            model.add(tf.layers.dense({units: 64, activation: 'relu'}));
            model.add(tf.layers.dense({units: 32, activation: 'relu'}));
        }
      });
      model.add(tf.layers.dense({ units: 1 }));
      
      model.compile({ optimizer: tf.train.adam(trainingConfig.learningRate), loss: 'meanSquaredError' });

      await model.fit(X_train, y_train, {
        epochs: trainingConfig.epochs,
        callbacks: {
          onEpochEnd: async (epoch, logs) => {
            setProgress(Math.round(((epoch + 1) / trainingConfig.epochs) * 100));
            // Animation Logic
            if (epoch % 2 === 0) { // Faster updates
              setLogs(p => [...p, `Ep ${epoch+1}: Loss ${logs.loss.toFixed(5)}`]);
              
              // Trigger Forward
              setActivePhase('forward');
              for(let i=0; i<=modelBlocks.length; i++) {
                  setActiveLayerIdx(i);
                  await new Promise(r => setTimeout(r, 50));
              }
              // Trigger Backward
              setActivePhase('backward');
              for(let i=modelBlocks.length; i>=0; i--) {
                  setActiveLayerIdx(i);
                  await new Promise(r => setTimeout(r, 50));
              }
              setActivePhase('idle');
              setActiveLayerIdx(-1);
            }
          }
        }
      });

      const resultsStats = runPrediction(model, 
        {...selectedDataset, data: selectedDataset.data.slice(splitIdx + windowSize)}, 
        windowSize, min, max
      );
      
      setTrainedModel(model);
      setResults({ ...resultsStats, minTensor: min, maxTensor: max, windowSize });
      setLogs(p => [...p, "✅ Training Complete!"]);
      setActiveTab('results');

    } catch (e) {
      console.error(e);
      setLogs(p => [...p, `❌ Error: ${e.message}`]);
    } finally {
      setIsTraining(false);
    }
  };

  const validateModel = async () => {
    if(!validationDataset || !trainedModel || !results) return;
    setLogs(p => [...p, `🔎 Validating on ${validationDataset.name}...`]);
    try {
      const stats = runPrediction(trainedModel, validationDataset, results.windowSize, results.minTensor, results.maxTensor);
      setResults(prev => ({ ...prev, validationStats: stats }));
      setLogs(p => [...p, `✅ Validation Result: Return ${stats.totalReturn.toFixed(2)}%`]);
    } catch(e) {
      setLogs(p => [...p, `❌ Validation Error: ${e.message}`]);
    }
  };

  // --- RENDER ---
  return (
    <div>
        <div className="header">
            <Header />
        </div>
        <div className="main-page-body">
            <SideNavs />
    <div className="app-wrapper">
      <style>{cssStyles}</style>
      <div className="container">
        <div className="header">
          <div>
            <div className="title"><h1>SnowAI Quant Lab</h1><p>Interactive Machine Learning Environment</p></div>
          </div>
          <Brain size={48} color="#2563eb" />
        </div>

        <div className="tabs">
          {['upload', 'configure', 'train', 'results'].map(t => (
            <button key={t} className={`tab ${activeTab === t ? 'active' : ''}`} onClick={() => setActiveTab(t)}>{t.toUpperCase()}</button>
          ))}
        </div>

        <div className="content">
          {/* UPLOAD */}
          {activeTab === 'upload' && (
            <div className="card">
               <div className="upload-box" onClick={() => fileInputRef.current.click()}>
                 <Upload size={40} color="#94a3b8" style={{marginBottom: 16}} />
                 <h3>Click to Upload CSV</h3>
                 <p style={{color: '#94a3b8'}}>Format: Date, Open, High, Low, Close, Volume</p>
                 <input ref={fileInputRef} type="file" accept=".csv" style={{display:'none'}} onChange={(e) => handleFileUpload(e, false)} />
               </div>
               <div style={{textAlign: 'center', margin: '20px 0', color: '#94a3b8'}}>OR</div>
               <div style={{display:'flex', justifyContent: 'center', gap: 12}}>
                 <select className="select-input" value={cryptoSymbol} onChange={(e) => setCryptoSymbol(e.target.value)}>
                    <option value="BTCUSDT">BTC/USDT</option>
                    <option value="ETHUSDT">ETH/USDT</option>
                    <option value="SOLUSDT">SOL/USDT</option>
                    <option value="ADAUSDT">ADA/USDT</option>
                 </select>
                 <button className="btn btn-primary" onClick={() => fetchBinance(false)}>
                   <Globe size={18} /> Fetch Training Data
                 </button>
               </div>
            </div>
          )}

          {/* CONFIGURE */}
          {activeTab === 'configure' && (
            <div className="grid-2">
              <div className="card">
                <div className="section-header"><Zap size={20} /> Toolbox</div>
                <div style={{marginBottom: 16}}>
                    <small style={{color:'#64748b', fontWeight:600}}>CORE LAYERS</small>
                    <div className="model-item" onClick={() => setModelBlocks([...modelBlocks, {type: 'dense', name: 'Dense Layer', params: {units: 32, activation: 'relu'}}])}><Layers size={20} color="#2563eb" /> <div><strong>Dense</strong></div></div>
                    <div className="model-item" onClick={() => setModelBlocks([...modelBlocks, {type: 'dropout', name: 'Dropout', params: {rate: 0.2}}])}><Trash2 size={20} color="#ef4444" /> <div><strong>Dropout</strong></div></div>
                </div>
                <div style={{marginBottom: 16}}>
                    <small style={{color:'#64748b', fontWeight:600}}>TIME SERIES</small>
                    <div className="model-item" onClick={() => setModelBlocks([...modelBlocks, {type: 'lstm', name: 'LSTM Layer', params: {units: 50}}])}><Activity size={20} color="#8b5cf6" /> <div><strong>LSTM</strong></div></div>
                    <div className="model-item" onClick={() => setModelBlocks([...modelBlocks, {type: 'conv1d', name: 'Conv1D', params: {filters: 32, kernel_size: 2}}])}><Activity size={20} color="#ec4899" /> <div><strong>Conv1D</strong></div></div>
                </div>
                <div>
                    <small style={{color:'#64748b', fontWeight:600}}>REINFORCEMENT LEARNING</small>
                    <div className="model-item" onClick={() => setModelBlocks([...modelBlocks, {type: 'dqn', name: 'DQN Head', params: {units: 64}}])}><Cpu size={20} color="#f59e0b" /> <div><strong>DQN Head</strong></div></div>
                    <div className="model-item" onClick={() => setModelBlocks([...modelBlocks, {type: 'dense', name: 'Policy Net', params: {units: 3, activation: 'softmax'}}])}><Cpu size={20} color="#f59e0b" /> <div><strong>Policy Net</strong></div></div>
                </div>
              </div>

              <div className="card">
                <div className="section-header"><Layers size={20} /> Pipeline</div>
                {modelBlocks.length === 0 && <p style={{color:'#94a3b8'}}>No layers added yet.</p>}
                {modelBlocks.map((b, i) => (
                  <div key={i} className="pipeline-node">
                    <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
                        <span><b>{i+1}.</b> {b.name}</span>
                        <Trash2 size={16} style={{cursor:'pointer', color: '#ef4444'}} onClick={() => setModelBlocks(modelBlocks.filter((_, idx) => idx !== i))} />
                    </div>
                    <div className="pipeline-inputs">
                        {b.params.units !== undefined && <div className="pipeline-input-group"><span>N:</span><input type="number" className="mini-input" value={b.params.units} onChange={(e) => updateModelParam(i, 'units', e.target.value)} /></div>}
                        {b.params.rate !== undefined && <div className="pipeline-input-group"><span>%:</span><input type="number" className="mini-input" step="0.1" value={b.params.rate} onChange={(e) => updateModelParam(i, 'rate', e.target.value)} /></div>}
                    </div>
                  </div>
                ))}
                
                {modelBlocks.length > 0 && (
                    <NetworkVisualizer 
                        layers={modelBlocks} 
                        activePhase={activePhase} // Pass current phase (forward/backward/idle)
                        activeLayerIdx={activeLayerIdx} // Pass active layer for highlighting
                    />
                )}
              </div>
            </div>
          )}

          {/* TRAIN */}
          {activeTab === 'train' && (
            <div>
                <div className="grid-2">
                <div className="card">
                    <div className="section-header"><Zap size={20} /> Training Config</div>
                    <label>Epochs: {trainingConfig.epochs}</label>
                    <input type="range" min="10" max="1000" value={trainingConfig.epochs} onChange={e => setTrainingConfig({...trainingConfig, epochs: parseInt(e.target.value)})} style={{width:'100%'}} />
                    
                    <label style={{display:'block', marginTop:12}}>Learning Rate: {trainingConfig.learningRate}</label>
                    <input type="number" step="0.0001" value={trainingConfig.learningRate} onChange={e => setTrainingConfig({...trainingConfig, learningRate: parseFloat(e.target.value)})} style={{width:'100%', padding:8, borderRadius:6, border:'1px solid #cbd5e1'}} />
                    
                    <button className="btn btn-primary" style={{width:'100%', marginTop: 24}} onClick={trainModel} disabled={isTraining}>
                        {isTraining ? <RefreshCw className="animate-spin" /> : <Play />} {isTraining ? `Training ${progress}%` : 'Start Training'}
                    </button>
                </div>
                <div className="card">
                    <div className="section-header"><Terminal size={20} /> System Logs</div>
                    <div className="terminal" ref={logsContainerRef}>
                        {logs.map((l, i) => <div key={i} style={{marginBottom: 4}}>{l}</div>)}
                    </div>
                </div>
                </div>

                <div className="card">
                    <h3 style={{display:'flex', alignItems:'center', gap: 8, justifyContent:'space-between'}}>
                        <span style={{display:'flex', gap:8}}><Code color="#eab308" /> Python Arcade (Interactive)</span>
                        <div style={{display:'flex', gap:8}}>
                           <button className="btn btn-ghost" onClick={() => loadGameScript('guess')}><Gamepad2 size={16}/> Guess</button>
                           <button className="btn btn-ghost" onClick={() => loadGameScript('tictactoe')}><Gamepad2 size={16}/> Tic-Tac-Toe</button>
                           <button className="btn btn-ghost" onClick={() => loadGameScript('snake')}><Gamepad2 size={16}/> Snake</button>
                        </div>
                    </h3>
                    <textarea className="python-editor" value={pyCode} onChange={e => setPyCode(e.target.value)} spellCheck="false" />
                    <div style={{display:'flex', justifyContent: 'space-between'}}>
                        <button className="btn btn-primary" style={{background: '#eab308', color: 'black'}} onClick={runPython} disabled={!pyodide || isPyRunning}>
                            {isPyRunning ? <RefreshCw className="animate-spin" size={16} /> : <Play size={16} />} Run Code
                        </button>
                        <span style={{color: pyodide ? '#16a34a' : '#f59e0b'}}>{pyodide ? '● Kernel Ready' : '● Loading...'}</span>
                    </div>
                    <pre style={{background:'#111', color: '#eab308', padding: 12, borderRadius: 6, marginTop: 12, fontSize: '0.8rem', overflowX:'auto'}}>
                        {pyOutput}
                    </pre>
                    <div style={{color: '#eab308', marginTop: 12, fontSize: '0.8rem', fontWeight: 600}}>
                        <AlertTriangle size={16} style={{display:'inline-block', verticalAlign:'text-bottom', marginRight: 4}}/> NOTE: When running Python, a browser `prompt` box will appear for game input. You must enter your move/guess there.
                    </div>
                </div>
            </div>
          )}

          {/* RESULTS */}
          {activeTab === 'results' && results && (
             <div>
               <div className="card">
                  <div className="section-header"><Save size={20} /> Export & Actions</div>
                  <div style={{display:'flex', gap: 12}}>
                     <button className="btn btn-outline" onClick={downloadModel}><Download size={16} /> Download Model (JSON)</button>
                     <button className="btn btn-outline" onClick={downloadCode}><Code size={16} /> Download Python Code</button>
                  </div>
               </div>

               <div className="card" style={{background: '#f0f9ff', borderColor: '#bae6fd'}}>
                  <div className="section-header"><RefreshCw size={20} /> Validate on New Data</div>
                  <div style={{display:'flex', gap: 16, flexWrap:'wrap', alignItems:'center'}}>
                    <button className="btn btn-outline" onClick={() => validationFileRef.current.click()}><Upload size={16} /> Upload CSV</button>
                    <input ref={validationFileRef} type="file" accept=".csv" style={{display:'none'}} onChange={(e) => handleFileUpload(e, true)} />
                    
                    <span>OR</span>
                    <select className="select-input" value={cryptoSymbol} onChange={(e) => setCryptoSymbol(e.target.value)}>
                        <option value="BTCUSDT">BTC</option>
                        <option value="ETHUSDT">ETH</option>
                        <option value="SOLUSDT">SOL</option>
                        <option value="ADAUSDT">ADA</option>
                    </select>
                    <button className="btn btn-outline" onClick={() => fetchBinance(true)}><Globe size={16} /> Fetch</button>

                    {validationDataset && <button className="btn btn-primary" onClick={validateModel}><Play size={16} /> Run Test</button>}
                  </div>
               </div>

               <div className="metric-grid">
                 <div className="metric-box">
                   <div style={{color:'#64748b'}}>Total Return</div>
                   <div className={`metric-val ${results.validationStats ? (results.validationStats.totalReturn >= 0 ? 'text-green':'text-red') : (results.totalReturn >= 0 ? 'text-green' : 'text-red')}`}>
                     {results.validationStats ? results.validationStats.totalReturn.toFixed(2) : results.totalReturn.toFixed(2)}%
                   </div>
                 </div>
                 <div className="metric-box">
                   <div style={{color:'#64748b'}}>Win Rate</div>
                   <div className="metric-val text-blue">
                     {results.validationStats ? results.validationStats.winRate.toFixed(2) : results.winRate.toFixed(2)}%
                   </div>
                 </div>
                 <div className="metric-box">
                   <div style={{color:'#64748b'}}>Max Drawdown</div>
                   <div className="metric-val text-red">
                     {results.validationStats ? results.validationStats.maxDrawdown.toFixed(2) : results.maxDrawdown.toFixed(2)}%
                   </div>
                 </div>
               </div>

               <div className="card">
                 <h3>Equity Curve</h3>
                 <div style={{height: 300, width: '100%'}}>
                   <ResponsiveContainer>
                     <AreaChart data={results.validationStats ? results.validationStats.chartData : results.chartData}>
                       <CartesianGrid strokeDasharray="3 3" vertical={false} />
                       <XAxis dataKey="idx" />
                       <YAxis domain={['auto', 'auto']} />
                       <Tooltip />
                       <Area type="monotone" dataKey="Equity" stroke="#2563eb" fill="#eff6ff" strokeWidth={2} />
                     </AreaChart>
                   </ResponsiveContainer>
                 </div>
               </div>
             </div>
          )}
        </div>
      </div>
    </div>
    </div>
    </div>
  );
};

export default MLPlayground;