import React, { useEffect, useState } from "react";
import Header from "./header";
import SideNavs from "./side_navs";
import Cookies from "js-cookie";

const styles = {
    alertsSection: {
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '25px',
        marginBottom: '30px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        border: '1px solid #e5e7eb'
    },
    sectionTitle: {
        color: '#1e40af',
        fontSize: '1.4rem',
        fontWeight: '600',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
    },
    tableContainer: {
        maxHeight: '350px',
        overflowY: 'auto',
        border: '2px solid #e5e7eb',
        borderRadius: '12px',
        backgroundColor: 'white'
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        margin: '0'
    },
    tableHeader: {
        backgroundColor: '#2563eb',
        color: 'white',
        position: 'sticky',
        top: '0',
        zIndex: 10
    },
    tableHeaderCell: {
        padding: '15px 12px',
        textAlign: 'left',
        fontWeight: '600',
        fontSize: '0.9rem',
        borderBottom: 'none'
    },
    tableRow: {
        borderBottom: '1px solid #f3f4f6',
        transition: 'background-color 0.2s ease'
    },
    tableCell: {
        padding: '15px 12px',
        fontSize: '0.9rem',
        color: '#374151'
    },
    badge: {
        padding: '4px 10px',
        borderRadius: '20px',
        fontSize: '0.75rem',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: '0.5px'
    },
        badgeIndividualStock: {
        backgroundColor: '#e0e7ff',
        color: '#4338ca',
        border: '1px solid #a5b4fc'
    },
    badgeCrypto: {
        backgroundColor: '#fef9c3',
        color: '#854d0e',
        border: '1px solid #fde047'
    },

    badgeForex: {
        backgroundColor: '#dbeafe',
        color: '#1e40af',
        border: '1px solid #93c5fd'
    },
    badgeStock: {
        backgroundColor: '#f0f9ff',
        color: '#0369a1',
        border: '1px solid #7dd3fc'
    },
    badgeCommodity: {
        backgroundColor: '#fef3c7',
        color: '#92400e',
        border: '1px solid #fcd34d'
    },
    badgeBond: {
        backgroundColor: '#f3e8ff',
        color: '#6b21a8',
        border: '1px solid #d8b4fe'
    },
    badgeActive: {
        backgroundColor: '#dcfce7',
        color: '#166534',
        border: '1px solid #86efac'
    },
    badgeTriggered: {
        backgroundColor: '#fecaca',
        color: '#991b1b',
        border: '1px solid #fca5a5'
    },
    deleteButton: {
        backgroundColor: '#ef4444',
        color: 'white',
        border: 'none',
        padding: '6px 12px',
        borderRadius: '8px',
        fontSize: '0.8rem',
        fontWeight: '500',
        cursor: 'pointer',
        transition: 'all 0.2s ease'
    },
    card: {
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '25px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        border: '1px solid #e5e7eb',
        marginBottom: '25px'
    },
    cardHeader: {
        borderBottom: '2px solid #f3f4f6',
        paddingBottom: '15px',
        marginBottom: '25px'
    },
    formGroup: {
        marginBottom: '20px'
    },
    label: {
        display: 'block',
        marginBottom: '8px',
        color: '#1e40af',
        fontWeight: '600',
        fontSize: '0.95rem'
    },
    radioGroup: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '15px',
        marginTop: '8px'
    },
    radioItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '10px 15px',
        border: '2px solid #e5e7eb',
        borderRadius: '10px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        backgroundColor: 'white'
    },
    radioItemActive: {
        borderColor: '#2563eb',
        backgroundColor: '#eff6ff'
    },
    radioInput: {
        margin: '0',
        accentColor: '#2563eb'
    },
    radioLabel: {
        margin: '0',
        fontWeight: '500',
        cursor: 'pointer',
        color: '#374151'
    },
    select: {
        width: '100%',
        padding: '12px 15px',
        border: '2px solid #e5e7eb',
        borderRadius: '10px',
        fontSize: '1rem',
        backgroundColor: 'white',
        color: '#374151',
        transition: 'border-color 0.2s ease',
        appearance: 'none',
        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
        backgroundPosition: 'right 12px center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: '16px'
    },
    input: {
        width: '100%',
        padding: '12px 15px',
        border: '2px solid #e5e7eb',
        borderRadius: '10px',
        fontSize: '1rem',
        backgroundColor: 'white',
        color: '#374151',
        transition: 'border-color 0.2s ease'
    },
    addButton: {
        backgroundColor: '#2563eb',
        color: 'white',
        border: 'none',
        padding: '12px 25px',
        borderRadius: '10px',
        fontSize: '1rem',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
    },
    selectedAssetsList: {
        listStyle: 'none',
        padding: '0',
        margin: '0'
    },
    selectedAssetItem: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '15px',
        backgroundColor: '#f8fafc',
        border: '1px solid #e5e7eb',
        borderRadius: '10px',
        marginBottom: '10px'
    },
    selectedAssetInfo: {
        flex: '1'
    },
    selectedAssetMain: {
        fontWeight: '600',
        color: '#1e40af',
        fontSize: '1rem',
        marginBottom: '4px'
    },
    selectedAssetSub: {
        color: '#6b7280',
        fontSize: '0.85rem'
    },
    removeButton: {
        backgroundColor: 'transparent',
        border: 'none',
        padding: '8px',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '1.2rem',
        transition: 'background-color 0.2s ease'
    },
    updateButton: {
        backgroundColor: '#059669',
        color: 'white',
        border: 'none',
        padding: '15px 40px',
        borderRadius: '12px',
        fontSize: '1.1rem',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        minWidth: '200px',
        boxShadow: '0 4px 15px rgba(5, 150, 105, 0.3)'
    },
    updateButtonDisabled: {
        backgroundColor: '#9ca3af',
        cursor: 'not-allowed',
        boxShadow: 'none'
    },
    alert: {
        padding: '15px 20px',
        borderRadius: '10px',
        fontSize: '0.95rem',
        fontWeight: '500',
        marginTop: '20px'
    },
    alertSuccess: {
        backgroundColor: '#dcfce7',
        color: '#166534',
        border: '1px solid #86efac'
    },
    alertDanger: {
        backgroundColor: '#fee2e2',
        color: '#dc2626',
        border: '1px solid #fca5a5'
    },
    alertWarning: {
        backgroundColor: '#fef3c7',
        color: '#92400e',
        border: '1px solid #fcd34d'
    },
    emptyState: {
        textAlign: 'center',
        padding: '40px',
        color: '#6b7280'
    },
    emptyStateIcon: {
        fontSize: '3rem',
        marginBottom: '15px',
        opacity: '0.5'
    },
    statsCards: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
    },
    statsCard: {
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '12px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
        border: '1px solid #e5e7eb',
        textAlign: 'center'
    },
    statsNumber: {
        fontSize: '2rem',
        fontWeight: 'bold',
        color: '#2563eb',
        marginBottom: '5px'
    },
    statsLabel: {
        color: '#6b7280',
        fontSize: '0.9rem',
        fontWeight: '500'
    }
};

