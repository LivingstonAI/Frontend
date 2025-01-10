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


export default function SnowAILandingPage() {
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
  };

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
        {["s", "n", "o", "w", "A", "I"].map((letter, idx) => (
          <span key={idx} style={{ animationDelay: `${idx * 0.2}s` }}>{letter}</span>
        ))}
      </h1>
      <a href="/login" className="snowai-button">Log In</a>
      <br />
      <button className="snowai-button" onClick={handlePlayToggle}>
        {isPlaying ? "Stop Music" : "Play Music"}
      </button>
      <audio ref={audioRef} src={currentSong} loop />

      {/* Song selection modal */}
      {showSongModal && (
        <div className="landing-page-song-modal-overlay">
          <div className="landing-page-song-modal">
            <h2>Select a Song</h2>
            <ul className="song-list">
              {Object.entries(songs).map(([key, song]) => (
                <li
                  key={key}
                  className="song-option"
                  onClick={() => handleSongSelection(song.file)}
                >
                  {song.name}
                </li>
              ))}
            </ul>
            <button className="close-modal-btn" onClick={() => setShowSongModal(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
