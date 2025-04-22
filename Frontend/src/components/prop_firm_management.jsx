import React, { useEffect, useState } from "react";
import Header from "./header";
import SideNavs from "./side_navs";
import axios from "axios";

export default function PropFirmManagement() {
  const baseUrl = 'https://backend-production-c0ab.up.railway.app';
  const [propFirms, setPropFirms] = useState([]);
  const [metrics, setMetrics] = useState([]);
  const [showAddFirm, setShowAddFirm] = useState(false);
  const [showAddMetric, setShowAddMetric] = useState(false);
  const [editingMetric, setEditingMetric] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    try {
      await axios.post(`${baseUrl}/api/prop-firms/`, newFirm);
      fetchPropFirms();
      setNewFirm({ name: "", logo: "", website: "" });
      setShowAddFirm(false);
    } catch (err) {
      setError("Failed to add prop firm");
      console.error(err);
    }
  };

  const handleSubmitMetric = async (e) => {
    e.preventDefault();
    try {
      if (editingMetric) {
        await axios.put(`${baseUrl}/api/prop-metrics/${editingMetric.id}/`, newMetric);
      } else {
        await axios.post(`${baseUrl}/api/prop-metrics/`, newMetric);
      }
      fetchMetrics();
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
      try {
        await axios.delete(`${baseUrl}/api/prop-metrics/${id}/`);
        fetchMetrics();
      } catch (err) {
        setError("Failed to delete metric");
        console.error(err);
      }
    }
  };

  // Helper function to format base64 logo
  const formatLogo = (logoData) => {
    if (!logoData) return null;
    // If it's already a data URL, return as is
    if (logoData.startsWith('data:')) {
      return logoData;
    }
    // Otherwise, assume it's a base64 string and add the appropriate prefix
    return `data:image/png;base64,${logoData}`;
  };

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
          
          {error && <div className="bg-red-100 text-red-700 p-3 mb-4 rounded">{error}</div>}
          
          <div className="flex justify-between mb-6">
            <div>
              <button 
                onClick={() => setShowAddFirm(!showAddFirm)} 
                className="btn btn-primary"
              >
                {showAddFirm ? 'Cancel' : 'Add New Prop Firm'}
              </button><br /><br />
              
              <button 
                onClick={() => {
                  setShowAddMetric(!showAddMetric);
                  setEditingMetric(null);
                  if (!showAddMetric) {
                    setNewMetric({
                      prop_firm_id: propFirms.length > 0 ? propFirms[0].id : "",
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
                      className="w-full p-2 border rounded"
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
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">Firm Logo</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFirmLogoChange}
                      className="w-full p-2 border rounded"
                    />
                    {newFirm.logo && (
                      <div className="mt-2">
                        <img src={newFirm.logo} alt="Logo Preview" className="h-16 w-auto" />
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="mt-4">
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                  >
                    Save Prop Firm
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
                      className="w-full p-2 border rounded"
                      required
                    >
                      <option value="">Select Prop Firm</option>
                      {propFirms.map(firm => (
                        <option key={firm.id} value={firm.id}>{firm.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Account Type</label>
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
                    <label className="block text-sm font-medium mb-1">Status</label>
                    <select
                      name="status"
                      value={newMetric.status}
                      onChange={handleMetricInputChange}
                      className="w-full p-2 border rounded"
                    >
                      <option value="in_progress">In Progress</option>
                      <option value="passed">Passed</option>
                      <option value="failed">Failed</option>
                      <option value="live">Live</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Account ID</label>
                    <input
                      type="text"
                      name="account_id"
                      value={newMetric.account_id}
                      onChange={handleMetricInputChange}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Start Date</label>
                    <input
                      type="date"
                      name="start_date"
                      value={newMetric.start_date}
                      onChange={handleMetricInputChange}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Starting Balance</label>
                    <input
                      type="number"
                      name="starting_balance"
                      value={newMetric.starting_balance}
                      onChange={handleMetricInputChange}
                      className="w-full p-2 border rounded"
                      step="0.01"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Current Balance</label>
                    <input
                      type="number"
                      name="current_balance"
                      value={newMetric.current_balance}
                      onChange={handleMetricInputChange}
                      className="w-full p-2 border rounded"
                      step="0.01"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Current Equity</label>
                    <input
                      type="number"
                      name="current_equity"
                      value={newMetric.current_equity}
                      onChange={handleMetricInputChange}
                      className="w-full p-2 border rounded"
                      step="0.01"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Profit Target</label>
                    <input
                      type="number"
                      name="profit_target"
                      value={newMetric.profit_target || ""}
                      onChange={handleMetricInputChange}
                      className="w-full p-2 border rounded"
                      step="0.01"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Max Drawdown</label>
                    <input
                      type="number"
                      name="max_drawdown"
                      value={newMetric.max_drawdown || ""}
                      onChange={handleMetricInputChange}
                      className="w-full p-2 border rounded"
                      step="0.01"
                    />
                  </div>
                  
                  <div className="md:col-span-3">
                    <label className="block text-sm font-medium mb-1">Notes</label>
                    <textarea
                      name="notes"
                      value={newMetric.notes}
                      onChange={handleMetricInputChange}
                      className="w-full p-2 border rounded"
                      rows="3"
                    ></textarea>
                  </div>
                </div>
                
                <div className="mt-4">
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                  >
                    {editingMetric ? 'Update Account' : 'Save Account'}
                  </button>
                </div>
              </form>
            </div>
          )}
          
          {/* Metrics List */}
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : metrics.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No prop firm accounts added yet.</div>
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
                  {metrics.map(metric => (
                    <tr key={metric.id} className="border-t hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          {metric.prop_firm.logo && (
                            <img 
                              src={formatLogo(metric.prop_firm.logo)} 
                              alt={metric.prop_firm.name} 
                              className="h-8 w-auto mr-2"
                              onError={(e) => {
                                console.error("Error loading image:", e);
                                e.target.style.display = 'none';
                              }}
                            />
                          )}
                          <span>{metric.prop_firm.name}</span>
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
                          className="btn btn-primary"
                        >
                          Edit
                        </button><br /><br />
                        <button 
                          onClick={() => handleDeleteMetric(metric.id)}
                          className="btn btn-primary"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          
          {/* Firm Performance Summary */}
          {metrics.length > 0 && propFirms.length > 1 && (
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
                    {propFirms.map(firm => {
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
                              {firm.logo && (
                                <img 
                                  src={formatLogo(firm.logo)} 
                                  alt={firm.name} 
                                  className="h-6 w-auto mr-2"
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                  }}
                                />
                              )}
                              <span>{firm.name}</span>
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
        </div>
      </div>
    </div>
  );
}