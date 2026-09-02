import React, { useEffect, useRef, useState } from "react";
import { geoNaturalEarth1, geoPath, geoGraticule } from "d3-geo";
import {
  Vector3,
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  Group,
  SphereGeometry,
  MeshBasicMaterial,
  Mesh,
  CanvasTexture,
  BufferGeometry,
  Float32BufferAttribute,
  PointsMaterial,
  Points,
  LineBasicMaterial,
  Line,
  QuadraticBezierCurve3,
} from "three";

// Import all the songs
import jingleBells from '../jingle_bells.mp3';
import snowStorm from '../Snowstorm Sound Effect - Winter Storm - Blizzard.mp3';
import love_story from '../Indila - Love Story (Piano Cover).mp3';
import ezio_family from "../Assassin's Creed 2 OST  Jesper Kyd - Ezio's Family (Track 03).mp3";
import hymn_for_the_weekend from '../Coldplay - Hymn For The Weekend (Lyrics).mp3';
import daydreaming from '../Marc Wavy - Daydreaming (Official Lyric Video).mp3';
import me_times_two from '../Raptures - Me Times Two (ft. Moav)  Electronic Pop  NCS - Copyright Free Music.mp3';
import we_dont_talk_anymore from "../We Don't Talk Anymore我們不再交談Charlie Puth ft.Selena Gomez 中文字幕.mp3";
import should_i_stay from '../The Clash - Should I Stay or Should I Go (Official Audio).mp3';
import the_middle from '../Zedd, Maren Morris, Grey - The Middle (Lyric Video).mp3';
import quiet_night from '../Tokyo Music Walker - Quiet Night.mp3';
import feels from '../Calvin Harris - Feels (Official Video) ft. Pharrell Williams, Katy Perry, Big Sean.mp3';
import im_good from "../David Guetta x Bebe Rexha - I'm Good (Blue) (Senses & Shadow Remix).mp3";
import never_give_up from '../Never Give Up.mp3';
import gravity from '../Sara Bareilles - Gravity (Official HD Video).mp3';
import closer from '../The Chainsmokers - Closer (Lyric) ft. Halsey.mp3';
import bloody_mary_edit from '../bloody mary (instrumental x dum dum, da-di-da) [full version] - lady gaga [edit audio].mp3';
import waiting from '../Waiting.mp3';
import wish_wonderland from '../Wonderland 원더랜드 OST WISH_ Wonderland is here 박보검 Park Bo-gum 배수지 Bae Suzy HanRomEnglish Lyrics.mp3';
import welcome_to_columbia from '../Congratulations! Welcome to Columbia!.mp3';
import 沉溺 from '../沉溺（你让我的心不再结冰）.mp3';
import shoot_to_thrill from '../ACDC - Shoot to Thrill.mp3';
import when_im_with_you from "../When I'm with you.mp3";
import coffee_time from '../321Jazz - Coffee Time [ Cafe Jazz Music 2024 ].mp3';
import coffee_lounge from '../Coffee Lounge.mp3';
import good_vibes from '../Good Vibes.mp3';
import iced_coffee_jazz from '../iced coffee  jazz lofi vibes (no copyright music  vlog music  royalty free music).mp3';
import sitting_in_a_cafe from '../Sitting in a Café.mp3';
import lex_mit_car from '../LexMITCar.mp3';
import keep_it_lowkey from '../spotifydown.com - keep it lowkey - take your time.mp3';
import honey_jam from '../massobeats - honey jam (royalty free lofi music).mp3';
import floral from '../massobeats - floral (royalty free lofi music).mp3';
import lemon_cake from '../샛별 - Lemon Cake (Royalty Free Music).mp3';
import marshmellow from '../lukrembo - marshmallow (royalty free vlog music).mp3';
import rose from '../lukrembo - rose (royalty free vlog music).mp3';
import this_is_mit from '../This is MIT.mp3';
import time_between_storms from '../Dune_ Part Two Soundtrack  A Time of Quiet Between the Storms - Hans Zimmer  WaterTower.mp3';
import somnus_theme from '../Final fantasy XIII versus somnus theme [bOyYigKniW4].mp3';
import your_man from '../Your Man.mp3';
import cry_baby from '../SZA - Cry Baby (Lyrics).mp3';
import genesis from '../Transcendence - GENESIS.mp3';
import rewrite_the_stars from '../rewrite the stars (speed up  lyrics).mp3';
import bloodline from '../Ariana Grande - bloodline (Official Audio).mp3';
import ma_meilleure_enemie from '../Stromae, Pomme - “Ma Meilleure Ennemie” (from Arcane Season 2) [Official Visualizer].mp3';
import procrastination from '../Diverseddie 舵 - Procrastination 拖延症.mp3';
import atreides_theme from '../Atreides Theme.mp3';
import duncan_theme from '../3m24 Duncan Arrives (Unreleased)  Dune (2021).mp3';
import mit_hall from '../“Hall That Never Ends,” featuring the @mitlogs Written, directed, and edited by Reuben Fuchs.Check out their new album “Log Log Land,” streaming now!.mp3';
import mit from '../mit.mp3';
import empire_state_of_mind from '../JAY-Z - Empire State Of Mind (Lyrics) ft. Alicia Keys.mp3';
import here_comes_the_sun from '../The Beatles - Here Comes The Sun (2019 Mix).mp3';
import afternoon_of_konoha from '../Naruto - Afternoon of Konoha.mp3';
import chosen from '../ilyaugust - Chosen Dreaming, Dreaming of This Moment (Official Lyric Video).mp3';
import spin_u_round from '../spin u round.mp3';
import feel_it from '../d4vd - Feel It.mp3';
import mona_lisa from '../Dominic Fike - Mona Lisa (Official Audio) (1).mp3';
import forever_star from '../Forever Star偷偷藏不住電視劇插曲 -  張洢豪Wherever you goIll surround you still動態歌詞.mp3';
import copines from '../Aya Nakamura - Copines (Clip officiel).mp3';
import dizzy from '../Dizzy  Joakim Karud (No Copyright Music).mp3';
import classic from '../MKTO - Classic (Lyrics).mp3';
import classic_slowed from '../𝙘𝙡𝙖𝙨𝙨𝙞𝙘 - 𝙈𝙆𝙏𝙊 (𝙨𝙡𝙤𝙬𝙚𝙙  𝙡𝙮𝙧𝙞𝙘𝙨).mp3';
import sound_of_april from '../Sound of April.mp3';
import what_are_you_waiting_for from '../d4vd - What Are You Waiting For (Lyrics).mp3';
import a_million_colors from '../A Million Colors.mp3';
import annas_smile from "../Anna's Smile.mp3";
import strangers from '../Kenya Grace - Strangers (Official Lyric Video).mp3';
import memory from '../hojean - memory [lyrics] (1).mp3';
import any_song from '../Any song (아무노래).mp3';
import nokia_remix from '../Katy Perry Last Friday Night - Drake (Remix) [NOKIA X T.G.I.F.].mp3';
import levitating from '../Dua Lipa - Levitating Featuring DaBaby (Official Music Video).mp3';
import twentytwo_remix from '../Lil Candy Paint - 22 (Lyrics) ft. Bhad Bhabie.mp3';
import free from "../RUMI & JINU 'Free' Lyrics (Color Coded Lyrics).mp3";
import once_upon_a_time_trend from '../Once Upon A Time - remix slowed (0.8x降调DJ抖音版) HOK & DANCING - 𝐓𝐈𝐊𝐓𝐎𝐊.mp3';
import little_time_youth from '../[ENGSUBPINYIN] 小时光 (Xiao Shi Guang - Little TimeYouth) - 胡期皓 (Hu Qi Hao) - Hot Douyin.mp3';
import bomb_2022 from '../Bomb比爾 - 1022-比爾的歌動態歌詞他們說今晚的夜色很好 應該有個人對我來撒嬌.mp3';
import daisies from '../DAISIES.mp3';
import timeless from '../The Weeknd  Timeless with Playboi Carti (Official Music Video).mp3';
import judas from '../Lady Gaga - Judas (Lyrics).mp3';
import xonada from '../MONTAGEM XONADA.mp3';
import coffee_talk from '../Coffee Talk.mp3';
import sunroof from '../Nicky Youre, dazy - Sunroof (Lyrics).mp3';
import can_you_hear from '../Can You Hear The Music.mp3';
import big_raga from '../I Summon... Divine General Mahoraga x Playboi Carti - Sovereign (Guitar Remix) (Slowed).mp3';
import love_story_lyrics from '../Indila - Love Story (Lyrics).mp3';
import russian_love_story from '../Indila - Love Story (кавер на русском)(Russian cover).mp3';
import lovesong from '../TXT - 0X1=LOVESONG (I Know I Love You) feat. Seori Lyrics (Color Coded Lyrics).mp3';
import everythings_good from "../Phil Good - Everything's Good (Official Music Video).mp3";
import coffee_date from '../Coffee Date.mp3';
import kdrama_study from '../kdrama-study.mp3';
import kambulat_ona from '../Kambulat  Она.mp3';
import killing_butterflies from '../LEWIS BLISSETT - KILLING BUTTERFLIES [Official Lyric Video].mp3';
import lil_boo_thang from '../Paul Russell - Lil Boo Thang (Lyric Video) [MoCaWpRAkVA].mp3';
import will_evelyn from '../will-and-evelyn_T44TfHQx.mp3';
import no_batidao from '../NO BATIDÃO.mp3';
import celebrate_alan from '../Celebrate - Alan Avry (prod. by d.higgs) (unofficial videos).mp3';
import gods from "../NewJeans (뉴진스) 'GODS' Lyrics (Color Coded Lyrics)  League of Legends - Worlds 2023 Anthem.mp3";
import mente_ma from '../MENTE MÁ - NAKAMA (Official Lyric Video).mp3';
import bang_lai from '../攬佬SKAI ISYOURGOD - 八方來財  Ba Fang Lai Cai (Stacks from All Sides)動態歌詞English SubsPinyin.mp3';
import decembre from '../Élise de Lune - Décembre.mp3';
import honored_one from '../Gojo Satoru - The Honored One  Jujutsu Kaisen Season 2 OST.mp3';
import answer_to_my_love from '../Answer To My Love.mp3';
import kilometro from '../LOS COMUNISTAS DÓNDE ESTÁN_  AFROHOUSE  KILOMETRO.mp3';
import chess_slowed from '../joyful - chess (slowed).mp3';
import chess from '../Chess Type Beat.mp3';

