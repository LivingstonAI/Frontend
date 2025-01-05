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
    { name: "沉溺（你让我的心不再结冰 🎶🌆", file: 沉溺 }
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

  

  // Toggle theme handler
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.body.className = newTheme;
    localStorage.setItem('theme', newTheme);

  };

  // Load music state on component mount
  // useEffect(() => {
  //   const isAudioPlaying = localStorage.getItem('isAudioPlaying') === 'true';
  //   const savedSong = localStorage.getItem('currentSong');
    
  //   if (isAudioPlaying && savedSong) {
  //     const song = songs.find(song => song.file === savedSong);
  //     if (song) {
  //       playMusic(song.file);
  //     }
  //   }
  // }, []);

  // const stopAllAudio = () => {
  //   const allAudioElements = document.querySelectorAll('audio');
    
  //   allAudioElements.forEach(audio => {
  //     audio.pause();  // Pause the audio
  //     audio.currentTime = 0;  // Reset the audio to the beginning
  //   });
  // };
  
  // const stopMusic = () => {
  //   stopAllAudio();  // Stop all audio in the browser
  
  //   setAudio(null);
  //   setIsMusicPlaying(false);
  //   setCurrentSong(null);
    
  //   // Update localStorage to reflect that no music is playing
  //   localStorage.setItem('isAudioPlaying', 'false');
  //   localStorage.removeItem('currentSong');
  // };
  

//   // Play or resume music
// const playMusic = (song) => {
//   // Check if the song is the same as the current one
//   if (audio && currentSong === song) {
//     // If it's the same song, just play it again
//     audio.play();
//     setIsMusicPlaying(true);
//     return;
//   }

//   // Otherwise, set a new song and create a new audio object
//   if (audio) {
//     audio.pause();  // Pause the current audio
//   }

//   const newAudio = new Audio(song);
//   setAudio(newAudio);  // Save the new audio object in state
//   newAudio.play();  // Start playing the new audio
//   setIsMusicPlaying(true);
//   setCurrentSong(song);  // Set the current song
//   localStorage.setItem('isAudioPlaying', 'true');
//   localStorage.setItem('currentSong', song);
// };

// // Stop music
// const stopMusic = () => {
//   if (audio) {
//     audio.pause();  // Pause the audio
//     setAudio(null);  // Clear the audio state
//     setIsMusicPlaying(false);  // Stop music
//     setCurrentSong(null);  // Clear the current song
//     localStorage.setItem('isAudioPlaying', 'false');
//     localStorage.removeItem('currentSong');
//   }
// };

// // Load audio state from localStorage on mount
// useEffect(() => {
//   const isAudioPlaying = localStorage.getItem('isAudioPlaying') === 'true';
//   const savedSong = localStorage.getItem('currentSong');

//   if (isAudioPlaying && savedSong) {
//     const newAudio = new Audio(savedSong);
//     setAudio(newAudio);  // Initialize the audio object
//     setIsMusicPlaying(true);
//     setCurrentSong(savedSong);
//     // newAudio.play();  // Start playing the saved song

//     // Cleanup function to pause audio when component unmounts
//     return () => {
//       newAudio.pause();  // Ensure audio is paused when leaving the component
//       setAudio(null);
//       setIsMusicPlaying(false);
//       setCurrentSong(null);
//     };
//   }
// }, []);

// const audioRef = useRef(null);  // Using useRef to persist the audio object across renders

//   // Load theme and audio state from localStorage on mount
//   useEffect(() => {
//     const savedTheme = localStorage.getItem('theme') || 'light';
//     setTheme(savedTheme);
//     document.body.className = savedTheme; // Apply theme to body

//     // Load audio state from localStorage
//     const isAudioPlaying = localStorage.getItem('isAudioPlaying') === 'true';
//     const savedSong = localStorage.getItem('currentSong');
//     const savedTime = parseFloat(localStorage.getItem('audioTime') || '0'); // Get saved time

//     if (isAudioPlaying && savedSong) {
//       playMusic(savedSong, savedTime);
//     }

//     // Cleanup when component unmounts (not necessary for the ref-based solution, but good practice)
//     return () => {
//       if (audioRef.current) {
//         audioRef.current.pause();
//       }
//     };
//   }, []);

//   const playMusic = (song, startTime = 0) => {
//     if (audioRef.current) {
//       // If audio is already playing, just return
//       if (audioRef.current.paused && audioRef.current.src === song) {
//         audioRef.current.play();
//         return;
//       }
//       // Pause the previous song if it's not the same song
//       audioRef.current.pause();
//     }

//     // Create a new audio instance or use the existing one
//     if (!audioRef.current) {
//       audioRef.current = new Audio(song);
//     }

//     // Ensure the audio plays from the correct time
//     audioRef.current.currentTime = startTime;
    
//     // Play the audio and update state
//     audioRef.current.play().catch((error) => {
//       console.error('Error playing audio:', error);
//     });

//     setIsMusicPlaying(true);
//     setCurrentSong(song);

