import React, { useEffect, useRef } from "react";

export default function Art() {
  const containerRef = useRef(null);
  
  useEffect(() => {
    // Create and manage dynamic particles
    const container = containerRef.current;
    let particles = [];
    
    const createParticle = () => {
      const particle = document.createElement('div');
      particle.classList.add('particle');
      
      // Random size between 2-6px
      const size = Math.random() * 4 + 2;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      
      // Random position along the circle
      const angle = Math.random() * Math.PI * 2;
      const radius = 100 + (Math.random() * 50 - 25); // Circle with some variance
      const x = Math.cos(angle) * radius + 150;
      const y = Math.sin(angle) * radius + 150;
      
      particle.style.left = `${x}px`;
      particle.style.top = `${y}px`;
      
      // Random animation duration
      const duration = Math.random() * 4 + 3;
      particle.style.animation = `particleMove ${duration}s linear infinite`;
      
      // Random opacity
      particle.style.opacity = Math.random() * 0.7 + 0.3;
      
      container.appendChild(particle);
      particles.push(particle);
      
      return particle;
    };
    
    // Create energy lines
    const createEnergyLine = () => {
      const line = document.createElement('div');
      line.classList.add('energy-line');
      
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 50 + 80;
      const x = Math.cos(angle) * radius + 150;
      const y = Math.sin(angle) * radius + 150;
      
      const length = Math.random() * 40 + 20;
      const rotation = Math.random() * 360;
      
      line.style.left = `${x}px`;
      line.style.top = `${y}px`;
      line.style.width = `${length}px`;
      line.style.transform = `rotate(${rotation}deg)`;
      line.style.animationDelay = `${Math.random() * 2}s`;
      
      container.appendChild(line);
      return line;
    };
    
    // Create initial particles and energy lines
    for (let i = 0; i < 150; i++) {
      createParticle();
    }
    
    for (let i = 0; i < 30; i++) {
      createEnergyLine();
    }
    
    // Animation frame for movement
    const animate = () => {
      particles.forEach(particle => {
        const rect = particle.getBoundingClientRect();
        if (rect.left < 0 || rect.right > window.innerWidth || 
            rect.top < 0 || rect.bottom > window.innerHeight) {
          container.removeChild(particle);
          particles = particles.filter(p => p !== particle);
          particles.push(createParticle());
        }
      });
      
      requestAnimationFrame(animate);
    };
    
    animate();
    
    // Continually create new elements
    const interval = setInterval(() => {
      for (let i = 0; i < 5; i++) {
        createParticle();
      }
      createEnergyLine();
    }, 500);
    
    return () => {
      clearInterval(interval);
      particles = [];
    };
  }, []);
  
  return (
    <div className="holographic-interface">
      <style jsx>{`
        .holographic-interface {
          position: relative;
          width: 300px;
          height: 300px;
          margin: 50px auto;
          perspective: 1000px;
        }
        
        .holographic-interface:before {
          content: '';
          position: absolute;
          width: 200px;
          height: 200px;
          top: 50px;
          left: 50px;
          border-radius: 50%;
          background: rgba(0, 150, 255, 0.1);
          box-shadow: 0 0 30px 10px rgba(0, 150, 255, 0.3);
          animation: pulse 3s infinite alternate;
        }
        
        .core {
          position: absolute;
          top: 125px;
          left: 125px;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: rgba(0, 200, 255, 0.8);
          box-shadow: 0 0 30px 15px rgba(0, 200, 255, 0.6);
          animation: coreGlow 2s infinite alternate;
          z-index: 10;
        }
        
        .inner-ring {
          position: absolute;
          top: 75px;
          left: 75px;
          width: 150px;
          height: 150px;
          border-radius: 50%;
          border: 2px solid rgba(0, 200, 255, 0.6);
          box-shadow: 0 0 20px rgba(0, 200, 255, 0.4);
          animation: rotate 10s linear infinite;
        }
        
        .middle-ring {
          position: absolute;
          top: 60px;
          left: 60px;
          width: 180px;
          height: 180px;
          border-radius: 50%;
          border: 1px dashed rgba(0, 180, 255, 0.5);
          animation: rotate 20s linear infinite reverse;
        }
        
        .outer-ring {
          position: absolute;
          top: 40px;
          left: 40px;
          width: 220px;
          height: 220px;
          border-radius: 50%;
          border: 3px solid rgba(0, 130, 255, 0.4);
          box-shadow: inset 0 0 20px rgba(0, 130, 255, 0.4);
          animation: rotate 30s linear infinite;
        }
        
        .particle {
          position: absolute;
          background: rgba(0, 200, 255, 0.7);
          border-radius: 50%;
          box-shadow: 0 0 5px rgba(0, 200, 255, 0.7);
          opacity: 0.7;
          z-index: 5;
        }
        
        .energy-line {
          position: absolute;
          height: 2px;
          background: linear-gradient(to right, rgba(0, 200, 255, 0), rgba(0, 200, 255, 0.8), rgba(0, 200, 255, 0));
          transform-origin: left center;
          animation: energyPulse 2s infinite alternate;
        }
        
        /* Irregular pattern objects */
        .data-structure {
          position: absolute;
          border: 1px solid rgba(0, 150, 255, 0.6);
          background: rgba(0, 150, 255, 0.1);
          border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
          box-shadow: 0 0 10px rgba(0, 150, 255, 0.3);
          animation: dataFloat 5s infinite alternate;
        }
        
        .ds-0 {
          width: 30px;
          height: 20px;
          top: 60px;
          left: 140px;
          animation-delay: 0s;
        }
        
        .ds-1 {
          width: 40px;
          height: 25px;
          top: 200px;
          left: 160px;
          animation-delay: 0.5s;
        }
        
        .ds-2 {
          width: 20px;
          height: 35px;
          top: 150px;
          left: 70px;
          animation-delay: 1s;
        }
        
        .ds-3 {
          width: 25px;
          height: 25px;
          top: 120px;
          left: 220px;
          animation-delay: 1.5s;
        }
        
        .ds-4 {
          width: 35px;
          height: 20px;
          top: 180px;
          left: 90px;
          animation-delay: 2s;
        }
        
        @keyframes pulse {
          0% { transform: scale(0.95); opacity: 0.7; }
          100% { transform: scale(1.05); opacity: 0.9; }
        }
        
        @keyframes coreGlow {
          0% { box-shadow: 0 0 20px 10px rgba(0, 200, 255, 0.5); }
          100% { box-shadow: 0 0 30px 15px rgba(0, 200, 255, 0.7); }
        }
        
        @keyframes rotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes particleMove {
          0% { transform: scale(1) translate(0, 0); }
          50% { transform: scale(1.2) translate(5px, -5px); }
          100% { transform: scale(1) translate(0, 0); }
        }
        
        @keyframes energyPulse {
          0% { opacity: 0.3; width: 100%; }
          100% { opacity: 0.7; width: 120%; }
        }
        
        @keyframes dataFloat {
          0% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(5px, 5px) rotate(5deg); }
          66% { transform: translate(-5px, 5px) rotate(-5deg); }
          100% { transform: translate(0, 0) rotate(0deg); }
        }
      `}</style>
      
      <div className="core"></div>
      <div className="inner-ring"></div>
      <div className="middle-ring"></div>
      <div className="outer-ring"></div>
      
      {/* Data structures - irregular shapes */}
      <div className="ds-0 data-structure"></div>
      <div className="ds-1 data-structure"></div>
      <div className="ds-2 data-structure"></div>
      <div className="ds-3 data-structure"></div>
      <div className="ds-4 data-structure"></div>
      
      {/* Container for dynamic particles */}
      <div ref={containerRef} className="particles-container"></div>
    </div>
  );
}