import React, { useEffect, useRef, useState } from "react";

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
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState(""); // Default song
  const [showSongModal, setShowSongModal] = useState(false);

  // Slogan animation state
  const [currentSlogan, setCurrentSlogan] = useState("");
  const [sloganIndex, setSloganIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const slogans = [
    "Where cutting edge technology intersects with finance.",
    "尖端技术与金融的交汇之处。",
    "첨단 기술과 금융이 만나는 곳.",
    "最先端技術と金融が交差する場所。",
    "Где передовые технологии пересекаются с финансами."
  ];

  const songs = {
    "1": { name: "MIT👨‍🎓📖🚀", file: "" },
    "2": { name: "Atreides Theme ⚔️", file: "" },
    "3": { name: "Jingle Bells", file: "" },
    "4": { name: "Snow Storm", file: "" },
    "5": { name: "Love Story", file: "" },
    "6": { name: "Ezio's Family", file: "" },
    "7": { name: "Hymn for The Weekend", file: "" },
    "8": { name: "Daydreaming", file: "" },
    "9": { name: "Me Times Two", file: "" },
    "10": { name: "We Don't Talk Anymore", file: "" },
    "11": { name: "Should I Stay or Should I Go", file: "" },
    "12": { name: "The Middle", file: "" },
    "13": { name: "Quiet Night", file: "" },
    "14": { name: "Feels", file: "" },
    "15": { name: "I'm Good (Blue)", file: "" },
    "16": { name: "Never Give Up", file: "" },
    "17": { name: "Gravity", file: "" },
    "18": { name: "Closer", file: "" },
    "19": { name: "Bloody Mary (Edit)", file: "" },
    "20": { name: "Waiting 💙", file: "" },
    "21": { name: "Wish (Wonderland) ✨🎸", file: "" },
    "22": { name: "Welcome to Columbia!📖🚀", file: "" },
    "23": { name: "沉溺（你让我的心不再结冰) 🎶🌆", file: "" },
    "24": { name: "Shoot to Thrill - ACDC 🤖🎸", file: "" },
    "25": { name: "When I'm With You - Arcando", file: "" },
    "26": { name: "Coffee Time ☕", file: "" },
    "27": { name: "Coffee Lounge ☕", file: "" },
    "28": { name: "Good Vibes 😌", file: "" },
    "29": { name: "Iced Coffee Jazz ☕🎶", file: "" },
    "30": { name: "Sitting in a Café ☕👨‍💻", file: "" },
    "31": { name: "Lex MIT Car 🤖🚗", file: "" },
    "32": { name: "Keep it lowkey 🎺", file: "" },
    "33": { name: "Honey Jam 🍯", file: "" },
    "34": { name: "Floral 🌺💮", file: "" },
    "35": { name: "Lemon Cake 🍋🍰", file: "" },
    "36": { name: "Marshmellow 😋", file: "" },
    "37": { name: "Rose 🌹", file: "" },
    "38": { name: "This is MIT 👨‍🎓📚", file: "" },
    "39": { name: "Dune: Time between storms ⌛🗡️", file: "" },
    "40": { name: "Somnus Theme 🐺🥷", file: "" },
    "41": { name: "Joji - Your Man 🦸‍♂️🦸‍♀️", file: "" },
    "42": { name: "Cry Baby - SZA 🌃🌃", file: "" },
    "43": { name: "Genesis - Jorma Kaukonen 🧑🏾‍🤝‍👩🏼👨‍💻👩‍💻", file: "" },
    "44": { name: "Rewrite the Stars 🌃", file: "" },
    "45": { name: "Bloodline - Ariana Grande 🎤", file: "" },
    // "46": { name: "Stromae, Pomme - "Ma Meilleure Ennemie" (from Arcane Season 2)🌃", file: "" },
    "47": { name: "Diverseddie 舵 - Procrastination 拖延症 😌👨‍💻", file: "" },
    "48": { name: "Duncan's Theme 🗡️", file: "" },
    "49": { name: "MIT Hall That Never Ends 👨‍🎓🎶", file: "" },
    "50": { name: "Empire State of Mind 🗽🌆", file: "" },
    "51": { name: "Here Comes The Sun 🌄", file: "" },
    "52": { name: "Afternoon of Konoha 🌳", file: "" },
    "53": { name: "Chosen ⌛", file: "" },
    "54": { name: "Spin U Around 🎼💙", file: "" },
    "55": { name: "Feel it 🦸‍♂️🦸‍♀️", file: "" },
    "56": { name: "Mona Lisa 🎨🖌️", file: "" },
    "57": { name: "Forever Star 🌃", file: "" },
    "58": { name: "Copines 🌳", file: "" }
  };

  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredSongs = Object.entries(songs).filter(([key, song]) =>
    song.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Slogan typewriter effect
  useEffect(() => {
    const timeout = setTimeout(() => {
      const currentSloganText = slogans[sloganIndex];
      
      if (!isDeleting && charIndex < currentSloganText.length) {
        // Typing forward
        setCurrentSlogan(currentSloganText.substring(0, charIndex + 1));
        setCharIndex(charIndex + 1);
      } else if (isDeleting && charIndex > 0) {
        // Deleting backward
        setCurrentSlogan(currentSloganText.substring(0, charIndex - 1));
        setCharIndex(charIndex - 1);
      } else if (!isDeleting && charIndex === currentSloganText.length) {
        // Finished typing, wait then start deleting
        setTimeout(() => setIsDeleting(true), 2000);
      } else if (isDeleting && charIndex === 0) {
        // Finished deleting, move to next slogan
        setIsDeleting(false);
        setSloganIndex((prev) => (prev + 1) % slogans.length);
      }
    }, isDeleting ? 50 : 100);

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, sloganIndex, slogans]);

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

  const createFallingCharacters = () => {
    const container = document.getElementById("snowflake-container");
    if (container) {
      const characters = [
        '雪', '冬', '美', '爱', '风', '光', '云', '星', '梦', '智', 
        '慧', '学', '研', '科', '技', '未', '来', '创', '新', '思',
        '天', '地', '山', '水', '人', '心', '情', '感', '知', '道',
        '눈', '겨', '울', '아', '름', '사', '랑', '바', '람', '빛', 
        '구', '름', '별', '꿈', '지', '혜', '배', '움', '과', '학',
        '미', '래', '창', '조', '생', '각', '하', '늘', '땅', '산'
      ];
      
      const characterCount = 25;
      
      for (let i = 0; i < characterCount; i++) {
        const character = document.createElement("div");
        character.className = "falling-character";
        
        const randomChar = characters[Math.floor(Math.random() * characters.length)];
        character.innerText = randomChar;
        
        character.style.left = `${Math.random() * 100}vw`;
        character.style.fontSize = `${Math.random() * 12 + 14}px`;
        character.style.animationDuration = `${Math.random() * 8 + 15}s`;
        character.style.animationDelay = `${Math.random() * 3}s`;
        character.style.opacity = Math.random() * 0.7 + 0.3;
        character.style.transform = `rotate(${Math.random() * 360}deg)`;
        
        container.appendChild(character);
        
        character.addEventListener("animationend", () => {
          if (character.parentNode === container) {
            container.removeChild(character);
          }
        });
      }
    }
  };
  
  useEffect(() => {
    createFallingCharacters();
    
    const maxCharacters = 40;
    
    const intervalId = setInterval(() => {
      const container = document.getElementById("snowflake-container");
      if (container && container.children.length < maxCharacters) {
        createFallingCharacters();
      }
    }, 5000);
    
    return () => clearInterval(intervalId);
  }, []);

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
      <style>{`
        /* Background and container styling */
        .snowai-landing-page {
          position: relative;
          height: 100vh;
          width: 100vw;
          background: linear-gradient(180deg, #0a0f1f, #1c2235);
          background-size: 400% 400%;
          animation: gradientShift 10s infinite ease-in-out;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          overflow: hidden;
          color: white;
          font-family: "Arial", sans-serif;
          border: 10px solid transparent;
          background-clip: padding-box, border-box;
          background-origin: border-box;
          box-shadow: 0 0 15px 5px rgba(255, 255, 255, 0.2) inset;
        }

        /* Gradient shift animation */
        @keyframes gradientShift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        /* Title styling */
        .snowai-title {
          font-size: 5rem;
          color: #ffffff;
          text-shadow: 0 0 10px #9ecffb, 0 0 20px #9ecffb;
          z-index: 10;
          margin-bottom: 30px;
        }

        .snowai-title span {
          animation: glow-letter 1.5s infinite;
        }

        @keyframes glow-letter {
          0%, 100% {
            color: #ffffff;
            text-shadow: 0 0 10px #9ecffb, 0 0 20px #9ecffb;
          }
          50% {
            color: #2979ff;
            text-shadow: 0 0 20px #68a6db, 0 0 30px #68a6db;
          }
        }

        /* Slogan styling */
        .snowai-slogan {
          font-size: 1.5rem;
          color: #ffffff;
          text-shadow: 0 0 8px #9ecffb, 0 0 16px #9ecffb;
          z-index: 10;
          margin-bottom: 30px;
          min-height: 2em;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          border-right: 2px solid #ffffff;
          animation: blink 0.8s step-end infinite;
          white-space: nowrap;
          overflow: hidden;
        }

        /* Blinking cursor effect */
        @keyframes blink {
          from, to {
            border-color: transparent;
          }
          50% {
            border-color: #ffffff;
          }
        }

        /* Button styling */
        .snowai-button {
          font-size: 1.2rem;
          color: #ffffff;
          text-decoration: none;
          background-color: #2979ff;
          padding: 15px 30px;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(41, 121, 255, 0.3);
          transition: background-color 0.3s ease, box-shadow 0.3s ease;
          z-index: 10;
          animation: glow 3s infinite ease-in-out;
          border: none;
          cursor: pointer;
          margin: 10px;
        }

        /* Button glow animation */
        @keyframes glow {
          0%, 100% {
            box-shadow: 0 4px 12px rgba(41, 121, 255, 0.3);
          }
          50% {
            box-shadow: 0 4px 18px rgba(41, 121, 255, 0.5);
          }
        }

        /* Button hover effect */
        .snowai-button:hover {
          background-color: #68a6db;
          box-shadow: 0 4px 20px rgba(41, 121, 255, 0.6);
        }

        .mouse-glow {
          position: absolute;
          width: 50px;
          height: 50px;
          background: radial-gradient(circle, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 80%);
          pointer-events: none;
          mix-blend-mode: screen;
          transition: transform 0.1s ease;
        }

        /* Character styling (replacing snowflakes) */
        .falling-character {
          position: absolute;
          top: -5%;
          color: #ffffff;
          font-size: 18px;
          opacity: 0.8;
          animation: fall linear infinite;
          transition: transform 0.2s ease, opacity 0.2s ease;
        }

        /* Character falling animation */
        @keyframes fall {
          to {
            transform: translateY(110vh);
          }
        }

        /* Character hover effect */
        .falling-character:hover {
          transform: scale(1.5) rotate(15deg);
          opacity: 0.5;
        }

        /* Modal styling */
        .landing-page-song-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .landing-page-song-modal {
          background: #1c2235;
          padding: 30px;
          border-radius: 15px;
          width: 90%;
          max-width: 500px;
          max-height: 80%;
          overflow-y: auto;
          box-shadow: 0 0 30px rgba(41, 121, 255, 0.3);
        }

        .landing-page-song-modal h2 {
          color: #ffffff;
          text-align: center;
          margin-bottom: 20px;
          text-shadow: 0 0 10px #9ecffb;
        }

        .form-control {
          width: 100%;
          padding: 12px;
          border: 2px solid #2979ff;
          border-radius: 8px;
          background: #0a0f1f;
          color: #ffffff;
          font-size: 16px;
          margin-bottom: 20px;
        }

        .form-control:focus {
          outline: none;
          border-color: #68a6db;
          box-shadow: 0 0 10px rgba(41, 121, 255, 0.3);
        }

        .song-list {
          list-style: none;
          padding: 0;
          margin: 0;
          max-height: 300px;
          overflow-y: auto;
        }

        .song-option {
          padding: 12px;
          margin: 5px 0;
          background: #0a0f1f;
          color: #ffffff;
          border-radius: 8px;
          cursor: pointer;
          transition: background-color 0.3s ease;
          border: 1px solid #2979ff;
        }

        .song-option:hover {
          background: #2979ff;
          box-shadow: 0 0 10px rgba(41, 121, 255, 0.3);
        }

        .close-modal-btn-lp {
          width: 100%;
          padding: 12px;
          background: #2979ff;
          color: #ffffff;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          cursor: pointer;
          margin-top: 20px;
          transition: background-color 0.3s ease;
        }

        .close-modal-btn-lp:hover {
          background: #68a6db;
        }

        .mb-3 {
          margin-bottom: 1rem;
        }
      `}</style>

      <div id="snowflake-container"></div>
      
      <h1 className="snowai-title">
        {["S", "n", "o", "w", "A", "I"].map((letter, idx) => (
          <span key={idx} style={{ animationDelay: `${idx * 0.2}s` }}>{letter}</span>
        ))}
      </h1>
      
      <div className="snowai-slogan">
        {currentSlogan}
      </div>
      
      <a href="/login" className="snowai-button">Log In</a>
      
      <button className="snowai-button" onClick={handlePlayToggle}>
        {isPlaying ? "Stop Music" : "Play Music"}
      </button>
      
      <audio ref={audioRef} src={currentSong} loop />

      {showSongModal && (
        <div className="landing-page-song-modal-overlay">
          <div className="landing-page-song-modal">
            <h2>Select a Song</h2>

            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Search for a song..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

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
              className="close-modal-btn-lp"
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