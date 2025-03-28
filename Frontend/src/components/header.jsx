import React from "react";
import { Link } from "react-router-dom";
import {v4 as uuidv4} from 'uuid';

export default function Header() {
    const uniqueID = uuidv4();
    return (
        <div className="main-page-header">
            <div className="all-header-navs">
                <div className="header-navigations">
                    <Link to="/" className="overview-link">
                        <h5 className="snowai-logo">SnowAI</h5>
                    </Link>
                </div>
                <Link to="/" className="overview-link">
                    <h5 className="sign-out-cta">Sign Out</h5>
                </Link>
            </div>
            <style jsx>{`
                .main-page-header {
                    background: linear-gradient(135deg, #3a8bd1, #2c5aa0);
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
                    padding: 15px 20px;
                    color: white;
                }

                .all-header-navs {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .snowai-logo {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: white;
                    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
                    transition: transform 0.3s ease;
                }

                .snowai-logo:hover {
                    transform: scale(1.05);
                }

                .sign-out-cta {
                    background: rgba(255, 255, 255, 0.2);
                    padding: 8px 15px;
                    border-radius: 20px;
                    font-weight: 600;
                    transition: all 0.3s ease;
                }

                .sign-out-cta:hover {
                    background: rgba(255, 255, 255, 0.3);
                    transform: translateY(-2px);
                }

                .header-navigations a {
                    text-decoration: none;
                    color: white;
                }

                @media screen and (min-width: 992px) {
                    .main-page-header {
                        padding: 20px 30px;
                    }

                    .snowai-logo {
                        font-size: 1.8rem;
                    }
                }
            `}</style>
        </div>
    )
}