import React, { useState, useEffect } from "react";
import { FaPlus, FaTrash, FaSync } from 'react-icons/fa';

// AssetTracker component to be added to SideNavs.js
const AssetTracker = () => {
  const [assets, setAssets] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState("");
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
    try {
      const response = await fetch(`${baseURL}/get-tracked-assets/`);
      if (response.ok) {
        const data = await response.json();
        setAssets(data);
      } else {
        console.error("Failed to fetch assets");
      }
    } catch (error) {
      console.error("Error fetching assets:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch asset updates
  const fetchAssetUpdates = async () => {
    try {
      const response = await fetch(`${baseURL}/fetch-asset-update/`);
      if (response.ok) {
        const data = await response.json();
        setAssets(data);
      }
    } catch (error) {
      console.error("Error fetching asset updates:", error);
    }
  };

  // Add new asset to track
  const addAsset = async () => {
    if (!selectedAsset) return;
    
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
      } else {
        console.error("Failed to add asset");
      }
    } catch (error) {
      console.error("Error adding asset:", error);
    }
  };

  // Remove asset from tracking
  const removeAsset = async (assetId) => {
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
      } else {
        console.error("Failed to remove asset");
      }
    } catch (error) {
      console.error("Error removing asset:", error);
    }
  };

  // Initial fetch on component mount
  useEffect(() => {
    fetchAssets();
    
    // Set up interval for auto-refresh (every 60 seconds)
    const interval = setInterval(fetchAssetUpdates, 60000);
    
    // Clean up interval on component unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="asset-tracker mt-3">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h5 className="mb-0">Asset Tracker</h5>
        <div>
          <button 
            className="btn btn-sm btn-outline-primary me-2" 
            onClick={() => setIsModalOpen(true)}
          >
            <FaPlus />
          </button>
          <button 
            className="btn btn-sm btn-outline-secondary" 
            onClick={fetchAssetUpdates}
            disabled={isLoading}
          >
            <FaSync className={isLoading ? "fa-spin" : ""} />
          </button>
        </div>
      </div>
      
      {assets.length === 0 ? (
        <p className="text-muted small">No assets tracked. Add one to start monitoring.</p>
      ) : (
        <div className="asset-list">
          {assets.map((asset) => (
            <div 
              key={asset.id} 
              className="asset-item d-flex justify-content-between align-items-center mb-1 p-2 border-bottom"
            >
              <div className="asset-name">{asset.asset}</div>
              <div className="d-flex align-items-center">
                <span 
                  className={`asset-change me-2 ${
                    asset.percent_change > 0 
                      ? 'text-success' 
                      : asset.percent_change < 0 
                        ? 'text-danger' 
                        : ''
                  }`}
                >
                  {asset.percent_change > 0 ? '+' : ''}
                  {asset.percent_change}%
                </span>
                <button 
                  className="btn btn-sm btn-outline-danger" 
                  onClick={() => removeAsset(asset.id)}
                >
                  <FaTrash size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Modal for adding new assets */}
      {isModalOpen && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add Asset to Track</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setIsModalOpen(false)}
                ></button>
              </div>
              <div className="modal-body">
                <select 
                  className="form-select" 
                  value={selectedAsset} 
                  onChange={(e) => setSelectedAsset(e.target.value)}
                >
                  <option value="">Select an asset</option>
                  {availableCurrencyPairs.map((pair) => (
                    <option key={pair} value={pair}>{pair}</option>
                  ))}
                </select>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="btn btn-primary" 
                  onClick={addAsset}
                >
                  Add
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