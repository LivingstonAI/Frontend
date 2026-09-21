import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, RotateCcw, Shield, Zap, Sparkles, Trophy, Flame, Swords, ArrowLeft, Volume2, VolumeX, Cpu, User } from 'lucide-react';

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
  {id:'maya',name:'Maya Chen',title:'Neon Ronin',gender:'F',weapon:'sword',color:'#22d3ee',hexColor:0x22d3ee,secondaryColor:0x0f172a,speed:91,power:78,defense:67,specialName:'Moonflash',specialDesc:'A lightning dash that ends in a cross-body blade strike.',specialType:'DASH',ability:'Afterimage',abilityDesc:'A perfect block creates a brief evasive afterimage.',quote:'A clean blade. A clear mind.',winLine:'You fought well. But hesitation costs everything.',loseLine:'Not today. I will sharpen this lesson.',look:'ronin'},
  {id:'ethan',name:'Ethan Cole',title:'Iron Sentinel',gender:'M',weapon:'staff',color:'#f59e0b',hexColor:0xf59e0b,secondaryColor:0x1f2937,speed:68,power:88,defense:93,specialName:'Aegis Crash',specialDesc:'A brutal staff shockwave that punishes close pressure.',specialType:'SHOCKWAVE',ability:'Fortify',abilityDesc:'Blocking charges armor and empowers the next heavy hit.',quote:'Stand your ground. Make them move.',winLine:'You could not break the wall.',loseLine:'Solid hit. My guard was late.',look:'armor'},
  {id:'leila',name:'Leila Okafor',title:'Crimson Dancer',gender:'F',weapon:'nunchaku',color:'#f43f5e',hexColor:0xf43f5e,secondaryColor:0x3f0a20,speed:96,power:74,defense:60,specialName:'Scarlet Spiral',specialDesc:'A spinning multi-hit rush that builds combo momentum.',specialType:'SPIN',ability:'Momentum',abilityDesc:'Consecutive hits make the next attack faster and stronger.',quote:'If you can see the chain, you are already late.',winLine:'Too slow. The rhythm belonged to me.',loseLine:'You broke my rhythm. Respect.',look:'dancer'},
  {id:'noah',name:'Noah Williams',title:'Street Phantom',gender:'M',weapon:'tonfa',color:'#a855f7',hexColor:0xa855f7,secondaryColor:0x171329,speed:94,power:73,defense:62,specialName:'Blink Counter',specialDesc:'A phase step that appears behind the opponent.',specialType:'TELEPORT',ability:'Phase Step',abilityDesc:'A successful block can reposition Noah behind the attacker.',quote:'You do not need to be stronger if you are never where they swing.',winLine:'You were looking in the wrong direction.',loseLine:'Clean counter. I will take the lesson.',look:'street'},
  {id:'sophia',name:'Sophia Reyes',title:'Solar Huntress',gender:'F',weapon:'bow',color:'#facc15',hexColor:0xfacc15,secondaryColor:0x312e81,speed:83,power:82,defense:65,specialName:'Solar Rain',specialDesc:'Three charged arrows fill the arena with pressure.',specialType:'ARROWS',ability:'Deadeye',abilityDesc:'Heavy shots gain extra range and damage.',quote:'Distance is not safety. It is just another angle.',winLine:'You let me choose the range.',loseLine:'You closed the distance perfectly.',look:'hunter'},
  {id:'marcus',name:'Marcus Reed',title:'Thunder Boxer',gender:'M',weapon:'gauntlet',color:'#06b6d4',hexColor:0x06b6d4,secondaryColor:0x082f49,speed:87,power:96,defense:74,specialName:'Voltage Upper',specialDesc:'An electrified uppercut that launches opponents.',specialType:'UPPERCUT',ability:'Overcharge',abilityDesc:'Heavy gauntlet hits store charge for bonus impact.',quote:'Come close. I promise the electricity is worth it.',winLine:'Power is not loud. The impact is.',loseLine:'That was one hell of a hit.',look:'fighter'},
  {id:'riley',name:'Riley Park',title:'Orbit Ace',gender:'N',weapon:'chakram',color:'#8b5cf6',hexColor:0x8b5cf6,secondaryColor:0x111827,speed:89,power:80,defense:70,specialName:'Event Horizon',specialDesc:'A giant orbiting chakram that returns for a second hit.',specialType:'ORBIT',ability:'Recall',abilityDesc:'Heavy chakram attacks can strike once on the way back.',quote:'One throw. Two chances.',winLine:'The return angle was yours to lose.',loseLine:'Nice read. You caught the return.',look:'pilot'},
  {id:'daniel',name:'Daniel Park',title:'Crimson Spear',gender:'M',weapon:'spear',color:'#fb923c',hexColor:0xfb923c,secondaryColor:0x431407,speed:76,power:91,defense:78,specialName:'Dragon Vault',specialDesc:'A long-range vaulting thrust with huge reach.',specialType:'LUNGE',ability:'Reach',abilityDesc:'Spear attacks gain extra range and interrupt projectiles.',quote:'Keep your distance. That is where the spear lives.',winLine:'You stepped into my range.',loseLine:'You got inside my guard.',look:'warrior'}
];

