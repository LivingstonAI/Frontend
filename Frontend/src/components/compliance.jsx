import React, { useEffect, useState } from "react";
import { Search, Plus, Edit2, Trash2, Building2, FileText, Upload, X, Save, AlertCircle } from "lucide-react";
import Header from "./header";
import SideNavs from "./side_navs";


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

    // Styles object for easier management
    const styles = {
        container: {
            minHeight: '100vh',
            backgroundColor: '#f8fafc'
        },
        header: {
            backgroundColor: 'white',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
            borderBottom: '1px solid #e2e8f0'
        },
        headerContent: {
            maxWidth: '80rem',
            margin: '0 auto',
            padding: '1.5rem 1rem',
            '@media (min-width: 640px)': {
                padding: '1.5rem 1.5rem'
            },
            '@media (min-width: 1024px)': {
                padding: '1.5rem 2rem'
            }
        },
        headerFlex: {
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            '@media (min-width: 640px)': {
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between'
            }
        },
        titleSection: {
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
        },
        title: {
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: '#111827',
            margin: 0
        },
        addButton: {
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1rem',
            backgroundColor: '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            fontSize: '0.875rem',
            fontWeight: '500',
            transition: 'background-color 0.2s',
            textDecoration: 'none'
        },
        mainContent: {
            maxWidth: '80rem',
            margin: '0 auto',
            padding: '2rem 1rem',
            '@media (min-width: 640px)': {
                padding: '2rem 1.5rem'
            },
            '@media (min-width: 1024px)': {
                padding: '2rem 2rem'
            }
        },
        messageBox: {
            marginBottom: '1.5rem',
            padding: '1rem',
            borderRadius: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
        },
        errorBox: {
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#991b1b'
        },
        successBox: {
            backgroundColor: '#f0fdf4',
            border: '1px solid #bbf7d0',
            color: '#166534'
        },
        closeButton: {
            marginLeft: 'auto',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '0.25rem'
        },
        searchContainer: {
            marginBottom: '1.5rem',
            position: 'relative'
        },
        searchInput: {
            width: '100%',
            paddingLeft: '2.5rem',
            paddingRight: '1rem',
            paddingTop: '0.75rem',
            paddingBottom: '0.75rem',
            border: '1px solid #d1d5db',
            borderRadius: '0.5rem',
            fontSize: '1rem',
            outline: 'none',
            transition: 'all 0.2s'
        },
        searchIcon: {
            position: 'absolute',
            left: '0.75rem',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#9ca3af'
        },
        modal: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            zIndex: 50
        },
        modalContent: {
            backgroundColor: 'white',
            borderRadius: '0.5rem',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            maxWidth: '42rem',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto'
        },
        modalHeader: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.5rem'
        },
        modalTitle: {
            fontSize: '1.25rem',
            fontWeight: '600',
            color: '#111827',
            margin: 0
        },
        formGroup: {
            marginBottom: '1.5rem'
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
            padding: '0.5rem 0.75rem',
            border: '1px solid #d1d5db',
            borderRadius: '0.5rem',
            fontSize: '1rem',
            outline: 'none',
            transition: 'all 0.2s'
        },
        textarea: {
            width: '100%',
            padding: '0.5rem 0.75rem',
            border: '1px solid #d1d5db',
            borderRadius: '0.5rem',
            fontSize: '1rem',
            outline: 'none',
            transition: 'all 0.2s',
            resize: 'vertical',
            minHeight: '6rem'
        },
        fileUploadSection: {
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            flexWrap: 'wrap'
        },
        fileUploadButton: {
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1rem',
            backgroundColor: '#f3f4f6',
            color: '#374151',
            border: 'none',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            fontSize: '0.875rem',
            transition: 'background-color 0.2s'
        },
        logoPreview: {
            width: '4rem',
            height: '4rem',
            objectFit: 'cover',
            borderRadius: '0.5rem',
            border: '1px solid #d1d5db'
        },
        buttonGroup: {
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            paddingTop: '1rem',
            '@media (min-width: 640px)': {
                flexDirection: 'row'
            }
        },
        primaryButton: {
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1rem',
            backgroundColor: '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            fontSize: '0.875rem',
            fontWeight: '500',
            transition: 'background-color 0.2s'
        },
        secondaryButton: {
            flex: 1,
            padding: '0.5rem 1rem',
            backgroundColor: '#d1d5db',
            color: '#374151',
            border: 'none',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            fontSize: '0.875rem',
            fontWeight: '500',
            transition: 'background-color 0.2s'
        },
        loadingContainer: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '3rem 0',
            gap: '0.75rem'
        },
        spinner: {
            width: '2rem',
            height: '2rem',
            border: '2px solid #e5e7eb',
            borderTop: '2px solid #2563eb',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
        },
        emptyState: {
            textAlign: 'center',
            padding: '3rem 0'
        },
        emptyStateTitle: {
            fontSize: '1.125rem',
            fontWeight: '500',
            color: '#111827',
            marginBottom: '0.5rem'
        },
        emptyStateText: {
            color: '#6b7280',
            marginBottom: '1.5rem'
        },
        grid: {
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '1.5rem',
            '@media (min-width: 768px)': {
                gridTemplateColumns: 'repeat(2, 1fr)'
            },
            '@media (min-width: 1024px)': {
                gridTemplateColumns: 'repeat(3, 1fr)'
            }
        },
        card: {
            backgroundColor: 'white',
            borderRadius: '0.5rem',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb',
            overflow: 'hidden',
            transition: 'box-shadow 0.2s'
        },
        cardContent: {
            padding: '1.5rem'
        },
        cardHeader: {
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            marginBottom: '1rem'
        },
        firmInfo: {
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            flex: 1,
            minWidth: 0
        },
        logoContainer: {
            width: '3rem',
            height: '3rem',
            backgroundColor: '#dbeafe',
            borderRadius: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
        },
        firmDetails: {
            flex: 1,
            minWidth: 0
        },
        firmName: {
            fontSize: '1.125rem',
            fontWeight: '600',
            color: '#111827',
            margin: 0,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
        },
        firmDate: {
            fontSize: '0.875rem',
            color: '#6b7280',
            margin: 0
        },
        cardActions: {
            display: 'flex',
            gap: '0.5rem'
        },
        iconButton: {
            padding: '0.5rem',
            backgroundColor: 'transparent',
            border: 'none',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            color: '#6b7280',
            transition: 'all 0.2s'
        },
        notesSection: {
            backgroundColor: '#f8fafc',
            borderRadius: '0.5rem',
            padding: '1rem'
        },
        notesHeader: {
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '0.5rem'
        },
        notesTitle: {
            fontSize: '0.875rem',
            fontWeight: '500',
            color: '#374151',
            margin: 0
        },
        notesText: {
            fontSize: '0.875rem',
            color: '#6b7280',
            lineHeight: '1.5',
            margin: 0
        }
    };

    // CSS animations
    const cssAnimations = `
        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
        
        .search-input:focus {
            border-color: #2563eb !important;
            box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1) !important;
        }
        
        .form-input:focus {
            border-color: #2563eb !important;
            box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1) !important;
        }
        
        .add-button:hover {
            background-color: #1d4ed8 !important;
        }
        
        .primary-button:hover:not(:disabled) {
            background-color: #1d4ed8 !important;
        }
        
        .secondary-button:hover {
            background-color: #9ca3af !important;
        }
        
        .file-upload-button:hover {
            background-color: #e5e7eb !important;
        }
        
        .card:hover {
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1) !important;
        }
        
        .icon-button:hover {
            background-color: #f3f4f6 !important;
        }
        
        .edit-button:hover {
            color: #2563eb !important;
            background-color: #eff6ff !important;
        }
        
        .delete-button:hover {
            color: #dc2626 !important;
            background-color: #fef2f2 !important;
        }
        
        .close-error:hover {
            color: #7f1d1d !important;
        }
        
        .close-success:hover {
            color: #14532d !important;
        }
        
        .modal-close:hover {
            color: #4b5563 !important;
        }
        
        @media (max-width: 640px) {
            .header-flex {
                flex-direction: column !important;
                gap: 1rem !important;
            }
            
            .button-group {
                flex-direction: column !important;
            }
            
            .file-upload-section {
                flex-direction: column !important;
                align-items: flex-start !important;
            }
            
            .grid {
                grid-template-columns: 1fr !important;
            }
        }
    `;

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

    // Handle file change
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
        <>
            <style>{cssAnimations}</style>
            <div style={styles.container}>
                {/* Header */}
                <div className="header">
                                <Header />
                </div>
                <div className="main-page-body">
                                <SideNavs />
                
                <div style={styles.header}>
                    <div style={styles.headerContent}>
                        <div style={styles.headerFlex} className="header-flex">
                            <div style={styles.titleSection}>
                                <Building2 size={32} color="#2563eb" />
                                <h1 style={styles.title}>Prop Firms Compliance</h1>
                            </div>
                            <button
                                onClick={() => {
                                    resetForm();
                                    setShowForm(true);
                                }}
                                style={styles.addButton}
                                className="add-button"
                            >
                                <Plus size={20} />
                                Add New Firm
                            </button>
                        </div>
                    </div>
                </div>

                <div style={styles.mainContent}>
                    {/* Messages */}
                    {error && (
                        <div style={{...styles.messageBox, ...styles.errorBox}}>
                            <AlertCircle size={20} />
                            <span>{error}</span>
                            <button 
                                onClick={clearMessages} 
                                style={styles.closeButton}
                                className="close-error"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    )}
                    
                    {success && (
                        <div style={{...styles.messageBox, ...styles.successBox}}>
                            <div style={{
                                width: '20px',
                                height: '20px',
                                backgroundColor: '#16a34a',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <div style={{
                                    width: '8px',
                                    height: '8px',
                                    backgroundColor: 'white',
                                    borderRadius: '50%'
                                }}></div>
                            </div>
                            <span>{success}</span>
                            <button 
                                onClick={clearMessages} 
                                style={styles.closeButton}
                                className="close-success"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    )}

                    {/* Search Bar */}
                    <div style={styles.searchContainer}>
                        <div style={{position: 'relative'}}>
                            <Search style={styles.searchIcon} size={20} />
                            <input
                                type="text"
                                placeholder="Search firms or notes..."
                                value={searchQuery}
                                onChange={(e) => handleSearch(e.target.value)}
                                style={styles.searchInput}
                                className="search-input"
                            />
                        </div>
                    </div>

                    {/* Form Modal */}
                    {showForm && (
                        <div style={styles.modal}>
                            <div style={styles.modalContent}>
                                <div style={{padding: '1.5rem'}}>
                                    <div style={styles.modalHeader}>
                                        <h2 style={styles.modalTitle}>
                                            {editingRecord ? 'Edit Firm' : 'Add New Firm'}
                                        </h2>
                                        <button
                                            onClick={resetForm}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                cursor: 'pointer',
                                                color: '#9ca3af',
                                                padding: '0.25rem'
                                            }}
                                            className="modal-close"
                                        >
                                            <X size={24} />
                                        </button>
                                    </div>

                                    <div>
                                        <div style={styles.formGroup}>
                                            <label style={styles.label}>
                                                Firm Name *
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={formData.firm_name}
                                                onChange={(e) => setFormData({...formData, firm_name: e.target.value})}
                                                style={styles.input}
                                                className="form-input"
                                                placeholder="Enter firm name"
                                            />
                                        </div>

                                        <div style={styles.formGroup}>
                                            <label style={styles.label}>
                                                Firm Logo
                                            </label>
                                            <div style={styles.fileUploadSection} className="file-upload-section">
                                                <label style={styles.fileUploadButton} className="file-upload-button">
                                                    <Upload size={20} />
                                                    Choose File
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={handleFileChange}
                                                        style={{display: 'none'}}
                                                    />
                                                </label>
                                                {formData.logo_preview && (
                                                    <img
                                                        src={formData.logo_preview}
                                                        alt="Logo preview"
                                                        style={styles.logoPreview}
                                                    />
                                                )}
                                            </div>
                                        </div>

                                        <div style={styles.formGroup}>
                                            <label style={styles.label}>
                                                Personal Notes
                                            </label>
                                            <textarea
                                                value={formData.personal_notes}
                                                onChange={(e) => setFormData({...formData, personal_notes: e.target.value})}
                                                style={styles.textarea}
                                                className="form-input"
                                                placeholder="Enter your compliance notes and rules..."
                                            />
                                        </div>

                                        <div style={styles.buttonGroup} className="button-group">
                                            <button
                                                onClick={handleSubmit}
                                                disabled={loading}
                                                style={{
                                                    ...styles.primaryButton,
                                                    opacity: loading ? 0.5 : 1,
                                                    cursor: loading ? 'not-allowed' : 'pointer'
                                                }}
                                                className="primary-button"
                                            >
                                                <Save size={20} />
                                                {loading ? 'Saving...' : (editingRecord ? 'Update' : 'Create')}
                                            </button>
                                            <button
                                                onClick={resetForm}
                                                style={styles.secondaryButton}
                                                className="secondary-button"
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
                        <div style={styles.loadingContainer}>
                            <div style={styles.spinner}></div>
                            <span style={{color: '#6b7280'}}>Loading...</span>
                        </div>
                    ) : filteredRecords.length === 0 ? (
                        <div style={styles.emptyState}>
                            <Building2 size={64} color="#d1d5db" style={{margin: '0 auto 1rem'}} />
                            <h3 style={styles.emptyStateTitle}>
                                {searchQuery ? 'No records found' : 'No compliance records yet'}
                            </h3>
                            <p style={styles.emptyStateText}>
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
                                    style={styles.addButton}
                                    className="add-button"
                                >
                                    <Plus size={20} />
                                    Add Your First Firm
                                </button>
                            )}
                        </div>
                    ) : (
                        <div style={styles.grid} className="grid">
                            {filteredRecords.map((record) => (
                                <div key={record.id} style={styles.card} className="card">
                                    <div style={styles.cardContent}>
                                        <div style={styles.cardHeader}>
                                            <div style={styles.firmInfo}>
                                                {record.logo_url ? (
                                                    <img
                                                        src={record.logo_url}
                                                        alt={`${record.firm_name} logo`}
                                                        style={styles.logoPreview}
                                                    />
                                                ) : (
                                                    <div style={styles.logoContainer}>
                                                        <Building2 size={24} color="#2563eb" />
                                                    </div>
                                                )}
                                                <div style={styles.firmDetails}>
                                                    <h3 style={styles.firmName}>
                                                        {record.firm_name}
                                                    </h3>
                                                    <p style={styles.firmDate}>
                                                        Created {new Date(record.created_at).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <div style={styles.cardActions}>
                                                <button
                                                    onClick={() => handleEdit(record)}
                                                    style={styles.iconButton}
                                                    className="icon-button edit-button"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(record.id)}
                                                    style={styles.iconButton}
                                                    className="icon-button delete-button"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                        
                                        {record.personal_notes && (
                                            <div style={styles.notesSection}>
                                                <div style={styles.notesHeader}>
                                                    <FileText size={16} color="#6b7280" />
                                                    <span style={styles.notesTitle}>Notes</span>
                                                </div>
                                                <p style={styles.notesText}>
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
            </div>
        </>
    );
}