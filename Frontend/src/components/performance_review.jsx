import React, { useEffect, useState } from "react";
import Header from "./header";
import SideNavs from "./side_navs";
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

export default function PerformanceReview() {
    const [assets, setAssets] = useState([]);
    const [selectedAsset, setSelectedAsset] = useState(null);
    const [profitList, setProfitList] = useState([]);
    const [winRate, setWinRate] = useState(0);
    const [lossRate, setLossRate] = useState(0);
    const [overallReturn, setOverallReturn] = useState(0);
    const [loading, setLoading] = useState(false);
    const [loadingAssets, setLoadingAssets] = useState(true);
    const baseURL = 'https://backend-production-c0ab.up.railway.app';
    const initialEquity = 10000;

    useEffect(() => {
        async function fetchAssets() {
            try {
                const response = await axios.get(`${baseURL}/get-user-assets`);
                const assetList = response.data.message;
                setAssets(assetList);
            } catch (error) {
                console.error('Error fetching assets:', error);
            } finally {
                setLoadingAssets(false);
            }
        }

        fetchAssets();
    }, []);

    useEffect(() => {
        if (selectedAsset) {
            setLoading(true);
            async function fetchAssetData() {
                try {
                    const response = await axios.get(`${baseURL}/fetch-asset-data/${selectedAsset}`);
                    const data = response.data;
                    setProfitList(data.profit_list);
                    setWinRate(data.win_rate);
                    setLossRate(data.loss_rate);
                    setOverallReturn(data.overall_return);
                } catch (error) {
                    console.error('Error fetching asset data:', error);
                } finally {
                    setLoading(false);
                }
            }

            fetchAssetData();
        }
    }, [selectedAsset]);

    const calculateEquityCurve = (profits) => {
        let equity = initialEquity;
        return profits.map(profit => {
            equity += profit;
            return equity;
        });
    };

    const equityCurve = calculateEquityCurve(profitList);

    const data = {
        labels: equityCurve.map((_, index) => index + 1),
        datasets: [
            {
                label: 'Equity Curve',
                data: equityCurve,
                fill: false,
                backgroundColor: 'rgba(75,192,192,0.6)',
                borderColor: 'rgba(75,192,192,1)',
            },
        ],
    };

    return (
        <div>
            <div className="header">
                <Header />
            </div>
            <div className="main-page-body">
                <SideNavs />
                <div className="main-body-info">
                    <h5 className="major-upcoming-news-events-header">Performance Review</h5>
                    <br />
                    <div className="performance-review-div">
                        <button className="btn btn-primary" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasWithBothOptions" aria-controls="offcanvasWithBothOptions"><i className="bi bi-list"></i></button><br />
                        <div className="offcanvas offcanvas-start" data-bs-scroll="true" tabIndex="-1" id="offcanvasWithBothOptions" aria-labelledby="offcanvasWithBothOptionsLabel">
                            <div className="offcanvas-header">
                                <h5 className="offcanvas-title" id="offcanvasWithBothOptionsLabel">Select Assets</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                            </div>
                            <div className="offcanvas-body">
                                {loadingAssets ? (
                                    <p>Loading assets...</p>
                                ) : (
                                    assets.map((asset, index) => (
                                        <p key={index} onClick={() => setSelectedAsset(asset)} className="performance-select-asset">
                                            {asset}
                                        </p>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {selectedAsset && (
                        <div>
                            <p>Performance Review for {selectedAsset.toUpperCase()}</p>
                            {loading ? (
                                <p>Loading data...</p>
                            ) : (
                                <div className="personal-asset-review">
                                    {/* <h4>Equity Curve Chart</h4> */}
                                    <div className="personal-asset-review-line-chart">
                                        <Line data={data} />
                                    </div>
                                    <div>
                                        <br />
                                        <br />
                                        <p>Win Rate: {winRate}%</p>
                                        <p>Loss Rate: {lossRate}%</p>
                                        <p>Overall Return: {overallReturn}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
