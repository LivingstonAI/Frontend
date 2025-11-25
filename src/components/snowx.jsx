import React, { useState, useEffect } from 'react';
// Using ESM import for ethers to ensure compatibility in the preview environment
import { ethers } from 'https://esm.sh/ethers@6.13.2';
import Header from "./header";
import SideNavs from "./side_navs";
// ----------------------------------------------------------------------------
// 1. CSS STYLES (Standard CSS Definitions - Blue & White, Responsive)
// ----------------------------------------------------------------------------
const cssStyles = `
  /* Global Resets & Fonts */
  .dashboard-container {
    min-height: 100vh;
    background-color: #f8f8ff; /* Ghost White / Light Background */
    color: #1e3a8a; /* Dark Blue Text */
    padding: 1rem; /* Reduced padding for mobile */
    font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    box-sizing: border-box;
  }

  /* Card Component */
  .dashboard-card {
    max-width: 48rem; /* Slightly wider */
    margin: 0 auto;
    background-color: #ffffff; /* Pure White Card */
    border-radius: 1rem;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    border: 1px solid #e0e7ff; /* Light Blue Border */
    overflow: hidden;
  }

  /* Header */
  .card-header {
    background-color: #eff6ff; /* Very Light Blue Header */
    padding: 1.5rem;
    border-bottom: 1px solid #bfdbfe; /* Light Blue Separator */
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap; /* Responsive wrap */
    gap: 1rem;
  }

  .header-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: #1e3a8a; /* Primary Blue */
    margin: 0;
  }

  .header-subtitle {
    color: #60a5fa; /* Accent Blue */
    font-size: 0.875rem;
    margin: 0;
  }

  /* Buttons */
  .btn-connect {
    background-color: #3b82f6; /* Blue 500 */
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    font-weight: 600;
    border: none;
    cursor: pointer;
    transition: background-color 0.2s;
    white-space: nowrap; /* Prevent breaking on button */
  }
  .btn-connect:hover {
    background-color: #2563eb; /* Blue 600 */
  }

  .btn-transfer {
    background-color: #3b82f6; /* Primary Action Blue */
    color: white;
    padding: 0.75rem;
    border-radius: 0.5rem;
    font-weight: 500;
    border: none;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.3);
  }
  .btn-transfer:hover {
    background-color: #2563eb; 
  }
  .btn-transfer:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .btn-mint {
    background-color: #10b981; /* Green Accent for Mint */
    color: white;
    padding: 0.75rem;
    border-radius: 0.5rem;
    font-weight: 500;
    border: none;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 4px 6px -1px rgba(16, 185, 129, 0.3);
  }
  .btn-mint:hover {
    background-color: #059669;
  }
  .btn-mint:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* Badges */
  .badge-connected {
    font-size: 0.875rem;
    color: #10b981; /* Green Success */
    background-color: #d1fae5; /* Very Light Green */
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
    border: 1px solid #a7f3d0;
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
    background-color: #fee2e2; /* Light Red */
    color: #ef4444; /* Error Red */
    border: 1px solid #fca5a5;
  }
  .status-info {
    background-color: #eff6ff; /* Light Blue */
    color: #3b82f6; /* Info Blue */
    border: 1px solid #bfdbfe;
  }

  /* Metrics Grid (Responsive) */
  .metric-grid {
    display: grid;
    grid-template-columns: repeat(1, 1fr); /* Single column on mobile */
    gap: 1rem;
  }
  @media (min-width: 640px) { /* Tablet and up */
    .metric-grid {
      grid-template-columns: repeat(3, 1fr); /* Three columns on larger screens */
    }
  }
  
  .metric-card {
    background-color: #f7f9fc; /* Off-White for metrics */
    padding: 1rem;
    border-radius: 0.75rem;
    border: 1px solid #e0e7ff;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.05);
  }
  
  .metric-label {
    font-size: 0.75rem;
    color: #60a5fa; /* Accent Blue Label */
    text-transform: uppercase;
    letter-spacing: 0.05em;
    display: block;
    margin-bottom: 0.25rem;
  }
  
  .metric-value {
    font-size: 1.25rem;
    font-weight: 700;
    color: #1e3a8a; /* Dark Blue */
  }
  .text-yellow { color: #f59e0b; } /* Amber for Symbol */
  .text-green { color: #10b981; } /* Emerald for Balance */

  /* Forms & Inputs */
  .execution-section {
    border-top: 1px solid #e0e7ff;
    padding-top: 1.5rem;
  }
  
  .section-title {
    font-size: 1.125rem;
    font-weight: 600;
    margin-bottom: 1rem;
    color: #1e3a8a;
  }

  .form-group {
    margin-bottom: 1rem;
  }

  .input-label {
    display: block;
    font-size: 0.875rem;
    color: #60a5fa;
    margin-bottom: 0.25rem;
  }

  .input-field {
    width: 100%;
    background-color: #ffffff;
    border: 1px solid #bfdbfe;
    border-radius: 0.5rem;
    padding: 0.75rem;
    color: #1e3a8a;
    font-family: monospace;
    outline: none;
    box-sizing: border-box; 
  }
  .input-field:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
  }

  .action-grid {
    display: grid;
    grid-template-columns: repeat(1, 1fr); /* Single column on mobile */
    gap: 1rem;
    margin-top: 0.5rem;
  }
  @media (min-width: 640px) { /* Tablet and up */
    .action-grid {
      grid-template-columns: repeat(2, 1fr); /* Two columns on larger screens */
    }
  }

  .helper-text {
    font-size: 0.75rem;
    text-align: center;
    color: #93c5fd; /* Light Blue Hint */
    margin-top: 0.5rem;
  }
`;

