import React, { useEffect, useState } from "react";
import Header from "./header";
import SideNavs from "./side_navs";
import AssetsTraded from "./assets";
import Cookies from 'js-cookie';
import { useFetcher, useNavigate } from "react-router-dom";
import {v4 as uuidv4} from 'uuid';
import axios from "axios";
import useForceUpdate from 'use-force-update';

const styles = {
    mainPageBody: {
        padding: '30px',
        backgroundColor: '#f8f9fa',
        minHeight: '100vh',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    },
    personalInfoTitle: {
        color: '#1e3a8a',
        fontSize: '28px',
        fontWeight: '600',
        marginBottom: '30px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
    },
    personalInfoIcon: {
        fontSize: '32px',
        color: '#3b82f6'
    },
    newAccountSection: {
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        marginBottom: '30px',
        border: '1px solid #e5e7eb'
    },
    sectionTitle: {
        color: '#1e3a8a',
        fontSize: '22px',
        fontWeight: '600',
        marginBottom: '25px',
        borderBottom: '2px solid #3b82f6',
        paddingBottom: '10px'
    },
    formGroup: {
        marginBottom: '20px'
    },
    label: {
        display: 'block',
        color: '#374151',
        fontWeight: '500',
        marginBottom: '8px',
        fontSize: '14px'
    },
    input: {
        width: '100%',
        padding: '12px 16px',
        border: '2px solid #e5e7eb',
        borderRadius: '8px',
        fontSize: '14px',
        transition: 'all 0.3s ease',
        outline: 'none',
        backgroundColor: 'white'
    },
    inputFocus: {
        borderColor: '#3b82f6',
        boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)'
    },
    btnPrimary: {
        backgroundColor: '#3b82f6',
        color: 'white',
        padding: '12px 24px',
        border: 'none',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '500',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        marginTop: '10px'
    },
    btnPrimaryHover: {
        backgroundColor: '#2563eb',
        transform: 'translateY(-1px)',
        boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
    },
    btnSuccess: {
        backgroundColor: '#10b981',
        color: 'white',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '500',
        cursor: 'pointer',
        marginRight: '10px',
        transition: 'all 0.3s ease'
    },
    btnDanger: {
        backgroundColor: '#ef4444',
        color: 'white',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '500',
        cursor: 'pointer',
        transition: 'all 0.3s ease'
    },
    btnSecondary: {
        backgroundColor: 'white',
        color: '#3b82f6',
        padding: '10px 20px',
        border: '2px solid #3b82f6',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '500',
        cursor: 'pointer',
        marginRight: '10px',
        transition: 'all 0.3s ease'
    },
    accountList: {
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        marginBottom: '30px',
        border: '1px solid #e5e7eb'
    },
    searchBar: {
        width: '100%',
        padding: '12px 16px',
        border: '2px solid #e5e7eb',
        borderRadius: '8px',
        fontSize: '14px',
        marginBottom: '20px',
        outline: 'none',
        transition: 'all 0.3s ease'
    },
    accountItem: {
        backgroundColor: '#f9fafb',
        padding: '20px',
        borderRadius: '10px',
        marginBottom: '15px',
        border: '2px solid #e5e7eb',
        transition: 'all 0.3s ease',
        listStyle: 'none'
    },
    accountItemHover: {
        borderColor: '#3b82f6',
        boxShadow: '0 4px 12px rgba(59, 130, 246, 0.15)'
    },
    accountDetails: {
        marginBottom: '15px'
    },
    accountName: {
        fontSize: '18px',
        fontWeight: '600',
        color: '#1e3a8a',
        marginRight: '10px'
    },
    accountBalance: {
        fontSize: '16px',
        color: '#6b7280',
        fontWeight: '500'
    },
    accountAssets: {
        marginTop: '12px',
        marginBottom: '15px'
    },
    assetList: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px',
        padding: '0',
        margin: '0'
    },
    assetItem: {
        backgroundColor: '#dbeafe',
        color: '#1e40af',
        padding: '6px 14px',
        borderRadius: '20px',
        fontSize: '13px',
        fontWeight: '500',
        listStyle: 'none',
        display: 'inline-block'
    },
    accountActions: {
        display: 'flex',
        gap: '10px',
        flexWrap: 'wrap',
        marginTop: '15px'
    },
    editAccountSection: {
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        marginBottom: '30px',
        border: '2px solid #3b82f6'
    },
    noResults: {
        textAlign: 'center',
        color: '#6b7280',
        padding: '40px',
        fontSize: '16px'
    },
    buttonGroup: {
        display: 'flex',
        gap: '10px',
        marginTop: '20px'
    }
};

