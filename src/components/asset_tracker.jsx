import React, { useState, useEffect, useRef } from "react";
import { FaPlus, FaTrash, FaSync, FaChartLine, FaVolumeUp, FaVolumeMute, FaClock } from 'react-icons/fa';

// AssetTracker component with improved styling and UX plus voice timer
const AssetTracker = () => {
  const [assets, setAssets] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState("");
  const [actionStatus, setActionStatus] = useState({ type: "", message: "" });
  const [currentAction, setCurrentAction] = useState("");
  const [processingId, setProcessingId] = useState(null);
  
  // Voice timer states
  const [voiceTimer, setVoiceTimer] = useState({
    isActive: false,
    minutes: 5,
    timeLeft: 0
  });
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [tempMinutes, setTempMinutes] = useState(5);
  
  const timerRef = useRef(null);
  const countdownRef = useRef(null);
  const baseURL = 'https://backend-production-c0ab.up.railway.app';

  // Common currency pairs
  const availableCurrencyPairs = [
    'EURUSD', 'GBPUSD', 'USDJPY', 'USDCHF', 'AUDUSD', 'USDCAD', 
    'NZDUSD', 'EURJPY', 'EURGBP', 'EURCHF', 'GBPJPY', 'GBPCHF',
    'AUDJPY', 'CADJPY', 'NZDJPY', 'EURAUD', 'EURCAD'
  ];

  // Voice reading function
  const readAssetPrices = () => {
    if (assets.length === 0) {
      const utterance = new SpeechSynthesisUtterance("No assets are currently being tracked.");
      setVoiceSettings(utterance);
      window.speechSynthesis.speak(utterance);
      return;
    }

    let announcement = "Asset price update: ";
    assets.forEach((asset, index) => {
      const changeDirection = asset.percent_change > 0 ? "up" : asset.percent_change < 0 ? "down" : "unchanged";
      const changeValue = Math.abs(asset.percent_change);
      
      announcement += `${asset.asset} is ${changeDirection} ${changeValue} percent`;
      
      if (index < assets.length - 1) {
        announcement += ", ";
      }
    });

    const utterance = new SpeechSynthesisUtterance(announcement);
    setVoiceSettings(utterance);
    window.speechSynthesis.speak(utterance);
  };

  // Set voice settings
  const setVoiceSettings = (utterance) => {
    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find(voice => 
      voice.lang.startsWith('en') && voice.name.includes('Natural')
    ) || voices.find(voice => voice.lang.startsWith('en')) || voices[0];
    
    if (englishVoice) {
      utterance.voice = englishVoice;
    }
    
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 0.8;
  };

  // Start voice timer
  const startVoiceTimer = () => {
    if (assets.length === 0) {
      setActionStatus({ type: "warning", message: "Add assets to track before starting voice timer" });
      setTimeout(() => setActionStatus({ type: "", message: "" }), 3000);
      return;
    }

    setVoiceTimer({
      isActive: true,
      minutes: tempMinutes,
      timeLeft: tempMinutes * 60
    });

    // Read prices immediately
    readAssetPrices();

    // Set up recurring timer
    timerRef.current = setInterval(() => {
      fetchAssetUpdates();
      setTimeout(() => {
        readAssetPrices();
      }, 2000); // Wait 2 seconds after fetch to ensure data is updated
    }, tempMinutes * 60 * 1000);

    // Set up countdown timer
    countdownRef.current = setInterval(() => {
      setVoiceTimer(prev => ({
        ...prev,
        timeLeft: prev.timeLeft - 1
      }));
    }, 1000);

    setIsVoiceModalOpen(false);
    setActionStatus({ type: "success", message: `Voice timer started for ${tempMinutes} minutes` });
    setTimeout(() => setActionStatus({ type: "", message: "" }), 3000);
  };

  // Stop voice timer
  const stopVoiceTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }
    
    setVoiceTimer({
      isActive: false,
      minutes: 5,
      timeLeft: 0
    });

    // Stop any ongoing speech
    window.speechSynthesis.cancel();

    setActionStatus({ type: "info", message: "Voice timer stopped" });
    setTimeout(() => setActionStatus({ type: "", message: "" }), 2000);
  };

  // Reset countdown when it reaches 0
  useEffect(() => {
    if (voiceTimer.timeLeft <= 0 && voiceTimer.isActive) {
      setVoiceTimer(prev => ({
        ...prev,
        timeLeft: prev.minutes * 60
      }));
    }
  }, [voiceTimer.timeLeft, voiceTimer.isActive]);

  // Format time display
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Fetch tracked assets from backend
  const fetchAssets = async () => {
    setIsLoading(true);
    setCurrentAction("loading");
    try {
      const response = await fetch(`${baseURL}/get-tracked-assets/`);
      if (response.ok) {
        const data = await response.json();
        setAssets(data);
        setActionStatus({ type: "success", message: "Assets loaded" });
        setTimeout(() => setActionStatus({ type: "", message: "" }), 2000);
      } else {
        console.error("Failed to fetch assets");
        setActionStatus({ type: "error", message: "Failed to load assets" });
      }
    } catch (error) {
      console.error("Error fetching assets:", error);
      setActionStatus({ type: "error", message: "Network error" });
    } finally {
      setIsLoading(false);
      setCurrentAction("");
    }
  };

  // Fetch asset updates
  const fetchAssetUpdates = async () => {
    setCurrentAction("refreshing");
    setActionStatus({ type: "info", message: "Refreshing..." });
    try {
      const response = await fetch(`${baseURL}/fetch-asset-update/`);
      if (response.ok) {
        const data = await response.json();
        setAssets(data);
        setActionStatus({ type: "success", message: "Refresh complete" });
        setTimeout(() => setActionStatus({ type: "", message: "" }), 2000);
      } else {
        setActionStatus({ type: "error", message: "Refresh failed" });
      }
    } catch (error) {
      console.error("Error fetching asset updates:", error);
      setActionStatus({ type: "error", message: "Network error" });
    } finally {
      setCurrentAction("");
    }
  };

  // Add new asset to track
  const addAsset = async () => {
    if (!selectedAsset) {
      setActionStatus({ type: "warning", message: "Please select an asset" });
      setTimeout(() => setActionStatus({ type: "", message: "" }), 2000);
      return;
    }
    
    setCurrentAction("adding");
    setActionStatus({ type: "info", message: "Adding asset..." });
    
    try {
      const response = await fetch(`${baseURL}/add-tracked-asset/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ asset: selectedAsset }),
      });
      
      if (response.ok) {
        setIsModalOpen(false);
        setSelectedAsset("");
        fetchAssets();
        setActionStatus({ type: "success", message: "Asset added" });
      } else {
        console.error("Failed to add asset");
        setActionStatus({ type: "error", message: "Failed to add asset" });
      }
    } catch (error) {
      console.error("Error adding asset:", error);
      setActionStatus({ type: "error", message: "Network error" });
    } finally {
      setCurrentAction("");
      setTimeout(() => setActionStatus({ type: "", message: "" }), 2000);
    }
  };

  // Remove asset from tracking with confirmation
  const confirmRemoveAsset = (assetId, assetName) => {
    if (window.confirm(`Are you sure you want to remove ${assetName} from tracking?`)) {
      removeAsset(assetId);
    }
  };

  // Remove asset from tracking
  const removeAsset = async (assetId) => {
    setProcessingId(assetId);
    setCurrentAction("deleting");
    setActionStatus({ type: "info", message: "Removing asset..." });
    
    try {
      const response = await fetch(`${baseURL}/remove-tracked-asset/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: assetId }),
      });
      
      if (response.ok) {
        fetchAssets();
        setActionStatus({ type: "success", message: "Asset removed" });
      } else {
        console.error("Failed to remove asset");
        setActionStatus({ type: "error", message: "Failed to remove asset" });
      }
    } catch (error) {
      console.error("Error removing asset:", error);
      setActionStatus({ type: "error", message: "Network error" });
    } finally {
      setProcessingId(null);
      setCurrentAction("");
      setTimeout(() => setActionStatus({ type: "", message: "" }), 2000);
    }
  };

  // Initial fetch on component mount
  useEffect(() => {
    fetchAssets();
  }, []);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
      }
      window.speechSynthesis.cancel();
    };
  }, []);

  // Determine status alert class
  const getStatusClass = () => {
    switch(actionStatus.type) {
      case "success": return "alert-success";
      case "error": return "alert-danger";
      case "warning": return "alert-warning";
      case "info": return "alert-info";
      default: return "";
    }
  };

  return (
    <div className="asset-tracker mt-3 card shadow-sm">
      <div className="card-header bg-light">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0 text-primary d-flex align-items-center">
            <FaChartLine className="me-2" />
            Asset Tracker
          </h5>
          <div className="d-flex align-items-center">
            {/* Voice Timer Controls */}
            <div className="me-3">
              {voiceTimer.isActive ? (
                <div className="d-flex align-items-center">
                  <span className="badge bg-success me-2">
                    <FaClock className="me-1" />
                    {formatTime(voiceTimer.timeLeft)}
                  </span>
                  <button 
                    className="btn btn-sm btn-outline-danger me-2" 
                    onClick={stopVoiceTimer}
                    title="Stop voice timer"
                  >
                    <FaVolumeMute />
                  </button>
                </div>
              ) : (
                <button 
                  className="btn btn-sm btn-outline-primary me-2" 
                  onClick={() => setIsVoiceModalOpen(true)}
                  title="Start voice timer"
                >
                  <FaVolumeUp />
                </button>
              )}
            </div>
            
            <button 
              className="btn btn-sm btn-primary me-2" 
              onClick={() => setIsModalOpen(true)}
              disabled={currentAction === "adding" || currentAction === "refreshing"}
            >
              <FaPlus /> Add
            </button>
            <button 
              className="btn btn-sm btn-outline-secondary" 
              onClick={fetchAssetUpdates}
              disabled={currentAction !== ""}
            >
              <FaSync className={currentAction === "refreshing" ? "fa-spin" : ""} />
              {currentAction === "refreshing" ? " Refreshing..." : ""}
            </button>
          </div>
        </div>
        
        {/* Status messages */}
        {actionStatus.message && (
          <div className={`alert ${getStatusClass()} py-1 mt-2 mb-0 small text-center`} role="alert">
            {actionStatus.message}
          </div>
        )}
      </div>
      
      <div className="card-body p-2">
        {currentAction === "loading" ? (
          <div className="text-center py-3">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2 text-muted">Loading assets...</p>
          </div>
        ) : assets.length === 0 ? (
          <div className="text-center py-3">
            <p className="text-muted mb-0">No assets tracked. Add one to start monitoring.</p>
          </div>
        ) : (
          <div className="asset-list">
            {assets.map((asset) => (
              <div 
                key={asset.id} 
                className="asset-item d-flex justify-content-between align-items-center p-2 border-bottom hover-bg-light"
              >
                <div className="asset-name fw-medium">{asset.asset}</div>
                <div className="d-flex align-items-center">
                  <span 
                    className={`badge ${
                      asset.percent_change > 0 
                        ? 'bg-success' 
                        : asset.percent_change < 0 
                          ? 'bg-danger' 
                          : 'bg-secondary'
                    } me-2`}
                  >
                    {asset.percent_change > 0 ? '+' : ''}
                    {asset.percent_change}%
                  </span>
                  <button 
                    className="btn btn-sm btn-outline-danger" 
                    onClick={() => confirmRemoveAsset(asset.id, asset.asset)}
                    disabled={processingId === asset.id}
                  >
                    {processingId === asset.id ? (
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    ) : (
                      <FaTrash size={12} />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Modal for adding new assets */}
      {isModalOpen && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-light">
                <h5 className="modal-title">
                  <FaChartLine className="me-2 text-primary" />
                  Add Asset to Track
                </h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setIsModalOpen(false)}
                  disabled={currentAction === "adding"}
                ></button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label htmlFor="assetSelect" className="form-label">Select currency pair:</label>
                  <select 
                    id="assetSelect"
                    className="form-select form-select-lg mb-3" 
                    value={selectedAsset} 
                    onChange={(e) => setSelectedAsset(e.target.value)}
                    disabled={currentAction === "adding"}
                  >
                    <option value="">-- Select an asset --</option>
                    {availableCurrencyPairs.map((pair) => (
                      <option key={pair} value={pair}>{pair}</option>
                    ))}
                  </select>
                  <div className="small text-muted mt-2">
                    Selected assets will be tracked and updated automatically.
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setIsModalOpen(false)}
                  disabled={currentAction === "adding"}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="btn btn-primary" 
                  onClick={addAsset}
                  disabled={!selectedAsset || currentAction === "adding"}
                >
                  {currentAction === "adding" ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Adding...
                    </>
                  ) : (
                    <>Add</>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Voice Timer Modal */}
      {isVoiceModalOpen && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-light">
                <h5 className="modal-title">
                  <FaVolumeUp className="me-2 text-primary" />
                  Voice Timer Settings
                </h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setIsVoiceModalOpen(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label htmlFor="minutesInput" className="form-label">Timer interval (minutes):</label>
                  <input 
                    id="minutesInput"
                    type="number" 
                    className="form-control form-control-lg" 
                    value={tempMinutes} 
                    onChange={(e) => setTempMinutes(Math.max(1, parseInt(e.target.value) || 1))}
                    min="1"
                    max="60"
                  />
                  <div className="small text-muted mt-2">
                    Set how often you want to hear price updates (1-60 minutes). 
                    The voice will announce price changes for all your tracked assets.
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setIsVoiceModalOpen(false)}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="btn btn-primary" 
                  onClick={startVoiceTimer}
                >
                  <FaVolumeUp className="me-1" />
                  Start Timer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssetTracker;