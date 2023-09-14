import React, {useState, useEffect} from "react";


export default function AssetsTraded() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currencyModal, setCurrencyModal] = useState(false);

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
      };
    
      const toggleCurrenyModal = () => {
        setCurrencyModal(!currencyModal);
      }

    return (
        <div>
                <div className="select-category-modal">
                        <h4 className="select-category-title">Select Category</h4>
                        <button className="btn btn-light" onClick={toggleModal}>Close</button>
                        <div className="select-category-top">
                            <button className="btn btn-light" onClick={toggleCurrenyModal}>Forex</button>
                            <button className="btn btn-light">Stocks</button>
                        </div>
                        <div className="select-category-top">
                            <button className="btn btn-light">Commodities</button>
                            <button className="btn btn-light">Indices</button>
                        </div>
                        <div className="select-category-top">
                            <button className="btn btn-light">Futures</button>
                            <button className="btn btn-light">Options</button>
                        </div>

                        <h5 className="select-category-assets">Selected Assets:</h5>
                        <div className="selected-assets">
                        </div>
                </div>

                <div className="select-currencies-modal">
                <h4 className="select-category-title">Select Currencies</h4>
                <div className="select-search-input">
                    <div className="select-currencies-search">
                        <input
                            type="search"
                            className="form-control"
                            placeholder="Search..."
                            aria-label="Search"
                            aria-describedby="basic-addon2"
                        />
                    </div>
                    <button className="btn btn-outline-secondary select-category-search-button" type="button">
                <i className="bi bi-search"></i>
                </button>
                </div>
                <div className="assets-offered">
                    <button className="btn btn-light">EURUSD</button>
                    <button className="btn btn-light">GBPUSD</button>
                    <button className="btn btn-light">USDJPY</button>
                    <button className="btn btn-light">AUDUSD</button>
                    <button className="btn btn-light">USDCHF</button>
                    <button className="btn btn-light">NZDUSD</button>
                    <button className="btn btn-light">USDCAD</button>
                    <button className="btn btn-light">EURJPY</button>
                    <button className="btn btn-light">GBPJPY</button>
                </div>
                    </div>

        </div>
    )
}