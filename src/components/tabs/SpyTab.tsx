interface SpyMeta {
  title: string;
  author: string;
  thumb: string;
  viewCount?: string;
  fullData: boolean;
}

interface SpyData {
  strengths?: Array<{ point: string; impact: string; evidence: string }>;
  weaknesses?: Array<{ point: string; impact: string; fix: string }>;
  audio_strategy?: {
    voice_analysis?: string;
    music_style?: string;
    sound_effects?: string[];
    hook_sounds?: string;
  };
  engagement_signals?: {
    estimated_ctr?: string;
    retention_score?: string;
    viral_potential?: string;
    comment_sentiment?: string;
    share_worthiness?: string;
  };
  hook_timeline?: Array<{ timestamp: string; hook_type: string; description: string }>;
  viral_suggestions?: Array<{ hook_title: string; outline_idea: string; cultural_twist: string }>;
  revenue_analysis?: {
    estimated_cpm?: string;
    estimated_rpm?: string;
    total_estimated_earnings?: string;
    monetization_tier?: string;
    revenue_factors?: string[];
  };
  competitive_edge?: string;
  replication_strategy?: string;
}

interface Props {
  results: unknown;
  meta: SpyMeta | null;
  onUseStrategy: (title: string) => void;
  getTierColor: (tier: string) => string;
  getImpactColor: (impact: string) => string;
}