class ArcadeFighter {
  constructor(charData, isAI = false, startPos = { x: -2.5, z: 0 }, THREE) {
    this.THREE = THREE;
    this.charData = charData;
    this.weapon = WEAPONS[charData.weapon] || WEAPONS.sword;
    this.isAI = isAI;
    
    // Core Gameplay Stats
    this.maxHealth = 100;
    this.health = 100;
    this.superMeter = 0; // 0 to 100
    this.roundsWon = 0;
    
    // Position & Physics
    this.position = new THREE.Vector3(startPos.x, 0, startPos.z);
    this.velocity = new THREE.Vector3();
    this.isGrounded = true;

    // States
    this.state = 'IDLE'; // IDLE, WALKING, JUMPING, PUNCHING, KICKING, SPECIAL, BLOCKING, HIT, KO
    this.stateTimer = 0;
    this.actionDuration = 0;
    this.hasHitThisAttack = false;
    this.evade = false;
    this.charge = 0;
    this.comboBoost = 0;
    this.facingRight = startPos.x < 0;

    // Build unique 3D visual geometry
    this.mesh = new THREE.Group();
    this.mesh.position.copy(this.position);
    this.buildGeometry();
  }

  buildGeometry() {
    const THREE = this.THREE;
    const primaryColor = this.charData.hexColor;
    const secColor = this.charData.secondaryColor;

    const mainMat = new THREE.MeshStandardMaterial({
      color: primaryColor,
      roughness: 0.3,
      metalness: 0.7,
      emissive: primaryColor,
      emissiveIntensity: 0.25
    });

    const secMat = new THREE.MeshStandardMaterial({
      color: secColor,
      roughness: 0.4,
      metalness: 0.6
    });

    const darkMat = new THREE.MeshStandardMaterial({
      color: 0x111122,
      roughness: 0.8
    });

    // Helper
    const createPart = (geo, mat, x=0, y=0, z=0) => {
      const m = new THREE.Mesh(geo, mat);
      m.position.set(x, y, z);
      m.castShadow = true;
      m.receiveShadow = true;
      return m;
    };

    // Torso
    this.torso = createPart(new THREE.BoxGeometry(0.8, 1.2, 0.5), mainMat, 0, 1.6, 0);
    this.mesh.add(this.torso);

    // Character Accent Detail (e.g. Titan has chest armor, Shadow has shoulder pads, Blaze has horns)
    if (this.charData.id === 'titan') {
      const armor = createPart(new THREE.BoxGeometry(1.1, 0.8, 0.7), secMat, 0, 1.7, 0);
      this.mesh.add(armor);
    } else if (this.charData.id === 'shadow') {
      const padL = createPart(new THREE.BoxGeometry(0.4, 0.2, 0.4), secMat, 0.6, 2.1, 0);
      const padR = createPart(new THREE.BoxGeometry(0.4, 0.2, 0.4), secMat, -0.6, 2.1, 0);
      this.mesh.add(padL);
      this.mesh.add(padR);
    }

    // Head
    this.head = createPart(new THREE.SphereGeometry(0.32, 16, 16), secMat, 0, 2.5, 0);
    this.mesh.add(this.head);

    // Visor/Eyes Glow
    const visorMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const visor = createPart(new THREE.BoxGeometry(0.4, 0.1, 0.2), visorMat, 0, 2.55, 0.2);
    this.mesh.add(visor);

    // Limbs with Pivot Joint Hierarchy
    const createJointLimb = (w, h, d, px, py, pz) => {
      const pivot = new THREE.Group();
      pivot.position.set(px, py, pz);
      const geo = new THREE.BoxGeometry(w, h, d);
      geo.translate(0, -h/2, 0);
      const limbMesh = new THREE.Mesh(geo, mainMat);
      limbMesh.castShadow = true;
      pivot.add(limbMesh);
      this.mesh.add(pivot);
      return pivot;
    };

    this.leftArm = createJointLimb(0.22, 0.9, 0.22, 0.55, 2.1, 0);
    this.rightArm = createJointLimb(0.22, 0.9, 0.22, -0.55, 2.1, 0);
    this.leftLeg = createJointLimb(0.26, 1.1, 0.26, 0.25, 1.0, 0);
    this.rightLeg = createJointLimb(0.26, 1.1, 0.26, -0.25, 1.0, 0);

    // Character-specific visual identity: hair, coats, armor plates and weapon props.
    const hairMat = new THREE.MeshStandardMaterial({ color: 0x090b13, roughness: 0.55, metalness: 0.05 });
    const accentMat = new THREE.MeshStandardMaterial({ color: primaryColor, roughness: 0.25, metalness: 0.65, emissive: primaryColor, emissiveIntensity: 0.2 });

    // Hair silhouettes
    const hairGeo = new THREE.SphereGeometry(0.38, 12, 8);
    const hair = createPart(hairGeo, hairMat, 0, 2.68, -0.02);
    hair.scale.y = this.charData.gender === 'F' ? 0.72 : 0.58;
    this.mesh.add(hair);

    if (this.charData.look === 'ronin' || this.charData.look === 'hunter') {
      const pony = createPart(new THREE.CylinderGeometry(0.10, 0.17, 0.72, 8), hairMat, 0.28, 2.35, -0.25);
      pony.rotation.x = -0.45;
      this.mesh.add(pony);
    }
    if (this.charData.look === 'dancer') {
      [-0.25,0.25].forEach((x,i)=>{
        const braid=createPart(new THREE.CylinderGeometry(0.07,0.12,0.62,8),hairMat,x,2.35,-0.23);
        braid.rotation.x=i?0.35:-0.35;
        this.mesh.add(braid);
      });
    }

    // Clothing / armor silhouettes
    if (this.charData.look === 'armor') {
      const chest=createPart(new THREE.BoxGeometry(1.12,0.68,0.68),secMat,0,1.68,0);
      const plate=createPart(new THREE.BoxGeometry(0.72,0.08,0.06),accentMat,0,1.82,0.37);
      this.mesh.add(chest,plate);
    } else if (this.charData.look === 'ronin' || this.charData.look === 'warrior') {
      const coat=createPart(new THREE.BoxGeometry(1.0,0.9,0.18),secMat,0,1.55,-0.25);
      coat.rotation.x=-0.15;
      const sash=createPart(new THREE.BoxGeometry(1.05,0.16,0.55),accentMat,0,1.28,0);
      this.mesh.add(coat,sash);
    } else if (this.charData.look === 'street') {
      const hoodie=createPart(new THREE.ConeGeometry(0.58,0.72,4),secMat,0,1.55,-0.12);
      hoodie.rotation.y=Math.PI/4;
      this.mesh.add(hoodie);
    } else if (this.charData.look === 'dancer') {
      const sash=createPart(new THREE.BoxGeometry(1.05,0.13,0.62),accentMat,0,1.35,0);
      sash.rotation.z=-0.12;
      this.mesh.add(sash);
    } else {
      const chestGlow=createPart(new THREE.BoxGeometry(0.58,0.08,0.05),accentMat,0,1.78,0.29);
      this.mesh.add(chestGlow);
    }

    // Weapon models
    const weaponMat=new THREE.MeshStandardMaterial({color:0xcbd5e1,roughness:0.22,metalness:0.9});
    const weaponGlow=new THREE.MeshBasicMaterial({color:primaryColor});
    const weaponGroup=new THREE.Group();
    if(this.charData.weapon==='sword'){
      const blade=createPart(new THREE.BoxGeometry(0.07,1.45,0.11),weaponMat,0,0.7,0);
      blade.rotation.z=-0.22;
      const guard=createPart(new THREE.BoxGeometry(0.4,0.06,0.15),accentMat,0,1.42,0);
      weaponGroup.add(blade,guard);
    } else if(this.charData.weapon==='staff' || this.charData.weapon==='spear'){
      const shaft=createPart(new THREE.CylinderGeometry(0.05,0.05,2.35,10),secMat,0,1.15,0);
      shaft.rotation.z=Math.PI/2;
      const tip=createPart(new THREE.ConeGeometry(0.15,0.38,8),this.charData.weapon==='spear'?weaponMat:accentMat,1.18,1.15,0);
      tip.rotation.z=-Math.PI/2;
      weaponGroup.add(shaft,tip);
    } else if(this.charData.weapon==='nunchaku'){
      const a=createPart(new THREE.CylinderGeometry(0.055,0.055,0.5,8),secMat,-0.14,0,0);
      const b=createPart(new THREE.CylinderGeometry(0.055,0.055,0.5,8),secMat,0.14,0,0);
      const chain=createPart(new THREE.CylinderGeometry(0.025,0.025,0.2,6),weaponMat,0,0,0); chain.rotation.z=Math.PI/2;
      weaponGroup.add(a,b,chain);
    } else if(this.charData.weapon==='chakram'){
      const ring=createPart(new THREE.TorusGeometry(0.26,0.055,8,22),weaponMat,0,0,0);
      const core=createPart(new THREE.SphereGeometry(0.08,8,8),weaponGlow,0,0,0);
      weaponGroup.add(ring,core);
    } else if(this.charData.weapon==='tonfa'){
      const bar=createPart(new THREE.BoxGeometry(0.12,0.72,0.12),weaponMat,0,0,0);
      const grip=createPart(new THREE.BoxGeometry(0.1,0.3,0.1),secMat,0.18,0,0); grip.rotation.z=Math.PI/2;
      weaponGroup.add(bar,grip);
    } else if(this.charData.weapon==='gauntlet'){
      const glove=createPart(new THREE.BoxGeometry(0.3,0.38,0.3),secMat,0,0,0);
      const arc=createPart(new THREE.TorusGeometry(0.14,0.03,6,16),weaponGlow,0,0,0.16);
      weaponGroup.add(glove,arc);
    } else if(this.charData.weapon==='bow'){
      const arc=createPart(new THREE.TorusGeometry(0.48,0.045,8,18,Math.PI),accentMat,0,0,0);
      arc.rotation.z=Math.PI/2;
      const string=createPart(new THREE.BoxGeometry(0.02,0.88,0.02),weaponGlow,0,0,0);
      weaponGroup.add(arc,string);
    }
    weaponGroup.position.set(-0.7,1.55,0.18);
    this.mesh.add(weaponGroup);
    this.weaponVisual=weaponGroup;

    // Glowing Aura Aura Rings
    const ringGeo = new THREE.TorusGeometry(0.7, 0.02, 8, 24);
    const ringMat = new THREE.MeshBasicMaterial({ color: primaryColor, wireframe: true });
    this.auraRing = new THREE.Mesh(ringGeo, ringMat);
    this.auraRing.rotation.x = Math.PI / 2;
    this.auraRing.position.y = 0.05;
    this.mesh.add(this.auraRing);
  }

