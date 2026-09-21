import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, RotateCcw, Shield, Zap, Sparkles, Trophy, Flame, Swords, ArrowLeft, Volume2, VolumeX, Cpu, User, SkipForward } from 'lucide-react';

// Custom hook to load Three.js dynamically
const useThreeJS = () => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (window.THREE) {
      setLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
    script.async = true;

    script.onload = () => setLoaded(true);
    script.onerror = () => setError(true);

    document.head.appendChild(script);

    return () => {
      script.onload = null;
      script.onerror = null;
    };
  }, []);

  return { loaded, error };
};

class SoundFxEngine {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playPunch() {
    if (this.muted || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(150, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(30, this.ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.12);
    } catch (e) {}
  }

  playKick() {
    if (this.muted || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(100, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(10, this.ctx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.5, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.2);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.2);
    } catch (e) {}
  }

  playSpecial() {
    if (this.muted || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(200, this.ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(800, this.ctx.currentTime + 0.3);
      osc.frequency.linearRampToValueAtTime(100, this.ctx.currentTime + 0.5);
      gain.gain.setValueAtTime(0.4, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.5);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.5);
    } catch (e) {}
  }

  playKO() {
    if (this.muted || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(180, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(20, this.ctx.currentTime + 0.8);
      gain.gain.setValueAtTime(0.5, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.8);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.8);
    } catch (e) {}
  }

  playAnnounce() {
    if (this.muted || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, this.ctx.currentTime);
      osc.frequency.setValueAtTime(880, this.ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.3);
    } catch (e) {}
  }

  playWeapon() {
    if (this.muted || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(600, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, this.ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.1);
    } catch (e) {}
  }
}

const sfx = new SoundFxEngine();

const WEAPONS = {
  sword:{name:'Katana',icon:'⚔',light:'Quick Slash',heavy:'Crescent Cut',lightDamage:13,heavyDamage:21,range:2.15,speed:1.0},
  staff:{name:'Bo Staff',icon:'◈',light:'Staff Jab',heavy:'Cyclone Sweep',lightDamage:11,heavyDamage:19,range:2.45,speed:1.08},
  nunchaku:{name:'Nunchaku',icon:'⛓',light:'Chain Strike',heavy:'Twin Fang',lightDamage:12,heavyDamage:22,range:1.9,speed:1.28},
  spear:{name:'Spear',icon:'➹',light:'Lance Thrust',heavy:'Sky Piercer',lightDamage:14,heavyDamage:24,range:2.9,speed:.88},
  chakram:{name:'Chakram',icon:'◎',light:'Razor Toss',heavy:'Orbit Break',lightDamage:12,heavyDamage:20,range:4.5,speed:1.0},
  tonfa:{name:'Tonfa',icon:'╫',light:'Twin Bash',heavy:'Breaker Rush',lightDamage:14,heavyDamage:21,range:1.7,speed:1.18},
  gauntlet:{name:'Arc Gauntlets',icon:'✦',light:'Pulse Jab',heavy:'Overdrive',lightDamage:15,heavyDamage:25,range:1.55,speed:1.12},
  bow:{name:'Energy Bow',icon:'⌁',light:'Spark Shot',heavy:'Piercing Volley',lightDamage:11,heavyDamage:25,range:5.6,speed:.84}
};

const CHARACTERS = [
  {id:'maya',name:'Maya Chen',title:'Neon Ronin',gender:'F',weapon:'sword',color:'#22d3ee',hexColor:0x22d3ee,secondaryColor:0x0f172a,skinColor:0xe8b48a,hairColor:0x0a0a0f,speed:91,power:78,defense:67,specialName:'Moonflash',specialDesc:'A lightning dash that ends in a cross-body blade strike.',specialType:'DASH',ability:'Afterimage',abilityDesc:'A perfect block creates a brief evasive afterimage.',quote:'A clean blade. A clear mind.',winLine:'You fought well. But hesitation costs everything.',loseLine:'Not today. I will sharpen this lesson.',look:'ronin'},
  {id:'ethan',name:'Ethan Cole',title:'Iron Sentinel',gender:'M',weapon:'staff',color:'#f59e0b',hexColor:0xf59e0b,secondaryColor:0x1f2937,skinColor:0xd49a6e,hairColor:0x3a2312,speed:68,power:88,defense:93,specialName:'Aegis Crash',specialDesc:'A brutal staff shockwave that punishes close pressure.',specialType:'SHOCKWAVE',ability:'Fortify',abilityDesc:'Blocking charges armor and empowers the next heavy hit.',quote:'Stand your ground. Make them move.',winLine:'You could not break the wall.',loseLine:'Solid hit. My guard was late.',look:'armor'},
  {id:'leila',name:'Leila Okafor',title:'Crimson Dancer',gender:'F',weapon:'nunchaku',color:'#f43f5e',hexColor:0xf43f5e,secondaryColor:0x3f0a20,skinColor:0x8d5524,hairColor:0x1a0a08,speed:96,power:74,defense:60,specialName:'Scarlet Spiral',specialDesc:'A spinning multi-hit rush that builds combo momentum.',specialType:'SPIN',ability:'Momentum',abilityDesc:'Consecutive hits make the next attack faster and stronger.',quote:'If you can see the chain, you are already late.',winLine:'Too slow. The rhythm belonged to me.',loseLine:'You broke my rhythm. Respect.',look:'dancer'},
  {id:'noah',name:'Noah Williams',title:'Street Phantom',gender:'M',weapon:'tonfa',color:'#a855f7',hexColor:0xa855f7,secondaryColor:0x171329,skinColor:0x6b4423,hairColor:0x0a0a0a,speed:94,power:73,defense:62,specialName:'Blink Counter',specialDesc:'A phase step that appears behind the opponent.',specialType:'TELEPORT',ability:'Phase Step',abilityDesc:'A successful block can reposition Noah behind the attacker.',quote:'You do not need to be stronger if you are never where they swing.',winLine:'You were looking in the wrong direction.',loseLine:'Clean counter. I will take the lesson.',look:'street'},
  {id:'sophia',name:'Sophia Reyes',title:'Solar Huntress',gender:'F',weapon:'bow',color:'#facc15',hexColor:0xfacc15,secondaryColor:0x312e81,skinColor:0xc68642,hairColor:0x2d1810,speed:83,power:82,defense:65,specialName:'Solar Rain',specialDesc:'Three charged arrows fill the arena with pressure.',specialType:'ARROWS',ability:'Deadeye',abilityDesc:'Heavy shots gain extra range and damage.',quote:'Distance is not safety. It is just another angle.',winLine:'You let me choose the range.',loseLine:'You closed the distance perfectly.',look:'hunter'},
  {id:'marcus',name:'Marcus Reed',title:'Thunder Boxer',gender:'M',weapon:'gauntlet',color:'#06b6d4',hexColor:0x06b6d4,secondaryColor:0x082f49,skinColor:0x5a3a1e,hairColor:0x0a0a0a,speed:87,power:96,defense:74,specialName:'Voltage Upper',specialDesc:'An electrified uppercut that launches opponents.',specialType:'UPPERCUT',ability:'Overcharge',abilityDesc:'Heavy gauntlet hits store charge for bonus impact.',quote:'Come close. I promise the electricity is worth it.',winLine:'Power is not loud. The impact is.',loseLine:'That was one hell of a hit.',look:'fighter'},
  {id:'riley',name:'Riley Park',title:'Orbit Ace',gender:'N',weapon:'chakram',color:'#8b5cf6',hexColor:0x8b5cf6,secondaryColor:0x111827,skinColor:0xe0ac69,hairColor:0x1a1a2e,speed:89,power:80,defense:70,specialName:'Event Horizon',specialDesc:'A giant orbiting chakram that returns for a second hit.',specialType:'ORBIT',ability:'Recall',abilityDesc:'Heavy chakram attacks can strike once on the way back.',quote:'One throw. Two chances.',winLine:'The return angle was yours to lose.',loseLine:'Nice read. You caught the return.',look:'pilot'},
  {id:'daniel',name:'Daniel Park',title:'Crimson Spear',gender:'M',weapon:'spear',color:'#fb923c',hexColor:0xfb923c,secondaryColor:0x431407,skinColor:0xd9a06b,hairColor:0x0a0a0a,speed:76,power:91,defense:78,specialName:'Dragon Vault',specialDesc:'A long-range vaulting thrust with huge reach.',specialType:'LUNGE',ability:'Reach',abilityDesc:'Spear attacks gain extra range and interrupt projectiles.',quote:'Keep your distance. That is where the spear lives.',winLine:'You stepped into my range.',loseLine:'You got inside my guard.',look:'warrior'}
];

class ArcadeFighter {
  constructor(charData, isAI = false, startPos = { x: -2.5, z: 0 }, THREE) {
    this.THREE = THREE;
    this.charData = charData;
    this.weapon = WEAPONS[charData.weapon] || WEAPONS.sword;
    this.isAI = isAI;

    this.maxHealth = 100;
    this.health = 100;
    this.superMeter = 0;
    this.roundsWon = 0;

    this.position = new THREE.Vector3(startPos.x, 0, startPos.z);
    this.velocity = new THREE.Vector3();
    this.isGrounded = true;

    this.state = 'IDLE';
    this.stateTimer = 0;
    this.actionDuration = 0;
    this.hasHitThisAttack = false;
    this.evade = false;
    this.charge = 0;
    this.comboBoost = 0;
    this.facingRight = startPos.x < 0;

    this.mesh = new THREE.Group();
    this.mesh.position.copy(this.position);
    this.buildGeometry();
  }

