import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';
import { FaSun, FaMoon, FaMusic, FaSave, FaChartLine, FaAngleDown, FaAngleUp, FaKeyboard, FaTimes } from 'react-icons/fa';
import { useAudio } from './audio_context';
import AssetTracker from "./asset_tracker";

// Import all the songs (keeping the original imports)
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


export default function SideNavs() {
  const navigate = useNavigate();
  const uniqueID = uuidv4();
  const [timeNY, setTimeNY] = useState('');
  const [timeLondon, setTimeLondon] = useState('');
  const [timeTokyo, setTimeTokyo] = useState('');
  const [theme, setTheme] = useState('light');
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [savingStatus, setSavingStatus] = useState("");
  const [showAssetTracker, setShowAssetTracker] = useState(false);
  const [songsFromBackend, setSongsFromBackend] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [touchFeedback, setTouchFeedback] = useState(null);
  const baseURL = 'https://backend-production-c0ab.up.railway.app';

  // Virtual keyboard navigation items with hieroglyphic symbols
  const navigationItems = [
    { route: "/personal_info", symbol: "𓀀", name: "Profile", description: "Personal Information" },
    { route: "/account_analytics", symbol: "𓊖", name: "Analytics", description: "Account Analytics" },
    { route: "/market_makers", symbol: "𓉤", name: "Markets", description: "Market Makers" },
    { route: `/conversation/${uniqueID}`, symbol: "𓂋", name: "Chat", description: "Conversation" },
    { route: "/daily_brief", symbol: "𓄿", name: "Brief", description: "Daily Brief" },
    { route: "/performance_review/asset", symbol: "𓈖", name: "Review", description: "Performance Review" },
    { route: "/update_news", symbol: "𓊪", name: "News", description: "Update News" },
    { route: "/enter_new_trade_info", symbol: "𓇯", name: "Trade", description: "New Trade Info" },
    { route: "/scratch", symbol: "𓌳", name: "AI", description: "Scratch AI" },
    { route: "/model_performance", symbol: "𓊽", name: "Model", description: "Model Performance" },
    { route: "/risk_bot", symbol: "𓈗", name: "Risk", description: "Risk Bot" },
    { route: "/chill", symbol: "𓊝", name: "Music", description: "Chill Music" },
    { route: "/quizifier", symbol: "𓊨", name: "Quiz", description: "Quizifier" },
    { route: "/saved_quizzes", symbol: "𓈙", name: "Saved", description: "Saved Quizzes" },
    { route: "/alert_bot", symbol: "𓊿", name: "Alert", description: "Alert Bot" },
    { route: "/tradergpt_analysis", symbol: "𓋹", name: "GPT", description: "Trader GPT" },
    { route: "/backtested_results", symbol: "𓊭", name: "Results", description: "Backtest Results" },
    { route: "/ideas_section", symbol: "𓊤", name: "Ideas", description: "Ideas Section" },
    { route: "/call_ai", symbol: "𓊚", name: "Call", description: "Call AI" },
    { route: "/trade_ideas", symbol: "𓈘", name: "Trades", description: "Trade Ideas" },
    { route: "/prop_firm_management", symbol: "𓉗", name: "Firm", description: "Prop Firm" },
    { route: "/music", symbol: "𓊡", name: "Audio", description: "Music Player" },
    { route: "/calendar", symbol: "𓊣", name: "Calendar", description: "Calendar" },
    { route: "/calendar_data", symbol: "𓊦", name: "Data", description: "Calendar Data" },
    { route: "/econ_explainer", symbol: "𓋻", name: "Econ", description: "Economics" },
    { route: "/forex_factory", symbol: "𓊬", name: "Forex", description: "Forex Factory" },
    { route: "/trading_econ_dashboard", symbol: "𓊲", name: "Dashboard", description: "Trading Dashboard" },
    { route: "/trading_calendar", symbol: "𓊳", name: "TradeCal", description: "Trading Calendar" },
    { route: "/paper_gpt", symbol: "𓊮", name: "Paper", description: "Paper GPT" },
    { route: "/process_checker", symbol: "𓊯", name: "Process", description: "Process Checker" },
    { route: "/science_playground", symbol: "𓊱", name: "Science", description: "Science Playground" },
    { route: "/economics_gpt", symbol: "𓊴", name: "EconGPT", description: "Economics GPT" },
    { route: "/ai_council", symbol: "𓊵", name: "Council", description: "AI Council" },
    { route: "/ai_council_conversations", symbol: "𓊶", name: "Convos", description: "AI Conversations" },
    { route: "/firm_compliance", symbol: "𓊷", name: "Compliance", description: "Firm Compliance" },
    { route: "/esi", symbol: "𓊷", name: "Economic Strength Index", description: "Economic Strength Index" }

  ];

  // Import song files
  const songs = [
        { name: "MIT👨‍🎓📖🚀", file: mit },
        { name: "Atreides Theme ⚔️", file: atreides_theme },
        { name: "Jingle Bells", file: jingleBells },
        { name: "Snow Storm", file: snowStorm },
        { name: "Love Story", file: love_story },
        { name: "Ezio's Family", file: ezio_family },
        { name: "Hymn for The Weekend", file: hymn_for_the_weekend },
        { name: "Daydreaming", file: daydreaming },
        { name: "Me Times Two", file: me_times_two},
        { name: "We Don't Talk Anymore", file: we_dont_talk_anymore },
        { name: "Should I Stay or Should I Go", file: should_i_stay },
        { name: "The Middle", file: the_middle },
        { name: "Quiet Night", file: quiet_night },
        { name: "Feels", file: feels },
        { name: "I'm Good (Blue)", file: im_good },
        { name: "Never Give Up", file: never_give_up },
        { name: "Gravity", file: gravity },
        { name: "Closer", file: closer },
        { name: "Bloody Mary (Edit)", file: bloody_mary_edit },
        { name: "Waiting 💙", file: waiting },
        { name: "Wish (Wonderland) ✨🎸", file: wish_wonderland },
        { name: "Welcome to Columbia!📖🚀", file: welcome_to_columbia },
        { name: "沉溺（你让我的心不再结冰) 🎶🌆", file: 沉溺 },
        { name: "Shoot to Thrill - ACDC 🤖🎸", file: shoot_to_thrill },
        { name: "When I'm With You - Arcando", file: when_im_with_you },
        { name: "Coffee Time ☕", file: coffee_time },
        { name: "Coffee Lounge ☕", file: coffee_lounge },
        { name: "Good Vibes 😌", file: good_vibes },
        { name: "Iced Coffee Jazz ☕🎶", file: iced_coffee_jazz },
        { name: "Sitting in a Café ☕👨‍💻", file: sitting_in_a_cafe },
        { name: "Lex MIT Car 🤖🚗", file: lex_mit_car },
        { name: "Keep it lowkey 🎺", file: keep_it_lowkey },
        { name: "Honey Jam 🍯", file: honey_jam },
        { name: "Floral 🌺💮", file: floral },
        { name: "Lemon Cake 🍋🍰", file: lemon_cake },
        { name: "Marshmellow 😋", file: marshmellow},
        { name: "Rose 🌹", file: rose},
        { name: "This is MIT 👨‍🎓📚", file: this_is_mit },
        { name: "Dune: Time between storms ⌛🗡️", file: time_between_storms },
        { name: "Somnus Theme 🐺🥷", file: somnus_theme },
        { name: "Joji - Your Man 🦸‍♂️🦸‍♀️", file: your_man },
        { name: "Cry Baby - SZA 🌃🌃", file: cry_baby },
        { name: "Genesis - Jorma Kaukonen 🧑🏾‍🤝‍👩🏼👨‍💻👩‍💻", file: genesis },
        { name: "Rewrite the Stars 🌃", file: rewrite_the_stars },
        { name: "Bloodline - Ariana Grande 🎤", file: bloodline },
        { name: "Stromae, Pomme - “Ma Meilleure Ennemie” (from Arcane Season 2)🌃", file: ma_meilleure_enemie },
        { name: "Diverseddie 舵 - Procrastination 拖延症 😌👨‍💻", file: procrastination },
        { name: "Duncan's Theme 🗡️", file: duncan_theme },
        { name: "MIT Hall That Never Ends 👨‍🎓🎶", file: mit_hall },
        { name: "Empire State of Mind 🗽🌆", file: empire_state_of_mind },
        { name: "Here Comes The Sun 🌄", file: here_comes_the_sun },
        { name: "Afternoon of Konoha 🌳", file: afternoon_of_konoha },
        { name: "Chosen ⌛", file: chosen },
        { name: "Spin U Around 🎼💙", file: spin_u_round },
        { name: "Feel it 🦸‍♂️🦸‍♀️", file: feel_it },
        { name: "Mona Lisa 🎨🖌️", file: mona_lisa },
        { name: "Forever Star 🌃", file: forever_star },
        { name: "Copines 🌳", file: copines },
        { name: "Dizzy Joakim Karud 🎒👨‍🎓", file: dizzy },
        { name: "Classic 😎🏖️", file: classic },
        { name: "Classic (slowed) 🏄‍♂️", file: classic_slowed },
        { name: "Sound of April 🌃🎧", file: sound_of_april },
        { name: "What are you waiting for? 🏄‍♂️", file: what_are_you_waiting_for },
        { name: "A Million Colors 🎺", file: a_million_colors },
        { name: "Anna's Smile 🌹", file: annas_smile },
        { name: "Strangers 🪶", file: strangers },
        { name: "Memory 🪶", file: memory },
        { name: "아무노래 ~ ZICO 🇰🇷", file: any_song },
        { name: "NOKIA X T.G.I.F. 🌃", file: nokia_remix },
        { name: "Levitating 🦸‍♂️", file: levitating },
        { name: "22 (Remix) 🤵", file: twentytwo_remix },
        { name: "Free - Rumi and Jinu🌹 ", file: free },
        { name: "Once upon a time - remix slowed 🌃", file: once_upon_a_time_trend },   
        { name: "Youth - Hu Qihao 🏄🎧", file: little_time_youth }, 
        { name: "Bomb - 1022 🌃", file: bomb_2022 },
        { name: "Daisies 🌼", file: daisies },
        { name: "Timeless ⌛", file: timeless },
        { name: "Judas 👉🔴🔵👈🟣☝️", file: judas },
        { name: "Xonada 🟣", file: xonada },
        { name: "Coffee Talk ☕👨‍💻", file: coffee_talk },
        { name: "Sunroof 🏙️", file: sunroof },
        { name: "Can you hear the music? 🎼", file: can_you_hear },
        { name: "Divine General Mahoraga", file: big_raga },
        { name: "Love Story 🌃", file: love_story_lyrics },
        { name: "Love Story (Russian) 🌃", file: russian_love_story },
        { name: "TXT - Lovesong 🎧", file: lovesong },
        { name: "Everything's Good 🏖️🏄", file: everythings_good },
        { name: "Coffee Date ☕🦫", file: coffee_date },
        { name: "K-Drama Study Motivation 🇰🇷 (1)", file: kdrama_study },
        { name: "Kambulat Ona 🎸", file: kambulat_ona },
        { name: "Killing Butterflies 🦋", file: killing_butterflies },
        { name: "Lil Boo Thang 🏖️😎", file: lil_boo_thang },
        { name: "Will & Evelyn", file: will_evelyn },
        { name: "No Batidao 🇧🇷🕺", file: no_batidao },
        { name: "Celebrate - Alan Avry 🦜", file: celebrate_alan },
        { name: "GODS - 뉴진스", file: gods },
  ];

  // Enhanced touch navigation function
  const handleTouchNavigation = (route, itemName) => {
    // Provide immediate visual feedback
    setTouchFeedback(itemName);
    
    // Add haptic feedback if available
    if (navigator.vibrate) {
      navigator.vibrate(50); // 50ms vibration
    }
    
    // Audio feedback (optional)
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFAg+ltryxnkpBSl+zPLZjzoIGGS57OKdTgwPUarm7blmGggdDUJ6lc7xzHcrBSU1QwRGVJ2TbDZGJjJjpM/srzNHKtFQk8Pm7rtmGwcaDUNAr+HqtGcaCD1UltHwzHgqBSg5Tf'); // Optional sound effect
    audio.volume = 0.1; // Keep it subtle
    audio.play().catch(() => {}); // Ignore errors if audio fails
    
    // Navigate after a short delay to show visual feedback
    setTimeout(() => {
      navigate(route);
      setShowKeyboard(false);
      setTouchFeedback(null);
    }, 150);
  };

  // Toggle functions
  const toggleSideNav = () => setIsOpen(!isOpen);
  const toggleAssetTracker = () => setShowAssetTracker(!showAssetTracker);
  const toggleKeyboard = () => setShowKeyboard(!showKeyboard);
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    
    document.body.className = newTheme;
    localStorage.setItem('theme', newTheme);
  };

  // Fetch songs from backend
  useEffect(() => {
    const fetchSongsFromBackend = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${baseURL}/fetch-music`);
        if (response.ok) {
          const data = await response.json();
          setSongsFromBackend(data.songs || []);
        } else {
          console.error("Failed to fetch songs from backend");
        }
      } catch (error) {
        console.error("Error fetching songs:", error);
      } finally {
        setIsLoading(false);
      }
    };

    // fetchSongsFromBackend();
  }, []);

  // Clock update effect
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const options = { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: false };

      // New York time
      const formatterNY = new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', ...options });
      setTimeNY(formatterNY.format(now));

      // London time
      const formatterLondon = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/London', ...options });
      setTimeLondon(formatterLondon.format(now));

      // Tokyo time
      const formatterTokyo = new Intl.DateTimeFormat('en-JP', { timeZone: 'Asia/Tokyo', ...options });
      setTimeTokyo(formatterTokyo.format(now));
    }, 1000);

    // Load theme from localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
      document.body.className = savedTheme;
    }

    return () => clearInterval(interval);
  }, []);

  // Access audio context
  const { isPlaying, currentSong, playMusic, stopMusic } = useAudio();

  // Function to save all songs to the backend
  const saveAllSongsToBackend = async () => {
    setSavingStatus("Saving songs to backend...");
    let successCount = 0;
    let errorCount = 0;

    for (const song of songs) {
      try {
        const response = await fetch(song.file);
        if (!response.ok) {
          throw new Error(`Failed to fetch song file: ${song.file}`);
        }
        
        const blob = await response.blob();
        const fileName = song.file.split('/').pop();
        const songFile = new File([blob], fileName, { type: 'audio/mpeg' });
        
        const formData = new FormData();
        formData.append('name', song.name);
        formData.append('file', songFile);
        
        const saveResponse = await fetch(`${baseURL}/save-music`, {
          method: 'POST',
          body: formData,
        });
        
        if (saveResponse.ok) {
          successCount++;
          setSavingStatus(`Saved ${successCount} of ${songs.length} songs...`);
        } else {
          errorCount++;
          console.error(`Failed to save song: ${song.name}`);
        }
      } catch (error) {
        errorCount++;
        console.error(`Error saving song ${song.name}:`, error);
      }
    }
    
    setSavingStatus(`Completed! Saved ${successCount} songs, Failed: ${errorCount}`);
    
    try {
      const response = await fetch(`${baseURL}/fetch-music`);
      if (response.ok) {
        const data = await response.json();
        setSongsFromBackend(data.songs || []);
      }
    } catch (error) {
      console.error("Error refreshing songs list:", error);
    }
    
    setTimeout(() => setSavingStatus(""), 5000);
  };

  // Handle play for any song
  const handlePlay = (song) => {
    console.log("Playing song:", song.name);
    const songUrl = songsFromBackend.length > 0 ? song.file : song.file;
    console.log("Song URL:", songUrl);
    playMusic(songUrl);
  };

  // Filter songs based on search term
  const filteredSongs = songsFromBackend.length > 0 
    ? songsFromBackend.filter(song => 
        song.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : songs.filter(song => 
        song.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="all-side-navs">
      <style jsx>{`
        .virtual-keyboard-container {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          background: linear-gradient(135deg, #001f3f 0%, #003366 50%, #004080 100%);
          border-top: 2px solid #00aaff;
          box-shadow: 0 -8px 32px rgba(0, 170, 255, 0.3);
          backdrop-filter: blur(10px);
          padding: 20px;
          transform: translateY(${showKeyboard ? '0' : '100%'});
          transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .keyboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          color: #00aaff;
          font-weight: bold;
        }

        .keyboard-close-btn {
          background: transparent;
          border: 2px solid #00aaff;
          color: #00aaff;
          border-radius: 8px;
          padding: 8px 12px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .keyboard-close-btn:hover {
          background: #00aaff;
          color: #001f3f;
          box-shadow: 0 0 20px rgba(0, 170, 255, 0.6);
        }

        .navigation-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
          gap: 12px;
          max-height: 300px;
          overflow-y: auto;
          padding: 10px;
          background: rgba(0, 50, 100, 0.5);
          border-radius: 12px;
          border: 1px solid #00aaff;
        }

        .nav-key {
          background: linear-gradient(145deg, #003366, #001f3f);
          border: 2px solid #00aaff;
          border-radius: 12px;
          padding: 12px;
          min-height: 80px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          color: #00aaff;
          position: relative;
          overflow: hidden;
          user-select: none;
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          touch-action: manipulation;
        }

        .nav-key::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(0, 170, 255, 0.2), transparent);
          transition: left 0.6s;
        }

        .nav-key:hover,
        .nav-key:focus,
        .nav-key.touch-active {
          background: linear-gradient(145deg, #004080, #00aaff);
          color: #ffffff;
          transform: translateY(-2px) scale(1.05);
          box-shadow: 0 8px 25px rgba(0, 170, 255, 0.4);
          border-color: #ffffff;
        }

        .nav-key:hover::before,
        .nav-key:focus::before,
        .nav-key.touch-active::before {
          left: 100%;
        }

        .nav-key:active {
          transform: translateY(0) scale(0.95);
          box-shadow: 0 4px 15px rgba(0, 170, 255, 0.6);
        }

        .nav-key.feedback-pulse {
          animation: touchFeedback 0.3s ease-out;
          background: linear-gradient(145deg, #00ff88, #00aaff);
          box-shadow: 0 0 30px rgba(0, 255, 136, 0.8);
        }

        @keyframes touchFeedback {
          0% { transform: scale(1); }
          50% { transform: scale(1.15); }
          100% { transform: scale(1.05); }
        }

        .hieroglyph {
          font-size: 24px;
          margin-bottom: 4px;
          font-family: 'Noto Sans Egyptian Hieroglyphs', serif;
          pointer-events: none;
        }

        .key-label {
          font-size: 10px;
          font-weight: bold;
          text-align: center;
          line-height: 1.2;
          pointer-events: none;
        }

        .keyboard-toggle-btn {
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 1001;
          background: linear-gradient(145deg, #00aaff, #0088cc);
          border: none;
          border-radius: 50%;
          width: 60px;
          height: 60px;
          color: white;
          font-size: 24px;
          cursor: pointer;
          box-shadow: 0 8px 25px rgba(0, 170, 255, 0.4);
          transition: all 0.3s ease;
          touch-action: manipulation;
        }

        .keyboard-toggle-btn:hover,
        .keyboard-toggle-btn:focus {
          background: linear-gradient(145deg, #0088cc, #0066aa);
          transform: scale(1.1);
          box-shadow: 0 12px 35px rgba(0, 170, 255, 0.6);
        }

        .keyboard-toggle-btn:active {
          transform: scale(0.95);
        }

        .hud-glow {
          position: relative;
        }

        .hud-glow::after {
          content: '';
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          background: linear-gradient(45deg, #00aaff, #0088cc, #00aaff);
          z-index: -1;
          filter: blur(8px);
          opacity: 0.7;
          border-radius: inherit;
        }

        .touch-feedback-overlay {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: rgba(0, 170, 255, 0.9);
          color: white;
          padding: 15px 25px;
          border-radius: 12px;
          font-size: 18px;
          font-weight: bold;
          z-index: 2000;
          pointer-events: none;
          animation: fadeInOut 0.5s ease-out;
        }

        @keyframes fadeInOut {
          0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
          50% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
          100% { opacity: 0; transform: translate(-50%, -50%) scale(1.2); }
        }

        /* Enhanced touch targets for better touchscreen experience */
        @media (hover: none) and (pointer: coarse) {
          .nav-key {
            min-height: 90px;
            padding: 15px;
            font-size: 12px;
          }
          
          .hieroglyph {
            font-size: 28px;
          }
          
          .key-label {
            font-size: 11px;
          }
        }

        @media (max-width: 768px) {
          .navigation-grid {
            grid-template-columns: repeat(auto-fit, minmax(70px, 1fr));
            gap: 10px;
          }
          
          .nav-key {
            min-height: 70px;
            padding: 10px;
          }
          
          .hieroglyph {
            font-size: 20px;
          }
          
          .key-label {
            font-size: 9px;
          }
          
          .keyboard-toggle-btn {
            width: 55px;
            height: 55px;
            font-size: 22px;
          }
        }

        @media (max-width: 480px) {
          .navigation-grid {
            grid-template-columns: repeat(6, 1fr);
            gap: 8px;
          }
          
          .nav-key {
            min-height: 60px;
            padding: 8px;
          }
          
          .hieroglyph {
            font-size: 18px;
          }
          
          .key-label {
            font-size: 8px;
          }
          
          .virtual-keyboard-container {
            padding: 15px 10px;
          }
          
          .keyboard-toggle-btn {
            width: 50px;
            height: 50px;
            font-size: 20px;
            bottom: 15px;
            right: 15px;
          }
        }

        .scrollbar-hud::-webkit-scrollbar {
          width: 8px;
        }

        .scrollbar-hud::-webkit-scrollbar-track {
          background: rgba(0, 31, 63, 0.5);
          border-radius: 4px;
        }

        .scrollbar-hud::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #00aaff, #0088cc);
          border-radius: 4px;
        }

        .scrollbar-hud::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #0088cc, #0066aa);
        }

        /* Disable text selection on touch elements */
        .virtual-keyboard-container * {
          -webkit-touch-callout: none;
          -webkit-user-select: none;
          -khtml-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
        }
      `}</style>

      <div className="side-navs trading-history-links">
        <Link to="/personal_info" className="side-nav"><button className="btn btn-light side-nav-btn"><p><i className="bi bi-person-fill"></i></p></button></Link>
        <Link to="/account_analytics" className="side-nav"><button className="btn btn-light side-nav-btn"><p><i className="bi bi-bar-chart-line-fill"></i></p></button></Link>
        <Link to="/multiple_account_analytics" className="side-nav"><button className="btn btn-light side-nav-btn"><p><i className="bi bi-percent"></i></p></button></Link>
        <Link to="/market_makers" className="side-nav"><button className="btn btn-light side-nav-btn"><p><i className="bi bi-bank"></i></p></button></Link>
        <Link to={`/conversation/${uniqueID}`} className="side-nav"><button className="btn btn-light side-nav-btn"><p><i className="bi bi-chat-square-dots"></i></p></button></Link>
        <Link to='/daily_brief' className="side-nav"><button className="btn btn-light side-nav-btn"><p><i className="bi bi-briefcase-fill"></i></p></button></Link>
        <Link to='/performance_review/asset' className="side-nav"><button className="btn btn-light side-nav-btn"><p><i className="bi bi-journal-bookmark-fill"></i></p></button></Link>
        <Link to="/update_news" className="side-nav"><button className="btn btn-light side-nav-btn"><p><i className="bi bi-newspaper"></i></p></button></Link>
        <Link to="/enter_new_trade_info" className="side-nav"><button className="btn btn-light side-nav-btn"><p><i className="bi bi-info-circle-fill"></i></p></button></Link>
        <Link to="/scratch" className="side-nav"><button className="btn btn-light side-nav-btn"><p><i className="bi bi-robot"></i></p></button></Link>
        <Link to="/model_performance" className="side-nav"><button className="btn btn-light side-nav-btn"><p><i className="bi bi-pen-fill"></i></p></button></Link>
        <Link to="/risk_bot" className="side-nav"><button className="btn btn-light side-nav-btn"><p><i className="bi bi-currency-exchange"></i></p></button></Link>
        <Link to="/chill" className="side-nav"><button className="btn btn-light side-nav-btn"><p><i className="bi bi-headphones"></i></p></button></Link>
        <Link to="/quizifier" className="side-nav"><button className="btn btn-light side-nav-btn"><p><i className="bi bi-rocket-takeoff-fill"></i></p></button></Link>
        <Link to="/saved_quizzes" className="side-nav"><button className="btn btn-light side-nav-btn"><p><i className="bi bi-stars"></i></p></button></Link>
        <Link to="/alert_bot" className="side-nav"><button className="btn btn-light side-nav-btn"><p><i className="bi bi-bell-fill"></i></p></button></Link>
        <Link to="/tradergpt_analysis" className="side-nav"><button className="btn btn-light side-nav-btn"><p><i className="bi bi-life-preserver"></i></p></button></Link>
        <Link to="/backtested_results" className="side-nav"><button className="btn btn-light side-nav-btn"><p><i className="bi bi-yin-yang"></i></p></button></Link>
        <Link to="/ideas_section" className="side-nav"><button className="btn btn-light side-nav-btn"><p><i className="bi bi-lightbulb-fill"></i></p></button></Link>
        <Link to="/call_ai" className="side-nav"><button className="btn btn-light side-nav-btn"><p><i className="bi bi-telephone-fill"></i></p></button></Link>
        <Link to="/trade_ideas" className="side-nav"><button className="btn btn-light side-nav-btn"><p><i className="bi bi-snow2"></i></p></button></Link>
        <Link to="/prop_firm_management" className="side-nav"><button className="btn btn-light side-nav-btn"><p><i className="bi bi-database-fill"></i></p></button></Link>
        <Link to="/music" className="side-nav"><button className="btn btn-light side-nav-btn"><p><i className="bi bi-music-note-beamed"></i></p></button></Link>
        <Link to="/calendar" className="side-nav"><button className="btn btn-light side-nav-btn"><p><i className="bi bi-calendar-fill"></i></p></button></Link>
        <Link to="/calendar_data" className="side-nav"><button className="btn btn-light side-nav-btn"><p><i className="bi bi-clipboard-data-fill"></i></p></button></Link>
        {/* <Link to="/econ_explainer" className="side-nav"><button className="btn btn-light side-nav-btn"><p><i className="bi bi-cash-stack"></i></p></button></Link> */}
        <Link to="/forex_factory" className="side-nav"><button className="btn btn-light side-nav-btn"><p><i className="bi bi-camera-fill"></i></p></button></Link>
        {/* <Link to="/trading_econ_dashboard" className="side-nav"><button className="btn btn-light side-nav-btn"><p><i className="bi bi-graph-up-arrow"></i></p></button></Link> */}
        <Link to="/trading_calendar" className="side-nav"><button className="btn btn-light side-nav-btn"><p><i className="bi bi-calendar-date-fill"></i></p></button></Link>
        <Link to="/paper_gpt" className="side-nav"><button className="btn btn-light side-nav-btn"><p><i className="bi bi-mortarboard-fill"></i></p></button></Link>
        <Link to="/process_checker" className="side-nav"><button className="btn btn-light side-nav-btn"><p><i className="bi bi-patch-check-fill"></i></p></button></Link>
        {/* <Link to="/science_playground" className="side-nav"><button className="btn btn-light side-nav-btn"><p><i className="bi bi-infinity"></i></p></button></Link> */}
        <Link to="/economics_gpt" className="side-nav"><button className="btn btn-light side-nav-btn"><p><i className="bi bi-currency-dollar"></i></p></button></Link>
        <Link to="/ai_council" className="side-nav"><button className="btn btn-light side-nav-btn"><p><i className="bi bi-pentagon-fill"></i></p></button></Link>
        <Link to="/ai_council_conversations" className="side-nav"><button className="btn btn-light side-nav-btn"><p><i className="bi bi-chat-fill"></i></p></button></Link>
        <Link to="/firm_compliance" className="side-nav"><button className="btn btn-light side-nav-btn"><p><i className="bi bi-list-check"></i></p></button></Link>
        <Link to="/esi" className="side-nav"><button className="btn btn-light side-nav-btn"><p><i className="bi bi-graph-up-arrow"></i></p></button></Link>
        <Link to="/research_logbook" className="side-nav"><button className="btn btn-light side-nav-btn"><p><i className="bi bi-infinity"></i></p></button></Link>
        <Link to="/snowai_central_hub" className="side-nav"><button className="btn btn-light side-nav-btn"><p><i className="bi bi-browser-edge"></i></p></button></Link>
        <Link to="/snowai_earth" className="side-nav"><button className="btn btn-light side-nav-btn"><p><i className="bi bi-globe"></i></p></button></Link>
        <Link to="/diagnostics" className="side-nav"><button className="btn btn-light side-nav-btn"><p><i className="bi bi-bar-chart-steps"></i></p></button></Link>
        <Link to="/video_transcription" className="side-nav"><button className="btn btn-light side-nav-btn"><p><i className="bi bi-play-circle"></i></p></button></Link>
        <Link to="/board_of_governors" className="side-nav"><button className="btn btn-light side-nav-btn"><p><i className="bi bi-bank2"></i></p></button></Link>
        <Link to="/charts" className="side-nav"><button className="btn btn-light side-nav-btn"><p><i className="bi bi-diagram-3"></i></p></button></Link>
        <Link to="/asset_correlation" className="side-nav"><button className="btn btn-light side-nav-btn"><p><i className="bi bi-currency-yen"></i></p></button></Link>
        <Link to="/market_stability_score" className="side-nav"><button className="btn btn-light side-nav-btn"><p><i className="bi bi-chevron-bar-down"></i></p></button></Link>
        {/* <Link to="/black_hole" className="side-nav"><button className="btn btn-light side-nav-btn"><p><i className="bi bi-infinity"></i></p></button></Link> */}
        <Link to="/snowx" className="side-nav"><button className="btn btn-light side-nav-btn"><p><i className="bi bi-currency-bitcoin"></i></p></button></Link>
        <Link to="/hedge_fund_tracker" className="side-nav"><button className="btn btn-light side-nav-btn"><p><i className="bi bi-card-list"></i></p></button></Link>
        <Link to="/prob_engine" className="side-nav"><button className="btn btn-light side-nav-btn"><p><i className="bi bi-cpu"></i></p></button></Link>
        <Link to="/browser" className="side-nav"><button className="btn btn-light side-nav-btn"><p><i className="bi bi-search"></i></p></button></Link>
        <Link to="/videos" className="side-nav"><button className="btn btn-light side-nav-btn"><p><i className="bi bi-play-circle-fill"></i></p></button></Link>
        <Link to="/stock_screener" className="side-nav"><button className="btn btn-light side-nav-btn"><p><i className="bi bi-apple"></i></p></button></Link>
        <Link to="/ml_playground" className="side-nav"><button className="btn btn-light side-nav-btn"><p><i className="bi bi-droplet-fill"></i></p></button></Link>
        <Link to="/trading_sim" className="side-nav"><button className="btn btn-light side-nav-btn"><p><i className="bi bi-bullseye"></i></p></button></Link>
        <Link to="/forward_test" className="side-nav"><button className="btn btn-light side-nav-btn"><p><i className="bi bi-arrow-bar-right"></i></p></button></Link>

      </div>

      <div className="side-navs-cellphone">
        <Link to="/personal_info" className="side-nav">
            <i className="bi bi-person-fill"></i>
        </Link>
        <Link to="/account_analytics" className="side-nav">
            <i className="bi bi-bar-chart-line-fill"></i>
        </Link>
        <Link to="/multiple_account_analytics" className="side-nav">
            <i className="bi bi-percent"></i>
        </Link>
        <Link to="/market_makers" className="side-nav">
            <i className="bi bi-bank"></i>
        </Link>
        <Link to={`/conversation/${uniqueID}`} className="side-nav">
            <i className="bi bi-chat-square-dots"></i>
        </Link>
        <Link to="/daily_brief" className="side-nav">
            <i className="bi bi-briefcase-fill"></i>
        </Link>
        <Link to="/performance_review/asset" className="side-nav">
            <i className="bi bi-journal-bookmark-fill"></i>
        </Link>
        <Link to="/update_news" className="side-nav">
            <i className="bi bi-newspaper"></i>
        </Link>
        <Link to="/enter_new_trade_info" className="side-nav">
            <i className="bi bi-info-circle-fill"></i>
        </Link>
        <Link to="/scratch" className="side-nav">
            <i className="bi bi-robot"></i>
        </Link>
        <Link to="/model_performance" className="side-nav">
            <i className="bi bi-pen-fill"></i>
        </Link>
        <Link to="/risk_bot" className="side-nav">
            <i className="bi bi-currency-exchange"></i>
        </Link>
        <Link to="/chill" className="side-nav">
            <i className="bi bi-headphones"></i>
        </Link>
        <Link to="/quizifier" className="side-nav">
            <i className="bi bi-rocket-takeoff-fill"></i>
        </Link>
        <Link to="/saved_quizzes" className="side-nav">
            <i className="bi bi-stars"></i>
        </Link>
        <Link to="/alert_bot" className="side-nav">
            <i className="bi bi-bell-fill"></i>
        </Link>
        <Link to="/tradergpt_analysis" className="side-nav">
            <i className="bi bi-life-preserver"></i>
        </Link>
        <Link to="/backtested_results" className="side-nav">
            <i className="bi bi-yin-yang"></i>
        </Link>
        <Link to="/ideas_section" className="side-nav">
            <i className="bi bi-lightbulb-fill"></i>
        </Link>
        <Link to="/call_ai" className="side-nav">
            <i className="bi bi-telephone-fill"></i>
        </Link>
        <Link to="/trade_ideas" className="side-nav">
            <i className="bi bi-snow2"></i>
        </Link>
        <Link to="/prop_firm_management" className="side-nav">
            <i className="bi bi-database-fill"></i>
        </Link>
        <Link to="/music" className="side-nav">
            <i className="bi bi-music-note-beamed"></i>
        </Link>
        <Link to="/calendar" className="side-nav">
            <i className="bi bi-calendar-fill"></i>
        </Link>
        <Link to="/calendar_data" className="side-nav">
            <i className="bi bi-clipboard-data-fill"></i>
        </Link>
        {/* <Link to="/econ_explainer" className="side-nav">
            <i className="bi bi-cash-stack"></i>
        </Link> */}
        <Link to="/forex_factory" className="side-nav">
            <i className="bi bi-camera-fill"></i>
        </Link>
        {/* <Link to="/trading_econ_dashboard" className="side-nav">
            <i className="bi bi-graph-up-arrow"></i>
        </Link> */}
        <Link to="/trading_calendar" className="side-nav">
            <i className="bi bi-calendar-date-fill"></i>
        </Link>
        <Link to="/paper_gpt" className="side-nav">
            <i className="bi bi-mortarboard-fill"></i>
        </Link>
        <Link to="/process_checker" className="side-nav">
            <i className="bi bi-patch-check-fill"></i>
        </Link>
        {/* <Link to="/science_playground" className="side-nav">
            <i className="bi bi-infinity"></i>
        </Link> */}
        <Link to="/economics_gpt" className="side-nav">
            <i className="bi bi-currency-dollar"></i>
        </Link>
        <Link to="/ai_council" className="side-nav">
            <i className="bi bi-pentagon-fill"></i>
        </Link>
        <Link to="/ai_council_conversations" className="side-nav">
            <i className="bi bi-chat-fill"></i>
        </Link>
        <Link to="/firm_compliance" className="side-nav">
            <i className="bi bi-list-check"></i>
        </Link>
        <Link to="/esi" className="side-nav">
            <i className="bi bi-graph-up-arrow"></i>
        </Link>
        <Link to="/research_logbook" className="side-nav">
            <i className="bi bi-infinity"></i>
        </Link>
        <Link to="/snowai_central_hub" className="side-nav">
            <i className="bi bi-browser-edge"></i>
        </Link>
        <Link to="/snowai_earth" className="side-nav">
            <i className="bi bi-globe"></i>
        </Link>
        <Link to="/diagnostics" className="side-nav">
            <i className="bi bi-bar-chart-steps"></i>
        </Link>
        <Link to="/video_transcription" className="side-nav">
            <i className="bi bi-play-circle"></i>
        </Link>
        <Link to="/board_of_governors" className="side-nav">
            <i className="bi bi-bank2"></i>
        </Link>
        <Link to="/charts" className="side-nav">
            <i className="bi bi-diagram-3"></i>
        </Link>
        <Link to="/asset_correlation" className="side-nav">
            <i className="bi bi-currency-yen"></i>
        </Link>
        <Link to="/market_stability_score" className="side-nav">
            <i className="bi bi-chevron-bar-down"></i>
        </Link>
        {/* <Link to="/black_hole" className="side-nav">
            <i className="bi bi-infinity"></i>
        </Link> */}
        <Link to="/snowx" className="side-nav">
            <i className="bi bi-currency-bitcoin"></i>
        </Link>
        <Link to="/hedge_fund_tracker" className="side-nav">
            <i className="bi bi-card-list"></i>
        </Link>
        <Link to="/prob_engine" className="side-nav">
            <i className="bi bi-cpu"></i>
        </Link>
        <Link to="/browser" className="side-nav">
            <i className="bi bi-search"></i>
        </Link>
        <Link to="/videos" className="side-nav">
            <i className="bi bi-play-circle-fill"></i>
        </Link>
        <Link to="/stock_screener" className="side-nav">
            <i className="bi bi-apple"></i>
        </Link>
        <Link to="/ml_playground" className="side-nav">
            <i className="bi bi-droplet-fill"></i>
        </Link>
        <Link to="/trading_sim" className="side-nav">
            <i className="bi bi-bullseye"></i>
        </Link>
        <Link to="/forward_test" className="side-nav">
            <i className="bi bi-arrow-bar-right"></i>
        </Link>
      </div>
      <br />

      <div className="timezones">
        <div className="clock">
          <h5>New York</h5>
          <p>{timeNY}</p>
        </div>
        <div className="clock">
          <h5>London</h5>
          <p>{timeLondon}</p>
        </div>
        <div className="clock">
          <h5>Tokyo</h5>
          <p>{timeTokyo}</p>
        </div>
      </div>

      {/* Asset Tracker Toggle Button */}
      <div className="card shadow-sm mb-3">
        <div 
          className="card-header bg-light d-flex justify-content-between align-items-center" 
          style={{ cursor: 'pointer' }}
          onClick={toggleAssetTracker}
        >
          <h5 className="mb-0 text-primary d-flex align-items-center">
            <FaChartLine className="me-2" /> Asset Tracker
          </h5>
          <button className="btn btn-sm btn-outline-primary">
            {showAssetTracker ? <FaAngleUp /> : <FaAngleDown />}
          </button>
        </div>
      </div>
      
      {/* Conditional rendering of AssetTracker */}
      {showAssetTracker && <AssetTracker />}

      {/* Music Player, Admin buttons and Modal */}
      <div className="music-color-mode">
        <div className="music-player">
          <button className="btn btn-outline-secondary" data-bs-toggle="modal" data-bs-target="#sideNavsMusicModal">
            <FaMusic />
          </button>
          <button className="btn btn-outline-primary ms-2" onClick={saveAllSongsToBackend}>
            <FaSave /> Save All
          </button>
          {savingStatus && <div className="alert alert-info mt-2">{savingStatus}</div>}
        </div>

        {/* Music Selection Modal */}
        <div className="modal fade side-navs-modal" id="sideNavsMusicModal" tabIndex="-1" aria-labelledby="sideNavsMusicModalLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="sideNavsMusicModalLabel">Select a Song</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search for a song..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                {isLoading ? (
                  <div className="d-flex justify-content-center">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : (
                  <ul className="list-group">
                    {filteredSongs.map((song, index) => (
                      <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                        <span>{song.name}</span>
                        <button 
                          className="btn btn-sm btn-outline-primary" 
                          onClick={() => handlePlay(song)}
                        >
                          Play
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-danger" onClick={stopMusic}>Stop Music</button>
                <button type="button" className="btn btn-primary" data-bs-dismiss="modal">Close</button>
              </div>
            </div>
          </div>
        </div>

        {/* Theme Toggle Button */}
        <nav className="">
          <div className="container-fluid">
            <button className="btn btn-outline-secondary" onClick={toggleTheme}>
              {theme === 'light' ? <FaMoon /> : <FaSun />}
            </button>
          </div>
        </nav>
      </div><br />

      {/* Touch Feedback Overlay */}
      {touchFeedback && (
        <div className="touch-feedback-overlay">
          Navigating to {touchFeedback}
        </div>
      )}

      {/* Virtual Keyboard Toggle Button */}
      <button 
        className="keyboard-toggle-btn hud-glow"
        onClick={toggleKeyboard}
        title="Toggle Touch Navigation"
        onTouchStart={(e) => e.preventDefault()}
      >
        <FaKeyboard />
      </button>

      {/* Enhanced Virtual Touch Keyboard */}
      <div className="virtual-keyboard-container">
        <div className="keyboard-header">
          <div>
            <span>⚡ TOUCH NAVIGATION SYSTEM ⚡</span>
            <div style={{ fontSize: '12px', opacity: 0.8 }}>Touch hieroglyphics to navigate instantly</div>
          </div>
          <button 
            className="keyboard-close-btn"
            onClick={toggleKeyboard}
            onTouchStart={(e) => e.preventDefault()}
          >
            <FaTimes />
          </button>
        </div>
        
        <div className="navigation-grid scrollbar-hud">
          {navigationItems.map((item, index) => (
            <div 
              key={index}
              className={`nav-key ${touchFeedback === item.name ? 'feedback-pulse' : ''}`}
              onClick={() => handleTouchNavigation(item.route, item.name)}
              onTouchStart={(e) => {
                e.preventDefault();
                handleTouchNavigation(item.route, item.name);
              }}
              onMouseDown={(e) => e.preventDefault()}
              title={item.description}
              tabIndex={0}
              role="button"
              aria-label={`Navigate to ${item.description}`}
            >
              <div className="hieroglyph">{item.symbol}</div>
              <div className="key-label">{item.name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}