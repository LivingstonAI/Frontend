import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';
import { FaSun, FaMoon, FaMusic, FaSave } from 'react-icons/fa';
import { useAudio } from './audio_context';

export default function SideNavs() {
  const uniqueID = uuidv4();
  const [timeNY, setTimeNY] = useState('');
  const [timeLondon, setTimeLondon] = useState('');
  const [timeTokyo, setTimeTokyo] = useState('');
  const [theme, setTheme] = useState('light');
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const baseURL = 'https://backend-production-c0ab.up.railway.app';

  // Function to toggle the side nav visibility
  const toggleSideNav = () => {
    setIsOpen(!isOpen);
  };
  
  // Fetch songs from the backend
  useEffect(() => {
    const fetchSongs = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${baseURL}/fetch-music`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        setSongs(data.songs);
        setError(null);
      } catch (err) {
        console.error("Error fetching songs:", err);
        setError("Failed to load music. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchSongs();
  }, [baseURL]);

  const filteredSongs = songs.filter((song) =>
    song.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.body.className = newTheme; // This line ensures body gets the theme class
    localStorage.setItem('theme', newTheme);
  };

  const { isPlaying, currentSong, playMusic, stopMusic } = useAudio();

  const handlePlay = (song) => {
    console.log("Handle play clicked for song:", song); // Debugging line
    playMusic(song); // Call playMusic when song is clicked
  };

  return (
    <div className="all-side-navs">
      <div className="side-navs trading-history-links">
        <Link to="/personal_info" className="side-nav"><button className="btn btn-light side-nav-btn"><p><i className="bi bi-person-fill"></i></p></button></Link>
        <Link to="/account_analytics" className="side-nav"><button className="btn btn-light side-nav-btn"><p><i className="bi bi-bar-chart-line-fill"></i></p></button></Link>
        <Link to="/market_makers" className="side-nav"><button className="btn btn-light side-nav-btn"><p><i className="bi bi-bank"></i></p></button></Link>
        <Link to={`/conversation/${uniqueID}`} className="side-nav"><button className="btn btn-light side-nav-btn"><p><i className="bi bi-chat-square-dots"></i></p></button></Link>
        <Link to='/daily_brief' className="side-nav"><button className="btn btn-light side-nav-btn"><p><i className="bi bi-briefcase-fill"></i></p></button></Link>
        <Link to='/performance_review/asset' className="side-nav"><button className="btn btn-light side-nav-btn"><p><i className="bi bi-journal-bookmark-fill"></i></p></button></Link>
        <Link to="/update_news" className="side-nav"><button className="btn btn-light side-nav-btn"><p><i className="bi bi-newspaper"></i></p></button></Link>
        <Link to="/enter_new_trade_info" className="side-nav"><button className="btn btn-light side-nav-btn"><p><i className="bi bi-info-circle-fill"></i></p></button></Link>
        <Link to="/scratch" className="side-nav"><button className="btn btn-light side-nav-btn"><p><i className="bi bi-robot"></i></p></button></Link>
        <Link to="/model_performance" className="side-nav"><button className="btn btn-light side-nav-btn"><p><i className="bi bi-pen-fill"></i></p></button></Link>
        <Link to="/risk_bot" className="side-nav"><button className="btn btn-light side-nav-btn"><p><i className="bi bi-currency-exchange"></i></p></button></Link>
        <Link to="/chill" className="side-nav"><button className="btn btn-light side-nav-btn"><p><i className="bi bi-headphones"></i></p></button></Link>
        <Link to="/quizifier" className="side-nav"><button className="btn btn-light side-nav-btn"><p><i className="bi bi-rocket-takeoff-fill"></i></p></button></Link>
        <Link to="/saved_quizzes" className="side-nav"><button className="btn btn-light side-nav-btn"><p><i className="bi bi-stars"></i></p></button></Link>
        <Link to="/alert_bot" className="side-nav"><button className="btn btn-light side-nav-btn"><p><i className="bi bi-bell-fill"></i></p></button></Link>
        <Link to="/tradergpt_analysis" className="side-nav"><button className="btn btn-light side-nav-btn"><p><i className="bi bi-life-preserver"></i></p></button></Link>
        <Link to="/backtested_results" className="side-nav"><button className="btn btn-light side-nav-btn"><p><i className="bi bi-yin-yang"></i></p></button></Link>
        <Link to="/ideas_section" className="side-nav"><button className="btn btn-light side-nav-btn"><p><i className="bi bi-lightbulb-fill"></i></p></button></Link>
      </div>

      <div className="side-navs-cellphone">
        <Link to="/personal_info" className="side-nav">
            <i className="bi bi-person-fill"></i>
        </Link>
        <Link to="/account_analytics" className="side-nav">
            <i className="bi bi-bar-chart-line-fill"></i>
        </Link>
        <Link to="/market_makers" className="side-nav">
            <i className="bi bi-bank"></i>
        </Link>
        <Link to={`/conversation/${uniqueID}`} className="side-nav">
            <i className="bi bi-chat-square-dots"></i>
        </Link>
        <Link to="/daily_brief" className="side-nav">
            <i className="bi bi-briefcase-fill"></i>
        </Link>
        <Link to="/performance_review/asset" className="side-nav">
            <i className="bi bi-journal-bookmark-fill"></i>
        </Link>
        <Link to="/update_news" className="side-nav">
            <i className="bi bi-newspaper"></i>
        </Link>
        <Link to="/enter_new_trade_info" className="side-nav">
            <i className="bi bi-info-circle-fill"></i>
        </Link>
        <Link to="/scratch" className="side-nav">
            <i className="bi bi-robot"></i>
        </Link>
        <Link to="/model_performance" className="side-nav">
            <i className="bi bi-pen-fill"></i>
        </Link>
        <Link to="/risk_bot" className="side-nav">
            <i className="bi bi-currency-exchange"></i>
        </Link>
        <Link to="/chill" className="side-nav">
            <i className="bi bi-headphones"></i>
        </Link>
        <Link to="/quizifier" className="side-nav">
            <i className="bi bi-rocket-takeoff-fill"></i>
        </Link>
        <Link to="/saved_quizzes" className="side-nav">
            <i className="bi bi-stars"></i>
        </Link>
        <Link to="/alert_bot" className="side-nav">
            <i className="bi bi-bell-fill"></i>
        </Link>
        <Link to="/tradergpt_analysis" className="side-nav">
            <i className="bi bi-life-preserver"></i>
        </Link>
        <Link to="/backtested_results" className="side-nav">
            <i className="bi bi-yin-yang"></i>
        </Link>
        <Link to="/ideas_section" className="side-nav">
            <i className="bi bi-lightbulb-fill"></i>
        </Link>
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

      {/* Music Player and Theme Toggle */}
      <div className="music-color-mode">
        <div className="music-player">
          <button className="btn btn-outline-secondary" data-bs-toggle="modal" data-bs-target="#sideNavsMusicModal">
            <FaMusic />
          </button>
        </div>

        {/* Music Selection Modal */}
        <div className="modal fade side-navs-modal" id="sideNavsMusicModal" tabIndex="-1" aria-labelledby="sideNavsMusicModalLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="sideNavsMusicModalLabel">Select a Song</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                {/* Search Bar */}
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search for a song..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                {/* Loading state */}
                {loading && <p>Loading songs...</p>}
                
                {/* Error state */}
                {error && <div className="alert alert-danger">{error}</div>}

                {/* Song List */}
                {!loading && !error && (
                  <ul className="list-group">
                    {filteredSongs.length > 0 ? (
                      filteredSongs.map((song) => (
                        <li key={song.id} className="list-group-item">
                          <button className="btn" onClick={() => handlePlay(song.file)}>
                            {song.name}
                          </button>
                        </li>
                      ))
                    ) : (
                      <li className="list-group-item">No songs found matching "{searchTerm}"</li>
                    )}
                  </ul>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-danger" onClick={stopMusic}>Stop Music</button>
                <button type="button" className="btn btn-primary" data-bs-dismiss="modal">Close</button>
              </div>
            </div>
          </div>
        </div>

        {/* Theme Toggle Button */}
        <nav className="">
          <div className="container-fluid">
            <button className="btn btn-outline-secondary" onClick={toggleTheme}>
              {theme === 'light' ? <FaMoon /> : <FaSun />}
            </button>
          </div>
        </nav>
      </div>
    </div>
  );
}