  buildGeometry() {
    const THREE = this.THREE;
    const primaryColor = this.charData.hexColor;
    const secColor = this.charData.secondaryColor;
    const skinColor = this.charData.skinColor;
    const hairColor = this.charData.hairColor;

    // ---- Materials ----
    const skinMat = new THREE.MeshStandardMaterial({ color: skinColor, roughness: 0.7, metalness: 0.05 });
    const hairMat = new THREE.MeshStandardMaterial({ color: hairColor, roughness: 0.5, metalness: 0.1 });
    const primaryMat = new THREE.MeshStandardMaterial({ color: primaryColor, roughness: 0.35, metalness: 0.55, emissive: primaryColor, emissiveIntensity: 0.15 });
    const secMat = new THREE.MeshStandardMaterial({ color: secColor, roughness: 0.6, metalness: 0.3 });
    const darkMat = new THREE.MeshStandardMaterial({ color: 0x0a0a14, roughness: 0.85, metalness: 0.1 });
    const beltMat = new THREE.MeshStandardMaterial({ color: 0x1a1a22, roughness: 0.7, metalness: 0.4 });
    const accentGlowMat = new THREE.MeshBasicMaterial({ color: primaryColor });
    const eyeWhiteMat = new THREE.MeshBasicMaterial({ color: 0xf5f5f5 });
    const pupilMat = new THREE.MeshBasicMaterial({ color: 0x1a1a2e });

    const isFemale = this.charData.gender === 'F';
    const isMale = this.charData.gender === 'M';

    const createPart = (geo, mat, x=0, y=0, z=0) => {
      const m = new THREE.Mesh(geo, mat);
      m.position.set(x, y, z);
      m.castShadow = true;
      m.receiveShadow = true;
      return m;
    };

    // ============================================================
    // BODY PROPORTIONS (differentiated by gender)
    // ============================================================
    // Females: slightly narrower shoulders, wider hips, longer legs
    // Males: broader shoulders, narrower hips
    const shoulderW = isFemale ? 0.44 : 0.52;
    const hipW = isFemale ? 0.38 : 0.32;
    const waistW = isFemale ? 0.32 : 0.36;
    const torsoH = 1.05;

    // ---- TORSO ----
    // Chest
    this.torso = createPart(new THREE.BoxGeometry(shoulderW * 2, torsoH * 0.55, 0.42), primaryMat, 0, 1.85, 0);
    this.mesh.add(this.torso);

    // Waist
    this.waist = createPart(new THREE.BoxGeometry(waistW * 2, torsoH * 0.35, 0.38), primaryMat, 0, 1.42, 0);
    this.mesh.add(this.waist);

    // Hips
    this.hips = createPart(new THREE.BoxGeometry(hipW * 2, torsoH * 0.25, 0.42), secMat, 0, 1.18, 0);
    this.mesh.add(this.hips);

    // Chest accent / emblem
    const emblem = createPart(new THREE.BoxGeometry(0.32, 0.32, 0.04), accentGlowMat, 0, 2.0, 0.22);
    this.mesh.add(emblem);

    // ---- NECK ----
    this.neck = createPart(new THREE.CylinderGeometry(0.11, 0.13, 0.16, 12), skinMat, 0, 2.46, 0);
    this.mesh.add(this.neck);

    // ============================================================
    // HEAD & FACE
    // ============================================================
    this.head = createPart(new THREE.SphereGeometry(0.27, 20, 20), skinMat, 0, 2.72, 0);
    this.head.scale.set(0.92, 1.05, 0.95);
    this.mesh.add(this.head);

    // Jaw definition
    const jaw = createPart(new THREE.BoxGeometry(0.36, 0.16, 0.32), skinMat, 0, 2.6, 0.02);
    jaw.geometry.translate(0, 0, 0);
    this.mesh.add(jaw);

    // Eyes (whites)
    const eyeL = createPart(new THREE.SphereGeometry(0.05, 10, 10), eyeWhiteMat, 0.09, 2.74, 0.24);
    const eyeR = createPart(new THREE.SphereGeometry(0.05, 10, 10), eyeWhiteMat, -0.09, 2.74, 0.24);
    eyeL.scale.set(1, 1, 0.5);
    eyeR.scale.set(1, 1, 0.5);
    this.mesh.add(eyeL, eyeR);

    // Pupils
    const pupilL = createPart(new THREE.SphereGeometry(0.025, 8, 8), pupilMat, 0.09, 2.74, 0.28);
    const pupilR = createPart(new THREE.SphereGeometry(0.025, 8, 8), pupilMat, -0.09, 2.74, 0.28);
    this.mesh.add(pupilL, pupilR);

    // Eyebrows
    const browL = createPart(new THREE.BoxGeometry(0.09, 0.02, 0.04), hairMat, 0.09, 2.82, 0.24);
    const browR = createPart(new THREE.BoxGeometry(0.09, 0.02, 0.04), hairMat, -0.09, 2.82, 0.24);
    browL.rotation.z = isFemale ? 0.12 : -0.05;
    browR.rotation.z = isFemale ? -0.12 : 0.05;
    this.mesh.add(browL, browR);

    // Nose
    const nose = createPart(new THREE.ConeGeometry(0.035, 0.07, 8), skinMat, 0, 2.68, 0.26);
    nose.rotation.x = -Math.PI / 2;
    this.mesh.add(nose);

    // Mouth (subtle line)
    const mouth = createPart(new THREE.BoxGeometry(0.08, 0.015, 0.02), new THREE.MeshBasicMaterial({ color: 0x8a3a3a }), 0, 2.58, 0.25);
    this.mesh.add(mouth);

    // ============================================================
    // HAIR (unique per character)
    // ============================================================
    const hairGroup = new THREE.Group();

    // Base cap of hair covering top of head
    const hairCap = createPart(new THREE.SphereGeometry(0.30, 20, 20, 0, Math.PI * 2, 0, Math.PI * 0.62), hairMat, 0, 2.72, 0);
    hairCap.scale.set(0.95, 1.05, 0.98);
    hairGroup.add(hairCap);

    // Side/back coverage
    const hairBack = createPart(new THREE.SphereGeometry(0.28, 20, 20), hairMat, 0, 2.70, -0.08);
    hairBack.scale.set(0.95, 0.9, 0.9);
    hairGroup.add(hairBack);

    // ---- Character-specific hairstyles ----
    if (this.charData.look === 'ronin') {
      // Maya: Long straight black hair with side ponytail, hair strands framing face
      const sideL = createPart(new THREE.BoxGeometry(0.08, 0.55, 0.14), hairMat, 0.26, 2.55, 0.02);
      sideL.rotation.z = 0.08;
      const sideR = createPart(new THREE.BoxGeometry(0.08, 0.55, 0.14), hairMat, -0.26, 2.55, 0.02);
      sideR.rotation.z = -0.08;
      hairGroup.add(sideL, sideR);

      // High side ponytail
      const ponyBase = createPart(new THREE.SphereGeometry(0.09, 10, 10), hairMat, 0.26, 2.85, -0.06);
      const pony = createPart(new THREE.CylinderGeometry(0.07, 0.05, 0.85, 10), hairMat, 0.28, 2.45, -0.16);
      pony.rotation.x = -0.28;
      pony.rotation.z = 0.15;
      hairGroup.add(ponyBase, pony);

      // Bangs
      const bangs = createPart(new THREE.BoxGeometry(0.42, 0.16, 0.14), hairMat, 0, 2.88, 0.22);
      bangs.rotation.x = -0.15;
      hairGroup.add(bangs);
    } else if (this.charData.look === 'armor') {
      // Ethan: Short military buzz cut
      const buzz = createPart(new THREE.SphereGeometry(0.28, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.55), hairMat, 0, 2.74, 0);
      buzz.scale.set(0.95, 0.85, 0.95);
      hairGroup.add(buzz);

      // Slight stubble hint
      const stubble = createPart(new THREE.SphereGeometry(0.26, 16, 16), new THREE.MeshStandardMaterial({ color: hairColor, roughness: 0.9, metalness: 0 }), 0, 2.60, 0.02);
      stubble.scale.set(0.95, 0.5, 0.95);
      stubble.material.opacity = 0.35;
      stubble.material.transparent = true;
      hairGroup.add(stubble);
    } else if (this.charData.look === 'dancer') {
      // Leila: Long braids with beads, natural texture
      // Bigger hair silhouette
      const afro = createPart(new THREE.SphereGeometry(0.34, 16, 16), hairMat, 0, 2.78, -0.04);
      afro.scale.set(1, 0.85, 1);
      hairGroup.add(afro);

      // Multiple braids falling down
      const braidPositions = [
        { x: 0.24, z: 0.06, rot: 0.15 },
        { x: -0.24, z: 0.06, rot: -0.15 },
        { x: 0.18, z: -0.18, rot: 0.1 },
        { x: -0.18, z: -0.18, rot: -0.1 },
        { x: 0.05, z: -0.26, rot: 0 },
      ];
      braidPositions.forEach((bp) => {
        const braid = createPart(new THREE.CylinderGeometry(0.045, 0.03, 0.75, 8), hairMat, bp.x, 2.45, bp.z);
        braid.rotation.z = bp.rot;
        braid.rotation.x = -0.1;
        hairGroup.add(braid);

        // Bead at end
        const bead = createPart(new THREE.SphereGeometry(0.05, 8, 8), new THREE.MeshStandardMaterial({ color: primaryColor, metalness: 0.9, roughness: 0.2, emissive: primaryColor, emissiveIntensity: 0.4 }), bp.x + bp.rot * 0.3, 2.08, bp.z);
        hairGroup.add(bead);
      });

      // Headband
      const band = createPart(new THREE.TorusGeometry(0.29, 0.025, 8, 24), new THREE.MeshStandardMaterial({ color: primaryColor, metalness: 0.6, roughness: 0.3, emissive: primaryColor, emissiveIntensity: 0.3 }), 0, 2.78, 0);
      band.rotation.x = Math.PI / 2;
      hairGroup.add(band);
    } else if (this.charData.look === 'street') {
      // Noah: Fade with high top, hoodie vibe
      const top = createPart(new THREE.BoxGeometry(0.42, 0.28, 0.42), hairMat, 0, 2.88, -0.02);
      top.geometry.translate(0, 0, 0);
      hairGroup.add(top);

      // Faded sides (shorter)
      const fadeL = createPart(new THREE.SphereGeometry(0.26, 12, 12, 0, Math.PI, 0, Math.PI * 0.6), hairMat, 0.02, 2.74, 0);
      hairGroup.add(fadeL);
    } else if (this.charData.look === 'hunter') {
      // Sophia: Long wavy dark hair, high ponytail
      const sideL = createPart(new THREE.BoxGeometry(0.09, 0.6, 0.16), hairMat, 0.27, 2.5, 0.02);
      const sideR = createPart(new THREE.BoxGeometry(0.09, 0.6, 0.16), hairMat, -0.27, 2.5, 0.02);
      hairGroup.add(sideL, sideR);

      // High ponytail
      const ponyBase = createPart(new THREE.SphereGeometry(0.11, 10, 10), hairMat, 0, 2.92, -0.06);
      const pony = createPart(new THREE.CylinderGeometry(0.09, 0.05, 1.0, 10), hairMat, 0, 2.45, -0.22);
      pony.rotation.x = -0.3;
      hairGroup.add(ponyBase, pony);

      // Swept bangs
      const bangs = createPart(new THREE.BoxGeometry(0.44, 0.18, 0.14), hairMat, 0.04, 2.88, 0.22);
      bangs.rotation.z = 0.2;
      bangs.rotation.x = -0.15;
      hairGroup.add(bangs);
    } else if (this.charData.look === 'fighter') {
      // Marcus: Short curly/shaved with clean lines
      const fade = createPart(new THREE.SphereGeometry(0.28, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.6), hairMat, 0, 2.74, 0);
      fade.scale.set(0.95, 0.7, 0.95);
      hairGroup.add(fade);

      // Slight curl texture on top
      for (let i = 0; i < 6; i++) {
        const c = createPart(new THREE.SphereGeometry(0.06, 6, 6), hairMat, (Math.random() - 0.5) * 0.3, 2.9 + Math.random() * 0.04, (Math.random() - 0.5) * 0.2);
        hairGroup.add(c);
      }

      // Line-up edge
      const line = createPart(new THREE.BoxGeometry(0.5, 0.02, 0.02), new THREE.MeshBasicMaterial({ color: 0x000000 }), 0, 2.86, 0.26);
      hairGroup.add(line);
    } else if (this.charData.look === 'pilot') {
      // Riley: Androgynous undercut with swept top
      const side = createPart(new THREE.SphereGeometry(0.27, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.55), hairMat, 0, 2.72, 0);
      hairGroup.add(side);

      // Swept top going to one side
      const top = createPart(new THREE.BoxGeometry(0.5, 0.2, 0.42), hairMat, 0.06, 2.9, -0.02);
      top.rotation.z = -0.15;
      hairGroup.add(top);

      // Shaved side accent
      const accent = createPart(new THREE.BoxGeometry(0.02, 0.22, 0.4), new THREE.MeshBasicMaterial({ color: primaryColor }), -0.28, 2.74, 0);
      hairGroup.add(accent);
    } else if (this.charData.look === 'warrior') {
      // Daniel: Long warrior hair tied back
      const backHair = createPart(new THREE.SphereGeometry(0.29, 16, 16), hairMat, 0, 2.7, -0.08);
      backHair.scale.set(0.95, 1, 0.95);
      hairGroup.add(backHair);

      // Low ponytail
      const tail = createPart(new THREE.CylinderGeometry(0.07, 0.04, 0.9, 10), hairMat, 0, 2.35, -0.24);
      tail.rotation.x = -0.18;
      hairGroup.add(tail);

      // Headband
      const band = createPart(new THREE.TorusGeometry(0.29, 0.03, 8, 24), new THREE.MeshStandardMaterial({ color: primaryColor, metalness: 0.7, roughness: 0.3, emissive: primaryColor, emissiveIntensity: 0.3 }), 0, 2.82, 0);
      band.rotation.x = Math.PI / 2;
      hairGroup.add(band);

      // Bangs framing face
      const bangL = createPart(new THREE.BoxGeometry(0.1, 0.3, 0.12), hairMat, 0.22, 2.74, 0.2);
      const bangR = createPart(new THREE.BoxGeometry(0.1, 0.3, 0.12), hairMat, -0.22, 2.74, 0.2);
      hairGroup.add(bangL, bangR);
    }

    this.mesh.add(hairGroup);

    // ============================================================
    // CLOTHING / OUTFIT (gender-appropriate)
    // ============================================================
    const outfitGroup = new THREE.Group();

    // Everyone gets a belt
    const belt = createPart(new THREE.TorusGeometry(hipW + 0.02, 0.045, 8, 24), beltMat, 0, 1.3, 0);
    belt.rotation.x = Math.PI / 2;
    outfitGroup.add(belt);

    // Belt buckle / accent
    const buckle = createPart(new THREE.BoxGeometry(0.16, 0.16, 0.05), accentGlowMat, 0, 1.3, hipW + 0.02);
    outfitGroup.add(buckle);

    if (this.charData.look === 'ronin') {
      // Maya: Kimono-style top with obi, split skirt/leggings, armored shoulders
      // Upper kimono (covers chest, cross-over front)
      const kimonoTop = createPart(new THREE.BoxGeometry(shoulderW * 2 + 0.02, 0.85, 0.46), primaryMat, 0, 1.9, 0);
      outfitGroup.add(kimonoTop);

      // Cross-over front panel
      const crossPanel = createPart(new THREE.BoxGeometry(0.34, 0.8, 0.04), secMat, 0.04, 1.85, 0.24);
      crossPanel.rotation.z = 0.15;
      outfitGroup.add(crossPanel);

      // Obi (wide belt)
      const obi = createPart(new THREE.BoxGeometry(waistW * 2 + 0.06, 0.22, 0.42), secMat, 0, 1.36, 0);
      outfitGroup.add(obi);

      // Obi knot in back
      const obiKnot = createPart(new THREE.BoxGeometry(0.3, 0.2, 0.18), secMat, 0, 1.36, -0.28);
      outfitGroup.add(obiKnot);

      // Split skirt panels (two flaps on sides)
      const skirtL = createPart(new THREE.BoxGeometry(0.28, 0.7, 0.42), primaryMat, 0.16, 0.9, 0);
      skirtL.rotation.z = 0.06;
      const skirtR = createPart(new THREE.BoxGeometry(0.28, 0.7, 0.42), primaryMat, -0.16, 0.9, 0);
      skirtR.rotation.z = -0.06;
      outfitGroup.add(skirtL, skirtR);

      // Shoulder pauldron (left shoulder only - asymmetric ronin style)
      const pauldron = createPart(new THREE.BoxGeometry(0.32, 0.14, 0.42), secMat, -shoulderW - 0.02, 2.22, 0);
      pauldron.rotation.z = 0.15;
      outfitGroup.add(pauldron);
      const pauldronGlow = createPart(new THREE.BoxGeometry(0.3, 0.04, 0.05), accentGlowMat, -shoulderW - 0.02, 2.22, 0.22);
      outfitGroup.add(pauldronGlow);
    } else if (this.charData.look === 'armor') {
      // Ethan: Heavy plate armor, broad shoulders, chest plate
      const chestPlate = createPart(new THREE.BoxGeometry(shoulderW * 2 + 0.15, 0.9, 0.5), secMat, 0, 1.9, 0);
      outfitGroup.add(chestPlate);

      // Chest plate detailing (vertical ridges)
      const ridge1 = createPart(new THREE.BoxGeometry(0.06, 0.7, 0.04), primaryMat, 0.12, 1.9, 0.26);
      const ridge2 = createPart(new THREE.BoxGeometry(0.06, 0.7, 0.04), primaryMat, -0.12, 1.9, 0.26);
      outfitGroup.add(ridge1, ridge2);

      // Central chest emblem
      const emblem = createPart(new THREE.BoxGeometry(0.2, 0.2, 0.05), accentGlowMat, 0, 1.95, 0.28);
      outfitGroup.add(emblem);

      // Wide armored shoulder pads (both sides)
      const padL = createPart(new THREE.BoxGeometry(0.4, 0.24, 0.5), secMat, shoulderW + 0.08, 2.25, 0);
      padL.rotation.z = -0.12;
      const padR = createPart(new THREE.BoxGeometry(0.4, 0.24, 0.5), secMat, -shoulderW - 0.08, 2.25, 0);
      padR.rotation.z = 0.12;
      outfitGroup.add(padL, padR);

      // Pauldron glows
      const padGlowL = createPart(new THREE.BoxGeometry(0.36, 0.04, 0.06), accentGlowMat, shoulderW + 0.08, 2.25, 0.24);
      const padGlowR = createPart(new THREE.BoxGeometry(0.36, 0.04, 0.06), accentGlowMat, -shoulderW - 0.08, 2.25, 0.24);
      outfitGroup.add(padGlowL, padGlowR);

      // Armored tassets (hip guards)
      const tassetL = createPart(new THREE.BoxGeometry(0.2, 0.35, 0.4), secMat, 0.22, 1.05, 0);
      const tassetR = createPart(new THREE.BoxGeometry(0.2, 0.35, 0.4), secMat, -0.22, 1.05, 0);
      outfitGroup.add(tassetL, tassetR);
    } else if (this.charData.look === 'dancer') {
      // Leila: Flowing performance outfit, asymmetric top, flowing skirt
      // Asymmetric crop top
      const cropTop = createPart(new THREE.BoxGeometry(shoulderW * 2, 0.5, 0.4), primaryMat, 0, 2.0, 0);
      outfitGroup.add(cropTop);

      // Diagonal strap across chest
      const strap = createPart(new THREE.BoxGeometry(0.1, 0.9, 0.42), secMat, 0.1, 1.95, 0);
      strap.rotation.z = 0.35;
      outfitGroup.add(strap);

      // Exposed midriff (just skin showing - the waist box is skin colored already)
      // Wrap skirt
      const skirt = createPart(new THREE.BoxGeometry(hipW * 2 + 0.08, 0.85, 0.44), primaryMat, 0, 0.85, 0);
      outfitGroup.add(skirt);

      // Skirt panel overlays for flowing look
      const panelL = createPart(new THREE.BoxGeometry(0.22, 0.95, 0.02), secMat, 0.28, 0.8, 0.22);
      panelL.rotation.z = 0.1;
      const panelR = createPart(new THREE.BoxGeometry(0.22, 0.95, 0.02), secMat, -0.28, 0.8, 0.22);
      panelR.rotation.z = -0.1;
      outfitGroup.add(panelL, panelR);

      // Hip accent bands (armor rings on hips)
      const hipRingL = createPart(new THREE.TorusGeometry(0.14, 0.025, 6, 16), accentGlowMat, 0.32, 1.15, 0);
      hipRingL.rotation.y = Math.PI / 2;
      const hipRingR = createPart(new THREE.TorusGeometry(0.14, 0.025, 6, 16), accentGlowMat, -0.32, 1.15, 0);
      hipRingR.rotation.y = Math.PI / 2;
      outfitGroup.add(hipRingL, hipRingR);

      // Shoulder accent (one shoulder)
      const shoulderAccent = createPart(new THREE.BoxGeometry(0.3, 0.12, 0.4), secMat, shoulderW + 0.02, 2.24, 0);
      outfitGroup.add(shoulderAccent);
    } else if (this.charData.look === 'street') {
      // Noah: Hoodie with hood down, jogger pants feel, taped wrists
      const hoodieTop = createPart(new THREE.BoxGeometry(shoulderW * 2 + 0.05, 0.95, 0.48), secMat, 0, 1.9, 0);
      outfitGroup.add(hoodieTop);

      // Hood down (behind neck)
      const hood = createPart(new THREE.SphereGeometry(0.28, 12, 12, 0, Math.PI * 2, 0, Math.PI * 0.6), secMat, 0, 2.35, -0.18);
      hood.rotation.x = Math.PI * 0.15;
      outfitGroup.add(hood);

      // Kangaroo pocket
      const pocket = createPart(new THREE.BoxGeometry(0.45, 0.24, 0.04), primaryMat, 0, 1.55, 0.25);
      outfitGroup.add(pocket);

      // Drawstrings
      const stringL = createPart(new THREE.BoxGeometry(0.02, 0.22, 0.02), accentGlowMat, 0.08, 2.15, 0.26);
      const stringR = createPart(new THREE.BoxGeometry(0.02, 0.22, 0.02), accentGlowMat, -0.08, 2.15, 0.26);
      outfitGroup.add(stringL, stringR);

      // Waist band of pants
      const waistBand = createPart(new THREE.BoxGeometry(hipW * 2 + 0.04, 0.18, 0.42), primaryMat, 0, 1.28, 0);
      outfitGroup.add(waistBand);

      // Chest emblem / logo
      const emblem = createPart(new THREE.BoxGeometry(0.22, 0.22, 0.04), accentGlowMat, 0, 2.0, 0.25);
      outfitGroup.add(emblem);
    } else if (this.charData.look === 'hunter') {
      // Sophia: Fitted tactical outfit, quiver strap, cape/poncho
      const tacticalTop = createPart(new THREE.BoxGeometry(shoulderW * 2, 0.85, 0.42), primaryMat, 0, 1.9, 0);
      outfitGroup.add(tacticalTop);

      // V-neck collar
      const collar = createPart(new THREE.BoxGeometry(0.42, 0.12, 0.42), secMat, 0, 2.32, 0);
      outfitGroup.add(collar);

      // Quiver strap crossing diagonally
      const quiverStrap = createPart(new THREE.BoxGeometry(0.09, 1.0, 0.44), secMat, 0.02, 1.9, 0);
      quiverStrap.rotation.z = 0.4;
      outfitGroup.add(quiverStrap);

      // Belt with pouches
      const pouchL = createPart(new THREE.BoxGeometry(0.14, 0.16, 0.1), secMat, 0.22, 1.28, 0.24);
      const pouchR = createPart(new THREE.BoxGeometry(0.14, 0.16, 0.1), secMat, -0.22, 1.28, 0.24);
      outfitGroup.add(pouchL, pouchR);

      // Hip wrap / tassets (fabric)
      const hipWrapL = createPart(new THREE.BoxGeometry(0.22, 0.5, 0.42), secMat, 0.24, 1.0, 0);
      hipWrapL.rotation.z = 0.08;
      const hipWrapR = createPart(new THREE.BoxGeometry(0.22, 0.5, 0.42), secMat, -0.24, 1.0, 0);
      hipWrapR.rotation.z = -0.08;
      outfitGroup.add(hipWrapL, hipWrapR);

      // Chest cross emblem
      const crossV = createPart(new THREE.BoxGeometry(0.04, 0.22, 0.04), accentGlowMat, 0, 2.0, 0.24);
      const crossH = createPart(new THREE.BoxGeometry(0.16, 0.04, 0.04), accentGlowMat, 0, 2.0, 0.24);
      outfitGroup.add(crossV, crossH);
    } else if (this.charData.look === 'fighter') {
      // Marcus: Boxing-style tank top, wraps, shorts
      const tank = createPart(new THREE.BoxGeometry(shoulderW * 2 + 0.02, 0.7, 0.42), primaryMat, 0, 1.95, 0);
      outfitGroup.add(tank);

      // Chest opening (V shape - just visual accent)
      const chestV = createPart(new THREE.BoxGeometry(0.3, 0.4, 0.04), skinMat, 0, 2.1, 0.22);
      outfitGroup.add(chestV);

      // Wraps at waist
      const wraps = createPart(new THREE.BoxGeometry(waistW * 2 + 0.08, 0.22, 0.44), secMat, 0, 1.4, 0);
      outfitGroup.add(wraps);

      // Shorts
      const shorts = createPart(new THREE.BoxGeometry(hipW * 2 + 0.06, 0.5, 0.44), primaryMat, 0, 1.0, 0);
      outfitGroup.add(shorts);

      // Side stripes on shorts
      const stripeL = createPart(new THREE.BoxGeometry(0.04, 0.5, 0.46), accentGlowMat, 0.24, 1.0, 0);
      const stripeR = createPart(new THREE.BoxGeometry(0.04, 0.5, 0.46), accentGlowMat, -0.24, 1.0, 0);
      outfitGroup.add(stripeL, stripeR);

      // Champion belt buckle
      const bigBuckle = createPart(new THREE.BoxGeometry(0.24, 0.2, 0.06), accentGlowMat, 0, 1.28, hipW + 0.02);
      outfitGroup.add(bigBuckle);
    } else if (this.charData.look === 'pilot') {
      // Riley: Flight jacket, asymmetric design, tech accents
      const jacket = createPart(new THREE.BoxGeometry(shoulderW * 2 + 0.06, 0.85, 0.48), primaryMat, 0, 1.9, 0);
      outfitGroup.add(jacket);

      // Jacket collar (popped)
      const collarL = createPart(new THREE.BoxGeometry(0.14, 0.2, 0.36), secMat, 0.22, 2.28, 0);
      collarL.rotation.z = -0.2;
      const collarR = createPart(new THREE.BoxGeometry(0.14, 0.2, 0.36), secMat, -0.22, 2.28, 0);
      collarR.rotation.z = 0.2;
      outfitGroup.add(collarL, collarR);

      // Zipper line
      const zipper = createPart(new THREE.BoxGeometry(0.03, 0.85, 0.04), accentGlowMat, 0, 1.9, 0.25);
      outfitGroup.add(zipper);

      // Shoulder patch
      const patch = createPart(new THREE.BoxGeometry(0.16, 0.16, 0.04), accentGlowMat, shoulderW - 0.02, 2.15, 0.25);
      outfitGroup.add(patch);

      // Utility belt
      const utilityBelt = createPart(new THREE.BoxGeometry(waistW * 2 + 0.08, 0.2, 0.44), secMat, 0, 1.38, 0);
      outfitGroup.add(utilityBelt);

      // Utility pouches
      const pouch1 = createPart(new THREE.BoxGeometry(0.12, 0.14, 0.12), secMat, 0.18, 1.28, 0.22);
      const pouch2 = createPart(new THREE.BoxGeometry(0.12, 0.14, 0.12), secMat, -0.18, 1.28, 0.22);
      outfitGroup.add(pouch1, pouch2);

      // Tech leg straps
      const legStrapL = createPart(new THREE.BoxGeometry(0.28, 0.08, 0.42), accentGlowMat, 0.16, 0.62, 0);
      const legStrapR = createPart(new THREE.BoxGeometry(0.28, 0.08, 0.42), accentGlowMat, -0.16, 0.62, 0);
      outfitGroup.add(legStrapL, legStrapR);
    } else if (this.charData.look === 'warrior') {
      // Daniel: Layered samurai-style armor, flowing coat
      const chestArmor = createPart(new THREE.BoxGeometry(shoulderW * 2 + 0.06, 0.85, 0.48), primaryMat, 0, 1.9, 0);
      outfitGroup.add(chestArmor);

      // Layered chest plates (horizontal bands)
      for (let i = 0; i < 3; i++) {
        const band = createPart(new THREE.BoxGeometry(shoulderW * 2 + 0.08, 0.08, 0.5), secMat, 0, 2.15 - i * 0.22, 0);
        outfitGroup.add(band);
      }

      // Flowing long coat tails (back)
      const coatTail = createPart(new THREE.BoxGeometry(0.85, 1.2, 0.14), secMat, 0, 1.0, -0.28);
      outfitGroup.add(coatTail);

      // Coat side panels
      const coatSideL = createPart(new THREE.BoxGeometry(0.18, 1.1, 0.42), secMat, 0.28, 1.0, 0);
      const coatSideR = createPart(new THREE.BoxGeometry(0.18, 1.1, 0.42), secMat, -0.28, 1.0, 0);
      outfitGroup.add(coatSideL, coatSideR);

      // Shoulder guards (both)
      const guardL = createPart(new THREE.BoxGeometry(0.34, 0.18, 0.46), secMat, shoulderW + 0.04, 2.24, 0);
      guardL.rotation.z = -0.1;
      const guardR = createPart(new THREE.BoxGeometry(0.34, 0.18, 0.46), secMat, -shoulderW - 0.04, 2.24, 0);
      guardR.rotation.z = 0.1;
      outfitGroup.add(guardL, guardR);

      // Back banner pole (emblem)
      const pole = createPart(new THREE.CylinderGeometry(0.02, 0.02, 1.6, 6), darkMat, -0.5, 2.0, -0.3);
      outfitGroup.add(pole);
      const banner = createPart(new THREE.BoxGeometry(0.22, 0.7, 0.02), accentGlowMat, -0.5, 2.2, -0.3);
      outfitGroup.add(banner);
    }

    this.mesh.add(outfitGroup);

    // ============================================================
    // LIMBS (with proper joint hierarchy)
    // ============================================================
    const armW = isFemale ? 0.18 : 0.22;
    const legW = isFemale ? 0.22 : 0.26;

    const createJointLimb = (w, h, d, px, py, pz, mat, options = {}) => {
      const pivot = new THREE.Group();
      pivot.position.set(px, py, pz);
      const geo = new THREE.BoxGeometry(w, h, d);
      geo.translate(0, -h/2, 0);
      const limbMesh = new THREE.Mesh(geo, mat);
      limbMesh.castShadow = true;
      pivot.add(limbMesh);

      // Optionally add hand/foot
      if (options.hand) {
        const hand = new THREE.Mesh(new THREE.SphereGeometry(w * 0.9, 10, 10), skinMat);
        hand.position.y = -h - 0.02;
        hand.castShadow = true;
        pivot.add(hand);
      }
      if (options.foot) {
        const foot = new THREE.Mesh(new THREE.BoxGeometry(w * 1.3, 0.14, d * 1.7), darkMat);
        foot.position.set(0, -h + 0.05, d * 0.3);
        foot.castShadow = true;
        pivot.add(foot);
      }

      this.mesh.add(pivot);
      return pivot;
    };

    // Arms (skin colored upper, with sleeves if applicable)
    this.leftArm = createJointLimb(armW, 0.92, armW, shoulderW - 0.02, 2.28, 0, primaryMat, { hand: true });
    this.rightArm = createJointLimb(armW, 0.92, armW, -shoulderW + 0.02, 2.28, 0, primaryMat, { hand: true });

    // Legs
    this.leftLeg = createJointLimb(legW, 1.15, legW, hipW - 0.08, 1.15, 0, secMat, { foot: true });
    this.rightLeg = createJointLimb(legW, 1.15, legW, -hipW + 0.08, 1.15, 0, secMat, { foot: true });

    // Forearm guards / wraps (for some characters)
    if (this.charData.look === 'fighter' || this.charData.look === 'street' || this.charData.look === 'ronin') {
      const wrapMat = new THREE.MeshStandardMaterial({ color: 0x1a1a22, roughness: 0.8 });
      const wrapL = createPart(new THREE.BoxGeometry(armW + 0.02, 0.32, armW + 0.02), wrapMat, 0, -0.7, 0);
      this.leftArm.add(wrapL);
      const wrapR = createPart(new THREE.BoxGeometry(armW + 0.02, 0.32, armW + 0.02), wrapMat, 0, -0.7, 0);
      this.rightArm.add(wrapR);
    }

    // Shoulder pads (attach to arms so they move with them)
    if (this.charData.look === 'armor' || this.charData.look === 'warrior') {
      const padL = createPart(new THREE.BoxGeometry(0.26, 0.16, 0.36), secMat, 0, 0.05, 0);
      this.leftArm.add(padL);
      const padR = createPart(new THREE.BoxGeometry(0.26, 0.16, 0.36), secMat, 0, 0.05, 0);
      this.rightArm.add(padR);
    }

    // ============================================================
    // WEAPON
    // ============================================================
    const weaponMat = new THREE.MeshStandardMaterial({ color: 0xcbd5e1, roughness: 0.22, metalness: 0.9 });
    const weaponGlow = new THREE.MeshBasicMaterial({ color: primaryColor });
    const weaponHandleMat = new THREE.MeshStandardMaterial({ color: 0x2a1810, roughness: 0.8 });
    const weaponGroup = new THREE.Group();

    if (this.charData.weapon === 'sword') {
      // Katana: handle, guard, curved blade
      const handle = createPart(new THREE.CylinderGeometry(0.035, 0.035, 0.32, 10), weaponHandleMat, 0, 0.16, 0);
      const guard = createPart(new THREE.CylinderGeometry(0.11, 0.11, 0.03, 12), new THREE.MeshStandardMaterial({ color: 0x8b6b3a, metalness: 0.8, roughness: 0.3 }), 0, 0.34, 0);
      const blade = createPart(new THREE.BoxGeometry(0.055, 1.5, 0.11), weaponMat, 0, 1.1, 0);
      // Slight curve
      blade.rotation.z = -0.06;
      const tip = createPart(new THREE.ConeGeometry(0.055, 0.16, 4), weaponMat, 0.04, 1.87, 0);
      weaponGroup.add(handle, guard, blade, tip);
    } else if (this.charData.weapon === 'staff') {
      // Bo staff: long shaft with end caps
      const shaft = createPart(new THREE.CylinderGeometry(0.045, 0.045, 2.4, 12), weaponHandleMat, 0, 1.2, 0);
      const cap1 = createPart(new THREE.CylinderGeometry(0.06, 0.06, 0.14, 12), primaryMat, 0, 2.4, 0);
      const cap2 = createPart(new THREE.CylinderGeometry(0.06, 0.06, 0.14, 12), primaryMat, 0, 0, 0);
      weaponGroup.add(shaft, cap1, cap2);
      weaponGroup.rotation.z = Math.PI / 2;
      weaponGroup.position.set(0, 0, 0);
    } else if (this.charData.weapon === 'spear') {
      // Spear: long shaft + spearhead
      const shaft = createPart(new THREE.CylinderGeometry(0.04, 0.04, 2.6, 12), weaponHandleMat, 0, 1.3, 0);
      const collar = createPart(new THREE.CylinderGeometry(0.07, 0.07, 0.08, 12), primaryMat, 0, 2.62, 0);
      const blade = createPart(new THREE.ConeGeometry(0.11, 0.5, 6), weaponMat, 0, 2.9, 0);
      const bladeAccent = createPart(new THREE.BoxGeometry(0.02, 0.3, 0.02), accentGlowMat, 0.08, 2.85, 0);
      weaponGroup.add(shaft, collar, blade, bladeAccent);
      weaponGroup.rotation.z = Math.PI / 2;
    } else if (this.charData.weapon === 'nunchaku') {
      // Nunchaku: two sticks + chain
      const stick1 = createPart(new THREE.CylinderGeometry(0.05, 0.05, 0.6, 10), weaponHandleMat, -0.18, 0, 0);
      const stick2 = createPart(new THREE.CylinderGeometry(0.05, 0.05, 0.6, 10), weaponHandleMat, 0.18, 0, 0);
      const cap1 = createPart(new THREE.CylinderGeometry(0.06, 0.06, 0.06, 10), primaryMat, -0.18, 0.33, 0);
      const cap2 = createPart(new THREE.CylinderGeometry(0.06, 0.06, 0.06, 10), primaryMat, 0.18, -0.33, 0);
      // Chain (multiple small links)
      for (let i = 0; i < 4; i++) {
        const link = createPart(new THREE.TorusGeometry(0.025, 0.012, 6, 10), weaponMat, 0, (i - 1.5) * 0.05, 0);
        link.rotation.y = i % 2 === 0 ? 0 : Math.PI / 2;
        weaponGroup.add(link);
      }
      weaponGroup.add(stick1, stick2, cap1, cap2);
    } else if (this.charData.weapon === 'chakram') {
      // Chakram: ring with inner core
      const ring = createPart(new THREE.TorusGeometry(0.32, 0.05, 10, 28), weaponMat, 0, 0, 0);
      const innerRing = createPart(new THREE.TorusGeometry(0.2, 0.02, 8, 20), accentGlowMat, 0, 0, 0);
      const core = createPart(new THREE.SphereGeometry(0.09, 12, 12), weaponGlow, 0, 0, 0);
      weaponGroup.add(ring, innerRing, core);
    } else if (this.charData.weapon === 'tonfa') {
      // Tonfa: side-handle baton
      const baton = createPart(new THREE.BoxGeometry(0.1, 0.75, 0.1), weaponMat, 0, 0, 0);
      const batonTip = createPart(new THREE.BoxGeometry(0.12, 0.06, 0.12), primaryMat, 0, 0.4, 0);
      const handle = createPart(new THREE.BoxGeometry(0.08, 0.28, 0.08), weaponHandleMat, 0.16, 0, 0);
      handle.rotation.z = Math.PI / 2;
      const grip = createPart(new THREE.BoxGeometry(0.06, 0.06, 0.14), accentGlowMat, 0.16, 0.14, 0);
      weaponGroup.add(baton, batonTip, handle, grip);
    } else if (this.charData.weapon === 'gauntlet') {
      // Arc gauntlet: heavy armored fist with energy ring
      const glove = createPart(new THREE.BoxGeometry(0.32, 0.4, 0.32), secMat, 0, 0, 0);
      const knuckle = createPart(new THREE.BoxGeometry(0.34, 0.1, 0.34), primaryMat, 0, 0.16, 0);
      const energyRing = createPart(new THREE.TorusGeometry(0.17, 0.035, 8, 20), weaponGlow, 0, -0.05, 0.14);
      energyRing.rotation.x = Math.PI / 2;
      const energyRing2 = createPart(new THREE.TorusGeometry(0.17, 0.035, 8, 20), weaponGlow, 0, -0.05, -0.14);
      energyRing2.rotation.x = Math.PI / 2;
      weaponGroup.add(glove, knuckle, energyRing, energyRing2);
    } else if (this.charData.weapon === 'bow') {
      // Energy bow: curved limbs + string
      const upperLimb = createPart(new THREE.TorusGeometry(0.45, 0.04, 8, 20, Math.PI / 2), primaryMat, 0, 0.42, 0);
      upperLimb.rotation.z = Math.PI;
      const lowerLimb = createPart(new THREE.TorusGeometry(0.45, 0.04, 8, 20, Math.PI / 2), primaryMat, 0, -0.42, 0);
      const grip = createPart(new THREE.CylinderGeometry(0.045, 0.045, 0.3, 10), weaponHandleMat, 0, 0, 0);
      const string = createPart(new THREE.CylinderGeometry(0.008, 0.008, 1.85, 6), weaponGlow, 0, 0, -0.05);
      weaponGroup.add(upperLimb, lowerLimb, grip, string);
    }

    // Position weapon in right hand / near right arm
    weaponGroup.position.set(-0.75, 1.35, 0.15);
    this.mesh.add(weaponGroup);
    this.weaponVisual = weaponGroup;

    // ============================================================
    // AURA RING
    // ============================================================
    const ringGeo = new THREE.TorusGeometry(0.75, 0.025, 8, 28);
    const ringMat = new THREE.MeshBasicMaterial({ color: primaryColor, wireframe: true, transparent: true, opacity: 0.7 });
    this.auraRing = new THREE.Mesh(ringGeo, ringMat);
    this.auraRing.rotation.x = Math.PI / 2;
    this.auraRing.position.y = 0.05;
    this.mesh.add(this.auraRing);
  }

