import React, { useEffect, useState } from "react";
import Header from "./header";
import SideNavs from "./side_navs";
import Cookies from 'js-cookie';
import { Link } from "react-router-dom";
import axios from 'axios';

export default function PerformanceReview() {
    const [assets, setAssets] = useState([]);
    const baseURL = 'https://backend-production-c0ab.up.railway.app';

    useEffect(() => {
        async function fetchAssets() {
            try {
                const response = await axios.get(`${baseURL}/get-user-assets`);
                const assetList = response.data.message;
                setAssets(assetList);
            } catch (error) {
                console.error('Error fetching assets:', error);
            }
        }

        fetchAssets();
    }, []);

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
                        <button className="btn btn-primary" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasWithBothOptions" aria-controls="offcanvasWithBothOptions"><i className="bi bi-list"></i></button>
                        <div className="offcanvas offcanvas-start" data-bs-scroll="true" tabIndex="-1" id="offcanvasWithBothOptions" aria-labelledby="offcanvasWithBothOptionsLabel">
                            <div className="offcanvas-header">
                                <h5 className="offcanvas-title" id="offcanvasWithBothOptionsLabel">Select Assets</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                            </div>
                            <div className="offcanvas-body">
                                {assets.length > 0 ? (
                                    assets.map((asset, index) => (
                                        <Link key={index} to={`/performance_review/${asset.toLowerCase()}`} className="performance_review_asset">
                                            <p>{asset}</p>
                                        </Link>
                                    ))
                                ) : (
                                    <p>Loading assets...</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
