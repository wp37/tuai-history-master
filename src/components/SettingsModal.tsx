import { useState } from 'react';
import type { StoreState } from '../data/types';

interface Props {
  store: StoreState;
  onClose: () => void;
  onUpdateKeyPool: (keys: string[]) => void;
  onUpdateApiEnabled: (enabled: StoreState['apiEnabled']) => void;
  onUpdateOpenRouter: (key: string, model: string) => void;
  onUpdateYoutubeKey: (key: string) => void;
  onUpdateOpenAi: (key: string, model: string) => void;
}

export default function SettingsModal({ store, onClose, onUpdateKeyPool, onUpdateApiEnabled, onUpdateOpenRouter, onUpdateYoutubeKey, onUpdateOpenAi }: Props) {
  const [keys, setKeys] = useState<string[]>(store.keyPool.length > 0 ? store.keyPool : ['']);
  const [orKey, setOrKey] = useState(store.openRouterKey);
  const [orModel, setOrModel] = useState(store.openRouterModel);
  const [ytKey, setYtKey] = useState(store.youtubeApiKey);
  const [oaKey, setOaKey] = useState(store.openAiKey);
  const [oaModel, setOaModel] = useState(store.openAiModel);

  const toggleApi = (name: keyof StoreState['apiEnabled']) => {
    onUpdateApiEnabled({ ...store.apiEnabled, [name]: !store.apiEnabled[name] });
  };

  const saveKeys = () => {
    onUpdateKeyPool(keys.filter(k => k.trim() !== ''));
    onUpdateOpenRouter(orKey, orModel);
    onUpdateYoutubeKey(ytKey);
    onUpdateOpenAi(oaKey, oaModel);
    onClose();
  };

  const addKey = () => setKeys([...keys, '']);
  const removeKey = (i: number) => {
    const next = keys.filter((_, idx) => idx !== i);
    setKeys(next.length > 0 ? next : ['']);
  };
  const updateKey = (i: number, val: string) => {
    const next = [...keys];
    next[i] = val;
    setKeys(next);
  };

  const toggleBg = (enabled: boolean) => ({
    background: enabled ? 'rgba(212,175,55,0.15)' : 'rgba(255,255,255,0.05)',
    borderColor: enabled ? 'rgba(212,175,55,0.3)' : 'rgba(212,175,55,0.08)',
  });

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in"
      style={{ background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(8px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="w-full max-w-lg rounded-2xl p-6 max-h-[90vh] overflow-y-auto"
        style={{
          background: 'rgba(10, 14, 23, 0.97)',
          border: '1px solid rgba(212, 175, 55, 0.15)',
          boxShadow: '0 0 60px rgba(212,175,55,0.08), 0 25px 80px rgba(0,0,0,0.6)',
        }}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold flex items-center gap-3 text-lg" style={{ fontFamily: "'Cinzel', serif", color: '#E8E0D0' }}>
            <i className="fa-solid fa-gear" style={{ color: '#D4AF37' }}></i>
            Cấu Hình API
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded-xl transition-all"
            style={{ color: 'rgba(232,224,208,0.4)', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(212,175,55,0.1)' }}
            onMouseOver={e => (e.currentTarget.style.color = '#D4AF37')}
            onMouseOut={e => (e.currentTarget.style.color = 'rgba(232,224,208,0.4)')}
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Google Gemini */}
        <div className="rounded-xl p-4 mb-4 transition-all" style={toggleBg(store.apiEnabled.google)}>
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2">
              <i className="fa-brands fa-google" style={{ color: '#D4AF37', fontSize: '14px' }}></i>
              <div className="text-xs font-bold uppercase" style={{ color: '#D4AF37', fontFamily: "'Cinzel', serif", letterSpacing: '0.05em' }}>Google Gemini (Priority 1)</div>
              <div
                className="px-2 py-0.5 rounded-full text-[9px] font-bold"
                style={{
                  background: store.apiEnabled.google ? 'rgba(212,175,55,0.2)' : 'rgba(255,255,255,0.05)',
                  color: store.apiEnabled.google ? '#D4AF37' : 'rgba(232,224,208,0.3)',
                  border: `1px solid ${store.apiEnabled.google ? 'rgba(212,175,55,0.3)' : 'rgba(255,255,255,0.1)'}`,
                }}
              >
                {store.apiEnabled.google ? 'ON' : 'OFF'}
              </div>
            </div>
            <label className="toggle-gold">
              <input type="checkbox" checked={store.apiEnabled.google} onChange={() => toggleApi('google')} />
              <span className="toggle-gold-slider"></span>
            </label>
          </div>
          <div className="space-y-2">
            {keys.map((k, i) => (
              <div key={i} className="flex gap-2">
                <input
                  type="password"
                  value={k}
                  onChange={e => updateKey(i, e.target.value)}
                  className="flex-1 glass-input p-2.5 text-xs font-mono"
                  placeholder="AIza..."
                />
                <button
                  onClick={() => removeKey(i)}
                  className="p-2.5 rounded-xl transition-all"
                  style={{ color: 'rgba(232,224,208,0.4)', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(212,175,55,0.08)' }}
                  onMouseOver={e => (e.currentTarget.style.color = '#CD7F32')}
                  onMouseOut={e => (e.currentTarget.style.color = 'rgba(232,224,208,0.4)')}
                >
                  <i className="fa-solid fa-trash"></i>
                </button>
              </div>
            ))}
            <button
              onClick={addKey}
              className="text-xs flex items-center gap-1 mt-1 transition-colors"
              style={{ color: 'rgba(212,175,55,0.5)' }}
              onMouseOver={e => (e.currentTarget.style.color = '#D4AF37')}
              onMouseOut={e => (e.currentTarget.style.color = 'rgba(212,175,55,0.5)')}
            >
              <i className="fa-solid fa-plus"></i> Thêm Key
            </button>
          </div>
        </div>

        {/* OpenRouter */}
        <div className="rounded-xl p-4 mb-4 transition-all" style={toggleBg(store.apiEnabled.openrouter)}>
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2">
              <i className="fa-solid fa-route" style={{ color: '#CD7F32', fontSize: '14px' }}></i>
              <div className="text-xs font-bold uppercase" style={{ color: '#CD7F32', fontFamily: "'Cinzel', serif", letterSpacing: '0.05em' }}>OpenRouter (Backup)</div>
              <div
                className="px-2 py-0.5 rounded-full text-[9px] font-bold"
                style={{
                  background: store.apiEnabled.openrouter ? 'rgba(205,127,50,0.2)' : 'rgba(255,255,255,0.05)',
                  color: store.apiEnabled.openrouter ? '#CD7F32' : 'rgba(232,224,208,0.3)',
                  border: `1px solid ${store.apiEnabled.openrouter ? 'rgba(205,127,50,0.3)' : 'rgba(255,255,255,0.1)'}`,
                }}
              >
                {store.apiEnabled.openrouter ? 'ON' : 'OFF'}
              </div>
            </div>
            <label className="toggle-gold">
              <input type="checkbox" checked={store.apiEnabled.openrouter} onChange={() => toggleApi('openrouter')} />
              <span className="toggle-gold-slider"></span>
            </label>
          </div>
          <div className={`space-y-3 ${!store.apiEnabled.openrouter ? 'opacity-40 pointer-events-none' : ''}`}>
            <div>
              <div className="text-[10px] mb-1 font-medium" style={{ color: 'rgba(232,224,208,0.5)' }}>API Key</div>
              <input type="password" value={orKey} onChange={e => setOrKey(e.target.value)}
                className="w-full glass-input p-2.5 text-xs font-mono"
                placeholder="sk-or-..." />
            </div>
            <div>
              <div className="text-[10px] mb-1 font-medium" style={{ color: 'rgba(232,224,208,0.5)' }}>Model</div>
              <select value={orModel} onChange={e => setOrModel(e.target.value)} className="w-full glass-select p-2.5 text-xs">
                <option value="google/gemini-2.0-flash-exp:free">⭐ Gemini 2.0 Flash Exp (Free)</option>
                <option value="anthropic/claude-3.5-sonnet">Claude 3.5 Sonnet</option>
                <option value="openai/gpt-4-turbo">GPT-4 Turbo</option>
                <option value="meta-llama/llama-3.1-405b-instruct">Llama 3.1 405B</option>
                <option value="deepseek/deepseek-chat">DeepSeek Chat</option>
              </select>
            </div>
          </div>
        </div>

        {/* OpenAI */}
        <div className="rounded-xl p-4 mb-4 transition-all" style={toggleBg(store.apiEnabled.openai)}>
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2">
              <i className="fa-solid fa-brain" style={{ color: '#B87333', fontSize: '14px' }}></i>
              <div className="text-xs font-bold uppercase" style={{ color: '#B87333', fontFamily: "'Cinzel', serif", letterSpacing: '0.05em' }}>OpenAI (Alternative)</div>
              <div
                className="px-2 py-0.5 rounded-full text-[9px] font-bold"
                style={{
                  background: store.apiEnabled.openai ? 'rgba(184,115,51,0.2)' : 'rgba(255,255,255,0.05)',
                  color: store.apiEnabled.openai ? '#B87333' : 'rgba(232,224,208,0.3)',
                  border: `1px solid ${store.apiEnabled.openai ? 'rgba(184,115,51,0.3)' : 'rgba(255,255,255,0.1)'}`,
                }}
              >
                {store.apiEnabled.openai ? 'ON' : 'OFF'}
              </div>
            </div>
            <label className="toggle-gold">
              <input type="checkbox" checked={store.apiEnabled.openai} onChange={() => toggleApi('openai')} />
              <span className="toggle-gold-slider"></span>
            </label>
          </div>
          <div className={`space-y-3 ${!store.apiEnabled.openai ? 'opacity-40 pointer-events-none' : ''}`}>
            <div>
              <div className="text-[10px] mb-1 font-medium" style={{ color: 'rgba(232,224,208,0.5)' }}>API Key</div>
              <input type="password" value={oaKey} onChange={e => setOaKey(e.target.value)}
                className="w-full glass-input p-2.5 text-xs font-mono"
                placeholder="sk-..." />
            </div>
            <div>
              <div className="text-[10px] mb-1 font-medium" style={{ color: 'rgba(232,224,208,0.5)' }}>Model</div>
              <select value={oaModel} onChange={e => setOaModel(e.target.value)} className="w-full glass-select p-2.5 text-xs">
                <option value="gpt-4-turbo-preview">GPT-4 Turbo Preview</option>
                <option value="gpt-4">GPT-4</option>
                <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
              </select>
            </div>
          </div>
        </div>

        {/* YouTube */}
        <div className="rounded-xl p-4 mb-4 transition-all" style={toggleBg(store.apiEnabled.youtube)}>
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2">
              <i className="fa-brands fa-youtube" style={{ color: '#A8862A', fontSize: '14px' }}></i>
              <div className="text-xs font-bold uppercase" style={{ color: '#A8862A', fontFamily: "'Cinzel', serif", letterSpacing: '0.05em' }}>YouTube Data API (Optional)</div>
              <div
                className="px-2 py-0.5 rounded-full text-[9px] font-bold"
                style={{
                  background: store.apiEnabled.youtube ? 'rgba(168,134,42,0.2)' : 'rgba(255,255,255,0.05)',
                  color: store.apiEnabled.youtube ? '#A8862A' : 'rgba(232,224,208,0.3)',
                  border: `1px solid ${store.apiEnabled.youtube ? 'rgba(168,134,42,0.3)' : 'rgba(255,255,255,0.1)'}`,
                }}
              >
                {store.apiEnabled.youtube ? 'ON' : 'OFF'}
              </div>
            </div>
            <label className="toggle-gold">
              <input type="checkbox" checked={store.apiEnabled.youtube} onChange={() => toggleApi('youtube')} />
              <span className="toggle-gold-slider"></span>
            </label>
          </div>
          <div className={!store.apiEnabled.youtube ? 'opacity-40 pointer-events-none' : ''}>
            <input type="password" value={ytKey} onChange={e => setYtKey(e.target.value)}
              className="w-full glass-input p-2.5 text-xs font-mono"
              placeholder="AIza..." />
            <div className="text-[9px] mt-1 italic" style={{ color: 'rgba(232,224,208,0.3)' }}>
              Bật để hiển thị metadata chi tiết hơn cho Spy module
            </div>
          </div>
        </div>

        <p className="text-[10px] italic mb-4" style={{ color: 'rgba(212,175,55,0.3)' }}>
          <i className="fa-solid fa-shield-halved mr-1"></i>
          Keys được mã hóa và lưu trong local storage
        </p>

        <button onClick={saveKeys} className="w-full py-3 btn-gold flex items-center justify-center gap-2 text-base">
          <i className="fa-solid fa-save"></i> Lưu Cấu Hình
        </button>
      </div>
    </div>
  );
}