  animate(delta, time, opponentPos) {
    const THREE = this.THREE;

    if (opponentPos && this.state !== 'KO') {
      this.facingRight = opponentPos.x > this.mesh.position.x;
      this.mesh.rotation.y = this.facingRight ? Math.PI / 2 : -Math.PI / 2;
    }

    if (!this.isGrounded) {
      this.velocity.y -= 25 * delta;
      this.mesh.position.y += this.velocity.y * delta;
      if (this.mesh.position.y <= 0) {
        this.mesh.position.y = 0;
        this.isGrounded = true;
        this.velocity.y = 0;
        if (this.state === 'JUMPING') this.state = 'IDLE';
      }
    }

    const idleBreath = Math.sin(time * 4) * 0.02;
    this.torso.position.y = 1.85 + idleBreath;
    this.head.position.y = 2.72 + idleBreath;
    this.neck.position.y = 2.46 + idleBreath;
    this.auraRing.rotation.z += delta * 2;

    let targetLArm = { x: -0.3, z: 0.2 };
    let targetRArm = { x: -0.3, z: -0.2 };
    let targetLLeg = { x: 0, z: 0 };
    let targetRLeg = { x: 0, z: 0 };

    if (this.stateTimer > 0) {
      this.stateTimer -= delta;
      const progress = 1 - (this.stateTimer / this.actionDuration);

      if (this.state === 'LIGHT') {
        const swing = Math.sin(progress * Math.PI);
        targetLArm.x = -1.2 - swing * (this.charData.weapon === 'sword' ? 1.35 : 0.8);
        targetRArm.x = -0.5 - swing * 0.35;
      } else if (this.state === 'HEAVY') {
        const swing = Math.sin(progress * Math.PI);
        targetLArm.x = -1.0 - swing * 1.75;
        targetRArm.x = -0.9 - swing * 1.1;
        targetRLeg.x = -swing * 0.5;
      } else if (this.state === 'PUNCHING') {
        const ext = Math.sin(progress * Math.PI);
        targetLArm.x = -Math.PI / 2 - ext * 0.8;
      } else if (this.state === 'KICKING') {
        const ext = Math.sin(progress * Math.PI);
        targetRLeg.x = -ext * 1.5;
      } else if (this.state === 'SPECIAL') {
        const ext = Math.sin(progress * Math.PI);
        targetLArm.x = -Math.PI / 1.5 - ext * 0.5;
        targetRArm.x = -Math.PI / 1.5 - ext * 0.5;
        this.auraRing.scale.setScalar(1 + ext * 1.2);
      } else if (this.state === 'BLOCKING') {
        targetLArm.x = -Math.PI / 1.3;
        targetRArm.x = -Math.PI / 1.3;
        targetLArm.z = 0.5;
        targetRArm.z = -0.5;
      } else if (this.state === 'HIT') {
        this.torso.rotation.x = -0.3;
        this.head.rotation.x = -0.4;
      }
    } else {
      if (this.state !== 'IDLE' && this.state !== 'WALKING' && this.state !== 'JUMPING' && this.state !== 'KO') {
        this.state = 'IDLE';
        this.torso.rotation.x = 0;
        this.head.rotation.x = 0;
        this.auraRing.scale.setScalar(1);
      }
    }

    if (this.state === 'KO') {
      this.mesh.rotation.z = this.facingRight ? -Math.PI / 2 : Math.PI / 2;
      this.mesh.position.y = 0.3;
    } else {
      const lerpSpd = 18 * delta;
      this.leftArm.rotation.x += (targetLArm.x - this.leftArm.rotation.x) * lerpSpd;
      this.leftArm.rotation.z += (targetLArm.z - this.leftArm.rotation.z) * lerpSpd;
      this.rightArm.rotation.x += (targetRArm.x - this.rightArm.rotation.x) * lerpSpd;
      this.rightArm.rotation.z += (targetRArm.z - this.rightArm.rotation.z) * lerpSpd;
      this.leftLeg.rotation.x += (targetLLeg.x - this.leftLeg.rotation.x) * lerpSpd;
      this.rightLeg.rotation.x += (targetRLeg.x - this.rightLeg.rotation.x) * lerpSpd;
    }
  }

