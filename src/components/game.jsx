import React, { useState, useEffect, useRef, useCallback } from 'react';

/* =====================================================================
   STYLES — plain style objects, no Tailwind. Spread + override as needed.
   ===================================================================== */
const styles = {
  root: { position: 'fixed', inset: 0, background: '#030308', color: '#e5e7eb', fontFamily: 'ui-monospace, Menlo, Consolas, "Courier New", monospace', overflow: 'hidden', userSelect: 'none', width: '100%', height: '100%' },
  canvas: { position: 'fixed', inset: 0, width: '100%', height: '100%', display: 'block' },
  screen: { position: 'fixed', inset: 0, zIndex: 5, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(3,3,8,.92)', gap: 12, textAlign: 'center', padding: 12, boxSizing: 'border-box', overflow: 'auto' },
  screenBare: { background: 'none', justifyContent: 'space-between' },
  h1: { fontSize: 'clamp(40px,11vw,100px)', fontStyle: 'italic', fontWeight: 900, margin: 0, backgroundImage: 'linear-gradient(90deg,#00f0ff,#d946ef,#facc15)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' },
  h2: { margin: '0 0 8px', fontStyle: 'italic', fontSize: 'clamp(18px,4vw,30px)', color: '#00f0ff' },
  subtitle: { color: '#00f0ff', fontSize: 12, letterSpacing: 2 },
  p: { maxWidth: 420, color: '#9ca3af', margin: 0 },
  button: { font: 'inherit', fontWeight: 800, letterSpacing: '.08em', padding: '11px 20px', borderRadius: 10, border: '2px solid #00f0ff', background: '#0b1220', color: '#00f0ff', cursor: 'pointer' },
  buttonOn: { background: '#00f0ff', color: '#000' },
  buttonSmall: { display: 'block', fontSize: 9, fontWeight: 400, opacity: 0.75, marginTop: 2, letterSpacing: 0 },
  panel: { background: 'rgba(3,3,8,.86)', border: '1px solid #12303a', borderRadius: 12, padding: 10, width: 'min(920px,100%)', boxSizing: 'border-box' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: 8 },
  gridNarrow: { display: 'flex', overflowX: 'auto', paddingBottom: 4, gap: 8 },
  card: { border: '2px solid #1f2937', borderRadius: 10, padding: 8, background: '#0b0f19', cursor: 'pointer', textAlign: 'left', fontSize: 11, minWidth: 0, flex: 'none' },
  cardP1: { borderColor: '#00f0ff', boxShadow: '0 0 16px #00f0ff88' },
  cardP2: { borderColor: '#ff2d75', boxShadow: '0 0 12px #ff2d7566' },
  name: { fontSize: 22, fontWeight: 900, fontStyle: 'italic', margin: '4px 0' },
  statRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 9, gap: 6, color: '#9ca3af', marginTop: 2 },
  statTrack: { width: '62%', height: 6, background: '#1f2937', borderRadius: 3, overflow: 'hidden' },
  statFill: { display: 'block', height: '100%' },
  weaponRow: { display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap', margin: '8px 0' },
  weaponBtn: { maxWidth: 180 },
  info: { fontSize: 12, lineHeight: 1.5, marginBottom: 6 },
  hud: { position: 'fixed', inset: 0, zIndex: 3, pointerEvents: 'none', padding: '14px', boxSizing: 'border-box' },
  hudRow: { display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'flex-start' },
  side: { flex: 1, maxWidth: 420, fontSize: 12, fontWeight: 700 },
  sideR: { textAlign: 'right' },
  bar: { height: 20, border: '2px solid', background: '#05070d', marginTop: 3, overflow: 'hidden' },
  barFill: { display: 'block', height: '100%', transition: 'width .1s' },
  superBar: { height: 7, border: '1px solid #4c1d95', background: '#05070d', marginTop: 3, overflow: 'hidden' },
  superBarFull: { borderColor: '#facc15' },
  timerBox: { textAlign: 'center', background: '#05070dcc', border: '1px solid #00f0ff', borderRadius: 10, padding: '4px 16px', fontSize: 10 },
  timerVal: { display: 'block', fontSize: 32, color: '#facc15', fontWeight: 900 },
  combo: { position: 'absolute', top: '38%', fontSize: 30, fontWeight: 900, fontStyle: 'italic' },
  help: { position: 'absolute', left: 14, bottom: 14, fontSize: 11, background: '#000a', padding: 8, borderRadius: 8, lineHeight: 1.5 },
  pauseBtn: { position: 'absolute', right: 14, bottom: 14, pointerEvents: 'auto', borderRadius: '50%', padding: '10px 14px' },
  banner: { position: 'fixed', inset: 0, zIndex: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', fontSize: 'clamp(30px,9vw,96px)', fontWeight: 900, fontStyle: 'italic', color: '#facc15', textShadow: '0 0 40px #fc0', textAlign: 'center' },
  dlg: { position: 'fixed', left: '50%', transform: 'translateX(-50%)', bottom: 14, width: 'min(760px,calc(100% - 20px))', zIndex: 6, background: 'rgba(3,3,8,.94)', border: '2px solid #00f0ff', borderRadius: 14, padding: 12, display: 'flex', gap: 12, boxSizing: 'border-box', cursor: 'pointer' },
  dlgPortrait: { flex: 'none', width: 52, height: 52, border: '3px solid', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 900 },
  dlgBody: { flex: 1, minWidth: 0, textAlign: 'left' },
  dlgName: { fontSize: 14 },
  dlgText: { minHeight: 44, fontSize: 15, lineHeight: 1.45, margin: '4px 0 8px' },
  dlgActions: { display: 'flex', gap: 8, justifyContent: 'flex-end' },
  dlgBtn: { padding: '6px 12px', fontSize: 11 },
  touchWrap: { position: 'fixed', left: 0, right: 0, bottom: 14, zIndex: 3, display: 'flex', justifyContent: 'space-between', padding: '0 10px', pointerEvents: 'none' },
  pad: { display: 'flex', gap: 8, pointerEvents: 'auto' },
  padBtn: { width: 58, height: 58, padding: 0, borderRadius: '50%', touchAction: 'none', fontSize: 18 },
};

/* =====================================================================
   SOUND (tiny WebAudio tone generator)
   ===================================================================== */
const A = {
  ctx: null,
  init() {
    if (!this.ctx) { const C = window.AudioContext || window.webkitAudioContext; if (C) this.ctx = new C(); }
    if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
  },
  t(ty, f0, f1, d, v) {
    if (!this.ctx) return;
    try {
      const c = this.ctx, o = c.createOscillator(), g = c.createGain(), n = c.currentTime;
      o.type = ty; o.frequency.setValueAtTime(f0, n); o.frequency.exponentialRampToValueAtTime(f1, n + d);
      g.gain.setValueAtTime(v, n); g.gain.exponentialRampToValueAtTime(0.01, n + d);
      o.connect(g); g.connect(c.destination); o.start(); o.stop(n + d);
    } catch (e) {}
  },
};
const sfx = {
  punch: () => A.t('triangle', 150, 30, 0.12, 0.3),
  kick: () => A.t('sine', 100, 10, 0.2, 0.5),
  special: () => A.t('sawtooth', 200, 800, 0.4, 0.3),
  ko: () => A.t('square', 180, 20, 0.8, 0.4),
  ann: () => A.t('sine', 440, 880, 0.3, 0.3),
  slash: () => A.t('sawtooth', 900, 200, 0.12, 0.15),
};

/* =====================================================================
   DATA — weapons (each with its own mechanics) + 8 fighters (unique powers)
   ===================================================================== */
const WEAPONS = {
  fists: { name: 'FISTS', reach: 1.8, dmg: 9, dur: 0.3, hits: 1, kb: 0.4, guard: 0.2, meter: 1, lunge: 1.5, tip: 'Chain hits to attack faster. Every 3rd hit is a heavy finisher.' },
  sword: { name: 'KATANA', reach: 2.5, dmg: 14, dur: 0.4, hits: 1, kb: 0.6, guard: 0.12, meter: 1, lunge: 5, tip: 'Lunges forward. Hitting a foe mid-attack is a 1.5x counter.' },
  staff: { name: 'BO STAFF', reach: 3.1, dmg: 7, dur: 0.55, hits: 2, kb: 1.4, guard: 0.05, meter: 1, lunge: 0, tip: 'Double sweep, huge knockback, best guard. Slow.' },
  nunchucks: { name: 'NUNCHUCKS', reach: 2.1, dmg: 5, dur: 0.22, hits: 1, kb: 0.2, guard: 0.3, meter: 1.5, lunge: 0, tip: 'Rapid fire. Damage ramps up per hit, fills meter fast.' },
};

const CHARACTERS = [
  { id: 'kai', name: 'KAI', full: 'Kai Tanaka', gender: 'm', title: 'Wandering Ronin', pw: 'wave', pre: "So you're {o}. Let's see if the stories are true.", win: "Steel doesn't lie, {o}. Train harder.", lose: 'Hm. My blade was too slow today.', color: '#38bdf8', hexColor: 0x38bdf8, secondaryColor: 0x1e293b, accent: 0xf1f5f9, skin: 0xe0ac84, hair: 0x111111, hairStyle: 'topknot', outfit: 'jacket', weapon: 'sword', scale: 1, speed: 85, power: 75, defense: 70, specialName: 'CRESCENT WAVE', specialDesc: 'Fires a razor-sharp wave of energy.', quote: 'My blade has never lost a duel.' },
  { id: 'mei', name: 'MEI', full: 'Mei Lin', gender: 'f', title: 'Storm Staff Disciple', pw: 'storm', pre: '{o}, breathe. It will be over soon.', win: 'Patience beats power, {o}. Remember that.', lose: 'Well fought, {o}. I will return stronger.', color: '#ef4444', hexColor: 0xef4444, secondaryColor: 0x450a0a, accent: 0xfbbf24, skin: 0xf1c9a5, hair: 0x1a1a1a, hairStyle: 'buns', outfit: 'dress', weapon: 'staff', scale: 0.95, speed: 90, power: 70, defense: 65, specialName: 'DRAGON TEMPEST', specialDesc: 'A slow spinning storm that hits several times.', quote: 'Water yields, then it crushes stone.' },
  { id: 'marcus', name: 'MARCUS', full: 'Marcus Cole', gender: 'm', title: 'Heavyweight Brawler', pw: 'quake', pre: 'Nothing personal, {o}. I just like winning.', win: 'Stay down, {o}. You did good.', lose: 'Ha! You hit like a truck, {o}.', color: '#f59e0b', hexColor: 0xf59e0b, secondaryColor: 0x292524, accent: 0xe7e5e4, skin: 0x8d5524, hair: 0x0a0a0a, hairStyle: 'bald', outfit: 'tank', weapon: 'fists', bulk: 1.15, scale: 1.08, speed: 55, power: 100, defense: 95, specialName: 'IRON HURRICANE', specialDesc: 'A ground shockwave. Jump to dodge it.', quote: "Come on then. Show me what you've got." },
  { id: 'sofia', name: 'SOFIA', full: 'Sofia Reyes', gender: 'f', title: 'Street Firebrand', pw: 'triple', pre: 'Hey {o}! Try to keep up, okay?', win: 'Too slow, {o}! Better luck next time!', lose: 'No way... {o}, rematch. Right now.', color: '#fb923c', hexColor: 0xfb923c, secondaryColor: 0x1f2937, accent: 0xfde68a, skin: 0xc68642, hair: 0x3b1f0e, hairStyle: 'ponytail', outfit: 'sport', weapon: 'nunchucks', scale: 0.97, speed: 95, power: 72, defense: 60, specialName: 'PHOENIX RUSH', specialDesc: 'Three fireballs in rapid succession.', quote: 'Try to keep up!' },
  { id: 'ren', name: 'REN', full: 'Ren Ishida', gender: 'm', title: 'Shadow Shinobi', pw: 'teleport', pre: "You won't see me move, {o}.", win: 'Already over, {o}. You blinked.', lose: 'Impossible. {o} saw through the shadows.', color: '#a855f7', hexColor: 0xa855f7, secondaryColor: 0x1e1b4b, accent: 0xe9d5ff, skin: 0xe0ac84, hair: 0x000000, hairStyle: 'hood', outfit: 'ninja', weapon: 'sword', scale: 1.02, speed: 100, power: 68, defense: 58, specialName: 'SHADOW LOTUS', specialDesc: 'Vanishes, reappears behind you, strikes and stuns.', quote: "You'll never see me coming." },
  { id: 'amara', name: 'AMARA', full: 'Amara Diallo', gender: 'f', title: 'Thunder Warden', pw: 'bolt', pre: 'The storm is coming for you, {o}.', win: 'The sky has spoken, {o}.', lose: 'You weathered me, {o}. Respect.', color: '#10b981', hexColor: 0x10b981, secondaryColor: 0x064e3b, accent: 0xfacc15, skin: 0x6b4226, hair: 0x0a0a0a, hairStyle: 'afro', outfit: 'jacket', weapon: 'staff', scale: 0.98, speed: 78, power: 80, defense: 72, specialName: 'THUNDER CALL', specialDesc: 'Marks the ground, then lightning strikes. Move!', quote: 'I was born under a thunderhead.' },
  { id: 'dante', name: 'DANTE', full: 'Dante Silva', gender: 'm', title: 'Flame Dancer', pw: 'dash', pre: "Let's light this place up, {o}!", win: 'Too hot for you, {o}, huh?', lose: 'Man, {o}... okay, that stung.', color: '#ec4899', hexColor: 0xec4899, secondaryColor: 0x27272a, accent: 0xfde047, skin: 0xd4a373, hair: 0x111111, hairStyle: 'mohawk', outfit: 'tank', weapon: 'nunchucks', scale: 1.03, speed: 88, power: 85, defense: 62, specialName: 'FLAME DASH', specialDesc: 'Blazes across the arena, hitting anyone in the way.', quote: 'Life is a dance floor. I lead.' },
  { id: 'yuki', name: 'YUKI', full: 'Yuki Sato', gender: 'f', title: 'Frost Duelist', pw: 'freeze', pre: 'Cool head, cold steel. Ready, {o}?', win: 'Frozen in place. Better luck next time, {o}.', lose: 'You melted my focus, {o}. Nicely done.', color: '#e2e8f0', hexColor: 0xf1f5f9, secondaryColor: 0x0e7490, accent: 0x67e8f9, skin: 0xf1c9a5, hair: 0xcbd5e1, hairStyle: 'ponytail', outfit: 'jacket', weapon: 'sword', scale: 0.96, speed: 92, power: 74, defense: 60, specialName: 'ICE PRISON', specialDesc: 'A frost bolt that freezes on hit.', quote: 'Winter never hurries.' },
];

const first = (c) => c.full.split(' ')[0];
const fill = (x, o) => x.replace('{o}', first(o));

/* =====================================================================
   THREE.JS LOADER
   ===================================================================== */
let T = null; // set once the CDN script loads
function useThreeJS() {
  const [loaded, setLoaded] = useState(!!(typeof window !== 'undefined' && window.THREE));
  const [error, setError] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.THREE) { T = window.THREE; setLoaded(true); return; }
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
    script.async = true;
    script.onload = () => { T = window.THREE; setLoaded(true); };
    script.onerror = () => setError(true);
    document.head.appendChild(script);
    return () => { script.onload = null; script.onerror = null; };
  }, []);
  return { loaded, error };
}

