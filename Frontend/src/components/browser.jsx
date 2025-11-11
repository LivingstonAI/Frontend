import React, { useState } from "react";
import Header from "./header";
import SideNavs from "./side_navs";

export default function SnowAIBrowser() {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSearch = async () => {
        if (!searchQuery.trim()) return;

        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch("https://api.anthropic.com/v1/messages", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    model: "claude-sonnet-4-20250514",
                    max_tokens: 1000,
                    messages: [
                        { 
                            role: "user", 
                            content: `Search the web for: ${searchQuery}. Provide a concise summary of the top results with key information.` 
                        }
                    ],
                    tools: [
                        {
                            type: "web_search_20250305",
                            name: "web_search"
                        }
                    ]
                })
            });

            const data = await response.json();
            
            // Extract text from all content blocks
            const fullResponse = data.content
                .map(item => (item.type === "text" ? item.text : ""))
                .filter(Boolean)
                .join("\n");

            setSearchResults(fullResponse);
        } catch (err) {
            setError("Failed to fetch search results. Please try again.");
            console.error("Search error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const styles = {
        container: {
            flexDirection: 'column',
            height: '100vh',
            width: '100%',
        },
        browserContainer: {
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            padding: '15px',
            gap: '15px',
        },
        searchSection: {
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        },
        searchContainer: {
            display: 'flex',
            gap: '10px',
            alignItems: 'center',
        },
        searchInput: {
            flex: 1,
            padding: '12px 16px',
            fontSize: '15px',
            border: '2px solid #e0e0e0',
            borderRadius: '6px',
            outline: 'none',
            transition: 'border-color 0.2s',
        },
        searchButton: {
            padding: '12px 28px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '15px',
            fontWeight: '600',
            transition: 'background-color 0.2s',
            whiteSpace: 'nowrap',
        },
        resultsSection: {
            backgroundColor: 'white',
            padding: '25px',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            flex: 1,
            overflow: 'auto',
        },
        resultsTitle: {
            fontSize: '17px',
            fontWeight: '600',
            marginBottom: '15px',
            color: '#333',
            borderBottom: '2px solid #007bff',
            paddingBottom: '8px',
        },
        resultsContent: {
            fontSize: '14px',
            lineHeight: '1.7',
            color: '#555',
            whiteSpace: 'pre-wrap',
        },
        loadingSpinner: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '50px',
        },
        spinner: {
            width: '40px',
            height: '40px',
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #007bff',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
        },
        error: {
            padding: '16px',
            backgroundColor: '#fee',
            border: '1px solid #fcc',
            borderRadius: '6px',
            color: '#c33',
        },
        emptyState: {
            textAlign: 'center',
            padding: '50px 20px',
            color: '#999',
        },
        emptyStateIcon: {
            fontSize: '42px',
            marginBottom: '12px',
        },
    };

    return (
        <div style={styles.container}>
            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                input:focus {
                    border-color: #007bff !important;
                }
                button:hover:not(:disabled) {
                    background-color: #0056b3 !important;
                }
                button:disabled {
                    background-color: #ccc !important;
                    cursor: not-allowed !important;
                    opacity: 0.6;
                }
            `}</style>
            
            <div className="header">
                <Header />
            </div>
            <div className="main-page-body">
                <SideNavs />
                <div className="main-body-info">
                    <h5 className="major-upcoming-news-events-header">SnowAI Browser</h5>
                    
                    <div style={styles.browserContainer}>
                        {/* Search Section */}
                        <div style={styles.searchSection}>
                            <div style={styles.searchContainer}>
                                <input
                                    type="text"
                                    placeholder="Search the web with AI..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    style={styles.searchInput}
                                    disabled={isLoading}
                                />
                                <button 
                                    onClick={handleSearch}
                                    style={styles.searchButton}
                                    disabled={isLoading || !searchQuery.trim()}
                                >
                                    {isLoading ? 'Searching...' : 'Search'}
                                </button>
                            </div>
                        </div>

                        {/* Results Section */}
                        <div style={styles.resultsSection}>
                            <h3 style={styles.resultsTitle}>Search Results</h3>
                            
                            {isLoading && (
                                <div style={styles.loadingSpinner}>
                                    <div style={styles.spinner}></div>
                                </div>
                            )}

                            {error && (
                                <div style={styles.error}>
                                    {error}
                                </div>
                            )}

                            {!isLoading && !error && !searchResults && (
                                <div style={styles.emptyState}>
                                    <div style={styles.emptyStateIcon}>🔍</div>
                                    <p>Enter a search query above to get AI-powered search results</p>
                                </div>
                            )}

                            {!isLoading && !error && searchResults && (
                                <div style={styles.resultsContent}>
                                    {searchResults}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}