  jump() {
    if (this.isGrounded && this.stateTimer <= 0 && this.state !== 'KO') {
      this.velocity.y = 10;
      this.isGrounded = false;
      this.state = 'JUMPING';
    }
  }

  attack(type) {
    if (this.stateTimer > 0 || this.state === 'KO') return false;
    this.state = type;
    this.hasHitThisAttack = false;
    if (type === 'PUNCHING') {
      this.actionDuration = 0.34 / (this.weapon.speed || 1);
      sfx.playPunch();
    } else if (type === 'KICKING') {
      this.actionDuration = 0.45 / (this.weapon.speed || 1);
      sfx.playKick();
    } else if (type === 'SPECIAL') {
      if (this.superMeter < 100) return false;
      this.superMeter = 0;
      this.actionDuration = 0.85;
      sfx.playSpecial();
    }
    this.stateTimer = this.actionDuration;
    return true;
  }

  weaponAttack(type) {
    if (this.stateTimer > 0 || this.state === 'KO') return false;
    this.state = type;
    this.hasHitThisAttack = false;
    this.actionDuration = (type === 'LIGHT' ? 0.34 : 0.52) / (this.weapon.speed || 1);
    this.stateTimer = this.actionDuration;
    if (this.charData.ability === 'Overcharge' && type === 'HEAVY') {
      this.charge = Math.min(100, this.charge + 25);
    }
    if (this.charData.ability === 'Momentum' && type === 'LIGHT') {
      this.comboBoost = Math.min(0.55, this.comboBoost + 0.08);
    }
    sfx.playWeapon();
    return true;
  }

