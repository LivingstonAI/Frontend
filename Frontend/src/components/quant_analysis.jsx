import React, { useEffect, useState } from "react";
import Header from "./header";
import SideNavs from "./side_navs";
import { Link } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import COTModal from "./cot_modal";


export default function MarketMakers() {

  const [showModal, setShowModal] = useState(false);

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


  const changeBankOne = (e) => {
    if (e.target.value !== 'Select Central Bank') {
      let firstBank = e.target.value;
      // let firstBankPercentage
      setBankOne(firstBank);
    }
  }
  
  const changeBankTwo = (e) => {
    if (e.target.value !== 'Select Central Bank') {
      let secondBank = e.target.value;
      setBankTwo(secondBank);
    }
  }

  const submitCalculation = () => {
    setSubmitButton('Calculating...');
    let calculation = 0;

    const bankOneIndex = centralBanksArray.indexOf(bankOne);
    const bankTwoIndex = centralBanksArray.indexOf(bankTwo);
    const rateOne = ratesArray[bankOneIndex];
    const rateTwo = ratesArray[bankTwoIndex];

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
                    <li>{bankOne}</li>
                    <li>{bankTwo}</li>
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
      </div>
    </div>
  );
}

