import React, { useEffect, useState } from "react";
import { Line } from "recharts";
import { Plus, AlertTriangle, ChevronDown, ChevronUp, Trash, Edit, Mic, Upload } from "lucide-react";
import Header from "./header";
import SideNavs from "./side_navs";
import Cookies from 'js-cookie';

export default function PropFirmManagement() {
    const [view, setView] = useState('dashboard'); // dashboard, createAccount, accountDetail
    const [propFirms, setPropFirms] = useState([]);
    const [accounts, setAccounts] = useState([]);
    const [metrics, setMetrics] = useState(null);
    const [selectedAccount, setSelectedAccount] = useState(null);
    const [accountAnalytics, setAccountAnalytics] = useState(null);
    const [formData, setFormData] = useState({
        prop_firm_id: '',
        account_name: '',
        account_id: '',
        account_type: 'CHALLENGE',
        initial_balance: '',
        daily_loss_limit: '',
        max_loss_limit: '',
        profit_target: '',
        start_date: new Date().toISOString().split('T')[0],
        end_date: '',
    });
    const [logoFile, setLogoFile] = useState(null);
    const [logoPreview, setLogoPreview] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const baseUrl = 'https://backend-production-c0ab.up.railway.app';
    
    // Fetch initial data
    useEffect(() => {
        fetchPropFirms();
        fetchAccounts();
        fetchMetrics();
    }, []);
    
    const fetchPropFirms = async () => {
        try {
            const response = await fetch(`${baseUrl}/api/prop-firms/`, {
                headers: {
                    'Authorization': `Bearer ${Cookies.get('token')}`
                }
            });
            const data = await response.json();
            
            // Ensure we have an array of prop firms
            const firms = Array.isArray(data.firms) ? data.firms : [];
            setPropFirms(firms);
        } catch (err) {
            setError('Failed to fetch prop firms');
            console.error(err);
        }
    };
    
    const fetchAccounts = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${baseUrl}/api/accounts/`, {
                headers: {
                    'Authorization': `Bearer ${Cookies.get('token')}`
                }
            });
            const data = await response.json();
            setAccounts(data.accounts || []);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch accounts');
            setLoading(false);
            console.error(err);
        }
    };
    
    const fetchMetrics = async () => {
        try {
            const response = await fetch(`${baseUrl}/api/metrics/`, {
                headers: {
                    'Authorization': `Bearer ${Cookies.get('token')}`
                }
            });
            const data = await response.json();
            setMetrics(data.metrics);
        } catch (err) {
            console.error(err);
        }
    };
    
    const fetchAccountAnalytics = async (accountId) => {
        try {
            const response = await fetch(`${baseUrl}/api/accounts/${accountId}/analytics/`, {
                headers: {
                    'Authorization': `Bearer ${Cookies.get('token')}`
                }
            });
            const data = await response.json();
            setAccountAnalytics(data);
        } catch (err) {
            console.error(err);
        }
    };
    
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };
    
    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setLogoFile(file);
            // Create a preview URL
            const previewUrl = URL.createObjectURL(file);
            setLogoPreview(previewUrl);
        }
    };
    
    const handleCreateAccount = async (e) => {
        e.preventDefault();
        
        try {
            // Create a FormData object to handle file upload
            const formDataToSend = new FormData();
            
            // Append all form fields
            Object.keys(formData).forEach(key => {
                formDataToSend.append(key, formData[key]);
            });
            
            // Append logo file if available
            if (logoFile) {
                formDataToSend.append('logo', logoFile);
            }
            
            const response = await fetch(`${baseUrl}/api/accounts/create/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${Cookies.get('token')}`
                    // Note: Don't set Content-Type when using FormData
                },
                body: formDataToSend
            });
            
            const data = await response.json();
            if (data.success) {
                setView('dashboard');
                fetchAccounts();
                fetchMetrics();
                // Reset form
                setFormData({
                    prop_firm_id: '',
                    account_name: '',
                    account_id: '',
                    account_type: 'CHALLENGE',
                    initial_balance: '',
                    daily_loss_limit: '',
                    max_loss_limit: '',
                    profit_target: '',
                    start_date: new Date().toISOString().split('T')[0],
                    end_date: '',
                });
                setLogoFile(null);
                setLogoPreview(null);
            } else {
                setError(data.error || 'Failed to create account');
            }
        } catch (err) {
            setError('Failed to create account');
            console.error(err);
        }
    };
    
    const handleViewAccount = (account) => {
        setSelectedAccount(account);
        fetchAccountAnalytics(account.id);
        setView('accountDetail');
    };

    // Additional method to add a prop firm
    const handleAddPropFirm = async (firmData) => {
        try {
            const response = await fetch(`${baseUrl}/api/prop-firms/create/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${Cookies.get('token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(firmData)
            });
            
            const data = await response.json();
            if (data.success) {
                fetchPropFirms(); // Refresh prop firms list
                return data.firm;
            } else {
                setError(data.error || 'Failed to add prop firm');
                return null;
            }
        } catch (err) {
            setError('Failed to add prop firm');
            console.error(err);
            return null;
        }
    };
    
    const renderDashboard = () => {
        if (loading) {
            return <div className="loading">Loading accounts...</div>;
        }
        
        if (error) {
            return <div className="error">{error}</div>;
        }
        
        return (
            <div className="dashboard">
                {/* Metrics Summary */}
                {metrics && (
                    <div className="metrics-summary">
                        <div className="metric-card">
                            <h6>Total Capital</h6>
                            <p className="metric-value">${metrics.total_capital_managed?.toLocaleString() || '0'}</p>
                        </div>
                        <div className="metric-card">
                            <h6>Total Accounts</h6>
                            <p className="metric-value">{metrics.total_accounts || 0}</p>
                        </div>
                        <div className="metric-card">
                            <h6>Win Rate</h6>
                            <p className="metric-value">{metrics.win_rate?.toFixed(2) || '0.00'}%</p>
                        </div>
                        <div className="metric-card">
                            <h6>Risk/Reward</h6>
                            <p className="metric-value">{metrics.avg_risk_reward?.toFixed(2) || '0.00'}</p>
                        </div>
                    </div>
                )}

                {/* Account list */}
                <div className="accounts-list">
                    <div className="accounts-header">
                        <h3>Your Prop Firm Accounts</h3>
                        <button className="btn-add" onClick={() => setView('createAccount')}>
                            <Plus size={16} /> Add Account
                        </button>
                    </div>
                    
                    {accounts.length === 0 ? (
                        <div className="no-accounts">
                            <p>You don't have any prop firm accounts yet. Add your first one!</p>
                        </div>
                    ) : (
                        <div className="accounts-grid">
                            {accounts.map(account => (
                                <div 
                                    key={account.id} 
                                    className={`account-card ${account.status?.toLowerCase() || 'in_progress'}`}
                                    onClick={() => handleViewAccount(account)}
                                >
                                    <div className="account-logo">
                                    {account.prop_firm?.logo ? (
                                            <img src={account.prop_firm.logo} alt={account.prop_firm.name} />
                                        ) : (
                                            <div className="no-logo">{account.prop_firm?.name?.charAt(0) || 'P'}</div>
                                        )}
                                    </div>
                                    <div className="account-info">
                                        <h4>{account.account_name}</h4>
                                        <p className="firm-name">{account.prop_firm?.name || 'Unknown Firm'}</p>
                                        <p className="account-type">{account.account_type}</p>
                                        <div className="account-status">
                                            <span className={`status-indicator ${account.status?.toLowerCase() || 'in_progress'}`}></span>
                                            {account.status?.replace('_', ' ') || 'In Progress'}
                                        </div>
                                    </div>
                                    <div className="account-metrics">
                                        <div className="balance-info">
                                            <p>Balance: ${(account.current_balance || 0).toLocaleString()}</p>
                                            <p>Equity: ${(account.current_equity || 0).toLocaleString()}</p>
                                        </div>
                                        
                                        {account.percentage_to_target !== null && (
                                            <div className="progress-bar">
                                                <div 
                                                    className="progress" 
                                                    style={{width: `${Math.min(100, Math.max(0, account.percentage_to_target))}%`}}
                                                ></div>
                                                <span>{account.percentage_to_target.toFixed(1)}% to target</span>
                                            </div>
                                        )}
                                        
                                        {account.days_remaining !== null && (
                                            <p className="days-remaining">
                                                {account.days_remaining} days remaining
                                            </p>
                                        )}
                                        
                                        {/* Warning indicator if close to breaching rules */}
                                        {account.daily_loss_limit && 
                                         (account.initial_balance - account.current_balance) > (account.daily_loss_limit * 0.8) && (
                                            <div className="warning-indicator">
                                                <AlertTriangle size={16} color="orange" />
                                                <span>Close to daily loss limit</span>
                                            </div>
                                        )}
                                        
                                        {account.max_loss_limit && 
                                         (account.initial_balance - account.current_balance) > (account.max_loss_limit * 0.8) && (
                                            <div className="warning-indicator">
                                                <AlertTriangle size={16} color="red" />
                                                <span>Close to max loss limit</span>
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
    };
    
    const renderCreateAccountForm = () => {
        return (
            <div className="create-account-form">
                <h3>Add New Prop Firm Account</h3>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleCreateAccount}>
                    <div className="form-group">
                        <label>Prop Firm</label>
                        <select 
                            name="prop_firm_id" 
                            value={formData.prop_firm_id} 
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">Select a prop firm</option>
                            {propFirms.length > 0 && propFirms.map(firm => (
                                <option key={firm.id} value={firm.id}>{firm.name}</option>
                            ))}
                        </select>
                        
                        {/* Add a button to create a new prop firm */}
                        <div className="add-prop-firm">
                            <button type="button" className="btn-add-prop-firm" onClick={() => setView('addPropFirm')}>
                                <Plus size={16} /> Add New Prop Firm
                            </button>
                        </div>
                    </div>
                    
                    <div className="form-group">
                        <label>Account Name</label>
                        <input 
                            type="text" 
                            name="account_name" 
                            value={formData.account_name} 
                            onChange={handleInputChange}
                            required
                            placeholder="E.g., $50K Challenge"
                        />
                    </div>
                    
                    <div className="form-group">
                        <label>Account ID (Optional)</label>
                        <input 
                            type="text" 
                            name="account_id" 
                            value={formData.account_id} 
                            onChange={handleInputChange}
                            placeholder="Your account ID with the prop firm"
                        />
                    </div>
                    
                    <div className="form-group">
                        <label>Account Type</label>
                        <select 
                            name="account_type" 
                            value={formData.account_type} 
                            onChange={handleInputChange}
                            required
                        >
                            <option value="CHALLENGE">Challenge</option>
                            <option value="VERIFICATION">Verification</option>
                            <option value="FUNDED">Funded</option>
                        </select>
                    </div>
                    
                    <div className="form-group">
                        <label>Initial Balance</label>
                        <input 
                            type="number" 
                            name="initial_balance" 
                            value={formData.initial_balance} 
                            onChange={handleInputChange}
                            required
                            placeholder="10000"
                        />
                    </div>
                    
                    <div className="form-group">
                        <label>Daily Loss Limit (Optional)</label>
                        <input 
                            type="number" 
                            name="daily_loss_limit" 
                            value={formData.daily_loss_limit} 
                            onChange={handleInputChange}
                            placeholder="500"
                        />
                    </div>
                    
                    <div className="form-group">
                        <label>Max Loss Limit (Optional)</label>
                        <input 
                            type="number" 
                            name="max_loss_limit" 
                            value={formData.max_loss_limit} 
                            onChange={handleInputChange}
                            placeholder="1000"
                        />
                    </div>
                    
                    <div className="form-group">
                        <label>Profit Target (Optional)</label>
                        <input 
                            type="number" 
                            name="profit_target" 
                            value={formData.profit_target} 
                            onChange={handleInputChange}
                            placeholder="1000"
                        />
                    </div>
                    
                    <div className="form-group">
                        <label>Start Date</label>
                        <input 
                            type="date" 
                            name="start_date" 
                            value={formData.start_date} 
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <label>End Date (Optional)</label>
                        <input 
                            type="date" 
                            name="end_date" 
                            value={formData.end_date} 
                            onChange={handleInputChange}
                            placeholder="For challenges with time limits"
                        />
                    </div>
                    
                    {/* Add logo upload field */}
                    <div className="form-group">
                        <label>Prop Firm Logo (Optional)</label>
                        <div className="logo-upload">
                            <label className="logo-upload-label">
                                <input 
                                    type="file" 
                                    accept="image/*" 
                                    onChange={handleLogoChange}
                                    className="logo-input"
                                />
                                <div className="upload-button">
                                    <Upload size={16} /> Upload Logo
                                </div>
                            </label>
                            
                            {logoPreview && (
                                <div className="logo-preview">
                                    <img src={logoPreview} alt="Logo preview" />
                                </div>
                            )}
                        </div>
                    </div>
                    
                    <div className="form-actions">
                        <button type="button" onClick={() => setView('dashboard')} className="btn-cancel">
                            Cancel
                        </button>
                        <button type="submit" className="btn-create">
                            Create Account
                        </button>
                    </div>
                </form>
            </div>
        );
    };
    
    // Add a component to create a new prop firm
    const [propFirmData, setPropFirmData] = useState({
        name: '',
        website: '',
        description: ''
    });
    const [propFirmLogo, setPropFirmLogo] = useState(null);
    const [propFirmLogoPreview, setPropFirmLogoPreview] = useState(null);
    
    const handlePropFirmInputChange = (e) => {
        const { name, value } = e.target;
        setPropFirmData({
            ...propFirmData,
            [name]: value
        });
    };
    
    const handlePropFirmLogoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPropFirmLogo(file);
            const previewUrl = URL.createObjectURL(file);
            setPropFirmLogoPreview(previewUrl);
        }
    };
    
    const handleCreatePropFirm = async (e) => {
        e.preventDefault();
        
        try {
            const formDataToSend = new FormData();
            
            Object.keys(propFirmData).forEach(key => {
                formDataToSend.append(key, propFirmData[key]);
            });
            
            if (propFirmLogo) {
                formDataToSend.append('logo', propFirmLogo);
            }
            
            const response = await fetch(`${baseUrl}/api/prop-firms/create/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${Cookies.get('token')}`
                },
                body: formDataToSend
            });
            
            const data = await response.json();
            if (data.success) {
                await fetchPropFirms();
                // Reset form and return to create account view
                setPropFirmData({
                    name: '',
                    website: '',
                    description: ''
                });
                setPropFirmLogo(null);
                setPropFirmLogoPreview(null);
                setView('createAccount');
            } else {
                setError(data.error || 'Failed to create prop firm');
            }
        } catch (err) {
            setError('Failed to create prop firm');
            console.error(err);
        }
    };
    
    const renderAddPropFirmForm = () => {
        return (
            <div className="create-prop-firm-form">
                <h3>Add New Prop Firm</h3>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleCreatePropFirm}>
                    <div className="form-group">
                        <label>Prop Firm Name</label>
                        <input 
                            type="text" 
                            name="name" 
                            value={propFirmData.name} 
                            onChange={handlePropFirmInputChange}
                            required
                            placeholder="E.g., FTMO, E8 Funding, etc."
                        />
                    </div>
                    
                    <div className="form-group">
                        <label>Website (Optional)</label>
                        <input 
                            type="url" 
                            name="website" 
                            value={propFirmData.website} 
                            onChange={handlePropFirmInputChange}
                            placeholder="https://example.com"
                        />
                    </div>
                    
                    <div className="form-group">
                        <label>Description (Optional)</label>
                        <textarea 
                            name="description" 
                            value={propFirmData.description} 
                            onChange={handlePropFirmInputChange}
                            placeholder="Brief description of the prop firm"
                            rows="3"
                        ></textarea>
                    </div>
                    
                    <div className="form-group">
                        <label>Logo (Optional)</label>
                        <div className="logo-upload">
                            <label className="logo-upload-label">
                                <input 
                                    type="file" 
                                    accept="image/*" 
                                    onChange={handlePropFirmLogoChange}
                                    className="logo-input"
                                />
                                <div className="upload-button">
                                    <Upload size={16} /> Upload Logo
                                </div>
                            </label>
                            
                            {propFirmLogoPreview && (
                                <div className="logo-preview">
                                    <img src={propFirmLogoPreview} alt="Logo preview" />
                                </div>
                            )}
                        </div>
                    </div>
                    
                    <div className="form-actions">
                        <button type="button" onClick={() => setView('createAccount')} className="btn-cancel">
                            Cancel
                        </button>
                        <button type="submit" className="btn-create">
                            Create Prop Firm
                        </button>
                    </div>
                </form>
            </div>
        );
    };
    
    const renderAccountDetail = () => {
        if (!selectedAccount) {
            return <div>Loading account details...</div>;
        }
        
        return (
            <div className="account-detail">
                <div className="account-header">
                    <button onClick={() => setView('dashboard')} className="btn-back">
                        &larr; Back to Accounts
                    </button>
                    <h3>{selectedAccount.account_name}</h3>
                    <div className="account-status">
                        <span className={`status-indicator ${selectedAccount.status?.toLowerCase() || 'in_progress'}`}></span>
                        {selectedAccount.status?.replace('_', ' ') || 'In Progress'}
                    </div>
                </div>
                
                <div className="account-summary">
                    <div className="account-summary-left">
                        <div className="prop-firm-info">
                            {selectedAccount.prop_firm?.logo ? (
                                <img src={selectedAccount.prop_firm.logo} alt={selectedAccount.prop_firm.name} />
                            ) : (
                                <div className="no-logo">{selectedAccount.prop_firm?.name?.charAt(0) || 'P'}</div>
                            )}
                            <h4>{selectedAccount.prop_firm?.name || 'Unknown Firm'}</h4>
                        </div>
                        
                        <div className="account-type-info">
                            <p>Account Type: {selectedAccount.account_type}</p>
                            {selectedAccount.account_id && <p>Account ID: {selectedAccount.account_id}</p>}
                        </div>
                    </div>
                    
                    <div className="account-summary-right">
                        <div className="balance-info">
                            <div className="balance-card">
                                <h5>Current Balance</h5>
                                <p className="balance-value">${(selectedAccount.current_balance || 0).toLocaleString()}</p>
                            </div>
                            <div className="balance-card">
                                <h5>Current Equity</h5>
                                <p className="balance-value">${(selectedAccount.current_equity || 0).toLocaleString()}</p>
                            </div>
                            <div className="balance-card">
                                <h5>P/L</h5>
                                <p className={`balance-value ${(selectedAccount.current_balance || 0) > (selectedAccount.initial_balance || 0) ? 'positive' : 'negative'}`}>
                                    ${((selectedAccount.current_balance || 0) - (selectedAccount.initial_balance || 0)).toLocaleString()}
                                </p>
                            </div>
                        </div>
                        
                        <div className="limits-info">
                            {selectedAccount.daily_loss_limit && (
                                <div className="limit-item">
                                    <span>Daily Loss Limit:</span>
                                    <span>${selectedAccount.daily_loss_limit.toLocaleString()}</span>
                                </div>
                            )}
                            {selectedAccount.max_loss_limit && (
                                <div className="limit-item">
                                    <span>Max Loss Limit:</span>
                                    <span>${selectedAccount.max_loss_limit.toLocaleString()}</span>
                                </div>
                            )}
                            {selectedAccount.days_remaining !== null && (
                                <div className="limit-item">
                                    <span>Days Remaining:</span>
                                    <span>{selectedAccount.days_remaining}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                
                {/* Performance Chart */}
                {accountAnalytics && accountAnalytics.trading_days && accountAnalytics.trading_days.length > 0 && (
                    <div className="performance-chart">
                        <h4>Performance History</h4>
                        <div className="chart-container">
                            <Line
                                data={accountAnalytics.trading_days}
                                margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
                            >
                                <Line 
                                    type="monotone" 
                                    dataKey="balance" 
                                    stroke="#8884d8" 
                                    activeDot={{ r: 8 }} 
                                />
                            </Line>
                        </div>
                        <div className="daily-pnl-chart">
                            <h4>Daily P/L</h4>
                            <div className="chart-container">
                                <Line
                                    data={accountAnalytics.trading_days}
                                    margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
                                >
                                    <Line 
                                        type="monotone" 
                                        dataKey="pnl" 
                                        stroke="#82ca9d" 
                                        activeDot={{ r: 8 }} 
                                    />
                                </Line>
                            </div>
                        </div>
                    </div>
                )}
                
                {/* Analytics */}
                {accountAnalytics && accountAnalytics.analytics && (
                    <div className="analytics-section">
                        <h4>Trading Analytics</h4>
                        <div className="analytics-cards">
                            <div className="analytics-card">
                                <h5>Win Rate</h5>
                                <p>{accountAnalytics.analytics.win_rate?.toFixed(2) || '0.00'}%</p>
                            </div>
                            <div className="analytics-card">
                                <h5>Risk/Reward</h5>
                                <p>{accountAnalytics.analytics.risk_reward_ratio?.toFixed(2) || '0.00'}</p>
                            </div>
                            <div className="analytics-card">
                                <h5>Total Trades</h5>
                                <p>{accountAnalytics.analytics.total_trades || 0}</p>
                            </div>
                            {accountAnalytics.analytics.percentage_to_target !== null && (
                                <div className="analytics-card">
                                    <h5>Progress to Target</h5>
                                    <div className="progress-bar">
                                        <div 
                                            className="progress" 
                                            style={{width: `${Math.min(100, Math.max(0, accountAnalytics.analytics.percentage_to_target))}%`}}
                                        ></div>
                                        <span>{accountAnalytics.analytics.percentage_to_target?.toFixed(1) || '0.0'}%</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
                
                {/* Action buttons */}
                <div className="account-actions">
                    <button className="btn-add-trade">
                        <Plus size={16} /> Add Trade
                    </button>
                    <button className="btn-add-day">
                        <Plus size={16} /> Add Trading Day
                    </button>
                    <button className="btn-add-note">
                        <Mic size={16} /> Add Voice Note
                    </button>
                </div>
            </div>
        );
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
                    <div className="prop-firm-management-container">
                        {view === 'dashboard' && renderDashboard()}
                        {view === 'createAccount' && renderCreateAccountForm()}
                        {view === 'accountDetail' && renderAccountDetail()}
                    </div>
                </div>
            </div>
            
            {/* CSS styles */}
            <style jsx>{`
                .prop-firm-management-container {
                    padding: 20px;
                    background-color: #f9f9f9;
                    border-radius: 8px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }
                
                /* Dashboard styles */
                .metrics-summary {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 15px;
                    margin-bottom: 25px;
                }
                
                .metric-card {
                    background: white;
                    padding: 15px;
                    border-radius: 8px;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                    text-align: center;
                }
                
                .metric-value {
                    font-size: 24px;
                    font-weight: bold;
                    margin-top: 5px;
                    color: #3a3a3a;
                }
                
                .accounts-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 15px;
                }
                
                .btn-add {
                    display: flex;
                    align-items: center;
                    gap: 5px;
                    background-color: #4caf50;
                    color: white;
                    border: none;
                    padding: 8px 15px;
                    border-radius: 4px;
                    cursor: pointer;
                    font-weight: 500;
                }
                
                .accounts-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                    gap: 20px;
                }
                
                .account-card {
                    background: white;
                    border-radius: 8px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    padding: 15px;
                    display: flex;
                    flex-direction: column;
                    cursor: pointer;
                    transition: transform 0.2s, box-shadow 0.2s;
                }
                
                .account-card:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 4px 8px rgba(0,0,0,0.15);
                }
                
                .account-logo {
                    width: 50px;
                    height: 50px;
                    border-radius: 25px;
                    background-color: #e0e0e0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 24px;
                    font-weight: bold;
                    margin-bottom: 10px;
                    overflow: hidden;
                }
                
                .account-logo img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
                
                .no-logo {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background-color: #3f51b5;
                    color: white;
                }
                
                .account-info h4 {
                    margin-top: 0;
                    margin-bottom: 5px;
                }
                
                .firm-name {
                    color: #666;
                    margin: 0 0 5px 0;
                }
                
                .account-type {
                    font-size: 14px;
                    color: #555;
                    margin: 0 0 10px 0;
                }
                
                .account-status {
                    display: flex;
                    align-items: center;
                    gap: 5px;
                    margin-bottom: 15px;
                }
                
                .status-indicator {
                    width: 10px;
                    height: 10px;
                    border-radius: 50%;
                }
                
                .status-indicator.in_progress {
                    background-color: #2196f3;
                }
                
                .status-indicator.passed {
                    background-color: #4caf50;
                }
                
                .status-indicator.failed {
                    background-color: #f44336;
                }
                
                .status-indicator.live {
                    background-color: #9c27b0;
                }
                
                .account-metrics {
                    margin-top: auto;
                }
                
                .balance-info {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 10px;
                }
                
                .balance-info p {
                    margin: 0;
                    font-weight: 500;
                }
                
                .progress-bar {
                    height: 8px;
                    background-color: #e0e0e0;
                    border-radius: 4px;
                    margin-bottom: 5px;
                    position: relative;
                }
                
                .progress {
                    height: 100%;
                    background-color: #4caf50;
                    border-radius: 4px;
                }
                
                .progress-bar span {
                    font-size: 12px;
                    color: #555;
                }
                
                .days-remaining {
                    font-size: 12px;
                    color: #ff9800;
                    margin: 5px 0;
                }
                
                .warning-indicator {
                    display: flex;
                    align-items: center;
                    gap: 5px;
                    margin-top: 10px;
                    padding: 5px;
                    background-color: rgba(255, 152, 0, 0.1);
                    border-radius: 4px;
                }
                
                .warning-indicator span {
                    font-size: 12px;
                    color: #ff9800;
                }
                
                /* Form styles */
                .create-account-form {
                    max-width: 600px;
                    margin: 0 auto;
                    background: white;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }
                
                .form-group {
                    margin-bottom: 15px;
                }
                
                .form-group label {
                    display: block;
                    margin-bottom: 5px;
                    font-weight: 500;
                }
                
                .form-group input,
                .form-group select {
                    width: 100%;
                    padding: 8px;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    font-size: 14px;
                }
                
                .form-actions {
                    display: flex;
                    justify-content: flex-end;
                    gap: 10px;
                    margin-top: 20px;
                }
                
                .btn-cancel {
                    background-color: #f5f5f5;
                    border: 1px solid #ddd;
                    color: #333;
                    padding: 8px 15px;
                    border-radius: 4px;
                    cursor: pointer;
                }
                
                .btn-create {
                    background-color: #2196f3;
                    color: white;
                    border: none;
                    padding: 8px 15px;
                    border-radius: 4px;
                    cursor: pointer;
                }
                
                /* Account detail styles */
                .account-header {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    margin-bottom: 20px;
                }
                
                .btn-back {
                    background: none;
                    border: none;
                    color: #2196f3;
                    cursor: pointer;
                    padding: 0;
                }
                
                .account-summary {
                    display: flex;
                    background: white;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    margin-bottom: 20px;
                }
                
                .account-summary-left {
                    flex: 1;
                }
                
                .account-summary-right {
                    flex: 2;
                }
                
                .prop-firm-info {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    margin-bottom: 15px;
                }
                
                .prop-firm-info img,
                .prop-firm-info .no-logo {
                    width: 40px;
                    height: 40px;
                    border-radius: 20px;
                }
                
                .account-type-info p {
                    margin: 5px 0;
                }
                
                .balance-info {
                    display: flex;
                    gap: 15px;
                    margin-bottom: 15px;
                }
                
                .balance-card {
                    background-color: #f5f5f5;
                    padding: 10px;
                    border-radius: 4px;
                    flex: 1;
                }
                
                .balance-card h5 {
                    margin: 0 0 5px 0;
                    font-size: 14px;
                    color: #555;
                }
                
                .balance-value {
                    margin: 0;
                    font-size: 18px;
                    font-weight: bold;
                }
                
                .balance-value.positive {
                    color: #4caf50;
                }
                
                .balance-value.negative {
                    color: #f44336;
                }
                
                .limits-info {
                    background-color: #f5f5f5;
                    padding: 10px;
                    border-radius: 4px;
                }
                
                .limit-item {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 5px;
                }
                
                .performance-chart {
                    background: white;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    margin-bottom: 20px;
                }
                
                .chart-container {
                    height: 250px;
                    margin-top: 15px;
                }
                
                .analytics-section {
                    background: white;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    margin-bottom: 20px;
                }
                
                .analytics-cards {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 15px;
                    margin-top: 15px;
                }
                
                .analytics-card {
                    background-color: #f5f5f5;
                    padding: 15px;
                    border-radius: 4px;
                    text-align: center;
                }
                
                .analytics-card h5 {
                    margin: 0 0 10px 0;
                    font-size: 14px;
                    color: #555;
                }
                
                .analytics-card p {
                    margin: 0;
                    font-size: 20px;
                    font-weight: bold;
                }
                
                .breakdown-section {
                    display: flex;
                    gap: 20px;
                    margin-bottom: 20px;
                }
                
                .strategy-breakdown,
                .asset-breakdown {
                    flex: 1;
                    background: white;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }
                
                .breakdown-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 15px;
                }
                
                .breakdown-table th,
                .breakdown-table td {
                    padding: 8px;
                    text-align: left;
                    border-bottom: 1px solid #ddd;
                }
                
                .account-actions {
                    display: flex;
                    gap: 10px;
                    justify-content: flex-end;
                }
                
                .btn-add-trade,
                .btn-add-day,
                .btn-add-note {
                    display: flex;
                    align-items: center;
                    gap: 5px;
                    padding: 8px 15px;
                    border-radius: 4px;
                    cursor: pointer;
                    font-weight: 500;
                }
                
                .btn-add-trade {
                    background-color: #2196f3;
                    color: white;
                    border: none;
                }
                
                .btn-add-day {
                    background-color: #4caf50;
                    color: white;
                    border: none;
                }
                
                .btn-add-note {
                    background-color: #ff9800;
                    color: white;
                    border: none;
                }
                
                .error-message {
                    background-color: #ffebee;
                    color: #f44336;
                    padding: 10px;
                    border-radius: 4px;
                    margin-bottom: 15px;
                }
                
                .loading {
                    text-align: center;
                    padding: 40px;
                    font-size: 16px;
                    color: #666;
                }
                
                .error {
                    background-color: #ffebee;
                    color: #f44336;
                    padding: 15px;
                    border-radius: 8px;
                    margin: 20px 0;
                }
                
                .no-accounts {
                    background-color: #e8f5e9;
                    padding: 30px;
                    border-radius: 8px;
                    text-align: center;
                    margin: 20px 0;
                }
                
                /* Responsive adjustments */
                @media (max-width: 768px) {
                    .metrics-summary,
                    .analytics-cards {
                        grid-template-columns: repeat(2, 1fr);
                    }
                    
                    .account-summary {
                        flex-direction: column;
                    }
                    
                    .account-summary-left {
                        margin-bottom: 20px;
                    }
                    
                    .breakdown-section {
                        flex-direction: column;
                    }
                    
                    .strategy-breakdown {
                        margin-bottom: 20px;
                    }
                }
                
                @media (max-width: 480px) {
                    .metrics-summary,
                    .analytics-cards {
                        grid-template-columns: 1fr;
                    }
                    
                    .account-actions {
                        flex-direction: column;
                        gap: 10px;
                    }
                    
                    .btn-add-trade,
                    .btn-add-day,
                    .btn-add-note {
                        width: 100%;
                        justify-content: center;
                    }
                }
                
                /* Custom styles for different account statuses */
                .account-card.in_progress {
                    border-left: 4px solid #2196f3;
                }
                
                .account-card.passed {
                    border-left: 4px solid #4caf50;
                }
                
                .account-card.failed {
                    border-left: 4px solid #f44336;
                }
                
                .account-card.live {
                    border-left: 4px solid #9c27b0;
                }
                
                /* Animations for better UX */
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                
                .prop-firm-management-container {
                    animation: fadeIn 0.3s ease-in-out;
                }
                
                .account-card {
                    animation: fadeIn 0.3s ease-in-out;
                }
                
                /* Fix for the prop firm logo rendering */
                .account-logo {
                    background-size: cover;
                    background-position: center;
                }
                
                /* Tooltip styles for better information display */
                .tooltip {
                    position: relative;
                    display: inline-block;
                }
                
                .tooltip .tooltip-text {
                    visibility: hidden;
                    width: 120px;
                    background-color: #333;
                    color: #fff;
                    text-align: center;
                    border-radius: 6px;
                    padding: 5px;
                    position: absolute;
                    z-index: 1;
                    bottom: 125%;
                    left: 50%;
                    margin-left: -60px;
                    opacity: 0;
                    transition: opacity 0.3s;
                }
                
                .tooltip:hover .tooltip-text {
                    visibility: visible;
                    opacity: 1;
                }
                
                /* Improved form input focus states */
                .form-group input:focus,
                .form-group select:focus {
                    outline: none;
                    border-color: #2196f3;
                    box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.2);
                }
                
                /* Empty state styling */
                .empty-state {
                    text-align: center;
                    padding: 40px 20px;
                    background-color: #f5f5f5;
                    border-radius: 8px;
                }
                
                .empty-state-icon {
                    font-size: 48px;
                    color: #bdbdbd;
                    margin-bottom: 15px;
                }
                
                .empty-state-text {
                    color: #757575;
                    margin-bottom: 20px;
                }
                
                /* Loading state for actions */
                .btn-loading {
                    position: relative;
                    pointer-events: none;
                    color: transparent !important;
                }
                
                .btn-loading:after {
                    content: '';
                    position: absolute;
                    width: 16px;
                    height: 16px;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    margin: auto;
                    border: 2px solid transparent;
                    border-top-color: white;
                    border-radius: 50%;
                    animation: button-loading-spinner 1s ease infinite;
                }
                
                @keyframes button-loading-spinner {
                    from { transform: rotate(0turn); }
                    to { transform: rotate(1turn); }
                }
                
                /* Card hover effects */
                .account-card:hover {
                    box-shadow: 0 8px 16px rgba(0,0,0,0.1);
                }
                
                /* Button hover states */
                .btn-add:hover,
                .btn-create:hover,
                .btn-add-trade:hover,
                .btn-add-day:hover,
                .btn-add-note:hover {
                    filter: brightness(1.1);
                }
                
                .btn-cancel:hover {
                    background-color: #e0e0e0;
                }
                
                /* Fix for account-logo issue */
                .account-info {
                    flex: 1;
                }
            `}</style>
        </div>
    );
}