  takeDamage(amount) {
    if (this.state === 'KO') return;
    if (this.evade) { this.evade = false; return; }
    if (this.charData.ability === 'Fortify' && this.state === 'BLOCKING') amount *= 0.10;

    if (this.state === 'BLOCKING') {
      amount *= 0.15;
    } else {
      this.state = 'HIT';
      this.stateTimer = 0.35;
      this.actionDuration = 0.35;
    }

    this.superMeter = Math.min(100, this.superMeter + amount * 1.2);
    this.health = Math.max(0, this.health - amount);

    if (this.health <= 0) {
      this.state = 'KO';
      sfx.playKO();
    }
  }

  resetForNewRound(startPos) {
    this.health = this.maxHealth;
    this.state = 'IDLE';
    this.stateTimer = 0;
    this.isGrounded = true;
    this.velocity.set(0, 0, 0);
    this.evade = false;
    this.charge = 0;
    this.comboBoost = 0;
    this.mesh.position.set(startPos.x, 0, startPos.z);
    this.mesh.rotation.set(0, 0, 0);
  }
}

class ArcadeEngine {
  constructor(canvas, p1Char, p2Char, updateUI, onRoundEnd, onMatchEnd) {
    this.canvas = canvas;
    this.updateUI = updateUI;
    this.onRoundEnd = onRoundEnd;
    this.onMatchEnd = onMatchEnd;
    this.THREE = window.THREE;
    this.active = true;
    this.paused = false;

    this.round = 1;
    this.p1Wins = 0;
    this.p2Wins = 0;
    this.roundTime = 99;
    this.roundTimerAcc = 0;
    this.comboCountP1 = 0;
    this.comboTimerP1 = 0;
    this.comboCountP2 = 0;
    this.comboTimerP2 = 0;

    this.projectiles = [];
    this.hitParticles = [];
    this.cameraShake = 0;

    this.keys = {};

    this.initScene();
    this.initFighters(p1Char, p2Char);
    this.setupInputs();

    this.lastTime = performance.now();
    this.loop = this.loop.bind(this);
    requestAnimationFrame(this.loop);
  }

  initScene() {
    const THREE = this.THREE;
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x030308);
    this.scene.fog = new THREE.FogExp2(0x030308, 0.04);

    this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
    this.camera.position.set(0, 2.5, 7.5);

    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const ambient = new THREE.AmbientLight(0xffffff, 0.35);
    this.scene.add(ambient);

    const keyLight = new THREE.DirectionalLight(0xffffff, 0.4);
    keyLight.position.set(0, 8, 6);
    keyLight.castShadow = true;
    this.scene.add(keyLight);

    const light1 = new THREE.PointLight(0x00f0ff, 1.5, 20);
    light1.position.set(-6, 6, 3);
    this.scene.add(light1);

    const light2 = new THREE.PointLight(0xff0055, 1.5, 20);
    light2.position.set(6, 6, 3);
    this.scene.add(light2);

    const grid = new THREE.GridHelper(24, 24, 0x00f0ff, 0x221144);
    grid.position.y = 0.01;
    this.scene.add(grid);

    const floorGeo = new THREE.PlaneGeometry(24, 24);
    const floorMat = new THREE.MeshStandardMaterial({ color: 0x050510, roughness: 0.8 });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    this.scene.add(floor);

    for (let i = -10; i <= 10; i += 4) {
      const pGeo = new THREE.BoxGeometry(0.6, 8, 0.6);
      const pMat = new THREE.MeshStandardMaterial({ color: 0x111122, metalness: 0.8 });
      const p = new THREE.Mesh(pGeo, pMat);
      p.position.set(i, 4, -6);
      this.scene.add(p);
    }

    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  initFighters(p1Char, p2Char) {
    this.p1 = new ArcadeFighter(p1Char, false, { x: -2.5, z: 0 }, this.THREE);
    this.p2 = new ArcadeFighter(p2Char, true, { x: 2.5, z: 0 }, this.THREE);

    this.scene.add(this.p1.mesh);
    this.scene.add(this.p2.mesh);
  }

  setupInputs() {
    this.handleKeyDown = (e) => { this.keys[e.key.toLowerCase()] = true; };
    this.handleKeyUp = (e) => { this.keys[e.key.toLowerCase()] = false; };
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
  }

  spawnProjectile(attacker, defender) {
    const THREE = this.THREE;
    const pGeo = new THREE.SphereGeometry(0.35, 16, 16);
    const pMat = new THREE.MeshBasicMaterial({ color: attacker.charData.hexColor });
    const mesh = new THREE.Mesh(pGeo, pMat);

    const startX = attacker.mesh.position.x + (attacker.facingRight ? 1 : -1);
    mesh.position.set(startX, 1.8, attacker.mesh.position.z);
    this.scene.add(mesh);

    this.projectiles.push({
      mesh,
      dir: attacker.facingRight ? 1 : -1,
      owner: attacker,
      target: defender,
      speed: 12
    });
  }

  spawnHitParticles(pos, colorHex) {
    const THREE = this.THREE;
    for (let i = 0; i < 12; i++) {
      const pGeo = new THREE.BoxGeometry(0.08, 0.08, 0.08);
      const pMat = new THREE.MeshBasicMaterial({ color: colorHex });
      const p = new THREE.Mesh(pGeo, pMat);
      p.position.copy(pos);
      this.scene.add(p);

      const vel = new THREE.Vector3(
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 8
      );

      this.hitParticles.push({ mesh: p, vel, life: 0.3 });
    }
  }

  processPlayerInput(delta) {
    if (this.p1.state === 'KO' || this.p1.stateTimer > 0) return;

    const moveSpeed = 4.5 * delta;

    if (this.keys['a']) {
      this.p1.mesh.position.x -= moveSpeed;
      if (this.p1.isGrounded) this.p1.state = 'WALKING';
    } else if (this.keys['d']) {
      this.p1.mesh.position.x += moveSpeed;
      if (this.p1.isGrounded) this.p1.state = 'WALKING';
    }

    if (this.keys['w'] || this.keys[' ']) {
      this.p1.jump();
    }

    if (this.keys['j']) this.p1.weaponAttack('LIGHT');
    if (this.keys['k']) this.p1.weaponAttack('HEAVY');
    if (this.keys['i']) {
      if (this.p1.attack('SPECIAL')) {
        this.spawnProjectile(this.p1, this.p2);
      }
    }
    if (this.keys['l']) {
      this.p1.state = 'BLOCKING';
      this.p1.stateTimer = 0.1;
      this.p1.actionDuration = 0.1;
    }
  }

  processAIInput(delta) {
    if (this.p2.state === 'KO' || this.p2.stateTimer > 0) return;

    const dist = Math.abs(this.p1.mesh.position.x - this.p2.mesh.position.x);

    if (dist > 2.2) {
      const dir = this.p1.mesh.position.x > this.p2.mesh.position.x ? 1 : -1;
      this.p2.mesh.position.x += dir * 3.5 * delta;
      this.p2.state = 'WALKING';
    } else {
      const roll = Math.random();

      if (this.p2.superMeter >= 100 && roll < 0.05) {
        if (this.p2.attack('SPECIAL')) {
          this.spawnProjectile(this.p2, this.p1);
        }
      } else if (this.p1.stateTimer > 0 && roll < 0.3) {
        this.p2.state = 'BLOCKING';
        this.p2.stateTimer = 0.2;
        this.p2.actionDuration = 0.2;
      } else if (roll < 0.04) {
        this.p2.weaponAttack('LIGHT');
      } else if (roll < 0.08) {
        this.p2.weaponAttack('HEAVY');
      }
    }
  }

  checkHitboxes() {
    const evaluateAttack = (attacker, defender, isP1) => {
      if (attacker.stateTimer <= 0 || attacker.hasHitThisAttack) return;
      if (!['LIGHT','HEAVY'].includes(attacker.state)) return;
      const progress = 1 - (attacker.stateTimer / attacker.actionDuration);
      if (progress < 0.32 || progress > 0.72) return;
      attacker.hasHitThisAttack = true;

      const w = attacker.weapon;
      const dist = Math.abs(attacker.mesh.position.x - defender.mesh.position.x);
      const range = w.range + (attacker.charData.ability === 'Reach' ? 0.45 : 0);
      if (dist > range) {
        if (['bow','chakram'].includes(attacker.charData.weapon)) {
          this.spawnWeaponProjectile(attacker, defender, attacker.state === 'HEAVY');
        }
        return;
      }

      let damage = attacker.state === 'LIGHT' ? w.lightDamage : w.heavyDamage;
      if (attacker.charData.ability === 'Overcharge' && attacker.state === 'HEAVY') {
        damage += attacker.charge * 0.08;
        attacker.charge = 0;
      }
      if (attacker.charData.ability === 'Momentum') damage *= 1 + attacker.comboBoost;
      if (attacker.charData.ability === 'Deadeye' && attacker.state === 'HEAVY') damage *= 1.18;

      defender.takeDamage(damage * (attacker.charData.power / 80));
      attacker.superMeter = Math.min(100, attacker.superMeter + 14);

      if (isP1) { this.comboCountP1++; this.comboTimerP1 = 1.45; }
      else { this.comboCountP2++; this.comboTimerP2 = 1.45; }

      this.spawnHitParticles(
        defender.mesh.position.clone().add(new this.THREE.Vector3(0, 1.7, 0)),
        attacker.charData.hexColor
      );
      this.cameraShake = attacker.state === 'HEAVY' ? 0.3 : 0.18;

      if (attacker.charData.weapon === 'spear' && attacker.state === 'HEAVY') {
        defender.velocity.x += attacker.facingRight ? 2.4 : -2.4;
      }
      if (attacker.charData.weapon === 'nunchaku' && attacker.state === 'HEAVY') {
        defender.takeDamage(5 * (attacker.charData.power / 80));
      }
      if (attacker.charData.weapon === 'chakram' && attacker.state === 'HEAVY') {
        setTimeout(() => {
          if (this.active && defender.state !== 'KO') {
            defender.takeDamage(7 * (attacker.charData.power / 80));
            this.spawnHitParticles(defender.mesh.position.clone().add(new this.THREE.Vector3(0, 1.6, 0)), attacker.charData.hexColor);
          }
        }, 180);
      }
    };

    evaluateAttack(this.p1, this.p2, true);
    evaluateAttack(this.p2, this.p1, false);
  }

