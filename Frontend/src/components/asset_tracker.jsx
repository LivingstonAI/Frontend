import React, { useState, useEffect } from "react";
import { FaPlus, FaTrash, FaSync, FaChartLine } from 'react-icons/fa';

// AssetTracker component with improved styling and UX
const AssetTracker = () => {
  const [assets, setAssets] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState("");
  const [actionStatus, setActionStatus] = useState({ type: "", message: "" });
  const [currentAction, setCurrentAction] = useState("");
  const [processingId, setProcessingId] = useState(null);
  const baseURL = 'https://backend-production-c0ab.up.railway.app';

  // Common currency pairs
  const availableCurrencyPairs = [
    'EURUSD', 'GBPUSD', 'USDJPY', 'USDCHF', 'AUDUSD', 'USDCAD', 
    'NZDUSD', 'EURJPY', 'EURGBP', 'EURCHF', 'GBPJPY', 'GBPCHF',
    'AUDJPY', 'CADJPY', 'NZDJPY', 'EURAUD', 'EURCAD'
  ];

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
    
    // // Set up interval for auto-refresh (every 60 seconds)
    // const interval = setInterval(fetchAssetUpdates, 60000);
    
    // // Clean up interval on component unmount
    // return () => clearInterval(interval);
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
            <FaChartLine className="me-2" /> Asset Tracker
          </h5>
          <div>
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
                    Selected assets will be tracked and updated automatically every minute.
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
    </div>
  );
};

export default AssetTracker;