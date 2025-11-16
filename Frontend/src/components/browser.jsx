import React, { useState } from "react";
import Header from "./header";
import SideNavs from "./side_navs";


export default function SnowAIBrowser() {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentUrl, setCurrentUrl] = useState("");
    const [pageContent, setPageContent] = useState(null);
    const [history, setHistory] = useState([]);
    const [activeTab, setActiveTab] = useState("search");

    const handleSearch = async () => {
        if (!searchQuery.trim()) return;

        setIsLoading(true);
        setError(null);
        setActiveTab("search");

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
                            content: `Search the web for: ${searchQuery}. Provide a concise summary with URLs from the search results.` 
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
            
            const fullResponse = data.content
                .map(item => (item.type === "text" ? item.text : ""))
                .filter(Boolean)
                .join("\n");

            setSearchResults(fullResponse);
            setHistory(prev => [...prev, { type: "search", query: searchQuery, timestamp: new Date() }]);
        } catch (err) {
            setError("Failed to fetch search results. Please try again.");
            console.error("Search error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchWebPage = async (url) => {
        if (!url.trim()) return;

        setIsLoading(true);
        setError(null);
        setCurrentUrl(url);
        setActiveTab("page");

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
                            content: `Fetch and summarize the content from this URL: ${url}. Provide the main content in a readable format.` 
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
            
            const content = data.content
                .map(item => (item.type === "text" ? item.text : ""))
                .filter(Boolean)
                .join("\n");

            setPageContent(content);
            setHistory(prev => [...prev, { type: "visit", url: url, timestamp: new Date() }]);
        } catch (err) {
            setError("Failed to fetch page content. Please try again.");
            console.error("Fetch error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUrlSubmit = () => {
        if (currentUrl.trim()) {
            fetchWebPage(currentUrl);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            if (activeTab === "search") {
                handleSearch();
            } else {
                handleUrlSubmit();
            }
        }
    };

    const extractUrls = (text) => {
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        return text.match(urlRegex) || [];
    };

    const renderSearchResults = () => {
        if (!searchResults) return null;

        const urls = extractUrls(searchResults);
        const parts = searchResults.split(/(https?:\/\/[^\s]+)/g);

        return (
            <div style={styles.resultsContent}>
                {parts.map((part, idx) => {
                    if (urls.includes(part)) {
                        return (
                            <span
                                key={idx}
                                style={styles.link}
                                onClick={() => fetchWebPage(part)}
                            >
                                {part}
                            </span>
                        );
                    }
                    return <span key={idx}>{part}</span>;
                })}
            </div>
        );
    };

    const styles = {
        container: {
            height: '100vh',
            width: '100%',
            backgroundColor: '#f5f5f5',
        },
        browserContainer: {
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            padding: '15px',
            gap: '15px',
            overflow: 'hidden',
        },
        tabBar: {
            display: 'flex',
            gap: '5px',
            backgroundColor: 'white',
            padding: '10px 10px 0 10px',
            borderRadius: '8px 8px 0 0',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        },
        tab: {
            padding: '10px 20px',
            backgroundColor: '#f0f0f0',
            border: 'none',
            borderRadius: '8px 8px 0 0',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            transition: 'background-color 0.2s',
        },
        activeTab: {
            padding: '10px 20px',
            backgroundColor: 'white',
            border: 'none',
            borderRadius: '8px 8px 0 0',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            borderBottom: '3px solid #007bff',
        },
        searchSection: {
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: activeTab === "search" ? '0 8px 8px 8px' : '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        },
        urlBar: {
            display: 'flex',
            gap: '10px',
            alignItems: 'center',
            backgroundColor: 'white',
            padding: '15px',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            marginBottom: '10px',
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
        urlInput: {
            flex: 1,
            padding: '10px 16px',
            fontSize: '14px',
            border: '2px solid #e0e0e0',
            borderRadius: '20px',
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
        goButton: {
            padding: '10px 24px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '20px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            transition: 'background-color 0.2s',
        },
        backButton: {
            padding: '10px 20px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            transition: 'background-color 0.2s',
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
        link: {
            color: '#007bff',
            cursor: 'pointer',
            textDecoration: 'underline',
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
        historySection: {
            backgroundColor: 'white',
            padding: '15px',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            maxHeight: '200px',
            overflow: 'auto',
        },
        historyItem: {
            padding: '8px 12px',
            fontSize: '13px',
            borderBottom: '1px solid #f0f0f0',
            cursor: 'pointer',
            transition: 'background-color 0.2s',
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
                    opacity: 0.9;
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
            <div style={styles.browserContainer}>
                <h2 style={{ margin: '0 0 10px 0', color: '#333' }}>🌨️ SnowAI Browser</h2>
                
                {/* Tab Bar */}
                <div style={styles.tabBar}>
                    <button
                        style={activeTab === "search" ? styles.activeTab : styles.tab}
                        onClick={() => setActiveTab("search")}
                    >
                        🔍
                    </button>
                    <button
                        style={activeTab === "page" ? styles.activeTab : styles.tab}
                        onClick={() => setActiveTab("page")}
                    >
                        🌐
                    </button>
                </div>

                {/* Search Tab */}
                {activeTab === "search" && (
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
                )}

                {/* Page Viewer Tab */}
                {activeTab === "page" && (
                    <div style={styles.urlBar}>
                        <button
                            style={styles.backButton}
                            onClick={() => setActiveTab("search")}
                        >
                            ← Back
                        </button>
                        <input
                            type="text"
                            placeholder="Enter URL (e.g., https://example.com)"
                            value={currentUrl}
                            onChange={(e) => setCurrentUrl(e.target.value)}
                            onKeyPress={handleKeyPress}
                            style={styles.urlInput}
                            disabled={isLoading}
                        />
                        <button 
                            onClick={handleUrlSubmit}
                            style={styles.goButton}
                            disabled={isLoading || !currentUrl.trim()}
                        >
                            {isLoading ? 'Loading...' : 'Go'}
                        </button>
                    </div>
                )}

                {/* Results Section */}
                <div style={styles.resultsSection}>
                    <h3 style={styles.resultsTitle}>
                        {activeTab === "search" ? "Search Results" : "Page Content"}
                    </h3>
                    
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

                    {!isLoading && !error && activeTab === "search" && !searchResults && (
                        <div style={styles.emptyState}>
                            <div style={styles.emptyStateIcon}>🔍</div>
                            <p>Enter a search query above to get AI-powered search results</p>
                            <p style={{ fontSize: '13px', marginTop: '10px' }}>Click on any URL in the results to view the page!</p>
                        </div>
                    )}

                    {!isLoading && !error && activeTab === "page" && !pageContent && (
                        <div style={styles.emptyState}>
                            <div style={styles.emptyStateIcon}>🌐</div>
                            <p>Enter a URL above to fetch and view web content</p>
                            <p style={{ fontSize: '13px', marginTop: '10px' }}>AI will summarize and display the page for you</p>
                        </div>
                    )}

                    {!isLoading && !error && activeTab === "search" && searchResults && renderSearchResults()}

                    {!isLoading && !error && activeTab === "page" && pageContent && (
                        <div style={styles.resultsContent}>
                            <div style={{ marginBottom: '15px', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '6px', fontSize: '13px' }}>
                                <strong>Viewing:</strong> {currentUrl}
                            </div>
                            {pageContent}
                        </div>
                    )}
                </div>

                {/* History Section */}
                {history.length > 0 && (
                    <div style={styles.historySection}>
                        <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#666' }}>📜 History</h4>
                        {history.slice().reverse().map((item, idx) => (
                            <div 
                                key={idx} 
                                style={styles.historyItem}
                                onClick={() => {
                                    if (item.type === "search") {
                                        setSearchQuery(item.query);
                                        setActiveTab("search");
                                    } else {
                                        fetchWebPage(item.url);
                                    }
                                }}
                            >
                                {item.type === "search" ? `🔍 ${item.query}` : `🌐 ${item.url}`}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
        </div>
    );
}