// ----------------------------------------------------------------------------
// 2. CONTRACT CONFIGURATION
// ----------------------------------------------------------------------------
// !!! IMPORTANT: REPLACE THIS ADDRESS WITH YOUR DEPLOYED SEPOLIA CONTRACT ADDRESS !!!
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

// Helper function to check if the user is on a mobile device
const isMobile = () => /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

export default function SNOWXDashboard() {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [tokenData, setTokenData] = useState({ name: 'Loading...', symbol: '', balance: '0' });
  
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const initializeEthers = async (providerInstance) => {
    try {
      const _provider = new ethers.BrowserProvider(providerInstance);
      // Request accounts to get the current account and trigger connection in the wallet
      const accounts = await _provider.send("eth_requestAccounts", []);
      const _account = accounts[0];
      setAccount(_account);

      const _signer = await _provider.getSigner();
      const _contract = new ethers.Contract(CONTRACT_ADDRESS, MINIMAL_ABI, _signer);
      
      setProvider(_provider);
      setContract(_contract);
      setStatus('Wallet connected successfully.');
      
      fetchTokenData(_contract, _account);
    } catch (error) {
      console.error(error);
      setStatus('Connection failed: ' + (error.message || 'Unknown error.'));
    }
  };

  const connectWallet = async () => {
    // 1. Check for standard Ethereum injection (Desktop or MetaMask mobile browser)
    if (window.ethereum) {
      setStatus('Connecting via Browser Provider...');
      initializeEthers(window.ethereum);
    } 
    // 2. Handle mobile deep linking for MetaMask 
    else if (isMobile()) {
        setStatus('Attempting mobile wallet redirect...');
        // Use a universal link to prompt connection
        const appUrl = encodeURIComponent(window.location.href);
        const metamaskUrl = `https://metamask.app.link/dapp/${appUrl}`;
        
        window.open(metamaskUrl, '_self');
        
        // The mobile device will leave the browser, connect in MetaMask, and then return. 
        // The useEffect hook below handles the return connection.
    }
    // 3. Fallback for no provider
    else {
      setStatus('Please install MetaMask or use a DApp browser.');
    }
  };

  const fetchTokenData = async (_contract, _account) => {
    // --- THIS IS THE FIX FOR THE 'LOADING...' ISSUE ---
    if (CONTRACT_ADDRESS === "0xYourContractAddressHere") {
        setTokenData({ name: 'Placeholder', symbol: 'QTT', balance: 'N/A' });
        setStatus("!!! WARNING: Update CONTRACT_ADDRESS with your actual address !!!");
        return;
    }
    // ----------------------------------------------------

    try {
      // Check if the contract is initialized before fetching data
      if (!_contract) {
          setStatus("Contract not initialized. Try connecting wallet again.");
          return;
      }
      
      const name = await _contract.name();
      const symbol = await _contract.symbol();
      const decimals = await _contract.decimals();
      const rawBalance = await _contract.balanceOf(_account);
      const formattedBalance = ethers.formatUnits(rawBalance, decimals);

      setTokenData({ name, symbol, balance: formattedBalance });
    } catch (err) {
      console.error("Error fetching token data:", err);
      setStatus("Could not load token data. Check Contract Address or Network.");
    }
  };

  const handleTransfer = async () => {
    if (!contract) return;
    setIsLoading(true);
    setStatus('Initiating Transfer...');

    try {
      // Amount must be greater than zero for a valid transaction
      if (parseFloat(amount) <= 0 || isNaN(parseFloat(amount))) {
          setStatus('Transfer Failed: Invalid amount.');
          setIsLoading(false);
          return;
      }
      
      const amountInWei = ethers.parseUnits(amount, 18);
      const tx = await contract.transfer(recipient, amountInWei);
      setStatus(`Transaction Sent: ${tx.hash}`);
      await tx.wait();
      setStatus('Transfer Confirmed! Updating balance...');
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
      if (parseFloat(amount) <= 0 || isNaN(parseFloat(amount))) {
          setStatus('Mint Failed: Invalid amount.');
          setIsLoading(false);
          return;
      }

      const amountInWei = ethers.parseUnits(amount, 18);
      const tx = await contract.mint(account, amountInWei);
      setStatus(`Mint Tx Sent: ${tx.hash}`);
      await tx.wait();
      setStatus('Mint Confirmed! Updating balance...');
      fetchTokenData(contract, account);
    } catch (err) {
      console.error(err);
      setStatus('Mint Failed: ' + (err.reason || err.message));
    } finally {
      setIsLoading(false);
    }
  };

  // Improved Mobile Connection/Reconnect Logic (Polling)
  useEffect(() => {
    let intervalId;

    const attemptReconnect = () => {
        // If we have window.ethereum and no account yet, try to initialize
        if (window.ethereum && !account) {
            console.log("Attempting reconnect...");
            initializeEthers(window.ethereum);
        } else if (account) {
            // If already connected, stop polling
            clearInterval(intervalId);
        }
    };

    // Start polling if we are on mobile and don't have an account
    if (isMobile() && !account) {
        // Check every 2 seconds for a minute (30 checks)
        intervalId = setInterval(attemptReconnect, 2000);
        setTimeout(() => clearInterval(intervalId), 60000); // Stop after 60 seconds
    } else if (window.ethereum && !account) {
        // Desktop browsers can attempt a one-time connection on load
        attemptReconnect();
    }

    // Cleanup interval on component unmount or when connected
    return () => clearInterval(intervalId);
  }, [account]);


  return (
    <div>       
        <div className="header">
            <Header />
         </div>
          <div className="main-page-body">
            <SideNavs />
    <div className="dashboard-container">
      {/* Injecting the CSS Styles */}
      <style>{cssStyles}</style>

      <div className="dashboard-card">
        
        {/* Header */}
        <div className="card-header">
          <div>
            <h1 className="header-title">SnowAI Crypto Dashboard</h1>
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
            <div className={`status-bar ${status.includes('Failed') || status.includes('Error') || status.includes('WARNING') ? 'status-error' : 'status-info'}`}>
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
    </div>
    </div>
  );
}