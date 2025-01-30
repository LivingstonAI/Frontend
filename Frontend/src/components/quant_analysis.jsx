import React, { useEffect, useState } from "react";
import Header from "./header";
import SideNavs from "./side_navs";
import { Link } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import COTModal from "./cot_modal";
// import { Alert } from '@/components/ui/alert';

const COTDataSelector = ({ onAssetsSelected }) => {
  const availableAssets = [
    'USD INDEX - ICE FUTURES U.S.',
    'EURO FX - CHICAGO MERCANTILE EXCHANGE',
    'BRITISH POUND - CHICAGO MERCANTILE EXCHANGE',
    'GOLD - COMMODITY EXCHANGE INC.',
    'UST BOND - CHICAGO BOARD OF TRADE',
    'UST 10Y NOTE - CHICAGO BOARD OF TRADE',
    'UST 5Y NOTE - CHICAGO BOARD OF TRADE',
    'NASDAQ MINI - CHICAGO MERCANTILE EXCHANGE',
    'E-MINI S&P 500 -',
    'DOW JONES U.S. REAL ESTATE IDX - CHICAGO BOARD OF TRADE'
  ];

  const [selectedAssets, setSelectedAssets] = useState([]);

  const handleAssetToggle = (asset) => {
    setSelectedAssets(prev => 
      prev.includes(asset) 
        ? prev.filter(a => a !== asset)
        : [...prev, asset]
    );
  };

  const handleSubmit = () => {
    onAssetsSelected(selectedAssets);
  };

  const Alert = ({ children, className = '' }) => (
    <div className={`p-4 mb-4 text-red-700 bg-red-100 rounded-lg ${className}`} role="alert">
      {children}
    </div>
  );

  return (
    <div className="p-4 border rounded-lg shadow-sm mb-6">
      <h3 className="text-lg font-semibold mb-4">Select Assets to Display</h3>
      <div className="space-y-2">
        {availableAssets.map(asset => (
          <div key={asset} className="flex items-center space-x-2">
            <input
              type="checkbox"
              id={asset}
              checked={selectedAssets.includes(asset)}
              onChange={() => handleAssetToggle(asset)}
              className="w-4 h-4"
            />
            <label htmlFor={asset} className="text-sm">
              {asset}
            </label>
          </div>
        ))}
      </div>
      <button 
        onClick={handleSubmit}
        className="btn btn-primary mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        disabled={selectedAssets.length === 0}
      >
        Fetch Selected Data
      </button>
    </div>
  );
};