  spawnWeaponProjectile(attacker, defender, heavy=false) {
    const THREE = this.THREE;
    const color = attacker.charData.hexColor;
    const isArrow = attacker.charData.weapon === 'bow';
    const geo = isArrow
      ? new THREE.CylinderGeometry(0.035,0.035,0.8,6)
      : new THREE.TorusGeometry(0.22,0.045,8,18);
    const mesh = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({color}));
    mesh.position.set(
      attacker.mesh.position.x + (attacker.facingRight ? 0.9 : -0.9),
      isArrow ? 1.65 : 1.5,
      0
    );
    if (isArrow) mesh.rotation.z = attacker.facingRight ? -Math.PI/2 : Math.PI/2;
    this.scene.add(mesh);
    this.projectiles.push({
      mesh, dir: attacker.facingRight ? 1 : -1, owner: attacker, target: defender,
      speed: isArrow ? 15 : 11, damage: (heavy ? attacker.weapon.heavyDamage : attacker.weapon.lightDamage) * (heavy ? 1.1 : 0.85), life: 2.2
    });
  }

  updateProjectiles(delta) {
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const proj = this.projectiles[i];
      proj.mesh.position.x += proj.dir * proj.speed * delta;

      const dist = proj.mesh.position.distanceTo(proj.target.mesh.position.clone().add(new this.THREE.Vector3(0, 1.8, 0)));
      if (dist < 1.2) {
        proj.target.takeDamage(25);
        this.spawnHitParticles(proj.mesh.position, proj.owner.charData.hexColor);
        this.scene.remove(proj.mesh);
        this.projectiles.splice(i, 1);
        this.cameraShake = 0.35;
      } else if (Math.abs(proj.mesh.position.x) > 12) {
        this.scene.remove(proj.mesh);
        this.projectiles.splice(i, 1);
      }
    }

    for (let i = this.hitParticles.length - 1; i >= 0; i--) {
      const p = this.hitParticles[i];
      p.life -= delta;
      p.mesh.position.addScaledVector(p.vel, delta);
      if (p.life <= 0) {
        this.scene.remove(p.mesh);
        this.hitParticles.splice(i, 1);
      }
    }
  }

  loop(timestamp) {
    if (!this.active) return;

    const delta = Math.min(0.05, (timestamp - this.lastTime) / 1000);
    this.lastTime = timestamp;

    if (!this.paused) {
      this.roundTimerAcc += delta;
      if (this.roundTimerAcc >= 1.0 && this.roundTime > 0) {
        this.roundTime--;
        this.roundTimerAcc = 0;
      }

      if (this.comboTimerP1 > 0) {
        this.comboTimerP1 -= delta;
        if (this.comboTimerP1 <= 0) this.comboCountP1 = 0;
      }
      if (this.comboTimerP2 > 0) {
        this.comboTimerP2 -= delta;
        if (this.comboTimerP2 <= 0) this.comboCountP2 = 0;
      }

      this.processPlayerInput(delta);
      this.processAIInput(delta);
      this.checkHitboxes();
      this.updateProjectiles(delta);

      this.p1.mesh.position.x = Math.max(-8, Math.min(8, this.p1.mesh.position.x));
      this.p2.mesh.position.x = Math.max(-8, Math.min(8, this.p2.mesh.position.x));

      this.p1.animate(delta, timestamp / 1000, this.p2.mesh.position);
      this.p2.animate(delta, timestamp / 1000, this.p1.mesh.position);

      if (this.p1.health <= 0 || this.p2.health <= 0 || this.roundTime <= 0) {
        this.handleRoundEnd();
      }
    }

    const midX = (this.p1.mesh.position.x + this.p2.mesh.position.x) / 2;
    this.camera.position.x += (midX - this.camera.position.x) * delta * 3;

    if (this.cameraShake > 0) {
      this.cameraShake -= delta;
      this.camera.position.x += (Math.random() - 0.5) * 0.3;
      this.camera.position.y = 2.5 + (Math.random() - 0.5) * 0.3;
    } else {
      this.camera.position.y = 2.5;
    }

    this.renderer.render(this.scene, this.camera);

    this.updateUI({
      p1Health: this.p1.health,
      p2Health: this.p2.health,
      p1Super: this.p1.superMeter,
      p2Super: this.p2.superMeter,
      roundTime: this.roundTime,
      round: this.round,
      p1Wins: this.p1Wins,
      p2Wins: this.p2Wins,
      comboP1: this.comboCountP1,
      comboP2: this.comboCountP2
    });

    requestAnimationFrame(this.loop);
  }

  handleRoundEnd() {
    this.paused = true;

    let winner = null;
    if (this.p1.health > this.p2.health) {
      this.p1Wins++;
      winner = 'P1';
    } else if (this.p2.health > this.p1.health) {
      this.p2Wins++;
      winner = 'P2';
    }

    if (this.p1Wins >= 2 || this.p2Wins >= 2) {
      this.onMatchEnd(this.p1Wins >= 2 ? 'PLAYER 1' : 'AI OPPONENT');
    } else {
      this.onRoundEnd(winner, () => {
        this.round++;
        this.roundTime = 99;
        this.p1.resetForNewRound({ x: -2.5, z: 0 });
        this.p2.resetForNewRound({ x: 2.5, z: 0 });
        this.paused = false;
      });
    }
  }

  destroy() {
    this.active = false;
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
    if (this.renderer) this.renderer.dispose();
  }
}