// ---------------------------------------------------------------------------
// Global market backdrop data — shared by the 2D map and the 3D globe so the
// two views always agree on where each hub sits.
// ---------------------------------------------------------------------------

// lat/lng feed both the D3-driven 2D map and the Three.js globe (3D)
// directly, so the two views can never drift out of sync the way the old
// hand-projected px/py values could. `tz` (when present) keys into the
// `times` state so a hub can show a live local clock.
const MARKET_HUBS = [
  { name: "New York", lat: 40.7, lng: -74.0, tz: "NewYork" },
  { name: "London", lat: 51.5, lng: -0.1, tz: "London" },
  { name: "Frankfurt", lat: 50.1, lng: 8.68 },
  { name: "Tokyo", lat: 35.7, lng: 139.7, tz: "Tokyo" },
  { name: "Hong Kong", lat: 22.3, lng: 114.2 },
  { name: "Shanghai", lat: 31.2, lng: 121.5 },
  { name: "Singapore", lat: 1.35, lng: 103.8 },
  { name: "Sydney", lat: -33.9, lng: 151.2 },
];


// Order hubs are visited in for the light sweep, and how long (ms) the
// sweep spends easing between each consecutive pair before moving on.
const SWEEP_SEGMENT_MS = 3000;

// ---------------------------------------------------------------------------
// Shared dark palette for the 2D map + 3D globe backdrop, matching the
// technique used in the SnowAIEarth component (MAP_COLORS there): solid,
// visible land fill against the void, instead of a near-transparent tint
// that disappears against the page background.
// ---------------------------------------------------------------------------
const MAP_COLORS = {
  land: "#16233d",
  landHover: "#1d3f78",
  border: "rgba(158, 207, 251, 0.45)",
  borderHover: "#68a6db",
};

