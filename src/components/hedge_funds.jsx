import React, { useEffect, useState } from "react";
import Header from "./header";
import SideNavs from "./side_navs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChevronDown, TrendingUp, Edit2, Trash2 } from 'lucide-react';

export default function HedgeFundTracker() {
    const baseUrl = 'https://backend-production-c0ab.up.railway.app';
    
    const [hedgeFunds, setHedgeFunds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedFund, setSelectedFund] = useState(null);
    const [showAddFundModal, setShowAddFundModal] = useState(false);
    const [showEditFundModal, setShowEditFundModal] = useState(false);
    const [showAddPersonModal, setShowAddPersonModal] = useState(false);
    const [showEditPersonModal, setShowEditPersonModal] = useState(false);
    const [showAddResourceModal, setShowAddResourceModal] = useState(false);
    const [showEditResourceModal, setShowEditResourceModal] = useState(false);
    const [showAddPerformanceModal, setShowAddPerformanceModal] = useState(false);
    const [showEditPerformanceModal, setShowEditPerformanceModal] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [showFundSelector, setShowFundSelector] = useState(false);
    const [showPerformanceChart, setShowPerformanceChart] = useState(false);
    
    const [newFund, setNewFund] = useState({
        name: '',
        logo_base64: '',
        description: '',
        founded_year: '',
        aum: '',
        strategy: '',
        headquarters: '',
        website: ''
    });
    
    const [editFund, setEditFund] = useState({
        id: null,
        name: '',
        logo_base64: '',
        description: '',
        founded_year: '',
        aum: '',
        strategy: '',
        headquarters: '',
        website: ''
    });
    
    const [newPerson, setNewPerson] = useState({
        name: '',
        role: '',
        wikipedia_url: '',
        linkedin_url: '',
        bio: '',
        photo_base64: ''
    });
    
    const [editPerson, setEditPerson] = useState({
        id: null,
        name: '',
        role: '',
        wikipedia_url: '',
        linkedin_url: '',
        bio: '',
        photo_base64: ''
    });
    
    const [newResource, setNewResource] = useState({
        title: '',
        url: '',
        description: '',
        resource_type: 'article'
    });
    
    const [editResource, setEditResource] = useState({
        id: null,
        title: '',
        url: '',
        description: '',
        resource_type: 'article'
    });
    
    const [newPerformance, setNewPerformance] = useState({
        year: new Date().getFullYear(),
        return_percentage: '',
        notes: ''
    });
    
    const [editPerformance, setEditPerformance] = useState({
        id: null,
        year: new Date().getFullYear(),
        return_percentage: '',
        notes: ''
    });

    useEffect(() => {
        fetchHedgeFunds();
        
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const fetchHedgeFunds = async () => {
        try {
            const response = await fetch(`${baseUrl}/snowai/hedge-funds/`);
            const data = await response.json();
            if (data.success) {
                setHedgeFunds(data.data);
                if (data.data.length > 0 && !selectedFund) {
                    setSelectedFund(data.data[0]);
                }
            }
        } catch (error) {
            console.error('Error fetching hedge funds:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateFund = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${baseUrl}/snowai/hedge-funds/create/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newFund)
            });
            const data = await response.json();
            if (data.success) {
                setShowAddFundModal(false);
                setNewFund({
                    name: '',
                    logo_base64: '',
                    description: '',
                    founded_year: '',
                    aum: '',
                    strategy: '',
                    headquarters: '',
                    website: ''
                });
                fetchHedgeFunds();
            }
        } catch (error) {
            console.error('Error creating fund:', error);
        }
    };
    
    const handleUpdateFund = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${baseUrl}/snowai/hedge-funds/${editFund.id}/update/`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: editFund.name,
                    logo_base64: editFund.logo_base64,
                    description: editFund.description,
                    founded_year: editFund.founded_year,
                    aum: editFund.aum,
                    strategy: editFund.strategy,
                    headquarters: editFund.headquarters,
                    website: editFund.website
                })
            });
            const data = await response.json();
            if (data.success) {
                setShowEditFundModal(false);
                setEditFund({
                    id: null,
                    name: '',
                    logo_base64: '',
                    description: '',
                    founded_year: '',
                    aum: '',
                    strategy: '',
                    headquarters: '',
                    website: ''
                });
                fetchHedgeFunds();
            }
        } catch (error) {
            console.error('Error updating fund:', error);
        }
    };
    
    const handleLogoUpload = (e, isEdit = false) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (isEdit) {
                    setEditFund({...editFund, logo_base64: reader.result});
                } else {
                    setNewFund({...newFund, logo_base64: reader.result});
                }
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handlePersonPhotoUpload = (e, isEdit = false) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (isEdit) {
                    setEditPerson({...editPerson, photo_base64: reader.result});
                } else {
                    setNewPerson({...newPerson, photo_base64: reader.result});
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDeleteFund = async (fundId) => {
        if (!window.confirm('Are you sure you want to delete this hedge fund? This will delete all associated data.')) return;
        
        try {
            const response = await fetch(`${baseUrl}/snowai/hedge-funds/${fundId}/delete/`, {
                method: 'DELETE'
            });
            const data = await response.json();
            if (data.success) {
                setSelectedFund(null);
                fetchHedgeFunds();
            }
        } catch (error) {
            console.error('Error deleting fund:', error);
        }
    };
    
    const handleEditFundClick = (fund) => {
        setEditFund({
            id: fund.id,
            name: fund.name,
            logo_base64: fund.logo_base64 || '',
            description: fund.description || '',
            founded_year: fund.founded_year || '',
            aum: fund.aum || '',
            strategy: fund.strategy || '',
            headquarters: fund.headquarters || '',
            website: fund.website || ''
        });
        setShowEditFundModal(true);
    };

    const handleAddPerson = async (e) => {
        e.preventDefault();
        if (!selectedFund) return;
        
        try {
            const response = await fetch(`${baseUrl}/snowai/hedge-funds/${selectedFund.id}/key-person/add/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newPerson)
            });
            const data = await response.json();
            if (data.success) {
                setShowAddPersonModal(false);
                setNewPerson({
                    name: '',
                    role: '',
                    wikipedia_url: '',
                    linkedin_url: '',
                    bio: '',
                    photo_base64: ''
                });
                fetchHedgeFunds();
            }
        } catch (error) {
            console.error('Error adding person:', error);
        }
    };
    
    const handleUpdatePerson = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${baseUrl}/snowai/hedge-funds/key-person/${editPerson.id}/update/`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: editPerson.name,
                    role: editPerson.role,
                    wikipedia_url: editPerson.wikipedia_url,
                    linkedin_url: editPerson.linkedin_url,
                    bio: editPerson.bio,
                    photo_base64: editPerson.photo_base64
                })
            });
            const data = await response.json();
            if (data.success) {
                setShowEditPersonModal(false);
                setEditPerson({
                    id: null,
                    name: '',
                    role: '',
                    wikipedia_url: '',
                    linkedin_url: '',
                    bio: '',
                    photo_base64: ''
                });
                fetchHedgeFunds();
            }
        } catch (error) {
            console.error('Error updating person:', error);
        }
    };
    
    const handleEditPersonClick = (person) => {
        setEditPerson({
            id: person.id,
            name: person.name,
            role: person.role || '',
            wikipedia_url: person.wikipedia_url || '',
            linkedin_url: person.linkedin_url || '',
            bio: person.bio || '',
            photo_base64: person.photo_base64 || ''
        });
        setShowEditPersonModal(true);
    };

    const handleDeletePerson = async (personId) => {
        if (!window.confirm('Are you sure you want to delete this person?')) return;
        
        try {
            const response = await fetch(`${baseUrl}/snowai/hedge-funds/key-person/${personId}/delete/`, {
                method: 'DELETE'
            });
            const data = await response.json();
            if (data.success) {
                fetchHedgeFunds();
            }
        } catch (error) {
            console.error('Error deleting person:', error);
        }
    };

    const handleAddResource = async (e) => {
        e.preventDefault();
        if (!selectedFund) return;
        
        try {
            const response = await fetch(`${baseUrl}/snowai/hedge-funds/${selectedFund.id}/resource/add/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newResource)
            });
            const data = await response.json();
            if (data.success) {
                setShowAddResourceModal(false);
                setNewResource({
                    title: '',
                    url: '',
                    description: '',
                    resource_type: 'article'
                });
                fetchHedgeFunds();
            }
        } catch (error) {
            console.error('Error adding resource:', error);
        }
    };
    
    const handleUpdateResource = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${baseUrl}/snowai/hedge-funds/resource/${editResource.id}/update/`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: editResource.title,
                    url: editResource.url,
                    description: editResource.description,
                    resource_type: editResource.resource_type
                })
            });
            const data = await response.json();
            if (data.success) {
                setShowEditResourceModal(false);
                setEditResource({
                    id: null,
                    title: '',
                    url: '',
                    description: '',
                    resource_type: 'article'
                });
                fetchHedgeFunds();
            }
        } catch (error) {
            console.error('Error updating resource:', error);
        }
    };
    
    const handleEditResourceClick = (resource) => {
        setEditResource({
            id: resource.id,
            title: resource.title,
            url: resource.url,
            description: resource.description || '',
            resource_type: resource.resource_type
        });
        setShowEditResourceModal(true);
    };

    const handleDeleteResource = async (resourceId) => {
        if (!window.confirm('Are you sure you want to delete this resource?')) return;
        
        try {
            const response = await fetch(`${baseUrl}/snowai/hedge-funds/resource/${resourceId}/delete/`, {
                method: 'DELETE'
            });
            const data = await response.json();
            if (data.success) {
                fetchHedgeFunds();
            }
        } catch (error) {
            console.error('Error deleting resource:', error);
        }
    };

    const handleAddPerformance = async (e) => {
        e.preventDefault();
        if (!selectedFund) return;
        
        try {
            const response = await fetch(`${baseUrl}/snowai/hedge-funds/${selectedFund.id}/performance/add/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newPerformance)
            });
            const data = await response.json();
            if (data.success) {
                setShowAddPerformanceModal(false);
                setNewPerformance({
                    year: new Date().getFullYear(),
                    return_percentage: '',
                    notes: ''
                });
                fetchHedgeFunds();
            }
        } catch (error) {
            console.error('Error adding performance:', error);
        }
    };
    
    const handleUpdatePerformance = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${baseUrl}/snowai/hedge-funds/performance/${editPerformance.id}/update/`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    year: editPerformance.year,
                    return_percentage: editPerformance.return_percentage,
                    notes: editPerformance.notes
                })
            });
            const data = await response.json();
            if (data.success) {
                setShowEditPerformanceModal(false);
                setEditPerformance({
                    id: null,
                    year: new Date().getFullYear(),
                    return_percentage: '',
                    notes: ''
                });
                fetchHedgeFunds();
            }
        } catch (error) {
            console.error('Error updating performance:', error);
        }
    };
    
    const handleEditPerformanceClick = (performance) => {
        setEditPerformance({
            id: performance.id,
            year: performance.year,
            return_percentage: performance.return_percentage,
            notes: performance.notes || ''
        });
        setShowEditPerformanceModal(true);
    };

    const handleDeletePerformance = async (performanceId) => {
        if (!window.confirm('Are you sure you want to delete this performance record?')) return;
        
        try {
            const response = await fetch(`${baseUrl}/snowai/hedge-funds/performance/${performanceId}/delete/`, {
                method: 'DELETE'
            });
            const data = await response.json();
            if (data.success) {
                fetchHedgeFunds();
            }
        } catch (error) {
            console.error('Error deleting performance:', error);
        }
    };

    const styles = {
        container: {
            padding: '20px',
            maxWidth: '1400px',
            margin: '0 auto'
        },
        header: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '30px',
            flexWrap: 'wrap',
            gap: '10px'
        },
        addButton: {
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '14px'
        },
        layout: {
            display: 'grid',
            gridTemplateColumns: '300px 1fr',
            gap: '20px',
            '@media (max-width: 768px)': {
                gridTemplateColumns: '1fr'
            }
        },
        sidebar: {
            backgroundColor: '#f8f9fa',
            padding: '15px',
            borderRadius: '8px',
            maxHeight: 'calc(100vh - 200px)',
            overflowY: 'auto'
        },
        fundCard: {
            padding: '12px',
            marginBottom: '10px',
            backgroundColor: 'white',
            borderRadius: '6px',
            cursor: 'pointer',
            border: '2px solid transparent',
            transition: 'all 0.2s',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
        },
        fundCardActive: {
            border: '2px solid #007bff',
            backgroundColor: '#e7f3ff'
        },
        fundLogo: {
            width: '40px',
            height: '40px',
            objectFit: 'contain',
            marginRight: '10px',
            borderRadius: '4px'
        },
        fundName: {
            fontSize: '14px',
            fontWeight: '600',
            margin: 0,
            flex: 1
        },
        mainContent: {
            backgroundColor: 'white',
            padding: '25px',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        },
        fundHeader: {
            display: 'flex',
            alignItems: 'center',
            marginBottom: '20px',
            paddingBottom: '20px',
            borderBottom: '2px solid #e9ecef',
            flexWrap: 'wrap',
            gap: '15px'
        },
        fundLogoLarge: {
            width: '80px',
            height: '80px',
            objectFit: 'contain',
            marginRight: '20px',
            borderRadius: '8px',
            border: '1px solid #dee2e6'
        },
        fundTitle: {
            fontSize: '28px',
            fontWeight: '700',
            margin: '0 0 5px 0',
            color: '#212529'
        },
        fundSubtitle: {
            fontSize: '14px',
            color: '#6c757d',
            margin: '2px 0'
        },
        section: {
            marginBottom: '30px'
        },
        sectionHeader: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '15px',
            flexWrap: 'wrap',
            gap: '10px'
        },
        sectionTitle: {
            fontSize: '18px',
            fontWeight: '600',
            color: '#212529',
            margin: 0
        },
        addSmallButton: {
            padding: '6px 12px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px'
        },
        description: {
            fontSize: '14px',
            lineHeight: '1.6',
            color: '#495057',
            marginBottom: '20px'
        },
        infoGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '15px',
            marginBottom: '20px'
        },
        infoCard: {
            padding: '12px',
            backgroundColor: '#f8f9fa',
            borderRadius: '6px'
        },
        infoLabel: {
            fontSize: '11px',
            textTransform: 'uppercase',
            color: '#6c757d',
            fontWeight: '600',
            marginBottom: '4px'
        },
        infoValue: {
            fontSize: '14px',
            color: '#212529',
            fontWeight: '500'
        },
        personCard: {
            display: 'flex',
            alignItems: 'start',
            padding: '15px',
            backgroundColor: '#f8f9fa',
            borderRadius: '6px',
            marginBottom: '10px',
            position: 'relative'
        },
        personPhoto: {
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            objectFit: 'cover',
            marginRight: '15px'
        },
        personInfo: {
            flex: 1
        },
        personName: {
            fontSize: '16px',
            fontWeight: '600',
            margin: '0 0 4px 0',
            color: '#212529'
        },
        personRole: {
            fontSize: '13px',
            color: '#6c757d',
            marginBottom: '8px'
        },
        personLinks: {
            display: 'flex',
            gap: '10px'
        },
        link: {
            fontSize: '12px',
            color: '#007bff',
            textDecoration: 'none'
        },
        actionButtons: {
            display: 'flex',
            gap: '8px',
            position: 'absolute',
            top: '10px',
            right: '10px'
        },
        editIconButton: {
            padding: '4px 8px',
            backgroundColor: '#ffc107',
            color: '#212529',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '11px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
        },
        deleteIconButton: {
            padding: '4px 8px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '11px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
        },
        resourceCard: {
            padding: '12px',
            backgroundColor: '#f8f9fa',
            borderRadius: '6px',
            marginBottom: '10px',
            position: 'relative'
        },
        resourceTitle: {
            fontSize: '14px',
            fontWeight: '600',
            marginBottom: '4px',
            color: '#212529'
        },
        resourceType: {
            display: 'inline-block',
            padding: '2px 8px',
            backgroundColor: '#007bff',
            color: 'white',
            borderRadius: '3px',
            fontSize: '10px',
            textTransform: 'uppercase',
            marginBottom: '6px'
        },
        resourceDescription: {
            fontSize: '13px',
            color: '#6c757d',
            marginBottom: '8px'
        },
        modal: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
        },
        modalContent: {
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '8px',
            maxWidth: '600px',
            width: '90%',
            maxHeight: '90vh',
            overflowY: 'auto'
        },
        modalTitle: {
            fontSize: '22px',
            fontWeight: '600',
            marginBottom: '20px',
            color: '#212529'
        },
        formGroup: {
            marginBottom: '15px'
        },
        label: {
            display: 'block',
            fontSize: '13px',
            fontWeight: '600',
            marginBottom: '5px',
            color: '#495057'
        },
        input: {
            width: '100%',
            padding: '10px',
            border: '1px solid #ced4da',
            borderRadius: '4px',
            fontSize: '14px',
            boxSizing: 'border-box'
        },
        textarea: {
            width: '100%',
            padding: '10px',
            border: '1px solid #ced4da',
            borderRadius: '4px',
            fontSize: '14px',
            minHeight: '100px',
            boxSizing: 'border-box',
            resize: 'vertical'
        },
        select: {
            width: '100%',
            padding: '10px',
            border: '1px solid #ced4da',
            borderRadius: '4px',
            fontSize: '14px',
            boxSizing: 'border-box'
        },
        buttonGroup: {
            display: 'flex',
            gap: '10px',
            marginTop: '20px'
        },
        submitButton: {
            padding: '10px 20px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600'
        },
        cancelButton: {
            padding: '10px 20px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600'
        },
        performanceList: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
            gap: '10px'
        },
        performanceCard: {
            padding: '12px',
            backgroundColor: '#f8f9fa',
            borderRadius: '6px',
            textAlign: 'center',
            position: 'relative'
        },
        performanceYear: {
            fontSize: '14px',
            fontWeight: '600',
            color: '#6c757d',
            marginBottom: '4px'
        },
        performanceReturn: {
            fontSize: '20px',
            fontWeight: '700',
            color: '#28a745'
        },
        performanceReturnNegative: {
            fontSize: '20px',
            fontWeight: '700',
            color: '#dc3545'
        },
        emptyState: {
            textAlign: 'center',
            padding: '40px',
            color: '#6c757d'
        },
        deleteFundButton: {
            padding: '8px 16px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '13px',
            marginLeft: 'auto',
            whiteSpace: 'nowrap'
        },
        editFundButton: {
            padding: '8px 16px',
            backgroundColor: '#ffc107',
            color: '#212529',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '13px',
            whiteSpace: 'nowrap',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
        },
        fundHeaderActions: {
            display: 'flex',
            gap: '10px'
        },
        fundHeaderInfo: {
            flex: 1,
            minWidth: '200px'
        },
        mobileFundSelector: {
            padding: '12px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            marginBottom: '15px'
        },
        fundDropdown: {
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            backgroundColor: 'white',
            border: '1px solid #dee2e6',
            borderRadius: '5px',
            marginTop: '5px',
            maxHeight: '300px',
            overflowY: 'auto',
            zIndex: 100,
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        },
        fundDropdownItem: {
            padding: '12px',
            cursor: 'pointer',
            borderBottom: '1px solid #f0f0f0',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
        },
        chartContainer: {
            backgroundColor: '#f8f9fa',
            padding: '20px',
            borderRadius: '8px',
            marginBottom: '20px'
        },
        chartToggle: {
            padding: '8px 16px',
            backgroundColor: '#17a2b8',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '13px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
        },
        mobileContainer: {
            position: 'relative'
        }
    };

    if (loading) {
        return (
            <div>
                <div className="header">
                    <Header />
                </div>
                <div className="main-page-body">
                    <SideNavs />
                    <div className="main-body-info">
                        <h5 className="major-upcoming-news-events-header">SnowAI Hedge Fund Tracker</h5>
                        <div style={styles.container}>
                            <p>Loading hedge funds...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="header">
                <Header />
            </div>
            <div className="main-page-body">
                <SideNavs />
                <div className="main-body-info">
                    <h5 className="major-upcoming-news-events-header">SnowAI Hedge Fund Tracker</h5>
                    
                    <div style={styles.container}>
                        <div style={styles.header}>
                            <button 
                                style={styles.addButton}
                                onClick={() => setShowAddFundModal(true)}
                            >
                                + Add Hedge Fund
                            </button>
                        </div>

                        {hedgeFunds.length === 0 ? (
                            <div style={styles.emptyState}>
                                <h3>No hedge funds added yet</h3>
                                <p>Click "Add Hedge Fund" to get started</p>
                            </div>
                        ) : isMobile ? (
                            /* Mobile Layout */
                            <div style={styles.mobileContainer}>
                                <button 
                                    style={styles.mobileFundSelector}
                                    onClick={() => setShowFundSelector(!showFundSelector)}
                                >
                                    <span>{selectedFund ? selectedFund.name : 'Select a Hedge Fund'}</span>
                                    <ChevronDown size={20} />
                                </button>
                                
                                {showFundSelector && (
                                    <div style={styles.fundDropdown}>
                                        {hedgeFunds.map(fund => (
                                            <div
                                                key={fund.id}
                                                style={styles.fundDropdownItem}
                                                onClick={() => {
                                                    setSelectedFund(fund);
                                                    setShowFundSelector(false);
                                                }}
                                            >
                                                {fund.logo_base64 && (
                                                    <img 
                                                        src={fund.logo_base64} 
                                                        alt={fund.name}
                                                        style={styles.fundLogo}
                                                        onError={(e) => e.target.style.display = 'none'}
                                                    />
                                                )}
                                                <span style={{ fontWeight: selectedFund?.id === fund.id ? '600' : '400' }}>
                                                    {fund.name}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                
                                {selectedFund && (
                                    <div style={styles.mainContent}>
                                        <div style={styles.fundHeader}>
                                            {selectedFund.logo_base64 && (
                                                <img 
                                                    src={selectedFund.logo_base64} 
                                                    alt={selectedFund.name}
                                                    style={styles.fundLogoLarge}
                                                    onError={(e) => e.target.style.display = 'none'}
                                                />
                                            )}
                                            <div style={styles.fundHeaderInfo}>
                                                <h1 style={styles.fundTitle}>{selectedFund.name}</h1>
                                                {selectedFund.headquarters && (
                                                    <p style={styles.fundSubtitle}>📍 {selectedFund.headquarters}</p>
                                                )}
                                                {selectedFund.founded_year && (
                                                    <p style={styles.fundSubtitle}>📅 Founded: {selectedFund.founded_year}</p>
                                                )}
                                            </div>
                                            <div style={styles.fundHeaderActions}>
                                                <button
                                                    style={styles.editFundButton}
                                                    onClick={() => handleEditFundClick(selectedFund)}
                                                >
                                                    <Edit2 size={14} /> Edit
                                                </button>
                                                <button
                                                    style={styles.deleteFundButton}
                                                    onClick={() => handleDeleteFund(selectedFund.id)}
                                                >
                                                    <Trash2 size={14} /> Delete
                                                </button>
                                            </div>
                                        </div>

                                        {selectedFund.description && (
                                            <div style={styles.section}>
                                                <p style={styles.description}>{selectedFund.description}</p>
                                            </div>
                                        )}

                                        <div style={styles.infoGrid}>
                                            {selectedFund.aum && (
                                                <div style={styles.infoCard}>
                                                    <div style={styles.infoLabel}>Assets Under Management</div>
                                                    <div style={styles.infoValue}>{selectedFund.aum}</div>
                                                </div>
                                            )}
                                            {selectedFund.strategy && (
                                                <div style={styles.infoCard}>
                                                    <div style={styles.infoLabel}>Strategy</div>
                                                    <div style={styles.infoValue}>{selectedFund.strategy}</div>
                                                </div>
                                            )}
                                            {selectedFund.website && (
                                                <div style={styles.infoCard}>
                                                    <div style={styles.infoLabel}>Website</div>
                                                    <div style={styles.infoValue}>
                                                        <a href={selectedFund.website} target="_blank" rel="noopener noreferrer" style={styles.link}>
                                                            Visit Website
                                                        </a>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Performance Section */}
                                        <div style={styles.section}>
                                            <div style={styles.sectionHeader}>
                                                <h3 style={styles.sectionTitle}>Performance History</h3>
                                                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                                    {selectedFund.performance && selectedFund.performance.length > 0 && (
                                                        <button
                                                            style={styles.chartToggle}
                                                            onClick={() => setShowPerformanceChart(!showPerformanceChart)}
                                                        >
                                                            <TrendingUp size={16} />
                                                            {showPerformanceChart ? 'Hide Chart' : 'Show Chart'}
                                                        </button>
                                                    )}
                                                    <button
                                                        style={styles.addSmallButton}
                                                        onClick={() => setShowAddPerformanceModal(true)}
                                                    >
                                                        + Add Performance
                                                    </button>
                                                </div>
                                            </div>
                                            
                                            {showPerformanceChart && selectedFund.performance && selectedFund.performance.length > 0 && (
                                                <div style={styles.chartContainer}>
                                                    <ResponsiveContainer width="100%" height={300}>
                                                        <LineChart data={selectedFund.performance.sort((a, b) => a.year - b.year)}>
                                                            <CartesianGrid strokeDasharray="3 3" />
                                                            <XAxis dataKey="year" />
                                                            <YAxis />
                                                            <Tooltip formatter={(value) => `${value}%`} />
                                                            <Legend />
                                                            <Line type="monotone" dataKey="return_percentage" stroke="#007bff" strokeWidth={2} />
                                                        </LineChart>
                                                    </ResponsiveContainer>
                                                </div>
                                            )}
                                            
                                            {selectedFund.performance && selectedFund.performance.length > 0 ? (
                                                <div style={styles.performanceList}>
                                                    {selectedFund.performance.map(perf => (
                                                        <div key={perf.id} style={styles.performanceCard}>
                                                            <div style={styles.actionButtons}>
                                                                <button
                                                                    style={styles.editIconButton}
                                                                    onClick={() => handleEditPerformanceClick(perf)}
                                                                >
                                                                    <Edit2 size={10} /> Edit
                                                                </button>
                                                                <button
                                                                    style={styles.deleteIconButton}
                                                                    onClick={() => handleDeletePerformance(perf.id)}
                                                                >
                                                                    <Trash2 size={10} /> Del
                                                                </button>
                                                            </div>
                                                            <div style={styles.performanceYear}>{perf.year}</div>
                                                            <div style={perf.return_percentage >= 0 ? styles.performanceReturn : styles.performanceReturnNegative}>
                                                                {perf.return_percentage > 0 ? '+' : ''}{perf.return_percentage}%
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p style={{ color: '#6c757d', fontSize: '14px' }}>No performance data added yet</p>
                                            )}
                                        </div>

                                        {/* Key People Section */}
                                        <div style={styles.section}>
                                            <div style={styles.sectionHeader}>
                                                <h3 style={styles.sectionTitle}>Key People</h3>
                                                <button
                                                    style={styles.addSmallButton}
                                                    onClick={() => setShowAddPersonModal(true)}
                                                >
                                                    + Add Person
                                                </button>
                                            </div>
                                            {selectedFund.key_people && selectedFund.key_people.length > 0 ? (
                                                selectedFund.key_people.map(person => (
                                                    <div key={person.id} style={styles.personCard}>
                                                        <div style={styles.actionButtons}>
                                                            <button
                                                                style={styles.editIconButton}
                                                                onClick={() => handleEditPersonClick(person)}
                                                            >
                                                                <Edit2 size={10} /> Edit
                                                            </button>
                                                            <button
                                                                style={styles.deleteIconButton}
                                                                onClick={() => handleDeletePerson(person.id)}
                                                            >
                                                                <Trash2 size={10} /> Del
                                                            </button>
                                                        </div>
                                                        {person.photo_base64 && (
                                                            <img 
                                                                src={person.photo_base64} 
                                                                alt={person.name}
                                                                style={styles.personPhoto}
                                                                onError={(e) => e.target.style.display = 'none'}
                                                            />
                                                        )}
                                                        <div style={styles.personInfo}>
                                                            <h4 style={styles.personName}>{person.name}</h4>
                                                            {person.role && <p style={styles.personRole}>{person.role}</p>}
                                                            {person.bio && <p style={{ fontSize: '13px', color: '#495057', marginBottom: '8px' }}>{person.bio}</p>}
                                                            <div style={styles.personLinks}>
                                                                {person.wikipedia_url && <a href={person.wikipedia_url} target="_blank" rel="noopener noreferrer" style={styles.link}>Wikipedia</a>}
                                                                {person.linkedin_url && <a href={person.linkedin_url} target="_blank" rel="noopener noreferrer" style={styles.link}>LinkedIn</a>}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <p style={{ color: '#6c757d', fontSize: '14px' }}>No key people added yet</p>
                                            )}
                                        </div>

                                        {/* Resources Section */}
                                        <div style={styles.section}>
                                            <div style={styles.sectionHeader}>
                                                <h3 style={styles.sectionTitle}>Resources & Articles</h3>
                                                <button
                                                    style={styles.addSmallButton}
                                                    onClick={() => setShowAddResourceModal(true)}
                                                >
                                                    + Add Resource
                                                </button>
                                            </div>
                                            {selectedFund.resources && selectedFund.resources.length > 0 ? (
                                                selectedFund.resources.map(resource => (
                                                    <div key={resource.id} style={styles.resourceCard}>
                                                        <div style={styles.actionButtons}>
                                                            <button
                                                                style={styles.editIconButton}
                                                                onClick={() => handleEditResourceClick(resource)}
                                                            >
                                                                <Edit2 size={10} /> Edit
                                                            </button>
                                                            <button
                                                                style={styles.deleteIconButton}
                                                                onClick={() => handleDeleteResource(resource.id)}
                                                            >
                                                                <Trash2 size={10} /> Del
                                                            </button>
                                                        </div>
                                                        <span style={styles.resourceType}>{resource.resource_type}</span>
                                                        <h4 style={styles.resourceTitle}>
                                                            <a href={resource.url} target="_blank" rel="noopener noreferrer" style={styles.link}>
                                                                {resource.title}
                                                            </a>
                                                        </h4>
                                                        {resource.description && <p style={styles.resourceDescription}>{resource.description}</p>}
                                                    </div>
                                                ))
                                            ) : (
                                                <p style={{ color: '#6c757d', fontSize: '14px' }}>No resources added yet</p>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            /* Desktop Layout */
                            <div style={styles.layout}>
                                <div style={styles.sidebar}>
                                    {hedgeFunds.map(fund => (
                                        <div
                                            key={fund.id}
                                            style={{
                                                ...styles.fundCard,
                                                ...(selectedFund?.id === fund.id ? styles.fundCardActive : {})
                                            }}
                                            onClick={() => setSelectedFund(fund)}
                                        >
                                            <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                                                {fund.logo_base64 && (
                                                    <img 
                                                        src={fund.logo_base64} 
                                                        alt={fund.name}
                                                        style={styles.fundLogo}
                                                        onError={(e) => e.target.style.display = 'none'}
                                                    />
                                                )}
                                                <p style={styles.fundName}>{fund.name}</p>
                                            </div>
                                            <button
                                                style={styles.editIconButton}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleEditFundClick(fund);
                                                }}
                                            >
                                                <Edit2 size={12} /> Edit
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                {selectedFund && (
                                    <div style={styles.mainContent}>
                                        <div style={styles.fundHeader}>
                                            {selectedFund.logo_base64 && (
                                                <img 
                                                    src={selectedFund.logo_base64} 
                                                    alt={selectedFund.name}
                                                    style={styles.fundLogoLarge}
                                                    onError={(e) => e.target.style.display = 'none'}
                                                />
                                            )}
                                            <div style={styles.fundHeaderInfo}>
                                                <h1 style={styles.fundTitle}>{selectedFund.name}</h1>
                                                {selectedFund.headquarters && <p style={styles.fundSubtitle}>📍 {selectedFund.headquarters}</p>}
                                                {selectedFund.founded_year && <p style={styles.fundSubtitle}>📅 Founded: {selectedFund.founded_year}</p>}
                                            </div>
                                            <div style={styles.fundHeaderActions}>
                                                <button
                                                    style={styles.editFundButton}
                                                    onClick={() => handleEditFundClick(selectedFund)}
                                                >
                                                    <Edit2 size={14} /> Edit Fund
                                                </button>
                                                <button
                                                    style={styles.deleteFundButton}
                                                    onClick={() => handleDeleteFund(selectedFund.id)}
                                                >
                                                    <Trash2 size={14} /> Delete Fund
                                                </button>
                                            </div>
                                        </div>

                                        {selectedFund.description && (
                                            <div style={styles.section}>
                                                <p style={styles.description}>{selectedFund.description}</p>
                                            </div>
                                        )}

                                        <div style={styles.infoGrid}>
                                            {selectedFund.aum && (
                                                <div style={styles.infoCard}>
                                                    <div style={styles.infoLabel}>Assets Under Management</div>
                                                    <div style={styles.infoValue}>{selectedFund.aum}</div>
                                                </div>
                                            )}
                                            {selectedFund.strategy && (
                                                <div style={styles.infoCard}>
                                                    <div style={styles.infoLabel}>Strategy</div>
                                                    <div style={styles.infoValue}>{selectedFund.strategy}</div>
                                                </div>
                                            )}
                                            {selectedFund.website && (
                                                <div style={styles.infoCard}>
                                                    <div style={styles.infoLabel}>Website</div>
                                                    <div style={styles.infoValue}>
                                                        <a href={selectedFund.website} target="_blank" rel="noopener noreferrer" style={styles.link}>
                                                            Visit Website
                                                        </a>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Performance Section */}
                                        <div style={styles.section}>
                                            <div style={styles.sectionHeader}>
                                                <h3 style={styles.sectionTitle}>Performance History</h3>
                                                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                                    {selectedFund.performance && selectedFund.performance.length > 0 && (
                                                        <button style={styles.chartToggle} onClick={() => setShowPerformanceChart(!showPerformanceChart)}>
                                                            <TrendingUp size={16} />
                                                            {showPerformanceChart ? 'Hide Chart' : 'Show Chart'}
                                                        </button>
                                                    )}
                                                    <button style={styles.addSmallButton} onClick={() => setShowAddPerformanceModal(true)}>
                                                        + Add Performance
                                                    </button>
                                                </div>
                                            </div>
                                            
                                            {showPerformanceChart && selectedFund.performance && selectedFund.performance.length > 0 && (
                                                <div style={styles.chartContainer}>
                                                    <ResponsiveContainer width="100%" height={300}>
                                                        <LineChart data={selectedFund.performance.sort((a, b) => a.year - b.year)}>
                                                            <CartesianGrid strokeDasharray="3 3" />
                                                            <XAxis dataKey="year" />
                                                            <YAxis />
                                                            <Tooltip formatter={(value) => `${value}%`} />
                                                            <Legend />
                                                            <Line type="monotone" dataKey="return_percentage" stroke="#007bff" strokeWidth={2} />
                                                        </LineChart>
                                                    </ResponsiveContainer>
                                                </div>
                                            )}
                                            
                                            {selectedFund.performance && selectedFund.performance.length > 0 ? (
                                                <div style={styles.performanceList}>
                                                    {selectedFund.performance.map(perf => (
                                                        <div key={perf.id} style={styles.performanceCard}>
                                                            <div style={styles.actionButtons}>
                                                                <button style={styles.editIconButton} onClick={() => handleEditPerformanceClick(perf)}>
                                                                    <Edit2 size={10} /> Edit
                                                                </button>
                                                                <button style={styles.deleteIconButton} onClick={() => handleDeletePerformance(perf.id)}>
                                                                    <Trash2 size={10} /> Del
                                                                </button>
                                                            </div>
                                                            <div style={styles.performanceYear}>{perf.year}</div>
                                                            <div style={perf.return_percentage >= 0 ? styles.performanceReturn : styles.performanceReturnNegative}>
                                                                {perf.return_percentage > 0 ? '+' : ''}{perf.return_percentage}%
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p style={{ color: '#6c757d', fontSize: '14px' }}>No performance data added yet</p>
                                            )}
                                        </div>

                                        {/* Key People Section */}
                                        <div style={styles.section}>
                                            <div style={styles.sectionHeader}>
                                                <h3 style={styles.sectionTitle}>Key People</h3>
                                                <button style={styles.addSmallButton} onClick={() => setShowAddPersonModal(true)}>
                                                    + Add Person
                                                </button>
                                            </div>
                                            {selectedFund.key_people && selectedFund.key_people.length > 0 ? (
                                                selectedFund.key_people.map(person => (
                                                    <div key={person.id} style={styles.personCard}>
                                                        <div style={styles.actionButtons}>
                                                            <button style={styles.editIconButton} onClick={() => handleEditPersonClick(person)}>
                                                                <Edit2 size={10} /> Edit
                                                            </button>
                                                            <button style={styles.deleteIconButton} onClick={() => handleDeletePerson(person.id)}>
                                                                <Trash2 size={10} /> Del
                                                            </button>
                                                        </div>
                                                        {person.photo_base64 && (
                                                            <img src={person.photo_base64} alt={person.name} style={styles.personPhoto} />
                                                        )}
                                                        <div style={styles.personInfo}>
                                                            <h4 style={styles.personName}>{person.name}</h4>
                                                            {person.role && <p style={styles.personRole}>{person.role}</p>}
                                                            {person.bio && <p style={{ fontSize: '13px', color: '#495057', marginBottom: '8px' }}>{person.bio}</p>}
                                                            <div style={styles.personLinks}>
                                                                {person.wikipedia_url && <a href={person.wikipedia_url} target="_blank" rel="noopener noreferrer" style={styles.link}>Wikipedia</a>}
                                                                {person.linkedin_url && <a href={person.linkedin_url} target="_blank" rel="noopener noreferrer" style={styles.link}>LinkedIn</a>}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <p style={{ color: '#6c757d', fontSize: '14px' }}>No key people added yet</p>
                                            )}
                                        </div>

                                        {/* Resources Section */}
                                        <div style={styles.section}>
                                            <div style={styles.sectionHeader}>
                                                <h3 style={styles.sectionTitle}>Resources & Articles</h3>
                                                <button style={styles.addSmallButton} onClick={() => setShowAddResourceModal(true)}>
                                                    + Add Resource
                                                </button>
                                            </div>
                                            {selectedFund.resources && selectedFund.resources.length > 0 ? (
                                                selectedFund.resources.map(resource => (
                                                    <div key={resource.id} style={styles.resourceCard}>
                                                        <div style={styles.actionButtons}>
                                                            <button style={styles.editIconButton} onClick={() => handleEditResourceClick(resource)}>
                                                                <Edit2 size={10} /> Edit
                                                            </button>
                                                            <button style={styles.deleteIconButton} onClick={() => handleDeleteResource(resource.id)}>
                                                                <Trash2 size={10} /> Del
                                                            </button>
                                                        </div>
                                                        <span style={styles.resourceType}>{resource.resource_type}</span>
                                                        <h4 style={styles.resourceTitle}>
                                                            <a href={resource.url} target="_blank" rel="noopener noreferrer" style={styles.link}>
                                                                {resource.title}
                                                            </a>
                                                        </h4>
                                                        {resource.description && <p style={styles.resourceDescription}>{resource.description}</p>}
                                                    </div>
                                                ))
                                            ) : (
                                                <p style={{ color: '#6c757d', fontSize: '14px' }}>No resources added yet</p>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Edit Fund Modal */}
            {showEditFundModal && (
                <div style={styles.modal} onClick={() => setShowEditFundModal(false)}>
                    <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <h2 style={styles.modalTitle}>Edit Hedge Fund</h2>
                        <form onSubmit={handleUpdateFund}>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Fund Name *</label>
                                <input type="text" style={styles.input} value={editFund.name} onChange={(e) => setEditFund({...editFund, name: e.target.value})} required />
                            </div>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Logo Image</label>
                                <input type="file" accept="image/*" style={styles.input} onChange={(e) => handleLogoUpload(e, true)} />
                                {editFund.logo_base64 && <img src={editFund.logo_base64} alt="Preview" style={{ width: '100px', height: '100px', objectFit: 'contain', marginTop: '10px' }} />}
                            </div>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Description</label>
                                <textarea style={styles.textarea} value={editFund.description} onChange={(e) => setEditFund({...editFund, description: e.target.value})} />
                            </div>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Founded Year</label>
                                <input type="number" style={styles.input} value={editFund.founded_year} onChange={(e) => setEditFund({...editFund, founded_year: e.target.value})} />
                            </div>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Assets Under Management</label>
                                <input type="text" style={styles.input} value={editFund.aum} onChange={(e) => setEditFund({...editFund, aum: e.target.value})} />
                            </div>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Strategy</label>
                                <input type="text" style={styles.input} value={editFund.strategy} onChange={(e) => setEditFund({...editFund, strategy: e.target.value})} />
                            </div>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Headquarters</label>
                                <input type="text" style={styles.input} value={editFund.headquarters} onChange={(e) => setEditFund({...editFund, headquarters: e.target.value})} />
                            </div>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Website</label>
                                <input type="url" style={styles.input} value={editFund.website} onChange={(e) => setEditFund({...editFund, website: e.target.value})} />
                            </div>
                            <div style={styles.buttonGroup}>
                                <button type="submit" style={styles.submitButton}>Update Fund</button>
                                <button type="button" style={styles.cancelButton} onClick={() => setShowEditFundModal(false)}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Add Fund Modal */}
            {showAddFundModal && (
                <div style={styles.modal} onClick={() => setShowAddFundModal(false)}>
                    <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <h2 style={styles.modalTitle}>Add New Hedge Fund</h2>
                        <form onSubmit={handleCreateFund}>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Fund Name *</label>
                                <input type="text" style={styles.input} value={newFund.name} onChange={(e) => setNewFund({...newFund, name: e.target.value})} required />
                            </div>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Logo Image</label>
                                <input type="file" accept="image/*" style={styles.input} onChange={handleLogoUpload} />
                                {newFund.logo_base64 && <img src={newFund.logo_base64} alt="Preview" style={{ width: '100px', height: '100px', objectFit: 'contain', marginTop: '10px' }} />}
                            </div>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Description</label>
                                <textarea style={styles.textarea} value={newFund.description} onChange={(e) => setNewFund({...newFund, description: e.target.value})} />
                            </div>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Founded Year</label>
                                <input type="number" style={styles.input} value={newFund.founded_year} onChange={(e) => setNewFund({...newFund, founded_year: e.target.value})} />
                            </div>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Assets Under Management</label>
                                <input type="text" style={styles.input} value={newFund.aum} onChange={(e) => setNewFund({...newFund, aum: e.target.value})} />
                            </div>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Strategy</label>
                                <input type="text" style={styles.input} value={newFund.strategy} onChange={(e) => setNewFund({...newFund, strategy: e.target.value})} />
                            </div>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Headquarters</label>
                                <input type="text" style={styles.input} value={newFund.headquarters} onChange={(e) => setNewFund({...newFund, headquarters: e.target.value})} />
                            </div>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Website</label>
                                <input type="url" style={styles.input} value={newFund.website} onChange={(e) => setNewFund({...newFund, website: e.target.value})} />
                            </div>
                            <div style={styles.buttonGroup}>
                                <button type="submit" style={styles.submitButton}>Create Fund</button>
                                <button type="button" style={styles.cancelButton} onClick={() => setShowAddFundModal(false)}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Person Modal */}
            {showEditPersonModal && (
                <div style={styles.modal} onClick={() => setShowEditPersonModal(false)}>
                    <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <h2 style={styles.modalTitle}>Edit Key Person</h2>
                        <form onSubmit={handleUpdatePerson}>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Name *</label>
                                <input type="text" style={styles.input} value={editPerson.name} onChange={(e) => setEditPerson({...editPerson, name: e.target.value})} required />
                            </div>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Role</label>
                                <input type="text" style={styles.input} value={editPerson.role} onChange={(e) => setEditPerson({...editPerson, role: e.target.value})} />
                            </div>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Photo Image</label>
                                <input type="file" accept="image/*" style={styles.input} onChange={(e) => handlePersonPhotoUpload(e, true)} />
                                {editPerson.photo_base64 && <img src={editPerson.photo_base64} alt="Preview" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '50%', marginTop: '10px' }} />}
                            </div>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Bio</label>
                                <textarea style={styles.textarea} value={editPerson.bio} onChange={(e) => setEditPerson({...editPerson, bio: e.target.value})} />
                            </div>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Wikipedia URL</label>
                                <input type="url" style={styles.input} value={editPerson.wikipedia_url} onChange={(e) => setEditPerson({...editPerson, wikipedia_url: e.target.value})} />
                            </div>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>LinkedIn URL</label>
                                <input type="url" style={styles.input} value={editPerson.linkedin_url} onChange={(e) => setEditPerson({...editPerson, linkedin_url: e.target.value})} />
                            </div>
                            <div style={styles.buttonGroup}>
                                <button type="submit" style={styles.submitButton}>Update Person</button>
                                <button type="button" style={styles.cancelButton} onClick={() => setShowEditPersonModal(false)}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Add Person Modal */}
            {showAddPersonModal && (
                <div style={styles.modal} onClick={() => setShowAddPersonModal(false)}>
                    <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <h2 style={styles.modalTitle}>Add Key Person</h2>
                        <form onSubmit={handleAddPerson}>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Name *</label>
                                <input type="text" style={styles.input} value={newPerson.name} onChange={(e) => setNewPerson({...newPerson, name: e.target.value})} required />
                            </div>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Role</label>
                                <input type="text" style={styles.input} value={newPerson.role} onChange={(e) => setNewPerson({...newPerson, role: e.target.value})} />
                            </div>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Photo Image</label>
                                <input type="file" accept="image/*" style={styles.input} onChange={handlePersonPhotoUpload} />
                                {newPerson.photo_base64 && <img src={newPerson.photo_base64} alt="Preview" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '50%', marginTop: '10px' }} />}
                            </div>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Bio</label>
                                <textarea style={styles.textarea} value={newPerson.bio} onChange={(e) => setNewPerson({...newPerson, bio: e.target.value})} />
                            </div>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Wikipedia URL</label>
                                <input type="url" style={styles.input} value={newPerson.wikipedia_url} onChange={(e) => setNewPerson({...newPerson, wikipedia_url: e.target.value})} />
                            </div>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>LinkedIn URL</label>
                                <input type="url" style={styles.input} value={newPerson.linkedin_url} onChange={(e) => setNewPerson({...newPerson, linkedin_url: e.target.value})} />
                            </div>
                            <div style={styles.buttonGroup}>
                                <button type="submit" style={styles.submitButton}>Add Person</button>
                                <button type="button" style={styles.cancelButton} onClick={() => setShowAddPersonModal(false)}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Resource Modal */}
            {showEditResourceModal && (
                <div style={styles.modal} onClick={() => setShowEditResourceModal(false)}>
                    <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <h2 style={styles.modalTitle}>Edit Resource</h2>
                        <form onSubmit={handleUpdateResource}>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Title *</label>
                                <input type="text" style={styles.input} value={editResource.title} onChange={(e) => setEditResource({...editResource, title: e.target.value})} required />
                            </div>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>URL *</label>
                                <input type="url" style={styles.input} value={editResource.url} onChange={(e) => setEditResource({...editResource, url: e.target.value})} required />
                            </div>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Description</label>
                                <textarea style={styles.textarea} value={editResource.description} onChange={(e) => setEditResource({...editResource, description: e.target.value})} />
                            </div>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Type</label>
                                <select style={styles.select} value={editResource.resource_type} onChange={(e) => setEditResource({...editResource, resource_type: e.target.value})}>
                                    <option value="article">Article</option>
                                    <option value="interview">Interview</option>
                                    <option value="video">Video</option>
                                    <option value="report">Report</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div style={styles.buttonGroup}>
                                <button type="submit" style={styles.submitButton}>Update Resource</button>
                                <button type="button" style={styles.cancelButton} onClick={() => setShowEditResourceModal(false)}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Add Resource Modal */}
            {showAddResourceModal && (
                <div style={styles.modal} onClick={() => setShowAddResourceModal(false)}>
                    <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <h2 style={styles.modalTitle}>Add Resource</h2>
                        <form onSubmit={handleAddResource}>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Title *</label>
                                <input type="text" style={styles.input} value={newResource.title} onChange={(e) => setNewResource({...newResource, title: e.target.value})} required />
                            </div>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>URL *</label>
                                <input type="url" style={styles.input} value={newResource.url} onChange={(e) => setNewResource({...newResource, url: e.target.value})} required />
                            </div>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Description</label>
                                <textarea style={styles.textarea} value={newResource.description} onChange={(e) => setNewResource({...newResource, description: e.target.value})} />
                            </div>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Type</label>
                                <select style={styles.select} value={newResource.resource_type} onChange={(e) => setNewResource({...newResource, resource_type: e.target.value})}>
                                    <option value="article">Article</option>
                                    <option value="interview">Interview</option>
                                    <option value="video">Video</option>
                                    <option value="report">Report</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div style={styles.buttonGroup}>
                                <button type="submit" style={styles.submitButton}>Add Resource</button>
                                <button type="button" style={styles.cancelButton} onClick={() => setShowAddResourceModal(false)}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Performance Modal */}
            {showEditPerformanceModal && (
                <div style={styles.modal} onClick={() => setShowEditPerformanceModal(false)}>
                    <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <h2 style={styles.modalTitle}>Edit Performance Data</h2>
                        <form onSubmit={handleUpdatePerformance}>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Year *</label>
                                <input type="number" style={styles.input} value={editPerformance.year} onChange={(e) => setEditPerformance({...editPerformance, year: parseInt(e.target.value)})} required />
                            </div>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Return Percentage *</label>
                                <input type="number" step="0.01" style={styles.input} value={editPerformance.return_percentage} onChange={(e) => setEditPerformance({...editPerformance, return_percentage: parseFloat(e.target.value)})} required />
                            </div>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Notes</label>
                                <textarea style={styles.textarea} value={editPerformance.notes} onChange={(e) => setEditPerformance({...editPerformance, notes: e.target.value})} />
                            </div>
                            <div style={styles.buttonGroup}>
                                <button type="submit" style={styles.submitButton}>Update Performance</button>
                                <button type="button" style={styles.cancelButton} onClick={() => setShowEditPerformanceModal(false)}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Add Performance Modal */}
            {showAddPerformanceModal && (
                <div style={styles.modal} onClick={() => setShowAddPerformanceModal(false)}>
                    <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <h2 style={styles.modalTitle}>Add Performance Data</h2>
                        <form onSubmit={handleAddPerformance}>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Year *</label>
                                <input type="number" style={styles.input} value={newPerformance.year} onChange={(e) => setNewPerformance({...newPerformance, year: parseInt(e.target.value)})} required />
                            </div>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Return Percentage *</label>
                                <input type="number" step="0.01" style={styles.input} value={newPerformance.return_percentage} onChange={(e) => setNewPerformance({...newPerformance, return_percentage: parseFloat(e.target.value)})} required />
                            </div>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Notes</label>
                                <textarea style={styles.textarea} value={newPerformance.notes} onChange={(e) => setNewPerformance({...newPerformance, notes: e.target.value})} />
                            </div>
                            <div style={styles.buttonGroup}>
                                <button type="submit" style={styles.submitButton}>Add Performance</button>
                                <button type="button" style={styles.cancelButton} onClick={() => setShowAddPerformanceModal(false)}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}