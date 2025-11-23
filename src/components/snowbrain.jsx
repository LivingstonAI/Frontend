import React, { useState, useEffect } from 'react';

const HolographicHUD = () => {
  const [time, setTime] = useState(new Date());
  const [dataPoints, setDataPoints] = useState([]);
  const [systemStatus, setSystemStatus] = useState('ONLINE');

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Generate random data points for visualization
    const generateDataPoints = () => {
      return Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        intensity: Math.random()
      }));
    };

    setDataPoints(generateDataPoints());
    const dataTimer = setInterval(() => {
      setDataPoints(generateDataPoints());
    }, 3000);

    return () => clearInterval(dataTimer);
  }, []);

  const styles = `
    @keyframes pulse {
      0%, 100% { opacity: 0.3; transform: scale(1); }
      50% { opacity: 1; transform: scale(1.05); }
    }

    @keyframes rotate {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-10px); }
    }

    @keyframes ripple {
      0% { transform: scale(0); opacity: 1; }
      100% { transform: scale(4); opacity: 0; }
    }

    @keyframes dataFlow {
      0% { transform: translateX(-100px); opacity: 0; }
      10% { opacity: 1; }
      90% { opacity: 1; }
      100% { transform: translateX(100px); opacity: 0; }
    }

    @keyframes scanLine {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100vw); }
    }

    .hud-container {
      position: relative;
      width: 100vw;
      height: 100vh;
      background: radial-gradient(ellipse at center, #0a0a1a 0%, #000000 100%);
      overflow: hidden;
      font-family: 'Courier New', monospace;
      color: #00d4ff;
    }

    .background-grid {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-image: 
        linear-gradient(rgba(0, 212, 255, 0.1) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0, 212, 255, 0.1) 1px, transparent 1px);
      background-size: 50px 50px;
      animation: float 4s ease-in-out infinite;
    }

    .scan-line {
      position: absolute;
      top: 0;
      left: -100px;
      width: 2px;
      height: 100%;
      background: linear-gradient(to bottom, transparent, #00d4ff, transparent);
      animation: scanLine 8s linear infinite;
      box-shadow: 0 0 20px #00d4ff;
    }

    .central-orb {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 200px;
      height: 200px;
      border: 2px solid #00d4ff;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(0, 212, 255, 0.1) 0%, transparent 70%);
      animation: pulse 2s ease-in-out infinite;
      box-shadow: 
        0 0 50px rgba(0, 212, 255, 0.5),
        inset 0 0 50px rgba(0, 212, 255, 0.1);
    }

    .orb-rings {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }

    .ring {
      position: absolute;
      border: 1px solid rgba(0, 212, 255, 0.3);
      border-radius: 50%;
      transform-origin: center;
    }

    .ring-1 {
      width: 150px;
      height: 150px;
      margin: -75px 0 0 -75px;
      animation: rotate 10s linear infinite;
      border-style: dashed;
    }

    .ring-2 {
      width: 250px;
      height: 250px;
      margin: -125px 0 0 -125px;
      animation: rotate 15s linear infinite reverse;
    }

    .ring-3 {
      width: 350px;
      height: 350px;
      margin: -175px 0 0 -175px;
      animation: rotate 20s linear infinite;
      border-style: dotted;
    }

    .corner-frame {
      position: absolute;
      width: 60px;
      height: 60px;
      border: 2px solid #00d4ff;
      box-shadow: 0 0 20px rgba(0, 212, 255, 0.3);
    }

    .corner-tl {
      top: 20px;
      left: 20px;
      border-right: none;
      border-bottom: none;
    }

    .corner-tr {
      top: 20px;
      right: 20px;
      border-left: none;
      border-bottom: none;
    }

    .corner-bl {
      bottom: 20px;
      left: 20px;
      border-right: none;
      border-top: none;
    }

    .corner-br {
      bottom: 20px;
      right: 20px;
      border-left: none;
      border-top: none;
    }

    .hud-panel {
      position: absolute;
      background: rgba(0, 20, 40, 0.8);
      border: 1px solid #00d4ff;
      padding: 15px;
      backdrop-filter: blur(10px);
      box-shadow: 0 0 30px rgba(0, 212, 255, 0.2);
    }

    .panel-top-left {
      top: 100px;
      left: 30px;
      width: 200px;
    }

    .panel-top-right {
      top: 100px;
      right: 30px;
      width: 200px;
    }

    .panel-bottom-left {
      bottom: 100px;
      left: 30px;
      width: 250px;
    }

    .panel-bottom-right {
      bottom: 100px;
      right: 30px;
      width: 200px;
    }

    .data-stream {
      font-size: 10px;
      line-height: 1.2;
      opacity: 0.7;
      animation: dataFlow 4s ease-in-out infinite;
    }

    .status-indicator {
      display: inline-block;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #00d4ff;
      margin-right: 8px;
      animation: pulse 1s ease-in-out infinite;
      box-shadow: 0 0 10px #00d4ff;
    }

    .data-points {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
    }

    .data-point {
      position: absolute;
      width: 4px;
      height: 4px;
      background: #00d4ff;
      border-radius: 50%;
      animation: pulse 2s ease-in-out infinite;
      box-shadow: 0 0 10px #00d4ff;
    }

    .hologram-text {
      font-size: 12px;
      text-shadow: 0 0 10px #00d4ff;
      letter-spacing: 1px;
      text-transform: uppercase;
    }

    .progress-bar {
      width: 100%;
      height: 4px;
      background: rgba(0, 212, 255, 0.2);
      border-radius: 2px;
      overflow: hidden;
      margin: 10px 0;
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #00d4ff, #0099cc);
      border-radius: 2px;
      animation: dataFlow 3s ease-in-out infinite;
      box-shadow: 0 0 10px #00d4ff;
    }
  `;

  return (
    <div className="hud-container">
      <style>{styles}</style>
      
      {/* Background Elements */}
      <div className="background-grid"></div>
      <div className="scan-line"></div>
      
      {/* Corner Frames */}
      <div className="corner-frame corner-tl"></div>
      <div className="corner-frame corner-tr"></div>
      <div className="corner-frame corner-bl"></div>
      <div className="corner-frame corner-br"></div>
      
      {/* Central Orb */}
      <div className="central-orb"></div>
      
      {/* Rotating Rings */}
      <div className="orb-rings">
        <div className="ring ring-1"></div>
        <div className="ring ring-2"></div>
        <div className="ring ring-3"></div>
      </div>
      
      {/* Data Points */}
      <div className="data-points">
        {dataPoints.map(point => (
          <div
            key={point.id}
            className="data-point"
            style={{
              left: `${point.x}%`,
              top: `${point.y}%`,
              opacity: point.intensity,
              animationDelay: `${point.id * 0.1}s`
            }}
          ></div>
        ))}
      </div>
      
      {/* HUD Panels */}
      <div className="hud-panel panel-top-left">
        <div className="hologram-text">
          <div><span className="status-indicator"></span>SYSTEM STATUS</div>
          <div style={{margin: '10px 0'}}>{systemStatus}</div>
          <div className="progress-bar">
            <div className="progress-fill" style={{width: '75%'}}></div>
          </div>
        </div>
      </div>
      
      <div className="hud-panel panel-top-right">
        <div className="hologram-text">
          <div>TEMPORAL SYNC</div>
          <div style={{margin: '10px 0'}}>{time.toLocaleTimeString()}</div>
          <div style={{fontSize: '10px', opacity: 0.6}}>
            {time.toLocaleDateString()}
          </div>
        </div>
      </div>
      
      <div className="hud-panel panel-bottom-left">
        <div className="hologram-text">
          <div>DATA STREAM</div>
          <div className="data-stream" style={{marginTop: '10px'}}>
            {Array.from({ length: 8 }, (_, i) => (
              <div key={i} style={{animationDelay: `${i * 0.5}s`}}>
                {Math.random().toString(36).substring(2, 15).toUpperCase()}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="hud-panel panel-bottom-right">
        <div className="hologram-text">
          <div><span className="status-indicator"></span>NEURAL LINK</div>
          <div style={{margin: '10px 0'}}>ACTIVE</div>
          <div style={{fontSize: '10px'}}>
            Signal: 98.7%<br/>
            Bandwidth: 2.4 GHz<br/>
            Latency: 0.02ms
          </div>
        </div>
      </div>
    </div>
  );
};

export default HolographicHUD;