/* =====================================================================
   FIGHTER — builds the 3D rig (body/outfit/hair/weapon) and animates it
   ===================================================================== */
class Fighter {
  constructor(cd, x) {
    this.c = cd;
    this.w = cd.weapon || 'fists';
    this.wd = WEAPONS[this.w];
    this.hp = 100; this.sp = 0;
    this.st = 'IDLE'; this.tm = 0; this.dur = 0;
    this.hn = 0; this.ch = 0; this.ct = 0; this.dashT = 0;
    this.grounded = true; this.vy = 0;
    this.sway = [];
    this.faceR = x < 0;
    this.punchLeft = !this.faceR;
    this.mesh = new T.Group();
    this.mesh.position.set(x, 0, 0);
    this.build();
  }

  build() {
    const c = this.c, f = c.gender === 'f', o = c.outfit, bulk = c.bulk || 1;
    const mat = (col, r = 0.65, m = 0.1, em = 0) => new T.MeshStandardMaterial({ color: col, roughness: r, metalness: m, emissive: col, emissiveIntensity: em });
    const main = mat(c.hexColor, 0.6, 0.15, 0.12), sec = mat(c.secondaryColor, 0.7, 0.1, 0.05), acc = mat(c.accent, 0.4, 0.6, 0.1), skin = mat(c.skin, 0.8, 0, 0), dark = mat(0x15151f, 0.8, 0.1), hairM = mat(c.hair, 0.9, 0);
    const bare = ['tank', 'sport', 'dress'].includes(o);
    const torsoM = o === 'ninja' ? sec : main, armM = bare ? skin : (o === 'ninja' ? sec : main), legM = o === 'sport' ? skin : sec;

    const part = (g, m, x, y, z, p = this.mesh) => { const s = new T.Mesh(g, m); s.position.set(x, y, z); p.add(s); return s; };
    const flow = (w, h, d, m, x, y, z, p = this.mesh) => { const g = new T.Group(); g.position.set(x, y, z); p.add(g); const b = new T.BoxGeometry(w, h, d); b.translate(0, -h / 2, 0); g.add(new T.Mesh(b, m)); this.sway.push(g); return g; };
    const limb = (w, h, px, py, m, cm, ch, fz) => { const g = new T.Group(); g.position.set(px, py, 0); this.mesh.add(g); const b = new T.BoxGeometry(w, h, w); b.translate(0, -h / 2, 0); g.add(new T.Mesh(b, m)); part(new T.BoxGeometry(w + 0.05, ch, w + 0.05 + fz), cm, 0, -h + ch / 2, fz / 2, g); return g; };

    // body: men = broad shoulders + V taper; women = narrow shoulders, small waist, wider hips
    const sw = (f ? 0.36 : 0.46) * bulk, ww = (f ? 0.24 : 0.33) * bulk;
    this.torso = part(new T.CylinderGeometry(sw, ww, 1.1, 14), torsoM, 0, 1.6, 0); this.torso.scale.z = 0.62;
    part(new T.CylinderGeometry(ww, ww * (f ? 1.5 : 1.05), 0.45, 14), sec, 0, 1.08, 0).scale.z = 0.66;
    part(new T.CylinderGeometry(0.1, 0.12, 0.25, 8), skin, 0, 2.2, 0);
    if (o !== 'sport') part(new T.CylinderGeometry(ww + 0.05, ww + 0.05, 0.1, 14), acc, 0, 1.28, 0).scale.z = 0.66;
    if (o === 'jacket') { flow(0.62, 1, 0.08, main, 0, 1.3, -0.24); part(new T.BoxGeometry(0.7, 0.16, 0.42), main, 0, 2.15, 0); }
    else if (o === 'dress') { part(new T.CylinderGeometry(0.3, 0.5, 0.75, 16), main, 0, 0.95, 0).scale.z = 0.8; part(new T.TorusGeometry(0.47, 0.025, 6, 20), acc, 0, 0.6, 0).rotation.x = Math.PI / 2; }
    else if (o === 'sport') part(new T.CylinderGeometry(ww * 1.25, ww * 1.25, 0.3, 14), skin, 0, 1.36, 0).scale.z = 0.62;
    else if (o === 'ninja') { part(new T.CylinderGeometry(sw + 0.03, sw + 0.03, 0.16, 14), main, 0, 2.12, 0).scale.z = 0.62; flow(0.26, 1.1, 0.05, main, 0, 2.15, -0.2); }

    // head, face, hair
    const hr = f ? 0.29 : 0.32;
    this.head = part(new T.SphereGeometry(hr, 18, 18), skin, 0, 2.5, 0);
    [-1, 1].forEach((s) => part(new T.BoxGeometry(0.07, 0.045, 0.03), dark, s * hr * 0.35, 0.02, hr * 0.92, this.head));
    const hc = (r = hr * 1.07, a = 0.55) => { const m = part(new T.SphereGeometry(r, 18, 12, 0, Math.PI * 2, 0, Math.PI * a), hairM, 0, 0.02, -0.02, this.head); m.rotation.x = -0.3; };
    const hs = c.hairStyle;
    if (hs === 'topknot') { hc(); part(new T.SphereGeometry(0.12, 10, 10), hairM, 0, hr + 0.1, -0.08, this.head); part(new T.CylinderGeometry(hr * 1.12, hr * 1.12, 0.07, 16), acc, 0, 0.12, 0, this.head); }
    else if (hs === 'buns') { hc(); [-1, 1].forEach((s) => part(new T.SphereGeometry(0.13, 10, 10), hairM, s * 0.27, hr * 0.8, -0.05, this.head)); }
    else if (hs === 'ponytail') { hc(); flow(0.13, 0.75, 0.13, hairM, 0, hr * 0.5, -hr * 0.85, this.head); }
    else if (hs === 'hood') { hc(hr * 1.12, 0.62); part(new T.BoxGeometry(hr * 1.7, 0.22, hr * 1.9), sec, 0, -0.15, 0, this.head); }
    else if (hs === 'afro') part(new T.SphereGeometry(hr * 1.3, 14, 14), hairM, 0, 0.14, -0.17, this.head);
    else if (hs === 'mohawk') part(new T.BoxGeometry(0.09, 0.22, 0.55), hairM, 0, hr * 0.95, -0.02, this.head);
    else if (hs === 'bald') part(new T.BoxGeometry(hr * 1.3, 0.2, 0.14), hairM, 0, -0.17, hr * 0.78, this.head);

    // limbs
    const aw = (f ? 0.17 : 0.23) * bulk, lw = (f ? 0.21 : 0.27) * bulk, sx = sw + 0.1, wr = bare ? sec : acc;
    this.leftArm = limb(aw, 0.9, sx, 2.05, armM, wr, 0.26, 0);
    this.rightArm = limb(aw, 0.9, -sx, 2.05, armM, wr, 0.26, 0);
    this.leftLeg = limb(lw, 1.05, 0.22 * bulk, 1, legM, dark, 0.3, 0.12);
    this.rightLeg = limb(lw, 1.05, -0.22 * bulk, 1, legM, dark, 0.3, 0.12);
    this.mkWeapon(this.punchLeft ? this.leftArm : this.rightArm);

    this.ring = new T.Mesh(new T.TorusGeometry(0.7, 0.02, 8, 24), new T.MeshBasicMaterial({ color: c.hexColor, wireframe: true }));
    this.ring.rotation.x = Math.PI / 2; this.ring.position.y = 0.05;
    this.mesh.add(this.ring);
    this.mesh.scale.setScalar(c.scale || 1);
  }

