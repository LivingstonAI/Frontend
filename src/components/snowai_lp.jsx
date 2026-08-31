import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

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

// px/py are positions in a 1000x500 equirectangular projection (matches the
// map SVG's viewBox), derived from lat/lng. lat/lng are reused directly by
// the 3D globe. `tz` (when present) keys into the `times` state so a hub can
// show a live local clock.
const MARKET_HUBS = [
  { name: "New York", lat: 40.7, lng: -74.0, px: 294, py: 137, tz: "NewYork" },
  { name: "London", lat: 51.5, lng: -0.1, px: 500, py: 107, tz: "London" },
  { name: "Frankfurt", lat: 50.1, lng: 8.68, px: 524, py: 111 },
  { name: "Tokyo", lat: 35.7, lng: 139.7, px: 888, py: 151, tz: "Tokyo" },
  { name: "Hong Kong", lat: 22.3, lng: 114.2, px: 817, py: 188 },
  { name: "Shanghai", lat: 31.2, lng: 121.5, px: 838, py: 163 },
  { name: "Singapore", lat: 1.35, lng: 103.8, px: 788, py: 246 },
  { name: "Sydney", lat: -33.9, lng: 151.2, px: 920, py: 344 },
];

// Simplified, stylized landmass silhouettes (not survey-accurate — a dotted,
// low-poly abstraction in the same 1000x500 space as the hubs above).
const CONTINENT_PATHS = [
  // North America
  "M100,60 C160,30 260,35 300,70 C330,90 320,130 300,150 C310,180 290,210 260,230 C240,250 200,255 180,240 C160,255 140,250 130,230 C100,220 80,190 90,160 C70,130 80,90 100,60 Z",
  // South America
  "M260,260 C300,255 330,270 340,300 C350,330 340,360 330,390 C325,420 310,450 290,460 C275,440 270,410 265,380 C250,350 245,320 250,290 C252,275 255,265 260,260 Z",
  // Europe
  "M470,70 C510,55 555,60 580,80 C590,100 580,120 560,130 C540,140 510,145 490,135 C475,125 465,100 470,70 Z",
  // Africa
  "M490,140 C540,135 590,145 610,170 C625,200 620,240 610,270 C600,310 585,350 565,375 C550,390 535,385 525,365 C510,340 500,310 495,280 C485,250 480,220 483,190 C485,170 487,155 490,140 Z",
  // Asia (mainland)
  "M580,40 C680,20 800,30 900,60 C940,80 950,110 930,140 C910,160 880,150 850,160 C860,190 840,220 810,230 C790,238 770,225 755,210 C740,230 715,235 700,220 C680,235 655,230 645,210 C620,215 600,200 590,175 C575,150 570,110 575,80 C577,65 578,50 580,40 Z",
  // Japan
  "M865,110 C880,105 895,115 895,135 C900,155 890,170 875,165 C865,155 862,130 865,110 Z",
  // Maritime Southeast Asia
  "M740,225 C780,220 820,230 840,245 C820,255 780,258 750,250 C740,245 738,235 740,225 Z",
  // Australia
  "M840,300 C890,290 940,300 965,325 C975,345 965,365 945,375 C915,385 875,380 850,365 C835,350 830,330 840,300 Z",
];

// Convert lat/lng (degrees) to a point on a sphere of the given radius.
function latLngToVector3(lat, lng, radius) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  const x = -radius * Math.sin(phi) * Math.cos(theta);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
}

