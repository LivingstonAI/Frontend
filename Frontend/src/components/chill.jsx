import React, { useEffect, useState } from "react";
import Header from "./header";
import SideNavs from "./side_navs";
import Cookies from 'js-cookie';

export default function Chill() {
    const [sections, setSections] = useState([]);
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
            }
        };

        fetchSections();
    }, []);

    return (
        <div>
            <div className="header">
                <Header />
            </div>
            <div className="main-page-body">
                <SideNavs />
                <div className="main-body-info">
                    <h5>C.H.I.L.L Interface</h5><br />
                    <div className="section-links">
                        {sections.map((section, index) => (
                            <a key={index} href={`#${section}`} className="section-link">
                                {section}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
