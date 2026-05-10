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
    <div className="h-full flex flex-col animate-slide-in-right relative z-10">
      <div className="flex justify-between items-center mb-4 flex-wrap gap-3">
        <h2 className="text-xl font-bold flex items-center gap-2" style={{ fontFamily: "'Cinzel', serif", color: '#E8E0D0' }}>
          <i className="fa-solid fa-clapperboard" style={{ color: '#D4AF37' }}></i> Studio Sáng Tạo Đa Phương Tiện
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
            <i className="fa-solid fa-image"></i> ẢNH
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

      <div className="flex-1 overflow-y-auto space-y-4 pb-10">
        {empty ? (
          <div className="empty-state flex flex-col items-center justify-center py-20">
            <i className="fa-solid fa-layer-group mb-3 text-2xl" style={{ color: 'rgba(212,175,55,0.3)' }}></i>
            <p className="text-sm" style={{ fontFamily: "'Cinzel', serif" }}>Hãy tạo kịch bản ở bước 2 để có dữ liệu Prompt</p>
          </div>
        ) : (
          segments.map((seg, idx) => {
            const prompt = store.productionMode === 'video' ? seg.video_prompt : seg.image_prompt;
            return (
              <div key={idx} className="glass-card p-4 flex flex-col sm:flex-row gap-4 items-start transition-colors hover:border-[rgba(212,175,55,0.22)]">
                <div
                  className="px-3 py-1.5 rounded text-xs font-bold h-fit"
                  style={{
                    background: 'rgba(212,175,55,0.1)',
                    border: '1px solid rgba(212,175,55,0.25)',
                    color: '#D4AF37',
                    fontFamily: "'Cinzel', serif",
                    boxShadow: '0 0 10px rgba(212,175,55,0.1)',
                  }}
                >
                  CẢNH {idx + 1}
                </div>
                <div className="flex-1 w-full">
                  <div className="flex justify-between items-center mb-1">
                    <div className="text-[10px] font-bold uppercase flex items-center gap-1" style={{ color: 'rgba(232,224,208,0.4)', fontFamily: "'Cinzel', serif" }}>
                      {store.productionMode === 'video'
                        ? <><i className="fa-solid fa-film" style={{ color: '#D4AF37' }}></i> VIDEO PROMPT</>
                        : <><i className="fa-solid fa-image" style={{ color: '#CD7F32' }}></i> ẢNH PROMPT</>}
                    </div>
                  </div>
                  <div className="relative group/prompt">
                    <p
                      className="text-xs font-mono mb-3 p-3 rounded-xl leading-relaxed pr-10"
                      style={{ background: 'rgba(212,175,55,0.03)', border: '1px solid rgba(212,175,55,0.08)', color: 'rgba(232,224,208,0.8)' }}
                    >{prompt || 'No prompt'}</p>
                    <button
                      onClick={() => onCopy(prompt || '')}
                      className="absolute top-2 right-2 p-1.5 rounded transition-all"
                      style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.15)', color: 'rgba(232,224,208,0.5)' }}
                      onMouseOver={e => (e.currentTarget.style.color = '#D4AF37')}
                      onMouseOut={e => (e.currentTarget.style.color = 'rgba(232,224,208,0.5)')}
                    >
                      <i className="fa-solid fa-copy"></i>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
