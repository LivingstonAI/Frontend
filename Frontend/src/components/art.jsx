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
    // "46": { name: "Stromae, Pomme - "Ma Meilleure Ennemie" 🌃", file: ma_meilleure_enemie },
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
    "58": { name: "Copines 🌳", file: copines }
  };

  // Filtered songs based on search term
  const filteredSongs = Object.entries(songs).filter(([key, song]) =>
    song.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const container = containerRef.current;

    // Mouse movement effect
    const handleMouseMove = (e) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 20;
      const y = (e.clientY / innerHeight - 0.5) * 20;
      container.style.transform = `rotateX(${y}deg) rotateY(${x}deg)`;
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
        if (transcript.includes("glow")) {
          container.querySelector(".hologram").style.filter = "drop-shadow(0 0 25px #00ccff) drop-shadow(0 0 40px #0088cc)";
        } else if (transcript.includes("pulse")) {
          container.querySelector(".hologram").style.animationDuration = "1.5s";
        } else if (transcript.includes("expand")) {
          container.style.transform = "scale(1.2)";
        } else if (transcript.includes("shrink")) {
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
      };
    }

    // Boot sequence
    container.style.opacity = 0;
    container.style.transform = "scale(0.5)";
    setTimeout(() => {
      container.style.transition = "transform 2s ease, opacity 2s ease";
      container.style.opacity = 1;
      container.style.transform = "scale(1)";
    }, 100);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isPlaying]);

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

  return (
    <div className="holo-background">
      <div className="navigation-link">
        <Link to="/personal_info" className="back-link">
          Go Back to SnowAI
        </Link>
      </div>

      <div className="holographic-container" ref={containerRef} onClick={generateRipple}>
        <div className="hologram">
          {/* Ripples */}
          {ripples.map((id) => (
            <span key={id} className="ripple" />
          ))}

          {/* Music Player Interface */}
          {isPlaying && (
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
          )}
        </div>
      </div>

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

      {/* Audio Element */}
      <audio ref={audioRef} src={currentSong} loop />

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
    </div>
  );
}