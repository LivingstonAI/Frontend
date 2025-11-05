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
    const tradingSessions = ["Asian", "London", "NY"];
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

        const accountName = Cookies.get('account_name');
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
        if (prob >= 70) return "#4ade80"; // Bright green
        if (prob >= 50) return "#60a5fa"; // Blue
        return "#f87171"; // Red
    };

    const getRecommendation = (prob) => {
        if (prob >= 70) return "✓ Strong probability - Good trade opportunity";
        if (prob >= 50) return "⚠ Moderate probability - Proceed with caution";
        return "✗ Low probability - Consider avoiding this trade";
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
                    <p style={{ color: "#94a3b8", marginBottom: "30px", fontSize: "15px" }}>
                        Use your historical trading data to predict the likelihood of success for your next trade
                    </p>

                    <div style={{ 
                        backgroundColor: "#ffffff", 
                        padding: "35px", 
                        borderRadius: "12px",
                        maxWidth: "900px",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                        border: "1px solid #e2e8f0"
                    }}>
                        <h6 style={{ color: "#1e293b", marginBottom: "25px", fontSize: "18px", fontWeight: "600" }}>
                            Trade Parameters
                        </h6>
                        
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "25px" }}>
                            <div>
                                <label style={{ 
                                    color: "#475569", 
                                    display: "block", 
                                    marginBottom: "8px",
                                    fontSize: "14px",
                                    fontWeight: "500"
                                }}>Day of Week</label>
                                <select
                                    name="day_of_week"
                                    value={formData.day_of_week}
                                    onChange={handleInputChange}
                                    style={{
                                        width: "100%",
                                        padding: "12px",
                                        backgroundColor: "#f8fafc",
                                        color: "#1e293b",
                                        border: "1px solid #cbd5e1",
                                        borderRadius: "8px",
                                        fontSize: "14px",
                                        outline: "none"
                                    }}
                                >
                                    <option value="">Select Day</option>
                                    {daysOfWeek.map(day => (
                                        <option key={day} value={day}>{day}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label style={{ 
                                    color: "#475569", 
                                    display: "block", 
                                    marginBottom: "8px",
                                    fontSize: "14px",
                                    fontWeight: "500"
                                }}>Trading Session</label>
                                <select
                                    name="trading_session"
                                    value={formData.trading_session}
                                    onChange={handleInputChange}
                                    style={{
                                        width: "100%",
                                        padding: "12px",
                                        backgroundColor: "#f8fafc",
                                        color: "#1e293b",
                                        border: "1px solid #cbd5e1",
                                        borderRadius: "8px",
                                        fontSize: "14px",
                                        outline: "none"
                                    }}
                                >
                                    <option value="">Select Session</option>
                                    {tradingSessions.map(session => (
                                        <option key={session} value={session}>{session}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label style={{ 
                                    color: "#475569", 
                                    display: "block", 
                                    marginBottom: "8px",
                                    fontSize: "14px",
                                    fontWeight: "500"
                                }}>Asset</label>
                                <input
                                    type="text"
                                    name="asset"
                                    value={formData.asset}
                                    onChange={handleInputChange}
                                    placeholder="e.g., EURUSD, XAUUSD"
                                    style={{
                                        width: "100%",
                                        padding: "12px",
                                        backgroundColor: "#f8fafc",
                                        color: "#1e293b",
                                        border: "1px solid #cbd5e1",
                                        borderRadius: "8px",
                                        fontSize: "14px",
                                        outline: "none"
                                    }}
                                />
                            </div>

                            <div>
                                <label style={{ 
                                    color: "#475569", 
                                    display: "block", 
                                    marginBottom: "8px",
                                    fontSize: "14px",
                                    fontWeight: "500"
                                }}>Order Type</label>
                                <select
                                    name="order_type"
                                    value={formData.order_type}
                                    onChange={handleInputChange}
                                    style={{
                                        width: "100%",
                                        padding: "12px",
                                        backgroundColor: "#f8fafc",
                                        color: "#1e293b",
                                        border: "1px solid #cbd5e1",
                                        borderRadius: "8px",
                                        fontSize: "14px",
                                        outline: "none"
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
                                padding: "14px",
                                backgroundColor: loading ? "#94a3b8" : "#3b82f6",
                                color: "#ffffff",
                                border: "none",
                                borderRadius: "8px",
                                cursor: loading ? "not-allowed" : "pointer",
                                fontSize: "15px",
                                fontWeight: "600",
                                transition: "all 0.2s"
                            }}
                        >
                            {loading ? "Calculating..." : "Calculate Probability"}
                        </button>

                        {error && (
                            <div style={{
                                marginTop: "20px",
                                padding: "15px",
                                backgroundColor: "#fee2e2",
                                border: "1px solid #fca5a5",
                                borderRadius: "8px",
                                color: "#dc2626",
                                fontSize: "14px"
                            }}>
                                {error}
                            </div>
                        )}

                        {probability && (
                            <div style={{ marginTop: "30px" }}>
                                <div style={{
                                    textAlign: "center",
                                    padding: "40px",
                                    backgroundColor: "#f8fafc",
                                    borderRadius: "12px",
                                    marginBottom: "25px",
                                    border: "2px solid #e2e8f0"
                                }}>
                                    <div style={{ fontSize: "13px", color: "#64748b", marginBottom: "12px", fontWeight: "500", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                                        Win Probability
                                    </div>
                                    <div style={{ 
                                        fontSize: "56px", 
                                        fontWeight: "700", 
                                        color: getProbabilityColor(probability.win_probability),
                                        marginBottom: "10px"
                                    }}>
                                        {probability.win_probability.toFixed(1)}%
                                    </div>
                                    <div style={{ 
                                        marginTop: "15px", 
                                        fontSize: "15px", 
                                        color: "#475569",
                                        fontWeight: "500"
                                    }}>
                                        {getRecommendation(probability.win_probability)}
                                    </div>
                                    {probability.bias && (
                                        <div style={{ 
                                            marginTop: "20px", 
                                            padding: "12px",
                                            backgroundColor: "#ffffff",
                                            borderRadius: "8px",
                                            border: "1px solid #e2e8f0",
                                            display: "inline-block"
                                        }}>
                                            <span style={{ color: "#64748b", fontSize: "13px", fontWeight: "500" }}>Asset Bias: </span>
                                            <span style={{ 
                                                color: probability.bias === 'bullish' ? '#10b981' : 
                                                       probability.bias === 'bearish' ? '#ef4444' : '#f59e0b',
                                                fontWeight: "600",
                                                textTransform: "capitalize",
                                                fontSize: "14px"
                                            }}>
                                                {probability.bias}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {stats && (
                                    <div style={{ 
                                        display: "grid", 
                                        gridTemplateColumns: "repeat(4, 1fr)", 
                                        gap: "15px",
                                        marginBottom: "20px"
                                    }}>
                                        <div style={{
                                            padding: "20px",
                                            backgroundColor: "#f8fafc",
                                            borderRadius: "10px",
                                            border: "1px solid #e2e8f0",
                                            textAlign: "center"
                                        }}>
                                            <div style={{ color: "#64748b", fontSize: "12px", fontWeight: "500", marginBottom: "8px" }}>Similar Trades</div>
                                            <div style={{ color: "#1e293b", fontSize: "28px", fontWeight: "700" }}>
                                                {stats.similar_trades}
                                            </div>
                                        </div>

                                        <div style={{
                                            padding: "20px",
                                            backgroundColor: "#f8fafc",
                                            borderRadius: "10px",
                                            border: "1px solid #e2e8f0",
                                            textAlign: "center"
                                        }}>
                                            <div style={{ color: "#64748b", fontSize: "12px", fontWeight: "500", marginBottom: "8px" }}>Total Trades</div>
                                            <div style={{ color: "#1e293b", fontSize: "28px", fontWeight: "700" }}>
                                                {stats.total_trades}
                                            </div>
                                        </div>

                                        <div style={{
                                            padding: "20px",
                                            backgroundColor: "#ecfdf5",
                                            borderRadius: "10px",
                                            border: "1px solid #a7f3d0",
                                            textAlign: "center"
                                        }}>
                                            <div style={{ color: "#065f46", fontSize: "12px", fontWeight: "500", marginBottom: "8px" }}>Wins</div>
                                            <div style={{ color: "#059669", fontSize: "28px", fontWeight: "700" }}>
                                                {stats.wins}
                                            </div>
                                        </div>

                                        <div style={{
                                            padding: "20px",
                                            backgroundColor: "#fef2f2",
                                            borderRadius: "10px",
                                            border: "1px solid #fecaca",
                                            textAlign: "center"
                                        }}>
                                            <div style={{ color: "#991b1b", fontSize: "12px", fontWeight: "500", marginBottom: "8px" }}>Losses</div>
                                            <div style={{ color: "#dc2626", fontSize: "28px", fontWeight: "700" }}>
                                                {stats.losses}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {probability.factors && (
                                    <div style={{ 
                                        padding: "18px",
                                        backgroundColor: "#eff6ff",
                                        borderRadius: "10px",
                                        border: "1px solid #bfdbfe"
                                    }}>
                                        <div style={{ color: "#1e40af", fontSize: "12px", marginBottom: "8px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                                            Contributing Factors
                                        </div>
                                        <div style={{ color: "#1e293b", fontSize: "14px", lineHeight: "1.6" }}>
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