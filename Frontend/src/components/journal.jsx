import React, { useState, useEffect } from "react";
import Header from "./header";
import SideNavs from "./side_navs";
import LiveClock from "./view_clock";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Link } from "react-router-dom";
import Cookies from 'js-cookie';


export default function Journal() {
    const [editorContent, setEditorContent] = useState(`
    Today I entered a trade at [time].<br/ ><br/ >
    My Strategy was [strategy] and the outcome was [outcome].<br/><br/ >

    I entered at [price] and exited at [price]. My tp was [tp] and sl was [sl].<br/><br/ >

    I traded the asset: [asset] and was a [type] order. <br /><br/ >

    My confidence level in the trade was [confidence level]%.
    `);
    const [dataSaved, setDataSaved] = useState("");
    const [editorError, setEditorError] = useState("");
    let [assetArray, setAssetArray] = useState([]);
    const [selectedAssets, setSelectedAssets] = useState([]);
    const [tags, setTags] = useState([]);
    const [tagInput, setTagInput] = useState("");
    const baseURL = 'https://backend-production-c0ab.up.railway.app';

    const fetchEmailDataFromAPI = () => {
        return Cookies.get('email');
    };

    const handleTagInputChange = (e) => {
        setTagInput(e.target.value);
    };


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
            const email = fetchEmailDataFromAPI(); 
            const response = await fetch(`${baseURL}/save_journal/${email}/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ content: editorContent, tags: tags }),
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

    const handleTagInputKeyPress = (e) => {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault(); // Prevent the default behavior (e.g., form submission or newline)
            const newTag = tagInput.trim();
            if (newTag) {
                setTags([...tags, newTag]); // Add the new tag to the array
                setTagInput(""); // Clear the input field
            }
        }
    };
    const handleRemoveTag = (tagToRemove) => {
        // Filter the tags array to exclude the tag to be removed
        const updatedTags = tags.filter((tag) => tag !== tagToRemove);
        setTags(updatedTags); // Update the state with the filtered array
    };

    useEffect(() => {
        console.log(editorContent);
        console.log(tags)
    })

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
                    <div className="personal-journal-tags-div">
                <label><h6>Tags</h6> i.e AI, News, Risk, Psychology (Press Enter to seperate)</label>
            </div>
            <input
                type="text"
                className="form-control"
                value={tagInput}
                onChange={handleTagInputChange}
                onKeyPress={handleTagInputKeyPress}
                // config={{
                //     placeholder: 'Enter your journal entry here... (You can include details like time entered, strategy chosen, entry price, etc.)',
                // }}
            />
            <div className="selected-tags">
                {tags.map((tag, index) => (
                    <span key={index} className="selected-tag">
                        <button
                            className="btn btn-secondary selected-tag-button"
                            onClick={() => handleRemoveTag(tag)}
                        >{tag.toLowerCase()}
                            <i className="bi bi-x"></i>
                        </button>
                    </span>
                ))}
            </div>
            <br/>
                
                        <CKEditor
                            editor={ClassicEditor}
                            data={editorContent}
                            onChange={handleEditorChange}
                            className="journal-ckeditor-textarea"
                        />
                        {dataSaved && <p className="success-message">{dataSaved}</p>}
                        {editorError && <p className="error-message">{editorError}</p>}
                        {/* <Link className="generate-ideas-personal-journal">Generate Ideas</Link> */}
                        <br />
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
