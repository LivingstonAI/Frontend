import React, { useEffect, useState } from "react";
import { Upload, FileText, Calendar, Eye, Trash2, Plus, Search, Download, BookOpen, Edit3, Copy } from "lucide-react";
import Header from "./header";
import SideNavs from "./side_navs";
import { Volume2, VolumeX, Pause, Play } from "lucide-react";

export default function PaperGPT() {
    const baseUrl = 'https://backend-production-c0ab.up.railway.app';
    const [OPENAI_API_KEY, setOPENAI_API_KEY] = useState("");
    const [papers, setPapers] = useState([]);
    const [selectedPaper, setSelectedPaper] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isSummarizing, setIsSummarizing] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [showFullSummary, setShowFullSummary] = useState(false);
    const [showFullNotes, setShowFullNotes] = useState(false);
    const [newPaper, setNewPaper] = useState({
        title: "",
        file: null,
        personalNotes: "",
        category: ""
    });

    const [editingNotes, setEditingNotes] = useState("");
    const [isEditingNotes, setIsEditingNotes] = useState(false);
    const [isUpdatingNotes, setIsUpdatingNotes] = useState('Update');

    // Add these state variables to your existing useState declarations:
    const [isReading, setIsReading] = useState(false);
    const [currentUtterance, setCurrentUtterance] = useState(null);
    const [readingType, setReadingType] = useState(null); // 'summary' or 'text'

    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");

    const searchInputFix = `
        .search-input {
            width: 100%;
            padding: 0.75rem 0.75rem 0.75rem 2.5rem;
            border: 2px solid #e2e8f0;
            border-radius: 12px;
            background: white;
            transition: all 0.2s ease;
            font-size: 0.875rem;
            color: #1e293b; /* Add this line for text visibility */
            font-family: inherit; /* Add this line */
        }

        .search-input::placeholder {
            color: #94a3b8; /* Add this for placeholder visibility */
        }
        `;

    const loadCategories = async () => {
    try {
        const response = await fetch(`${baseUrl}/paper-gpt/categories/`);
        if (response.ok) {
            const cats = await response.json();
            setCategories(cats);
        }
    } catch (error) {
        console.error('Error loading categories:', error);
    }
};

    const speak = (text, type) => {
    window.speechSynthesis.cancel();
    
    if (isReading && readingType === type) {
        setIsReading(false);
        setCurrentUtterance(null);
        setReadingType(null);
        return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Set British female voice
    const voices = window.speechSynthesis.getVoices();
    // const britishFemaleVoice = voices.find(voice => 
    //     voice.lang.includes('en-GB') && voice.name.toLowerCase().includes('female')
    // ) || voices.find(voice => 
    //     voice.lang.includes('en-GB')
    // ) || voices.find(voice => 
    //     voice.name.toLowerCase().includes('female')
    // );

    // Configure voice settings
    const englishVoice = voices.find(voice => 
      voice.lang.startsWith('en') && voice.name.includes('Natural')
    ) || voices.find(voice => voice.lang.startsWith('en')) || voices[0];
    
    if (englishVoice) {
      utterance.voice = englishVoice;
    };
    
    // if (britishFemaleVoice) {
    //     utterance.voice = britishFemaleVoice;
    // }
    
    utterance.rate = 0.8;
    utterance.pitch = 1;
    utterance.volume = 1;
    utterance.lang = 'en-GB';

    utterance.onstart = () => {
        setIsReading(true);
        setReadingType(type);
    };

    utterance.onend = () => {
        setIsReading(false);
        setCurrentUtterance(null);
        setReadingType(null);
    };

    utterance.onerror = () => {
        setIsReading(false);
        setCurrentUtterance(null);
        setReadingType(null);
    };

    setCurrentUtterance(utterance);
    window.speechSynthesis.speak(utterance);
};

        const stopSpeaking = () => {
            window.speechSynthesis.cancel();
            setIsReading(false);
            setCurrentUtterance(null);
            setReadingType(null);
        };

    const fetchAPIKey = async () => {
        try {
            const response = await fetch(`${baseUrl}/get_openai_key`);
            if (!response.ok) throw new Error("Network response was not ok");
            const { OPENAI_API_KEY } = await response.json();
            setOPENAI_API_KEY(OPENAI_API_KEY);
        } catch (error) {
            console.error("Error fetching API key:", error);
        }
    };

    // 3. Voice reader button component:
const VoiceButton = ({ text, type, label }) => (
    <button
        onClick={() => speak(text, type)}
        style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: isReading && readingType === type 
                ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' 
                : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '0.5rem 0.75rem',
            cursor: 'pointer',
            fontSize: '0.875rem',
            fontWeight: '500',
            transition: 'all 0.2s ease',
            boxShadow: '0 2px 8px 0 rgba(16, 185, 129, 0.3)'
        }}
        onMouseOver={(e) => {
            if (isReading && readingType === type) {
                e.target.style.background = 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)';
            } else {
                e.target.style.background = 'linear-gradient(135deg, #059669 0%, #047857 100%)';
            }
            e.target.style.transform = 'translateY(-1px)';
        }}
        onMouseOut={(e) => {
            if (isReading && readingType === type) {
                e.target.style.background = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
            } else {
                e.target.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
            }
            e.target.style.transform = 'translateY(0)';
        }}
    >
        {isReading && readingType === type ? (
            <>
                <VolumeX size={16} />
                Stop Reading
            </>
        ) : (
            <>
                <Volume2 size={16} />
                {label}
            </>
        )}
    </button>
);

    const copyToClipboard = async (text, type) => {
    try {
        await navigator.clipboard.writeText(text);
        // Optional: Add a temporary "Copied!" state if you want visual feedback
        alert('Text copied successfully!');
    } catch (error) {
        console.error('Failed to copy text:', error);
    }
};

