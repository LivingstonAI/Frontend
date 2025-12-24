import React, { useState, useEffect, useRef } from 'react';
import { AreaChart, Area, ResponsiveContainer, YAxis, XAxis, CartesianGrid, ReferenceLine } from 'recharts';
import { Wifi, Zap, Activity, BrainCircuit, Terminal, Power, ChevronDown, ChevronUp, Cpu, ShieldCheck, HelpCircle, X } from 'lucide-react';
import Header from "./header";
import SideNavs from "./side_navs";

const NeuroLink = () => {
  // --- STATE MANAGEMENT ---
  const [status, setStatus] = useState('DISCONNECTED'); // DISCONNECTED, SYNCING, ONLINE
  const [brainData, setBrainData] = useState([]);
  const [logs, setLogs] = useState([]);
  const [battery, setBattery] = useState(100);
  const [isTerminalOpen, setIsTerminalOpen] = useState(true);
  const [showModal, setShowModal] = useState(false); // New: Modal State
  
  // Refs
  const serverTimerRef = useRef(null);
  const streamRef = useRef(null);

  // --- CONFIG ---
  // Change this to your live backend URL when deploying
  const BACKEND_URL = "http://backend-production-c0ab.up.railway.app";

  // --- 1. CONNECTION LOGIC ---
  const connectToGauntlet = () => {
    setStatus('SYNCING');
    addLog('System', 'Initializing BCI Handshake...');
    
    // Simulate Bluetooth discovery delay
    setTimeout(() => {
      addLog('Gauntlet', 'Device Found: Neural-Link MK-IV');
    }, 800);

    // Simulate Secure Handshake
    setTimeout(() => {
      setStatus('ONLINE');
      addLog('System', 'Connection Established [Secure]');
      addLog('SnowAI', 'Neural Engine Active. Awaiting intent.');
    }, 2000);
  };

  const disconnect = () => {
    setStatus('DISCONNECTED');
    setBrainData([]);
    clearInterval(streamRef.current);
    addLog('System', 'Link Severed.');
  };

  // --- 2. ADVANCED NEURAL STREAM SIMULATION ---
  useEffect(() => {
    if (status !== 'ONLINE') return;

    streamRef.current = setInterval(() => {
      setBrainData(prev => {
        const time = Date.now();
        // Generate organic-looking Alpha/Beta waves using Sine waves + Noise
        const baseAlpha = 0.2 + (Math.sin(time / 500) * 0.1) + (Math.random() * 0.1);
        const baseBeta = 0.4 + (Math.sin(time / 200) * 0.2) + (Math.random() * 0.3);
        
        const newData = [...prev, { time, alpha: baseAlpha, beta: baseBeta }];
        
        // Keep buffer size manageable (50 points)
        if (newData.length > 50) newData.shift(); 
        return newData;
      });

      // Battery drain simulation
      if (Math.random() > 0.99) setBattery(b => Math.max(0, b - 1));

      // INTENT DETECTION TRIGGER (Simulation)
      // In reality, this would check if beta > threshold for X seconds
      const focusSpike = Math.random();
      if (focusSpike > 0.985) {
        triggerNeuralCommand();
      }

    }, 80); // 12.5Hz Refresh Rate

    return () => clearInterval(streamRef.current);
  }, [status]);

  // --- 3. COMMAND EXECUTION (LIVE FETCH) ---
  const triggerNeuralCommand = async () => {
    const commands = ["EXECUTE_HEDGE_STRATEGY", "SCAN_MARKET_VOLATILITY", "OPTIMIZE_LATENCY", "DEPLOY_SMART_CONTRACT"];
    const randomCmd = commands[Math.floor(Math.random() * commands.length)];
    
    addLog('Mind', `Intent Detected: ${randomCmd}`);

    try {
      // API Call to your Railway Backend
      const response = await fetch(`${BACKEND_URL}/snow-ai/neuro-command/receive/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // No CSRF token needed since endpoint is exempt
        },
        body: JSON.stringify({
          command_signature: randomCmd,
          neural_fidelity: 0.98,
          timestamp: Date.now()
        })
      });

      if (response.ok) {
        const data = await response.json();
        addLog('SnowAI', `Executed: ${data.message} [ACK]`);
      } else {
        // Fallback simulation if backend is offline or cors fails during dev
        console.warn("Backend unreachable, running simulation mode.");
        addLog('SnowAI', `Simulated Execution: ${randomCmd} [ACK]`);
      }
    } catch (error) {
      addLog('SnowAI', `Offline Mode: ${randomCmd} [ACK]`);
    }
  };

  const addLog = (source, message) => {
    const timestamp = new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute:'2-digit', second:'2-digit' });
    setLogs(prev => [{ source, message, timestamp }, ...prev].slice(0, 15));
  };

  // --- RENDER ---
  return (
     <div>
            <div className="header">
                <Header />
            </div>
            <div className="main-page-body">
                <SideNavs />
    <div style={styles.container}>
      
      {/* Top Bar */}
      <div style={styles.header}>
        <div style={styles.brandGroup}>
          <div style={styles.iconCircle}>
            <BrainCircuit size={20} color="#fff" />
          </div>
          <div>
            <h1 style={styles.title}>SNOWAI <span style={{color: '#3b82f6'}}>NEURO</span></h1>
            <div style={styles.subHeaderRow}>
               <Cpu size={10} color="#64748b" />
               <p style={styles.subtitle}>KERNEL v2.5.0-STABLE</p>
            </div>
          </div>
        </div>
        
        <div style={styles.statusGroup}>
          <div 
            onClick={() => setShowModal(true)}
            style={styles.helpButton}
            title="System Manual"
          >
            <HelpCircle size={18} color="#64748b" />
          </div>
          <div style={{
            ...styles.badge,
            backgroundColor: status === 'ONLINE' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(100, 116, 139, 0.1)',
            color: status === 'ONLINE' ? '#3b82f6' : '#64748b',
          }}>
            <Activity size={12} className={status === 'ONLINE' ? 'animate-pulse' : ''} />
            <span style={styles.badgeText}>{status}</span>
          </div>
          {status === 'ONLINE' && (
             <div style={styles.batteryContainer}>
               <span style={styles.batteryText}>{battery}%</span>
               <div style={styles.batteryBorder}>
                 <div style={{...styles.batteryFill, width: `${battery}%`}} />
               </div>
             </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.main}>
        {status === 'DISCONNECTED' ? (
          <div style={styles.connectOverlay}>
            <div style={styles.connectCard}>
              <div style={styles.pulseIconContainer}>
                <Power size={32} color="#3b82f6" />
              </div>
              <h3 style={styles.connectTitle}>Neural Link Severed</h3>
              <p style={styles.connectText}>Awaiting secure handshake with gauntlet interface.</p>
              <button onClick={connectToGauntlet} style={styles.primaryButton}>
                INITIALIZE LINK
              </button>
            </div>
          </div>
        ) : (
          <div style={styles.dashboard}>
            {/* Graph Card */}
            <div style={styles.graphCard}>
              <div style={styles.cardHeader}>
                <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                  <div style={styles.liveDot} />
                  <span style={styles.cardLabel}>LIVE NEURAL TELEMETRY</span>
                </div>
                <div style={{display: 'flex', gap: '12px'}}>
                  <span style={{...styles.legendItem, color: '#3b82f6'}}>● BETA (ACTION)</span>
                  <span style={{...styles.legendItem, color: '#93c5fd'}}>● ALPHA (REST)</span>
                </div>
              </div>

              <div style={{width: '100%', height: '240px', marginTop: '10px'}}>
                <ResponsiveContainer>
                  <AreaChart data={brainData}>
                    <defs>
                      <linearGradient id="colorBeta" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorAlpha" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#93c5fd" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#93c5fd" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <YAxis hide domain={[0, 1.2]} />
                    <ReferenceLine y={0.8} stroke="#3b82f6" strokeDasharray="3 3" label={{ position: 'right', value: 'TRIGGER', fill: '#3b82f6', fontSize: 10 }} />
                    <Area type="monotone" dataKey="beta" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorBeta)" isAnimationActive={false} />
                    <Area type="monotone" dataKey="alpha" stroke="#93c5fd" strokeWidth={1.5} fillOpacity={1} fill="url(#colorAlpha)" isAnimationActive={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              
              <div style={styles.telemetryGrid}>
                <div style={styles.telemetryItem}>
                  <span style={styles.telemetryLabel}>INTENT INDEX</span>
                  <span style={styles.telemetryValue}>{brainData.length ? (brainData[brainData.length-1].beta * 100).toFixed(1) : "0.0"}</span>
                </div>
                <div style={styles.telemetryItem}>
                  <span style={styles.telemetryLabel}>STABILITY</span>
                  <div style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
                    <ShieldCheck size={14} color="#10b981" />
                    <span style={{...styles.telemetryValue, color: '#10b981'}}>99.2%</span>
                  </div>
                </div>
                <div style={styles.telemetryItem}>
                  <span style={styles.telemetryLabel}>LATENCY</span>
                  <span style={{...styles.telemetryValue, color: '#64748b'}}>08ms</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Toggleable Terminal */}
      <div style={{...styles.terminal, height: isTerminalOpen ? '360px' : '44px'}}>
        <div style={styles.terminalHeader} onClick={() => setIsTerminalOpen(!isTerminalOpen)}>
          <div style={{display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer'}}>
            <Terminal size={14} color="#3b82f6" />
            <span style={styles.terminalTitle}>NEURAL_SYSTEM_LOGS</span>
            {isTerminalOpen ? <ChevronDown size={14} color="#475569" /> : <ChevronUp size={14} color="#475569" />}
          </div>
          {status === 'ONLINE' && isTerminalOpen && (
            <button onClick={(e) => { e.stopPropagation(); disconnect(); }} style={styles.killButton}>
              TERMINATE_STREAM
            </button>
          )}
        </div>
        
        {isTerminalOpen && (
          <div style={styles.logContainer}>
            {logs.map((log, i) => (
              <div key={i} style={styles.logEntry}>
                <span style={styles.timestamp}>{log.timestamp}</span>
                <span style={{color: log.source === 'Mind' ? '#3b82f6' : log.source === 'SnowAI' ? '#10b981' : '#64748b', fontWeight: '700', marginRight: '8px', width: '65px'}}>{log.source.toUpperCase()}</span>
                <span style={{color: '#94a3b8'}}>{log.message}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* EXPLANATION MODAL */}
      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                <BrainCircuit size={24} color="#2563eb" />
                <h2 style={styles.modalTitle}>SnowAI Neuro-Link Manual</h2>
              </div>
              <button onClick={() => setShowModal(false)} style={styles.closeButton}>
                <X size={20} color="#64748b" />
              </button>
            </div>
            
            <div style={styles.modalBody}>
              <section style={styles.modalSection}>
                <h3 style={styles.modalSectionTitle}>1. System Overview</h3>
                <p style={styles.modalText}>
                  This component is a <strong>High-Fidelity BCI Simulation Dashboard</strong>. It visualizes two key neural metrics:
                </p>
                <ul style={styles.modalList}>
                  <li><strong>Beta Waves (Dark Blue):</strong> Represents active thought, focus, and intent.</li>
                  <li><strong>Alpha Waves (Light Blue):</strong> Represents relaxation and passive state.</li>
                </ul>
              </section>

              <section style={styles.modalSection}>
                <h3 style={styles.modalSectionTitle}>2. How It Works (Simulation)</h3>
                <p style={styles.modalText}>
                  Currently running in <strong>Prototype Mode</strong>.
                  The <code>useEffect</code> hook generates organic sine-wave data to mimic an EEG stream.
                  Every ~100ms, the system runs a probability check (<code>Math.random &gt; 0.985</code>) to simulate you "thinking" a command.
                </p>
              </section>

              <section style={styles.modalSection}>
                <h3 style={styles.modalSectionTitle}>3. Integration Guide</h3>
                <p style={styles.modalText}>
                  To use this with real hardware (OpenBCI/Muse):
                </p>
                <ol style={styles.modalList}>
                  <li>Install <strong>bci.js</strong> or connect to a local Python stream via WebSockets.</li>
                  <li>Replace the <code>setInterval</code> logic with a WebSocket listener.</li>
                  <li>Update <code>BACKEND_URL</code> to point to your Django server: 
                    <br/><code style={styles.codeBlock}>http://backend-production-c0ab.up.railway.app</code>
                  </li>
                  <li>Ensure your Django view <code>receive_sovereign_neuro_command_v1</code> is active and <code>csrf_exempt</code>.</li>
                </ol>
              </section>
            </div>
            
            <div style={styles.modalFooter}>
              <button onClick={() => setShowModal(false)} style={styles.primaryButtonSmall}>
                ACKNOWLEDGE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
        </div>
        </div>
  );
              
};

// --- STYLES ---
const styles = {
  container: { display: 'flex', flexDirection: 'column', height: '100vh', width: '100%', backgroundColor: '#fff', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif', overflow: 'hidden', color: '#1e293b' },
  header: { padding: '16px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff' },
  iconCircle: { width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)' },
  brandGroup: { display: 'flex', alignItems: 'center', gap: '12px' },
  subHeaderRow: { display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' },
  title: { fontSize: '16px', fontWeight: '900', margin: 0, letterSpacing: '1px', lineHeight: '1' },
  subtitle: { fontSize: '9px', color: '#94a3b8', margin: 0, fontWeight: '700', letterSpacing: '0.5px' },
  statusGroup: { display: 'flex', alignItems: 'center', gap: '16px' },
  badge: { display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '6px' },
  badgeText: { fontSize: '10px', fontWeight: '800', letterSpacing: '0.5px' },
  batteryContainer: { display: 'flex', alignItems: 'center', gap: '8px' },
  batteryText: { fontSize: '10px', fontWeight: '700', color: '#64748b' },
  batteryBorder: { width: '30px', height: '14px', border: '1.5px solid #e2e8f0', borderRadius: '3px', padding: '1px' },
  batteryFill: { height: '100%', backgroundColor: '#10b981', borderRadius: '1px' },
  helpButton: { cursor: 'pointer', padding: '8px', borderRadius: '50%', backgroundColor: '#f8fafc', transition: 'background 0.2s' },
  
  main: { flex: 1, backgroundColor: '#f8fafc', position: 'relative' },
  connectOverlay: { height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' },
  connectCard: { textAlign: 'center', maxWidth: '360px' },
  pulseIconContainer: { width: '80px', height: '80px', borderRadius: '40px', backgroundColor: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px auto' },
  connectTitle: { fontSize: '22px', fontWeight: '800', color: '#0f172a', marginBottom: '8px' },
  connectText: { fontSize: '14px', color: '#64748b', lineHeight: '1.6', marginBottom: '32px' },
  primaryButton: { backgroundColor: '#3b82f6', color: '#fff', border: 'none', padding: '16px 40px', borderRadius: '12px', fontSize: '13px', fontWeight: '800', letterSpacing: '1px', cursor: 'pointer', boxShadow: '0 8px 24px rgba(59, 130, 246, 0.25)' },
  
  dashboard: { padding: '20px' },
  graphCard: { backgroundColor: '#fff', borderRadius: '20px', padding: '24px', border: '1px solid #f1f5f9', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  liveDot: { width: '8px', height: '8px', backgroundColor: '#ef4444', borderRadius: '50%', boxShadow: '0 0 8px #ef4444' },
  cardLabel: { fontSize: '11px', fontWeight: '800', color: '#475569', letterSpacing: '0.5px' },
  legendItem: { fontSize: '9px', fontWeight: '800' },
  telemetryGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px', marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #f1f5f9' },
  telemetryItem: { display: 'flex', flexDirection: 'column', gap: '4px' },
  telemetryLabel: { fontSize: '10px', fontWeight: '700', color: '#94a3b8', letterSpacing: '0.5px' },
  telemetryValue: { fontSize: '24px', fontWeight: '900', color: '#1e293b', fontFamily: 'monospace' },
  
  terminal: { backgroundColor: '#fff', borderTop: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', transition: 'height 0.3s cubic-bezier(0.4, 0, 0.2, 1)' },
  terminalHeader: { padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9' },
  terminalTitle: { fontSize: '10px', fontWeight: '800', color: '#475569', letterSpacing: '1px' },
  killButton: { backgroundColor: 'transparent', border: '1px solid #fee2e2', color: '#ef4444', fontSize: '9px', fontWeight: '800', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer' },
  logContainer: { flex: 1, padding: '16px 20px', overflowY: 'auto', backgroundColor: '#fafafa' },
  logEntry: { fontSize: '12px', fontFamily: 'monospace', marginBottom: '6px', display: 'flex' },
  timestamp: { color: '#cbd5e1', marginRight: '12px', fontSize: '11px' },

  // MODAL STYLES
  modalOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 },
  modalContent: { backgroundColor: '#fff', width: '90%', maxWidth: '500px', borderRadius: '24px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', overflow: 'hidden' },
  modalHeader: { padding: '20px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  modalTitle: { fontSize: '18px', fontWeight: '800', color: '#0f172a', margin: 0 },
  closeButton: { background: 'none', border: 'none', cursor: 'pointer', padding: '4px' },
  modalBody: { padding: '24px', maxHeight: '60vh', overflowY: 'auto' },
  modalSection: { marginBottom: '24px' },
  modalSectionTitle: { fontSize: '14px', fontWeight: '700', color: '#334155', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' },
  modalText: { fontSize: '14px', lineHeight: '1.6', color: '#64748b', margin: '0 0 12px 0' },
  modalList: { paddingLeft: '20px', margin: 0, fontSize: '14px', color: '#64748b', lineHeight: '1.6' },
  codeBlock: { backgroundColor: '#f1f5f9', padding: '4px 8px', borderRadius: '4px', fontFamily: 'monospace', fontSize: '12px', color: '#0f172a' },
  modalFooter: { padding: '16px 24px', backgroundColor: '#f8fafc', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'flex-end' },
  primaryButtonSmall: { backgroundColor: '#3b82f6', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' },
};

export default NeuroLink;
