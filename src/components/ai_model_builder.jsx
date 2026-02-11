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
                    model: 'gpt-4',
                    messages: [
                        {
                            role: 'system',
                            content: `You are an expert Python Django developer specializing in creating machine learning models for financial trading. Generate complete, production-ready Django model code based on the user's requirements. The code should:
1. Use Django ORM models
2. Include proper field types and validations
3. Have clear docstrings
4. Include Meta classes with proper ordering and indexes
5. Have __str__ methods
6. Include any helper methods needed
7. Follow Django best practices

Return ONLY the Python code without any markdown formatting or explanations.`
                        },
                        {
                            role: 'user',
                            content: `Create a Django model for: ${modelPrompt}

Model Name: ${modelName}
Description: ${modelDescription || 'No additional description provided'}

Generate the complete model code.`
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
            const code = data.choices[0].message.content;
            
            setGeneratedCode(code);
            setShowCodePreview(true);
            setSuccess('✅ Model code generated successfully!');
            setTimeout(() => setSuccess(''), 3000);

        } catch (error) {
            console.error('Error generating model:', error);
            setError(`❌ Failed to generate model: ${error.message}`);
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
                    🤖 AI Model Builder
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
                    Describe your trading model in plain English and let AI generate the Django code automatically.
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
                    <label style={styles.label}>Model Name *</label>
                    <input
                        type="text"
                        value={modelName}
                        onChange={(e) => setModelName(e.target.value)}
                        placeholder="e.g., TradingSignal, PriceAlert, PortfolioAnalysis"
                        style={styles.input}
                        disabled={isGenerating}
                    />
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <label style={styles.label}>Short Description (Optional)</label>
                    <input
                        type="text"
                        value={modelDescription}
                        onChange={(e) => setModelDescription(e.target.value)}
                        placeholder="Brief description of what this model does"
                        style={styles.input}
                        disabled={isGenerating}
                    />
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <label style={styles.label}>Describe Your Model *</label>
                    <textarea
                        value={modelPrompt}
                        onChange={(e) => setModelPrompt(e.target.value)}
                        placeholder={`Example: "Create a model to track trading signals with fields for asset symbol, signal type (BUY/SELL), confidence score (0-100), timestamp, and optional notes. Include methods to calculate signal accuracy and filter by date range."`}
                        style={{
                            ...styles.input,
                            minHeight: '150px',
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
                        {isGenerating ? '⏳ Generating Model...' : '🚀 Generate Model Code'}
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
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h3 style={{ color: theme.text.primary, margin: 0 }}>
                            📝 Generated Model Code
                        </h3>
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
                            📚 Next Steps:
                        </p>
                        <ol style={{ color: theme.text.secondary, margin: 0, paddingLeft: '20px' }}>
                            <li>Copy the generated code</li>
                            <li>Add it to your Django <code>models.py</code> file</li>
                            <li>Run <code>python manage.py makemigrations</code></li>
                            <li>Run <code>python manage.py migrate</code></li>
                            <li>The model is now ready to use in your backend!</li>
                        </ol>
                    </div>
                </div>
            )}
        </div>
    );
}