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
  const [showManual, setShowManual] = useState(false);

  // --- Constants ---
  const COUNT = 25000;

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

  const getBlue = (i) => {
    // Inward spiraling vortex - opposite of Red
    if (i < COUNT * 0.15) {
      const r = Math.random() * 8;
      const theta = Math.random() * 6.28;
      const phi = Math.acos(2 * Math.random() - 1);
      return { x: r * Math.sin(phi) * Math.cos(theta), y: r * Math.sin(phi) * Math.sin(theta), z: r * Math.cos(phi), r: 0.1, g: 0.3, b: 3.0, s: 3.0 };
    } else {
      const armCount = 5;
      const t = (i / COUNT);
      const angle = -t * 20 + ((i % armCount) * (Math.PI * 2 / armCount)); // Negative = inward
      const radius = 45 - (t * 35); // Starts wide, pulls in
      return { x: radius * Math.cos(angle), y: radius * Math.sin(angle), z: (Math.random() - 0.5) * (15 * (1-t)), r: 0.0, g: 0.2, b: 1.0, s: 0.8 };
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

  const getMahoraga = (i) => {
    if (i < COUNT * 0.4) {
        const angle = (i / (COUNT * 0.4)) * Math.PI * 2;
        const r = 22;
        const noise = (Math.random() - 0.5) * 2; 
        return { x: (r + noise) * Math.cos(angle), y: (r + noise) * Math.sin(angle) + 20, z: noise, r: 1.0, g: 0.85, b: 0.2, s: 1.5 };
    } else if (i < COUNT * 0.7) {
        const spokeIndex = Math.floor((i - COUNT * 0.4) / ((COUNT * 0.3) / 8));
        const progress = Math.random(); 
        const angle = (spokeIndex * (Math.PI * 2 / 8));
        const r = progress * 22;
        return { x: r * Math.cos(angle), y: r * Math.sin(angle) + 20, z: (Math.random()-0.5)*1.5, r: 0.9, g: 0.7, b: 0.1, s: 1.2 };
    } else {
        return { x: (Math.random()-0.5)*70, y: (Math.random()-0.5)*60 + 20, z: (Math.random()-0.5)*60, r: 0.8, g: 0.6, b: 0.0, s: 0.6 };
    }
  };

  const getChimera = (i) => {
    if (i < COUNT * 0.5) {
        const r = Math.random() * 60;
        const angle = Math.random() * Math.PI * 2;
        return { x: r * Math.cos(angle), y: -25 + (Math.random()*2), z: r * Math.sin(angle), r: 0, g: 0.1, b: 0.1, s: 1.5 };
    } else {
        const r = Math.random() * 40;
        const angle = Math.random() * Math.PI * 2;
        const h = -25 + Math.random() * 50;
        return { x: r * Math.cos(angle), y: h, z: r * Math.sin(angle), r: 0.0, g: 0.3, b: 0.25, s: 0.8 + Math.random() };
    }
  };

  const getWorldSlash = (i) => {
    // Chaotic grid of slashing lines
    const gridSize = 8;
    const cellX = Math.floor(Math.random() * gridSize) - gridSize/2;
    const cellY = Math.floor(Math.random() * gridSize) - gridSize/2;
    const cellZ = Math.floor(Math.random() * gridSize) - gridSize/2;
    
    // Create slash lines within cells
    const t = Math.random();
    const slashType = Math.floor(Math.random() * 3); // 3 slash directions
    
    let x, y, z;
    if (slashType === 0) { // Horizontal slash
      x = (cellX + (Math.random()-0.5)) * 12;
      y = (cellY + t) * 12;
      z = (cellZ + (Math.random()-0.5)*0.2) * 12;
    } else if (slashType === 1) { // Vertical slash
      x = (cellX + (Math.random()-0.5)*0.2) * 12;
      y = (cellY + t) * 12;
      z = (cellZ + (Math.random()-0.5)) * 12;
    } else { // Diagonal slash
      x = (cellX + t) * 12;
      y = (cellY + t) * 12;
      z = (cellZ + (Math.random()-0.5)*0.2) * 12;
    }
    
    return { x, y, z, r: 0.9, g: 0.9, b: 0.95, s: 1.5 };
  };

  const getBlackFlash = (i) => {
    // Black core with red lightning crackling outward
    if (i < COUNT * 0.2) {
      // Dense black center
      const r = Math.random() * 5;
      const theta = Math.random() * 6.28;
      const phi = Math.acos(2 * Math.random() - 1);
      return { x: r * Math.sin(phi) * Math.cos(theta), y: r * Math.sin(phi) * Math.sin(theta), z: r * Math.cos(phi), r: 0.05, g: 0.05, b: 0.05, s: 3.0 };
    } else {
      // Red lightning bolts
      const angle = Math.random() * Math.PI * 2;
      const distance = 5 + Math.random() * 45;
      const branchOffset = (Math.random() - 0.5) * 8;
      const x = distance * Math.cos(angle) + branchOffset;
      const y = distance * Math.sin(angle) + branchOffset;
      const z = (Math.random() - 0.5) * 30;
      return { x, y, z, r: 1.0, g: 0.0, b: 0.0, s: 1.2 };
    }
  };

  const getBoogieWoogie = (i) => {
    // Glitchy grid distortion effect
    const progress = i / COUNT;
    const layer = Math.floor(progress * 10);
    const angle = (layer * 0.8 + Math.random() * 0.4) * Math.PI * 2;
    const radius = 15 + (layer * 3);
    
    // Create grid points with random displacement
    const gridX = Math.floor(Math.random() * 6) - 3;
    const gridY = Math.floor(Math.random() * 6) - 3;
    const glitchOffset = (Math.random() - 0.5) * 15 * Math.sin(progress * Math.PI);
    
    const x = radius * Math.cos(angle) + gridX * 8 + glitchOffset;
    const y = radius * Math.sin(angle) + gridY * 8;
    const z = (Math.random() - 0.5) * 20;
    
    return { x, y, z, r: 0.2, g: 0.8, b: 0.9, s: 1.0 };
  };

  const getCursedSpeech = (i) => {
    // Purple sound waves emanating outward in rings
    const ringCount = 12;
    const ringIndex = Math.floor((i / COUNT) * ringCount);
    const particlesPerRing = COUNT / ringCount;
    const angleInRing = ((i % particlesPerRing) / particlesPerRing) * Math.PI * 2;
    
    const radius = 5 + ringIndex * 4;
    const waveHeight = Math.sin(ringIndex * 0.5) * 8;
    
    const x = radius * Math.cos(angleInRing);
    const y = radius * Math.sin(angleInRing) + waveHeight;
    const z = (Math.random() - 0.5) * 3;
    
    // Fade out at edges
    const intensity = 1 - (ringIndex / ringCount) * 0.7;
    
    return { x, y, z, r: 0.6 * intensity, g: 0.2 * intensity, b: 0.8 * intensity, s: 1.5 };
  };

  // --- Logic: Update Particle Targets ---
  const updateTechnique = (tech) => {
    const state = threeState.current;
    if (state.currentTech === tech) return;

    state.currentTech = tech;
    setTechId(tech);

    // Update UI Text & Bloom
    let label = "CURSED ENERGY";
    let bloomStrength = 1.0;

    if (tech === 'shrine') { label = "Domain Expansion: Malevolent Shrine"; bloomStrength = 2.5; }
    else if (tech === 'purple') { label = "Secret Technique: Hollow Purple"; bloomStrength = 4.0; }
    else if (tech === 'void') { label = "Domain Expansion: Infinite Void"; bloomStrength = 2.0; }
    else if (tech === 'red') { label = "Cursed Technique Reversal: Red"; bloomStrength = 2.5; }
    else if (tech === 'blue') { label = "Cursed Technique Lapse: Blue"; bloomStrength = 3.0; }
    else if (tech === 'mahoraga') { label = "Divine General Mahoraga"; bloomStrength = 3.0; }
    else if (tech === 'chimera') { label = "Domain Expansion: Chimera Shadow Garden"; bloomStrength = 1.8; }
    else if (tech === 'worldslash') { label = "World Cutting Slash"; bloomStrength = 3.5; }
    else if (tech === 'blackflash') { label = "Black Flash"; bloomStrength = 4.5; }
    else if (tech === 'boogiewoogie') { label = "Boogie Woogie"; bloomStrength = 2.2; }
    else if (tech === 'cursedspeech') { label = "Cursed Speech"; bloomStrength = 2.8; }
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
      else if (tech === 'blue') p = getBlue(i);
      else if (tech === 'void') p = getVoid(i);
      else if (tech === 'purple') p = getPurple(i);
      else if (tech === 'shrine') p = getShrine(i);
      else if (tech === 'mahoraga') p = getMahoraga(i);
      else if (tech === 'chimera') p = getChimera(i);
      else if (tech === 'worldslash') p = getWorldSlash(i);
      else if (tech === 'blackflash') p = getBlackFlash(i);
      else if (tech === 'boogiewoogie') p = getBoogieWoogie(i);
      else if (tech === 'cursedspeech') p = getCursedSpeech(i);

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
        else if (currentTech === 'blue') glowColor = '#0066ff';
        else if (currentTech === 'mahoraga') glowColor = '#ffd700'; 
        else if (currentTech === 'chimera') glowColor = '#006644';
        else if (currentTech === 'worldslash') glowColor = '#ffffff';
        else if (currentTech === 'blackflash') glowColor = '#990000';
        else if (currentTech === 'boogiewoogie') glowColor = '#00ddee';
        else if (currentTech === 'cursedspeech') glowColor = '#9944dd';
        
        if (results.multiHandLandmarks) {
            const handCount = results.multiHandLandmarks.length;
            
            results.multiHandLandmarks.forEach((lm, handIndex) => {
                window.drawConnectors(canvasCtx, lm, window.HAND_CONNECTIONS, {color: glowColor, lineWidth: 5});
                window.drawLandmarks(canvasCtx, lm, {color: '#fff', lineWidth: 1, radius: 2});

                const isUp = (t, p) => lm[t].y < lm[p].y;
                const pinch = Math.hypot(lm[8].x - lm[4].x, lm[8].y - lm[4].y);
                
                // Finger States
                const thumbUp = isUp(4,3);
                const indexUp = isUp(8,6);
                const middleUp = isUp(12,10);
                const ringUp = isUp(16,14);
                const pinkyUp = isUp(20,18);

                // --- Detection Logic (Priority Order) ---
                
                // HIGHEST PRIORITY: Two-hand gestures
                if (handCount === 2 && handIndex === 0) {
                    const lm2 = results.multiHandLandmarks[1];
                    
                    // Check for X-cross (World Slash) - wrists crossed
                    const wrist1 = lm[0];
                    const wrist2 = lm2[0];
                    const wristDist = Math.hypot(wrist1.x - wrist2.x, wrist1.y - wrist2.y);
                    
                    // Check if hands are crossing
                    const hand1Center = (lm[0].x + lm[9].x) / 2;
                    const hand2Center = (lm2[0].x + lm2[9].x) / 2;
                    const isCrossing = Math.abs(hand1Center - hand2Center) < 0.15 && wristDist < 0.2;
                    
                    if (isCrossing) {
                        detected = 'worldslash';
                        return; // Exit early
                    }
                    
                    // Check for Boogie Woogie (thumbs touching)
                    const thumb1 = lm[4];
                    const thumb2 = lm2[4];
                    const thumbDist = Math.hypot(thumb1.x - thumb2.x, thumb1.y - thumb2.y);
                    
                    if (thumbDist < 0.08) {
                        detected = 'boogiewoogie';
                        return;
                    }
                }
                
                // SINGLE HAND GESTURES (only check first hand to avoid conflicts)
                if (handIndex === 0) {
                    // Pinch (Purple) - tightest threshold
                    if (pinch < 0.05) {
                        detected = 'purple';
                    }
                    // Fist (Mahoraga) - all fingers down
                    else if (!thumbUp && !indexUp && !middleUp && !ringUp && !pinkyUp) {
                        detected = 'mahoraga';
                    }
                    // Open Palm (Shrine) - all fingers up
                    else if (thumbUp && indexUp && middleUp && ringUp && pinkyUp) {
                        detected = 'shrine';
                    }
                    // Rock Sign (Chimera) - index + pinky
                    else if (indexUp && !middleUp && !ringUp && pinkyUp) {
                        detected = 'chimera';
                    }
                    // Peace Sign (Void) - index + middle ONLY
                    else if (indexUp && middleUp && !thumbUp && !ringUp && !pinkyUp) {
                        detected = 'void';
                    }
                    // Point (Red) - index only
                    else if (indexUp && !middleUp && !ringUp && !pinkyUp && !thumbUp) {
                        detected = 'red';
                    }
                    // Thumb up ONLY (Blue)
                    else if (thumbUp && !indexUp && !middleUp && !ringUp && !pinkyUp) {
                        detected = 'blue';
                    }
                    // Karate Chop (Black Flash) - all fingers together extended, hand vertical
                    else if (indexUp && middleUp && ringUp && pinkyUp && !thumbUp) {
                        // Check if hand is relatively vertical (not flat palm)
                        const palmBase = lm[0];
                        const middleFinger = lm[12];
                        const isVertical = Math.abs(middleFinger.x - palmBase.x) < 0.15;
                        
                        if (isVertical) {
                            detected = 'blackflash';
                        }
                    }
                    // Hand covering mouth (Cursed Speech)
                    // Check if hand is near center-bottom of face area
                    else {
                        const handCenterY = (lm[0].y + lm[9].y) / 2;
                        const handCenterX = (lm[0].x + lm[9].x) / 2;
                        
                        // If hand is in the lower-center region (mouth area) and relatively closed
                        const inMouthRegion = handCenterX > 0.35 && handCenterX < 0.65 && handCenterY > 0.5 && handCenterY < 0.8;
                        const fingersCurled = !indexUp && !middleUp;
                        
                        if (inMouthRegion && fingersCurled) {
                            detected = 'cursedspeech';
                        }
                    }
                }
            });
        }
        updateTechnique(detected);
      });

      const camera = new window.Camera(videoElement, {
        onFrame: async () => {
            if(videoElement && canvasElement) {
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
      } else if (state.currentTech === 'blue') {
        state.particles.rotation.z += 0.1; // Opposite of red
        state.particles.rotation.y -= 0.03;
      } else if (state.currentTech === 'purple') {
        state.particles.rotation.z += 0.2; 
        state.particles.rotation.y += 0.05;
      } else if (state.currentTech === 'shrine') {
        state.particles.rotation.set(0, 0, 0); 
      } else if (state.currentTech === 'mahoraga') {
        state.particles.rotation.z += 0.01;
        state.particles.rotation.x = 0.5; 
      } else if (state.currentTech === 'chimera') {
        state.particles.rotation.y += 0.02;
        state.particles.rotation.x = 0; 
      } else if (state.currentTech === 'worldslash') {
        state.particles.rotation.x += 0.03;
        state.particles.rotation.y += 0.04;
        state.particles.rotation.z += 0.02;
      } else if (state.currentTech === 'blackflash') {
        // Explosive burst rotation
        state.particles.rotation.z += 0.15;
      } else if (state.currentTech === 'boogiewoogie') {
        // Glitchy random rotation
        state.particles.rotation.x = Math.sin(Date.now() * 0.003) * 0.3;
        state.particles.rotation.y += 0.08;
      } else if (state.currentTech === 'cursedspeech') {
        // Pulsing wave rotation
        state.particles.rotation.y += 0.03;
        state.particles.rotation.z = Math.sin(Date.now() * 0.002) * 0.2;
      } else {
        state.particles.rotation.y += 0.005;
        state.particles.rotation.x = 0;
        state.particles.rotation.z = 0;
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
        if(threeState.current.renderer) {
            threeState.current.renderer.dispose();
            if(containerRef.current) containerRef.current.innerHTML = '';
        }
    };
  }, []);

  // --- Dynamic Color Styles for UI ---
  const getTechColor = () => {
    switch(techId) {
        case 'shrine': return '#ff0000';
        case 'purple': return '#bb00ff';
        case 'red': return '#ff3333';
        case 'blue': return '#0066ff';
        case 'void': return '#00ffff';
        case 'mahoraga': return '#ffd700';
        case 'chimera': return '#00aa77';
        case 'worldslash': return '#ffffff';
        case 'blackflash': return '#990000';
        case 'boogiewoogie': return '#00ddee';
        case 'cursedspeech': return '#9944dd';
        default: return '#00ffff';
    }
  };

  const techColor = getTechColor();

  return (
    <div style={styles.body}>
        <style>
        {`
            body { margin: 0; background-color: #000; overflow: hidden; }
            @keyframes pulse { 0% { opacity: 0.8; } 50% { opacity: 0.4; } 100% { opacity: 0.8; } }
            @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
            ::-webkit-scrollbar { width: 6px; }
            ::-webkit-scrollbar-track { background: rgba(0,0,0,0.5); }
            ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.3); border-radius: 3px; }
        `}
        </style>

        <div style={styles.grain}></div>
        <div ref={containerRef} style={styles.threeContainer}></div>

        <button 
            style={styles.manualButton} 
            onClick={() => setShowManual(!showManual)}
        >
            {showManual ? "CLOSE MANUAL" : "SORCERER MANUAL"}
        </button>

        {showManual && (
            <div style={styles.manualOverlay}>
                <h2 style={styles.manualTitle}>GRIMOIRE OF TECHNIQUES</h2>
                <div style={styles.manualGrid}>
                    <div style={styles.manualItem}>
                        <div style={{...styles.techIcon, borderColor: '#bb00ff'}}>👌</div>
                        <div>
                            <div style={{...styles.techTitle, color: '#bb00ff'}}>HOLLOW PURPLE</div>
                            <div style={styles.techDesc}>Pinch Thumb & Index Tight</div>
                        </div>
                    </div>
                    <div style={styles.manualItem}>
                        <div style={{...styles.techIcon, borderColor: '#ff0000'}}>✋</div>
                        <div>
                            <div style={{...styles.techTitle, color: '#ff0000'}}>MALEVOLENT SHRINE</div>
                            <div style={styles.techDesc}>Open Palm (All Fingers Up)</div>
                        </div>
                    </div>
                    <div style={styles.manualItem}>
                        <div style={{...styles.techIcon, borderColor: '#00ffff'}}>✌️</div>
                        <div>
                            <div style={{...styles.techTitle, color: '#00ffff'}}>INFINITE VOID</div>
                            <div style={styles.techDesc}>Peace Sign (Index + Middle)</div>
                        </div>
                    </div>
                    <div style={styles.manualItem}>
                        <div style={{...styles.techIcon, borderColor: '#ff3333'}}>👆</div>
                        <div>
                            <div style={{...styles.techTitle, color: '#ff3333'}}>REVERSAL: RED</div>
                            <div style={styles.techDesc}>Index Finger Pointing Up</div>
                        </div>
                    </div>
                    <div style={styles.manualItem}>
                        <div style={{...styles.techIcon, borderColor: '#0066ff'}}>👍</div>
                        <div>
                            <div style={{...styles.techTitle, color: '#0066ff'}}>LAPSE: BLUE</div>
                            <div style={styles.techDesc}>Thumbs Up Only</div>
                        </div>
                    </div>
                    <div style={styles.manualItem}>
                        <div style={{...styles.techIcon, borderColor: '#ffd700'}}>✊</div>
                        <div>
                            <div style={{...styles.techTitle, color: '#ffd700'}}>MAHORAGA</div>
                            <div style={styles.techDesc}>Closed Fist</div>
                        </div>
                    </div>
                    <div style={styles.manualItem}>
                        <div style={{...styles.techIcon, borderColor: '#00aa77'}}>🤘</div>
                        <div>
                            <div style={{...styles.techTitle, color: '#00aa77'}}>CHIMERA SHADOW</div>
                            <div style={styles.techDesc}>Rock Sign (Index + Pinky)</div>
                        </div>
                    </div>
                    <div style={styles.manualItem}>
                        <div style={{...styles.techIcon, borderColor: '#ffffff'}}>❌</div>
                        <div>
                            <div style={{...styles.techTitle, color: '#ffffff'}}>WORLD SLASH</div>
                            <div style={styles.techDesc}>Two Hands Crossed</div>
                        </div>
                    </div>
                    <div style={styles.manualItem}>
                        <div style={{...styles.techIcon, borderColor: '#990000'}}>🔪</div>
                        <div>
                            <div style={{...styles.techTitle, color: '#990000'}}>BLACK FLASH</div>
                            <div style={styles.techDesc}>Karate Chop (4 Fingers)</div>
                        </div>
                    </div>
                    <div style={styles.manualItem}>
                        <div style={{...styles.techIcon, borderColor: '#00ddee'}}>👏</div>
                        <div>
                            <div style={{...styles.techTitle, color: '#00ddee'}}>BOOGIE WOOGIE</div>
                            <div style={styles.techDesc}>Two Hands: Thumbs Touching</div>
                        </div>
                    </div>
                    <div style={styles.manualItem}>
                        <div style={{...styles.techIcon, borderColor: '#9944dd'}}>🤫</div>
                        <div>
                            <div style={{...styles.techTitle, color: '#9944dd'}}>CURSED SPEECH</div>
                            <div style={styles.techDesc}>Hand Over Mouth</div>
                        </div>
                    </div>
                </div>
            </div>
        )}

        <div style={styles.ui}>
            <h1 style={styles.h1}>呪術廻戦</h1>
            <div style={{...styles.techniqueName, color: techColor, textShadow: `0 0 10px ${techColor}80`}}>
                {techName}
            </div>
            {loading && <div style={styles.loading}>INITIALIZING CURSED ENERGY...</div>}
        </div>

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
        top: '8%',
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
        transform: 'translateX(-50%) scaleX(-1)',
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
        display: 'block', 
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
    },
    manualButton: {
        position: 'absolute',
        top: '20px',
        right: '20px',
        zIndex: 50,
        background: 'rgba(0,0,0,0.6)',
        border: '1px solid rgba(255,255,255,0.3)',
        color: '#fff',
        padding: '10px 20px',
        fontFamily: "'Courier New', sans-serif",
        cursor: 'pointer',
        backdropFilter: 'blur(5px)',
        letterSpacing: '2px',
        fontSize: '0.8rem',
        transition: 'all 0.3s',
    },
    manualOverlay: {
        position: 'absolute',
        top: '80px',
        right: '20px',
        width: '320px',
        maxHeight: '80vh',
        overflowY: 'auto',
        background: 'rgba(10, 10, 15, 0.95)',
        border: '1px solid rgba(255,255,255,0.1)',
        padding: '20px',
        zIndex: 49,
        color: '#eee',
        boxShadow: '0 10px 30px rgba(0,0,0,0.8)',
        borderRadius: '8px',
        animation: 'fadeIn 0.3s ease-out',
    },
    manualTitle: {
        fontSize: '1rem',
        borderBottom: '1px solid #333',
        paddingBottom: '10px',
        marginBottom: '15px',
        color: '#888',
        letterSpacing: '2px',
        textAlign: 'center',
    },
    manualGrid: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
    },
    manualItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
    },
    techIcon: {
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        border: '2px solid #555',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.2rem',
        background: 'rgba(0,0,0,0.5)',
        flexShrink: 0,
    },
    techTitle: {
        fontSize: '0.85rem',
        fontWeight: 'bold',
        letterSpacing: '1px',
    },
    techDesc: {
        fontSize: '0.7rem',
        color: '#aaa',
        marginTop: '2px',
    }
};

export default DomainExpansion;
