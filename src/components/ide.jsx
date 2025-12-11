import React, { useEffect, useState, useRef } from "react";
import Header from "./header";
import SideNavs from "./side_navs";
import Cookies from 'js-cookie';

export default function SnowAIIDE() {
    const baseUrl = 'https://backend-production-c0ab.up.railway.app';
    const editorRef = useRef(null);
    const monacoRef = useRef(null);
    
    const [files, setFiles] = useState([
        { id: 1, name: 'index.js', content: '// Welcome to SnowAI IDE\nconsole.log("Hello World!");', language: 'javascript' }
    ]);
    const [activeFile, setActiveFile] = useState(files[0]);
    const [showGitPanel, setShowGitPanel] = useState(false);
    const [showGitSetup, setShowGitSetup] = useState(false);
    const [gitCommand, setGitCommand] = useState('');
    const [gitOutput, setGitOutput] = useState([]);
    const [theme, setTheme] = useState('vs-dark');
    const [userId] = useState(() => Cookies.get('userId') || Math.random().toString(36).substr(2, 9));
    const [repoInitialized, setRepoInitialized] = useState(false);
    const [gitConfig, setGitConfig] = useState({ name: '', email: '', repoUrl: '' });

    useEffect(() => {
        Cookies.set('userId', userId);
    }, [userId]);

    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs/loader.min.js';
        script.async = true;
        script.onload = () => {
            window.require.config({ paths: { vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs' } });
            window.require(['vs/editor/editor.main'], () => {
                if (editorRef.current) {
                    monacoRef.current = window.monaco.editor.create(editorRef.current, {
                        value: activeFile.content,
                        language: activeFile.language,
                        theme: theme,
                        automaticLayout: true,
                        fontSize: 14,
                        minimap: { enabled: true },
                        scrollBeyondLastLine: false,
                    });

                    monacoRef.current.onDidChangeModelContent(() => {
                        const updatedContent = monacoRef.current.getValue();
                        setFiles(prev => prev.map(f => 
                            f.id === activeFile.id ? { ...f, content: updatedContent } : f
                        ));
                    });
                }
            });
        };
        document.body.appendChild(script);

        return () => {
            if (monacoRef.current) {
                monacoRef.current.dispose();
            }
        };
    }, []);

    useEffect(() => {
        if (monacoRef.current && activeFile) {
            const model = monacoRef.current.getModel();
            monacoRef.current.setValue(activeFile.content);
            window.monaco.editor.setModelLanguage(model, activeFile.language);
        }
    }, [activeFile]);

    const initializeGit = async () => {
        try {
            // Configure git user
            await fetch(`${baseUrl}/api/git/configure/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId,
                    gitName: gitConfig.name,
                    gitEmail: gitConfig.email
                })
            });

            // Initialize or clone repo
            const response = await fetch(`${baseUrl}/api/git/init/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId,
                    repoUrl: gitConfig.repoUrl || null
                })
            });

            const data = await response.json();
            
            if (data.success) {
                setRepoInitialized(true);
                setShowGitSetup(false);
                setGitOutput(prev => [...prev, '✓ Git initialized successfully', data.output]);
                
                // Load files if cloned
                if (gitConfig.repoUrl) {
                    loadRepositoryFiles();
                }
            } else {
                setGitOutput(prev => [...prev, `✗ Error: ${data.error}`]);
            }
        } catch (error) {
            setGitOutput(prev => [...prev, `✗ Error: ${error.message}`]);
        }
    };

    const loadRepositoryFiles = async () => {
        try {
            const response = await fetch(`${baseUrl}/api/git/files/${userId}/`);
            const data = await response.json();
            
            if (data.files && data.files.length > 0) {
                const loadedFiles = data.files.map((file, index) => ({
                    id: Date.now() + index,
                    name: file.name,
                    content: file.content,
                    language: getLanguageFromExtension(file.name)
                }));
                setFiles(loadedFiles);
                setActiveFile(loadedFiles[0]);
            }
        } catch (error) {
            console.error('Error loading files:', error);
        }
    };

    const getLanguageFromExtension = (fileName) => {
        const ext = fileName.split('.').pop();
        const langMap = { 
            js: 'javascript', 
            py: 'python', 
            html: 'html', 
            css: 'css', 
            json: 'json', 
            md: 'markdown',
            jsx: 'javascript',
            ts: 'typescript',
            tsx: 'typescript'
        };
        return langMap[ext] || 'plaintext';
    };

    const executeGitCommand = async () => {
        if (!gitCommand.trim()) return;
        
        if (!repoInitialized) {
            setGitOutput(prev => [...prev, `$ ${gitCommand}`, '✗ Please initialize Git first']);
            setGitCommand('');
            return;
        }

        setGitOutput(prev => [...prev, `$ git ${gitCommand}`]);
        
        try {
            // Save current file before git operations
            await saveCurrentFile();

            const response = await fetch(`${baseUrl}/api/git/command/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId,
                    command: gitCommand
                })
            });

            const data = await response.json();
            
            if (data.success) {
                setGitOutput(prev => [...prev, data.output || '✓ Command executed successfully']);
            } else {
                setGitOutput(prev => [...prev, `✗ ${data.error}`]);
            }
        } catch (error) {
            setGitOutput(prev => [...prev, `✗ Error: ${error.message}`]);
        }
        
        setGitCommand('');
    };

    const saveCurrentFile = async () => {
        if (!repoInitialized) return;

        try {
            await fetch(`${baseUrl}/api/git/save-file/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId,
                    fileName: activeFile.name,
                    content: activeFile.content
                })
            });
        } catch (error) {
            console.error('Error saving file:', error);
        }
    };

    const createNewFile = () => {
        const fileName = prompt('Enter file name (with extension):');
        if (fileName) {
            const newFile = {
                id: Date.now(),
                name: fileName,
                content: '',
                language: getLanguageFromExtension(fileName)
            };
            setFiles([...files, newFile]);
            setActiveFile(newFile);
        }
    };

    const deleteFile = (fileId) => {
        if (files.length === 1) {
            alert('Cannot delete the last file!');
            return;
        }
        const newFiles = files.filter(f => f.id !== fileId);
        setFiles(newFiles);
        if (activeFile.id === fileId) {
            setActiveFile(newFiles[0]);
        }
    };

    const downloadFile = () => {
        const blob = new Blob([activeFile.content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = activeFile.name;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div style={styles.container}>
            <div className="header">
                <Header />
            </div>
            <div className="main-page-body">
                <SideNavs />
                <div style={styles.ideContainer}>
                    <h5 style={styles.header}>SnowAI IDE</h5>
                    
                    <div style={styles.toolbar}>
                        <button style={styles.toolbarBtn} onClick={createNewFile}>+ New File</button>
                        <button style={styles.toolbarBtn} onClick={downloadFile}>💾 Download</button>
                        <button style={styles.toolbarBtn} onClick={saveCurrentFile}>
                            💾 Save to Repo
                        </button>
                        <button 
                            style={{...styles.toolbarBtn, ...(repoInitialized ? {} : styles.toolbarBtnWarning)}}
                            onClick={() => setShowGitSetup(!showGitSetup)}
                        >
                            ⚙️ {repoInitialized ? 'Git Config' : 'Setup Git'}
                        </button>
                        <button style={styles.toolbarBtn} onClick={() => setShowGitPanel(!showGitPanel)}>
                            🔗 Git Terminal
                        </button>
                        <select style={styles.themeSelect} value={theme} onChange={(e) => {
                            setTheme(e.target.value);
                            if (monacoRef.current) {
                                window.monaco.editor.setTheme(e.target.value);
                            }
                        }}>
                            <option value="vs-dark">Dark</option>
                            <option value="vs-light">Light</option>
                            <option value="hc-black">High Contrast</option>
                        </select>
                    </div>

                    {showGitSetup && (
                        <div style={styles.gitSetup}>
                            <h6 style={styles.setupHeader}>Git Configuration</h6>
                            <input
                                type="text"
                                placeholder="Your Name"
                                value={gitConfig.name}
                                onChange={(e) => setGitConfig({...gitConfig, name: e.target.value})}
                                style={styles.setupInput}
                            />
                            <input
                                type="email"
                                placeholder="your.email@example.com"
                                value={gitConfig.email}
                                onChange={(e) => setGitConfig({...gitConfig, email: e.target.value})}
                                style={styles.setupInput}
                            />
                            <input
                                type="text"
                                placeholder="GitHub Repo URL (optional)"
                                value={gitConfig.repoUrl}
                                onChange={(e) => setGitConfig({...gitConfig, repoUrl: e.target.value})}
                                style={styles.setupInput}
                            />
                            <button style={styles.setupBtn} onClick={initializeGit}>
                                {gitConfig.repoUrl ? 'Clone Repository' : 'Initialize Git'}
                            </button>
                        </div>
                    )}

                    <div style={styles.editorLayout}>
                        <div style={styles.fileExplorer}>
                            <div style={styles.explorerHeader}>FILES</div>
                            {files.map(file => (
                                <div
                                    key={file.id}
                                    style={{
                                        ...styles.fileItem,
                                        ...(activeFile.id === file.id ? styles.activeFile : {})
                                    }}
                                    onClick={() => setActiveFile(file)}
                                >
                                    <span>{file.name}</span>
                                    <button
                                        style={styles.deleteBtn}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            deleteFile(file.id);
                                        }}
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div style={styles.editorWrapper}>
                            <div style={styles.editorHeader}>
                                {activeFile.name}
                            </div>
                            <div ref={editorRef} style={styles.editor}></div>
                        </div>

                        {showGitPanel && (
                            <div style={styles.gitPanel}>
                                <div style={styles.gitHeader}>
                                    Git Terminal
                                    {!repoInitialized && (
                                        <span style={styles.warningBadge}>Not Initialized</span>
                                    )}
                                </div>
                                <div style={styles.gitOutput}>
                                    {gitOutput.length === 0 && (
                                        <div style={styles.outputLine}>
                                            Welcome to Git Terminal! {repoInitialized ? 'Ready for commands.' : 'Please setup Git first.'}
                                        </div>
                                    )}
                                    {gitOutput.map((line, i) => (
                                        <div key={i} style={styles.outputLine}>{line}</div>
                                    ))}
                                </div>
                                <div style={styles.gitInput}>
                                    <span style={styles.prompt}>$</span>
                                    <input
                                        type="text"
                                        value={gitCommand}
                                        onChange={(e) => setGitCommand(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && executeGitCommand()}
                                        placeholder="status, add ., commit -m 'message', push, pull..."
                                        style={styles.commandInput}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

const styles = {
    container: {
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
    },
    ideContainer: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        padding: '20px',
        backgroundColor: '#1e1e1e',
        color: '#d4d4d4',
        overflow: 'hidden',
    },
    header: {
        margin: '0 0 15px 0',
        fontSize: '24px',
        fontWeight: 'bold',
        color: '#fff',
    },
    toolbar: {
        display: 'flex',
        gap: '10px',
        marginBottom: '15px',
        padding: '10px',
        backgroundColor: '#252526',
        borderRadius: '5px',
        flexWrap: 'wrap',
    },
    toolbarBtn: {
        padding: '8px 16px',
        backgroundColor: '#0e639c',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '500',
    },
    toolbarBtnWarning: {
        backgroundColor: '#d97706',
    },
    themeSelect: {
        marginLeft: 'auto',
        padding: '8px',
        backgroundColor: '#3c3c3c',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    },
    gitSetup: {
        padding: '15px',
        backgroundColor: '#252526',
        borderRadius: '5px',
        marginBottom: '15px',
    },
    setupHeader: {
        margin: '0 0 15px 0',
        fontSize: '16px',
        fontWeight: 'bold',
    },
    setupInput: {
        width: '100%',
        padding: '10px',
        marginBottom: '10px',
        backgroundColor: '#3c3c3c',
        border: '1px solid #555',
        borderRadius: '4px',
        color: '#fff',
        fontSize: '14px',
    },
    setupBtn: {
        padding: '10px 20px',
        backgroundColor: '#0e639c',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '500',
        width: '100%',
    },
    editorLayout: {
        display: 'flex',
        flex: 1,
        gap: '10px',
        overflow: 'hidden',
    },
    fileExplorer: {
        width: '200px',
        backgroundColor: '#252526',
        borderRadius: '5px',
        overflow: 'auto',
    },
    explorerHeader: {
        padding: '10px',
        fontSize: '12px',
        fontWeight: 'bold',
        color: '#888',
        borderBottom: '1px solid #3c3c3c',
    },
    fileItem: {
        padding: '8px 10px',
        cursor: 'pointer',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '14px',
        borderBottom: '1px solid #2d2d30',
    },
    activeFile: {
        backgroundColor: '#37373d',
        borderLeft: '3px solid #0e639c',
    },
    deleteBtn: {
        backgroundColor: 'transparent',
        border: 'none',
        color: '#888',
        cursor: 'pointer',
        fontSize: '16px',
        padding: '0 5px',
    },
    editorWrapper: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#1e1e1e',
        borderRadius: '5px',
        overflow: 'hidden',
    },
    editorHeader: {
        padding: '10px 15px',
        backgroundColor: '#252526',
        borderBottom: '1px solid #3c3c3c',
        fontSize: '14px',
        fontWeight: '500',
    },
    editor: {
        flex: 1,
        minHeight: 0,
    },
    gitPanel: {
        width: '350px',
        backgroundColor: '#1e1e1e',
        borderRadius: '5px',
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid #3c3c3c',
    },
    gitHeader: {
        padding: '10px 15px',
        backgroundColor: '#252526',
        borderBottom: '1px solid #3c3c3c',
        fontSize: '14px',
        fontWeight: 'bold',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    warningBadge: {
        padding: '2px 8px',
        backgroundColor: '#d97706',
        borderRadius: '3px',
        fontSize: '11px',
        fontWeight: 'normal',
    },
    gitOutput: {
        flex: 1,
        padding: '10px',
        overflowY: 'auto',
        fontFamily: 'monospace',
        fontSize: '13px',
        backgroundColor: '#0c0c0c',
    },
    outputLine: {
        marginBottom: '5px',
        color: '#d4d4d4',
        whiteSpace: 'pre-wrap',
    },
    gitInput: {
        display: 'flex',
        alignItems: 'center',
        padding: '10px',
        backgroundColor: '#252526',
        borderTop: '1px solid #3c3c3c',
    },
    prompt: {
        marginRight: '8px',
        color: '#4ec9b0',
        fontFamily: 'monospace',
        fontWeight: 'bold',
    },
    commandInput: {
        flex: 1,
        backgroundColor: 'transparent',
        border: 'none',
        color: '#d4d4d4',
        fontSize: '14px',
        fontFamily: 'monospace',
        outline: 'none',
    },
};
