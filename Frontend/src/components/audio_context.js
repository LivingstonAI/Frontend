import React, { createContext, useState, useContext, useEffect } from 'react';

// Create a context for audio
const AudioContext = createContext();

// Custom hook to use the audio context
export const useAudio = () => {
  return useContext(AudioContext);
};

// Provider component to wrap your app
export const AudioProvider = ({ children }) => {
  const [audio, setAudio] = useState(null);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState(null);

  // Play a song
  const playMusic = (song) => {
    if (audio) {
      audio.pause();  // Pause the previous song if it's playing
    }
    const newAudio = new Audio(song);
    setAudio(newAudio);
    newAudio.play();
    setIsMusicPlaying(true);
    setCurrentSong(song);
  };

  // Stop the music
  const stopMusic = () => {
    if (audio) {
      audio.pause();  // Stop playing
      setIsMusicPlaying(false);
      setCurrentSong(null);
    }
  };

  useEffect(() => {
    // Cleanup when component unmounts
    return () => {
      stopMusic();
    };
  }, [audio]);

  return (
    <AudioContext.Provider value={{ playMusic, stopMusic, isMusicPlaying, currentSong }}>
      {children}
    </AudioContext.Provider>
  );
};
