import React, { useState, useEffect } from 'react';

// Dark theme colors (matching your trading terminal)
const darkTheme = {
  bg: {
    primary: '#0a0e1a',
    secondary: '#121827',
    tertiary: '#1a2234',
    elevated: '#1e2740'
  },
  blue: {
    400: '#4da9ff',
    500: '#0077e6',
    600: '#005db3'
  },
  accent: {
    green: '#10b981',
    red: '#ef4444',
    orange: '#f59e0b',
    cyan: '#00d4ff'
  },
  text: {
    primary: '#e5e7eb',
    secondary: '#9ca3af',
    tertiary: '#6b7280'
  },
  border: {
    light: '#1f2937',
    medium: '#374151'
  }
};

const styles = {
  container: {
    background: darkTheme.bg.elevated,
    borderRadius: '15px',
    padding: '25px',
    marginBottom: '25px',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
    border: `1px solid ${darkTheme.border.medium}`
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px'
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: darkTheme.blue[400],
    margin: 0
  },
  sectorBadge: {
    display: 'inline-block',
    padding: '8px 16px',
    borderRadius: '20px',
    fontSize: '0.9rem',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  gaugeContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '25px'
  },
  gaugeOuter: {
    width: '200px',
    height: '200px',
    borderRadius: '50%',
    background: `conic-gradient(from 0deg, ${darkTheme.accent.red} 0%, ${darkTheme.accent.orange} 50%, ${darkTheme.accent.green} 100%)`,
    padding: '10px',
    position: 'relative',
    marginBottom: '15px'
  },
  gaugeInner: {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    background: darkTheme.bg.tertiary,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
  },
  gaugeValue: {
    fontSize: '3rem',
    fontWeight: '800',
    marginBottom: '5px'
  },
  gaugeLabel: {
    fontSize: '0.9rem',
    color: darkTheme.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: '1px'
  },
  signalsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '15px',
    marginBottom: '20px'
  },
  signalCard: {
    background: darkTheme.bg.tertiary,
    padding: '15px',
    borderRadius: '10px',
    border: `1px solid ${darkTheme.border.light}`
  },
  signalName: {
    fontSize: '0.85rem',
    color: darkTheme.text.tertiary,
    textTransform: 'uppercase',
    marginBottom: '8px',
    fontWeight: '600',
    letterSpacing: '0.5px'
  },
  signalValue: {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: darkTheme.text.primary
  },
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '15px',
    marginTop: '20px',
    paddingTop: '20px',
    borderTop: `1px solid ${darkTheme.border.medium}`
  },
  metricCard: {
    textAlign: 'center'
  },
  metricValue: {
    fontSize: '1.5rem',
    fontWeight: '700',
    marginBottom: '5px'
  },
  metricLabel: {
    fontSize: '0.8rem',
    color: darkTheme.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  refreshButton: {
    padding: '10px 20px',
    background: `linear-gradient(135deg, ${darkTheme.blue[500]} 0%, ${darkTheme.blue[600]} 100%)`,
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '600',
    transition: 'all 0.3s ease'
  },
  loadingSpinner: {
    width: '30px',
    height: '30px',
    border: `3px solid ${darkTheme.border.medium}`,
    borderTop: `3px solid ${darkTheme.blue[500]}`,
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    margin: '20px auto'
  },
  recommendationBanner: {
    padding: '15px 20px',
    borderRadius: '12px',
    marginBottom: '20px',
    fontSize: '1.1rem',
    fontWeight: '700',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: '1px'
  },
  comparisonContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '15px',
    marginTop: '20px'
  },
  comparisonCard: {
    background: darkTheme.bg.tertiary,
    padding: '20px',
    borderRadius: '12px',
    border: `1px solid ${darkTheme.border.light}`
  },
  comparisonTitle: {
    fontSize: '1.1rem',
    fontWeight: '700',
    marginBottom: '15px',
    textAlign: 'center'
  },
  confidenceBar: {
    height: '30px',
    borderRadius: '15px',
    overflow: 'hidden',
    background: darkTheme.bg.secondary,
    position: 'relative',
    marginBottom: '10px'
  },
  confidenceFill: {
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontWeight: '700',
    fontSize: '0.9rem',
    transition: 'width 0.5s ease'
  }
};

