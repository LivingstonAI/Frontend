import React, { createContext, useState, useContext } from 'react';

const AudioContext = createContext();

export const useAudio = () => {
  return useContext(AudioContext);
};

export const AudioProvider = ({ children }) => {
  const [audio, setAudio] = useState(null); // Store the audio object
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState(null);

  // Play music function
  const playMusic = (song) => {
    // If there's already a song playing, pause it
    if (audio) {
      audio.pause();
    }

    const newAudio = new Audio(song);
    newAudio.loop = true; // Set loop to true to repeat the song when it ends
    newAudio.play();

    // Update state with new audio and song
    setAudio(newAudio);
    setIsPlaying(true);
    setCurrentSong(song);

    // Save the current state to localStorage
    localStorage.setItem('currentSong', song);
    localStorage.setItem('isAudioPlaying', 'true');
  };

  // Stop music function
  const stopMusic = () => {
    if (audio) {
      audio.pause();
      setIsPlaying(false);
      setCurrentSong(null);
    }
    localStorage.setItem('isAudioPlaying', 'false');
    localStorage.removeItem('currentSong');
  };

  return (
    <AudioContext.Provider value={{ isPlaying, currentSong, playMusic, stopMusic }}>
      {children}
    </AudioContext.Provider>
  );
};
