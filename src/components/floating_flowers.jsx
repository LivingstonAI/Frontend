import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function FlowerFlowers() {
  const navigate = useNavigate();
  const [messageIndex, setMessageIndex] = useState(0);

  const messages = [
    "Keep Shining, Michelle! 🌸",
    "You are amazing! 💖",
    "Believe in yourself. ✨",
    "Every moment is a fresh beginning. 🌼",
    "You make the world brighter. 💫",
    "Stay strong, beautiful, and bold. 💪",
  ];

  useEffect(() => {
    const canvas = document.getElementById("flowerCanvas");
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const flowers = [];

    // Function to randomly create flowers
    function createFlower() {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const radius = Math.random() * 3 + 2;
      const speedY = Math.random() * 1 + 0.5;

      flowers.push({ x, y, radius, speedY });
    }

    // Function to draw flowers
    function drawFlowers() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      flowers.forEach((flower, index) => {
        ctx.beginPath();
        ctx.arc(flower.x, flower.y, flower.radius, 0, Math.PI * 2);
        ctx.fillStyle = "pink";
        ctx.fill();
        ctx.closePath();

        flower.y -= flower.speedY;

        // Remove flowers that go out of bounds
        if (flower.y + flower.radius < 0) {
          flowers.splice(index, 1);
        }
      });
    }

    // Animate flowers
    function animate() {
      drawFlowers();
      requestAnimationFrame(animate);
    }

    animate();

    // Periodically create flowers every 50ms
    const interval = setInterval(createFlower, 50);

    // Handle canvas resize
    window.addEventListener("resize", () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });

    // Cleanup interval and event listeners
    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      });
    };
  }, []);

  // Rotate messages every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prevIndex) => (prevIndex + 1) % messages.length);
    }, 4000); // Interval of 4 seconds

    return () => clearInterval(interval); // Cleanup on component unmount
  }, []);

  return (
    <>
      {/* Canvas for Floating Flowers */}
      <canvas id="flowerCanvas" style={{ display: "block" }} />

      {/* Back Button */}
      <button
        className="michelle-back-button"
        onClick={() => navigate('/michelle')}
      >
        ← Back
      </button>

      {/* Central Message */}
      <div className="centered-message">{messages[messageIndex]}</div>
    </>
  );
}
