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

    const createPart = (geo, mat, x=0, y=0, z=0) => {
      const m = new THREE.Mesh(geo, mat);
      m.position.set(x, y, z);
      m.castShadow = true;
      m.receiveShadow = true;
      return m;
    };

    this.torso = createPart(new THREE.BoxGeometry(0.8, 1.2, 0.5), mainMat, 0, 1.6, 0);
    this.mesh.add(this.torso);

    if (this.charData.id === 'titan') {
      const armor = createPart(new THREE.BoxGeometry(1.1, 0.8, 0.7), secMat, 0, 1.7, 0);
      this.mesh.add(armor);
    } else if (this.charData.id === 'shadow') {
      const padL = createPart(new THREE.BoxGeometry(0.4, 0.2, 0.4), secMat, 0.6, 2.1, 0);
      const padR = createPart(new THREE.BoxGeometry(0.4, 0.2, 0.4), secMat, -0.6, 2.1, 0);
      this.mesh.add(padL);
      this.mesh.add(padR);
    }

    this.head = createPart(new THREE.SphereGeometry(0.32, 16, 16), secMat, 0, 2.5, 0);
    this.mesh.add(this.head);

    const visorMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const visor = createPart(new THREE.BoxGeometry(0.4, 0.1, 0.2), visorMat, 0, 2.55, 0.2);
    this.mesh.add(visor);

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

    const hairMat = new THREE.MeshStandardMaterial({ color: 0x090b13, roughness: 0.55, metalness: 0.05 });
    const accentMat = new THREE.MeshStandardMaterial({ color: primaryColor, roughness: 0.25, metalness: 0.65, emissive: primaryColor, emissiveIntensity: 0.2 });

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

    const ringGeo = new THREE.TorusGeometry(0.7, 0.02, 8, 24);
    const ringMat = new THREE.MeshBasicMaterial({ color: primaryColor, wireframe: true });
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

    const idleBreath = Math.sin(time * 4) * 0.03;
    this.torso.position.y = 1.6 + idleBreath;
    this.head.position.y = 2.5 + idleBreath;
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

    const ambient = new THREE.AmbientLight(0xffffff, 0.3);
    this.scene.add(ambient);

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
        defender.mesh.position.clone().add(new THREE.Vector3(0, 1.7, 0)),
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
            this.spawnHitParticles(defender.mesh.position.clone().add(new THREE.Vector3(0, 1.6, 0)), attacker.charData.hexColor);
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

      const dist = proj.mesh.position.distanceTo(proj.target.mesh.position.clone().add(new THREE.Vector3(0, 1.8, 0)));
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
    justifyContent: 'space-between',
    padding: '1.5rem',
    fontFamily: 'monospace',
    color: '#fff',
    userSelect: 'none'
  },
  charSelectHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid rgba(21,94,117,0.5)',
    paddingBottom: '1rem'
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
    cursor: 'pointer'
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
    margin: '1.5rem 0'
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
    marginBottom: '0.75rem'
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
    transition: 'all 0.2s'
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
    gap: '1.5rem'
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
    border: '2px solid'
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
    boxShadow: '0 0 25px rgba(0,240,255,0.4)'
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
    transition: 'all 0.2s'
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
    transition: 'all 0.2s'
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
    transition: 'all 0.2s'
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
    cursor: 'pointer'
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
    cursor: 'pointer'
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

const DialogueOverlay = ({ p1, p2, winner, speechEnabled, onContinue }) => {
  const isIntro = !winner;
  const lines = isIntro
    ? [{ name: p1.name, text: p1.quote, gender: p1.gender, color: p1.color }, { name: p2.name, text: p2.quote, gender: p2.gender, color: p2.color }]
    : [
      { name: winner.name, text: winner.id === p1.id ? p1.winLine : p2.winLine, gender: winner.gender, color: winner.color },
      { name: winner.id === p1.id ? p2.name : p1.name, text: winner.id === p1.id ? p2.loseLine : p1.loseLine, gender: winner.id === p1.id ? p2.gender : p1.gender, color: winner.id === p1.id ? p2.color : p1.color }
    ];
  const [index, setIndex] = useState(0);
  useEffect(() => { if (speechEnabled) speakDialogue(lines[index].name + '. ' + lines[index].text, lines[index].gender); }, [index, speechEnabled]);
  return (
    <div style={styles.dialogueOverlay}>
      <div style={styles.dialogueBox}>
        <div style={styles.dialogueHeader}>
          <span>{isIntro ? 'BEFORE THE FIGHT' : 'AFTERMATH'}</span>
          <button
            onClick={() => speakDialogue(lines[index].name + '. ' + lines[index].text, lines[index].gender)}
            style={styles.readButton}
          >
            <Volume2 size={14} /> READ DIALOGUE
          </button>
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