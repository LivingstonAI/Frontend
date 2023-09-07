import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {v4 as uuidv4} from 'uuid';


export default function TellUsMore() {
    const navigate = useNavigate();
    const [selectedAssets, setSelectedAssets] = useState([]);
    let [assetArray, setAssetArray] = useState([]);
    const [tradingExperience, setTradingExperience] = useState("");
    const [initialCapital, setInitialCapital] = useState("");
    const [tradingGoals, setTradingGoals] = useState("");
    const [expectedBenefits, setExpectedBenefits] = useState("");
    let [finalData, setFinalData] = useState([]);
    const [userPrimaryKey, setUserPrimaryKey] = useState(null);
    const uniqueID = uuidv4();

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
        // alert(assetToRemove.value);
        // assetArray = assetArray.filter(item => item !== assetToRemove);
        setAssetArray(updatedAssets);
    };
    useEffect(() => {
        const infoLink = document.querySelector('.why-collect-info-link');
        const infoModal = document.querySelector('.info-modal');
        const closeModal = document.querySelector('.close-info-modal');

        infoLink.addEventListener('click', () => {
            infoModal.style.display = 'block';
        });
        closeModal.addEventListener('click', () => {
        infoModal.style.display = 'none';
        });

    }, [])


    const handleTradingExperienceChange = (event) => {
        setTradingExperience(event.target.value);
    };

    const handleInitialCapitalChange = (event) => {
        setInitialCapital(event.target.value);
    };

    const handleTradingGoalsChange = (event) => {
        setTradingGoals(event.target.value);
    };

    const handleExpectedBenefitsChange = (event) => {
        setExpectedBenefits(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        if (tradingExperience === "") {
            alert('Please select your trading experience.');
            return;
        }
        if (assetArray.length < 1) {
            alert('Please select main assets.')
            return;
        }
        if (initialCapital === '') {
            alert('Please enter an initial trading capital');
            return;
        }
        if (tradingGoals.trim() === "") {
            alert("Please enter your trading goals.");
            return;
        }
        if (expectedBenefits.trim() === "") {
            alert("Please enter your expected benefits.");
            return;
        }
        const registeredEmail = localStorage.getItem('registeredEmail');
        const requestData = {
            trading_experience: tradingExperience,
            main_assets: assetArray.join(", "),  // Convert array to a string
            initial_capital: parseFloat(initialCapital),
            trading_goals: tradingGoals,
            benefits: expectedBenefits,
            user_email: registeredEmail
        };
    

        setFinalData([tradingExperience, [assetArray], initialCapital, tradingGoals, expectedBenefits]);

        try {
            const response = await fetch("https://backend-production-c0ab.up.railway.app/tell_us_more/create/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    // You might need to include an authentication header if your API requires it
                },
                body: JSON.stringify(requestData),
            });
            if (response.status === 201) {
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
    }, [finalData]);

    // closeModal.addEventListener('click', () => {
    //     infoModal.style.display = 'none';
    // });

    
    return (
        <div>
        <div className='tell-us-div'>
            <h4 className='tell-us-title'><i className="bi bi-person"></i>Tell us more about you</h4>
            <div className='user-tell-us-div'>
            <label>What is your current trading experience?</label>
            <select className='form-control trading-experience'
                value={tradingExperience}
                onChange={handleTradingExperienceChange}
            >
                <option value=''>Please select an option</option>
                <option value='Beginner'>Beginner (I'm new to trading)</option>
                <option value='0-1 years'>0-1 years</option>
                <option value='1-5 years'>1-5 years</option>
                <option value='5+ years'>5+ years</option>
            </select>

                <label>What are the main assets you trade?</label>
                <select className="form-control" 
                onChange={handleAssetSelect}
                    >
                <option value="">
                    Select an option
                </option>
                <option value="EURUSD">EURUSD</option>
                <option value="GBPUSD">GBPUSD</option>
                <option value="USDJPY">USDJPY</option>
                <option value="XAUUSD">XAUUSD</option>
                <option value="AUDUSD">AUDUSD</option>
                <option value="USDCHF">USDCHF</option>
                <option value="NZDUSD">NZDUSD</option>
                <option value="USDCAD">USDCAD</option>
                <option value="EURJPY">EURJPY</option>
                <option value="GBPJPY">GBPJPY</option>
                <option value="AUDJPY">AUDJPY</option>
                <option value="CADJPY">CADJPY</option>
                <option value="CHFJPY">CHFJPY</option>
                <option value="NZDJPY">NZDJPY</option>
                <option value="EURAUD">EURAUD</option>
                <option value="EURGBP">EURGBP</option>
                <option value="EURNZD">EURNZD</option>
                <option value="EURCAD">EURCAD</option>
                <option value="GBPAUD">GBPAUD</option>
                <option value="GBPCAD">GBPCAD</option>
                <option value="GBPNZD">GBPNZD</option>
                <option value="AUDCAD">AUDCAD</option>
                <option value="AUDCHF">AUDCHF</option>
                <option value="AUDNZD">AUDNZD</option>
                <option value="CADCHF">CADCHF</option>
                <option value="CADNZD">CADNZD</option>
                <option value="NAS100">NASDAQ (NAS100)</option>
                <option value="US30">US30</option>
                <option value="GER40">GER40</option>
                <option value="CHFJPY">CHFJPY</option>
                <option value="CHFUSD">CHFUSD</option>
                <option value="EURCHF">EURCHF</option>
                <option value="EURDKK">EURDKK</option>
                <option value="EURHKD">EURHKD</option>
                <option value="EURHUF">EURHUF</option>
                <option value="EURNOK">EURNOK</option>
                <option value="EURPLN">EURPLN</option>
                <option value="EURSEK">EURSEK</option>
                <option value="EURTRY">EURTRY</option>
                <option value="EURZAR">EURZAR</option>
                <option value="GBPCHF">GBPCHF</option>
                <option value="GBPHKD">GBPHKD</option>
                <option value="GBPNOK">GBPNOK</option>
                <option value="GBPSGD">GBPSGD</option>
                <option value="AUDSGD">AUDSGD</option>
                <option value="NZDSGD">NZDSGD</option>
                <option value="CADSGD">CADSGD</option>
                <option value="CHFSGD">CHFSGD</option>
                <option value="CHFZAR">CHFZAR</option>
                <option value="USDMXN">USDMXN</option>
                <option value="USDZAR">USDZAR</option>
                <option value="USDHKD">USDHKD</option>
                <option value="USDSGD">USDSGD</option>
                <option value="USDNOK">USDNOK</option>
                <option value="USDSEK">USDSEK</option>
                <option value="USDDKK">USDDKK</option>
                <option value="USDCNH">USDCNH</option>
                <option value="USDTHB">USDTHB</option>
                <option value="USDPLN">USDPLN</option>
                <option value="USDCZK">USDCZK</option>
                <option value="USDHUF">USDHUF</option>
                <option value="USDBRL">USDBRL</option>
                <option value="USDRUB">USDRUB</option>
                <option value="USDKRW">USDKRW</option>
                <option value="USDCAD">USDCAD</option>
                <option value="AUDNZD">AUDNZD</option>
                <option value="NZDCAD">NZDCAD</option>
                <option value="AUDCHF">AUDCHF</option>
                <option value="AUDJPY">AUDJPY</option>
                <option value="AUDCAD">AUDCAD</option>
                <option value="AUDUSD">AUDUSD</option>
                <option value="AUDSGD">AUDSGD</option>
                <option value="AUDHKD">AUDHKD</option>
                <option value="NZDUSD">NZDUSD</option>
                <option value="NZDJPY">NZDJPY</option>
                <option value="NZDCHF">NZDCHF</option>
                <option value="NZDSGD">NZDSGD</option>
                <option value="NZDHKD">NZDHKD</option>
                <option value="CADCHF">CADCHF</option>
                <option value="CADJPY">CADJPY</option>
                <option value="CADSGD">CADSGD</option>
                <option value="CADHKD">CADHKD</option>
                <option value="CADNOK">CADNOK</option>
                <option value="CADSEK">CADSEK</option>
                <option value="CADDKK">CADDKK</option>
                <option value="CHFJPY">CHFJPY</option>
                <option value="CHFAUD">CHFAUD</option>
                <option value="CHFNZD">CHFNZD</option>
                <option value="CHFUSD">CHFUSD</option>
                <option value="CHFEUR">CHFEUR</option>
                <option value="CHFGBP">CHFGBP</option>
                <option value="CHFSEK">CHFSEK</option>
                <option value="CHFDKK">CHFDKK</option>
                <option value="CHFNOK">CHFNOK</option>
                <option value="CHFPLN">CHFPLN</option>
                <option value="CHFHUF">CHFHUF</option>
                <option value="CHFCZK">CHFCZK</option>
                <option value="CHFTRY">CHFTRY</option>
                <option value="CHFZAR">CHFZAR</option>
                <option value="JPYSGD">JPYSGD</option>
                <option value="JPYHKD">JPYHKD</option>
                <option value="JPYNOK">JPYNOK</option>
                <option value="JPYSEK">JPYSEK</option>
                <option value="JPYDKK">JPYDKK</option>
                <option value="JPYPLN">JPYPLN</option>
                <option value="JPYHUF">JPYHUF</option>
                <option value="JPYCZK">JPYCZK</option>
                </select>
                    
                <div className="selected-assets">
                {assetArray.map((asset, index) => (
                    <span key={index} className="selected-asset">
                        <button className="btn btn-secondary selected-asset-button" onClick={() => handleRemoveAsset(asset)}>{asset}<i className="bi bi-x-lg"></i></button>
                    </span>
                    ))}

                </div>

                <label>What is your initial trading capital or equity (in USD)?</label>
                <input type="number" className="form-control" 
                    value={initialCapital}
                    onChange={handleInitialCapitalChange}
                />
                
                <label>What are your goals in trading? Please share your short-term and long-term objectives.</label>
                <textarea className="form-control tell-us-textarea" 
                    value={tradingGoals}
                    onChange={handleTradingGoalsChange}
                ></textarea>


                <label>What specific outcomes or benefits are you hoping to achieve by using snowAI?</label>
                <textarea className="form-control tell-us-textarea" 
                    value={expectedBenefits}
                    onChange={handleExpectedBenefitsChange}
                ></textarea>


            </div>
            <button className="btn btn-primary tell-us-button" onClick={handleSubmit}>Submit</button>
           <p className="why-collect-info"><i class="bi bi-info-circle"></i><a href="#"className="why-collect-info-link">Why do we collect this information?</a></p>
        </div>
        <div className="info-modal">
    <div className="info-modal-content">
    <span className="close-info-modal">&times;</span>
        <div className="why-collect-info-div">
            {/* <i className="bi bi-x-lg cancel-collection-explanation"></i> */}
            <h5><i className="bi bi-info-circle"></i>Why do we collect this information?</h5>
            <div className="collection-explanation">
            <p><i className="bi bi-check-lg"></i>We collect your trading experience data to first
            find out what kind of user you are and to gain an insight into your trading history.</p>
            <p><i className="bi bi-check-lg"></i>We collect the main assets you trade
            to give you a better experience by providing you with only the main
            options of the assets you trade on the app.</p>
            <p><i className="bi bi-check-lg"></i>We ask your initial equity in order to provide
            you with personalized trading history analytics and recommendations
            /advice powered by our AI ChatBot.</p>
            <p><i className="bi bi-check-lg"></i>We want to know your trading goals so we can
            better understand your trading journey personally and understand your trading 
            aspirations.</p>
            <p><i className="bi bi-check-lg"></i>We want to know what you expect from snowAI
            so we can build the best product for you and understand your painpoints.</p>
            </div>
        </div>
    </div>
    </div>
        </div>
    );
}