export default function MarketMakers() {
  const [showModal, setShowModal] = useState(false);
  const [cotData, setCotData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [apiResponse, setApiResponse] = useState('');
  
  const [centralBanksArray, setCentralBanksArray] = useState([]);
  const [ratesArray, setRatesArray] = useState([]);
  const [bankOne, setBankOne] = useState('Australian Central Bank');
  const [bankTwo, setBankTwo] = useState('Australian Central Bank');
  const [submitButton, setSubmitButton] = useState('Submit');
  const [calculatedRate, setCalculatedRate] = useState('');
  const [firstRate, setFirstRate] = useState();
  const [secondRate, setSecondRate] = useState();

  const baseUrl = "https://backend-production-c0ab.up.railway.app";
  
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

  const handleAssetSelection = async (selectedAssets) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${baseUrl}/generate-cot-data`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ assets: selectedAssets }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch COT data');
      }
      
      const data = await response.json();
      setCotData(data);
    } catch (error) {
      setError('Error fetching COT data. Please try again later.');
      console.error("Error fetching COT data:", error);
    } finally {
      setLoading(false);
    }
  };

  const changeBankOne = (e) => {
    if (e.target.value !== 'Select Central Bank') {
      let firstBank = e.target.value;
      setBankOne(firstBank);
      const bankOneIndex = centralBanksArray.indexOf(firstBank);
      const rateOne = ratesArray[bankOneIndex];
      setFirstRate(rateOne);
    }
  };
  
  const changeBankTwo = (e) => {
    if (e.target.value !== 'Select Central Bank') {
      let secondBank = e.target.value;
      setBankTwo(secondBank);
      const bankTwoIndex = centralBanksArray.indexOf(secondBank);
      const rateTwo = ratesArray[bankTwoIndex];
      setSecondRate(rateTwo);
    }
  };

  const submitCalculation = () => {
    setSubmitButton('Calculating...');
    let calculation = 0;

    const bankOneIndex = centralBanksArray.indexOf(bankOne);
    const bankTwoIndex = centralBanksArray.indexOf(bankTwo);
    const rateOne = ratesArray[bankOneIndex];
    const rateTwo = ratesArray[bankTwoIndex];

    calculation = Math.abs(rateOne - rateTwo);
    setCalculatedRate(`${calculation.toFixed(2)}%`);
    setSubmitButton('Submit');
  };

  useEffect(() => {
    const fetchInterestRatesData = async () => {
      try {
        const response = await fetch(`${baseUrl}/interest-rates-data`);
        const data = await response.json();

        setApiResponse(data['Interest Rates']);

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
              borderColor: ["rgba(75, 192, 192, 1)"],
              borderWidth: 1,
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching interest rates data:", error);
        setError('Error fetching interest rates data. Please try again later.');
      }
    };

    fetchInterestRatesData();
  }, []);

  const handleShowModal = () => {
    setShowModal(!showModal);
  };

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
            </div>

            <div className="interest-rate-differentials mt-8">
              <h6 className="text-xl font-semibold mb-4">Calculate Interest Rate Differentials</h6>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="font-bold mb-2">Central Bank 1</p>
                  <select className='form-control w-full' onChange={changeBankOne}>
                    {centralBanksArray.map((bank, index) => (
                      <option key={index} value={bank}>{bank}</option>
                    ))}
                  </select>
                </div><br />

                <div>
                  <p className="font-bold mb-2">Central Bank 2</p>
                  <select className='form-control w-full' onChange={changeBankTwo}>
                  {centralBanksArray.map((bank, index) => (
                      <option key={index} value={bank}>{bank}</option>
                    ))}
                  </select>
                </div>
              </div><br />

              <div className="selected-central-banks mt-6">
                <p className="font-bold mb-2">Selected Central Banks</p>
                <ul className="list-disc pl-5">
                  <li>{bankOne}: {firstRate}%</li>
                  <li>{bankTwo}: {secondRate}%</li>
                </ul>
              </div>

              <button 
                className="btn btn-primary submit-interest-rate-calculation mt-4" 
                onClick={submitCalculation}
              >
                {submitButton}
              </button>

              <div className="mt-4">
                <span className="font-bold">Interest Rate Differential: </span>
                {calculatedRate}
              </div>
            </div><br />

            <div className="cot-section mt-8">
              <Link to="https://www.barchart.com" target="_blank">View COT Data</Link>
              
              <div className="cot-data-explanation mt-4">
                <Link to="#" className="cot-explanation-link" onClick={handleShowModal}>
                  <h6>What Is COT Data?</h6>
                </Link>
                {showModal && <COTModal />}
              </div>
            </div>
          </div><br />

          <div className="cot-data-container mt-8">
            <h6 className="text-xl font-semibold mb-4">COT Data</h6>
            
            <COTDataSelector onAssetsSelected={handleAssetSelection} />

            {error && (
              <Alert variant="destructive" className="mb-4">
                {error}
              </Alert>
            )}

            {loading ? (
              <div className="flex justify-center items-center py-8">
                <div className="loader">Loading...</div>
              </div>
            ) : Object.keys(cotData).length > 0 ? (
              <>
                <div className="overflow-x-auto">
                  <table className="cot-data-table w-full">
                    <thead>
                      <tr>
                        <th className="px-4 py-2 text-left">Asset</th>
                        <th className="px-4 py-2 text-left">Date</th>
                        <th className="px-4 py-2 text-right">Noncommercial Long (%)</th>
                        <th className="px-4 py-2 text-right">Noncommercial Short (%)</th>
                        <th className="px-4 py-2 text-right">Commercial Long (%)</th>
                        <th className="px-4 py-2 text-right">Commercial Short (%)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.keys(cotData).map((asset) => (
                        <tr key={asset} className="border-t">
                          <td className="px-4 py-2">{asset}</td>
                          <td className="px-4 py-2">{cotData[asset].Date}</td>
                          <td className="px-4 py-2 text-right">{cotData[asset]['Percentage Noncommercial Long']}</td>
                          <td className="px-4 py-2 text-right">{cotData[asset]['Percentage Noncommercial Short']}</td>
                          <td className="px-4 py-2 text-right">{cotData[asset]['Percentage Commercial Long']}</td>
                          <td className="px-4 py-2 text-right">{cotData[asset]['Percentage Commercial Short']}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div><br />

                <div className="plots-container grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                  {Object.keys(cotData).map(asset => (
                    <div key={asset} className="plot-item bg-white p-4 rounded-lg shadow">
                      <h6 className="text-lg font-semibold mb-4">{asset}</h6>
                      <img 
                        src={cotData[asset]['Plot URL']} 
                        alt={`Plot for ${asset}`} 
                        className="w-full h-auto"
                      />
                    </div>
                  ))}
                </div>

              </>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Please select assets to view COT data
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}