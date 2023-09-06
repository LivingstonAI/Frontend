import React, {useState} from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "./header";


export default function EnterNewTrade () {
    const navigate = useNavigate();
    const [assetTraded, setAssetTraded] = useState("");
    const [orderType, setOrderType] = useState("");
    const [assetTradedError, setAssetTradedError] = useState("");
    const [orderTypeError, setOrderTypeError] = useState("");
    const [strategy, setStrategy] = useState("");
    const [strategyError, setStrategyError] = useState("");
    const [timeframe, setTimeFrame] = useState("");
    const [timeframeError, setTimeframeError] = useState("");
    const [startDate, setStartDate] = useState("");
    const [startDateError, setStartDateError] = useState("");
    const [endDate, setEndDate] = useState("");
    const [endDateError, setEndDateError] = useState("");
    const [entryPoint, setEntryPoint] = useState("");
    const [entryPointError, setEntryPointError] = useState("");
    const [stopLoss, setStopLoss] = useState("");
    const [stopLossError, setStopLossError] = useState("");
    const [takeProfit, setTakeProfit] = useState("");
    const [takeProfitError, setTakeProfitError] = useState("");
    const [exitPoint, setExitPoint] = useState("");
    const [exitPointError, setExitPointError] = useState("");
    const [outcome, setOutcome] = useState("");
    const [outcomeError, setOutcomeError] = useState("");
    const [amount, setAmount] = useState("");
    const [amountError, setAmountError] = useState("");
    const [reflection, setReflection] = useState("");
    const [positionSize, setPositionSize] = useState("");
    const [positionSizeError, setPositionSizeError] = useState("");
    const [emotionalBias, setEmotionalBias] = useState("");
    const [emotionalBiasError, setEmotionalBiasError] = useState("");

    const handleAssetTraded = (event) => {
        setAssetTraded(event.target.value);
    };
    const handleOrderType = (event) => {
        setOrderType(event.target.value);
    };

    const handlesStrategyChange = (event) => {
        setStrategy(event.target.value);
    };

    const handlesTimeframeChange = (event) => {
        setTimeFrame(event.target.value);
    };

    const handleStartDateChange = (event) => {
        setStartDate(event.target.value)
    };

    const handleEndDateChange = (event) => {
        setEndDate(event.target.value)
    };

    const handleEntryPointChange = (event) => {
        setEntryPoint(event.target.value)
    };

    const handleStopLossChange = (event) => {
        setStopLoss(event.target.value)
    };

    const handleTakeProfitChange = (event) => {
        setTakeProfit(event.target.value)
    };

    const handleExitPointChange = (event) => {
        setExitPoint(event.target.value)
    };

    const handleOutcomeChange = (event) => {
        setOutcome(event.target.value)
    };

    const handleAmountChange = (event) => {
        setAmount(event.target.value)
    };

    const handleReflectionChange = (event) => {
        setReflection(event.target.value)
    };

    const handlePositionSizeChange = (event) => {
        setPositionSize(event.target.value)
    };
    
    const handleEmotionalBiasChange = (event) => {
        setEmotionalBias(event.target.value)
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setAssetTradedError("");
        setOrderTypeError("");
        setStrategyError("");
        setTimeframeError("");
        setStartDateError("");
        setEndDateError("");
        setEntryPointError("");
        setStopLossError("");
        setTakeProfitError("");
        setExitPointError("");
        setOutcomeError("");
        setAmountError("");
        setPositionSizeError("");
        setEmotionalBiasError("");

        const finalPositionSize = parseFloat(positionSize);

        // alert(`Selected Asset is: ${assetTraded}. Order Type is: ${orderType}`);
        if (!assetTraded) {
            // alert('Please Select an Asset');
            setAssetTradedError('Please select an asset.');
            return;
        }
        if (!orderType) {
            setOrderTypeError('Please select an order type.');
            return;
        }
        if (strategy === '') {
            setStrategyError('Please enter a strategy.');
            return;
        }
        if (positionSize === '') {
            setPositionSizeError('Please enter a lot size');
            return;
        }
        if (isNaN(finalPositionSize)) {
            setPositionSizeError('Please enter a valid lot size.');
            return;
        }

        if (!timeframe) {
            setTimeframeError('Please select a timeframe.');
            return;
        }
        if (!startDate) {
            setStartDateError('Please select date taken input field.');
            return;
        }
        if (!endDate) {
            setEndDateError('Please select a date closed field.');
            return;
        }
        if (entryPoint === '') {
            setEntryPointError('Please enter an entry point.');
            return;
        }
        if (stopLoss === '') {
            setStopLossError('Please select a stop loss point.');
            return;
        }
        if (takeProfit === '') {
            setTakeProfitError('Please select a take profit.');
            return;
        }
        if (exitPoint === '') {
            setExitPointError('Please select an exit point.');
            return;
        }
        if (!outcome) {
            setOutcomeError('Please select the outcome of your trade.');
            return;
        }
        if (!amount) {
            setAmountError('Please select an amount.');
            return;
        }
        if (!emotionalBias) {
            setEmotionalBiasError('Please select an emotional bias.');
            return;
        }
        const currentDate = new Date;
        if (startDate > endDate) {
            setStartDateError("Please select a valid date taken input.");
            return;
        }
        const finalEntryPoint = parseFloat(entryPoint);
        if (isNaN(finalEntryPoint)) {
            setEntryPointError('Please enter a number for the entry point.');
            return;
        }
        const finalStopLoss = parseFloat(stopLoss);
        if (isNaN(finalStopLoss)) {
            setStopLossError('Please enter a number for the stop loss point.');
            return;
        }
        const finalTakeProfit = parseFloat(takeProfit);
        if (isNaN(finalTakeProfit)) {
            setTakeProfitError('Please enter a number for the take profit point.');
            return;
        }
        const finalExitPoint = parseFloat(exitPoint);
        if (isNaN(finalExitPoint)) {
            setExitPointError('Please enter a number for the exit point.');
            return;
        }
        const finalAmount = parseFloat(amount);
        if (isNaN(finalAmount)) {
            setAmountError('Please enter a number for the amount point.');
            return;
        }
        
        if (orderType === 'Buy') {
            if (finalStopLoss > finalEntryPoint) {
                setStopLossError(`Please select a valid stop loss for a ${orderType} order type.`);
                return;
            } else if (finalTakeProfit < finalEntryPoint) {
                setTakeProfitError(`Please enter a valid take profit for a ${orderType} order type.`);
                return;

            }
        } 
        if (orderType === 'Sell') {
            if (finalStopLoss < finalEntryPoint) {
                setStopLossError(`Please select a valid stop loss for a ${orderType} order type.`);
                return;
            } else if (finalTakeProfit > finalEntryPoint) {
                setTakeProfitError(`Please enter a valid take profit for a ${orderType} order type.`);
                return;

            }
        } 

        // Send Data to Server
        const registeredEmail = 'pythonappbrewery@gmail.com';
        const data = {
            email: registeredEmail,
            asset: assetTraded,
            order_type: orderType,
            strategy: strategy,
            position_size: finalPositionSize,
            timeframe: timeframe,
            start_date: startDate,
            end_date: endDate,
            entry_point: finalEntryPoint,
            stop_loss: finalStopLoss,
            take_profit: finalTakeProfit,
            exit_point: finalExitPoint,
            outcome: outcome,
            amount: finalAmount,
            emotional_bias: emotionalBias,
            reflection: reflection
        }
        console.log(data);
        try {
            const response = await fetch("https://backend-production-c0ab.up.railway.app/new_trade/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    // You might need to include an authentication header if your API requires it
                },
                body: JSON.stringify(data),
            });
            if (response.status === 201) {
                console.log("Data saved successfully!");
                // Navigate to the next page or show a success message
                navigate('/all_trades');
            } else {
                console.error("Data save failed.");
                navigate('/all_trades');
            }
        } catch (error) {
            console.error("Error while saving data:", error);
        }
        // navigate('/all_trades');

        // navigate('/all_trades')

    }    

    return (
        <div>
            <div className="header">
                <Header />
            </div>
        <div className="register-new-trade-whole-page">
            <h4 className="register-new-trade-heading">Enter New Trade</h4>
            <div className="register-new-trade">
            <label>Asset Traded</label>
            <select className='form-control'
            value={assetTraded}
            onChange={handleAssetTraded}
            >
                <option value=''>Please select an option</option>
                <option value='EURUSD'>EURUSD</option>
                <option value='GBPUSD'>GBPUSD</option>
                <option value='USDJPY'>USDJPY</option>
            </select>
            {assetTradedError && <p className="error-message">{assetTradedError}</p>}
            <label>Order Type</label>
            <select className='form-control'
                value={orderType}
                onChange={handleOrderType}
            >
                <option value=''>Please select an option</option>
                <option value='Buy'>Buy</option>
                <option value='Sell'>Sell</option>
            </select>
            {orderTypeError && <p className="error-message">{orderTypeError}</p>}
            <label>Strategy</label>
            <textarea className="form-control" placeholder="Eg. Mean Reversion"
                value={strategy}
                onChange={handlesStrategyChange}
            ></textarea>
            {strategyError && <p className="error-message">{strategyError}</p>}
            <label>Lot Size</label>
            <input className="form-control" type="text"
                value={positionSize}
                onChange={handlePositionSizeChange}
            ></input>
            {positionSizeError && <p className="error-message">{positionSizeError}</p>}
            <label>TimeFrame</label>
            <select className='form-control'
                value={timeframe}
                onChange={handlesTimeframeChange}
            >
                <option value=''>Please select an option</option>
                <option value='1min'>1min</option>
                <option value='5min'>5min</option>
                <option value='15min'>15min</option>
                <option value='30min'>30min</option>
                <option value='1H'>1H</option>
                <option value='4H'>4H</option>
                <option value='1D'>1D</option>
                <option value='1W'>1W</option>
                <option value='1M'>1M</option>
            </select>
            {timeframeError && <p className="error-message">{timeframeError}</p>}
            <label>Date Taken</label>
            <input className="form-control" type="datetime-local"
                value={startDate}
                onChange={handleStartDateChange}
            ></input>
            {startDateError && <p className="error-message">{startDateError}</p>}
            <label>Date Closed</label>
            <input className="form-control" type="datetime-local" 
                value={endDate}
                onChange={handleEndDateChange} 
            ></input>
            {endDateError && <p className="error-message">{endDateError}</p>}
            <label>Entry Point</label>
            <input className="form-control" type="text"
                value={entryPoint}
                onChange={handleEntryPointChange}
            ></input>
            {entryPointError && <p className="error-message">{entryPointError}</p>}
            <label>Stop Loss</label>
            <input className="form-control" type="text" 
                value={stopLoss}
                onChange={handleStopLossChange}
            ></input>
            {stopLossError && <p className="error-message">{stopLossError}</p>}
            <label>Take Profit</label>
            <input className="form-control" type="text"
                value={takeProfit}
                onChange={handleTakeProfitChange}
            ></input>
            {takeProfitError && <p className="error-message">{takeProfitError}</p>}
            <label>Exit Point</label>
            <input className="form-control" type="text"
                value={exitPoint}
                onChange={handleExitPointChange}
            ></input>
            {exitPointError && <p className="error-message">{exitPointError}</p>}
            <label>Outcome</label>
            <select className='form-control' 
                  value={outcome}
                  onChange={handleOutcomeChange}
            >
                <option value=''>Please select an option</option>
                <option value='Profit'>Profit</option>
                <option value='Loss'>Loss</option>
                <option value='Breakeven'>Breakeven</option>
            </select>
            {outcomeError && <p className="error-message">{outcomeError}</p>}
            <label>Amount</label>
            <input className="form-control" type="text" placeholder="Eg. 500"
            value={amount}
            onChange={handleAmountChange}
            ></input>
            {amountError && <p className="error-message">{amountError}</p>}

            <label>Emotional Bias</label>
            <select className='form-control'
            value={emotionalBias}
            onChange={handleEmotionalBiasChange}
            >
                <option value=''>Please select an option</option>
                <option value='True'>True</option>
                <option value='False'>False</option>
            </select>
            {emotionalBiasError && <p className="error-message">{emotionalBiasError}</p>}
            <label>Reflection (Optional)</label>
            <textarea className="form-control register-new-trade-reflection" placeholder="Eg. What did you learn from taking this trade?"
                value={reflection}
                onChange={handleReflectionChange}
            ></textarea>
            <button className="btn btn-secondary register-new-trade-submit"
                onClick={handleSubmit}
            >Submit</button>
            </div>
        </div>
        </div>
    )
}
