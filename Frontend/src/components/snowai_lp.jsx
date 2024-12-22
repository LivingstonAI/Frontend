import React, { useEffect, useRef, useState } from "react";
import jingleBells from '../jingle_bells.mp3';  // Import your audio file
import snowStorm from '../Snowstorm Sound Effect - Winter Storm - Blizzard.mp3';  // Import your audio file
import love_story from '../Indila - Love Story (Piano Cover).mp3'

export default function SnowAILandingPage() {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false); // State to track if music is playing

  
  useEffect(() => {
    createSnowflakes();
  }, []);


  const handlePlayToggle = () => {
    const audio = audioRef.current;
    if (audio) {
      if (isPlaying) {
        audio.pause();  // Pause the audio if it's currently playing
        audio.currentTime = 0;  // Reset the audio to start from the beginning
      } else {
        audio.volume = 0.2; // Set volume to a low level (e.g., 20%)
        audio.play();  // Play the audio if it's currently paused
      }
      setIsPlaying(!isPlaying); // Toggle the play state
    }
  };

  const createSnowflakes = () => {
    const container = document.getElementById("snowflake-container");

    if (container) {
      for (let i = 0; i < 80; i++) { // Reduced to 25 snowflakes
        const snowflake = document.createElement("div");
        snowflake.className = "snowflake";

        // Randomize position, size, animation duration, and delay
        snowflake.style.left = `${Math.random() * 100}vw`; 
        snowflake.style.width = `${Math.random() * 5 + 5}px`; // Random size (5px to 10px)
        snowflake.style.height = snowflake.style.width;
        snowflake.style.animationDuration = `${Math.random() * 6 + 10}s`; // Longer duration (10s to 16s)
        snowflake.style.animationDelay = `${Math.random() * 6}s`; // Random delay
        snowflake.style.opacity = Math.random() * 0.8 + 0.2; // Random opacity (0.2 to 1)

        container.appendChild(snowflake);

        // Remove snowflake after animation ends
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
      {/* <a href="/login" className="snowai-button">
        Log In
      </a><br />
      <button className="snowai-button" onClick={handlePlayToggle}>
        {isPlaying ? "Stop Music" : "Play Music"}
      </button>
      <audio ref={audioRef} src={love_story} loop /> */}
    </div>
  );
}

