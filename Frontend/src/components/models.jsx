import React, { useState, useEffect, useRef } from "react";
import Header from "./header";
import SideNavs from "./side_navs";
import Cookies from 'js-cookie';
import { Link } from "react-router-dom";
import parse from 'html-react-parser';
// import { embed } from '@bokeh/bokehjs;
import { embed } from '@bokeh/bokehjs';

// const Bokeh = window.Bokeh;



// import ReactHtmlParser from 'react-html-parser';
// import movingAverageBot from "./moving-average-bot.mq4";
// import movingAverageBot from ""
// import Loader from 'react-loader-spinner';
// import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
// import Loader from 'react-loader-spinner';

// import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';


export default function Models() {
    const myPlotRef = useRef(null);

    // ['BBands', 'Momentum Trading Bot', {'bbandsLength': 200, 'bbandsStd': 2}]

    const fetchEmailDataFromAPI = async () => {
        return Cookies.get('email');
    };

    const baseURL = 'https://backend-production-c0ab.up.railway.app';
  

    const candlestickModels = ["Engulfing", "Pin Bar", "Morning Star", "Three White Soldiers", "Doji Star", "Methods"];
    const technicalModels = ["Moving Averages", "BBands", "Momentum Trading Bot"];
    const mlModels = ["LSTM Neural Network", "News Sentiment Analysis"];
    const dlModels = ["Reinforcement Learning with Moving Averages", "Reinforcement Learning with Stochastics", "Reinforcement Learning with Momentum", "Reinforcement Learning with MACD", "Reinforcement Learning with RSI", "Reinforcement Learning with all indicators"];

    const [candlestickButtons, setCandlestickButtons] = useState(candlestickModels);
    const [technicalButtons, setTechnicalButtons] = useState(technicalModels);
    const [mlButtons, setMlButtons] = useState(mlModels);
    const [dlButtons, setDlButtons] = useState(dlModels);

    const [chosenModels, setChosenModels] = useState([]);

    // Candlestick Models
    const [engulfing, setEngulfing] = useState(false);
    const [pinbar, setPinBar] = useState(false);
    const [morningStar, setMorningStar] = useState(false);
    const [matching, setMatching] = useState(false);
    const [threeWhiteSoldiers, setThreeWhiteSoldiers] = useState(false);
    const [dojiStar, setDojiStar] = useState(false);
    const [methods, setMethods] = useState(false);

    // Technical Indicators
    const [movingAverages, setMovingAverages] = useState(false);
    const [bbands, setBbands] = useState(false);
    const [rsi, setRsi] = useState(false);
    const [momentum, setMomentum] = useState(false);

    // Machine Learning Models
    const [lstmNN, setLstmNN] = useState(false);
    const [newsSentiment, setNewsSentiment] = useState(false);

    // Deep Learning Models
    const [rlMa, setRlMa] = useState(false);
    const [rlStch, setRlStch] = useState(false);
    const [rlMom, setRlMom] = useState(false);
    const [rlMaCD, setRlMaCD] = useState(false);
    const [rlRsi, setRlRsi] = useState(false);
    const [rlAll, setRlAll] = useState(false);

    const [riskBot, setRiskBot] = useState(false);

    const [mainPage, setMainPage] = useState(true);

    const [ma1Type, setMa1Type] = useState("");
    const [ma2Type, setMa2Type] = useState("");

    const [ma1, setMa1] = useState(0);
    const [ma2, setMa2] = useState(0);

    const [bbandsLength, setbbLength] = useState(200);
    const [bbandsStd, setBbandStd] = useState(2);

    const [rsiPeriod, setRsiPeriod] = useState(14);
    const [rsiOverbought, setRsiOverbought] = useState(70);
    const [rsiOversold, setRsiOversold] = useState(30);

    const [modelPerformance, setModelPerformance] = useState()

    const [testedModel, setTestedModel] = useState('');

    const [selectedModel, setSelectedModel] = useState('');

    const [availableModels, setAvailableModels] = useState(true);

    const [isLoading, setIsLoading] = useState(false);

    const [modelProcess, setModelProcess] = useState('Submit Model Paramaters');

    const [candlestickProcess, setCandlestickProcess] = useState('Backtest Candlestick Models');

    const [momentumProcess, setMomentumProcess] = useState('Backtest Momentum Model');

    const [timeFrame, setTimeFrame] = useState('1D');

    const [backtestPeriod, setBacktestPeriod] = useState('0-25');

    const [modelDone, setModelDone] = useState('');

    // Store a reference to the current plot (null initially)
    const [currentPlot, setCurrentPlot] = useState(null);

    // Function to handle adding or removing a model from chosenModels and set the corresponding boolean value
    const handleModelSelection = (model) => {
        // Toggle the selection for the clicked model

        setSelectedModel(model);
        switch (model) {
            case "Engulfing":
                setEngulfing(!engulfing);
                break;
            case "Pin Bar":
                setPinBar(!pinbar);
                break;
            case "Morning Star":
                setMorningStar(!morningStar);
                break;
            case "Matching":
                setMatching(!matching);
                break;
            case "Three White Soldiers":
                setThreeWhiteSoldiers(!threeWhiteSoldiers);
                break;
            case "Doji Star":
                setDojiStar(!dojiStar);
                break;
            case "Methods":
                setMethods(!methods);
                break;
            case "Moving Averages":
                setMovingAverages(!movingAverages);
                break;
            case "BBands":
                setBbands(!bbands);
                break;
            case "Relative Strength Index (RSI)":
                setRsi(!rsi);
                break;
            case "Momentum Trading Bot":
                setMomentum(!momentum);
                break;
            case "LSTM Neural Network":
                setLstmNN(!lstmNN);
                break;
            case "News Sentiment Analysis":
                setNewsSentiment(!newsSentiment);
                break;
            case "Reinforcement Learning with Moving Averages":
                setRlMa(!rlMa);
                break;
            case "Reinforcement Learning with Stochastics":
                setRlStch(!rlStch);
                break;
            case "Reinforcement Learning with Momentum":
                setRlMom(!rlMom);
                break;
            case "Reinforcement Learning with MACD":
                setRlMaCD(!rlMaCD);
                break;
            case "Reinforcement Learning with RSI":
                setRlRsi(!rlRsi);
                break;
            case "Reinforcement Learning with all indicators":
                setRlAll(!rlAll);
                break;
            default:
                break;
        }

        if (chosenModels.includes(model)) {
            setChosenModels(chosenModels.filter((chosen) => chosen !== model));
        } else {
            setChosenModels([...chosenModels, model]);
        }

        // console.log('')
    }

    const removeChosenModel = (model) => {
        setChosenModels(chosenModels.filter((chosen) => chosen !== model));
        handleModelSelection(model);
    };



    const saveParams = () => {
        // console.log('Button has been clicked!');
        
        // Create a data object with the parameters
        const data = {
            ma1Type,
            ma2Type,
            ma1,
            ma2,
        };

        // console.log(data);

        setIsLoading(true);
        setModelProcess('Backtesting Moving Average Model...');

        // Make an HTTP POST request
        fetch(`${baseURL}/create-bot/${ma1Type}/${ma2Type}/${ma1}/${ma2}/${timeFrame}/${backtestPeriod}`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then(response => response.json())
            .then(data => {

                let imageData = '';
                const jsonData = data['Output'][1]
    
                // console.log(typeof data['Output'][1]);
                const jsonLength = Object.keys(jsonData).length;
                // console.log(Object.keys(jsonData).length)
    
                if (currentPlot) {
                    const children = myPlotRef.current.children;
                    const len = children.length;
                    for (let i = 0; i < len; i++) {
                        children[i].remove();
                    }
                }
    
                if (jsonLength !== 0) {
    
                        
                    imageData = JSON.parse(data['Output'][1]);
                
                    // Embed the new plot
                    // setCurrentPlot(embed.embed_item(imageData, 'myplot'));
                    // Delay rendering the plot slightly to allow the DOM to stabilize
                    setTimeout(() => {
                        // Embed the new plot
                        setCurrentPlot(embed.embed_item(imageData, 'myplot'));
                    }, 100);
    
                }    

            // setIsLoading(false); // Request completed
            // Handle the response from the server

            setModelPerformance(data['Output'][0]);
            setTestedModel("Moving Average");
            // console.log(modelPerformance);
            setModelProcess('Submit Model Parameters');
            setModelDone('Model Done Backtesting!');
            })
            .catch(error => {
            setIsLoading(false); // Request completed (even if there's an error)
            console.error('Error:', error);
            setModelProcess('Error Occured');
            });
    }



    const saveBbandsParams = () => {
        
        // Create a data object with the parameters
        const data = {
            bbandsLength, 
            bbandsStd,
        };

        // console.log(data);

        setModelProcess('Backtesting BBands Model...');

        // Make an HTTP POST request
        fetch(`${baseURL}/create-bot/bbands/${bbandsLength}/${bbandsStd}/${timeFrame}/${backtestPeriod}`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then(response => response.json())
            .then(data => {

                let imageData = '';
                const jsonData = data['Output'][1]
    
                // console.log(typeof data['Output'][1]);
                const jsonLength = Object.keys(jsonData).length;
                // console.log(Object.keys(jsonData).length)
    
                if (currentPlot) {
                    const children = myPlotRef.current.children;
                    const len = children.length;
                    for (let i = 0; i < len; i++) {
                        children[i].remove();
                    }
                }
    
                if (jsonLength !== 0) {
    
                    imageData = JSON.parse(data['Output'][1]);

                    // Embed the new plot
                    // setCurrentPlot(embed.embed_item(imageData, 'myplot'));
                    // Delay rendering the plot slightly to allow the DOM to stabilize
                    setTimeout(() => {
                        // Embed the new plot
                        setCurrentPlot(embed.embed_item(imageData, 'myplot'));
                    }, 100);
    
                }
        

            // Handle the response from the server
            setModelPerformance(data['Output'][0]);
            setTestedModel('BBANDS');
            setModelProcess('Submit Model Parameters');
            setModelDone('Model Done Backtesting!');
            })
            .catch(error => {
            console.error('Error:', error);
            setModelProcess('Error Occured')
            });
    }

    const saveRSIParams = () => {

        const data = {
            rsiPeriod, 
            rsiOverbought,
            rsiOversold,
        };

        setModelProcess('Backtesting RSI Model');

        // Make an HTTP POST request
        fetch(`${baseURL}/create-bot/rsi/${rsiPeriod}/${rsiOverbought}/${rsiOversold}/${timeFrame}/${backtestPeriod}`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then(response => response.json())
            .then(data => {
            // Handle the response from the server
            setModelPerformance(data);
            setTestedModel('RSI Model');
            // console.log(modelPerformance);
            setModelProcess('Submit Model Parameters');
            setModelDone('Model Done Backtesting!');
            })
            .catch(error => {
            console.error('Error:', error);
            });
    }


    const saveMomentumParams = () => {

        // console.log('Momentum Button has been clicked!');
        setMomentumProcess('Backtesting Momentum Model');

        // Make an HTTP POST request
        fetch(`${baseURL}/create-bot/momentum/${timeFrame}/${backtestPeriod}`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            // body: JSON.stringify(data),
        })
            .then(response => response.json())
            .then(data => {
            // Handle the response from the server
            console.log(data);
            setModelPerformance(data);
            setTestedModel('Momentum Model');
            setMomentumProcess('Backtest Momentum Model');
            setModelDone('Model Done Backtesting!');
            })
            .catch(error => {
            console.error('Error:', error);
            });
    }

    const saveCandlestickParams = () => {

        setCandlestickProcess('Backtesting Candlestick Model');

        const data = {
            engulfing: engulfing,
            pinbar: pinbar,
            morningStar: morningStar,
            threeWhiteSoldiers: threeWhiteSoldiers,
            dojiStar: dojiStar,
            methods: methods,
        };

        // Make an HTTP POST request
        fetch(`${baseURL}/create-bot/candlesticks/${timeFrame}/${backtestPeriod}`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then(response => response.json())
            .then(data => {
            // Handle the response from the server
            setModelPerformance(data);
            setTestedModel('Candlestick Model');
            setCandlestickProcess('Backtest Candlestick Model');
            setModelDone('Model Done Backtesting!');
            })
            .catch(error => {
            console.error('Error:', error);
            });
    }
// 不客气!如果你有任何其他问题，随时告诉我，我会尽力帮助你。

    
    const MA1Type = (e) => {
        setMa1Type(e.target.value)
    };

    const MA2Type = (e) => {
        setMa2Type(e.target.value)
    };

    const changeMA1 = (e) => {
        setMa1(e.target.value);
    };

    const changeMA2 = (e) => {
        setMa2(e.target.value);
    };

    const changeTimeframe = (e) => {
        setTimeFrame(e.target.value);
    };

    const changeBacktestPeriod = (e) => {
        setBacktestPeriod(e.target.value);
    }

    const changeBBLen = (e) => {
        setbbLength(e.target.value);
    };

    const changeBBStd = (e) => {
        setBbandStd(e.target.value);
    };


    const changeRsiPeriod = (e) => {
        setRsiPeriod(e.target.value);
    };


    const changeRsiOverbought = (e) => {
        setRsiOverbought(e.target.value);
    };


    const changeRsiOversold = (e) => {
        setRsiOversold(e.target.value)
    };


    const nextModel = () => {
        setAvailableModels(!availableModels);
        setModelPerformance("");
    };

    const riskBotExplanation = () => {
        setRiskBot(!riskBot);
    }

    
    const goBack = () => {
        setRiskBot(!riskBot);
        setAvailableModels(!availableModels);
        setModelPerformance("");
        window.location.reload();
    }

    // let [chosenParams, setChosenParams] = useState({});

    const downloadFile = async () => {
        
        try {
          // Fetch the file content (replace with your actual API call)
          const response = await fetch(`${baseURL}/download-mq4/risk-bot`);
          const fileContent = await response.blob();
      
          // Create a Blob from the file content
          const blob = new Blob([fileContent], { type: 'text/plain' });
      
          // Create a URL for the Blob
          const url = window.URL.createObjectURL(blob);
      
          // Create a link element
          const link = document.createElement('a');
          link.href = url;
          link.download = 'risk-bot.ex5'; // Set the desired filename
      
          // Append the link to the body
          document.body.appendChild(link);
      
          // Trigger the download
          link.click();

          // Clean up and remove the link
          document.body.removeChild(link);
          
        //   console.log(`Selected Models are: ${chosenModels}`);
        //   const data = chosenModels;

        //   const magicNumber = generateMagicNumber();

            
          const userEmail = await fetchEmailDataFromAPI();

          
        //   Uncaught Error: Objects are not valid as a React child (found: object with keys {bbandsLength, bbandsStd}). If you meant to render a collection of children, use an array instead.


        // let chosenParams = {};
        //   let [chosenParams, setChosenParams] = usestate({});
        //   try {
              
        //       if (bbands) {
        //         console.log(bbandsLength);
        //         console.log(bbandsStd);
        //         chosenParams['bbandsLength'] = bbandsLength;
        //         chosenParams['bbandsStd'] = bbandsStd;
        //       };
    
        //       if (rsi) {
        //         console.log(rsiPeriod);
        //         console.log(rsiOverbought);
        //         console.log(rsiOversold);
        //         chosenParams['rsiPeriod'] = rsiPeriod;
        //         chosenParams['rsiOverbought'] = rsiOverbought;
        //         chosenParams['rsiOversold'] = rsiOversold;
        //       }
        //       if (movingAverages) {
        //         console.log(ma1Type);
        //         console.log(ma1);
        //         console.log(ma2Type);
        //         console.log(ma2);
        //         chosenParams['ma1Type'] = ma1Type;
        //         chosenParams['ma1'] = ma1;
        //         chosenParams['ma2Type'] = ma2Type;
        //         chosenParams['ma2'] = ma2;
    
        //       };
        //       console.log('Chosen Params: ');
        //       console.log(chosenParams);
        //       data.push(chosenParams);
        //   } catch (error) {
        //     //  do nothing
        //   }
        

          // Make an HTTP POST request
        // fetch(`${baseURL}/chosen-models/${userEmail}/${magicNumber}`, {
        //     method: 'POST',
        //     headers: {
        //     'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify(data),
        // })
            // .then(response => response.json())
            // .then(data => {
            // // Handle the response from the server
            // console.log('Data from API is:');
            // console.log(data);
            // })
            // .catch(error => {
            // console.error('Error:', error);
            // });
        } catch (error) {
          console.error('Error sending data to server:', error);
        }
      }; 


      function generateMagicNumber() {
        return Math.floor(Math.random() * 90000) + 100000;
      };

      const [process, setProcess] = useState('Run Backtest');

      

      const sendParameters = () => {

        const url = `${baseURL}/run-backtest/${timeFrame}/${backtestPeriod}`;
        const data = chosenModels;

        setProcess('Backtesting...');

        let chosenParams = {};

        if (bbands) {
                chosenParams['bbandsLength'] = bbandsLength;
                chosenParams['bbandsStd'] = bbandsStd;
              };   
              
        try {
            // data.push(chosenParams);
          } catch (err) {
            console.log("Error: " + err);
          }

        
        // Make an HTTP POST request
        fetch(url, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then(response => response.json())
            .then(data => {
            // Handle the response from the server
            let imageData = '';
            const jsonData = data['Output'][1]

            // console.log(typeof data['Output'][1]);
            const jsonLength = Object.keys(jsonData).length;
            // console.log(Object.keys(jsonData).length)

            if (currentPlot) {
                const children = myPlotRef.current.children;
                const len = children.length;
                for (let i = 0; i < len; i++) {
                    children[i].remove();
                }
            }

            if (jsonLength !== 0) {
           
                imageData = JSON.parse(data['Output'][1]);  

                // Embed the new plot
                // setCurrentPlot(embed.embed_item(imageData, 'myplot'));
                // Delay rendering the plot slightly to allow the DOM to stabilize
                setTimeout(() => {
                    // Embed the new plot
                    setCurrentPlot(embed.embed_item(imageData, 'myplot'));
                }, 100);

            }
    
            
            // data variable returns first the model performance and then the image html.
            setModelPerformance(data['Output'][0]);
            setModelDone('Model Done Backtesting!');
            setProcess('Run Backtest');
            })
            .catch(error => {
            setProcess('Error occured');
            console.error('Error:', error);
            });
      }
    
    return (
        <div>
            <div className="header">
                <Header />
            </div>
            <div className="main-page-body">
                <SideNavs />
            </div>
            <div className="main-body-info">
                {availableModels && (
                    <div className="create-new-models">
                        <h5>Create New Models</h5>
                        <p className="create-new-models-note">Please note that for Moving Average and Bollinger Bands Bots, you cannot combine them with other models yet.😊</p>
                        
                        <div className="upper-models-div">
                            <div className="candlestick-models">
                                <h6>Candlestick Patterns</h6>
                                {candlestickButtons.map((button, index) => (
                                    <button
                                        className={`btn btn-light ${chosenModels.includes(button) ? 'selected' : ''}`}
                                        key={index}
                                        onClick={() => handleModelSelection(button)}
                                    >
                                        {button}
                                    </button>
                                ))}
                            </div>
                            <div className="technical-models">
                                <h6>Technical Indicators</h6>
                                {technicalButtons.map((button, index) => (
                                    <button
                                        className={`btn btn-light ${chosenModels.includes(button) ? 'selected' : ''}`}
                                        key={index}
                                        onClick={() => handleModelSelection(button)}
                                    >
                                        {button}
                                    </button>
                                ))}
                            </div>
                            
                        </div>
                        <div className="technical-models">
                                <h6>Risk Bot (for MT5)</h6>
                                    <Link className="risk-bot-installation" to='/risk_bot'><p>How can I install risk bot?</p></Link><br />
                                    <button className='btn btn-light' onClick={downloadFile}>
                                        Download Risk Bot
                                    </button>
                            </div>
                        {/* <div className="middle-models-div">
                            <div className="ml-models">
                                <h6>Machine Learning Models</h6>
                                {mlButtons.map((button, index) => (
                                    <button
                                        className={`btn btn-light ${chosenModels.includes(button) ? 'selected' : ''}`}
                                        key={index}
                                        onClick={() => handleModelSelection(button)}
                                    >
                                        {button}
                                    </button>
                                ))}
                            </div>
                            <div className="dl-models">
                                <h6>Deep Learning Models</h6>
                                {dlButtons.map((button, index) => (
                                    <button
                                        className={`btn btn-light ${chosenModels.includes(button) ? 'selected' : ''}`}
                                        key={index}
                                        onClick={() => handleModelSelection(button)}
                                    >
                                        {button}
                                    </button>
                                ))}
                            </div>
                        </div> */}
                        <div className="chosen-models">
                            <h6>Chosen Models</h6>
                            {chosenModels.map((chosen, index) => (
                                <button className="btn btn-light" key={index} onClick={() => removeChosenModel(chosen)}>
                                    {chosen} <i className="bi bi-x"></i>
                                </button>
                            ))}
                        </div><br />
                            <button className="btn btn-light create-models-next" onClick={nextModel}>Next</button>
                            <br /><br />
                            {/* <Loader type="Puff" color="#00BFFF" height={100} width={100} /> */}
                    </div>
                )}

                    {!availableModels && (
                        <div className="backtest-models">
                            <button className="btn btn-light" onClick={goBack}><i className="bi bi-arrow-left-circle"></i> Back</button>

                            {/* Moving Average Model */}
                            <div>
                                <h5 className="backtest-header">Backtest: ({selectedModel})</h5>
                            {movingAverages && (
                                    <div>
                                        
                            <div className="set-moving-average-model">
                                <h6>Moving Average Bot</h6>
                                <h6>Select Parameters to Use</h6><br />
        
                                <p>Select Moving Average Type</p>
                                <select class="form-select" aria-label="Default select example" onChange={MA1Type}>
                                <option selected>Select Type</option>
                                <option value="SMA">Simple Moving Average (SMA)</option>
                                <option value="EMA">Exponential Moving Average (EMA)</option>
                                </select><br />
        
                                <p>Enter Number</p>
                                <input className="form-control" type="number" value={ma1} onChange={changeMA1}></input><br />
        
                                <p>Select Moving Average Type</p>
                                <select class="form-select" aria-label="Default select example" onChange={MA2Type}>
                                <option selected>Select Type</option>
                                <option value="SMA">Simple Moving Average (SMA)</option>
                                <option value="EMA">Exponential Moving Average (EMA)</option>
                                </select><br />
                                
                                <p>Enter Number</p>
                                <input className="form-control" type="number" value={ma2} onChange={changeMA2}></input><br />
                                {/* <i className="bi bi-arrow-clockwise loading-icon"></i> */}

                                {/* <button className="btn btn-primary" onClick={saveParams}> {modelProcess}</button> */}

                            </div>
                            <br />
                                    </div>
                            )}
                            </div>

                             {/* BBands Model */}
                        <div>
                            {bbands && (
                                <div>
                                    <div className="set-bbands-model">
                                        <h6>Bollinger Bands Bot</h6>
                                        <h6>Select Parameters to Use</h6><br />
                                        <p>Enter Length</p>
                                        <input className="form-control" type="number" value={bbandsLength} onChange={changeBBLen}></input>
                                        <br />
                                        <p>Enter Standard Deviation Multiplier</p>
                                        <input className="form-control" type="number" value={bbandsStd} onChange={changeBBStd}></input><br />
                                        
                                        {/* <button className="btn btn-primary" onClick={saveBbandsParams}> {modelProcess}</button> */}
                                    </div><br /> 
                                </div>
                            )}
                        </div>

                            {/* RSI Model */}
                            {rsi && (
                                <div> 
                                    <div className="set-rsi-model">
                                        <h6>Relative Strength Index Bot</h6>
                                        <h6>Select Parameters to Use</h6><br />
        
                                        <p>Enter RSI Period</p>
                                        <input className="form-control" type="number" value={rsiPeriod} onChange={changeRsiPeriod}></input>
                                        <br />
        
                                        <p>Enter Overbought Level</p>
                                        <input className="form-control" type="number" value={rsiOverbought} onChange={changeRsiOverbought}></input><br />
        
                                        <p>Enter Oversold Level</p>
                                        <input className="form-control" type="number" value={rsiOversold} onChange={changeRsiOversold}></input><br />
                                        
                                        {/* <button className="btn btn-primary" onClick={saveRSIParams}><i className="bi bi-arrow-clockwise"></i> {modelProcess}</button> */}
                                    </div><br />
                                </div>
                            )}

                            {momentum && (

                                <div className="momentum-bot-div">
                                    {/* <button className="btn btn-primary momentum-button" onClick={saveMomentumParams}> {momentumProcess}</button> */}
                                </div>
                            )}

                            {(engulfing || pinbar || morningStar || threeWhiteSoldiers || dojiStar || methods) && (
                                <div>
                                
                                    {/* <button className="btn btn-primary candlestick-button" onClick={saveCandlestickParams}> {candlestickProcess}</button> */}
                                </div>
                            )}
                                <div className="timeframe-period">
                                    <p>Select Timeframe</p>
                                    <select class="form-select" aria-label="Default select example" onChange={changeTimeframe}>
                                        <option value="5Min">5Min</option>
                                        <option value="15Min">15Min</option>
                                        <option value="1H">1H</option>
                                        <option value="4H">4H</option>
                                        <option value="1D">1D</option>
                                    </select><br />

                                    <p>Select Period for Backtesting</p>
                                    <select class="form-select" aria-label="Default select example" onChange={changeBacktestPeriod}>
                                        <option value="0-25">0% - 25%</option>
                                        <option value="25-50">25% - 50%</option>
                                        <option value="50-75">50% - 75%</option>
                                        <option value="75-100">75% - 100%</option>
                                    </select>
                                </div>
                                <br />

                        <div className="backtest-buttons-div">
                            {(!movingAverages && !bbands) && (

                            <button className="btn btn-primary backtest-button" onClick={sendParameters}>{process}</button>
                            )}

                            {bbands && (
                                <button className="btn btn-primary backtest-button" onClick={saveBbandsParams}> {modelProcess}</button>
                            )}
                            {movingAverages && (
                                <button className="btn btn-primary backtest-button" onClick={saveParams}> {modelProcess}</button>
                            )}
                        </div>

                                <br /><br />

                                {/* Conditional rendering of modelPerformance */}
                                {modelPerformance && (
                                
                                <div className="model-performance">

                                    <p><b>*Plots only available for 4H and 1D timeframes for now.</b></p>
                                     
                                     <div ref={myPlotRef} id="myplot" className="bk-root">

                                     </div>
                                    {/* {imageHTML} */}
                                    {/* {ReactHtmlParser(imageHTML)} */}
                                    <p className="success-message">{modelDone}</p>
                                    {/* <p><a className='link' href="./moving-average-bot.mq4" download target="_blank" rel="noreferrer">Download Model</a></p> */}
                                    <button className="btn btn-success download-bot-file">Download Model<i class="bi bi-lock-fill"></i></button><br /><br />
                                    <p><h5>Model Performance: {testedModel}</h5></p>
                                    <p># Trades: {modelPerformance['# Trades']}</p>
                                    <p>Start: {modelPerformance.Start}</p>
                                    <p>End: {modelPerformance.End}</p>
                                    <p>Duration: {modelPerformance.Duration}</p>
                                    <p>Return [%]: {modelPerformance['Return [%]']}</p>
                                    <p>Return (Ann.) [%]: {modelPerformance['Return (Ann.) [%]']}</p>
                                    <p>Win Rate [%]: {modelPerformance['Win Rate [%]']}</p>
                                    <p>Best Trade [%]: {modelPerformance['Best Trade [%]']}</p>
                                    <p>Worst Trade [%]: {modelPerformance['Worst Trade [%]']}</p>
                                    <p>Equity Final [$]: {modelPerformance['Equity Final [$]']}</p>
                                    <p>Equity Peak [$]: {modelPerformance['Equity Peak [$]']}</p>
                                    <p>Max. Drawdown Duration: {modelPerformance['Max. Drawdown Duration']}</p>
                                    <p>Avg. Drawdown Duration: {modelPerformance['Avg. Drawdown Duration']}</p>
                                    <p>Avg. Drawdown [%]: {modelPerformance['Avg. Drawdown [%]']}</p>
                                    <p>Avg. Trade Duration: {modelPerformance['Avg. Trade Duration']}</p>
                                    <p>Avg. Trade [%]: {modelPerformance['Avg. Trade [%]']}</p>
                                    <p>Buy & Hold Return [%]: {modelPerformance['Buy & Hold Return [%]']}</p>
                                    <p>Calmar Ratio: {modelPerformance['Calmar Ratio']}</p>
                                    <p>Expectancy [%]: {modelPerformance['Expectancy [%]']}</p>
                                    <p>Exposure Time [%]: {modelPerformance['Exposure Time [%]']}</p>
                                    <p>Max. Drawdown [%]: {modelPerformance['Max. Drawdown [%]']}</p>
                                    <p>Max. Trade Duration: {modelPerformance['Max. Trade Duration']}</p>
                                    <p>Profit Factor: {modelPerformance['Profit Factor']}</p>
                                    <p>SQN: {modelPerformance.SQN}</p>
                                    <p>Sharpe Ratio: {modelPerformance['Sharpe Ratio']}</p>
                                    <p>Sortino Ratio: {modelPerformance['Sortino Ratio']}</p>
                                    <p>Volatility (Ann.) [%]: {modelPerformance['Volatility (Ann.) [%]']}</p>
                                </div>
                                
                                )}
                        </div>
                    )}
                        {/* <button className="btn btn-primary" onClick={saveParams}>Sumbit</button> */}        
            </div>
        </div>
    );
}

