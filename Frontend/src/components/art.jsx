import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom"; // Make sure to import Link for navigation

export default function HolographicInterface() {
  const containerRef = useRef(null);
  const [ripples, setRipples] = useState([]);
  const [isListening, setIsListening] = useState(false); // Track whether speech recognition is active
  const [recognition, setRecognition] = useState(null); // Store the SpeechRecognition instance

  useEffect(() => {
    const container = containerRef.current;

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
      };
    }

    // Boot sequence (scaling and fading in)
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
  }, []);

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
        </div>
      </div>
      <div className="controls">
        <button className="command-button" onClick={startListening} disabled={isListening}>
          Say Command
        </button>
        <button className="stop-button" onClick={stopListening} disabled={!isListening}>
          Stop Command
        </button>
      </div>
    </div>
  );
}
