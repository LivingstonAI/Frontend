import React, { useState, useEffect, useRef, useMemo } from 'react';

// --- CONFIGURATION CONSTANTS (Placeholders) ---
const INITIAL_CASH = 10000;
const TICK_RATE_DEFAULT = 100; // 100ms update speed
const COMMISSION = 0.001; // 0.1% commission on trades
const THEME = {
    primary: '#3b82f6',
    secondary: '#1f2937',
    background: '#0f172a',
    text: '#f8fafc',
    border: '#334155',
    success: '#4ade80',
    danger: '#f87171',
    warning: '#fbbf24',
};

// --- HELPER FUNCTIONS ---
// Placeholder format function
const fmt = (value, currency = '$') => {
    if (value === null || isNaN(value)) return `${currency}0.00`;
    return `${currency}${value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
};

// --- NEURAL NETWORK IMPLEMENTATION (MicroNet) ---
class MicroNet {
    // Very simple 4-input, 1-output single-layer network with sigmoid activation
    constructor(initialWeights, initialBias, lr = 0.01) {
        this.lr = lr;
        // 4 inputs (smaDist, normVolatility, normPriceChange, trend)
        this.weights = initialWeights || Array(4).fill(0).map(() => (Math.random() * 2 - 1) * 0.5); 
        this.bias = initialBias || (Math.random() * 2 - 1) * 0.5;
    }

    // Sigmoid activation function
    _sigmoid(x) {
        return 1 / (1 + Math.exp(-x));
    }

    // Derivative of sigmoid
    _sigmoidDerivative(fx) {
        return fx * (1 - fx);
    }

    predict(inputs) {
        let sum = this.bias;
        for (let i = 0; i < 4; i++) {
            sum += inputs[i] * this.weights[i];
        }
        return this._sigmoid(sum);
    }

    // Simple gradient descent training step
    train(inputs, target) {
        const output = this.predict(inputs);
        const error = target - output;
        const gradient = error * this._sigmoidDerivative(output);

        // Update weights and bias
        for (let i = 0; i < 4; i++) {
            this.weights[i] += this.lr * gradient * inputs[i];
        }
        this.bias += this.lr * gradient;
        
        // Return Mean Squared Error (for logging)
        return error * error; 
    }
}

// --- AGENT TEMPLATES ---
const AGENT_TEMPLATES = [
    { 
        id: 1, 
        name: "Snow-Alpha", 
        type: "Balanced (DQN)", 
        color: "#3b82f6", 
        lr: 0.01, 
        risk: 'med',
        description: "A balanced Deep Q-Network agent that uses moderate learning rates and medium-risk tolerance. Analyzes price changes, SMA distance, and volatility to make informed trading decisions. Best for steady market conditions.",
        strategy: "Uses sigmoid activation with 4-input neural network. Buys when confidence > 40%, sells when < 60%. Applies 95% of cash per trade."
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

// --- STYLES ---
const styles = {
    app: {
        backgroundColor: THEME.background,
        color: THEME.text,
        minHeight: '100vh',
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: '20px',
        borderBottom: `1px solid ${THEME.border}`,
        marginBottom: '20px',
    },
    main: {
        display: 'flex',
        gap: '20px',
    },
    sidebar: {
        width: '250px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        padding: '15px',
        backgroundColor: THEME.secondary,
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        height: 'fit-content',
        borderRight: `1px solid ${THEME.border}`,
    },
    contentArea: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
    },
    chartContainer: {
        backgroundColor: THEME.secondary,
        padding: '15px',
        borderRadius: '8px',
        border: `1px solid ${THEME.border}`,
    },
    agentGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '20px',
    },
    card: {
        backgroundColor: THEME.secondary,
        padding: '15px',
        borderRadius: '8px',
        border: `1px solid ${THEME.border}`,
        display: 'flex',
        flexDirection: 'column',
        minHeight: '350px',
    },
    cardHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '10px',
        paddingBottom: '10px',
        borderBottom: `1px solid ${THEME.border}`,
    },
    cardFooter: {
        display: 'flex',
        gap: '10px',
        marginTop: 'auto',
        paddingTop: '10px',
        borderTop: `1px solid ${THEME.border}`,
    },
    terminal: {
        backgroundColor: THEME.background,
        padding: '10px',
        borderRadius: '4px',
        fontSize: '10px',
        fontFamily: 'monospace',
        flex: 1,
        position: 'relative',
        minHeight: '200px',
    },
    logArea: {
        height: 'calc(100% - 90px)', // Adjust based on mini-chart height
        overflowY: 'auto',
    },
    label: {
        fontSize: '10px',
        color: '#94a3b8',
        marginBottom: '5px',
        fontWeight: '600',
    },
    input: {
        width: '100%',
        padding: '8px',
        backgroundColor: THEME.background,
        border: `1px solid ${THEME.border}`,
        color: THEME.text,
        borderRadius: '4px',
        boxSizing: 'border-box',
    },
    btn: {
        padding: '10px 15px',
        borderRadius: '4px',
        cursor: 'pointer',
        fontWeight: '600',
        transition: 'background-color 0.2s',
        border: 'none',
        fontSize: '12px',
    },
    btnPrimary: {
        backgroundColor: THEME.primary,
        color: 'white',
    },
    btnSecondary: {
        backgroundColor: THEME.secondary,
        color: THEME.text,
        border: `1px solid ${THEME.border}`,
    },
};

// --- MINIMAL DUMMY COMPONENTS ---
const Header = () => <div style={{color: THEME.primary}}>SnowAI Trading Sim</div>;
const SideNavs = () => <div style={{width: '0px'}}></div>; // Not needed for main component structure
const MainCandleChart = ({ data, agents, width, height }) => <div style={{color: '#94a3b8'}}>Main Chart: {data.length} Candles, {agents.length} Agents. 

[Image of a candlestick chart showing price and agent entries/exits]
</div>;
const MiniCandleChart = ({ data, trades, width, height }) => <div style={{color: '#94a3b8', fontSize: '10px'}}>Mini Chart: {data.length} Candles. Trades: {trades.length} 

[Image of a mini line chart showing asset price and agent trades]
</div>;
const WeightsDisplay = ({ weights, bias }) => <span title={`Weights: ${weights.map(w => w.toFixed(2)).join(', ')}, Bias: ${bias.toFixed(2)}`} style={{fontSize: '8px', marginLeft: '5px', color: '#64748b'}}>🧠</span>;
const Modal = ({ title, onClose, children }) => (
    <div style={{position:'fixed', inset:0, backgroundColor:'rgba(0,0,0,0.7)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center'}}>
        <div className="modal-content" style={{width:'500px', backgroundColor:THEME.secondary, padding:'20px', borderRadius:'8px', maxHeight:'80vh', overflowY:'auto'}}>
            <h3 style={{marginTop:0, borderBottom:`1px solid ${THEME.border}`, paddingBottom:'10px'}}>{title}</h3>
            {children}
            <button style={{...styles.btn, ...styles.btnPrimary, marginTop:'20px'}} onClick={onClose}>Close</button>
        </div>
    </div>
);
const ModelInfoModal = ({ agent, onClose }) => (
    <Modal title={`Model Info: ${agent.name}`} onClose={onClose}>
        <p><strong>Type:</strong> {agent.type}</p>
        <p><strong>Risk:</strong> {agent.risk}</p>
        <p><strong>Learning Rate (LR):</strong> {agent.lr}</p>
        <p><strong>Description:</strong> {agent.description}</p>
        <p><strong>Strategy:</strong> {agent.strategy}</p>
    </Modal>
);
const StatisticsModal = ({ agents, onClose, assetPrice, startPrice }) => {
    const marketReturn = startPrice ? ((assetPrice - startPrice) / startPrice * 100) : 0;
    return (
        <Modal title="Simulation Statistics" onClose={onClose}>
            <p><strong>Market Performance ({agents[0]?.assetName || 'ASSET'}):</strong> {marketReturn.toFixed(2)}%</p>
            <h4 style={{borderBottom:`1px solid ${THEME.border}`, paddingBottom:'5px'}}>Agent Performance</h4>
            <table style={{width:'100%', borderCollapse:'collapse', fontSize:'12px'}}>
                <thead>
                    <tr style={{borderBottom:`1px solid ${THEME.border}`}}>
                        <th style={{textAlign:'left', padding:'5px'}}>Agent</th>
                        <th style={{padding:'5px'}}>Final Value</th>
                        <th style={{padding:'5px'}}>Return</th>
                        <th style={{padding:'5px'}}>Trades</th>
                    </tr>
                </thead>
                <tbody>
                    {agents.map(a => (
                        <tr key={a.id} style={{borderBottom:`1px dotted #334155`}}>
                            <td style={{textAlign:'left', padding:'5px', color: a.color}}>{a.name}</td>
                            <td style={{textAlign:'right', padding:'5px'}}>{fmt(a.portfolioValue)}</td>
                            <td style={{textAlign:'right', padding:'5px', color: a.portfolioValue >= INITIAL_CASH ? THEME.success : THEME.danger}}>
                                {((a.portfolioValue - INITIAL_CASH)/INITIAL_CASH*100).toFixed(2)}%
                            </td>
                            <td style={{textAlign:'right', padding:'5px'}}>{a.history.filter(h => h.type !== 'WAIT').length}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Modal>
    );
};

