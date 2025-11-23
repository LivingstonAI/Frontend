import React, { useState, useEffect } from 'react';
import { Wallet, TrendingUp, ArrowDownCircle, ArrowUpCircle, AlertCircle, ExternalLink, Loader } from 'lucide-react';

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(to bottom right, #eff6ff, #e0e7ff)',
    padding: '1.5rem'
  },
  maxWidth: {
    maxWidth: '80rem',
    margin: '0 auto'
  },
  header: {
    marginBottom: '1.5rem'
  },
  title: {
    fontSize: '2.25rem',
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: '0.5rem'
  },
  subtitle: {
    color: '#4b5563'
  },
  notification: {
    marginBottom: '1.5rem',
    padding: '1rem',
    borderRadius: '0.5rem'
  },
  notificationSuccess: {
    backgroundColor: '#f0fdf4',
    border: '1px solid #bbf7d0'
  },
  notificationError: {
    backgroundColor: '#fef2f2',
    border: '1px solid #fecaca'
  },
  notificationTextSuccess: {
    fontSize: '0.875rem',
    color: '#166534'
  },
  notificationTextError: {
    fontSize: '0.875rem',
    color: '#991b1b'
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '0.5rem',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    padding: '1.5rem',
    marginBottom: '1.5rem'
  },
  cardCompact: {
    backgroundColor: 'white',
    borderRadius: '0.5rem',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    padding: '1rem',
    marginBottom: '1.5rem'
  },
  flexBetween: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  flexCenter: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem'
  },
  heading: {
    fontSize: '1.125rem',
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: '0.25rem'
  },
  text: {
    fontSize: '0.875rem',
    color: '#4b5563'
  },
  buttonPrimary: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    backgroundColor: '#2563eb',
    color: 'white',
    fontWeight: '600',
    padding: '0.75rem 1.5rem',
    borderRadius: '0.5rem',
    transition: 'background-color 0.2s',
    border: 'none',
    cursor: 'pointer'
  },
  buttonPrimaryHover: {
    backgroundColor: '#1d4ed8'
  },
  buttonDisabled: {
    backgroundColor: '#9ca3af',
    cursor: 'not-allowed'
  },
  avatar: {
    width: '2.5rem',
    height: '2.5rem',
    backgroundColor: '#dbeafe',
    borderRadius: '9999px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  addressText: {
    fontWeight: '600',
    color: '#1f2937'
  },
  labelText: {
    fontSize: '0.875rem',
    color: '#4b5563'
  },
  buttonYellow: {
    backgroundColor: '#eab308',
    color: 'white',
    fontWeight: '600',
    padding: '0.5rem 1rem',
    borderRadius: '0.5rem',
    transition: 'background-color 0.2s',
    border: 'none',
    cursor: 'pointer'
  },
  buttonGray: {
    backgroundColor: '#e5e7eb',
    color: '#1f2937',
    fontWeight: '600',
    padding: '0.5rem 1rem',
    borderRadius: '0.5rem',
    transition: 'background-color 0.2s',
    border: 'none',
    cursor: 'pointer'
  },
  alert: {
    marginTop: '0.75rem',
    backgroundColor: '#fefce8',
    border: '1px solid #fde047',
    borderRadius: '0.5rem',
    padding: '0.75rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  alertText: {
    fontSize: '0.875rem',
    color: '#854d0e'
  },
  grid4: {
    display: 'grid',
    gridTemplateColumns: 'repeat(1, minmax(0, 1fr))',
    gap: '1.5rem',
    marginBottom: '2rem'
  },
  grid2: {
    display: 'grid',
    gridTemplateColumns: 'repeat(1, minmax(0, 1fr))',
    gap: '1.5rem',
    marginBottom: '2rem'
  },
  statCard: {
    backgroundColor: 'white',
    borderRadius: '0.5rem',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    padding: '1.5rem'
  },
  statHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '0.5rem'
  },
  statLabel: {
    fontSize: '0.875rem',
    color: '#4b5563'
  },
  statValue: {
    fontSize: '1.875rem',
    fontWeight: 'bold',
    color: '#1f2937'
  },
  statUnit: {
    fontSize: '0.75rem',
    color: '#6b7280',
    marginTop: '0.25rem'
  },
  actionCard: {
    backgroundColor: 'white',
    borderRadius: '0.5rem',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    padding: '1.5rem'
  },
  actionHeader: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '1rem'
  },
  actionTitle: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#1f2937',
    marginLeft: '0.5rem'
  },
  inputGroup: {
    marginBottom: '1rem'
  },
  label: {
    display: 'block',
    fontSize: '0.875rem',
    fontWeight: '500',
    color: '#374151',
    marginBottom: '0.5rem'
  },
  input: {
    width: '100%',
    padding: '0.75rem 1rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.5rem',
    fontSize: '1rem'
  },
  inputFocus: {
    outline: 'none',
    borderColor: 'transparent',
    boxShadow: '0 0 0 2px #22c55e'
  },
  previewGreen: {
    backgroundColor: '#f0fdf4',
    border: '1px solid #bbf7d0',
    borderRadius: '0.5rem',
    padding: '1rem',
    marginBottom: '1rem'
  },
  previewRed: {
    backgroundColor: '#fef2f2',
    border: '1px solid #fecaca',
    borderRadius: '0.5rem',
    padding: '1rem',
    marginBottom: '1rem'
  },
  previewLabel: {
    fontSize: '0.875rem',
    color: '#4b5563'
  },
  previewValueGreen: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#16a34a'
  },
  previewValueRed: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#dc2626'
  },
  previewNote: {
    fontSize: '0.75rem',
    color: '#6b7280',
    marginTop: '0.25rem'
  },
  buttonGreen: {
    width: '100%',
    backgroundColor: '#16a34a',
    color: 'white',
    fontWeight: '600',
    padding: '0.75rem 1rem',
    borderRadius: '0.5rem',
    transition: 'background-color 0.2s',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem'
  },
  buttonRed: {
    width: '100%',
    backgroundColor: '#dc2626',
    color: 'white',
    fontWeight: '600',
    padding: '0.75rem 1rem',
    borderRadius: '0.5rem',
    transition: 'background-color 0.2s',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem'
  },
  historyCard: {
    backgroundColor: 'white',
    borderRadius: '0.5rem',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    padding: '1.5rem'
  },
  historyTitle: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: '1rem'
  },
  tableContainer: {
    overflowX: 'auto'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse'
  },
  tableHeader: {
    borderBottom: '1px solid #e5e7eb'
  },
  th: {
    textAlign: 'left',
    padding: '0.75rem 1rem',
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#374151'
  },
  tr: {
    borderBottom: '1px solid #f3f4f6'
  },
  td: {
    padding: '0.75rem 1rem'
  },
  badgeMint: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '0.25rem 0.5rem',
    borderRadius: '9999px',
    fontSize: '0.75rem',
    fontWeight: '500',
    backgroundColor: '#dcfce7',
    color: '#166534'
  },
  badgeBurn: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '0.25rem 0.5rem',
    borderRadius: '9999px',
    fontSize: '0.75rem',
    fontWeight: '500',
    backgroundColor: '#fee2e2',
    color: '#991b1b'
  },
  statusConfirmed: {
    display: 'inline-flex',
    padding: '0.25rem 0.5rem',
    borderRadius: '9999px',
    fontSize: '0.75rem',
    fontWeight: '500',
    color: '#16a34a',
    backgroundColor: '#dcfce7'
  },
  statusPending: {
    display: 'inline-flex',
    padding: '0.25rem 0.5rem',
    borderRadius: '9999px',
    fontSize: '0.75rem',
    fontWeight: '500',
    color: '#ca8a04',
    backgroundColor: '#fef9c3'
  },
  statusFailed: {
    display: 'inline-flex',
    padding: '0.25rem 0.5rem',
    borderRadius: '9999px',
    fontSize: '0.75rem',
    fontWeight: '500',
    color: '#dc2626',
    backgroundColor: '#fee2e2'
  },
  link: {
    color: '#2563eb',
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
    fontSize: '0.875rem',
    textDecoration: 'none'
  },
  emptyState: {
    textAlign: 'center',
    padding: '2rem',
    color: '#6b7280'
  }
};

