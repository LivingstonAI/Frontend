import React, { useEffect, useState } from "react";
import Header from "./header";
import SideNavs from "./side_navs";
import { Link } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import InteractiveCOTChart from "./cot_interactive_chart";

const COTDataSelector = ({ onAssetsSelected }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAssets, setSelectedAssets] = useState([]);

  const availableAssets = [
    'USD INDEX - ICE FUTURES U.S.',
    'EURO FX - CHICAGO MERCANTILE EXCHANGE',
    'BRITISH POUND - CHICAGO MERCANTILE EXCHANGE',
    'CANADIAN DOLLAR - CHICAGO MERCANTILE EXCHANGE',
    'SWISS FRANC - CHICAGO MERCANTILE EXCHANGE',
    'JAPANESE YEN - CHICAGO MERCANTILE EXCHANGE',
    'NZ DOLLAR - CHICAGO MERCANTILE EXCHANGE',
    'AUSTRALIAN DOLLAR - CHICAGO MERCANTILE EXCHANGE',
    'GOLD - COMMODITY EXCHANGE INC.',
    'UST BOND - CHICAGO BOARD OF TRADE',
    'UST 10Y NOTE - CHICAGO BOARD OF TRADE',
    'UST 5Y NOTE - CHICAGO BOARD OF TRADE',
    'NASDAQ MINI - CHICAGO MERCANTILE EXCHANGE',
    'E-MINI S&P 500 -',
    'DOW JONES U.S. REAL ESTATE IDX - CHICAGO BOARD OF TRADE'
  ];

  const handleAssetToggle = (asset) => {
    setSelectedAssets(prev => 
      prev.includes(asset) 
        ? prev.filter(a => a !== asset)
        : [...prev, asset]
    );
  };

  const handleSubmit = () => {
    onAssetsSelected(selectedAssets);
    setIsModalOpen(false);
  };

  return (
    <div>
      <button 
        onClick={() => setIsModalOpen(true)}
        className="select-assets-btn"
      >
        Select Assets
      </button>

      {isModalOpen && (
        <div className="modal-quant-overlay">
          <div className="modal-quant-content">
            <div className="modal-quant-header">
              <h3 className="modal-quant-title">Select Assets to Display</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="close-btn"
              >
                ×
              </button>
            </div>

            <div className="asset-list">
              {availableAssets.map(asset => (
                <div key={asset} className="asset-item">
                  <label className="asset-label">
                    <input
                      type="checkbox"
                      checked={selectedAssets.includes(asset)}
                      onChange={() => handleAssetToggle(asset)}
                      className="asset-checkbox"
                    />
                    <span className="asset-text">{asset}</span>
                  </label>
                </div>
              ))}
            </div>

            <div className="modal-quant-footer">
              <button 
                onClick={handleSubmit}
                className="submit-btn"
                disabled={selectedAssets.length === 0}
              >
                Fetch Selected Data
              </button><br />
              <button 
                onClick={() => setIsModalOpen(false)}
                className="cancel-btn"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .select-assets-btn {
          padding: 10px 20px;
          background-color: #3b82f6;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 16px;
          transition: background-color 0.2s;
        }

        .select-assets-btn:hover {
          background-color: #2563eb;
        }

        .modal-quant-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .modal-quant-content {
          background-color: white;
          border-radius: 8px;
          width: 90%;
          max-width: 600px;
          max-height: 90vh;
          display: flex;
          flex-direction: column;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .modal-quant-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 24px;
          border-bottom: 1px solid #e5e7eb;
        }

        .modal-quant-title {
          font-size: 20px;
          font-weight: 600;
          color: #1f2937;
          margin: 0;
        }

        .close-btn {
          background: none;
          border: none;
          font-size: 24px;
          color: #6b7280;
          cursor: pointer;
          padding: 4px;
        }

        .close-btn:hover {
          color: #1f2937;
        }

        .asset-list {
          padding: 20px 24px;
          overflow-y: auto;
          max-height: 60vh;
        }

        .asset-item {
          margin-bottom: 12px;
        }

        .asset-label {
          display: flex;
          align-items: center;
          cursor: pointer;
          padding: 8px;
          border-radius: 4px;
          transition: background-color 0.2s;
        }

        .asset-label:hover {
          background-color: #f3f4f6;
        }

        .asset-checkbox {
          width: 16px;
          height: 16px;
          margin-right: 12px;
          cursor: pointer;
        }

        .asset-text {
          font-size: 14px;
          color: #374151;
        }

        .modal-quant-footer {
          padding: 16px 24px;
          border-top: 1px solid #e5e7eb;
          display: flex;
          justify-content: flex-end;
          gap: 12px;
        }

        .submit-btn {
          padding: 8px 16px;
          background-color: #3b82f6;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          transition: background-color 0.2s;
        }

        .submit-btn:hover:not(:disabled) {
          background-color: #2563eb;
        }

        .submit-btn:disabled {
          background-color: #9ca3af;
          cursor: not-allowed;
        }

        .cancel-btn {
          padding: 8px 16px;
          background-color: #f3f4f6;
          color: #374151;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          transition: background-color 0.2s;
        }

        .cancel-btn:hover {
          background-color: #e5e7eb;
        }
      `}</style>
    </div>
  );
};

const Alert = ({ children, className = '' }) => (
  <div className={`p-4 mb-4 text-red-700 bg-red-100 rounded-lg ${className}`} role="alert">
    {children}
  </div>
);

export default function MarketMakers() {
  const [showModal, setShowModal] = useState(false);
  const [cotData, setCotData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [apiResponse, setApiResponse] = useState('');
  const [centralBanksArray, setCentralBanksArray] = useState([]);
  const [ratesArray, setRatesArray] = useState([]);
  const [bankOne, setBankOne] = useState('Federal Reserve (USA)');
  const [bankTwo, setBankTwo] = useState('Federal Reserve (USA)');
  const [submitButton, setSubmitButton] = useState('Submit');
  const [calculatedRate, setCalculatedRate] = useState('');
  const [firstRate, setFirstRate] = useState();
  const [secondRate, setSecondRate] = useState();

  // UPDATED: Change to use your Django backend URL
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
        // UPDATED: Use your custom Django endpoint instead of external API
        const response = await fetch(`${baseUrl}/api/v2024/custom-global-interest-rates-database/`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();

        // Check if there's an error in the response
        if (data.error) {
          throw new Error(data.message || 'Failed to fetch interest rates data');
        }

        setApiResponse(data['Interest Rates']);

        const centralBankRates = JSON.parse(data['Interest Rates']).central_bank_rates;
        const labels = centralBankRates.map((rate) => rate.central_bank);
        setCentralBanksArray(labels);
        
        const interestRates = centralBankRates.map((rate) => rate.rate_pct);
        setRatesArray(interestRates);

        // Enhanced chart styling for better visualization
        const backgroundColors = centralBankRates.map((_, index) => {
          const colors = [
            'rgba(59, 130, 246, 0.8)',  // Blue
            'rgba(16, 185, 129, 0.8)',  // Green
            'rgba(245, 101, 101, 0.8)', // Red
            'rgba(251, 191, 36, 0.8)',  // Yellow
            'rgba(139, 92, 246, 0.8)',  // Purple
            'rgba(236, 72, 153, 0.8)',  // Pink
            'rgba(34, 197, 94, 0.8)',   // Emerald
            'rgba(249, 115, 22, 0.8)',  // Orange
          ];
          return colors[index % colors.length];
        });

        const borderColors = backgroundColors.map(color => color.replace('0.8', '1'));

        setChartData({
          labels: labels,
          datasets: [
            {
              label: "Global Interest Rates (%)",
              data: interestRates,
              backgroundColor: backgroundColors,
              borderColor: borderColors,
              borderWidth: 2,
              borderRadius: 4,
              borderSkipped: false,
            },
          ],
        });

        // Set default values for the first two banks
        if (labels.length >= 2) {
          setBankOne(labels[0]);
          setBankTwo(labels[1]);
          setFirstRate(interestRates[0]);
          setSecondRate(interestRates[1]);
        }

      } catch (error) {
        console.error("Error fetching interest rates data:", error);
        setError(`Error fetching interest rates data: ${error.message}. Please try again later.`);
      }
    };

    fetchInterestRatesData();
  }, [baseUrl]);

  const handleShowModal = () => {
    setShowModal(!showModal);
  };

  // Chart options for better visualization
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Current Global Interest Rates',
        font: {
          size: 16,
          weight: 'bold'
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Interest Rate (%)'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Central Banks'
        }
      }
    }
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
              {error ? (
                <Alert className="mb-4">
                  {error}
                </Alert>
              ) : (
                <Bar data={chartData} options={chartOptions} />
              )}
            </div>

            <div className="interest-rate-differentials mt-8">
              <h6 className="text-xl font-semibold mb-4">Calculate Interest Rate Differentials</h6>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="font-bold mb-2">Central Bank 1</p>
                  <select className='form-control w-full' value={bankOne} onChange={changeBankOne}>
                    <option value="">Select Central Bank</option>
                    {centralBanksArray.map((bank, index) => (
                      <option key={index} value={bank}>{bank}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <p className="font-bold mb-2">Central Bank 2</p>
                  <select className='form-control w-full' value={bankTwo} onChange={changeBankTwo}>
                    <option value="">Select Central Bank</option>
                    {centralBanksArray.map((bank, index) => (
                      <option key={index} value={bank}>{bank}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="selected-central-banks mt-6">
                <p className="font-bold mb-2">Selected Central Banks</p>
                <ul className="list-disc pl-5">
                  <li>{bankOne}: {firstRate !== undefined ? `${firstRate}%` : 'N/A'}</li>
                  <li>{bankTwo}: {secondRate !== undefined ? `${secondRate}%` : 'N/A'}</li>
                </ul>
              </div>

              <button 
                className="btn btn-primary submit-interest-rate-calculation mt-4" 
                onClick={submitCalculation}
                disabled={!firstRate || !secondRate}
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
            </div>
          </div><br /><br /><br />
          
          <div className="cot-data-container mt-8">
            <h6 className="text-xl font-semibold mb-4">COT Data</h6>
            
            <COTDataSelector onAssetsSelected={handleAssetSelection} />

            {error && (
              <Alert className="mb-4">
                {error}
              </Alert>
            )}

            {loading ? (
              <div className="flex justify-center items-center py-8">
                <div className="loader">Loading...</div>
              </div>
            ) : Object.keys(cotData).length > 0 ? (
              <>
                <div className="overflow-x-auto mb-8">
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
                </div>

                <div className="interactive-charts-container space-y-8">
                  <h6 className="text-xl font-semibold mb-6 text-gray-800">Interactive COT Charts</h6>
                  {Object.keys(cotData).map(asset => (
                    cotData[asset]['Chart Data'] && (
                      <div key={asset} className="chart-section">
                        <InteractiveCOTChart 
                          asset={asset}
                          chartData={cotData[asset]['Chart Data']}
                        />
                      </div>
                    )
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