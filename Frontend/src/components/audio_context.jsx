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
  const playMusic = (songUrl) => {
    // If there's already a song playing, pause it
    if (audio) {
      audio.pause();
    }

    // Create a new Audio object with the song URL
    const newAudio = new Audio(songUrl);
    newAudio.loop = true; // Set loop to true to repeat the song when it ends
    
    // Play the audio
    newAudio.play()
      .then(() => {
        // Update state with new audio and song
        setAudio(newAudio);
        setIsPlaying(true);
        setCurrentSong(songUrl);

        // Save the current state to localStorage
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