// Convert lat/lng (degrees) to a point on a sphere of the given radius.
function latLngToVector3(lat, lng, radius) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  const x = -radius * Math.sin(phi) * Math.cos(theta);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new Vector3(x, y, z);
}

// Simple ease for the sweep's motion between hubs.
function easeInOutSine(t) {
  return -(Math.cos(Math.PI * t) - 1) / 2;
}

// ---------------------------------------------------------------------------
// 2D world map background — D3 geographic projection + market hubs,
// pulsing markers over the major hubs, and a soft light that travels
// hub-to-hub across the map instead of sweeping in a straight line.
// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------
// 2D world map background — D3 geographic projection + self-contained
// continent geometry. D3 handles the projection and all hub placement, so
// resizing the SVG never requires hand-tuned pixel coordinates.
// ---------------------------------------------------------------------------
const WORLD_FEATURES = [
  // North America
  [[-168,72],[-150,70],[-138,60],[-125,55],[-124,48],[-117,32],[-105,25],[-97,26],[-88,30],[-82,25],[-80,18],[-92,15],[-105,20],[-116,24],[-125,32],[-135,42],[-150,50],[-160,58],[-168,72]],
  // South America
  [[-82,12],[-72,8],[-64,2],[-58,-8],[-52,-18],[-48,-30],[-53,-42],[-60,-52],[-68,-56],[-73,-48],[-70,-35],[-76,-20],[-80,-5],[-82,12]],
  // Europe
  [[-11,36],[-4,43],[4,42],[12,45],[20,47],[30,55],[36,60],[30,68],[18,70],[8,62],[0,58],[-8,54],[-11,45],[-11,36]],
  // Africa
  [[-18,35],[-5,37],[10,34],[22,32],[33,28],[40,15],[43,4],[38,-10],[32,-23],[24,-34],[12,-35],[2,-28],[-7,-12],[-15,5],[-18,20],[-18,35]],
  // Asia
  [[28,40],[42,42],[55,50],[68,55],[82,60],[100,56],[118,52],[135,48],[150,45],[160,55],[170,65],[180,70],[180,35],[165,30],[150,25],[138,18],[125,20],[115,10],[105,8],[96,20],[85,24],[75,18],[65,22],[55,28],[44,30],[34,35],[28,40]],
  // India / Southeast Asia
  [[68,25],[78,30],[88,24],[92,15],[104,8],[108,-2],[101,-8],[94,2],[86,8],[80,6],[74,12],[68,25]],
  // Japan
  [[130,33],[136,37],[141,42],[145,39],[143,32],[137,28],[130,33]],
  // Australia
  [[113,-11],[128,-13],[143,-12],[153,-20],[153,-31],[145,-39],[132,-43],[120,-38],[113,-28],[113,-11]],
  // Greenland
  [[-73,60],[-55,60],[-42,68],[-30,75],[-38,82],[-55,84],[-68,78],[-73,68],[-73,60]],
  // Madagascar
  [[48,-13],[51,-20],[50,-26],[46,-25],[44,-18],[48,-13]],
];

