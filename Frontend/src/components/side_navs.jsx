import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';
import { FaSun, FaMoon, FaMusic } from 'react-icons/fa';
import { useAudio } from './audio_context';



// Import your songs
import jingleBells from '../jingle_bells.mp3';
import snowStorm from '../Snowstorm Sound Effect - Winter Storm - Blizzard.mp3';
import love_story from '../Indila - Love Story (Piano Cover).mp3';
import ezio_family from "../Assassin's Creed 2 OST  Jesper Kyd - Ezio's Family (Track 03).mp3";
import hymn_for_the_weekend from '../Coldplay - Hymn For The Weekend (Lyrics).mp3';
import daydreaming from '../Marc Wavy - Daydreaming (Official Lyric Video).mp3';
import me_times_two from '../Raptures - Me Times Two (ft. Moav)  Electronic Pop  NCS - Copyright Free Music.mp3';
import we_dont_talk_anymore from "../We Don't Talk Anymore我們不再交談Charlie Puth ft.Selena Gomez 中文字幕.mp3";
import should_i_stay from '../The Clash - Should I Stay or Should I Go (Official Audio).mp3';
import the_middle from '../Zedd, Maren Morris, Grey - The Middle (Lyric Video).mp3';
import quiet_night from '../Tokyo Music Walker - Quiet Night.mp3';
import feels from '../Calvin Harris - Feels (Official Video) ft. Pharrell Williams, Katy Perry, Big Sean.mp3';
import im_good from "../David Guetta x Bebe Rexha - I'm Good (Blue) (Senses & Shadow Remix).mp3";
import never_give_up from '../Never Give Up.mp3';
import gravity from '../Sara Bareilles - Gravity (Official HD Video).mp3';
import closer from '../The Chainsmokers - Closer (Lyric) ft. Halsey.mp3';
import bloody_mary_edit from '../bloody mary (instrumental x dum dum, da-di-da) [full version] - lady gaga [edit audio].mp3';
import waiting from '../Waiting.mp3';
import wish_wonderland from '../Wonderland 원더랜드 OST WISH_ Wonderland is here 박보검 Park Bo-gum 배수지 Bae Suzy HanRomEnglish Lyrics.mp3';
import welcome_to_columbia from '../Congratulations! Welcome to Columbia!.mp3';
import 沉溺 from '../沉溺（你让我的心不再结冰）.mp3';
import shoot_to_thrill from '../ACDC - Shoot to Thrill.mp3';
import when_im_with_you from "../When I'm with you.mp3";
import coffee_time from '../321Jazz - Coffee Time [ Cafe Jazz Music 2024 ].mp3'
import coffee_lounge from '../Coffee Lounge.mp3';
import good_vibes from '../Good Vibes.mp3';
import iced_coffee_jazz from '../iced coffee  jazz lofi vibes (no copyright music  vlog music  royalty free music).mp3';
import sitting_in_a_cafe from '../Sitting in a Café.mp3';
import lex_mit_car from '../LexMITCar.mp3';
import keep_it_lowkey from '../spotifydown.com - keep it lowkey - take your time.mp3';
import honey_jam from '../massobeats - honey jam (royalty free lofi music).mp3';
import floral from '../massobeats - floral (royalty free lofi music).mp3';
import lemon_cake from '../샛별 - Lemon Cake (Royalty Free Music).mp3';
import marshmellow from '../lukrembo - marshmallow (royalty free vlog music).mp3';
import rose from '../lukrembo - rose (royalty free vlog music).mp3';
import this_is_mit from '../This is MIT.mp3';
import time_between_storms from '../Dune_ Part Two Soundtrack  A Time of Quiet Between the Storms - Hans Zimmer  WaterTower.mp3';


let globalAudio = null; 

