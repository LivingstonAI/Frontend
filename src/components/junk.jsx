// Just some old code for nostalgia, lol!


// Old Personal Info code :)
<div className="personal-info">
                    <div className="personal-info-content">
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
                {/* <select className="form-control" 
                onChange={handleAssetSelect}
                onClick={toggleModal}
                    >
                </select> */}
                <button className="btn btn-light" onClick={toggleModal}>Choose Options</button>

                {/* {assetArray && mainAssets.length > 0 && ( */}
                <div className="selected-assets">
                    {assetArray.map((asset, index) => (
                    <span key={index} className="selected-asset">
                        <button className="btn btn-light selected-asset-button" onClick={() => handleRemoveAsset(asset)}>
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























import React, { useEffect, useState } from "react";
import Header from "./header";
import SideNavs from "./side_navs";
import { Link } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import COTModal from "./cot_modal";


export default function MarketMakers() {

  const [showModal, setShowModal] = useState(false);

  const [cotData, setCotData] = useState({});


  const [centralBanksArray, setCentralBanksArray] = useState([]);
  const [ratesArray, setRatesArray] = useState([]);

  const baseUrl = "https://backend-production-c0ab.up.railway.app";
  const [apiResponse, setApiResponse] = useState('');

  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Global Interest Rates (%)",
        data: [],
        backgroundColor: [],
        borderColor: [],
        borderWidth: 1,
      },
    ],
  });

  const [bankOne, setBankOne] = useState('Australian Central Bank');
  const [bankTwo, setBankTwo] = useState('Australian Central Bank');

  const [submitButton, setSubmitButton] = useState('Submit');

  const [calculatedRate, setCalculatedRate] = useState('');

  const [firstRate, setFirstRate] = useState();
  const [secondRate, setSecondRate] = useState();


  const changeBankOne = (e) => {
    if (e.target.value !== 'Select Central Bank') {
      let firstBank = e.target.value;
      // let firstBankPercentage
      setBankOne(firstBank);
      
    const bankOneIndex = centralBanksArray.indexOf(firstBank);
    const rateOne = ratesArray[bankOneIndex];
    setFirstRate(rateOne);
    }
  }
  
  const changeBankTwo = (e) => {
    if (e.target.value !== 'Select Central Bank') {
      let secondBank = e.target.value;
      setBankTwo(secondBank);
      const bankTwoIndex = centralBanksArray.indexOf(secondBank);
      const rateTwo = ratesArray[bankTwoIndex];
      setSecondRate(rateTwo);
    }
  }

  const submitCalculation = () => {
    setSubmitButton('Calculating...');
    let calculation = 0;

    const bankOneIndex = centralBanksArray.indexOf(bankOne);
    const bankTwoIndex = centralBanksArray.indexOf(bankTwo);
    const rateOne = ratesArray[bankOneIndex];
    const rateTwo = ratesArray[bankTwoIndex];
    // setFirstRate(rateOne);
    // setSecondRate(rateTwo);

    if (rateOne > rateTwo) {
      calculation = rateOne - rateTwo;
    }
    else {
      calculation = rateTwo - rateOne;
    };
    
    setCalculatedRate(`${calculation.toFixed(2)}%`);
    setSubmitButton('Submit');
    
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${baseUrl}/interest-rates-data`);
        const data = await response.json();

        // console.log('Returned Data');
        // console.log(JSON.parse(data['Interest Rates']))
        setApiResponse(data['Interest Rates']);

        // Extracting data for the chart
        const centralBankRates = JSON.parse(data['Interest Rates']).central_bank_rates;
        const labels = centralBankRates.map((rate) => rate.central_bank);
        setCentralBanksArray(labels);
    
        const interestRates = centralBankRates.map((rate) => rate.rate_pct);

        setRatesArray(interestRates);

        setChartData({
          labels: labels,
          datasets: [
            {
              label: "Global Interest Rates (%)",
              data: interestRates,
              // backgroundColor: ["rgba(75, 192, 192, 0.2)", "rgba(75, 192, 192, 0.2)", "rgba(75, 192, 192, 0.2)", "rgba(75, 192, 192, 0.2)"],
              borderColor: ["rgba(75, 192, 192, 1)", "rgba(75, 192, 192, 1)", "rgba(75, 192, 192, 1)", "rgba(75, 192, 192, 1)"],
              borderWidth: 1,
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleShowModal = () => {
    setShowModal(!showModal);
  }

  useEffect(() => {
    const fetchCOTData = async () => {
      try {
        const response = await fetch(`${baseUrl}/generate-cot-data`);
        const data = await response.json();
        setCotData(data);
        console.log('Cot Data', cotData);
      } catch (error) {
        console.error("Error fetching COT data:", error);
      }
    };
  
    fetchCOTData();
  }, []);
  

  return (
    <div>
      <div className="header">
        <Header />
      </div>
      <div className="main-page-body">
        <SideNavs />
        <div className="main-body-info">
          <div className="market-maker-section">
          <div className="global-interest-rates-header">
            <Link to="https://www.global-rates.com/en/interest-rates/central-banks/" target="_blank">
              <h5>Global Interest Rates</h5>
            </Link>
            <p>Global Interest Rates are the "fundamental driver" that sets the tone for long-term macro price movement.</p>
          </div>
          <div className="interest-rates-bar-chart-container">
            <Bar data={chartData} />
          </div><br /><br />

          <div className="interest-rate-differentials">
            <h6>Calculate Interest Rate Differentials</h6><br />
            <b><p>Central Bank 1</p></b>
            <div className="select-rate-diff">
            <select className='form-control' onChange={changeBankOne}>
                {centralBanksArray.map((bank, index) => (
                <option key={index} value={bank}>{bank}</option>
                ))}
            </select>
            </div><br />

            <b><p>Central Bank 2</p></b>
            <div className="select-rate-diff">
            <select className='form-control' onChange={changeBankTwo}>
                {centralBanksArray.map((bank, index) => (
                <option key={index} value={bank}>{bank}</option>
                ))}
            </select>
            </div><br />

            <div className="selected-central-banks">
                  <b><p>Selected Central Banks</p></b>
                  {/* <ol className="chosen-central-banks"> */}
                    <li>{bankOne}: {firstRate}%</li>
                    <li>{bankTwo}: {secondRate}%</li>
                  {/* </ol> */}
            </div><br />

            <button className="btn btn-primary submit-interest-rate-calculation" onClick={submitCalculation}>{submitButton}</button>
            <br /><br />

            <b>Interest Rate Differential: </b> {calculatedRate}<br /><br />
            
          <Link to="https://www.barchart.com" target="_blank" >View COT Data</Link><br /><br />
          <div className="cot-data-explanation">
          <Link to="#" className="cot-explanation-link" onClick={handleShowModal}><h6>What Is COT Data?</h6></Link>
                  {showModal && (
                    <COTModal />
                  )}
            </div>
          </div><br /><br />
          </div>

        </div><br />
        <div className="cot-data-container">
          <h6>COT Data</h6>
          <table className="cot-data-table">
            <thead>
              <tr>
                <th>Asset</th>
                <th>Date</th>
                <th>Noncommercial Long (%)</th>
                <th>Noncommercial Short (%)</th>
                <th>Commercial Long (%)</th>
                <th>Commercial Short (%)</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(cotData).map((asset) => (
                <tr key={asset}>
                  <td>{asset}</td>
                  <td>{cotData[asset].Date}</td>
                  <td>{cotData[asset]['Percentage Noncommercial Long']}</td>
                  <td>{cotData[asset]['Percentage Noncommercial Short']}</td>
                  <td>{cotData[asset]['Percentage Commercial Long']}</td>
                  <td>{cotData[asset]['Percentage Commercial Short']}</td>
                  {/* <img src={cotData[asset].PlotURL} alt={`Plot for ${asset}`} style={{ width: '100%', height: 'auto' }} /> */}

                </tr>
              ))}
            </tbody>
          </table><br />
          <div className="plots-container">
            {Object.keys(cotData).map(asset => (
              <div key={asset} className="plot-item">
                <br />
                <h6>{asset}</h6>
                <img src={cotData[asset]['Plot URL']} alt={`Plot for ${asset}`} style={{ width: '100%', height: 'auto' }} />
                
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}