function GlobalMarketMap({ active, times }) {
  const [sweepPos, setSweepPos] = useState(MARKET_HUBS[0]);
  const rafRef = useRef(null);
  const svgRef = useRef(null);
  const [mapSize, setMapSize] = useState({ width: 1000, height: 500 });

  useEffect(() => {
    if (!active) return;
    let segmentStart = performance.now();
    let hubIndex = 0;

    const tick = (t) => {
      const from = MARKET_HUBS[hubIndex];
      const to = MARKET_HUBS[(hubIndex + 1) % MARKET_HUBS.length];
      const elapsed = t - segmentStart;
      const rawT = Math.min(elapsed / SWEEP_SEGMENT_MS, 1);
      const e = easeInOutSine(rawT);

      setSweepPos({
        name: "sweep",
        lng: from.lng + (to.lng - from.lng) * e,
        lat: from.lat + (to.lat - from.lat) * e,
      });

      if (rawT >= 1) {
        hubIndex = (hubIndex + 1) % MARKET_HUBS.length;
        segmentStart = t;
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [active]);

  useEffect(() => {
    const svgEl = svgRef.current;
    if (!svgEl) return;
    const resize = () => {
      const rect = svgEl.getBoundingClientRect();
      if (rect.width && rect.height) {
        setMapSize({ width: rect.width, height: rect.height });
      }
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(svgEl);
    return () => observer.disconnect();
  }, []);

  const world = {
    type: "FeatureCollection",
    features: WORLD_FEATURES.map((coordinates, index) => ({
      type: "Feature",
      id: index,
      properties: {},
      geometry: { type: "Polygon", coordinates: [coordinates] },
    })),
  };

  const projection = geoNaturalEarth1().fitSize([mapSize.width || 1000, mapSize.height || 500], world);
  const path = geoPath(projection);
  const graticule = geoGraticule().step([30, 30]);

  const sweepPoint = projection([sweepPos.lng, sweepPos.lat]);
  const hubPoints = MARKET_HUBS.map((hub) => ({ ...hub, point: projection([hub.lng, hub.lat]) }));

  return (
    <div className={`snowai-map-layer ${active ? "is-active" : "is-hidden"}`}>
      <svg
        ref={svgRef}
        className="snowai-map-svg"
        viewBox={`0 0 ${mapSize.width || 1000} ${mapSize.height || 500}`}
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label="Global financial market map"
      >
        <defs>
          <radialGradient id="sweepGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#9ecffb" stopOpacity="0.95" />
            <stop offset="45%" stopColor="#68a6db" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#68a6db" stopOpacity="0" />
          </radialGradient>
          <filter id="mapGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="4" />
          </filter>
        </defs>

        <path d={path(graticule())} className="snowai-map-grid" />

        <g className="snowai-map-land">
          {world.features.map((feature) => (
            <path key={feature.id} d={path(feature)} />
          ))}
        </g>

        {sweepPoint && (
          <>
            <circle cx={sweepPoint[0]} cy={sweepPoint[1]} r="34" fill="url(#sweepGlow)" className="snowai-sweep-glow" />
            <circle cx={sweepPoint[0]} cy={sweepPoint[1]} r="7" fill="#ffffff" opacity="0.8" filter="url(#mapGlow)" />
          </>
        )}

        {hubPoints.map((hub) => (
          <g key={hub.name} className="snowai-map-hub">
            <circle cx={hub.point[0]} cy={hub.point[1]} r="10" className="snowai-hub-ring" />
            <circle cx={hub.point[0]} cy={hub.point[1]} r="4" className="snowai-hub-dot" />
            <text x={hub.point[0]} y={hub.point[1] - 16} textAnchor="middle" className="snowai-hub-label">
              {hub.name}{hub.tz ? ` · ${times[hub.tz]}` : ""}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 3D transparent globe — wireframe sphere + glowing hub markers + connecting
// arcs, slowly auto-rotating. Scoped to a positioned parent (the hero stage)
// rather than the full viewport, so it visually wraps the title/slogan/
// buttons instead of sitting behind the entire page.
//
// Repositioned/rescaled so the sphere envelops the full hero column — from
// the SnowAI logo down through the Play Music button — instead of sitting
// centered and small on the whole stage. This is done by (a) growing the
// sphere radius so it has enough surface area to wrap a taller column of
// content, (b) shifting the globe group downward so its upper arc clears
// the title and its lower arc clears the buttons, and (c) backing the
// camera off and angling it down slightly so the larger, shifted sphere
// still fits fully in frame.
// ---------------------------------------------------------------------------
const GLOBE_RADIUS = 2.3;
const GLOBE_VERTICAL_OFFSET = -0.2;

function GlobalMarketGlobe({ active }) {
  const mountRef = useRef(null);
  const activeRef = useRef(active);

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  useEffect(() => {
    const mountEl = mountRef.current;
    if (!mountEl) return;

    const width = mountEl.clientWidth || window.innerWidth;
    const height = mountEl.clientHeight || window.innerHeight;

    const scene = new Scene();
    const camera = new PerspectiveCamera(50, width / height, 0.1, 100);
    // Backed off from 3.2 -> 4.2 to accommodate the larger (2.4-radius)
    // sphere, and angled down slightly so the downward-shifted globe group
    // still sits fully in frame around the hero content.
    camera.position.z = 4.25;
    camera.position.y = 0;
    camera.lookAt(0, GLOBE_VERTICAL_OFFSET, 0);

    const renderer = new WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    mountEl.appendChild(renderer.domElement);

    const globeGroup = new Group();
    // Shifts the whole sphere + markers + arcs down so the visible arc
    // wraps from above the "SnowAI" title down past the Log In / Play
    // Music buttons, instead of centering on empty space above the title.
    globeGroup.position.y = GLOBE_VERTICAL_OFFSET;
    scene.add(globeGroup);

    // Transparent wireframe sphere
    const wireGeo = new SphereGeometry(GLOBE_RADIUS, 28, 20);
    const wireMat = new MeshBasicMaterial({
      color: 0x2979ff,
      wireframe: true,
      transparent: true,
      opacity: 0.28,
    });
    const wireSphere = new Mesh(wireGeo, wireMat);
    globeGroup.add(wireSphere);

    // Soft round texture for hub markers
    const dotCanvas = document.createElement("canvas");
    dotCanvas.width = 64;
    dotCanvas.height = 64;
    const dotCtx = dotCanvas.getContext("2d");
    const grad = dotCtx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, "rgba(255,255,255,1)");
    grad.addColorStop(0.4, "rgba(158,207,251,0.9)");
    grad.addColorStop(1, "rgba(158,207,251,0)");
    dotCtx.fillStyle = grad;
    dotCtx.fillRect(0, 0, 64, 64);
    const dotTexture = new CanvasTexture(dotCanvas);

    // Hub markers — radius scaled up to match GLOBE_RADIUS so markers sit
    // right on the sphere's surface rather than floating inside/outside it.
    const hubPositions = [];
    MARKET_HUBS.forEach((hub) => {
      const v = latLngToVector3(hub.lat, hub.lng, GLOBE_RADIUS + 0.05);
      hubPositions.push(v.x, v.y, v.z);
    });
    const hubGeo = new BufferGeometry();
    hubGeo.setAttribute("position", new Float32BufferAttribute(hubPositions, 3));
    const hubMat = new PointsMaterial({
      size: 0.18,
      map: dotTexture,
      transparent: true,
      depthWrite: false,
      color: 0xffffff,
    });
    const hubPoints = new Points(hubGeo, hubMat);
    globeGroup.add(hubPoints);

    // Connecting arcs between hubs, tracing a loop around the globe —
    // radii scaled to match GLOBE_RADIUS.
    const arcMat = new LineBasicMaterial({ color: 0x68a6db, transparent: true, opacity: 0.35 });
    const arcLines = [];
    for (let i = 0; i < MARKET_HUBS.length; i++) {
      const a = MARKET_HUBS[i];
      const b = MARKET_HUBS[(i + 1) % MARKET_HUBS.length];
      const start = latLngToVector3(a.lat, a.lng, GLOBE_RADIUS + 0.02);
      const end = latLngToVector3(b.lat, b.lng, GLOBE_RADIUS + 0.02);
      const mid = start.clone().add(end).multiplyScalar(0.5).normalize().multiplyScalar(GLOBE_RADIUS + 0.4);
      const curve = new QuadraticBezierCurve3(start, mid, end);
      const arcGeo = new BufferGeometry().setFromPoints(curve.getPoints(24));
      const arcLine = new Line(arcGeo, arcMat);
      globeGroup.add(arcLine);
      arcLines.push(arcLine);
    }

    let frameId;
    let lastTime = performance.now();
    const animate = (t) => {
      frameId = requestAnimationFrame(animate);
      if (document.hidden) return;
      const delta = t - lastTime;
      lastTime = t;
      globeGroup.rotation.y += delta * 0.00006;
      renderer.render(scene, camera);
    };
    frameId = requestAnimationFrame(animate);

    const handleResize = () => {
      const w = mountEl.clientWidth || window.innerWidth;
      const h = mountEl.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.position.z = w <= 600 ? 4.7 : 4.25;
      camera.position.y = 0;
      camera.lookAt(0, GLOBE_VERTICAL_OFFSET, 0);
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", handleResize);
      wireGeo.dispose();
      wireMat.dispose();
      hubGeo.dispose();
      hubMat.dispose();
      dotTexture.dispose();
      arcMat.dispose();
      arcLines.forEach((line) => line.geometry.dispose());
      renderer.dispose();
      if (mountEl.contains(renderer.domElement)) {
        mountEl.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className={`snowai-globe-layer ${active ? "is-active" : "is-hidden"}`}>
      <div className="snowai-globe-wrap" ref={mountRef} />
    </div>
  );
}

export default function SnowAILandingPage() {
  const [times, setTimes] = useState({
    NewYork: new Date().toLocaleTimeString("en-US", { timeZone: "America/New_York" }),
    London: new Date().toLocaleTimeString("en-GB", { timeZone: "Europe/London" }),
    Tokyo: new Date().toLocaleTimeString("ja-JP", { timeZone: "Asia/Tokyo" }),
  });

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimes({
        NewYork: new Date().toLocaleTimeString("en-US", { timeZone: "America/New_York" }),
        London: new Date().toLocaleTimeString("en-GB", { timeZone: "Europe/London" }),
        Tokyo: new Date().toLocaleTimeString("ja-JP", { timeZone: "Asia/Tokyo" }),
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  // Landing page background: "map" (2D) or "globe" (3D transparent globe)
  const [bgMode, setBgMode] = useState("map");

  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState("");
  const [showSongModal, setShowSongModal] = useState(false);

  // Slogan animation state
  const [currentSlogan, setCurrentSlogan] = useState("");
  const [sloganIndex, setSloganIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const slogans = [
    "Where cutting edge technology intersects with finance.",
    "尖端技术与金融的交汇之处。",
    "첨단 기술과 금융이 만나는 곳.",
    "最先端技術と金融が交差する場所。",
    "Где передовые технологии пересекаются с финансами.",
    "Building what others cannot imagine.",
    "打造他人无法想象之物。",
    "다른 이들이 상상하지 못하는 것을 구축하다.",
    "他人が想像できないものを構築する。",
    "Строим то, что другие не могут себе представить."
  ];

  // Song library
    const songs = {
      "1": { name: "MIT👨‍🎓📖🚀", file: mit },
      "2": { name: "Atreides Theme ⚔️", file: atreides_theme },
      "3": { name: "Jingle Bells", file: jingleBells },
      "4": { name: "Snow Storm", file: snowStorm },
      "5": { name: "Love Story", file: love_story },
      "6": { name: "Ezio's Family", file: ezio_family },
      "7": { name: "Hymn for The Weekend", file: hymn_for_the_weekend },
      "8": { name: "Daydreaming", file: daydreaming },
      "9": { name: "Me Times Two", file: me_times_two},
      "10": { name: "We Don't Talk Anymore", file: we_dont_talk_anymore },
      "11": { name: "Should I Stay or Should I Go", file: should_i_stay },
      "12": { name: "The Middle", file: the_middle },
      "13": { name: "Quiet Night", file: quiet_night },
      "14": { name: "Feels", file: feels },
      "15": { name: "I'm Good (Blue)", file: im_good },
      "16": { name: "Never Give Up", file: never_give_up },
      "17": { name: "Gravity", file: gravity },
      "18": { name: "Closer", file: closer },
      "19": { name: "Bloody Mary (Edit)", file: bloody_mary_edit },
      "20": { name: "Waiting 💙", file: waiting },
      "21": { name: "Wish (Wonderland) ✨🎸", file: wish_wonderland },
      "22": { name: "Welcome to Columbia!📖🚀", file: welcome_to_columbia },
      "23": { name: "沉溺（你让我的心不再结冰) 🎶🌆", file: 沉溺 },
      "24": { name: "Shoot to Thrill - ACDC 🤖🎸", file: shoot_to_thrill },
      "25": { name: "When I'm With You - Arcando", file: when_im_with_you },
      "26": { name: "Coffee Time ☕", file: coffee_time },
      "27": { name: "Coffee Lounge ☕", file: coffee_lounge },
      "28": { name: "Good Vibes 😌", file: good_vibes },
      "29": { name: "Iced Coffee Jazz ☕🎶", file: iced_coffee_jazz },
      "30": { name: "Sitting in a Café ☕👨‍💻", file: sitting_in_a_cafe },
      "31": { name: "Lex MIT Car 🤖🚗", file: lex_mit_car },
      "32": { name: "Keep it lowkey 🎺", file: keep_it_lowkey },
      "33": { name: "Honey Jam 🍯", file: honey_jam },
      "34": { name: "Floral 🌺💮", file: floral },
      "35": { name: "Lemon Cake 🍋🍰", file: lemon_cake },
      "36": { name: "Marshmellow 😋", file: marshmellow},
      "37": { name: "Rose 🌹", file: rose},
      "38": { name: "This is MIT 👨‍🎓📚", file: this_is_mit },
      "39": { name: "Dune: Time between storms ⌛🗡️", file: time_between_storms },
      "40": { name: "Somnus Theme 🐺🥷", file: somnus_theme },
      "41": { name: "Joji - Your Man 🦸‍♂️🦸‍♀️", file: your_man },
      "42": { name: "Cry Baby - SZA 🌃🌃", file: cry_baby },
      "43": { name: "Genesis - Jorma Kaukonen 🧑🏾‍🤝‍👩🏼👨‍💻👩‍💻", file: genesis },
      "44": { name: "Rewrite the Stars 🌃", file: rewrite_the_stars },
      "45": { name: "Bloodline - Ariana Grande 🎤", file: bloodline },
      "46": { name: "Stromae, Pomme - “Ma Meilleure Ennemie” (from Arcane Season 2)🌃", file: ma_meilleure_enemie },
      "47": { name: "Diverseddie 舵 - Procrastination 拖延症 😌👨‍💻", file: procrastination },
      "48": { name: "Duncan's Theme 🗡️", file: duncan_theme },
      "49": { name: "MIT Hall That Never Ends 👨‍🎓🎶", file: mit_hall },
      "50": { name: "Empire State of Mind 🗽🌆", file: empire_state_of_mind },
      "51": { name: "Here Comes The Sun 🌄", file: here_comes_the_sun },
      "52": { name: "Afternoon of Konoha 🌳", file: afternoon_of_konoha },
      "53": { name: "Chosen ⌛", file: chosen },
      "54": { name: "Spin U Around 🎼💙", file: spin_u_round },
      "55": { name: "Feel it 🦸‍♂️🦸‍♀️", file: feel_it },
      "56": { name: "Mona Lisa 🎨🖌️", file: mona_lisa },
      "57": { name: "Forever Star 🌃", file: forever_star },
      "58": { name: "Copines 🌳", file: copines },
      "59": { name: "Dizzy Joakim Karud 🎒👨‍🎓", file: dizzy },
      "60": { name: "Classic 😎🏖️", file: classic },
      "61": { name: "Classic (slowed) 🏄‍♂️", file: classic_slowed },
      "62": { name: "Sound of April 🌃🎧", file: sound_of_april },
      "63": { name: "What are you waiting for? 🏄‍♂️", file: what_are_you_waiting_for },
      "64": { name: "A Million Colors 🎺", file: a_million_colors },
      "65": { name: "Anna's Smile 🌹", file: annas_smile},
      "66": { name: "Strangers 🪶", file: strangers },
      "67": { name: "Memory 🪶", file: memory },
      "68": { name: "아무노래 ~ ZICO 🇰🇷", file: any_song },
      "69": { name: "NOKIA X T.G.I.F. 🌃", file: nokia_remix },
      "70": { name: "Levitating 🦸‍♂️", file: levitating },
      "71": { name: "22 (Remix) 🤵", file: twentytwo_remix },
      "72": { name: "Free - Rumi and Jinu🌹 ", file: free },
      "73": { name: "Once upon a time - remix slowed 🌃", file: once_upon_a_time_trend },
      "74": { name: "Youth - Hu Qihao 🏄🎧", file: little_time_youth },
      "75": { name: "Bomb - 1022 🌃", file: bomb_2022 },
      "76": { name: "Daisies 🌼", file: daisies },
      "77": { name: "Timeless ⌛", file: timeless },
      "78": { name: "Judas 👉🔴🔵👈🟣☝️", file: judas },
      "79": { name: "Xonada 🟣", file: xonada },
      "80": { name: "Coffee Talk ☕👨‍💻", file: coffee_talk },
      "81": { name: "Sunroof 🏙️", file: sunroof },
      "82": { name: "Can you hear the music? 🎼", file: can_you_hear },
      "83": { name: "Divine General Mahoraga", file: big_raga },
      "84": { name: "Love Story 🌃", file: love_story_lyrics },
      "85": { name: "Love Story (Russian) 🌃", file: russian_love_story },
      "86": { name: "TXT - Lovesong 🎧", file: lovesong },
      "87": { name: "Everything's Good 🏖️🏄", file: everythings_good },
      "88": { name: "Coffee Date ☕🦫", file: coffee_date },
      "89": { name: "K-Drama Study Motivation 🇰🇷 (1)", file: kdrama_study },
      "90": { name: "Kambulat Ona 🎸", file: kambulat_ona },
      "91": { name: "Killing Butterflies 🦋", file: killing_butterflies },
      "92": { name: "Lil Boo Thang 🏖️😎", file: lil_boo_thang },
      "93": { name: "Will & Evelyn", file: will_evelyn },
      "94": { name: "No Batidao 🇧🇷🕺", file: no_batidao },
      "95": { name: "Celebrate - Alan Avry 🦜", file: celebrate_alan },
      "96": { name: "GODS - 뉴진스", file: gods },
      "97": { name: "MENTE MA 🏄", file: mente_ma },
      "98": { name: "Ba Fang Lai Cai🎧🌃", file: bang_lai },
      "99": { name: "Dècembre 🇫🇷", file: decembre },
      "100": { name: "If I am With You ☀️", file: honored_one },
      "101": { name: "Answer to My Love 🎧", file: answer_to_my_love },
      "102": { name: "Afrohouse Kilometro 🕺", file: kilometro },
      "103": { name: "Joyful - Chess (SLOWED)", file: chess_slowed },
      "104": { name: "Joyful - Chess", file: chess },
    };


  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredSongs = Object.entries(songs).filter(([key, song]) =>
    song.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Fixed slogan typewriter effect
  useEffect(() => {
    const timeout = setTimeout(() => {
      const currentSloganText = slogans[sloganIndex];
      
      if (!isDeleting && charIndex < currentSloganText.length) {
        const nextChar = [...currentSloganText][charIndex];
        setCurrentSlogan(prev => prev + nextChar);
        setCharIndex(charIndex + 1);
      } else if (isDeleting && charIndex > 0) {
        const chars = [...currentSlogan];
        setCurrentSlogan(chars.slice(0, -1).join(''));
        setCharIndex(charIndex - 1);
      } else if (!isDeleting && charIndex === currentSloganText.length) {
        setTimeout(() => setIsDeleting(true), 3000);
      } else if (isDeleting && charIndex === 0) {
        setIsDeleting(false);
        setCurrentSlogan("");
        setSloganIndex((prev) => (prev + 1) % slogans.length);
      }
    }, isDeleting ? 75 : 120);

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, sloganIndex, currentSlogan]);

  const handlePlayToggle = () => {
    if (!isPlaying) {
      setShowSongModal(true);
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setIsPlaying(false);
    }
  };

  const handleSongSelection = (songFile) => {
    setCurrentSong(songFile);
    setIsPlaying(true);
    setShowSongModal(false);
  };

  useEffect(() => {
    if (currentSong && isPlaying && audioRef.current) {
      audioRef.current.play().catch(error => {
        console.error("Error playing audio:", error);
      });
    }
  }, [currentSong, isPlaying]);

  const createFallingCharacters = () => {
    const container = document.getElementById("snowflake-container");
    if (container) {
      const characters = [
        '雪', '冬', '美', '爱', '风', '光', '云', '星', '梦', '智', 
        '慧', '学', '研', '科', '技', '未', '来', '创', '新', '思',
        '天', '地', '山', '水', '人', '心', '情', '感', '知', '道',
        '눈', '겨', '울', '아', '름', '사', '랑', '바', '람', '빛', 
        '구', '름', '별', '꿈', '지', '혜', '배', '움', '과', '학',
        '미', '래', '창', '조', '생', '각', '하', '늘', '땅', '산'
      ];
      
      const characterCount = 25;
      
      for (let i = 0; i < characterCount; i++) {
        const character = document.createElement("div");
        character.className = "falling-character";
        
        const randomChar = characters[Math.floor(Math.random() * characters.length)];
        character.innerText = randomChar;
        
        character.style.left = `${Math.random() * 100}vw`;
        character.style.fontSize = `${Math.random() * 12 + 14}px`;
        character.style.animationDuration = `${Math.random() * 8 + 15}s`;
        character.style.animationDelay = `${Math.random() * 3}s`;
        character.style.opacity = Math.random() * 0.7 + 0.3;
        character.style.transform = `rotate(${Math.random() * 360}deg)`;
        
        container.appendChild(character);
        
        character.addEventListener("animationend", () => {
          if (character.parentNode === container) {
            container.removeChild(character);
          }
        });
      }
    }
  };
  
  useEffect(() => {
    createFallingCharacters();
    
    const maxCharacters = 40;
    
    const intervalId = setInterval(() => {
      const container = document.getElementById("snowflake-container");
      if (container && container.children.length < maxCharacters) {
        createFallingCharacters();
      }
    }, 5000);
    
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const glow = document.createElement("div");
    glow.className = "mouse-glow";
    document.body.appendChild(glow);

    const handleMouseMove = (e) => {
      glow.style.transform = `translate(${e.clientX - 25}px, ${e.clientY - 25}px)`;
    };

    document.addEventListener("mousemove", handleMouseMove);
    return () => document.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="snowai-landing-page">
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        html, body {
          margin: 0;
          padding: 0;
          width: 100%;
          height: 100%;
          overflow-x: hidden;
        }

        /* ------------------------------------------------------------- */
        /* Hero stage: wraps the title/slogan/buttons + the scoped        */
        /* backdrop (map or globe) that envelops them                     */
        /* ------------------------------------------------------------- */

        .snowai-hero-stage {
          position: relative;
          min-height: 100vh;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .snowai-hero-content {
          position: relative;
          z-index: 10;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .snowai-slogan {
          font-size: clamp(1rem, 3vw, 1.5rem);
          color: #ffffff;
          text-shadow: 0 0 8px #9ecffb, 0 0 16px #9ecffb;
          z-index: 10;
          margin-bottom: 30px;
          min-height: 3em;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          white-space: pre-wrap;
          word-wrap: break-word;
          max-width: 90vw;
          padding: 0 10px;
          line-height: 1.4;
          position: relative;
        }

        .snowai-slogan::after {
          content: '';
          position: absolute;
          right: -2px;
          top: 0;
          bottom: 0;
          width: 2px;
          background: #ffffff;
          animation: blink 0.8s step-end infinite;
        }

        @media (max-width: 768px) {
          .snowai-slogan {
            font-size: clamp(0.9rem, 4vw, 1.2rem);
            min-height: 3.5em;
            max-width: 95vw;
            padding: 0 5px;
            line-height: 1.3;
          }
        }

        @media (max-width: 480px) {
          .snowai-slogan {
            font-size: clamp(0.8rem, 4.5vw, 1rem);
            min-height: 4em;
            max-width: 98vw;
            padding: 0 2px;
            line-height: 1.2;
          }
        }

        .snowai-button {
          font-size: clamp(1rem, 2.5vw, 1.2rem);
          color: #ffffff;
          text-decoration: none;
          background-color: #2979ff;
          padding: clamp(12px, 3vw, 15px) clamp(20px, 5vw, 30px);
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(41, 121, 255, 0.3);
          transition: background-color 0.3s ease, box-shadow 0.3s ease;
          z-index: 10;
          animation: glow 3s infinite ease-in-out;
          border: none;
          cursor: pointer;
          margin: 10px;
          display: inline-block;
        }

        @keyframes glow {
          0%, 100% {
            box-shadow: 0 4px 12px rgba(41, 121, 255, 0.3);
          }
          50% {
            box-shadow: 0 4px 18px rgba(41, 121, 255, 0.5);
          }
        }

        .snowai-button:hover {
          background-color: #68a6db;
          box-shadow: 0 4px 20px rgba(41, 121, 255, 0.6);
        }

        .mouse-glow {
          position: absolute;
          width: 50px;
          height: 50px;
          background: radial-gradient(circle, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 80%);
          pointer-events: none;
          mix-blend-mode: screen;
          transition: transform 0.1s ease;
          z-index: 5;
        }

        .falling-character {
          position: absolute;
          top: -5%;
          color: #ffffff;
          font-size: 18px;
          opacity: 0.8;
          animation: fall linear infinite;
          transition: transform 0.2s ease, opacity 0.2s ease;
          z-index: 1;
        }

        @keyframes fall {
          to {
            transform: translateY(110vh);
          }
        }

        .falling-character:hover {
          transform: scale(1.5) rotate(15deg);
          opacity: 0.5;
        }

        .landing-page-song-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          padding: 20px;
        }

        .landing-page-song-modal {
          background: #1c2235;
          padding: 30px;
          border-radius: 15px;
          width: 90%;
          max-width: 500px;
          max-height: 80%;
          overflow-y: auto;
          box-shadow: 0 0 30px rgba(41, 121, 255, 0.3);
        }

        .landing-page-song-modal h2 {
          color: #ffffff;
          text-align: center;
          margin-bottom: 20px;
          text-shadow: 0 0 10px #9ecffb;
          font-size: clamp(1.2rem, 3vw, 1.5rem);
        }

        .form-control {
          width: 100%;
          padding: 12px;
          border: 2px solid #2979ff;
          border-radius: 8px;
          background: #0a0f1f;
          color: #ffffff;
          font-size: clamp(14px, 2.5vw, 16px);
          margin-bottom: 20px;
        }

        .form-control:focus {
          outline: none;
          border-color: #68a6db;
          box-shadow: 0 0 10px rgba(41, 121, 255, 0.3);
        }

        .song-list {
          list-style: none;
          padding: 0;
          margin: 0;
          max-height: 300px;
          overflow-y: auto;
        }

        .song-option {
          padding: 12px;
          margin: 5px 0;
          background: #0a0f1f;
          color: #ffffff;
          border-radius: 8px;
          cursor: pointer;
          transition: background-color 0.3s ease;
          border: 1px solid #2979ff;
          font-size: clamp(12px, 2vw, 14px);
        }

        .song-option:hover {
          background: #2979ff;
          box-shadow: 0 0 10px rgba(41, 121, 255, 0.3);
        }

        .close-modal-btn-lp {
          width: 100%;
          padding: 12px;
          background: #2979ff;
          color: #ffffff;
          border: none;
          border-radius: 8px;
          font-size: clamp(14px, 2.5vw, 16px);
          cursor: pointer;
          margin-top: 20px;
          transition: background-color 0.3s ease;
        }

        .close-modal-btn-lp:hover {
          background: #68a6db;
        }

        .mb-3 {
          margin-bottom: 1rem;
        }

        @media (max-width: 480px) {
          .landing-page-song-modal {
            padding: 20px;
            width: 95%;
          }
        }

        /* ------------------------------------------------------------- */
        /* Backdrop: 2D market map + 3D transparent globe, both scoped    */
        /* to .snowai-hero-stage so they envelop the hero content only    */
        /* ------------------------------------------------------------- */

        .snowai-bg-layer {
          position: absolute;
          inset: 0;
          z-index: 0;
          overflow: hidden;
          pointer-events: none;
        }

        .snowai-map-layer,
        .snowai-globe-layer {
          position: absolute;
          inset: 0;
          opacity: 0;
          transition: opacity 1s ease;
        }

        .snowai-map-layer.is-active,
        .snowai-globe-layer.is-active {
          opacity: 1;
        }

        .snowai-map-svg {
          position: absolute;
          width: 100%;
          height: 100%;
          inset: 0;
          display: block;
        }

        .snowai-map-land path {
          fill: rgba(22, 35, 61, 0.78);
          stroke: rgba(158, 207, 251, 0.5);
          stroke-width: 1.2;
          vector-effect: non-scaling-stroke;
        }

        .snowai-map-grid {
          fill: none;
          stroke: rgba(158, 207, 251, 0.08);
          stroke-width: 1;
          vector-effect: non-scaling-stroke;
        }

        .snowai-hub-dot {
          fill: #9ecffb;
          animation: hubPulse 3s ease-in-out infinite;
        }

        .snowai-hub-ring {
          fill: none;
          stroke: #68a6db;
          stroke-width: 1;
          opacity: 0.6;
          animation: hubRingPulse 3s ease-out infinite;
        }

        .snowai-hub-label {
          fill: #9ecffb;
          font-size: 11px;
          letter-spacing: 0.3px;
          filter: drop-shadow(0 0 3px rgba(158, 207, 251, 0.85));
        }

        @media (max-width: 600px) {
          .snowai-hub-label {
            display: block;
            font-size: 10px;
            letter-spacing: 0;
          }
        }

        @keyframes hubPulse {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 1; }
        }

        @keyframes hubRingPulse {
          0% { r: 9; opacity: 0.6; }
          100% { r: 22; opacity: 0; }
        }

        /* The traveling light — a radial glow riding a Marker across real
           lat/lng coordinates, so it visibly passes over countries rather
           than a flat bar crossing the screen. */
        .snowai-sweep-glow {
          mix-blend-mode: screen;
          pointer-events: none;
        }

        .snowai-globe-wrap {
          position: absolute;
          left: -10%;
          top: -10%;
          width: 120%;
          height: 120%;
        }

        .snowai-globe-wrap canvas {
          display: block;
          width: 100% !important;
          height: 100% !important;
        }

        @media (max-width: 600px) {
          .snowai-globe-wrap {
            left: -20%;
            top: -10%;
            width: 140%;
            height: 120%;
          }
        }

        .snowai-bg-toggle {
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 15;
          background: rgba(10, 15, 31, 0.6);
          color: #ffffff;
          border: 1px solid rgba(104, 166, 219, 0.5);
          border-radius: 20px;
          padding: 8px 16px;
          font-size: 13px;
          cursor: pointer;
          backdrop-filter: blur(4px);
          transition: background-color 0.3s ease, border-color 0.3s ease;
        }

        .snowai-bg-toggle:hover {
          background: rgba(41, 121, 255, 0.35);
          border-color: #68a6db;
        }

        @media (max-width: 480px) {
          .snowai-bg-toggle {
            bottom: 12px;
            right: 12px;
            padding: 6px 12px;
            font-size: 11px;
          }
        }
      `}</style>

      <div className="snowai-hero-stage">
        <div className="snowai-bg-layer">
          <GlobalMarketMap active={bgMode === "map"} times={times} />
          <GlobalMarketGlobe active={bgMode === "globe"} />
        </div>

        <div id="snowflake-container"></div>

        <div className="snowai-hero-content">
          <h1 className="snowai-title">
            {["S", "n", "o", "w", "A", "I"].map((letter, idx) => (
              <span key={idx} style={{ animationDelay: `${idx * 0.2}s` }}>{letter}</span>
            ))}
          </h1>

          <div className="snowai-slogan">
            {currentSlogan}
          </div>

          <a href="/login" className="snowai-button">Log In</a>

          <button className="snowai-button" onClick={handlePlayToggle}>
            {isPlaying ? "Stop Music" : "Play Music"}
          </button>
        </div>

        <button
          className="snowai-bg-toggle"
          onClick={() => setBgMode((m) => (m === "map" ? "globe" : "map"))}
          aria-label="Toggle background view"
        >
          {bgMode === "map" ? "View 3D Globe" : "View World Map"}
        </button>
      </div>

      <audio ref={audioRef} src={currentSong} loop />

      {showSongModal && (
        <div className="landing-page-song-modal-overlay">
          <div className="landing-page-song-modal">
            <h2>Select a Song</h2>

            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Search for a song..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <ul className="song-list">
              {filteredSongs.length > 0 ? (
                filteredSongs.map(([key, song]) => (
                  <li
                    key={key}
                    className="song-option"
                    onClick={() => handleSongSelection(song.file)}
                  >
                    {song.name}
                  </li>
                ))
              ) : (
                <li className="song-option">No songs found</li>
              )}
            </ul>

            <button
              className="close-modal-btn-lp"
              onClick={() => setShowSongModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
