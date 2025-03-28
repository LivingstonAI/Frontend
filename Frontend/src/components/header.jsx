import React from "react";
import { Link } from "react-router-dom";
import {v4 as uuidv4} from 'uuid';

export default function Header() {
    const uniqueID = uuidv4();
    return (
        <div className="main-page-header"><br />
            <div className="all-header-navs">
            <div className="header-navigations">
                <Link to="/" className="overview-link"><h5 className="snowai-title">SnowAI</h5></Link>
            </div>
            <Link to="/" className="overview-link"><h5 className="sign-out-cta">Sign Out</h5></Link>
            </div>
            <style jsx>{`
                .main-page-header {
                    background: linear-gradient(145deg, #1e3c72, #2a5298);
                    color: white;
                }

                .all-header-navs {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: var(--general-padding);
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

                .sign-out-cta {
                    color: white;
                    opacity: 0.8;
                    transition: opacity 0.3s ease;
                }

                .sign-out-cta:hover {
                    opacity: 1;
                }

                @media screen and (min-width: 992px) {
                    .all-header-navs {
                        font-size: 18px;
                        padding: var(--general-padding-lg);
                    }

                    .logo {
                        font-size: 25px;
                    }
                }
            `}</style>
        </div>
    )
}