import React, { useEffect, useState } from "react";
import Header from "./header";
import SideNavs from "./side_navs";
import axios from "axios";

// Updated Logo component with better sizing and rounded edges
const FirmLogo = ({ logoData, alt, className }) => {
  const [imgError, setImgError] = useState(false);
  
  // Format the logo data
  const formatLogo = (data) => {
    if (!data) return null;
    
    // If it's already a complete data URL, return as is
    if (data.startsWith('data:image')) {
      return data;
    }
    
    // If it's a URL, return as is
    if (data.startsWith('http://') || data.startsWith('https://')) {
      return data;
    }
    
    // If it's a base64 string without prefix, try to add the prefix
    try {
      // Check if it looks like a base64 string
      if (data.match(/^[A-Za-z0-9+/=]+$/)) {
        return `data:image/png;base64,${data}`;
      }
      
      // For other formats, return as is
      return data;
    } catch (e) {
      console.error("Error formatting logo:", e);
      return null;
    }
  };
  
  const formattedLogo = formatLogo(logoData);
  
  const logoStyles = `rounded-full object-cover object-center ${className}`;
  
  if (!formattedLogo || imgError) {
    return (
      <div className={`bg-gray-200 rounded-full flex items-center justify-center ${className}`}>
        <span className="text-gray-500 text-xs">{alt?.charAt(0)?.toUpperCase() || '?'}</span>
      </div>
    );
  }
  
  return (
    <div className="overflow-hidden rounded-full" style={{
      maxWidth: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <img 
        src={formattedLogo} 
        alt={alt || "Logo"} 
        className={logoStyles}
        onError={() => setImgError(true)}
        style={{
          objectFit: 'cover',
          width: '100%',
          height: '100%'
        }}
      />
    </div>
  );
};

// New loading spinner component with reduced size
const LoadingSpinner = ({ message }) => (
  <div className="flex items-center justify-center space-x-2 text-blue-600">
    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    <span className="text-sm">{message}</span>
  </div>
);

export default function PropFirmManagement() {
  const baseUrl = 'https://backend-production-c0ab.up.railway.app';
  const [propFirms, setPropFirms] = useState([]);
  const [metrics, setMetrics] = useState([]);
  const [showAddFirm, setShowAddFirm] = useState(false);
  const [showAddMetric, setShowAddMetric] = useState(false);
  const [editingMetric, setEditingMetric] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Status indicators for API operations
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredMetrics, setFilteredMetrics] = useState([]);

  // Form states
  const [newFirm, setNewFirm] = useState({
    name: "",
    logo: "",
    website: ""
  });

  const [newMetric, setNewMetric] = useState({
    prop_firm_id: "",
    account_type: "challenge",
    status: "in_progress",
    account_id: "",
    starting_balance: 0,
    current_balance: 0,
    current_equity: 0,
    profit_target: null,
    max_drawdown: null,
    start_date: new Date().toISOString().split('T')[0],
    notes: ""
  });

  useEffect(() => {
    fetchPropFirms();
    fetchMetrics();
  }, []);
  
  // Filter metrics when search term or metrics change
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredMetrics(metrics);
    } else {
      const lowercaseSearch = searchTerm.toLowerCase();
      const filtered = metrics.filter(metric => 
        metric.prop_firm.name.toLowerCase().includes(lowercaseSearch) ||
        (metric.account_id && metric.account_id.toLowerCase().includes(lowercaseSearch))
      );
      setFilteredMetrics(filtered);
    }
  }, [searchTerm, metrics]);

  const fetchPropFirms = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/prop-firms/`);
      setPropFirms(response.data);
    } catch (err) {
      setError("Failed to fetch prop firms");
      console.error(err);
    }
  };

  const fetchMetrics = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/prop-metrics/`);
      setMetrics(response.data);
      setFilteredMetrics(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch metrics");
      setLoading(false);
      console.error(err);
    }
  };

  const handleFirmInputChange = (e) => {
    const { name, value } = e.target;
    setNewFirm({
      ...newFirm,
      [name]: value
    });
  };

  const handleFirmLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewFirm({
          ...newFirm,
          logo: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMetricInputChange = (e) => {
    const { name, value } = e.target;
    setNewMetric({
      ...newMetric,
      [name]: value
    });
  };

  const handleSubmitFirm = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await axios.post(`${baseUrl}/api/prop-firms/`, newFirm);
      await fetchPropFirms();
      setNewFirm({ name: "", logo: "", website: "" });
      setShowAddFirm(false);
    } catch (err) {
      setError("Failed to add prop firm");
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmitMetric = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (editingMetric) {
        await axios.put(`${baseUrl}/api/prop-metrics/${editingMetric.id}/`, newMetric);
      } else {
        await axios.post(`${baseUrl}/api/prop-metrics/`, newMetric);
      }
      await fetchMetrics();
      setNewMetric({
        prop_firm_id: "",
        account_type: "challenge",
        status: "in_progress",
        account_id: "",
        starting_balance: 0,
        current_balance: 0,
        current_equity: 0,
        profit_target: null,
        max_drawdown: null,
        start_date: new Date().toISOString().split('T')[0],
        notes: ""
      });
      setShowAddMetric(false);
      setEditingMetric(null);
    } catch (err) {
      setError("Failed to save metric");
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditMetric = (metric) => {
    setEditingMetric(metric);
    setNewMetric({
      prop_firm_id: metric.prop_firm.id,
      account_type: metric.account_type,
      status: metric.status,
      account_id: metric.account_id || "",
      starting_balance: metric.starting_balance,
      current_balance: metric.current_balance,
      current_equity: metric.current_equity,
      profit_target: metric.profit_target || "",
      max_drawdown: metric.max_drawdown || "",
      start_date: metric.start_date,
      notes: metric.notes || ""
    });
    setShowAddMetric(true);
  };

  const handleDeleteMetric = async (id) => {
    if (window.confirm("Are you sure you want to delete this entry?")) {
      setIsDeleting(id);
      try {
        await axios.delete(`${baseUrl}/api/prop-metrics/${id}/`);
        await fetchMetrics();
      } catch (err) {
        setError("Failed to delete metric");
        console.error(err);
      } finally {
        setIsDeleting(null);
      }
    }
  };

  // Remove duplicates from propFirms for the dropdown
  const uniquePropFirms = propFirms.filter((firm, index, self) =>
    index === self.findIndex((f) => f.id === firm.id)
  );

  const getStatusClass = (status) => {
    switch (status) {
      case 'in_progress': return 'text-blue-500';
      case 'passed': return 'text-green-500';
      case 'failed': return 'text-red-500';
      case 'live': return 'text-purple-500';
      default: return '';
    }
  };

  const getStatusDisplay = (status) => {
    switch (status) {
      case 'in_progress': return 'In Progress';
      case 'passed': return 'Passed';
      case 'failed': return 'Failed';
      case 'live': return 'Live';
      default: return status;
    }
  };

  const getAccountTypeDisplay = (type) => {
    switch (type) {
      case 'challenge': return 'Challenge';
      case 'verification': return 'Verification';
      case 'funded': return 'Funded';
      default: return type;
    }
  };

  return (
    <div>
      <div className="header">
        <Header />
      </div>
      <div className="main-page-body">
        <SideNavs />
        <div className="main-body-info">
          <h5 className="major-upcoming-news-events-header">Prop Firm Management</h5>
          <br />
          
          {error && (
            <div className="bg-red-100 text-red-700 p-3 mb-4 rounded flex justify-between items-center">
              <span>{error}</span>
              <button 
                onClick={() => setError(null)} 
                className="btn btn-primary"
              >
                ✕
              </button>
            </div>
          )}
          
          <div className="flex justify-between mb-6">
            <div>
              <button 
                onClick={() => setShowAddFirm(!showAddFirm)} 
                className="btn btn-primary mr-4"
              >
                {showAddFirm ? 'Cancel' : 'Add New Prop Firm'}
              </button>
              
              <button 
                onClick={() => {
                  setShowAddMetric(!showAddMetric);
                  setEditingMetric(null);
                  if (!showAddMetric) {
                    setNewMetric({
                      prop_firm_id: uniquePropFirms.length > 0 ? uniquePropFirms[0].id : "",
                      account_type: "challenge",
                      status: "in_progress",
                      account_id: "",
                      starting_balance: 0,
                      current_balance: 0,
                      current_equity: 0,
                      profit_target: null,
                      max_drawdown: null,
                      start_date: new Date().toISOString().split('T')[0],
                      notes: ""
                    });
                  }
                }} 
                className="btn btn-primary"
              >
                {showAddMetric ? 'Cancel' : 'Add New Account'}
              </button>
            </div>
            
            {/* Search bar */}
            <div className="relative">
            <input
                type="text"
                placeholder="Search by firm name or account ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-control p-2 pl-8 border rounded w-full sm:w-64 text-sm"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-2 top-2.5 btn btn-primary"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
          
          {/* Add Prop Firm Form */}
          {showAddFirm && (
            <div className="bg-gray-50 p-4 mb-6 rounded shadow">
              <h6 className="text-lg font-medium mb-4">Add New Prop Firm</h6>
              <form onSubmit={handleSubmitFirm}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Prop Firm Name</label>
                    <input
                      type="text"
                      name="name"
                      value={newFirm.name}
                      onChange={handleFirmInputChange}
                      className="form-control w-full p-2 border rounded"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Website URL</label>
                    <input
                      type="url"
                      name="website"
                      value={newFirm.website}
                      onChange={handleFirmInputChange}
                      className="form-control w-full p-2 border rounded"
                      placeholder="https://example.com"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">Firm Logo</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFirmLogoChange}
                      className="form-control w-full p-2 border rounded"
                    />
                    {newFirm.logo && (
                      <div className="mt-2 flex items-center">
                        <div style={{ width: '48px', height: '48px' }}>
                          <FirmLogo 
                            logoData={newFirm.logo} 
                            alt="Logo Preview" 
                            className="h-12 w-12" 
                          />
                        </div>
                        <span className="ml-2 text-sm text-gray-500">Logo Preview</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="mt-4">
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <div className="flex items-center">
                        
                        <span className="text-sm">Saving...</span>
                      </div>
                    ) : 'Save Prop Firm'}
                  </button>
                </div>
              </form>
            </div>
          )}
          
          {/* Add/Edit Account Metrics Form */}
          {showAddMetric && (
            <div className="bg-gray-50 p-4 mb-6 rounded shadow">
              <h6 className="text-lg font-medium mb-4">
                {editingMetric ? 'Edit Account' : 'Add New Account'}
              </h6>
              <form onSubmit={handleSubmitMetric}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Prop Firm</label>
                    <select
                      name="prop_firm_id"
                      value={newMetric.prop_firm_id}
                      onChange={handleMetricInputChange}
                      className="form-control w-full p-2 border rounded"
                      required
                    >
                      <option value="">Select Prop Firm</option>
                      {uniquePropFirms.map(firm => (
                        <option key={firm.id} value={firm.id}>{firm.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="form-control block text-sm font-medium mb-1">Account Type</label>
                    <select
                      name="account_type"
                      value={newMetric.account_type}
                      onChange={handleMetricInputChange}
                      className="w-full p-2 border rounded"
                    >
                      <option value="challenge">Challenge</option>
                      <option value="verification">Verification</option>
                      <option value="funded">Funded</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="form-control block text-sm font-medium mb-1">Status</label>
                    <select
                      name="status"
                      value={newMetric.status}
                      onChange={handleMetricInputChange}
                      className="form-control w-full p-2 border rounded"
                    >
                      <option value="in_progress">In Progress</option>
                      <option value="passed">Passed</option>
                      <option value="failed">Failed</option>
                      <option value="live">Live</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="form-control block text-sm font-medium mb-1">Account ID</label>
                    <input
                      type="text"
                      name="account_id"
                      value={newMetric.account_id}
                      onChange={handleMetricInputChange}
                      className="form-control w-full p-2 border rounded"
                    />
                  </div>
                  
                  <div>
                    <label className="form-control block text-sm font-medium mb-1">Start Date</label>
                    <input
                      type="date"
                      name="start_date"
                      value={newMetric.start_date}
                      onChange={handleMetricInputChange}
                      className="form-control w-full p-2 border rounded"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="form-control block text-sm font-medium mb-1">Starting Balance</label>
                    <input
                      type="number"
                      name="starting_balance"
                      value={newMetric.starting_balance}
                      onChange={handleMetricInputChange}
                      className="form-control w-full p-2 border rounded"
                      step="0.01"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="form-control block text-sm font-medium mb-1">Current Balance</label>
                    <input
                      type="number"
                      name="current_balance"
                      value={newMetric.current_balance}
                      onChange={handleMetricInputChange}
                      className="form-control w-full p-2 border rounded"
                      step="0.01"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="form-control block text-sm font-medium mb-1">Current Equity</label>
                    <input
                      type="number"
                      name="current_equity"
                      value={newMetric.current_equity}
                      onChange={handleMetricInputChange}
                      className="form-control w-full p-2 border rounded"
                      step="0.01"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="form-control block text-sm font-medium mb-1">Profit Target</label>
                    <input
                      type="number"
                      name="profit_target"
                      value={newMetric.profit_target || ""}
                      onChange={handleMetricInputChange}
                      className="form-control w-full p-2 border rounded"
                      step="0.01"
                    />
                  </div>
                  
                  <div>
                    <label className="form-control block text-sm font-medium mb-1">Max Drawdown</label>
                    <input
                      type="number"
                      name="max_drawdown"
                      value={newMetric.max_drawdown || ""}
                      onChange={handleMetricInputChange}
                      className="form-control w-full p-2 border rounded"
                      step="0.01"
                    />
                  </div>
                  
                  <div className="md:col-span-3">
                    <label className="form-control block text-sm font-medium mb-1">Notes</label>
                    <textarea
                      name="notes"
                      value={newMetric.notes}
                      onChange={handleMetricInputChange}
                      className="form-control w-full p-2 border rounded"
                      rows="3"
                    ></textarea>
                  </div>
                </div>
                
                <div className="mt-4">
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <div className="flex items-center">
                        
                        {editingMetric ? 'Updating...' : 'Saving...'}
                      </div>
                    ) : (editingMetric ? 'Update Account' : 'Save Account')}
                  </button>
                </div>
              </form>
            </div>
          )}
          
          {/* Metrics List */}
          {loading ? (
            <div className="text-center py-12">
            </div>
          ) : filteredMetrics.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {searchTerm ? 'No matching accounts found.' : 'No prop firm accounts added yet.'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-3 px-4 text-left">Prop Firm</th>
                    <th className="py-3 px-4 text-left">Account Type</th>
                    <th className="py-3 px-4 text-left">Status</th>
                    <th className="py-3 px-4 text-left">Account ID</th>
                    <th className="py-3 px-4 text-right">Start Balance</th>
                    <th className="py-3 px-4 text-right">Current Balance</th>
                    <th className="py-3 px-4 text-right">Current Equity</th>
                    <th className="py-3 px-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMetrics.map(metric => (
                    <tr key={metric.id} className="border-t hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <div style={{ width: '32px', height: '32px', minWidth: '32px' }}>
                            <FirmLogo 
                              logoData={metric.prop_firm.logo} 
                              alt={metric.prop_firm.name} 
                              className="h-8 w-8"
                            />
                          </div>
                          <div className="ml-2">
                            <span className="font-medium">{metric.prop_firm.name}</span>
                            {metric.prop_firm.website && (
                              <div>
                                <a 
                                  href={metric.prop_firm.website.startsWith('http') ? metric.prop_firm.website : `https://${metric.prop_firm.website}`} 
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 text-xs hover:underline"
                                >
                                  Visit Website
                                </a>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">{getAccountTypeDisplay(metric.account_type)}</td>
                      <td className="py-3 px-4">
                        <span className={`font-medium ${getStatusClass(metric.status)}`}>
                          {getStatusDisplay(metric.status)}
                        </span>
                      </td>
                      <td className="py-3 px-4">{metric.account_id || '-'}</td>
                      <td className="py-3 px-4 text-right">${metric.starting_balance.toLocaleString()}</td>
                      <td className="py-3 px-4 text-right">${metric.current_balance.toLocaleString()}</td>
                      <td className="py-3 px-4 text-right">${metric.current_equity.toLocaleString()}</td>
                      <td className="py-3 px-4 text-center">
                        <button 
                          onClick={() => handleEditMetric(metric)}
                          className="btn btn-primary mb-2"
                          disabled={isDeleting === metric.id}
                        >
                          Edit
                        </button><br /><br />
                        <button 
                          onClick={() => handleDeleteMetric(metric.id)}
                          className="btn btn-primary"
                          disabled={isDeleting === metric.id}
                        >
                          {isDeleting === metric.id ? (
                            <div className="flex items-center justify-center">
                              
                            </div>
                          ) : 'Delete'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          {/* Firm Performance Summary */}
          {filteredMetrics.length > 0 && uniquePropFirms.length > 1 && (
            <div className="mt-8 mb-8">
              <h6 className="text-lg font-medium mb-4">Firm Performance</h6>
              
              <div className="bg-white p-4 rounded shadow">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="py-3 px-4 text-left">Prop Firm</th>
                      <th className="py-3 px-4 text-center">Total Accounts</th>
                      <th className="py-3 px-4 text-center">Passed</th>
                      <th className="py-3 px-4 text-center">Failed</th>
                      <th className="py-3 px-4 text-center">Live</th>
                      <th className="py-3 px-4 text-right">Total Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {uniquePropFirms.map(firm => {
                      const firmMetrics = metrics.filter(m => m.prop_firm.id === firm.id);
                      if (firmMetrics.length === 0) return null;
                      
                      const passedCount = firmMetrics.filter(m => m.status === 'passed').length;
                      const failedCount = firmMetrics.filter(m => m.status === 'failed').length;
                      const liveCount = firmMetrics.filter(m => m.status === 'live').length;
                      const totalBalance = firmMetrics.reduce((sum, m) => sum + parseFloat(m.current_balance), 0);
                      
                      return (
                        <tr key={firm.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <div className="flex items-center">
                              <div style={{ width: '24px', height: '24px', minWidth: '24px' }}>
                                <FirmLogo 
                                  logoData={firm.logo} 
                                  alt={firm.name} 
                                  className="h-6 w-6"
                                />
                              </div>
                              <div className="ml-2">
                                <span>{firm.name}</span>
                                {firm.website && (
                                  <div>
                                    <a 
                                      href={firm.website.startsWith('http') ? firm.website : `https://${firm.website}`} 
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-blue-600 text-xs hover:underline"
                                    >
                                      Website
                                    </a>
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-center">{firmMetrics.length}</td>
                          <td className="py-3 px-4 text-center text-green-600">{passedCount > 0 ? passedCount : '-'}</td>
                          <td className="py-3 px-4 text-center text-red-600">{failedCount > 0 ? failedCount : '-'}</td>
                          <td className="py-3 px-4 text-center text-purple-600">{liveCount > 0 ? liveCount : '-'}</td>
                          <td className="py-3 px-4 text-right font-medium">${totalBalance.toLocaleString()}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          {/* Status message for when no search results are found */}
          {searchTerm && filteredMetrics.length === 0 && metrics.length > 0 && (
            <div className="text-center py-8 text-gray-500">
              No accounts match your search for "{searchTerm}".
              <button 
                onClick={() => setSearchTerm("")}
                className="ml-2 btn btn-primary"
              >
                Clear search
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}