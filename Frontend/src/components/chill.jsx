import React, { useEffect, useState } from "react";
import Header from "./header";
import SideNavs from "./side_navs";

export default function Chill() {
    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedSection, setSelectedSection] = useState(null);
    const [editing, setEditing] = useState(false); // New state for editing mode
    const [editedText, setEditedText] = useState(""); // State to store edited content
    const baseUrl = 'https://backend-production-c0ab.up.railway.app';

    useEffect(() => {
        const fetchSections = async () => {
            try {
                const response = await fetch(`${baseUrl}/fetch-chill-sections`);
                const data = await response.json();
                if (response.ok) {
                    setSections(data.sections);
                } else {
                    console.error(data.message);
                }
            } catch (error) {
                console.error('Error fetching sections:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSections();
    }, []);

    const fetchSectionData = async (section) => {
        try {
            setLoading(true);
            const response = await fetch(`${baseUrl}/fetch-chill-data?section=${encodeURIComponent(section)}`);
            const data = await response.json();
            if (response.ok) {
                setSelectedSection(data);
                setEditedText(data.text); // Initialize the editedText with fetched content
            } else {
                console.error(data.message);
            }
        } catch (error) {
            console.error('Error fetching section data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        setSelectedSection(null);
        setEditing(false); // Exit editing mode on going back
    };

    const handleSave = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${baseUrl}/edit-chill-data`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    section: selectedSection.section,
                    text: editedText,
                }),
            });
            const data = await response.json();
            if (response.ok) {
                setSelectedSection({ ...selectedSection, text: editedText });
                setEditing(false); // Exit editing mode after save
            } else {
                console.error(data.message);
            }
        } catch (error) {
            console.error('Error saving edited data:', error);
        } finally {
            setLoading(false);
        }
    };

    // Function to render formatted content
    const renderFormattedText = (text) => {
        const lines = text.split('\n');
        return lines.map((line, index) => {
            line = line.trim();
            if (!line) return null;

            if (line.startsWith('## ')) {
                return <h6 key={index}>{line.replace('##', '').trim()}</h6>;
            } else if (line.startsWith('### ')) {
                return <p key={index} style={{ marginLeft: '20px' }}>{line.replace('###', '').trim()}</p>;
            } else if (line.startsWith('-> ')) {
                return <p key={index} style={{ marginLeft: '20px', fontStyle: 'italic' }}>{line.replace('->', '').trim()}</p>;
            } else {
                return <p key={index}>{line}</p>;
            }
        });
    };

    return (
        <div>
            <div className="header">
                <Header />
            </div>
            <div className="main-page-body">
                <SideNavs />
                <div className="main-body-info">
                    <div className="chill-div">
                        <h5>C.H.I.L.L Interface</h5><br />
                        {loading ? (
                            <div className="loading">
                                <p>Loading C.H.I.L.L data...</p>
                            </div>
                        ) : selectedSection ? (
                            <div>
                                <h6>{selectedSection.section}</h6>

                                {editing ? (
                                    <textarea
                                        value={editedText}
                                        onChange={(e) => setEditedText(e.target.value)}
                                        style={{ width: '100%', height: '300px' }}
                                    />
                                ) : (
                                    <div>{renderFormattedText(selectedSection.text)}</div>
                                )}

                                <div>
                                    {editing ? (
                                        <button onClick={handleSave}>Save</button>
                                    ) : (
                                        <button onClick={() => setEditing(true)}>Edit</button>
                                    )}
                                    <button onClick={handleBack}>Back</button>
                                </div>
                            </div>
                        ) : (
                            <div className="section-links">
                                {sections.map((section, index) => (
                                    <a key={index} href="#" onClick={() => fetchSectionData(section)} className="section-link">
                                        {section}
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
