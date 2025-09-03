import React, { useEffect, useState } from "react";
import { 
    Search, 
    Plus, 
    Filter, 
    TrendingUp, 
    Brain, 
    Database, 
    Target, 
    DollarSign,
    ChevronDown,
    X,
    Save,
    Eye,
    Trash2,
    Calendar
} from "lucide-react";
import Header from "./header";
import SideNavs from "./side_navs";

export default function ResearchLogbook() {
    const baseUrl = 'https://backend-production-c0ab.up.railway.app';
    
    // Simplified state
    const [entries, setEntries] = useState([]);
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedEntry, setSelectedEntry] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState({
        model_type: '',
        status: '',
        market_type: ''
    });
    
    // Simple form state
    const [formData, setFormData] = useState({
        snowai_model_name: '',
        snowai_model_type: 'classification',
        snowai_description: '',
        snowai_accuracy_score: '',
        snowai_r2_score: '',
        snowai_roi_percentage: '',
        snowai_status: 'experimental',
        snowai_tags: []
    });

    // Load data
    useEffect(() => {
        fetchEntries();
        fetchAnalytics();
    }, [searchQuery, filters]);

    const fetchEntries = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                search: searchQuery,
                ...filters
            });
            const response = await fetch(`${baseUrl}/snowai-research-logbook/api/ml-entries/?${params}`);
            const data = await response.json();
            if (response.ok) {
                setEntries(data.entries);
            }
        } catch (error) {
            console.error('Error fetching entries:', error);
        }
        setLoading(false);
    };

    const fetchAnalytics = async () => {
        try {
            const response = await fetch(`${baseUrl}/snowai-research-logbook/api/analytics/`);
            const data = await response.json();
            if (response.ok) {
                setAnalytics(data);
            }
        } catch (error) {
            console.error('Error fetching analytics:', error);
        }
    };

    const createEntry = async () => {
        try {
            const response = await fetch(`${baseUrl}/snowai-research-logbook/api/ml-entries/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    snowai_accuracy_score: formData.snowai_accuracy_score ? parseFloat(formData.snowai_accuracy_score) : null,
                    snowai_r2_score: formData.snowai_r2_score ? parseFloat(formData.snowai_r2_score) : null,
                    snowai_roi_percentage: formData.snowai_roi_percentage ? parseFloat(formData.snowai_roi_percentage) : null,
                })
            });

            if (response.ok) {
                setShowAddModal(false);
                resetForm();
                fetchEntries();
                fetchAnalytics();
                alert('Model created successfully!');
            }
        } catch (error) {
            console.error('Error creating entry:', error);
            alert('Error creating entry');
        }
    };

    const deleteEntry = async (entryId) => {
        if (window.confirm('Delete this entry?')) {
            try {
                const response = await fetch(`${baseUrl}/snowai-research-logbook/api/ml-entries/${entryId}/`, {
                    method: 'DELETE'
                });
                if (response.ok) {
                    fetchEntries();
                    fetchAnalytics();
                    setShowDetailModal(false);
                    alert('Entry deleted!');
                }
            } catch (error) {
                console.error('Error deleting entry:', error);
            }
        }
    };

    const viewDetails = async (entryId) => {
        try {
            const response = await fetch(`${baseUrl}/snowai-research-logbook/api/ml-entries/${entryId}/`);
            const data = await response.json();
            if (response.ok) {
                setSelectedEntry(data);
                setShowDetailModal(true);
            }
        } catch (error) {
            console.error('Error fetching details:', error);
        }
    };

    const resetForm = () => {
        setFormData({
            snowai_model_name: '',
            snowai_model_type: 'classification',
            snowai_description: '',
            snowai_accuracy_score: '',
            snowai_r2_score: '',
            snowai_roi_percentage: '',
            snowai_status: 'experimental',
            snowai_tags: []
        });
    };

    const getStatusColor = (status) => {
        const colors = {
            'experimental': 'bg-amber-100 text-amber-800 border-amber-200',
            'validated': 'bg-emerald-100 text-emerald-800 border-emerald-200',
            'production': 'bg-blue-100 text-blue-800 border-blue-200',
            'deprecated': 'bg-red-100 text-red-800 border-red-200'
        };
        return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
    };

    const formatMetric = (name, value, isPercent = false) => {
        if (!value) return null;
        return `${name}: ${isPercent ? (value * 100).toFixed(1) + '%' : value.toFixed(3)}`;
    };

    const styles = `
        .gradient-bg {
            background: linear-gradient(135deg, #1e40af 0%, #3730a3 50%, #1e3a8a 100%);
        }
        
        .glass-card {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .hover-lift {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .hover-lift:hover {
            transform: translateY(-4px);
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }
        
        .card-entry {
            background: linear-gradient(145deg, #ffffff 0%, #f8fafc 100%);
            border: 1px solid rgba(59, 130, 246, 0.1);
            position: relative;
            overflow: hidden;
        }
        
        .card-entry::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(90deg, #3b82f6, #1d4ed8, #1e40af);
        }
        
        .metric-badge {
            background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
            border: 1px solid #93c5fd;
        }
        
        .search-input {
            background: rgba(255, 255, 255, 0.9);
            border: 2px solid transparent;
            transition: all 0.3s ease;
        }
        
        .search-input:focus {
            background: white;
            border-color: #3b82f6;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        
        .btn-primary {
            background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
            border: none;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }
        
        .btn-primary::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
            transition: left 0.5s;
        }
        
        .btn-primary:hover::before {
            left: 100%;
        }
        
        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(59, 130, 246, 0.3);
        }
        
        .modal-backdrop {
            background: rgba(0, 0, 0, 0.6);
            backdrop-filter: blur(4px);
        }
        
        .modal-content {
            background: white;
            border-radius: 16px;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }
        
        .analytics-card {
            background: linear-gradient(145deg, #ffffff 0%, #f1f5f9 100%);
            border: 1px solid rgba(59, 130, 246, 0.1);
            position: relative;
            overflow: hidden;
        }
        
        .analytics-card::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 3px;
            background: var(--accent-color, #3b82f6);
        }
        
        .tag-chip {
            background: rgba(59, 130, 246, 0.1);
            color: #1e40af;
            border: 1px solid rgba(59, 130, 246, 0.2);
            transition: all 0.2s ease;
        }
        
        .tag-chip:hover {
            background: rgba(59, 130, 246, 0.15);
            transform: scale(1.02);
        }
        
        .loading-spinner {
            background: conic-gradient(from 0deg, #3b82f6, #1d4ed8, #3b82f6);
            mask: radial-gradient(farthest-side, transparent calc(100% - 3px), white 0);
        }
        
        @media (max-width: 768px) {
            .mobile-padding {
                padding: 1rem;
            }
            
            .mobile-grid {
                grid-template-columns: 1fr;
            }
            
            .mobile-text {
                font-size: 0.875rem;
            }
        }
        
        .status-experimental { --accent-color: #f59e0b; }
        .status-validated { --accent-color: #10b981; }
        .status-production { --accent-color: #3b82f6; }
        .status-deprecated { --accent-color: #ef4444; }
    `;

    return (
        <>
            <style>{styles}</style>
            <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #f0f4f8 0%, #e2e8f0 50%, #cbd5e1 100%)' }}>
                {/* Header */}
                <Header />
                <SideNavs />
                
                <div className="mobile-padding lg:p-8">
                    {/* Main Header */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-blue-100">
                                <Brain size={32} className="text-blue-600" />
                            </div>
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                                    SnowAI Research Logbook
                                </h1>
                                <p className="text-gray-600 text-sm mt-1">Manage your ML models and experiments</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="btn-primary text-white px-6 py-3 rounded-xl flex items-center gap-2 font-medium shadow-lg w-full sm:w-auto justify-center"
                        >
                            <Plus size={20} />
                            Add Model
                        </button>
                    </div>

                    {/* Analytics Cards */}
                    {analytics && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
                            <div className="analytics-card hover-lift p-6 rounded-xl shadow-sm status-production">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="p-2 rounded-lg bg-blue-100">
                                        <Database className="text-blue-600" size={20} />
                                    </div>
                                    <h3 className="font-semibold text-gray-700">Total Models</h3>
                                </div>
                                <p className="text-2xl lg:text-3xl font-bold text-blue-600">
                                    {analytics.snowai_total_entries}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">Active research projects</p>
                            </div>
                            
                            {analytics.snowai_accuracy_statistics?.count > 0 && (
                                <div className="analytics-card hover-lift p-6 rounded-xl shadow-sm status-validated">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="p-2 rounded-lg bg-emerald-100">
                                            <Target className="text-emerald-600" size={20} />
                                        </div>
                                        <h3 className="font-semibold text-gray-700">Avg Accuracy</h3>
                                    </div>
                                    <p className="text-2xl lg:text-3xl font-bold text-emerald-600">
                                        {(analytics.snowai_accuracy_statistics.avg * 100).toFixed(1)}%
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">Model performance</p>
                                </div>
                            )}
                            
                            {analytics.snowai_roi_statistics?.count > 0 && (
                                <div className="analytics-card hover-lift p-6 rounded-xl shadow-sm status-experimental">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="p-2 rounded-lg bg-amber-100">
                                            <DollarSign className="text-amber-600" size={20} />
                                        </div>
                                        <h3 className="font-semibold text-gray-700">Avg ROI</h3>
                                    </div>
                                    <p className="text-2xl lg:text-3xl font-bold text-amber-600">
                                        {analytics.snowai_roi_statistics.avg.toFixed(1)}%
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">Return on investment</p>
                                </div>
                            )}
                            
                            {analytics.snowai_r2_statistics?.count > 0 && (
                                <div className="analytics-card hover-lift p-6 rounded-xl shadow-sm status-production">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="p-2 rounded-lg bg-purple-100">
                                            <TrendingUp className="text-purple-600" size={20} />
                                        </div>
                                        <h3 className="font-semibold text-gray-700">Avg R²</h3>
                                    </div>
                                    <p className="text-2xl lg:text-3xl font-bold text-purple-600">
                                        {analytics.snowai_r2_statistics.avg.toFixed(3)}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">Model fit quality</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Search and Filters */}
                    <div className="glass-card p-4 lg:p-6 rounded-xl shadow-sm mb-8">
                        <div className="flex gap-4 mb-4">
                            <div className="relative flex-1">
                                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search models by name, type, or description..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="search-input w-full pl-10 pr-4 py-3 rounded-xl focus:outline-none mobile-text"
                                />
                            </div>
                        </div>
                        
                        <div className="grid mobile-grid lg:grid-cols-3 gap-4">
                            <select
                                value={filters.model_type}
                                onChange={(e) => setFilters({...filters, model_type: e.target.value})}
                                className="p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white mobile-text"
                            >
                                <option value="">All Model Types</option>
                                <option value="classification">Classification</option>
                                <option value="regression">Regression</option>
                                <option value="neural_network">Neural Network</option>
                                <option value="deep_learning">Deep Learning</option>
                            </select>

                            <select
                                value={filters.status}
                                onChange={(e) => setFilters({...filters, status: e.target.value})}
                                className="p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white mobile-text"
                            >
                                <option value="">All Statuses</option>
                                <option value="experimental">Experimental</option>
                                <option value="validated">Validated</option>
                                <option value="production">Production</option>
                                <option value="deprecated">Deprecated</option>
                            </select>

                            <select
                                value={filters.market_type}
                                onChange={(e) => setFilters({...filters, market_type: e.target.value})}
                                className="p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white mobile-text"
                            >
                                <option value="">All Markets</option>
                                <option value="stocks">Stocks</option>
                                <option value="forex">Forex</option>
                                <option value="crypto">Cryptocurrency</option>
                            </select>
                        </div>
                    </div>

                    {/* Entries Grid */}
                    {loading ? (
                        <div className="text-center py-16">
                            <div className="loading-spinner rounded-full h-12 w-12 mx-auto mb-4"></div>
                            <p className="text-gray-600">Loading models...</p>
                        </div>
                    ) : entries.length === 0 ? (
                        <div className="text-center py-16">
                            <div className="p-4 rounded-full bg-blue-50 w-20 h-20 flex items-center justify-center mx-auto mb-4">
                                <Brain size={40} className="text-blue-400" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2 text-gray-800">No models found</h3>
                            <p className="text-gray-600">Start by adding your first ML model entry</p>
                        </div>
                    ) : (
                        <div className="grid mobile-grid lg:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
                            {entries.map((entry) => (
                                <div
                                    key={entry.id}
                                    className={`card-entry hover-lift p-6 rounded-xl shadow-sm cursor-pointer status-${entry.snowai_status}`}
                                    onClick={() => viewDetails(entry.id)}
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">
                                            {entry.snowai_model_name}
                                        </h3>
                                    </div>

                                    <div className="flex items-center gap-2 mb-4">
                                        <span className="text-sm text-gray-600 capitalize bg-gray-100 px-2 py-1 rounded-lg">
                                            {entry.snowai_model_type?.replace('_', ' ')}
                                        </span>
                                        <span className={`px-3 py-1 text-xs rounded-full border font-medium ${getStatusColor(entry.snowai_status)}`}>
                                            {entry.snowai_status}
                                        </span>
                                    </div>

                                    {entry.snowai_description && (
                                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                            {entry.snowai_description}
                                        </p>
                                    )}

                                    {/* Primary Metric */}
                                    {entry.snowai_primary_metric && (
                                        <div className="mb-4">
                                            <div className="metric-badge inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium">
                                                <Target size={14} />
                                                {formatMetric(
                                                    entry.snowai_primary_metric.name,
                                                    entry.snowai_primary_metric.value,
                                                    entry.snowai_primary_metric.format?.includes('%')
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Tags */}
                                    {entry.snowai_tags && entry.snowai_tags.length > 0 && (
                                        <div className="mb-4">
                                            <div className="flex flex-wrap gap-1">
                                                {entry.snowai_tags.slice(0, 3).map((tag, index) => (
                                                    <span key={index} className="tag-chip px-2 py-1 text-xs rounded-lg">
                                                        {tag}
                                                    </span>
                                                ))}
                                                {entry.snowai_tags.length > 3 && (
                                                    <span className="bg-gray-100 text-gray-500 px-2 py-1 text-xs rounded-lg border">
                                                        +{entry.snowai_tags.length - 3}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex justify-between items-center text-xs text-gray-500 pt-4 border-t border-gray-100">
                                        <div className="flex items-center gap-2">
                                            <Calendar size={12} />
                                            {new Date(entry.snowai_created_at).toLocaleDateString()}
                                        </div>
                                        {entry.snowai_financial_market_type && (
                                            <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-lg text-xs font-medium border border-blue-200">
                                                {entry.snowai_financial_market_type}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Add Entry Modal */}
                    {showAddModal && (
                        <div className="fixed inset-0 modal-backdrop flex items-center justify-center z-50 p-4">
                            <div className="modal-content max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                                <div className="p-6 border-b border-gray-100">
                                    <div className="flex justify-between items-center">
                                        <h2 className="text-xl font-bold text-gray-800">Add New ML Model</h2>
                                        <button 
                                            onClick={() => setShowAddModal(false)}
                                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                        >
                                            <X size={24} className="text-gray-500" />
                                        </button>
                                    </div>
                                </div>

                                <form onSubmit={(e) => { e.preventDefault(); createEntry(); }} className="p-6">
                                    <div className="grid mobile-grid lg:grid-cols-2 gap-4 mb-6">
                                        <div>
                                            <label className="block text-sm font-medium mb-2 text-gray-700">Model Name *</label>
                                            <input
                                                type="text"
                                                required
                                                value={formData.snowai_model_name}
                                                onChange={(e) => setFormData({...formData, snowai_model_name: e.target.value})}
                                                className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="LSTM Stock Predictor"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium mb-2 text-gray-700">Model Type</label>
                                            <select
                                                value={formData.snowai_model_type}
                                                onChange={(e) => setFormData({...formData, snowai_model_type: e.target.value})}
                                                className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            >
                                                <option value="classification">Classification</option>
                                                <option value="regression">Regression</option>
                                                <option value="neural_network">Neural Network</option>
                                                <option value="deep_learning">Deep Learning</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium mb-2 text-gray-700">Status</label>
                                            <select
                                                value={formData.snowai_status}
                                                onChange={(e) => setFormData({...formData, snowai_status: e.target.value})}
                                                className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            >
                                                <option value="experimental">Experimental</option>
                                                <option value="validated">Validated</option>
                                                <option value="production">Production</option>
                                                <option value="deprecated">Deprecated</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium mb-2 text-gray-700">Accuracy Score</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                max="1"
                                                value={formData.snowai_accuracy_score}
                                                onChange={(e) => setFormData({...formData, snowai_accuracy_score: e.target.value})}
                                                className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="0.85"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium mb-2 text-gray-700">R² Score</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={formData.snowai_r2_score}
                                                onChange={(e) => setFormData({...formData, snowai_r2_score: e.target.value})}
                                                className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="0.92"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium mb-2 text-gray-700">ROI (%)</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={formData.snowai_roi_percentage}
                                                onChange={(e) => setFormData({...formData, snowai_roi_percentage: e.target.value})}
                                                className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="23.7"
                                            />
                                        </div>
                                    </div>

                                    <div className="mb-6">
                                        <label className="block text-sm font-medium mb-2 text-gray-700">Description</label>
                                        <textarea
                                            value={formData.snowai_description}
                                            onChange={(e) => setFormData({...formData, snowai_description: e.target.value})}
                                            rows={4}
                                            className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                            placeholder="Describe your model's purpose, approach, and key insights..."
                                        />
                                    </div>

                                    <div className="flex flex-col sm:flex-row justify-end gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setShowAddModal(false)}
                                            className="px-6 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="btn-primary text-white px-6 py-3 rounded-xl flex items-center justify-center gap-2 font-medium"
                                        >
                                            <Save size={16} />
                                            Save Model
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* Detail Modal */}
                    {showDetailModal && selectedEntry && (
                        <div className="fixed inset-0 modal-backdrop flex items-center justify-center z-50 p-4">
                            <div className="modal-content max-w-5xl w-full max-h-[90vh] overflow-y-auto">
                                <div className="p-6 border-b border-gray-100">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                                                {selectedEntry.snowai_model_name}
                                            </h2>
                                            <p className="text-gray-600 mt-1">Model Details & Performance</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => deleteEntry(selectedEntry.id)}
                                                className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"
                                                title="Delete Model"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                            <button 
                                                onClick={() => setShowDetailModal(false)}
                                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                            >
                                                <X size={24} className="text-gray-500" />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6">
                                    <div className="grid mobile-grid lg:grid-cols-2 gap-8">
                                        <div>
                                            <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
                                                <Brain size={20} className="text-blue-600" />
                                                Model Information
                                            </h3>
                                            <div className="space-y-4">
                                                <div className="bg-gray-50 p-4 rounded-xl">
                                                    <p className="text-sm text-gray-600 mb-1">Model Type</p>
                                                    <p className="font-medium capitalize">{selectedEntry.snowai_model_type?.replace('_', ' ')}</p>
                                                </div>
                                                
                                                <div className="bg-gray-50 p-4 rounded-xl">
                                                    <p className="text-sm text-gray-600 mb-2">Status</p>
                                                    <span className={`px-3 py-1 text-sm rounded-full border font-medium ${getStatusColor(selectedEntry.snowai_status)}`}>
                                                        {selectedEntry.snowai_status}
                                                    </span>
                                                </div>
                                                
                                                <div className="bg-gray-50 p-4 rounded-xl">
                                                    <p className="text-sm text-gray-600 mb-1">Framework</p>
                                                    <p className="font-medium">{selectedEntry.snowai_framework_used || 'Not specified'}</p>
                                                </div>
                                                
                                                <div className="bg-gray-50 p-4 rounded-xl">
                                                    <p className="text-sm text-gray-600 mb-1">Market Type</p>
                                                    <p className="font-medium">{selectedEntry.snowai_financial_market_type || 'Not specified'}</p>
                                                </div>
                                                
                                                <div className="bg-gray-50 p-4 rounded-xl">
                                                    <p className="text-sm text-gray-600 mb-1">Created</p>
                                                    <p className="font-medium">{new Date(selectedEntry.snowai_created_at).toLocaleDateString('en-US', { 
                                                        year: 'numeric', 
                                                        month: 'long', 
                                                        day: 'numeric' 
                                                    })}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
                                                <TrendingUp size={20} className="text-green-600" />
                                                Performance Metrics
                                            </h3>
                                            <div className="space-y-3">
                                                {selectedEntry.snowai_accuracy_score && (
                                                    <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 p-4 rounded-xl border border-emerald-200">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <Target size={16} className="text-emerald-600" />
                                                            <span className="text-sm font-medium text-emerald-800">Accuracy Score</span>
                                                        </div>
                                                        <p className="text-2xl font-bold text-emerald-700">
                                                            {(selectedEntry.snowai_accuracy_score * 100).toFixed(1)}%
                                                        </p>
                                                    </div>
                                                )}
                                                
                                                {selectedEntry.snowai_r2_score && (
                                                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <TrendingUp size={16} className="text-blue-600" />
                                                            <span className="text-sm font-medium text-blue-800">R² Score</span>
                                                        </div>
                                                        <p className="text-2xl font-bold text-blue-700">
                                                            {selectedEntry.snowai_r2_score.toFixed(3)}
                                                        </p>
                                                    </div>
                                                )}
                                                
                                                {selectedEntry.snowai_roi_percentage && (
                                                    <div className="bg-gradient-to-r from-amber-50 to-amber-100 p-4 rounded-xl border border-amber-200">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <DollarSign size={16} className="text-amber-600" />
                                                            <span className="text-sm font-medium text-amber-800">ROI Percentage</span>
                                                        </div>
                                                        <p className="text-2xl font-bold text-amber-700">
                                                            {selectedEntry.snowai_roi_percentage.toFixed(1)}%
                                                        </p>
                                                    </div>
                                                )}
                                                
                                                {selectedEntry.snowai_sharpe_ratio && (
                                                    <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <TrendingUp size={16} className="text-purple-600" />
                                                            <span className="text-sm font-medium text-purple-800">Sharpe Ratio</span>
                                                        </div>
                                                        <p className="text-2xl font-bold text-purple-700">
                                                            {selectedEntry.snowai_sharpe_ratio.toFixed(2)}
                                                        </p>
                                                    </div>
                                                )}
                                                
                                                {!selectedEntry.snowai_accuracy_score && !selectedEntry.snowai_r2_score && 
                                                 !selectedEntry.snowai_roi_percentage && !selectedEntry.snowai_sharpe_ratio && (
                                                    <div className="text-center py-8">
                                                        <div className="p-3 rounded-full bg-gray-100 w-16 h-16 flex items-center justify-center mx-auto mb-3">
                                                            <TrendingUp size={24} className="text-gray-400" />
                                                        </div>
                                                        <p className="text-gray-500">No performance metrics available</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {selectedEntry.snowai_description && (
                                        <div className="mt-8">
                                            <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
                                                <Eye size={20} className="text-blue-600" />
                                                Description
                                            </h3>
                                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
                                                <p className="text-gray-700 leading-relaxed">
                                                    {selectedEntry.snowai_description}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {selectedEntry.snowai_tags && selectedEntry.snowai_tags.length > 0 && (
                                        <div className="mt-8">
                                            <h3 className="text-lg font-semibold mb-4 text-gray-800">Tags</h3>
                                            <div className="flex flex-wrap gap-2">
                                                {selectedEntry.snowai_tags.map((tag, index) => (
                                                    <span 
                                                        key={index} 
                                                        className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 px-4 py-2 rounded-full text-sm font-medium border border-blue-300 hover:from-blue-200 hover:to-blue-300 transition-all"
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {selectedEntry.snowai_notes && (
                                        <div className="mt-8">
                                            <h3 className="text-lg font-semibold mb-4 text-gray-800">Research Notes</h3>
                                            <div className="bg-gray-50 p-6 rounded-xl border">
                                                <pre className="text-gray-700 leading-relaxed whitespace-pre-wrap font-sans">
                                                    {selectedEntry.snowai_notes}
                                                </pre>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}