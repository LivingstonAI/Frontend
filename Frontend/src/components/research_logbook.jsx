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
            'experimental': 'bg-yellow-100 text-yellow-800',
            'validated': 'bg-green-100 text-green-800',
            'production': 'bg-blue-100 text-blue-800',
            'deprecated': 'bg-red-100 text-red-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const formatMetric = (name, value, isPercent = false) => {
        if (!value) return null;
        return `${name}: ${isPercent ? (value * 100).toFixed(1) + '%' : value.toFixed(3)}`;
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            {/* Header */}
            <Header />
            <SideNavs />
            <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-3">
                    <Brain size={32} className="text-blue-600" />
                    <h1 className="text-3xl font-bold text-blue-600">SnowAI Research Logbook</h1>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-blue-700"
                >
                    <Plus size={20} />
                    Add Model
                </button>
            </div>

            {/* Analytics Cards */}
            {analytics && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-lg shadow border">
                        <div className="flex items-center gap-3 mb-2">
                            <Database className="text-blue-600" size={24} />
                            <h3 className="font-semibold">Total Models</h3>
                        </div>
                        <p className="text-3xl font-bold text-blue-600">{analytics.snowai_total_entries}</p>
                    </div>
                    
                    {analytics.snowai_accuracy_statistics?.count > 0 && (
                        <div className="bg-white p-6 rounded-lg shadow border">
                            <div className="flex items-center gap-3 mb-2">
                                <Target className="text-green-600" size={24} />
                                <h3 className="font-semibold">Avg Accuracy</h3>
                            </div>
                            <p className="text-3xl font-bold text-green-600">
                                {(analytics.snowai_accuracy_statistics.avg * 100).toFixed(1)}%
                            </p>
                        </div>
                    )}
                    
                    {analytics.snowai_roi_statistics?.count > 0 && (
                        <div className="bg-white p-6 rounded-lg shadow border">
                            <div className="flex items-center gap-3 mb-2">
                                <DollarSign className="text-red-600" size={24} />
                                <h3 className="font-semibold">Avg ROI</h3>
                            </div>
                            <p className="text-3xl font-bold text-red-600">
                                {analytics.snowai_roi_statistics.avg.toFixed(1)}%
                            </p>
                        </div>
                    )}
                    
                    {analytics.snowai_r2_statistics?.count > 0 && (
                        <div className="bg-white p-6 rounded-lg shadow border">
                            <div className="flex items-center gap-3 mb-2">
                                <TrendingUp className="text-purple-600" size={24} />
                                <h3 className="font-semibold">Avg R²</h3>
                            </div>
                            <p className="text-3xl font-bold text-purple-600">
                                {analytics.snowai_r2_statistics.avg.toFixed(3)}
                            </p>
                        </div>
                    )}
                </div>
            )}

            {/* Search and Filters */}
            <div className="bg-white p-6 rounded-lg shadow border mb-8">
                <div className="flex gap-4 mb-4">
                    <div className="relative flex-1">
                        <Search size={20} className="absolute left-3 top-3 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search models..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <select
                        value={filters.model_type}
                        onChange={(e) => setFilters({...filters, model_type: e.target.value})}
                        className="p-3 border rounded-lg"
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
                        className="p-3 border rounded-lg"
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
                        className="p-3 border rounded-lg"
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
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4">Loading models...</p>
                </div>
            ) : entries.length === 0 ? (
                <div className="text-center py-12">
                    <Brain size={64} className="mx-auto text-gray-300 mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No models found</h3>
                    <p className="text-gray-600">Start by adding your first ML model entry</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {entries.map((entry) => (
                        <div
                            key={entry.id}
                            className="bg-white p-6 rounded-lg shadow border hover:shadow-lg transition-shadow cursor-pointer"
                            onClick={() => viewDetails(entry.id)}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-lg font-semibold text-blue-600 line-clamp-2">
                                    {entry.snowai_model_name}
                                </h3>
                            </div>

                            <div className="flex items-center gap-2 mb-3">
                                <span className="text-sm text-gray-600 capitalize">
                                    {entry.snowai_model_type?.replace('_', ' ')}
                                </span>
                                <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(entry.snowai_status)}`}>
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
                                    <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-lg text-sm font-medium">
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
                                            <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 text-xs rounded">
                                                {tag}
                                            </span>
                                        ))}
                                        {entry.snowai_tags.length > 3 && (
                                            <span className="bg-gray-100 text-gray-500 px-2 py-1 text-xs rounded">
                                                +{entry.snowai_tags.length - 3}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )}

                            <div className="flex justify-between items-center text-xs text-gray-500 pt-4 border-t">
                                <div className="flex items-center gap-1">
                                    <Calendar size={12} />
                                    {new Date(entry.snowai_created_at).toLocaleDateString()}
                                </div>
                                {entry.snowai_financial_market_type && (
                                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
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
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-2xl w-full max-h-90vh overflow-y-auto">
                        <div className="p-6 border-b">
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-bold">Add New ML Model</h2>
                                <button onClick={() => setShowAddModal(false)}>
                                    <X size={24} />
                                </button>
                            </div>
                        </div>

                        <form onSubmit={(e) => { e.preventDefault(); createEntry(); }} className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Model Name *</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.snowai_model_name}
                                        onChange={(e) => setFormData({...formData, snowai_model_name: e.target.value})}
                                        className="w-full p-3 border rounded-lg"
                                        placeholder="LSTM Stock Predictor"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Model Type</label>
                                    <select
                                        value={formData.snowai_model_type}
                                        onChange={(e) => setFormData({...formData, snowai_model_type: e.target.value})}
                                        className="w-full p-3 border rounded-lg"
                                    >
                                        <option value="classification">Classification</option>
                                        <option value="regression">Regression</option>
                                        <option value="neural_network">Neural Network</option>
                                        <option value="deep_learning">Deep Learning</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Status</label>
                                    <select
                                        value={formData.snowai_status}
                                        onChange={(e) => setFormData({...formData, snowai_status: e.target.value})}
                                        className="w-full p-3 border rounded-lg"
                                    >
                                        <option value="experimental">Experimental</option>
                                        <option value="validated">Validated</option>
                                        <option value="production">Production</option>
                                        <option value="deprecated">Deprecated</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Accuracy Score</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        max="1"
                                        value={formData.snowai_accuracy_score}
                                        onChange={(e) => setFormData({...formData, snowai_accuracy_score: e.target.value})}
                                        className="w-full p-3 border rounded-lg"
                                        placeholder="0.85"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">R² Score</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={formData.snowai_r2_score}
                                        onChange={(e) => setFormData({...formData, snowai_r2_score: e.target.value})}
                                        className="w-full p-3 border rounded-lg"
                                        placeholder="0.92"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">ROI (%)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={formData.snowai_roi_percentage}
                                        onChange={(e) => setFormData({...formData, snowai_roi_percentage: e.target.value})}
                                        className="w-full p-3 border rounded-lg"
                                        placeholder="23.7"
                                    />
                                </div>
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-medium mb-1">Description</label>
                                <textarea
                                    value={formData.snowai_description}
                                    onChange={(e) => setFormData({...formData, snowai_description: e.target.value})}
                                    rows={3}
                                    className="w-full p-3 border rounded-lg"
                                    placeholder="Describe your model's purpose and approach..."
                                />
                            </div>

                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="px-6 py-3 border rounded-lg hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center gap-2"
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
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-4xl w-full max-h-90vh overflow-y-auto">
                        <div className="p-6 border-b">
                            <div className="flex justify-between items-center">
                                <h2 className="text-2xl font-bold text-blue-600">{selectedEntry.snowai_model_name}</h2>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => deleteEntry(selectedEntry.id)}
                                        className="text-red-600 hover:bg-red-50 p-2 rounded"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                    <button onClick={() => setShowDetailModal(false)}>
                                        <X size={24} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <h3 className="text-lg font-semibold mb-4">Model Information</h3>
                                    <div className="space-y-3">
                                        <p><strong>Type:</strong> {selectedEntry.snowai_model_type?.replace('_', ' ')}</p>
                                        <p><strong>Status:</strong> 
                                            <span className={`ml-2 px-2 py-1 text-xs rounded ${getStatusColor(selectedEntry.snowai_status)}`}>
                                                {selectedEntry.snowai_status}
                                            </span>
                                        </p>
                                        <p><strong>Framework:</strong> {selectedEntry.snowai_framework_used || 'Not specified'}</p>
                                        <p><strong>Market:</strong> {selectedEntry.snowai_financial_market_type || 'Not specified'}</p>
                                        <p><strong>Created:</strong> {new Date(selectedEntry.snowai_created_at).toLocaleDateString()}</p>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold mb-4">Performance Metrics</h3>
                                    <div className="space-y-2">
                                        {selectedEntry.snowai_accuracy_score && (
                                            <div className="bg-green-50 p-3 rounded-lg">
                                                <strong>Accuracy:</strong> {(selectedEntry.snowai_accuracy_score * 100).toFixed(1)}%
                                            </div>
                                        )}
                                        {selectedEntry.snowai_r2_score && (
                                            <div className="bg-blue-50 p-3 rounded-lg">
                                                <strong>R² Score:</strong> {selectedEntry.snowai_r2_score.toFixed(3)}
                                            </div>
                                        )}
                                        {selectedEntry.snowai_roi_percentage && (
                                            <div className="bg-yellow-50 p-3 rounded-lg">
                                                <strong>ROI:</strong> {selectedEntry.snowai_roi_percentage.toFixed(1)}%
                                            </div>
                                        )}
                                        {selectedEntry.snowai_sharpe_ratio && (
                                            <div className="bg-purple-50 p-3 rounded-lg">
                                                <strong>Sharpe Ratio:</strong> {selectedEntry.snowai_sharpe_ratio.toFixed(2)}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {selectedEntry.snowai_description && (
                                <div className="mt-8">
                                    <h3 className="text-lg font-semibold mb-4">Description</h3>
                                    <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">
                                        {selectedEntry.snowai_description}
                                    </p>
                                </div>
                            )}

                            {selectedEntry.snowai_tags && selectedEntry.snowai_tags.length > 0 && (
                                <div className="mt-8">
                                    <h3 className="text-lg font-semibold mb-4">Tags</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedEntry.snowai_tags.map((tag, index) => (
                                            <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {selectedEntry.snowai_notes && (
                                <div className="mt-8">
                                    <h3 className="text-lg font-semibold mb-4">Notes</h3>
                                    <p className="text-gray-700 bg-gray-50 p-4 rounded-lg whitespace-pre-wrap">
                                        {selectedEntry.snowai_notes}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}