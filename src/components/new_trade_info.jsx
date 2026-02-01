import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SideNavs from "./side_navs";
import Header from "./header";
import Cookies from 'js-cookie';

const SECTORS = [
    "Technology",
    "Financial",
    "Healthcare",
    "Consumer Cyclical",
    "Consumer Defensive",
    "Energy",
    "Industrials",
    "Communication",
    "Real Estate",
    "Materials",
    "Utilities",
    "Bonds and Yields",
];

export default function EnterNewTradeInfo() {
    const navigate = useNavigate();
    const baseUrl = 'https://backend-production-c0ab.up.railway.app';
    const [process, setProcess] = useState('Record Trade');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 600);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 600);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const [tradeData, setTradeData] = useState({
        asset: "",
        sector: "",
        order_type: "",
        strategy: "",
        day_of_week_entered: "",
        trading_session_entered: "",
        outcome: "",
        amount: "",
        emotional_bias: "",
        reflection: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTradeData({ ...tradeData, [name]: value });
    };

    const requiredFields = ['asset', 'sector', 'order_type', 'strategy', 'day_of_week_entered', 'trading_session_entered', 'outcome', 'amount'];
    const isFormValid = requiredFields.every(field => tradeData[field] !== "");
    const isDisabled = !isFormValid || isSubmitting;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setProcess('Recording Trade...');

        const accountName = Cookies.get('account_name');
        if (!accountName) {
            alert('Account not found.');
            setProcess('Record Trade');
            setIsSubmitting(false);
            return;
        }

        try {
            const response = await fetch(`${baseUrl}/create-new-trade-data`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    account_name: accountName,
                    ...tradeData,
                }),
            });

            if (response.ok) {
                alert('Trade recorded successfully!');
                setTradeData({
                    asset: "", sector: "", order_type: "", strategy: "",
                    day_of_week_entered: "", trading_session_entered: "",
                    outcome: "", amount: "", emotional_bias: "", reflection: "",
                });
            } else {
                alert('Error recording trade.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while saving the trade.');
        } finally {
            setProcess('Record Trade');
            setIsSubmitting(false);
        }
    };

    const row = {
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        gap: '16px',
    };

    return (
        <div>
            <div className="header">
                <Header />
            </div>
            <SideNavs />

            <div style={styles.pageWrapper}>
                <div style={styles.container}>

                    {/* Header */}
                    <div style={styles.titleBlock}>
                        <h2 style={styles.title}>New Trade</h2>
                        <p style={styles.subtitle}>Record your trade details below</p>
                    </div>

                    <form onSubmit={handleSubmit} style={styles.form}>

                        {/* Asset + Sector */}
                        <div style={row}>
                            <div style={styles.fieldGroup}>
                                <label style={styles.label}>Asset</label>
                                <input
                                    type="text"
                                    name="asset"
                                    value={tradeData.asset}
                                    onChange={handleChange}
                                    placeholder="e.g. AAPL, EURUSD"
                                    style={styles.input}
                                    required
                                />
                            </div>
                            <div style={styles.fieldGroup}>
                                <label style={styles.label}>Sector</label>
                                <select
                                    name="sector"
                                    value={tradeData.sector}
                                    onChange={handleChange}
                                    style={styles.select}
                                    required
                                >
                                    <option value="">Select sector</option>
                                    {SECTORS.map(s => (
                                        <option key={s} value={s}>{s}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Order Type + Strategy */}
                        <div style={row}>
                            <div style={styles.fieldGroup}>
                                <label style={styles.label}>Order Type</label>
                                <select
                                    name="order_type"
                                    value={tradeData.order_type}
                                    onChange={handleChange}
                                    style={styles.select}
                                    required
                                >
                                    <option value="">Select order type</option>
                                    <option value="Buy">Buy</option>
                                    <option value="Sell">Sell</option>
                                </select>
                            </div>
                            <div style={styles.fieldGroup}>
                                <label style={styles.label}>Strategy</label>
                                <input
                                    type="text"
                                    name="strategy"
                                    value={tradeData.strategy}
                                    onChange={handleChange}
                                    placeholder="e.g. Breakout"
                                    style={styles.input}
                                    required
                                />
                            </div>
                        </div>

                        {/* Day + Session */}
                        <div style={row}>
                            <div style={styles.fieldGroup}>
                                <label style={styles.label}>Day Entered</label>
                                <select
                                    name="day_of_week_entered"
                                    value={tradeData.day_of_week_entered}
                                    onChange={handleChange}
                                    style={styles.select}
                                    required
                                >
                                    <option value="">Select day</option>
                                    <option value="Monday">Monday</option>
                                    <option value="Tuesday">Tuesday</option>
                                    <option value="Wednesday">Wednesday</option>
                                    <option value="Thursday">Thursday</option>
                                    <option value="Friday">Friday</option>
                                    <option value="Saturday">Saturday</option>
                                    <option value="Sunday">Sunday</option>
                                </select>
                            </div>
                            <div style={styles.fieldGroup}>
                                <label style={styles.label}>Session Entered</label>
                                <select
                                    name="trading_session_entered"
                                    value={tradeData.trading_session_entered}
                                    onChange={handleChange}
                                    style={styles.select}
                                    required
                                >
                                    <option value="">Select session</option>
                                    <option value="Sydney">Sydney</option>
                                    <option value="Tokyo">Asian</option>
                                    <option value="London">London</option>
                                    <option value="New York">NY</option>
                                    <option value="After Hours">After Hours</option>
                                </select>
                            </div>
                        </div>

                        {/* Outcome + Amount */}
                        <div style={row}>
                            <div style={styles.fieldGroup}>
                                <label style={styles.label}>Outcome</label>
                                <select
                                    name="outcome"
                                    value={tradeData.outcome}
                                    onChange={handleChange}
                                    style={styles.select}
                                    required
                                >
                                    <option value="">Select outcome</option>
                                    <option value="Win">Win</option>
                                    <option value="Loss">Loss</option>
                                    <option value="Break Even">Break Even</option>
                                </select>
                            </div>
                            <div style={styles.fieldGroup}>
                                <label style={styles.label}>Amount ($)</label>
                                <input
                                    type="number"
                                    name="amount"
                                    value={tradeData.amount}
                                    onChange={handleChange}
                                    placeholder="e.g. 150"
                                    style={styles.input}
                                    required
                                />
                            </div>
                        </div>

                        {/* Emotional Bias */}
                        <div style={styles.fieldGroup}>
                            <label style={styles.label}>
                                Emotional Bias <span style={styles.optionalTag}>Optional</span>
                            </label>
                            <textarea
                                name="emotional_bias"
                                value={tradeData.emotional_bias}
                                onChange={handleChange}
                                placeholder="Notes on your emotional state before/during the trade..."
                                style={styles.textarea}
                            />
                        </div>

                        {/* Reflection */}
                        <div style={styles.fieldGroup}>
                            <label style={styles.label}>
                                Reflection <span style={styles.optionalTag}>Optional</span>
                            </label>
                            <textarea
                                name="reflection"
                                value={tradeData.reflection}
                                onChange={handleChange}
                                placeholder="What did you learn from this trade?"
                                style={styles.textarea}
                            />
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isDisabled}
                            style={{
                                ...styles.submitBtn,
                                ...(isDisabled ? styles.submitBtnDisabled : styles.submitBtnActive),
                            }}
                        >
                            {process}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}


// ============================================
// STYLES
// ============================================

const styles = {
    pageWrapper: {
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #e8f1fc 0%, #f0f5ff 50%, #dbeafe 100%)',
        padding: '30px 16px 60px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    container: {
        width: '100%',
        maxWidth: '720px',
        background: '#ffffff',
        borderRadius: '16px',
        boxShadow: '0 4px 24px rgba(30, 58, 138, 0.10)',
        border: '1px solid #dbeafe',
        overflow: 'hidden',
    },
    titleBlock: {
        background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
        padding: '28px 32px 24px',
    },
    title: {
        margin: 0,
        color: '#ffffff',
        fontSize: '22px',
        fontWeight: '700',
        letterSpacing: '-0.3px',
        fontFamily: "'Segoe UI', system-ui, sans-serif",
    },
    subtitle: {
        margin: '6px 0 0',
        color: 'rgba(255,255,255,0.75)',
        fontSize: '13px',
        fontWeight: '400',
    },
    form: {
        padding: '28px 32px 32px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
    },
    fieldGroup: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        minWidth: 0,
    },
    label: {
        fontSize: '13px',
        fontWeight: '600',
        color: '#1e3a8a',
        fontFamily: "'Segoe UI', system-ui, sans-serif",
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
    },
    optionalTag: {
        fontSize: '11px',
        fontWeight: '500',
        color: '#64748b',
        background: '#f1f5f9',
        padding: '2px 7px',
        borderRadius: '20px',
        letterSpacing: '0.2px',
    },
    input: {
        width: '100%',
        boxSizing: 'border-box',
        padding: '10px 14px',
        fontSize: '14px',
        color: '#1e293b',
        background: '#f8fafc',
        border: '1.5px solid #cbd5e1',
        borderRadius: '8px',
        outline: 'none',
        transition: 'border-color 0.2s, box-shadow 0.2s',
        fontFamily: "'Segoe UI', system-ui, sans-serif",
    },
    select: {
        width: '100%',
        boxSizing: 'border-box',
        padding: '10px 14px',
        fontSize: '14px',
        color: '#1e293b',
        background: '#f8fafc',
        border: '1.5px solid #cbd5e1',
        borderRadius: '8px',
        outline: 'none',
        transition: 'border-color 0.2s, box-shadow 0.2s',
        fontFamily: "'Segoe UI', system-ui, sans-serif",
        appearance: 'auto',
        cursor: 'pointer',
    },
    textarea: {
        width: '100%',
        boxSizing: 'border-box',
        padding: '12px 14px',
        fontSize: '14px',
        color: '#1e293b',
        background: '#f8fafc',
        border: '1.5px solid #cbd5e1',
        borderRadius: '8px',
        outline: 'none',
        resize: 'vertical',
        minHeight: '90px',
        transition: 'border-color 0.2s, box-shadow 0.2s',
        fontFamily: "'Segoe UI', system-ui, sans-serif",
        lineHeight: '1.5',
    },
    submitBtn: {
        width: '100%',
        padding: '13px',
        fontSize: '15px',
        fontWeight: '600',
        borderRadius: '9px',
        border: 'none',
        fontFamily: "'Segoe UI', system-ui, sans-serif",
        letterSpacing: '0.2px',
        transition: 'background 0.2s, box-shadow 0.2s',
        marginTop: '4px',
    },
    submitBtnActive: {
        background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
        color: '#ffffff',
        boxShadow: '0 3px 12px rgba(37, 99, 235, 0.35)',
        cursor: 'pointer',
    },
    submitBtnDisabled: {
        background: '#cbd5e1',
        color: '#94a3b8',
        cursor: 'not-allowed',
        boxShadow: 'none',
    },
};