export default function AlertBot() {
    const [forexAssets] = useState(['EURUSD', 'GBPUSD', 'USDJPY', 'USDCAD', 'XAUUSD']);
    
    const [stockIndices] = useState([
        'S&P 500', 
        'NASDAQ', 
        'DOW JONES',
        'FTSE 100',      
        'DAX',           
        'CAC 40',        
        'Nikkei 225',    
        'Hang Seng'      
    ]);

    const [stocks] = useState([      // NEW ARRAY
        'AAPL',   // Apple
        'MSFT',   // Microsoft
        'GOOGL',  // Google
        'AMZN',   // Amazon
        'TSLA',   // Tesla
        'META',   // Meta
        'NVDA',   // Nvidia
        'JPM',    // JPMorgan
        'V',      // Visa
        'WMT'     // Walmart
    ]);

    const [cryptos] = useState([
        'BTC-USD',   // Bitcoin
        'ETH-USD',   // Ethereum
        'BNB-USD',   // Binance Coin
        'XRP-USD',   // Ripple
        'ADA-USD',   // Cardano
        'DOGE-USD',  // Dogecoin
        'SOL-USD',   // Solana
        'MATIC-USD'  // Polygon
    ]);

    const [commodities] = useState(['XAUUSD']);
    const [bonds] = useState(['ZB1!', 'US10Y', 'US5Y']);
    const [outcome, setOutcome] = useState("");
    const [outcomeType, setOutcomeType] = useState("");
    const [selectedAssets, setSelectedAssets] = useState([]);
    const [existingAlerts, setExistingAlerts] = useState([]);
    const [assetType, setAssetType] = useState('forex');
    const baseUrl = "https://backend-production-c0ab.up.railway.app";
    const [process, setProcess] = useState('Update Backend');

    useEffect(() => {
        fetchExistingAlerts();
    }, []);

    const fetchEmailDataFromAPI = async () => {
        return Cookies.get("email");
    };

    const fetchExistingAlerts = async () => {
        try {
            const response = await fetch(`${baseUrl}/alert-bot`);
            const data = await response.json();
            if (response.ok) {
                setExistingAlerts(data.alerts);
            } else {
                console.error("Failed to fetch alerts:", data.error);
            }
        } catch (error) {
            console.error("Error fetching alerts:", error);
        }
    };

    const deleteAlert = async (alertId) => {
        const confirmed = window.confirm("Are you sure you want to delete this alert?");
        
        if (!confirmed) return;

        try {
            const response = await fetch(`${baseUrl}/alert-bot?id=${alertId}`, {
                method: "DELETE",
            });
            
            if (response.ok) {
                setOutcome("Alert deleted successfully!");
                setOutcomeType("success");
                fetchExistingAlerts();
            } else {
                const data = await response.json();
                setOutcome("Failed to delete alert: " + data.error);
                setOutcomeType("danger");
            }
        } catch (error) {
            console.error("Error deleting alert:", error);
            setOutcome("Error deleting alert.");
            setOutcomeType("danger");
        }
    };

    const getAvailableAssets = () => {
        switch(assetType) {
            case 'forex':
                return forexAssets;
            case 'stock-index':
                return stockIndices;
            case 'stock':             
                return stocks;
            case 'crypto':             
                return cryptos;
            case 'commodity':
                return commodities;
            case 'bond':
                return bonds;
            default:
                return forexAssets;
        }
    };


    const addAsset = () => {
        const asset = document.getElementById("asset-select").value;
        const price = document.getElementById("price-input").value;
        const condition = document.getElementById("condition-select").value;

        if (!asset || !price || !condition) {
            setOutcome("Please provide all fields for the asset.");
            setOutcomeType("warning");
            return;
        }

        const existingAsset = selectedAssets.find(item => item.asset === asset);
        if (existingAsset) {
            setOutcome("Asset already added to the list.");
            setOutcomeType("warning");
            return;
        }

        setSelectedAssets((prev) => [
            ...prev,
            { asset, price: parseFloat(price), condition },
        ]);
        setOutcome("Asset added successfully!");
        setOutcomeType("success");
        
        document.getElementById("asset-select").value = "";
        document.getElementById("price-input").value = "";
        document.getElementById("condition-select").value = "";
    };

    const removeAsset = (index) => {
        setSelectedAssets((prev) => prev.filter((_, i) => i !== index));
    };

    const updateAssetsInBackend = async () => {
        setProcess('Updating Assets...');
        if (selectedAssets.length === 0) {
            setOutcome("No assets to update.");
            setOutcomeType("warning");
            setProcess('Update Backend');
            return;
        }

        try {
            const response = await fetch(`${baseUrl}/alert-bot`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(selectedAssets),
            });

            const data = await response.json();
            if (response.ok) {
                setOutcome("Alerts updated successfully!");
                setOutcomeType("success");
                setSelectedAssets([]);
                fetchExistingAlerts();
                setProcess('Update Backend');
            } else {
                console.error(data.error);
                setOutcome("Failed to update alerts.");
                setOutcomeType("danger");
                setProcess('Update Backend');
            }
        } catch (error) {
            console.error("Error updating alerts:", error);
            setOutcome("Error updating alerts.");
            setOutcomeType("danger");
            setProcess('Update Backend');
        }
    };

    const getAssetType = (asset) => {
        if (stockIndices.includes(asset)) {
            return 'Stock Index';
        } else if (stocks.includes(asset)) {    // NEW
            return 'Stock';
        } else if (cryptos.includes(asset)) {   // NEW
            return 'Crypto';
        } else if (bonds.includes(asset)) {
            return 'Bond';
        } else if (asset === 'XAUUSD') {
            return 'Commodity';
        } else if (forexAssets.includes(asset)) {
            return 'Forex';
        }
        return 'Unknown';
    };


    const getAssetBadgeStyle = (asset) => {
        const type = getAssetType(asset);
        switch(type) {
            case 'Stock Index':
                return styles.badgeStock;
            case 'Stock':                    // NEW
                return styles.badgeIndividualStock;
            case 'Crypto':                   // NEW
                return styles.badgeCrypto;
            case 'Bond':
                return styles.badgeBond;
            case 'Commodity':
                return styles.badgeCommodity;
            case 'Forex':
            default:
                return styles.badgeForex;
        }
    };


    const activeAlerts = existingAlerts.filter(alert => !alert.checked).length;
    const triggeredAlerts = existingAlerts.filter(alert => alert.checked).length;
    const forexAlerts = existingAlerts.filter(alert => forexAssets.includes(alert.asset) && alert.asset !== 'XAUUSD').length;
    const stockAlerts = existingAlerts.filter(alert => stockIndices.includes(alert.asset)).length;
    const commodityAlerts = existingAlerts.filter(alert => alert.asset === 'XAUUSD').length;
    const bondAlerts = existingAlerts.filter(alert => bonds.includes(alert.asset)).length;
    const individualStockAlerts = existingAlerts.filter(alert => stocks.includes(alert.asset)).length;  // NEW
    const cryptoAlerts = existingAlerts.filter(alert => cryptos.includes(alert.asset)).length;          // NEW


    const getPriceStep = () => {
        switch(assetType) {
            case 'forex':
                return "0.00001";
            case 'stock-index':
            case 'stock':          
                return "0.01";
            case 'crypto':        
                return "0.01";
            case 'commodity':
                return "0.01";
            case 'bond':
                return "0.001";
            default:
                return "0.01";
        }
    };

    const getPricePlaceholder = () => {
        switch(assetType) {
            case 'forex':
                return "e.g., 1.23456";
            case 'stock-index':
                return "e.g., 4500.00";
            case 'stock':           
                return "e.g., 150.00";
            case 'crypto':         
                return "e.g., 45000.00";
            case 'commodity':
                return "e.g., 2000.00";
            case 'bond':
                return "e.g., 4.250";
            default:
                return "Enter price";
        }
    };

    return (
        <div style={styles.container}>
            <div className="header">
                <Header />
            </div>
            <div className="main-page-body">
                <SideNavs />
                <div style={styles.mainContent}>
                    <div style={styles.header}>
                        <h1 style={styles.headerTitle}>📊 Alert Bot</h1>
                        <p style={styles.headerSubtitle}>
                            Set up intelligent price alerts for Forex, Stocks, Commodities & Bonds
                        </p>
                    </div>

                    <div style={styles.statsCards}>
                        <div style={styles.statsCard}>
                            <div style={styles.statsNumber}>{activeAlerts}</div>
                            <div style={styles.statsLabel}>Active Alerts</div>
                        </div>
                        <div style={styles.statsCard}>
                            <div style={styles.statsNumber}>{triggeredAlerts}</div>
                            <div style={styles.statsLabel}>Triggered</div>
                        </div>
                        <div style={styles.statsCard}>
                            <div style={styles.statsNumber}>{forexAlerts}</div>
                            <div style={styles.statsLabel}>Forex</div>
                        </div>
                        <div style={styles.statsCard}>
                            <div style={styles.statsNumber}>{stockAlerts}</div>
                            <div style={styles.statsLabel}>Stock Indices</div>
                        </div>
                        <div style={styles.statsCard}>
                            <div style={styles.statsNumber}>{individualStockAlerts}</div>
                            <div style={styles.statsLabel}>Individual Stocks</div>
                        </div>
                        <div style={styles.statsCard}>
                            <div style={styles.statsNumber}>{cryptoAlerts}</div>
                            <div style={styles.statsLabel}>Cryptocurrencies</div>
                        </div>

                        <div style={styles.statsCard}>
                            <div style={styles.statsNumber}>{commodityAlerts}</div>
                            <div style={styles.statsLabel}>Commodities</div>
                        </div>
                        <div style={styles.statsCard}>
                            <div style={styles.statsNumber}>{bondAlerts}</div>
                            <div style={styles.statsLabel}>Bonds</div>
                        </div>
                    </div>
                    
                    <div style={styles.alertsSection}>
                        <h2 style={styles.sectionTitle}>
                            🔔 Your Alerts
                        </h2>
                        <div style={styles.tableContainer}>
                            <table style={styles.table}>
                                <thead style={styles.tableHeader}>
                                    <tr>
                                        <th style={styles.tableHeaderCell}>Asset</th>
                                        <th style={styles.tableHeaderCell}>Type</th>
                                        <th style={styles.tableHeaderCell}>Condition</th>
                                        <th style={styles.tableHeaderCell}>Price</th>
                                        <th style={styles.tableHeaderCell}>Status</th>
                                        <th style={styles.tableHeaderCell}>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {existingAlerts.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" style={{...styles.tableCell, textAlign: 'center', padding: '40px'}}>
                                                <div style={styles.emptyState}>
                                                    <div style={styles.emptyStateIcon}>📭</div>
                                                    <div>No alerts configured yet</div>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        existingAlerts.map((alert) => (
                                            <tr key={alert.id} style={styles.tableRow}>
                                                <td style={{...styles.tableCell, fontWeight: '600', color: '#1e40af'}}>
                                                    {alert.asset}
                                                </td>
                                                <td style={styles.tableCell}>
                                                    <span 
                                                        style={{
                                                            ...styles.badge,
                                                            ...getAssetBadgeStyle(alert.asset)
                                                        }}
                                                    >
                                                        {getAssetType(alert.asset)}
                                                    </span>
                                                </td>
                                                <td style={{...styles.tableCell, fontWeight: '500'}}>
                                                    {alert.condition === '<' ? '< (Less than)' : '> (Greater than)'}
                                                </td>
                                                <td style={{...styles.tableCell, fontWeight: '600'}}>
                                                    {alert.price}
                                                </td>
                                                <td style={styles.tableCell}>
                                                    <span 
                                                        style={{
                                                            ...styles.badge,
                                                            ...(alert.checked ? styles.badgeTriggered : styles.badgeActive)
                                                        }}
                                                    >
                                                        {alert.checked ? "Triggered" : "Active"}
                                                    </span>
                                                </td>
                                                <td style={styles.tableCell}>
                                                    <button
                                                        style={styles.deleteButton}
                                                        onClick={() => deleteAlert(alert.id)}
                                                        onMouseOver={(e) => e.target.style.backgroundColor = '#dc2626'}
                                                        onMouseOut={(e) => e.target.style.backgroundColor = '#ef4444'}
                                                    >
                                                        🗑️ Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div style={styles.card}>
                        <div style={styles.cardHeader}>
                            <h2 style={styles.sectionTitle}>
                                ➕ Add New Alert
                            </h2>
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>Asset Type</label>
                            <div style={styles.radioGroup}>
                                <div 
                                    style={{
                                        ...styles.radioItem,
                                        ...(assetType === 'forex' ? styles.radioItemActive : {})
                                    }}
                                    onClick={() => setAssetType('forex')}
                                >
                                    <input
                                        style={styles.radioInput}
                                        type="radio"
                                        name="assetType"
                                        value="forex"
                                        checked={assetType === 'forex'}
                                        onChange={(e) => setAssetType(e.target.value)}
                                    />
                                    <label style={styles.radioLabel}>💱 Forex</label>
                                </div>
                                
                                <div 
                                    style={{
                                        ...styles.radioItem,
                                        ...(assetType === 'stock-index' ? styles.radioItemActive : {})
                                    }}
                                    onClick={() => setAssetType('stock-index')}
                                >
                                    <input
                                        style={styles.radioInput}
                                        type="radio"
                                        name="assetType"
                                        value="stock-index"
                                        checked={assetType === 'stock-index'}
                                        onChange={(e) => setAssetType(e.target.value)}
                                    />
                                    <label style={styles.radioLabel}>📊 Stock Indices</label>
                                </div>

                                {/* NEW: Individual Stocks */}
                                <div 
                                    style={{
                                        ...styles.radioItem,
                                        ...(assetType === 'stock' ? styles.radioItemActive : {})
                                    }}
                                    onClick={() => setAssetType('stock')}
                                >
                                    <input
                                        style={styles.radioInput}
                                        type="radio"
                                        name="assetType"
                                        value="stock"
                                        checked={assetType === 'stock'}
                                        onChange={(e) => setAssetType(e.target.value)}
                                    />
                                    <label style={styles.radioLabel}>📈 Stocks</label>
                                </div>

                                {/* NEW: Cryptocurrencies */}
                                <div 
                                    style={{
                                        ...styles.radioItem,
                                        ...(assetType === 'crypto' ? styles.radioItemActive : {})
                                    }}
                                    onClick={() => setAssetType('crypto')}
                                >
                                    <input
                                        style={styles.radioInput}
                                        type="radio"
                                        name="assetType"
                                        value="crypto"
                                        checked={assetType === 'crypto'}
                                        onChange={(e) => setAssetType(e.target.value)}
                                    />
                                    <label style={styles.radioLabel}>₿ Crypto</label>
                                </div>
                                
                                <div 
                                    style={{
                                        ...styles.radioItem,
                                        ...(assetType === 'commodity' ? styles.radioItemActive : {})
                                    }}
                                    onClick={() => setAssetType('commodity')}
                                >
                                    <input
                                        style={styles.radioInput}
                                        type="radio"
                                        name="assetType"
                                        value="commodity"
                                        checked={assetType === 'commodity'}
                                        onChange={(e) => setAssetType(e.target.value)}
                                    />
                                    <label style={styles.radioLabel}>🪙 Commodities</label>
                                </div>
                                
                                <div 
                                    style={{
                                        ...styles.radioItem,
                                        ...(assetType === 'bond' ? styles.radioItemActive : {})
                                    }}
                                    onClick={() => setAssetType('bond')}
                                >
                                    <input
                                        style={styles.radioInput}
                                        type="radio"
                                        name="assetType"
                                        value="bond"
                                        checked={assetType === 'bond'}
                                        onChange={(e) => setAssetType(e.target.value)}
                                    />
                                    <label style={styles.radioLabel}>📜 Bonds</label>
                                </div>
                            </div>

                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label} htmlFor="asset-select">
                                Select Asset
                            </label>
                            <select
                                style={styles.select}
                                id="asset-select"
                                onFocus={(e) => e.target.style.borderColor = '#2563eb'}
                                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                            >
                                <option value="">
                                    Choose {assetType === 'forex' ? 'a forex pair' : 
                                            assetType === 'stock-index' ? 'a stock index' : 
                                            assetType === 'stock' ? 'a stock' :           // NEW
                                            assetType === 'crypto' ? 'a cryptocurrency' :  // NEW
                                            assetType === 'commodity' ? 'a commodity' : 
                                            'a bond'}
                                </option>

                                {getAvailableAssets().map((asset, index) => (
                                    <option key={index} value={asset}>
                                        {asset}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label} htmlFor="price-input">
                                Target Price
                            </label>
                            <input
                                style={styles.input}
                                type="number"
                                step={getPriceStep()}
                                id="price-input"
                                placeholder={getPricePlaceholder()}
                                onFocus={(e) => e.target.style.borderColor = '#2563eb'}
                                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                            />
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label} htmlFor="condition-select">
                                Alert Condition
                            </label>
                            <select
                                style={styles.select}
                                id="condition-select"
                                onFocus={(e) => e.target.style.borderColor = '#2563eb'}
                                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                            >
                                <option value="">Select when to trigger alert</option>
                                <option value="<">📉 Less than (Price drops below target)</option>
                                <option value=">">📈 Greater than (Price rises above target)</option>
                            </select>
                        </div>

                        <button 
                            style={styles.addButton}
                            onClick={addAsset}
                            onMouseOver={(e) => e.target.style.backgroundColor = '#1d4ed8'}
                            onMouseOut={(e) => e.target.style.backgroundColor = '#2563eb'}
                        >
                            ➕ Add Asset
                        </button>
                    </div>

                    {selectedAssets.length > 0 && (
                        <div style={styles.card}>
                            <div style={styles.cardHeader}>
                                <h2 style={styles.sectionTitle}>
                                    📋 Selected Assets ({selectedAssets.length})
                                </h2>
                            </div>
                            <ul style={styles.selectedAssetsList}>
                                {selectedAssets.map((entry, index) => (
                                    <li key={index} style={styles.selectedAssetItem}>
                                        <div style={styles.selectedAssetInfo}>
                                            <div style={styles.selectedAssetMain}>
                                                {entry.asset} {entry.condition === '<' ? '📉' : '📈'} {entry.price}
                                            </div>
                                            <div style={styles.selectedAssetSub}>
                                                {getAssetType(entry.asset)} • 
                                                Alert when price {entry.condition === '<' ? 'drops below' : 'rises above'} {entry.price}
                                            </div>
                                        </div>
                                        <button
                                            style={styles.removeButton}
                                            onClick={() => removeAsset(index)}
                                            onMouseOver={(e) => e.target.style.backgroundColor = '#fee2e2'}
                                            onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
                                            title="Remove asset"
                                        >
                                            ❌
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    
                    <div style={{textAlign: 'center', marginBottom: '30px'}}>
                        <button
                            style={{
                                ...styles.updateButton,
                                ...(selectedAssets.length === 0 ? styles.updateButtonDisabled : {})
                            }}
                            onClick={updateAssetsInBackend}
                            disabled={selectedAssets.length === 0}
                            onMouseOver={(e) => {
                                if (selectedAssets.length > 0) {
                                    e.target.style.backgroundColor = '#047857';
                                    e.target.style.transform = 'translateY(-2px)';
                                }
                            }}
                            onMouseOut={(e) => {
                                if (selectedAssets.length > 0) {
                                    e.target.style.backgroundColor = '#059669';
                                    e.target.style.transform = 'translateY(0)';
                                }
                            }}
                        >
                            {process === 'Updating Assets...' ? '🔄 ' : '🚀 '}
                            {process}
                        </button>
                    </div>
                    
                    {outcome && (
                        <div 
                            style={{
                                ...styles.alert,
                                ...(outcomeType === 'success' ? styles.alertSuccess : 
                                   outcomeType === 'danger' ? styles.alertDanger : 
                                   styles.alertWarning)
                            }}
                        >
                            {outcomeType === 'success' && '✅ '}
                            {outcomeType === 'danger' && '❌ '}
                            {outcomeType === 'warning' && '⚠️ '}
                            {outcome}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}