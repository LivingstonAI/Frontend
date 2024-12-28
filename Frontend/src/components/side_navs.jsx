import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';
import { FaSun, FaMoon, FaMusic } from 'react-icons/fa';

// Import your songs
import jingleBells from '../jingle_bells.mp3';
import snowStorm from '../Snowstorm Sound Effect - Winter Storm - Blizzard.mp3';
import love_story from '../Indila - Love Story (Piano Cover).mp3';
import ezio_family from "../Assassin's Creed 2 OST  Jesper Kyd - Ezio's Family (Track 03).mp3";
import hymn_for_the_weekend from '../Coldplay - Hymn For The Weekend (Lyrics).mp3';
import daydreaming from '../Marc Wavy - Daydreaming (Official Lyric Video).mp3';
import me_times_two from '../Raptures - Me Times Two (ft. Moav)  Electronic Pop  NCS - Copyright Free Music.mp3';
import we_dont_talk_anymore from "../We Don't Talk Anymore我們不再交談Charlie Puth ft.Selena Gomez 中文字幕.mp3";

export default function SideNavs() {
  const uniqueID = uuidv4();
  const [timeNY, setTimeNY] = useState('');
  const [timeLondon, setTimeLondon] = useState('');
  const [timeTokyo, setTimeTokyo] = useState('');
  const [theme, setTheme] = useState('light');
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [audio, setAudio] = useState(null);
  const [currentSong, setCurrentSong] = useState(null);

  const songs = [
    { name: "Jingle Bells", file: jingleBells },
    { name: "Snow Storm", file: snowStorm },
    { name: "Love Story", file: love_story },
    { name: "Ezio's Family", file: ezio_family },
    { name: "Hymn For The Weekend", file: hymn_for_the_weekend },
    { name: "Daydreaming", file: daydreaming },
    { name: "Me Times Two", file: me_times_two },
    { name: "We Don't Talk Anymore", file: we_dont_talk_anymore },
  ];

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

  // Handle music play/pause
  const playMusic = (song) => {
    if (audio) {
      audio.pause(); // Pause previous song if any
    }
    const newAudio = new Audio(song);
    setAudio(newAudio);
    newAudio.play();
    setIsMusicPlaying(true);
    setCurrentSong(song);
  };

  const stopMusic = () => {
    if (audio) {
      audio.pause();
      setIsMusicPlaying(false);
      setCurrentSong(null);
    }
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
        <Link to="/chill" className="side-nav"><button className="btn btn-light side-nav-btn"><p><i className="bi bi-activity"></i></p></button></Link>
        <Link to="/alert_bot" className="side-nav"><button className="btn btn-light side-nav-btn"><p><i className="bi bi-bell-fill"></i></p></button></Link>
      </div> 

      <div className="side-navs-cellphone">
                {/* Your existing mobile links */}
                <Link to="/personal_info" className="side-nav"><i className="bi bi-person-fill"></i></Link>
                <Link to="/account_analytics" className="side-nav"><i className="bi bi-bar-chart-line-fill"></i></Link>
                <Link to="/market_makers" className="side-nav"><i className="bi bi-bank" /></Link>
                <Link to={`/conversation/${uniqueID}`} className="side-nav"><i className="bi bi-chat-square-dots"></i></Link>
                <Link to='/daily_brief' className="side-nav"><i className="bi bi-briefcase-fill"></i></Link>
                <Link to='/performance_review/asset' className="side-nav"><i className="bi bi-journal-bookmark-fill"></i></Link>
                <Link to="/update_news" className="side-nav"><i className="bi bi-newspaper"></i></Link>
                <Link to="/enter_new_trade_info" className="side-nav"><i className="bi bi-info-circle-fill"></i></Link>
                <Link to="/scratch" className="side-nav"><i className="bi bi-robot"></i></Link>
                <Link to="/model_performance" className="side-nav"><i className="bi bi-pen-fill"></i></Link>
                <Link to="/risk_bot" className="side-nav"><i className="bi bi-currency-exchange"></i></Link>
                <Link to="/chill" className="side-nav"><i className="bi bi-activity"></i></Link>
                <Link to="/alert_bot" className="side-nav"><i className="bi bi-bell-fill"></i></Link>
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
      <div className="music-color-mode">
      {/* Music Player and Modal */}
      <div className="music-player container-fluid">
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
              <ul className="list-group">
                {songs.map((song, index) => (
                  <li key={index} className="list-group-item">
                    <button className="btn btn-link" onClick={() => playMusic(song.file)}>
                      {song.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="modal-footer">
              <button type="button" onClick={stopMusic}>Stop Music</button>
              <button type="button" className="btn btn-primary" data-bs-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>

      

      {/* Theme Toggle Button */}
      <nav className="navbar navbar-expand-lg">
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