export default function ModifyPersonalInfo({ ModalOpen }) {
    const fetchEmailDataFromAPI = () => {
        return Cookies.get('email');
    };

    const [tradingExperience, setTradingExperience] = useState("");
    const [selectedAssets, setSelectedAssets] = useState([]);
    let [assetArray, setAssetArray] = useState([]);
    const [tellUsMore, setTellUsMore] = useState([]);
    let [tradingExp, setTradingExp] = useState("")
    let [initialCap, setInitialCap] = useState(0);
    let [goals, setGoals] = useState("");
    let [benefits, setBenefits] = useState("");
    let [finalData, setFinalData] = useState([]);
    const navigate = useNavigate();
    const uniqueID = uuidv4();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currencyModal, setCurrencyModal] = useState(false);
    const [modalClosed, setModalClosed] = useState(false);
    const forceUpdate = useForceUpdate();

    const [accounts, setAccounts] = useState([]);
    const [accountName, setAccountName] = useState("");
    const [accountBalance, setAccountBalance] = useState("");
    const [editingAccount, setEditingAccount] = useState(null);
    const [editingName, setEditingName] = useState("");
    const [editingBalance, setEditingBalance] = useState("");
    const [editingAssets,setEditingAssets] = useState("");
    const [assets, setAssets] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [hoveredAccount, setHoveredAccount] = useState(null);

    const filteredAccounts = accounts.filter((account) =>
        account.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const baseURL = 'https://backend-production-c0ab.up.railway.app';

    const fetchAccountDataFromAPI = () => {
        return Cookies.get('account_name');
    };

    async function fetchUserData() {
        try {
            const email = fetchEmailDataFromAPI(); 
            const response = await fetch(`${baseURL}/get_user_data/${email}/`);
            const data = await response.json();
            setTellUsMore(data);
            setTradingExp(data.trading_experience);
            const mainAssets = data.main_assets.split(',').map(asset => asset.trim());
            setAssetArray(mainAssets);
            setInitialCap(data.initial_capital);
            setGoals(data.trading_goals);
            setBenefits(data.benefits);
        } catch (error) {
            console.error('Error fetching journals:', error);
        };
    }

    const handleTradingExperienceChange = (event) => {
        setTradingExp(event.target.value);
    };

    const handleAssetSelect = (e) => {
        const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);
        setSelectedAssets(selectedOptions);
        const index = assetArray.includes(selectedOptions[0]);

        if (index) {
            // do nothing
        } else {
            assetArray.push(selectedOptions[0]);
        }   
    }

    const handleRemoveAsset = (assetToRemove) => {
        const updatedAssets = assetArray.filter((asset) => asset !== assetToRemove);
        setAssetArray(updatedAssets);
    };

    const handleInitialCapitalChange = (event) => {
        setInitialCap(event.target.value);
    };

    const handleTradingGoalsChange = (event) => {
        setGoals(event.target.value);
    };

    const handleExpectedBenefitsChange = (event) => {
        setBenefits(event.target.value);
    };

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    const toggleCurrenyModal = () => {
        setCurrencyModal(!currencyModal);
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        if (tradingExp === "") {
            alert('Please select your trading experience.');
            return;
        }
        if (assetArray.length < 1) {
            alert('Please select main assets.')
            return;
        }
        if (initialCap === '') {
            alert('Please enter an initial trading capital');
            return;
        }
        if (goals.trim() === "") {
            alert("Please enter your trading goals.");
            return;
        }
        if (benefits.trim() === "") {
            alert("Please enter your expected benefits.");
            return;
        }
        
        const requestData = {
            trading_experience: tradingExp,
            main_assets: assetArray.join(", "),
            initial_capital: parseFloat(initialCap),
            trading_goals: goals,
            benefits: benefits,
            user_email: fetchEmailDataFromAPI(),
        };
        
        setFinalData([tradingExp, [assetArray], initialCap, goals, benefits]);
        let email = fetchEmailDataFromAPI();

        try {
            const response = await fetch(`${baseURL}/update_user_data/${email}/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestData),
            });
            if (response.status === 200) {
                navigate(`/conversation/${uniqueID}`);
            } else {
                console.error("Data save failed.");
            }
        } catch (error) {
            console.error("Error while saving data:", error);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, [modalClosed]);

    useEffect(() => {
        fetchUserData();
        const acc_name = fetchAccountDataFromAPI(); 
        console.log("Account Name is", acc_name);
    }, []);

    async function fetchAccounts() {
        try {
            const response = await fetch(`${baseURL}/accounts/`);
            const data = await response.json();
            setAccounts(data);
        } catch (error) {
            console.error("Error fetching accounts:", error);
        }
    }

    const handleAddAccount = async () => {
        if (!accountName.trim() || accountBalance <= 0 || !assets.trim()) {
            alert("Please enter a valid account name, balance, and assets.");
            return;
        }
    
        const newAccount = {
            name: accountName,
            initial_capital: parseFloat(accountBalance),
            main_assets: assets.trim(),
        };
    
        try {
            const response = await fetch(`${baseURL}/create_account/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newAccount),
            });
    
            if (response.ok) {
                setAccountName("");
                setAccountBalance(0);
                setAssets("");
                fetchAccounts();
            } else {
                alert("Error adding account.");
            }
        } catch (error) {
            console.error("Error adding account:", error);
        }
    };
    
    const handleDeleteAccount = async (accountId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this account? This action cannot be undone.");

        if (confirmDelete) {
            try {
                const response = await fetch(`${baseURL}/delete_account/${accountId}/`, {
                    method: "DELETE",
                });
                if (response.ok) {
                    fetchAccounts();
                } else {
                    alert("Error deleting account.");
                }
            } catch (error) {
                console.error("Error deleting account:", error);
            }
        } else {
            console.log("Account deletion canceled.");
        }
    };

    useEffect(() => {
        fetchAccounts();
    }, []);

    const handleUpdateAccount = async () => {
        console.log("Handle Update Account Function triggered.");
        if (!editingAccount) {
            console.error("No account selected for editing.");
            return;
        }
    
        try {
            const updatedAccountData = {
                id: editingAccount.id,
                name: editingName,
                initial_capital: editingBalance,
                main_assets: editingAssets,
            };
    
            const response = await fetch(`${baseURL}/accounts/update/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedAccountData),
            });
    
            if (!response.ok) {
                throw new Error("Failed to update the account.");
            }
    
            const updatedAccount = await response.json();
    
            setAccounts(accounts.map((acc) =>
                acc.id === updatedAccount.id ? updatedAccount : acc
            ));
    
            setEditingAccount(null);
            setEditingName("");
            setEditingBalance("");
            setEditingAssets("");
        } catch (error) {
            console.error("Error updating account:", error);
        }
    };

    const handleUpdateSelectedAccount = async (account_name) => {
        Cookies.set('account_name', account_name);
    }

    return (
        <div>
            <div className="header">
                <Header />
            </div>
            <SideNavs/>

            <div style={styles.mainPageBody}>
                <h4 style={styles.personalInfoTitle}>
                    <i className="bi bi-person-circle" style={styles.personalInfoIcon}></i>
                    Personal Information
                </h4>

                <div style={styles.newAccountSection}>
                    <h3 style={styles.sectionTitle}>Manage Accounts</h3>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Account Name:</label>
                        <input
                            type="text"
                            value={accountName}
                            onChange={(e) => setAccountName(e.target.value)}
                            placeholder="Enter account name"
                            style={styles.input}
                        />
                    </div>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Initial Capital:</label>
                        <input
                            type="number"
                            value={accountBalance}
                            onChange={(e) => setAccountBalance(e.target.value)}
                            placeholder="Enter initial balance"
                            style={styles.input}
                        />
                    </div>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Main Assets:</label>
                        <input
                            type="text"
                            value={assets}
                            onChange={(e) => setAssets(e.target.value)}
                            placeholder="Enter assets (comma separated)"
                            style={styles.input}
                        />
                    </div>
                    <button style={styles.btnPrimary} onClick={handleAddAccount}>
                        Add Account
                    </button>
                </div>

                <div style={styles.accountList}>
                    <h4 style={styles.sectionTitle}>Existing Accounts</h4>

                    <input
                        type="text"
                        style={styles.searchBar}
                        placeholder="Search accounts by name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />

                    <ul style={{ padding: 0 }}>
                        {filteredAccounts.map((account) => (
                            <li 
                                key={account.id} 
                                style={{
                                    ...styles.accountItem,
                                    ...(hoveredAccount === account.id ? styles.accountItemHover : {})
                                }}
                                onMouseEnter={() => setHoveredAccount(account.id)}
                                onMouseLeave={() => setHoveredAccount(null)}
                            >
                                <div style={styles.accountDetails}>
                                    <span style={styles.accountName}>{account.name}</span> 
                                    <span style={styles.accountBalance}>(${account.initial_capital})</span>
                                </div>

                                <div style={styles.accountAssets}>
                                    {account.main_assets && account.main_assets.length > 0 ? (
                                        Array.isArray(account.main_assets) ? (
                                            <div style={styles.assetList}>
                                                {account.main_assets.map((asset, index) => (
                                                    <span key={index} style={styles.assetItem}>{asset.trim()}</span>
                                                ))}
                                            </div>
                                        ) : (
                                            <div style={styles.assetList}>
                                                {account.main_assets.split(",").map((asset, index) => (
                                                    <span key={index} style={styles.assetItem}>{asset.trim()}</span>
                                                ))}
                                            </div>
                                        )
                                    ) : (
                                        <span style={{ color: '#9ca3af' }}>No assets added</span>
                                    )}
                                </div>

                                <div style={styles.accountActions}>
                                    <button
                                        style={styles.btnSecondary}
                                        onClick={() => {
                                            setEditingAccount(account);
                                            setEditingName(account.name);
                                            setEditingBalance(account.initial_capital);

                                            if (Array.isArray(account.main_assets)) {
                                                setEditingAssets(account.main_assets.join(", "));
                                            } else if (typeof account.main_assets === "string") {
                                                setEditingAssets(account.main_assets);
                                            } else {
                                                setEditingAssets("");
                                            }
                                        }}
                                    >
                                        Edit
                                    </button>

                                    <button
                                        style={styles.btnDanger}
                                        onClick={() => handleDeleteAccount(account.id)}
                                    >
                                        Delete
                                    </button>

                                    <button
                                        style={styles.btnPrimary}
                                        onClick={() => handleUpdateSelectedAccount(account.name)}
                                    >
                                        Select Account
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>

                    {filteredAccounts.length === 0 && (
                        <p style={styles.noResults}>No accounts match your search query.</p>
                    )}
                </div>

                {editingAccount && (
                    <div style={styles.editAccountSection}>
                        <h4 style={styles.sectionTitle}>Edit Account</h4>
                        
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Account Name:</label>
                            <input
                                type="text"
                                value={editingName}
                                onChange={(e) => setEditingName(e.target.value)}
                                style={styles.input}
                            />
                        </div>
                        
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Initial Capital:</label>
                            <input
                                type="number"
                                value={editingBalance}
                                onChange={(e) => setEditingBalance(e.target.value)}
                                style={styles.input}
                            />
                        </div>
                        
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Main Assets (comma-separated):</label>
                            <input
                                type="text"
                                value={editingAssets}
                                onChange={(e) => setEditingAssets(e.target.value)}
                                style={styles.input}
                                placeholder="Enter assets, e.g., EURUSD, GBPUSD, Gold"
                            />
                        </div>

                        <div style={styles.buttonGroup}>
                            <button style={styles.btnSuccess} onClick={handleUpdateAccount}>
                                Save Changes
                            </button>
                            <button style={styles.btnDanger} onClick={() => setEditingAccount(null)}>
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}