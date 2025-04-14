import React, { createContext, useState, useContext } from 'react';

const AudioContext = createContext();

export const useAudio = () => {
  return useContext(AudioContext);
};

export const AudioProvider = ({ children }) => {
  const [audio, setAudio] = useState(null); // Store the audio object
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState(null);
  

  // In the AudioProvider component
const playMusic = (songUrl) => {
  console.log("Attempting to play:", songUrl);
  
  if (audio) {
    audio.pause();
  }

  const newAudio = new Audio(songUrl);
  newAudio.loop = true;
  
  newAudio.addEventListener('error', (e) => {
    console.error("Audio error:", e);
    console.error("Audio error code:", newAudio.error?.code);
    console.error("Audio error message:", newAudio.error?.message);
  });
  
  newAudio.play()
    .then(() => {
      console.log("Audio playing successfully");
      setAudio(newAudio);
      setIsPlaying(true);
      setCurrentSong(songUrl);
      localStorage.setItem('currentSong', songUrl);
      localStorage.setItem('isAudioPlaying', 'true');
    })
    .catch(error => {
      console.error("Error playing audio:", error);
    });
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