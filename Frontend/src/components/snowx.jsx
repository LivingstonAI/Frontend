import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const SNOWXDashboard = () => {
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState('0');
  const [stakedBalance, setStakedBalance] = useState('0');
  const [accessTier, setAccessTier] = useState(0);
  const [pendingRewards, setPendingRewards] = useState({ usdc: '0', usdt: '0' });
  const [stakeAmount, setStakeAmount] = useState('');
  const [unstakeAmount, setUnstakeAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [txStatus, setTxStatus] = useState('');

  // Contract addresses (replace with your actual deployed addresses)
  const SNOWX_TOKEN = '0x...'; // Your SNOWX token address
  const TREASURY = '0x...'; // Your treasury address
  const USDC = '0xaf88d065e77c8cC2239327C5EDb3A432268e5831';
  const USDT = '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9';

  const SNOWX_ABI = [
    'function balanceOf(address) view returns (uint256)',
    'function approve(address spender, uint256 amount) returns (bool)',
    'function getAccessTier(address) view returns (uint8)',
    'function transfer(address to, uint256 amount) returns (bool)'
  ];

  const TREASURY_ABI = [
    'function stakedBalance(address) view returns (uint256)',
    'function pendingRewards(address user, address token) view returns (uint256)',
    'function stake(uint256 amount)',
    'function unstake(uint256 amount)',
    'function claimRewards()'
  ];

  useEffect(() => {
    checkWalletConnection();
  }, []);

  useEffect(() => {
    if (account) {
      loadUserData();
      const interval = setInterval(loadUserData, 15000);
      return () => clearInterval(interval);
    }
  }, [account]);

  const checkWalletConnection = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const accounts = await provider.listAccounts();
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        }
      } catch (error) {
        console.error('Error checking wallet:', error);
      }
    }
  };

  const connectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      alert('Please install MetaMask to use this feature');
      return;
    }

    try {
      setLoading(true);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send('eth_requestAccounts', []);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      setAccount(address);
      setTxStatus('Wallet connected!');
      setTimeout(() => setTxStatus(''), 3000);
    } catch (error) {
      console.error('Error connecting wallet:', error);
      setTxStatus('Failed to connect wallet');
    } finally {
      setLoading(false);
    }
  };

  const loadUserData = async () => {
    if (!account) return;

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const snowxContract = new ethers.Contract(SNOWX_TOKEN, SNOWX_ABI, provider);
      const treasuryContract = new ethers.Contract(TREASURY, TREASURY_ABI, provider);

      const [bal, staked, tier, usdcRewards, usdtRewards] = await Promise.all([
        snowxContract.balanceOf(account),
        treasuryContract.stakedBalance(account),
        snowxContract.getAccessTier(account),
        treasuryContract.pendingRewards(account, USDC),
        treasuryContract.pendingRewards(account, USDT)
      ]);

      setBalance(ethers.utils.formatEther(bal));
      setStakedBalance(ethers.utils.formatEther(staked));
      setAccessTier(tier);
      setPendingRewards({
        usdc: ethers.utils.formatUnits(usdcRewards, 6),
        usdt: ethers.utils.formatUnits(usdtRewards, 6)
      });
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const handleStake = async () => {
    if (!stakeAmount || parseFloat(stakeAmount) <= 0) {
      setTxStatus('Please enter a valid amount');
      return;
    }

    try {
      setLoading(true);
      setTxStatus('Approving SNOWX...');

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const snowxContract = new ethers.Contract(SNOWX_TOKEN, SNOWX_ABI, signer);
      const treasuryContract = new ethers.Contract(TREASURY, TREASURY_ABI, signer);

      const amount = ethers.utils.parseEther(stakeAmount);

      const approveTx = await snowxContract.approve(TREASURY, amount);
      setTxStatus('Approval pending...');
      await approveTx.wait();

      setTxStatus('Staking tokens...');
      const stakeTx = await treasuryContract.stake(amount);
      await stakeTx.wait();

      setTxStatus('Stake successful!');
      setStakeAmount('');
      await loadUserData();
      setTimeout(() => setTxStatus(''), 3000);
    } catch (error) {
      console.error('Stake error:', error);
      setTxStatus(error.message || 'Stake failed');
    } finally {
      setLoading(false);
    }
  };

  const handleUnstake = async () => {
    if (!unstakeAmount || parseFloat(unstakeAmount) <= 0) {
      setTxStatus('Please enter a valid amount');
      return;
    }

    try {
      setLoading(true);
      setTxStatus('Unstaking tokens...');

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const treasuryContract = new ethers.Contract(TREASURY, TREASURY_ABI, signer);

      const amount = ethers.utils.parseEther(unstakeAmount);
      const unstakeTx = await treasuryContract.unstake(amount);
      await unstakeTx.wait();

      setTxStatus('Unstake successful!');
      setUnstakeAmount('');
      await loadUserData();
      setTimeout(() => setTxStatus(''), 3000);
    } catch (error) {
      console.error('Unstake error:', error);
      setTxStatus(error.message || 'Unstake failed');
    } finally {
      setLoading(false);
    }
  };

  const handleClaimRewards = async () => {
    try {
      setLoading(true);
      setTxStatus('Claiming rewards...');

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const treasuryContract = new ethers.Contract(TREASURY, TREASURY_ABI, signer);

      const claimTx = await treasuryContract.claimRewards();
      await claimTx.wait();

      setTxStatus('Rewards claimed!');
      await loadUserData();
      setTimeout(() => setTxStatus(''), 3000);
    } catch (error) {
      console.error('Claim error:', error);
      setTxStatus(error.message || 'Claim failed');
    } finally {
      setLoading(false);
    }
  };

  const getTierInfo = (tier) => {
    const tiers = {
      0: { name: 'Free', color: '#6b7280', features: 'No access' },
      1: { name: 'Basic', color: '#3b82f6', features: 'Basic signals, Market overview' },
      2: { name: 'Premium', color: '#8b5cf6', features: 'Advanced analytics, Backtesting' },
      3: { name: 'Elite', color: '#f59e0b', features: 'Real-time AI, Custom models, API access' }
    };
    return tiers[tier] || tiers[0];
  };

  const formatNumber = (num) => {
    return parseFloat(num).toLocaleString('en-US', { maximumFractionDigits: 2 });
  };

  const styles = {
    container: {
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      maxWidth: '1400px',
      margin: '0 auto',
      padding: '20px',
      backgroundColor: '#0a0e1a',
      color: '#ffffff',
      minHeight: '100vh'
    },
    header: {
      marginBottom: '32px',
      textAlign: 'center'
    },
    title: {
      fontSize: 'clamp(24px, 5vw, 36px)',
      fontWeight: '700',
      marginBottom: '8px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text'
    },
    subtitle: {
      fontSize: '14px',
      color: '#9ca3af',
      marginBottom: '24px'
    },
    connectButton: {
      backgroundColor: '#667eea',
      color: 'white',
      border: 'none',
      padding: '12px 32px',
      fontSize: '16px',
      fontWeight: '600',
      borderRadius: '12px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'inline-block',
      boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '20px',
      marginBottom: '32px'
    },
    card: {
      backgroundColor: '#1a1f2e',
      borderRadius: '16px',
      padding: '24px',
      border: '1px solid #2d3748',
      transition: 'all 0.3s ease'
    },
    cardHover: {
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)'
    },
    cardTitle: {
      fontSize: '14px',
      color: '#9ca3af',
      marginBottom: '8px',
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
    },
    cardValue: {
      fontSize: 'clamp(24px, 4vw, 32px)',
      fontWeight: '700',
      marginBottom: '8px'
    },
    cardSubtext: {
      fontSize: '13px',
      color: '#6b7280'
    },
    tierBadge: {
      display: 'inline-block',
      padding: '6px 16px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '600',
      marginTop: '8px'
    },
    actionSection: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
      gap: '24px',
      marginBottom: '32px'
    },
    actionCard: {
      backgroundColor: '#1a1f2e',
      borderRadius: '16px',
      padding: '24px',
      border: '1px solid #2d3748'
    },
    actionTitle: {
      fontSize: '18px',
      fontWeight: '600',
      marginBottom: '16px',
      color: '#f3f4f6'
    },
    inputGroup: {
      marginBottom: '16px'
    },
    label: {
      display: 'block',
      fontSize: '13px',
      color: '#9ca3af',
      marginBottom: '8px'
    },
    input: {
      width: '100%',
      padding: '12px 16px',
      backgroundColor: '#0f1419',
      border: '1px solid #374151',
      borderRadius: '8px',
      color: '#ffffff',
      fontSize: '16px',
      boxSizing: 'border-box',
      outline: 'none',
      transition: 'border-color 0.3s ease'
    },
    button: {
      width: '100%',
      padding: '12px',
      backgroundColor: '#667eea',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '15px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      marginTop: '8px'
    },
    buttonSecondary: {
      backgroundColor: '#4c1d95',
      marginTop: '8px'
    },
    buttonDisabled: {
      backgroundColor: '#374151',
      cursor: 'not-allowed',
      opacity: 0.6
    },
    rewardsCard: {
      backgroundColor: '#1a1f2e',
      borderRadius: '16px',
      padding: '24px',
      border: '1px solid #2d3748'
    },
    rewardItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '12px 0',
      borderBottom: '1px solid #2d3748'
    },
    rewardLabel: {
      fontSize: '14px',
      color: '#9ca3af'
    },
    rewardValue: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#10b981'
    },
    statusMessage: {
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      backgroundColor: '#1a1f2e',
      color: '#ffffff',
      padding: '16px 24px',
      borderRadius: '12px',
      border: '1px solid #667eea',
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
      zIndex: 1000,
      maxWidth: 'calc(100vw - 48px)',
      fontSize: '14px'
    },
    walletInfo: {
      backgroundColor: '#1a1f2e',
      borderRadius: '12px',
      padding: '12px 20px',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '12px',
      border: '1px solid #2d3748',
      marginBottom: '24px',
      fontSize: '14px'
    },
    dot: {
      width: '8px',
      height: '8px',
      borderRadius: '50%',
      backgroundColor: '#10b981'
    },
    featuresText: {
      fontSize: '12px',
      color: '#9ca3af',
      marginTop: '8px',
      lineHeight: '1.6'
    },
    '@media (max-width: 768px)': {
      container: {
        padding: '16px'
      },
      grid: {
        gridTemplateColumns: '1fr',
        gap: '16px'
      },
      actionSection: {
        gridTemplateColumns: '1fr'
      },
      card: {
        padding: '20px'
      },
      actionCard: {
        padding: '20px'
      }
    }
  };

  const tierInfo = getTierInfo(accessTier);

  if (!account) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>❄️ SNOWX Dashboard</h1>
          <p style={styles.subtitle}>Stake SNOWX • Access AI Signals • Earn Trading Profits</p>
          <button 
            style={styles.connectButton}
            onClick={connectWallet}
            disabled={loading}
          >
            {loading ? 'Connecting...' : 'Connect Wallet'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>❄️ SNOWX Dashboard</h1>
        <p style={styles.subtitle}>Stake SNOWX • Access AI Signals • Earn Trading Profits</p>
        
        <div style={styles.walletInfo}>
          <div style={styles.dot}></div>
          <span>{account.slice(0, 6)}...{account.slice(-4)}</span>
        </div>
      </div>

      <div style={styles.grid}>
        <div style={styles.card}>
          <div style={styles.cardTitle}>Wallet Balance</div>
          <div style={styles.cardValue}>{formatNumber(balance)}</div>
          <div style={styles.cardSubtext}>SNOWX</div>
        </div>

        <div style={styles.card}>
          <div style={styles.cardTitle}>Staked Balance</div>
          <div style={styles.cardValue}>{formatNumber(stakedBalance)}</div>
          <div style={styles.cardSubtext}>SNOWX earning rewards</div>
        </div>

        <div style={styles.card}>
          <div style={styles.cardTitle}>Access Tier</div>
          <div style={styles.cardValue}>{tierInfo.name}</div>
          <div 
            style={{
              ...styles.tierBadge,
              backgroundColor: `${tierInfo.color}22`,
              color: tierInfo.color,
              border: `1px solid ${tierInfo.color}`
            }}
          >
            Tier {accessTier}
          </div>
          <div style={styles.featuresText}>{tierInfo.features}</div>
        </div>

        <div style={styles.card}>
          <div style={styles.cardTitle}>Total Value Staked</div>
          <div style={styles.cardValue}>
            ${formatNumber((parseFloat(balance) + parseFloat(stakedBalance)) * 0.10)}
          </div>
          <div style={styles.cardSubtext}>@ $0.10 per SNOWX</div>
        </div>
      </div>

      <div style={styles.actionSection}>
        <div style={styles.actionCard}>
          <div style={styles.actionTitle}>💎 Stake SNOWX</div>
          <p style={{ fontSize: '13px', color: '#9ca3af', marginBottom: '16px' }}>
            Stake tokens to earn trading profits and unlock AI features
          </p>
          
          <div style={styles.inputGroup}>
            <label style={styles.label}>Amount to Stake</label>
            <input
              type="number"
              style={styles.input}
              placeholder="0.00"
              value={stakeAmount}
              onChange={(e) => setStakeAmount(e.target.value)}
              disabled={loading}
            />
          </div>

          <button
            style={{
              ...styles.button,
              ...(loading ? styles.buttonDisabled : {})
            }}
            onClick={handleStake}
            disabled={loading || !stakeAmount}
            onMouseEnter={(e) => {
              if (!loading && stakeAmount) {
                e.target.style.backgroundColor = '#5568d3';
                e.target.style.transform = 'translateY(-1px)';
              }
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#667eea';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            {loading ? 'Processing...' : 'Stake Tokens'}
          </button>

          <button
            style={{
              ...styles.button,
              ...styles.buttonSecondary,
              ...(loading ? styles.buttonDisabled : {})
            }}
            onClick={() => setStakeAmount(balance)}
            disabled={loading}
            onMouseEnter={(e) => {
              if (!loading) {
                e.target.style.backgroundColor = '#5b21b6';
              }
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#4c1d95';
            }}
          >
            Stake Max
          </button>
        </div>

        <div style={styles.actionCard}>
          <div style={styles.actionTitle}>💸 Unstake SNOWX</div>
          <p style={{ fontSize: '13px', color: '#9ca3af', marginBottom: '16px' }}>
            Withdraw staked tokens (claims pending rewards automatically)
          </p>
          
          <div style={styles.inputGroup}>
            <label style={styles.label}>Amount to Unstake</label>
            <input
              type="number"
              style={styles.input}
              placeholder="0.00"
              value={unstakeAmount}
              onChange={(e) => setUnstakeAmount(e.target.value)}
              disabled={loading}
            />
          </div>

          <button
            style={{
              ...styles.button,
              ...(loading ? styles.buttonDisabled : {})
            }}
            onClick={handleUnstake}
            disabled={loading || !unstakeAmount}
            onMouseEnter={(e) => {
              if (!loading && unstakeAmount) {
                e.target.style.backgroundColor = '#5568d3';
                e.target.style.transform = 'translateY(-1px)';
              }
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#667eea';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            {loading ? 'Processing...' : 'Unstake Tokens'}
          </button>

          <button
            style={{
              ...styles.button,
              ...styles.buttonSecondary,
              ...(loading ? styles.buttonDisabled : {})
            }}
            onClick={() => setUnstakeAmount(stakedBalance)}
            disabled={loading}
            onMouseEnter={(e) => {
              if (!loading) {
                e.target.style.backgroundColor = '#5b21b6';
              }
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#4c1d95';
            }}
          >
            Unstake All
          </button>
        </div>
      </div>

      <div style={styles.rewardsCard}>
        <div style={styles.actionTitle}>🎁 Pending Rewards</div>
        <p style={{ fontSize: '13px', color: '#9ca3af', marginBottom: '16px' }}>
          Your share of SnowAI trading profits
        </p>

        <div style={styles.rewardItem}>
          <span style={styles.rewardLabel}>USDC Rewards</span>
          <span style={styles.rewardValue}>${formatNumber(pendingRewards.usdc)}</span>
        </div>

        <div style={styles.rewardItem}>
          <span style={styles.rewardLabel}>USDT Rewards</span>
          <span style={styles.rewardValue}>${formatNumber(pendingRewards.usdt)}</span>
        </div>

        <div style={{ ...styles.rewardItem, borderBottom: 'none', paddingTop: '16px' }}>
          <span style={{ fontSize: '16px', fontWeight: '600' }}>Total Rewards</span>
          <span style={{ fontSize: '20px', fontWeight: '700', color: '#10b981' }}>
            ${formatNumber(parseFloat(pendingRewards.usdc) + parseFloat(pendingRewards.usdt))}
          </span>
        </div>

        <button
          style={{
            ...styles.button,
            ...(loading ? styles.buttonDisabled : {}),
            marginTop: '16px'
          }}
          onClick={handleClaimRewards}
          disabled={loading || (parseFloat(pendingRewards.usdc) === 0 && parseFloat(pendingRewards.usdt) === 0)}
          onMouseEnter={(e) => {
            if (!loading && (parseFloat(pendingRewards.usdc) > 0 || parseFloat(pendingRewards.usdt) > 0)) {
              e.target.style.backgroundColor = '#5568d3';
              e.target.style.transform = 'translateY(-1px)';
            }
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = '#667eea';
            e.target.style.transform = 'translateY(0)';
          }}
        >
          {loading ? 'Processing...' : 'Claim All Rewards'}
        </button>
      </div>

      {txStatus && (
        <div style={styles.statusMessage}>
          {txStatus}
        </div>
      )}
    </div>
  );
};

export default SNOWXDashboard;