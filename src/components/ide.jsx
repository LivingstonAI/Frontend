import React, { useState, useEffect, useRef } from "react";
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
  Plus 
} from "lucide-react";
import Header from "./header";
import SideNavs from "./side_navs";

// --- MOCK COMPONENTS (Updated for Horizontal Layout) ---
const HeaderComponent = () => (
  <div style={{ height: '60px', background: '#0078d4', borderBottom: '1px solid #005a9e', display: 'flex', alignItems: 'center', padding: '0 20px', color: 'white', fontWeight: 'bold' }}>
    SnowAI IDE
  </div>
);

// SIDE NAVS IS NOW HORIZONTAL
const SideNavBars = () => (
  <div style={{ 
    height: '40px',
    background: '#e6f0f5',
    borderBottom: '1px solid #dbeafe', 
    display: 'flex', 
    alignItems: 'center', 
    padding: '0 20px', 
    color: '#333'
  }}>
    <div style={{fontWeight: 'bold', color: '#0078d4', marginRight: '20px', cursor: 'pointer'}}>Dashboard</div>
    <div style={{ color: '#005a9e', fontWeight: 'bold', marginRight: '20px', cursor: 'pointer' }}>IDE (Active)</div>
    <div style={{ cursor: 'pointer' }}>Settings</div>
  </div>
);
// ----------------------------------------------------------------

