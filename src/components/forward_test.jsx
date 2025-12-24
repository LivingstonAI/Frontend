import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine, ResponsiveContainer, ComposedChart, Bar, Scatter } from 'recharts';
import { TrendingUp, TrendingDown, Plus, X, Edit2, Trash2, Activity, DollarSign, Percent, BarChart3, CandlestickChart, Search, Filter, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import Header from "./header";
import SideNavs from "./side_navs";

const styles = {
  container: {
    fontFamily: 'system-ui, -apple-system, sans-serif',
    backgroundColor: '#ffffff',
    minHeight: '100vh',
    color: '#1e293b',
    padding: '20px'
  },
  header: {
    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
    padding: '30px',
    borderRadius: '16px',
    marginBottom: '30px',
    boxShadow: '0 10px 40px rgba(59, 130, 246, 0.3)'
  },
  headerTitle: {
    fontSize: '32px',
    fontWeight: '700',
    margin: '0 0 10px 0',
    color: '#fff'
  },
  headerSubtitle: {
    fontSize: '16px',
    color: 'rgba(255, 255, 255, 0.8)',
    margin: 0
  },
  searchAndFilterBar: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '20px',
    border: '2px solid #e5e7eb',
    marginBottom: '30px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
  },
  searchBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '16px'
  },
  searchInput: {
    flex: 1,
    padding: '12px 16px 12px 44px',
    borderRadius: '8px',
    border: '2px solid #e5e7eb',
    fontSize: '14px',
    backgroundColor: '#f8fafc',
    position: 'relative'
  },
  searchInputWrapper: {
    position: 'relative',
    flex: 1
  },
  searchIcon: {
    position: 'absolute',
    left: '14px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#64748b',
    pointerEvents: 'none'
  },
  filterRow: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
    alignItems: 'center'
  },
  filterGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  filterLabel: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#64748b',
    whiteSpace: 'nowrap'
  },
  filterSelect: {
    padding: '8px 12px',
    borderRadius: '6px',
    border: '2px solid #e5e7eb',
    fontSize: '13px',
    backgroundColor: '#ffffff',
    color: '#1e293b',
    cursor: 'pointer'
  },
  sortButton: {
    padding: '8px 16px',
    borderRadius: '6px',
    border: '2px solid #e5e7eb',
    backgroundColor: '#ffffff',
    color: '#1e293b',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    transition: 'all 0.2s ease'
  },
  sortButtonActive: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
    color: '#fff'
  },
  statsBar: {
    display: 'flex',
    gap: '16px',
    flexWrap: 'wrap',
    marginTop: '16px',
    paddingTop: '16px',
    borderTop: '1px solid #e5e7eb'
  },
  statChip: {
    padding: '6px 12px',
    borderRadius: '6px',
    backgroundColor: '#f1f5f9',
    fontSize: '13px',
    color: '#64748b',
    fontWeight: '500'
  },
  mainGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '20px',
    marginBottom: '30px'
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '24px',
    border: '2px solid #e5e7eb',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
  },
  cardHover: {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 24px rgba(59, 130, 246, 0.2)',
    borderColor: '#3b82f6'
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px'
  },
  modelName: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#1e293b',
    margin: 0
  },
  badge: {
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600'
  },
  badgeActive: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    color: '#10b981'
  },
  badgeInactive: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    color: '#ef4444'
  },
  statRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 0',
    borderBottom: '1px solid #e5e7eb'
  },
  statLabel: {
    color: '#64748b',
    fontSize: '14px'
  },
  statValue: {
    color: '#1e293b',
    fontSize: '16px',
    fontWeight: '600'
  },
  positiveValue: {
    color: '#10b981'
  },
  negativeValue: {
    color: '#ef4444'
  },
  button: {
    padding: '12px 24px',
    borderRadius: '8px',
    border: 'none',
    fontWeight: '600',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px'
  },
  buttonPrimary: {
    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
    color: '#fff'
  },
  buttonSecondary: {
    backgroundColor: '#f1f5f9',
    color: '#1e293b',
    border: '1px solid #e5e7eb'
  },
  buttonDanger: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    color: '#ef4444',
    border: '1px solid #ef4444'
  },
  modal: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px'
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '32px',
    maxWidth: '900px',
    width: '100%',
    maxHeight: '90vh',
    overflow: 'auto',
    border: '1px solid #e5e7eb',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px'
  },
  modalTitle: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#1e293b',
    margin: 0
  },
  closeButton: {
    background: 'none',
    border: 'none',
    color: '#64748b',
    cursor: 'pointer',
    padding: '8px',
    display: 'flex',
    alignItems: 'center'
  },
  formGroup: {
    marginBottom: '20px'
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    color: '#1e293b',
    fontSize: '14px',
    fontWeight: '600'
  },
  input: {
    width: '100%',
    padding: '12px',
    borderRadius: '8px',
    border: '2px solid #e5e7eb',
    backgroundColor: '#ffffff',
    color: '#1e293b',
    fontSize: '14px',
    boxSizing: 'border-box'
  },
  textarea: {
    width: '100%',
    padding: '12px',
    borderRadius: '8px',
    border: '2px solid #e5e7eb',
    backgroundColor: '#f8fafc',
    color: '#1e293b',
    fontSize: '14px',
    minHeight: '200px',
    fontFamily: 'monospace',
    boxSizing: 'border-box'
  },
  select: {
    width: '100%',
    padding: '12px',
    borderRadius: '8px',
    border: '2px solid #e5e7eb',
    backgroundColor: '#ffffff',
    color: '#1e293b',
    fontSize: '14px',
    boxSizing: 'border-box'
  },
  chartContainer: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '24px',
    border: '2px solid #e5e7eb',
    marginTop: '20px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
  },
  positionsTable: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '20px'
  },
  tableHeader: {
    backgroundColor: '#f1f5f9',
    color: '#1e293b',
    padding: '12px',
    textAlign: 'left',
    fontSize: '14px',
    fontWeight: '600'
  },
  tableCell: {
    padding: '12px',
    borderBottom: '1px solid #e5e7eb',
    color: '#64748b',
    fontSize: '14px'
  },
  assetGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
    gap: '12px',
    marginTop: '16px'
  },
  assetButton: {
    padding: '12px',
    borderRadius: '8px',
    border: '2px solid #e5e7eb',
    backgroundColor: '#ffffff',
    color: '#1e293b',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontSize: '13px',
    fontWeight: '500'
  },
  assetButtonSelected: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
    color: '#fff'
  },
  categorySection: {
    marginBottom: '24px'
  },
  categoryTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '12px',
    paddingBottom: '8px',
    borderBottom: '2px solid #3b82f6'
  },
  actionButtons: {
    display: 'flex',
    gap: '8px',
    marginTop: '16px'
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
    color: '#64748b'
  }
};

