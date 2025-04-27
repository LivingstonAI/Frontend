import React, { useEffect, useRef } from "react";
import Header from "./header";
import SideNavs from "./side_navs";

export default function Art() {
  const baseUrl = 'https://backend-production-c0ab.up.railway.app';
  const animationRef = useRef(null);
  
  useEffect(() => {
    const interval = setInterval(() => {
      if (animationRef.current) {
        const particles = animationRef.current.querySelectorAll('.particle');
        particles.forEach(particle => {
          const rotation = Math.random() * 360;
          const scale = 0.8 + Math.random() * 0.4;
          particle.style.transform = `rotate(${rotation}deg) scale(${scale})`;
          particle.style.opacity = 0.5 + Math.random() * 0.5;
        });
      }
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <div className="header">
        <Header />
      </div>
      <div className="main-page-body">
        <SideNavs />
        <div className="main-body-info">
          <div className="hologram-container flex items-center justify-center h-screen">
            <div 
              ref={animationRef}
              className="relative w-96 h-96"
            >
              {/* Core */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 rounded-full bg-blue-400 animate-pulse opacity-70 shadow-lg shadow-blue-500/50"></div>
              </div>
              
              {/* Inner rings */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-48 h-48 border-4 border-blue-300 rounded-full opacity-30 animate-spin" style={{ animationDuration: '15s' }}></div>
              </div>
              
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-64 h-64 border-2 border-blue-200 rounded-full opacity-20 animate-spin" style={{ animationDuration: '20s', animationDirection: 'reverse' }}></div>
              </div>
              
              {/* Outer ring with jagged edges */}
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-full h-full animate-spin" style={{ animationDuration: '30s' }} viewBox="0 0 400 400">
                  <path 
                    d="M200,20 
                      Q230,50 260,30 
                      Q300,10 330,50 
                      Q360,90 370,150 
                      Q380,210 350,260 
                      Q320,310 270,340 
                      Q220,370 160,350 
                      Q100,330 60,290 
                      Q20,250 30,180 
                      Q40,110 90,60 
                      Q140,10 200,20" 
                    fill="none" 
                    stroke="#60a5fa" 
                    strokeWidth="2" 
                    strokeDasharray="5,5" 
                    className="animate-pulse"
                  />
                </svg>
              </div>
              
              {/* Particles */}
              {[...Array(12)].map((_, i) => (
                <div 
                  key={i}
                  className="particle absolute w-2 h-2 bg-blue-300 rounded-full" 
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    boxShadow: '0 0 8px 2px rgba(96, 165, 250, 0.8)',
                    transition: 'all 2s ease'
                  }}
                />
              ))}
              
              {/* Neural network-like structures */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 400">
                {[...Array(15)].map((_, i) => {
                  const x1 = 200 + (Math.random() - 0.5) * 160;
                  const y1 = 200 + (Math.random() - 0.5) * 160;
                  const x2 = 200 + (Math.random() - 0.5) * 320;
                  const y2 = 200 + (Math.random() - 0.5) * 320;
                  
                  return (
                    <g key={i}>
                      <line 
                        x1={x1} y1={y1} 
                        x2={x2} y2={y2} 
                        stroke="#60a5fa" 
                        strokeWidth="1"
                        strokeOpacity="0.4"
                      />
                      <circle 
                        cx={x2} cy={y2} r="3" 
                        fill="#93c5fd" 
                        className="animate-ping"
                        style={{ animationDuration: `${2 + Math.random() * 3}s` }}
                      />
                    </g>
                  );
                })}
              </svg>
              
              {/* Energy flares */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-40 h-40 bg-blue-400 rounded-full opacity-10 animate-pulse" style={{ filter: 'blur(30px)' }}></div>
              </div>
              
              {/* Orange accents like in the image */}
              <div className="absolute right-0 top-0 w-24 h-24">
                <svg viewBox="0 0 100 100">
                  <path 
                    d="M80,20 Q90,40 70,60 Q50,80 20,70" 
                    fill="none" 
                    stroke="rgba(251, 146, 60, 0.7)" 
                    strokeWidth="2"
                  />
                  {[...Array(5)].map((_, i) => (
                    <circle 
                      key={i}
                      cx={70 - i*10} 
                      cy={30 + i*10} 
                      r="2" 
                      fill="rgba(251, 146, 60, 0.8)"
                      className="animate-ping" 
                      style={{ animationDuration: `${1 + Math.random() * 2}s` }}
                    />
                  ))}
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}