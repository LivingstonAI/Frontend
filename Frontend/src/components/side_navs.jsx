import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';
import { FaSun, FaMoon } from 'react-icons/fa';



export default function SideNavs() {
    const uniqueID = uuidv4();
    const [timeNY, setTimeNY] = useState('');
    const [timeLondon, setTimeLondon] = useState('');
    const [timeTokyo, setTimeTokyo] = useState('');

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            const options = { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: false };
            
            // New York time
            const formatterNY = new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', ...options });
            setTimeNY(formatterNY.format(now));

            // London time
            const formatterLondon = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/London', ...options });
            setTimeLondon(formatterLondon.format(now));

            // Tokyo time
            const formatterTokyo = new Intl.DateTimeFormat('en-JP', { timeZone: 'Asia/Tokyo', ...options });
            setTimeTokyo(formatterTokyo.format(now));
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    // Theme state: 'light' or 'dark'
  const [theme, setTheme] = useState('light');

  // Load theme preference from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.body.className = savedTheme; // Apply theme to body
  }, []);

  // Toggle theme handler
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.body.className = newTheme;
    localStorage.setItem('theme', newTheme);
  };
    return(
        <div className="all-side-navs">
        <div className="side-navs trading-history-links">
                <Link to="/personal_info" className="side-nav"><button className="btn btn-light side-nav-btn"><p><i className="bi bi-person"></i>P Info</p></button></Link>
              <Link to="/trading_history_analytics" className="side-nav"><button className="btn btn-light side-nav-btn"><p><i className="bi bi-bar-chart-line-fill"></i> Analytics</p></button></Link>
                <Link to="/market_makers" className="side-nav"><button className="btn btn-light side-nav-btn"><p><i className="bi bi-bank"></i> Macros</p></button></Link>
                <Link to={`/conversation/${uniqueID}`} className="side-nav"><button className="btn btn-light side-nav-btn"><p><i class="bi bi-chat-square-dots"></i> ChatBot</p></button></Link>
                {/* <Link to="#" className="side-nav"><p><i className="bi bi-book"></i>Books</p></Link> */}
                <Link to='/daily_brief' className="side-nav"><button className="btn btn-light side-nav-btn"><p><i className="bi bi-briefcase-fill"></i> Daily Brief</p></button></Link>
                <Link to='/performance_review/asset' className="side-nav"><button className="btn btn-light side-nav-btn"><p><i className="bi bi-journal-bookmark-fill"></i> PR</p></button></Link>
                <Link to="/update_news" className="side-nav"><button className="btn btn-light side-nav-btn"><p><i className="bi bi-newspaper"></i> U News</p></button></Link>
                <Link to="/all_trades" className="side-nav"><button className="btn btn-light side-nav-btn"><p><i className="bi bi-info-circle-fill"></i> Trade U</p></button></Link>
                <Link to="/scratch" className="side-nav"><button className="btn btn-light side-nav-btn"><p><i className="bi bi-robot"></i> ML</p></button></Link>
                <Link to="/model_performance" className="side-nav"><button className="btn btn-light side-nav-btn"><p><i className="bi bi-pen-fill"></i> MP</p></button></Link>
                <Link to="/risk_bot" className="side-nav"><button className="btn btn-light side-nav-btn"><p><i className="bi bi-currency-exchange"></i> RB</p></button></Link>

                {/* <Link to="/payment" className="side-nav"><i class="bi bi-credit-card-fill"></i>Market Dictionary</Link> */}
        </div>
        <div className="side-navs-cellphone">
                {/* <Link to="/overview" className="side-nav"><i className="bi bi-plus-lg"></i></Link> */}
                <Link to="/personal_info" className="side-nav"><i className="bi bi-person"></i></Link>
                <Link to="/trading_history_analytics" className="side-nav"><i className="bi bi-bar-chart-line"></i></Link>
                <Link to="/market_makers" className="side-nav"><i className="bi bi-bank" /></Link>
                {/* <Link to="/all_journals" className="side-nav"><i className="bi bi-journal-bookmark-fill"></i></Link> */}
                <Link to={`/conversation/${uniqueID}`} className="side-nav"><i className="bi bi-chat-square-dots"></i></Link>
                {/* <Link to="#" className="side-nav"><i className="bi bi-book"></i></Link> */}
                <Link to='/daily_brief' className="side-nav"><i className="bi bi-briefcase"></i></Link>
                <Link to='/performance_review/asset' className="side-nav"><i className="bi bi-journal-bookmark"></i></Link>
                <Link to="/update_news" className="side-nav"><i class="bi bi-newspaper"></i></Link>
                <Link to="/all_trades" className="side-nav"><i className="bi bi-info-circle"></i></Link>
                <Link to="/scratch" className="side-nav"><i className="bi bi-robot"></i></Link>
                <Link to="/model_performance" className="side-nav"><i className="bi bi-pen"></i></Link>
                <Link to="/risk_bot" className="side-nav"><i className="bi bi-currency-exchange"></i></Link>
        </div>
        <br />
        <div className="timezones">
                <div className="clock">
                    <h5>New York</h5>
                    <p>{timeNY}</p>
                </div>
                <div className="clock">
                    <h5>London</h5>
                    <p>{timeLondon}</p>
                </div>
                <div className="clock">
                    <h5>Tokyo</h5>
                    <p>{timeTokyo}</p>
                </div>
            </div>
            {/* Theme Toggle Button */}
      <nav className="navbar navbar-expand-lg">
          <div className="container-fluid">
            {/* <a className="navbar-brand" href="/">YourApp</a> */}
            <button className="btn btn-outline-secondary" onClick={toggleTheme}>
              {theme === 'light' ? <FaMoon /> : <FaSun />}
            </button>
          </div>
        </nav>
            
        </div>
    )
}