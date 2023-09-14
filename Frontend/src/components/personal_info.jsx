import React, { useEffect, useState } from "react";
import Header from "./header";
import SideNavs from "./side_navs";
import AssetsTraded from "./assets";
import Cookies from 'js-cookie';
import { useNavigate } from "react-router-dom";
import {v4 as uuidv4} from 'uuid';


export default function ModifyPersonalInfo() {

    const fetchEmailDataFromAPI = () => {
        return Cookies.get('email');
    };

    const [tradingExperience, setTradingExperience] = useState("");
    const [selectedAssets, setSelectedAssets] = useState([]);
    let [assetArray, setAssetArray] = useState([]);
    const [initialCapital, setInitialCapital] = useState("");
    const [tradingGoals, setTradingGoals] = useState("");
    const [expectedBenefits, setExpectedBenefits] = useState("");
    const [tellUsMore, setTellUsMore] = useState([]);
    let [tradingExp, setTradingExp] = useState("")
    let [mainAssets, setMainAssets] = useState([]);
    let [initialCap, setInitialCap] = useState(0);
    let [goals, setGoals] = useState("");
    let [benefits, setBenefits] = useState("");
    let [finalData, setFinalData] = useState([]);
    const navigate = useNavigate();
    const uniqueID = uuidv4();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currencyModal, setCurrencyModal] = useState(false);
    const baseURL = 'https://backend-production-c0ab.up.railway.app';

    useEffect(() => {
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
            }
        }
        fetchUserData();
    }, []);

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


  // ... (existing code)

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
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
                <select className="form-control" 
                onChange={handleAssetSelect}
                    >
                <option value="" onClick={toggleModal}>
                    Select an option
                </option>
                <option value="VIX75">VIX 75</option>
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

                {/* {assetArray && mainAssets.length > 0 && ( */}
                <div className="selected-assets">
                    {assetArray.map((asset, index) => (
                    <span key={index} className="selected-asset">
                        <button className="btn btn-secondary selected-asset-button" onClick={() => handleRemoveAsset(asset)}>
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

