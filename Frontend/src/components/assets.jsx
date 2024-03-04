import React, {useState, useEffect} from "react";
import Cookies from 'js-cookie';
import { useNavigate, redirect } from "react-router-dom";
import useForceUpdate from 'use-force-update';


export default function AssetsTraded({ assets, setAssets }) {
    const [isModalOpen, setIsModalOpen] = useState(true);
    const [currencyModal, setCurrencyModal] = useState(false);
    const [stocksModal, setStocksModal] = useState(false);
    const [commoditiesModal,setCommoditiesModal] = useState(false);
    const [indicesModal, setIndicesModal] = useState(false);
    const [futuresModal, setFuturesModal] = useState(false);
    const [optionsModal, setOptionsModal] = useState(false);
    const [selectedAssets, setSelectedAssets] = useState([]);
    const [isButtonClicked, setIsButtonClicked] = useState(false);
    const navigate = useNavigate();
    const forceUpdate = useForceUpdate();
    const [updateStatus, setUpdateStatus] = useState('');
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

    const fetchEmailDataFromAPI = () => {
        return Cookies.get('email');
    };

    useEffect(() => {
        async function fetchUserData() {
            try {
                const email = fetchEmailDataFromAPI(); 
                const response = await fetch(`${baseURL}/get_user_data/${email}/`);
                const data = await response.json();
                const mainAssets = data.main_assets.split(',').map(asset => asset.trim());
                setSelectedAssets(mainAssets);
            } catch (error) {
                console.error('Error fetching journals:', error);
            }
        }
        fetchUserData();
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
    


    const toggleModal = () => {
        forceUpdate();
        setIsModalOpen(!isModalOpen);
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

      const handleRemoveAsset = (assetToRemove) => {
        const updatedAssets = selectedAssets.filter((selected) => selected !== assetToRemove);
        setSelectedAssets(updatedAssets);
      };

      const closeModals = () => {
            checkOtherModals('all');
      }

    //   useEffect(() => {
    //     // Update the assets variable using setAssets
    //     setAssets(selectedAssets);
    //   }, []); // Add selectedAssets as a dependency


    const updateUserAssets = async () => {
        const requestData = {
          new_assets: selectedAssets.join(", "), // Include the 'new_assets' field with the selected assets
        };
      
        // Assuming you have the user's email stored in a variable userEmail
        const email = fetchEmailDataFromAPI();

        // window.location.reload();

        // toggleModal();

        setUpdateStatus('Updating...');
      
        try {
          const response = await fetch(`${baseURL}/update_assets/${email}/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json', // Set the content type to JSON
            },
            body: JSON.stringify(requestData), // Convert requestData to JSON format
          });
      
          if (response.ok) {
            // Handle success
            window.location.reload();

            toggleModal();
            // this.forceUpdate();
          } else {
            // Handle errors
            // console.error('Failed to update user assets.');
            window.location.reload();

            toggleModal();
          }
        } catch (error) {
        //   console.error('Error:', error);
          window.location.reload();

          toggleModal();
        }
      };
      
    return (
        <div>
            {isModalOpen && (

        
                <div className="modal-overlay">
                <div className="select-category-modal">
                        <h4 className="select-category-title">Select Category</h4>
                        
                        <button className="btn btn-light" onClick={updateUserAssets}><i className="bi bi-x-lg"></i></button>
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

            {updateStatus}
            
        </div>
        </div>
        )}

        </div>
    )
}