import React, { useEffect, useRef, useState } from "react";



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


export default function SnowAILandingPage() {

  const [times, setTimes] = useState({
    NewYork: new Date().toLocaleTimeString("en-US", { timeZone: "America/New_York" }),
    London: new Date().toLocaleTimeString("en-GB", { timeZone: "Europe/London" }),
    Tokyo: new Date().toLocaleTimeString("ja-JP", { timeZone: "Asia/Tokyo" }),
  });

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimes({
        NewYork: new Date().toLocaleTimeString("en-US", { timeZone: "America/New_York" }),
        London: new Date().toLocaleTimeString("en-GB", { timeZone: "Europe/London" }),
        Tokyo: new Date().toLocaleTimeString("ja-JP", { timeZone: "Asia/Tokyo" }),
      });
    }, 1000); // Update every second

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, []);

  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState(ezio_family); // Default song
  const [showSongModal, setShowSongModal] = useState(false); // State for showing the song selection modal

  
  const songs = {
    "1": { name: "Jingle Bells", file: jingleBells },
    "2": { name: "Snow Storm", file: snowStorm },
    "3": { name: "Love Story", file: love_story },
    "4": { name: "Ezio's Family", file: ezio_family },
    "5": { name: "Hymn for The Weekend", file: hymn_for_the_weekend },
    "6": { name: "Daydreaming", file: daydreaming },
    "7": { name: "Me Times Two", file: me_times_two},
    "8": { name: "We Don't Talk Anymore", file: we_dont_talk_anymore },
    "9": { name: "Should I Stay or Should I Go", file: should_i_stay },
    "10": { name: "The Middle", file: the_middle },
    "11": { name: "Quiet Night", file: quiet_night },
    "12": { name: "Feels", file: feels },
    "13": { name: "I'm Good (Blue)", file: im_good },
    "14": { name: "Never Give Up", file: never_give_up },
    "15": { name: "Gravity", file: gravity },
    "16": { name: "Closer", file: closer },
    "17": { name: "Bloody Mary (Edit)", file: bloody_mary_edit },
    "18": { name: "Waiting 💙", file: waiting },
    "19": { name: "Wish (Wonderland) ✨🎸", file: wish_wonderland },
    "20": { name: "Welcome to Columbia!📖🚀", file: welcome_to_columbia },
    "21": { name: "沉溺（你让我的心不再结冰) 🎶🌆", file: 沉溺 },
    "22": { name: "Shoot to Thrill - ACDC 🤖🎸", file: shoot_to_thrill },
    "23": { name: "When I'm With You - Arcando", file: when_im_with_you },
    "24": { name: "Coffee Time ☕", file: coffee_time },
    "25": { name: "Coffee Lounge ☕", file: coffee_lounge },
    "26": { name: "Good Vibes 😌", file: good_vibes },
    "27": { name: "Iced Coffee Jazz ☕🎶", file: iced_coffee_jazz },
    "28": { name: "Sitting in a Café ☕👨‍💻", file: sitting_in_a_cafe },
    "29": { name: "Lex MIT Car 🤖🚗", file: lex_mit_car },
    "30": { name: "Keep it lowkey 🎺", file: keep_it_lowkey },
    "31": { name: "Honey Jam 🍯", file: honey_jam },
    "32": { name: "Floral 🌺💮", file: floral },
    "33": { name: "Lemon Cake 🍋🍰", file: lemon_cake },
    "34": { name: "Marshmellow 😋", file: marshmellow},
    "35": { name: "Rose 🌹", file: rose},
    "36": { name: "This is MIT 👨‍🎓📚", file: this_is_mit },
  };

    // State for search term and filtered songs
  const [searchTerm, setSearchTerm] = useState("");
  
   // Filtered songs based on the search term
   const filteredSongs = Object.entries(songs).filter(([key, song]) =>
    song.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  useEffect(() => {
    createSnowflakes();
  }, []);

  const handlePlayToggle = () => {
    const audio = audioRef.current;

    if (!isPlaying) {
      // Prompt the user to select a song
      setShowSongModal(true); // Show the song selection modal
    } else {
      audio.pause();
      setIsPlaying(false); // Stop the music
    }
  };

  const handleSongSelection = (songFile) => {
    const audio = audioRef.current;
    setCurrentSong(songFile); // Set the chosen song
    setIsPlaying(true); // Update the state to indicate playing
    setShowSongModal(false); // Close the modal

    // Set up the audio to play only when it's ready
    audio.oncanplay = () => {
      audio.volume = 0.2;
      audio.play();
    };
    audio.load(); // Load the new song
  };

  const createSnowflakes = () => {
    const container = document.getElementById("snowflake-container");
    if (container) {
      for (let i = 0; i < 80; i++) {
        const snowflake = document.createElement("div");
        snowflake.className = "snowflake";

        snowflake.style.left = `${Math.random() * 100}vw`;
        snowflake.style.width = `${Math.random() * 5 + 5}px`;
        snowflake.style.height = snowflake.style.width;
        snowflake.style.animationDuration = `${Math.random() * 6 + 10}s`;
        snowflake.style.animationDelay = `${Math.random() * 6}s`;
        snowflake.style.opacity = Math.random() * 0.8 + 0.2;

        container.appendChild(snowflake);

        snowflake.addEventListener("animationend", () => {
          snowflake.remove();
        });
      }
    }
  };

  useEffect(() => {
    const glow = document.createElement("div");
    glow.className = "mouse-glow";
    document.body.appendChild(glow);

    const handleMouseMove = (e) => {
      glow.style.transform = `translate(${e.clientX - 25}px, ${e.clientY - 25}px)`;
    };

    document.addEventListener("mousemove", handleMouseMove);
    return () => document.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="snowai-landing-page">
      <div id="snowflake-container"></div>
      <h1 className="snowai-title">
        {["S", "n", "o", "w", "A", "I"].map((letter, idx) => (
          <span key={idx} style={{ animationDelay: `${idx * 0.2}s` }}>{letter}</span>
        ))}
      </h1>
      <a href="/login" className="snowai-button">Log In</a>
      <br />
      <button className="snowai-button" onClick={handlePlayToggle}>
        {isPlaying ? "Stop Music" : "Play Music"}
      </button>
      <audio ref={audioRef} src={currentSong} loop />

      {showSongModal && (
        <div className="landing-page-song-modal-overlay">
          <div className="landing-page-song-modal">
            <h2>Select a Song</h2>

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