  animate(delta, time, opponentPos) {
    const THREE = this.THREE;

    // Face Opponent along X-axis
    if (opponentPos && this.state !== 'KO') {
      this.facingRight = opponentPos.x > this.mesh.position.x;
      this.mesh.rotation.y = this.facingRight ? Math.PI / 2 : -Math.PI / 2;
    }

    // Apply Physics (Jumping / Gravity)
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

    // Breathing / Idle movement
    const idleBreath = Math.sin(time * 4) * 0.03;
    this.torso.position.y = 1.6 + idleBreath;
    this.head.position.y = 2.5 + idleBreath;
    this.auraRing.rotation.z += delta * 2;

    // Default target rotations
    let targetLArm = { x: -0.3, z: 0.2 };
    let targetRArm = { x: -0.3, z: -0.2 };
    let targetLLeg = { x: 0, z: 0 };
    let targetRLeg = { x: 0, z: 0 };

    // Action timer progression
    if (this.stateTimer > 0) {
      this.stateTimer -= delta;
      const progress = 1 - (this.stateTimer / this.actionDuration);

      if (this.state === 'LIGHT') {
        targetLArm.x = -1.2 - swing * (this.charData.weapon === 'sword' ? 1.35 : 0.8);
        targetRArm.x = -0.5 - swing * 0.35;
      } else if (this.state === 'HEAVY') {
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
      // Smooth joint interpolation
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
      amount *= 0.15; // 85% block mitigation
    } else {
      this.state = 'HIT';
      this.stateTimer = 0.35;
      this.actionDuration = 0.35;
    }

    // Gain Super Meter when receiving damage
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

    // Cyber Arena Lighting
    const ambient = new THREE.AmbientLight(0xffffff, 0.3);
    this.scene.add(ambient);

    const light1 = new THREE.PointLight(0x00f0ff, 1.5, 20);
    light1.position.set(-6, 6, 3);
    this.scene.add(light1);

    const light2 = new THREE.PointLight(0xff0055, 1.5, 20);
    light2.position.set(6, 6, 3);
    this.scene.add(light2);

    // Neon Floor Grid
    const grid = new THREE.GridHelper(24, 24, 0x00f0ff, 0x221144);
    grid.position.y = 0.01;
    this.scene.add(grid);

    const floorGeo = new THREE.PlaneGeometry(24, 24);
    const floorMat = new THREE.MeshStandardMaterial({ color: 0x050510, roughness: 0.8 });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    this.scene.add(floor);

    // Background Cyber Pillars
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

    // Adaptive AI behavior based on difficulty/rounds
    if (dist > 2.2) {
      // Approach
      const dir = this.p1.mesh.position.x > this.p2.mesh.position.x ? 1 : -1;
      this.p2.mesh.position.x += dir * 3.5 * delta;
      this.p2.state = 'WALKING';
    } else {
      // Combat range
      const roll = Math.random();

      if (this.p2.superMeter >= 100 && roll < 0.05) {
        if (this.p2.attack('SPECIAL')) {
          this.spawnProjectile(this.p2, this.p1);
        }
      } else if (this.p1.stateTimer > 0 && roll < 0.3) {
        // AI Blocks player attacks
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
        // Ranged weapon attacks become actual projectiles.
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
        defender.mesh.position.clone().add({x:0,y:1.7,z:0}),
        attacker.charData.hexColor
      );
      this.cameraShake = attacker.state === 'HEAVY' ? 0.3 : 0.18;

      // Distinct weapon behavior.
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
            this.spawnHitParticles(defender.mesh.position.clone().add({x:0,y:1.6,z:0}), attacker.charData.hexColor);
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

      // Check hit
      const dist = proj.mesh.position.distanceTo(proj.target.mesh.position.clone().add({x:0, y:1.8, z:0}));
      if (dist < 1.2) {
        proj.target.takeDamage(25);
        this.spawnHitParticles(proj.mesh.position, proj.owner.charData.hexColor);
        this.scene.remove(proj.mesh);
        this.projectiles.splice(i, 1);
        this.cameraShake = 0.35;
      } else if (Math.abs(proj.mesh.position.x) > 12) {
        // Out of bounds cleanup
        this.scene.remove(proj.mesh);
        this.projectiles.splice(i, 1);
      }
    }

    // Update Particles
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

      // Combo timers
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

      // Arena boundaries constraint
      this.p1.mesh.position.x = Math.max(-8, Math.min(8, this.p1.mesh.position.x));
      this.p2.mesh.position.x = Math.max(-8, Math.min(8, this.p2.mesh.position.x));

      // Fighter animations
      this.p1.animate(delta, timestamp / 1000, this.p2.mesh.position);
      this.p2.animate(delta, timestamp / 1000, this.p1.mesh.position);

      // Check Round Over condition
      if (this.p1.health <= 0 || this.p2.health <= 0 || this.roundTime <= 0) {
        this.handleRoundEnd();
      }
    }

    // Camera follow & shake effect
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

    // Sync state with React HUD
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


const ArcadeSplash = ({ onStart }) => (
  <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-black/90 text-white font-mono select-none p-6">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,240,255,0.15)_0,transparent_70%)] pointer-events-none" />
    
    <div className="flex items-center gap-3 mb-2 text-cyan-400 tracking-widest text-sm uppercase animate-pulse">
      <Swords size={20} /> Virtual Arcade Championship
    </div>
    
    <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-yellow-400 drop-shadow-[0_0_35px_rgba(0,240,255,0.6)] mb-6">
      NEON STRIKER
    </h1>

    <p className="text-gray-400 text-sm max-w-md text-center mb-10 leading-relaxed">
      Engage in hyper-speed neural combat. Master signature moves, combo counters, and AI adaptive algorithms.
    </p>

    <button
      onClick={() => { sfx.init(); sfx.playAnnounce(); onStart(); }}
      className="px-10 py-5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl font-bold text-xl tracking-widest text-black hover:scale-105 hover:shadow-[0_0_30px_rgba(0,240,255,0.8)] transition-all flex items-center gap-3 cursor-pointer"
    >
      <Play fill="black" size={24} /> INSERT COIN / PRESS START
    </button>
  </div>
);

const CharacterSelect = ({ onSelect, onBack }) => {
  const [selectedP1, setSelectedP1] = useState(CHARACTERS[0]);
  const [selectedP2, setSelectedP2] = useState(CHARACTERS[1]);

  return (
    <div className="absolute inset-0 z-40 bg-gray-950 flex flex-col justify-between p-6 md:p-10 font-mono text-white select-none">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-cyan-800/50 pb-4">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-cyan-400 hover:text-cyan-200 text-sm uppercase tracking-wider"
        >
          <ArrowLeft size={16} /> Main Menu
        </button>
        <h2 className="text-2xl md:text-4xl font-extrabold italic text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-400">
          SELECT YOUR FIGHTER
        </h2>
        <div className="text-xs text-gray-500">ROSTER: 08/08</div>
      </div>

      {/* Grid Roster */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 my-6">
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
                // Randomize opponent if same chosen
                const availableP2 = CHARACTERS.filter(c => c.id !== char.id);
                setSelectedP2(availableP2[Math.floor(Math.random() * availableP2.length)]);
              }}
              className={`relative rounded-xl p-4 cursor-pointer transition-all border-2 overflow-hidden bg-gray-900/80 flex flex-col justify-between h-48 ${
                isP1 
                  ? 'border-cyan-400 shadow-[0_0_20px_rgba(0,240,255,0.5)] scale-105' 
                  : isP2
                  ? 'border-red-500 shadow-[0_0_20px_rgba(255,0,85,0.5)]'
                  : 'border-gray-800 hover:border-gray-600'
              }`}
            >
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-black/60" style={{ color: char.color }}>
                  {char.title} · {WEAPONS[char.weapon].name}
                </span>
                {isP1 && <span className="bg-cyan-500 text-black text-[10px] font-extrabold px-1.5 py-0.5 rounded">P1</span>}
                {isP2 && <span className="bg-red-500 text-black text-[10px] font-extrabold px-1.5 py-0.5 rounded">CPU</span>}
              </div>

              <div className="text-2xl font-black italic my-2" style={{ color: char.color }}>
                {char.name}
              </div>

              {/* Stat Bars */}
              <div className="space-y-1 text-[10px] text-gray-400">
                <div className="flex justify-between">
                  <span>SPD</span>
                  <div className="w-16 bg-gray-800 h-1.5 rounded overflow-hidden">
                    <div className="bg-cyan-400 h-full" style={{ width: `${char.speed}%` }} />
                  </div>
                </div>
                <div className="flex justify-between">
                  <span>PWR</span>
                  <div className="w-16 bg-gray-800 h-1.5 rounded overflow-hidden">
                    <div className="bg-fuchsia-500 h-full" style={{ width: `${char.power}%` }} />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Weapon loadout */}
      <div className="bg-gray-900/80 border border-fuchsia-900/50 rounded-xl p-4 mb-3">
        <div className="text-[10px] uppercase tracking-widest text-fuchsia-300 font-bold mb-2">WEAPON LOADOUT — {selectedP1.name}</div>
        <div className="flex flex-wrap gap-2">
          {Object.entries(WEAPONS).map(([weaponId, weapon]) => (
            <button
              key={weaponId}
              onClick={() => setSelectedP1({...selectedP1, weapon: weaponId})}
              className={`px-3 py-2 rounded-lg border text-[10px] font-bold transition-all ${
                selectedP1.weapon === weaponId
                  ? 'border-cyan-400 bg-cyan-400/15 text-cyan-300'
                  : 'border-gray-700 bg-gray-950 text-gray-400 hover:border-gray-500'
              }`}
            >
              <span style={{color: weapon.color || selectedP1.color}}>{weapon.icon}</span> {weapon.name}
            </button>
          ))}
        </div>
        <div className="text-[9px] text-gray-500 mt-2">
          {WEAPONS[selectedP1.weapon].light}: {WEAPONS[selectedP1.weapon].lightDamage} dmg ·
          {WEAPONS[selectedP1.weapon].heavy}: {WEAPONS[selectedP1.weapon].heavyDamage} dmg ·
          Range: {WEAPONS[selectedP1.weapon].range}
        </div>
      </div>

      {/* Selected Character Preview Box */}
      <div className="bg-gray-900/90 border border-cyan-800/60 rounded-xl p-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-black border-2" style={{ borderColor: selectedP1.color, color: selectedP1.color }}>
            {selectedP1.name[0]}
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">{selectedP1.name} - {selectedP1.title}</h3>
            <p className="text-xs text-gray-400 italic">"{selectedP1.quote}"</p>
            <div className="text-xs text-cyan-400 mt-1 flex items-center gap-1">
              <Zap size={12} /> WEAPON: {WEAPONS[selectedP1.weapon].name} · SPECIAL: {selectedP1.specialName} ({selectedP1.specialDesc})
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            sfx.playAnnounce();
            onSelect(selectedP1, selectedP2);
          }}
          className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-cyan-400 to-fuchsia-500 rounded-lg font-extrabold text-black tracking-widest hover:scale-105 transition-all cursor-pointer shadow-[0_0_25px_rgba(0,240,255,0.4)]"
        >
          CONFIRM & BATTLE
        </button>
      </div>
    </div>
  );
};

