import React, { useState, useEffect } from "react";
import Header from "./header";
import SideNavs from "./side_navs";

const styles = `
.sandbox-wrapper {
    padding: 20px;
    background: #f0f4ff;
    min-height: 100vh;
}

.sandbox-header {
    background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
    color: white;
    padding: 40px;
    border-radius: 16px;
    margin-bottom: 30px;
    box-shadow: 0 10px 40px rgba(59, 130, 246, 0.3);
}

.sandbox-header h1 {
    margin: 0 0 10px 0;
    font-size: 36px;
    font-weight: 700;
}

.sandbox-header p {
    margin: 0;
    font-size: 16px;
    line-height: 1.6;
    opacity: 0.95;
}

.sandbox-card {
    background: white;
    border-radius: 16px;
    padding: 30px;
    margin-bottom: 30px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    border: 2px solid #dbeafe;
}

.card-title {
    font-size: 20px;
    font-weight: 700;
    color: #1e40af;
    margin: 0 0 20px 0;
    display: flex;
    align-items: center;
    gap: 10px;
}

.upload-zone {
    border: 3px dashed #3b82f6;
    border-radius: 12px;
    padding: 40px;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s;
    background: #eff6ff;
}

.upload-zone:hover {
    border-color: #1e40af;
    background: #dbeafe;
    transform: translateY(-2px);
}

.upload-zone.dragging {
    border-color: #10b981;
    background: #d1fae5;
}

.upload-icon {
    font-size: 48px;
    margin-bottom: 16px;
}

.upload-text {
    color: #1e40af;
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 8px;
}

.upload-hint {
    color: #6b7280;
    font-size: 14px;
}

.file-input {
    display: none;
}

.uploaded-files {
    margin-top: 20px;
}

.file-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    background: #eff6ff;
    border-radius: 8px;
    margin-bottom: 10px;
    border: 1px solid #dbeafe;
}

.file-name {
    color: #1e40af;
    font-weight: 600;
    font-size: 14px;
}

.file-size {
    color: #6b7280;
    font-size: 12px;
    margin-left: 10px;
}

.remove-file-btn {
    background: #ef4444;
    color: white;
    border: none;
    padding: 6px 12px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 12px;
    font-weight: 600;
}

.config-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
}

.config-item {
    display: flex;
    flex-direction: column;
}

.config-label {
    color: #1e40af;
    font-weight: 600;
    font-size: 14px;
    margin-bottom: 8px;
}

.config-input,
.config-select {
    padding: 12px;
    border: 2px solid #dbeafe;
    border-radius: 8px;
    font-size: 14px;
    transition: all 0.2s;
}

.config-input:focus,
.config-select:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.button-group {
    display: flex;
    gap: 10px;
    margin-top: 20px;
}

.start-training-btn {
    flex: 1;
    padding: 16px;
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    color: white;
    border: none;
    border-radius: 12px;
    font-size: 18px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.3s;
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.start-training-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(16, 185, 129, 0.4);
}

.start-training-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.control-btn {
    padding: 16px 30px;
    border: none;
    border-radius: 12px;
    font-size: 16px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.3s;
    color: white;
}

.pause-btn {
    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
    box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
}

.resume-btn {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.checkpoint-btn {
    background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
}

.control-btn:hover:not(:disabled) {
    transform: translateY(-2px);
}

.control-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.training-progress {
    margin-top: 30px;
}

.progress-bar {
    width: 100%;
    height: 30px;
    background: #dbeafe;
    border-radius: 15px;
    overflow: hidden;
    position: relative;
}

.progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #3b82f6 0%, #10b981 100%);
    transition: width 0.5s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 700;
    font-size: 14px;
}

.training-status {
    margin-top: 20px;
    padding: 20px;
    background: #eff6ff;
    border-radius: 12px;
    border-left: 4px solid #3b82f6;
}

.training-status.paused {
    background: #fef3c7;
    border-left-color: #f59e0b;
}

.status-text {
    color: #1e40af;
    font-weight: 600;
    margin-bottom: 10px;
}

.live-metrics {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 15px;
    margin-top: 15px;
}

.metric-box {
    background: white;
    padding: 15px;
    border-radius: 8px;
    text-align: center;
    border: 1px solid #dbeafe;
}

.metric-label {
    font-size: 12px;
    color: #6b7280;
    margin-bottom: 5px;
}

.metric-value {
    font-size: 24px;
    font-weight: 700;
    color: #3b82f6;
}

.checkpoint-section {
    background: #f3f4f6;
    padding: 20px;
    border-radius: 12px;
    margin-top: 20px;
}

.checkpoint-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
}

.checkpoint-title {
    font-size: 16px;
    font-weight: 700;
    color: #1e40af;
}

.checkpoint-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.checkpoint-item {
    background: white;
    padding: 15px;
    border-radius: 8px;
    border: 1px solid #dbeafe;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.checkpoint-info {
    flex: 1;
}

.checkpoint-id {
    font-size: 12px;
    color: #6b7280;
    margin-bottom: 5px;
}

.checkpoint-details {
    font-size: 14px;
    color: #1e40af;
    font-weight: 600;
}

.load-checkpoint-btn {
    background: #3b82f6;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 600;
}

.results-section {
    margin-top: 30px;
}

.results-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
}

.result-card {
    background: white;
    padding: 25px;
    border-radius: 12px;
    border: 2px solid #dbeafe;
    transition: all 0.2s;
}

.result-card:hover {
    border-color: #3b82f6;
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(59, 130, 246, 0.2);
}

.result-rank {
    display: inline-block;
    padding: 6px 12px;
    background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
    color: white;
    border-radius: 20px;
    font-weight: 700;
    font-size: 14px;
    margin-bottom: 15px;
}

.result-function {
    font-size: 18px;
    font-weight: 700;
    color: #1e40af;
    margin-bottom: 10px;
}

.result-stats {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.stat-row {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
}

.stat-label {
    color: #6b7280;
}

.stat-value {
    font-weight: 700;
    color: #1e40af;
}

.stat-value.positive {
    color: #10b981;
}

.stat-value.negative {
    color: #ef4444;
}

.insights-section {
    background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
    padding: 25px;
    border-radius: 12px;
    margin-top: 20px;
}

.insight-title {
    font-size: 18px;
    font-weight: 700;
    color: #1e40af;
    margin-bottom: 15px;
}

.insight-item {
    padding: 12px;
    background: white;
    border-radius: 8px;
    margin-bottom: 10px;
    border-left: 4px solid #3b82f6;
}

.insight-text {
    color: #1e40af;
    font-size: 14px;
    line-height: 1.6;
}

.log-container {
    max-height: 300px;
    overflow-y: auto;
    background: #1e293b;
    color: #10b981;
    padding: 20px;
    border-radius: 12px;
    font-family: monospace;
    font-size: 13px;
    line-height: 1.8;
    margin-top: 20px;
}

.log-entry {
    margin-bottom: 8px;
}

.log-timestamp {
    color: #60a5fa;
    margin-right: 10px;
}

.alert-box {
    padding: 15px;
    border-radius: 8px;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 10px;
}

.alert-info {
    background: #dbeafe;
    color: #1e40af;
    border-left: 4px solid #3b82f6;
}

.alert-success {
    background: #d1fae5;
    color: #065f46;
    border-left: 4px solid #10b981;
}

@media (max-width: 768px) {
    .sandbox-wrapper {
        padding: 10px;
    }

    .sandbox-header {
        padding: 25px;
    }

    .sandbox-header h1 {
        font-size: 28px;
    }

    .sandbox-card {
        padding: 20px;
    }

    .config-grid {
        grid-template-columns: 1fr;
    }

    .results-grid {
        grid-template-columns: 1fr;
    }

    .live-metrics {
        grid-template-columns: repeat(2, 1fr);
    }

    .upload-zone {
        padding: 30px 20px;
    }

    .button-group {
        flex-direction: column;
    }
}
`;

