import React, { useEffect, useState } from "react";
import Header from "./header";
import SideNavs from "./side_navs";
import Cookies from 'js-cookie';

export default function ProbabilityEngine() {
    
    const baseUrl = 'https://backend-production-c0ab.up.railway.app';

    const [OPENAI_API_KEY, setOPENAI_API_KEY] = useState("");
    const [formData, setFormData] = useState({
        day_of_week: "",
        trading_session: "",
        asset: "",
        order_type: ""
    });
    const [probability, setProbability] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [stats, setStats] = useState(null);

    const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    const tradingSessions = ["Tokyo", "London", "New York", "Sydney"];
    const orderTypes = ["Buy", "Sell"];

    const fetchAPIKey = async () => {
        try {
            const response = await fetch(`${baseUrl}/get_openai_key`);
            if (!response.ok) throw new Error("Network response was not ok");
            const { OPENAI_API_KEY } = await response.json();
            setOPENAI_API_KEY(OPENAI_API_KEY);
        } catch (error) {
            console.error("Error fetching API key:", error);
        }
    };
    
    useEffect(() => {
        console.log("Fetching API key...");
        fetchAPIKey();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setError("");
    };

    const calculateProbability = async () => {
        if (!formData.day_of_week || !formData.trading_session || !formData.asset || !formData.order_type) {
            setError("Please fill in all fields");
            return;
        }

        const accountName = localStorage.getItem('account_name');
        if (!accountName) {
            setError("Account name not found in local storage");
            return;
        }

        setLoading(true);
        setError("");
        setProbability(null);
        setStats(null);

        try {
            const response = await fetch(`${baseUrl}/calculate_trade_probability`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    account_name: accountName,
                    day_of_week: formData.day_of_week,
                    trading_session: formData.trading_session,
                    asset: formData.asset,
                    order_type: formData.order_type
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to calculate probability");
            }

            const data = await response.json();
            setProbability(data);
            setStats(data.stats);
        } catch (err) {
            setError(err.message);
            console.error("Error calculating probability:", err);
        } finally {
            setLoading(false);
        }
    };

    const getProbabilityColor = (prob) => {
        if (prob >= 70) return "#10b981"; // Green
        if (prob >= 50) return "#f59e0b"; // Orange
        return "#ef4444"; // Red
    };

    const getRecommendation = (prob) => {
        if (prob >= 70) return "Strong probability - Good trade opportunity";
        if (prob >= 50) return "Moderate probability - Proceed with caution";
        return "Low probability - Consider avoiding this trade";
    };

    return (
        <div>
            <div className="header">
                <Header />
            </div>
            <div className="main-page-body">
                <SideNavs />
                <div className="main-body-info">
                    <h5 className="major-upcoming-news-events-header">SnowAI Probability Engine</h5>
                    <p style={{ color: "#888", marginBottom: "30px" }}>
                        Use your historical trading data to predict the likelihood of success for your next trade
                    </p>

                    <div style={{ 
                        backgroundColor: "#1a1a1a", 
                        padding: "30px", 
                        borderRadius: "10px",
                        maxWidth: "800px"
                    }}>
                        <h6 style={{ color: "#fff", marginBottom: "20px" }}>Trade Parameters</h6>
                        
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
                            <div>
                                <label style={{ color: "#aaa", display: "block", marginBottom: "8px" }}>Day of Week</label>
                                <select
                                    name="day_of_week"
                                    value={formData.day_of_week}
                                    onChange={handleInputChange}
                                    style={{
                                        width: "100%",
                                        padding: "10px",
                                        backgroundColor: "#2a2a2a",
                                        color: "#fff",
                                        border: "1px solid #444",
                                        borderRadius: "5px"
                                    }}
                                >
                                    <option value="">Select Day</option>
                                    {daysOfWeek.map(day => (
                                        <option key={day} value={day}>{day}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label style={{ color: "#aaa", display: "block", marginBottom: "8px" }}>Trading Session</label>
                                <select
                                    name="trading_session"
                                    value={formData.trading_session}
                                    onChange={handleInputChange}
                                    style={{
                                        width: "100%",
                                        padding: "10px",
                                        backgroundColor: "#2a2a2a",
                                        color: "#fff",
                                        border: "1px solid #444",
                                        borderRadius: "5px"
                                    }}
                                >
                                    <option value="">Select Session</option>
                                    {tradingSessions.map(session => (
                                        <option key={session} value={session}>{session}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label style={{ color: "#aaa", display: "block", marginBottom: "8px" }}>Asset</label>
                                <input
                                    type="text"
                                    name="asset"
                                    value={formData.asset}
                                    onChange={handleInputChange}
                                    placeholder="e.g., EURUSD, XAUUSD"
                                    style={{
                                        width: "100%",
                                        padding: "10px",
                                        backgroundColor: "#2a2a2a",
                                        color: "#fff",
                                        border: "1px solid #444",
                                        borderRadius: "5px"
                                    }}
                                />
                            </div>

                            <div>
                                <label style={{ color: "#aaa", display: "block", marginBottom: "8px" }}>Order Type</label>
                                <select
                                    name="order_type"
                                    value={formData.order_type}
                                    onChange={handleInputChange}
                                    style={{
                                        width: "100%",
                                        padding: "10px",
                                        backgroundColor: "#2a2a2a",
                                        color: "#fff",
                                        border: "1px solid #444",
                                        borderRadius: "5px"
                                    }}
                                >
                                    <option value="">Select Type</option>
                                    {orderTypes.map(type => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <button
                            onClick={calculateProbability}
                            disabled={loading}
                            style={{
                                width: "100%",
                                padding: "12px",
                                backgroundColor: loading ? "#444" : "#3b82f6",
                                color: "#fff",
                                border: "none",
                                borderRadius: "5px",
                                cursor: loading ? "not-allowed" : "pointer",
                                fontSize: "16px",
                                fontWeight: "600"
                            }}
                        >
                            {loading ? "Calculating..." : "Calculate Probability"}
                        </button>

                        {error && (
                            <div style={{
                                marginTop: "20px",
                                padding: "15px",
                                backgroundColor: "#ef444420",
                                border: "1px solid #ef4444",
                                borderRadius: "5px",
                                color: "#ef4444"
                            }}>
                                {error}
                            </div>
                        )}

                        {probability && (
                            <div style={{ marginTop: "30px" }}>
                                <div style={{
                                    textAlign: "center",
                                    padding: "30px",
                                    backgroundColor: "#2a2a2a",
                                    borderRadius: "10px",
                                    marginBottom: "20px"
                                }}>
                                    <div style={{ fontSize: "14px", color: "#aaa", marginBottom: "10px" }}>
                                        Win Probability
                                    </div>
                                    <div style={{ 
                                        fontSize: "48px", 
                                        fontWeight: "bold", 
                                        color: getProbabilityColor(probability.win_probability)
                                    }}>
                                        {probability.win_probability.toFixed(1)}%
                                    </div>
                                    <div style={{ 
                                        marginTop: "15px", 
                                        fontSize: "14px", 
                                        color: getProbabilityColor(probability.win_probability)
                                    }}>
                                        {getRecommendation(probability.win_probability)}
                                    </div>
                                    {probability.bias && (
                                        <div style={{ 
                                            marginTop: "15px", 
                                            padding: "10px",
                                            backgroundColor: "#1a1a1a",
                                            borderRadius: "5px"
                                        }}>
                                            <span style={{ color: "#aaa" }}>Asset Bias: </span>
                                            <span style={{ 
                                                color: probability.bias === 'bullish' ? '#10b981' : 
                                                       probability.bias === 'bearish' ? '#ef4444' : '#f59e0b',
                                                fontWeight: "600",
                                                textTransform: "capitalize"
                                            }}>
                                                {probability.bias}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {stats && (
                                    <div style={{ 
                                        display: "grid", 
                                        gridTemplateColumns: "1fr 1fr", 
                                        gap: "15px" 
                                    }}>
                                        <div style={{
                                            padding: "15px",
                                            backgroundColor: "#2a2a2a",
                                            borderRadius: "5px"
                                        }}>
                                            <div style={{ color: "#aaa", fontSize: "12px" }}>Total Trades</div>
                                            <div style={{ color: "#fff", fontSize: "24px", fontWeight: "600" }}>
                                                {stats.total_trades}
                                            </div>
                                        </div>

                                        <div style={{
                                            padding: "15px",
                                            backgroundColor: "#2a2a2a",
                                            borderRadius: "5px"
                                        }}>
                                            <div style={{ color: "#aaa", fontSize: "12px" }}>Wins</div>
                                            <div style={{ color: "#10b981", fontSize: "24px", fontWeight: "600" }}>
                                                {stats.wins}
                                            </div>
                                        </div>

                                        <div style={{
                                            padding: "15px",
                                            backgroundColor: "#2a2a2a",
                                            borderRadius: "5px"
                                        }}>
                                            <div style={{ color: "#aaa", fontSize: "12px" }}>Losses</div>
                                            <div style={{ color: "#ef4444", fontSize: "24px", fontWeight: "600" }}>
                                                {stats.losses}
                                            </div>
                                        </div>

                                        <div style={{
                                            padding: "15px",
                                            backgroundColor: "#2a2a2a",
                                            borderRadius: "5px"
                                        }}>
                                            <div style={{ color: "#aaa", fontSize: "12px" }}>Similar Trades</div>
                                            <div style={{ color: "#fff", fontSize: "24px", fontWeight: "600" }}>
                                                {stats.similar_trades}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {probability.factors && (
                                    <div style={{ 
                                        marginTop: "20px",
                                        padding: "15px",
                                        backgroundColor: "#2a2a2a",
                                        borderRadius: "5px"
                                    }}>
                                        <div style={{ color: "#aaa", fontSize: "12px", marginBottom: "10px" }}>
                                            Contributing Factors
                                        </div>
                                        <div style={{ color: "#fff", fontSize: "14px" }}>
                                            {probability.factors}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}