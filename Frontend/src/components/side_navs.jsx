import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';
import { FaSun, FaMoon, FaMusic, FaSave, FaChartLine, FaAngleDown, FaAngleUp } from 'react-icons/fa';
import { useAudio } from './audio_context';
import AssetTracker from "./asset_tracker";

export default function SideNavs() {
  const uniqueID = uuidv4();
  const [timeNY, setTimeNY] = useState('');
  const [timeLondon, setTimeLondon] = useState('');
  const [timeTokyo, setTimeTokyo] = useState('');
  const [theme, setTheme] = useState('light');
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [savingStatus, setSavingStatus] = useState("");
  const [showAssetTracker, setShowAssetTracker] = useState(false);
  const [songsFromBackend, setSongsFromBackend] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const baseURL = 'https://backend-production-c0ab.up.railway.app';

  // Import song files
  const songs = [
    { name: "MIT👨‍🎓📖🚀", file: "/songs/mit.mp3" },
    { name: "Atreides Theme ⚔️", file: "/songs/atreides_theme.mp3" },
    { name: "Jingle Bells", file: "/songs/jingle_bells.mp3" },
    { name: "Snow Storm", file: "/songs/snowstorm.mp3" },
    { name: "Love Story", file: "/songs/love_story.mp3" },
    { name: "Ezio's Family", file: "/songs/ezio_family.mp3" },
    { name: "Hymn For The Weekend", file: "/songs/hymn_for_the_weekend.mp3" },
    { name: "Daydreaming", file: "/songs/daydreaming.mp3" },
    { name: "Me Times Two", file: "/songs/me_times_two.mp3" },
    { name: "We Don't Talk Anymore", file: "/songs/we_dont_talk_anymore.mp3" },
    { name: "Should I Stay or Should I Go", file: "/songs/should_i_stay.mp3" },
    { name: "The Middle", file: "/songs/the_middle.mp3" },
    { name: "Quiet Night", file: "/songs/quiet_night.mp3" },
    { name: "Feels", file: "/songs/feels.mp3" },
    { name: "I'm Good (Blue)", file: "/songs/im_good.mp3" },
    { name: "Never Give Up", file: "/songs/never_give_up.mp3" },
    { name: "Gravity", file: "/songs/gravity.mp3" },
    { name: "Closer", file: "/songs/closer.mp3" },
    { name: "Bloody Mary (Edit)", file: "/songs/bloody_mary_edit.mp3" },
    { name: "Waiting 💙", file: "/songs/waiting.mp3" },
    { name: "Wish (Wonderland) ✨🎸", file: "/songs/wish_wonderland.mp3" },
    { name: "Welcome to Columbia!📖🚀", file: "/songs/welcome_to_columbia.mp3" },
    { name: "沉溺（你让我的心不再结冰) 🎶🌆", file: "/songs/沉溺.mp3" },
    { name: "Shoot to Thrill - ACDC 🤖🎸", file: "/songs/shoot_to_thrill.mp3" },
    { name: "When I'm With You - Arcando", file: "/songs/when_im_with_you.mp3" },
    { name: "Coffee Time ☕", file: "/songs/coffee_time.mp3" },
    { name: "Coffee Lounge ☕", file: "/songs/coffee_lounge.mp3" },
    { name: "Good Vibes 😌", file: "/songs/good_vibes.mp3" },
    { name: "Iced Coffee Jazz ☕🎶", file: "/songs/iced_coffee_jazz.mp3" },
    { name: "Sitting in a Café ☕👨‍💻", file: "/songs/sitting_in_a_cafe.mp3" },
    { name: "Lex MIT Car 🤖🚗", file: "/songs/lex_mit_car.mp3" },
    { name: "Keep it lowkey 🎺", file: "/songs/keep_it_lowkey.mp3" },
    { name: "Honey Jam 🍯", file: "/songs/honey_jam.mp3" },
    { name: "Floral 🌺💮", file: "/songs/floral.mp3" },
    { name: "Lemon Cake 🍋🍰", file: "/songs/lemon_cake.mp3" },
    { name: "Marshmellow 😋", file: "/songs/marshmellow.mp3" },
    { name: "Rose 🌹", file: "/songs/rose.mp3" },
    { name: "This is MIT 👨‍🎓📚", file: "/songs/this_is_mit.mp3" },
    { name: "Dune: Time between storms ⌛🗡️", file: "/songs/time_between_storms.mp3" },
    { name: "Somnus Theme 🐺🥷", file: "/songs/somnus_theme.mp3" },
    { name: "Joji - Your Man 🦸‍♂️🦸‍♀️", file: "/songs/your_man.mp3" },
    { name: "Cry Baby - SZA 🌃🌃", file: "/songs/cry_baby.mp3" },
    { name: "Genesis - Jorma Kaukonen 🧑🏾‍🤝‍👩🏼👨‍💻👩‍💻", file: "/songs/genesis.mp3" },
    { name: "Rewrite the Stars 🌃", file: "/songs/rewrite_the_stars.mp3" },
    { name: "Bloodline - Ariana Grande 🎤", file: "/songs/bloodline.mp3" },
    { name: "Stromae, Pomme - 'Ma Meilleure Ennemie'(from Arcane Season 2)🌃", file: "/songs/ma_meilleure_enemie.mp3" },
    { name: "Diverseddie 舵 - Procrastination 拖延症 😌👨‍💻", file: "/songs/procrastination.mp3" },
    { name: "Duncan's Theme 🗡️", file: "/songs/duncan_theme.mp3" },
    { name: "MIT Hall That Never Ends 👨‍🎓🎶", file: "/songs/mit_hall.mp3" },
    { name: "Empire State of Mind 🗽🌆", file: "/songs/empire_state_of_mind.mp3" },
    { name: "Here Comes The Sun 🌄", file: "/songs/here_comes_the_sun.mp3" },
    { name: "Afternoon of Konoha 🌳🌄", file: "/songs/afternoon_of_konoha.mp3" },
    { name: "Chosen ⌛", file: "/songs/chosen.mp3" },
    { name: "Spin U Around 🎼💙", file: "/songs/spin_u_round.mp3" },
    { name: "Feel it 🦸‍♂️🦸‍♀️", file: "/songs/feel_it.mp3" },
    { name: "Mona Lisa 🎨🖌️", file: "/songs/mona_lisa.mp3" }
  ];

  // Toggle functions
  const toggleSideNav = () => setIsOpen(!isOpen);
  const toggleAssetTracker = () => setShowAssetTracker(!showAssetTracker);
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.body.className = newTheme;
    localStorage.setItem('theme', newTheme);
  };

  // Fetch songs from backend
  useEffect(() => {
    const fetchSongsFromBackend = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${baseURL}/fetch-music`);
        if (response.ok) {
          const data = await response.json();
          setSongsFromBackend(data.songs || []);
        } else {
          console.error("Failed to fetch songs from backend");
        }
      } catch (error) {
        console.error("Error fetching songs:", error);
      } finally {
        setIsLoading(false);
      }
    };

    // fetchSongsFromBackend();
  }, []);

  // Clock update effect
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

    // Load theme from localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
      document.body.className = savedTheme;
    }

    return () => clearInterval(interval);
  }, []);

  // Access audio context
  const { isPlaying, currentSong, playMusic, stopMusic } = useAudio();

  // Function to save all songs to the backend
  const saveAllSongsToBackend = async () => {
    setSavingStatus("Saving songs to backend...");
    let successCount = 0;
    let errorCount = 0;

    for (const song of songs) {
      try {
        // Fetch the song file
        const response = await fetch(song.file);
        
        // Check if the fetch was successful
        if (!response.ok) {
          throw new Error(`Failed to fetch song file: ${song.file}`);
        }
        
        const blob = await response.blob();
        
        // Create a file object from the blob
        const fileName = song.file.split('/').pop();
        const songFile = new File([blob], fileName, { type: 'audio/mpeg' });
        
        // Create form data
        const formData = new FormData();
        formData.append('name', song.name);
        formData.append('file', songFile);
        
        // Send to backend
        const saveResponse = await fetch(`${baseURL}/save-music`, {
          method: 'POST',
          body: formData,
        });
        
        if (saveResponse.ok) {
          successCount++;
          setSavingStatus(`Saved ${successCount} of ${songs.length} songs...`);
        } else {
          errorCount++;
          console.error(`Failed to save song: ${song.name}`);
        }
      } catch (error) {
        errorCount++;
        console.error(`Error saving song ${song.name}:`, error);
      }
    }
    
    setSavingStatus(`Completed! Saved ${successCount} songs, Failed: ${errorCount}`);
    
    // Refresh the songs list from backend
    try {
      const response = await fetch(`${baseURL}/fetch-music`);
      if (response.ok) {
        const data = await response.json();
        setSongsFromBackend(data.songs || []);
      }
    } catch (error) {
      console.error("Error refreshing songs list:", error);
    }
    
    // Reset status message after 5 seconds
    setTimeout(() => setSavingStatus(""), 5000);
  };

  // Handle play for any song (backend or local)
const handlePlay = (songUrl) => {
  console.log("Playing song from URL:", songUrl);
  playMusic(songUrl);
};

  // Filter songs based on search term
  const filteredSongs = songsFromBackend.length > 0 
    ? songsFromBackend.filter(song => 
        song.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : songs.filter(song => 
        song.name.toLowerCase().includes(searchTerm.toLowerCase()));

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
        <Link to="/call_ai" className="side-nav"><button className="btn btn-light side-nav-btn"><p><i className="bi bi-telephone-fill"></i></p></button></Link>
        <Link to="/trade_ideas" className="side-nav"><button className="btn btn-light side-nav-btn"><p><i className="bi bi-snow2"></i></p></button></Link>
        <Link to="/prop_firm_management" className="side-nav"><button className="btn btn-light side-nav-btn"><p><i className="bi bi-currency-dollar"></i></p></button></Link>
        <Link to="/art" className="side-nav"><button className="btn btn-light side-nav-btn"><p><i className="bi bi-brush-fill"></i></p></button></Link>
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
        <Link to="/call_ai" className="side-nav">
            <i className="bi bi-telephone-fill"></i>
        </Link>
        <Link to="/trade_ideas" className="side-nav">
            <i className="bi bi-snow2"></i>
        </Link>
        <Link to="/prop_firm_management" className="side-nav">
            <i className="bi bi-currency-dollar"></i>
        </Link>
        <Link to="/art" className="side-nav">
            <i className="bi bi-brush-fill"></i>
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

      {/* Asset Tracker Toggle Button */}
      <div className="card shadow-sm mb-3">
        <div 
          className="card-header bg-light d-flex justify-content-between align-items-center" 
          style={{ cursor: 'pointer' }}
          onClick={toggleAssetTracker}
        >
          <h5 className="mb-0 text-primary d-flex align-items-center">
            <FaChartLine className="me-2" /> Asset Tracker
          </h5>
          <button className="btn btn-sm btn-outline-primary">
            {showAssetTracker ? <FaAngleUp /> : <FaAngleDown />}
          </button>
        </div>
      </div>
      

      {/* Conditional rendering of AssetTracker */}
      {showAssetTracker && <AssetTracker />}

      {/* Music Player, Admin buttons and Modal */}
      <div className="music-color-mode">
        <div className="music-player">
          <button className="btn btn-outline-secondary" data-bs-toggle="modal" data-bs-target="#sideNavsMusicModal">
            <FaMusic />
          </button>
          {/* Admin button to save all songs */}
          <button className="btn btn-outline-primary ms-2" onClick={saveAllSongsToBackend}>
            <FaSave /> Save All
          </button>
          {savingStatus && <div className="alert alert-info mt-2">{savingStatus}</div>}
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

                {/* Song List */}
                {isLoading ? (
                  <div className="d-flex justify-content-center">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : (
                  <ul className="list-group">
                    {filteredSongs.map((song, index) => (
                      <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                        <span>{song.name}</span>
                        {/* <button 
                          className="btn btn-sm btn-outline-primary" 
                          onClick={() => handlePlay(songsFromBackend.length > 0 ? song.file : song.file)}
                        >
                          Play
                        </button> */}
                        <button 
                        className="btn btn-sm btn-outline-primary" 
                        onClick={() => handlePlay(song.file)}
                      >
                        Play
                      </button>
                      </li>
                    ))}
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