// ============================================================================
// STYLES OBJECT
// ============================================================================
const styles = {
  container: {
    position: 'relative',
    height: '100vh',
    width: '100%',
    background: '#000',
    overflow: 'hidden',
    userSelect: 'none',
    fontFamily: 'monospace'
  },
  canvas: {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    display: 'block'
  },
  scanlineOverlay: {
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
    opacity: 0.04,
    background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))',
    backgroundSize: '100% 3px, 3px 100%'
  },
  errorScreen: {
    display: 'flex',
    height: '100vh',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#000',
    color: '#ef4444',
    fontFamily: 'monospace'
  },

  // Splash
  splash: {
    position: 'absolute',
    inset: 0,
    zIndex: 40,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(0,0,0,0.9)',
    color: '#fff',
    fontFamily: 'monospace',
    userSelect: 'none',
    padding: '1.5rem'
  },
  splashRadial: {
    position: 'absolute',
    inset: 0,
    background: 'radial-gradient(circle at center, rgba(0,240,255,0.15) 0, transparent 70%)',
    pointerEvents: 'none'
  },
  splashSubtitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginBottom: '0.5rem',
    color: '#22d3ee',
    letterSpacing: '0.1em',
    fontSize: '0.875rem',
    textTransform: 'uppercase',
    animation: 'pulse 2s infinite'
  },
  splashTitle: {
    fontSize: 'clamp(3rem, 10vw, 6rem)',
    fontWeight: 900,
    fontStyle: 'italic',
    letterSpacing: '-0.05em',
    background: 'linear-gradient(to right, #22d3ee, #d946ef, #facc15)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '1.5rem',
    filter: 'drop-shadow(0 0 35px rgba(0,240,255,0.6))'
  },
  splashDesc: {
    color: '#9ca3af',
    fontSize: '0.875rem',
    maxWidth: '28rem',
    textAlign: 'center',
    marginBottom: '2.5rem',
    lineHeight: 1.6
  },
  splashButton: {
    padding: '1.25rem 2.5rem',
    background: 'linear-gradient(to right, #06b6d4, #2563eb)',
    borderRadius: '0.75rem',
    fontWeight: 700,
    fontSize: '1.25rem',
    letterSpacing: '0.1em',
    color: '#000',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    transition: 'all 0.2s',
    border: 'none'
  },

  // Character select
  charSelect: {
    position: 'absolute',
    inset: 0,
    zIndex: 40,
    background: '#030712',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: 'monospace',
    color: '#fff',
    userSelect: 'none',
    overflowY: 'auto',
    WebkitOverflowScrolling: 'touch'
  },
  charSelectInner: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100%',
    padding: '1.5rem',
    gap: '1.5rem'
  },
  charSelectHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid rgba(21,94,117,0.5)',
    paddingBottom: '1rem',
    flexShrink: 0
  },
  backButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    color: '#22d3ee',
    fontSize: '0.875rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontFamily: 'monospace'
  },
  charSelectTitle: {
    fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
    fontWeight: 800,
    fontStyle: 'italic',
    background: 'linear-gradient(to right, #22d3ee, #d946ef)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  },
  rosterCount: {
    fontSize: '0.75rem',
    color: '#6b7280'
  },
  rosterGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '1rem',
    flexShrink: 0
  },
  rosterCard: {
    position: 'relative',
    borderRadius: '0.75rem',
    padding: '1rem',
    cursor: 'pointer',
    transition: 'all 0.2s',
    border: '2px solid #1f2937',
    overflow: 'hidden',
    background: 'rgba(17,24,39,0.8)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '12rem'
  },
  rosterCardP1: {
    borderColor: '#22d3ee',
    boxShadow: '0 0 20px rgba(0,240,255,0.5)',
    transform: 'scale(1.05)'
  },
  rosterCardP2: {
    borderColor: '#ef4444',
    boxShadow: '0 0 20px rgba(255,0,85,0.5)'
  },
  rosterCardTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  rosterCardTitle: {
    fontSize: '0.75rem',
    fontWeight: 700,
    padding: '0.125rem 0.5rem',
    borderRadius: '0.25rem',
    background: 'rgba(0,0,0,0.6)'
  },
  rosterBadge: {
    fontSize: '0.625rem',
    fontWeight: 800,
    padding: '0.125rem 0.375rem',
    borderRadius: '0.25rem',
    color: '#000'
  },
  rosterCardName: {
    fontSize: '1.5rem',
    fontWeight: 900,
    fontStyle: 'italic',
    margin: '0.5rem 0'
  },
  statRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.625rem',
    color: '#9ca3af'
  },
  statBarBg: {
    width: '4rem',
    height: '0.375rem',
    background: '#1f2937',
    borderRadius: '0.25rem',
    overflow: 'hidden'
  },
  statBarFill: {
    height: '100%'
  },
  weaponLoadout: {
    background: 'rgba(17,24,39,0.8)',
    border: '1px solid rgba(112,26,117,0.5)',
    borderRadius: '0.75rem',
    padding: '1rem',
    flexShrink: 0
  },
  weaponLoadoutTitle: {
    fontSize: '0.625rem',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    color: '#e879f9',
    fontWeight: 700,
    marginBottom: '0.5rem'
  },
  weaponButtons: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem'
  },
  weaponButton: {
    padding: '0.5rem 0.75rem',
    borderRadius: '0.5rem',
    border: '1px solid #374151',
    background: '#030712',
    color: '#9ca3af',
    fontSize: '0.625rem',
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'all 0.2s',
    fontFamily: 'monospace'
  },
  weaponButtonActive: {
    borderColor: '#22d3ee',
    background: 'rgba(34,211,238,0.15)',
    color: '#67e8f9'
  },
  weaponStats: {
    fontSize: '0.5625rem',
    color: '#6b7280',
    marginTop: '0.5rem'
  },
  selectedPreview: {
    background: 'rgba(17,24,39,0.9)',
    border: '1px solid rgba(21,94,117,0.6)',
    borderRadius: '0.75rem',
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1.5rem',
    flexShrink: 0
  },
  selectedPreviewInner: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    width: '100%'
  },
  selectedAvatar: {
    width: '4rem',
    height: '4rem',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.5rem',
    fontWeight: 900,
    border: '2px solid',
    flexShrink: 0
  },
  selectedName: {
    fontSize: '1.25rem',
    fontWeight: 700,
    color: '#fff'
  },
  selectedQuote: {
    fontSize: '0.75rem',
    color: '#9ca3af',
    fontStyle: 'italic'
  },
  selectedWeaponInfo: {
    fontSize: '0.75rem',
    color: '#22d3ee',
    marginTop: '0.25rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem'
  },
  confirmButton: {
    width: '100%',
    padding: '1rem 2rem',
    background: 'linear-gradient(to right, #22d3ee, #d946ef)',
    borderRadius: '0.5rem',
    fontWeight: 800,
    color: '#000',
    letterSpacing: '0.1em',
    cursor: 'pointer',
    transition: 'all 0.2s',
    border: 'none',
    boxShadow: '0 0 25px rgba(0,240,255,0.4)',
    fontFamily: 'monospace'
  },

  // HUD
  hud: {
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
    padding: '1rem 2rem',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    fontFamily: 'monospace',
    userSelect: 'none'
  },
  hudTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '1rem'
  },
  healthSection: {
    flex: 1,
    maxWidth: '28rem'
  },
  healthSectionRight: {
    flex: 1,
    maxWidth: '28rem',
    textAlign: 'right'
  },
  healthHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.75rem',
    fontWeight: 700,
    marginBottom: '0.25rem'
  },
  winDots: {
    display: 'flex',
    gap: '0.25rem'
  },
  winDot: {
    width: '0.75rem',
    height: '0.75rem',
    borderRadius: '50%',
    border: '1px solid'
  },
  healthBarBg: {
    width: '100%',
    height: '1.5rem',
    background: '#030712',
    border: '2px solid',
    borderRadius: '0.125rem',
    overflow: 'hidden'
  },
  healthBarFill: {
    height: '100%',
    transition: 'width 0.1s'
  },
  superBarBg: {
    width: '100%',
    height: '0.5rem',
    background: '#111827',
    border: '1px solid',
    borderRadius: '0.125rem',
    marginTop: '0.25rem',
    overflow: 'hidden'
  },
  superBarFill: {
    height: '100%',
    transition: 'all 0.3s'
  },
  timerBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    background: 'rgba(3,7,18,0.9)',
    border: '1px solid rgba(34,211,238,0.6)',
    padding: '0.5rem 1.25rem',
    borderRadius: '0.75rem',
    boxShadow: '0 0 20px rgba(0,240,255,0.2)'
  },
  timerRound: {
    fontSize: '0.625rem',
    color: '#9ca3af',
    textTransform: 'uppercase',
    letterSpacing: '0.1em'
  },
  timerValue: {
    fontSize: 'clamp(1.875rem, 4vw, 2.25rem)',
    fontWeight: 900,
    color: '#facc15'
  },
  comboRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 'auto 0'
  },
  comboP1: {
    fontSize: '1.875rem',
    fontWeight: 900,
    fontStyle: 'italic',
    color: '#22d3ee'
  },
  comboP2: {
    fontSize: '1.875rem',
    fontWeight: 900,
    fontStyle: 'italic',
    color: '#ef4444'
  },
  hudBottom: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end'
  },
  controlsBox: {
    background: 'rgba(0,0,0,0.8)',
    border: '1px solid rgba(21,94,117,0.6)',
    padding: '0.75rem',
    borderRadius: '0.5rem',
    fontSize: '0.6875rem',
    color: '#d1d5db',
    lineHeight: 1.6
  },
  controlsTitle: {
    color: '#22d3ee',
    fontWeight: 700,
    marginBottom: '0.25rem'
  },
  kbd: {
    background: '#1f2937',
    padding: '0.125rem 0.25rem',
    borderRadius: '0.125rem'
  },
  pauseButton: {
    padding: '0.75rem',
    background: 'rgba(17,24,39,0.9)',
    border: '1px solid rgba(34,211,238,0.5)',
    borderRadius: '50%',
    color: '#22d3ee',
    cursor: 'pointer',
    pointerEvents: 'auto',
    transition: 'all 0.2s',
    boxShadow: '0 0 15px rgba(0,240,255,0.3)'
  },

  // Announcer
  announcerOverlay: {
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
    zIndex: 30,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  announcerText: {
    fontSize: 'clamp(3rem, 8vw, 6rem)',
    fontWeight: 900,
    fontStyle: 'italic',
    letterSpacing: '-0.05em',
    color: '#facc15',
    filter: 'drop-shadow(0 0 40px rgba(255,200,0,0.8))',
    animation: 'pulse 1s infinite'
  },

  // Pause
  pauseMenu: {
    position: 'absolute',
    inset: 0,
    zIndex: 50,
    background: 'rgba(0,0,0,0.8)',
    backdropFilter: 'blur(12px)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'monospace',
    color: '#fff',
    padding: '1.5rem'
  },
  pauseTitle: {
    fontSize: '2.25rem',
    fontWeight: 800,
    fontStyle: 'italic',
    color: '#22d3ee',
    marginBottom: '2rem'
  },
  pauseButtons: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    width: '16rem'
  },
  pauseButtonPrimary: {
    padding: '0.75rem',
    background: '#22d3ee',
    color: '#000',
    fontWeight: 700,
    borderRadius: '0.5rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    border: 'none',
    transition: 'all 0.2s',
    fontFamily: 'monospace'
  },
  pauseButtonSecondary: {
    padding: '0.75rem',
    background: '#1f2937',
    color: '#22d3ee',
    border: '1px solid #155e75',
    fontWeight: 700,
    borderRadius: '0.5rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    transition: 'all 0.2s',
    fontFamily: 'monospace'
  },

  // Match Over
  matchOver: {
    position: 'absolute',
    inset: 0,
    zIndex: 50,
    background: 'rgba(0,0,0,0.9)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'monospace',
    color: '#fff',
    padding: '1.5rem'
  },
  matchOverTitle: {
    fontSize: 'clamp(3rem, 8vw, 4.5rem)',
    fontWeight: 900,
    fontStyle: 'italic',
    background: 'linear-gradient(to right, #facc15, #ef4444, #d946ef)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '0.5rem'
  },
  matchOverSubtitle: {
    color: '#9ca3af',
    marginBottom: '2rem',
    fontSize: '0.875rem'
  },
  matchOverButton: {
    padding: '1rem 2rem',
    background: 'linear-gradient(to right, #22d3ee, #2563eb)',
    color: '#000',
    fontWeight: 800,
    borderRadius: '0.75rem',
    cursor: 'pointer',
    border: 'none',
    boxShadow: '0 0 25px rgba(0,240,255,0.5)',
    transition: 'all 0.2s',
    fontFamily: 'monospace'
  },

  // Dialogue
  dialogueOverlay: {
    position: 'absolute',
    inset: 0,
    zIndex: 50,
    background: 'rgba(0,0,0,0.85)',
    backdropFilter: 'blur(12px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem'
  },
  dialogueBox: {
    width: '100%',
    maxWidth: '56rem',
    background: '#030712',
    border: '1px solid #155e75',
    borderRadius: '1rem',
    padding: '1.25rem',
    boxShadow: '0 0 50px rgba(0,240,255,0.15)'
  },
  dialogueHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    color: '#22d3ee',
    fontSize: '0.75rem',
    fontWeight: 700,
    letterSpacing: '0.1em',
    marginBottom: '1rem'
  },
  dialogueHeaderButtons: {
    display: 'flex',
    gap: '0.5rem'
  },
  readButton: {
    pointerEvents: 'auto',
    padding: '0.5rem 0.75rem',
    border: '1px solid #155e75',
    borderRadius: '0.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    background: 'none',
    color: '#22d3ee',
    cursor: 'pointer',
    fontFamily: 'monospace'
  },
  skipButton: {
    pointerEvents: 'auto',
    padding: '0.5rem 0.75rem',
    border: '1px solid #7f1d1d',
    borderRadius: '0.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    background: 'rgba(127,29,29,0.3)',
    color: '#fca5a5',
    cursor: 'pointer',
    fontFamily: 'monospace'
  },
  dialogueGrid: {
    display: 'grid',
    gridTemplateColumns: '90px 1fr 90px',
    alignItems: 'center',
    gap: '1rem'
  },
  dialogueAvatar: {
    textAlign: 'center'
  },
  dialogueAvatarBox: {
    width: '4rem',
    height: '5rem',
    margin: '0 auto',
    borderRadius: '0.75rem',
    border: '1px solid',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '2.25rem',
    fontWeight: 900
  },
  dialogueAvatarName: {
    fontSize: '0.5625rem',
    marginTop: '0.5rem',
    color: '#6b7280'
  },
  dialogueContent: {
    borderLeft: '2px solid',
    paddingLeft: '1.25rem',
    minHeight: '120px'
  },
  dialogueSpeaker: {
    fontSize: '0.75rem',
    fontWeight: 900,
    textTransform: 'uppercase'
  },
  dialogueText: {
    fontSize: 'clamp(1.25rem, 3vw, 1.875rem)',
    fontWeight: 700,
    lineHeight: 1.3,
    marginTop: '0.5rem'
  },
  dialogueFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTop: '1px solid #1f2937',
    marginTop: '1rem',
    paddingTop: '1rem'
  },
  dialogueIndex: {
    fontSize: '0.625rem',
    color: '#6b7280'
  },
  dialogueNextButton: {
    padding: '0.75rem 1.5rem',
    background: 'linear-gradient(to right, #22d3ee, #d946ef)',
    color: '#000',
    fontWeight: 900,
    borderRadius: '0.5rem',
    border: 'none',
    cursor: 'pointer',
    fontFamily: 'monospace'
  }
};

// ============================================================================
// COMPONENTS
// ============================================================================

const ArcadeSplash = ({ onStart }) => (
  <div style={styles.splash}>
    <div style={styles.splashRadial} />
    <div style={styles.splashSubtitle}>
      <Swords size={20} /> Virtual Arcade Championship
    </div>
    <h1 style={styles.splashTitle}>NEON STRIKER</h1>
    <p style={styles.splashDesc}>
      Engage in hyper-speed neural combat. Master signature moves, combo counters, and AI adaptive algorithms.
    </p>
    <button
      onClick={() => { sfx.init(); sfx.playAnnounce(); onStart(); }}
      style={styles.splashButton}
    >
      <Play fill="black" size={24} /> INSERT COIN / PRESS START
    </button>
  </div>
);

