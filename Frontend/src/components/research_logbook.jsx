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

    const getStatusStyle = (status) => {
        const statusStyles = {
            'experimental': styles.statusExperimental,
            'validated': styles.statusValidated,
            'production': styles.statusProduction,
            'deprecated': styles.statusDeprecated
        };
        return { ...styles.statusBadge, ...statusStyles[status] };
    };

    const formatMetric = (name, value, isPercent = false) => {
        if (!value) return null;
        return `${name}: ${isPercent ? (value * 100).toFixed(1) + '%' : value.toFixed(3)}`;
    };

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
}
