// side_navs.jsx — SnowAI SideNavs with Chrome-style page translator
// Fixed with email authentication + persistent cache

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';
import { FaSun, FaMoon, FaMusic, FaSave, FaChartLine, FaAngleDown, FaAngleUp, FaKeyboard, FaTimes, FaGlobe, FaLanguage } from 'react-icons/fa';
import { useAudio } from './audio_context';
import AssetTracker from "./asset_tracker";

// ─── SONG IMPORTS (unchanged from original) ───────────────────────────────────
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

// ─── PAGE TRANSLATOR HOOK WITH CACHE AND EMAIL AUTH ─────────────────────────

const SUPPORTED_LANGUAGES = [
  { code: 'en',    label: 'English',    flag: '🇬🇧', native: 'English' },
  { code: 'ko',    label: 'Korean',     flag: '🇰🇷', native: '한국어' },
  { code: 'zh',    label: 'Mandarin',   flag: '🇨🇳', native: '中文' },
  { code: 'ru',    label: 'Russian',    flag: '🇷🇺', native: 'Русский' },
  { code: 'ja',    label: 'Japanese',   flag: '🇯🇵', native: '日本語' },
  { code: 'fr',    label: 'French',     flag: '🇫🇷', native: 'Français' },
  { code: 'de',    label: 'German',     flag: '🇩🇪', native: 'Deutsch' },
  { code: 'es',    label: 'Spanish',    flag: '🇪🇸', native: 'Español' },
  { code: 'ar',    label: 'Arabic',     flag: '🇸🇦', native: 'العربية' },
  { code: 'pt',    label: 'Portuguese', flag: '🇧🇷', native: 'Português' },
];

const SKIP_TAGS = new Set([
  'SCRIPT', 'STYLE', 'NOSCRIPT', 'META', 'LINK',
  'INPUT', 'TEXTAREA', 'SELECT', 'CODE', 'PRE',
  'SVG', 'MATH',
]);

const SKIP_SELECTORS = [
  '[data-no-translate]',
  '[class*="side-nav"]',
  '.timezones',
  '.modal',
];

function shouldSkipNode(node) {
  let el = node.parentElement;
  while (el) {
    if (SKIP_TAGS.has(el.tagName)) return true;
    if (SKIP_SELECTORS.some(sel => el.matches && el.matches(sel))) return true;
    el = el.parentElement;
  }
  return false;
}