const CharacterSelect = ({ onSelect, onBack }) => {
  const [selectedP1, setSelectedP1] = useState(CHARACTERS[0]);
  const [selectedP2, setSelectedP2] = useState(CHARACTERS[1]);

  return (
    <div style={styles.charSelect}>
      <div style={styles.charSelectInner}>
        <div style={styles.charSelectHeader}>
          <button onClick={onBack} style={styles.backButton}>
            <ArrowLeft size={16} /> Main Menu
          </button>
          <h2 style={styles.charSelectTitle}>SELECT YOUR FIGHTER</h2>
          <div style={styles.rosterCount}>ROSTER: 08/08</div>
        </div>

        <div style={styles.rosterGrid}>
          {CHARACTERS.map((char) => {
            const isP1 = selectedP1.id === char.id;
            const isP2 = selectedP2.id === char.id;

            return (
              <div
                key={char.id}
                onClick={() => {
                  sfx.init();
                  sfx.playPunch();
                  setSelectedP1(char);
                  const availableP2 = CHARACTERS.filter(c => c.id !== char.id);
                  setSelectedP2(availableP2[Math.floor(Math.random() * availableP2.length)]);
                }}
                style={{
                  ...styles.rosterCard,
                  ...(isP1 ? styles.rosterCardP1 : isP2 ? styles.rosterCardP2 : {})
                }}
              >
                <div style={styles.rosterCardTop}>
                  <span style={{ ...styles.rosterCardTitle, color: char.color }}>
                    {char.title} · {WEAPONS[char.weapon].name}
                  </span>
                  {isP1 && <span style={{ ...styles.rosterBadge, background: '#22d3ee' }}>P1</span>}
                  {isP2 && <span style={{ ...styles.rosterBadge, background: '#ef4444' }}>CPU</span>}
                </div>

                <div style={{ ...styles.rosterCardName, color: char.color }}>
                  {char.name}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <div style={styles.statRow}>
                    <span>SPD</span>
                    <div style={styles.statBarBg}>
                      <div style={{ ...styles.statBarFill, background: '#22d3ee', width: `${char.speed}%` }} />
                    </div>
                  </div>
                  <div style={styles.statRow}>
                    <span>PWR</span>
                    <div style={styles.statBarBg}>
                      <div style={{ ...styles.statBarFill, background: '#d946ef', width: `${char.power}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div style={styles.weaponLoadout}>
          <div style={styles.weaponLoadoutTitle}>WEAPON LOADOUT — {selectedP1.name}</div>
          <div style={styles.weaponButtons}>
            {Object.entries(WEAPONS).map(([weaponId, weapon]) => (
              <button
                key={weaponId}
                onClick={() => setSelectedP1({ ...selectedP1, weapon: weaponId })}
                style={{
                  ...styles.weaponButton,
                  ...(selectedP1.weapon === weaponId ? styles.weaponButtonActive : {})
                }}
              >
                <span style={{ color: selectedP1.color }}>{weapon.icon}</span> {weapon.name}
              </button>
            ))}
          </div>
          <div style={styles.weaponStats}>
            {WEAPONS[selectedP1.weapon].light}: {WEAPONS[selectedP1.weapon].lightDamage} dmg ·
            {WEAPONS[selectedP1.weapon].heavy}: {WEAPONS[selectedP1.weapon].heavyDamage} dmg ·
            Range: {WEAPONS[selectedP1.weapon].range}
          </div>
        </div>

        <div style={styles.selectedPreview}>
          <div style={styles.selectedPreviewInner}>
            <div style={{ ...styles.selectedAvatar, borderColor: selectedP1.color, color: selectedP1.color }}>
              {selectedP1.name[0]}
            </div>
            <div>
              <h3 style={styles.selectedName}>{selectedP1.name} - {selectedP1.title}</h3>
              <p style={styles.selectedQuote}>"{selectedP1.quote}"</p>
              <div style={styles.selectedWeaponInfo}>
                <Zap size={12} /> WEAPON: {WEAPONS[selectedP1.weapon].name} · SPECIAL: {selectedP1.specialName} ({selectedP1.specialDesc})
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              sfx.playAnnounce();
              onSelect(selectedP1, selectedP2);
            }}
            style={styles.confirmButton}
          >
            CONFIRM & BATTLE
          </button>
        </div>
      </div>
    </div>
  );
};

const HUD = ({ hudState, p1Char, p2Char, onPause }) => {
  return (
    <div style={styles.hud}>
      <div style={styles.hudTop}>
        {/* P1 Health & Super */}
        <div style={styles.healthSection}>
          <div style={{ ...styles.healthHeader, color: '#22d3ee' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <User size={14} /> {p1Char.name} (YOU)
            </span>
            <div style={styles.winDots}>
              {[...Array(2)].map((_, i) => (
                <div key={i} style={{
                  ...styles.winDot,
                  borderColor: '#22d3ee',
                  background: i < hudState.p1Wins ? '#22d3ee' : 'transparent'
                }} />
              ))}
            </div>
          </div>
          <div style={{ ...styles.healthBarBg, borderColor: '#22d3ee', boxShadow: '0 0 15px rgba(0,240,255,0.3)' }}>
            <div style={{
              ...styles.healthBarFill,
              background: 'linear-gradient(to right, #22d3ee, #60a5fa)',
              width: `${hudState.p1Health}%`
            }} />
          </div>
          <div style={{ ...styles.superBarBg, borderColor: '#155e75' }}>
            <div style={{
              ...styles.superBarFill,
              background: hudState.p1Super >= 100 ? '#facc15' : '#8b5cf6',
              width: `${hudState.p1Super}%`
            }} />
          </div>
        </div>

        {/* Center Round Timer */}
        <div style={styles.timerBox}>
          <span style={styles.timerRound}>ROUND {hudState.round}</span>
          <span style={styles.timerValue}>{hudState.roundTime}</span>
        </div>

        {/* P2 Health & Super */}
        <div style={styles.healthSectionRight}>
          <div style={{ ...styles.healthHeader, color: '#ef4444', flexDirection: 'row-reverse' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Cpu size={14} /> {p2Char.name} (AI)
            </span>
            <div style={styles.winDots}>
              {[...Array(2)].map((_, i) => (
                <div key={i} style={{
                  ...styles.winDot,
                  borderColor: '#ef4444',
                  background: i < hudState.p2Wins ? '#ef4444' : 'transparent'
                }} />
              ))}
            </div>
          </div>
          <div style={{ ...styles.healthBarBg, borderColor: '#ef4444', boxShadow: '0 0 15px rgba(255,0,85,0.3)' }}>
            <div style={{
              ...styles.healthBarFill,
              background: 'linear-gradient(to left, #ef4444, #fb923c)',
              width: `${hudState.p2Health}%`,
              marginLeft: 'auto'
            }} />
          </div>
          <div style={{ ...styles.superBarBg, borderColor: '#7f1d1d' }}>
            <div style={{
              ...styles.superBarFill,
              background: hudState.p2Super >= 100 ? '#facc15' : '#f97316',
              width: `${hudState.p2Super}%`,
              marginLeft: 'auto'
            }} />
          </div>
        </div>
      </div>

      {/* Combo Counter */}
      <div style={styles.comboRow}>
        {hudState.comboP1 > 1 ? (
          <div style={styles.comboP1}>{hudState.comboP1} HITS!</div>
        ) : <div />}
        {hudState.comboP2 > 1 ? (
          <div style={styles.comboP2}>{hudState.comboP2} HITS!</div>
        ) : <div />}
      </div>

      {/* Bottom Controls */}
      <div style={styles.hudBottom}>
        <div style={styles.controlsBox}>
          <div style={styles.controlsTitle}>CONTROLS</div>
          <div><kbd style={styles.kbd}>A</kbd>/<kbd style={styles.kbd}>D</kbd> Move | <kbd style={styles.kbd}>W</kbd> Jump</div>
          <div><kbd style={{ ...styles.kbd, color: '#fde047' }}>J</kbd> Punch | <kbd style={{ ...styles.kbd, color: '#86efac' }}>K</kbd> Kick</div>
          <div><kbd style={{ ...styles.kbd, color: '#f0abfc' }}>I</kbd> Special (Needs Super Meter)</div>
        </div>

        <button onClick={onPause} style={styles.pauseButton}>
          <Pause size={20} />
        </button>
      </div>
    </div>
  );
};

const speakDialogue = (text, gender = 'N') => {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.94;
  utterance.pitch = gender === 'F' ? 1.08 : gender === 'M' ? 0.9 : 1.0;
  const voices = window.speechSynthesis.getVoices();
  const voice = voices.find(v => /en-US|en-GB/i.test(v.lang) && (
    gender === 'F' ? /female|samantha|zira|ava|karen/i.test(v.name) :
      gender === 'M' ? /male|daniel|alex|guy|david/i.test(v.name) : true
  ));
  if (voice) utterance.voice = voice;
  window.speechSynthesis.speak(utterance);
};

const DialogueOverlay = ({ p1, p2, winner, speechEnabled, onContinue, onSkip }) => {
  const isIntro = !winner;
  const lines = isIntro
    ? [{ name: p1.name, text: p1.quote, gender: p1.gender, color: p1.color }, { name: p2.name, text: p2.quote, gender: p2.gender, color: p2.color }]
    : [
      { name: winner.name, text: winner.id === p1.id ? p1.winLine : p2.winLine, gender: winner.gender, color: winner.color },
      { name: winner.id === p1.id ? p2.name : p1.name, text: winner.id === p1.id ? p2.loseLine : p1.loseLine, gender: winner.id === p1.id ? p2.gender : p1.gender, color: winner.id === p1.id ? p2.color : p1.color }
    ];
  const [index, setIndex] = useState(0);
  useEffect(() => { if (speechEnabled) speakDialogue(lines[index].name + '. ' + lines[index].text, lines[index].gender); }, [index, speechEnabled]);

  const handleSkip = () => {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    onSkip();
  };

  return (
    <div style={styles.dialogueOverlay}>
      <div style={styles.dialogueBox}>
        <div style={styles.dialogueHeader}>
          <span>{isIntro ? 'BEFORE THE FIGHT' : 'AFTERMATH'}</span>
          <div style={styles.dialogueHeaderButtons}>
            <button
              onClick={() => speakDialogue(lines[index].name + '. ' + lines[index].text, lines[index].gender)}
              style={styles.readButton}
            >
              <Volume2 size={14} /> READ
            </button>
            <button onClick={handleSkip} style={styles.skipButton}>
              <SkipForward size={14} /> SKIP
            </button>
          </div>
        </div>
        <div style={styles.dialogueGrid}>
          <div style={styles.dialogueAvatar}>
            <div style={{ ...styles.dialogueAvatarBox, borderColor: p1.color, color: p1.color }}>{p1.name[0]}</div>
            <div style={styles.dialogueAvatarName}>{p1.name}</div>
          </div>
          <div style={{ ...styles.dialogueContent, borderColor: lines[index].color }}>
            <div style={{ ...styles.dialogueSpeaker, color: lines[index].color }}>{lines[index].name}</div>
            <p style={styles.dialogueText}>"{lines[index].text}"</p>
          </div>
          <div style={styles.dialogueAvatar}>
            <div style={{ ...styles.dialogueAvatarBox, borderColor: p2.color, color: p2.color }}>{p2.name[0]}</div>
            <div style={styles.dialogueAvatarName}>{p2.name}</div>
          </div>
        </div>
        <div style={styles.dialogueFooter}>
          <span style={styles.dialogueIndex}>{index + 1} / {lines.length}</span>
          <button
            onClick={() => {
              if (index < lines.length - 1) setIndex(index + 1);
              else { window.speechSynthesis?.cancel(); onContinue(); }
            }}
            style={styles.dialogueNextButton}
          >
            {index < lines.length - 1 ? 'NEXT' : isIntro ? 'ENTER ARENA' : 'VIEW RESULTS'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default function Game() {
  const canvasRef = useRef(null);
  const engineRef = useRef(null);
  const { loaded: threeLoaded, error: threeError } = useThreeJS();

  const [gameState, setGameState] = useState('SPLASH');
  const [p1Char, setP1Char] = useState(CHARACTERS[0]);
  const [p2Char, setP2Char] = useState(CHARACTERS[1]);
  const [matchWinner, setMatchWinner] = useState('');
  const [announcerText, setAnnouncerText] = useState('');
  const [dialogue, setDialogue] = useState(null);
  const [speechEnabled, setSpeechEnabled] = useState(true);

  const [hudState, setHudState] = useState({
    p1Health: 100,
    p2Health: 100,
    p1Super: 0,
    p2Super: 0,
    roundTime: 99,
    round: 1,
    p1Wins: 0,
    p2Wins: 0,
    comboP1: 0,
    comboP2: 0
  });

  const handleUIUpdate = useCallback((newState) => {
    setHudState((prev) => ({ ...prev, ...newState }));
  }, []);

  const handleRoundEnd = useCallback((winner, nextRoundCb) => {
    setAnnouncerText(winner ? `ROUND WINNER: ${winner}` : 'TIME UP!');
    sfx.playAnnounce();

    setTimeout(() => {
      setAnnouncerText('READY... FIGHT!');
      setTimeout(() => {
        setAnnouncerText('');
        nextRoundCb();
      }, 1000);
    }, 1800);
  }, []);

  const handleMatchEnd = useCallback((winnerName) => {
    setMatchWinner(winnerName);
    setDialogue({ type: 'post', winner: winnerName === 'PLAYER 1' ? p1Char : p2Char });
    setAnnouncerText('K.O.!');
    sfx.playKO();

    setTimeout(() => {
      setGameState('MATCH_OVER');
      setAnnouncerText('');
    }, 2000);
  }, [p1Char, p2Char]);

  // Helper to advance past dialogue (used by both onContinue and onSkip)
  const advanceDialogue = useCallback((dialogueType) => {
    setDialogue(null);
    if (dialogueType === 'intro') {
      if (engineRef.current) engineRef.current.paused = false;
      setAnnouncerText('ROUND 1... FIGHT!');
      setTimeout(() => setAnnouncerText(''), 1200);
    } else {
      setGameState('MATCH_OVER');
    }
  }, []);

  useEffect(() => {
    if (gameState === 'FIGHTING' && threeLoaded && canvasRef.current && !engineRef.current) {
      engineRef.current = new ArcadeEngine(
        canvasRef.current,
        p1Char,
        p2Char,
        handleUIUpdate,
        handleRoundEnd,
        handleMatchEnd
      );

      setAnnouncerText('ROUND 1... FIGHT!');
      sfx.playAnnounce();
      setTimeout(() => setAnnouncerText(''), 1500);
    }

    return () => {
      if (engineRef.current) {
        engineRef.current.destroy();
        engineRef.current = null;
      }
    };
  }, [gameState, threeLoaded, p1Char, p2Char, handleUIUpdate, handleRoundEnd, handleMatchEnd]);

  if (threeError) {
    return (
      <div style={styles.errorScreen}>
        Error: Could not initialize 3D WebGL Arcade Engine.
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <canvas ref={canvasRef} style={styles.canvas} />

      {gameState === 'SPLASH' && (
        <ArcadeSplash onStart={() => setGameState('CHAR_SELECT')} />
      )}

      {gameState === 'CHAR_SELECT' && (
        <CharacterSelect
          onBack={() => setGameState('SPLASH')}
          onSelect={(p1, p2) => {
            setP1Char(p1);
            setP2Char(p2);
            setDialogue({ type: 'intro', winner: null });
            setGameState('FIGHTING');
          }}
        />
      )}

      {gameState === 'FIGHTING' && (
        <HUD
          hudState={hudState}
          p1Char={p1Char}
          p2Char={p2Char}
          onPause={() => {
            if (engineRef.current) engineRef.current.paused = true;
            setGameState('PAUSED');
          }}
        />
      )}

      {gameState === 'FIGHTING' && dialogue && (
        <DialogueOverlay
          p1={p1Char}
          p2={p2Char}
          winner={dialogue.type === 'post' ? dialogue.winner : null}
          speechEnabled={speechEnabled}
          onContinue={() => advanceDialogue(dialogue.type)}
          onSkip={() => advanceDialogue(dialogue.type)}
        />
      )}

      {announcerText && (
        <div style={styles.announcerOverlay}>
          <div style={styles.announcerText}>{announcerText}</div>
        </div>
      )}

      {gameState === 'PAUSED' && (
        <div style={styles.pauseMenu}>
          <h2 style={styles.pauseTitle}>GAME PAUSED</h2>
          <div style={styles.pauseButtons}>
            <button
              onClick={() => {
                if (engineRef.current) engineRef.current.paused = false;
                setGameState('FIGHTING');
              }}
              style={styles.pauseButtonPrimary}
            >
              <Play size={18} /> RESUME MATCH
            </button>
            <button
              onClick={() => {
                if (engineRef.current) engineRef.current.destroy();
                engineRef.current = null;
                setGameState('CHAR_SELECT');
              }}
              style={styles.pauseButtonSecondary}
            >
              <RotateCcw size={18} /> CHANGE CHARACTERS
            </button>
          </div>
        </div>
      )}

      {gameState === 'MATCH_OVER' && (
        <div style={styles.matchOver}>
          <Trophy size={64} color="#facc15" style={{ marginBottom: '1rem' }} />
          <h2 style={styles.matchOverTitle}>{matchWinner} WINS!</h2>
          <p style={styles.matchOverSubtitle}>CHAMPION OF THE VIRTUAL DOJO</p>
          <button
            onClick={() => {
              if (engineRef.current) engineRef.current.destroy();
              engineRef.current = null;
              setGameState('CHAR_SELECT');
            }}
            style={styles.matchOverButton}
          >
            PLAY AGAIN
          </button>
        </div>
      )}

      <div style={styles.scanlineOverlay} />
    </div>
  );
}