export default function SnowAIForwardTestingEngine() {
  const baseUrl = 'https://backend-production-c0ab.up.railway.app';
  
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [availableModels, setAvailableModels] = useState([]);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [priceData, setPriceData] = useState([]);
  const [loadingChart, setLoadingChart] = useState(false);
  const [editModel, setEditModel] = useState(null);

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterAsset, setFilterAsset] = useState('all');
  const [filterInterval, setFilterInterval] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  const assetCategories = {
    'Forex Pairs': [
      'EURUSD=X', 'GBPUSD=X', 'JPY=X', 'CHF=X', 'AUDUSD=X', 'CAD=X',
      'NZDUSD=X', 'EURJPY=X', 'GBPJPY=X', 'EURGBP=X'
    ],
    'US Stocks': [
      'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'NVDA', 'TSLA', 'META', 'JPM',
      'BRK-B', 'JNJ', 'V', 'WMT', 'PG', 'DIS', 'NFLX', 'ADBE',
      'BAC', 'C', 'GS', 'UNH', 'HD', 'KO', 'PEP', 'MCD', 'NKE',
      'INTC', 'ORCL', 'IBM', 'PYPL', 'CRM', 'BA', 'CAT',
      'CVX', 'XOM', 'LLY', 'COR', 'CSCO', 'BIIB', 'DVN', 'NIO',
      'WFC', 'MS', 'MA', 'AXP', 'TGT', 'SBUX', 'PFE', 'MRNA', 'ABBV',
      'AMD', 'QCOM', 'AVGO', 'TXN', 'COP', 'NEE', 'CMCSA', 'WBD',
      'NOW', 'F', 'GM', 'RIVN', 'LCID', 'LMT', 'SQ', 'SHOP', 'COIN'
    ],
    'Indices': [
      'SPY', 'QQQ', 'IWM', 'DIA', '^GSPC', '^DJI', '^IXIC'
    ],
    'Commodities': [
      'GC=F', 'SI=F', 'CL=F', 'NG=F', 'HG=F'
    ]
  };

  const [newModel, setNewModel] = useState({
    name: '',
    asset: '',
    interval: '1d',
    model_code: '',
    initial_equity: 10000,
    num_positions: 1,
    take_profit: 5,
    take_profit_type: 'PERCENTAGE',
    stop_loss: 3,
    stop_loss_type: 'PERCENTAGE'
  });

  useEffect(() => {
    fetchModels();
    fetchAvailableModels();
  }, []);

  const fetchModels = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/snowai-models/`);
      const data = await response.json();
      setModels(data);
    } catch (error) {
      console.error('Error fetching models:', error);
    }
  };

  const fetchAvailableModels = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/snowai-available-models/`);
      const data = await response.json();
      setAvailableModels(data);
    } catch (error) {
      console.error('Error fetching available models:', error);
    }
  };

  // Get filtered and sorted models
  const getFilteredModels = () => {
    let filtered = models;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(model =>
        model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        model.asset.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(model =>
        filterStatus === 'active' ? model.is_active : !model.is_active
      );
    }

    // Asset filter
    if (filterAsset !== 'all') {
      filtered = filtered.filter(model => model.asset === filterAsset);
    }

    // Interval filter
    if (filterInterval !== 'all') {
      filtered = filtered.filter(model => model.interval === filterInterval);
    }

    // Sorting
    filtered.sort((a, b) => {
      let aVal, bVal;

      switch (sortBy) {
        case 'name':
          aVal = a.name.toLowerCase();
          bVal = b.name.toLowerCase();
          break;
        case 'equity':
          aVal = a.current_equity || 0;
          bVal = b.current_equity || 0;
          break;
        case 'pnl':
          aVal = a.total_pnl || 0;
          bVal = b.total_pnl || 0;
          break;
        case 'winrate':
          aVal = a.win_rate || 0;
          bVal = b.win_rate || 0;
          break;
        case 'trades':
          aVal = a.total_trades || 0;
          bVal = b.total_trades || 0;
          break;
        default:
          return 0;
      }

      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  };

  // Get unique assets from models
  const getUniqueAssets = () => {
    const assets = [...new Set(models.map(m => m.asset))];
    return assets.sort();
  };

  // Get stats for filtered models
  const getFilteredStats = () => {
    const filtered = getFilteredModels();
    const activeCount = filtered.filter(m => m.is_active).length;
    const totalEquity = filtered.reduce((sum, m) => sum + (m.current_equity || 0), 0);
    const totalPnL = filtered.reduce((sum, m) => sum + (m.total_pnl || 0), 0);
    const avgWinRate = filtered.length > 0
      ? filtered.reduce((sum, m) => sum + (m.win_rate || 0), 0) / filtered.length
      : 0;

    return { count: filtered.length, activeCount, totalEquity, totalPnL, avgWinRate };
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const handleCreateModel = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/snowai-models/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newModel)
      });
      
      if (response.ok) {
        fetchModels();
        setShowAddModal(false);
        setNewModel({
          name: '',
          asset: '',
          interval: '1d',
          model_code: '',
          initial_equity: 10000,
          num_positions: 1,
          take_profit: 5,
          take_profit_type: 'PERCENTAGE',
          stop_loss: 3,
          stop_loss_type: 'PERCENTAGE'
        });
      }
    } catch (error) {
      console.error('Error creating model:', error);
    }
  };

  const handleDeleteModel = async (modelId) => {
    if (!window.confirm('Are you sure you want to delete this model?')) return;
    
    try {
      await fetch(`${baseUrl}/api/snowai-models/${modelId}/`, {
        method: 'DELETE'
      });
      fetchModels();
      setShowDetailModal(false);
    } catch (error) {
      console.error('Error deleting model:', error);
    }
  };

  const handleEditModel = (model) => {
    setEditModel({
      id: model.id,
      name: model.name,
      asset: model.asset,
      interval: model.interval,
      model_code: model.model_code,
      initial_equity: model.initial_equity,
      num_positions: model.num_positions,
      take_profit: model.take_profit,
      take_profit_type: model.take_profit_type,
      stop_loss: model.stop_loss,
      stop_loss_type: model.stop_loss_type,
      is_active: model.is_active
    });
    setShowDetailModal(false);
    setShowEditModal(true);
  };

  const handleUpdateModel = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/snowai-models/${editModel.id}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editModel)
      });
      
      if (response.ok) {
        fetchModels();
        setShowEditModal(false);
        setEditModel(null);
      }
    } catch (error) {
      console.error('Error updating model:', error);
    }
  };

  const handleViewDetails = async (model) => {
    try {
      setLoadingChart(true);
      const response = await fetch(`${baseUrl}/api/snowai-models/${model.id}/`);
      const data = await response.json();
      setSelectedModel(data);
      
      const priceResponse = await fetch(`${baseUrl}/api/snowai-chart-data-with-positions/${model.id}/`);
      const priceChartData = await priceResponse.json();
      setPriceData(priceChartData);
      
      setShowDetailModal(true);
      setLoadingChart(false);
    } catch (error) {
      console.error('Error fetching model details:', error);
      setLoadingChart(false);
    }
  };

  const renderModelCard = (model) => (
    <div
      key={model.id}
      style={{
        ...styles.card,
        ...(hoveredCard === model.id ? styles.cardHover : {})
      }}
      onMouseEnter={() => setHoveredCard(model.id)}
      onMouseLeave={() => setHoveredCard(null)}
      onClick={() => handleViewDetails(model)}
    >
      <div style={styles.cardHeader}>
        <h3 style={styles.modelName}>{model.name}</h3>
        <span style={{
          ...styles.badge,
          ...(model.is_active ? styles.badgeActive : styles.badgeInactive)
        }}>
          {model.is_active ? 'Active' : 'Inactive'}
        </span>
      </div>
      
      <div style={styles.statRow}>
        <span style={styles.statLabel}>Asset</span>
        <span style={styles.statValue}>{model.asset}</span>
      </div>
      
      <div style={styles.statRow}>
        <span style={styles.statLabel}>Equity</span>
        <span style={{
          ...styles.statValue,
          ...(model.current_equity >= model.initial_equity ? styles.positiveValue : styles.negativeValue)
        }}>
          ${model.current_equity?.toFixed(2)}
        </span>
      </div>
      
      <div style={styles.statRow}>
        <span style={styles.statLabel}>P&L</span>
        <span style={{
          ...styles.statValue,
          ...(model.total_pnl >= 0 ? styles.positiveValue : styles.negativeValue)
        }}>
          {model.total_pnl >= 0 ? '+' : ''}${model.total_pnl?.toFixed(2)}
        </span>
      </div>
      
      <div style={styles.statRow}>
        <span style={styles.statLabel}>Win Rate</span>
        <span style={styles.statValue}>{model.win_rate?.toFixed(1)}%</span>
      </div>
      
      <div style={styles.statRow}>
        <span style={styles.statLabel}>Total Trades</span>
        <span style={styles.statValue}>{model.total_trades}</span>
      </div>
    </div>
  );

  const renderAddModal = () => (
    <div style={styles.modal} onClick={() => setShowAddModal(false)}>
      <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div style={styles.modalHeader}>
          <h2 style={styles.modalTitle}>Create New Forward Test Model</h2>
          <button style={styles.closeButton} onClick={() => setShowAddModal(false)}>
            <X size={24} />
          </button>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Model Name</label>
          <input
            type="text"
            style={styles.input}
            value={newModel.name}
            onChange={(e) => setNewModel({...newModel, name: e.target.value})}
            placeholder="My Trading Strategy"
          />
        </div>

        <div style={styles.categorySection}>
          <label style={styles.label}>Select Asset</label>
          {Object.entries(assetCategories).map(([category, assets]) => (
            <div key={category} style={styles.categorySection}>
              <div style={styles.categoryTitle}>{category}</div>
              <div style={styles.assetGrid}>
                {assets.map(asset => (
                  <button
                    key={asset}
                    style={{
                      ...styles.assetButton,
                      ...(newModel.asset === asset ? styles.assetButtonSelected : {})
                    }}
                    onClick={() => setNewModel({...newModel, asset})}
                  >
                    {asset}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Interval</label>
          <select
            style={styles.select}
            value={newModel.interval}
            onChange={(e) => setNewModel({...newModel, interval: e.target.value})}
          >
            <option value="5m">5 Minutes</option>
            <option value="15m">15 Minutes</option>
            <option value="1h">1 Hour</option>
            <option value="4h">4 Hours</option>
            <option value="1d">1 Day</option>
            <option value="1wk">1 Week</option>
          </select>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Select Model Code from Available Models</label>
          <select
            style={styles.select}
            onChange={(e) => {
              const selected = availableModels.find(m => m.model_id === e.target.value);
              if (selected) {
                setNewModel({...newModel, model_code: selected.cleaned_model_code});
              }
            }}
          >
            <option value="">-- Select a model --</option>
            {availableModels.map(model => (
              <option key={model.model_id} value={model.model_id}>
                {model.model_id} - {new Date(model.created_at).toLocaleDateString()}
              </option>
            ))}
          </select>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Model Code (Python)</label>
          <textarea
            style={styles.textarea}
            value={newModel.model_code}
            onChange={(e) => setNewModel({...newModel, model_code: e.target.value})}
            placeholder="# Your trading strategy code here..."
          />
        </div>

        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px'}}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Initial Equity ($)</label>
            <input
              type="number"
              style={styles.input}
              value={newModel.initial_equity}
              onChange={(e) => setNewModel({...newModel, initial_equity: parseFloat(e.target.value)})}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Max Positions</label>
            <input
              type="number"
              style={styles.input}
              value={newModel.num_positions}
              onChange={(e) => setNewModel({...newModel, num_positions: parseInt(e.target.value)})}
            />
          </div>
        </div>

        <div style={{display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px'}}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Take Profit</label>
            <input
              type="number"
              style={styles.input}
              value={newModel.take_profit}
              onChange={(e) => setNewModel({...newModel, take_profit: parseFloat(e.target.value)})}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Type</label>
            <select
              style={styles.select}
              value={newModel.take_profit_type}
              onChange={(e) => setNewModel({...newModel, take_profit_type: e.target.value})}
            >
              <option value="PERCENTAGE">%</option>
              <option value="NUMBER">$</option>
            </select>
          </div>
        </div>

        <div style={{display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px'}}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Stop Loss</label>
            <input
              type="number"
              style={styles.input}
              value={newModel.stop_loss}
              onChange={(e) => setNewModel({...newModel, stop_loss: parseFloat(e.target.value)})}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Type</label>
            <select
              style={styles.select}
              value={newModel.stop_loss_type}
              onChange={(e) => setNewModel({...newModel, stop_loss_type: e.target.value})}
            >
              <option value="PERCENTAGE">%</option>
              <option value="NUMBER">$</option>
            </select>
          </div>
        </div>

        <div style={styles.actionButtons}>
          <button
            style={{...styles.button, ...styles.buttonPrimary}}
            onClick={handleCreateModel}
          >
            <Plus size={16} />
            Create Model
          </button>
          <button
            style={{...styles.button, ...styles.buttonSecondary}}
            onClick={() => setShowAddModal(false)}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );

  const renderEditModal = () => {
    if (!editModel) return null;

    return (
      <div style={styles.modal} onClick={() => setShowEditModal(false)}>
        <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
          <div style={styles.modalHeader}>
            <h2 style={styles.modalTitle}>Edit Model: {editModel.name}</h2>
            <button style={styles.closeButton} onClick={() => setShowEditModal(false)}>
              <X size={24} />
            </button>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Model Name</label>
            <input
              type="text"
              style={styles.input}
              value={editModel.name}
              onChange={(e) => setEditModel({...editModel, name: e.target.value})}
              placeholder="My Trading Strategy"
            />
          </div>

          <div style={styles.categorySection}>
            <label style={styles.label}>Select Asset</label>
            {Object.entries(assetCategories).map(([category, assets]) => (
              <div key={category} style={styles.categorySection}>
                <div style={styles.categoryTitle}>{category}</div>
                <div style={styles.assetGrid}>
                  {assets.map(asset => (
                    <button
                      key={asset}
                      style={{
                        ...styles.assetButton,
                        ...(editModel.asset === asset ? styles.assetButtonSelected : {})
                      }}
                      onClick={() => setEditModel({...editModel, asset})}
                    >
                      {asset}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Interval</label>
            <select
              style={styles.select}
              value={editModel.interval}
              onChange={(e) => setEditModel({...editModel, interval: e.target.value})}
            >
              <option value="5m">5 Minutes</option>
              <option value="15m">15 Minutes</option>
              <option value="1h">1 Hour</option>
              <option value="4h">4 Hours</option>
              <option value="1d">1 Day</option>
              <option value="1wk">1 Week</option>
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Select Model Code from Available Models</label>
            <select
              style={styles.select}
              onChange={(e) => {
                const selected = availableModels.find(m => m.model_id === e.target.value);
                if (selected) {
                  setEditModel({...editModel, model_code: selected.cleaned_model_code});
                }
              }}
            >
              <option value="">-- Select a model to replace current code --</option>
              {availableModels.map(model => (
                <option key={model.model_id} value={model.model_id}>
                  {model.model_id} - {new Date(model.created_at).toLocaleDateString()}
                </option>
              ))}
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Model Code (Python)</label>
            <textarea
              style={styles.textarea}
              value={editModel.model_code}
              onChange={(e) => setEditModel({...editModel, model_code: e.target.value})}
              placeholder="# Your trading strategy code here..."
            />
          </div>

          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px'}}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Initial Equity ($)</label>
              <input
                type="number"
                style={styles.input}
                value={editModel.initial_equity}
                onChange={(e) => setEditModel({...editModel, initial_equity: parseFloat(e.target.value)})}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Max Positions</label>
              <input
                type="number"
                style={styles.input}
                value={editModel.num_positions}
                onChange={(e) => setEditModel({...editModel, num_positions: parseInt(e.target.value)})}
              />
            </div>
          </div>

          <div style={{display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px'}}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Take Profit</label>
              <input
                type="number"
                style={styles.input}
                value={editModel.take_profit}
                onChange={(e) => setEditModel({...editModel, take_profit: parseFloat(e.target.value)})}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Type</label>
              <select
                style={styles.select}
                value={editModel.take_profit_type}
                onChange={(e) => setEditModel({...editModel, take_profit_type: e.target.value})}
              >
                <option value="PERCENTAGE">%</option>
                <option value="NUMBER">$</option>
              </select>
            </div>
          </div>

          <div style={{display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px'}}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Stop Loss</label>
              <input
                type="number"
                style={styles.input}
                value={editModel.stop_loss}
                onChange={(e) => setEditModel({...editModel, stop_loss: parseFloat(e.target.value)})}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Type</label>
              <select
                style={styles.select}
                value={editModel.stop_loss_type}
                onChange={(e) => setEditModel({...editModel, stop_loss_type: e.target.value})}
              >
                <option value="PERCENTAGE">%</option>
                <option value="NUMBER">$</option>
              </select>
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={{...styles.label, display: 'flex', alignItems: 'center', gap: '8px'}}>
              <input
                type="checkbox"
                checked={editModel.is_active}
                onChange={(e) => setEditModel({...editModel, is_active: e.target.checked})}
                style={{width: 'auto', margin: 0}}
              />
              Model Active (Enable/Disable Trading)
            </label>
          </div>

          <div style={styles.actionButtons}>
            <button
              style={{...styles.button, ...styles.buttonPrimary}}
              onClick={handleUpdateModel}
            >
              <Edit2 size={16} />
              Update Model
            </button>
            <button
              style={{...styles.button, ...styles.buttonSecondary}}
              onClick={() => setShowEditModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderDetailModal = () => {
    if (!selectedModel) return null;

    const chartData = selectedModel.equity_curve?.map((point, index) => ({
      time: index,
      equity: point
    })) || [];

    return (
      <div style={styles.modal} onClick={() => setShowDetailModal(false)}>
        <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
          <div style={styles.modalHeader}>
            <h2 style={styles.modalTitle}>{selectedModel.name}</h2>
            <button style={styles.closeButton} onClick={() => setShowDetailModal(false)}>
              <X size={24} />
            </button>
          </div>

          <div style={styles.mainGrid}>
            <div style={styles.card}>
              <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px'}}>
                <DollarSign size={20} color="#10b981" />
                <span style={styles.statLabel}>Current Equity</span>
              </div>
              <div style={{fontSize: '28px', fontWeight: '700', color: '#10b981'}}>
                ${selectedModel.current_equity?.toFixed(2)}
              </div>
            </div>

            <div style={styles.card}>
              <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px'}}>
                <TrendingUp size={20} color="#667eea" />
                <span style={styles.statLabel}>Total P&L</span>
              </div>
              <div style={{
                fontSize: '28px',
                fontWeight: '700',
                color: selectedModel.total_pnl >= 0 ? '#10b981' : '#ef4444'
              }}>
                {selectedModel.total_pnl >= 0 ? '+' : ''}${selectedModel.total_pnl?.toFixed(2)}
              </div>
            </div>

            <div style={styles.card}>
              <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px'}}>
                <Percent size={20} color="#f59e0b" />
                <span style={styles.statLabel}>Win Rate</span>
              </div>
              <div style={{fontSize: '28px', fontWeight: '700', color: '#f59e0b'}}>
                {selectedModel.win_rate?.toFixed(1)}%
              </div>
            </div>
          </div>

          <div style={styles.chartContainer}>
            <h3 style={{marginTop: 0, marginBottom: '20px', color: '#1e293b'}}>Equity Curve</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="time" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    color: '#1e293b'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="equity"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div style={styles.chartContainer}>
            <h3 style={{marginTop: 0, marginBottom: '20px', color: '#1e293b'}}>Trading Positions</h3>
            <table style={styles.positionsTable}>
              <thead>
                <tr>
                  <th style={styles.tableHeader}>Time</th>
                  <th style={styles.tableHeader}>Type</th>
                  <th style={styles.tableHeader}>Entry</th>
                  <th style={styles.tableHeader}>Exit</th>
                  <th style={styles.tableHeader}>P&L</th>
                </tr>
              </thead>
              <tbody>
                {selectedModel.positions?.map((pos, idx) => (
                  <tr key={idx}>
                    <td style={styles.tableCell}>{new Date(pos.entry_time).toLocaleString()}</td>
                    <td style={styles.tableCell}>
                      <span style={{
                        color: pos.type === 'BUY' ? '#10b981' : '#ef4444',
                        fontWeight: '600'
                      }}>
                        {pos.type}
                      </span>
                    </td>
                    <td style={styles.tableCell}>${pos.entry_price?.toFixed(2)}</td>
                    <td style={styles.tableCell}>
                      {pos.exit_price ? `${pos.exit_price.toFixed(2)}` : 'Open'}
                    </td>
                    <td style={{
                      ...styles.tableCell,
                      color: pos.pnl >= 0 ? '#10b981' : '#ef4444',
                      fontWeight: '600'
                    }}>
                      {pos.pnl >= 0 ? '+' : ''}${pos.pnl?.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={styles.actionButtons}>
            <button
              style={{...styles.button, ...styles.buttonPrimary}}
              onClick={() => handleEditModel(selectedModel)}
            >
              <Edit2 size={16} />
              Edit Model
            </button>
            <button
              style={{...styles.button, ...styles.buttonDanger}}
              onClick={() => handleDeleteModel(selectedModel.id)}
            >
              <Trash2 size={16} />
              Delete Model
            </button>
          </div>
        </div>
      </div>
    );
  };

  const filteredModels = getFilteredModels();
  const stats = getFilteredStats();

  return (
    <div>
      <div className="header">
        <Header />
      </div>
      <div className="main-page-body">
        <SideNavs />
        <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.headerTitle}>SnowAI Forward Testing Engine 🚀</h1>
        <p style={styles.headerSubtitle}>
          Live execution engine powered by yfinance • Real-time position tracking • Your own trading infrastructure
        </p>
      </div>

      <div style={{marginBottom: '30px'}}>
        <button
          style={{...styles.button, ...styles.buttonPrimary}}
          onClick={() => setShowAddModal(true)}
        >
          <Plus size={18} />
          Create New Model
        </button>
      </div>

      {/* Search and Filter Bar */}
      <div style={styles.searchAndFilterBar}>
        <div style={styles.searchBox}>
          <div style={styles.searchInputWrapper}>
            <Search size={18} style={styles.searchIcon} />
            <input
              type="text"
              style={styles.searchInput}
              placeholder="Search by name or asset..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div style={styles.filterRow}>
          <div style={styles.filterGroup}>
            <Filter size={16} color="#64748b" />
            <span style={styles.filterLabel}>Status:</span>
            <select
              style={styles.filterSelect}
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div style={styles.filterGroup}>
            <span style={styles.filterLabel}>Asset:</span>
            <select
              style={styles.filterSelect}
              value={filterAsset}
              onChange={(e) => setFilterAsset(e.target.value)}
            >
              <option value="all">All Assets</option>
              {getUniqueAssets().map(asset => (
                <option key={asset} value={asset}>{asset}</option>
              ))}
            </select>
          </div>

          <div style={styles.filterGroup}>
            <span style={styles.filterLabel}>Interval:</span>
            <select
              style={styles.filterSelect}
              value={filterInterval}
              onChange={(e) => setFilterInterval(e.target.value)}
            >
              <option value="all">All Intervals</option>
              <option value="5m">5m</option>
              <option value="15m">15m</option>
              <option value="1h">1h</option>
              <option value="4h">4h</option>
              <option value="1d">1d</option>
              <option value="1wk">1wk</option>
            </select>
          </div>

          <div style={{borderLeft: '2px solid #e5e7eb', paddingLeft: '12px', marginLeft: '8px'}}>
            <span style={styles.filterLabel}>Sort:</span>
          </div>

          <button
            style={{
              ...styles.sortButton,
              ...(sortBy === 'equity' ? styles.sortButtonActive : {})
            }}
            onClick={() => handleSort('equity')}
          >
            Equity
            {sortBy === 'equity' && (sortOrder === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />)}
          </button>

          <button
            style={{
              ...styles.sortButton,
              ...(sortBy === 'pnl' ? styles.sortButtonActive : {})
            }}
            onClick={() => handleSort('pnl')}
          >
            P&L
            {sortBy === 'pnl' && (sortOrder === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />)}
          </button>

          <button
            style={{
              ...styles.sortButton,
              ...(sortBy === 'winrate' ? styles.sortButtonActive : {})
            }}
            onClick={() => handleSort('winrate')}
          >
            Win Rate
            {sortBy === 'winrate' && (sortOrder === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />)}
          </button>

          <button
            style={{
              ...styles.sortButton,
              ...(sortBy === 'trades' ? styles.sortButtonActive : {})
            }}
            onClick={() => handleSort('trades')}
          >
            Trades
            {sortBy === 'trades' && (sortOrder === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />)}
          </button>
        </div>

        {/* Stats Bar */}
        <div style={styles.statsBar}>
          <div style={styles.statChip}>
            <strong>{stats.count}</strong> models shown
          </div>
          <div style={styles.statChip}>
            <strong>{stats.activeCount}</strong> active
          </div>
          <div style={styles.statChip}>
            Total Equity: <strong>${stats.totalEquity.toFixed(2)}</strong>
          </div>
          <div style={{
            ...styles.statChip,
            color: stats.totalPnL >= 0 ? '#10b981' : '#ef4444',
            backgroundColor: stats.totalPnL >= 0 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)'
          }}>
            Total P&L: <strong>{stats.totalPnL >= 0 ? '+' : ''}${stats.totalPnL.toFixed(2)}</strong>
          </div>
          <div style={styles.statChip}>
            Avg Win Rate: <strong>{stats.avgWinRate.toFixed(1)}%</strong>
          </div>
        </div>
      </div>

      <div style={styles.mainGrid}>
        {filteredModels.map(model => renderModelCard(model))}
      </div>

      {filteredModels.length === 0 && (
        <div style={styles.emptyState}>
          <Activity size={48} style={{marginBottom: '16px', opacity: 0.5}} />
          <p style={{fontSize: '18px', margin: 0}}>
            {models.length === 0 
              ? "No models yet. Create your first forward testing model to get started!"
              : "No models match your filters. Try adjusting your search or filters."}
          </p>
        </div>
      )}

      {showAddModal && renderAddModal()}
      {showEditModal && renderEditModal()}
      {showDetailModal && renderDetailModal()}
        </div>
      </div>
    </div>
  );
}
