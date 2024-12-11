import React, { useEffect } from "react";


export default function SnowAILandingPage() {
  useEffect(() => {
    createSnowflakes();
  }, []);

  const createSnowflakes = () => {
    const container = document.getElementById("snowflake-container");

    if (container) {
      for (let i = 0; i < 50; i++) {
        const snowflake = document.createElement("div");
        snowflake.className = "snowflake";

        // Randomize position, size, animation duration, and delay
        snowflake.style.left = `${Math.random() * 100}vw`;
        snowflake.style.width = `${Math.random() * 8 + 5}px`; // Random size (5px to 13px)
        snowflake.style.height = snowflake.style.width;
        snowflake.style.animationDuration = `${Math.random() * 5 + 8}s`; // Random duration (8s to 13s)
        snowflake.style.animationDelay = `${Math.random() * 5}s`; // Random delay
        snowflake.style.opacity = Math.random() * 0.8 + 0.2; // Random opacity (0.2 to 1)

        container.appendChild(snowflake);

        // Remove snowflake after animation ends
        snowflake.addEventListener("animationend", () => {
          snowflake.remove();
        });
      }
    }
  };

  return (
    <div className="snowai-landing-page">
      <div id="snowflake-container"></div>
      <h1 className="snowai-title">snowAI</h1>
      {/* Button for login */}
      <a href="/login" className="snowai-button">
        Log In
      </a>
    </div>
  );
}