//     // Store audio state and time in localStorage
//     localStorage.setItem('isAudioPlaying', 'true');
//     localStorage.setItem('currentSong', song);
//     localStorage.setItem('audioTime', audioRef.current.currentTime); // Save the current time
//   };

//   const stopMusic = () => {
//     if (audioRef.current) {
//       audioRef.current.pause();
//       localStorage.setItem('audioTime', audioRef.current.currentTime); // Save the current time when stopping
//       audioRef.current = null; // Clear the audio reference
//       setIsMusicPlaying(false);
//       setCurrentSong(null);

//       // Update localStorage
//       localStorage.setItem('isAudioPlaying', 'false');
//       localStorage.removeItem('currentSong');
//     }
//   };

//   // Keep track of the current time of the audio and update localStorage
//   const handleTimeUpdate = () => {
//     if (audioRef.current) {
//       localStorage.setItem('audioTime', audioRef.current.currentTime); // Update the current time in localStorage
//     }
//   };

//   // Add event listener to track time
//   useEffect(() => {
//     if (audioRef.current) {
//       audioRef.current.addEventListener('timeupdate', handleTimeUpdate);
//     }

//     // Cleanup the event listener when the component unmounts
//     return () => {
//       if (audioRef.current) {
//         audioRef.current.removeEventListener('timeupdate', handleTimeUpdate);
//       }
//     };
//   }, [audioRef.current]);

const { isPlaying, currentSong, playMusic, stopMusic } = useAudio();

const handlePlay = (song) => {
  console.log("Handle play clicked for song:", song); // Debugging line
  playMusic(song); // Call playMusic when song is clicked
};


// Approach 1
// const stopMusic = () => {
//   // Stop the audio in localStorage
//   localStorage.setItem('isAudioPlaying', 'false');
//   localStorage.removeItem('currentSong'); // Clear the saved song in localStorage
  
//   // Reset the audio object (this stops it from playing)
//   if (audio) {
//     // Remove the audio source and reset
//     setAudio(null);  // Effectively removes the audio element
    
//     setIsMusicPlaying(false);
//     setCurrentSong(null);
//   }
// };

// Approach 2
// const stopMusic = () => {
//   // Stop the audio in localStorage
//   localStorage.setItem('isAudioPlaying', 'false');
//   localStorage.removeItem('currentSong'); // Clear the saved song in localStorage
  
//   if (audio) {
//     // Change the source to effectively stop it
//     audio.src = '';  // Stops the audio by removing the source
//     audio.load();    // Reload the audio element (it will no longer play)
    
//     setAudio(null);  // Clear the reference to the audio object
//     setIsMusicPlaying(false);
//     setCurrentSong(null);
//   }
// };

// Approach 3
// const stopMusic = () => {
//   // Stop the audio in localStorage
//   localStorage.setItem('isAudioPlaying', 'false');
//   localStorage.removeItem('currentSong'); // Clear the saved song in localStorage
  
//   if (audio) {
//     // Reset the audio playback time
//     audio.currentTime = 0;  // Rewind to the beginning of the song
//     audio.src = '';  // Stop the song from continuing
//     audio.load();    // Effectively stops the audio
    
//     setAudio(null);  // Clear the reference to the audio object
//     setIsMusicPlaying(false);
//     setCurrentSong(null);
//   }
// };

// Approach 4
// const stopMusic = () => {
//   // Stop the audio in localStorage
//   localStorage.setItem('isAudioPlaying', 'false');
//   localStorage.removeItem('currentSong'); // Clear the saved song in localStorage
  
//   if (audio) {
//     // Completely destroy the audio object
//     audio = null;
//     setAudio(null); // Remove reference to audio object
//   }

//   setIsMusicPlaying(false);
//   setCurrentSong(null);
// };

// Approach 5
// const stopMusic = () => {
//   // Stop the audio in localStorage
//   localStorage.setItem('isAudioPlaying', 'false');
//   localStorage.removeItem('currentSong'); // Clear the saved song in localStorage
  
//   if (audio) {
//     // Remove the audio element from the DOM
//     audio.remove(); // This will completely remove the audio element from memory
//     setAudio(null); // Clear the reference to the audio object
//   }

//   setIsMusicPlaying(false);
//   setCurrentSong(null);
// };

// Approach 6
// useEffect(() => {
//   if (audio) {
//     // Listen for audio ending
//     audio.addEventListener('ended', () => {
//       setIsMusicPlaying(false);
//       setCurrentSong(null);
//       setAudio(null); // Clear the reference
//     });

//     // Listen for audio errors (in case something goes wrong)
//     audio.addEventListener('error', () => {
//       console.error('Audio failed to play.');
//       setIsMusicPlaying(false);
//       setCurrentSong(null);
//       setAudio(null); // Clear the reference
//     });
//   }

//   return () => {
//     // Clean up listeners on component unmount
//     if (audio) {
//       audio.removeEventListener('ended', () => {});
//       audio.removeEventListener('error', () => {});
//     }
//   };
// }, [audio]);



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
              <ul className="list-group">
                {songs.map((song, index) => (
                  <li key={index} className="list-group-item">
                    <button className="btn btn-link" onClick={() => handlePlay(song.file)}>
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