export default function SpyTab({ results, meta, onUseStrategy, getTierColor, getImpactColor }: Props) {
  if (!results) return null;
  const data = results as SpyData;

  const strengths = data.strengths || [];
  const weaknesses = data.weaknesses || [];
  const audio = data.audio_strategy;
  const engagement = data.engagement_signals;
  const hookTimeline = data.hook_timeline || [];
  const viralSuggestions = data.viral_suggestions || [];
  const revenue = data.revenue_analysis;

  return (
    <div className="space-y-6">
      {meta && (
        <div className="glass-card p-4 flex gap-4 items-start flex-col sm:flex-row">
          <img src={meta.thumb} className="w-full sm:w-48 rounded-lg object-cover aspect-video" style={{ border: '1px solid rgba(212,175,55,0.1)' }} alt="" />
          <div className="flex-1">
            <h3 className="text-lg font-bold leading-tight mb-2" style={{ color: '#E8E0D0', fontFamily: "'Cinzel', serif" }}>{meta.title}</h3>
            <div className="flex items-center gap-4 text-sm" style={{ color: 'rgba(232,224,208,0.5)' }}>
              <span className="flex items-center gap-1" style={{ color: '#CD7F32' }}><i className="fa-solid fa-user"></i> {meta.author}</span>
              {meta.fullData && meta.viewCount && <span className="flex items-center gap-1" style={{ color: '#D4AF37' }}><i className="fa-solid fa-eye"></i> {meta.viewCount} views</span>}
            </div>
          </div>
        </div>
      )}

      {revenue && (
        <div className="glass-card p-5">
          <h4 className="text-sm font-bold mb-4 flex items-center gap-2 uppercase tracking-wide" style={{ color: '#D4AF37', fontFamily: "'Cinzel', serif" }}>
            <i className="fa-solid fa-dollar-sign"></i> REVENUE ANALYSIS
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {[
              { label: 'Estimated CPM', value: revenue.estimated_cpm || 'N/A' },
              { label: 'Estimated RPM', value: revenue.estimated_rpm || 'N/A' },
              { label: 'Total Earnings', value: revenue.total_estimated_earnings || 'N/A', highlight: true },
            ].map((item, i) => (
              <div key={i} className="p-3 rounded-xl" style={{ background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.1)' }}>
                <div className="text-[10px] mb-1 uppercase" style={{ color: 'rgba(232,224,208,0.5)', fontFamily: "'Cinzel', serif" }}>{item.label}</div>
                <div className="text-lg font-bold" style={{ color: item.highlight ? '#D4AF37' : '#E8E0D0' }}>{item.value}</div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs" style={{ color: 'rgba(232,224,208,0.4)' }}>Tier:</span>
            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getTierColor(revenue.monetization_tier || '')}`}>{revenue.monetization_tier || 'N/A'}</span>
          </div>
          {revenue.revenue_factors && revenue.revenue_factors.length > 0 && (
            <div className="mt-3">
              <div className="text-[10px] mb-2 uppercase" style={{ color: '#A8862A', fontFamily: "'Cinzel', serif" }}>Revenue Factors:</div>
              <div className="flex flex-wrap gap-2">
                {revenue.revenue_factors.map((f, i) => (
                  <span key={i} className="badge-gold">{f}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {strengths.length > 0 && (
          <div className="glass-card p-5">
            <h4 className="text-sm font-bold mb-4 flex items-center gap-2" style={{ color: '#D4AF37', fontFamily: "'Cinzel', serif" }}>
              <i className="fa-solid fa-check-circle"></i> STRENGTHS
            </h4>
            <div className="space-y-3">
              {strengths.map((s, idx) => (
                <div key={idx} className="p-3 rounded-xl" style={{ background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.1)' }}>
                  <div className="flex items-start gap-2 mb-1">
                    <span className="font-bold text-xs shrink-0" style={{ color: '#D4AF37' }}>{idx + 1}.</span>
                    <div className="flex-1">
                      <div className="text-xs font-medium mb-1" style={{ color: '#E8E0D0' }}>{s.point}</div>
                      <div className="flex items-center gap-2 text-[10px]">
                        <span style={{ color: 'rgba(232,224,208,0.4)' }}>Impact:</span>
                        <span className={getImpactColor(s.impact)}>{s.impact}</span>
                      </div>
                      {s.evidence && <div className="text-[10px] mt-1 italic" style={{ color: 'rgba(232,224,208,0.4)' }}>
                        <i className="fa-solid fa-lightbulb" style={{ color: '#D4AF37', marginRight: '4px' }}></i>{s.evidence}
                      </div>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {weaknesses.length > 0 && (
          <div className="glass-card p-5">
            <h4 className="text-sm font-bold mb-4 flex items-center gap-2" style={{ color: '#CD7F32', fontFamily: "'Cinzel', serif" }}>
              <i className="fa-solid fa-exclamation-triangle"></i> WEAKNESSES
            </h4>
            <div className="space-y-3">
              {weaknesses.map((w, idx) => (
                <div key={idx} className="p-3 rounded-xl" style={{ background: 'rgba(205,127,50,0.05)', border: '1px solid rgba(205,127,50,0.1)' }}>
                  <div className="flex items-start gap-2 mb-1">
                    <span className="font-bold text-xs shrink-0" style={{ color: '#CD7F32' }}>{idx + 1}.</span>
                    <div className="flex-1">
                      <div className="text-xs font-medium mb-1" style={{ color: '#E8E0D0' }}>{w.point}</div>
                      <div className="flex items-center gap-2 text-[10px] mb-1">
                        <span style={{ color: 'rgba(232,224,208,0.4)' }}>Impact:</span>
                        <span className={getImpactColor(w.impact)}>{w.impact}</span>
                      </div>
                      {w.fix && (
                        <div className="text-[10px] p-2 rounded mt-2" style={{ background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.15)', color: 'rgba(232,224,208,0.7)' }}>
                          <i className="fa-solid fa-wrench" style={{ color: '#D4AF37', marginRight: '4px' }}></i>Fix: {w.fix}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {audio && (
        <div className="glass-card p-5">
          <h4 className="text-sm font-bold mb-4 flex items-center gap-2 uppercase tracking-wide" style={{ color: '#D4AF37', fontFamily: "'Cinzel', serif" }}>
            <i className="fa-solid fa-music"></i> AUDIO STRATEGY
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: 'Voice Analysis', value: audio.voice_analysis || 'N/A' },
              { label: 'Music Style', value: audio.music_style || 'N/A' },
              { label: 'Hook Sounds', value: audio.hook_sounds || 'N/A' },
              { label: 'Sound Effects', value: audio.sound_effects?.join(', ') || 'N/A' },
            ].map((item, i) => (
              <div key={i} className="p-3 rounded-xl" style={{ background: 'rgba(212,175,55,0.03)', border: '1px solid rgba(212,175,55,0.08)' }}>
                <div className="text-[10px] mb-2 font-bold uppercase" style={{ color: '#A8862A', fontFamily: "'Cinzel', serif" }}>{item.label}</div>
                <div className="text-xs" style={{ color: 'rgba(232,224,208,0.8)' }}>{item.value}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {engagement && (
        <div className="glass-card p-5">
          <h4 className="text-sm font-bold mb-4 flex items-center gap-2 uppercase tracking-wide" style={{ color: '#D4AF37', fontFamily: "'Cinzel', serif" }}>
            <i className="fa-solid fa-chart-line"></i> ENGAGEMENT SIGNALS
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { label: 'Estimated CTR', value: engagement.estimated_ctr || 'N/A' },
              { label: 'Retention', value: engagement.retention_score || 'N/A' },
              { label: 'Viral Potential', value: engagement.viral_potential || 'N/A' },
              { label: 'Comment Sentiment', value: engagement.comment_sentiment || 'N/A' },
              { label: 'Share Score', value: engagement.share_worthiness || 'N/A' },
            ].map((item, i) => (
              <div key={i} className="p-3 rounded-xl text-center" style={{ background: 'rgba(212,175,55,0.03)', border: '1px solid rgba(212,175,55,0.08)' }}>
                <div className="text-[10px] mb-1" style={{ color: 'rgba(232,224,208,0.4)' }}>{item.label}</div>
                <div className="text-sm font-bold" style={{ color: '#E8E0D0' }}>{item.value}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {hookTimeline.length > 0 && (
        <div className="glass-card p-5">
          <h4 className="text-sm font-bold mb-4 flex items-center gap-2 uppercase tracking-wide" style={{ color: '#CD7F32', fontFamily: "'Cinzel', serif" }}>
            <i className="fa-solid fa-clock"></i> HOOK TIMELINE
          </h4>
          <div className="space-y-3">
            {hookTimeline.map((hook, idx) => (
              <div key={idx} className="p-3 rounded-xl flex items-start gap-3" style={{ background: 'rgba(205,127,50,0.03)', border: '1px solid rgba(205,127,50,0.08)' }}>
                <div className="px-2 py-1 rounded text-[10px] font-bold shrink-0" style={{ background: 'rgba(205,127,50,0.15)', border: '1px solid rgba(205,127,50,0.2)', color: '#CD7F32' }}>{hook.timestamp}</div>
                <div className="flex-1">
                  <div className="text-xs font-bold mb-1" style={{ color: '#E8E0D0' }}>{hook.hook_type}</div>
                  <div className="text-[10px]" style={{ color: 'rgba(232,224,208,0.4)' }}>{hook.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {(data.competitive_edge || data.replication_strategy) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.competitive_edge && (
            <div className="glass-card p-5">
              <h4 className="text-sm font-bold mb-3 flex items-center gap-2" style={{ color: '#D4AF37', fontFamily: "'Cinzel', serif" }}>
                <i className="fa-solid fa-trophy"></i> Competitive Edge
              </h4>
              <p className="text-xs leading-relaxed" style={{ color: 'rgba(232,224,208,0.8)' }}>{data.competitive_edge}</p>
            </div>
          )}
          {data.replication_strategy && (
            <div className="glass-card p-5">
              <h4 className="text-sm font-bold mb-3 flex items-center gap-2" style={{ color: '#CD7F32', fontFamily: "'Cinzel', serif" }}>
                <i className="fa-solid fa-copy"></i> Replication Strategy
              </h4>
              <p className="text-xs leading-relaxed" style={{ color: 'rgba(232,224,208,0.8)' }}>{data.replication_strategy}</p>
            </div>
          )}
        </div>
      )}

      {viralSuggestions.length > 0 && (
        <div className="glass-card p-5">
          <h3 className="text-sm font-bold mb-4 flex items-center gap-2 uppercase tracking-wide" style={{ color: '#D4AF37', fontFamily: "'Cinzel', serif" }}>
            <i className="fa-solid fa-lightbulb" style={{ color: '#D4AF37' }}></i> Viral Title Ideas
          </h3>
          <div className="grid grid-cols-1 gap-3">
            {viralSuggestions.map((idea, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                style={{ background: 'rgba(212,175,55,0.03)', border: '1px solid rgba(212,175,55,0.08)' }}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="badge-gold">OPTION {idx + 1}</span>
                    <h4 className="text-sm font-bold leading-tight" style={{ color: '#E8E0D0' }}>{idea.hook_title}</h4>
                  </div>
                  <div className="text-xs pl-1 italic" style={{ color: 'rgba(232,224,208,0.4)' }}>
                    <i className="fa-solid fa-lightbulb" style={{ color: '#D4AF37', marginRight: '4px' }}></i>{idea.outline_idea}
                  </div>
                </div>
                <button
                  onClick={() => onUseStrategy(idea.hook_title)}
                  className="shrink-0 btn-gold text-xs px-4 py-2.5 flex items-center gap-2"
                >
                  <i className="fa-solid fa-bolt"></i> KÍCH HOẠT
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
