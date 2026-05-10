import { useState, useEffect, useRef, useCallback } from 'react';
import type { StoreState } from './data/types';
import { SECONDS_PER_SCENE, MODELS } from './data/types';
import { HISTORY_CONTEXTS, countryList } from './data/countries';
import { VISUAL_STYLES } from './data/visualStyles';
import { SYSTEM_PROMPT_IQ180_HISTORY_ANALYST, SYSTEM_PROMPT_HISTORICAL_SCRIPTWRITER, SYSTEM_PROMPT_SEO_MASTER, SYSTEM_PROMPT_MARKET_ANALYST } from './data/prompts';
import { callAI, getNextKey } from './lib/api';
import { downloadFile, copyToClipboard, fetchYoutubeMeta, getTierColor, getImpactColor, cleanNoise } from './lib/utils';
import SpyTab from './components/tabs/SpyTab';
import StudioTab from './components/tabs/StudioTab';
import SeoTab from './components/tabs/SeoTab';
import MarketTab from './components/tabs/MarketTab';
import Header from './components/Header';
import SettingsModal from './components/SettingsModal';
import ErrorToast from './components/ErrorToast';

const initialStore: StoreState = {
  isVip: true,
  userPlan: 'vip',
  keyPool: [],
  currentKeyIndex: 0,
  activeTab: 'spy',
  scriptTopic: '',
  durationMinutes: 1,
  visualStyle: 'auto',
  selectedVisualStyle: 'auto',
  detectedStyle: '',
  detectedMode: null,
  scriptSegments: [],
  productionMode: 'video',
  renderedMedia: {},
  checklistState: {},
  activeLanguage: 'vn_aspiration',
  uiLanguage: 'vi',
  renderingId: null,
  isLoading: false,
  openRouterKey: '',
  openRouterModel: MODELS.openrouter_default,
  youtubeApiKey: '',
  openAiKey: '',
  openAiModel: 'gpt-4-turbo-preview',
  apiEnabled: { google: true, openrouter: false, openai: false, youtube: false }
};

function loadStore(): StoreState {
  try {
    const saved = localStorage.getItem('hm_key_pool');
    if (saved) initialStore.keyPool = JSON.parse(saved);
    const savedOr = localStorage.getItem('hm_openrouter_key');
    if (savedOr) initialStore.openRouterKey = savedOr;
    const savedOrM = localStorage.getItem('hm_openrouter_model');
    if (savedOrM) initialStore.openRouterModel = savedOrM;
    const savedYT = localStorage.getItem('hm_youtube_key');
    if (savedYT) initialStore.youtubeApiKey = savedYT;
    const savedOA = localStorage.getItem('hm_openai_key');
    if (savedOA) initialStore.openAiKey = savedOA;
    const savedOAM = localStorage.getItem('hm_openai_model');
    if (savedOAM) initialStore.openAiModel = savedOAM;
    const savedApiEnabled = localStorage.getItem('hm_api_enabled');
    if (savedApiEnabled) initialStore.apiEnabled = JSON.parse(savedApiEnabled);
    const savedLang = localStorage.getItem('hm_ui_language');
    if (savedLang === 'vi' || savedLang === 'en') initialStore.uiLanguage = savedLang;
    const savedActLang = localStorage.getItem('hm_active_language');
    if (savedActLang) initialStore.activeLanguage = savedActLang;
  } catch (e) { console.warn(e); }
  return { ...initialStore };
}

function saveStoreKeyPool(store: StoreState) {
  localStorage.setItem('hm_key_pool', JSON.stringify(store.keyPool));
  localStorage.setItem('hm_openrouter_key', store.openRouterKey);
  localStorage.setItem('hm_openrouter_model', store.openRouterModel);
  localStorage.setItem('hm_youtube_key', store.youtubeApiKey);
  localStorage.setItem('hm_openai_key', store.openAiKey);
  localStorage.setItem('hm_openai_model', store.openAiModel);
  localStorage.setItem('hm_api_enabled', JSON.stringify(store.apiEnabled));
  localStorage.setItem('hm_ui_language', store.uiLanguage);
  localStorage.setItem('hm_active_language', store.activeLanguage);
}

