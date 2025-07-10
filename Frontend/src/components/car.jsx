import React, { useEffect, useState } from "react";
import Header from "./header";
import SideNavs from "./side_navs";
import Cookies from 'js-cookie';

export default function ScientificPlayground() {
    const baseUrl = 'https://backend-production-c0ab.up.railway.app';

    
// A 3D/2D sandbox builder, where users can assemble engines, turbines, wings, wheels, etc.

// Uses physics-based modeling to simulate designs.

// Could even implement basic aerodynamics, efficiency scores, and failure tests.

    
    return (
        <div>
            <div className="header">
                <Header />
            </div>
            <div className="main-page-body">
                <SideNavs />
                <div className="main-body-info">
                    <h5 className="major-upcoming-news-events-header">Science Playground</h5>
                   
                    <br />
                    
                </div>
            </div>
        </div>
    );
}

