import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

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

// Audio to be used for authentication
import access_granted_audio from '../Access Granted Sound.mp3';
import access_denied_audio from '../Access Denied - Sound Effect (HD).mp3';

export default function Art() {
  const containerRef = useRef(null);
  const [ripples, setRipples] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);
  
  // Music player states
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState(ezio_family); // Default song
  const [showSongModal, setShowSongModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Authentication states
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [authStage, setAuthStage] = useState("identity"); // "identity", "password", or "authenticated"
  const [showWelcome, setShowWelcome] = useState(false);
  const [scanLines, setScanLines] = useState(true);
  const [authAnimationComplete, setAuthAnimationComplete] = useState(false);
  const [showHologram, setShowHologram] = useState(false); // State to control hologram visibility
  const [currentDateTime, setCurrentDateTime] = useState("");
  
  // Audio refs for authentication sounds
  const accessGrantedAudioRef = useRef(null);
  const accessDeniedAudioRef = useRef(null);

  // NEW: Color customization states
  const [showColorPalette, setShowColorPalette] = useState(false);
  const [hologramColor, setHologramColor] = useState({
    primary: "rgba(0, 150, 255, 0.8)",
    secondary: "rgba(0, 50, 100, 0.4)",
    glow: "#00ccff",
    shadowGlow: "#0088cc"
  });
  const [originalColor] = useState({
    primary: "rgba(0, 150, 255, 0.8)",
    secondary: "rgba(0, 50, 100, 0.4)",
    glow: "#00ccff",
    shadowGlow: "#0088cc"
  });

  // Predefined color themes
  const colorThemes = {
    default: {
      name: "Default Blue",
      primary: "rgba(0, 150, 255, 0.8)",
      secondary: "rgba(0, 50, 100, 0.4)",
      glow: "#00ccff",
      shadowGlow: "#0088cc"
    },
    deepBlue: {
      name: "Deep Blue",
      primary: "rgba(0, 50, 200, 0.8)",
      secondary: "rgba(0, 20, 100, 0.4)",
      glow: "#0033cc",
      shadowGlow: "#001a66"
    },
    skyBlue: {
      name: "Sky Blue",
      primary: "rgba(135, 206, 250, 0.8)",
      secondary: "rgba(65, 105, 225, 0.4)",
      glow: "#87cefa",
      shadowGlow: "#4169e1"
    },
    tealBlue: {
      name: "Teal Blue",
      primary: "rgba(0, 128, 128, 0.8)",
      secondary: "rgba(0, 64, 64, 0.4)",
      glow: "#008080",
      shadowGlow: "#004040"
    },
    navyBlue: {
      name: "Navy Blue",
      primary: "rgba(0, 0, 128, 0.8)",
      secondary: "rgba(0, 0, 64, 0.4)",
      glow: "#000080",
      shadowGlow: "#000040"
    },
    azure: {
      name: "Azure",
      primary: "rgba(0, 127, 255, 0.8)",
      secondary: "rgba(0, 63, 127, 0.4)",
      glow: "#007fff",
      shadowGlow: "#003f7f"
    }
  };

  // Song library
  const songs = {
    "1": { name: "MIT👨‍🎓📖🚀", file: mit },
    "2": { name: "Atreides Theme ⚔️", file: atreides_theme },
    "3": { name: "Jingle Bells", file: jingleBells },
    "4": { name: "Snow Storm", file: snowStorm },
    "5": { name: "Love Story", file: love_story },
    "6": { name: "Ezio's Family", file: ezio_family },
    "7": { name: "Hymn for The Weekend", file: hymn_for_the_weekend },
    "8": { name: "Daydreaming", file: daydreaming },
    "9": { name: "Me Times Two", file: me_times_two},
    "10": { name: "We Don't Talk Anymore", file: we_dont_talk_anymore },
    "11": { name: "Should I Stay or Should I Go", file: should_i_stay },
    "12": { name: "The Middle", file: the_middle },
    "13": { name: "Quiet Night", file: quiet_night },
    "14": { name: "Feels", file: feels },
    "15": { name: "I'm Good (Blue)", file: im_good },
    "16": { name: "Never Give Up", file: never_give_up },
    "17": { name: "Gravity", file: gravity },
    "18": { name: "Closer", file: closer },
    "19": { name: "Bloody Mary (Edit)", file: bloody_mary_edit },
    "20": { name: "Waiting 💙", file: waiting },
    "21": { name: "Wish (Wonderland) ✨🎸", file: wish_wonderland },
    "22": { name: "Welcome to Columbia!📖🚀", file: welcome_to_columbia },
    "23": { name: "沉溺（你让我的心不再结冰) 🎶🌆", file: 沉溺 },
    "24": { name: "Shoot to Thrill - ACDC 🤖🎸", file: shoot_to_thrill },
    "25": { name: "When I'm With You - Arcando", file: when_im_with_you },
    "26": { name: "Coffee Time ☕", file: coffee_time },
    "27": { name: "Coffee Lounge ☕", file: coffee_lounge },
    "28": { name: "Good Vibes 😌", file: good_vibes },
    "29": { name: "Iced Coffee Jazz ☕🎶", file: iced_coffee_jazz },
    "30": { name: "Sitting in a Café ☕👨‍💻", file: sitting_in_a_cafe },
    "31": { name: "Lex MIT Car 🤖🚗", file: lex_mit_car },
    "32": { name: "Keep it lowkey 🎺", file: keep_it_lowkey },
    "33": { name: "Honey Jam 🍯", file: honey_jam },
    "34": { name: "Floral 🌺💮", file: floral },
    "35": { name: "Lemon Cake 🍋🍰", file: lemon_cake },
    "36": { name: "Marshmellow 😋", file: marshmellow},
    "37": { name: "Rose 🌹", file: rose},
    "38": { name: "This is MIT 👨‍🎓📚", file: this_is_mit },
    "39": { name: "Dune: Time between storms ⌛🗡️", file: time_between_storms },
    "40": { name: "Somnus Theme 🐺🥷", file: somnus_theme },
    "41": { name: "Joji - Your Man 🦸‍♂️🦸‍♀️", file: your_man },
    "42": { name: "Cry Baby - SZA 🌃🌃", file: cry_baby },
    "43": { name: "Genesis - Jorma Kaukonen 🧑🏾‍🤝‍👩🏼👨‍💻👩‍💻", file: genesis },
    "44": { name: "Rewrite the Stars 🌃", file: rewrite_the_stars },
    "45": { name: "Bloodline - Ariana Grande 🎤", file: bloodline },
    "46": { name: "Stromae, Pomme - “Ma Meilleure Ennemie” (from Arcane Season 2)🌃", file: ma_meilleure_enemie },
    "47": { name: "Diverseddie 舵 - Procrastination 拖延症 😌👨‍💻", file: procrastination },
    "48": { name: "Duncan's Theme 🗡️", file: duncan_theme },
    "49": { name: "MIT Hall That Never Ends 👨‍🎓🎶", file: mit_hall },
    "50": { name: "Empire State of Mind 🗽🌆", file: empire_state_of_mind },
    "51": { name: "Here Comes The Sun 🌄", file: here_comes_the_sun },
    "52": { name: "Afternoon of Konoha 🌳", file: afternoon_of_konoha },
    "53": { name: "Chosen ⌛", file: chosen },
    "54": { name: "Spin U Around 🎼💙", file: spin_u_round },
    "55": { name: "Feel it 🦸‍♂️🦸‍♀️", file: feel_it },
    "56": { name: "Mona Lisa 🎨🖌️", file: mona_lisa },
    "57": { name: "Forever Star 🌃", file: forever_star },
    "58": { name: "Copines 🌳", file: copines },
    "59": { name: "Dizzy Joakim Karud 🎒👨‍🎓", file: dizzy },
    "60": { name: "Classic 😎🏖️", file: classic },
    "61": { name: "Classic (slowed) 🏄‍♂️", file: classic_slowed },
    "62": { name: "Sound of April 🌃🎧", file: sound_of_april },
    "63": { name: "What are you waiting for? 🏄‍♂️", file: what_are_you_waiting_for },
    "64": { name: "A Million Colors 🎺", file: a_million_colors },
  };

  // Function to get current date and time formatted
  const getCurrentDateTime = () => {
    const now = new Date();
    const options = { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    };
    const timeOptions = {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    };
    
    const dateFormatted = now.toLocaleDateString('en-US', options);
    const timeFormatted = now.toLocaleTimeString('en-US', timeOptions);
    
    return `${dateFormatted} • ${timeFormatted}`;
  };

  // Filtered songs based on search term
  const filteredSongs = Object.entries(songs).filter(([key, song]) =>
    song.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const container = containerRef.current;

    // Set current date and time
    setCurrentDateTime(getCurrentDateTime());

    // Mouse movement effect
    const handleMouseMove = (e) => {
      if (isAuthenticated && container) {
        const { innerWidth, innerHeight } = window;
        const x = (e.clientX / innerWidth - 0.5) * 20;
        const y = (e.clientY / innerHeight - 0.5) * 20;
        container.style.transform = `rotateX(${y}deg) rotateY(${x}deg)`;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Voice command setup
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recog = new SpeechRecognition();
      recog.continuous = true;
      recog.lang = "en-US";
      setRecognition(recog);

      recog.onresult = (event) => {
        const transcript = event.results[event.results.length - 1][0].transcript.trim().toLowerCase();
        console.log("Voice Command:", transcript);

        // Hologram control commands
        if (transcript.includes("glow") && container) {
          container.querySelector(".hologram").style.filter = `drop-shadow(0 0 25px ${hologramColor.glow}) drop-shadow(0 0 40px ${hologramColor.shadowGlow})`;
        } else if (transcript.includes("pulse") && container) {
          container.querySelector(".hologram").style.animationDuration = "1.5s";
        } else if (transcript.includes("expand") && container) {
          container.style.transform = "scale(1.2)";
        } else if (transcript.includes("shrink") && container) {
          container.style.transform = "scale(0.8)";
        } else if (transcript.includes("wave")) {
          generateRipple();
        } 
        // Music control commands
        else if (transcript.includes("play music")) {
          handlePlayToggle();
        } else if (transcript.includes("stop music")) {
          if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
          }
        } else if (transcript.includes("choose song")) {
          setShowSongModal(true);
        }
        // NEW: Color control commands
        else if (transcript.includes("color default") || transcript.includes("default color")) {
          applyColorTheme(colorThemes.default);
        } else if (transcript.includes("deep blue")) {
          applyColorTheme(colorThemes.deepBlue);
        } else if (transcript.includes("sky blue")) {
          applyColorTheme(colorThemes.skyBlue);
        } else if (transcript.includes("teal blue")) {
          applyColorTheme(colorThemes.tealBlue);
        } else if (transcript.includes("navy blue")) {
          applyColorTheme(colorThemes.navyBlue);
        } else if (transcript.includes("azure")) {
          applyColorTheme(colorThemes.azure);
        } else if (transcript.includes("change color")) {
          setShowColorPalette(true);
        }
      };
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isPlaying, isAuthenticated, hologramColor]);

  // Effect to initialize hologram after authentication is complete
  useEffect(() => {
    if (showHologram && containerRef.current) {
      const container = containerRef.current;
      // Boot sequence for hologram
      container.style.opacity = 0;
      container.style.transform = "scale(0.5)";
      setTimeout(() => {
        container.style.transition = "transform 2s ease, opacity 2s ease";
        container.style.opacity = 1;
        container.style.transform = "scale(1)";
      }, 100);
    }
  }, [showHologram]);

  // Effect to update hologram colors when changed
  useEffect(() => {
    if (containerRef.current && showHologram) {
      const hologram = containerRef.current.querySelector(".hologram");
      if (hologram) {
        hologram.style.background = `
          radial-gradient(circle at center, ${hologramColor.primary} 0%, ${hologramColor.secondary} 40%, transparent 70%),
          radial-gradient(circle at top left, ${hologramColor.primary} 10%, transparent 50%)
        `;
        hologram.style.filter = `drop-shadow(0 0 25px ${hologramColor.glow}) drop-shadow(0 0 40px ${hologramColor.shadowGlow})`;
        hologram.style.boxShadow = `0 0 50px ${hologramColor.primary}, inset 0 0 60px ${hologramColor.primary}`;
      }
    }
  }, [hologramColor, showHologram]);

  // Authentication Functions
  const handleIdentitySubmit = (e) => {
    e.preventDefault();
    if (username.trim() === "Tlotlo Motingwe") {
      setAuthError("");
      setAuthStage("password");
    } else {
      setAuthError("Identity verification failed. Please try again.");
      if (accessDeniedAudioRef.current) {
        accessDeniedAudioRef.current.volume = 0.5;
        accessDeniedAudioRef.current.play();
      }
      setTimeout(() => setAuthError(""), 3000);
    }
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    // Password check - as requested, any password will work
    if (password.trim() !== "") {
      setAuthError("");
      setIsAuthenticated(true);
      setAuthStage("authenticated");
      setShowWelcome(true);
      setCurrentDateTime(getCurrentDateTime());
      if (accessGrantedAudioRef.current) {
        accessGrantedAudioRef.current.volume = 0.5;
        accessGrantedAudioRef.current.play();
      }
      setTimeout(() => {
        setScanLines(false);
        setAuthAnimationComplete(true);
      }, 3000);
    } else {
      setAuthError("Invalid password format. Please try again.");
      if (accessDeniedAudioRef.current) {
        accessDeniedAudioRef.current.volume = 0.5;
        accessDeniedAudioRef.current.play();
      }
      setTimeout(() => setAuthError(""), 3000);
    }
  };

  const closeWelcomeMessage = () => {
    setShowWelcome(false);
    setAuthAnimationComplete(true);
    setShowHologram(true);
    setTimeout(() => {
      generateRipple();
      generateRipple();
    }, 100);
  };

  const generateRipple = () => {
    const id = Date.now();
    setRipples((prev) => [...prev, id]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((rippleId) => rippleId !== id));
    }, 1000);
  };

  const startListening = () => {
    if (recognition && !isListening) {
      recognition.start();
      setIsListening(true);
    }
  };

  const stopListening = () => {
    if (recognition && isListening) {
      recognition.stop();
      setIsListening(false);
    }
  };

  // Music player functions
  const handlePlayToggle = () => {
    const audio = audioRef.current;

    if (!isPlaying) {
      setShowSongModal(true);
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  const handleSongSelection = (songFile) => {
    const audio = audioRef.current;
    setCurrentSong(songFile);
    setIsPlaying(true);
    setShowSongModal(false);

    audio.oncanplay = () => {
      audio.play();
    };
    audio.load();
  };

  // NEW: Color theme functions
  const applyColorTheme = (theme) => {
    setHologramColor({
      primary: theme.primary,
      secondary: theme.secondary,
      glow: theme.glow,
      shadowGlow: theme.shadowGlow
    });
    setShowColorPalette(false);
  };

  const toggleColorPalette = () => {
    setShowColorPalette(!showColorPalette);
  };

  // Render authentication UI based on stage
  const renderAuthUI = () => {
    switch (authStage) {
      case "identity":
        return (
          <div className="auth-container">
            <div className="auth-header">
              <div className="auth-title">SYSTEM SECURITY PROTOCOL</div>
              <div className="auth-subtitle">AUTHORIZATION REQUIRED</div>
            </div>
            <form onSubmit={handleIdentitySubmit} className="auth-form">
              <div className="input-group">
                <label htmlFor="identity">
                  <span className="input-prompt">&gt; PLEASE IDENTIFY YOURSELF:</span>
                </label>
                <input
                  type="text"
                  id="identity"
                  className="auth-input"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoFocus
                />
                <div className="scan-line"></div>
              </div>
              <button type="submit" className="auth-button">
                VERIFY IDENTITY
              </button>
            </form>
            {authError && <div className="auth-error">{authError}</div>}
          </div>
        );
      
      case "password":
        return (
          <div className="auth-container">
            <div className="auth-header">
              <div className="auth-title">IDENTITY CONFIRMED</div>
              <div className="auth-subtitle">SECURITY CLEARANCE REQUIRED</div>
            </div>
            <form onSubmit={handlePasswordSubmit} className="auth-form">
              <div className="input-group">
                <label htmlFor="password">
                  <span className="input-prompt">&gt; ENTER PASSWORD:</span>
                </label>
                <input
                  type="password"
                  id="password"
                  className="auth-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoFocus
                />
                <div className="scan-line"></div>
              </div>
              <button type="submit" className="auth-button">
                AUTHENTICATE
              </button>
            </form>
            {authError && <div className="auth-error">{authError}</div>}
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="holo-background">
      {/* Navigation Links - Always at the top of the screen */}
      <div className="navigation-bar">
        <Link to="/calendar_data" className="back-link">
          Go Back to SnowAI
        </Link>
        
        {/* Color switcher button - only shown when authenticated */}
        {isAuthenticated && authAnimationComplete && showHologram && (
          <button className="color-button" onClick={toggleColorPalette}>
            Change Color
          </button>
        )}
      </div>

      {/* Authentication UI - Positioned outside the hologram */}
      {!isAuthenticated && renderAuthUI()}
      {/* Welcome Message - Positioned outside the hologram */}
      {isAuthenticated && showWelcome && (
        <div className="welcome-container">
          <div className="welcome-header">
            <div className="welcome-title">ACCESS GRANTED</div>
            <div className="welcome-message">Welcome back, Master Tlotlo!</div>
          </div>
          <div className="system-info">
            <div className="info-item">
              <span className="info-label">System Status:</span>
              <span className="info-value online">ONLINE</span>
            </div>
            <div className="info-item">
              <span className="info-label">Last Login:</span>
              <span className="info-value">{currentDateTime}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Security Level:</span>
              <span className="info-value">ALPHA CLEARANCE</span>
            </div>
          </div>
          <div className="welcome-footer">
            <div className="footer-text">HOLOGRAPHIC INTERFACE ACTIVATED</div>
            <div className="progress-bar">
              <div className="progress-fill"></div>
            </div>
            <button className="close-welcome-btn" onClick={closeWelcomeMessage}>
              CONTINUE
            </button>
          </div>
        </div>
      )}

      {/* Only show hologram after authentication and welcome message are complete */}
      {showHologram && (
        <div className="holographic-container" ref={containerRef} onClick={generateRipple}>
          <div className={`hologram ${scanLines ? 'with-scan-lines' : ''}`}>
            {/* Ripples */}
            {ripples.map((id) => (
              <span key={id} className="ripple" />
            ))}

            

            {/* Music Player Interface (only shown when authenticated) */}
            {isPlaying ? (
              <div className="holo-music-player">
                <div className="holo-music-visualizer">
                  {Array(5).fill().map((_, i) => (
                    <div key={i} className="holo-music-bar" />
                  ))}
                </div>
                <div className="holo-music-title">Now Playing</div>
                <div className="holo-song-name">
                  {Object.values(songs).find(song => song.file === currentSong)?.name || "Unknown Song"}
                </div>
              </div>
            ) : (
              <div className="holo-idle-animation">
                <div className="orb-core"></div>
                <div className="floating-particles">
                  {Array(6).fill().map((_, i) => (
                    <div key={i} className={`particle particle-${i + 1}`} />
                  ))}
                </div>
                <div className="energy-rings">
                  <div className="ring ring-1"></div>
                  <div className="ring ring-2"></div>
                  <div className="ring ring-3"></div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Only show controls after authentication and welcome message are complete */}
      {isAuthenticated && authAnimationComplete && showHologram && (
        <div className="controls">
          <button className="command-button" onClick={startListening} disabled={isListening}>
            Say Command
          </button>
          <button className="stop-button" onClick={stopListening} disabled={!isListening}>
            Stop Command
          </button>
          <button className="music-button" onClick={handlePlayToggle}>
            {isPlaying ? "Stop Music" : "Play Music"}
          </button>
        </div>
      )}

      {/* Audio Elements */}
      <audio ref={audioRef} src={currentSong} loop />
      
      {/* Authentication sound effects */}
      <audio ref={accessGrantedAudioRef} src={access_granted_audio} />
      <audio ref={accessDeniedAudioRef} src={access_denied_audio} />

      {/* Song Selection Modal */}
      {showSongModal && (
        <div className="song-modal-overlay">
          <div className="song-modal">
            <h2>Select a Song</h2>

            {/* Search Bar */}
            <div className="search-bar">
              <input
                type="text"
                placeholder="Search for a song..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Song List */}
            <ul className="song-list">
              {filteredSongs.length > 0 ? (
                filteredSongs.map(([key, song]) => (
                  <li
                    key={key}
                    className="song-option"
                    onClick={() => handleSongSelection(song.file)}
                  >
                    {song.name}
                  </li>
                ))
              ) : (
                <li className="song-option">No songs found</li>
              )}
            </ul>

            <button
              className="close-modal-btn"
              onClick={() => setShowSongModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* NEW: Color Palette Modal */}
      {showColorPalette && (
        <div className="color-modal-overlay">
          <div className="color-modal">
            <h2>Select Hologram Color</h2>
            
            <div className="color-options">
              {Object.entries(colorThemes).map(([key, theme]) => (
                <div 
                  key={key} 
                  className="color-option"
                  onClick={() => applyColorTheme(theme)}
                  style={{
                    background: `radial-gradient(circle at center, ${theme.primary} 0%, ${theme.secondary} 100%)`,
                    border: hologramColor.glow === theme.glow ? "2px solid white" : "1px solid rgba(255,255,255,0.3)"
                  }}
                >
                  <span className="color-name">{theme.name}</span>
                </div>
              ))}
            </div>
            
            <div className="color-modal-footer">
              <button 
                className="reset-color-btn btn btn-primary"
                onClick={() => applyColorTheme(colorThemes.default)}
              >
                Reset to Default
              </button>
              <button
                className="close-modal-btn"
                onClick={() => setShowColorPalette(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Voice command feedback */}
      {isListening && <div className="voice-indicator">Listening for commands...</div>}
    </div>
  );
}