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

    // Enhanced styles
    const styles = {
        container: {
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #f8faff 0%, #e8f2ff 100%)',
            padding: '1.5rem',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
        },
        header: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '2rem',
            padding: '1rem 0'
        },
        headerTitle: {
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
        },
        title: {
            fontSize: '2rem',
            fontWeight: '700',
            color: '#1e40af',
            margin: 0,
            textShadow: '0 1px 3px rgba(30, 64, 175, 0.1)'
        },
        addButton: {
            backgroundColor: '#1e40af',
            color: 'white',
            border: 'none',
            padding: '0.875rem 1.5rem',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            cursor: 'pointer',
            fontSize: '0.95rem',
            fontWeight: '600',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 12px rgba(30, 64, 175, 0.3)',
            ':hover': {
                backgroundColor: '#1d4ed8',
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 20px rgba(30, 64, 175, 0.4)'
            }
        },
        analyticsGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem',
            marginBottom: '2rem'
        },
        analyticsCard: {
            backgroundColor: 'white',
            padding: '1.5rem',
            borderRadius: '16px',
            boxShadow: '0 4px 20px rgba(30, 64, 175, 0.08)',
            border: '1px solid rgba(30, 64, 175, 0.1)',
            transition: 'all 0.3s ease',
            position: 'relative',
            overflow: 'hidden',
            ':hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 30px rgba(30, 64, 175, 0.15)'
            }
        },
        cardHeader: {
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            marginBottom: '0.75rem'
        },
        cardTitle: {
            fontSize: '0.95rem',
            fontWeight: '600',
            color: '#374151',
            margin: 0
        },
        cardValue: {
            fontSize: '2.25rem',
            fontWeight: '700',
            margin: 0,
            lineHeight: 1
        },
        searchContainer: {
            backgroundColor: 'white',
            padding: '1.5rem',
            borderRadius: '16px',
            boxShadow: '0 4px 20px rgba(30, 64, 175, 0.08)',
            border: '1px solid rgba(30, 64, 175, 0.1)',
            marginBottom: '2rem'
        },
        searchInputWrapper: {
            position: 'relative',
            marginBottom: '1rem'
        },
        searchInput: {
            width: '100%',
            padding: '0.875rem 1rem 0.875rem 2.5rem',
            border: '2px solid #e5e7eb',
            borderRadius: '12px',
            fontSize: '0.95rem',
            transition: 'all 0.3s ease',
            backgroundColor: '#f8fafc',
            outline: 'none',
            ':focus': {
                borderColor: '#1e40af',
                backgroundColor: 'white',
                boxShadow: '0 0 0 3px rgba(30, 64, 175, 0.1)'
            }
        },
        searchIcon: {
            position: 'absolute',
            left: '0.75rem',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#9ca3af',
            pointerEvents: 'none'
        },
        filtersGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem'
        },
        select: {
            padding: '0.875rem',
            border: '2px solid #e5e7eb',
            borderRadius: '12px',
            fontSize: '0.95rem',
            backgroundColor: '#f8fafc',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            outline: 'none',
            ':focus': {
                borderColor: '#1e40af',
                backgroundColor: 'white',
                boxShadow: '0 0 0 3px rgba(30, 64, 175, 0.1)'
            }
        },
        loadingContainer: {
            textAlign: 'center',
            padding: '3rem 0',
            color: '#6b7280'
        },
        spinner: {
            width: '3rem',
            height: '3rem',
            border: '3px solid #e5e7eb',
            borderTop: '3px solid #1e40af',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
        },
        emptyState: {
            textAlign: 'center',
            padding: '4rem 0',
            color: '#6b7280'
        },
        emptyIcon: {
            margin: '0 auto 1rem',
            color: '#d1d5db'
        },
        entriesGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '1.5rem'
        },
        entryCard: {
            backgroundColor: 'white',
            padding: '1.5rem',
            borderRadius: '16px',
            boxShadow: '0 4px 20px rgba(30, 64, 175, 0.08)',
            border: '1px solid rgba(30, 64, 175, 0.1)',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            position: 'relative',
            ':hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 30px rgba(30, 64, 175, 0.15)',
                borderColor: 'rgba(30, 64, 175, 0.2)'
            }
        },
        entryHeader: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '1rem'
        },
        entryTitle: {
            fontSize: '1.125rem',
            fontWeight: '600',
            color: '#1e40af',
            margin: 0,
            lineHeight: 1.3,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
        },
        entryMeta: {
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '0.75rem',
            fontSize: '0.875rem'
        },
        modelType: {
            color: '#6b7280',
            textTransform: 'capitalize',
            fontWeight: '500'
        },
        statusBadge: {
            padding: '0.25rem 0.75rem',
            fontSize: '0.75rem',
            fontWeight: '600',
            borderRadius: '20px',
            textTransform: 'capitalize'
        },
        statusExperimental: {
            backgroundColor: '#fef3c7',
            color: '#d97706'
        },
        statusValidated: {
            backgroundColor: '#d1fae5',
            color: '#059669'
        },
        statusProduction: {
            backgroundColor: '#dbeafe',
            color: '#2563eb'
        },
        statusDeprecated: {
            backgroundColor: '#fee2e2',
            color: '#dc2626'
        },
        entryDescription: {
            fontSize: '0.875rem',
            color: '#6b7280',
            lineHeight: 1.5,
            marginBottom: '1rem',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
        },
        metricBadge: {
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            backgroundColor: '#eff6ff',
            color: '#1d4ed8',
            padding: '0.5rem 0.75rem',
            borderRadius: '10px',
            fontSize: '0.875rem',
            fontWeight: '600',
            marginBottom: '1rem'
        },
        tagsContainer: {
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.25rem',
            marginBottom: '1rem'
        },
        tag: {
            backgroundColor: '#f3f4f6',
            color: '#374151',
            padding: '0.25rem 0.5rem',
            fontSize: '0.75rem',
            borderRadius: '6px',
            fontWeight: '500'
        },
        tagOverflow: {
            backgroundColor: '#f3f4f6',
            color: '#6b7280',
            padding: '0.25rem 0.5rem',
            fontSize: '0.75rem',
            borderRadius: '6px'
        },
        entryFooter: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.75rem',
            color: '#9ca3af',
            paddingTop: '1rem',
            borderTop: '1px solid #f3f4f6'
        },
        dateContainer: {
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem'
        },
        marketBadge: {
            backgroundColor: '#fef3c7',
            color: '#d97706',
            padding: '0.25rem 0.5rem',
            borderRadius: '6px',
            textTransform: 'capitalize',
            fontWeight: '500'
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
            padding: '1rem',
            backdropFilter: 'blur(4px)'
        },
        modalContent: {
            backgroundColor: 'white',
            borderRadius: '16px',
            maxWidth: '48rem',
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            border: '1px solid rgba(30, 64, 175, 0.1)'
        },
        modalHeader: {
            padding: '1.5rem',
            borderBottom: '1px solid #e5e7eb',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
        },
        modalTitle: {
            fontSize: '1.25rem',
            fontWeight: '700',
            color: '#1e40af',
            margin: 0
        },
        closeButton: {
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '0.5rem',
            borderRadius: '8px',
            color: '#6b7280',
            transition: 'all 0.3s ease',
            ':hover': {
                backgroundColor: '#f3f4f6',
                color: '#374151'
            }
        },
        form: {
            padding: '1.5rem'
        },
        formGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1rem',
            marginBottom: '1rem'
        },
        formGroup: {
            marginBottom: '1rem'
        },
        label: {
            display: 'block',
            fontSize: '0.875rem',
            fontWeight: '600',
            color: '#374151',
            marginBottom: '0.5rem'
        },
        input: {
            width: '100%',
            padding: '0.875rem',
            border: '2px solid #e5e7eb',
            borderRadius: '12px',
            fontSize: '0.95rem',
            transition: 'all 0.3s ease',
            backgroundColor: '#f8fafc',
            outline: 'none',
            boxSizing: 'border-box',
            ':focus': {
                borderColor: '#1e40af',
                backgroundColor: 'white',
                boxShadow: '0 0 0 3px rgba(30, 64, 175, 0.1)'
            }
        },
        textarea: {
            width: '100%',
            padding: '0.875rem',
            border: '2px solid #e5e7eb',
            borderRadius: '12px',
            fontSize: '0.95rem',
            resize: 'vertical',
            minHeight: '100px',
            fontFamily: 'inherit',
            transition: 'all 0.3s ease',
            backgroundColor: '#f8fafc',
            outline: 'none',
            boxSizing: 'border-box',
            ':focus': {
                borderColor: '#1e40af',
                backgroundColor: 'white',
                boxShadow: '0 0 0 3px rgba(30, 64, 175, 0.1)'
            }
        },
        buttonGroup: {
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '0.75rem',
            marginTop: '1.5rem'
        },
        buttonSecondary: {
            padding: '0.875rem 1.5rem',
            border: '2px solid #e5e7eb',
            borderRadius: '12px',
            backgroundColor: 'white',
            color: '#374151',
            cursor: 'pointer',
            fontSize: '0.95rem',
            fontWeight: '600',
            transition: 'all 0.3s ease',
            ':hover': {
                backgroundColor: '#f9fafb',
                borderColor: '#d1d5db'
            }
        },
        buttonPrimary: {
            padding: '0.875rem 1.5rem',
            border: 'none',
            borderRadius: '12px',
            backgroundColor: '#1e40af',
            color: 'white',
            cursor: 'pointer',
            fontSize: '0.95rem',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            transition: 'all 0.3s ease',
            ':hover': {
                backgroundColor: '#1d4ed8',
                transform: 'translateY(-1px)'
            }
        },
        detailGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem'
        },
        detailSection: {
            marginBottom: '2rem'
        },
        sectionTitle: {
            fontSize: '1.125rem',
            fontWeight: '600',
            color: '#1f2937',
            marginBottom: '1rem'
        },
        detailItem: {
            marginBottom: '0.75rem',
            color: '#374151'
        },
        metricCard: {
            padding: '0.875rem',
            borderRadius: '12px',
            marginBottom: '0.5rem',
            fontSize: '0.95rem'
        },
        metricGreen: {
            backgroundColor: '#f0fdf4',
            color: '#15803d'
        },
        metricBlue: {
            backgroundColor: '#eff6ff',
            color: '#1d4ed8'
        },
        metricYellow: {
            backgroundColor: '#fffbeb',
            color: '#d97706'
        },
        metricPurple: {
            backgroundColor: '#faf5ff',
            color: '#7c3aed'
        },
        descriptionBox: {
            backgroundColor: '#f8fafc',
            padding: '1rem',
            borderRadius: '12px',
            color: '#374151',
            lineHeight: 1.6
        },
        tagsPill: {
            backgroundColor: '#dbeafe',
            color: '#1e40af',
            padding: '0.5rem 0.875rem',
            borderRadius: '20px',
            fontSize: '0.875rem',
            fontWeight: '500',
            margin: '0.25rem'
        },
        deleteButton: {
            color: '#dc2626',
            background: 'none',
            border: 'none',
            padding: '0.5rem',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            ':hover': {
                backgroundColor: '#fee2e2'
            }
        },
        // Mobile responsive styles
        '@media (max-width: 768px)': {
            container: {
                padding: '1rem'
            },
            header: {
                flexDirection: 'column',
                gap: '1rem',
                alignItems: 'stretch'
            },
            title: {
                fontSize: '1.5rem'
            },
            addButton: {
                justifyContent: 'center',
                width: '100%'
            },
            analyticsGrid: {
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem'
            },
            analyticsCard: {
                padding: '1rem'
            },
            cardValue: {
                fontSize: '1.875rem'
            },
            searchContainer: {
                padding: '1rem'
            },
            filtersGrid: {
                gridTemplateColumns: '1fr'
            },
            entriesGrid: {
                gridTemplateColumns: '1fr'
            },
            entryCard: {
                padding: '1rem'
            },
            formGrid: {
                gridTemplateColumns: '1fr'
            },
            buttonGroup: {
                flexDirection: 'column'
            },
            detailGrid: {
                gridTemplateColumns: '1fr'
            },
            modalContent: {
                margin: '0.5rem',
                maxHeight: '95vh'
            }
        },
        // Animations
        '@keyframes spin': {
            '0%': { transform: 'rotate(0deg)' },
            '100%': { transform: 'rotate(360deg)' }
        }
    };

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