  mkWeapon(arm) {
    if (this.w === 'fists') return;
    const g = new T.Group(); g.position.y = -0.9; arm.add(g); this.wg = g;
    const M = (col, m, r) => new T.MeshStandardMaterial({ color: col, metalness: m, roughness: r });
    const steel = new T.MeshStandardMaterial({ color: 0xe5edf5, metalness: 0.9, roughness: 0.2, emissive: this.c.hexColor, emissiveIntensity: 0.3 });
    const wood = M(0x6b3f1d, 0, 0.8), gold = M(0xfbbf24, 0.8, 0.3), grip = M(0x18181b, 0, 0.9);
    const add = (geo, m, x, y, z, p = g) => { const s = new T.Mesh(geo, m); s.position.set(x, y, z); p.add(s); return s; };
    if (this.w === 'sword') { add(new T.CylinderGeometry(0.035, 0.035, 0.36, 8), grip, 0, 0, 0); add(new T.CylinderGeometry(0.11, 0.11, 0.04, 10), gold, 0, -0.19, 0); add(new T.BoxGeometry(0.02, 1.3, 0.07), steel, 0, -0.86, 0); }
    else if (this.w === 'staff') { add(new T.CylinderGeometry(0.04, 0.04, 2.7, 8), wood, 0, -0.25, 0); [-1.55, 1.05].forEach((y) => add(new T.CylinderGeometry(0.07, 0.07, 0.2, 8), gold, 0, y, 0)); }
    else { add(new T.CylinderGeometry(0.04, 0.04, 0.55, 8), wood, 0, -0.28, 0); this.chuck = new T.Group(); this.chuck.position.y = -0.56; g.add(this.chuck); add(new T.CylinderGeometry(0.012, 0.012, 0.2, 6), grip, 0, -0.1, 0, this.chuck); add(new T.CylinderGeometry(0.04, 0.04, 0.55, 8), wood, 0, -0.48, 0, this.chuck); }
  }

