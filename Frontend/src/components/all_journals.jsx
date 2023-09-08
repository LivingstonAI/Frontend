import React, { useState, useEffect } from "react";
import Header from "./header";
import SideNavs from "./side_navs";
import { Link } from "react-router-dom";
import parse from 'html-react-parser';
import LiveClock from "./view_clock";
import Cookies from 'js-cookie';

export default function AllJournals() {
    const userEmail = 'pythonappbrewery@gmail.com';
    const [journals, setJournals] = useState([]);
    console.log();
    const baseURL = 'https://backend-production-c0ab.up.railway.app/'


    const fetchEmailDataFromAPI = () => {
       return Cookies.get('email');
    };

    // useEffect(() => {
    //     (async () => {
    //         // Call fetchUserConversations when the component mounts
    //         setUSER_EMAIL(email);
    //         console.log(email);
    //     })();
    // }, []);   

    useEffect(() => {
        async function fetchJournals() {
            try {
                const email = fetchEmailDataFromAPI(); 
                console.log(email);
                const response = await fetch(`${baseURL}/all_journals/${email}/`);
                // console.log(response);
                const data = await response.json();
                setJournals(data.journals);
            } catch (error) {
                console.error('Error fetching journals:', error);
            }
        }

        fetchJournals();
    }, []);

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
                    <div className="journal-div">
                        <h5 className="personal-journal-title">Personal Journal</h5>
                        <Link to="/journal" className="create-new-journal-cta">Create New Journal Entry</Link>
                    </div>
                    <div className="all-journals-div">
                        {journals.map((journal, index) => (
                            <div key={index}>
                                {parse(`${journal.content}`)}
                                <p className="journal-created-date">Saved On: {journal.created_date}</p>
                                <Link className="btn btn-secondary" to={`/full_journal/${journal.id}/`}>View Full Journal</Link>
                                <hr />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
