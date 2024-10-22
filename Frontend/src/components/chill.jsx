import React, { useEffect, useState } from "react";
import Header from "./header";
import SideNavs from "./side_navs";
import Cookies from 'js-cookie';

export default function Chill() {
    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedSection, setSelectedSection] = useState(null);
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
    };

    // Function to render formatted content
    const renderFormattedText = (text) => {
        const lines = text.split('\n');  // Split the text by new lines
        return lines.map((line, index) => {
            line = line.trim();  // Trim whitespace

            if (!line) return null; // Skip empty lines

            if (line.startsWith('## ')) {
                // Render subsection header (h6)
                return <h6 key={index}>{line.replace('##', '').trim()}</h6>;
            } else if (line.startsWith('### ')) {
                // Render content as p tag
                return <p key={index} style={{ marginLeft: '20px' }}>{line.replace('###', '').trim()}</p>;
            } else if (line.startsWith('-> ')) {
                // Render bullet points as p tag with additional styling
                return <p key={index} style={{ marginLeft: '20px', fontStyle: 'italic' }}>{line.replace('->', '').trim()}</p>;
            } else {
                // Render normal paragraph
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
                            <div>{renderFormattedText(selectedSection.text)}</div>
                            <button onClick={handleBack}>Back</button>
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
