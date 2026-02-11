import React, { useState, useEffect } from 'react';

export default function AIModelBuilder({ theme, styles, BACKEND_API_URL }) {
    const [openaiApiKey, setOpenaiApiKey] = useState('');
    const [modelPrompt, setModelPrompt] = useState('');
    const [generatedCode, setGeneratedCode] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [modelName, setModelName] = useState('');
    const [modelDescription, setModelDescription] = useState('');
    const [showCodePreview, setShowCodePreview] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Fetch OpenAI API key on mount
    useEffect(() => {
        fetchOpenAIKey();
    }, []);

    const fetchOpenAIKey = async () => {
        try {
            const response = await fetch(`${BACKEND_API_URL}/get_openai_key`);
            if (!response.ok) {
                throw new Error("Failed to fetch API key");
            }
            const { OPENAI_API_KEY } = await response.json();
            setOpenaiApiKey(OPENAI_API_KEY);
        } catch (error) {
            console.error("Error fetching OpenAI key:", error);
            setError("Failed to load OpenAI API key. Please check your backend configuration.");
        }
    };

    const generateModel = async () => {
        if (!modelPrompt.trim()) {
            setError('Please enter a model description');
            setTimeout(() => setError(''), 3000);
            return;
        }

        if (!modelName.trim()) {
            setError('Please enter a model name');
            setTimeout(() => setError(''), 3000);
            return;
        }

        setIsGenerating(true);
        setError('');
        setSuccess('');

        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${openaiApiKey}`
                },
                body: JSON.stringify({
                    model: 'gpt-4o-mini',
                    messages: [
                        {
                            role: 'system',
                            content: `You are an expert Python quantitative analyst. Generate pure data analysis functions that work on OHLC (candlestick) datasets.

CRITICAL RULES:
1. Return ONLY raw Python code — NO markdown, NO backticks, NO prose
2. Functions receive a pandas DataFrame with columns: open, high, low, close, volume, timestamp
3. Functions MUST return a boolean (True / False) — never a Django response, never JSON
4. NO Django, NO Flask, NO HTTP, NO requests, NO views, NO decorators
5. NO imports of web frameworks whatsoever
6. Include only: pandas, numpy, or standard library imports
7. Always include a short docstring explaining what the boolean means
8. Start directly with imports (or the def if no imports needed)

CORRECT example:
import pandas as pd

def is_high_volume(df: pd.DataFrame) -> bool:
    """Returns True if the most recent candle's volume is above the 20-period average."""
    if len(df) < 20:
        return False
    avg_volume = df['volume'].rolling(20).mean().iloc[-1]
    return float(df['volume'].iloc[-1]) > float(avg_volume)

WRONG (never do this):
@csrf_exempt
def my_view(request):
    return JsonResponse({...})`
                        },
                        {
                            role: 'user',
                            content: `Create a Python OHLC analysis function for: ${modelPrompt}

Function name: ${modelName}
Extra context: ${modelDescription || 'none'}

Return ONLY the raw Python code. The function must accept a pandas DataFrame (open/high/low/close/volume columns) and return a boolean.`
                        }
                    ],
                    temperature: 0.7,
                    max_tokens: 2000
                })
            });

            if (!response.ok) {
                throw new Error(`OpenAI API error: ${response.status}`);
            }

            const data = await response.json();
            let code = data.choices[0].message.content;
            
            // Clean up any markdown formatting that might have slipped through
            code = code.replace(/```python\n?/g, '');
            code = code.replace(/```\n?/g, '');
            code = code.trim();
            
            setGeneratedCode(code);
            setShowCodePreview(true);
            setSuccess('✅ View function code generated successfully!');
            setTimeout(() => setSuccess(''), 3000);

        } catch (error) {
            console.error('Error generating model:', error);
            setError(`❌ Failed to generate code: ${error.message}`);
            setTimeout(() => setError(''), 5000);
        } finally {
            setIsGenerating(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(generatedCode);
        setSuccess('✅ Code copied to clipboard!');
        setTimeout(() => setSuccess(''), 2000);
    };
    
    const downloadCode = () => {
        const blob = new Blob([generatedCode], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${modelName || 'function'}.py`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        setSuccess('✅ Code downloaded!');
        setTimeout(() => setSuccess(''), 2000);
    };

    const resetForm = () => {
        setModelPrompt('');
        setModelName('');
        setModelDescription('');
        setGeneratedCode('');
        setShowCodePreview(false);
        setError('');
        setSuccess('');
    };

    return (
        <div style={{ padding: '20px' }}>
            <div style={{
                background: theme.bg.elevated,
                borderRadius: '15px',
                padding: '30px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                border: `1px solid ${theme.border.light}`,
                marginBottom: '20px'
            }}>
                <h2 style={{ 
                    color: theme.text.primary, 
                    marginTop: 0,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                }}>
                    🤖 AI Code Generator
                    <span style={{ 
                        fontSize: '0.7rem', 
                        background: theme.accent.purple,
                        color: 'white',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontWeight: '600'
                    }}>
                        BETA
                    </span>
                </h2>
                <p style={{ color: theme.text.secondary, marginBottom: '30px' }}>
                    Describe your trading signal in plain English. The AI will generate a Python function that takes an OHLC dataset and returns <code>True</code> or <code>False</code>.
                </p>

                {/* Success Message */}
                {success && (
                    <div style={{ 
                        background: `${theme.accent.green}20`,
                        border: `2px solid ${theme.accent.green}`,
                        color: theme.accent.green,
                        padding: '15px',
                        borderRadius: '12px',
                        marginBottom: '20px',
                        fontWeight: '600'
                    }}>
                        {success}
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div style={{ 
                        background: `${theme.accent.red}20`,
                        border: `2px solid ${theme.accent.red}`,
                        color: theme.accent.red,
                        padding: '15px',
                        borderRadius: '12px',
                        marginBottom: '20px',
                        fontWeight: '600'
                    }}>
                        {error}
                    </div>
                )}

                <div style={{ marginBottom: '20px' }}>
                    <label style={styles.label}>Function Name *</label>
                    <input
                        type="text"
                        value={modelName}
                        onChange={(e) => setModelName(e.target.value)}
                        placeholder="e.g., is_high_volume, is_bullish_engulfing, is_oversold_rsi"
                        style={styles.input}
                        disabled={isGenerating}
                    />
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <label style={styles.label}>Extra Context (Optional)</label>
                    <input
                        type="text"
                        value={modelDescription}
                        onChange={(e) => setModelDescription(e.target.value)}
                        placeholder="e.g., use 14-period RSI, threshold at 70"
                        style={styles.input}
                        disabled={isGenerating}
                    />
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <label style={styles.label}>Describe the Signal *</label>
                    <textarea
                        value={modelPrompt}
                        onChange={(e) => setModelPrompt(e.target.value)}
                        placeholder={`Example: "Returns True if the last 3 candles are all bullish and the volume on each is increasing — indicating a strong upward momentum burst."`}
                        style={{
                            ...styles.input,
                            minHeight: '120px',
                            resize: 'vertical',
                            fontFamily: 'inherit'
                        }}
                        disabled={isGenerating}
                    />
                </div>

                <div style={{ display: 'flex', gap: '15px' }}>
                    <button
                        onClick={generateModel}
                        disabled={isGenerating}
                        style={{
                            ...styles.buttonPrimary,
                            background: isGenerating 
                                ? theme.bg.tertiary 
                                : `linear-gradient(135deg, ${theme.accent.purple} 0%, #6d28d9 100%)`,
                            opacity: isGenerating ? 0.6 : 1,
                            cursor: isGenerating ? 'not-allowed' : 'pointer',
                            flex: 1
                        }}
                    >
                        {isGenerating ? '⏳ Generating Code...' : '🚀 Generate View Function'}
                    </button>

                    {generatedCode && (
                        <button
                            onClick={resetForm}
                            style={{
                                ...styles.buttonSecondary,
                                flex: 0.3
                            }}
                        >
                            🔄 Reset
                        </button>
                    )}
                </div>
            </div>

            {/* Code Preview */}
            {showCodePreview && generatedCode && (
                <div style={{
                    background: theme.bg.elevated,
                    borderRadius: '15px',
                    padding: '30px',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                    border: `1px solid ${theme.border.light}`
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
                        <h3 style={{ color: theme.text.primary, margin: 0 }}>
                            📝 Generated View Function
                        </h3>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button
                                onClick={copyToClipboard}
                                style={{
                                    ...styles.buttonSecondary,
                                    background: `linear-gradient(135deg, ${theme.blue[500]} 0%, ${theme.blue[600]} 100%)`,
                                    color: 'white',
                                    border: 'none'
                                }}
                            >
                                📋 Copy Code
                            </button>
                            <button
                                onClick={downloadCode}
                                style={{
                                    ...styles.buttonSecondary,
                                    background: `linear-gradient(135deg, ${theme.accent.green} 0%, #059669 100%)`,
                                    color: 'white',
                                    border: 'none'
                                }}
                            >
                                💾 Download .py
                            </button>
                        </div>
                    </div>

                    <pre style={{
                        background: theme.bg.tertiary,
                        padding: '20px',
                        borderRadius: '12px',
                        overflow: 'auto',
                        maxHeight: '600px',
                        color: theme.text.primary,
                        fontSize: '0.9rem',
                        lineHeight: '1.6',
                        border: `1px solid ${theme.border.medium}`
                    }}>
                        <code>{generatedCode}</code>
                    </pre>

                    <div style={{
                        marginTop: '20px',
                        padding: '15px',
                        background: `${theme.accent.cyan}20`,
                        border: `1px solid ${theme.accent.cyan}`,
                        borderRadius: '10px'
                    }}>
                        <p style={{ color: theme.text.primary, margin: '0 0 10px 0', fontWeight: '600' }}>
                            📚 How to use this function:
                        </p>
                        <ol style={{ color: theme.text.secondary, margin: 0, paddingLeft: '20px', lineHeight: '1.8' }}>
                            <li>Copy or download the <code>.py</code> file</li>
                            <li>Import it into your strategy runner: <code>from signals import {modelName}</code></li>
                            <li>Pass your OHLC DataFrame: <code>result = {modelName}(df)</code></li>
                            <li>Use the boolean to trigger trades: <code>if result: execute_buy()</code></li>
                        </ol>
                        <div style={{ marginTop: '12px', padding: '10px', background: theme.bg.tertiary, borderRadius: '8px', fontFamily: 'monospace', fontSize: '0.85rem', color: theme.text.primary }}>
                            df columns expected: <span style={{ color: theme.accent.cyan }}>open, high, low, close, volume, timestamp</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}