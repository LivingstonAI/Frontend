import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import AssetsTraded from "./assets";

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
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currencyModal, setCurrencyModal] = useState(false);
    const [stocksModal, setStocksModal] = useState(false);
    const [commoditiesModal,setCommoditiesModal] = useState(false);
    const [indicesModal, setIndicesModal] = useState(false);
    const [futuresModal, setFuturesModal] = useState(false);
    const [optionsModal, setOptionsModal] = useState(false);
    const [isButtonClicked, setIsButtonClicked] = useState(false);
    const baseURL = 'https://backend-production-c0ab.up.railway.app';


    const currencyArray = [
        "EURUSD", "GBPUSD", "USDJPY", "AUDUSD", "USDCHF", "NZDUSD", "USDCAD", "EURJPY",
        "GBPJPY", "AUDJPY", "CADJPY", "CHFJPY", "NZDJPY", "EURAUD", "EURGBP", "EURNZD",
        "EURCAD", "GBPAUD", "GBPCAD", "GBPNZD", "AUDCAD", "AUDCHF", "AUDNZD", "CADCHF",
        "CADNZD", "CHFJPY", "EURCHF", "EURDKK", "EURHKD", "EURHUF", "EURNOK", "EURPLN",
        "EURZAR", "GBPCHF", "AUDSGD", "CHFZAR", "USDZAR", "AUDNZD", "NZDCAD", "AUDCHF",
        "AUDJPY", "AUDCAD", "NZDCHF", "CADCHF", "CADJPY", "AUDCHF"
      ];

      const stockArray = [
        "$AAPL", "$GOOGL", "$AMZN", "$TSLA", "$MSFT", "$FB", "$NFLX", "$NVDA", "$INTC",
        "$CSCO", "$AAP", "$JPM", "$GS", "$V", "$DIS", "$KO", "$PEP", "$WMT", "$PG",
        "$UNH", "$HD", "$NKE", "$MCD", "$BA", "$VZ", "$T", "$IBM"
      ];

      const commodityArray = [
        "Gold (XAUUSD)", "Silver (XAGUSD)", "Crude Oil (USOIL)", "Brent Crude Oil (UKOIL)",
        "Natural Gas (NGAS)", "Copper (COPPER)", "Platinum (XPTUSD)", "Palladium (XPDUSD)",
        "Corn (CORN)", "Wheat (WHEAT)", "Soybeans (SOYBEAN)", "Coffee (COFFEE)",
        "Cocoa (COCOA)", "Sugar (SUGAR)", "Cotton (COTTON)"
      ];

      const indicesArray = [
        "S&P 500 (SP500)", "Dow Jones Industrial Average (US30)", "DAX 30 (GER30)",
        "NASDAQ Composite (NAS100)", "FTSE 100 (UK100)", "CAC 40 (FR40)",
        "Nikkei 225 (JP225)", "Hang Seng Index (HK50)", "ASX 200 (AUS200)",
        "Euro Stoxx 50 (EU50)", "S&P/TSX Composite (CA60)", "Shanghai Composite (CN50)"
      ];

      const futuresArray = [
        "E-mini S&P 500 Futures (ES)", "Crude Oil Futures (CL)", "Gold Futures (GC)",
        "Euro FX Futures (6E)", "Natural Gas Futures (NG)", "Copper Futures (HG)",
        "10-Year Treasury Note Futures (ZN)", "30-Year Treasury Bond Futures (ZB)",
        "E-mini Nasdaq-100 Futures (NQ)", "E-mini Dow Jones Futures (YM)",
        "Mini Russell 2000 Futures (RTY)", "VIX Futures (VX)"
      ];

      const optionsArray = [
        "Apple Inc. Call Option (AAPL Call)", "Amazon.com Inc. Put Option (AMZN Put)",
        "Google LLC Call Option (GOOGL Call)", "Tesla Inc. Put Option (TSLA Put)",
        "Microsoft Corporation Call Option (MSFT Call)", "Facebook Inc. Put Option (FB Put)",
        "Netflix Inc. Call Option (NFLX Call)", "Alphabet Inc. Put Option (GOOG Put)",
        "Bank of America Corporation Call Option (BAC Call)", "Johnson & Johnson Put Option (JNJ Put)",
        "JPMorgan Chase & Co. Call Option (JPM Call)", "General Electric Company Put Option (GE Put)"
      ];


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

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
        console.log(selectedAssets);
      };
    
      const handleRemoveAsset = (assetToRemove) => {
        const updatedAssets = selectedAssets.filter((selected) => selected !== assetToRemove);
        setSelectedAssets(updatedAssets);
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

    }, []);

    const handleSearch = (event) => {
        const searchQuery = event.target.value.toLowerCase(); // Convert input to lowercase for case-insensitive search
        const currencyButtons = document.querySelectorAll(".assets-offered button");
    
        currencyButtons.forEach((button) => {
            const currencyName = button.textContent.toLowerCase();
            if (currencyName.includes(searchQuery)) {
                button.style.display = "block"; // Show the button if it matches the search query
            } else {
                button.style.display = "none"; // Hide the button if it doesn't match the search query
            }
        });
    };

    const checkOtherModals = (modalCategory) => {
        if (modalCategory === "currency") {
            // Close all other modals except the currency modal
            setStocksModal(false);
            setCommoditiesModal(false);
            setIndicesModal(false);
            setFuturesModal(false);
            setOptionsModal(false);
            setIsModalOpen(false);

        } else if (modalCategory === "stocks") {
            // Close all other modals except the stocks modal
            setCurrencyModal(false);
            setCommoditiesModal(false);
            setIndicesModal(false);
            setFuturesModal(false);
            setOptionsModal(false);
            setIsModalOpen(false);

        } else if (modalCategory === "commodities") {
            // Close all other modals except the commodities modal
            setCurrencyModal(false);
            setStocksModal(false);
            setIndicesModal(false);
            setFuturesModal(false);
            setOptionsModal(false);
            setIsModalOpen(false);

        } else if (modalCategory === "indices") {
            // Close all other modals except the indices modal
            setCurrencyModal(false);
            setStocksModal(false);
            setCommoditiesModal(false);
            setFuturesModal(false);
            setOptionsModal(false);
            setIsModalOpen(false);

        } else if (modalCategory === "futures") {
            // Close all other modals except the futures modal
            setCurrencyModal(false);
            setStocksModal(false);
            setCommoditiesModal(false);
            setIndicesModal(false);
            setOptionsModal(false);
            setIsModalOpen(false);

        } else if (modalCategory === "options") {
            // Close all other modals except the options modal
            setCurrencyModal(false);
            setStocksModal(false);
            setCommoditiesModal(false);
            setIndicesModal(false);
            setFuturesModal(false);
            setIsModalOpen(false);

        } else if (modalCategory === "all") {
            setCurrencyModal(false);
            setStocksModal(false);
            setCommoditiesModal(false);
            setIndicesModal(false);
            setFuturesModal(false);
            setOptionsModal(false);
            setIsModalOpen(true);
        }
    };
    
      const toggleCurrenyModal = () => {
        setCurrencyModal(!currencyModal);
        checkOtherModals("currency");

      };

      const toggleStocksModal = () => {
        setStocksModal(!stocksModal);
        checkOtherModals("stocks");
      };

      const toggleCommoditiesModal = () => {
        setCommoditiesModal(!commoditiesModal);
        checkOtherModals("commodities");
      };

      const toggleIndicesModal = () => {
        setIndicesModal(!indicesModal);
        checkOtherModals("indices");
      };

      const toggleFuturesModal = () => {
        setFuturesModal(!futuresModal);
        checkOtherModals("futures");
      };

      const toggleOptionsModal = () => {
        setOptionsModal(!optionsModal);
        checkOtherModals("options");
      };

      const handleAssetSelection = (asset) => {
        // Check if the asset is already selected
        if (!selectedAssets.includes(asset)) {
          // Add the asset to the selectedAssets array
          setSelectedAssets([...selectedAssets, asset]);
          setIsButtonClicked(true);
        }
      };

      const closeModals = () => {
            checkOtherModals('all');
      }
    


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
        if (selectedAssets.length < 1) {
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
            main_assets: selectedAssets.join(", "),  // Convert array to a string
            initial_capital: parseFloat(initialCapital),
            trading_goals: tradingGoals,
            benefits: expectedBenefits,
            user_email: registeredEmail
        };
    

        setFinalData([tradingExperience, [selectedAssets], initialCapital, tradingGoals, expectedBenefits]);

        try {
            const response = await fetch(`${baseURL}/tell_us_more/create/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    // You might need to include an authentication header if your API requires it
                },
                body: JSON.stringify(requestData),
            });
            if (response.status === 201) {
                // Navigate to the next page or show a success message
                navigate(`/login`);
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
                <button className="btn btn-light" onClick={toggleModal}>Choose Options</button>
                <br />
                {selectedAssets.map((asset, index) => (
                <button className="btn btn-light tell-us-more-assets" onClick={() => handleRemoveAsset(asset)}>{asset} <i className="bi bi-x"></i></button>
            ))}

                {isModalOpen && (
                    <div className="modal-overlay">
                    <div className="select-category-modal">
                            <h4 className="select-category-title">Select Category</h4>

                            {/* Closing the modal is handled here */}
                            <button className="btn btn-light" onClick={toggleModal}><i className="bi bi-x-lg"></i></button>
                            <div className="select-category-top">
                                <button className="btn btn-light" onClick={toggleCurrenyModal}>Forex</button>
                                <button className="btn btn-light" onClick={toggleStocksModal}>Stocks</button>
                            </div>
                            <div className="select-category-top">
                                <button className="btn btn-light" onClick={toggleCommoditiesModal}>Commodities</button>
                                <button className="btn btn-light" onClick={toggleIndicesModal}>Indices</button>
                            </div>
                            <div className="select-category-top">
                                <button className="btn btn-light" onClick={toggleFuturesModal}>Futures</button>
                                <button className="btn btn-light" onClick={toggleOptionsModal}>Options</button>
                            </div>
    
                            <h5 className="select-category-assets">Selected Assets:</h5>
                            <div className="selected-assets">
                                {/* // Display selected assets with remove buttons */}
                                {selectedAssets.map((asset) => (
                                    <div key={asset}>
                                    <button className="btn btn-light" onClick={() => handleRemoveAsset(asset)}>{asset} <i className="bi bi-x"></i></button>
                                </div>
                                ))}
                            </div>
    
                    </div>
                    </div>
                    )}
    
                    
                    {currencyModal && (
                        <div className="modal-overlay">
                        <div className="select-currencies-modal">
                            <div className="select-modal-headings">
                            <i className="bi bi-arrow-left select-category-left-arrow" onClick={closeModals}></i>
                                <h4 className="select-category-title">Select Currencies</h4>
                        </div>
    
                    <div className="select-search-input">
                        <div className="select-currencies-search">
                            <input
                                type="search"
                                className="form-control"
                                placeholder="Search..."
                                aria-label="Search"
                                aria-describedby="basic-addon2"
                                onChange={handleSearch}
                            />
                        </div>
                        <button className="btn btn-outline-secondary select-category-search-button" type="button">
                    <i className="bi bi-search"></i>
                    </button>
                    </div>
                    <div className="assets-offered">
                    {currencyArray.map((currency, index) => (
                        <button
                        key={index}
                        className="btn btn-light"
                        onClick={() => handleAssetSelection(currency)}
                        >
                        {currency}
                        </button>
                    ))}
                    </div>
                        </div>
                        </div>
                )}
    
                {stocksModal && (
                <div className="modal-overlay">
                <div className="select-stocks-modal">
                <div className="select-modal-headings">
                                <i className="bi bi-arrow-left select-category-left-arrow" onClick={closeModals}></i>
                                <h4 className="select-category-title">Select Stocks</h4>
                        </div>
    
                <div className="select-search-input">
                    <div className="select-stocks-search">
                        <input
                            type="search"
                            className="form-control"
                            placeholder="Search..."
                            aria-label="Search"
                            aria-describedby="basic-addon2"
                            onChange={handleSearch}
                        />
                    </div>
                    <button className="btn btn-outline-secondary select-category-search-button" type="button">
                        <i className="bi bi-search"></i>
                    </button>
                </div>
                
                <div className="assets-offered">
                {stockArray.map((stock, index) => (
                    <button
                    key={index}
                    className="btn btn-light"
                    onClick={() => handleAssetSelection(stock)}
                    >
                    {stock}
                    </button>
                ))}
                </div>
                
                </div>
                </div>
                )}
            {commoditiesModal && (
                <div className="modal-overlay">
                <div className="select-commodities-modal">
                        <div className="select-modal-headings">
                                <i className="bi bi-arrow-left select-category-left-arrow" onClick={closeModals}></i>
                                <h4 className="select-category-title">Select Commodities</h4>
                        </div>
    
                <div className="select-search-input">
                    <div className="select-commodities-search">
                        <input
                            type="search"
                            className="form-control"
                            placeholder="Search..."
                            aria-label="Search"
                            aria-describedby="basic-addon2"
                            onChange={handleSearch}
                        />
                    </div>
                    <button className="btn btn-outline-secondary select-category-search-button" type="button">
                        <i className="bi bi-search"></i>
                    </button>
                </div>
                <div className="assets-offered">
                {commodityArray.map((commodity, index) => (
                    <button
                    key={index}
                    className="btn btn-light"
                    onClick={() => handleAssetSelection(commodity)}
                    >
                    {commodity}
                    </button>
                ))}
                </div>            
    
            </div>
            </div>
            )}
    
            {indicesModal && (
                <div className="modal-overlay">
                <div className="select-indices-modal">
                        <div className="select-modal-headings">
                                <i className="bi bi-arrow-left select-category-left-arrow" onClick={closeModals}></i>
                                <h4 className="select-category-title">Select Stock Market Indices</h4>
                        </div>
    
                <div className="select-search-input">
                    <div className="select-indices-search">
                        <input
                            type="search"
                            className="form-control"
                            placeholder="Search..."
                            aria-label="Search"
                            aria-describedby="basic-addon2"
                            onChange={handleSearch}
                        />
                    </div>
                    <button className="btn btn-outline-secondary select-category-search-button" type="button">
                        <i className="bi bi-search"></i>
                    </button>
                </div>
    
                <div className="assets-offered">
                {indicesArray.map((indexName, index) => (
                    <button
                    key={index}
                    className="btn btn-light"
                    onClick={() => handleAssetSelection(indexName)}
                    >
                    {indexName}
                    </button>
                ))}
                </div>
    
                
            </div>
            </div>
    
            )}
    
            {futuresModal && (
                <div className="modal-overlay">
                <div className="select-futures-modal">
                <div className="select-modal-headings">
                                <i className="bi bi-arrow-left select-category-left-arrow" onClick={closeModals}></i>
                                <h4 className="select-category-title">Select Futures</h4>
                        </div>
    
                <div className="select-search-input">
                    <div className="select-futures-search">
                        <input
                            type="search"
                            className="form-control"
                            placeholder="Search..."
                            aria-label="Search"
                            aria-describedby="basic-addon2"
                            onChange={handleSearch}
                        />
                    </div>
                    <button className="btn btn-outline-secondary select-category-search-button" type="button">
                        <i className="bi bi-search"></i>
                    </button>
                </div>
                <div className="assets-offered">
                {futuresArray.map((futuresName, index) => (
                    <button
                    key={index}
                    className="btn btn-light"
                    onClick={() => handleAssetSelection(futuresName)}
                    >
                    {futuresName}
                    </button>
                ))}
                </div>
            </div>
            </div>
    
                )}
    
            {optionsModal && (
                <div className="modal-overlay">
                <div className="select-options-modal">
                <div className="select-modal-headings">
                                <i className="bi bi-arrow-left select-category-left-arrow" onClick={closeModals}></i>
                                <h4 className="select-category-title">Select Options</h4>
                        </div>
    
                <div className="select-search-input">
                    <div className="select-options-search">
                        <input
                            type="search"
                            className="form-control"
                            placeholder="Search..."
                            aria-label="Search"
                            aria-describedby="basic-addon2"
                            onChange={handleSearch}
                        />
                    </div>
                    <button className="btn btn-outline-secondary select-category-search-button" type="button">
                        <i className="bi bi-search"></i>
                    </button>
                </div>
    
                <div className="assets-offered">
                {optionsArray.map((optionName, index) => (
                    <button
                    key={index}
                    className="btn btn-light"
                    onClick={() => handleAssetSelection(optionName)}
                    >
                    {optionName}
                    </button>
                ))}
                </div>
                
            </div>
            </div>
                )}
                    
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
