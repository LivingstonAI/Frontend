import React, { useState } from "react";
import Header from "./header";
import SideNavs from "./side_navs";
import LiveClock from "./view_clock";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
// import { Link } from "react-router-dom";


export default function Journal() {
    const [editorContent, setEditorContent] = useState("");
    const [dataSaved, setDataSaved] = useState("");
    const [editorError, setEditorError] = useState("");
    const userEmail = 'pythonappbrewery@gmail.com';

    const handleEditorChange = (event, editor) => {
        const data = editor.getData();
        setEditorContent(data);
    };

    const handleSaveJournal = async () => {
        setEditorError("");
        setDataSaved("");

        if (editorContent === "") {
            setEditorError("Please enter some text before attempting to save.");
            return;
        }

        try {
            const response = await fetch(`https://backend-production-c0ab.up.railway.app/save_journal/${userEmail}/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ content: editorContent }),
            });

            if (response.ok) {
                setDataSaved("Data Successfully Saved!");
            } else {
                const errorData = await response.json();
                setEditorError(errorData.error || "Error while saving data.");
            }
        } catch (error) {
            setEditorError("Error while saving data.");
        }
    };

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
                    {/* <h5 classNamcmde="personal-journal-title">Personal Journal</h5> */}
                    {/* <Link to="/journal" className="create-new-journal-cta">Create New Journal Entry</Link> */}
                    <div className="personal-journal-ckeditor">
                        <CKEditor
                            editor={ClassicEditor}
                            data={editorContent}
                            onChange={handleEditorChange}
                            className="journal-ckeditor-textarea"
                        />
                        {dataSaved && <p className="success-message">{dataSaved}</p>}
                        {editorError && <p className="error-message">{editorError}</p>}
                        <button
                            className="btn btn-secondary save-journal-button"
                            onClick={handleSaveJournal}
                        >
                            Save Journal
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
