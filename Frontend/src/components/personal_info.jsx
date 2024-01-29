import React, { useEffect, useState } from "react";
import Header from "./header";
import SideNavs from "./side_navs";
import AssetsTraded from "./assets";
import Cookies from 'js-cookie';
import { useFetcher, useNavigate } from "react-router-dom";
import {v4 as uuidv4} from 'uuid';
import useForceUpdate from 'use-force-update';


export default function ModifyPersonalInfo({ ModalOpen }) {


    const fetchEmailDataFromAPI = () => {
        return Cookies.get('email');
    };

    const [tradingExperience, setTradingExperience] = useState("");
    const [selectedAssets, setSelectedAssets] = useState([]);
    let [assetArray, setAssetArray] = useState([]);
    const [tellUsMore, setTellUsMore] = useState([]);
    let [tradingExp, setTradingExp] = useState("")
    let [initialCap, setInitialCap] = useState(0);
    let [goals, setGoals] = useState("");
    let [benefits, setBenefits] = useState("");
    let [finalData, setFinalData] = useState([]);
    const navigate = useNavigate();
    const uniqueID = uuidv4();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currencyModal, setCurrencyModal] = useState(false);
    const [modalClosed, setModalClosed] = useState(false);
    const forceUpdate = useForceUpdate();
    const baseURL = 'https://backend-production-c0ab.up.railway.app';

    
        async function fetchUserData() {
            try {
                const email = fetchEmailDataFromAPI(); 
                const response = await fetch(`${baseURL}/get_user_data/${email}/`);
                const data = await response.json();
                setTellUsMore(data);
                // console.log(data);
                setTradingExp(data.trading_experience);
                const mainAssets = data.main_assets.split(',').map(asset => asset.trim());
                setAssetArray(mainAssets);
                setInitialCap(data.initial_capital);
                setGoals(data.trading_goals);
                setBenefits(data.benefits);
            } catch (error) {
                console.error('Error fetching journals:', error);
            };
        }

    const handleTradingExperienceChange = (event) => {
        setTradingExp(event.target.value);
    };

    const handleAssetSelect = (e) => {
        const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);
        setSelectedAssets(selectedOptions);
        const index = assetArray.includes(selectedOptions[0]);

        if (index) {
            // do nothing
        } else {
            assetArray.push(selectedOptions[0]);
        }   
    }

    const handleRemoveAsset = (assetToRemove) => {
        const updatedAssets = assetArray.filter((asset) => asset !== assetToRemove);
        setAssetArray(updatedAssets);
    };

    const handleInitialCapitalChange = (event) => {
        setInitialCap(event.target.value);
    };

    const handleTradingGoalsChange = (event) => {
        setGoals(event.target.value);
    };


    const handleExpectedBenefitsChange = (event) => {
        setBenefits(event.target.value);
    };



  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
    console.log('Modal Toggled')
    // setModalClosed(!modalClosed);
  };

  const toggleCurrenyModal = () => {
    setCurrencyModal(!currencyModal);
  }

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        if (tradingExp === "") {
            alert('Please select your trading experience.');
            return;
        }
        if (assetArray.length < 1) {
            alert('Please select main assets.')
            return;
        }
        if (initialCap === '') {
            alert('Please enter an initial trading capital');
            return;
        }
        if (goals.trim() === "") {
            alert("Please enter your trading goals.");
            return;
        }
        if (benefits.trim() === "") {
            alert("Please enter your expected benefits.");
            return;
        }
        
        const requestData = {
            trading_experience: tradingExp,
            main_assets: assetArray.join(", "),  // Convert array to a string
            initial_capital: parseFloat(initialCap),
            trading_goals: goals,
            benefits: benefits,
            user_email: fetchEmailDataFromAPI(),
        };
        

        setFinalData([tradingExp, [assetArray], initialCap, goals, benefits]);
        let email = fetchEmailDataFromAPI();

        try {
            const response = await fetch(`${baseURL}/update_user_data/${email}/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    // You might need to include an authentication header if your API requires it
                },
                body: JSON.stringify(requestData),
            });
            if (response.status === 200) {
                // Navigate to the next page or show a success message
                navigate(`/conversation/${uniqueID}`);
            } else {
                console.error("Data save failed.");
            }
        } catch (error) {
            console.error("Error while saving data:", error);
        }
        
        // Perform form submission logic

    };

    useEffect(() => {
        console.log('The Component has mounted.');
        fetchUserData();
    }, [modalClosed]);

    useEffect(() => {
        console.log('The Component has mounted two');
        fetchUserData();
    }, []);
    useEffect(() => {
        console.log('isModalOpen in ModifyPersonalInfo:', ModalOpen);
    })

    const closeModal = async () => {  
        // Handle success
        window.location.reload();

        toggleModal();
        // this.forceUpdate();
    }

    return (
        <div>
            <div className="header">
                <Header />
            </div>
                <SideNavs/>
            <div className="main-page-body">
                <div className="personal-info">
                    <div className="personal-info-content">
                    <h4 className="personal-info-title"><i className="bi bi-person-circle personal-info-icon">Personal Information</i></h4><br />
                    <h5>Trading Experience</h5>
                    <label>What is your current trading experience?</label>
                    <select className='form-control trading-experience'
                        value={tradingExperience}
                        onChange={handleTradingExperienceChange}
                    >
                        <option value=''>{tradingExp}</option>
                        <option value='Beginner'>Beginner (I'm new to trading)</option>
                        <option value='0-1 years'>0-1 years</option>
                        <option value='1-5 years'>1-5 years</option>
                        <option value='5+ years'>5+ years</option>
                    </select>

                    <label>What are the main assets you trade?</label>
                {/* <select className="form-control" 
                onChange={handleAssetSelect}
                onClick={toggleModal}
                    >
                </select> */}
                <button className="btn btn-light" onClick={toggleModal}>Choose Options</button>

                {/* {assetArray && mainAssets.length > 0 && ( */}
                <div className="selected-assets">
                    {assetArray.map((asset, index) => (
                    <span key={index} className="selected-asset">
                        <button className="btn btn-light selected-asset-button" onClick={() => handleRemoveAsset(asset)}>
                        {asset}
                        <i className="bi bi-x-lg"></i>
                        </button>
                    </span>
                    ))}
                </div>
                {/* )} */}


                <label>What is your initial trading capital or equity (in USD)?</label>
                <input type="number" className="form-control" 
                    value={initialCap}
                    onChange={handleInitialCapitalChange}
                    placeholder={initialCap}
                />

                <label>What are your goals in trading? Please share your short-term and long-term objectives.</label>
                    <textarea className="form-control tell-us-textarea" 
                        value={goals}
                        onChange={handleTradingGoalsChange}
                ></textarea>

                <label>What specific outcomes or benefits are you hoping to achieve by using snowAI?</label>
                    <textarea className="form-control tell-us-textarea" 
                        value={benefits}
                        onChange={handleExpectedBenefitsChange}
                ></textarea><br />
                
                <button className="btn btn-primary personal-info-save" onClick={handleSubmit}>Save</button>
                <br />
                {isModalOpen && (
                    <AssetsTraded />
                )}
                    </div>
                </div>
            </div>
        </div>
    )
}

