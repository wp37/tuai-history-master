import { SEO_CHECKLIST_DATA } from '../../data/prompts';

interface Props {
  seoTopic: string;
  setSeoTopic: (v: string) => void;
  results: unknown;
  loading: boolean;
  onGenerate: () => void;
  onCopy: (text: string, label?: string) => void;
  checklistState: Record<string, boolean>;
  onToggleChecklist: (id: string) => void;
}

interface SeoData {
  keywords?: {
    primary?: string[];
    secondary?: string[];
    long_tail?: string[];
  };
  hashtags?: string[];
  video_description?: {
    hook?: string;
    full_description?: string;
    timestamps?: Array<{ time: string; label: string }>;
  };
  viral_titles?: string[];
  thumbnail_strategy?: {
    ctr_target?: string;
    psychological_triggers?: string[];
    color_psychology?: { primary?: string; vibe?: string };
    text_overlay?: { max_words?: string; power_words?: string[] };
    midjourney_prompt?: string;
    dalle_prompt?: string;
    leonardo_prompt?: string;
    stable_diffusion_prompt?: string;
  };
  engagement_comments?: {
    pinned_comment?: string;
    discussion_starters?: string[];
    call_to_action?: string;
  };
}

export default function SeoTab({ seoTopic, setSeoTopic, results, loading, onGenerate, onCopy, checklistState, onToggleChecklist }: Props) {
  const data = results as SeoData | null;
  const keywords = data?.keywords;
  const hashtags = data?.hashtags || [];
  const description = data?.video_description;
  const viralTitles = data?.viral_titles || [];
  const thumbnail = data?.thumbnail_strategy;

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-slide-in-right relative z-10">
      <div className="glass-card p-6">
        <h2 className="text-xl font-bold mb-5 flex items-center gap-3" style={{ fontFamily: "'Cinzel', serif", color: '#E8E0D0' }}>
          <i className="fa-solid fa-magnifying-glass-arrow-right" style={{ color: '#D4AF37' }}></i> Tối Ưu Tăng Trưởng & SEO Đa Nền Tảng
        </h2>
        <div className="flex gap-3 mb-6">
          <input
            value={seoTopic}
            onChange={e => setSeoTopic(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && onGenerate()}
            placeholder="Nhập chủ đề để tối ưu từ khóa viral..."
            className="flex-1 glass-input p-3 text-sm"
          />
          <button
            onClick={onGenerate}
            disabled={loading}
            className="px-6 py-3 btn-gold flex items-center gap-2 text-sm"
          >
            {loading ? <><i className="fa-solid fa-sync fa-spin"></i> ĐANG...</> : <><i className="fa-solid fa-rocket"></i> GROWTH HACKING</>}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Checklist */}
          <div className="glass-card p-4" style={{ background: 'rgba(212,175,55,0.02)' }}>
            <h3 className="text-sm font-bold mb-3 flex items-center gap-2" style={{ color: '#D4AF37', fontFamily: "'Cinzel', serif" }}>
              <i className="fa-solid fa-check-square"></i> CHECKLIST UY TÍN (TRUST)
            </h3>
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
              {Object.entries(SEO_CHECKLIST_DATA).map(([category, items]) => (
                <div key={category} className="p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(212,175,55,0.06)' }}>
                  <div className="text-[10px] font-bold uppercase mb-2" style={{ color: '#A8862A', fontFamily: "'Cinzel', serif" }}>{category}</div>
                  <div className="space-y-2">
                    {items.map(item => (
                      <label key={item.id} className="flex items-start gap-2 cursor-pointer group">
                        <div
                          onClick={() => onToggleChecklist(item.id)}
                          className="w-4 h-4 rounded border flex items-center justify-center shrink-0 mt-0.5 transition-colors"
                          style={{
                            background: checklistState[item.id] ? 'rgba(212,175,55,0.3)' : 'rgba(212,175,55,0.03)',
                            border: `1px solid ${checklistState[item.id] ? 'rgba(212,175,55,0.5)' : 'rgba(212,175,55,0.15)'}`,
                          }}
                        >
                          {checklistState[item.id] && <i className="fa-solid fa-check" style={{ color: '#D4AF37', fontSize: '10px' }}></i>}
                        </div>
                        <span className="text-xs transition-colors" style={checklistState[item.id] ? { color: 'rgba(232,224,208,0.3)', textDecoration: 'line-through' } : { color: 'rgba(232,224,208,0.5)' }}>
                          {item.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Results */}
          <div className="space-y-4">
            {!data ? (
              <div className="empty-state flex flex-col items-center justify-center p-10">
                <i className="fa-solid fa-magic mb-2" style={{ color: 'rgba(212,175,55,0.3)' }}></i>
                <p className="text-sm" style={{ fontFamily: "'Cinzel', serif" }}>Nhập chủ đề để phân tích từ khóa</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {keywords && (
                  <div className="glass-card p-4">
                    <h4 className="text-sm font-bold mb-3 flex items-center gap-2 uppercase tracking-wide" style={{ color: '#D4AF37', fontFamily: "'Cinzel', serif" }}>
                      <i className="fa-solid fa-key"></i> KEYWORDS
                    </h4>
                    {keywords.primary && keywords.primary.length > 0 && (
                      <div className="mb-2">
                        <div className="text-[10px] mb-2 font-bold uppercase" style={{ color: 'rgba(232,224,208,0.4)', fontFamily: "'Cinzel', serif" }}>Primary</div>
                        <div className="flex flex-wrap gap-2">
                          {keywords.primary.map((k, i) => (
                            <button key={i} onClick={() => onCopy(k)} className="badge-gold hover:bg-[rgba(212,175,55,0.2)] transition-all cursor-pointer">{k}</button>
                          ))}
                        </div>
                      </div>
                    )}
                    {keywords.secondary && keywords.secondary.length > 0 && (
                      <div className="mb-2">
                        <div className="text-[10px] mb-2 font-bold uppercase" style={{ color: 'rgba(232,224,208,0.4)', fontFamily: "'Cinzel', serif" }}>Secondary</div>
                        <div className="flex flex-wrap gap-2">
                          {keywords.secondary.map((k, i) => (
                            <span key={i} className="px-3 py-1 rounded-full text-xs" style={{ background: 'rgba(205,127,50,0.08)', border: '1px solid rgba(205,127,50,0.2)', color: '#CD7F32' }}>{k}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {hashtags.length > 0 && (
                  <div className="glass-card p-4">
                    <h4 className="text-sm font-bold mb-3 flex items-center gap-2 uppercase tracking-wide" style={{ color: '#CD7F32', fontFamily: "'Cinzel', serif" }}>
                      <i className="fa-solid fa-hashtag"></i> HASHTAGS
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {hashtags.map((tag, i) => (
                        <button key={i} onClick={() => onCopy(tag)} className="px-3 py-1.5 rounded-lg text-sm flex items-center gap-2 transition-all" style={{ background: 'rgba(184,115,51,0.08)', border: '1px solid rgba(184,115,51,0.2)', color: '#B87333' }}>
                          {tag}
                        </button>
                      ))}
                    </div>
                    <button onClick={() => onCopy(hashtags.join(' '), 'Copied!')} className="mt-2 text-xs flex items-center gap-1 transition-colors" style={{ color: 'rgba(212,175,55,0.5)' }}
                      onMouseOver={e => (e.currentTarget.style.color = '#D4AF37')}
                      onMouseOut={e => (e.currentTarget.style.color = 'rgba(212,175,55,0.5)')}
                    >
                      <i className="fa-solid fa-copy"></i> Copy All
                    </button>
                  </div>
                )}

                {viralTitles.length > 0 && (
                  <div className="glass-card p-4">
                    <div className="text-[10px] font-bold uppercase mb-2 flex items-center gap-1" style={{ color: '#D4AF37', fontFamily: "'Cinzel', serif" }}>
                      <i className="fa-solid fa-bolt"></i> VIRAL TITLES
                    </div>
                    <div className="space-y-2">
                      {viralTitles.map((t, i) => (
                        <div key={i} className="flex justify-between items-center p-2 rounded-xl" style={{ background: 'rgba(212,175,55,0.03)', border: '1px solid rgba(212,175,55,0.06)' }}>
                          <span className="text-[10px] mr-2" style={{ color: 'rgba(212,175,55,0.3)' }}>{i + 1}.</span>
                          <span className="text-sm font-medium flex-1" style={{ color: '#E8E0D0' }}>{t}</span>
                          <button onClick={() => onCopy(t)} className="transition-colors" style={{ color: 'rgba(212,175,55,0.4)' }}
                            onMouseOver={e => (e.currentTarget.style.color = '#D4AF37')}
                            onMouseOut={e => (e.currentTarget.style.color = 'rgba(212,175,55,0.4)')}
                          ><i className="fa-solid fa-copy"></i></button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {description && (
                  <div className="glass-card p-4">
                    <h4 className="text-sm font-bold mb-3 flex items-center gap-2 uppercase tracking-wide" style={{ color: '#D4AF37', fontFamily: "'Cinzel', serif" }}>
                      <i className="fa-solid fa-align-left"></i> VIDEO DESCRIPTION
                    </h4>
                    {description.hook && (
                      <div className="p-3 rounded-xl mb-2" style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.15)' }}>
                        <div className="text-[10px] mb-1 font-bold uppercase" style={{ color: 'rgba(232,224,208,0.4)' }}>Hook</div>
                        <p className="text-sm font-medium" style={{ color: '#E8E0D0' }}>{description.hook}</p>
                      </div>
                    )}
                    {description.full_description && (
                      <>
                        <div className="p-4 rounded-xl" style={{ background: 'rgba(212,175,55,0.03)', border: '1px solid rgba(212,175,55,0.08)' }}>
                          <p className="text-xs leading-relaxed whitespace-pre-line" style={{ color: 'rgba(232,224,208,0.8)' }}>{description.full_description}</p>
                        </div>
                        <button onClick={() => onCopy(description.full_description || '', 'Description copied!')} className="mt-2 text-xs flex items-center gap-1 transition-colors" style={{ color: 'rgba(212,175,55,0.5)' }}
                          onMouseOver={e => (e.currentTarget.style.color = '#D4AF37')}
                          onMouseOut={e => (e.currentTarget.style.color = 'rgba(212,175,55,0.5)')}
                        >
                          <i className="fa-solid fa-copy"></i> Copy Description
                        </button>
                      </>
                    )}
                  </div>
                )}

                {thumbnail && (
                  <div className="glass-card p-4">
                    <div className="text-[10px] font-bold uppercase mb-2 flex items-center gap-1" style={{ color: '#CD7F32', fontFamily: "'Cinzel', serif" }}>
                      <i className="fa-solid fa-image"></i> THUMBNAIL STRATEGY
                    </div>
                    <div className="space-y-3">
                      <div><span className="text-xs" style={{ color: 'rgba(232,224,208,0.4)' }}>CTR Target:</span><p className="text-sm font-medium" style={{ color: '#E8E0D0' }}>{thumbnail.ctr_target || '40%+'}</p></div>
                      {thumbnail.midjourney_prompt && (
                        <div className="p-3 rounded-xl" style={{ background: 'rgba(184,115,51,0.08)', border: '1px solid rgba(184,115,51,0.2)' }}>
                          <div className="flex justify-between mb-2">
                            <span className="text-xs font-bold" style={{ color: '#B87333' }}><i className="fa-solid fa-robot mr-1"></i>Midjourney</span>
                            <button onClick={() => onCopy(thumbnail.midjourney_prompt?.replace(/\n/g, ' ') || '', 'Copied!')} className="btn-gold text-[10px] px-2 py-1 flex items-center gap-1 transition-all" style={{ fontSize: '10px', padding: '4px 8px' }}>
                              <i className="fa-solid fa-copy"></i> Copy
                            </button>
                          </div>
                          <p className="text-xs font-mono p-2 rounded" style={{ background: 'rgba(212,175,55,0.03)', border: '1px solid rgba(212,175,55,0.08)', color: 'rgba(232,224,208,0.8)' }}>{thumbnail.midjourney_prompt}</p>
                        </div>
                      )}
                      {thumbnail.dalle_prompt && (
                        <div className="p-3 rounded-xl" style={{ background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.15)' }}>
                          <div className="flex justify-between mb-2">
                            <span className="text-xs font-bold" style={{ color: '#D4AF37' }}><i className="fa-solid fa-palette mr-1"></i>DALL-E</span>
                            <button onClick={() => onCopy(thumbnail.dalle_prompt?.replace(/\n/g, ' ') || '', 'Copied!')} className="btn-gold text-[10px] px-2 py-1 flex items-center gap-1 transition-all" style={{ fontSize: '10px', padding: '4px 8px' }}>
                              <i className="fa-solid fa-copy"></i> Copy
                            </button>
                          </div>
                          <p className="text-xs font-mono p-2 rounded" style={{ background: 'rgba(212,175,55,0.03)', border: '1px solid rgba(212,175,55,0.08)', color: 'rgba(232,224,208,0.8)' }}>{thumbnail.dalle_prompt}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