export default function SideNavs() {
  const uniqueID = uuidv4();
  const [timeNY, setTimeNY] = useState('');
  const [timeLondon, setTimeLondon] = useState('');
  const [timeTokyo, setTimeTokyo] = useState('');
  const [theme, setTheme] = useState('light');
  // const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  // const [audio, setAudio] = useState(null);
  // const [currentSong, setCurrentSong] = useState(null);
  // const [audioTime, setAudioTime] = useState(0); // To store the current time of the audio


  // State for search term and filtered songs
  const [searchTerm, setSearchTerm] = useState("");

  const [isOpen, setIsOpen] = useState(false);

  // Function to toggle the side nav visibility
  const toggleSideNav = () => {
    setIsOpen(!isOpen);
  };

  const songs = [
    { name: "Jingle Bells", file: jingleBells },
    { name: "Snow Storm", file: snowStorm },
    { name: "Love Story", file: love_story },
    { name: "Ezio's Family", file: ezio_family },
    { name: "Hymn For The Weekend", file: hymn_for_the_weekend },
    { name: "Daydreaming", file: daydreaming },
    { name: "Me Times Two", file: me_times_two },
    { name: "We Don't Talk Anymore", file: we_dont_talk_anymore },
    { name: "Should I Stay or Should I Go", file: should_i_stay },
    { name: "The Middle", file: the_middle },
    { name: "Quiet Night", file: quiet_night },
    { name: "Feels", file: feels },
    { name: "I'm Good (Blue)", file: im_good },
    { name: "Never Give Up", file: never_give_up },
    { name: "Gravity", file: gravity },
    { name: "Closer", file: closer },
    { name: "Bloody Mary (Edit)", file: bloody_mary_edit },
    { name: "Waiting 💙", file: waiting },
    { name: "Wish (Wonderland) ✨🎸", file: wish_wonderland },
    { name: "Welcome to Columbia!📖🚀", file: welcome_to_columbia },
    { name: "沉溺（你让我的心不再结冰) 🎶🌆", file: 沉溺 },
    { name: "Shoot to Thrill - ACDC 🤖🎸", file: shoot_to_thrill },
    { name: "When I'm With You - Arcando", file: when_im_with_you },
    { name: "Coffee Time ☕", file: coffee_time },
    { name: "Coffee Lounge ☕", file: coffee_lounge },
    { name: "Good Vibes 😌", file: good_vibes },
    { name: "Iced Coffee Jazz ☕🎶", file: iced_coffee_jazz },
    { name: "Sitting in a Café ☕👨‍💻", file: sitting_in_a_cafe },
    { name: "Lex MIT Car 🤖🚗", file: lex_mit_car },
    { name: "Keep it lowkey 🎺", file: keep_it_lowkey },
    { name: "Honey Jam 🍯", file: honey_jam },
    { name: "Floral 🌺💮", file: floral },
    { name: "Lemon Cake 🍋🍰", file: lemon_cake },
    { name: "Marshmellow 😋", file: marshmellow},
    { name: "Rose 🌹", file: rose},
    { name: "This is MIT 👨‍🎓📚", file: this_is_mit },
    { name: "Dune: Time between storms ⌛🗡️", file: time_between_storms }
  ];

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
        <Link to="/chill" className="side-nav"><button className="btn btn-light side-nav-btn"><p><i className="bi bi-activity"></i></p></button></Link>
        <Link to="/alert_bot" className="side-nav"><button className="btn btn-light side-nav-btn"><p><i className="bi bi-bell-fill"></i></p></button></Link>
        <Link to="/tradergpt_analysis" className="side-nav"><button className="btn btn-light side-nav-btn"><p><i className="bi bi-alexa"></i></p></button></Link>
      </div>

      <div className="side-navs-cellphone">
    {/* Your existing mobile links */}
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
        <i className="bi bi-activity"></i>
    </Link>
    <Link to="/alert_bot" className="side-nav">
        <i className="bi bi-bell-fill"></i>
    </Link>
    <Link to="/tradergpt_analysis" className="side-nav">
        <i className="bi bi-alexa"></i>
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


      {/* Music Player and Modal */}
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

        {/* Song List */}
        <ul className="list-group">
          {filteredSongs.map((song, index) => (
            <li key={index} className="list-group-item">
              <button className="btn" onClick={() => handlePlay(song.file)}>
                {song.name}
              </button>
            </li>
          ))}
        </ul>
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
