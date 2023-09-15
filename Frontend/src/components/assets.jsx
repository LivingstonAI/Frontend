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
    const baseURL = 'https://backend-production-c0ab.up.railway.app';

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
            console.log('User assets updated successfully.');
            window.location.reload();

            toggleModal();
            // this.forceUpdate();
          } else {
            // Handle errors
            console.error('Failed to update user assets.');
          }
        } catch (error) {
          console.error('Error:', error);
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
                    <button className={`btn btn-light ${isButtonClicked ? 'highlighted-button' : ''}`} onClick={() => handleAssetSelection("EURUSD")}>EURUSD</button>
                    <button className={`btn btn-light ${isButtonClicked ? 'highlighted-button' : ''}`} onClick={() => handleAssetSelection("GBPUSD")}>GBPUSD</button>
                    <button className={`btn btn-light ${isButtonClicked ? 'highlighted-button' : ''}`} onClick={() => handleAssetSelection("USDJPY")}>USDJPY</button>
                    <button className="btn btn-light" onClick={() => handleAssetSelection("AUDUSD")}>AUDUSD</button>
                    <button className="btn btn-light" onClick={() => handleAssetSelection("USDCHF")}>USDCHF</button>
                    <button className="btn btn-light" onClick={() => handleAssetSelection("NZDUSD")}>NZDUSD</button>
                    <button className="btn btn-light" onClick={() => handleAssetSelection("USDCAD")}>USDCAD</button>
                    <button className="btn btn-light" onClick={() => handleAssetSelection("EURJPY")}>EURJPY</button>
                    <button className="btn btn-light" onClick={() => handleAssetSelection("GBPJPY")}>GBPJPY</button>
                    <button className="btn btn-light" onClick={() => handleAssetSelection("AUDJPY")}>AUDJPY</button>
                    <button className="btn btn-light" onClick={() => handleAssetSelection("CADJPY")}>CADJPY</button>
                    <button className="btn btn-light" onClick={() => handleAssetSelection("CHFJPY")}>CHFJPY</button>
                    <button className="btn btn-light" onClick={() => handleAssetSelection("NZDJPY")}>NZDJPY</button>
                    <button className="btn btn-light" onClick={() => handleAssetSelection("EURAUD")}>EURAUD</button>
                    <button className="btn btn-light" onClick={() => handleAssetSelection("EURGBP")}>EURGBP</button>
                    <button className="btn btn-light" onClick={() => handleAssetSelection("EURNZD")}>EURNZD</button>
                    <button className="btn btn-light" onClick={() => handleAssetSelection("EURCAD")}>EURCAD</button>
                    <button className="btn btn-light" onClick={() => handleAssetSelection("GBPAUD")}>GBPAUD</button>
                    <button className="btn btn-light" onClick={() => handleAssetSelection("GBPCAD")}>GBPCAD</button>
                    <button className="btn btn-light" onClick={() => handleAssetSelection("GBPNZD")}>GBPNZD</button>
                    <button className="btn btn-light" onClick={() => handleAssetSelection("AUDCAD")}>AUDCAD</button>
                    <button className="btn btn-light" onClick={() => handleAssetSelection("AUDCHF")}>AUDCHF</button>
                    <button className="btn btn-light" onClick={() => handleAssetSelection("AUDNZD")}>AUDNZD</button>
                    <button className="btn btn-light" onClick={() => handleAssetSelection("CADCHF")}>CADCHF</button>
                    <button className="btn btn-light" onClick={() => handleAssetSelection("CADNZD")}>CADNZD</button>
                    <button className="btn btn-light" onClick={() => handleAssetSelection("CHFJPY")}>CHFJPY</button>
                    <button className="btn btn-light" onClick={() => handleAssetSelection("EURCHF")}>EURCHF</button>
                    <button className="btn btn-light" onClick={() => handleAssetSelection("EURDKK")}>EURDKK</button>
                    <button className="btn btn-light" onClick={() => handleAssetSelection("EURHKD")}>EURHKD</button>
                    <button className="btn btn-light" onClick={() => handleAssetSelection("EURHUF")}>EURHUF</button>
                    <button className="btn btn-light" onClick={() => handleAssetSelection("EURNOK")}>EURNOK</button>
                    <button className="btn btn-light" onClick={() => handleAssetSelection("EURPLN")}>EURPLN</button>
                    <button className="btn btn-light" onClick={() => handleAssetSelection("EURZAR")}>EURZAR</button>
                    <button className="btn btn-light" onClick={() => handleAssetSelection("GBPCHF")}>GBPCHF</button>
                    <button className="btn btn-light" onClick={() => handleAssetSelection("AUDSGD")}>AUDSGD</button>
                    <button className="btn btn-light" onClick={() => handleAssetSelection("CHFZAR")}>CHFZAR</button>
                    <button className="btn btn-light" onClick={() => handleAssetSelection("USDZAR")}>USDZAR</button>
                    <button className="btn btn-light" onClick={() => handleAssetSelection("AUDNZD")}>AUDNZD</button>
                    <button className="btn btn-light" onClick={() => handleAssetSelection("NZDCAD")}>NZDCAD</button>
                    <button className="btn btn-light" onClick={() => handleAssetSelection("AUDCHF")}>AUDCHF</button>
                    <button className="btn btn-light" onClick={() => handleAssetSelection("AUDJPY")}>AUDJPY</button>
                    <button className="btn btn-light" onClick={() => handleAssetSelection("AUDCAD")}>AUDCAD</button>
                    <button className="btn btn-light" onClick={() => handleAssetSelection("NZDCHF")}>NZDCHF</button>
                    <button className="btn btn-light" onClick={() => handleAssetSelection("CADCHF")}>CADCHF</button>
                    <button className="btn btn-light" onClick={() => handleAssetSelection("CADJPY")}>CADJPY</button>
                    <button className="btn btn-light" onClick={() => handleAssetSelection("AUDCHF")}>AUDCHF</button>
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
                <button className="btn btn-light" onClick={() => handleAssetSelection("$AAPL")}>$AAPL</button>
                <button className="btn btn-light" onClick={() => handleAssetSelection("$GOOGL")}>$GOOGL</button>
                <button className="btn btn-light" onClick={() => handleAssetSelection("$AMZN")}>$AMZN</button>
                <button className="btn btn-light" onClick={() => handleAssetSelection("$TSLA")}>$TSLA</button>
                <button className="btn btn-light" onClick={() => handleAssetSelection("$MSFT")}>$MSFT</button>
                <button className="btn btn-light" onClick={() => handleAssetSelection("$FB")}>$FB</button>
                <button className="btn btn-light" onClick={() => handleAssetSelection("$NFLX")}>$NFLX</button>
                <button className="btn btn-light" onClick={() => handleAssetSelection("$NVDA")}>$NVDA</button>
                <button className="btn btn-light" onClick={() => handleAssetSelection("$INTC")}>$INTC</button>
                <button className="btn btn-light" onClick={() => handleAssetSelection("$CSCO")}>$CSCO</button>
                <button className="btn btn-light" onClick={() => handleAssetSelection("$AAP")}>$AAP</button>
                <button className="btn btn-light" onClick={() => handleAssetSelection("$JPM")}>$JPM</button>
                <button className="btn btn-light" onClick={() => handleAssetSelection("$GS")}>$GS</button>
                <button className="btn btn-light" onClick={() => handleAssetSelection("$V")}>$V</button>
                <button className="btn btn-light" onClick={() => handleAssetSelection("$DIS")}>$DIS</button>
                <button className="btn btn-light" onClick={() => handleAssetSelection("$KO")}>$KO</button>
                <button className="btn btn-light" onClick={() => handleAssetSelection("$PEP")}>$PEP</button>
                <button className="btn btn-light" onClick={() => handleAssetSelection("$WMT")}>$WMT</button>
                <button className="btn btn-light" onClick={() => handleAssetSelection("$PG")}>$PG</button>
                <button className="btn btn-light" onClick={() => handleAssetSelection("$UNH")}>$UNH</button>
                <button className="btn btn-light"onClick={() => handleAssetSelection("$HD")}>$HD</button>
                <button className="btn btn-light" onClick={() => handleAssetSelection("$NKE")}>$NKE</button>
                <button className="btn btn-light" onClick={() => handleAssetSelection("$MCD")}>$MCD</button>
                <button className="btn btn-light" onClick={() => handleAssetSelection("$BA")}>$BA</button>
                <button className="btn btn-light" onClick={() => handleAssetSelection("$VZ")}>$VZ</button>
                <button className="btn btn-light" onClick={() => handleAssetSelection("$T")}>$T</button>
                <button className="btn btn-light" onClick={() => handleAssetSelection("$IBM")}>$IBM</button>
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
                <button className="btn btn-light" onClick={() => handleAssetSelection("XAUUSD")}>Gold (XAUUSD)</button>
                <button className="btn btn-light" onClick={() => handleAssetSelection("XAGUSD")}>Silver (XAGUSD)</button>
                <button className="btn btn-light" onClick={() => handleAssetSelection("USOIL")}>Crude Oil (USOIL)</button>
                <button className="btn btn-light" onClick={() => handleAssetSelection("UKOIL")}>Brent Crude Oil (UKOIL)</button>
                <button className="btn btn-light" onClick={() => handleAssetSelection("NGAS")}>Natural Gas (NGAS)</button>
                <button className="btn btn-light" onClick={() => handleAssetSelection("COPPER")}>Copper (COPPER)</button>
                <button className="btn btn-light" onClick={() => handleAssetSelection("XPTUSD")}>Platinum (XPTUSD)</button>
                <button className="btn btn-light" onClick={() => handleAssetSelection("XPDUSD")}>Palladium (XPDUSD)</button>
                <button className="btn btn-light" onClick={() => handleAssetSelection("CORN")}>Corn (CORN)</button>
                <button className="btn btn-light" onClick={() => handleAssetSelection("WHEAT")}>Wheat (WHEAT)</button>
                <button className="btn btn-light" onClick={() => handleAssetSelection("SOYBEAN")}>Soybeans (SOYBEAN)</button>
                <button className="btn btn-light" onClick={() => handleAssetSelection("COFFEE")}>Coffee (COFFEE)</button>
                <button className="btn btn-light" onClick={() => handleAssetSelection("COCOA")}>Cocoa (COCOA)</button>
                <button className="btn btn-light" onClick={() => handleAssetSelection("SUGAR")}>Sugar (SUGAR)</button>
                <button className="btn btn-light" onClick={() => handleAssetSelection("COTTON")}>Cotton (COTTON)</button>
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
                <button className="btn btn-light" onClick={() => handleAssetSelection("SP500")}>S&P 500 (SP500)</button>
                <button className="btn btn-light" onClick={() => handleAssetSelection("US30")}>Dow Jones Industrial Average (US30)</button>
                <button className="btn btn-light" onClick={() => handleAssetSelection("GER30")}>DAX 30 (GE30)</button>
                <button className="btn btn-light" onClick={() => handleAssetSelection("NAS100")}>NASDAQ Composite (NAS100)</button>
                <button className="btn btn-light" onClick={() => handleAssetSelection("UK100")}>FTSE 100 (UK100)</button>
                <button className="btn btn-light" onClick={() => handleAssetSelection("FR40")}>CAC 40 (FR40)</button>
                <button className="btn btn-light" onClick={() => handleAssetSelection("JP225")}>Nikkei 225 (JP225)</button>
                <button className="btn btn-light" onClick={() => handleAssetSelection("HK50")}>Hang Seng Index (HK50)</button>
                <button className="btn btn-light" onClick={() => handleAssetSelection("AUS200")}>ASX 200 (AUS200)</button>
                <button className="btn btn-light" onClick={() => handleAssetSelection("EU50")}>Euro Stoxx 50 (EU50)</button>
                <button className="btn btn-light" onClick={() => handleAssetSelection("CA60")}>S&P/TSX Composite (CA60)</button>
                <button className="btn btn-light" onClick={() => handleAssetSelection("CN50")}>Shanghai Composite (CN50)</button>
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
                <button className="btn btn-light" onClick={() => handleAssetSelection("ES")}>E-mini S&P 500 Futures (ES)</button>
                <button className="btn btn-light" onClick={() => handleAssetSelection("CL")}>Crude Oil Futures (CL)</button>
                <button className="btn btn-light" onClick={() => handleAssetSelection("GC")}>Gold Futures (GC)</button>
                <button className="btn btn-light" onClick={() => handleAssetSelection("6E")}>Euro FX Futures (6E)</button>
                <button className="btn btn-light" onClick={() => handleAssetSelection("NG")}>Natural Gas Futures (NG)</button>
                <button className="btn btn-light" onClick={() => handleAssetSelection("HG")}>Copper Futures (HG)</button>
                <button className="btn btn-light" onClick={() => handleAssetSelection("ZN")}>10-Year Treasury Note Futures (ZN)</button>
                <button className="btn btn-light" onClick={() => handleAssetSelection("ZB")}>30-Year Treasury Bond Futures (ZB)</button>
                <button className="btn btn-light" onClick={() => handleAssetSelection("NQ")}>E-mini Nasdaq-100 Futures (NQ)</button>
                <button className="btn btn-light" onClick={() => handleAssetSelection("YM")}>E-mini Dow Jones Futures (YM)</button>
                <button className="btn btn-light" onClick={() => handleAssetSelection("RTY")}>Mini Russell 2000 Futures (RTY)</button>
                <button className="btn btn-light" onClick={() => handleAssetSelection("VX")}>VIX Futures (VX)</button>
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
                <button className="btn btn-light" onClick={() => handleAssetSelection("AAPL CALL")}>Apple Inc. Call Option (AAPL Call)</button>
                <button className="btn btn-light" onClick={() => handleAssetSelection("AMZN Put")}>Amazon.com Inc. Put Option (AMZN Put)</button>
                <button className="btn btn-light" onClick={() => handleAssetSelection("GOOGLE Call")}>Google LLC Call Option (GOOGL Call)</button>
                <button className="btn btn-light" onClick={() => handleAssetSelection("TSLA Put")}>Tesla Inc. Put Option (TSLA Put)</button>
                <button className="btn btn-light" onClick={() => handleAssetSelection("MSFT Call")}>Microsoft Corporation Call Option (MSFT Call)</button>
                <button className="btn btn-light" onClick={() => handleAssetSelection("FB Put")}>Facebook Inc. Put Option (FB Put)</button>
                <button className="btn btn-light" onClick={() => handleAssetSelection("NFLX Call")}>Netflix Inc. Call Option (NFLX Call)</button>
                <button className="btn btn-light" onClick={() => handleAssetSelection("GOOG Put")}>Alphabet Inc. Put Option (GOOG Put)</button>
                <button className="btn btn-light" onClick={() => handleAssetSelection("BAC Call")}>Bank of America Corporation Call Option (BAC Call)</button>
                <button className="btn btn-light" onClick={() => handleAssetSelection("JNJ Put")}>Johnson & Johnson Put Option (JNJ Put)</button>
                <button className="btn btn-light" onClick={() => handleAssetSelection("JPM Call")}>JPMorgan Chase & Co. Call Option (JPM Call)</button>
                <button className="btn btn-light" onClick={() => handleAssetSelection("GE Put")}>General Electric Company Put Option (GE Put)</button>
            </div>
        </div>
        </div>
        )}

        </div>
    )
}