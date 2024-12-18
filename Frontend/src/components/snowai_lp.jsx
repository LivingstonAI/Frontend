import React, { useEffect } from "react";

export default function SnowAILandingPage() {
  useEffect(() => {
    createSnowflakes();
  }, []);

  const createSnowflakes = () => {
    const container = document.getElementById("snowflake-container");
  
    if (container) {
      for (let i = 0; i < 25; i++) { // Reduced to 25 snowflakes
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
  

  // useEffect(() => {
  //   const hours = new Date().getHours();
  //   const body = document.querySelector(".snowai-landing-page");
  
  //   if (hours < 12) {
  //     // body.style.background = "linear-gradient(180deg, #4a90e2, #6eb1f7)";
  //     body.style.background = "linear-gradient(180deg, #355c7d, #6c5b7b)";

  //   } else if (hours < 18) {
  //     body.style.background = "linear-gradient(180deg, #355c7d, #6c5b7b)";
  //   } else {
  //     body.style.background = "linear-gradient(180deg, #0a0f1f, #1c2235)";
  //   }
  // }, []);
  

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

      {/* Button for login */}
      <a href="/login" className="snowai-button">
        Log In
      </a>
    </div>
  );
}
