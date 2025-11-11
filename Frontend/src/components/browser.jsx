import React, { useState, useRef } from "react";
import Header from "./header";
import SideNavs from "./side_navs";

export default function SnowAIBrowser() {
    const [searchQuery, setSearchQuery] = useState("");
    const [currentUrl, setCurrentUrl] = useState("https://www.google.com");
    const [urlInput, setUrlInput] = useState("https://www.google.com");
    const [canGoBack, setCanGoBack] = useState(false);
    const [canGoForward, setCanGoForward] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const webviewRef = useRef(null);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            let url;
            if (searchQuery.includes('.') && !searchQuery.includes(' ')) {
                // Looks like a URL
                url = searchQuery.startsWith('http') 
                    ? searchQuery 
                    : `https://${searchQuery}`;
            } else {
                // Search query
                url = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;
            }
            navigateToUrl(url);
        }
    };

    const navigateToUrl = (url) => {
        setCurrentUrl(url);
        setUrlInput(url);
        if (webviewRef.current) {
            webviewRef.current.src = url;
        }
    };

    const handleUrlSubmit = (e) => {
        e.preventDefault();
        let url = urlInput;
        if (!url.startsWith('http')) {
            url = `https://${url}`;
        }
        navigateToUrl(url);
    };

    const goBack = () => {
        if (webviewRef.current && canGoBack) {
            webviewRef.current.goBack();
        }
    };

    const goForward = () => {
        if (webviewRef.current && canGoForward) {
            webviewRef.current.goForward();
        }
    };

    const reload = () => {
        if (webviewRef.current) {
            webviewRef.current.reload();
        }
    };

    const handleWebviewLoad = () => {
        setIsLoading(false);
        if (webviewRef.current) {
            setCanGoBack(webviewRef.current.canGoBack());
            setCanGoForward(webviewRef.current.canGoForward());
            setUrlInput(webviewRef.current.getURL());
        }
    };

    const handleWebviewStartLoad = () => {
        setIsLoading(true);
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
            gap: '10px',
        },
        toolbar: {
            display: 'flex',
            gap: '8px',
            alignItems: 'center',
            padding: '10px',
            backgroundColor: '#f5f5f5',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        },
        navButton: {
            padding: '8px 12px',
            backgroundColor: '#fff',
            border: '1px solid #ddd',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '16px',
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
        navButtonDisabled: {
            opacity: 0.4,
            cursor: 'not-allowed',
        },
        urlBar: {
            flex: 1,
            display: 'flex',
            gap: '8px',
        },
        urlInput: {
            flex: 1,
            padding: '10px 15px',
            fontSize: '14px',
            border: '1px solid #ddd',
            borderRadius: '6px',
            outline: 'none',
            backgroundColor: '#fff',
        },
        searchBar: {
            display: 'flex',
            gap: '8px',
            padding: '10px',
            backgroundColor: '#f5f5f5',
            borderRadius: '8px',
        },
        searchInput: {
            flex: 1,
            padding: '10px 15px',
            fontSize: '14px',
            border: '1px solid #ddd',
            borderRadius: '6px',
            outline: 'none',
            backgroundColor: '#fff',
        },
        button: {
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            transition: 'background-color 0.2s',
        },
        webviewContainer: {
            flex: 1,
            border: '1px solid #ddd',
            borderRadius: '8px',
            overflow: 'hidden',
            position: 'relative',
            backgroundColor: '#fff',
        },
        webview: {
            width: '100%',
            height: '100%',
            border: 'none',
        },
        loadingBar: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            backgroundColor: '#007bff',
            animation: 'loading 1.5s ease-in-out infinite',
        }
    };

    return (
        <div style={styles.container}>
            <style>{`
                @keyframes loading {
                    0% { transform: translateX(-100%); }
                    50% { transform: translateX(100%); }
                    100% { transform: translateX(-100%); }
                }
                .nav-button:hover:not(:disabled) {
                    background-color: #e9ecef;
                }
                .search-button:hover {
                    background-color: #0056b3;
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
                        {/* Navigation Toolbar */}
                        <div style={styles.toolbar}>
                            <button
                                onClick={goBack}
                                disabled={!canGoBack}
                                style={{
                                    ...styles.navButton,
                                    ...(!canGoBack ? styles.navButtonDisabled : {})
                                }}
                                className="nav-button"
                            >
                                ←
                            </button>
                            <button
                                onClick={goForward}
                                disabled={!canGoForward}
                                style={{
                                    ...styles.navButton,
                                    ...(!canGoForward ? styles.navButtonDisabled : {})
                                }}
                                className="nav-button"
                            >
                                →
                            </button>
                            <button
                                onClick={reload}
                                style={styles.navButton}
                                className="nav-button"
                            >
                                ↻
                            </button>
                            
                            <form onSubmit={handleUrlSubmit} style={styles.urlBar}>
                                <input
                                    type="text"
                                    value={urlInput}
                                    onChange={(e) => setUrlInput(e.target.value)}
                                    style={styles.urlInput}
                                    placeholder="Enter URL or search..."
                                />
                            </form>
                        </div>

                        {/* Search Bar */}
                        <form onSubmit={handleSearch} style={styles.searchBar}>
                            <input
                                type="text"
                                placeholder="Search the web or enter URL..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                style={styles.searchInput}
                            />
                            <button 
                                type="submit" 
                                style={styles.button}
                                className="search-button"
                            >
                                Search
                            </button>
                        </form>

                        {/* Browser View */}
                        <div style={styles.webviewContainer}>
                            {isLoading && <div style={styles.loadingBar} />}
                            <webview
                                ref={webviewRef}
                                src={currentUrl}
                                style={styles.webview}
                                onDidFinishLoad={handleWebviewLoad}
                                onDidStartLoading={handleWebviewStartLoad}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}