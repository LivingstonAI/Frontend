import React, { useState } from "react";
import { 
  Folder, 
  FileCode, 
  FileJson, 
  FileType, 
  Github, 
  Terminal, 
  Play, 
  GitBranch, 
  Settings, 
  X,
  ChevronRight,
  ChevronDown,
  Plus // Added for creating new files
} from "lucide-react";
import Header from "./header";
import SideNavs from "./side_navs";
// ----------------------------------------------------------------

export default function SnowAIIDE() {
  const [activeTab, setActiveTab] = useState("script.js");
  const [terminalOpen, setTerminalOpen] = useState(true);
  const [sidebarMode, setSidebarMode] = useState("explorer"); // 'explorer' or 'git'
  const [gitConnected, setGitConnected] = useState(false);
  const [logs, setLogs] = useState([
    "> SnowAI IDE initialized...",
    "> Ready for input.",
  ]);

  // Mock File System
  const [files, setFiles] = useState({
    "script.js": {
      name: "script.js",
      language: "javascript",
      content: `// Welcome to SnowAI IDE
// Start coding your project here

function init() {
  console.log("SnowAI is active");
}

init();`,
    },
    "styles.css": {
      name: "styles.css",
      language: "css",
      content: `body {
  background-color: #ffffff;
  color: #333;
  font-family: 'Consolas', monospace;
}`,
    },
    "index.html": {
      name: "index.html",
      language: "html",
      content: `<!DOCTYPE html>
<html>
<head>
  <title>SnowAI Project</title>
</head>
<body>
  <div id="app"></div>
</body>
</html>`,
    },
    "package.json": {
      name: "package.json",
      language: "json",
      content: `{
  "name": "snow-ai-project",
  "version": "1.0.0",
  "main": "script.js"
}`,
    },
  });

  const activeFile = files[activeTab];

  // Handlers
  const handleFileClick = (fileName) => {
    setActiveTab(fileName);
  };

  const handleCodeChange = (e) => {
    const newContent = e.target.value;
    setFiles({
      ...files,
      [activeTab]: { ...files[activeTab], content: newContent },
    });
  };

  const handleRun = () => {
    const newLogs = [...logs, `> Running ${activeTab}...`, `> Execution complete.`];
    setLogs(newLogs);
  };

  // New File Handler
  const handleNewFile = () => {
    const fileName = prompt("Enter new file name (e.g., component.jsx):");
    if (fileName && !files[fileName]) {
      const ext = fileName.split('.').pop();
      setFiles({
        ...files,
        [fileName]: {
          name: fileName,
          language: ext || 'text',
          content: '// New file created'
        }
      });
      setActiveTab(fileName);
    } else if (files[fileName]) {
      alert("File already exists!");
    }
  };

  const handleGitConnect = () => {
    setLogs([...logs, "> Authenticating with GitHub...", "> Success: Connected to repo 'snow-ai-main'."]);
    setGitConnected(true);
  };

  const handleGitPush = () => {
    if (!gitConnected) return;
    setLogs([...logs, "> git add .", "> git commit -m 'Update via SnowAI'", "> git push origin main", "> Push successful 🚀"]);
  };

  // --- STYLES OBJECT (Blue/White Theme) ---
  const styles = {
    container: {
      display: "flex",
      flexDirection: "column",
      height: "100vh",
      backgroundColor: "#ffffff",
      color: "#333333",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
      overflow: "hidden",
    },
    mainPageBody: {
      display: "flex",
      flex: 1,
      overflow: "hidden", 
    },
    ideContainer: {
      display: "flex",
      flex: 1,
      backgroundColor: "#ffffff",
    },
    activityBar: {
      width: "50px",
      backgroundColor: "#004e8c", // Dark Blue
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      paddingTop: "10px",
      borderRight: "1px solid #003d6e",
    },
    activityIcon: (isActive) => ({
      color: isActive ? "#ffffff" : "#a8d1ff", // White active, Light Blue inactive
      marginBottom: "25px",
      cursor: "pointer",
      padding: "8px",
      borderLeft: isActive ? "2px solid white" : "2px solid transparent",
    }),
    sidebar: {
      width: "250px",
      backgroundColor: "#f3f9fc", // Very Light Blue/Gray
      display: "flex",
      flexDirection: "column",
      borderRight: "1px solid #e1e4e8",
    },
    sidebarHeader: {
      padding: "10px 20px",
      fontSize: "11px",
      fontWeight: "bold",
      textTransform: "uppercase",
      letterSpacing: "1px",
      color: "#005a9e", // Blue Text
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    fileExplorerItem: (isActive) => ({
      display: "flex",
      alignItems: "center",
      padding: "5px 10px",
      cursor: "pointer",
      backgroundColor: isActive ? "#dbeafe" : "transparent", // Light blue selection
      color: isActive ? "#004e8c" : "#333333",
      fontSize: "13px",
      borderLeft: isActive ? "3px solid #0078d4" : "3px solid transparent",
    }),
    editorArea: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      position: "relative",
      backgroundColor: "#ffffff",
    },
    tabBar: {
      display: "flex",
      backgroundColor: "#f3f9fc",
      overflowX: "auto",
      borderBottom: "1px solid #e1e4e8",
    },
    tab: (isActive) => ({
      display: "flex",
      alignItems: "center",
      padding: "10px 15px",
      backgroundColor: isActive ? "#ffffff" : "#e6f0f5",
      color: isActive ? "#0078d4" : "#666666",
      fontSize: "13px",
      cursor: "pointer",
      borderTop: isActive ? "2px solid #0078d4" : "2px solid transparent",
      borderRight: "1px solid #e1e4e8",
      borderLeft: "1px solid #e1e4e8",
    }),
    codeEditorInput: {
      flex: 1,
      backgroundColor: "#ffffff",
      color: "#1f1f1f", // Dark text for light theme
      border: "none",
      resize: "none",
      padding: "20px",
      fontFamily: "'Fira Code', 'Consolas', monospace",
      fontSize: "14px",
      lineHeight: "1.5",
      outline: "none",
      whiteSpace: "pre",
    },
    terminal: {
      height: terminalOpen ? "200px" : "30px",
      backgroundColor: "#f8f9fa",
      borderTop: "1px solid #e1e4e8",
      display: "flex",
      flexDirection: "column",
      transition: "height 0.2s ease",
    },
    terminalHeader: {
      display: "flex",
      justifyContent: "space-between",
      padding: "5px 15px",
      backgroundColor: "#f0f4f8",
      borderBottom: "1px solid #e1e4e8",
      fontSize: "12px",
      textTransform: "uppercase",
      cursor: "pointer",
      color: "#555",
    },
    terminalBody: {
      flex: 1,
      padding: "10px",
      overflowY: "auto",
      fontFamily: "'Consolas', monospace",
      fontSize: "13px",
      color: "#333333", // Dark terminal text
    },
    gitPanel: {
      padding: "20px",
      display: "flex",
      flexDirection: "column",
      gap: "10px",
    },
    buttonPrimary: {
      backgroundColor: "#0078d4",
      color: "white",
      border: "none",
      padding: "8px 12px",
      cursor: "pointer",
      fontSize: "12px",
      borderRadius: "2px",
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px'
    },
    buttonSecondary: {
        backgroundColor: "#e1e4e8",
        color: "#333",
        border: "none",
        padding: "8px 12px",
        cursor: "pointer",
        fontSize: "12px",
        borderRadius: "2px",
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px'
      },
    iconButton: {
      cursor: 'pointer',
      padding: '2px',
      borderRadius: '4px',
      color: '#005a9e'
    }
  };

  const getFileIcon = (filename) => {
    if (filename.endsWith("js")) return <FileCode size={14} color="#f0ad4e" />; // Orange/Yellow
    if (filename.endsWith("css")) return <FileType size={14} color="#0078d4" />; // Blue
    if (filename.endsWith("html")) return <FileCode size={14} color="#d9534f" />; // Red
    return <FileJson size={14} color="#5bc0de" />; // Teal
  };

  return (
    <div style={styles.container}>
      {/* 1. Header Area */}
      <div className="header">
        <Header />
      </div>

      {/* 2. Main Body with SideNav and IDE */}
      <div style={styles.mainPageBody}>
        {/* Your Existing Sidebar */}
        <SideNavs /> 

        {/* 3. The IDE Itself */}
        <div style={styles.ideContainer}>
          
          {/* A. Activity Bar */}
          <div style={styles.activityBar}>
            <div style={styles.activityIcon(sidebarMode === "explorer")} onClick={() => setSidebarMode("explorer")}>
              <Folder size={24} />
            </div>
            <div style={styles.activityIcon(sidebarMode === "git")} onClick={() => setSidebarMode("git")}>
              <Github size={24} />
            </div>
            <div style={styles.activityIcon(false)}>
                <Settings size={24} />
            </div>
          </div>

          {/* B. Sidebar (Explorer or Git) */}
          <div style={styles.sidebar}>
            {sidebarMode === "explorer" && (
              <>
                <div style={styles.sidebarHeader}>
                  <span>EXPLORER</span>
                  <div 
                    title="New File" 
                    style={styles.iconButton} 
                    onClick={handleNewFile}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#dbeafe'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <Plus size={16} />
                  </div>
                </div>
                
                {/* File List */}
                <div style={{ marginTop: "10px" }}>
                  <div style={{...styles.fileExplorerItem(false), fontWeight: 'bold'}}>
                     <ChevronDown size={14} style={{marginRight: 6}}/> SNOW-AI-PROJECT
                  </div>
                  {Object.values(files).map((file) => (
                    <div
                      key={file.name}
                      style={styles.fileExplorerItem(activeTab === file.name)}
                      onClick={() => handleFileClick(file.name)}
                    >
                      <span style={{ marginLeft: "20px", marginRight: "8px", display: 'flex', alignItems: 'center' }}>
                        {getFileIcon(file.name)}
                      </span>
                      {file.name}
                    </div>
                  ))}
                </div>
              </>
            )}

            {sidebarMode === "git" && (
              <>
                <div style={styles.sidebarHeader}>SOURCE CONTROL</div>
                <div style={styles.gitPanel}>
                  {!gitConnected ? (
                    <div style={{textAlign: 'center', color: '#666', fontSize: '13px'}}>
                        <Github size={40} style={{marginBottom: 10, color: '#0078d4'}}/>
                        <p style={{marginBottom: 10}}>Connect GitHub to manage your repositories directly from SnowAI.</p>
                        <button style={styles.buttonPrimary} onClick={handleGitConnect}>
                            Connect GitHub
                        </button>
                    </div>
                  ) : (
                    <>
                        <div style={{display: 'flex', alignItems: 'center', color: '#333', fontSize: '12px', marginBottom: '10px'}}>
                            <GitBranch size={14} style={{marginRight: 5}} /> main
                        </div>
                        <div style={{fontSize: '11px', color: '#666'}}>Changes</div>
                        <div style={{padding: '5px', backgroundColor: '#e1e4e8', fontSize: '12px', marginBottom: '10px', borderRadius: '4px'}}>
                            {activeTab} <span style={{color: '#d9534f', marginLeft: 5, fontWeight: 'bold'}}>M</span>
                        </div>
                        <input type="text" placeholder="Commit Message" style={{width: '100%', padding: '8px', backgroundColor: '#fff', border: '1px solid #ccc', color: '#333', marginBottom: '5px', borderRadius: '4px'}} />
                        <button style={styles.buttonPrimary} onClick={handleGitPush}>
                            Commit & Push
                        </button>
                    </>
                  )}
                </div>
              </>
            )}
          </div>

          {/* C. Main Editor Area */}
          <div style={styles.editorArea}>
            {/* Tabs */}
            <div style={styles.tabBar}>
              {Object.values(files).map((file) => (
                <div
                  key={file.name}
                  style={styles.tab(activeTab === file.name)}
                  onClick={() => setActiveTab(file.name)}
                >
                  <span style={{ marginRight: "8px", display: 'flex', alignItems: 'center' }}>{getFileIcon(file.name)}</span>
                  {file.name}
                  {activeTab === file.name && <X size={12} style={{ marginLeft: "10px" }} />}
                </div>
              ))}
            </div>

            {/* Code Input (Monaco Mimic) */}
            <textarea
              style={styles.codeEditorInput}
              value={activeFile?.content || ''}
              onChange={handleCodeChange}
              spellCheck="false"
              autoCapitalize="off"
              autoComplete="off"
            />

            {/* D. Integrated Terminal */}
            <div style={styles.terminal}>
              <div
                style={styles.terminalHeader}
                onClick={() => setTerminalOpen(!terminalOpen)}
              >
                <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
                    <Terminal size={12} />
                    <span>TERMINAL</span>
                </div>
                <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
                    <button style={{...styles.buttonSecondary, padding: '2px 8px', fontSize: '10px'}} onClick={(e) => { e.stopPropagation(); handleRun(); }}>
                        <Play size={10} /> RUN
                    </button>
                    {terminalOpen ? <ChevronDown size={14}/> : <ChevronRight size={14} />}
                </div>
              </div>
              
              {terminalOpen && (
                <div style={styles.terminalBody}>
                  {logs.map((log, index) => (
                    <div key={index} style={{ marginBottom: "4px" }}>
                      {log}
                    </div>
                  ))}
                  <div style={{ display: "flex", alignItems: "center", color: "#333" }}>
                    <span style={{ color: "#0078d4", marginRight: "8px" }}>➜</span>
                    <span style={{ color: "#005a9e", marginRight: "8px" }}>snow-ai</span>
                    <span style={{ animation: "blink 1s infinite" }}>|</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Global CSS for scrollbar and animations */}
      <style>{`
        ::-webkit-scrollbar {
          width: 10px;
          height: 10px;
        }
        ::-webkit-scrollbar-track {
          background: #f0f4f8; 
        }
        ::-webkit-scrollbar-thumb {
          background: #c1c1c1; 
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8; 
        }
        @keyframes blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}