  animate(dt, t, op) {
    if (op && this.st !== 'KO') { this.faceR = op.x > this.mesh.position.x; this.mesh.rotation.y = this.faceR ? Math.PI / 2 : -Math.PI / 2; }
    if (!this.grounded) {
      this.vy -= 25 * dt; this.mesh.position.y += this.vy * dt;
      if (this.mesh.position.y <= 0) { this.mesh.position.y = 0; this.grounded = true; this.vy = 0; if (this.st === 'JUMPING') this.st = 'IDLE'; }
    }
    const br = Math.sin(t * 4) * 0.03;
    if (this.ct > 0) { this.ct -= dt; if (this.ct <= 0) this.ch = 0; }
    if (this.wg) this.wg.rotation.x = 0;
    this.torso.position.y = 1.6 + br; this.head.position.y = 2.5 + br;
    this.ring.rotation.z += dt * 2;

    const L = { x: -0.3, z: 0.2 }, R = { x: -0.3, z: -0.2 }, LL = { x: 0 }, RL = { x: 0 }, P = this.punchLeft ? L : R;
    if (this.w !== 'fists') P.x = -0.9;
    this.sway.forEach((p, i) => { p.rotation.x = 0.15 + Math.sin(t * 4 + i) * 0.1 + (this.st === 'WALKING' ? 0.3 : 0); });
    if (this.chuck) this.chuck.rotation.x = Math.sin(t * 9) * (this.st === 'PUNCHING' ? 1.4 : 0.35);

    if (this.tm > 0) {
      this.tm -= dt;
      const p = 1 - this.tm / this.dur, e = Math.sin(p * Math.PI);
      if (this.st === 'PUNCHING') {
        if (this.w === 'fists') P.x = -Math.PI / 2 - e * 0.8;
        else if (this.w === 'staff') { P.x = -1.5 - e * 0.4; this.wg.rotation.x = p * Math.PI * 4; }
        else if (this.w === 'nunchucks') P.x = -1.3 - e * 0.9;
        else P.x = -2.7 + p * 1.7;
      } else if (this.st === 'KICKING') RL.x = -e * 1.5;
      else if (this.st === 'SPECIAL') { L.x = R.x = -Math.PI / 1.5 - e * 0.5; this.ring.scale.setScalar(1 + e * 1.2); }
      else if (this.st === 'BLOCKING') { L.x = R.x = -Math.PI / 1.3; L.z = 0.5; R.z = -0.5; }
      else if (this.st === 'HIT') { this.torso.rotation.x = -0.3; this.head.rotation.x = -0.4; }
    } else if (!['IDLE', 'WALKING', 'JUMPING', 'KO'].includes(this.st)) {
      this.st = 'IDLE'; this.torso.rotation.x = this.head.rotation.x = 0; this.ring.scale.setScalar(1);
    }

    if (this.st === 'KO') { this.mesh.rotation.z = this.faceR ? -Math.PI / 2 : Math.PI / 2; this.mesh.position.y = 0.3; }
    else {
      const k = Math.min(1, 18 * dt);
      this.leftArm.rotation.x += (L.x - this.leftArm.rotation.x) * k; this.leftArm.rotation.z += (L.z - this.leftArm.rotation.z) * k;
      this.rightArm.rotation.x += (R.x - this.rightArm.rotation.x) * k; this.rightArm.rotation.z += (R.z - this.rightArm.rotation.z) * k;
      this.leftLeg.rotation.x += (LL.x - this.leftLeg.rotation.x) * k; this.rightLeg.rotation.x += (RL.x - this.rightLeg.rotation.x) * k;
    }
  }

  jump() { if (this.grounded && this.tm <= 0 && this.st !== 'KO') { this.vy = 10; this.grounded = false; this.st = 'JUMPING'; } }

  attack(type) {
    if (this.tm > 0 || this.st === 'KO' || (type === 'SPECIAL' && this.sp < 100)) return false;
    this.st = type; this.hn = 0;
    if (type === 'PUNCHING') { this.dur = (this.wd.dur / (this.c.speed / 70)) * (this.w === 'fists' ? 1 - 0.12 * Math.min(this.ch, 2) : 1); this.w === 'fists' ? sfx.punch() : sfx.slash(); }
    else if (type === 'KICKING') { this.dur = 0.45 / (this.c.speed / 70); sfx.kick(); }
    else { this.sp = 0; this.dur = 0.8; sfx.special(); }
    this.tm = this.dur;
    return true;
  }

  dmg(n) {
    if (this.st === 'KO') return;
    if (this.st === 'BLOCKING') n *= this.wd.guard;
    else { this.st = 'HIT'; this.dur = this.tm = Math.max(this.tm, 0.35); }
    this.sp = Math.min(100, this.sp + n * 1.2);
    this.hp = Math.max(0, this.hp - n);
    if (this.hp <= 0) { this.st = 'KO'; sfx.ko(); }
  }

  reset(x) {
    this.hp = 100; this.st = 'IDLE'; this.tm = 0; this.grounded = true; this.vy = 0;
    this.mesh.position.set(x, 0, 0); this.mesh.rotation.set(0, 0, 0);
    this.torso.rotation.x = this.head.rotation.x = 0;
  }
}

/* =====================================================================
   ENGINE — scene, camera, fight loop, AI, weapon mechanics, unique powers
   ===================================================================== */
class Engine {
  constructor(canvas, keysRef, cb) {
    this.canvas = canvas; this.keysRef = keysRef; this.cb = cb;
    this.active = true;
    this.mode = 'idle'; this.paused = true; this.brk = false;
    this.round = 1; this.w1 = 0; this.w2 = 0; this.time = 99; this.tAcc = 0;
    this.combo = [0, 0]; this.comboT = [0, 0];
    this.shake = 0; this.last = 0; this.token = 0;
    this.p1 = null; this.p2 = null; this.pv = null;
    this.projs = []; this.parts = []; this.bolts = [];
    this.initScene();
  }

