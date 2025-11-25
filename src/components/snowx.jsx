import React, { useState, useEffect } from 'react';
// Using ESM import for ethers to ensure compatibility in the preview environment
import { ethers } from 'https://esm.sh/ethers@6.13.2';

// ----------------------------------------------------------------------------
// 1. CSS STYLES (Standard CSS Definitions)
// ----------------------------------------------------------------------------
const cssStyles = `
  /* Global Resets & Fonts */
  .dashboard-container {
    min-height: 100vh;
    background-color: #0f172a; /* Slate 900 */
    color: #ffffff;
    padding: 2rem;
    font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    box-sizing: border-box;
  }

  /* Card Component */
  .dashboard-card {
    max-width: 42rem; /* approx 672px */
    margin: 0 auto;
    background-color: #1e293b; /* Slate 800 */
    border-radius: 0.75rem;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    border: 1px solid #334155; /* Slate 700 */
    overflow: hidden;
  }

  /* Header */
  .card-header {
    background-color: #020617; /* Slate 950 */
    padding: 1.5rem;
    border-bottom: 1px solid #334155;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .header-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: #60a5fa; /* Blue 400 */
    margin: 0;
  }

  .header-subtitle {
    color: #94a3b8; /* Slate 400 */
    font-size: 0.875rem;
    margin: 0;
  }

  /* Buttons */
  .btn-connect {
    background-color: #2563eb; /* Blue 600 */
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    font-weight: 500;
    border: none;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  .btn-connect:hover {
    background-color: #3b82f6; /* Blue 500 */
  }

  .btn-transfer {
    background-color: #4f46e5; /* Indigo 600 */
    color: white;
    padding: 0.75rem;
    border-radius: 0.5rem;
    font-weight: 500;
    border: none;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 10px 15px -3px rgba(49, 46, 129, 0.2);
  }
  .btn-transfer:hover {
    background-color: #6366f1; /* Indigo 500 */
  }
  .btn-transfer:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .btn-mint {
    background-color: #047857; /* Emerald 700 */
    color: white;
    padding: 0.75rem;
    border-radius: 0.5rem;
    font-weight: 500;
    border: none;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 10px 15px -3px rgba(6, 78, 59, 0.2);
  }
  .btn-mint:hover {
    background-color: #059669; /* Emerald 600 */
  }
  .btn-mint:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* Badges */
  .badge-connected {
    font-size: 0.875rem;
    color: #4ade80; /* Green 400 */
    background-color: rgba(20, 83, 45, 0.3);
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
    border: 1px solid #14532d;
  }

  /* Content Area */
  .card-content {
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  /* Status Bars */
  .status-bar {
    padding: 0.75rem;
    border-radius: 0.5rem;
    font-size: 0.875rem;
    font-family: monospace;
  }
  .status-error {
    background-color: rgba(127, 29, 29, 0.5);
    color: #fecaca; /* Red 200 */
    border: 1px solid #7f1d1d;
  }
  .status-info {
    background-color: rgba(30, 58, 138, 0.3);
    color: #bfdbfe; /* Blue 200 */
    border: 1px solid #1e3a8a;
  }

  /* Metrics Grid */
  .metric-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
  }
  
  .metric-card {
    background-color: rgba(51, 65, 85, 0.5); /* Slate 700/50 */
    padding: 1rem;
    border-radius: 0.5rem;
    border: 1px solid #475569;
  }
  
  .metric-label {
    font-size: 0.75rem;
    color: #94a3b8; /* Slate 400 */
    text-transform: uppercase;
    letter-spacing: 0.05em;
    display: block;
    margin-bottom: 0.25rem;
  }
  
  .metric-value {
    font-size: 1.25rem;
    font-weight: 700;
    color: white;
  }
  .text-yellow { color: #facc15; }
  .text-green { color: #4ade80; }

  /* Forms & Inputs */
  .execution-section {
    border-top: 1px solid #334155;
    padding-top: 1.5rem;
  }
  
  .section-title {
    font-size: 1.125rem;
    font-weight: 600;
    margin-bottom: 1rem;
    color: #e2e8f0;
  }

  .form-group {
    margin-bottom: 1rem;
  }

  .input-label {
    display: block;
    font-size: 0.875rem;
    color: #94a3b8;
    margin-bottom: 0.25rem;
  }

  .input-field {
    width: 100%;
    background-color: #0f172a;
    border: 1px solid #475569;
    border-radius: 0.5rem;
    padding: 0.75rem;
    color: white;
    font-family: monospace;
    outline: none;
    box-sizing: border-box; /* Important for width: 100% */
  }
  .input-field:focus {
    border-color: #3b82f6;
  }

  .action-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
    margin-top: 0.5rem;
  }

  .helper-text {
    font-size: 0.75rem;
    text-align: center;
    color: #64748b;
    margin-top: 0.5rem;
  }
`;

// ----------------------------------------------------------------------------
// 2. CONTRACT CONFIGURATION
// ----------------------------------------------------------------------------
const CONTRACT_ADDRESS = "0xYourContractAddressHere";

