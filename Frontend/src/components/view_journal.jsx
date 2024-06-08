import React, { useState, useEffect } from "react";
import Header from "./header";
import SideNavs from "./side_navs";
import LiveClock from "./view_clock";
import { useParams } from "react-router-dom";
import parse from 'html-react-parser';
import { Link } from "react-router-dom";

export default function ViewJournal() {
    const { journalId } = useParams();
    const [journalContent, setJournalContent] = useState("");
    const [journalDate, setJournalDate] = useState("");
    const [journalTags, setJournalTags] = useState("");
    const baseURL = 'https://backend-production-c0ab.up.railway.app'

    function parseCustomTags(tagsString) {
        if (!tagsString) {
            return [];
        }
    
        // Remove leading and trailing square brackets and single quotes
        const cleanedString = tagsString.replace(/[\[\]']/g, '');
    
        // Split the cleaned string by ', ' to create an array
        const tagsArray = cleanedString.split(', ');
    
        return tagsArray;
    }
    

    useEffect(() => {
        async function fetchJournalContent() {
            try {
                const response = await fetch(`${baseURL}/view_journal/${journalId}/`);
                const data = await response.json();
                setJournalContent(data.journal.content);
                setJournalDate(data.journal.created_date);
                setJournalTags(data.journal.tags);
                console.log(data);
            } catch (error) {
                console.error('Error fetching journal content:', error);
            }
        }
        fetchJournalContent();
    }, [journalId]);

    return (
        <div>
            <div className="header">
                <Header />
            </div>
            <div className="main-page-body">
                <SideNavs />
                <div className="main-body-info">
                    <div className="journal-liveclock">
                        <LiveClock />
                    </div>
                    <h5 className="view-journal-title">Journal Entry</h5>
                    <div className="entire-journal-div">
                        <div className="journal-content">
                            {parse(`${journalContent}`)}
                        </div>
                        {journalTags && (
                            <div className="journal-tags">
                            {parseCustomTags(journalTags).map((tag, index) => (
                                // Check if the tag is not empty before rendering the button
                                tag !== '' && (
                                    <button key={index} className="btn btn-secondary tag-journal">{tag}</button>
                                )
                            ))}
                        </div>
                        
                        
                        )}<br/>
                        <p className="journal-created-date">Saved On: {journalDate}</p><br />
                        <Link className="btn btn-primary main-journal-nav-button" to={`/all_journals`}>Go Back</Link>
                    </div>
                </div>
            </div>
        </div>
    );
    
}