  initScene() {
    this.scene = new T.Scene();
    this.scene.background = new T.Color(0x030308);
    this.scene.fog = new T.FogExp2(0x030308, 0.025);
    this.cam = new T.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
    this.cam.position.set(0, 2.5, 7.5);
    this.renderer = new T.WebGLRenderer({ canvas: this.canvas, antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.scene.add(new T.AmbientLight(0xffffff, 0.55));
    const a = new T.PointLight(0x00f0ff, 1.5, 22); a.position.set(-6, 6, 3); this.scene.add(a);
    const b = new T.PointLight(0xff0055, 1.5, 22); b.position.set(6, 6, 3); this.scene.add(b);
    const d = new T.DirectionalLight(0xffffff, 0.5); d.position.set(0, 6, 8); this.scene.add(d);
    const grid = new T.GridHelper(24, 24, 0x00f0ff, 0x221144); grid.position.y = 0.01; this.scene.add(grid);
    const floor = new T.Mesh(new T.PlaneGeometry(24, 24), new T.MeshStandardMaterial({ color: 0x050510, roughness: 0.8 }));
    floor.rotation.x = -Math.PI / 2; this.scene.add(floor);
    for (let i = -10; i <= 10; i += 4) {
      const p = new T.Mesh(new T.BoxGeometry(0.6, 8, 0.6), new T.MeshStandardMaterial({ color: 0x111122, metalness: 0.8 }));
      p.position.set(i, 4, -6); this.scene.add(p);
    }

    this._onResize = () => {
      this.cam.aspect = window.innerWidth / window.innerHeight;
      this.cam.updateProjectionMatrix();
      if (this.p1) this.cam.position.z = this.camZ();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', this._onResize);
    requestAnimationFrame(this.loop);
  }

  camZ() { return Math.min(20, 7.5 * Math.max(1, 1.35 / this.cam.aspect)); }
  say(s) { this.cb.onBanner(s); }

  burst(pos, col) {
    for (let i = 0; i < 12; i++) {
      const m = new T.Mesh(new T.BoxGeometry(0.08, 0.08, 0.08), new T.MeshBasicMaterial({ color: col }));
      m.position.copy(pos); this.scene.add(m);
      this.parts.push({ m, v: new T.Vector3((Math.random() - 0.5) * 8, (Math.random() - 0.5) * 8, (Math.random() - 0.5) * 8), life: 0.3 });
    }
  }

  fire(a, d, o = {}) {
    const m = new T.Mesh(new T.SphereGeometry(0.35, 16, 16), new T.MeshBasicMaterial({ color: o.freeze ? 0x9be7ff : a.c.hexColor }));
    if (o.scale) m.scale.setScalar(o.scale); else if (a.w === 'sword') m.scale.set(0.35, 2, 1.4);
    m.position.set(a.mesh.position.x + (a.faceR ? 1 : -1), o.y || 1.8, 0);
    this.scene.add(m);
    this.projs.push({ m, dir: a.faceR ? 1 : -1, o: a, t: d, spd: o.spd || 12, dmg: o.dmg || 25, pierce: o.pierce, freeze: o.freeze, cd: 0, n: 0 });
  }

  stun(d, t) { if (d.st !== 'KO') { d.st = 'HIT'; d.dur = d.tm = t; } }

  hurt(a, d, dmg, kb, mt = 1) {
    d.dmg(dmg);
    a.sp = Math.min(100, a.sp + 15 * mt);
    d.mesh.position.x = Math.max(-8, Math.min(8, d.mesh.position.x + (d.mesh.position.x > a.mesh.position.x ? 1 : -1) * kb));
    const q = d.mesh.position.clone(); q.y += 1.8;
    this.burst(q, a.c.hexColor);
    this.shake = 0.2;
  }

  special(a, d) {
    const ty = a.c.pw, dir = a.faceR ? 1 : -1, dx = Math.abs(d.mesh.position.x - a.mesh.position.x);
    this.say(a.c.specialName + '!');
    setTimeout(() => { if (this.mode === 'fight') this.say(''); }, 800);
    if (ty === 'wave') this.fire(a, d);
    else if (ty === 'freeze') this.fire(a, d, { freeze: 1, dmg: 14, spd: 14, scale: 0.6 });
    else if (ty === 'storm') this.fire(a, d, { spd: 5, dmg: 8, pierce: 1, scale: 2.4 });
    else if (ty === 'triple') [0, 1, 2].forEach((i) => setTimeout(() => { if (this.mode === 'fight' && !this.paused && a.st !== 'KO') this.fire(a, d, { dmg: 12, y: 1 + i * 0.8, scale: 0.7 }); }, i * 130));
    else if (ty === 'quake') { for (let i = 1; i < 6; i++) { const q = a.mesh.position.clone(); q.x += dir * i; q.y = 0.2; this.burst(q, a.c.hexColor); } if (dx < 5 && d.grounded) this.hurt(a, d, 30, 3, 0); }
    else if (ty === 'teleport') { a.mesh.position.x = Math.max(-8, Math.min(8, d.mesh.position.x + dir * 1.2)); this.burst(a.mesh.position.clone(), a.c.hexColor); this.hurt(a, d, 20, 0, 0); this.stun(d, 0.6); }
    else if (ty === 'dash') { a.dashT = 0.35; a.dashD = dir; a.dashHit = 0; }
    else if (ty === 'bolt') {
      const m = new T.Mesh(new T.RingGeometry(0.6, 1, 24), new T.MeshBasicMaterial({ color: 0xfacc15, side: T.DoubleSide }));
      m.rotation.x = -Math.PI / 2; m.position.set(d.mesh.position.x, 0.05, 0); this.scene.add(m);
      this.bolts.push({ x: d.mesh.position.x, t: 0.7, a, d, m, b: null });
    }
  }

  move(a, d, dt) {
    const dx = d.mesh.position.x - a.mesh.position.x, dir = a.faceR ? 1 : -1;
    if (a.dashT > 0) {
      a.dashT -= dt; a.mesh.position.x += a.dashD * 14 * dt;
      if (!a.dashHit && Math.abs(dx) < 1.5) { a.dashHit = 1; this.hurt(a, d, 22, 2.5, 0); }
      if (Math.random() < 0.15) { const q = a.mesh.position.clone(); q.y = 0.8; this.burst(q, a.c.hexColor); }
    } else if (a.tm > 0 && a.st === 'PUNCHING' && a.wd.lunge && 1 - a.tm / a.dur < 0.5 && Math.abs(dx) > 1.2) {
      a.mesh.position.x += dir * a.wd.lunge * dt;
    }
  }

  playerInput(dt) {
    const p = this.p1, keys = this.keysRef.current;
    if (p.st === 'WALKING') p.st = 'IDLE';
    if (p.st === 'KO' || p.tm > 0) return;
    const m = 4.5 * dt;
    if (keys.a) { p.mesh.position.x -= m; if (p.grounded) p.st = 'WALKING'; }
    else if (keys.d) { p.mesh.position.x += m; if (p.grounded) p.st = 'WALKING'; }
    if (keys.w || keys[' ']) p.jump();
    if (keys.j) p.attack('PUNCHING');
    if (keys.k) p.attack('KICKING');
    if (keys.i && p.attack('SPECIAL')) this.special(p, this.p2);
    if (keys.l) { p.st = 'BLOCKING'; p.tm = p.dur = 0.1; }
  }

  aiInput(dt) {
    const a = this.p2, d = Math.abs(this.p1.mesh.position.x - a.mesh.position.x);
    if (a.st === 'WALKING') a.st = 'IDLE';
    if (a.st === 'KO' || a.tm > 0) return;
    if (d > a.wd.reach * 0.85) { a.mesh.position.x += (this.p1.mesh.position.x > a.mesh.position.x ? 1 : -1) * 3.5 * dt; a.st = 'WALKING'; }
    else {
      const r = Math.random();
      if (a.sp >= 100 && r < 0.05) { if (a.attack('SPECIAL')) this.special(a, this.p1); }
      else if (this.p1.tm > 0 && r < 0.3) { a.st = 'BLOCKING'; a.tm = a.dur = 0.2; }
      else if (r < 0.04) a.attack('PUNCHING');
      else if (r < 0.08) a.attack('KICKING');
    }
  }

  hits(a, d, who) {
    if (a.tm <= 0 || (a.st !== 'PUNCHING' && a.st !== 'KICKING')) return;
    const pu = a.st === 'PUNCHING', W = a.wd, n = pu ? W.hits : 1, p = 1 - a.tm / a.dur;
    if (a.hn >= n || p < 0.3 + (0.4 * a.hn) / n || p > 0.85 || a.mesh.position.distanceTo(d.mesh.position) >= (pu ? W.reach : 1.8)) return;
    a.hn++;
    let m = pu ? W.dmg : 15, fin = 0;
    if (pu) {
      a.ch++; a.ct = 1;
      if (a.w === 'fists' && a.ch % 3 === 0) { m *= 1.7; fin = 1; }
      if (a.w === 'nunchucks') m *= 1 + 0.15 * Math.min(a.ch - 1, 4);
      if (a.w === 'sword' && d.tm > 0 && (d.st === 'PUNCHING' || d.st === 'KICKING')) m *= 1.5;
    }
    this.hurt(a, d, (m * a.c.power) / 70, (pu ? W.kb : 0.3) * (fin ? 4 : 1), pu ? W.meter : 1);
    this.combo[who]++; this.comboT[who] = 1.5;
  }

  updateFx(dt) {
    for (let i = this.projs.length - 1; i >= 0; i--) {
      const p = this.projs[i];
      p.m.position.x += p.dir * p.spd * dt; p.cd -= dt;
      const q = p.t.mesh.position.clone(); q.y += 1.8;
      if (p.cd <= 0 && p.m.position.distanceTo(q) < 1.2) {
        const bl = p.t.st === 'BLOCKING';
        p.t.dmg(p.dmg); this.burst(p.m.position, p.o.c.hexColor); this.shake = 0.35;
        if (p.freeze && !bl) this.stun(p.t, 1.2);
        if (p.pierce && ++p.n < 4) p.cd = 0.3; else { this.scene.remove(p.m); this.projs.splice(i, 1); }
      } else if (Math.abs(p.m.position.x) > 12) { this.scene.remove(p.m); this.projs.splice(i, 1); }
    }
    for (let i = this.bolts.length - 1; i >= 0; i--) {
      const b = this.bolts[i]; b.t -= dt;
      if (!b.b && b.t <= 0) {
        b.b = new T.Mesh(new T.CylinderGeometry(0.3, 0.3, 9, 8), new T.MeshBasicMaterial({ color: 0xfff7ae }));
        b.b.position.set(b.x, 4.5, 0); this.scene.add(b.b);
        if (Math.abs(b.d.mesh.position.x - b.x) < 1.3 && b.d.mesh.position.y < 1.5) this.hurt(b.a, b.d, 28, 0.5, 0);
        this.shake = 0.4; b.t = 0.2;
      } else if (b.b && b.t <= 0) { this.scene.remove(b.m); this.scene.remove(b.b); this.bolts.splice(i, 1); }
    }
    for (let i = this.parts.length - 1; i >= 0; i--) {
      const p = this.parts[i]; p.life -= dt; p.m.position.addScaledVector(p.v, dt);
      if (p.life <= 0) { this.scene.remove(p.m); this.parts.splice(i, 1); }
    }
  }

  hud() {
    this.cb.onHud({
      p1Health: this.p1.hp, p2Health: this.p2.hp,
      p1Super: this.p1.sp, p2Super: this.p2.sp,
      time: this.time, round: this.round,
      w1: this.w1, w2: this.w2,
      combo1: this.combo[0], combo2: this.combo[1],
    });
  }

  roundEnd() {
    this.paused = true; this.brk = true;
    let w = null; const id = ++this.token;
    if (this.p1.hp > this.p2.hp) { this.w1++; w = this.p1.c.name; }
    else if (this.p2.hp > this.p1.hp) { this.w2++; w = this.p2.c.name; }
    if (this.w1 >= 2 || this.w2 >= 2) {
      this.say('K.O.!'); sfx.ko();
      setTimeout(() => {
        if (id !== this.token) return;
        this.say('');
        const W = this.w1 >= 2 ? this.p1 : this.p2, L = W === this.p1 ? this.p2 : this.p1;
        this.mode = 'talk';
        this.cb.onDialogue(
          [{ char: W.c, text: fill(W.c.win, L.c) }, { char: L.c, text: fill(L.c.lose, W.c) }],
          () => { this.mode = 'over'; this.cb.onMatchOver(W.c.full + ' WINS!'); }
        );
      }, 2000);
    } else {
      this.say(w ? 'ROUND WINNER: ' + w : 'TIME UP!'); sfx.ann();
      setTimeout(() => {
        if (id !== this.token) return;
        this.say('READY... FIGHT!');
        setTimeout(() => {
          if (id !== this.token) return;
          this.say(''); this.round++; this.time = 99;
          this.p1.reset(-2.5); this.p2.reset(2.5);
          this.brk = false; this.paused = false;
        }, 1000);
      }, 1800);
    }
  }

  clearFighters() {
    [this.p1, this.p2, this.pv].forEach((f) => f && this.scene.remove(f.mesh));
    this.p1 = this.p2 = this.pv = null;
    this.projs.forEach((p) => this.scene.remove(p.m)); this.projs = [];
    this.parts.forEach((p) => this.scene.remove(p.m)); this.parts = [];
    this.bolts.forEach((b) => { this.scene.remove(b.m); if (b.b) this.scene.remove(b.b); }); this.bolts = [];
  }

  showPreview(charData) {
    this.token++; this.clearFighters();
    this.mode = 'select';
    this.cam.position.set(0, 1.9, 6.6); this.cam.lookAt(0, 1.5, 0);
    this.say('');
    this.pv = new Fighter(charData, 0);
    this.scene.add(this.pv.mesh);
  }

  startMatch(p1Data, p2Data) {
    this.token++; this.clearFighters();
    this.p1 = new Fighter(p1Data, -2.5); this.p2 = new Fighter(p2Data, 2.5);
    this.scene.add(this.p1.mesh); this.scene.add(this.p2.mesh);
    this.round = 1; this.w1 = 0; this.w2 = 0; this.time = 99; this.tAcc = 0;
    this.combo = [0, 0]; this.comboT = [0, 0];
    this.brk = false; this.paused = true; this.mode = 'talk';
    this.cam.rotation.set(0, 0, 0); this.cam.position.set(0, 2.5, this.camZ());
    this.cb.onDialogue(
      [{ char: this.p1.c, text: fill(this.p1.c.pre, this.p2.c) }, { char: this.p2.c, text: fill(this.p2.c.pre, this.p1.c) }],
      () => {
        this.mode = 'fight'; this.paused = false;
        this.say('ROUND 1... FIGHT!'); sfx.ann();
        setTimeout(() => { if (this.mode === 'fight') this.say(''); }, 1500);
      }
    );
  }

  pause(on) { if (this.mode !== 'fight' || this.brk) return; this.paused = on; }

  destroy() {
    this.active = false;
    window.removeEventListener('resize', this._onResize);
    if (this.renderer) this.renderer.dispose();
  }

  loop = (ts) => {
    if (!this.active) return;
    requestAnimationFrame(this.loop);
    const dt = Math.min(0.05, (ts - this.last) / 1000); this.last = ts; const t = ts / 1000;

    if (this.mode === 'select' && this.pv) {
      this.pv.animate(dt, t, null);
      this.pv.mesh.rotation.y = t * 0.8;
    } else if ((this.mode === 'fight' || this.mode === 'over' || this.mode === 'talk') && this.p1) {
      if (this.mode === 'fight' && !this.paused) {
        this.tAcc += dt; if (this.tAcc >= 1 && this.time > 0) { this.time--; this.tAcc = 0; }
        for (let i = 0; i < 2; i++) { if (this.comboT[i] > 0) { this.comboT[i] -= dt; if (this.comboT[i] <= 0) this.combo[i] = 0; } }
        this.playerInput(dt); this.aiInput(dt);
        this.move(this.p1, this.p2, dt); this.move(this.p2, this.p1, dt);
        this.hits(this.p1, this.p2, 0); this.hits(this.p2, this.p1, 1);
        this.updateFx(dt);
        this.p1.mesh.position.x = Math.max(-8, Math.min(8, this.p1.mesh.position.x));
        this.p2.mesh.position.x = Math.max(-8, Math.min(8, this.p2.mesh.position.x));
        this.p1.animate(dt, t, this.p2.mesh.position); this.p2.animate(dt, t, this.p1.mesh.position);
        if (this.p1.hp <= 0 || this.p2.hp <= 0 || this.time <= 0) this.roundEnd();
      } else if (this.mode !== 'fight') {
        this.p1.animate(dt, t, this.p2.mesh.position); this.p2.animate(dt, t, this.p1.mesh.position);
      }
      const mx = (this.p1.mesh.position.x + this.p2.mesh.position.x) / 2;
      this.cam.position.x += (mx - this.cam.position.x) * dt * 3;
      if (this.shake > 0) { this.shake -= dt; this.cam.position.x += (Math.random() - 0.5) * 0.3; this.cam.position.y = 2.5 + (Math.random() - 0.5) * 0.3; }
      else this.cam.position.y = 2.5;
      this.hud();
    }
    this.renderer.render(this.scene, this.cam);
  };
}

/* =====================================================================
   small helpers / hooks used by the component
   ===================================================================== */
function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => (typeof window !== 'undefined' ? window.matchMedia(query).matches : false));
  useEffect(() => {
    const mq = window.matchMedia(query);
    const handler = () => setMatches(mq.matches);
    handler();
    if (mq.addEventListener) mq.addEventListener('change', handler); else mq.addListener(handler);
    return () => { if (mq.removeEventListener) mq.removeEventListener('change', handler); else mq.removeListener(handler); };
  }, [query]);
  return matches;
}

function StatBar({ label, value, color }) {
  return (
    <div style={styles.statRow}>
      <span>{label}</span>
      <div style={styles.statTrack}><i style={{ ...styles.statFill, width: value + '%', background: color }} /></div>
    </div>
  );
}

function TouchBtn({ keysRef, k, children }) {
  const set = (v) => { keysRef.current[k] = v; };
  return (
    <button
      style={{ ...styles.button, ...styles.padBtn }}
      onPointerDown={(e) => { e.preventDefault(); set(true); }}
      onPointerUp={() => set(false)}
      onPointerCancel={() => set(false)}
      onPointerLeave={() => set(false)}
      onContextMenu={(e) => e.preventDefault()}
    >
      {children}
    </button>
  );
}

/* =====================================================================
   GAME — the component
   ===================================================================== */
export default function Game() {
  const canvasRef = useRef(null);
  const engineRef = useRef(null);
  const keysRef = useRef({});
  const typeTimer = useRef(null);
  const { loaded } = useThreeJS();

  const isNarrow = useMediaQuery('(max-width:700px)');
  const [isTouch] = useState(() => typeof window !== 'undefined' && (window.matchMedia('(pointer:coarse)').matches || 'ontouchstart' in window));

  const [screen, setScreen] = useState('splash'); // splash | select | fight | pause | over
  const [p1Idx, setP1Idx] = useState(0);
  const [p2Idx, setP2Idx] = useState(1);
  const [weapon, setWeapon] = useState(CHARACTERS[0].weapon);
  const [hud, setHud] = useState({ p1Health: 100, p2Health: 100, p1Super: 0, p2Super: 0, time: 99, round: 1, w1: 0, w2: 0, combo1: 0, combo2: 0 });
  const [banner, setBanner] = useState('');
  const [winnerText, setWinnerText] = useState('');
  const [voiceOn, setVoiceOn] = useState(true);
  const voiceOnRef = useRef(true);
  useEffect(() => { voiceOnRef.current = voiceOn; }, [voiceOn]);

  // ---- dialogue state lives in a ref (mutated imperatively), a tiny
  // counter forces re-renders so JSX can read the latest ref values ----
  const dlgRef = useRef({ open: false, queue: [], onDone: null, name: '', color: '#00f0ff', initial: '', typed: '', full: '' });
  const [, bump] = useState(0);
  const rerender = () => bump((x) => x + 1);

  const speak = useCallback((text, ch) => {
    if (!voiceOnRef.current || !window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.pitch = ch.gender === 'f' ? 1.4 : 0.75; u.rate = 1.02;
      window.speechSynthesis.speak(u);
    } catch (e) {}
  }, []);

  const playLine = useCallback(() => {
    const q = dlgRef.current.queue;
    const l = q[0];
    if (!l) {
      dlgRef.current.open = false;
      try { window.speechSynthesis.cancel(); } catch (e) {}
      const done = dlgRef.current.onDone; dlgRef.current.onDone = null;
      rerender();
      if (done) done();
      return;
    }
    const c = l.char;
    dlgRef.current.name = c.full; dlgRef.current.color = c.color; dlgRef.current.initial = c.name[0];
    dlgRef.current.full = l.text; dlgRef.current.typed = '';
    speak(l.text, c);
    let i = 0;
    clearInterval(typeTimer.current);
    rerender();
    typeTimer.current = setInterval(() => {
      i++;
      dlgRef.current.typed = l.text.slice(0, i);
      rerender();
      if (i >= l.text.length) clearInterval(typeTimer.current);
    }, 26);
  }, [speak]);

  const onDialogue = useCallback((lines, done) => {
    dlgRef.current.queue = lines.slice();
    dlgRef.current.onDone = done;
    dlgRef.current.open = true;
    playLine();
  }, [playLine]);

  const advanceDialogue = useCallback(() => {
    if (!dlgRef.current.open) return;
    if (dlgRef.current.typed.length < dlgRef.current.full.length) {
      clearInterval(typeTimer.current);
      dlgRef.current.typed = dlgRef.current.full;
      rerender();
      return;
    }
    dlgRef.current.queue.shift();
    playLine();
  }, [playLine]);

  const skipDialogue = useCallback(() => { dlgRef.current.queue = []; playLine(); }, [playLine]);

  const toggleVoice = useCallback(() => {
    setVoiceOn((v) => { const nv = !v; if (!nv) { try { window.speechSynthesis.cancel(); } catch (e) {} } return nv; });
  }, []);

  const screenRef = useRef(screen);
  useEffect(() => { screenRef.current = screen; }, [screen]);

  const togglePause = useCallback(() => {
    if (screenRef.current === 'fight') { engineRef.current?.pause(true); setScreen('pause'); }
    else if (screenRef.current === 'pause') { engineRef.current?.pause(false); setScreen('fight'); }
  }, []);

  // ---- create engine once three.js is loaded ----
  useEffect(() => {
    if (loaded && canvasRef.current && !engineRef.current) {
      engineRef.current = new Engine(canvasRef.current, keysRef, {
        onHud: setHud,
        onBanner: setBanner,
        onDialogue,
        onMatchOver: (text) => { setWinnerText(text); setScreen('over'); },
      });
    }
    return () => { engineRef.current?.destroy(); engineRef.current = null; };
  }, [loaded, onDialogue]);

  // ---- keep the 3D preview in sync with the roster/weapon pick ----
  useEffect(() => {
    if (screen === 'select' && engineRef.current) {
      engineRef.current.showPreview({ ...CHARACTERS[p1Idx], weapon });
    }
  }, [screen, p1Idx, weapon]);

  // ---- keyboard controls ----
  useEffect(() => {
    function onKeyDown(e) {
      const k = e.key.toLowerCase();
      keysRef.current[k] = true;
      if (!e.repeat && (k === 'p' || k === 'escape')) togglePause();
      if (!e.repeat && (k === 'enter' || k === ' ')) advanceDialogue();
      if ([' ', 'arrowup', 'arrowdown'].includes(k)) e.preventDefault();
    }
    function onKeyUp(e) { keysRef.current[e.key.toLowerCase()] = false; }
    function onBlur() { keysRef.current = {}; }
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('blur', onBlur);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('blur', onBlur);
    };
  }, [togglePause, advanceDialogue]);

