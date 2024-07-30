import React, { useEffect, useState } from "react";
import Header from "./header";
import SideNavs from "./side_navs";
import Cookies from 'js-cookie';
import { Link } from "react-router-dom";


export default function PerformanceReview() {

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

                            <div className="offcanvas offcanvas-start" data-bs-scroll="true" tabindex="-1" id="offcanvasWithBothOptions" aria-labelledby="offcanvasWithBothOptionsLabel">
                            <div className="offcanvas-header">
                                <h5 className="offcanvas-title" id="offcanvasWithBothOptionsLabel">Select Assets</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                            </div>
                            <div className="offcanvas-body">
                                <Link to="/performance_review/eurusd" className="performance_review_asset"><p>EURUSD</p></Link>
                                <Link to="/performance_review/gbpusd" className="performance_review_asset"><p>GBPUSD</p></Link>
                                <Link to="/performance_review/usdzar" className="performance_review_asset"><p>USDZAR</p></Link>
                                <Link to="/performance_review/usdcad" className="performance_review_asset"><p>USDCAD</p></Link>
                                <Link to="/performance_review/usdjpy" className="performance_review_asset"><p>USDJPY</p></Link>
                            </div>
                            </div>
                </div>
                    </div>
            </div>
        </div>
    )

}