const HUD = ({ hudState, p1Char, p2Char, onPause }) => {
  return (
    <div className="absolute inset-0 pointer-events-none p-4 md:p-8 flex flex-col justify-between font-mono select-none">
      {/* Top Header: Healthbars & Timer */}
      <div className="flex justify-between items-start gap-4">
        {/* P1 Health & Super */}
        <div className="flex-1 max-w-md">
          <div className="flex justify-between text-xs text-cyan-400 font-bold mb-1">
            <span className="flex items-center gap-1"><User size={14}/> {p1Char.name} (YOU)</span>
            <div className="flex gap-1">
              {[...Array(2)].map((_, i) => (
                <div key={i} className={`w-3 h-3 rounded-full border border-cyan-400 ${i < hudState.p1Wins ? 'bg-cyan-400' : 'bg-transparent'}`} />
              ))}
            </div>
          </div>
          <div className="w-full h-6 bg-gray-950 border-2 border-cyan-500 rounded-sm overflow-hidden shadow-[0_0_15px_rgba(0,240,255,0.3)]">
            <div 
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-400 transition-all duration-100"
              style={{ width: `${hudState.p1Health}%` }}
            />
          </div>
          {/* P1 Super Meter */}
          <div className="w-full h-2 bg-gray-900 border border-cyan-800 rounded-sm mt-1 overflow-hidden">
            <div 
              className={`h-full transition-all ${hudState.p1Super >= 100 ? 'bg-yellow-400 animate-pulse' : 'bg-purple-500'}`}
              style={{ width: `${hudState.p1Super}%` }}
            />
          </div>
        </div>

        {/* Center Round Timer */}
        <div className="flex flex-col items-center bg-gray-950/90 border border-cyan-500/60 px-5 py-2 rounded-xl shadow-[0_0_20px_rgba(0,240,255,0.2)]">
          <span className="text-[10px] text-gray-400 uppercase tracking-widest">ROUND {hudState.round}</span>
          <span className="text-3xl md:text-4xl font-black text-yellow-400">{hudState.roundTime}</span>
        </div>

        {/* P2 Health & Super */}
        <div className="flex-1 max-w-md text-right">
          <div className="flex justify-between text-xs text-red-400 font-bold mb-1">
            <div className="flex gap-1">
              {[...Array(2)].map((_, i) => (
                <div key={i} className={`w-3 h-3 rounded-full border border-red-500 ${i < hudState.p2Wins ? 'bg-red-500' : 'bg-transparent'}`} />
              ))}
            </div>
            <span className="flex items-center gap-1"><Cpu size={14}/> {p2Char.name} (AI)</span>
          </div>
          <div className="w-full h-6 bg-gray-950 border-2 border-red-500 rounded-sm overflow-hidden shadow-[0_0_15px_rgba(255,0,85,0.3)]">
            <div 
              className="h-full bg-gradient-to-l from-red-500 to-orange-400 transition-all duration-100"
              style={{ width: `${hudState.p2Health}%` }}
            />
          </div>
          {/* P2 Super Meter */}
          <div className="w-full h-2 bg-gray-900 border border-red-900 rounded-sm mt-1 overflow-hidden">
            <div 
              className={`h-full transition-all ${hudState.p2Super >= 100 ? 'bg-yellow-400 animate-pulse' : 'bg-orange-500'}`}
              style={{ width: `${hudState.p2Super}%` }}
            />
          </div>
        </div>
      </div>

      {/* Combo Counter Display */}
      <div className="flex justify-between items-center my-auto">
        {hudState.comboP1 > 1 ? (
          <div className="text-3xl font-black italic text-cyan-400 animate-bounce">
            {hudState.comboP1} HITS!
          </div>
        ) : <div />}

        {hudState.comboP2 > 1 ? (
          <div className="text-3xl font-black italic text-red-500 animate-bounce">
            {hudState.comboP2} HITS!
          </div>
        ) : <div />}
      </div>

      {/* Bottom Controls Legend & Pause Button */}
      <div className="flex justify-between items-end">
        <div className="bg-black/80 border border-cyan-900/60 p-3 rounded-lg text-[11px] text-gray-300 space-y-1">
          <div className="text-cyan-400 font-bold mb-1">CONTROLS</div>
          <div><kbd className="bg-gray-800 px-1 rounded">A</kbd>/<kbd className="bg-gray-800 px-1 rounded">D</kbd> Move | <kbd className="bg-gray-800 px-1 rounded">W</kbd> Jump</div>
          <div><kbd className="bg-gray-800 px-1 rounded text-yellow-300">J</kbd> Punch | <kbd className="bg-gray-800 px-1 rounded text-green-300">K</kbd> Kick</div>
          <div><kbd className="bg-gray-800 px-1 rounded text-fuchsia-300">I</kbd> Special (Needs Super Meter)</div>
        </div>

        <div className="pointer-events-auto">
          <button
            onClick={onPause}
            className="p-3 bg-gray-900/90 border border-cyan-500/50 rounded-full text-cyan-400 hover:bg-cyan-500 hover:text-black transition-all cursor-pointer shadow-[0_0_15px_rgba(0,240,255,0.3)]"
          >
            <Pause size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};


const speakDialogue = (text, gender='N') => {
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

const DialogueOverlay = ({ p1, p2, winner, speechEnabled, onContinue }) => {
  const isIntro = !winner;
  const lines = isIntro
    ? [{name:p1.name,text:p1.quote,gender:p1.gender,color:p1.color},{name:p2.name,text:p2.quote,gender:p2.gender,color:p2.color}]
    : [
        {name:winner.name,text:winner.id===p1.id?p1.winLine:p2.winLine,gender:winner.gender,color:winner.color},
        {name:winner.id===p1.id?p2.name:p1.name,text:winner.id===p1.id?p2.loseLine:p1.loseLine,gender:winner.id===p1.id?p2.gender:p1.gender,color:winner.id===p1.id?p2.color:p1.color}
      ];
  const [index,setIndex]=useState(0);
  useEffect(()=>{ if(speechEnabled) speakDialogue(lines[index].name + '. ' + lines[index].text, lines[index].gender); },[index,speechEnabled]);
  return (
    <div className="absolute inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-gray-950 border border-cyan-800 rounded-2xl p-5 shadow-[0_0_50px_rgba(0,240,255,.15)]">
        <div className="flex items-center justify-between text-cyan-400 text-xs font-bold tracking-widest mb-4">
          <span>{isIntro ? 'BEFORE THE FIGHT' : 'AFTERMATH'}</span>
          <button onClick={()=>speakDialogue(lines[index].name + '. ' + lines[index].text, lines[index].gender)}
            className="pointer-events-auto px-3 py-2 border border-cyan-800 rounded-lg flex items-center gap-2 hover:border-cyan-400">
            <Volume2 size={14}/> READ DIALOGUE
          </button>
        </div>
        <div className="grid grid-cols-[90px_1fr_90px] md:grid-cols-[140px_1fr_140px] items-center gap-4">
          <div className="text-center">
            <div className="w-16 h-20 md:w-24 md:h-28 mx-auto rounded-xl border flex items-center justify-center text-4xl font-black" style={{borderColor:p1.color,color:p1.color}}>{p1.name[0]}</div>
            <div className="text-[9px] mt-2 text-gray-500">{p1.name}</div>
          </div>
          <div className="border-l-2 pl-5 min-h-[120px]" style={{borderColor:lines[index].color}}>
            <div className="text-xs font-black uppercase" style={{color:lines[index].color}}>{lines[index].name}</div>
            <p className="text-xl md:text-3xl font-bold leading-tight mt-2">"{lines[index].text}"</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-20 md:w-24 md:h-28 mx-auto rounded-xl border flex items-center justify-center text-4xl font-black" style={{borderColor:p2.color,color:p2.color}}>{p2.name[0]}</div>
            <div className="text-[9px] mt-2 text-gray-500">{p2.name}</div>
          </div>
        </div>
        <div className="flex justify-between items-center border-t border-gray-800 mt-4 pt-4">
          <span className="text-[10px] text-gray-500">{index+1} / {lines.length}</span>
          <button onClick={()=>{
            if(index < lines.length-1) setIndex(index+1);
            else { window.speechSynthesis?.cancel(); onContinue(); }
          }} className="px-6 py-3 bg-gradient-to-r from-cyan-400 to-fuchsia-500 text-black font-black rounded-lg">
            {index < lines.length-1 ? 'NEXT' : isIntro ? 'ENTER ARENA' : 'VIEW RESULTS'}
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

  const [gameState, setGameState] = useState('SPLASH'); // SPLASH, CHAR_SELECT, FIGHTING, PAUSED, MATCH_OVER
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
    setDialogue({type:'post', winner: winnerName === 'PLAYER 1' ? p1Char : p2Char});
    setAnnouncerText('K.O.!');
    sfx.playKO();

    setTimeout(() => {
      setGameState('MATCH_OVER');
      setAnnouncerText('');
    }, 2000);
  }, []);

  // Initialize Fight Engine when transition into FIGHTING state
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
      <div className="flex h-screen w-full items-center justify-center bg-black text-red-500 font-mono">
        Error: Could not initialize 3D WebGL Arcade Engine.
      </div>
    );
  }

  return (
    <div className="relative h-screen w-full bg-black overflow-hidden select-none font-sans">
      {/* 3D Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />

      {/* Screens / UI Overlays */}
      {gameState === 'SPLASH' && (
        <ArcadeSplash onStart={() => setGameState('CHAR_SELECT')} />
      )}

      {gameState === 'CHAR_SELECT' && (
        <CharacterSelect
          onBack={() => setGameState('SPLASH')}
          onSelect={(p1, p2) => {
            setP1Char(p1);
            setP2Char(p2);
            setDialogue({type:'intro', winner:null});
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
          onContinue={() => {
            setDialogue(null);
            if (dialogue.type === 'intro') {
              if (engineRef.current) engineRef.current.paused = false;
              setAnnouncerText('ROUND 1... FIGHT!');
              setTimeout(() => setAnnouncerText(''), 1200);
            } else {
              setGameState('MATCH_OVER');
            }
          }}
        />
      )}

      {/* Announcer Overlay Banner */}
      {announcerText && (
        <div className="absolute inset-0 pointer-events-none z-30 flex items-center justify-center">
          <div className="text-5xl md:text-8xl font-black italic tracking-tighter text-yellow-400 drop-shadow-[0_0_40px_rgba(255,200,0,0.8)] animate-pulse">
            {announcerText}
          </div>
        </div>
      )}

      {/* Pause Menu Overlay */}
      {gameState === 'PAUSED' && (
        <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center font-mono text-white p-6">
          <h2 className="text-4xl font-extrabold italic text-cyan-400 mb-8">GAME PAUSED</h2>
          <div className="flex flex-col gap-4 w-64">
            <button
              onClick={() => {
                if (engineRef.current) engineRef.current.paused = false;
                setGameState('FIGHTING');
              }}
              className="py-3 bg-cyan-500 text-black font-bold rounded-lg hover:scale-105 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Play size={18} /> RESUME MATCH
            </button>
            <button
              onClick={() => {
                if (engineRef.current) engineRef.current.destroy();
                engineRef.current = null;
                setGameState('CHAR_SELECT');
              }}
              className="py-3 bg-gray-800 text-cyan-400 border border-cyan-800 font-bold rounded-lg hover:bg-gray-700 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <RotateCcw size={18} /> CHANGE CHARACTERS
            </button>
          </div>
        </div>
      )}

      {/* Victory / Game Over Overlay */}
      {gameState === 'MATCH_OVER' && (
        <div className="absolute inset-0 z-50 bg-black/90 flex flex-col items-center justify-center font-mono text-white p-6">
          <Trophy size={64} className="text-yellow-400 mb-4 animate-bounce" />
          <h2 className="text-5xl md:text-7xl font-black italic text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-red-500 to-fuchsia-500 mb-2">
            {matchWinner} WINS!
          </h2>
          <p className="text-gray-400 mb-8 text-sm">CHAMPION OF THE VIRTUAL DOJO</p>
          <button
            onClick={() => {
              if (engineRef.current) engineRef.current.destroy();
              engineRef.current = null;
              setGameState('CHAR_SELECT');
            }}
            className="px-8 py-4 bg-gradient-to-r from-cyan-400 to-blue-600 text-black font-extrabold rounded-xl hover:scale-105 transition-all cursor-pointer shadow-[0_0_25px_rgba(0,240,255,0.5)]"
          >
            PLAY AGAIN
          </button>
        </div>
      )}

      {/* Scanline CRT overlay effect */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.04]" 
        style={{ 
          background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))', 
          backgroundSize: '100% 3px, 3px 100%' 
        }} 
      />
    </div>
  );
}