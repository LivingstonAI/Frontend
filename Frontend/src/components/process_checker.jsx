import React, { useEffect, useState } from "react";
import Header from "./header";
import SideNavs from "./side_navs";
import Cookies from 'js-cookie';

export default function ProcessChecker() {
    const baseUrl = 'https://backend-production-c0ab.up.railway.app';

    const [OPENAI_API_KEY, setOPENAI_API_KEY] = useState("");

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
    
      useEffect(() => {
            console.log("Fetching API key...");
            fetchAPIKey();
        }, []);
    
    return (
        <div>
            <div className="header">
                <Header />
            </div>
            <div className="main-page-body">
                <SideNavs />
                <div className="main-body-info">
                    <h5 className="major-upcoming-news-events-header">Process Checker</h5>
                   
                    <br />
                    
                </div>
            </div>
        </div>
    );
}