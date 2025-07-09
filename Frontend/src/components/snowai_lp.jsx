import React, { useEffect, useRef, useState } from "react";

export default function SnowAILandingPage() {
  const [times, setTimes] = useState({
    NewYork: new Date().toLocaleTimeString("en-US", { timeZone: "America/New_York" }),
    London: new Date().toLocaleTimeString("en-GB", { timeZone: "Europe/London" }),
    Tokyo: new Date().toLocaleTimeString("ja-JP", { timeZone: "Asia/Tokyo" }),
  });

  const [orbClicked, setOrbClicked] = useState(false);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimes({
        NewYork: new Date().toLocaleTimeString("en-US", { timeZone: "America/New_York" }),
        London: new Date().toLocaleTimeString("en-GB", { timeZone: "Europe/London" }),
        Tokyo: new Date().toLocaleTimeString("ja-JP", { timeZone: "Asia/Tokyo" }),
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const handleOrbClick = () => {
    setOrbClicked(true);
    setTimeout(() => setOrbClicked(false), 1000);
  };

  const createFallingCharacters = () => {
    const container = document.getElementById("snowflake-container");
    if (container) {
      const characters = [
        '雪', '冬', '美', '爱', '风', '光', '云', '星', '梦', '智', 
        '慧', '学', '研', '科', '技', '未', '来', '创', '新', '思',
        '天', '地', '山', '水', '人', '心', '情', '感', '知', '道',
        '눈', '겨', '울', '아', '름', '사', '랑', '바', '람', '빛', 
        '구', '름', '별', '꿈', '지', '혜', '배', '움', '과', '학',
        '미', '래', '창', '조', '생', '각', '하', '늘', '땅', '산'
      ];
      
      const characterCount = 15;
      
      for (let i = 0; i < characterCount; i++) {
        const character = document.createElement("div");
        character.className = "falling-character";
        
        const randomChar = characters[Math.floor(Math.random() * characters.length)];
        character.innerText = randomChar;
        
        character.style.left = `${Math.random() * 100}vw`;
        character.style.fontSize = `${Math.random() * 10 + 12}px`;
        character.style.animationDuration = `${Math.random() * 10 + 20}s`;
        character.style.animationDelay = `${Math.random() * 3}s`;
        character.style.opacity = Math.random() * 0.3 + 0.1;
        character.style.transform = `rotate(${Math.random() * 360}deg)`;
        
        container.appendChild(character);
        
        character.addEventListener("animationend", () => {
          if (character.parentNode === container) {
            container.removeChild(character);
          }
        });
      }
    }
  };
  
  useEffect(() => {
    createFallingCharacters();
    
    const maxCharacters = 25;
    
    const intervalId = setInterval(() => {
      const container = document.getElementById("snowflake-container");
      if (container && container.children.length < maxCharacters) {
        createFallingCharacters();
      }
    }, 8000);
    
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="snowai-hud-container">
      <div id="snowflake-container"></div>
      
      {/* HUD Background Elements */}
      <div className="hud-background"></div>
      
      {/* Corner HUD Elements */}
      <div className="hud-corner hud-top-left"></div>
      <div className="hud-corner hud-top-right"></div>
      <div className="hud-corner hud-bottom-left"></div>
      <div className="hud-corner hud-bottom-right"></div>
      
      {/* Side HUD Panels */}
      <div className="hud-side-panel hud-left">
        <div className="hud-data-item">
          <span className="hud-label">NYC</span>
          <span className="hud-value">{times.NewYork}</span>
        </div>
        <div className="hud-data-item">
          <span className="hud-label">LON</span>
          <span className="hud-value">{times.London}</span>
        </div>
        <div className="hud-data-item">
          <span className="hud-label">TKY</span>
          <span className="hud-value">{times.Tokyo}</span>
        </div>
      </div>
      
      {/* Central Content */}
      <div className="hud-central-content">
        {/* 3D Orb */}
        <div className="orb-container" onClick={handleOrbClick}>
          <div className={`orb-3d ${orbClicked ? 'orb-clicked' : ''}`}>
            <div className="orb-inner"></div>
            <div className="orb-glow"></div>
          </div>
        </div>
        
        {/* Title */}
        <h1 className="snowai-title">
          {["S", "n", "o", "w", "A", "I"].map((letter, idx) => (
            <span key={idx} style={{ animationDelay: `${idx * 0.2}s` }}>{letter}</span>
          ))}
        </h1>
        
        {/* Subtitle */}
        <p className="hud-subtitle">ARTIFICIAL INTELLIGENCE SYSTEM</p>
        
        {/* Action Button */}
        <a href="/login" className="hud-button">
          <span className="button-text">INITIALIZE</span>
          <div className="button-glow"></div>
        </a>
      </div>
      
      {/* Bottom HUD Bar */}
      <div className="hud-bottom-bar">
        <div className="hud-progress-bar">
          <div className="hud-progress-fill"></div>
        </div>
        <span className="hud-bottom-text">SYSTEM READY</span>
      </div>
      
      <style jsx>{`
        .snowai-hud-container {
          position: relative;
          height: 100vh;
          width: 100vw;
          background: linear-gradient(135deg, #0a0f1f 0%, #1a2332 50%, #0d1421 100%);
          display: flex;
          justify-content: center;
          align-items: center;
          overflow: hidden;
          font-family: 'Orbitron', 'Arial', sans-serif;
          color: #00d4ff;
        }
        
        .hud-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: 
            radial-gradient(circle at 20% 20%, rgba(0, 212, 255, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(41, 121, 255, 0.1) 0%, transparent 50%);
          pointer-events: none;
        }
        
        .hud-corner {
          position: absolute;
          width: 60px;
          height: 60px;
          border: 2px solid #00d4ff;
          pointer-events: none;
          opacity: 0.7;
        }
        
        .hud-top-left {
          top: 20px;
          left: 20px;
          border-right: none;
          border-bottom: none;
        }
        
        .hud-top-right {
          top: 20px;
          right: 20px;
          border-left: none;
          border-bottom: none;
        }
        
        .hud-bottom-left {
          bottom: 20px;
          left: 20px;
          border-right: none;
          border-top: none;
        }
        
        .hud-bottom-right {
          bottom: 20px;
          right: 20px;
          border-left: none;
          border-top: none;
        }
        
        .hud-side-panel {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(0, 212, 255, 0.05);
          border: 1px solid rgba(0, 212, 255, 0.3);
          padding: 20px;
          backdrop-filter: blur(10px);
          min-width: 150px;
        }
        
        .hud-left {
          left: 30px;
        }
        
        .hud-data-item {
          display: flex;
          justify-content: space-between;
          margin: 10px 0;
          font-size: 12px;
        }
        
        .hud-label {
          color: #00d4ff;
          opacity: 0.8;
        }
        
        .hud-value {
          color: #ffffff;
          font-weight: bold;
        }
        
        .hud-central-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          z-index: 10;
        }
        
        .orb-container {
          position: relative;
          margin-bottom: 30px;
          cursor: pointer;
        }
        
        .orb-3d {
          position: relative;
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background: linear-gradient(135deg, #0066cc 0%, #00d4ff 50%, #0099ff 100%);
          box-shadow: 
            0 0 30px rgba(0, 212, 255, 0.5),
            inset 0 0 20px rgba(255, 255, 255, 0.2);
          animation: orb-pulse 3s ease-in-out infinite;
          transition: all 0.3s ease;
        }
        
        .orb-3d:hover {
          transform: scale(1.05);
          box-shadow: 
            0 0 40px rgba(0, 212, 255, 0.7),
            inset 0 0 25px rgba(255, 255, 255, 0.3);
        }
        
        .orb-clicked {
          animation: orb-explosion 1s ease-out;
        }
        
        @keyframes orb-explosion {
          0% {
            transform: scale(1);
            box-shadow: 0 0 30px rgba(0, 212, 255, 0.5);
          }
          50% {
            transform: scale(1.3);
            box-shadow: 
              0 0 80px rgba(0, 212, 255, 1),
              0 0 120px rgba(255, 255, 255, 0.8);
          }
          100% {
            transform: scale(1);
            box-shadow: 0 0 30px rgba(0, 212, 255, 0.5);
          }
        }
        
        .orb-inner {
          position: absolute;
          top: 20%;
          left: 20%;
          width: 60%;
          height: 60%;
          border-radius: 50%;
          background: linear-gradient(45deg, rgba(255, 255, 255, 0.3) 0%, transparent 70%);
        }
        
        .orb-glow {
          position: absolute;
          top: -10px;
          left: -10px;
          width: 140px;
          height: 140px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(0, 212, 255, 0.3) 0%, transparent 70%);
          animation: orb-glow-pulse 2s ease-in-out infinite alternate;
        }
        
        @keyframes orb-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        @keyframes orb-glow-pulse {
          0% { opacity: 0.3; }
          100% { opacity: 0.6; }
        }
        
        .snowai-title {
          font-size: 4rem;
          color: #ffffff;
          text-shadow: 0 0 20px #00d4ff, 0 0 40px #00d4ff;
          margin: 0;
          font-weight: bold;
          letter-spacing: 2px;
        }
        
        .snowai-title span {
          animation: title-glow 2s ease-in-out infinite;
        }
        
        @keyframes title-glow {
          0%, 100% {
            color: #ffffff;
            text-shadow: 0 0 20px #00d4ff, 0 0 40px #00d4ff;
          }
          50% {
            color: #00d4ff;
            text-shadow: 0 0 30px #ffffff, 0 0 60px #00d4ff;
          }
        }
        
        .hud-subtitle {
          font-size: 0.9rem;
          color: #00d4ff;
          margin: 10px 0 30px 0;
          opacity: 0.8;
          letter-spacing: 3px;
        }
        
        .hud-button {
          position: relative;
          display: inline-block;
          padding: 15px 30px;
          background: linear-gradient(135deg, #0066cc 0%, #00d4ff 100%);
          color: #ffffff;
          text-decoration: none;
          border: 2px solid #00d4ff;
          font-size: 1.1rem;
          font-weight: bold;
          letter-spacing: 1px;
          transition: all 0.3s ease;
          overflow: hidden;
        }
        
        .button-text {
          position: relative;
          z-index: 2;
        }
        
        .button-glow {
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          transition: left 0.5s ease;
        }
        
        .hud-button:hover {
          box-shadow: 0 0 30px rgba(0, 212, 255, 0.6);
          transform: translateY(-2px);
        }
        
        .hud-button:hover .button-glow {
          left: 100%;
        }
        
        .hud-bottom-bar {
          position: absolute;
          bottom: 30px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          align-items: center;
          gap: 20px;
        }
        
        .hud-progress-bar {
          width: 200px;
          height: 3px;
          background: rgba(0, 212, 255, 0.3);
          border-radius: 2px;
          overflow: hidden;
        }
        
        .hud-progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #00d4ff, #0099ff);
          width: 75%;
          animation: progress-pulse 2s ease-in-out infinite;
        }
        
        @keyframes progress-pulse {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 1; }
        }
        
        .hud-bottom-text {
          font-size: 0.8rem;
          color: #00d4ff;
          opacity: 0.7;
        }
        
        .falling-character {
          position: absolute;
          top: -5%;
          color: rgba(0, 212, 255, 0.3);
          font-size: 14px;
          opacity: 0.4;
          animation: fall linear infinite;
          pointer-events: none;
        }
        
        @keyframes fall {
          to {
            transform: translateY(110vh);
          }
        }
        
        /* Mobile Responsiveness */
        @media (max-width: 768px) {
          .snowai-title {
            font-size: 2.5rem;
          }
          
          .orb-3d {
            width: 80px;
            height: 80px;
          }
          
          .orb-glow {
            width: 100px;
            height: 100px;
            top: -10px;
            left: -10px;
          }
          
          .hud-side-panel {
            display: none;
          }
          
          .hud-corner {
            width: 40px;
            height: 40px;
          }
          
          .hud-button {
            padding: 12px 24px;
            font-size: 1rem;
          }
          
          .hud-progress-bar {
            width: 150px;
          }
          
          .hud-subtitle {
            font-size: 0.7rem;
            letter-spacing: 2px;
          }
        }
        
        @media (max-width: 480px) {
          .snowai-title {
            font-size: 2rem;
          }
          
          .orb-3d {
            width: 60px;
            height: 60px;
          }
          
          .orb-glow {
            width: 80px;
            height: 80px;
            top: -10px;
            left: -10px;
          }
          
          .hud-corner {
            width: 30px;
            height: 30px;
          }
          
          .hud-button {
            padding: 10px 20px;
            font-size: 0.9rem;
          }
          
          .hud-progress-bar {
            width: 120px;
          }
          
          .hud-subtitle {
            font-size: 0.6rem;
            letter-spacing: 1px;
          }
        }
      `}</style>
    </div>
  );
}