import React, { useState, useEffect } from "react";
import Cookies from 'js-cookie';
import { useNavigate, redirect } from "react-router-dom";
import useForceUpdate from 'use-force-update';

export default function DataSetsModal() {
    const [isModalOpen, setIsModalOpen] = useState(true);
    const forceUpdate = useForceUpdate();
    const [xauuData, setXauusd] = useState(['./XAUUSD5M.csv', './XAUUSD15M.csv', './XAUUSD30M.csv', 
    './XAUUSD1H.csv', './XAUUSD4H.csv', './XAUUSD1D.csv'])
    const [eurusdData, setEurusdData] = useState(['./EURUSD5M.csv', './EURUSD15M.csv', './EURUSD30M.csv',
    './EURUSD1H.csv', './EURUSD4H.csv', './EURUSD1D.csv'])
    const [gbpusdData, setGbpusdData] = useState(['./GBPUSD5M.csv', './GBPUSD15M.csv', './GBPUSD30M.csv',
    './GBPUSD1H.csv','./GBPUSD4H.csv', './GBPUSD1D.csv'])
    const [usdjpyData, setUjpyusdData] = useState(['./USDJPY5M.csv', './USDJPY15M.csv', './USDJPY30M.csv',
    './USDJPY1H.csv','./USDJPY4H.csv', './USDJPY1D.csv'])
    const [chosenData, setChosenData] = useState('');

    const toggleModal = () => {
        // forceUpdate();
        setIsModalOpen(!isModalOpen);
    };

    const closeModal = async () => {  
        // Handle success
        // window.location.reload();
        toggleModal();
    }

    const handleButtonClick = (data) => {
        setChosenData(data);
    }
      
    return (
        <div>
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="select-category-modal">
                        <br />
                        <h4 className="select-category-title">Choose Dataset</h4><br />
                        <button className="btn btn-light close-cot-modal" onClick={closeModal}>Close</button><br /><br />
                        {chosenData && (
                            <p>Chosen dataset: {chosenData}</p>
                        )}
                        <p><b>XAUUSD</b></p>
                        
                            {xauuData.map((data, index) => (
                                <button 
                                    className="btn btn-light" 
                                    key={index}
                                    onClick={() => handleButtonClick(data)}
                                >
                                    {data}
                                </button>
                            ))}<br /><br />
                            <p><b>EURUSD</b></p>
                            {eurusdData.map((data, index) => (
                                <button 
                                    className="btn btn-light" 
                                    key={index}
                                    onClick={() => handleButtonClick(data)}
                                >
                                    {data}
                                </button>
                            ))}
                        <br /><br />
                            <p><b>GBPUSD</b></p>
                            {gbpusdData.map((data, index) => (
                                <button 
                                    className="btn btn-light" 
                                    key={index}
                                    onClick={() => handleButtonClick(data)}
                                >
                                    {data}
                                </button>
                            ))}
                            <br /><br />
                            <p><b>USDJPY</b></p>
                            {usdjpyData.map((data, index) => (
                                <button 
                                    className="btn btn-light" 
                                    key={index}
                                    onClick={() => handleButtonClick(data)}
                                >
                                    {data}
                                </button>
                            ))}
                        <br /><br /><br /><br /><br />
                    </div>
                </div>
            )}
            <br />
        </div>
    )
}

