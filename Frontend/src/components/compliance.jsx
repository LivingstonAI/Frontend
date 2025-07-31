import React, { useEffect, useState } from "react";
import { Search, Plus, Edit2, Trash2, Building2, FileText, Upload, X, Save, AlertCircle } from "lucide-react";

export default function Compliance() {
    const baseUrl = 'https://backend-production-c0ab.up.railway.app';
    
    const [records, setRecords] = useState([]);
    const [filteredRecords, setFilteredRecords] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    
    // Form state
    const [formData, setFormData] = useState({
        firm_name: '',
        personal_notes: '',
        logo_file: null,
        logo_preview: null
    });

    // Fetch all records
    const fetchRecords = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${baseUrl}/api/firm-compliance/`);
            const data = await response.json();
            
            if (data.success) {
                setRecords(data.data);
                setFilteredRecords(data.data);
            } else {
                setError('Failed to fetch records');
            }
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Search functionality
    const handleSearch = (query) => {
        setSearchQuery(query);
        if (!query.trim()) {
            setFilteredRecords(records);
        } else {
            const filtered = records.filter(record =>
                record.firm_name.toLowerCase().includes(query.toLowerCase()) ||
                record.personal_notes.toLowerCase().includes(query.toLowerCase())
            );
            setFilteredRecords(filtered);
        }
    };

    // Handle form submission
    const handleSubmit = async () => {
        
        if (!formData.firm_name.trim()) {
            setError('Firm name is required');
            return;
        }

        try {
            setLoading(true);
            const url = editingRecord 
                ? `${baseUrl}/api/firm-compliance/${editingRecord.id}/`
                : `${baseUrl}/api/firm-compliance/`;
            
            const method = editingRecord ? 'PUT' : 'POST';
            const payload = {
                firm_name: formData.firm_name,
                personal_notes: formData.personal_notes,
            };

            // Handle logo upload
            if (formData.logo_file) {
                const reader = new FileReader();
                reader.onload = async () => {
                    payload.logo_data = reader.result;
                    payload.logo_filename = formData.logo_file.name;
                    
                    const response = await fetch(url, {
                        method,
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(payload),
                    });
                    
                    const data = await response.json();
                    
                    if (data.success) {
                        setSuccess(editingRecord ? 'Record updated successfully!' : 'Record created successfully!');
                        resetForm();
                        fetchRecords();
                    } else {
                        setError(data.message || 'Operation failed');
                    }
                    setLoading(false);
                };
                reader.readAsDataURL(formData.logo_file);
            } else {
                const response = await fetch(url, {
                    method,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payload),
                });
                
                const data = await response.json();
                
                if (data.success) {
                    setSuccess(editingRecord ? 'Record updated successfully!' : 'Record created successfully!');
                    resetForm();
                    fetchRecords();
                } else {
                    setError(data.message || 'Operation failed');
                }
                setLoading(false);
            }
        } catch (err) {
            setError('Network error. Please try again.');
            setLoading(false);
        }
    };

    // Delete record
    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this record?')) {
            return;
        }

        try {
            const response = await fetch(`${baseUrl}/api/firm-compliance/${id}/`, {
                method: 'DELETE',
            });
            
            const data = await response.json();
            
            if (data.success) {
                setSuccess('Record deleted successfully!');
                fetchRecords();
            } else {
                setError(data.message || 'Delete failed');
            }
        } catch (err) {
            setError('Network error. Please try again.');
        }
    };

    // Edit record
    const handleEdit = (record) => {
        setEditingRecord(record);
        setFormData({
            firm_name: record.firm_name,
            personal_notes: record.personal_notes,
            logo_file: null,
            logo_preview: record.logo_url
        });
        setShowForm(true);
    };

    // Reset form
    const resetForm = () => {
        setShowForm(false);
        setEditingRecord(null);
        setFormData({
            firm_name: '',
            personal_notes: '',
            logo_file: null,
            logo_preview: null
        });
    };

    // Handle file upload
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({
                ...formData,
                logo_file: file,
                logo_preview: URL.createObjectURL(file)
            });
        }
    };

    // Clear messages
    const clearMessages = () => {
        setError('');
        setSuccess('');
    };

    useEffect(() => {
        fetchRecords();
    }, []);

    useEffect(() => {
        if (error || success) {
            const timer = setTimeout(clearMessages, 5000);
            return () => clearTimeout(timer);
        }
    }, [error, success]);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center space-x-3 mb-4 sm:mb-0">
                            <Building2 className="w-8 h-8 text-blue-600" />
                            <h1 className="text-2xl font-bold text-gray-900">Prop Firms Compliance</h1>
                        </div>
                        <button
                            onClick={() => {
                                resetForm();
                                setShowForm(true);
                            }}
                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                        >
                            <Plus className="w-5 h-5 mr-2" />
                            Add New Firm
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Messages */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
                        <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
                        <span className="text-red-700">{error}</span>
                        <button onClick={clearMessages} className="ml-auto text-red-600 hover:text-red-800">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                )}
                
                {success && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
                        <div className="w-5 h-5 bg-green-600 rounded-full mr-3 flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                        <span className="text-green-700">{success}</span>
                        <button onClick={clearMessages} className="ml-auto text-green-600 hover:text-green-800">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                )}

                {/* Search Bar */}
                <div className="mb-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search firms or notes..."
                            value={searchQuery}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                </div>

                {/* Form Modal */}
                {showForm && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-semibold text-gray-900">
                                        {editingRecord ? 'Edit Firm' : 'Add New Firm'}
                                    </h2>
                                    <button
                                        onClick={resetForm}
                                        className="text-gray-400 hover:text-gray-600"
                                    >
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Firm Name *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.firm_name}
                                            onChange={(e) => setFormData({...formData, firm_name: e.target.value})}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Enter firm name"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Firm Logo
                                        </label>
                                        <div className="flex items-center space-x-4">
                                            <label className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 cursor-pointer transition-colors duration-200">
                                                <Upload className="w-5 h-5 mr-2" />
                                                Choose File
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleFileChange}
                                                    className="hidden"
                                                />
                                            </label>
                                            {formData.logo_preview && (
                                                <img
                                                    src={formData.logo_preview}
                                                    alt="Logo preview"
                                                    className="w-16 h-16 object-cover rounded-lg border"
                                                />
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Personal Notes
                                        </label>
                                        <textarea
                                            value={formData.personal_notes}
                                            onChange={(e) => setFormData({...formData, personal_notes: e.target.value})}
                                            rows="6"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Enter your compliance notes and rules..."
                                        />
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                                        <button
                                            onClick={handleSubmit}
                                            disabled={loading}
                                            className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                                        >
                                            <Save className="w-5 h-5 mr-2" />
                                            {loading ? 'Saving...' : (editingRecord ? 'Update' : 'Create')}
                                        </button>
                                        <button
                                            onClick={resetForm}
                                            className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors duration-200"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Records Grid */}
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <span className="ml-3 text-gray-600">Loading...</span>
                    </div>
                ) : filteredRecords.length === 0 ? (
                    <div className="text-center py-12">
                        <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            {searchQuery ? 'No records found' : 'No compliance records yet'}
                        </h3>
                        <p className="text-gray-600 mb-6">
                            {searchQuery 
                                ? 'Try adjusting your search terms'
                                : 'Start by adding your first prop firm compliance record'
                            }
                        </p>
                        {!searchQuery && (
                            <button
                                onClick={() => {
                                    resetForm();
                                    setShowForm(true);
                                }}
                                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                            >
                                <Plus className="w-5 h-5 mr-2" />
                                Add Your First Firm
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredRecords.map((record) => (
                            <div key={record.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
                                <div className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center space-x-3 flex-1">
                                            {record.logo_url ? (
                                                <img
                                                    src={record.logo_url}
                                                    alt={`${record.firm_name} logo`}
                                                    className="w-12 h-12 object-cover rounded-lg border"
                                                />
                                            ) : (
                                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                                    <Building2 className="w-6 h-6 text-blue-600" />
                                                </div>
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-lg font-semibold text-gray-900 truncate">
                                                    {record.firm_name}
                                                </h3>
                                                <p className="text-sm text-gray-500">
                                                    Created {new Date(record.created_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => handleEdit(record)}
                                                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(record.id)}
                                                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                    
                                    {record.personal_notes && (
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <div className="flex items-center mb-2">
                                                <FileText className="w-4 h-4 text-gray-600 mr-2" />
                                                <span className="text-sm font-medium text-gray-700">Notes</span>
                                            </div>
                                            <p className="text-sm text-gray-600 leading-relaxed">
                                                {record.personal_notes.length > 150 
                                                    ? `${record.personal_notes.substring(0, 150)}...`
                                                    : record.personal_notes
                                                }
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}