export default function SectorStrengthIndicator({ ticker, assetName, onSignal }) {
  const BACKEND_API_URL = 'https://backend-production-c0ab.up.railway.app';
  
  const [loading, setLoading] = useState(false);
  const [sectorData, setSectorData] = useState(null);
  const [error, setError] = useState('');
  const [autoRefresh, setAutoRefresh] = useState(true);

  const fetchSectorAnalysis = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(
        `${BACKEND_API_URL}/api/snowai-get-sector-sentiment-analysis/?ticker=${ticker}&top_n=20&use_cache=true`
      );
      
      const result = await response.json();
      
      if (result.success) {
        setSectorData(result);
        
        // Trigger signal callback if provided
        if (onSignal && result.recommendation) {
          onSignal({
            signal: result.recommendation,
            confidence: result.bullish.confidence > result.bearish.confidence 
              ? result.bullish.confidence 
              : result.bearish.confidence,
            sector: result.sector
          });
        }
      } else {
        setError(result.error || 'Failed to fetch sector analysis');
      }
    } catch (err) {
      console.error('Error fetching sector analysis:', err);
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (ticker) {
      fetchSectorAnalysis();
    }
  }, [ticker]);

  useEffect(() => {
    if (autoRefresh && ticker) {
      const interval = setInterval(() => {
        fetchSectorAnalysis();
      }, 300000); // Refresh every 5 minutes
      
      return () => clearInterval(interval);
    }
  }, [autoRefresh, ticker]);

  const getConfidenceColor = (confidence) => {
    if (confidence >= 70) return darkTheme.accent.green;
    if (confidence >= 60) return darkTheme.accent.cyan;
    if (confidence >= 50) return darkTheme.accent.orange;
    return darkTheme.accent.red;
  };

  const getRecommendationStyle = (rec) => {
    const baseStyle = { ...styles.recommendationBanner };
    
    switch (rec) {
      case 'STRONG_BUY':
        return { ...baseStyle, background: darkTheme.accent.green, color: 'white' };
      case 'BUY':
        return { ...baseStyle, background: `${darkTheme.accent.green}80`, color: 'white' };
      case 'STRONG_SELL':
        return { ...baseStyle, background: darkTheme.accent.red, color: 'white' };
      case 'SELL':
        return { ...baseStyle, background: `${darkTheme.accent.red}80`, color: 'white' };
      case 'HOLD_RANGING':
        return { ...baseStyle, background: darkTheme.accent.orange, color: 'white' };
      default:
        return { ...baseStyle, background: darkTheme.bg.tertiary, color: darkTheme.text.secondary };
    }
  };

  if (error) {
    return (
      <div style={styles.container}>
        <div style={{ color: darkTheme.accent.red, textAlign: 'center', padding: '20px' }}>
          ⚠️ {error}
        </div>
      </div>
    );
  }

  if (loading && !sectorData) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingSpinner}></div>
        <p style={{ textAlign: 'center', color: darkTheme.text.secondary }}>
          Analyzing sector strength...
        </p>
      </div>
    );
  }

  if (!sectorData) {
    return null;
  }

  const { bullish, bearish, ranging, sector, recommendation } = sectorData;
  const dominantConfidence = Math.max(bullish.confidence, bearish.confidence);
  const dominantSentiment = bullish.confidence > bearish.confidence ? 'BULLISH' : 'BEARISH';

  return (
    <div style={styles.container}>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          .refresh-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(0, 119, 230, 0.4);
          }
        `}
      </style>
      
      <div style={styles.header}>
        <h3 style={styles.title}>
          📊 Sector Strength: {sector}
        </h3>
        <button
          className="refresh-button"
          style={styles.refreshButton}
          onClick={fetchSectorAnalysis}
          disabled={loading}
        >
          {loading ? '⏳' : '🔄'} Refresh
        </button>
      </div>
      
      {/* Recommendation Banner */}
      <div style={getRecommendationStyle(recommendation)}>
        {recommendation.replace('_', ' ')}
      </div>
      
      {/* Main Gauge */}
      <div style={styles.gaugeContainer}>
        <div style={styles.gaugeOuter}>
          <div style={styles.gaugeInner}>
            <div style={{ 
              ...styles.gaugeValue, 
              color: getConfidenceColor(dominantConfidence) 
            }}>
              {dominantConfidence.toFixed(0)}%
            </div>
            <div style={styles.gaugeLabel}>{dominantSentiment}</div>
          </div>
        </div>
        
        <span style={{
          ...styles.sectorBadge,
          background: dominantSentiment === 'BULLISH' 
            ? `${darkTheme.accent.green}20` 
            : `${darkTheme.accent.red}20`,
          color: dominantSentiment === 'BULLISH' 
            ? darkTheme.accent.green 
            : darkTheme.accent.red,
          border: `2px solid ${dominantSentiment === 'BULLISH' ? darkTheme.accent.green : darkTheme.accent.red}`
        }}>
          {assetName} • {ticker}
        </span>
      </div>
      
      {/* Bullish vs Bearish Comparison */}
      <div style={styles.comparisonContainer}>
        <div style={styles.comparisonCard}>
          <div style={{ 
            ...styles.comparisonTitle, 
            color: darkTheme.accent.green 
          }}>
            🟢 Bullish Signals
          </div>
          
          <div style={styles.confidenceBar}>
            <div style={{
              ...styles.confidenceFill,
              width: `${bullish.confidence}%`,
              background: `linear-gradient(90deg, ${darkTheme.accent.green} 0%, #059669 100%)`
            }}>
              {bullish.confidence.toFixed(1)}%
            </div>
          </div>
          
          <div style={{ fontSize: '0.85rem', color: darkTheme.text.secondary, marginTop: '10px' }}>
            {Object.entries(bullish.signals).slice(0, 3).map(([key, value]) => (
              <div key={key} style={{ marginBottom: '5px' }}>
                <strong>{key}:</strong> {value}
              </div>
            ))}
          </div>
        </div>
        
        <div style={styles.comparisonCard}>
          <div style={{ 
            ...styles.comparisonTitle, 
            color: darkTheme.accent.red 
          }}>
            🔴 Bearish Signals
          </div>
          
          <div style={styles.confidenceBar}>
            <div style={{
              ...styles.confidenceFill,
              width: `${bearish.confidence}%`,
              background: `linear-gradient(90deg, ${darkTheme.accent.red} 0%, #dc2626 100%)`
            }}>
              {bearish.confidence.toFixed(1)}%
            </div>
          </div>
          
          <div style={{ fontSize: '0.85rem', color: darkTheme.text.secondary, marginTop: '10px' }}>
            {Object.entries(bearish.signals).slice(0, 3).map(([key, value]) => (
              <div key={key} style={{ marginBottom: '5px' }}>
                <strong>{key}:</strong> {value}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Detailed Signals */}
      <div style={styles.signalsContainer}>
        <div style={styles.signalCard}>
          <div style={styles.signalName}>RSI</div>
          <div style={{ 
            ...styles.signalValue, 
            color: getConfidenceColor(bullish.analysis.weighted_rsi) 
          }}>
            {bullish.analysis.weighted_rsi.toFixed(2)}
          </div>
        </div>
        
        <div style={styles.signalCard}>
          <div style={styles.signalName}>20-Day Momentum</div>
          <div style={{ 
            ...styles.signalValue, 
            color: bullish.analysis.weighted_momentum_20d >= 0 
              ? darkTheme.accent.green 
              : darkTheme.accent.red 
          }}>
            {bullish.analysis.weighted_momentum_20d >= 0 ? '+' : ''}
            {bullish.analysis.weighted_momentum_20d.toFixed(2)}%
          </div>
        </div>
        
        <div style={styles.signalCard}>
          <div style={styles.signalName}>Above SMA20</div>
          <div style={{ 
            ...styles.signalValue, 
            color: getConfidenceColor(bullish.analysis.pct_above_sma20) 
          }}>
            {bullish.analysis.pct_above_sma20.toFixed(0)}%
          </div>
        </div>
        
        <div style={styles.signalCard}>
          <div style={styles.signalName}>Above SMA50</div>
          <div style={{ 
            ...styles.signalValue, 
            color: getConfidenceColor(bullish.analysis.pct_above_sma50) 
          }}>
            {bullish.analysis.pct_above_sma50.toFixed(0)}%
          </div>
        </div>
      </div>
      
      {/* Sector Metrics */}
      <div style={styles.metricsGrid}>
        <div style={styles.metricCard}>
          <div style={{ ...styles.metricValue, color: darkTheme.blue[400] }}>
            {bullish.analysis.total_stocks_analyzed}
          </div>
          <div style={styles.metricLabel}>Stocks Analyzed</div>
        </div>
        
        <div style={styles.metricCard}>
          <div style={{ ...styles.metricValue, color: darkTheme.accent.cyan }}>
            ${(bullish.analysis.total_market_cap / 1e12).toFixed(2)}T
          </div>
          <div style={styles.metricLabel}>Market Cap</div>
        </div>
        
        <div style={styles.metricCard}>
          <div style={{ ...styles.metricValue, color: darkTheme.accent.orange }}>
            {ranging.confidence.toFixed(0)}%
          </div>
          <div style={styles.metricLabel}>Ranging Probability</div>
        </div>
        
        <div style={styles.metricCard}>
          <div style={{ ...styles.metricValue, color: darkTheme.accent.green }}>
            {bullish.analysis.pct_bullish_macd.toFixed(0)}%
          </div>
          <div style={styles.metricLabel}>Bullish MACD</div>
        </div>
      </div>
    </div>
  );
}
