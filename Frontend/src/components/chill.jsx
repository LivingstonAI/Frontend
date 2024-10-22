import React, { useEffect, useState } from "react";
import Header from "./header";
import SideNavs from "./side_navs";
import Cookies from 'js-cookie';

export default function Chill() {
    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(true); // New loading state
    const [selectedSection, setSelectedSection] = useState(null); // State to hold the selected section data
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
                setLoading(false); // Set loading to false after fetching
            }
        };

        fetchSections();
    }, []);

    const fetchSectionData = async (section) => {
        try {
            setLoading(true); // Set loading to true while fetching data
            const response = await fetch(`${baseUrl}/fetch-chill-data?section=${encodeURIComponent(section)}`);
            const data = await response.json();
            if (response.ok) {
                setSelectedSection(data); // Set the selected section data
            } else {
                console.error(data.message);
            }
        } catch (error) {
            console.error('Error fetching section data:', error);
        } finally {
            setLoading(false); // Set loading to false after fetching
        }
    };

    const handleBack = () => {
        setSelectedSection(null); // Clear the selected section to go back
    };

    return (
        <div>
            <div className="header">
                <Header />
            </div>
            <div className="main-page-body">
                <SideNavs />
                <div className="main-body-info">
                    <h5>C.H.I.L.L Interface</h5><br />
                    {loading ? ( // Conditional rendering based on loading state
                        <div className="loading">
                            <p>Loading C.H.I.L.L data...</p>
                        </div>
                    ) : selectedSection ? ( // Render selected section data
                        <div>
                            <h6>{selectedSection.section}</h6>
                            <p>{selectedSection.text}</p>
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
    );
}
