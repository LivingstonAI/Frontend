import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function FlowerFlowers() {
  const navigate = useNavigate();

  useEffect(() => {
    const canvas = document.getElementById("flowerCanvas");
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const flowers = [];

    function createFlower() {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const radius = Math.random() * 3 + 2;
      const speedY = Math.random() * 1 + 0.5;

      flowers.push({ x, y, radius, speedY });
    }

    function drawFlowers() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      flowers.forEach((flower, index) => {
        ctx.beginPath();
        ctx.arc(flower.x, flower.y, flower.radius, 0, Math.PI * 2);
        ctx.fillStyle = "pink";
        ctx.fill();
        ctx.closePath();

        flower.y -= flower.speedY;

        if (flower.y + flower.radius < 0) {
          flowers.splice(index, 1);
        }
      });
    }

    function animate() {
      drawFlowers();
      if (flowers.length < 100) createFlower();
      requestAnimationFrame(animate);
    }

    animate();

    window.addEventListener("resize", () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });
  }, []);

  return (
    <>
      {/* Canvas for Floating Flowers */}
      <canvas id="flowerCanvas" style={{ display: "block" }} />

      {/* Central Message */}
      {/* Back Button */}
      <button
        className="michelle-back-button"
        onClick={() => navigate('/michelle')}
      >
        ← Back
      </button>
      <div className="centered-message">Keep Shining, Michelle! 🌸</div>

    </>
  );
}
