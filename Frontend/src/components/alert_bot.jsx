import React, { useEffect, useState } from "react";
import Header from "./header";
import SideNavs from "./side_navs";
import Cookies from "js-cookie";

export default function AlertBot() {
    const [assetArray, setAssetArray] = useState(['EURUSD', 'GBPUSD', 'USDJPY', 'USDCAD']);
    const [outcome, setOutcome] = useState("");
    const [colorOutcome, setColorOutcome] = useState("");
    const [selectedAssets, setSelectedAssets] = useState([]);
    const [existingAlerts, setExistingAlerts] = useState([]);
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
                setColorOutcome("text-success");
                fetchExistingAlerts();
            } else {
                const data = await response.json();
                setOutcome("Failed to delete alert: " + data.error);
                setColorOutcome("text-danger");
            }
        } catch (error) {
            console.error("Error deleting alert:", error);
            setOutcome("Error deleting alert.");
            setColorOutcome("text-danger");
        }
    };

    const addAsset = () => {
        const asset = document.getElementById("asset-select").value;
        const price = document.getElementById("price-input").value;
        const condition = document.getElementById("condition-select").value;

        if (!asset || !price || !condition) {
            setOutcome("Please provide all fields for the asset.");
            setColorOutcome("text-danger");
            return;
        }

        setSelectedAssets((prev) => [
            ...prev,
            { asset, price: parseFloat(price), condition },
        ]);
        setOutcome("Asset added successfully!");
        setColorOutcome("text-success");
    };

    const removeAsset = (index) => {
        setSelectedAssets((prev) => prev.filter((_, i) => i !== index));
    };

    const updateAssetsInBackend = async () => {
        setProcess('Updating Assets...');
        if (selectedAssets.length === 0) {
            setOutcome("No assets to update.");
            setColorOutcome("text-danger");
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
                setColorOutcome("text-success");
                setSelectedAssets([]);
                fetchExistingAlerts();
                setProcess('Update Backend');
            } else {
                console.error(data.error);
                setOutcome("Failed to update alerts.");
                setColorOutcome("text-danger");
                setProcess('Update Backend');
            }
        } catch (error) {
            console.error("Error updating alerts:", error);
            setOutcome("Error updating alerts.");
            setColorOutcome("text-danger");
            setProcess('Update Backend');
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
                    <h5 className="major-upcoming-news-events-header">Alert Bot</h5>
                    <br />
                    
                    {/* Existing Alerts Section - Now with scrollable container */}
                    <div className="existing-alerts-section">
                        <h6>Existing Alerts:</h6>
                        <div style={{ maxHeight: '300px', overflowY: 'auto', border: '1px solid #dee2e6', borderRadius: '4px' }}>
                            <table className="table table-striped mb-0">
                                <thead style={{ position: 'sticky', top: 0, backgroundColor: 'white', zIndex: 1 }}>
                                    <tr>
                                        <th>Asset</th>
                                        <th>Condition</th>
                                        <th>Price</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {existingAlerts.map((alert) => (
                                        <tr key={alert.id}>
                                            <td>{alert.asset}</td>
                                            <td>{alert.condition}</td>
                                            <td>{alert.price}</td>
                                            <td>{alert.checked ? "Triggered" : "Active"}</td>
                                            <td>
                                                <button
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() => deleteAlert(alert.id)}
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <br />

                    <div className="update-news-div">
                        <div>
                            <label htmlFor="asset-select">Select Asset:</label>
                            <select
                                className="form-control"
                                id="asset-select"
                                defaultValue=""
                            >
                                <option value="" disabled>
                                    Select an asset
                                </option>
                                {assetArray.map((asset, index) => (
                                    <option key={index} value={asset}>
                                        {asset}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <br />
                        <div>
                            <label htmlFor="price-input">Enter Price:</label>
                            <input
                                type="number"
                                step="0.01"
                                className="form-control"
                                id="price-input"
                                placeholder="Enter price (e.g., 123.45)"
                            />
                        </div>
                        <br />
                        <div>
                            <label htmlFor="condition-select">Select Condition:</label>
                            <select
                                className="form-control"
                                id="condition-select"
                                defaultValue=""
                            >
                                <option value="" disabled>
                                    Select condition
                                </option>
                                <option value="<">&lt;</option>
                                <option value=">">&gt;</option>
                                <option value="=">=</option>
                            </select>
                        </div>
                        <br />
                        <div>
                            <button className="btn btn-primary" onClick={addAsset}>
                                Add Asset
                            </button>
                        </div>
                        <br />
                        <h6>Selected Assets:</h6>
                        <ul>
                            {selectedAssets.map((entry, index) => (
                                <li key={index}>
                                    {entry.asset} {entry.condition} {entry.price}
                                    <i
                                        onClick={() => removeAsset(index)}
                                        style={{ marginLeft: "10px", cursor: "pointer" }}
                                    >
                                        ❌
                                    </i>
                                </li>
                            ))}
                        </ul>
                        <br />
                        <button
                            className="btn btn-primary"
                            onClick={updateAssetsInBackend}
                        >
                            {process}
                        </button>
                        <br /><br />
                        <p className={colorOutcome}>{outcome}</p>
                        <br />
                    </div>
                </div>
            </div>
        </div>
    );
}