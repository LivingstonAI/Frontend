import React, {useState, useEffect} from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "./header";
import axios from "axios";
import { useParams } from "react-router-dom";
import SideNavs from "./side_navs";

export default function FullTrade() {
    const { tradeId } = useParams();
    const [tradeDetails, setTradeDetails] = useState({});

    useEffect(() => {
        const fetchTradeDetails = async () => {
            try {
                const response = await axios.get(`https://backend-production-c0ab.up.railway.app/full_trade/${tradeId}/`);
                setTradeDetails(response.data);
            } catch (error) {
                console.error('Error fetching trade details:', error);
            }
        };

        fetchTradeDetails();
    }, [tradeId]);

    console.log(tradeDetails.trade);

    return (
        <div>
            <div className="header">
                <Header />
            </div>
            <SideNavs />
        <div className="whole-trade-analysis-div">
            <h4>Trade Analysis</h4>
            <div className="whole-trade-analysis-header">
            <div className="trade-analysis-feedback-div">
                <h5>Feedback:</h5>
                <p>Asset: {tradeDetails.trade && tradeDetails.trade.fields.asset}</p>
                <p>Order-Type: {tradeDetails.trade && tradeDetails.trade.fields.order_type}</p>
                <p>Position-Size: {tradeDetails.trade && tradeDetails.trade.fields.lot_size}</p>
                <p>Profit/Loss: {tradeDetails.trade && tradeDetails.trade.fields.amount}</p>
                <p>Strategy: {tradeDetails.trade && tradeDetails.trade.fields.strategy}</p>
                <p>Timeframe: {tradeDetails.trade && tradeDetails.trade.fields.timeframe}</p>
            </div>
            <div className="trade-analysis-reflection">
                <h5>Reflection:</h5>
                <p> {tradeDetails.trade && tradeDetails.trade.fields.reflection}
                </p>
            </div>
            </div>
            <div className="whole-trade-analysis-stomach">
                <div className="trade-analysis-roi">
                <h5>Roi (Return on Investment)</h5>
                <p><p>{tradeDetails.trade && tradeDetails.trade.fields.roi}%</p></p>
                </div>
                <div className="trade-analysis-equity-risked">
                    <h5>Equity Risked</h5>
                    <p>1%</p>
                </div>
                <div className="trade-analysis-emotional-bias">
                    <h5>Emotional Bias</h5>
                    <p>{tradeDetails.trade && tradeDetails.trade.fields.emotional_bias}</p>
                </div>
            </div>
            <div className="trade-analysis-footer">
                <Link to="/all_trades" className="btn btn-secondary full_trades-main-page-cta">Main Page</Link>
            </div>
        </div>
        </div>
    )
}