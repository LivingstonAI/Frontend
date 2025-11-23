import Header from "./header";
import SideNavs from "./side_navs";

import React, { useState, useEffect, useRef } from 'react';
import { Upload, Play, Trash2, Brain, Activity, Zap, Globe, Code, RefreshCw, Layers, Terminal, Save, Download, Cpu, Gamepad2, LayoutTemplate, AlertTriangle, Eye } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import * as tf from "@tensorflow/tfjs";


// --- CSS STYLES ---
const cssStyles = `
  .app-wrapper { min-height: 100vh; background: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #1e293b; padding-bottom: 40px; }
  .container { max-width: 1400px; margin: 0 auto; padding: 20px; }
  .header { background: white; padding: 24px; border-radius: 12px; border: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; box-shadow: 0 2px 4px rgba(0,0,0,0.02); }
  .title h1 { margin: 0; font-size: 1.8rem; color: #0f172a; }
  .title p { margin: 4px 0 0; color: #64748b; }
  
  .tabs { display: flex; background: white; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; margin-bottom: 24px; flex-wrap: wrap; }
  .tab { flex: 1; padding: 16px; border: none; background: none; font-weight: 600; color: #64748b; cursor: pointer; transition: all 0.2s; border-bottom: 3px solid transparent; min-width: 80px; }
  .tab:hover { background: #f1f5f9; }
  .tab.active { color: #2563eb; border-bottom-color: #2563eb; background: #eff6ff; }
  
  .card { background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; margin-bottom: 24px; }
  .btn { padding: 10px 20px; border-radius: 8px; border: none; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: 0.2s; justify-content: center; white-space: nowrap; }
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

  .python-editor { background: #1e1e1e; color: #d4d4d4; border: 1px solid #333; border-radius: 8px; padding: 16px; font-family: monospace; min-height: 500px; width: 100%; margin-bottom: 16px; resize: vertical; font-size: 14px; line-height: 1.5; box-sizing: border-box; }
  .section-header { display: flex; align-items: center; gap: 8px; margin-bottom: 16px; color: #334155; font-weight: 600; font-size: 1.1rem; }
  .select-input { padding: 8px 12px; border-radius: 6px; border: 1px solid #cbd5e1; background: white; cursor: pointer; }

  .game-canvas { background: #000; border: 2px solid #333; border-radius: 8px; margin-top: 16px; display: block; margin-left: auto; margin-right: auto; max-width: 100%; }
  .py-controls { display: flex; justify-content: space-between; margin-top: 12px; align-items: center; flex-wrap: wrap; gap: 12px; }

  /* Animations for NN Viz */
  .neuron { transition: fill 0.3s; }
  .synapse { transition: stroke 0.3s, stroke-width 0.3s; stroke-opacity: 0.4; }
  .synapse.active-fwd { stroke: #4ade80; stroke-width: 2; stroke-opacity: 1; }
  .synapse.active-bwd { stroke: #ef4444; stroke-width: 2; stroke-opacity: 1; }
  .neuron.active { fill: #fff; filter: drop-shadow(0 0 8px rgba(255,255,255,0.8)); }

  /* Mobile Responsiveness */
  @media (max-width: 1024px) { .python-editor { min-height: 350px; } }
  @media (max-width: 768px) { 
    .grid-2 { grid-template-columns: 1fr; } 
    .metric-grid { grid-template-columns: 1fr 1fr; }
    .header { flex-direction: column; text-align: center; gap: 16px; }
    .app-title { font-size: 1.5rem; }
    .py-controls { flex-direction: column; align-items: stretch; }
    .btn { width: 100%; }
    .game-canvas { width: 100% !important; height: auto !important; aspect-ratio: 1/1; }
  }
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

  tictactoe: `# --- Graphical Tic Tac Toe ---
from js import document, window
import math

canvas = document.getElementById("game-canvas")
ctx = canvas.getContext("2d")
W, H = canvas.width, canvas.height

board = [' ']*9
current = 'X'

