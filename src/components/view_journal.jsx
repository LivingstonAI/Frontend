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

    useEffect(() => {
        async function fetchJournalContent() {
            try {
                const response = await fetch(`https://backend-production-c0ab.up.railway.app/view_journal/${journalId}/`);
                const data = await response.json();
                setJournalContent(data.journal.content);
                setJournalDate(data.journal.created_date)
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
                        <p className="journal-created-date">Saved On: {journalDate}</p>
                    </div>
                    <Link className="btn btn-secondary main-journal-nav-button" to={`/all_journals`}>Go Back</Link>
                </div>
                </div>
            </div>
        </div>
    );
}