const CopyButton = ({ text, label }) => (
    <button
        onClick={() => copyToClipboard(text)}
        style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '0.5rem 0.75rem',
            cursor: 'pointer',
            fontSize: '0.875rem',
            fontWeight: '500',
            transition: 'all 0.2s ease',
            boxShadow: '0 2px 8px 0 rgba(99, 102, 241, 0.3)'
        }}
        onMouseOver={(e) => {
            e.target.style.background = 'linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)';
            e.target.style.transform = 'translateY(-1px)';
        }}
        onMouseOut={(e) => {
            e.target.style.background = 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)';
            e.target.style.transform = 'translateY(0)';
        }}
    >
        <Copy size={16} />
        {label}
    </button>
);


        const downloadPDF = (paper) => {
        try {
            // Check if fileData exists
            if (!paper.fileData) {
                alert('PDF data is not available for this paper.');
                return;
            }

            // Check if fileData is properly formatted (should start with data:application/pdf;base64,)
            if (!paper.fileData.includes('data:application/pdf;base64,')) {
                alert('Invalid PDF data format.');
                return;
            }

            // Convert base64 to blob
            const base64Data = paper.fileData.split(',')[1]; // Remove data:application/pdf;base64, prefix
            
            if (!base64Data) {
                alert('No PDF data found after base64 prefix.');
                return;
            }

            const byteCharacters = atob(base64Data);
            const byteNumbers = new Array(byteCharacters.length);
            
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: 'application/pdf' });
            
            // Create download link
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = paper.fileName || `${paper.title}.pdf`;
            
            // Trigger download
            document.body.appendChild(link);
            link.click();
            
            // Cleanup
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            
        } catch (error) {
            console.error('Error downloading PDF:', error);
            alert('Error downloading PDF: ' + error.message);
        }
    };

    const savePaperToBackend = async (paper) => {
    try {
        const response = await fetch(`${baseUrl}/paper-gpt/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title: paper.title,
                fileName: paper.fileName,
                fileData: paper.fileData,
                fileSize: paper.fileSize,
                extractedText: paper.extractedText,
                category: paper.category,
                aiSummary: paper.aiSummary,
                personalNotes: paper.personalNotes
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error saving paper to backend:', error);
        throw error;
    }
};

const loadPapersFromBackend = async () => {
    try {
        const response = await fetch(`${baseUrl}/paper-gpt/`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const papers = await response.json();
        setPapers(papers);
    } catch (error) {
        console.error('Error loading papers from backend:', error);
        // Fallback to localStorage if backend fails
        loadPapers();
    }
};

const updatePaperNotesInBackend = async (paperId, notes) => {
    try {
        const response = await fetch(`${baseUrl}/paper-gpt/${paperId}/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                personalNotes: notes
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error updating notes in backend:', error);
        throw error;
    }
};

const updatePaperInBackend = async (paperId, updates) => {
    try {
        const response = await fetch(`${baseUrl}/paper-gpt/${paperId}/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updates)
        });
        // ... rest of function
    } catch (error) {
        // ... error handling
    }
};

const deletePaperFromBackend = async (paperId) => {
    try {
        const response = await fetch(`${baseUrl}/paper-gpt/${paperId}/`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error deleting paper from backend:', error);
        throw error;
    }
};

    const loadPapers = () => {
        const storedPapers = JSON.parse(localStorage.getItem('paperGPT_papers') || '[]');
        setPapers(storedPapers);
    };

    const savePapers = (updatedPapers) => {
        localStorage.setItem('paperGPT_papers', JSON.stringify(updatedPapers));
        setPapers(updatedPapers);
    };

        // Replace loadPapers() call in useEffect:
    useEffect(() => {
        console.log("Fetching API key...");
        fetchAPIKey();
        loadPapersFromBackend(); // Changed from loadPapers()
        loadCategories();
    }, []);

    const extractTextFromPDF = async (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = async function() {
                try {
                    // Load PDF.js from CDN
                    if (!window.pdfjsLib) {
                        const script = document.createElement('script');
                        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
                        document.head.appendChild(script);
                        
                        await new Promise((resolve) => {
                            script.onload = resolve;
                        });
                        
                        window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
                    }

                    const typedarray = new Uint8Array(reader.result);
                    const pdf = await window.pdfjsLib.getDocument(typedarray).promise;
                    let fullText = '';

                    // Extract text from all pages
                    for (let i = 1; i <= pdf.numPages; i++) {
                        const page = await pdf.getPage(i);
                        const textContent = await page.getTextContent();
                        const pageText = textContent.items.map(item => item.str).join(' ');
                        fullText += pageText + '\n\n';
                    }

                    resolve(fullText.trim());
                } catch (error) {
                    console.error('Error extracting PDF text:', error);
                    reject(new Error('Failed to extract text from PDF: ' + error.message));
                }
            };
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsArrayBuffer(file);
        });
    };

    const generateSummary = async (text) => {
        if (!OPENAI_API_KEY) {
            throw new Error("OpenAI API key not available");
        }

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
                        content: 'You are an academic research assistant. Provide concise, insightful summaries of research papers highlighting key findings, methodology, and implications.'
                    },
                    {
                        role: 'user',
                        content: `Please summarize this research paper: ${text}`
                    }
                ],
                max_tokens: 500,
                temperature: 0.7
            })
        });

        if (!response.ok) {
            throw new Error(`OpenAI API error: ${response.status}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;
    };

    const handleFileUpload = async () => {
    if (!newPaper.file || !newPaper.title) {
        alert("Please provide both a title and select a PDF file");
        return;
    }

    setIsUploading(true);
    setIsSummarizing(false);

    try {
        // Extract text from PDF
        const extractedText = await extractTextFromPDF(newPaper.file);
        
        setIsSummarizing(true);
        // Generate AI summary
        const summary = await generateSummary(extractedText);

        // Create new paper object - ADD THE CATEGORY HERE!
        const paper = {
            title: newPaper.title,
            fileName: newPaper.file.name,
            fileSize: newPaper.file.size,
            extractedText: extractedText,
            aiSummary: summary,
            personalNotes: newPaper.personalNotes || '',
            category: newPaper.category || '', // <- THIS WAS MISSING!
            fileData: await fileToBase64(newPaper.file)
        };

        console.log('Paper object with category:', paper); // Debug line

        // Save to backend first
        const savedPaper = await savePaperToBackend(paper);
        
        // Then update local state with the backend response (which includes the ID)
        const updatedPapers = [...papers, { ...paper, id: savedPaper.id }];
        setPapers(updatedPapers);

        // Reset form - make sure to reset category too
        setNewPaper({ title: "", file: null, personalNotes: "", category: "" });
        setShowUploadModal(false);
        
        // Reload categories in case a new one was added
        loadCategories();
        
    } catch (error) {
        console.error("Error processing paper:", error);
        alert("Error processing paper: " + error.message);
    } finally {
        setIsUploading(false);
        setIsSummarizing(false);
    }
};

    const fileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    };

    

    // Replace handleDeletePaper function:
const handleDeletePaper = async (paperId) => {
    if (window.confirm("Are you sure you want to delete this paper?")) {
        try {
            // Delete from backend first
            await deletePaperFromBackend(paperId);
            
            // Then update local state
            const updatedPapers = papers.filter(paper => paper.id !== paperId);
            setPapers(updatedPapers);
            
            if (selectedPaper && selectedPaper.id === paperId) {
                setSelectedPaper(null);
            }
        } catch (error) {
            console.error("Error deleting paper:", error);
            alert("Error deleting paper: " + error.message);
        }
    }
};

    // Replace updatePersonalNotes function:
const updatePersonalNotes = async (paperId, notes) => {
    setIsUpdatingNotes('Updating Notes...');
    try {
        // Update in backend first
        await updatePaperNotesInBackend(paperId, notes);
        
        // Then update local state
        const updatedPapers = papers.map(paper => 
            paper.id === paperId ? { ...paper, personalNotes: notes } : paper
        );
        setPapers(updatedPapers);
        
        if (selectedPaper && selectedPaper.id === paperId) {
            setSelectedPaper({ ...selectedPaper, personalNotes: notes });
        }
    } catch (error) {
        console.error("Error updating notes:", error);
        alert("Error updating notes: " + error.message);
    };
    setIsUpdatingNotes('Update');
};
    const filteredPapers = papers.filter(paper => {
    const matchesSearch = paper.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        paper.fileName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !categoryFilter || paper.category === categoryFilter;
    return matchesSearch && matchesCategory;
});

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // 4. Mobile crash prevention - add this to your search input:
const handleSearchChange = (e) => {
    try {
        setSearchTerm(e.target.value);
    } catch (error) {
        console.error('Search error:', error);
        // Fallback
        setSearchTerm("");
    }

};

// 7. Cleanup effect - add this useEffect:
useEffect(() => {
    return () => {
        // Cleanup speech synthesis when component unmounts
        window.speechSynthesis.cancel();
    };
}, []);

    useEffect(() => {
    setIsEditingNotes(false);
    setEditingNotes("");
    setShowFullNotes(false); // Add this line
}, [selectedPaper]);



    return (
        <>
            <style jsx>{`
                .paper-gpt-container {
                    min-height: 100vh;
                    background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                }
                
                .main-content {
                    flex: 1;
                    padding: 2rem;
                }
                
                .content-wrapper {
                    max-width: 88rem;
                    margin: 0 auto;
                }
                
                .header-section {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 2rem;
                    background: white;
                    padding: 1.5rem 2rem;
                    border-radius: 16px;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
                    border: 1px solid rgba(59, 130, 246, 0.1);
                }
                
                .main-title {
                    font-size: 2rem;
                    font-weight: 700;
                    color: #1e293b;
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                }
                
                .add-paper-btn {
                    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
                    color: white;
                    padding: 0.75rem 1.5rem;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    border: none;
                    cursor: pointer;
                    font-weight: 600;
                    transition: all 0.2s ease;
                    box-shadow: 0 4px 14px 0 rgba(59, 130, 246, 0.39);
                }
                
                .add-paper-btn:hover {
                    background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
                    transform: translateY(-2px);
                    box-shadow: 0 8px 25px 0 rgba(59, 130, 246, 0.5);
                }
                
                .grid-layout {
                    display: grid;
                    grid-template-columns: 1fr 2fr;
                    gap: 2rem;
                }
                
                @media (max-width: 1024px) {
                    .grid-layout {
                        grid-template-columns: 1fr;
                    }
                }
                
                .papers-list-card {
                    background: white;
                    border-radius: 16px;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
                    border: 1px solid rgba(59, 130, 246, 0.1);
                    overflow: hidden;
                }
                
                .search-section {
                    padding: 1.5rem;
                    border-bottom: 1px solid #e2e8f0;
                    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
                }
                
                .search-wrapper {
                    position: relative;
                }
                
                .search-icon {
                    position: absolute;
                    left: 12px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: #64748b;
                }
                
                .search-input {
                    width: 100%;
                    padding: 0.75rem 0.75rem 0.75rem 2.5rem;
                    border: 2px solid #e2e8f0;
                    border-radius: 12px;
                    background: white;
                    transition: all 0.2s ease;
                    font-size: 0.875rem;
                }
                
                .search-input:focus {
                    outline: none;
                    border-color: #3b82f6;
                    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
                }
                
                .papers-scroll {
                    max-height: 32rem;
                    overflow-y: auto;
                }
                
                .papers-scroll::-webkit-scrollbar {
                    width: 6px;
                }
                
                .papers-scroll::-webkit-scrollbar-track {
                    background: #f1f5f9;
                }
                
                .papers-scroll::-webkit-scrollbar-thumb {
                    background: #cbd5e1;
                    border-radius: 3px;
                }
                
                .papers-scroll::-webkit-scrollbar-thumb:hover {
                    background: #94a3b8;
                }
                
                .empty-state {
                    padding: 3rem;
                    text-align: center;
                    color: #64748b;
                }
                
                .empty-icon {
                    margin: 0 auto 1rem;
                    color: #cbd5e1;
                }
                
                .paper-item {
                    padding: 1.25rem;
                    border-bottom: 1px solid #f1f5f9;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    position: relative;
                }
                
                .paper-item:hover {
                    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
                }
                
                .paper-item.selected {
                    background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
                    border-color: #93c5fd;
                }
                
                .paper-item-content {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                }
                
                .paper-info {
                    flex: 1;
                }
                
                .paper-title {
                    font-weight: 600;
                    color: #1e293b;
                    margin-bottom: 0.5rem;
                    line-height: 1.4;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
                
                .paper-filename {
                    font-size: 0.875rem;
                    color: #64748b;
                    margin-bottom: 0.75rem;
                }
                
                .paper-meta {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    font-size: 0.75rem;
                    color: #94a3b8;
                }
                
                .meta-item {
                    display: flex;
                    align-items: center;
                    gap: 0.25rem;
                }
                
                .delete-btn {
                    color: #ef4444;
                    background: white;
                    border: 1px solid #fee2e2;
                    border-radius: 8px;
                    padding: 0.5rem;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    margin-left: 0.5rem;
                }
                
                .delete-btn:hover {
                    background: #fef2f2;
                    border-color: #fecaca;
                    color: #dc2626;
                }
                
                .details-card {
                    background: white;
                    border-radius: 16px;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
                    border: 1px solid rgba(59, 130, 246, 0.1);
                    overflow: hidden;
                }
                
                .details-content {
                    padding: 2rem;
                }
                
                .paper-header {
                    margin-bottom: 2rem;
                }
                
                .paper-detail-title {
                    font-size: 1.75rem;
                    font-weight: 700;
                    color: #1e293b;
                    margin-bottom: 1rem;
                    line-height: 1.3;
                }
                
                .paper-detail-meta {
                    display: flex;
                    align-items: center;
                    gap: 1.5rem;
                    font-size: 0.875rem;
                    color: #64748b;
                    flex-wrap: wrap;
                }
                
                .sections-container {
                    display: flex;
                    flex-direction: column;
                    gap: 2rem;
                }
                
                .section-title {
                    font-size: 1.25rem;
                    font-weight: 600;
                    color: #1e293b;
                    margin-bottom: 1rem;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }
                
                .status-dot {
                    width: 8px;
                    height: 8px;
                    background: #10b981;
                    border-radius: 50%;
                }
                
                .summary-content {
                    background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
                    padding: 1.5rem;
                    border-radius: 12px;
                    border: 1px solid #93c5fd;
                }
                
                .summary-text {
                    color: #1e293b;
                    line-height: 1.7;
                    font-size: 0.95rem;
                }
                
                .notes-textarea {
                    width: 100%;
                    height: 8rem;
                    padding: 1rem;
                    border: 2px solid #e2e8f0;
                    border-radius: 12px;
                    resize: none;
                    font-family: inherit;
                    font-size: 0.875rem;
                    line-height: 1.5;
                    transition: all 0.2s ease;
                }
                
                .notes-textarea:focus {
                    outline: none;
                    border-color: #3b82f6;
                    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
                }
                
                .extracted-text-preview {
                    background: #f8fafc;
                    padding: 1.5rem;
                    border-radius: 12px;
                    max-height: 12rem;
                    overflow-y: auto;
                    border: 1px solid #e2e8f0;
                }
                
                .extracted-text-preview::-webkit-scrollbar {
                    width: 6px;
                }
                
                .extracted-text-preview::-webkit-scrollbar-track {
                    background: #f1f5f9;
                }
                
                .extracted-text-preview::-webkit-scrollbar-thumb {
                    background: #cbd5e1;
                    border-radius: 3px;
                }
                
                .preview-text {
                    font-size: 0.825rem;
                    color: #64748b;
                    line-height: 1.6;
                    white-space: pre-wrap;
                }
                
                .empty-details {
                    padding: 4rem;
                    text-align: center;
                    color: #64748b;
                }
                
                .empty-details-icon {
                    margin: 0 auto 1rem;
                    color: #cbd5e1;
                }
                
                .modal-overlay {
                    position: fixed;
                    inset: 0;
                    background: rgba(0, 0, 0, 0.6);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 50;
                    backdrop-filter: blur(4px);
                }
                
                .modal-content {
                    background: white;
                    border-radius: 16px;
                    padding: 2rem;
                    width: 100%;
                    max-width: 28rem;
                    margin: 1rem;
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
                    border: 1px solid rgba(59, 130, 246, 0.1);
                }
                
                .modal-title {
                    font-size: 1.5rem;
                    font-weight: 700;
                    margin-bottom: 1.5rem;
                    color: #1e293b;
                }
                
                .form-group {
                    margin-bottom: 1.5rem;
                }
                
                .form-label {
                    display: block;
                    font-size: 0.875rem;
                    font-weight: 600;
                    color: #374151;
                    margin-bottom: 0.5rem;
                }
                
                .form-input {
                    width: 100%;
                    padding: 0.75rem;
                    border: 2px solid #e2e8f0;
                    border-radius: 12px;
                    font-size: 0.875rem;
                    transition: all 0.2s ease;
                }
                
                .form-input:focus {
                    outline: none;
                    border-color: #3b82f6;
                    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
                }
                
                .form-textarea {
                    width: 100%;
                    padding: 0.75rem;
                    border: 2px solid #e2e8f0;
                    border-radius: 12px;
                    resize: none;
                    font-family: inherit;
                    font-size: 0.875rem;
                    transition: all 0.2s ease;
                }
                
                .form-textarea:focus {
                    outline: none;
                    border-color: #3b82f6;
                    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
                }
                
                .modal-buttons {
                    display: flex;
                    gap: 1rem;
                    margin-top: 2rem;
                }
                
                .cancel-btn {
                    flex: 1;
                    padding: 0.75rem 1rem;
                    color: #64748b;
                    border: 2px solid #e2e8f0;
                    border-radius: 12px;
                    background: white;
                    cursor: pointer;
                    font-weight: 500;
                    transition: all 0.2s ease;
                }
                
                .cancel-btn:hover:not(:disabled) {
                    background: #f8fafc;
                    border-color: #cbd5e1;
                }
                
                .upload-btn {
                    flex: 1;
                    padding: 0.75rem 1rem;
                    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
                    color: white;
                    border: none;
                    border-radius: 12px;
                    cursor: pointer;
                    font-weight: 600;
                    transition: all 0.2s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                    box-shadow: 0 4px 14px 0 rgba(59, 130, 246, 0.39);
                }
                
                .upload-btn:hover:not(:disabled) {
                    background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
                    transform: translateY(-1px);
                    box-shadow: 0 8px 25px 0 rgba(59, 130, 246, 0.5);
                }
                
                .upload-btn:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                    transform: none;
                }
                
                .loading-spinner {
                    width: 1rem;
                    height: 1rem;
                    border: 2px solid white;
                    border-top-color: transparent;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }
                
                @keyframes spin {
                    to {
                        transform: rotate(360deg);
                    }
                }
                @media (max-width: 768px) {
                    .header-section {
                        display: block;
                    }
                    }
            `}</style>
            
            
            <div className="paper-gpt-container">
                <Header />
                <div>
                    <SideNavs />
                    <div className="main-content">
                        <div className="content-wrapper">
                            <div className="header-section">
                                <h1 className="main-title">
                                    <BookOpen size={32} style={{ color: '#3b82f6' }} />
                                    PaperGPT
                                </h1>
                                <button
                                    onClick={() => setShowUploadModal(true)}
                                    className="add-paper-btn"
                                >
                                    <Plus size={20} />
                                    Add Paper
                                </button>
                            </div>

                            <div className="grid-layout">
                                {/* Papers List */}
                                <div className="papers-list-card">
                                    <div className="search-section">
                                        <div className="search-wrapper">
                                            <Search className="search-icon" size={20} />
                                            <input
                                                type="text"
                                                placeholder="Search papers..."
                                                value={searchTerm}
                                                onChange={handleSearchChange}
                                                className="search-input"
                                                style={{
                                                    color: '#1e293b',
                                                    backgroundColor: 'white'
                                                }}
                                            />
                                        </div>
                                        {/* Add this category filter */}
                                        <div style={{ marginTop: '1rem' }}>
                                            <select
                                                value={categoryFilter}
                                                onChange={(e) => setCategoryFilter(e.target.value)}
                                                style={{
                                                    width: '100%',
                                                    padding: '0.75rem',
                                                    border: '2px solid #e2e8f0',
                                                    borderRadius: '12px',
                                                    background: 'white',
                                                    fontSize: '0.875rem',
                                                    color: '#1e293b'
                                                }}
                                            >
                                                <option value="">All Categories</option>
                                                {categories.map(cat => (
                                                    <option key={cat} value={cat}>{cat}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="papers-scroll">
                                        {filteredPapers.length === 0 ? (
                                            <div className="empty-state">
                                                <FileText size={48} className="empty-icon" />
                                                <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>No papers yet.</p>
                                                <p style={{ fontSize: '0.875rem' }}>Upload your first research paper to get started!</p>
                                            </div>
                                        ) : (
                                            filteredPapers.map((paper) => (
                                                <div
                                                    key={paper.id}
                                                    className={`paper-item ${selectedPaper?.id === paper.id ? 'selected' : ''}`}
                                                    onClick={() => setSelectedPaper(paper)}
                                                >
                                                    <div className="paper-item-content">
                                                        <div className="paper-info">
                                                            <h3 className="paper-title">
                                                                {paper.title}
                                                            </h3>
                                                            <p className="paper-filename">{paper.fileName}</p>
                                                            <div className="paper-meta">
                                                                <span className="meta-item">
                                                                    <Calendar size={12} />
                                                                    {formatDate(paper.uploadDate)}
                                                                </span>
                                                                <span>{formatFileSize(paper.fileSize)}</span>
                                                                {/* ADD THE CATEGORY HERE */}
                                                                {paper.category && (
                                                                    <span style={{
                                                                        background: '#8b5cf6',
                                                                        color: 'white',
                                                                        padding: '0.125rem 0.5rem',
                                                                        borderRadius: '8px',
                                                                        fontSize: '0.65rem'
                                                                    }}>
                                                                        {paper.category}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleDeletePaper(paper.id);
                                                            }}
                                                            className="delete-btn"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>

                                {/* Paper Details */}
                                <div className="details-card">
                                    {selectedPaper ? (
                                        <div className="details-content">
                                            <div className="paper-header">
                                                <h2 className="paper-detail-title">
                                                    {selectedPaper.title}
                                                </h2>
                                                <div className="paper-detail-meta">
                                                    <span className="meta-item">
                                                        <FileText size={16} />
                                                        {selectedPaper.fileName}
                                                    </span>
                                                    <span className="meta-item">
                                                        <Calendar size={16} />
                                                        {formatDate(selectedPaper.uploadDate)}
                                                    </span>
                                                    <span>{formatFileSize(selectedPaper.fileSize)}</span>
                                                    <span className="meta-item">
                                                    <button
                                                        onClick={() => downloadPDF(selectedPaper)}
                                                        style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '0.25rem',
                                                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                                            color: 'white',
                                                            border: 'none',
                                                            borderRadius: '8px',
                                                            padding: '0.5rem 0.75rem',
                                                            cursor: 'pointer',
                                                            fontSize: '0.875rem',
                                                            fontWeight: '500',
                                                            transition: 'all 0.2s ease',
                                                            boxShadow: '0 2px 8px 0 rgba(16, 185, 129, 0.3)'
                                                        }}
                                                        onMouseOver={(e) => {
                                                            e.target.style.background = 'linear-gradient(135deg, #059669 0%, #047857 100%)';
                                                            e.target.style.transform = 'translateY(-1px)';
                                                        }}
                                                        onMouseOut={(e) => {
                                                            e.target.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
                                                            e.target.style.transform = 'translateY(0)';
                                                        }}
                                                    >
                                                        <Download size={16} />
                                                        Download PDF
                                                    </button>
                                                </span>
                                                </div>
                                            </div>

                                            <div className="sections-container">
                                                {/* AI Summary */}
                                                 <div>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                                    <h3 className="section-title">
                                                        <div className="status-dot"></div>
                                                        AI Summary
                                                    </h3>
                                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                        <CopyButton text={selectedPaper.aiSummary} label="Copy" />
                                                        <VoiceButton 
                                                            text={selectedPaper.aiSummary} 
                                                            type="summary" 
                                                            label="Read Summary" 
                                                        />
                                                    </div>
                                                </div>
                                                {selectedPaper.category && (
                                                    <span className="meta-item" style={{
                                                        background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                                                        color: 'white',
                                                        padding: '0.25rem 0.75rem',
                                                        borderRadius: '12px',
                                                        fontSize: '0.75rem',
                                                        fontWeight: '500'
                                                    }}>
                                                        {selectedPaper.category}
                                                    </span>
                                                )}
                                                <div className="summary-content">
                                                    <p className="summary-text">
                                                        {showFullSummary 
                                                            ? selectedPaper.aiSummary 
                                                            : selectedPaper.aiSummary.length > 300 
                                                                ? selectedPaper.aiSummary.substring(0, 300) + "..." 
                                                                : selectedPaper.aiSummary
                                                        }
                                                    </p>
                                                    {selectedPaper.aiSummary.length > 300 && (
                                                        <button
                                                            onClick={() => setShowFullSummary(!showFullSummary)}
                                                            style={{
                                                                background: 'none',
                                                                border: 'none',
                                                                color: '#3b82f6',
                                                                cursor: 'pointer',
                                                                fontSize: '0.875rem',
                                                                fontWeight: '600',
                                                                textDecoration: 'underline'
                                                            }}
                                                        >
                                                            {showFullSummary ? 'Read Less' : 'Read More'}
                                                        </button>
                                                    )}
                                                </div>
                                            </div>

                                                {/* Personal Notes */}
                                                <div>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                                        <h3 className="section-title">Personal Notes</h3>
                                                        {!isEditingNotes ? (
                                                        <button
                                                            onClick={() => {
                                                                setIsEditingNotes(true);
                                                                setEditingNotes(selectedPaper.personalNotes || "");
                                                            }}
                                                            style={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: '0.5rem',
                                                                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                                                color: 'white',
                                                                border: 'none',
                                                                borderRadius: '8px',
                                                                padding: '0.5rem 0.75rem',
                                                                cursor: 'pointer',
                                                                fontSize: '0.875rem',
                                                                fontWeight: '500',
                                                                transition: 'all 0.2s ease',
                                                                boxShadow: '0 2px 8px 0 rgba(16, 185, 129, 0.3)'
                                                            }}
                                                            onMouseOver={(e) => {
                                                                e.target.style.background = 'linear-gradient(135deg, #059669 0%, #047857 100%)';
                                                                e.target.style.transform = 'translateY(-1px)';
                                                            }}
                                                            onMouseOut={(e) => {
                                                                e.target.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
                                                                e.target.style.transform = 'translateY(0)';
                                                            }}
                                                        >
                                                            <Edit3 size={16} />
                                                            Edit Notes
                                                        </button>
                                                        ) : (
                                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                                <button
                                                                    onClick={async () => {
                                                                        try {
                                                                            await updatePersonalNotes(selectedPaper.id, editingNotes);
                                                                            setIsEditingNotes(false);
                                                                        } catch (error) {
                                                                            console.error("Error saving notes:", error);
                                                                        }
                                                                    }}
                                                                    style={{
                                                                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                                                        color: 'white',
                                                                        border: 'none',
                                                                        borderRadius: '8px',
                                                                        padding: '0.5rem 0.75rem',
                                                                        cursor: 'pointer',
                                                                        fontSize: '0.875rem'
                                                                    }}
                                                                >
                                                                    {isUpdatingNotes}
                                                                </button>
                                                                <button
                                                                    onClick={() => {
                                                                        setIsEditingNotes(false);
                                                                        setEditingNotes("");
                                                                    }}
                                                                    style={{
                                                                        background: '#6b7280',
                                                                        color: 'white',
                                                                        border: 'none',
                                                                        borderRadius: '8px',
                                                                        padding: '0.5rem 0.75rem',
                                                                        cursor: 'pointer',
                                                                        fontSize: '0.875rem'
                                                                    }}
                                                                >
                                                                    Cancel
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                    {isEditingNotes ? (
                                                        <textarea
                                                            value={editingNotes}
                                                            onChange={(e) => setEditingNotes(e.target.value)}
                                                            placeholder="Add your personal notes about this paper..."
                                                            className="notes-textarea"
                                                        />
                                                    ) : (
                                                        <div>
                                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                                            <div></div>
                                                            {selectedPaper.personalNotes && (
                                                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                                    <CopyButton text={selectedPaper.personalNotes} label="Copy" />
                                                                    <VoiceButton 
                                                                        text={selectedPaper.personalNotes} 
                                                                        type="notes" 
                                                                        label="Read Notes" 
                                                                    />
                                                                </div>
                                                            )}
                                                        </div>
                                                            <div style={{
                                                                background: '#f8fafc',
                                                                padding: '1rem',
                                                                borderRadius: '12px',
                                                                border: '1px solid #e2e8f0',
                                                                minHeight: '8rem',
                                                                whiteSpace: 'pre-wrap'
                                                            }}>
                                                                {selectedPaper.personalNotes ? (
                                                                    <>
                                                                        {showFullNotes 
                                                                            ? selectedPaper.personalNotes 
                                                                            : selectedPaper.personalNotes.length > 300 
                                                                                ? selectedPaper.personalNotes.substring(0, 300) + "..." 
                                                                                : selectedPaper.personalNotes
                                                                        }
                                                                        {selectedPaper.personalNotes.length > 300 && (
                                                                            <button
                                                                                onClick={() => setShowFullNotes(!showFullNotes)}
                                                                                style={{
                                                                                    background: 'none',
                                                                                    border: 'none',
                                                                                    color: '#3b82f6',
                                                                                    cursor: 'pointer',
                                                                                    fontSize: '0.875rem',
                                                                                    fontWeight: '600',
                                                                                    textDecoration: 'underline',
                                                                                    marginTop: '0.5rem',
                                                                                    display: 'block'
                                                                                }}
                                                                            >
                                                                                {showFullNotes ? 'Read Less' : 'Read More'}
                                                                            </button>
                                                                        )}
                                                                    </>
                                                                ) : (
                                                                    "No notes added yet. Click 'Edit Notes' to add your thoughts."
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                                {/* Extracted Text Preview */}
                                                <div>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                                    <h3 className="section-title">Extracted Text (Preview)</h3>
                                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                        <CopyButton text={selectedPaper.extractedText} label="Copy" />
                                                        <VoiceButton 
                                                            text={selectedPaper.extractedText} 
                                                            type="text" 
                                                            label="Read Text" 
                                                        />
                                                    </div>
                                                </div>
                                                <div className="extracted-text-preview">
                                                    <p className="preview-text">
                                                        {selectedPaper.extractedText}
                                                    </p>
                                                </div>
                                            </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="empty-details">
                                            <Eye size={48} className="empty-details-icon" />
                                            <p style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Select a paper to view details</p>
                                            <p style={{ fontSize: '0.875rem' }}>Choose a paper from the list to see its AI summary and details.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Upload Modal */}
                {showUploadModal && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <h2 className="modal-title">Upload New Paper</h2>
                            <div>
                                <div className="form-group">
                                    <label className="form-label">
                                        Paper Title *
                                    </label>
                                    <input
                                        type="text"
                                        value={newPaper.title}
                                        onChange={(e) => setNewPaper({ ...newPaper, title: e.target.value })}
                                        className="form-input"
                                        placeholder="Enter paper title..."
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">
                                        Category (Optional)
                                    </label>
                                    <input
                                        type="text"
                                        value={newPaper.category}
                                        onChange={(e) => setNewPaper({ ...newPaper, category: e.target.value })}
                                        className="form-input"
                                        placeholder="e.g., AI Trading, Value Investing..."
                                        list="category-suggestions"
                                    />
                                    <datalist id="category-suggestions">
                                        {categories.map(cat => (
                                            <option key={cat} value={cat} />
                                        ))}
                                    </datalist>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">
                                        PDF File *
                                    </label>
                                    <input
                                        type="file"
                                        accept=".pdf"
                                        onChange={(e) => setNewPaper({ ...newPaper, file: e.target.files[0] })}
                                        className="form-input"
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">
                                        Initial Notes (Optional)
                                    </label>
                                    <textarea
                                        value={newPaper.personalNotes}
                                        onChange={(e) => setNewPaper({ ...newPaper, personalNotes: e.target.value })}
                                        className="form-textarea"
                                        rows="3"
                                        placeholder="Add any initial thoughts or notes..."
                                    />
                                </div>
                                <div className="modal-buttons">
                                    <button
                                        type="button"
                                        onClick={() => setShowUploadModal(false)}
                                        className="cancel-btn"
                                        disabled={isUploading}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleFileUpload}
                                        disabled={isUploading}
                                        className="upload-btn"
                                    >
                                        {isUploading ? (
                                            <>
                                                <div className="loading-spinner"></div>
                                                {isSummarizing ? 'Generating Summary...' : 'Extracting Text...'}
                                            </>
                                        ) : (
                                            <>
                                                <Upload size={16} />
                                                Upload & Summarize
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}