def draw_board():
    ctx.fillStyle = "#1e293b"
    ctx.fillRect(0, 0, W, H)
    ctx.strokeStyle = "#cbd5e1"
    ctx.lineWidth = 4
    
    # Grid
    ctx.beginPath()
    for i in range(1,3):
        ctx.moveTo(i*W/3, 10)
        ctx.lineTo(i*W/3, H-10)
        ctx.moveTo(10, i*H/3)
        ctx.lineTo(W-10, i*H/3)
    ctx.stroke()
    
    # Marks
    ctx.font = "60px Arial"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    for i in range(9):
        val = board[i]
        x = (i % 3) * (W/3) + (W/6)
        y = (i // 3) * (H/3) + (H/6)
        if val == 'X': ctx.fillStyle = "#f59e0b"
        elif val == 'O': ctx.fillStyle = "#3b82f6"
        else: continue
        ctx.fillText(val, x, y)

def check_win():
    wins = [(0,1,2),(3,4,5),(6,7,8),(0,3,6),(1,4,7),(2,5,8),(0,4,8),(2,4,6)]
    for a,b,c in wins:
        if board[a] == board[b] == board[c] and board[a] != ' ':
            return board[a]
    if ' ' not in board: return 'Draw'
    return None

# Game Loop
print("⭕❌ Graphical Tic-Tac-Toe")
print("Look at the canvas below!")

while True:
    draw_board()
    winner = check_win()
    if winner:
        print(f"Game Over! Result: {winner}")
        break
        
    try:
        # Using prompt because we need blocking input
        move = input(f"Player {current} (0-8): ") 
        if not move: break
        idx = int(move)
        if 0 <= idx <= 8 and board[idx] == ' ':
            board[idx] = current
            current = 'O' if current == 'X' else 'X'
        else:
            print("⚠️ Invalid move!")
    except:
        break
        
draw_board()
`,

  snake: `# --- Graphical Snake Game ---
# CONTROL WITH ARROW KEYS ON YOUR KEYBOARD!
# Click the Canvas to focus first.

import js
from js import document, window
from pyodide.ffi import create_proxy
import random
import math

canvas = document.getElementById("game-canvas")
ctx = canvas.getContext("2d")
W, H = canvas.width, canvas.height
GRID = 15
COLS = int(W // GRID)
ROWS = int(H // GRID)

snake = [(10, 10)]
dx, dy = 0, 0
food = (5, 5)
score = 0
game_over = False

def draw():
    # Background
    ctx.fillStyle = "#0f172a"
    ctx.fillRect(0, 0, W, H)
    
    # Snake
    ctx.fillStyle = "#4ade80"
    for x, y in snake:
        ctx.fillRect(x*GRID, y*GRID, GRID-1, GRID-1)
        
    # Food
    ctx.fillStyle = "#ef4444"
    ctx.beginPath()
    ctx.arc(food[0]*GRID + GRID/2, food[1]*GRID + GRID/2, GRID/2 - 2, 0, 2*math.pi)
    ctx.fill()
    
    # Score
    ctx.fillStyle = "white"
    ctx.font = "16px Arial"
    ctx.fillText(f"Score: {score}", 10, 20)
    
    if game_over:
        ctx.fillStyle = "rgba(0,0,0,0.7)"
        ctx.fillRect(0,0,W,H)
        ctx.fillStyle = "white"
        ctx.font = "30px Arial"
        ctx.fillText("GAME OVER", 60, 150)

def update():
    global snake, food, score, game_over
    if game_over: return
    
    head_x, head_y = snake[0]
    new_x = head_x + dx
    new_y = head_y + dy
    
    # Bounds
    if new_x < 0 or new_x >= COLS or new_y < 0 or new_y >= ROWS or (new_x, new_y) in snake:
        game_over = True
        return
        
    snake.insert(0, (new_x, new_y))
    
    if (new_x, new_y) == food:
        score += 1
        food = (random.randint(0, COLS-1), random.randint(0, ROWS-1))
    else:
        snake.pop()

# Input Handler (Arrow Keys)
def key_handler(event):
    global dx, dy
    key = event.key
    if key == "ArrowUp" and dy == 0: dx, dy = 0, -1
    elif key == "ArrowDown" and dy == 0: dx, dy = 0, 1
    elif key == "ArrowLeft" and dx == 0: dx, dy = -1, 0
    elif key == "ArrowRight" and dx == 0: dx, dy = 1, 0

# Create proxies to prevent garbage collection
key_proxy = create_proxy(key_handler)
window.addEventListener("keydown", key_proxy)

# Game Loop using interval
def game_loop():
    update()
    draw()

loop_proxy = create_proxy(game_loop)
print("🐍 Snake Started! Use Arrow Keys.")
# Start loop (approx 10fps)
interval_id = window.setInterval(loop_proxy, 100)
`
};

// --- VISUALIZER COMPONENT ---
const NetworkVisualizer = ({ layers, activePhase, activeLayerIdx }) => {
    const canvasWidth = 600;
    const canvasHeight = 300;
    const H_MARGIN = 60; 
    const H_RANGE = canvasWidth - 2 * H_MARGIN;
    const totalColumns = layers.length + 2; 
    const intervalWidth = totalColumns > 1 ? H_RANGE / (totalColumns - 1) : H_RANGE; 

    // INCREASED LIMIT: Show more neurons
    const getVisualUnits = (count) => Math.min(count, 20);
    
    const nodes = [];
    const links = [];
    const getLayerX = (lIdx) => H_MARGIN + lIdx * intervalWidth; 

    // Input Layer
    const inputCount = 5;
    for(let i=0; i<inputCount; i++) {
        nodes.push({ id: `L0-N${i}`, x: getLayerX(0), y: (canvasHeight/(inputCount+1))*(i+1), layer: 0 });
    }

    // Hidden Layers
    layers.forEach((layer, lIdx) => {
        const actualIdx = lIdx + 1;
        const unitCount = layer.params.units || 1; 
        const vizCount = getVisualUnits(unitCount);
        
        // Dynamic Height Spacing
        const spacing = canvasHeight / (vizCount + 1);

        for(let i=0; i<vizCount; i++) {
            nodes.push({ 
                id: `L${actualIdx}-N${i}`, 
                x: getLayerX(actualIdx), 
                y: spacing * (i + 1),
                layer: actualIdx
            });
        }
    });

    // Output Layer
    const finalLayerIdx = layers.length + 1;
    if (layers.length > 0 && layers[layers.length - 1].type !== 'dense') {
        nodes.push({ id: `L${finalLayerIdx}-N0`, x: getLayerX(finalLayerIdx), y: canvasHeight / 2, layer: finalLayerIdx });
    }

    nodes.forEach(node => {
        if(node.layer > 0) {
            const prevLayerNodes = nodes.filter(n => n.layer === node.layer - 1);
            prevLayerNodes.forEach(prev => {
                links.push({ source: prev, target: node, layerIdx: node.layer - 1 });
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
            <svg width="100%" height="300" viewBox={`0 0 ${canvasWidth} ${canvasHeight}`} preserveAspectRatio="xMidYMid meet">
                {links.map((link, i) => (
                    <line key={i} x1={link.source.x} y1={link.source.y} x2={link.target.x} y2={link.target.y}
                        className={`synapse ${activeLayerIdx === link.layerIdx ? (activePhase === 'forward' ? 'active-fwd' : 'active-bwd') : ''}`}
                        stroke="#475569" strokeWidth="1" />
                ))}
                {nodes.map(node => (
                    <circle key={node.id} cx={node.x} cy={node.y} r="6"
                        className={`neuron ${activeLayerIdx === node.layer-1 || activeLayerIdx === node.layer ? 'active' : ''}`}
                        fill={node.layer === 0 ? '#22c55e' : (node.layer === finalLayerIdx ? '#ef4444' : '#3b82f6')}
                        stroke="white" strokeWidth="1.5" />
                ))}
            </svg>
            {/* Neuron Count Display */}
            <div style={{display:'flex', justifyContent:'space-between', color:'#94a3b8', fontSize:'0.8rem', padding:'0 40px'}}>
                <div style={{textAlign:'center'}}>Input<br/><small>(5)</small></div>
                {layers.map((l, i) => (
                    <div key={i} style={{textAlign:'center'}}>
                        {l.name.split(' ')[0]}<br/>
                        <small>({l.params.units || 'N/A'})</small>
                    </div>
                ))}
                <div style={{textAlign:'center'}}>Output<br/><small>(1)</small></div>
            </div>
        </div>
    );
};

const App = () => {
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
  const [vizActiveLayer, setVizActiveLayer] = useState(-1);
  const [activePhase, setActivePhase] = useState('idle');

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

  useEffect(() => { return () => { if(trainedModel) trainedModel.dispose(); } }, [trainedModel]);

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
                stdin: () => window.prompt("Python Input:") || "" 
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
    // Clean up existing intervals
    let id = window.setInterval(function() {}, 0);
    while (id--) { window.clearInterval(id); }
    id = window.setTimeout(function() {}, 0);
    while (id--) { window.clearTimeout(id); }

    setPyCode(GAME_SCRIPTS[key]);
    setPyOutput(`Loaded ${key}. Click Run! (See Canvas below for Graphics)`);
  };

  const runPython = async () => {
    if (!pyodide) return;
    setIsPyRunning(true);
    setPyOutput("Running...");
    try {
      pyodide.setStdout({ batched: (msg) => {
          // Ensure msg is a string to prevent React Object errors
          const safeMsg = typeof msg === 'string' ? msg : String(msg);
          setPyOutput(prev => (prev === "Running..." ? "" : prev) + safeMsg + "\n") 
      }});
      await pyodide.runPythonAsync(pyCode);
    } catch (e) { 
        const errStr = e && e.message ? e.message : String(e);
        setPyOutput(`❌ Error:\n${errStr}`); 
    }
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
        Open: parseFloat(k[1]), High: parseFloat(k[2]), Low: parseFloat(k[3]), Close: parseFloat(k[4]), Volume: parseFloat(k[7])
      }));
      const ds = { id: Date.now(), name: `${cryptoSymbol}_${isValidation?'Test':'Train'}`, headers: Object.keys(data[0]), data };
      if (isValidation) { setValidationDataset(ds); setLogs(p => [...p, "✅ Validation Data loaded."]); } 
      else { setDatasets([ds]); setSelectedDataset(ds); setActiveTab('configure'); setLogs(p => [...p, "✅ Training Data loaded."]); }
    } catch (e) { setLogs(p => [...p, `❌ API Error: ${e.message}`]); }
  };

  const downloadModel = async () => {
    if(!trainedModel) { alert("No model trained yet!"); return; }
    await trainedModel.save('downloads://snowai-model');
  };

  const downloadCode = () => {
    const pyScript = `
import tensorflow as tf
from tensorflow.keras import layers, models

def build_model(input_shape):
    model = models.Sequential()
    model.add(layers.Input(shape=input_shape))
${modelBlocks.map(b => {
    if(b.type==='dense') return `    model.add(layers.Dense(${b.params.units}, activation='${b.params.activation}'))`;
    if(b.type==='lstm') return `    model.add(layers.LSTM(${b.params.units}, return_sequences=False))`;
    if(b.type==='dropout') return `    model.add(layers.Dropout(${b.params.rate}))`;
    if(b.type==='conv1d') return `    model.add(layers.Conv1D(filters=${b.params.filters}, kernel_size=${b.params.kernel_size}, activation='relu'))`;
    return '';
}).join('\n')}
    model.add(layers.Dense(1))
    model.compile(optimizer=tf.keras.optimizers.Adam(learning_rate=${trainingConfig.learningRate}), loss='mse')
    return model
print("✅ Model Architecture Ready")`;
    const blob = new Blob([pyScript], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'snowai_model_arch.py';
    a.click();
  };

  const runPrediction = (model, dataset, windowSize, min, max) => {
      const priceCol = dataset.headers.find(h => h.toLowerCase().includes('close')) || dataset.headers[dataset.headers.length-1];
      const rawData = dataset.data.map(r => r[priceCol]);
      const tensorData = tf.tensor1d(rawData);
      const normalized = tensorData.sub(min).div(max.sub(min));
      const values = normalized.dataSync();
      const X_arr = [];
      for(let i = windowSize; i < values.length; i++) { X_arr.push(values.slice(i-windowSize, i)); }
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
        if (predMove > 0.005) signal = 1; else if (predMove < -0.005) signal = -1;
        
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
        resultData.push({ idx: i, Actual: Math.round(actualPrice), Predicted: Math.round(predPrice), Equity: Math.round(balance) });
      }
      
      const totalReturn = ((balance - 10000) / 10000) * 100;
      const winRate = tradeCount > 0 ? (wins / tradeCount) * 100 : 0;
      const maxDrawdown = ((maxBal - minBal) / maxBal) * 100;
      return { totalReturn, winRate, maxDrawdown, chartData: resultData };
  };

  const trainModel = async () => {
    if (!selectedDataset || modelBlocks.length === 0) { alert("Please select a dataset and add model layers."); return; }
    setIsTraining(true); setProgress(0); setLogs(p => [...p, "🚀 Starting Training..."]);
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
      for(let i = windowSize; i < values.length; i++) { X_arr.push(values.slice(i-windowSize, i)); y_arr.push(values[i]); }
      const X = tf.tensor2d(X_arr);
      const y = tf.tensor2d(y_arr, [y_arr.length, 1]);
      const splitIdx = Math.floor(X_arr.length * trainingConfig.split);
      const X_train = X.slice([0,0], [splitIdx, -1]);
      const y_train = y.slice([0,0], [splitIdx, -1]);
      const X_test = X.slice([splitIdx, 0], [-1, -1]);

      const model = tf.sequential();
      modelBlocks.forEach((b, i) => {
        const config = { ...b.params, inputShape: i === 0 ? [windowSize] : undefined };
        if(b.type === 'dense') model.add(tf.layers.dense(config));
        if(b.type === 'dropout') model.add(tf.layers.dropout(config));
        if(b.type === 'lstm') { if(i===0) model.add(tf.layers.reshape({targetShape: [windowSize, 1], inputShape: [windowSize]})); model.add(tf.layers.lstm(config)); }
        if(b.type === 'conv1d') { if(i===0) model.add(tf.layers.reshape({targetShape: [windowSize, 1], inputShape: [windowSize]})); model.add(tf.layers.conv1d(config)); model.add(tf.layers.flatten()); }
        if(b.type === 'dqn') { model.add(tf.layers.dense({units: 64, activation: 'relu'})); model.add(tf.layers.dense({units: 32, activation: 'relu'})); }
      });
      model.add(tf.layers.dense({ units: 1 }));
      model.compile({ optimizer: tf.train.adam(trainingConfig.learningRate), loss: 'meanSquaredError' });

      await model.fit(X_train, y_train, {
        epochs: trainingConfig.epochs,
        callbacks: {
          onEpochEnd: async (epoch, logs) => {
            setProgress(Math.round(((epoch + 1) / trainingConfig.epochs) * 100));
            if (epoch % 2 === 0) { 
              setLogs(p => [...p, `Ep ${epoch+1}: Loss ${logs.loss.toFixed(5)}`]);
              setActivePhase('forward');
              for(let i=0; i<=modelBlocks.length; i++) { setVizActiveLayer(i); await new Promise(r => setTimeout(r, 50)); }
              setActivePhase('backward');
              for(let i=modelBlocks.length; i>=0; i--) { setVizActiveLayer(i); await new Promise(r => setTimeout(r, 50)); }
              setActivePhase('idle'); setVizActiveLayer(-1);
            }
          }
        }
      });

      const resultsStats = runPrediction(model, {...selectedDataset, data: selectedDataset.data.slice(splitIdx + windowSize)}, windowSize, min, max);
      setTrainedModel(model); setResults({ ...resultsStats, minTensor: min, maxTensor: max, windowSize });
      setLogs(p => [...p, "✅ Training Complete!"]); setActiveTab('results');
    } catch (e) { console.error(e); setLogs(p => [...p, `❌ Error: ${e.message}`]); } finally { setIsTraining(false); }
  };

  const validateModel = async () => {
    if(!validationDataset || !trainedModel || !results) return;
    setLogs(p => [...p, `🔎 Validating on ${validationDataset.name}...`]);
    try {
      const stats = runPrediction(trainedModel, validationDataset, results.windowSize, results.minTensor, results.maxTensor);
      setResults(prev => ({ ...prev, validationStats: stats }));
      setLogs(p => [...p, `✅ Validation Result: Return ${stats.totalReturn.toFixed(2)}%`]);
    } catch(e) { setLogs(p => [...p, `❌ Validation Error: ${e.message}`]); }
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
          <div><div className="title"><h1>SnowAI Quant Lab</h1><p>Interactive Machine Learning Environment</p></div></div>
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
                 <button className="btn btn-primary" onClick={() => fetchBinance(false)}><Globe size={18} /> Fetch Training Data</button>
               </div>
            </div>
          )}

          {/* CONFIGURE */}
          {activeTab === 'configure' && (
            <div className="grid-2">
              <div className="card">
                <div className="section-header"><Zap size={20} /> Toolbox</div>
                <div style={{marginBottom: 16}}>
                    <small style={{color:'#64748b', fontWeight:600}}>CORE</small>
                    <div className="model-item" onClick={() => setModelBlocks([...modelBlocks, {type: 'dense', name: 'Dense Layer', params: {units: 32, activation: 'relu'}}])}><Layers size={20} color="#2563eb" /> <div><strong>Dense</strong></div></div>
                    <div className="model-item" onClick={() => setModelBlocks([...modelBlocks, {type: 'dropout', name: 'Dropout', params: {rate: 0.2}}])}><Trash2 size={20} color="#ef4444" /> <div><strong>Dropout</strong></div></div>
                </div>
                <div style={{marginBottom: 16}}>
                    <small style={{color:'#64748b', fontWeight:600}}>TIME SERIES</small>
                    <div className="model-item" onClick={() => setModelBlocks([...modelBlocks, {type: 'lstm', name: 'LSTM Layer', params: {units: 50}}])}><Activity size={20} color="#8b5cf6" /> <div><strong>LSTM</strong></div></div>
                    <div className="model-item" onClick={() => setModelBlocks([...modelBlocks, {type: 'conv1d', name: 'Conv1D', params: {filters: 32, kernel_size: 2}}])}><Activity size={20} color="#ec4899" /> <div><strong>Conv1D</strong></div></div>
                </div>
                <div>
                    <small style={{color:'#64748b', fontWeight:600}}>RL & ADVANCED</small>
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
                {modelBlocks.length > 0 && <NetworkVisualizer layers={modelBlocks} activePhase={activePhase} activeLayerIdx={vizActiveLayer} />}
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
                <div className="card"><div className="section-header"><Terminal size={20} /> System Logs</div><div className="terminal" ref={logsContainerRef}>{logs.map((l, i) => <div key={i} style={{marginBottom: 4}}>{typeof l === 'string' ? l : JSON.stringify(l)}</div>)}</div></div>
                </div>

                <div className="card">
                    <h3 style={{display:'flex', alignItems:'center', gap: 8, justifyContent:'space-between'}}>
                        <span style={{display:'flex', gap:8}}><Code color="#eab308" /> Python Arcade</span>
                        <div className="py-controls">
                           <button className="btn btn-ghost" onClick={() => loadGameScript('guess')}><Gamepad2 size={16}/> Guess</button>
                           <button className="btn btn-ghost" onClick={() => loadGameScript('tictactoe')}><LayoutTemplate size={16}/> Tic-Tac-Toe</button>
                           <button className="btn btn-ghost" onClick={() => loadGameScript('snake')}><Gamepad2 size={16}/> Snake</button>
                        </div>
                    </h3>
                    <textarea className="python-editor" value={pyCode} onChange={e => setPyCode(e.target.value)} spellCheck="false" />
                    <canvas id="game-canvas" width="300" height="300" className="game-canvas" />
                    <div style={{display:'flex', justifyContent: 'space-between', marginTop: 16}}>
                        <button className="btn btn-primary" style={{background: '#eab308', color: 'black'}} onClick={runPython} disabled={!pyodide || isPyRunning}>
                            {isPyRunning ? <RefreshCw className="animate-spin" size={16} /> : <Play size={16} />} Run Code
                        </button>
                        <span style={{color: pyodide ? '#16a34a' : '#f59e0b'}}>{pyodide ? '● Kernel Ready' : '● Loading...'}</span>
                    </div>
                    <pre style={{background:'#111', color: '#eab308', padding: 12, borderRadius: 6, marginTop: 12, fontSize: '0.8rem', overflowX:'auto'}}>{pyOutput}</pre>
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
                   <div className="metric-val text-blue">{results.validationStats ? results.validationStats.winRate.toFixed(2) : results.winRate.toFixed(2)}%</div>
                 </div>
                 <div className="metric-box">
                   <div style={{color:'#64748b'}}>Max Drawdown</div>
                   <div className="metric-val text-red">{results.validationStats ? results.validationStats.maxDrawdown.toFixed(2) : results.maxDrawdown.toFixed(2)}%</div>
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

export default App;