export default function SnowAISandbox() {
    const baseUrl = 'https://backend-production-c0ab.up.railway.app';
    
    const [files, setFiles] = useState([]);
    const [dragging, setDragging] = useState(false);
    const [training, setTraining] = useState(false);
    const [paused, setPaused] = useState(false);
    const [progress, setProgress] = useState(0);
    const [currentStatus, setCurrentStatus] = useState('');
    const [sessionId, setSessionId] = useState(null);
    const [results, setResults] = useState(null);
    const [logs, setLogs] = useState([]);
    const [currentIteration, setCurrentIteration] = useState(0);
    const [canCheckpoint, setCanCheckpoint] = useState(false);
    const [checkpoints, setCheckpoints] = useState([]);
    const [selectedCheckpoint, setSelectedCheckpoint] = useState(null);
    
    const [config, setConfig] = useState({
        initial_equity: 10000,
        max_iterations: 100,
        population_size: 20,
        take_profit: 4,
        stop_loss: 2,
    });

    useEffect(() => {
        loadCheckpoints();
    }, []);

    const loadCheckpoints = async () => {
        try {
            const response = await fetch(`${baseUrl}/api/snowai-sandbox/checkpoints/`);
            const data = await response.json();
            if (data.checkpoints) {
                setCheckpoints(data.checkpoints);
            }
        } catch (error) {
            console.error('Error loading checkpoints:', error);
        }
    };

    const handleDragEnter = (e) => {
        e.preventDefault();
        setDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragging(false);
        
        const droppedFiles = Array.from(e.dataTransfer.files);
        handleFiles(droppedFiles);
    };

    const handleFileInput = (e) => {
        const selectedFiles = Array.from(e.target.files);
        handleFiles(selectedFiles);
    };

    const handleFiles = (newFiles) => {
        const csvFiles = newFiles.filter(f => 
            f.name.endsWith('.csv') || 
            f.type === 'text/csv' || 
            f.type === 'application/vnd.ms-excel'
        );
        
        if (csvFiles.length === 0) {
            alert('Please upload CSV files only');
            return;
        }
        
        setFiles(prev => [...prev, ...csvFiles]);
    };

    const removeFile = (index) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    const startTraining = async (checkpointId = null) => {
        if (files.length === 0 && !checkpointId) {
            alert('Please upload at least one CSV file or select a checkpoint');
            return;
        }

        setTraining(true);
        setPaused(false);
        setProgress(0);
        setLogs([]);
        setResults(null);
        addLog('🚀 Initializing SnowAI Sandbox...');

        const formData = new FormData();
        files.forEach(file => {
            formData.append('files', file);
        });
        formData.append('config', JSON.stringify(config));
        
        if (checkpointId) {
            formData.append('checkpoint_id', checkpointId);
            addLog(`📦 Loading checkpoint: ${checkpointId.substring(0, 8)}...`);
        }

        try {
            const response = await fetch(`${baseUrl}/api/snowai-sandbox/train/`, {
                method: 'POST',
                body: formData
            });

            const data = await response.json();
            
            if (data.session_id) {
                setSessionId(data.session_id);
                addLog('✅ Training session started');
                pollTrainingStatus(data.session_id);
            } else {
                addLog('❌ Error: ' + (data.error || 'Failed to start training'));
                setTraining(false);
            }
        } catch (error) {
            addLog('❌ Error: ' + error.message);
            setTraining(false);
        }
    };

    const pauseTraining = async () => {
        if (!sessionId) return;

        try {
            const response = await fetch(`${baseUrl}/api/snowai-sandbox/pause/${sessionId}/`, {
                method: 'POST'
            });
            const data = await response.json();
            
            if (data.message) {
                setPaused(true);
                addLog('⏸️ Training paused');
            }
        } catch (error) {
            addLog('❌ Error pausing: ' + error.message);
        }
    };

    const resumeTraining = async () => {
        if (!sessionId) return;

        try {
            const response = await fetch(`${baseUrl}/api/snowai-sandbox/resume/${sessionId}/`, {
                method: 'POST'
            });
            const data = await response.json();
            
            if (data.message) {
                setPaused(false);
                addLog('▶️ Training resumed');
            }
        } catch (error) {
            addLog('❌ Error resuming: ' + error.message);
        }
    };

    const saveCheckpoint = async () => {
        if (!sessionId) return;

        try {
            const response = await fetch(`${baseUrl}/api/snowai-sandbox/checkpoint/${sessionId}/`, {
                method: 'POST'
            });
            const data = await response.json();
            
            if (data.checkpoint_id) {
                addLog(`💾 Checkpoint saved: ${data.checkpoint_id.substring(0, 8)}...`);
                loadCheckpoints();
            }
        } catch (error) {
            addLog('❌ Error saving checkpoint: ' + error.message);
        }
    };

    const pollTrainingStatus = async (id) => {
        const interval = setInterval(async () => {
            try {
                const response = await fetch(`${baseUrl}/api/snowai-sandbox/status/${id}/`);
                const data = await response.json();

                setProgress(data.progress || 0);
                setCurrentStatus(data.status || '');
                setCurrentIteration(data.current_iteration || 0);
                setCanCheckpoint(data.can_checkpoint || false);
                setPaused(data.paused || false);
                
                // Add new logs from backend (backend only sends new ones)
                if (data.logs && data.logs.length > 0) {
                    data.logs.forEach(log => {
                        addLog(log);
                    });
                }

                if (data.completed) {
                    clearInterval(interval);
                    setTraining(false);
                    setResults(data.results);
                    addLog('🎉 Training completed!');
                }

                if (data.error) {
                    clearInterval(interval);
                    setTraining(false);
                    addLog('❌ Error: ' + data.error);
                }
            } catch (error) {
                console.error('Polling error:', error);
            }
        }, 1000); // Poll every 1 second for faster updates
    };

    const addLog = (message) => {
        const timestamp = new Date().toLocaleTimeString();
        setLogs(prev => [...prev, { timestamp, message }]);
    };

    const formatBytes = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    };

    return (
        <div>
            <style>{styles}</style>
            <div className="header">
                <Header />
            </div>
            <div className="main-page-body">
                <SideNavs />
                <div className="main-body-info">
                    <div className="sandbox-wrapper">
                        
                        <div className="sandbox-header">
                            <h1>❄️ SnowAI Sandbox</h1>
                            <p>Upload your market data and let AI discover the best trading function combinations through evolutionary learning</p>
                        </div>

                        {/* Checkpoint Section */}
                        {checkpoints.length > 0 && (
                            <div className="sandbox-card">
                                <h2 className="card-title">💾 Load Previous Training</h2>
                                <div className="alert-box alert-info">
                                    <span>ℹ️</span>
                                    <span>Resume training from a saved checkpoint with new data or continue where you left off</span>
                                </div>
                                <div className="checkpoint-list">
                                    {checkpoints.map((checkpoint, idx) => (
                                        <div key={idx} className="checkpoint-item">
                                            <div className="checkpoint-info">
                                                <div className="checkpoint-id">ID: {checkpoint.id.substring(0, 16)}...</div>
                                                <div className="checkpoint-details">
                                                    Iteration: {checkpoint.iteration} | Population: {checkpoint.population_size} | 
                                                    TP: {checkpoint.config.take_profit}% | SL: {checkpoint.config.stop_loss}%
                                                </div>
                                            </div>
                                            <button 
                                                className="load-checkpoint-btn"
                                                onClick={() => startTraining(checkpoint.id)}
                                                disabled={training}
                                            >
                                                Load & Continue
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* File Upload */}
                        <div className="sandbox-card">
                            <h2 className="card-title">📁 Upload Training Data</h2>
                            <div 
                                className={`upload-zone ${dragging ? 'dragging' : ''}`}
                                onDragEnter={handleDragEnter}
                                onDragOver={handleDragEnter}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                onClick={() => document.getElementById('file-input').click()}
                            >
                                <div className="upload-icon">📊</div>
                                <div className="upload-text">Drop CSV files here or click to browse</div>
                                <div className="upload-hint">Support for multiple files • OHLCV format preferred</div>
                            </div>
                            <input
                                id="file-input"
                                type="file"
                                className="file-input"
                                multiple
                                accept=".csv"
                                onChange={handleFileInput}
                            />

                            {files.length > 0 && (
                                <div className="uploaded-files">
                                    {files.map((file, index) => (
                                        <div key={index} className="file-item">
                                            <div>
                                                <span className="file-name">{file.name}</span>
                                                <span className="file-size">({formatBytes(file.size)})</span>
                                            </div>
                                            <button 
                                                className="remove-file-btn"
                                                onClick={() => removeFile(index)}
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Configuration */}
                        <div className="sandbox-card">
                            <h2 className="card-title">⚙️ Training Configuration</h2>
                            <div className="config-grid">
                                <div className="config-item">
                                    <label className="config-label">Initial Equity ($)</label>
                                    <input
                                        type="number"
                                        className="config-input"
                                        value={config.initial_equity}
                                        onChange={(e) => setConfig({...config, initial_equity: parseFloat(e.target.value)})}
                                    />
                                </div>
                                <div className="config-item">
                                    <label className="config-label">Max Iterations</label>
                                    <input
                                        type="number"
                                        className="config-input"
                                        value={config.max_iterations}
                                        onChange={(e) => setConfig({...config, max_iterations: parseInt(e.target.value)})}
                                    />
                                </div>
                                <div className="config-item">
                                    <label className="config-label">Population Size</label>
                                    <input
                                        type="number"
                                        className="config-input"
                                        value={config.population_size}
                                        onChange={(e) => setConfig({...config, population_size: parseInt(e.target.value)})}
                                    />
                                </div>
                                <div className="config-item">
                                    <label className="config-label">Take Profit (%)</label>
                                    <input
                                        type="number"
                                        className="config-input"
                                        value={config.take_profit}
                                        onChange={(e) => setConfig({...config, take_profit: parseFloat(e.target.value)})}
                                    />
                                </div>
                                <div className="config-item">
                                    <label className="config-label">Stop Loss (%)</label>
                                    <input
                                        type="number"
                                        className="config-input"
                                        value={config.stop_loss}
                                        onChange={(e) => setConfig({...config, stop_loss: parseFloat(e.target.value)})}
                                    />
                                </div>
                            </div>

                            <div className="button-group">
                                <button 
                                    className="start-training-btn"
                                    onClick={() => startTraining()}
                                    disabled={training || files.length === 0}
                                >
                                    {training ? '🔄 Training in Progress...' : '🚀 Start AI Training'}
                                </button>
                            </div>
                        </div>

                        {/* Training Controls */}
                        {training && (
                            <div className="sandbox-card">
                                <h2 className="card-title">🎮 Training Controls</h2>
                                <div className="button-group">
                                    {!paused ? (
                                        <button 
                                            className="control-btn pause-btn"
                                            onClick={pauseTraining}
                                        >
                                            ⏸️ Pause Training
                                        </button>
                                    ) : (
                                        <button 
                                            className="control-btn resume-btn"
                                            onClick={resumeTraining}
                                        >
                                            ▶️ Resume Training
                                        </button>
                                    )}
                                    <button 
                                        className="control-btn checkpoint-btn"
                                        onClick={saveCheckpoint}
                                        disabled={!canCheckpoint}
                                    >
                                        💾 Save Checkpoint
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Training Progress */}
                        {training && (
                            <div className="sandbox-card">
                                <h2 className="card-title">📊 Training Progress</h2>
                                <div className="training-progress">
                                    <div className="progress-bar">
                                        <div className="progress-fill" style={{width: `${progress}%`}}>
                                            {progress}%
                                        </div>
                                    </div>

                                    <div className={`training-status ${paused ? 'paused' : ''}`}>
                                        <div className="status-text">
                                            {paused ? '⏸️ PAUSED' : currentStatus}
                                        </div>
                                        <div className="live-metrics">
                                            <div className="metric-box">
                                                <div className="metric-label">Iteration</div>
                                                <div className="metric-value">{currentIteration}</div>
                                            </div>
                                            <div className="metric-box">
                                                <div className="metric-label">Files</div>
                                                <div className="metric-value">{files.length}</div>
                                            </div>
                                            <div className="metric-box">
                                                <div className="metric-label">Status</div>
                                                <div className="metric-value" style={{fontSize: '16px'}}>
                                                    {paused ? '⏸️' : '▶️'}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Live Logs */}
                                <div className="log-container">
                                    {logs.map((log, index) => (
                                        <div key={index} className="log-entry">
                                            <span className="log-timestamp">[{log.timestamp}]</span>
                                            <span>{log.message}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Results */}
                        {results && (
                            <>
                                <div className="sandbox-card">
                                    <div className="alert-box alert-success">
                                        <span>✅</span>
                                        <span>Training completed! You can save a checkpoint to resume with different data later.</span>
                                    </div>
                                    <h2 className="card-title">🏆 Top Performing Strategies</h2>
                                    <div className="results-grid">
                                        {results.top_strategies?.map((strategy, index) => (
                                            <div key={index} className="result-card">
                                                <span className="result-rank">#{index + 1}</span>
                                                <div className="result-function">{strategy.functions.join(' + ')}</div>
                                                <div className="result-stats">
                                                    <div className="stat-row">
                                                        <span className="stat-label">Win Rate:</span>
                                                        <span className={`stat-value ${strategy.win_rate >= 50 ? 'positive' : 'negative'}`}>
                                                            {strategy.win_rate.toFixed(1)}%
                                                        </span>
                                                    </div>
                                                    <div className="stat-row">
                                                        <span className="stat-label">Total P&L:</span>
                                                        <span className={`stat-value ${strategy.total_pnl >= 0 ? 'positive' : 'negative'}`}>
                                                            ${strategy.total_pnl.toFixed(2)}
                                                        </span>
                                                    </div>
                                                    <div className="stat-row">
                                                        <span className="stat-label">Trades:</span>
                                                        <span className="stat-value">{strategy.total_trades}</span>
                                                    </div>
                                                    <div className="stat-row">
                                                        <span className="stat-label">Fitness:</span>
                                                        <span className="stat-value">{strategy.fitness.toFixed(2)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="sandbox-card">
                                    <h2 className="card-title">💡 AI Insights</h2>
                                    <div className="insights-section">
                                        <div className="insight-title">What the AI Learned:</div>
                                        {results.insights?.map((insight, index) => (
                                            <div key={index} className="insight-item">
                                                <div className="insight-text">{insight}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
}
