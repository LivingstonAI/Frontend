import React, { useEffect, useRef } from "react";

export default function HolographicInterface() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;

    const handleMouseMove = (e) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 20;
      const y = (e.clientY / innerHeight - 0.5) * 20;
      container.style.transform = `rotateX(${y}deg) rotateY(${x}deg)`;
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div className="holo-background">
      <div className="holographic-container" ref={containerRef}>
        <div className="hologram">
          <div className="energy-stream"></div>
          <div className="floating-fragment fragment1"></div>
          <div className="floating-fragment fragment2"></div>
          <div className="floating-fragment fragment3"></div>
        </div>
      </div>
    </div>
  );
}