// ---------------------------------------------------------------------------
// 2D world map background — dotted continents, a day/night light sweep, and
// pulsing markers over the major market hubs (with live time for NY/London/Tokyo).
// ---------------------------------------------------------------------------
function GlobalMarketMap({ active, times }) {
  return (
    <div className={`snowai-map-layer ${active ? "is-active" : "is-hidden"}`}>
      <svg
        className="snowai-map-svg"
        viewBox="0 0 1000 500"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="landDots" width="9" height="9" patternUnits="userSpaceOnUse">
            <circle cx="1.4" cy="1.4" r="1.4" fill="rgba(158,207,251,0.4)" />
          </pattern>
        </defs>

        <g>
          {CONTINENT_PATHS.map((d, i) => (
            <path key={i} d={d} fill="url(#landDots)" stroke="rgba(158,207,251,0.12)" strokeWidth="1" />
          ))}
        </g>

        {MARKET_HUBS.map((hub) => {
          const delayStyle = { animationDelay: `${-((hub.px / 1000) * 24)}s` };
          return (
            <g key={hub.name}>
              <circle className="snowai-hub-ring" cx={hub.px} cy={hub.py} r="9" style={delayStyle} />
              <circle className="snowai-hub-dot" cx={hub.px} cy={hub.py} r="3" style={delayStyle} />
              {hub.tz && (
                <text className="snowai-hub-label" x={hub.px} y={hub.py - 14} textAnchor="middle">
                  {hub.name} · {times[hub.tz]}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      <div className="snowai-map-sweep" />
    </div>
  );
}

// ---------------------------------------------------------------------------
// 3D transparent globe — wireframe sphere + glowing hub markers + connecting
// arcs, slowly auto-rotating. Renders with an alpha-cleared canvas so it sits
// as a translucent backdrop rather than a solid object.
// ---------------------------------------------------------------------------
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

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 5.5;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    mountEl.appendChild(renderer.domElement);

    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    // Transparent wireframe sphere
    const wireGeo = new THREE.SphereGeometry(2, 28, 20);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x2979ff,
      wireframe: true,
      transparent: true,
      opacity: 0.28,
    });
    const wireSphere = new THREE.Mesh(wireGeo, wireMat);
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
    const dotTexture = new THREE.CanvasTexture(dotCanvas);

    // Hub markers
    const hubPositions = [];
    MARKET_HUBS.forEach((hub) => {
      const v = latLngToVector3(hub.lat, hub.lng, 2.05);
      hubPositions.push(v.x, v.y, v.z);
    });
    const hubGeo = new THREE.BufferGeometry();
    hubGeo.setAttribute("position", new THREE.Float32BufferAttribute(hubPositions, 3));
    const hubMat = new THREE.PointsMaterial({
      size: 0.18,
      map: dotTexture,
      transparent: true,
      depthWrite: false,
      color: 0xffffff,
    });
    const hubPoints = new THREE.Points(hubGeo, hubMat);
    globeGroup.add(hubPoints);

    // Connecting arcs between hubs, tracing a loop around the globe
    const arcMat = new THREE.LineBasicMaterial({ color: 0x68a6db, transparent: true, opacity: 0.35 });
    const arcLines = [];
    for (let i = 0; i < MARKET_HUBS.length; i++) {
      const a = MARKET_HUBS[i];
      const b = MARKET_HUBS[(i + 1) % MARKET_HUBS.length];
      const start = latLngToVector3(a.lat, a.lng, 2.02);
      const end = latLngToVector3(b.lat, b.lng, 2.02);
      const mid = start.clone().add(end).multiplyScalar(0.5).normalize().multiplyScalar(2.4);
      const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
      const arcGeo = new THREE.BufferGeometry().setFromPoints(curve.getPoints(24));
      const arcLine = new THREE.Line(arcGeo, arcMat);
      globeGroup.add(arcLine);
      arcLines.push(arcLine);
    }

    let frameId;
    let lastTime = performance.now();
    const animate = (t) => {
      frameId = requestAnimationFrame(animate);
      if (document.hidden || !activeRef.current) return;
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
        // Typing forward - use proper Unicode-aware substring
        const nextChar = [...currentSloganText][charIndex];
        setCurrentSlogan(prev => prev + nextChar);
        setCharIndex(charIndex + 1);
      } else if (isDeleting && charIndex > 0) {
        // Deleting backward - use proper Unicode-aware substring
        const chars = [...currentSlogan];
        setCurrentSlogan(chars.slice(0, -1).join(''));
        setCharIndex(charIndex - 1);
      } else if (!isDeleting && charIndex === currentSloganText.length) {
        // Finished typing, wait longer then start deleting
        setTimeout(() => setIsDeleting(true), 3000);
      } else if (isDeleting && charIndex === 0) {
        // Finished deleting, move to next slogan
        setIsDeleting(false);
        setCurrentSlogan("");
        setSloganIndex((prev) => (prev + 1) % slogans.length);
      }
    }, isDeleting ? 75 : 120); // Slightly slower typing for better visibility

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

  // Effect to handle audio playback when currentSong changes
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
        /* Global backdrop: 2D market map + 3D transparent globe          */
        /* ------------------------------------------------------------- */

        .snowai-bg-layer {
          position: fixed;
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
          width: 100%;
          height: 100%;
          display: block;
        }

        .snowai-hub-dot {
          fill: #9ecffb;
          animation: hubPulse 24s linear infinite;
        }

        .snowai-hub-ring {
          fill: none;
          stroke: #68a6db;
          stroke-width: 1;
          opacity: 0.6;
          animation: hubRingPulse 24s linear infinite;
        }

        .snowai-hub-label {
          fill: #9ecffb;
          font-size: 11px;
          letter-spacing: 0.3px;
          filter: drop-shadow(0 0 3px rgba(158, 207, 251, 0.85));
        }

        @media (max-width: 600px) {
          .snowai-hub-label {
            display: none;
          }
        }

        @keyframes hubPulse {
          0% { r: 5; fill: #ffffff; }
          8% { r: 3; fill: #9ecffb; }
          100% { r: 3; fill: #9ecffb; }
        }

        @keyframes hubRingPulse {
          0% { r: 9; opacity: 0.6; }
          8% { r: 9; opacity: 0.8; }
          40% { r: 22; opacity: 0; }
          100% { r: 22; opacity: 0; }
        }

        .snowai-map-sweep {
          position: absolute;
          top: 0;
          left: -20%;
          width: 20%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(158, 207, 251, 0.35), transparent);
          mix-blend-mode: screen;
          pointer-events: none;
          animation: sweepAcross 24s linear infinite;
        }

        @keyframes sweepAcross {
          from { transform: translateX(0); }
          to { transform: translateX(600%); }
        }

        .snowai-globe-wrap {
          width: 100%;
          height: 100%;
        }

        .snowai-globe-wrap canvas {
          display: block;
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

      <div className="snowai-bg-layer">
        <GlobalMarketMap active={bgMode === "map"} times={times} />
        <GlobalMarketGlobe active={bgMode === "globe"} />
      </div>
      <button
        className="snowai-bg-toggle"
        onClick={() => setBgMode((m) => (m === "map" ? "globe" : "map"))}
        aria-label="Toggle background view"
      >
        {bgMode === "map" ? "View 3D Globe" : "View World Map"}
      </button>

      <div id="snowflake-container"></div>
      
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