<<<<<<< HEAD
    const getStatusStyle = (status) => {
        const statusStyles = {
            'experimental': styles.statusExperimental,
            'validated': styles.statusValidated,
            'production': styles.statusProduction,
            'deprecated': styles.statusDeprecated
        };
        return { ...styles.statusBadge, ...statusStyles[status] };
=======
    const getStatusColor = (status) => {
        const colors = {
            'experimental': 'bg-amber-100 text-amber-800 border-amber-200',
            'validated': 'bg-emerald-100 text-emerald-800 border-emerald-200',
            'production': 'bg-blue-100 text-blue-800 border-blue-200',
            'deprecated': 'bg-red-100 text-red-800 border-red-200'
        };
        return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
>>>>>>> 22fa9b8cc2efd6794cbfcf58df1398e5e8401849
    };

    const formatMetric = (name, value, isPercent = false) => {
        if (!value) return null;
        return `${name}: ${isPercent ? (value * 100).toFixed(1) + '%' : value.toFixed(3)}`;
    };

<<<<<<< HEAD
    return (
        <div style={styles.container}>
            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                
                @media (max-width: 768px) {
                    .mobile-responsive {
                        flex-direction: column !important;
                        align-items: stretch !important;
                    }
                }
            `}</style>
            
            {/* Header */}
            <Header />
            <SideNavs />
            
            <div style={styles.header} className="mobile-responsive">
                <div style={styles.headerTitle}>
                    <Brain size={32} color="#1e40af" />
                    <h1 style={styles.title}>SnowAI Research Logbook</h1>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    style={styles.addButton}
                    onMouseOver={(e) => {
                        e.target.style.backgroundColor = '#1d4ed8';
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 6px 20px rgba(30, 64, 175, 0.4)';
                    }}
                    onMouseOut={(e) => {
                        e.target.style.backgroundColor = '#1e40af';
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 4px 12px rgba(30, 64, 175, 0.3)';
                    }}
                >
                    <Plus size={20} />
                    Add Model
                </button>
            </div>

            {/* Analytics Cards */}
            {analytics && (
                <div style={styles.analyticsGrid}>
                    <div style={styles.analyticsCard}>
                        <div style={styles.cardHeader}>
                            <Database color="#1e40af" size={24} />
                            <h3 style={styles.cardTitle}>Total Models</h3>
                        </div>
                        <p style={{...styles.cardValue, color: '#1e40af'}}>{analytics.snowai_total_entries}</p>
                    </div>
                    
                    {analytics.snowai_accuracy_statistics?.count > 0 && (
                        <div style={styles.analyticsCard}>
                            <div style={styles.cardHeader}>
                                <Target color="#059669" size={24} />
                                <h3 style={styles.cardTitle}>Avg Accuracy</h3>
                            </div>
                            <p style={{...styles.cardValue, color: '#059669'}}>
                                {(analytics.snowai_accuracy_statistics.avg * 100).toFixed(1)}%
                            </p>
                        </div>
                    )}
                    
                    {analytics.snowai_roi_statistics?.count > 0 && (
                        <div style={styles.analyticsCard}>
                            <div style={styles.cardHeader}>
                                <DollarSign color="#dc2626" size={24} />
                                <h3 style={styles.cardTitle}>Avg ROI</h3>
                            </div>
                            <p style={{...styles.cardValue, color: '#dc2626'}}>
                                {analytics.snowai_roi_statistics.avg.toFixed(1)}%
                            </p>
                        </div>
                    )}
                    
                    {analytics.snowai_r2_statistics?.count > 0 && (
                        <div style={styles.analyticsCard}>
                            <div style={styles.cardHeader}>
                                <TrendingUp color="#7c3aed" size={24} />
                                <h3 style={styles.cardTitle}>Avg R²</h3>
                            </div>
                            <p style={{...styles.cardValue, color: '#7c3aed'}}>
                                {analytics.snowai_r2_statistics.avg.toFixed(3)}
                            </p>
                        </div>
                    )}
                </div>
            )}

            {/* Search and Filters */}
            <div style={styles.searchContainer}>
                <div style={styles.searchInputWrapper}>
                    <Search size={20} style={styles.searchIcon} />
                    <input
                        type="text"
                        placeholder="Search models..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={styles.searchInput}
                        onFocus={(e) => {
                            e.target.style.borderColor = '#1e40af';
                            e.target.style.backgroundColor = 'white';
                            e.target.style.boxShadow = '0 0 0 3px rgba(30, 64, 175, 0.1)';
                        }}
                        onBlur={(e) => {
                            e.target.style.borderColor = '#e5e7eb';
                            e.target.style.backgroundColor = '#f8fafc';
                            e.target.style.boxShadow = 'none';
                        }}
                    />
                </div>
                
                <div style={styles.filtersGrid}>
                    <select
                        value={filters.model_type}
                        onChange={(e) => setFilters({...filters, model_type: e.target.value})}
                        style={styles.select}
                        onFocus={(e) => {
                            e.target.style.borderColor = '#1e40af';
                            e.target.style.backgroundColor = 'white';
                            e.target.style.boxShadow = '0 0 0 3px rgba(30, 64, 175, 0.1)';
                        }}
                        onBlur={(e) => {
                            e.target.style.borderColor = '#e5e7eb';
                            e.target.style.backgroundColor = '#f8fafc';
                            e.target.style.boxShadow = 'none';
                        }}
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
                        style={styles.select}
                        onFocus={(e) => {
                            e.target.style.borderColor = '#1e40af';
                            e.target.style.backgroundColor = 'white';
                            e.target.style.boxShadow = '0 0 0 3px rgba(30, 64, 175, 0.1)';
                        }}
                        onBlur={(e) => {
                            e.target.style.borderColor = '#e5e7eb';
                            e.target.style.backgroundColor = '#f8fafc';
                            e.target.style.boxShadow = 'none';
                        }}
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
                        style={styles.select}
                        onFocus={(e) => {
                            e.target.style.borderColor = '#1e40af';
                            e.target.style.backgroundColor = 'white';
                            e.target.style.boxShadow = '0 0 0 3px rgba(30, 64, 175, 0.1)';
                        }}
                        onBlur={(e) => {
                            e.target.style.borderColor = '#e5e7eb';
                            e.target.style.backgroundColor = '#f8fafc';
                            e.target.style.boxShadow = 'none';
                        }}
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
                <div style={styles.loadingContainer}>
                    <div style={styles.spinner}></div>
                    <p>Loading models...</p>
                </div>
            ) : entries.length === 0 ? (
                <div style={styles.emptyState}>
                    <Brain size={64} style={styles.emptyIcon} />
                    <h3 style={{fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem', color: '#374151'}}>No models found</h3>
                    <p>Start by adding your first ML model entry</p>
                </div>
            ) : (
                <div style={styles.entriesGrid}>
                    {entries.map((entry) => (
                        <div
                            key={entry.id}
                            style={styles.entryCard}
                            onClick={() => viewDetails(entry.id)}
                            onMouseOver={(e) => {
                                e.currentTarget.style.transform = 'translateY(-4px)';
                                e.currentTarget.style.boxShadow = '0 8px 30px rgba(30, 64, 175, 0.15)';
                                e.currentTarget.style.borderColor = 'rgba(30, 64, 175, 0.2)';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 4px 20px rgba(30, 64, 175, 0.08)';
                                e.currentTarget.style.borderColor = 'rgba(30, 64, 175, 0.1)';
                            }}
                        >
                            <div style={styles.entryHeader}>
                                <h3 style={styles.entryTitle}>
                                    {entry.snowai_model_name}
                                </h3>
                            </div>

                            <div style={styles.entryMeta}>
                                <span style={styles.modelType}>
                                    {entry.snowai_model_type?.replace('_', ' ')}
                                </span>
                                <span style={getStatusStyle(entry.snowai_status)}>
                                    {entry.snowai_status}
                                </span>
                            </div>

                            {entry.snowai_description && (
                                <p style={styles.entryDescription}>
                                    {entry.snowai_description}
                                </p>
                            )}

                            {/* Primary Metric */}
                            {entry.snowai_primary_metric && (
                                <div style={styles.metricBadge}>
                                    <Target size={14} />
                                    {formatMetric(
                                        entry.snowai_primary_metric.name,
                                        entry.snowai_primary_metric.value,
                                        entry.snowai_primary_metric.format?.includes('%')
                                    )}
                                </div>
                            )}

                            {/* Tags */}
                            {entry.snowai_tags && entry.snowai_tags.length > 0 && (
                                <div style={styles.tagsContainer}>
                                    {entry.snowai_tags.slice(0, 3).map((tag, index) => (
                                        <span key={index} style={styles.tag}>
                                            {tag}
                                        </span>
                                    ))}
                                    {entry.snowai_tags.length > 3 && (
                                        <span style={styles.tagOverflow}>
                                            +{entry.snowai_tags.length - 3}
                                        </span>
                                    )}
                                </div>
                            )}

                            <div style={styles.entryFooter}>
                                <div style={styles.dateContainer}>
                                    <Calendar size={12} />
                                    {new Date(entry.snowai_created_at).toLocaleDateString()}
                                </div>
                                {entry.snowai_financial_market_type && (
                                    <span style={styles.marketBadge}>
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
                <div style={styles.modal}>
                    <div style={styles.modalContent}>
                        <div style={styles.modalHeader}>
                            <h2 style={styles.modalTitle}>Add New ML Model</h2>
                            <button 
                                onClick={() => setShowAddModal(false)}
                                style={styles.closeButton}
                                onMouseOver={(e) => {
                                    e.target.style.backgroundColor = '#f3f4f6';
                                    e.target.style.color = '#374151';
                                }}
                                onMouseOut={(e) => {
                                    e.target.style.backgroundColor = 'transparent';
                                    e.target.style.color = '#6b7280';
                                }}
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={(e) => { e.preventDefault(); createEntry(); }} style={styles.form}>
                            <div style={styles.formGrid}>
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Model Name *</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.snowai_model_name}
                                        onChange={(e) => setFormData({...formData, snowai_model_name: e.target.value})}
                                        style={styles.input}
                                        placeholder="LSTM Stock Predictor"
                                        onFocus={(e) => {
                                            e.target.style.borderColor = '#1e40af';
                                            e.target.style.backgroundColor = 'white';
                                            e.target.style.boxShadow = '0 0 0 3px rgba(30, 64, 175, 0.1)';
                                        }}
                                        onBlur={(e) => {
                                            e.target.style.borderColor = '#e5e7eb';
                                            e.target.style.backgroundColor = '#f8fafc';
                                            e.target.style.boxShadow = 'none';
                                        }}
                                    />
                                </div>

                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Model Type</label>
                                    <select
                                        value={formData.snowai_model_type}
                                        onChange={(e) => setFormData({...formData, snowai_model_type: e.target.value})}
                                        style={styles.select}
                                        onFocus={(e) => {
                                            e.target.style.borderColor = '#1e40af';
                                            e.target.style.backgroundColor = 'white';
                                            e.target.style.boxShadow = '0 0 0 3px rgba(30, 64, 175, 0.1)';
                                        }}
                                        onBlur={(e) => {
                                            e.target.style.borderColor = '#e5e7eb';
                                            e.target.style.backgroundColor = '#f8fafc';
                                            e.target.style.boxShadow = 'none';
                                        }}
                                    >
                                        <option value="classification">Classification</option>
                                        <option value="regression">Regression</option>
                                        <option value="neural_network">Neural Network</option>
                                        <option value="deep_learning">Deep Learning</option>
                                    </select>
                                </div>

                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Status</label>
                                    <select
                                        value={formData.snowai_status}
                                        onChange={(e) => setFormData({...formData, snowai_status: e.target.value})}
                                        style={styles.select}
                                        onFocus={(e) => {
                                            e.target.style.borderColor = '#1e40af';
                                            e.target.style.backgroundColor = 'white';
                                            e.target.style.boxShadow = '0 0 0 3px rgba(30, 64, 175, 0.1)';
                                        }}
                                        onBlur={(e) => {
                                            e.target.style.borderColor = '#e5e7eb';
                                            e.target.style.backgroundColor = '#f8fafc';
                                            e.target.style.boxShadow = 'none';
                                        }}
                                    >
                                        <option value="experimental">Experimental</option>
                                        <option value="validated">Validated</option>
                                        <option value="production">Production</option>
                                        <option value="deprecated">Deprecated</option>
                                    </select>
                                </div>

                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Accuracy Score</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        max="1"
                                        value={formData.snowai_accuracy_score}
                                        onChange={(e) => setFormData({...formData, snowai_accuracy_score: e.target.value})}
                                        style={styles.input}
                                        placeholder="0.85"
                                        onFocus={(e) => {
                                            e.target.style.borderColor = '#1e40af';
                                            e.target.style.backgroundColor = 'white';
                                            e.target.style.boxShadow = '0 0 0 3px rgba(30, 64, 175, 0.1)';
                                        }}
                                        onBlur={(e) => {
                                            e.target.style.borderColor = '#e5e7eb';
                                            e.target.style.backgroundColor = '#f8fafc';
                                            e.target.style.boxShadow = 'none';
                                        }}
                                    />
                                </div>

                                <div style={styles.formGroup}>
                                    <label style={styles.label}>R² Score</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={formData.snowai_r2_score}
                                        onChange={(e) => setFormData({...formData, snowai_r2_score: e.target.value})}
                                        style={styles.input}
                                        placeholder="0.92"
                                        onFocus={(e) => {
                                            e.target.style.borderColor = '#1e40af';
                                            e.target.style.backgroundColor = 'white';
                                            e.target.style.boxShadow = '0 0 0 3px rgba(30, 64, 175, 0.1)';
                                        }}
                                        onBlur={(e) => {
                                            e.target.style.borderColor = '#e5e7eb';
                                            e.target.style.backgroundColor = '#f8fafc';
                                            e.target.style.boxShadow = 'none';
                                        }}
                                    />
                                </div>

                                <div style={styles.formGroup}>
                                    <label style={styles.label}>ROI (%)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={formData.snowai_roi_percentage}
                                        onChange={(e) => setFormData({...formData, snowai_roi_percentage: e.target.value})}
                                        style={styles.input}
                                        placeholder="23.7"
                                        onFocus={(e) => {
                                            e.target.style.borderColor = '#1e40af';
                                            e.target.style.backgroundColor = 'white';
                                            e.target.style.boxShadow = '0 0 0 3px rgba(30, 64, 175, 0.1)';
                                        }}
                                        onBlur={(e) => {
                                            e.target.style.borderColor = '#e5e7eb';
                                            e.target.style.backgroundColor = '#f8fafc';
                                            e.target.style.boxShadow = 'none';
                                        }}
                                    />
                                </div>
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.label}>Description</label>
                                <textarea
                                    value={formData.snowai_description}
                                    onChange={(e) => setFormData({...formData, snowai_description: e.target.value})}
                                    style={styles.textarea}
                                    placeholder="Describe your model's purpose and approach..."
                                    onFocus={(e) => {
                                        e.target.style.borderColor = '#1e40af';
                                        e.target.style.backgroundColor = 'white';
                                        e.target.style.boxShadow = '0 0 0 3px rgba(30, 64, 175, 0.1)';
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.borderColor = '#e5e7eb';
                                        e.target.style.backgroundColor = '#f8fafc';
                                        e.target.style.boxShadow = 'none';
                                    }}
                                />
                            </div>

                            <div style={styles.buttonGroup} className="mobile-responsive">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    style={styles.buttonSecondary}
                                    onMouseOver={(e) => {
                                        e.target.style.backgroundColor = '#f9fafb';
                                        e.target.style.borderColor = '#d1d5db';
                                    }}
                                    onMouseOut={(e) => {
                                        e.target.style.backgroundColor = 'white';
                                        e.target.style.borderColor = '#e5e7eb';
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    style={styles.buttonPrimary}
                                    onMouseOver={(e) => {
                                        e.target.style.backgroundColor = '#1d4ed8';
                                        e.target.style.transform = 'translateY(-1px)';
                                    }}
                                    onMouseOut={(e) => {
                                        e.target.style.backgroundColor = '#1e40af';
                                        e.target.style.transform = 'translateY(0)';
                                    }}
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
                <div style={styles.modal}>
                    <div style={styles.modalContent}>
                        <div style={styles.modalHeader}>
                            <h2 style={styles.modalTitle}>{selectedEntry.snowai_model_name}</h2>
                            <div style={{display: 'flex', gap: '0.5rem'}}>
                                <button
                                    onClick={() => deleteEntry(selectedEntry.id)}
                                    style={styles.deleteButton}
                                    onMouseOver={(e) => {
                                        e.target.style.backgroundColor = '#fee2e2';
                                    }}
                                    onMouseOut={(e) => {
                                        e.target.style.backgroundColor = 'transparent';
                                    }}
                                >
                                    <Trash2 size={20} />
                                </button>
                                <button 
                                    onClick={() => setShowDetailModal(false)}
                                    style={styles.closeButton}
                                    onMouseOver={(e) => {
                                        e.target.style.backgroundColor = '#f3f4f6';
                                        e.target.style.color = '#374151';
                                    }}
                                    onMouseOut={(e) => {
                                        e.target.style.backgroundColor = 'transparent';
                                        e.target.style.color = '#6b7280';
                                    }}
                                >
                                    <X size={24} />
                                </button>
                            </div>
                        </div>

                        <div style={styles.form}>
                            <div style={styles.detailGrid}>
                                <div style={styles.detailSection}>
                                    <h3 style={styles.sectionTitle}>Model Information</h3>
                                    <div>
                                        <div style={styles.detailItem}><strong>Type:</strong> {selectedEntry.snowai_model_type?.replace('_', ' ')}</div>
                                        <div style={styles.detailItem}>
                                            <strong>Status:</strong>
                                            <span style={{...getStatusStyle(selectedEntry.snowai_status), marginLeft: '0.5rem'}}>
                                                {selectedEntry.snowai_status}
                                            </span>
                                        </div>
                                        <div style={styles.detailItem}><strong>Framework:</strong> {selectedEntry.snowai_framework_used || 'Not specified'}</div>
                                        <div style={styles.detailItem}><strong>Market:</strong> {selectedEntry.snowai_financial_market_type || 'Not specified'}</div>
                                        <div style={styles.detailItem}><strong>Created:</strong> {new Date(selectedEntry.snowai_created_at).toLocaleDateString()}</div>
                                    </div>
                                </div>

                                <div style={styles.detailSection}>
                                    <h3 style={styles.sectionTitle}>Performance Metrics</h3>
                                    <div>
                                        {selectedEntry.snowai_accuracy_score && (
                                            <div style={{...styles.metricCard, ...styles.metricGreen}}>
                                                <strong>Accuracy:</strong> {(selectedEntry.snowai_accuracy_score * 100).toFixed(1)}%
                                            </div>
                                        )}
                                        {selectedEntry.snowai_r2_score && (
                                            <div style={{...styles.metricCard, ...styles.metricBlue}}>
                                                <strong>R² Score:</strong> {selectedEntry.snowai_r2_score.toFixed(3)}
                                            </div>
                                        )}
                                        {selectedEntry.snowai_roi_percentage && (
                                            <div style={{...styles.metricCard, ...styles.metricYellow}}>
                                                <strong>ROI:</strong> {selectedEntry.snowai_roi_percentage.toFixed(1)}%
                                            </div>
                                        )}
                                        {selectedEntry.snowai_sharpe_ratio && (
                                            <div style={{...styles.metricCard, ...styles.metricPurple}}>
                                                <strong>Sharpe Ratio:</strong> {selectedEntry.snowai_sharpe_ratio.toFixed(2)}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {selectedEntry.snowai_description && (
                                <div style={styles.detailSection}>
                                    <h3 style={styles.sectionTitle}>Description</h3>
                                    <div style={styles.descriptionBox}>
                                        {selectedEntry.snowai_description}
                                    </div>
                                </div>
                            )}

                            {selectedEntry.snowai_tags && selectedEntry.snowai_tags.length > 0 && (
                                <div style={styles.detailSection}>
                                    <h3 style={styles.sectionTitle}>Tags</h3>
                                    <div style={{display: 'flex', flexWrap: 'wrap', gap: '0.5rem'}}>
                                        {selectedEntry.snowai_tags.map((tag, index) => (
                                            <span key={index} style={styles.tagsPill}>
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {selectedEntry.snowai_notes && (
                                <div style={styles.detailSection}>
                                    <h3 style={styles.sectionTitle}>Notes</h3>
                                    <div style={styles.descriptionBox}>
                                        {selectedEntry.snowai_notes}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
    
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
>>>>>>> 22fa9b8cc2efd6794cbfcf58df1398e5e8401849
}