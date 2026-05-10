import type { StoreState } from '../../data/types';

interface Props {
  store: StoreState;
  onModeChange: (mode: 'video' | 'image') => void;
  onCopy: (text: string, label?: string) => void;
  showExportMenu: boolean;
  setShowExportMenu: (v: boolean) => void;
  exportRef: React.RefObject<HTMLDivElement | null>;
  onExportScriptCSV: () => void;
  onExportPromptsCSV: (type: 'video' | 'image') => void;
  onExportPromptsTXT: (type: 'video' | 'image') => void;
}

export default function StudioTab({ store, onModeChange, onCopy, showExportMenu, setShowExportMenu, exportRef, onExportScriptCSV, onExportPromptsCSV, onExportPromptsTXT }: Props) {
  const segments = store.scriptSegments;
  const empty = segments.length === 0;

  return (
    <div className="p-8 animate-slide-in-right relative z-10">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
          <h2 className="text-[28px] font-bold flex items-center gap-3" style={{ fontFamily: "'Cinzel', serif", color: '#E8E0D0', lineHeight: 1.2 }}>
            <i className="fa-solid fa-clapperboard" style={{ color: '#D4AF37' }}></i> Studio Sáng Tạo
          </h2>
        <div className="flex rounded-xl p-1 gap-1" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(212,175,55,0.08)' }}>
          <button
            onClick={() => onModeChange('video')}
            className="px-4 py-1.5 rounded text-xs font-bold flex items-center gap-2 transition-all"
            style={{
              background: store.productionMode === 'video' ? 'rgba(212,175,55,0.12)' : 'transparent',
              border: `1px solid ${store.productionMode === 'video' ? 'rgba(212,175,55,0.3)' : 'transparent'}`,
              color: store.productionMode === 'video' ? '#D4AF37' : 'rgba(232,224,208,0.4)',
              boxShadow: store.productionMode === 'video' ? '0 0 10px rgba(212,175,55,0.1)' : 'none',
            }}
          >
            <i className="fa-solid fa-video"></i> VIDEO
          </button>
          <button
            onClick={() => onModeChange('image')}
            className="px-4 py-1.5 rounded text-xs font-bold flex items-center gap-2 transition-all"
            style={{
              background: store.productionMode === 'image' ? 'rgba(212,175,55,0.12)' : 'transparent',
              border: `1px solid ${store.productionMode === 'image' ? 'rgba(212,175,55,0.3)' : 'transparent'}`,
              color: store.productionMode === 'image' ? '#D4AF37' : 'rgba(232,224,208,0.4)',
              boxShadow: store.productionMode === 'image' ? '0 0 10px rgba(212,175,55,0.1)' : 'none',
            }}
          >
            <i className="fa-solid fa-photo-film"></i> ẢNH
          </button>
          <div className="relative ml-2" ref={exportRef}>
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="px-4 py-1.5 rounded text-xs font-bold flex items-center gap-2 transition-all"
              style={{
                background: 'rgba(212,175,55,0.08)',
                border: '1px solid rgba(212,175,55,0.2)',
                color: '#D4AF37',
              }}
            >
              <i className="fa-solid fa-download"></i> Tải Dữ Liệu <i className="fa-solid fa-chevron-down text-[10px]"></i>
            </button>
            {showExportMenu && (
              <div
                className="absolute right-0 top-full mt-2 w-48 rounded-xl shadow-xl z-50 overflow-hidden"
                style={{ background: 'rgba(10, 14, 23, 0.98)', border: '1px solid rgba(212,175,55,0.15)', backdropFilter: 'blur(20px)' }}
              >
                <button onClick={onExportScriptCSV} className="w-full text-left px-4 py-2.5 text-xs flex items-center gap-2 transition-colors" style={{ color: 'rgba(232,224,208,0.7)', borderBottom: '1px solid rgba(212,175,55,0.08)' }}
                  onMouseOver={e => (e.currentTarget.style.background = 'rgba(212,175,55,0.08)', e.currentTarget.style.color = '#E8E0D0')}
                  onMouseOut={e => (e.currentTarget.style.background = 'transparent', e.currentTarget.style.color = 'rgba(232,224,208,0.7)')}
                >
                  <i className="fa-solid fa-file-excel" style={{ color: '#D4AF37' }}></i> Excel Kịch Bản (Full)
                </button>
                <button onClick={() => onExportPromptsCSV('video')} className="w-full text-left px-4 py-2.5 text-xs flex items-center gap-2 transition-colors" style={{ color: 'rgba(232,224,208,0.7)', borderBottom: '1px solid rgba(212,175,55,0.08)' }}
                  onMouseOver={e => (e.currentTarget.style.background = 'rgba(212,175,55,0.08)', e.currentTarget.style.color = '#E8E0D0')}
                  onMouseOut={e => (e.currentTarget.style.background = 'transparent', e.currentTarget.style.color = 'rgba(232,224,208,0.7)')}
                >
                  <i className="fa-solid fa-file-video" style={{ color: '#CD7F32' }}></i> Excel Prompt Video
                </button>
                <button onClick={() => onExportPromptsCSV('image')} className="w-full text-left px-4 py-2.5 text-xs flex items-center gap-2 transition-colors" style={{ color: 'rgba(232,224,208,0.7)', borderBottom: '1px solid rgba(212,175,55,0.08)' }}
                  onMouseOver={e => (e.currentTarget.style.background = 'rgba(212,175,55,0.08)', e.currentTarget.style.color = '#E8E0D0')}
                  onMouseOut={e => (e.currentTarget.style.background = 'transparent', e.currentTarget.style.color = 'rgba(232,224,208,0.7)')}
                >
                  <i className="fa-solid fa-file-image" style={{ color: '#B87333' }}></i> Excel Prompt Ảnh
                </button>
                <button onClick={() => onExportPromptsTXT('video')} className="w-full text-left px-4 py-2.5 text-xs flex items-center gap-2 transition-colors" style={{ color: 'rgba(232,224,208,0.7)', borderBottom: '1px solid rgba(212,175,55,0.08)' }}
                  onMouseOver={e => (e.currentTarget.style.background = 'rgba(212,175,55,0.08)', e.currentTarget.style.color = '#E8E0D0')}
                  onMouseOut={e => (e.currentTarget.style.background = 'transparent', e.currentTarget.style.color = 'rgba(232,224,208,0.7)')}
                >
                  <i className="fa-regular fa-file-lines" style={{ color: '#CD7F32' }}></i> TXT Prompt Video
                </button>
                <button onClick={() => onExportPromptsTXT('image')} className="w-full text-left px-4 py-2.5 text-xs flex items-center gap-2 transition-colors" style={{ color: 'rgba(232,224,208,0.7)' }}
                  onMouseOver={e => (e.currentTarget.style.background = 'rgba(212,175,55,0.08)', e.currentTarget.style.color = '#E8E0D0')}
                  onMouseOut={e => (e.currentTarget.style.background = 'transparent', e.currentTarget.style.color = 'rgba(232,224,208,0.7)')}
                >
                  <i className="fa-regular fa-file-lines" style={{ color: '#B87333' }}></i> TXT Prompt Ảnh
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {empty ? (
          <div className="glass-card flex flex-col items-center justify-center py-20 text-center">
            <i className="fa-solid fa-layer-group mb-4 text-3xl" style={{ color: 'rgba(212,175,55,0.3)' }}></i>
            <p className="text-base" style={{ fontFamily: "'Cinzel', serif", color: 'rgba(232,224,208,0.4)' }}>
              Hãy tạo kịch bản ở tab SCRIPT để hiển thị Prompts
            </p>
            <p className="text-xs mt-2" style={{ color: 'rgba(212,175,55,0.3)' }}>Video Prompts + Image Prompts sẽ hiển thị ở đây</p>
          </div>
        ) : (
          segments.map((seg, idx) => {
            const prompt = store.productionMode === 'video' ? seg.video_prompt : seg.image_prompt;
            const modeColor = store.productionMode === 'video' ? '#D4AF37' : '#CD7F32';
            return (
              <div key={idx} className="glass-card p-6 transition-all hover:border-[rgba(212,175,55,0.22)]">
                <div className="flex items-start gap-5">
                  <div className="shrink-0">
                    <div className="px-4 py-3 rounded-xl text-center" style={{
                      background: `${modeColor}15`,
                      border: `1px solid ${modeColor}30`,
                      color: modeColor,
                      fontFamily: "'Cinzel', serif",
                      fontSize: '13px',
                      fontWeight: 800,
                      boxShadow: `0 0 15px ${modeColor}20`,
                    }}>
                      CẢNH {idx + 1}
                    </div>
                    {seg.time && (
                      <div className="text-center mt-2" style={{ fontSize: '10px', color: 'rgba(232,224,208,0.3)', fontFamily: 'monospace' }}>{seg.time}</div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-3">
                      <div className="section-label flex items-center gap-2">
                        <i className={`fa-solid ${store.productionMode === 'video' ? 'fa-video' : 'fa-photo-film'}`} style={{ color: modeColor }}></i>
                        {store.productionMode === 'video' ? 'VIDEO PROMPT' : 'IMAGE PROMPT'}
                      </div>
                      <div className="px-3 py-1 rounded-full text-[9px] font-bold" style={{ background: `${modeColor}15`, color: modeColor, border: `1px solid ${modeColor}30` }}>
                        {store.productionMode === 'video' ? 'VIDEO' : 'IMAGE'}
                      </div>
                    </div>
                    <div className="relative group/prompt">
                      <p className="text-sm font-mono leading-relaxed pr-12 p-4 rounded-xl"
                        style={{ background: `${modeColor}06`, border: `1px solid ${modeColor}15`, color: 'rgba(232,224,208,0.85)' }}>
                        {prompt || 'No prompt'}
                      </p>
                      <button
                        onClick={() => onCopy(prompt || '')}
                        className="absolute top-3 right-3 p-2 rounded-xl transition-all"
                        style={{ background: `${modeColor}15`, border: `1px solid ${modeColor}30`, color: modeColor }}
                        onMouseOver={e => { e.currentTarget.style.background = modeColor; e.currentTarget.style.color = '#0B0F1A'; }}
                        onMouseOut={e => { e.currentTarget.style.background = `${modeColor}15`; e.currentTarget.style.color = modeColor; }}
                      >
                        <i className="fa-solid fa-copy text-sm"></i>
                      </button>
                    </div>
                    {seg.character && (
                      <div className="mt-2 text-[11px]" style={{ color: 'rgba(232,224,208,0.3)' }}>
                        <i className="fa-solid fa-user" style={{ marginRight: '4px' }}></i>NV: {seg.character}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
    </div>
  );
}