// Media query styles would be applied via JS
const applyResponsiveStyles = () => {
  if (window.innerWidth >= 768) {
    styles.grid4.gridTemplateColumns = 'repeat(4, minmax(0, 1fr))';
  }
  if (window.innerWidth >= 1024) {
    styles.grid2.gridTemplateColumns = 'repeat(2, minmax(0, 1fr))';
  }
};

const useWeb3Mock = () => {
  const [account, setAccount] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  
  const connectWallet = async () => {
    setIsConnecting(true);
    setTimeout(() => {
      setAccount('0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb');
      setChainId('11155111');
      setIsConnecting(false);
    }, 1000);
  };
  
  const disconnectWallet = () => {
    setAccount(null);
    setChainId(null);
  };
  
  const switchToSepolia = () => {
    setChainId('11155111');
  };
  
  return { account, chainId, isConnecting, connectWallet, disconnectWallet, switchToSepolia };
};

const SNOWXDashboard = () => {
  const { account, chainId, isConnecting, connectWallet, disconnectWallet, switchToSepolia } = useWeb3Mock();
  
  const [balance, setBalance] = useState(0);
  const [collateral, setCollateral] = useState(0);
  const [collateralRatio, setCollateralRatio] = useState(0);
  const [ethPrice, setEthPrice] = useState(2000);
  const [ethAmount, setEthAmount] = useState('');
  const [burnAmount, setBurnAmount] = useState('');
  const [calculatedMint, setCalculatedMint] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  const isWrongNetwork = chainId && chainId !== '11155111';

  useEffect(() => {
    applyResponsiveStyles();
    window.addEventListener('resize', applyResponsiveStyles);
    return () => window.removeEventListener('resize', applyResponsiveStyles);
  }, []);

  useEffect(() => {
    if (account) {
      fetchDashboardData();
      fetchPrice();
      const interval = setInterval(fetchPrice, 60000);
      return () => clearInterval(interval);
    }
  }, [account]);

  const fetchDashboardData = async () => {
    setBalance(1000.50);
    setCollateral(0.75);
    setCollateralRatio(150);
    
    setTransactions([
      { id: 1, type: 'MINT', amount: 500, eth: 0.375, status: 'CONFIRMED', date: '2025-11-06 10:30', hash: '0xabc...123' },
      { id: 2, type: 'MINT', amount: 500.50, eth: 0.375, status: 'CONFIRMED', date: '2025-11-06 09:15', hash: '0xdef...456' }
    ]);
  };

  const fetchPrice = async () => {
    setEthPrice(2000);
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const calculateMint = (eth) => {
    if (!eth || eth <= 0) {
      setCalculatedMint(0);
      return;
    }
    const ethValue = eth * ethPrice;
    const stablecoins = (ethValue / 1.5).toFixed(2);
    setCalculatedMint(stablecoins);
  };

  useEffect(() => {
    calculateMint(ethAmount);
  }, [ethAmount, ethPrice]);

  const handleMint = async () => {
    if (!ethAmount || ethAmount <= 0 || isWrongNetwork) return;
    
    setIsLoading(true);
    
    setTimeout(() => {
      const txHash = '0x' + Math.random().toString(16).substr(2, 64);
      const newTx = {
        id: transactions.length + 1,
        type: 'MINT',
        amount: calculatedMint,
        eth: ethAmount,
        status: 'PENDING',
        date: new Date().toLocaleString(),
        hash: txHash
      };
      
      setTransactions([newTx, ...transactions]);
      setBalance(prev => prev + parseFloat(calculatedMint));
      setCollateral(prev => prev + parseFloat(ethAmount));
      setEthAmount('');
      setCalculatedMint(0);
      setIsLoading(false);
      
      showNotification(`Successfully minted ${calculatedMint} SNOW! Tx: ${txHash.slice(0, 10)}...`);
    }, 2000);
  };

  const handleBurn = async () => {
    if (!burnAmount || burnAmount <= 0 || burnAmount > balance || isWrongNetwork) return;
    
    setIsLoading(true);
    
    setTimeout(() => {
      const ethReturned = (burnAmount * 1.5 / ethPrice).toFixed(4);
      const txHash = '0x' + Math.random().toString(16).substr(2, 64);
      
      const newTx = {
        id: transactions.length + 1,
        type: 'BURN',
        amount: burnAmount,
        eth: ethReturned,
        status: 'PENDING',
        date: new Date().toLocaleString(),
        hash: txHash
      };
      
      setTransactions([newTx, ...transactions]);
      setBalance(prev => prev - parseFloat(burnAmount));
      setCollateral(prev => prev - parseFloat(ethReturned));
      setBurnAmount('');
      setIsLoading(false);
      
      showNotification(`Successfully burned ${burnAmount} SNOW and withdrew ${ethReturned} ETH!`);
    }, 2000);
  };

  const formatAddress = (addr) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  const getStatusStyle = (status) => {
    switch(status) {
      case 'CONFIRMED': return styles.statusConfirmed;
      case 'PENDING': return styles.statusPending;
      case 'FAILED': return styles.statusFailed;
      default: return styles.statusConfirmed;
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.maxWidth}>
        <div style={styles.header}>
          <h1 style={styles.title}>SnowCoin Dashboard</h1>
          <p style={styles.subtitle}>Hybrid stablecoin backed by ETH on Sepolia testnet</p>
        </div>

        {notification && (
          <div style={{...styles.notification, ...(notification.type === 'success' ? styles.notificationSuccess : styles.notificationError)}}>
            <p style={notification.type === 'success' ? styles.notificationTextSuccess : styles.notificationTextError}>
              {notification.message}
            </p>
          </div>
        )}

        {!account ? (
          <div style={styles.card}>
            <div style={styles.flexBetween}>
              <div>
                <h3 style={styles.heading}>Connect Your Wallet</h3>
                <p style={styles.text}>Connect MetaMask to start using SnowCoin</p>
              </div>
              <button
                onClick={connectWallet}
                disabled={isConnecting}
                style={{...styles.buttonPrimary, ...(isConnecting ? styles.buttonDisabled : {})}}
                onMouseEnter={(e) => !isConnecting && (e.target.style.backgroundColor = styles.buttonPrimaryHover.backgroundColor)}
                onMouseLeave={(e) => !isConnecting && (e.target.style.backgroundColor = styles.buttonPrimary.backgroundColor)}
              >
                <Wallet style={{width: '1.25rem', height: '1.25rem'}} />
                {isConnecting ? 'Connecting...' : 'Connect Wallet'}
              </button>
            </div>
          </div>
        ) : (
          <div style={styles.cardCompact}>
            <div style={styles.flexBetween}>
              <div style={styles.flexCenter}>
                <div style={styles.avatar}>
                  <Wallet style={{width: '1.25rem', height: '1.25rem', color: '#2563eb'}} />
                </div>
                <div>
                  <p style={styles.labelText}>Connected Wallet</p>
                  <p style={styles.addressText}>{formatAddress(account)}</p>
                </div>
              </div>
              
              <div style={styles.flexCenter}>
                {isWrongNetwork && (
                  <button
                    onClick={switchToSepolia}
                    style={styles.buttonYellow}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#ca8a04'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#eab308'}
                  >
                    Switch to Sepolia
                  </button>
                )}
                <button
                  onClick={disconnectWallet}
                  style={styles.buttonGray}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#d1d5db'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#e5e7eb'}
                >
                  Disconnect
                </button>
              </div>
            </div>
            
            {isWrongNetwork && (
              <div style={styles.alert}>
                <AlertCircle style={{width: '1.25rem', height: '1.25rem', color: '#ca8a04'}} />
                <p style={styles.alertText}>Please switch to Sepolia testnet to use this dApp</p>
              </div>
            )}
          </div>
        )}

        {account && !isWrongNetwork && (
          <>
            <div style={styles.grid4}>
              <div style={styles.statCard}>
                <div style={styles.statHeader}>
                  <span style={styles.statLabel}>Stablecoin Balance</span>
                  <Wallet style={{width: '1.25rem', height: '1.25rem', color: '#2563eb'}} />
                </div>
                <p style={styles.statValue}>{balance.toFixed(2)}</p>
                <p style={styles.statUnit}>SNOW</p>
              </div>

              <div style={styles.statCard}>
                <div style={styles.statHeader}>
                  <span style={styles.statLabel}>Collateral</span>
                  <TrendingUp style={{width: '1.25rem', height: '1.25rem', color: '#9333ea'}} />
                </div>
                <p style={styles.statValue}>{collateral.toFixed(4)}</p>
                <p style={styles.statUnit}>ETH</p>
              </div>

              <div style={styles.statCard}>
                <div style={styles.statHeader}>
                  <span style={styles.statLabel}>Collateral Ratio</span>
                  <AlertCircle style={{width: '1.25rem', height: '1.25rem', color: '#16a34a'}} />
                </div>
                <p style={styles.statValue}>{collateralRatio}%</p>
                <p style={styles.statUnit}>Healthy</p>
              </div>

              <div style={styles.statCard}>
                <div style={styles.statHeader}>
                  <span style={styles.statLabel}>ETH Price</span>
                  <TrendingUp style={{width: '1.25rem', height: '1.25rem', color: '#ca8a04'}} />
                </div>
                <p style={styles.statValue}>${ethPrice}</p>
                <p style={styles.statUnit}>Live Price</p>
              </div>
            </div>

            <div style={styles.grid2}>
              <div style={styles.actionCard}>
                <div style={styles.actionHeader}>
                  <ArrowDownCircle style={{width: '1.5rem', height: '1.5rem', color: '#16a34a'}} />
                  <h2 style={styles.actionTitle}>Mint Stablecoins</h2>
                </div>
                
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Deposit ETH Amount</label>
                  <input
                    type="number"
                    value={ethAmount}
                    onChange={(e) => setEthAmount(e.target.value)}
                    placeholder="0.00"
                    step="0.01"
                    style={styles.input}
                  />
                </div>

                {calculatedMint > 0 && (
                  <div style={styles.previewGreen}>
                    <p style={styles.previewLabel}>You will receive:</p>
                    <p style={styles.previewValueGreen}>{calculatedMint} SNOW</p>
                    <p style={styles.previewNote}>At 150% collateralization ratio</p>
                  </div>
                )}

                <button
                  onClick={handleMint}
                  disabled={!ethAmount || ethAmount <= 0 || isLoading}
                  style={{...styles.buttonGreen, ...(!ethAmount || ethAmount <= 0 || isLoading ? styles.buttonDisabled : {})}}
                  onMouseEnter={(e) => !((!ethAmount || ethAmount <= 0 || isLoading)) && (e.target.style.backgroundColor = '#15803d')}
                  onMouseLeave={(e) => !((!ethAmount || ethAmount <= 0 || isLoading)) && (e.target.style.backgroundColor = '#16a34a')}
                >
                  {isLoading ? <><Loader style={{width: '1.25rem', height: '1.25rem', animation: 'spin 1s linear infinite'}} /> Processing...</> : 'Mint Stablecoins'}
                </button>
              </div>

              <div style={styles.actionCard}>
                <div style={styles.actionHeader}>
                  <ArrowUpCircle style={{width: '1.5rem', height: '1.5rem', color: '#dc2626'}} />
                  <h2 style={styles.actionTitle}>Burn & Withdraw</h2>
                </div>
                
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Stablecoin Amount</label>
                  <input
                    type="number"
                    value={burnAmount}
                    onChange={(e) => setBurnAmount(e.target.value)}
                    placeholder="0.00"
                    step="0.01"
                    max={balance}
                    style={styles.input}
                  />
                  <p style={{...styles.previewNote, marginTop: '0.25rem'}}>Available: {balance.toFixed(2)} SNOW</p>
                </div>

                {burnAmount > 0 && (
                  <div style={styles.previewRed}>
                    <p style={styles.previewLabel}>You will receive:</p>
                    <p style={styles.previewValueRed}>{(burnAmount * 1.5 / ethPrice).toFixed(4)} ETH</p>
                    <p style={styles.previewNote}>Including your collateral</p>
                  </div>
                )}

                <button
                  onClick={handleBurn}
                  disabled={!burnAmount || burnAmount <= 0 || burnAmount > balance || isLoading}
                  style={{...styles.buttonRed, ...(!burnAmount || burnAmount <= 0 || burnAmount > balance || isLoading ? styles.buttonDisabled : {})}}
                  onMouseEnter={(e) => !(!burnAmount || burnAmount <= 0 || burnAmount > balance || isLoading) && (e.target.style.backgroundColor = '#b91c1c')}
                  onMouseLeave={(e) => !(!burnAmount || burnAmount <= 0 || burnAmount > balance || isLoading) && (e.target.style.backgroundColor = '#dc2626')}
                >
                  {isLoading ? <><Loader style={{width: '1.25rem', height: '1.25rem', animation: 'spin 1s linear infinite'}} /> Processing...</> : 'Burn & Withdraw'}
                </button>
              </div>
            </div>

            <div style={styles.historyCard}>
              <h2 style={styles.historyTitle}>Transaction History</h2>
              
              <div style={styles.tableContainer}>
                <table style={styles.table}>
                  <thead style={styles.tableHeader}>
                    <tr>
                      <th style={styles.th}>Type</th>
                      <th style={styles.th}>Amount</th>
                      <th style={styles.th}>ETH</th>
                      <th style={styles.th}>Status</th>
                      <th style={styles.th}>Date</th>
                      <th style={styles.th}>Tx Hash</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((tx) => (
                      <tr key={tx.id} style={styles.tr}>
                        <td style={styles.td}>
                          <span style={tx.type === 'MINT' ? styles.badgeMint : styles.badgeBurn}>
                            {tx.type}
                          </span>
                        </td>
                        <td style={{...styles.td, fontWeight: '500'}}>{tx.amount} SNOW</td>
                        <td style={styles.td}>{tx.eth} ETH</td>
                        <td style={styles.td}>
                          <span style={getStatusStyle(tx.status)}>
                            {tx.status}
                          </span>
                        </td>
                        <td style={{...styles.td, ...styles.labelText}}>{tx.date}</td>
                        <td style={styles.td}>
                          <a 
                            href={`https://sepolia.etherscan.io/tx/${tx.hash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={styles.link}
                          >
                            {formatAddress(tx.hash)}
                            <ExternalLink style={{width: '0.75rem', height: '0.75rem'}} />
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {transactions.length === 0 && (
                <div style={styles.emptyState}>
                  No transactions yet. Mint your first stablecoins above!
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SNOWXDashboard;