import React, { useEffect, useState } from "react";
import Header from "./header";
import SideNavs from "./side_navs";
import Cookies from "js-cookie";

export default function AlertBot() {
    const [assetArray, setAssetArray] = useState(['EURUSD', 'GBPUSD', 'XAUUSD', 'USDX']);
    const [outcome, setOutcome] = useState("");
    const [colorOutcome, setColorOutcome] = useState("");
    const [selectedAssets, setSelectedAssets] = useState([]);
    const baseUrl = "https://backend-production-c0ab.up.railway.app";

    const fetchEmailDataFromAPI = async () => {
        return Cookies.get("email");
    };

    // // Fetch user's assets from the backend
    // const fetchUserAssets = async () => {
    //     try {
    //         const email = await fetchEmailDataFromAPI();
    //         const response = await fetch(`${baseUrl}/get-user-assets?email=${email}`);
    //         const data = await response.json();

    //         if (response.ok) {
    //             setAssetArray(data.message || []); // Populate assetArray with the response data
    //         } else {
    //             console.error(data.error);
    //             setOutcome("Failed to load assets.");
    //             setColorOutcome("text-danger");
    //         }
    //     } catch (error) {
    //         console.error("Error fetching user assets:", error);
    //         setOutcome("Error fetching user assets.");
    //         setColorOutcome("text-danger");
    //     }
    // };

    // // Call fetchUserAssets when the component mounts
    // useEffect(() => {
    //     fetchUserAssets();
    // }, []);

    // Add an asset with its price and condition
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

    // Remove an asset
    const removeAsset = (index) => {
        setSelectedAssets((prev) => prev.filter((_, i) => i !== index));
    };

    // Send selected assets to the backend
    const updateAssetsInBackend = async () => {
        if (selectedAssets.length === 0) {
            setOutcome("No assets to update.");
            setColorOutcome("text-danger");
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
                setSelectedAssets([]); // Clear the list after successful update
            } else {
                console.error(data.error);
                setOutcome("Failed to update alerts.");
                setColorOutcome("text-danger");
            }
        } catch (error) {
            console.error("Error updating alerts:", error);
            setOutcome("Error updating alerts.");
            setColorOutcome("text-danger");
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
                            Update Backend
                        </button>
                        <br />
                        <p className={colorOutcome}>{outcome}</p>
                        <br />
                    </div>
                </div>
            </div>
        </div>
    );
}