export default function App() {
  const [store, setStore] = useState<StoreState>(loadStore);
  const [showSettings, setShowSettings] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ytUrl, setYtUrl] = useState('');
  const [spyResults, setSpyResults] = useState<unknown>(null);
  const [spyMeta, setSpyMeta] = useState<{ title: string; author: string; thumb: string; viewCount?: string; fullData: boolean } | null>(null);
  const [scriptTopic, setScriptTopic] = useState('');
  const [duration, setDuration] = useState(1);
  const [, setLanguageSelect] = useState('vn_aspiration');
  const [styleRef, setStyleRef] = useState('');
  const [seoTopic, setSeoTopic] = useState('');
  const [marketTopic, setMarketTopic] = useState('');
  const [seoResults, setSeoResults] = useState<unknown>(null);
  const [marketResults, setMarketResults] = useState<unknown>(null);
  const [scriptLoading, setScriptLoading] = useState(false);
  const [spyLoading, setSpyLoading] = useState(false);
  const [seoLoading, setSeoLoading] = useState(false);
  const [marketLoading, setMarketLoading] = useState(false);
  const [copySuccess, setCopySuccess] = useState<string | null>(null);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);

  const keyCount = store.keyPool.filter(k => k && k.trim() !== '').length;

  const showError = useCallback((msg: string) => {
    setError(msg);
    setTimeout(() => setError(null), 5000);
  }, []);

  const handleRotateKey = useCallback(() => {
    const { key, nextIndex } = getNextKey(store.keyPool, store.currentKeyIndex);
    setStore(s => ({ ...s, currentKeyIndex: nextIndex }));
    return key;
  }, [store.keyPool, store.currentKeyIndex]);

  const updateKeyPool = (keys: string[]) => {
    setStore(s => { const ns = { ...s, keyPool: keys }; saveStoreKeyPool(ns); return ns; });
  };

  const updateApiEnabled = (enabled: typeof store.apiEnabled) => {
    setStore(s => { const ns = { ...s, apiEnabled: enabled }; saveStoreKeyPool(ns); return ns; });
  };

  const updateOpenRouter = (key: string, model: string) => {
    setStore(s => { const ns = { ...s, openRouterKey: key, openRouterModel: model }; saveStoreKeyPool(ns); return ns; });
  };

  const updateYoutubeKey = (key: string) => {
    setStore(s => { const ns = { ...s, youtubeApiKey: key }; saveStoreKeyPool(ns); return ns; });
  };

  const updateOpenAi = (key: string, model: string) => {
    setStore(s => { const ns = { ...s, openAiKey: key, openAiModel: model }; saveStoreKeyPool(ns); return ns; });
  };

  const switchTab = (tab: StoreState['activeTab']) => {
    setStore(s => ({ ...s, activeTab: tab }));
  };

  // Spy Analysis
  const handleSpy = async () => {
    if (!ytUrl) return showError('Nhập link YouTube!');
    setSpyLoading(true);
    setSpyResults(null);
    try {
      const meta = await fetchYoutubeMeta(ytUrl, store.youtubeApiKey);
      setSpyMeta(meta);
      let prompt = `URL: ${ytUrl}\nMETADATA: Title="${meta.title}", Channel="${meta.author}"`;
      if (meta.fullData) {
        prompt += `\nDESCRIPTION: ${meta.description}\nTAGS: ${meta.tags}\nSTATS: ${meta.viewCount} views.`;
        prompt += `\nNOTE: Use the Description and Tags to dive deeper into the content topic.`;
      }
      prompt += `\nANALYZE HISTORY & EDUCATIONAL CONTENT based on this metadata.`;
      const data = await callAI(prompt, SYSTEM_PROMPT_IQ180_HISTORY_ANALYST, store, handleRotateKey, showError);
      setSpyResults(data);
    } catch (e: unknown) {
      showError((e as Error).message);
    } finally {
      setSpyLoading(false);
    }
  };

  const handleUseStrategy = (title: string) => {
    setScriptTopic(title);
    setSeoTopic(title);
    setMarketTopic(title);
    switchTab('script');
  };

  // Script Generation
  const handleGenerateScript = async () => {
    if (!scriptTopic) return showError('Nhập chủ đề!');
    setScriptLoading(true);
    try {
      const requiredScenes = Math.ceil((Math.max(0.1, duration) * 60) / SECONDS_PER_SCENE);
      const styleObj = VISUAL_STYLES.find(s => s.id === store.visualStyle);
      const styleName = styleObj ? styleObj.name : "Auto";
      const styleRefText = styleRef || (styleObj ? styleObj.reference_prompt : "");

      const context = HISTORY_CONTEXTS[store.activeLanguage] || HISTORY_CONTEXTS['vn_aspiration'];
      const prompt = `TOPIC: "${scriptTopic}"
DURATION: ${duration}m
SCENE_COUNT: ${requiredScenes}
TARGET_LANGUAGE: ${context.voice_lang}
TARGET_MARKET: ${context.name}
VISUAL_STYLE: ${styleName}
THEME: HISTORY
CULTURE: ${context.culture}
CORE_DRIVER: ${context.core_driver}
WRITING_STYLE: ${context.writing_style}
HUMAN_ELEMENT: ${context.human_element}
STYLE_REFERENCE_FRAMEWORK: ${styleRefText}
GENERATE JSON OBJECT.`;

      const json = await callAI(prompt, SYSTEM_PROMPT_HISTORICAL_SCRIPTWRITER, store, handleRotateKey, showError);
      let segments: typeof store.scriptSegments = (json as { script?: typeof store.scriptSegments }).script || [];

      if (styleObj && styleObj.id !== 'auto' && styleRefText) {
        segments = segments.map(seg => {
          const cleanedVideo = cleanNoise((seg as { video_prompt?: string }).video_prompt || '');
          const cleanedImage = cleanNoise((seg as { image_prompt?: string }).image_prompt || '');
          return {
            ...seg,
            video_prompt: `${styleRefText}, ${cleanedVideo}`.replace(/, ,/g, ',').trim(),
            image_prompt: `${styleRefText}, ${cleanedImage}`.replace(/, ,/g, ',').trim()
          } as typeof store.scriptSegments[number];
        });
      }

      setStore(s => ({ ...s, scriptSegments: segments, detectedStyle: (json as { suggested_style?: string }).suggested_style || '', activeLanguage: store.activeLanguage }));
      switchTab('studio');
    } catch (e: unknown) {
      showError((e as Error).message);
    } finally {
      setScriptLoading(false);
    }
  };

  // SEO Generation
  const handleGenerateSEO = async () => {
    if (!seoTopic) return showError('Nhập chủ đề SEO!');
    setSeoLoading(true);
    try {
      const context = HISTORY_CONTEXTS[store.activeLanguage] || HISTORY_CONTEXTS['vn_aspiration'];
      const prompt = `TOPIC: "${seoTopic}"
TARGET_LANGUAGE: ${context.voice_lang}
TARGET_MARKET: ${context.name}
THEME: HISTORY
GENERATE JSON.`;
      const data = await callAI(prompt, SYSTEM_PROMPT_SEO_MASTER, store, handleRotateKey, showError);
      setSeoResults(data);
    } catch (e: unknown) {
      showError((e as Error).message);
    } finally {
      setSeoLoading(false);
    }
  };

  // Market Generation
  const handleAnalyzeMarket = async () => {
    if (!marketTopic) return showError('Nhập chủ đề Market!');
    setMarketLoading(true);
    try {
      const prompt = `TOPIC: "${marketTopic}"\nGENERATE JSON.`;
      const data = await callAI(prompt, SYSTEM_PROMPT_MARKET_ANALYST, store, handleRotateKey, showError);
      setMarketResults(data);
    } catch (e: unknown) {
      showError((e as Error).message);
    } finally {
      setMarketLoading(false);
    }
  };

  const handleCopy = (text: string, label?: string) => {
    copyToClipboard(text);
    setCopySuccess(label || 'Copied!');
    setTimeout(() => setCopySuccess(null), 2000);
  };

  // Export functions
  const exportScriptCSV = () => {
    if (store.scriptSegments.length === 0) return;
    let csv = "﻿Scene,Time,Section,Character,Voice,Video Prompt,Image Prompt\n";
    store.scriptSegments.forEach((s, i) => {
      const vp = (s.video_prompt || "").replace(/"/g, '""');
      const ip = (s.image_prompt || "").replace(/"/g, '""');
      const v = (s.chapter_voice_block || s.voice_text || "").replace(/"/g, '""');
      csv += `${i + 1},"${s.time}","${s.section}","${s.character}","${v}","${vp}","${ip}"\n`;
    });
    downloadFile(csv, `kich_ban_full_${Date.now()}.csv`, 'text/csv;charset=utf-8;');
    setShowExportMenu(false);
  };

  const exportPromptsCSV = (type: 'video' | 'image') => {
    if (store.scriptSegments.length === 0) return;
    let csv = `﻿Scene,${type === 'video' ? 'Video' : 'Image'} Prompt\n`;
    store.scriptSegments.forEach((s, i) => {
      const prompt = (type === 'video' ? s.video_prompt : s.image_prompt || "").replace(/"/g, '""');
      csv += `${i + 1},"${prompt}"\n`;
    });
    downloadFile(csv, `prompts_${type}_${Date.now()}.csv`, 'text/csv;charset=utf-8;');
    setShowExportMenu(false);
  };

  const exportPromptsTXT = (type: 'video' | 'image') => {
    if (store.scriptSegments.length === 0) return;
    let content = "";
    store.scriptSegments.forEach((s) => {
      const prompt = (type === 'video' ? s.video_prompt : s.image_prompt) || "";
      if (prompt) content += prompt + "\n\n";
    });
    downloadFile(content, `prompts_${type}_${Date.now()}.txt`, 'text/plain;charset=utf-8;');
    setShowExportMenu(false);
  };

  // Close export menu on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (exportRef.current && !exportRef.current.contains(e.target as Node)) {
        setShowExportMenu(false);
      }
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);


  const tabs = [
    { id: 'spy', icon: 'fa-fire-alt', label: 'ANALYZE', desc: 'Phân Tích Lịch Sử Viral' },
    { id: 'script', icon: 'fa-scroll', label: 'SCRIPT', desc: 'Kịch Bản Lịch Sử Sáng Tạo' },
    { id: 'studio', icon: 'fa-clapperboard', label: 'STUDIO', desc: 'Prompt Video & Ảnh' },
    { id: 'seo', icon: 'fa-chart-line', label: 'SEO', desc: 'Phân Phối Đa Nền Tảng' },
    { id: 'market', icon: 'fa-graduation-cap', label: 'MARKET', desc: 'Chiến Lược Giáo Dục' },
  ] as const;

  const styleObj = VISUAL_STYLES.find(s => s.id === store.visualStyle);
  const scenes = Math.ceil((Math.max(0.1, duration) * 60) / SECONDS_PER_SCENE);
  const words = Math.floor(duration * (duration < 3 ? 130 : duration <= 10 ? 140 : 120));
  const modeName = duration < 3 ? '🟢 DAILY WISDOM (<3m)' : duration <= 10 ? '🔵 CONCEPT EXPLAINER (3-10m)' : '🟣 DEEP DIVE (>10m)';

  return (
    <div className="min-h-screen flex flex-col" style={{ fontFamily: "'Inter', sans-serif" }}>
      <Header
        keyCount={keyCount}
        uiLanguage={store.uiLanguage}
        onToggleLang={() => {
          const lang: 'vi' | 'en' = store.uiLanguage === 'vi' ? 'en' : 'vi';
          setStore(s => { const ns = { ...s, uiLanguage: lang }; saveStoreKeyPool(ns); return ns; });
        }}
        onOpenSettings={() => setShowSettings(true)}
      />

      <ErrorToast error={error} onClose={() => setError(null)} />

      {copySuccess && (
        <div
          className="fixed top-20 left-1/2 -translate-x-1/2 z-[70] animate-fade-in"
          style={{
            background: 'rgba(10, 14, 23, 0.95)',
            border: '1px solid rgba(212, 175, 55, 0.35)',
            color: '#D4AF37',
            padding: '8px 20px',
            borderRadius: '12px',
            fontSize: '12px',
            fontWeight: 700,
            boxShadow: '0 0 20px rgba(212, 175, 55, 0.2)',
            fontFamily: "'Cinzel', serif",
            letterSpacing: '0.08em',
          }}
        >
          <i className="fa-solid fa-check mr-2" /> {copySuccess}
        </div>
      )}

      <main className="flex-1 max-w-[1800px] mx-auto w-full p-6 flex flex-col md:flex-row gap-6 md:h-[calc(100vh-70px)] h-auto">
        {/* Narrow Icon-Only Sidebar */}
        <div className="w-16 shrink-0 flex flex-col gap-2 items-center pt-2">
          {tabs.map(tab => (
            <div key={tab.id} className="tooltip-container w-full">
              <button
                onClick={() => switchTab(tab.id)}
                className="w-full p-3 rounded-xl border transition-all duration-300 flex flex-col items-center gap-1"
                style={{
                  background: store.activeTab === tab.id ? 'rgba(212,175,55,0.1)' : 'transparent',
                  borderColor: store.activeTab === tab.id ? 'rgba(212,175,55,0.35)' : 'rgba(212,175,55,0.06)',
                  boxShadow: store.activeTab === tab.id ? '0 0 15px rgba(212,175,55,0.1)' : 'none',
                  color: store.activeTab === tab.id ? '#D4AF37' : 'rgba(232,224,208,0.35)',
                }}
              >
                <i
                  className={`fa-solid ${tab.icon}`}
                  style={{
                    fontSize: '18px',
                    filter: store.activeTab === tab.id ? 'drop-shadow(0 0 6px rgba(212,175,55,0.5))' : 'none',
                    transition: 'all 0.3s ease',
                  }}
                />
                <span
                  style={{
                    fontSize: '7px',
                    fontFamily: "'Cinzel', serif",
                    fontWeight: 600,
                    letterSpacing: '0.08em',
                    writingMode: 'horizontal-tb',
                    textAlign: 'center',
                    lineHeight: 1.2,
                    color: store.activeTab === tab.id ? '#D4AF37' : 'rgba(232,224,208,0.35)',
                  }}
                >
                  {tab.label}
                </span>
              </button>
              <div className="tooltip-text">
                <div style={{ fontWeight: 700, marginBottom: '2px', color: '#D4AF37' }}>{tab.label}</div>
                <div style={{ fontWeight: 400, opacity: 0.7, fontSize: '10px' }}>{tab.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 content-area p-6 md:overflow-y-auto relative min-h-[500px]">
          {/* SPY TAB */}
          {store.activeTab === 'spy' && (
            <div className="max-w-5xl mx-auto space-y-6 animate-slide-in-bottom relative z-10">
              <div className="glass-card p-6">
                <h2 className="text-xl font-bold mb-5 flex items-center gap-3" style={{ fontFamily: "'Cinzel', serif", color: '#E8E0D0' }}>
                  <i className="fa-brands fa-youtube" style={{ color: '#CD7F32' }}></i>
                  Phân Tích Viral Historical Content
                </h2>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <input
                      value={ytUrl}
                      onChange={e => setYtUrl(e.target.value)}
                      placeholder="Dán link Video Lịch Sử / Documentary / Historical Drama..."
                      className="flex-1 glass-input p-3 text-sm"
                    />
                    <button
                      onClick={() => { setYtUrl(''); setSpyResults(null); setSpyMeta(null); }}
                      className="p-3 rounded-xl transition-all"
                      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(212,175,55,0.1)', color: 'rgba(232,224,208,0.4)' }}
                    >
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  </div>
                  <button
                    onClick={handleSpy}
                    disabled={spyLoading}
                    className="w-full py-4 btn-gold flex items-center justify-center gap-2 text-base"
                    style={{ fontFamily: "'Cinzel', serif" }}
                  >
                    {spyLoading ? <><i className="fa-solid fa-sync fa-spin"></i> ĐANG QUÉT...</> : <><i className="fa-solid fa-brain" style={{ fontSize: '18px' }}></i> PHÂN TÍCH CHIỀU SÂU LỊCH SỬ</>}
                  </button>
                </div>
              </div>
              <SpyTab
                results={spyResults}
                meta={spyMeta}
                onUseStrategy={handleUseStrategy}
                getTierColor={getTierColor}
                getImpactColor={getImpactColor}
              />
            </div>
          )}

          {/* SCRIPT TAB */}
          {store.activeTab === 'script' && (
            <div className="max-w-5xl mx-auto space-y-6 animate-slide-in-right relative z-10">
              <div className="glass-card p-6">
                <h2 className="text-xl font-bold mb-5 flex items-center gap-3" style={{ fontFamily: "'Cinzel', serif", color: '#E8E0D0' }}>
                  <i className="fa-solid fa-pen-fancy" style={{ color: '#D4AF37' }}></i>
                  Quy Trình Sáng Tạo Kịch Bản Lịch Sử
                </h2>
                <div className="space-y-5">
                  <div>
                    <div className="text-[10px] font-bold mb-2 uppercase tracking-widest" style={{ color: '#A8862A', fontFamily: "'Cinzel', serif" }}>CHỦ ĐỀ LỊCH SỬ</div>
                    <input
                      value={scriptTopic}
                      onChange={e => setScriptTopic(e.target.value)}
                      className="w-full glass-input p-3 text-sm"
                      placeholder="VD: Chiến tranh Việt Nam, Đế chế La Mã, Cách mạng Công nghiệp..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="glass-card p-4" style={{ background: 'rgba(212,175,55,0.03)', position: 'relative', overflow: 'hidden' }}>
                      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '3px', background: 'linear-gradient(180deg, #D4AF37, #CD7F32)' }} />
                      <label className="text-xs font-bold uppercase mb-3 flex items-center gap-2" style={{ color: 'rgba(232,224,208,0.6)', fontFamily: "'Cinzel', serif" }}>
                        <i className="fa-solid fa-clock" style={{ color: '#D4AF37' }}></i> THỜI LƯỢNG (PHÚT)
                      </label>
                      <div className="flex items-center gap-5">
                        <input
                          type="number"
                          value={duration}
                          onChange={e => setDuration(parseFloat(e.target.value) || 1)}
                          step={0.5}
                          min={0.5}
                          max={240}
                          className="w-20 glass-input p-3 text-2xl font-black text-center"
                          style={{ fontFamily: "'Cinzel', serif", color: '#D4AF37' }}
                        />
                        <div className="flex flex-col gap-1.5 text-xs">
                          <div className="flex items-center gap-2"><span style={{ color: 'rgba(232,224,208,0.4)' }}>Số cảnh:</span><span style={{ color: '#D4AF37', fontWeight: 700, fontFamily: "'Cinzel', serif" }}>~{scenes} Cảnh</span></div>
                          <div className="flex items-center gap-2"><span style={{ color: 'rgba(232,224,208,0.4)' }}>Voice:</span><span style={{ color: '#CD7F32', fontWeight: 700, fontFamily: "'Cinzel', serif" }}>~{words} từ</span></div>
                        </div>
                      </div>
                    </div>

                    <div className="glass-card p-4">
                      <label className="text-xs font-bold uppercase mb-2 flex items-center gap-2" style={{ color: 'rgba(232,224,208,0.6)', fontFamily: "'Cinzel', serif" }}>
                        <i className="fa-solid fa-globe" style={{ color: '#CD7F32' }}></i> THỊ TRƯỜNG MỤC TIÊU
                      </label>
                      <select
                        value={store.activeLanguage}
                        onChange={e => {
                          setLanguageSelect(e.target.value);
                          setStore(s => { const ns = { ...s, activeLanguage: e.target.value }; saveStoreKeyPool(ns); return ns; });
                        }}
                        className="w-full glass-select p-3 text-sm mt-2"
                      >
                        {countryList.map(c => (
                          <option key={c.id} value={c.id}>{c.flag} {c.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div
                    className="rounded-xl p-4 flex items-center gap-4"
                    style={{
                      background: duration < 3 ? 'rgba(34,197,94,0.05)' : duration <= 10 ? 'rgba(59,130,246,0.05)' : 'rgba(168,85,247,0.05)',
                      border: `1px solid ${duration < 3 ? 'rgba(34,197,94,0.2)' : duration <= 10 ? 'rgba(59,130,246,0.2)' : 'rgba(168,85,247,0.2)'}`,
                    }}
                  >
                    <span style={{ fontFamily: "'Cinzel', serif", fontWeight: 700, fontSize: '12px' }}>
                      <span style={{ color: duration < 3 ? '#4ADE80' : duration <= 10 ? '#60A5FA' : '#C084FC' }}>{modeName}</span>
                    </span>
                  </div>

                  <div className="glass-card p-4">
                    <label className="text-xs font-bold uppercase mb-2 flex items-center gap-2" style={{ color: 'rgba(232,224,208,0.6)', fontFamily: "'Cinzel', serif" }}>
                      <i className="fa-solid fa-palette" style={{ color: '#B87333' }}></i> PHONG CÁCH VISUAL
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-3">
                      {VISUAL_STYLES.map(style => (
                        <button
                          key={style.id}
                          onClick={() => {
                            setStore(s => ({ ...s, visualStyle: style.id }));
                            setStyleRef(style.reference_prompt);
                          }}
                          className="p-3 rounded-xl text-left transition-all"
                          style={{
                            background: store.visualStyle === style.id ? 'rgba(212,175,55,0.1)' : 'rgba(255,255,255,0.02)',
                            border: `1px solid ${store.visualStyle === style.id ? 'rgba(212,175,55,0.35)' : 'rgba(212,175,55,0.06)'}`,
                            boxShadow: store.visualStyle === style.id ? '0 0 15px rgba(212,175,55,0.1)' : 'none',
                          }}
                        >
                          <div className="text-xs font-bold" style={{ color: store.visualStyle === style.id ? '#D4AF37' : '#E8E0D0', fontFamily: "'Cinzel', serif" }}>{style.name}</div>
                          <div className="text-[9px] mt-1 line-clamp-2" style={{ color: 'rgba(232,224,208,0.35)' }}>{style.desc}</div>
                        </button>
                      ))}
                    </div>

                    {store.visualStyle !== 'auto' && styleObj && styleObj.reference_prompt && (
                      <div className="mt-4 p-4 rounded-xl animate-fade-in"
                        style={{ background: 'rgba(212,175,55,0.05)', border: '2px solid rgba(212,175,55,0.2)', boxShadow: '0 0 20px rgba(212,175,55,0.08)' }}>
                        <div className="flex justify-between items-center mb-2">
                          <div className="text-[11px] font-black uppercase flex items-center gap-2 tracking-widest" style={{ color: '#D4AF37', fontFamily: "'Cinzel', serif" }}>
                            <i className="fa-solid fa-signature"></i> MASTER STYLE TEMPLATE
                          </div>
                          <div className="text-[9px] px-2 py-0.5 rounded-full font-bold animate-pulse" style={{ background: 'rgba(212,175,55,0.15)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.3)' }}>100% STANDARD</div>
                        </div>
                        <textarea
                          value={styleRef}
                          onChange={e => setStyleRef(e.target.value)}
                          className="w-full glass-input p-3 text-[12px] leading-relaxed outline-none min-h-[80px] resize-none"
                          style={{ fontFamily: "'Inter', sans-serif", color: '#E8E0D0', fontStyle: 'italic' }}
                          placeholder="Describe the master style logic..."
                        />
                        <div className="mt-2 text-[10px] flex items-center gap-2 italic font-bold" style={{ color: 'rgba(232,224,208,0.6)' }}>
                          <i className="fa-solid fa-shield-halved" style={{ color: '#D4AF37' }}></i>
                          Hệ thống sẽ ÉP BUỘC dùng Prompt này làm nền tảng.
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={handleGenerateScript}
                    disabled={scriptLoading}
                    className="w-full py-4 btn-gold text-base flex items-center justify-center gap-3"
                    style={{ fontFamily: "'Cinzel', serif" }}
                  >
                    {scriptLoading ? <><i className="fa-solid fa-sync fa-spin"></i> ĐANG VIẾT...</> : <><i className="fa-solid fa-scroll" style={{ fontSize: '18px' }}></i> TẠO KỊCH BẢN LỊCH SỬ ĐA VĂN HÓA</>}
                  </button>
                </div>
              </div>

              {/* Script Results */}
              {store.scriptSegments.length > 0 && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center px-2">
                    <div className="text-xs text-slate-500 font-bold">Đã tạo: {store.scriptSegments.length} phân đoạn</div>
                    <button
                      onClick={() => handleCopy(store.scriptSegments.map(s => s.chapter_voice_block || s.voice_text).join("\n\n"), 'Copied voice!')}
                      className="btn-gold-outline text-xs px-4 py-2 flex items-center gap-2"
                      style={{ fontFamily: "'Cinzel', serif" }}
                    >
                      <i className="fa-solid fa-copy"></i> Copy Voice Toàn Bộ
                    </button>
                  </div>
                  {store.scriptSegments.map((seg, idx) => (
                    <div
                      key={idx}
                      className="glass-card p-4 flex flex-col sm:flex-row gap-4 items-start relative"
                      style={{
                        background: seg.chapter_voice_block ? 'rgba(212,175,55,0.04)' : 'rgba(255,255,255,0.02)',
                        borderColor: seg.chapter_voice_block ? 'rgba(212,175,55,0.25)' : 'rgba(212,175,55,0.08)',
                      }}
                    >
                      {seg.chapter_voice_block && (
                        <div
                          className="absolute -top-3 left-4 px-3 py-1 rounded-full z-10"
                          style={{
                            background: 'linear-gradient(135deg, #D4AF37, #CD7F32)',
                            color: '#0A0E17',
                            fontSize: '10px',
                            fontWeight: 800,
                            fontFamily: "'Cinzel', serif",
                            boxShadow: '0 0 10px rgba(212,175,55,0.3)',
                          }}
                        >
                          <i className="fa-solid fa-book-open"></i> CHAPTER START
                        </div>
                      )}
                      <div className="w-full sm:w-24 shrink-0 text-center pt-1">
                        <div
                          className="px-2 py-1 rounded mb-1"
                          style={{
                            background: 'rgba(212,175,55,0.1)',
                            border: '1px solid rgba(212,175,55,0.2)',
                            color: '#D4AF37',
                            fontSize: '10px',
                            fontFamily: "'Cinzel', serif",
                          }}
                        >
                          SCENE {seg.scene_number || idx + 1}
                        </div>
                        <div style={{ fontSize: '9px', color: 'rgba(232,224,208,0.35)', fontFamily: 'monospace' }}>{seg.time}</div>
                        <div style={{ fontSize: '9px', color: '#CD7F32', fontWeight: 700, fontFamily: "'Cinzel', serif", textTransform: 'uppercase' }} className="break-words mt-0.5">{seg.section}</div>
                      </div>
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(212,175,55,0.06)' }}>
                          <div className="flex justify-between items-center mb-1">
                            <div className="text-[10px] font-bold flex items-center gap-1" style={{ color: '#B87333', fontFamily: "'Cinzel', serif" }}>
                              <i className="fa-solid fa-eye"></i> VISUAL & METAPHOR
                            </div>
                            <div style={{ fontSize: '9px', color: 'rgba(232,224,208,0.3)' }}>
                              NV: <span style={{ color: '#E8E0D0' }}>{seg.character || 'N/A'}</span>
                            </div>
                          </div>
                          <p className="text-xs" style={{ color: 'rgba(232,224,208,0.8)' }}>{seg.visual_desc_vi || ''}</p>
                          {seg.strategy_note && (
                            <div className="mt-2 p-2 rounded" style={{ background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.15)', fontSize: '10px', color: 'rgba(232,224,208,0.7)', fontStyle: 'italic' }}>
                              <i className="fa-solid fa-lightbulb" style={{ color: '#D4AF37', marginRight: '4px' }}></i>
                              <strong>Lưu ý:</strong> {seg.strategy_note}
                            </div>
                          )}
                        </div>
                        <div className="p-3 rounded-xl flex flex-col relative" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(212,175,55,0.06)' }}>
                          <div className="flex justify-between items-center mb-1">
                            <div className="text-[10px] font-bold flex items-center gap-1" style={{ color: '#D4AF37', fontFamily: "'Cinzel', serif" }}>
                              <i className="fa-solid fa-microphone-alt"></i> VOICE
                            </div>
                            <button onClick={() => handleCopy(seg.chapter_voice_block || seg.voice_text || '')} style={{ color: 'rgba(232,224,208,0.3)', background: 'none', border: 'none', cursor: 'pointer' }}>
                              <i className="fa-regular fa-copy"></i>
                            </button>
                          </div>
                          <p className="text-sm italic leading-relaxed text-justify" style={{ color: '#E8E0D0', opacity: seg.voice_text ? 1 : 0.5 }}>
                            "{seg.chapter_voice_block || seg.voice_text || '(Đọc tiếp...)'}"
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* STUDIO TAB */}
          {store.activeTab === 'studio' && (
            <StudioTab
              store={store}
              onModeChange={(mode) => setStore(s => ({ ...s, productionMode: mode }))}
              onCopy={handleCopy}
              showExportMenu={showExportMenu}
              setShowExportMenu={setShowExportMenu}
              exportRef={exportRef}
              onExportScriptCSV={exportScriptCSV}
              onExportPromptsCSV={exportPromptsCSV}
              onExportPromptsTXT={exportPromptsTXT}
            />
          )}

          {/* SEO TAB */}
          {store.activeTab === 'seo' && (
            <SeoTab
              seoTopic={seoTopic}
              setSeoTopic={setSeoTopic}
              results={seoResults}
              loading={seoLoading}
              onGenerate={handleGenerateSEO}
              onCopy={handleCopy}
              checklistState={store.checklistState}
              onToggleChecklist={(id) => setStore(s => ({ ...s, checklistState: { ...s.checklistState, [id]: !s.checklistState[id] } }))}
            />
          )}

          {/* MARKET TAB */}
          {store.activeTab === 'market' && (
            <MarketTab
              marketTopic={marketTopic}
              setMarketTopic={setMarketTopic}
              results={marketResults}
              loading={marketLoading}
              onAnalyze={handleAnalyzeMarket}
            />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer
        className="relative mt-8 py-6"
        style={{ borderTop: '1px solid rgba(212,175,55,0.08)', background: 'rgba(10,14,23,0.5)' }}
      >
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div style={{ color: 'rgba(232,224,208,0.2)', fontSize: '11px', fontFamily: "'Cinzel', serif" }}>
            Copyright &copy; {new Date().getFullYear()}{' '}
            <span style={{ color: '#A8862A', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              NDGROUP MEDIA VIỆT NAM
            </span>
            . All rights reserved.
          </div>
        </div>
      </footer>

      {/* Settings Modal */}
      {showSettings && (
        <SettingsModal
          store={store}
          onClose={() => setShowSettings(false)}
          onUpdateKeyPool={updateKeyPool}
          onUpdateApiEnabled={updateApiEnabled}
          onUpdateOpenRouter={updateOpenRouter}
          onUpdateYoutubeKey={updateYoutubeKey}
          onUpdateOpenAi={updateOpenAi}
        />
      )}
    </div>
  );
}
