import React, { useEffect, useRef, useState } from "react";

export default function HolographicInterface() {
  const containerRef = useRef(null);
  const [ripples, setRipples] = useState([]);

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
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.lang = 'en-US';
      recognition.start();

      recognition.onresult = (event) => {
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

  return (
    <div className="holo-background">
      <div
        className="holographic-container"
        ref={containerRef}
        onClick={generateRipple}
      >
        <div className="hologram">
          {/* Floating mini orbs */}
          {[...Array(5)].map((_, i) => (
            <div key={i} className="floating-orb" />
          ))}
          {/* Ripples */}
          {ripples.map((id) => (
            <span key={id} className="ripple" />
          ))}
        </div>
      </div>
    </div>
  );
}
