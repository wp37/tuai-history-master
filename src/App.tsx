import { useState, useEffect, useRef, useCallback } from 'react';
import type { StoreState, ScriptSegment } from './data/types';
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
      const prompt = `TOPIC: "${scriptTopic}"\nDURATION: ${duration}m\nSCENE_COUNT: ${requiredScenes}\nTARGET_LANGUAGE: ${context.voice_lang}\nTARGET_MARKET: ${context.name}\nVISUAL_STYLE: ${styleName}\nTHEME: HISTORY\nCULTURE: ${context.culture}\nCORE_DRIVER: ${context.core_driver}\nWRITING_STYLE: ${context.writing_style}\nHUMAN_ELEMENT: ${context.human_element}\nSTYLE_REFERENCE_FRAMEWORK: ${styleRefText}\nGENERATE JSON OBJECT.`;
      const json = await callAI(prompt, SYSTEM_PROMPT_HISTORICAL_SCRIPTWRITER, store, handleRotateKey, showError);
      let segments: ScriptSegment[] = (json as { script?: ScriptSegment[] }).script || [];
      if (styleObj && styleObj.id !== 'auto' && styleRefText) {
        const cleaned: ScriptSegment[] = segments.map((seg: ScriptSegment) => ({
          ...seg,
          video_prompt: `${styleRefText}, ${cleanNoise(seg.video_prompt || '')}`.replace(/, ,/g, ',').trim(),
          image_prompt: `${styleRefText}, ${cleanNoise(seg.image_prompt || '')}`.replace(/, ,/g, ',').trim(),
        }));
        segments = cleaned;
      }
      setStore(s => ({ ...s, scriptSegments: segments, detectedStyle: (json as { suggested_style?: string }).suggested_style || '' }));
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
      const prompt = `TOPIC: "${seoTopic}"\nTARGET_LANGUAGE: ${context.voice_lang}\nTARGET_MARKET: ${context.name}\nTHEME: HISTORY\nGENERATE JSON.`;
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
    let csv = "﻿Scene,${type === 'video' ? 'Video' : 'Image'} Prompt\n";
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
    { id: 'spy', icon: 'fa-fire-alt', label: 'ANALYZE', desc: 'Phân Tích Video Viral' },
    { id: 'script', icon: 'fa-scroll', label: 'SCRIPT', desc: 'Tạo Kịch Bản Lịch Sử' },
    { id: 'studio', icon: 'fa-clapperboard', label: 'STUDIO', desc: 'Video & Image Prompts' },
    { id: 'seo', icon: 'fa-chart-line', label: 'SEO', desc: 'Tối Ưu Đa Nền Tảng' },
    { id: 'market', icon: 'fa-graduation-cap', label: 'MARKET', desc: 'Chiến Lược Giáo Dục' },
  ] as const;

  const styleObj = VISUAL_STYLES.find(s => s.id === store.visualStyle);
  const scenes = Math.ceil((Math.max(0.1, duration) * 60) / SECONDS_PER_SCENE);
  const words = Math.floor(duration * (duration < 3 ? 130 : duration <= 10 ? 140 : 120));
  const modeName = duration < 3 ? 'DAILY WISDOM' : duration <= 10 ? 'CONCEPT EXPLAINER' : 'DEEP DIVE';
  const modeColor = duration < 3 ? '#4ADE80' : duration <= 10 ? '#60A5FA' : '#C084FC';
  const modeBg = duration < 3 ? 'rgba(34,197,94,0.06)' : duration <= 10 ? 'rgba(59,130,246,0.06)' : 'rgba(168,85,247,0.06)';

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
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[70] animate-fade-in flex items-center gap-3 px-6 py-3 rounded-2xl"
          style={{ background: 'rgba(11,15,26,0.95)', border: '1px solid rgba(212,175,55,0.35)', color: '#D4AF37', fontSize: '13px', fontWeight: 700, fontFamily: "'Cinzel', serif", letterSpacing: '0.08em', boxShadow: '0 0 30px rgba(212,175,55,0.2)' }}>
          <i className="fa-solid fa-check-circle" />
          {copySuccess}
        </div>
      )}

      {/* MAIN LAYOUT */}
      <div className="flex flex-1 overflow-hidden" style={{ height: 'calc(100vh - 72px)' }}>
        {/* ====== SIDEBAR ====== */}
        <aside className="w-[280px] shrink-0 flex flex-col py-5 px-4 gap-2 overflow-y-auto"
          style={{ background: 'rgba(11,15,26,0.95)', borderRight: '1px solid rgba(212,175,55,0.07)' }}>
          {/* Brand in sidebar */}
          <div className="px-3 pb-4 mb-2" style={{ borderBottom: '1px solid rgba(212,175,55,0.08)' }}>
            <div className="text-[10px] uppercase tracking-widest font-bold" style={{ color: 'rgba(212,175,55,0.4)', fontFamily: "'Cinzel', serif", letterSpacing: '0.15em' }}>
              AI Storytelling Suite
            </div>
          </div>

          {tabs.map(tab => {
            const active = store.activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => switchTab(tab.id)}
                className={`nav-item group w-full flex items-center gap-4 px-4 py-4 text-left ${active ? 'active' : ''}`}
              >
                {/* Gold left bar */}
                {active && (
                  <div className="absolute left-0 top-3 bottom-3 w-[3px] rounded-r-full"
                    style={{ background: 'linear-gradient(180deg, #D4AF37, #CD7F32)' }} />
                )}
                {/* Icon */}
                <div className="relative shrink-0">
                  <i className={`fa-solid ${tab.icon}`} style={{
                    fontSize: '20px',
                    color: active ? '#D4AF37' : 'rgba(232,224,208,0.35)',
                    filter: active ? 'drop-shadow(0 0 6px rgba(212,175,55,0.5))' : 'none',
                    transition: 'all 0.3s ease',
                  }} />
                </div>
                {/* Text */}
                <div className="flex-1 min-w-0">
                  <div style={{
                    fontFamily: "'Cinzel', serif",
                    fontWeight: 700,
                    fontSize: '13px',
                    letterSpacing: '0.06em',
                    color: active ? '#D4AF37' : 'rgba(232,224,208,0.5)',
                    transition: 'color 0.3s ease',
                  }}>
                    {tab.label}
                  </div>
                  <div style={{
                    fontSize: '10px',
                    color: active ? 'rgba(212,175,55,0.5)' : 'rgba(232,224,208,0.25)',
                    marginTop: '2px',
                    transition: 'color 0.3s ease',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}>
                    {tab.desc}
                  </div>
                </div>
                {/* Active dot */}
                {active && (
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ background: '#D4AF37', boxShadow: '0 0 8px rgba(212,175,55,0.5)' }} />
                )}
              </button>
            );
          })}

          {/* Bottom info */}
          <div className="mt-auto pt-4" style={{ borderTop: '1px solid rgba(212,175,55,0.06)' }}>
            <div className="px-3 py-3 rounded-xl text-center" style={{ background: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.08)' }}>
              <div style={{ fontSize: '10px', color: 'rgba(212,175,55,0.4)', fontFamily: "'Cinzel', serif", letterSpacing: '0.1em' }}>
                TUAI HISTORY MASTER
              </div>
              <div style={{ fontSize: '9px', color: 'rgba(232,224,208,0.2)', marginTop: '2px' }}>
                AI Multicultural Suite
              </div>
            </div>
          </div>
        </aside>

        {/* ====== CONTENT AREA ====== */}
        <main className="flex-1 content-area m-4 overflow-y-auto relative z-10">
          {/* SPY TAB */}
          {store.activeTab === 'spy' && (
            <div className="p-8 animate-slide-in-right">
              {/* Hero Section */}
              <div className="text-center mb-10">
                <h2 className="text-[32px] font-bold mb-4" style={{ fontFamily: "'Cinzel', serif", color: '#E8E0D0', lineHeight: 1.2 }}>
                  Phân Tích Video Lịch Sử <span className="animate-shimmer">Viral</span>
                </h2>
                <p className="text-base" style={{ color: 'rgba(232,224,208,0.45)', maxWidth: '560px', margin: '0 auto' }}>
                  Dán link YouTube để AI phân tích chiến lược viral, thu nhập và engagement
                </p>
              </div>

              {/* Input Row */}
              <div className="max-w-3xl mx-auto mb-8 flex gap-3 items-center">
                <input
                  value={ytUrl}
                  onChange={e => setYtUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="flex-1 glass-input px-6 text-[15px]"
                  style={{ height: '56px' }}
                  onKeyDown={e => e.key === 'Enter' && handleSpy()}
                />
                <button onClick={() => { setYtUrl(''); setSpyResults(null); setSpyMeta(null); }}
                  className="shrink-0 p-4 rounded-xl transition-all"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(212,175,55,0.1)', color: 'rgba(232,224,208,0.35)' }}>
                  <i className="fa-solid fa-trash" />
                </button>
                <button onClick={handleSpy} disabled={spyLoading}
                  className="btn-gold px-8 flex items-center gap-3 text-sm shrink-0"
                  style={{ height: '56px', fontSize: '14px' }}>
                  {spyLoading ? (
                    <><i className="fa-solid fa-sync fa-spin" /> ĐANG PHÂN TÍCH...</>
                  ) : (
                    <><i className="fa-solid fa-fire-alt" /> PHÂN TÍCH NGAY</>
                  )}
                </button>
              </div>

              {/* Feature Grid */}
              <div className="result-grid-3 max-w-3xl mx-auto">
                {[
                  { icon: 'fa-chart-bar', label: 'Viral Score', desc: 'Dự đoán điểm viral' },
                  { icon: 'fa-brain', label: 'AI Insight', desc: 'Phân tích tâm lý khán giả' },
                  { icon: 'fa-lightbulb', label: 'Chiến Lược', desc: 'Đề xuất cải thiện nội dung' },
                ].map((f, i) => (
                  <div key={i} className="stat-card text-center">
                    <i className={`fa-solid ${f.icon}`} style={{ fontSize: '24px', color: '#D4AF37', marginBottom: '12px' }} />
                    <div style={{ fontFamily: "'Cinzel', serif", fontWeight: 700, fontSize: '14px', color: '#E8E0D0', marginBottom: '4px' }}>{f.label}</div>
                    <div style={{ fontSize: '11px', color: 'rgba(232,224,208,0.4)' }}>{f.desc}</div>
                  </div>
                ))}
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
            <div className="p-8 animate-slide-in-right">
              <div className="text-center mb-8">
                <h2 className="text-[32px] font-bold mb-4" style={{ fontFamily: "'Cinzel', serif", color: '#E8E0D0', lineHeight: 1.2 }}>
                  Tạo Kịch Bản <span className="animate-shimmer">Lịch Sử Đa Văn Hóa</span>
                </h2>
                <p className="text-base" style={{ color: 'rgba(232,224,208,0.45)' }}>
                  Kịch bản chuyên nghiệp với voice + visual prompts theo phong cách riêng
                </p>
              </div>

              {/* Topic input */}
              <div className="max-w-3xl mx-auto mb-6">
                <div className="section-label mb-3 flex items-center gap-2">
                  <i className="fa-solid fa-scroll" style={{ color: '#D4AF37' }} />
                  Chủ Đề Lịch Sử
                </div>
                <input
                  value={scriptTopic}
                  onChange={e => setScriptTopic(e.target.value)}
                  className="w-full glass-input px-6 text-[15px]"
                  style={{ height: '56px' }}
                  placeholder="VD: Chiến tranh Việt Nam, Đế chế La Mã, Cách mạng Công nghiệp..."
                />
              </div>

              {/* Settings Row */}
              <div className="result-grid-2 max-w-3xl mx-auto mb-6">
                {/* Duration */}
                <div className="glass-card p-6" style={{ background: modeBg, borderColor: `${modeColor}22` }}>
                  <div className="section-label mb-4 flex items-center gap-2">
                    <i className="fa-solid fa-clock" style={{ color: modeColor }} />
                    Thời Lượng & Chế Độ
                  </div>
                  <div className="flex items-center gap-6">
                    <input type="number" value={duration} onChange={e => setDuration(parseFloat(e.target.value) || 1)}
                      step={0.5} min={0.5} max={240}
                      className="glass-input w-24 p-3 text-center text-3xl font-black"
                      style={{ fontFamily: "'Cinzel', serif", color: '#D4AF37' }} />
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-3">
                        <span style={{ fontSize: '12px', color: 'rgba(232,224,208,0.4)' }}>Số cảnh:</span>
                        <span style={{ fontFamily: "'Cinzel', serif", fontWeight: 700, fontSize: '14px', color: '#D4AF37' }}>~{scenes}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span style={{ fontSize: '12px', color: 'rgba(232,224,208,0.4)' }}>Voice:</span>
                        <span style={{ fontFamily: "'Cinzel', serif", fontWeight: 700, fontSize: '14px', color: '#CD7F32' }}>~{words} từ</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 px-3 py-2 rounded-lg inline-flex items-center gap-2" style={{ background: `${modeColor}15`, border: `1px solid ${modeColor}30` }}>
                    <div className="w-2 h-2 rounded-full" style={{ background: modeColor }} />
                    <span style={{ fontFamily: "'Cinzel', serif", fontSize: '11px', fontWeight: 700, color: modeColor }}>{modeName} · {duration < 3 ? '<3m' : duration <= 10 ? '3-10m' : '>10m'}</span>
                  </div>
                </div>

                {/* Market */}
                <div className="glass-card p-6">
                  <div className="section-label mb-4 flex items-center gap-2">
                    <i className="fa-solid fa-globe" style={{ color: '#CD7F32' }} />
                    Thị Trường Mục Tiêu
                  </div>
                  <select value={store.activeLanguage}
                    onChange={e => { setLanguageSelect(e.target.value); setStore(s => { const ns = { ...s, activeLanguage: e.target.value }; saveStoreKeyPool(ns); return ns; }); }}
                    className="w-full glass-select p-4 text-sm">
                    {countryList.map(c => (
                      <option key={c.id} value={c.id}>{c.flag} {c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Visual Style */}
              <div className="max-w-3xl mx-auto mb-6">
                <div className="glass-card p-6">
                  <div className="section-label mb-4 flex items-center gap-2">
                    <i className="fa-solid fa-palette" style={{ color: '#B87333' }} />
                    Phong Cách Visual
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {VISUAL_STYLES.map(style => (
                      <button key={style.id} onClick={() => { setStore(s => ({ ...s, visualStyle: style.id })); setStyleRef(style.reference_prompt); }}
                        className="p-4 rounded-xl text-left transition-all"
                        style={{
                          background: store.visualStyle === style.id ? 'rgba(212,175,55,0.1)' : 'rgba(255,255,255,0.02)',
                          border: `1px solid ${store.visualStyle === style.id ? 'rgba(212,175,55,0.35)' : 'rgba(212,175,55,0.06)'}`,
                          boxShadow: store.visualStyle === style.id ? '0 0 20px rgba(212,175,55,0.1)' : 'none',
                        }}>
                        <div style={{ fontFamily: "'Cinzel', serif", fontWeight: 700, fontSize: '12px', color: store.visualStyle === style.id ? '#D4AF37' : '#E8E0D0', marginBottom: '3px' }}>{style.name}</div>
                        <div style={{ fontSize: '10px', color: 'rgba(232,224,208,0.35)', lineHeight: 1.4 }}>{style.desc}</div>
                      </button>
                    ))}
                  </div>

                  {store.visualStyle !== 'auto' && styleObj && styleObj.reference_prompt && (
                    <div className="mt-5 p-5 rounded-xl animate-fade-in" style={{ background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.15)' }}>
                      <div className="flex justify-between items-center mb-3">
                        <div className="section-label flex items-center gap-2">
                          <i className="fa-solid fa-signature" style={{ color: '#D4AF37' }} />
                          Master Style Template
                        </div>
                        <div className="px-3 py-1 rounded-full text-[9px] font-bold" style={{ background: 'rgba(212,175,55,0.12)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.25)' }}>
                          ACTIVE
                        </div>
                      </div>
                      <textarea value={styleRef} onChange={e => setStyleRef(e.target.value)}
                        className="w-full glass-input p-3 text-[12px] outline-none resize-none min-h-[70px]"
                        style={{ fontStyle: 'italic', lineHeight: 1.6 }} />
                    </div>
                  )}
                </div>
              </div>

              {/* CTA */}
              <div className="max-w-3xl mx-auto mb-8">
                <button onClick={handleGenerateScript} disabled={scriptLoading}
                  className="btn-gold w-full flex items-center justify-center gap-3 text-sm"
                  style={{ height: '56px', fontSize: '15px' }}>
                  {scriptLoading ? (
                    <><i className="fa-solid fa-sync fa-spin" /> ĐANG VIẾT KỊCH BẢN...</>
                  ) : (
                    <><i className="fa-solid fa-scroll" /> TẠO KỊCH BẢN LỊCH SỬ ĐA VĂN HÓA</>
                  )}
                </button>
              </div>

              {/* Script Results */}
              {store.scriptSegments.length > 0 && (
                <div className="max-w-3xl mx-auto">
                  <div className="gold-divider" />
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h3 style={{ fontFamily: "'Cinzel', serif", fontWeight: 700, fontSize: '18px', color: '#E8E0D0' }}>
                        Kịch Bản Đã Tạo
                      </h3>
                      <p style={{ fontSize: '12px', color: 'rgba(232,224,208,0.4)' }}>
                        {store.scriptSegments.length} phân đoạn · ~{words} từ voice
                      </p>
                    </div>
                    <button onClick={() => handleCopy(store.scriptSegments.map(s => s.chapter_voice_block || s.voice_text).join("\n\n"), 'Voice copied!')}
                      className="btn-gold-outline px-5 py-3 text-xs flex items-center gap-2">
                      <i className="fa-solid fa-copy" /> Copy Voice
                    </button>
                  </div>
                  <div className="space-y-4">
                    {store.scriptSegments.map((seg, idx) => (
                      <div key={idx} className="glass-card p-5" style={seg.chapter_voice_block ? { background: 'rgba(212,175,55,0.04)', borderColor: 'rgba(212,175,55,0.2)' } : {}}>
                        {seg.chapter_voice_block && (
                          <div className="mb-4 px-3 py-1.5 rounded-full inline-flex items-center gap-2 text-[10px] font-bold"
                            style={{ background: 'linear-gradient(135deg, #D4AF37, #CD7F32)', color: '#0B0F1A', fontFamily: "'Cinzel', serif" }}>
                            <i className="fa-solid fa-book-open" /> CHAPTER START
                          </div>
                        )}
                        <div className="flex gap-6">
                          <div className="shrink-0 text-center w-20">
                            <div className="px-3 py-2 rounded-xl mb-1" style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.2)', color: '#D4AF37', fontFamily: "'Cinzel', serif", fontSize: '11px', fontWeight: 700 }}>
                              SCENE {idx + 1}
                            </div>
                            <div style={{ fontSize: '10px', color: 'rgba(232,224,208,0.3)', fontFamily: 'monospace' }}>{seg.time}</div>
                            <div style={{ fontSize: '10px', color: '#CD7F32', fontFamily: "'Cinzel', serif", fontWeight: 700, textTransform: 'uppercase', marginTop: '2px' }}>{seg.section}</div>
                          </div>
                          <div className="flex-1 grid grid-cols-2 gap-4">
                            <div className="p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(212,175,55,0.06)' }}>
                              <div className="section-label mb-2 flex items-center gap-1 text-[9px]">
                                <i className="fa-solid fa-eye" /> VISUAL
                                {seg.character && <span className="ml-auto normal-case" style={{ color: 'rgba(232,224,208,0.3)', fontSize: '9px' }}>NV: {seg.character}</span>}
                              </div>
                              <p style={{ fontSize: '12px', color: 'rgba(232,224,208,0.75)', lineHeight: 1.6 }}>{seg.visual_desc_vi || ''}</p>
                              {seg.strategy_note && (
                                <div className="mt-3 p-2 rounded-lg text-[10px]" style={{ background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.12)', color: 'rgba(232,224,208,0.6)', fontStyle: 'italic' }}>
                                  <i className="fa-solid fa-lightbulb" style={{ color: '#D4AF37', marginRight: '4px' }} />{seg.strategy_note}
                                </div>
                              )}
                            </div>
                            <div className="p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(212,175,55,0.06)' }}>
                              <div className="section-label mb-2 flex items-center gap-1 text-[9px]">
                                <i className="fa-solid fa-microphone" /> VOICE
                                <button onClick={() => handleCopy(seg.chapter_voice_block || seg.voice_text || '')} className="ml-auto normal-case bg-none border-none cursor-pointer" style={{ color: 'rgba(232,224,208,0.3)' }}>
                                  <i className="fa-regular fa-copy text-[10px]" />
                                </button>
                              </div>
                              <p style={{ fontSize: '13px', color: '#E8E0D0', lineHeight: 1.7, fontStyle: 'italic' }}>
                                "{seg.chapter_voice_block || seg.voice_text || '(Đọc tiếp...)'}"
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
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
        </main>
      </div>

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