import React from "react";
import { Link } from "react-router-dom";
import {v4 as uuidv4} from 'uuid';

export default function Header() {
    const uniqueID = uuidv4();
    return (
        <div className="main-page-header">
            <div className="header-glow"></div>
            <div className="all-header-navs">
            <div className="header-navigations">
                <Link to="/" className="overview-link"><h5 className="snowai-title">SnowAI</h5></Link>
            </div>
            </div>
            <style jsx>{`
                .main-page-header {
                    background: linear-gradient(145deg, #1e3c72, #2a5298);
                    color: white;
                    position: relative;
                    overflow: hidden;
                }

                .header-glow {
                    position: absolute;
                    top: -50%;
                    left: -50%;
                    width: 200%;
                    height: 200%;
                    background: radial-gradient(
                        circle at center, 
                        rgba(76, 201, 240, 0.3) 0%, 
                        rgba(67, 97, 238, 0.1) 70%
                    );
                    animation: pulse-glow 3s ease-in-out infinite alternate;
                    pointer-events: none;
                    z-index: 1;
                }

                @keyframes pulse-glow {
                    0% {
                        transform: scale(1) rotate(0deg);
                        opacity: 0.4;
                    }
                    50% {
                        transform: scale(1.1) rotate(5deg);
                        opacity: 0.6;
                    }
                    100% {
                        transform: scale(1) rotate(-5deg);
                        opacity: 0.4;
                    }
                }

                .all-header-navs {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: var(--general-padding);
                    position: relative;
                    z-index: 2;
                }

                .snowai-title {
                    background: linear-gradient(90deg, #4cc9f0, #4361ee);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    animation: snowai-glow 2s ease-in-out infinite alternate;
                    font-weight: bold;
                }

                @keyframes snowai-glow {
                    0% {
                        text-shadow: 0 0 5px rgba(76, 201, 240, 0.5), 
                                     0 0 10px rgba(67, 97, 238, 0.3);
                    }
                    100% {
                        text-shadow: 0 0 15px rgba(76, 201, 240, 0.8), 
                                     0 0 25px rgba(67, 97, 238, 0.6);
                    }
                }

                .header-navigations a {
                    text-decoration: none;
                }

                @media screen and (min-width: 992px) {
                    .all-header-navs {
                        font-size: 18px;
                        padding: var(--general-padding-lg);
                    }

                    
                }
            `}</style>
        </div>
    )
}