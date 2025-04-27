import React, { useEffect, useRef } from "react";

export default function Art() {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let particles = [];
    let orbitals = [];
    let time = 0;
    
    // Set canvas dimensions
    const setCanvasDimensions = () => {
      canvas.width = window.innerWidth * 0.7;
      canvas.height = window.innerHeight * 0.7;
    };
    
    setCanvasDimensions();
    window.addEventListener("resize", setCanvasDimensions);
    
    // Create particles
    const createParticles = () => {
      particles = [];
      const numParticles = 150;
      
      for (let i = 0; i < numParticles; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 1,
          speed: Math.random() * 1 + 0.5,
          angle: Math.random() * Math.PI * 2,
          opacity: Math.random() * 0.5 + 0.3,
          color: `rgba(50, 180, 255, ${Math.random() * 0.5 + 0.3})`,
        });
      }
    };
    
    // Create orbital paths
    const createOrbitals = () => {
      orbitals = [];
      const numOrbitals = 5;
      
      for (let i = 0; i < numOrbitals; i++) {
        const radius = (canvas.height / 3) * (0.5 + i * 0.1);
        const points = 8 + Math.floor(Math.random() * 5);
        const pathVariance = 0.2 + Math.random() * 0.3;  // Renamed to pathVariance to avoid conflict
        const angleOffset = Math.random() * Math.PI * 2;
        const rotationSpeed = (Math.random() * 0.0007 + 0.0003) * (Math.random() > 0.5 ? 1 : -1);
        
        orbitals.push({
          radius,
          points,
          pathVariance,  // Using the renamed variable
          angleOffset,
          rotationSpeed,
          nodes: [],
          color: `rgba(${50 + i * 20}, ${150 + i * 20}, 255, ${0.4 + i * 0.1})`,
          thickness: 1.5 + Math.random(),
        });
        
        // Create nodes along the orbital path
        for (let j = 0; j < points; j++) {
          const angle = (j / points) * Math.PI * 2 + angleOffset;
          const nodeVariance = 1 - (Math.random() * pathVariance * 2 - pathVariance);  // Using pathVariance
          
          orbitals[i].nodes.push({
            angle,
            variance: nodeVariance,  // Storing as variance
            pulseSpeed: Math.random() * 0.03 + 0.01,
            pulseOffset: Math.random() * Math.PI * 2,
          });
        }
      }
    };
    
    // Animation loop
    const animate = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      
      // Draw central core
      const coreRadius = canvas.height / 12;
      const coreGradient = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, coreRadius * 1.5
      );
      coreGradient.addColorStop(0, "rgba(200, 240, 255, 0.8)");
      coreGradient.addColorStop(0.5, "rgba(50, 180, 255, 0.4)");
      coreGradient.addColorStop(1, "rgba(30, 100, 200, 0)");
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, coreRadius, 0, Math.PI * 2);
      ctx.fillStyle = coreGradient;
      ctx.fill();
      
      // Draw energy pulses
      ctx.beginPath();
      ctx.arc(centerX, centerY, coreRadius * (1 + Math.sin(time * 2) * 0.2), 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(150, 220, 255, 0.6)";
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Draw orbitals
      orbitals.forEach(orbital => {
        ctx.beginPath();
        
        // Calculate points along the orbital path
        for (let i = 0; i <= 100; i++) {
          const angle = (i / 100) * Math.PI * 2 + time * orbital.rotationSpeed;
          
          // Find closest nodes and interpolate variance
          let totalVariance = 0;
          let totalWeight = 0;
          
          orbital.nodes.forEach(node => {
            let angleDiff = Math.abs(angle - node.angle);
            if (angleDiff > Math.PI) angleDiff = Math.PI * 2 - angleDiff;
            
            const weight = Math.max(0, 1 - (angleDiff / (Math.PI / 2)));
            totalWeight += weight;
            totalVariance += node.variance * weight * (1 + Math.sin(time * node.pulseSpeed + node.pulseOffset) * 0.1);
          });
          
          const currentVariance = totalWeight > 0 ? totalVariance / totalWeight : 1;
          const radius = orbital.radius * currentVariance;
          
          const x = centerX + Math.cos(angle) * radius;
          const y = centerY + Math.sin(angle) * radius;
          
          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        
        ctx.closePath();
        ctx.strokeStyle = orbital.color;
        ctx.lineWidth = orbital.thickness;
        ctx.stroke();
        
        // Draw nodes along the orbital
        orbital.nodes.forEach(node => {
          const nodeVariance = node.variance * (1 + Math.sin(time * node.pulseSpeed + node.pulseOffset) * 0.1);
          const radius = orbital.radius * nodeVariance;
          const angle = node.angle + time * orbital.rotationSpeed;
          
          const x = centerX + Math.cos(angle) * radius;
          const y = centerY + Math.sin(angle) * radius;
          
          ctx.beginPath();
          ctx.arc(x, y, 2 + Math.sin(time * 2 + node.pulseOffset) * 1, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(150, 220, 255, 0.8)";
          ctx.fill();
        });
      });
      
      // Update and draw particles
      particles.forEach(particle => {
        // Move particles
        particle.x += Math.cos(particle.angle) * particle.speed;
        particle.y += Math.sin(particle.angle) * particle.speed;
        
        // Wrap around canvas
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;
        
        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();
      });
      
      // Draw connection lines between nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 50) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(100, 200, 255, ${(1 - distance / 50) * 0.2})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      
      // Draw outer glow
      const outerGlow = ctx.createRadialGradient(
        centerX, centerY, coreRadius * 2,
        centerX, centerY, canvas.height / 2
      );
      outerGlow.addColorStop(0, "rgba(50, 150, 255, 0.1)");
      outerGlow.addColorStop(1, "rgba(50, 150, 255, 0)");
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, canvas.height / 2, 0, Math.PI * 2);
      ctx.fillStyle = outerGlow;
      ctx.fill();
      
      // Increment time
      time += 0.01;
      
      requestAnimationFrame(animate);
    };
    
    createParticles();
    createOrbitals();
    animate();
    
    return () => {
      window.removeEventListener("resize", setCanvasDimensions);
    };
  }, []);
  
  return (
    <div className="flex flex-col items-center justify-center w-full h-full bg-gray-900">
      <div className="relative">
        <canvas 
          ref={canvasRef} 
          className="shadow-lg rounded-lg"
          style={{
            background: "linear-gradient(to bottom, #0a192f, #051025)",
            boxShadow: "0 0 30px rgba(50, 150, 255, 0.3)"
          }}
        />
        <div className="absolute top-2 left-2 text-xs text-blue-300 bg-blue-900 bg-opacity-50 px-2 py-1 rounded-md">
          4K ULTRA HD
        </div>
      </div>
    </div>
  );
}