export default function SnowAIIDE() {
  const [activeTab, setActiveTab] = useState("script.js");
  const [terminalOpen, setTerminalOpen] = useState(true);
  const [sidebarMode, setSidebarMode] = useState("explorer"); 
  const [gitConnected, setGitConnected] = useState(false);
  const [logs, setLogs] = useState([
    "> SnowAI IDE initialized...",
    "> Loading Python interpreter...",
  ]);
  const [termInput, setTermInput] = useState("");
  const terminalEndRef = useRef(null);
  const [pyodideReady, setPyodideReady] = useState(false);
  const pyodideRef = useRef(null);

  // Load Pyodide for Python execution
  useEffect(() => {
    const loadPyodide = async () => {
      try {
        if (!window.loadPyodide) {
          const script = document.createElement('script');
          script.src = 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js';
          script.async = true;
          document.head.appendChild(script);
          
          await new Promise((resolve, reject) => {
            script.onload = resolve;
            script.onerror = reject;
          });
        }
        
        pyodideRef.current = await window.loadPyodide({
          indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/',
        });
        setPyodideReady(true);
        setLogs(prev => [...prev, "> Python interpreter ready ✓"]);
      } catch (error) {
        setLogs(prev => [...prev, `> Error loading Python: ${error.message}`]);
      }
    };

    loadPyodide();
  }, []);

  // Auto-scroll terminal
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs, terminalOpen]);

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
    "main.py": {
      name: "main.py",
      language: "python",
      content: `# Python script example
# Click RUN to execute

def greet(name):
    return f"Hello, {name}! Welcome to SnowAI IDE."

def calculate_fibonacci(n):
    if n <= 1:
        return n
    return calculate_fibonacci(n-1) + calculate_fibonacci(n-2)

# Main execution
print(greet("Developer"))
print("Fibonacci sequence:")
for i in range(10):
    print(f"F({i}) = {calculate_fibonacci(i)}")`,
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

  const handleRun = async () => {
    const file = files[activeTab];
    
    if (file.name.endsWith('.py')) {
      // Python execution
      if (!pyodideReady) {
        setLogs(prev => [...prev, `> Error: Python interpreter not ready yet. Please wait...`]);
        return;
      }
      
      setLogs(prev => [...prev, `> Running ${activeTab}...`]);
      
      try {
        // Redirect stdout to capture print statements
        await pyodideRef.current.runPythonAsync(`
import sys
from io import StringIO
sys.stdout = StringIO()
        `);
        
        // Run the user's code
        await pyodideRef.current.runPythonAsync(file.content);
        
        // Get the output
        const output = await pyodideRef.current.runPythonAsync(`
sys.stdout.getvalue()
        `);
        
        if (output) {
          const outputLines = output.split('\n').filter(line => line.trim());
          setLogs(prev => [...prev, ...outputLines.map(line => `  ${line}`)]);
        }
        
        setLogs(prev => [...prev, `> Execution complete ✓`]);
      } catch (error) {
        setLogs(prev => [...prev, `> Python Error: ${error.message}`]);
      }
    } else if (file.name.endsWith('.js')) {
      // JavaScript execution
      setLogs(prev => [...prev, `> Running ${activeTab}...`]);
      try {
        // Capture console.log
        const originalLog = console.log;
        const capturedLogs = [];
        console.log = (...args) => {
          capturedLogs.push(args.join(' '));
        };
        
        // Execute the code
        eval(file.content);
        
        // Restore console.log
        console.log = originalLog;
        
        if (capturedLogs.length > 0) {
          setLogs(prev => [...prev, ...capturedLogs.map(line => `  ${line}`)]);
        }
        
        setLogs(prev => [...prev, `> Execution complete ✓`]);
      } catch (error) {
        setLogs(prev => [...prev, `> JavaScript Error: ${error.message}`]);
      }
    } else {
      setLogs(prev => [...prev, `> Cannot execute ${file.language} files`]);
    }
  };

  const handleNewFile = () => {
    const fileName = prompt("Enter new file name (e.g., component.jsx):");
    if (fileName) {
      if (files[fileName]) {
         alert(`File "${fileName}" already exists!`);
         return;
      }
      const ext = fileName.split('.').pop();
      setFiles(prevFiles => ({
        ...prevFiles,
        [fileName]: {
          name: fileName,
          language: ext || 'text',
          content: `// New file: ${fileName}`
        }
      }));
      setActiveTab(fileName);
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

  // Terminal Input Handler
  const handleTerminalSubmit = (e) => {
    if (e.key === 'Enter') {
      const cmd = termInput.trim();
      if (!cmd) return;

      const newLogs = [...logs, `$ ${cmd}`];
      
      // Simple Mock Command Processing
      switch(cmd.toLowerCase()) {
        case 'clear':
            setLogs([]);
            break;
        case 'ls':
            setLogs([...newLogs, ...Object.keys(files).map(f => `  ${f}`)]);
            break;
        case 'help':
            setLogs([...newLogs, "Available commands: ls, clear, echo, help, python --version"]);
            break;
        case 'python --version':
            setLogs([...newLogs, pyodideReady ? "Python 3.11.3 (Pyodide)" : "Python interpreter not loaded"]);
            break;
        default:
            if (cmd.startsWith('echo ')) {
                setLogs([...newLogs, cmd.substring(5)]);
            } else {
                setLogs([...newLogs, `command not found: ${cmd}`]);
            }
      }
      setTermInput('');
    }
  };

  // --- STYLES OBJECT ---
  const styles = {
    container: {
      display: "flex",
      flexDirection: "column",
      height: "100vh",
      width: "100vw",
      backgroundColor: "#ffffff",
      color: "#333333",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
      overflow: "hidden", 
    },
    ideCore: {
      display: "flex",
      flexDirection: "row", 
      flex: 1,
      overflow: "hidden", 
    },
    activityBar: {
      width: "50px",
      minWidth: "50px", 
      backgroundColor: "#004e8c",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      paddingTop: "10px",
      borderRight: "1px solid #003d6e",
    },
    activityIcon: (isActive) => ({
      color: isActive ? "#ffffff" : "#a8d1ff",
      marginBottom: "25px",
      cursor: "pointer",
      padding: "8px",
      borderLeft: isActive ? "2px solid white" : "2px solid transparent",
    }),
    sidebar: {
      width: "250px",
      minWidth: "200px",
      maxWidth: "300px",
      backgroundColor: "#f3f9fc",
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
      color: "#005a9e",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    fileExplorerItem: (isActive) => ({
      display: "flex",
      alignItems: "center",
      padding: "5px 10px",
      cursor: "pointer",
      backgroundColor: isActive ? "#dbeafe" : "transparent",
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
      minWidth: 0,
    },
    tabBar: {
      display: "flex",
      backgroundColor: "#f3f9fc",
      overflowX: "auto",
      borderBottom: "1px solid #e1e4e8",
      height: "35px",
      flexShrink: 0,
    },
    tab: (isActive) => ({
      display: "flex",
      alignItems: "center",
      padding: "0 15px",
      height: "100%",
      backgroundColor: isActive ? "#ffffff" : "#e6f0f5",
      color: isActive ? "#0078d4" : "#666666",
      fontSize: "13px",
      cursor: "pointer",
      borderTop: isActive ? "2px solid #0078d4" : "2px solid transparent",
      borderRight: "1px solid #e1e4e8",
      borderLeft: "1px solid #e1e4e8",
      whiteSpace: "nowrap",
    }),
    codeEditorInput: {
      flex: 1,
      backgroundColor: "#ffffff",
      color: "#1f1f1f",
      border: "none",
      resize: "none",
      padding: "20px",
      fontFamily: "'Fira Code', 'Consolas', monospace",
      fontSize: "14px",
      lineHeight: "1.5",
      outline: "none",
      whiteSpace: "pre",
      minHeight: "300px",
    },
    terminal: {
      height: terminalOpen ? "250px" : "35px",
      minHeight: terminalOpen ? "250px" : "35px",
      maxHeight: terminalOpen ? "250px" : "35px",
      backgroundColor: "#f8f9fa",
      borderTop: "1px solid #e1e4e8",
      display: "flex",
      flexDirection: "column",
      transition: "height 0.2s ease",
      flexShrink: 0,
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
      height: "35px",
      alignItems: "center",
      flexShrink: 0,
    },
    terminalBody: {
      flex: 1,
      padding: "10px",
      overflowY: "auto",
      fontFamily: "'Consolas', monospace",
      fontSize: "13px",
      color: "#333333",
      display: "flex",
      flexDirection: "column",
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
    },
    terminalInput: {
        background: 'transparent',
        border: 'none',
        color: '#333',
        fontFamily: "'Consolas', monospace",
        fontSize: "13px",
        outline: 'none',
        flex: 1,
        marginLeft: '8px'
    }
  };

  const getFileIcon = (filename) => {
    if (filename.endsWith("js")) return <FileCode size={14} color="#f0ad4e" />;
    if (filename.endsWith("py")) return <FileCode size={14} color="#3776ab" />;
    if (filename.endsWith("css")) return <FileType size={14} color="#0078d4" />;
    if (filename.endsWith("html")) return <FileCode size={14} color="#d9534f" />;
    return <FileJson size={14} color="#5bc0de" />;
  };

  return (
    <div>
                <div className="header">
                    <Header />
                </div>
                <div className="main-page-body">
                    <SideNavs />
    <div style={styles.container}>
      {/* 1. Header Area */}
      <HeaderComponent />

      {/* 2. Top Navigation (SideNavs component moved here) */}
      <SideNavBars /> 

      {/* 3. The IDE Core: Activity Bar, Sidebar, Editor Area (Flex Row) */}
      <div style={styles.ideCore}>
        
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

          {/* Code Input */}
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
                
                {/* Interactive Terminal Line */}
                <div style={{ display: "flex", alignItems: "center", color: "#333" }}>
                  <span style={{ color: "#0078d4", marginRight: "0px" }}>➜</span>
                  <span style={{ color: "#005a9e", marginRight: "0px", marginLeft: "4px" }}>snow-ai</span>
                  <input 
                      type="text" 
                      style={styles.terminalInput}
                      value={termInput}
                      onChange={(e) => setTermInput(e.target.value)}
                      onKeyDown={handleTerminalSubmit}
                      autoFocus
                  />
                </div>
                <div ref={terminalEndRef} />
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Global CSS */}
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
      `}</style>
    </div>
    </div>
    </div>
  );
}