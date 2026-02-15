import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
// Fixing imports by adding .js extension which is required in this environment
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

// --- Helper: Load Scripts Dynamically ---
const loadScript = (src) => {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = src;
    script.crossOrigin = 'anonymous';
    script.onload = resolve;
    script.onerror = reject;
    document.body.appendChild(script);
  });
};

const DomainExpansion = () => {
  // --- Refs ---
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const requestRef = useRef(null);
  const threeState = useRef({
    scene: null, camera: null, renderer: null, composer: null,
    particles: null, bloomPass: null,
    targetPositions: null, targetColors: null, targetSizes: null,
    currentTech: 'neutral', shakeIntensity: 0
  });

  // --- State ---
  const [techName, setTechName] = useState('CURSED ENERGY');
  const [techId, setTechId] = useState('neutral');
  const [loading, setLoading] = useState(true);

  // --- Constants ---
  const COUNT = 20000;

  // --- Particle Formations (Pure Logic) ---
  const getRed = (i) => {
    if (i < COUNT * 0.1) {
      const r = Math.random() * 9;
      const theta = Math.random() * 6.28;
      const phi = Math.acos(2 * Math.random() - 1);
      return { x: r * Math.sin(phi) * Math.cos(theta), y: r * Math.sin(phi) * Math.sin(theta), z: r * Math.cos(phi), r: 3, g: 0.1, b: 0.1, s: 2.5 };
    } else {
      const armCount = 3;
      const t = (i / COUNT);
      const angle = t * 15 + ((i % armCount) * (Math.PI * 2 / armCount));
      const radius = 2 + (t * 40);
      return { x: radius * Math.cos(angle), y: radius * Math.sin(angle), z: (Math.random() - 0.5) * (10 * t), r: 0.8, g: 0, b: 0, s: 1.0 };
    }
  };

  const getVoid = (i) => {
    if (i < COUNT * 0.15) {
      const angle = Math.random() * Math.PI * 2;
      return { x: 26 * Math.cos(angle), y: 26 * Math.sin(angle), z: (Math.random() - 0.5) * 1, r: 1, g: 1, b: 1, s: 2.5 };
    } else {
      const radius = 30 + Math.random() * 90;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      return { x: radius * Math.sin(phi) * Math.cos(theta), y: radius * Math.sin(phi) * Math.sin(theta), z: radius * Math.cos(phi), r: 0.1, g: 0.6, b: 1.0, s: 0.7 };
    }
  };

  const getPurple = (i) => {
    if (Math.random() > 0.8) return { x: (Math.random() - 0.5) * 100, y: (Math.random() - 0.5) * 100, z: (Math.random() - 0.5) * 100, r: 0.5, g: 0.5, b: 0.7, s: 0.8 };
    const r = 20;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    return { x: r * Math.sin(phi) * Math.cos(theta), y: r * Math.sin(phi) * Math.sin(theta), z: r * Math.cos(phi), r: 0.6, g: 0.5, b: 1.0, s: 2.5 };
  };

  const getShrine = (i) => {
    const total = COUNT;
    if (i < total * 0.3) return { x: (Math.random() - 0.5) * 80, y: -15, z: (Math.random() - 0.5) * 80, r: 0.4, g: 0, b: 0, s: 0.8 };
    else if (i < total * 0.4) {
      const px = ((i % 4) < 2 ? 1 : -1) * 12;
      const pz = ((i % 4) % 2 === 0 ? 1 : -1) * 8;
      return { x: px + (Math.random() - 0.5) * 2, y: -15 + Math.random() * 30, z: pz + (Math.random() - 0.5) * 2, r: 0.2, g: 0.2, b: 0.2, s: 0.6 };
    } else if (i < total * 0.6) {
      const t = Math.random() * Math.PI * 2;
      const rad = Math.random() * 30;
      const curve = Math.pow(rad / 30, 2) * 10;
      return { x: rad * Math.cos(t), y: 15 - curve + (Math.random() * 2), z: rad * Math.sin(t) * 0.6, r: 0.6, g: 0, b: 0, s: 0.6 };
    } else return { x: 0, y: 0, z: 0, r: 0, g: 0, b: 0, s: 0 };
  };

  // --- Logic: Update Particle Targets ---
  const updateTechnique = (tech) => {
    const state = threeState.current;
    if (state.currentTech === tech) return;

    state.currentTech = tech;
    setTechId(tech);

    // Update UI Text
    let label = "CURSED ENERGY";
    let bloomStrength = 1.0;

    if (tech === 'shrine') { label = "Domain Expansion: Malevolent Shrine"; bloomStrength = 2.5; }
    else if (tech === 'purple') { label = "Secret Technique: Hollow Purple"; bloomStrength = 4.0; }
    else if (tech === 'void') { label = "Domain Expansion: Infinite Void"; bloomStrength = 2.0; }
    else if (tech === 'red') { label = "Reverse Cursed Technique: Red"; bloomStrength = 2.5; }
    else { label = "Neutral State"; bloomStrength = 1.0; }

    setTechName(label);
    if (state.bloomPass) state.bloomPass.strength = bloomStrength;
    state.shakeIntensity = tech !== 'neutral' ? 0.4 : 0;

    // Recalculate positions
    for (let i = 0; i < COUNT; i++) {
      let p;
      if (tech === 'neutral') {
        if (i < COUNT * 0.05) {
          const r = 15 + Math.random() * 20; const t = Math.random() * 6.28; const ph = Math.random() * 3.14;
          p = { x: r * Math.sin(ph) * Math.cos(t), y: r * Math.sin(ph) * Math.sin(t), z: r * Math.cos(ph), r: 0.1, g: 0.1, b: 0.2, s: 0.4 };
        } else p = { x: 0, y: 0, z: 0, r: 0, g: 0, b: 0, s: 0 };
      }
      else if (tech === 'red') p = getRed(i);
      else if (tech === 'void') p = getVoid(i);
      else if (tech === 'purple') p = getPurple(i);
      else if (tech === 'shrine') p = getShrine(i);

      state.targetPositions[i * 3] = p.x;
      state.targetPositions[i * 3 + 1] = p.y;
      state.targetPositions[i * 3 + 2] = p.z;
      
      state.targetColors[i * 3] = p.r;
      state.targetColors[i * 3 + 1] = p.g;
      state.targetColors[i * 3 + 2] = p.b;
      
      state.targetSizes[i] = p.s;
    }
  };

  // --- Initialization ---
  useEffect(() => {
    // 1. Initialize Three.js
    const initThree = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
      camera.position.z = 55;

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      
      if (containerRef.current) {
        containerRef.current.appendChild(renderer.domElement);
      }

      // Post Processing
      const composer = new EffectComposer(renderer);
      composer.addPass(new RenderPass(scene, camera));
      const bloomPass = new UnrealBloomPass(new THREE.Vector2(width, height), 1.5, 0.4, 0.85);
      composer.addPass(bloomPass);

      // Particles
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(COUNT * 3);
      const colors = new Float32Array(COUNT * 3);
      const sizes = new Float32Array(COUNT);

      const targetPositions = new Float32Array(COUNT * 3);
      const targetColors = new Float32Array(COUNT * 3);
      const targetSizes = new Float32Array(COUNT);

      // Initial Random Positions
      for(let i=0; i<COUNT*3; i++) {
          positions[i] = (Math.random()-0.5)*100;
          colors[i] = 0;
          if(i<COUNT) sizes[i] = 0;
      }

      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

      const material = new THREE.PointsMaterial({ 
        size: 0.3, 
        vertexColors: true, 
        blending: THREE.AdditiveBlending, 
        transparent: true, 
        depthWrite: false 
      });

      const particles = new THREE.Points(geometry, material);
      scene.add(particles);

      // Save to ref
      threeState.current = {
        scene, camera, renderer, composer, particles, bloomPass,
        targetPositions, targetColors, targetSizes,
        currentTech: 'neutral', shakeIntensity: 0
      };

      // Initial Technique
      updateTechnique('neutral');
    };

    // 2. Initialize MediaPipe
    const initAI = async () => {
      await Promise.all([
        loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js'),
        loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js'),
        loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js'),
      ]);

      const videoElement = videoRef.current;
      const canvasElement = canvasRef.current;
      const canvasCtx = canvasElement.getContext('2d');

      const hands = new window.Hands({locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`});
      hands.setOptions({ maxNumHands: 2, modelComplexity: 1, minDetectionConfidence: 0.7 });

      hands.onResults((results) => {
        canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
        let detected = 'neutral';
        let glowColor = '#00ffff';
        const currentTech = threeState.current.currentTech;
        
        // Color mapping for UI drawing
        if (currentTech === 'shrine') glowColor = '#ff0000';
        else if (currentTech === 'purple') glowColor = '#bb00ff';
        else if (currentTech === 'red') glowColor = '#ff3333';
        
        if (results.multiHandLandmarks) {
            results.multiHandLandmarks.forEach((lm) => {
                window.drawConnectors(canvasCtx, lm, window.HAND_CONNECTIONS, {color: glowColor, lineWidth: 5});
                window.drawLandmarks(canvasCtx, lm, {color: '#fff', lineWidth: 1, radius: 2});

                const isUp = (t, p) => lm[t].y < lm[p].y;
                // Simple Euclidean distance between thumb tip and index tip
                const pinch = Math.hypot(lm[8].x - lm[4].x, lm[8].y - lm[4].y);
                
                if (pinch < 0.04) detected = 'purple';
                else if (isUp(8,6) && isUp(12,10) && isUp(16,14) && isUp(20,18)) detected = 'shrine';
                else if (isUp(8,6) && isUp(12,10) && !isUp(16,14)) detected = 'void';
                else if (isUp(8,6) && !isUp(12,10)) detected = 'red';
            });
        }
        updateTechnique(detected);
      });

      const camera = new window.Camera(videoElement, {
        onFrame: async () => {
            if(videoElement && canvasElement) {
                // Keep internal resolution consistent
                canvasElement.width = videoElement.videoWidth || 640;
                canvasElement.height = videoElement.videoHeight || 480;
                await hands.send({image: videoElement});
            }
        }, 
        width: 640, 
        height: 480
      });
      
      camera.start();
      setLoading(false);
    };

    initThree();
    initAI();

    // 3. Animation Loop
    const animate = () => {
      const state = threeState.current;
      if (!state.renderer) return;

      requestRef.current = requestAnimationFrame(animate);

      // Camera Shake
      if (state.shakeIntensity > 0 && containerRef.current) {
         const dx = (Math.random()-0.5) * state.shakeIntensity * 40;
         const dy = (Math.random()-0.5) * state.shakeIntensity * 40;
         state.renderer.domElement.style.transform = `translate(${dx}px, ${dy}px)`;
      } else if (state.renderer.domElement) {
         state.renderer.domElement.style.transform = 'translate(0,0)';
      }

      // Particle interpolation
      const pos = state.particles.geometry.attributes.position.array;
      const col = state.particles.geometry.attributes.color.array;
      const siz = state.particles.geometry.attributes.size.array;

      for(let i=0; i<COUNT*3; i++) {
        pos[i] += (state.targetPositions[i] - pos[i]) * 0.1;
        col[i] += (state.targetColors[i] - col[i]) * 0.1;
      }
      for(let i=0; i<COUNT; i++) {
        siz[i] += (state.targetSizes[i] - siz[i]) * 0.1;
      }

      state.particles.geometry.attributes.position.needsUpdate = true;
      state.particles.geometry.attributes.color.needsUpdate = true;
      state.particles.geometry.attributes.size.needsUpdate = true;

      // Rotations
      if(state.currentTech === 'red') {
        state.particles.rotation.z -= 0.1;
      } else if (state.currentTech === 'purple') {
        state.particles.rotation.z += 0.2; 
        state.particles.rotation.y += 0.05;
      } else if (state.currentTech === 'shrine') {
        state.particles.rotation.set(0, 0, 0); 
      } else {
        state.particles.rotation.y += 0.005;
      }

      state.composer.render();
    };
    animate();

    const handleResize = () => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        const state = threeState.current;
        if(state.camera) {
            state.camera.aspect = width / height;
            state.camera.updateProjectionMatrix();
        }
        if(state.renderer) state.renderer.setSize(width, height);
        if(state.composer) state.composer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    return () => {
        window.removeEventListener('resize', handleResize);
        if(requestRef.current) cancelAnimationFrame(requestRef.current);
        // Cleanup Three.js
        if(threeState.current.renderer) {
            threeState.current.renderer.dispose();
            if(containerRef.current) containerRef.current.innerHTML = '';
        }
        // Note: MediaPipe camera cleanup is tricky without ref to the camera instance directly, 
        // but removing the component usually stops the video stream eventually.
    };
  }, []);

  // --- Dynamic Color Styles for UI ---
  const getTechColor = () => {
    switch(techId) {
        case 'shrine': return '#ff0000';
        case 'purple': return '#bb00ff';
        case 'red': return '#ff3333';
        case 'void': return '#00ffff';
        default: return '#00ffff';
    }
  };

  const techColor = getTechColor();

  return (
    <div style={styles.body}>
        {/* Global Styles for Keyframes & Resets */}
        <style>
        {`
            body { margin: 0; background-color: #000; overflow: hidden; }
            @keyframes pulse { 0% { opacity: 0.8; } 50% { opacity: 0.4; } 100% { opacity: 0.8; } }
        `}
        </style>

        {/* SVG Grain Filter */}
        <div style={styles.grain}></div>

        {/* 3D Background */}
        <div ref={containerRef} style={styles.threeContainer}></div>

        {/* UI Overlay */}
        <div style={styles.ui}>
            <h1 style={styles.h1}>呪術廻戦</h1>
            <div style={{...styles.techniqueName, color: techColor, textShadow: `0 0 10px ${techColor}80`}}>
                {techName}
            </div>
            {loading && <div style={styles.loading}>INITIALIZING CURSED ENERGY...</div>}
        </div>

        {/* Camera Hub */}
        <div style={styles.videoContainer}>
            <video ref={videoRef} className="input_video" style={styles.video} playsInline muted></video>
            <canvas ref={canvasRef} id="output_canvas" style={styles.canvas}></canvas>
        </div>
    </div>
  );
};

// --- Styles Object ---
const styles = {
    body: {
        margin: 0,
        overflow: 'hidden',
        backgroundColor: '#000',
        fontFamily: "'Courier New', sans-serif",
        width: '100vw',
        height: '100vh',
        position: 'relative',
    },
    threeContainer: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1,
    },
    grain: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 5,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.08'/%3E%3C/svg%3E")`,
    },
    ui: {
        position: 'absolute',
        top: '10%',
        width: '100%',
        textAlign: 'center',
        color: '#fff',
        pointerEvents: 'none',
        zIndex: 10,
    },
    h1: {
        fontSize: '3rem',
        margin: 0,
        letterSpacing: '10px',
        fontWeight: 900,
        textShadow: '0 0 20px rgba(0, 0, 0, 0.3)',
        background: 'linear-gradient(to bottom, #fff, #888)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
    },
    techniqueName: {
        fontSize: '1.2rem',
        marginTop: '15px',
        fontWeight: 'bold',
        letterSpacing: '4px',
        textTransform: 'uppercase',
        transition: 'color 0.3s ease, text-shadow 0.3s ease',
    },
    videoContainer: {
        position: 'absolute',
        bottom: '2%',
        left: '18%',
        transform: 'translateX(-50%) scaleX(-1)', // Mirrored view
        width: '85vw',
        maxWidth: '450px',
        height: '42vh',
        border: '2px solid rgba(255, 255, 255, 0.2)',
        zIndex: 20,
        backgroundColor: '#000',
        borderRadius: '25px',
        overflow: 'hidden',
        boxShadow: '0 0 40px rgba(0,0,0,0.9)',
    },
    video: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        opacity: 0.8,
        display: 'block', // Ensures no extra space below video
    },
    canvas: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
    },
    loading: {
        marginTop: '20px',
        fontSize: '0.8rem',
        color: '#888',
        animation: 'pulse 1.5s infinite',
    }
};

export default DomainExpansion;
