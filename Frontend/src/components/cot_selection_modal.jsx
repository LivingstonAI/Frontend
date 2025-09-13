import React, { useState } from 'react';

const COTDataSelector = ({ onAssetsSelected }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAssets, setSelectedAssets] = useState([]);

  const availableAssets = [
    'USD INDEX - ICE FUTURES U.S.',
    'EURO FX - CHICAGO MERCANTILE EXCHANGE',
    'BRITISH POUND - CHICAGO MERCANTILE EXCHANGE',
    'GOLD - COMMODITY EXCHANGE INC.',
    'UST BOND - CHICAGO BOARD OF TRADE',
    'UST 10Y NOTE - CHICAGO BOARD OF TRADE',
    'UST 5Y NOTE - CHICAGO BOARD OF TRADE',
    'NASDAQ MINI - CHICAGO MERCANTILE EXCHANGE',
    'E-MINI S&P 500 -',
    'DOW JONES U.S. REAL ESTATE IDX - CHICAGO BOARD OF TRADE'
  ];

  const handleAssetToggle = (asset) => {
    setSelectedAssets(prev => 
      prev.includes(asset) 
        ? prev.filter(a => a !== asset)
        : [...prev, asset]
    );
  };

  const handleSubmit = () => {
    onAssetsSelected(selectedAssets);
    setIsModalOpen(false);
  };

  return (
    <div>
      <button 
        onClick={() => setIsModalOpen(true)}
        className="select-assets-btn"
      >
        Select Assets
      </button>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Select Assets to Display</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="close-btn"
              >
                ×
              </button>
            </div>

            <div className="asset-list">
              {availableAssets.map(asset => (
                <div key={asset} className="asset-item">
                  <label className="asset-label">
                    <input
                      type="checkbox"
                      checked={selectedAssets.includes(asset)}
                      onChange={() => handleAssetToggle(asset)}
                      className="asset-checkbox"
                    />
                    <span className="asset-text">{asset}</span>
                  </label>
                </div>
              ))}
            </div>

            <div className="modal-footer">
              <button 
                onClick={handleSubmit}
                className="submit-btn"
                disabled={selectedAssets.length === 0}
              >
                Fetch Selected Data
              </button>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="cancel-btn"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .select-assets-btn {
          padding: 10px 20px;
          background-color: #3b82f6;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 16px;
          transition: background-color 0.2s;
        }

        .select-assets-btn:hover {
          background-color: #2563eb;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .modal-content {
          background-color: white;
          border-radius: 8px;
          width: 90%;
          max-width: 600px;
          max-height: 90vh;
          display: flex;
          flex-direction: column;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 24px;
          border-bottom: 1px solid #e5e7eb;
        }

        .modal-title {
          font-size: 20px;
          font-weight: 600;
          color: #1f2937;
          margin: 0;
        }

        .close-btn {
          background: none;
          border: none;
          font-size: 24px;
          color: #6b7280;
          cursor: pointer;
          padding: 4px;
        }

        .close-btn:hover {
          color: #1f2937;
        }

        .asset-list {
          padding: 20px 24px;
          overflow-y: auto;
          max-height: 60vh;
        }

        .asset-item {
          margin-bottom: 12px;
        }

        .asset-label {
          display: flex;
          align-items: center;
          cursor: pointer;
          padding: 8px;
          border-radius: 4px;
          transition: background-color 0.2s;
        }

        .asset-label:hover {
          background-color: #f3f4f6;
        }

        .asset-checkbox {
          width: 16px;
          height: 16px;
          margin-right: 12px;
          cursor: pointer;
        }

        .asset-text {
          font-size: 14px;
          color: #374151;
        }

        .modal-footer {
          padding: 16px 24px;
          border-top: 1px solid #e5e7eb;
          display: flex;
          justify-content: flex-end;
          gap: 12px;
        }

        .submit-btn {
          padding: 8px 16px;
          background-color: #3b82f6;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          transition: background-color 0.2s;
        }

        .submit-btn:hover:not(:disabled) {
          background-color: #2563eb;
        }

        .submit-btn:disabled {
          background-color: #9ca3af;
          cursor: not-allowed;
        }

        .cancel-btn {
          padding: 8px 16px;
          background-color: #f3f4f6;
          color: #374151;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          transition: background-color 0.2s;
        }

        .cancel-btn:hover {
          background-color: #e5e7eb;
        }
      `}</style>
    </div>
  );
};

export default COTDataSelector;