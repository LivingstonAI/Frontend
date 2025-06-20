import React, { useEffect, useState } from "react";
import { Upload, FileText, Calendar, Eye, Trash2, Plus, Search, Download, BookOpen } from "lucide-react";
import Header from "./header";
import SideNavs from "./side_navs";

export default function PaperGPT() {
    const baseUrl = 'https://backend-production-c0ab.up.railway.app';
    const [OPENAI_API_KEY, setOPENAI_API_KEY] = useState("");
    const [papers, setPapers] = useState([]);
    const [selectedPaper, setSelectedPaper] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isSummarizing, setIsSummarizing] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [newPaper, setNewPaper] = useState({
        title: "",
        file: null,
        personalNotes: ""
    });

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

    const loadPapers = () => {
        const storedPapers = JSON.parse(localStorage.getItem('paperGPT_papers') || '[]');
        setPapers(storedPapers);
    };

    const savePapers = (updatedPapers) => {
        localStorage.setItem('paperGPT_papers', JSON.stringify(updatedPapers));
        setPapers(updatedPapers);
    };

    useEffect(() => {
        console.log("Fetching API key...");
        fetchAPIKey();
        loadPapers();
    }, []);

    const extractTextFromPDF = async (file) => {
        // Simulate PDF text extraction
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(`This is extracted text from ${file.name}. In a real implementation, you would use a PDF parsing library like pdf-parse or PDF.js to extract the actual text content from the uploaded PDF file.`);
            }, 1000);
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
        setIsSummarizing(true);

        try {
            // Extract text from PDF
            const extractedText = await extractTextFromPDF(newPaper.file);
            
            // Generate AI summary
            const summary = await generateSummary(extractedText);

            // Create new paper object
            const paper = {
                id: Date.now(),
                title: newPaper.title,
                fileName: newPaper.file.name,
                fileSize: newPaper.file.size,
                uploadDate: new Date().toISOString(),
                extractedText: extractedText,
                aiSummary: summary,
                personalNotes: newPaper.personalNotes,
                // Store file as base64 for demo purposes
                fileData: await fileToBase64(newPaper.file)
            };

            const updatedPapers = [...papers, paper];
            savePapers(updatedPapers);

            // Reset form
            setNewPaper({ title: "", file: null, personalNotes: "" });
            setShowUploadModal(false);
            
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

    const handleDeletePaper = (paperId) => {
        if (window.confirm("Are you sure you want to delete this paper?")) {
            const updatedPapers = papers.filter(paper => paper.id !== paperId);
            savePapers(updatedPapers);
            if (selectedPaper && selectedPaper.id === paperId) {
                setSelectedPaper(null);
            }
        }
    };

    const updatePersonalNotes = (paperId, notes) => {
        const updatedPapers = papers.map(paper => 
            paper.id === paperId ? { ...paper, personalNotes: notes } : paper
        );
        savePapers(updatedPapers);
        if (selectedPaper && selectedPaper.id === paperId) {
            setSelectedPaper({ ...selectedPaper, personalNotes: notes });
        }
    };

    const filteredPapers = papers.filter(paper =>
        paper.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        paper.fileName.toLowerCase().includes(searchTerm.toLowerCase())
    );

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

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <div className="flex">
                <SideNavs />
                <div className="flex-1 p-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                                <BookOpen className="text-blue-600" />
                                PaperGPT
                            </h1>
                            <button
                                onClick={() => setShowUploadModal(true)}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
                            >
                                <Plus size={20} />
                                Add Paper
                            </button>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Papers List */}
                            <div className="lg:col-span-1 bg-white rounded-lg shadow-sm border">
                                <div className="p-4 border-b">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                        <input
                                            type="text"
                                            placeholder="Search papers..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>
                                <div className="max-h-96 overflow-y-auto">
                                    {filteredPapers.length === 0 ? (
                                        <div className="p-8 text-center text-gray-500">
                                            <FileText size={48} className="mx-auto mb-4 text-gray-300" />
                                            <p>No papers yet.</p>
                                            <p className="text-sm">Upload your first research paper to get started!</p>
                                        </div>
                                    ) : (
                                        filteredPapers.map((paper) => (
                                            <div
                                                key={paper.id}
                                                className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                                                    selectedPaper?.id === paper.id ? 'bg-blue-50 border-blue-200' : ''
                                                }`}
                                                onClick={() => setSelectedPaper(paper)}
                                            >
                                                <div className="flex justify-between items-start">
                                                    <div className="flex-1">
                                                        <h3 className="font-medium text-gray-900 mb-1 line-clamp-2">
                                                            {paper.title}
                                                        </h3>
                                                        <p className="text-sm text-gray-600 mb-2">{paper.fileName}</p>
                                                        <div className="flex items-center gap-4 text-xs text-gray-500">
                                                            <span className="flex items-center gap-1">
                                                                <Calendar size={12} />
                                                                {formatDate(paper.uploadDate)}
                                                            </span>
                                                            <span>{formatFileSize(paper.fileSize)}</span>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDeletePaper(paper.id);
                                                        }}
                                                        className="text-red-500 hover:text-red-700 ml-2"
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
                            <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border">
                                {selectedPaper ? (
                                    <div className="p-6">
                                        <div className="mb-6">
                                            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                                {selectedPaper.title}
                                            </h2>
                                            <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                                                <span className="flex items-center gap-1">
                                                    <FileText size={16} />
                                                    {selectedPaper.fileName}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Calendar size={16} />
                                                    {formatDate(selectedPaper.uploadDate)}
                                                </span>
                                                <span>{formatFileSize(selectedPaper.fileSize)}</span>
                                            </div>
                                        </div>

                                        <div className="space-y-6">
                                            {/* AI Summary */}
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                    AI Summary
                                                </h3>
                                                <div className="bg-blue-50 p-4 rounded-lg">
                                                    <p className="text-gray-700 leading-relaxed">
                                                        {selectedPaper.aiSummary}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Personal Notes */}
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900 mb-3">Personal Notes</h3>
                                                <textarea
                                                    value={selectedPaper.personalNotes}
                                                    onChange={(e) => updatePersonalNotes(selectedPaper.id, e.target.value)}
                                                    placeholder="Add your personal notes about this paper..."
                                                    className="w-full h-32 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                                />
                                            </div>

                                            {/* Extracted Text Preview */}
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900 mb-3">Extracted Text (Preview)</h3>
                                                <div className="bg-gray-50 p-4 rounded-lg max-h-48 overflow-y-auto">
                                                    <p className="text-sm text-gray-600 leading-relaxed">
                                                        {selectedPaper.extractedText}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="p-12 text-center text-gray-500">
                                        <Eye size={48} className="mx-auto mb-4 text-gray-300" />
                                        <p className="text-lg mb-2">Select a paper to view details</p>
                                        <p className="text-sm">Choose a paper from the list to see its AI summary and details.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Upload Modal */}
            {showUploadModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                        <h2 className="text-xl font-bold mb-4">Upload New Paper</h2>
                        <div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Paper Title *
                                </label>
                                <input
                                    type="text"
                                    value={newPaper.title}
                                    onChange={(e) => setNewPaper({ ...newPaper, title: e.target.value })}
                                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter paper title..."
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    PDF File *
                                </label>
                                <input
                                    type="file"
                                    accept=".pdf"
                                    onChange={(e) => setNewPaper({ ...newPaper, file: e.target.files[0] })}
                                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Initial Notes (Optional)
                                </label>
                                <textarea
                                    value={newPaper.personalNotes}
                                    onChange={(e) => setNewPaper({ ...newPaper, personalNotes: e.target.value })}
                                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                    rows="3"
                                    placeholder="Add any initial thoughts or notes..."
                                />
                            </div>
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowUploadModal(false)}
                                    className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                                    disabled={isUploading}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handleFileUpload}
                                    disabled={isUploading}
                                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isUploading ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            {isSummarizing ? 'Generating Summary...' : 'Processing...'}
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
    );
}