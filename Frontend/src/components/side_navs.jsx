import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';
import { FaSun, FaMoon, FaMusic, FaSave, FaChartLine, FaAngleDown, FaAngleUp } from 'react-icons/fa';
import { useAudio } from './audio_context';
import AssetTracker from "./asset_tracker";



// Import all the songs
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
import coffee_time from '../321Jazz - Coffee Time [ Cafe Jazz Music 2024 ].mp3';
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
import somnus_theme from '../Final fantasy XIII versus somnus theme [bOyYigKniW4].mp3';
import your_man from '../Your Man.mp3';
import cry_baby from '../SZA - Cry Baby (Lyrics).mp3';
import genesis from '../Transcendence - GENESIS.mp3';
import rewrite_the_stars from '../rewrite the stars (speed up  lyrics).mp3';
import bloodline from '../Ariana Grande - bloodline (Official Audio).mp3';
import ma_meilleure_enemie from '../Stromae, Pomme - “Ma Meilleure Ennemie” (from Arcane Season 2) [Official Visualizer].mp3';
import procrastination from '../Diverseddie 舵 - Procrastination 拖延症.mp3';
import atreides_theme from '../Atreides Theme.mp3';
import duncan_theme from '../3m24 Duncan Arrives (Unreleased)  Dune (2021).mp3';
import mit_hall from '../“Hall That Never Ends,” featuring the @mitlogs Written, directed, and edited by Reuben Fuchs.Check out their new album “Log Log Land,” streaming now!.mp3';
import mit from '../mit.mp3';
import empire_state_of_mind from '../JAY-Z - Empire State Of Mind (Lyrics) ft. Alicia Keys.mp3';
import here_comes_the_sun from '../The Beatles - Here Comes The Sun (2019 Mix).mp3';
import afternoon_of_konoha from '../Naruto - Afternoon of Konoha.mp3';
import chosen from '../ilyaugust - Chosen Dreaming, Dreaming of This Moment (Official Lyric Video).mp3';
import spin_u_round from '../spin u round.mp3';
import feel_it from '../d4vd - Feel It.mp3';
import mona_lisa from '../Dominic Fike - Mona Lisa (Official Audio) (1).mp3';
import forever_star from '../Forever Star偷偷藏不住電視劇插曲 -  張洢豪Wherever you goIll surround you still動態歌詞.mp3';
import copines from '../Aya Nakamura - Copines (Clip officiel).mp3';
import dizzy from '../Dizzy  Joakim Karud (No Copyright Music).mp3';
import classic from '../MKTO - Classic (Lyrics).mp3';
import classic_slowed from '../𝙘𝙡𝙖𝙨𝙨𝙞𝙘 - 𝙈𝙆𝙏𝙊 (𝙨𝙡𝙤𝙬𝙚𝙙  𝙡𝙮𝙧𝙞𝙘𝙨).mp3';
import sound_of_april from '../Sound of April.mp3';
import what_are_you_waiting_for from '../d4vd - What Are You Waiting For (Lyrics).mp3';
import a_million_colors from '../A Million Colors.mp3';
import annas_smile from "../Anna's Smile.mp3";
import strangers from '../Kenya Grace - Strangers (Official Lyric Video).mp3';
import memory from '../hojean - memory [lyrics] (1).mp3';
import any_song from '../Any song (아무노래).mp3';
import nokia_remix from '../Katy Perry Last Friday Night - Drake (Remix) [NOKIA X T.G.I.F.].mp3';
import levitating from '../Dua Lipa - Levitating Featuring DaBaby (Official Music Video).mp3';
import twentytwo_remix from '../Lil Candy Paint - 22 (Lyrics) ft. Bhad Bhabie.mp3';


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

  // Import song files - Fixed the undefined imports
  const songs = [
        { name: "MIT👨‍🎓📖🚀", file: mit },
        { name: "Atreides Theme ⚔️", file: atreides_theme },
        { name: "Jingle Bells", file: jingleBells },
        { name: "Snow Storm", file: snowStorm },
        { name: "Love Story", file: love_story },
        { name: "Ezio's Family", file: ezio_family },
        { name: "Hymn for The Weekend", file: hymn_for_the_weekend },
        { name: "Daydreaming", file: daydreaming },
        { name: "Me Times Two", file: me_times_two},
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
        { name: "Dune: Time between storms ⌛🗡️", file: time_between_storms },
        { name: "Somnus Theme 🐺🥷", file: somnus_theme },
        { name: "Joji - Your Man 🦸‍♂️🦸‍♀️", file: your_man },
        { name: "Cry Baby - SZA 🌃🌃", file: cry_baby },
        { name: "Genesis - Jorma Kaukonen 🧑🏾‍🤝‍👩🏼👨‍💻👩‍💻", file: genesis },
        { name: "Rewrite the Stars 🌃", file: rewrite_the_stars },
        { name: "Bloodline - Ariana Grande 🎤", file: bloodline },
        { name: "Stromae, Pomme - “Ma Meilleure Ennemie” (from Arcane Season 2)🌃", file: ma_meilleure_enemie },
        { name: "Diverseddie 舵 - Procrastination 拖延症 😌👨‍💻", file: procrastination },
        { name: "Duncan's Theme 🗡️", file: duncan_theme },
        { name: "MIT Hall That Never Ends 👨‍🎓🎶", file: mit_hall },
        { name: "Empire State of Mind 🗽🌆", file: empire_state_of_mind },
        { name: "Here Comes The Sun 🌄", file: here_comes_the_sun },
        { name: "Afternoon of Konoha 🌳", file: afternoon_of_konoha },
        { name: "Chosen ⌛", file: chosen },
        { name: "Spin U Around 🎼💙", file: spin_u_round },
        { name: "Feel it 🦸‍♂️🦸‍♀️", file: feel_it },
        { name: "Mona Lisa 🎨🖌️", file: mona_lisa },
        { name: "Forever Star 🌃", file: forever_star },
        { name: "Copines 🌳", file: copines },
        { name: "Dizzy Joakim Karud 🎒👨‍🎓", file: dizzy },
        { name: "Classic 😎🏖️", file: classic },
        { name: "Classic (slowed) 🏄‍♂️", file: classic_slowed },
        { name: "Sound of April 🌃🎧", file: sound_of_april },
        { name: "What are you waiting for? 🏄‍♂️", file: what_are_you_waiting_for },
        { name: "A Million Colors 🎺", file: a_million_colors },
        { name: "Anna's Smile 🌹", file: annas_smile },
        { name: "Strangers 🪶", file: strangers },
        { name: "Memory 🪶", file: memory },
        { name: "아무노래 ~ ZICO 🇰🇷", file: any_song },
        { name: "NOKIA X T.G.I.F. 🌃", file: nokia_remix },
        { name: "Levitating 🦸‍♂️", file: levitating },
        { name: "22 (Remix) 🤵", file: twentytwo_remix },
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

  // Access audio context - This is working correctly!
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

  // Handle play for any song (backend or local) - Fixed to use the correct file property
  const handlePlay = (song) => {
    console.log("Playing song:", song.name);
    // For backend songs, use song.file (which should be the URL)
    // For local songs, use song.file (which is the imported file)
    const songUrl = songsFromBackend.length > 0 ? song.file : song.file;
    console.log("Song URL:", songUrl);
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
        <Link to="/prop_firm_management" className="side-nav"><button className="btn btn-light side-nav-btn"><p><i className="bi bi-database-fill"></i></p></button></Link>
        <Link to="/music" className="side-nav"><button className="btn btn-light side-nav-btn"><p><i className="bi bi-music-note-beamed"></i></p></button></Link>
        <Link to="/calendar" className="side-nav"><button className="btn btn-light side-nav-btn"><p><i className="bi bi-calendar-fill"></i></p></button></Link>
        <Link to="/calendar_data" className="side-nav"><button className="btn btn-light side-nav-btn"><p><i className="bi bi-clipboard-data-fill"></i></p></button></Link>
        <Link to="/econ_explainer" className="side-nav"><button className="btn btn-light side-nav-btn"><p><i className="bi bi-cash-stack"></i></p></button></Link>
        {/* <Link to="/equations" className="side-nav"><button className="btn btn-light side-nav-btn"><p><i className="bi bi-infinity"></i></p></button></Link> */}
        <Link to="/forex_factory" className="side-nav"><button className="btn btn-light side-nav-btn"><p><i className="bi bi-camera-fill"></i></p></button></Link>
        <Link to="/trading_econ_dashboard" className="side-nav"><button className="btn btn-light side-nav-btn"><p><i className="bi bi-graph-up-arrow"></i></p></button></Link>
        <Link to="/trading_calendar" className="side-nav"><button className="btn btn-light side-nav-btn"><p><i className="bi bi-calendar-date-fill"></i></p></button></Link>
        <Link to="/paper_gpt" className="side-nav"><button className="btn btn-light side-nav-btn"><p><i className="bi bi-mortarboard-fill"></i></p></button></Link>
        <Link to="/process_checker" className="side-nav"><button className="btn btn-light side-nav-btn"><p><i className="bi bi-patch-check-fill"></i></p></button></Link>
        <Link to="/science_playground" className="side-nav"><button className="btn btn-light side-nav-btn"><p><i className="bi bi-infinity"></i></p></button></Link>
        <Link to="/economics_gpt" className="side-nav"><button className="btn btn-light side-nav-btn"><p><i className="bi bi-currency-dollar"></i></p></button></Link>
        <Link to="/ai_council" className="side-nav"><button className="btn btn-light side-nav-btn"><p><i className="bi bi-flask-fill"></i></p></button></Link>

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
            <i className="bi bi-database-fill"></i>
        </Link>
        <Link to="/music" className="side-nav">
            <i className="bi bi-music-note-beamed"></i>
        </Link>
        <Link to="/calendar" className="side-nav">
            <i className="bi bi-calendar-fill"></i>
        </Link>
        <Link to="/calendar_data" className="side-nav">
            <i className="bi bi-clipboard-data-fill"></i>
        </Link>
        <Link to="/econ_explainer" className="side-nav">
            <i className="bi bi-cash-stack"></i>
        </Link>
        {/* <Link to="/equations" className="side-nav">
            <i className="bi bi-infinity"></i>
        </Link> */}
        <Link to="/forex_factory" className="side-nav">
            <i className="bi bi-camera-fill"></i>
        </Link>
        <Link to="/trading_econ_dashboard" className="side-nav">
            <i className="bi bi-graph-up-arrow"></i>
        </Link>
        <Link to="/trading_calendar" className="side-nav">
            <i className="bi bi-calendar-date-fill"></i>
        </Link>
        <Link to="/paper_gpt" className="side-nav">
            <i className="bi bi-mortarboard-fill"></i>
        </Link>
        <Link to="/process_checker" className="side-nav">
            <i className="bi bi-patch-check-fill"></i>
        </Link>
        <Link to="/science_playground" className="side-nav">
            <i className="bi bi-infinity"></i>
        </Link>
        <Link to="/economics_gpt" className="side-nav">
            <i className="bi bi-currency-dollar"></i>
        </Link>
        <Link to="/ai_council" className="side-nav">
            <i className="bi bi-flask-fill"></i>
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
                        <button 
                          className="btn btn-sm btn-outline-primary" 
                          onClick={() => handlePlay(song)}
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