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
  Plus,
  Menu,
  Sparkles,
  Eye,
  Loader
} from "lucide-react";
import Header from "./header";
import SideNavs from "./side_navs";

// --- MOCK COMPONENTS (Updated for Horizontal Layout) ---
const Header2 = ({ onMenuClick, isMobile }) => (
  <div style={{ height: '60px', background: '#0078d4', borderBottom: '1px solid #005a9e', display: 'flex', alignItems: 'center', padding: '0 20px', color: 'white', fontWeight: 'bold', justifyContent: 'space-between' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      {isMobile && (
        <Menu size={24} onClick={onMenuClick} style={{ cursor: 'pointer' }} />
      )}
      <span>SnowAI IDE / Code Editor</span>
    </div>
  </div>
);

// SIDE NAVS IS NOW HORIZONTAL
const SideNavs2 = () => (
  <div style={{ 
    height: '40px',
    background: '#e6f0f5',
    borderBottom: '1px solid #dbeafe', 
    display: 'flex', 
    alignItems: 'center', 
    padding: '0 20px', 
    color: '#333',
    overflowX: 'auto',
    whiteSpace: 'nowrap'
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
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [gitConnected, setGitConnected] = useState(false);
  const [logs, setLogs] = useState([
    "> SnowAI IDE initialized...",
    "> Judge0 code execution engine ready",
  ]);
  const [termInput, setTermInput] = useState("");
  const terminalEndRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const [OPENAI_API_KEY, setOPENAI_API_KEY] = useState("");
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [showAiPanel, setShowAiPanel] = useState(false);
  const [htmlPreview, setHtmlPreview] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const baseUrl = 'https://backend-production-c0ab.up.railway.app';
  
  // Judge0 API Configuration
  const JUDGE0_API = 'https://judge0-ce.p.rapidapi.com';
  const JUDGE0_API_KEY = 'YOUR_RAPIDAPI_KEY_HERE'; // Replace with your RapidAPI key
  
  // Language ID mapping for Judge0
  const languageIds = {
    'js': 63,         // Node.js
    'javascript': 63,
    'py': 71,         // Python 3
    'python': 71,
    'java': 62,       // Java
    'cpp': 54,        // C++ (GCC)
    'c': 50,          // C (GCC)
    'cs': 51,         // C#
    'go': 60,         // Go
    'rust': 73,       // Rust
    'rb': 72,         // Ruby
    'ruby': 72,
    'php': 68,        // PHP
    'swift': 83,      // Swift
    'kt': 78,         // Kotlin
    'kotlin': 78,
    'ts': 74,         // TypeScript
    'typescript': 74,
  };

  // Fetch API Key
  const fetchAPIKey = async () => {
    try {
      const response = await fetch(`${baseUrl}/get_openai_key`);
      if (!response.ok) throw new Error("Network response was not ok");
      const { OPENAI_API_KEY } = await response.json();
      setOPENAI_API_KEY(OPENAI_API_KEY);
    } catch (error) {
      console.error("Error fetching API key:", error);
      setLogs(prev => [...prev, `> Error fetching API key: ${error.message}`]);
    }
  };

  useEffect(() => {
    fetchAPIKey();
  }, []);

  // Detect mobile/tablet
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarOpen(false);
        setTerminalOpen(false);
      } else {
        setSidebarOpen(true);
        setTerminalOpen(true);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
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
      content: `// Welcome to SnowAI IDE with Judge0
// Click RUN to execute your code

function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log("Fibonacci sequence:");
for (let i = 0; i < 10; i++) {
  console.log(\`F(\${i}) = \${fibonacci(i)}\`);
}`,
    },
    "main.py": {
      name: "main.py",
      language: "python",
      content: `# Python script example
# Click RUN to execute with Judge0

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
  <style>
    body {
      font-family: Arial, sans-serif;
      padding: 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background: rgba(255,255,255,0.1);
      padding: 30px;
      border-radius: 10px;
      backdrop-filter: blur(10px);
    }
    h1 { margin-top: 0; }
    button {
      background: white;
      color: #667eea;
      border: none;
      padding: 10px 20px;
      border-radius: 5px;
      cursor: pointer;
      font-weight: bold;
    }
    button:hover { opacity: 0.8; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Welcome to SnowAI IDE</h1>
    <p>This is a live HTML preview with embedded styles and scripts!</p>
    <button onclick="showMessage()">Click Me</button>
    <div id="output"></div>
  </div>
  
  <script>
    function showMessage() {
      document.getElementById('output').innerHTML = '<p style="margin-top: 20px; font-size: 18px;">🎉 JavaScript is working!</p>';
    }
  </script>
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

  // Get language ID for Judge0
  const getLanguageId = (filename) => {
    const ext = filename.split('.').pop().toLowerCase();
    return languageIds[ext] || null;
  };

  // Execute code with Judge0
  const executeWithJudge0 = async (code, languageId) => {
    try {
      setIsExecuting(true);
      setLogs(prev => [...prev, `> Submitting code to Judge0...`]);

      // Step 1: Submit code
      const submitResponse = await fetch(`${JUDGE0_API}/submissions?base64_encoded=false&wait=false`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-RapidAPI-Key': JUDGE0_API_KEY,
          'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
        },
        body: JSON.stringify({
          source_code: code,
          language_id: languageId,
          stdin: '',
        })
      });

      if (!submitResponse.ok) {
        throw new Error(`Judge0 submission failed: ${submitResponse.status}`);
      }

      const { token } = await submitResponse.json();
      setLogs(prev => [...prev, `> Code submitted, waiting for results...`]);

      // Step 2: Poll for results
      let attempts = 0;
      const maxAttempts = 20;
      
      while (attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
        
        const resultResponse = await fetch(`${JUDGE0_API}/submissions/${token}?base64_encoded=false`, {
          headers: {
            'X-RapidAPI-Key': JUDGE0_API_KEY,
            'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
          }
        });

        if (!resultResponse.ok) {
          throw new Error(`Failed to get results: ${resultResponse.status}`);
        }

        const result = await resultResponse.json();
        
        // Status: 1 = In Queue, 2 = Processing, 3 = Accepted
        if (result.status.id > 2) {
          // Execution complete
          setLogs(prev => [...prev, `> Execution complete (${result.status.description})`]);
          
          if (result.stdout) {
            const outputLines = result.stdout.trim().split('\n');
            setLogs(prev => [...prev, '> Output:', ...outputLines.map(line => `  ${line}`)]);
          }
          
          if (result.stderr) {
            const errorLines = result.stderr.trim().split('\n');
            setLogs(prev => [...prev, '> Errors:', ...errorLines.map(line => `  ${line}`)]);
          }
          
          if (result.compile_output) {
            const compileLines = result.compile_output.trim().split('\n');
            setLogs(prev => [...prev, '> Compile output:', ...compileLines.map(line => `  ${line}`)]);
          }
          
          setLogs(prev => [...prev, `> Time: ${result.time}s | Memory: ${result.memory}KB`]);
          break;
        }
        
        attempts++;
        if (attempts >= maxAttempts) {
          setLogs(prev => [...prev, `> Execution timeout - taking too long`]);
        }
      }
      
    } catch (error) {
      setLogs(prev => [...prev, `> Judge0 Error: ${error.message}`]);
      setLogs(prev => [...prev, `> Tip: Make sure you have a valid RapidAPI key for Judge0`]);
    } finally {
      setIsExecuting(false);
    }
  };

  // Handlers
  const handleFileClick = (fileName) => {
    setActiveTab(fileName);
    if (isMobile) {
      setSidebarOpen(false);
    }
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
    
    if (file.name.endsWith('.html')) {
      // HTML execution - open in preview
      setLogs(prev => [...prev, `> Opening ${activeTab} in preview...`]);
      
      // Combine HTML with CSS and JS if they exist
      let fullHTML = file.content;
      
      // Inject CSS if exists
      if (files['styles.css']) {
        fullHTML = fullHTML.replace('</head>', `<style>${files['styles.css'].content}</style></head>`);
      }
      
      // Inject JS if exists
      if (files['script.js'] && !file.content.includes('<script>')) {
        fullHTML = fullHTML.replace('</body>', `<script>${files['script.js'].content}</script></body>`);
      }
      
      setHtmlPreview(fullHTML);
      setShowPreview(true);
      setLogs(prev => [...prev, `> Preview opened ✓`]);
      return;
    }
    
    // Check if we can execute with Judge0
    const languageId = getLanguageId(file.name);
    
    if (languageId) {
      setLogs(prev => [...prev, `> Running ${activeTab} with Judge0...`]);
      await executeWithJudge0(file.content, languageId);
    } else if (file.name.endsWith('.js')) {
      // Fallback to browser JavaScript execution
      setLogs(prev => [...prev, `> Running ${activeTab} in browser...`]);
      try {
        const originalLog = console.log;
        const capturedLogs = [];
        console.log = (...args) => {
          capturedLogs.push(args.join(' '));
        };
        
        eval(file.content);
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
      setLogs(prev => [...prev, `> Supported: .js, .py, .java, .cpp, .c, .go, .rust, .rb, .php`]);
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
          content: `// New file: ${fileName}\n\n`
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

  // AI Code Generation Handler
  const handleAiGenerate = async () => {
    if (!aiPrompt.trim()) {
      alert("Please enter a prompt for the AI");
      return;
    }

    if (!OPENAI_API_KEY) {
      setLogs(prev => [...prev, "> Error: API key not loaded yet"]);
      return;
    }

    setAiLoading(true);
    setLogs(prev => [...prev, `> AI: Generating code for "${aiPrompt.substring(0, 50)}..."`]);

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'You are a helpful coding assistant. Generate clean, working code based on user requests. Only return the code without explanations unless specifically asked.'
            },
            {
              role: 'user',
              content: `Generate code for: ${aiPrompt}\n\nCurrent file type: ${activeFile.language}`
            }
          ],
          temperature: 0.7,
          max_tokens: 2000
        })
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      const generatedCode = data.choices[0].message.content;

      // Clean up code blocks
      let cleanedCode = generatedCode;
      cleanedCode = cleanedCode.replace(/```[\w]*\n?/g, '');
      cleanedCode = cleanedCode.replace(/```/g, '');
      cleanedCode = cleanedCode.trim();

      setFiles({
        ...files,
        [activeTab]: { ...files[activeTab], content: cleanedCode },
      });

      setLogs(prev => [...prev, `> AI: Code generated successfully ✓`]);
      setShowAiPanel(false);
      setAiPrompt("");
    } catch (error) {
      setLogs(prev => [...prev, `> AI Error: ${error.message}`]);
    } finally {
      setAiLoading(false);
    }
  };

  // Terminal Input Handler
  const handleTerminalSubmit = (e) => {
    if (e.key === 'Enter') {
      const cmd = termInput.trim();
      if (!cmd) return;

      const newLogs = [...logs, `$ ${cmd}`];
      
      const parts = cmd.split(' ');
      const mainCmd = parts[0].toLowerCase();
      const args = parts.slice(1);
      
      switch(mainCmd) {
        case 'clear':
          setLogs([]);
          break;
          
        case 'ls':
          setLogs([...newLogs, ...Object.keys(files).map(f => `  ${f}`)]);
          break;
          
        case 'help':
          setLogs([...newLogs, 
            "Available commands:",
            "  ls                    - list files",
            "  clear                 - clear terminal",
            "  cat <file>            - view file content",
            "  run <file>            - execute file with Judge0",
            "  languages             - show supported languages",
            "  echo <text>           - print text",
            "  help                  - show this help"
          ]);
          break;
          
        case 'languages':
          setLogs([...newLogs,
            "Supported languages (via Judge0):",
            "  JavaScript (.js) - Node.js",
            "  Python (.py) - Python 3",
            "  Java (.java)",
            "  C++ (.cpp)",
            "  C (.c)",
            "  C# (.cs)",
            "  Go (.go)",
            "  Rust (.rust)",
            "  Ruby (.rb)",
            "  PHP (.php)",
            "  Swift (.swift)",
            "  Kotlin (.kt)",
            "  TypeScript (.ts)"
          ]);
          break;
          
        case 'cat':
          if (args.length === 0) {
            setLogs([...newLogs, "cat: missing file operand"]);
          } else if (files[args[0]]) {
            setLogs([...newLogs, ...files[args[0]].content.split('\n').map(line => `  ${line}`)]);
          } else {
            setLogs([...newLogs, `cat: ${args[0]}: No such file`]);
          }
          break;
          
        case 'run':
          if (args.length === 0) {
            setLogs([...newLogs, "run: missing file operand"]);
          } else if (files[args[0]]) {
            setActiveTab(args[0]);
            setTimeout(() => handleRun(), 100);
          } else {
            setLogs([...newLogs, `run: ${args[0]}: No such file`]);
          }
          break;
          
        case 'echo':
          setLogs([...newLogs, args.join(' ')]);
          break;
          
        default:
          setLogs([...newLogs, `command not found: ${mainCmd}`, `Type 'help' for available commands`]);
      }
      
      setTermInput('');
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
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
      position: "relative"
    },
    activityBar: {
      width: isMobile ? "0" : "50px",
      minWidth: isMobile ? "0" : "50px",
      backgroundColor: "#004e8c",
      display: isMobile ? "none" : "flex",
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
      width: sidebarOpen ? (isMobile ? "80%" : "250px") : "0",
      minWidth: sidebarOpen ? (isMobile ? "80%" : "200px") : "0",
      maxWidth: sidebarOpen ? (isMobile ? "80%" : "300px") : "0",
      backgroundColor: "#f3f9fc",
      display: "flex",
      flexDirection: "column",
      borderRight: "1px solid #e1e4e8",
      transition: "all 0.3s ease",
      overflow: "hidden",
      position: isMobile ? "absolute" : "relative",
      left: 0,
      top: 0,
      bottom: 0,
      zIndex: isMobile ? 1000 : "auto",
      boxShadow: isMobile && sidebarOpen ? "2px 0 8px rgba(0,0,0,0.1)" : "none"
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
      flexShrink: 0
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
      padding: isMobile ? "0 10px" : "0 15px",
      height: "100%",
      backgroundColor: isActive ? "#ffffff" : "#e6f0f5",
      color: isActive ? "#0078d4" : "#666666",
      fontSize: isMobile ? "12px" : "13px",
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
      padding: isMobile ? "10px" : "20px",
      fontFamily: "'Fira Code', 'Consolas', monospace",
      fontSize: isMobile ? "12px" : "14px",
      lineHeight: "1.5",
      outline: "none",
      whiteSpace: "pre",
      minHeight: "200px",
    },
    terminal: {
      height: terminalOpen ? (isMobile ? "200px" : "250px") : "35px",
      minHeight: terminalOpen ? (isMobile ? "200px" : "250px") : "35px",
      maxHeight: terminalOpen ? (isMobile ? "200px" : "250px") : "35px",
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
      fontSize: isMobile ? "10px" : "12px",
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
      fontSize: isMobile ? "11px" : "13px",
      color: "#333333",
      display: "flex",
      flexDirection: "column",
    },
    gitPanel: {
      padding: "20px",
      display: "flex",
      flexDirection: "column",
      gap: "10px",
      overflow: "auto"
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
      gap: '8px',
      opacity: isExecuting ? 0.6 : 1,
      pointerEvents: isExecuting ? 'none' : 'auto'
    },
    buttonSecondary: {
        backgroundColor: "#e1e4e8",
        color: "#333",
        border: "none",
        padding: isMobile ? "2px 6px" : "8px 12px",
        cursor: "pointer",
        fontSize: isMobile ? "9px" : "12px",
        borderRadius: "2px",
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: isMobile ? '4px' : '8px'
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
        fontSize: isMobile ? "11px" : "13px",
        outline: 'none',
        flex: 1,
        marginLeft: '8px'
    },
    mobileOverlay: {
      display: isMobile && sidebarOpen ? "block" : "none",
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0,0,0,0.3)",
      zIndex: 999
    },
    aiPanel: {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      backgroundColor: "#ffffff",
      border: "2px solid #0078d4",
      borderRadius: "8px",
      padding: "20px",
      width: isMobile ? "90%" : "500px",
      maxWidth: "90vw",
      boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
      zIndex: 2000,
      display: showAiPanel ? "flex" : "none",
      flexDirection: "column",
      gap: "15px"
    },
    aiOverlay: {
      display: showAiPanel ? "block" : "none",
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0,0,0,0.5)",
      zIndex: 1999
    },
    aiInput: {
      width: "100%",
      padding: "12px",
      border: "1px solid #e1e4e8",
      borderRadius: "4px",
      fontSize: "14px",
      fontFamily: "inherit",
      resize: "vertical",
      minHeight: "100px"
    },
    aiButtonGroup: {
      display: "flex",
      gap: "10px",
      justifyContent: "flex-end"
    },
    previewFrame: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      width: "100%",
      height: "100%",
      border: "none",
      backgroundColor: "white",
      zIndex: showPreview ? 10 : -1,
      display: showPreview ? "block" : "none"
    },
    previewHeader: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: "40px",
      backgroundColor: "#0078d4",
      color: "white",
      display: showPreview ? "flex" : "none",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 15px",
      zIndex: 11,
      fontSize: "14px",
      fontWeight: "bold"
    }
  };

  const getFileIcon = (filename) => {
    if (filename.endsWith("js")) return <FileCode size={14} color="#f0ad4e" />;
    if (filename.endsWith("py")) return <FileCode size={14} color="#3776ab" />;
    if (filename.endsWith("css")) return <FileType size={14} color="#0078d4" />;
    if (filename.endsWith("html")) return <FileCode size={14} color="#d9534f" />;
    if (filename.endsWith("java")) return <FileCode size={14} color="#007396" />;
    if (filename.endsWith("cpp") || filename.endsWith("c")) return <FileCode size={14} color="#00599c" />;
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
      <Header2 onMenuClick={toggleSidebar} isMobile={isMobile} />

      {/* 2. Top Navigation */}
      <SideNavs2 /> 

      {/* 3. The IDE Core */}
      <div style={styles.ideCore}>
        
        {/* Mobile overlay */}
        <div style={styles.mobileOverlay} onClick={toggleSidebar} />
        
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

        {/* B. Sidebar */}
        <div style={styles.sidebar}>
          {sidebarMode === "explorer" && (
            <>
              <div style={styles.sidebarHeader}>
                <span>EXPLORER</span>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <div 
                    title="New File" 
                    style={styles.iconButton} 
                    onClick={handleNewFile}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#dbeafe'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <Plus size={16} />
                  </div>
                  {isMobile && (
                    <div 
                      style={styles.iconButton} 
                      onClick={toggleSidebar}
                    >
                      <X size={16} />
                    </div>
                  )}
                </div>
              </div>
              
              <div style={{ marginTop: "10px", overflow: "auto", flex: 1 }}>
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
              <div style={styles.sidebarHeader}>
                <span>SOURCE CONTROL</span>
                {isMobile && (
                  <div 
                    style={styles.iconButton} 
                    onClick={toggleSidebar}
                  >
                    <X size={16} />
                  </div>
                )}
              </div>
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
          
          {/* HTML Preview */}
          <div style={styles.previewHeader}>
            <span>Preview: {activeTab}</span>
            <X size={20} style={{ cursor: 'pointer' }} onClick={() => setShowPreview(false)} />
          </div>
          {htmlPreview && (
            <iframe
              style={{...styles.previewFrame, top: showPreview ? '40px' : 0}}
              srcDoc={htmlPreview}
              title="HTML Preview"
              sandbox="allow-scripts allow-modals"
            />
          )}
          
          {/* AI Panel Overlay */}
          <div style={styles.aiOverlay} onClick={() => setShowAiPanel(false)} />
          
          {/* AI Panel */}
          <div style={styles.aiPanel}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <h3 style={{ margin: 0, color: '#0078d4', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={20} /> AI Code Generator
              </h3>
              <X size={20} style={{ cursor: 'pointer', color: '#666' }} onClick={() => setShowAiPanel(false)} />
            </div>
            <p style={{ margin: 0, fontSize: '13px', color: '#666', marginBottom: '10px' }}>
              Describe what code you want and AI will generate it for you in the current file.
            </p>
            <textarea
              style={styles.aiInput}
              placeholder="E.g., Create a function that calculates factorial recursively..."
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              disabled={aiLoading}
            />
            <div style={styles.aiButtonGroup}>
              <button 
                style={{...styles.buttonSecondary, padding: '8px 16px'}} 
                onClick={() => setShowAiPanel(false)}
                disabled={aiLoading}
              >
                Cancel
              </button>
              <button 
                style={{...styles.buttonPrimary, padding: '8px 16px'}} 
                onClick={handleAiGenerate}
                disabled={aiLoading}
              >
                {aiLoading ? 'Generating...' : 'Generate Code'}
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div style={styles.tabBar}>
            {isMobile && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0 10px',
                  cursor: 'pointer',
                  borderRight: '1px solid #e1e4e8',
                  backgroundColor: '#e6f0f5'
                }}
                onClick={toggleSidebar}
              >
                <Menu size={16} color="#0078d4" />
              </div>
            )}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0 10px',
                cursor: 'pointer',
                borderRight: '1px solid #e1e4e8',
                backgroundColor: '#e6f0f5',
                gap: '5px'
              }}
              onClick={() => setShowAiPanel(true)}
              title="AI Code Generator"
            >
              <Sparkles size={16} color="#0078d4" />
              {!isMobile && <span style={{ fontSize: '12px', color: '#0078d4', fontWeight: 'bold' }}>AI</span>}
            </div>
            {activeFile?.name.endsWith('.html') && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0 10px',
                  cursor: 'pointer',
                  borderRight: '1px solid #e1e4e8',
                  backgroundColor: '#e6f0f5',
                  gap: '5px'
                }}
                onClick={() => {
                  handleRun();
                }}
                title="Preview HTML"
              >
                <Eye size={16} color="#0078d4" />
                {!isMobile && <span style={{ fontSize: '12px', color: '#0078d4', fontWeight: 'bold' }}>Preview</span>}
              </div>
            )}
            {Object.values(files).map((file) => (
              <div
                key={file.name}
                style={styles.tab(activeTab === file.name)}
                onClick={() => setActiveTab(file.name)}
              >
                <span style={{ marginRight: "8px", display: 'flex', alignItems: 'center' }}>{getFileIcon(file.name)}</span>
                {file.name}
                {activeTab === file.name && !isMobile && <X size={12} style={{ marginLeft: "10px" }} />}
              </div>
            ))}
          </div>

          {/* Code Input */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}>
            <textarea
              style={{...styles.codeEditorInput, display: showPreview ? 'none' : 'block'}}
              value={activeFile?.content || ''}
              onChange={handleCodeChange}
              spellCheck="false"
              autoCapitalize="off"
              autoComplete="off"
            />
            <div id="js-output-area" style={{ padding: '10px', display: 'none' }}></div>
          </div>

          {/* D. Integrated Terminal */}
          <div style={styles.terminal}>
            <div
              style={styles.terminalHeader}
              onClick={() => setTerminalOpen(!terminalOpen)}
            >
              <div style={{display: 'flex', alignItems: 'center', gap: isMobile ? 5 : 10}}>
                  <Terminal size={12} />
                  <span>TERMINAL</span>
              </div>
              <div style={{display: 'flex', alignItems: 'center', gap: isMobile ? 5 : 10}}>
                  <button 
                    style={{...styles.buttonSecondary}} 
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      handleRun(); 
                    }}
                    disabled={isExecuting}
                  >
                      {isExecuting ? <Loader size={isMobile ? 8 : 10} className="spin" /> : <Play size={isMobile ? 8 : 10} />}
                      {isExecuting ? 'RUNNING' : 'RUN'}
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
                      autoFocus={!isMobile}
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
        * {
          box-sizing: border-box;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
    </div>
    </div>
  );
}