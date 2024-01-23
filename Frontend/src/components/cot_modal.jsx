import React, {useState, useEffect} from "react";
import Cookies from 'js-cookie';
import { useNavigate, redirect } from "react-router-dom";
import useForceUpdate from 'use-force-update';




export default function COTModal({ assets, setAssets }) {
    const [isModalOpen, setIsModalOpen] = useState(true);
    const navigate = useNavigate();
    const forceUpdate = useForceUpdate();
    
    const toggleModal = () => {
        forceUpdate();
        setIsModalOpen(!isModalOpen);
      };

    const closeModal = async () => {  
        // Handle success
        window.location.reload();

        toggleModal();
        // this.forceUpdate();
    }
      
    return (
        <div>
            {isModalOpen && (

        
                <div className="modal-overlay">
                <div className="select-category-modal">
                        <h4 className="select-category-title">Select Category</h4>
                        
                        <button className="btn btn-light close-cot-modal" onClick={closeModal}><i className="bi bi-x-lg"></i>Close</button>
                        <p><b>The Commitments of Traders (COT)</b> report is a weekly publication that showcases the positioning of different types of
             traders in the futures markets. Essentially, it provides a snapshot of how the big players—such as 
             hedge funds, institutional investors, and commercial companies—are positioned in various financial 
             and commodity markets. Think of it as a behind-the-scenes glimpse into the bets and strategies of the trading 'heavyweights.'</p>
          <h6>How to Use COT Data:</h6>
          <p><b>1. Identify Market Trends</b>: By observing whether these key players 
            are net long or net 
            short on a commodity or financial instrument, you can gauge the market
             sentiment and prevailing trends.</p>
          <p><b>2. Spot Reversals</b>: Significant shifts in trader positions, especially if they diverge from the 
            current market trend, can indicate potential reversals or changes in sentiment.</p>
          <p><b>3. Confirm Your Analysis</b>: Use COT data as a tool to confirm your independent market analysis. 
            If your technical or fundamental analysis indicates a bullish outlook and the COT data shows large 
            traders are increasingly going long, you've got a stronger case for your trade.</p>
          <h6>Benefits of COT Data:</h6>
          <p><b>- Strategic Insights</b>: COT data illuminates the actions of experienced traders, offering you 
            an invaluable strategic viewpoint.</p>
          <p><b>- Risk Management</b>: Understanding how large traders are positioned can help you 
            assess market risks and manage your positions accordingly.</p>
          <p><b>- Informed Decisions</b>: With COT data, your trading decisions are informed by a broader
             understanding of market dynamics, potentially enhancing your trading performance.</p>
          <h6>Accessing COT Data:</h6>
          <p>Currently, snowAI links you directly to an external source
            , where you can view COT data that's already analyzed and presented in a user-friendly, 
            visual format. Clicking on this link takes you 
            to a world of insight where the opaque actions of market movers become clear, aiding you in making informed 
            trades with confidence.</p>
          <br />
          <br />
          <br />
          <br />
          <br />

                </div>
                </div>
                )}

                <br />
        </div>
    )
}