const MINIMAL_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function balanceOf(address owner) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function mint(address to, uint256 amount)"
];

// ----------------------------------------------------------------------------
// 3. MAIN COMPONENT
// ----------------------------------------------------------------------------
export default function SNOWXDashboard() {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [tokenData, setTokenData] = useState({ name: 'Loading...', symbol: '', balance: '0' });
  
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const _account = accounts[0];
        setAccount(_account);

        const _provider = new ethers.BrowserProvider(window.ethereum);
        const _signer = await _provider.getSigner();
        const _contract = new ethers.Contract(CONTRACT_ADDRESS, MINIMAL_ABI, _signer);
        
        setProvider(_provider);
        setContract(_contract);
        setStatus('Wallet connected.');
        
        fetchTokenData(_contract, _account);
      } catch (error) {
        console.error(error);
        setStatus('Error connecting wallet: ' + error.message);
      }
    } else {
      setStatus('Please install MetaMask!');
    }
  };

  const fetchTokenData = async (_contract, _account) => {
    try {
      const name = await _contract.name();
      const symbol = await _contract.symbol();
      const decimals = await _contract.decimals();
      const rawBalance = await _contract.balanceOf(_account);
      const formattedBalance = ethers.formatUnits(rawBalance, decimals);

      setTokenData({ name, symbol, balance: formattedBalance });
    } catch (err) {
      console.error(err);
      setStatus("Could not load token data. Check Contract Address.");
    }
  };

  const handleTransfer = async () => {
    if (!contract) return;
    setIsLoading(true);
    setStatus('Initiating Transfer...');

    try {
      const amountInWei = ethers.parseUnits(amount, 18);
      const tx = await contract.transfer(recipient, amountInWei);
      setStatus(`Transaction Sent: ${tx.hash}`);
      await tx.wait();
      setStatus('Transfer Confirmed!');
      fetchTokenData(contract, account);
    } catch (err) {
      console.error(err);
      setStatus('Transfer Failed: ' + (err.reason || err.message));
    } finally {
      setIsLoading(false);
    }
  };

  const handleMint = async () => {
    if (!contract) return;
    setIsLoading(true);
    setStatus('Initiating Mint...');

    try {
      const amountInWei = ethers.parseUnits(amount, 18);
      const tx = await contract.mint(account, amountInWei);
      setStatus(`Mint Tx Sent: ${tx.hash}`);
      await tx.wait();
      setStatus('Mint Confirmed!');
      fetchTokenData(contract, account);
    } catch (err) {
      console.error(err);
      setStatus('Mint Failed: ' + (err.reason || err.message));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      {/* Injecting the CSS Styles */}
      <style>{cssStyles}</style>

      <div className="dashboard-card">
        
        {/* Header */}
        <div className="card-header">
          <div>
            <h1 className="header-title">Crypto Trader Dashboard</h1>
            <p className="header-subtitle">Interaction Layer</p>
          </div>
          <div className="text-right">
             {!account ? (
              <button onClick={connectWallet} className="btn-connect">
                Connect Wallet
              </button>
            ) : (
              <div className="badge-connected">
                Connected: {account.slice(0, 6)}...{account.slice(-4)}
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="card-content">
          
          {/* Status Bar */}
          {status && (
            <div className={`status-bar ${status.includes('Failed') || status.includes('Error') ? 'status-error' : 'status-info'}`}>
              &gt; {status}
            </div>
          )}

          {/* Asset Info Card */}
          <div className="metric-grid">
             <div className="metric-card">
               <span className="metric-label">Asset</span>
               <div className="metric-value">{tokenData.name}</div>
             </div>
             <div className="metric-card">
               <span className="metric-label">Symbol</span>
               <div className="metric-value text-yellow">{tokenData.symbol || '---'}</div>
             </div>
             <div className="metric-card">
               <span className="metric-label">Your Balance</span>
               <div className="metric-value text-green">{tokenData.balance}</div>
             </div>
          </div>

          {/* Trading/Action Interface */}
          {account && (
            <div className="execution-section">
              <h3 className="section-title">Execution</h3>
              
              <div className="form-stack">
                <div className="form-group">
                  <label className="input-label">Recipient Address (0x...)</label>
                  <input 
                    type="text" 
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    placeholder="0x123..."
                    className="input-field"
                  />
                </div>

                <div className="form-group">
                  <label className="input-label">Amount</label>
                  <input 
                    type="number" 
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.0"
                    className="input-field"
                  />
                </div>

                <div className="action-grid">
                  <button 
                    onClick={handleTransfer}
                    disabled={isLoading}
                    className="btn-transfer"
                  >
                    {isLoading ? 'Processing...' : 'Transfer Tokens'}
                  </button>
                  
                  <button 
                    onClick={handleMint}
                    disabled={isLoading}
                    className="btn-mint"
                  >
                    {isLoading ? 'Processing...' : 'Mint (Owner Only)'}
                  </button>
                </div>
                <p className="helper-text">
                  *Minting will fail if you are not the contract owner.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}