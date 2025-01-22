import React, { useEffect, useState } from "react";
import Header from "./header";
import SideNavs from "./side_navs";
import AssetsTraded from "./assets";
import Cookies from 'js-cookie';
import { useFetcher, useNavigate } from "react-router-dom";
import {v4 as uuidv4} from 'uuid';
import axios from "axios";
import useForceUpdate from 'use-force-update';



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
    const [assets, setAssets] = useState("");  // Add this state for assets

    // State for the search query
    const [searchQuery, setSearchQuery] = useState("");

    // Filter accounts based on the search query
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
                // console.log(data);
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
    // setModalClosed(!modalClosed);
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
            main_assets: assetArray.join(", "),  // Convert array to a string
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
                    // You might need to include an authentication header if your API requires it
                },
                body: JSON.stringify(requestData),
            });
            if (response.status === 200) {
                // Navigate to the next page or show a success message
                navigate(`/conversation/${uniqueID}`);
            } else {
                console.error("Data save failed.");
            }
        } catch (error) {
            console.error("Error while saving data:", error);
        }
        
        // Perform form submission logic

    };

    useEffect(() => {
        fetchUserData();
    }, [modalClosed]);

    useEffect(() => {
        fetchUserData();
        const acc_name = fetchAccountDataFromAPI(); 
        console.log("Account Name is", acc_name);

    }, []);

    // Fetch accounts from backend
    async function fetchAccounts() {
        try {
            const response = await fetch(`${baseURL}/accounts/`);
            const data = await response.json();
            setAccounts(data);
            // console.log('Accounts data is:', data);
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
            main_assets: assets.trim(),  // Include assets
        };
    
        try {
            const response = await fetch(`${baseURL}/create_account/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newAccount),
            });
    
            if (response.ok) {
                setAccountName(""); // Reset input fields
                setAccountBalance(0);
                setAssets(""); // Clear the assets input
                fetchAccounts(); // Refresh account list
            } else {
                alert("Error adding account.");
            }
        } catch (error) {
            console.error("Error adding account:", error);
        }
    };
    
    // Delete an account
const handleDeleteAccount = async (accountId) => {
    // Display a confirmation alert
    const confirmDelete = window.confirm("Are you sure you want to delete this account? This action cannot be undone.");

    if (confirmDelete) {
        try {
            const response = await fetch(`${baseURL}/delete_account/${accountId}/`, {
                method: "DELETE",
            });
            if (response.ok) {
                fetchAccounts(); // Refresh account list
            } else {
                alert("Error deleting account.");
            }
        } catch (error) {
            console.error("Error deleting account:", error);
        }
    } else {
        // If the user cancels, do nothing
        console.log("Account deletion canceled.");
    }
    };


    // Load accounts on component mount
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
                id: editingAccount.id,  // Include the ID of the account you're updating
                name: editingName,
                initial_capital: editingBalance,
                main_assets: editingAssets,  // Include the updated main_assets
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
    
            // Update the accounts list with the updated account
            setAccounts(accounts.map((acc) =>
                acc.id === updatedAccount.id ? updatedAccount : acc
            ));
    
            // Reset the form and editing state
            setEditingAccount(null);
            setEditingName("");
            setEditingBalance("");
            setEditingAssets(""); // Reset assets field after updating
        } catch (error) {
            console.error("Error updating account:", error);
        }
    };

    //  Cookies.set('email', email);
    const handleUpdateSelectedAccount = async (account_name) => {
        Cookies.set('account_name', account_name);
    }


    return (
        <div>
            <div className="header">
                <Header />
            </div>
                <SideNavs/>
                {/* <iframe src="https://opexams.com/quiz/OM_u2kWH9jU" className="quiz-view"></iframe> */}

            <div className="main-page-body">
                
            <h4 className="personal-info-title"><i className="bi bi-person-circle personal-info-icon">Personal Information</i></h4><br />


                 {/* New Account Section */}
            <div className="new-account-section">
                <h3>Manage Accounts</h3>
                <div>
                    <label>Account Name:</label>
                    <input
                        type="text"
                        value={accountName}
                        onChange={(e) => setAccountName(e.target.value)}
                        placeholder="Enter account name"
                        className="form-control"
                    />
                </div>
                <div>
                    <label>Initial Capital:</label>
                    <input
                        type="number"
                        value={accountBalance}
                        onChange={(e) => setAccountBalance(e.target.value)}
                        placeholder="Enter initial balance"
                        className="form-control"
                    />
                </div>
                <div>
                    <label>Main Assets:</label>
                    <input
                        type="text"
                        value={assets}
                        onChange={(e) => setAssets(e.target.value)}  // Update assets state
                        placeholder="Enter assets (comma separated)"
                        className="form-control"
                    />
                </div>
                <button className="btn btn-primary" onClick={handleAddAccount}>
                    Add Account
                </button>
            </div>

            {/* Account List */}
            <div className="account-list">
            <h4>Existing Accounts</h4>

            {/* Search Bar */}
            <input
                type="text"
                className="search-bar form-control"
                placeholder="Search accounts by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)} // Update the search query state
            />
            <br />
            <ul>
                {filteredAccounts.map((account) => (
                    <li key={account.id} className="account-item">
                        <div className="account-details">
                            <span className="account-name">{account.name}</span> 
                            <span className="account-balance">(${account.initial_capital})</span>
                        </div>

                        <div className="account-assets">
                            {account.main_assets && account.main_assets.length > 0 ? (
                                Array.isArray(account.main_assets) ? (
                                    <ul>
                                        {account.main_assets.map((asset, index) => (
                                            <li key={index} className="asset-item">{asset.trim()}</li>
                                        ))}
                                    </ul>
                                ) : (
                                    <ul>
                                        {account.main_assets.split(",").map((asset, index) => (
                                            <li key={index} className="asset-item">{asset.trim()}</li>
                                        ))}
                                    </ul>
                                )
                            ) : (
                                <span>No assets added</span>
                            )}
                        </div>

                        <div className="account-actions">
                            <button
                                className="btn btn-warning"
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
                            </button><br /><br />

                            <button
                                className="btn btn-danger"
                                onClick={() => handleDeleteAccount(account.id)}
                            >
                                Delete
                            </button><br /><br />

                            <button
                                className="btn btn-danger"
                                onClick={() => handleUpdateSelectedAccount(account.name)}
                            >
                                Select Account
                            </button>
                        </div>
                    </li>
                ))}
            </ul>

            {/* Display a message if no accounts match the search query */}
            {filteredAccounts.length === 0 && (
                <p>No accounts match your search query.</p>
            )}
        </div>



                {/* Edit Account Section */}
                {editingAccount && (
                    <div className="edit-account-section">
                        <h4>Edit Account</h4>
                        
                        {/* Account Name */}
                        <div>
                            <label>Account Name:</label>
                            <input
                                type="text"
                                value={editingName}
                                onChange={(e) => setEditingName(e.target.value)}
                                className="form-control"
                            />
                        </div>
                        
                        {/* Initial Capital */}
                        <div>
                            <label>Initial Capital:</label>
                            <input
                                type="number"
                                value={editingBalance}
                                onChange={(e) => setEditingBalance(e.target.value)}
                                className="form-control"
                            />
                        </div>
                        
                        {/* Main Assets (Comma-separated) */}
                        <div>
                            <label>Main Assets (comma-separated):</label>
                            <input
                                type="text"
                                value={editingAssets}
                                onChange={(e) => setEditingAssets(e.target.value)}
                                className="form-control"
                                placeholder="Enter assets, e.g., EURUSD, GBPUSD, Gold"
                            />
                        </div>

                        {/* Buttons to Save or Cancel */}
                        <div>
                            <button className="btn btn-success" onClick={handleUpdateAccount}>
                                Save Changes
                            </button>
                            <button className="btn btn-secondary" onClick={() => setEditingAccount(null)}>
                                Cancel
                            </button>
                        </div>
                    </div>
                )}



            </div>
        </div>
    )
}