// --- MAIN COMPONENT CODE ---
const mobileStyles = `
    @media (max-width: 768px) {
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
    }
`;

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

    // Helper to calculate Simple Moving Average (SMA)
    const calculateSMA = (data, period) => {
        if (data.length < period) return null;
        // Use slice(0) to create a copy, then slice(-period) for the last 'period' elements
        const sliced = data.slice().slice(-period); 
        const sum = sliced.reduce((acc, d) => acc + d.c, 0);
        return sum / period;
    };

    // Helper to calculate Volatility (Standard Deviation)
    const calculateVolatility = (data, period) => {
        if (data.length < period) return 0;
        const sliced = data.slice().slice(-period);
        const sma = calculateSMA(data, period);
        if (sma === null) return 0;

        const variance = sliced.reduce((acc, d) => acc + Math.pow(d.c - sma, 2), 0) / period;
        return Math.sqrt(variance);
    };

    // Helper to normalize a value between a min and max
    const normalize = (value, min, max) => {
        if (min === max) return 0.5;
        return (value - min) / (max - min);
    };

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
                // Assuming standard OHLCV or just OHLC format, C at index 4 (0-based)
                if (parts.length >= 5) {
                    return { t: i, o: parseFloat(parts[1]), h: parseFloat(parts[2]), l: parseFloat(parts[3]), c: parseFloat(parts[4]) };
                } else if (parts.length === 1) {
                    // Assume single price point data
                    const val = parseFloat(parts[0]);
                    return { t: i, o: val, h: val, l: val, c: val };
                }
                return null;
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
            if (existing && existing.persistentMemory && existing.brain) {
                // Preserve brain and persistent memory setting if requested
                newState.brain = existing.brain;
                newState.persistentMemory = true;
                newState.logs = [{msg: "Agent Restarted with Persistent Memory", type:'info'}];
            }
            return newState;
        }));
    };

    useEffect(() => {
        if (dataSource === 'BINANCE') {
            setAssetName('BTCUSDT');
            if (wsRef.current) wsRef.current.close();
            // Using a test net stream for safety/reliability in a simulation context, or the user's intended stream
            wsRef.current = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@kline_1s'); 
            
            wsRef.current.onopen = () => console.log('WebSocket Connected');
            wsRef.current.onerror = (error) => console.error('WebSocket Error:', error);

            wsRef.current.onmessage = (event) => {
                const msg = JSON.parse(event.data);
                if (msg.e === 'kline' && !msg.k.x) { // k.x is 'is this candle closed?' - false for ongoing candle
                    const k = msg.k;
                    // Note: Binance timestamps are in milliseconds
                    const newCandle = { 
                        t: k.t, 
                        o: parseFloat(k.o), 
                        h: parseFloat(k.h), 
                        l: parseFloat(k.l), 
                        c: parseFloat(k.c) 
                    };
                    const current = candlesRef.current;
                    
                    // Update last candle if same timestamp (same 1s candle)
                    if (current.length > 0 && current[current.length - 1].t === newCandle.t) {
                        current[current.length - 1] = newCandle;
                    } else if (current.length === 0 || newCandle.t > current[current.length - 1].t) {
                        // Add new candle if newer timestamp
                        current.push(newCandle);
                    } else {
                         // Should not happen for a live feed, but defensively: ignore old data
                         return;
                    }

                    candlesRef.current = current;
                    setAssetPrice(newCandle.c);
                    if (startPrice === null) setStartPrice(newCandle.c);
                }
            };
        } else {
            if (wsRef.current) wsRef.current.close();
            wsRef.current = null;
        }

        return () => { if (wsRef.current) wsRef.current.close(); };
    }, [dataSource]);

    // --- GAME LOOP ---
    useEffect(() => {
        if (!isRunning) return;

        const updateAgents = (currentCandle, allCandles) => {
            setAgents(prevAgents => prevAgents.map(agent => {
                if (!agent.isActive) return agent;
                
                const currentPrice = currentCandle.c;
                const { cash, shares, portfolioValue, history, brain, lr, id, candles: agentCandles, hasBoughtInitial, persistentMemory } = agent;

                // Agent only keeps the last 30 candles for its mini-chart
                const newAgentCandles = [...agentCandles.slice(-29), currentCandle];
                
                let newCash = cash;
                let newShares = shares;
                let newHistory = [...history];
                // Keep only the last 21 logs (20 plus the next one)
                let newLogs = [...agent.logs.slice(-20)]; 
                let action = 'WAIT';
                let pnl = 0;
                let lastBuyPrice = null;

                // Find the price of the last BUY trade for SL/TP calculation
                for (let i = newHistory.length - 1; i >= 0; i--) {
                    if (newHistory[i].type === 'BUY') {
                        // This buy price is the cost per share *without* commission factored in yet, 
                        // so the entry price for P&L is just the price at the time of purchase
                        lastBuyPrice = newHistory[i].price; 
                        break;
                    }
                }

                let prediction = 0.5;    
                let inputs = [0, 0, 0, 0];
                let target = 0.5;
                
                // AI Agent Logic (ID 1-10)
                if (brain && allCandles.length > 20) {
                    // --- Technical Indicator Calculations ---
                    const candles20 = allCandles.slice(-20);
                    const candles5 = allCandles.slice(-5);

                    const sma20 = calculateSMA(allCandles, 20);
                    const sma5 = calculateSMA(allCandles, 5);
                    const volatility10 = calculateVolatility(allCandles, 10);
                    
                    const prevPrice = allCandles[allCandles.length - 2]?.c || currentPrice;
                    const priceChange = (currentPrice - prevPrice) / prevPrice;

                    // Normalization factors based on historical range
                    const maxDist = candles20.reduce((max, d) => Math.max(max, Math.abs(d.c - sma20) / sma20), 0.01);
                    const smaDist = normalize(currentPrice, sma20 * (1 - maxDist), sma20 * (1 + maxDist)) * 2 - 1; // Normalized between -1 and 1

                    // Find max volatility for normalization (can be expensive, simplified to max in last 20)
                    const maxVol = candles20.reduce((max, d) => Math.max(max, calculateVolatility(allCandles.slice(0, allCandles.findIndex(c => c.t === d.t) + 1), 10)), 0.005);
                    const normVolatility = normalize(volatility10, 0, maxVol); // Normalized between 0 and 1

                    const maxChange = candles20.reduce((max, d, i) => i > 0 ? Math.max(max, Math.abs((d.c - allCandles[allCandles.length - 20 + i - 1].c) / allCandles[allCandles.length - 20 + i - 1].c)) : 0.01, 0.01);
                    const normPriceChange = normalize(priceChange, -maxChange, maxChange) * 2 - 1; // Normalized between -1 and 1
                    
                    const trend = sma5 > sma20 ? 1 : -1; // Simple trend indicator

                    inputs = [smaDist, normVolatility, normPriceChange, trend];
                    prediction = brain.predict(inputs);    
                }

                // --- STOP LOSS / TAKE PROFIT - EXEMPT BUY & HOLD (ID 11) ---
                if (id !== 11 && shares > 0 && lastBuyPrice) {
                    const unrealizedPnlPct = (currentPrice - lastBuyPrice) / lastBuyPrice * 100;
                    
                    if (unrealizedPnlPct >= takeProfitPct) {
                        action = 'SELL_TP';
                        newLogs.push({msg: `Take Profit Hit! (+${unrealizedPnlPct.toFixed(2)}%)`, type:'success'});
                    } else if (unrealizedPnlPct <= -stopLossPct) {
                        action = 'SELL_SL';
                        newLogs.push({msg: `Stop Loss Hit! (-${Math.abs(unrealizedPnlPct).toFixed(2)}%)`, type:'danger'});
                    }
                }

                // --- AGENT-SPECIFIC LOGIC ---
                if (action === 'WAIT') {
                    if (id === 11) { // Buy & Hold
                        if (!hasBoughtInitial && currentPrice > 0) {
                            action = 'BUY_INITIAL';
                        }
                    } else if (id === 12) { // Dip-Buyer
                        if (!hasBoughtInitial && currentPrice > 0) {
                            const buyAmount = cash * 0.25;    
                            newShares = buyAmount / currentPrice * (1 - COMMISSION);
                            newCash -= buyAmount;
                            newHistory.push({ type: 'BUY', price: currentPrice, amount: newShares, t: currentCandle.t });
                            newLogs.push({ msg: `Initial Dip-Buy: ${newShares.toFixed(4)} @ ${currentPrice.toFixed(2)}`, type: 'success' });
                            action = 'BUY_INITIAL';
                            agent.hasBoughtInitial = true;
                        } else if (allCandles.length >= 5 && shares === 0 && calculateSMA(allCandles, 5)) {
                            const sma5 = calculateSMA(allCandles, 5);
                            const dropPct = (sma5 - currentPrice) / sma5 * 100;
                            
                            if (dropPct >= 2) {
                                action = 'BUY';
                            }
                        } else if (shares > 0 && lastBuyPrice) {
                             const unrealizedPnlPct = (currentPrice - lastBuyPrice) / lastBuyPrice * 100;
                             if (unrealizedPnlPct >= 1.5) {
                                 action = 'SELL';    
                             }
                        }
                    } else if (brain) { // DQN Agents (ID 1-10)
                        if (shares === 0) {
                            if (prediction >= 0.45) { // Buy when confidence high (0.45-1.0)
                                action = 'BUY';
                            }
                        } else {
                            if (prediction <= 0.35) { // Sell when confidence low (0.0-0.35)
                                action = 'SELL';
                            }
                        }
                    }
                }

                // --- EXECUTE TRADE ---
                if (action.startsWith('BUY')) {
                    let cashToUse = cash;
                    // Determine amount of cash to commit
                    if (id === 11) { // Buy & Hold uses all cash once
                        cashToUse = cash; 
                    } else if (id === 12 && action === 'BUY_INITIAL') { // Dip Buyer initial buy is 25%
                        cashToUse = cash * 0.25;
                    } else if (id === 12) { // Dip Buyer subsequent buys are 10%
                         cashToUse = cash * 0.10;
                    } else { // DQN Agents use 98% of available cash
                        cashToUse = cash * 0.98;
                    }
                    
                    if (cashToUse <= 0) return agent; // No cash to trade

                    const sharesToBuy = (cashToUse / currentPrice) * (1 - COMMISSION); // Buy shares, pay commission
                    
                    newShares += sharesToBuy;
                    newCash -= cashToUse;
                    
                    newHistory.push({ type: 'BUY', price: currentPrice, amount: sharesToBuy, t: currentCandle.t });
                    newLogs.push({ msg: `BUY: ${sharesToBuy.toFixed(4)} @ ${currentPrice.toFixed(2)}`, type: 'success' });
                    
                    if (brain) target = 1; // Buying is a good action, target high prediction
                    
                } else if (action.startsWith('SELL')) {
                    if (shares === 0) return agent; // Nothing to sell

                    const initialShares = shares;
                    
                    // IMPROVED P&L CALCULATION (FIFO Method Approximation)
                    let totalCost = 0;
                    let remainingShares = initialShares;
                    
                    // Calculate actual cost basis from buy history (FIFO method)
                    // Note: This relies on history only containing 'BUY' records with price and amount.
                    for (let i = 0; i < newHistory.length && remainingShares > 0; i++) {
                        if (newHistory[i].type === 'BUY') {
                            const sharesFromThisBuy = Math.min(remainingShares, newHistory[i].amount);
                            // The cost basis is the cash used to acquire the shares: shares * price / (1 - COMMISSION)
                            totalCost += sharesFromThisBuy * newHistory[i].price / (1 - COMMISSION); 
                            remainingShares -= sharesFromThisBuy;
                        }
                    }
                    
                    const saleAmount = initialShares * currentPrice * (1 - COMMISSION); // Sale revenue after commission
                    pnl = saleAmount - totalCost; // Profit/Loss
                    
                    newCash += saleAmount;
                    newShares = 0;
                    
                    newHistory.push({ type: 'SELL', price: currentPrice, amount: initialShares, t: currentCandle.t, pnl: pnl });
                    newLogs.push({ msg: `SELL (${action.endsWith('SL') ? 'SL' : action.endsWith('TP') ? 'TP' : 'AI'}): PnL ${fmt(pnl)}`, type: pnl >= 0 ? 'success' : 'danger' });

                    if (brain) target = pnl > 0 ? 0 : 1; // Reward good sells (target low prediction), punish bad ones (target high prediction)
                }
                
                // --- DQN TRAINING ---
                let newLoss = agent.loss;
                // Only train DQN agents that performed an action
                if (brain && action !== 'WAIT' && id !== 11 && id !== 12) { 
                    const error = brain.train(inputs, target);
                    newLoss = error;
                    newLogs.push({ msg: `Trained (Target: ${target}, Loss: ${error.toFixed(4)})`, type: 'info' });
                }

                const finalPortfolioValue = newCash + newShares * currentPrice;
                const newEquityCurve = [...agent.equityCurve, finalPortfolioValue];
                
                return {
                    ...agent,
                    cash: newCash,
                    shares: newShares,
                    portfolioValue: finalPortfolioValue,
                    prevValue: portfolioValue,
                    history: newHistory,
                    logs: newLogs,
                    loss: newLoss,
                    candles: newAgentCandles,
                    lastAction: action,
                    equityCurve: newEquityCurve,
                    // Note: brain is updated in place in MicroNet class, but we return a reference
                    brain: brain, 
                    hasBoughtInitial: id === 11 || id === 12 ? (action.startsWith('BUY') || hasBoughtInitial) : hasBoughtInitial
                };
            }));
        };

        const interval = setInterval(() => {
            let currentCandle = null;
            
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
                const c = candlesRef.current;
                if (c.length > 0) currentCandle = c[c.length - 1];
            }

            if (currentCandle) {
                // Keep chart data limited for performance
                setCandles(candlesRef.current.slice(-100)); 
                updateAgents(currentCandle, candlesRef.current);
            }
        }, speed);

        return () => clearInterval(interval);
    }, [isRunning, speed, dataSource, dataIndex, customData, startPrice, stopLossPct, takeProfitPct]); // Dependencies are correct

    const toggleAgent = (id) => {
        setAgents(prev => prev.map(a => a.id === id ? {
            ...a,
            isActive: !a.isActive,
            logs: a.isActive ? [...a.logs, {msg: "Paused.", type:'warning'}] : [...a.logs, {msg: "Agent Activated.", type:'info'}]
        } : a));
    };

    const togglePersistentMemory = (id) => {
        setAgents(prev => prev.map(a => a.id === id ? {
            ...a,
            persistentMemory: !a.persistentMemory,
            logs: [...a.logs, {msg: `Persistent Memory: ${!a.persistentMemory ? 'ENABLED' : 'DISABLED'}`, type: !a.persistentMemory ? 'info' : 'warning'}]
        } : a));
    };

    const getAgentDetail = () => agents.find(a => a.id === selectedAgentId);

    return (
        <>
            <style>{mobileStyles}</style>
            <div>
                <div className="header">
                    <Header />
                </div>
                <div className="main-page-body">
                    <SideNavs />
                    <div style={styles.app}>
                        <header style={styles.header}>
                            <div style={{fontSize: '18px', fontWeight: '800', color: THEME.primary, display:'flex', alignItems:'center', gap:'8px'}}>
                                <span>❄️</span> SnowAI <span style={{color:'#94a3b8', fontWeight: 400}}>Training Sim v2.0</span>
                            </div>
                            <div className="header-controls" style={{display:'flex', gap:'24px', alignItems:'center'}}>
                                <div style={{textAlign:'right'}}>
                                    <div style={styles.label}>{assetName} PRICE</div>
                                    <div style={{fontSize:'16px', fontWeight:'700', fontFamily:'monospace'}}>{fmt(assetPrice)}</div>
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
                                                        {agent.brain && <WeightsDisplay weights={agent.brain.weights} bias={agent.brain.bias} />}
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

                                            <div style={styles.cardFooter}>
                                                <button style={{...styles.btn, ...styles.btnSecondary, flex:1}} onClick={() => toggleAgent(agent.id)}>
                                                     {agent.isActive ? '⏸ PAUSE' : '▶ RESUME'}
                                                </button>
                                                {agent.brain && (
                                                     <button
                                                         style={{...styles.btn, ...styles.btnSecondary, flex:1, color: agent.persistentMemory ? THEME.primary : '#475569'}}
                                                         onClick={() => togglePersistentMemory(agent.id)}
                                                         title="Keeps brain weights on Reset"
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
            </div>
        </>
    );
}