function usePageTranslator() {
  const [currentLang, setCurrentLang] = useState(() => {
    return localStorage.getItem('snowai_lang') || 'en';
  });
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationProgress, setTranslationProgress] = useState(0);
  const [showBanner, setShowBanner] = useState(false);
  
  const textNodeRegistry = useRef([]);
  const isInitialized = useRef(false);
  
  // FIXED: Properly initialize translation cache
  const translationCache = useRef({});
  
  // Load cache from localStorage on mount
  useEffect(() => {
    try {
      const savedCache = localStorage.getItem('snowai_translation_cache');
      if (savedCache) {
        translationCache.current = JSON.parse(savedCache);
        console.log(`📦 Loaded ${Object.keys(translationCache.current).length} cached translations`);
      }
    } catch (e) {
      console.warn('Failed to load translation cache:', e);
    }
  }, []);
  
  const saveCacheToLocalStorage = useCallback(() => {
    try {
      localStorage.setItem('snowai_translation_cache', JSON.stringify(translationCache.current));
    } catch (e) {
      console.warn('Failed to save translation cache:', e);
    }
  }, []);

  const initializeRegistry = useCallback(() => {
    if (isInitialized.current) return;
    
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode(node) {
          const text = node.nodeValue?.trim();
          if (!text || text.length < 1) return NodeFilter.FILTER_SKIP;
          if (shouldSkipNode(node)) return NodeFilter.FILTER_SKIP;
          return NodeFilter.FILTER_ACCEPT;
        }
      }
    );

    const nodes = [];
    let node;
    while ((node = walker.nextNode())) {
      nodes.push({
        node: node,
        originalText: node.nodeValue,
        currentLanguage: 'en'
      });
    }
    
    textNodeRegistry.current = nodes;
    isInitialized.current = true;
    console.log(`📝 Initialized translator with ${nodes.length} text nodes`);
  }, []);

  const restoreToEnglish = useCallback(() => {
    textNodeRegistry.current.forEach(entry => {
      if (entry.node.parentElement && document.body.contains(entry.node)) {
        entry.node.nodeValue = entry.originalText;
        entry.currentLanguage = 'en';
      }
    });
  }, []);

  const translateText = async (text, targetLang, retries = 2) => {
    if (!text.trim() || text.trim().length < 2) return text;
    if (text.trim().length < 3 && /^[\d\W]+$/.test(text)) return text;
    
    // CHECK CACHE FIRST
    const cacheKey = `${text}|${targetLang}`;
    if (translationCache.current[cacheKey]) {
      console.log(`✅ Cache hit for: "${text.substring(0, 30)}..."`);
      return translationCache.current[cacheKey];
    }
    
    console.log(`🌐 API call for: "${text.substring(0, 30)}..." (${text.length} chars)`);
    
    // YOUR EMAIL for higher rate limit (50k chars/day instead of 5k)
    const YOUR_EMAIL = 'motingwetloto@yahoo.com';
    const encodeText = encodeURIComponent(text);
    
    const tryMyMemory = async () => {
      const url = `https://api.mymemory.translated.net/get?q=${encodeText}&langpair=en|${targetLang}&de=${YOUR_EMAIL}`;
      const res = await fetch(url);
      const data = await res.json();
      
      if (data.responseStatus === 200 && data.responseData?.translatedText) {
        let translated = data.responseData.translatedText;
        translated = translated.replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&');
        
        if (translated !== text && translated.length > 0) {
          return translated;
        }
      }
      throw new Error('MyMemory returned invalid translation');
    };
    
    const tryLibreTranslate = async () => {
      const url = 'https://translate.argosopentech.com/translate';
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          q: text,
          source: 'en',
          target: targetLang,
          format: 'text'
        })
      });
      const data = await res.json();
      if (data.translatedText) return data.translatedText;
      throw new Error('LibreTranslate failed');
    };
    
    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        const result = await tryMyMemory();
        translationCache.current[cacheKey] = result;
        saveCacheToLocalStorage();
        return result;
      } catch (err) {
        console.warn(`MyMemory attempt ${attempt + 1} failed:`, err.message);
        
        try {
          const result = await tryLibreTranslate();
          translationCache.current[cacheKey] = result;
          saveCacheToLocalStorage();
          return result;
        } catch (libreErr) {
          console.warn(`LibreTranslate attempt ${attempt + 1} failed:`, libreErr.message);
        }
        
        if (attempt < retries - 1) {
          await new Promise(r => setTimeout(r, 1000 * (attempt + 1)));
        }
      }
    }
    
    return text;
  };

  const translatePage = useCallback(async (targetLang) => {
    if (!SUPPORTED_LANGUAGES.some(l => l.code === targetLang)) {
      console.error(`Unsupported language: ${targetLang}`);
      return;
    }
    
    if (targetLang === 'en') {
      restoreToEnglish();
      setCurrentLang('en');
      localStorage.setItem('snowai_lang', 'en');
      setShowBanner(false);
      return;
    }
    
    if (currentLang === targetLang && !isTranslating) {
      console.log(`Already in ${targetLang}, skipping...`);
      return;
    }
    
    setIsTranslating(true);
    setTranslationProgress(0);
    
    try {
      initializeRegistry();
      restoreToEnglish();
      
      const textsToTranslate = [];
      const entriesToTranslate = [];
      
      textNodeRegistry.current.forEach(entry => {
        const text = entry.originalText.trim();
        if (text && text.length >= 2) {
          textsToTranslate.push(text);
          entriesToTranslate.push(entry);
        }
      });
      
      console.log(`🔄 Translating ${textsToTranslate.length} text segments to ${targetLang}...`);
      
      const BATCH_SIZE = 5;
      const translatedTexts = [];
      
      for (let i = 0; i < textsToTranslate.length; i += BATCH_SIZE) {
        const batch = textsToTranslate.slice(i, i + BATCH_SIZE);
        
        const batchResults = [];
        for (let j = 0; j < batch.length; j++) {
          const text = batch[j];
          const translated = await translateText(text, targetLang, 2);
          batchResults.push(translated);
          
          const progress = Math.round(((i + j + 1) / textsToTranslate.length) * 100);
          setTranslationProgress(progress);
          
          if (j < batch.length - 1) await new Promise(r => setTimeout(r, 50));
        }
        
        translatedTexts.push(...batchResults);
        
        if (i + BATCH_SIZE < textsToTranslate.length) {
          await new Promise(r => setTimeout(r, 300));
        }
      }
      
      entriesToTranslate.forEach((entry, idx) => {
        if (entry.node.parentElement && document.body.contains(entry.node)) {
          const translated = translatedTexts[idx];
          if (translated && translated !== entry.originalText) {
            entry.node.nodeValue = translated;
            entry.currentLanguage = targetLang;
          }
        }
      });
      
      setCurrentLang(targetLang);
      localStorage.setItem('snowai_lang', targetLang);
      setShowBanner(true);
      
      console.log(`✅ Translation to ${targetLang} complete!`);
      
    } catch (err) {
      console.error('Translation error:', err);
    } finally {
      setIsTranslating(false);
      setTranslationProgress(100);
      setTimeout(() => setTranslationProgress(0), 2000);
    }
  }, [initializeRegistry, restoreToEnglish, currentLang, isTranslating]);

  const resetTranslationCache = useCallback(() => {
    translationCache.current = {};
    localStorage.removeItem('snowai_translation_cache');
    console.log('🗑️ Translation cache cleared');
  }, []);

  // Re-initialize on route change
  useEffect(() => {
    isInitialized.current = false;
    textNodeRegistry.current = [];
    
    const timer = setTimeout(() => {
      initializeRegistry();
      
      const savedLang = localStorage.getItem('snowai_lang');
      if (savedLang && savedLang !== 'en' && savedLang !== currentLang) {
        translatePage(savedLang);
      } else if (savedLang && savedLang !== 'en' && currentLang === 'en') {
        setShowBanner(true);
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, [window.location.pathname]);

  useEffect(() => {
    const saved = localStorage.getItem('snowai_lang');
    if (saved && saved !== 'en') {
      setShowBanner(true);
    }
  }, []);

  return {
    currentLang,
    isTranslating,
    translationProgress,
    showBanner,
    setShowBanner,
    translatePage,
    resetTranslationCache,
    SUPPORTED_LANGUAGES,
  };
}

// ─── LANGUAGE SWITCHER UI COMPONENT ──────────────────────────────────────────
function LanguageSwitcher({ translator }) {
  const { currentLang, isTranslating, translationProgress, translatePage, resetTranslationCache, SUPPORTED_LANGUAGES } = translator;
  const [expanded, setExpanded] = useState(false);

  const currentLangObj = SUPPORTED_LANGUAGES.find(l => l.code === currentLang) || SUPPORTED_LANGUAGES[0];

  return (
    <div className="language-switcher-container" data-no-translate>
      <style>{`
        .language-switcher-container {
          margin: 16px 12px;
          position: relative;
          z-index: 9999;
        }

        .lang-trigger-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          padding: 10px 14px;
          background: var(--color-background-secondary, #f8f9fa);
          border: 1px solid rgba(128,128,128,0.2);
          border-radius: 12px;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.2s ease;
          color: var(--color-text-primary, #333);
        }

        .lang-trigger-btn:hover {
          background: rgba(59, 130, 246, 0.1);
          border-color: #3b82f6;
        }

        .lang-flag {
          font-size: 20px;
        }

        .lang-name {
          flex: 1;
          font-weight: 600;
        }

        .lang-status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #22c55e;
        }

        .lang-status-dot.translating {
          background: #f59e0b;
          animation: pulse 1s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
        }

        .lang-dropdown {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          margin-top: 8px;
          background: #ffffff !important;
          border: 1px solid rgba(0,0,0,0.15);
          border-radius: 12px;
          overflow: hidden;
          z-index: 10000;
          box-shadow: 0 8px 24px rgba(0,0,0,0.15);
          max-height: 400px;
          overflow-y: auto;
        }

        body.dark .lang-dropdown {
          background: #1e1e2f !important;
          border-color: rgba(255,255,255,0.1);
        }

        .lang-dropdown-header {
          padding: 10px 14px 8px;
          font-size: 11px;
          color: #6c757d !important;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border-bottom: 1px solid rgba(0,0,0,0.1);
          background: inherit;
        }

        body.dark .lang-dropdown-header {
          color: #a0a0b0 !important;
          border-bottom-color: rgba(255,255,255,0.1);
        }

        .lang-option {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 14px;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.15s;
          border: none;
          background: transparent;
          width: 100%;
          text-align: left;
          color: #333333 !important;
        }

        body.dark .lang-option {
          color: #e0e0e0 !important;
        }

        .lang-option:hover {
          background: rgba(59, 130, 246, 0.1);
        }

        .lang-option.active {
          background: rgba(59, 130, 246, 0.15);
          color: #3b82f6 !important;
        }

        .lang-option.active .lang-option-native {
          color: #3b82f6 !important;
        }

        .lang-option-native {
          font-weight: 500;
          flex: 1;
          color: inherit !important;
        }

        .lang-option-english {
          font-size: 11px;
          color: #888888 !important;
        }

        body.dark .lang-option-english {
          color: #999999 !important;
        }

        .lang-option-check {
          font-size: 16px;
          color: #3b82f6 !important;
        }

        .translation-progress-bar {
          height: 3px;
          background: rgba(59, 130, 246, 0.15);
          border-radius: 3px;
          overflow: hidden;
          margin-top: 6px;
        }

        .translation-progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #3b82f6, #60a5fa);
          border-radius: 3px;
          transition: width 0.3s ease;
        }

        .translate-status-text {
          font-size: 11px;
          color: #6c757d !important;
          margin-top: 6px;
          text-align: center;
        }

        body.dark .translate-status-text {
          color: #a0a0b0 !important;
        }

        .clear-cache-btn {
          font-size: 10px;
          background: transparent;
          border: none;
          color: #888;
          cursor: pointer;
          margin-top: 6px;
          text-decoration: underline;
          width: 100%;
          text-align: center;
          padding: 8px;
        }

        body.dark .clear-cache-btn {
          color: #aaa;
        }

        .clear-cache-btn:hover {
          color: #ef4444;
        }

        .lang-dropdown::-webkit-scrollbar {
          width: 4px;
        }
        .lang-dropdown::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 4px;
        }
        .lang-dropdown::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 4px;
        }
        
        body.dark .lang-dropdown::-webkit-scrollbar-track {
          background: #2a2a3a;
        }
        body.dark .lang-dropdown::-webkit-scrollbar-thumb {
          background: #555;
        }
      `}</style>

      <button
        className="lang-trigger-btn"
        onClick={() => setExpanded(!expanded)}
        disabled={isTranslating}
      >
        <FaGlobe style={{ fontSize: 14, opacity: 0.7 }} />
        <span className="lang-flag">{currentLangObj.flag}</span>
        <span className="lang-name">{currentLangObj.native}</span>
        <span className={`lang-status-dot ${isTranslating ? 'translating' : ''}`} />
      </button>

      {isTranslating && translationProgress > 0 && translationProgress < 100 && (
        <>
          <div className="translation-progress-bar">
            <div className="translation-progress-fill" style={{ width: `${translationProgress}%` }} />
          </div>
          <div className="translate-status-text">
            Translating to {currentLangObj?.native}... {translationProgress}%
          </div>
        </>
      )}

      {expanded && (
        <div className="lang-dropdown">
          <div className="lang-dropdown-header">
            🌐 Translate page to
          </div>
          {SUPPORTED_LANGUAGES.map(lang => (
            <button
              key={lang.code}
              className={`lang-option ${currentLang === lang.code ? 'active' : ''}`}
              onClick={() => {
                translatePage(lang.code);
                setExpanded(false);
              }}
              disabled={isTranslating}
            >
              <span style={{ fontSize: 18 }}>{lang.flag}</span>
              <span className="lang-option-native">{lang.native}</span>
              <span className="lang-option-english">{lang.label}</span>
              {currentLang === lang.code && <span className="lang-option-check">✓</span>}
            </button>
          ))}
          <button
            className="clear-cache-btn"
            onClick={() => {
              resetTranslationCache();
              setExpanded(false);
            }}
          >
            🗑️ Clear translation cache
          </button>
        </div>
      )}
    </div>
  );
}

// ─── TRANSLATION BANNER ───────────────────────────────────────────────────────
function TranslateBanner({ translator }) {
  const { currentLang, showBanner, setShowBanner, translatePage, SUPPORTED_LANGUAGES } = translator;
  const savedLang = SUPPORTED_LANGUAGES.find(l => l.code === currentLang);

  if (!showBanner || currentLang === 'en') return null;

  return (
    <div data-no-translate style={{
      position: 'fixed',
      top: 16,
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 99999,
      background: '#1e293b',
      color: '#f8fafc',
      borderRadius: 10,
      padding: '10px 16px',
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      fontSize: 13,
      boxShadow: '0 4px 24px rgba(0,0,0,0.25)',
      maxWidth: 420,
      width: 'calc(100% - 32px)',
    }}>
      <FaLanguage style={{ fontSize: 18, opacity: 0.8 }} />
      <span style={{ flex: 1 }}>
        This page was translated to <strong>{savedLang?.label}</strong>
      </span>
      <button
        onClick={() => { translatePage('en'); setShowBanner(false); }}
        style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: '#f8fafc', borderRadius: 6, padding: '4px 10px', cursor: 'pointer', fontSize: 12 }}
      >
        Show original
      </button>
      <button
        onClick={() => setShowBanner(false)}
        style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', padding: '2px 4px', fontSize: 16 }}
      >
        ×
      </button>
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
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

  const translator = usePageTranslator();

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
    { route: "/esi", symbol: "𓊷", name: "ESI", description: "Economic Strength Index" },
    { route: "/snow_meet", symbol: "𓊷", name: "Snow Meet", description: "SnowAI Meet" },

  ];

  const songs = [
    { name: "MIT👨‍🎓📖🚀", file: mit },
    { name: "Atreides Theme ⚔️", file: atreides_theme },
    { name: "Jingle Bells", file: jingleBells },
    { name: "Snow Storm", file: snowStorm },
    { name: "Love Story", file: love_story },
    { name: "Ezio's Family", file: ezio_family },
    { name: "Hymn for The Weekend", file: hymn_for_the_weekend },
    { name: "Daydreaming", file: daydreaming },
    { name: "Me Times Two", file: me_times_two },
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
    { name: "Marshmellow 😋", file: marshmellow },
    { name: "Rose 🌹", file: rose },
    { name: "This is MIT 👨‍🎓📚", file: this_is_mit },
    { name: "Dune: Time between storms ⌛🗡️", file: time_between_storms },
    { name: "Somnus Theme 🐺🥷", file: somnus_theme },
    { name: "Joji - Your Man 🦸‍♂️🦸‍♀️", file: your_man },
    { name: "Cry Baby - SZA 🌃🌃", file: cry_baby },
    { name: "Genesis - Jorma Kaukonen", file: genesis },
    { name: "Rewrite the Stars 🌃", file: rewrite_the_stars },
    { name: "Bloodline - Ariana Grande 🎤", file: bloodline },
    { name: "Ma Meilleure Ennemie (Arcane S2) 🌃", file: ma_meilleure_enemie },
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
    { name: "Free - Rumi and Jinu 🌹", file: free },
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
    { name: "K-Drama Study Motivation 🇰🇷", file: kdrama_study },
    { name: "Kambulat Ona 🎸", file: kambulat_ona },
    { name: "Killing Butterflies 🦋", file: killing_butterflies },
    { name: "Lil Boo Thang 🏖️😎", file: lil_boo_thang },
    { name: "Will & Evelyn", file: will_evelyn },
    { name: "No Batidao 🇧🇷🕺", file: no_batidao },
    { name: "Celebrate - Alan Avry 🦜", file: celebrate_alan },
    { name: "GODS - NewJeans", file: gods },
    { name: "MENTE MA 🏄", file: mente_ma },
    { name: "Ba Fang Lai Cai 🎧🌃", file: bang_lai },
    { name: "Décembre 🇫🇷", file: decembre },
    { name: "If I am With You ☀️", file: honored_one },
    { name: "Answer to My Love 🎧", file: answer_to_my_love },
    { name: "Afrohouse Kilometro 🕺", file: kilometro },
    { name: "Joyful - Chess (Slowed)", file: chess_slowed },
    { name: "Joyful - Chess", file: chess },
  ];

  const handleTouchNavigation = (route, itemName) => {
    setTouchFeedback(itemName);
    if (navigator.vibrate) navigator.vibrate(50);
    setTimeout(() => {
      navigate(route);
      setShowKeyboard(false);
      setTouchFeedback(null);
    }, 150);
  };

  const toggleSideNav = () => setIsOpen(!isOpen);
  const toggleAssetTracker = () => setShowAssetTracker(!showAssetTracker);
  const toggleKeyboard = () => setShowKeyboard(!showKeyboard);
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.body.className = newTheme;
    localStorage.setItem('theme', newTheme);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const opts = { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: false };
      setTimeNY(new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', ...opts }).format(now));
      setTimeLondon(new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/London', ...opts }).format(now));
      setTimeTokyo(new Intl.DateTimeFormat('en-JP', { timeZone: 'Asia/Tokyo', ...opts }).format(now));
    }, 1000);

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
      document.body.className = savedTheme;
    }

    return () => clearInterval(interval);
  }, []);

  const { isPlaying, currentSong, playMusic, stopMusic } = useAudio();

  const saveAllSongsToBackend = async () => {
    setSavingStatus("Saving songs to backend...");
    let successCount = 0;
    let errorCount = 0;

    for (const song of songs) {
      try {
        const response = await fetch(song.file);
        if (!response.ok) throw new Error(`Failed to fetch: ${song.file}`);
        const blob = await response.blob();
        const fileName = song.file.split('/').pop();
        const songFile = new File([blob], fileName, { type: 'audio/mpeg' });
        const formData = new FormData();
        formData.append('name', song.name);
        formData.append('file', songFile);
        const saveResponse = await fetch(`${baseURL}/save-music`, { method: 'POST', body: formData });
        if (saveResponse.ok) { successCount++; setSavingStatus(`Saved ${successCount} of ${songs.length} songs...`); }
        else { errorCount++; }
      } catch (error) {
        errorCount++;
        console.error(`Error saving song ${song.name}:`, error);
      }
    }
    setSavingStatus(`Completed! Saved ${successCount} songs, Failed: ${errorCount}`);
    setTimeout(() => setSavingStatus(""), 5000);
  };

  const handlePlay = (song) => {
    playMusic(song.file);
  };

  const filteredSongs = songsFromBackend.length > 0
    ? songsFromBackend.filter(song => song.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : songs.filter(song => song.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="all-side-navs">
      <TranslateBanner translator={translator} />

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
          touch-action: manipulation;
        }
        .nav-key:hover, .nav-key:focus, .nav-key.touch-active {
          background: linear-gradient(145deg, #004080, #00aaff);
          color: #ffffff;
          transform: translateY(-2px) scale(1.05);
          box-shadow: 0 8px 25px rgba(0, 170, 255, 0.4);
          border-color: #ffffff;
        }
        .nav-key:active {
          transform: translateY(0) scale(0.95);
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
        .keyboard-toggle-btn:hover {
          transform: scale(1.1);
          box-shadow: 0 12px 35px rgba(0, 170, 255, 0.6);
        }
        .keyboard-toggle-btn:active { transform: scale(0.95); }
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
        .scrollbar-hud::-webkit-scrollbar { width: 8px; }
        .scrollbar-hud::-webkit-scrollbar-track { background: rgba(0, 31, 63, 0.5); border-radius: 4px; }
        .scrollbar-hud::-webkit-scrollbar-thumb { background: linear-gradient(135deg, #00aaff, #0088cc); border-radius: 4px; }
        .virtual-keyboard-container * {
          -webkit-touch-callout: none;
          -webkit-user-select: none;
          user-select: none;
        }
        @media (max-width: 768px) {
          .navigation-grid { grid-template-columns: repeat(auto-fit, minmax(70px, 1fr)); gap: 10px; }
          .nav-key { min-height: 70px; padding: 10px; }
          .hieroglyph { font-size: 20px; }
          .key-label { font-size: 9px; }
        }
        @media (max-width: 480px) {
          .navigation-grid { grid-template-columns: repeat(6, 1fr); gap: 8px; }
          .nav-key { min-height: 60px; padding: 8px; }
          .hieroglyph { font-size: 18px; }
          .key-label { font-size: 8px; }
          .virtual-keyboard-container { padding: 15px 10px; }
          .keyboard-toggle-btn { width: 50px; height: 50px; font-size: 20px; bottom: 15px; right: 15px; }
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
        <Link to="/forex_factory" className="side-nav"><button className="btn btn-light side-nav-btn"><p><i className="bi bi-camera-fill"></i></p></button></Link>
        <Link to="/trading_calendar" className="side-nav"><button className="btn btn-light side-nav-btn"><p><i className="bi bi-calendar-date-fill"></i></p></button></Link>
        <Link to="/paper_gpt" className="side-nav"><button className="btn btn-light side-nav-btn"><p><i className="bi bi-mortarboard-fill"></i></p></button></Link>
        <Link to="/process_checker" className="side-nav"><button className="btn btn-light side-nav-btn"><p><i className="bi bi-patch-check-fill"></i></p></button></Link>
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
        <Link to="/snowx" className="side-nav"><button className="btn btn-light side-nav-btn"><p><i className="bi bi-currency-bitcoin"></i></p></button></Link>
        <Link to="/hedge_fund_tracker" className="side-nav"><button className="btn btn-light side-nav-btn"><p><i className="bi bi-card-list"></i></p></button></Link>
        <Link to="/prob_engine" className="side-nav"><button className="btn btn-light side-nav-btn"><p><i className="bi bi-cpu"></i></p></button></Link>
        <Link to="/browser" className="side-nav"><button className="btn btn-light side-nav-btn"><p><i className="bi bi-search"></i></p></button></Link>
        <Link to="/videos" className="side-nav"><button className="btn btn-light side-nav-btn"><p><i className="bi bi-play-circle-fill"></i></p></button></Link>
        <Link to="/stock_screener" className="side-nav"><button className="btn btn-light side-nav-btn"><p><i className="bi bi-apple"></i></p></button></Link>
        <Link to="/trading_sim" className="side-nav"><button className="btn btn-light side-nav-btn"><p><i className="bi bi-bullseye"></i></p></button></Link>
        <Link to="/forward_test" className="side-nav"><button className="btn btn-light side-nav-btn"><p><i className="bi bi-arrow-bar-right"></i></p></button></Link>
        <Link to="/ide" className="side-nav"><button className="btn btn-light side-nav-btn"><p><i className="bi bi-code-slash"></i></p></button></Link>
        <Link to="/neuro_link" className="side-nav"><button className="btn btn-light side-nav-btn"><p><i className="bi bi-usb-plug"></i></p></button></Link>
        <Link to="/sandbox" className="side-nav"><button className="btn btn-light side-nav-btn"><p><i className="bi bi-box"></i></p></button></Link>
        <Link to="/poi" className="side-nav"><button className="btn btn-light side-nav-btn"><p><i className="bi bi-cup-hot-fill"></i></p></button></Link>
        <Link to="/jjk" className="side-nav"><button className="btn btn-light side-nav-btn"><p><i className="bi bi-infinity"></i></p></button></Link>
        <Link to="/snowai_moments" className="side-nav"><button className="btn btn-light side-nav-btn"><p><i className="bi bi-camera"></i></p></button></Link>
        <Link to="/data_tracker" className="side-nav"><button className="btn btn-light side-nav-btn"><p><i className="bi bi-book-half"></i></p></button></Link>
        <Link to="/snow_meet" className="side-nav"><button className="btn btn-light side-nav-btn"><p><i class="bi bi-telephone-outbound-fill"></i></p></button></Link>
        <Link to="/companies" className="side-nav"><button className="btn btn-light side-nav-btn"><p><i class="bi bi-buildings"></i></p></button></Link>
        <Link to="/universe" className="side-nav"><button className="btn btn-light side-nav-btn"><p><i class="bi bi-globe"></i></p></button></Link>
        </div>

      <div className="side-navs-cellphone">
        <Link to="/personal_info" className="side-nav"><i className="bi bi-person-fill"></i></Link>
        <Link to="/account_analytics" className="side-nav"><i className="bi bi-bar-chart-line-fill"></i></Link>
        <Link to="/multiple_account_analytics" className="side-nav"><i className="bi bi-percent"></i></Link>
        <Link to="/market_makers" className="side-nav"><i className="bi bi-bank"></i></Link>
        <Link to={`/conversation/${uniqueID}`} className="side-nav"><i className="bi bi-chat-square-dots"></i></Link>
        <Link to="/daily_brief" className="side-nav"><i className="bi bi-briefcase-fill"></i></Link>
        <Link to="/performance_review/asset" className="side-nav"><i className="bi bi-journal-bookmark-fill"></i></Link>
        <Link to="/update_news" className="side-nav"><i className="bi bi-newspaper"></i></Link>
        <Link to="/enter_new_trade_info" className="side-nav"><i className="bi bi-info-circle-fill"></i></Link>
        <Link to="/scratch" className="side-nav"><i className="bi bi-robot"></i></Link>
        <Link to="/model_performance" className="side-nav"><i className="bi bi-pen-fill"></i></Link>
        <Link to="/risk_bot" className="side-nav"><i className="bi bi-currency-exchange"></i></Link>
        <Link to="/chill" className="side-nav"><i className="bi bi-headphones"></i></Link>
        <Link to="/quizifier" className="side-nav"><i className="bi bi-rocket-takeoff-fill"></i></Link>
        <Link to="/saved_quizzes" className="side-nav"><i className="bi bi-stars"></i></Link>
        <Link to="/alert_bot" className="side-nav"><i className="bi bi-bell-fill"></i></Link>
        <Link to="/tradergpt_analysis" className="side-nav"><i className="bi bi-life-preserver"></i></Link>
        <Link to="/backtested_results" className="side-nav"><i className="bi bi-yin-yang"></i></Link>
        <Link to="/ideas_section" className="side-nav"><i className="bi bi-lightbulb-fill"></i></Link>
        <Link to="/call_ai" className="side-nav"><i className="bi bi-telephone-fill"></i></Link>
        <Link to="/trade_ideas" className="side-nav"><i className="bi bi-snow2"></i></Link>
        <Link to="/prop_firm_management" className="side-nav"><i className="bi bi-database-fill"></i></Link>
        <Link to="/music" className="side-nav"><i className="bi bi-music-note-beamed"></i></Link>
        <Link to="/calendar" className="side-nav"><i className="bi bi-calendar-fill"></i></Link>
        <Link to="/calendar_data" className="side-nav"><i className="bi bi-clipboard-data-fill"></i></Link>
        <Link to="/forex_factory" className="side-nav"><i className="bi bi-camera-fill"></i></Link>
        <Link to="/trading_calendar" className="side-nav"><i className="bi bi-calendar-date-fill"></i></Link>
        <Link to="/paper_gpt" className="side-nav"><i className="bi bi-mortarboard-fill"></i></Link>
        <Link to="/process_checker" className="side-nav"><i className="bi bi-patch-check-fill"></i></Link>
        <Link to="/economics_gpt" className="side-nav"><i className="bi bi-currency-dollar"></i></Link>
        <Link to="/ai_council" className="side-nav"><i className="bi bi-pentagon-fill"></i></Link>
        <Link to="/ai_council_conversations" className="side-nav"><i className="bi bi-chat-fill"></i></Link>
        <Link to="/firm_compliance" className="side-nav"><i className="bi bi-list-check"></i></Link>
        <Link to="/esi" className="side-nav"><i className="bi bi-graph-up-arrow"></i></Link>
        <Link to="/research_logbook" className="side-nav"><i className="bi bi-infinity"></i></Link>
        <Link to="/snowai_central_hub" className="side-nav"><i className="bi bi-browser-edge"></i></Link>
        <Link to="/snowai_earth" className="side-nav"><i className="bi bi-globe"></i></Link>
        <Link to="/diagnostics" className="side-nav"><i className="bi bi-bar-chart-steps"></i></Link>
        <Link to="/video_transcription" className="side-nav"><i className="bi bi-play-circle"></i></Link>
        <Link to="/board_of_governors" className="side-nav"><i className="bi bi-bank2"></i></Link>
        <Link to="/charts" className="side-nav"><i className="bi bi-diagram-3"></i></Link>
        <Link to="/asset_correlation" className="side-nav"><i className="bi bi-currency-yen"></i></Link>
        <Link to="/market_stability_score" className="side-nav"><i className="bi bi-chevron-bar-down"></i></Link>
        <Link to="/snowx" className="side-nav"><i className="bi bi-currency-bitcoin"></i></Link>
        <Link to="/hedge_fund_tracker" className="side-nav"><i className="bi bi-card-list"></i></Link>
        <Link to="/prob_engine" className="side-nav"><i className="bi bi-cpu"></i></Link>
        <Link to="/browser" className="side-nav"><i className="bi bi-search"></i></Link>
        <Link to="/videos" className="side-nav"><i className="bi bi-play-circle-fill"></i></Link>
        <Link to="/stock_screener" className="side-nav"><i className="bi bi-apple"></i></Link>
        <Link to="/trading_sim" className="side-nav"><i className="bi bi-bullseye"></i></Link>
        <Link to="/forward_test" className="side-nav"><i className="bi bi-arrow-bar-right"></i></Link>
        <Link to="/ide" className="side-nav"><i className="bi bi-code-slash"></i></Link>
        <Link to="/neuro_link" className="side-nav"><i className="bi bi-usb-plug"></i></Link>
        <Link to="/sandbox" className="side-nav"><i className="bi bi-box"></i></Link>
        <Link to="/poi" className="side-nav"><i className="bi bi-cup-hot-fill"></i></Link>
        <Link to="/jjk" className="side-nav"><i className="bi bi-infinity"></i></Link>
        <Link to="/snowai_moments" className="side-nav"><i className="bi bi-camera"></i></Link>
        <Link to="/data_tracker" className="side-nav"><i className="bi bi-book-half"></i></Link>
        <Link to="/snow_meet" className="side-nav"><i class="bi bi-telephone-outbound-fill"></i></Link>
        <Link to="/companies" className="side-nav"><i class="bi bi-buildings"></i></Link>
        <Link to="/universe" className="side-nav"><i class="bi bi-globe"></i></Link>
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

      {showAssetTracker && <AssetTracker />}

      <LanguageSwitcher translator={translator} />

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
                    data-no-translate
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
                      <li key={index} className="list-group-item d-flex justify-content-between align-items-center" data-no-translate>
                        <span>{song.name}</span>
                        <button className="btn btn-sm btn-outline-primary" onClick={() => handlePlay(song)}>Play</button>
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

        <nav>
          <div className="container-fluid">
            <button className="btn btn-outline-secondary" onClick={toggleTheme}>
              {theme === 'light' ? <FaMoon /> : <FaSun />}
            </button>
          </div>
        </nav>
      </div>

      <br />

      {touchFeedback && (
        <div className="touch-feedback-overlay">
          Navigating to {touchFeedback}
        </div>
      )}

      <button
        className="keyboard-toggle-btn"
        onClick={toggleKeyboard}
        title="Toggle Touch Navigation"
        onTouchStart={(e) => e.preventDefault()}
      >
        <FaKeyboard />
      </button>

      <div className="virtual-keyboard-container">
        <div className="keyboard-header">
          <div>
            <span>⚡ TOUCH NAVIGATION SYSTEM ⚡</span>
            <div style={{ fontSize: '12px', opacity: 0.8 }}>Touch hieroglyphics to navigate instantly</div>
          </div>
          <button className="keyboard-close-btn" onClick={toggleKeyboard} onTouchStart={(e) => e.preventDefault()}>
            <FaTimes />
          </button>
        </div>

        <div className="navigation-grid scrollbar-hud">
          {navigationItems.map((item, index) => (
            <div
              key={index}
              className={`nav-key ${touchFeedback === item.name ? 'feedback-pulse' : ''}`}
              onClick={() => handleTouchNavigation(item.route, item.name)}
              onTouchStart={(e) => { e.preventDefault(); handleTouchNavigation(item.route, item.name); }}
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