  const initAudio = () => A.init();

  function pickP1(i) {
    initAudio(); sfx.punch();
    setP1Idx(i);
    setWeapon(CHARACTERS[i].weapon);
    const others = CHARACTERS.map((_, j) => j).filter((j) => j !== i);
    setP2Idx(others[Math.floor(Math.random() * others.length)]);
  }
  function pickWeapon(k) { initAudio(); sfx.slash(); setWeapon(k); }
  function handleStart() { initAudio(); sfx.ann(); setScreen('select'); }
  function handleFight() {
    initAudio(); sfx.ann();
    setScreen('fight');
    engineRef.current?.startMatch({ ...CHARACTERS[p1Idx], weapon }, { ...CHARACTERS[p2Idx] });
  }
  function handleQuitToSelect() { setScreen('select'); }

  const p1c = CHARACTERS[p1Idx], p2c = CHARACTERS[p2Idx];
  const showPad = isTouch && (screen === 'fight' || screen === 'pause') && !dlgRef.current.open;
  const hudVisible = screen === 'fight' || screen === 'pause';

  return (
    <div style={styles.root}>
      <canvas ref={canvasRef} style={styles.canvas} />

      {hudVisible && (
        <div style={styles.hud}>
          <div style={styles.hudRow}>
            <div style={styles.side}>
              <span>{p1c.full} (YOU)</span>{' '}
              <span>{'●'.repeat(hud.w1)}{'○'.repeat(2 - hud.w1)}</span>
              <div style={{ ...styles.bar, borderColor: '#00f0ff' }}>
                <i style={{ ...styles.barFill, width: hud.p1Health + '%', background: 'linear-gradient(90deg,#06b6d4,#60a5fa)' }} />
              </div>
              <div style={{ ...styles.superBar, ...(hud.p1Super >= 100 ? styles.superBarFull : {}) }}>
                <i style={{ ...styles.barFill, width: hud.p1Super + '%', background: hud.p1Super >= 100 ? '#facc15' : '#a855f7' }} />
              </div>
            </div>
            <div style={styles.timerBox}>
              <span>ROUND {hud.round}</span>
              <b style={{ ...styles.timerVal, fontSize: isNarrow ? 24 : 32 }}>{hud.time}</b>
            </div>
            <div style={{ ...styles.side, ...styles.sideR }}>
              <span>{'○'.repeat(2 - hud.w2)}{'●'.repeat(hud.w2)}</span>{' '}
              <span>{p2c.full} (CPU)</span>
              <div style={{ ...styles.bar, borderColor: '#ff2d75' }}>
                <i style={{ ...styles.barFill, width: hud.p2Health + '%', background: 'linear-gradient(270deg,#ef4444,#fb923c)', marginLeft: 'auto' }} />
              </div>
              <div style={{ ...styles.superBar, ...(hud.p2Super >= 100 ? styles.superBarFull : {}) }}>
                <i style={{ ...styles.barFill, width: hud.p2Super + '%', background: hud.p2Super >= 100 ? '#facc15' : '#a855f7', marginLeft: 'auto' }} />
              </div>
            </div>
          </div>

          {hud.combo1 > 1 && <div style={{ ...styles.combo, left: 20, color: '#00f0ff' }}>{hud.combo1} HITS!</div>}
          {hud.combo2 > 1 && <div style={{ ...styles.combo, right: 20, color: '#ff2d75' }}>{hud.combo2} HITS!</div>}

          {!isNarrow && (
            <div style={styles.help}>
              A/D move &middot; W jump &middot; J attack &middot; K kick<br />
              L block &middot; I special (full meter) &middot; P pause
            </div>
          )}
          <button style={{ ...styles.button, ...styles.pauseBtn }} onClick={togglePause}>II</button>
        </div>
      )}

      <div style={styles.banner}>{banner}</div>

      {dlgRef.current.open && (
        <div style={styles.dlg} onClick={(e) => { if (!e.target.closest('button')) advanceDialogue(); }}>
          <div style={{ ...styles.dlgPortrait, borderColor: dlgRef.current.color, color: dlgRef.current.color }}>{dlgRef.current.initial}</div>
          <div style={styles.dlgBody}>
            <b style={{ ...styles.dlgName, color: dlgRef.current.color }}>{dlgRef.current.name}</b>
            <p style={styles.dlgText}>{dlgRef.current.typed}</p>
            <span style={styles.dlgActions}>
              <button style={{ ...styles.button, ...styles.dlgBtn, ...(voiceOn ? styles.buttonOn : {}) }} onClick={toggleVoice}>{voiceOn ? 'VOICE ON' : 'VOICE OFF'}</button>
              <button style={{ ...styles.button, ...styles.dlgBtn }} onClick={skipDialogue}>SKIP</button>
              <button style={{ ...styles.button, ...styles.dlgBtn }} onClick={advanceDialogue}>NEXT</button>
            </span>
          </div>
        </div>
      )}

      {showPad && (
        <div style={styles.touchWrap}>
          <div style={styles.pad}>
            <TouchBtn keysRef={keysRef} k="a">&#9664;</TouchBtn>
            <TouchBtn keysRef={keysRef} k="d">&#9654;</TouchBtn>
            <TouchBtn keysRef={keysRef} k="w">&#9650;</TouchBtn>
          </div>
          <div style={styles.pad}>
            <TouchBtn keysRef={keysRef} k="j">J</TouchBtn>
            <TouchBtn keysRef={keysRef} k="k">K</TouchBtn>
            <TouchBtn keysRef={keysRef} k="l">L</TouchBtn>
            <TouchBtn keysRef={keysRef} k="i">&#9733;</TouchBtn>
          </div>
        </div>
      )}

      {screen === 'splash' && (
        <div style={styles.screen}>
          <small style={styles.subtitle}>VIRTUAL ARCADE CHAMPIONSHIP</small>
          <h1 style={styles.h1}>NEON STRIKER</h1>
          <p style={styles.p}>Pick a fighter, pick a weapon, win two rounds.</p>
          <button style={styles.button} onClick={handleStart}>INSERT COIN / PRESS START</button>
        </div>
      )}

      {screen === 'select' && (
        <div style={{ ...styles.screen, ...styles.screenBare }}>
          <div style={styles.panel}>
            <h2 style={styles.h2}>SELECT YOUR FIGHTER</h2>
            <div style={isNarrow ? styles.gridNarrow : styles.grid}>
              {CHARACTERS.map((c, i) => (
                <div
                  key={c.id}
                  onClick={() => pickP1(i)}
                  style={{ ...styles.card, ...(i === p1Idx ? styles.cardP1 : i === p2Idx ? styles.cardP2 : {}), ...(isNarrow ? { minWidth: 112 } : {}) }}
                >
                  <small style={{ color: c.color }}>{c.title}</small>
                  <div style={{ ...styles.name, color: c.color, fontSize: isNarrow ? 17 : 22 }}>{c.name}</div>
                  <small>{c.gender === 'f' ? 'Female' : 'Male'} - {WEAPONS[c.weapon].name}</small>
                  <StatBar label="SPD" value={c.speed} color="#22d3ee" />
                  <StatBar label="PWR" value={c.power} color="#d946ef" />
                  <StatBar label="DEF" value={c.defense} color="#84cc16" />
                </div>
              ))}
            </div>
          </div>
          <div style={styles.panel}>
            <div style={styles.info}>
              <b style={{ color: p1c.color }}>{p1c.full}</b> - {p1c.title}<br />
              <i>&ldquo;{p1c.quote}&rdquo;</i><br />
              Special: {p1c.specialName} - {p1c.specialDesc}
            </div>
            <div style={styles.weaponRow}>
              {Object.entries(WEAPONS).map(([k, w]) => (
                <button key={k} style={{ ...styles.button, ...styles.weaponBtn, ...(k === weapon ? styles.buttonOn : {}) }} onClick={() => pickWeapon(k)}>
                  {w.name}
                  <small style={styles.buttonSmall}>{w.tip}</small>
                </button>
              ))}
            </div>
            <button style={styles.button} onClick={handleFight}>CONFIRM &amp; BATTLE</button>
          </div>
        </div>
      )}

      {screen === 'pause' && (
        <div style={styles.screen}>
          <h2 style={styles.h2}>PAUSED</h2>
          <button style={styles.button} onClick={togglePause}>RESUME</button>
          <button style={styles.button} onClick={handleQuitToSelect}>CHANGE FIGHTERS</button>
        </div>
      )}

      {screen === 'over' && (
        <div style={styles.screen}>
          <h1 style={styles.h1}>{winnerText}</h1>
          <p style={styles.p}>CHAMPION OF THE VIRTUAL DOJO</p>
          <button style={styles.button} onClick={handleQuitToSelect}>PLAY AGAIN</button>
        </div>
      )}
    </div>
  );
}