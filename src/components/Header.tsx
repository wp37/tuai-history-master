interface Props {
  keyCount: number;
  uiLanguage: 'vi' | 'en';
  onToggleLang: () => void;
  onOpenSettings: () => void;
}

export default function Header({ keyCount, uiLanguage, onToggleLang, onOpenSettings }: Props) {
  return (
    <header
      className="sticky top-0 z-50"
      style={{
        background: 'rgba(10, 14, 23, 0.88)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderBottom: '1px solid rgba(212, 175, 55, 0.1)',
      }}
    >
      <div style={{ height: '2px', background: 'linear-gradient(90deg, transparent 0%, #D4AF37 30%, #F4D03F 50%, #D4AF37 70%, transparent 100%)' }} />

      <div className="max-w-[1800px] mx-auto px-4 md:px-6 py-3 md:py-4 flex justify-between items-center gap-4">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div
            className="relative shrink-0"
            style={{
              background: 'linear-gradient(135deg, rgba(212,175,55,0.15), rgba(205,127,50,0.08))',
              border: '1px solid rgba(212,175,55,0.25)',
              boxShadow: '0 0 20px rgba(212,175,55,0.1), inset 0 1px 0 rgba(255,255,255,0.1)',
              borderRadius: '12px',
              padding: '10px 12px',
            }}
          >
            <i className="fa-solid fa-landmark" style={{ color: '#D4AF37', fontSize: '18px' }} />
            <div style={{
              position: 'absolute', inset: 0, borderRadius: '12px',
              background: 'radial-gradient(ellipse at center, rgba(212,175,55,0.2) 0%, transparent 70%)',
              pointerEvents: 'none',
            }} />
          </div>
          <div>
            <h1 className="font-display text-xl md:text-2xl tracking-wide" style={{ color: '#E8E0D0' }}>
              TUAI <span className="animate-shimmer">HISTORY MASTER</span>
            </h1>
            <p style={{ fontSize: '8px', color: '#A8862A', letterSpacing: '0.2em', fontWeight: 700, fontFamily: "'Cinzel', serif", marginTop: '1px' }}>
              IQ 180 &bull; GLOBAL HISTORICAL STORYTELLING SUITE
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 md:gap-3">
          <a
            href="https://zalo.me/0814666040"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl text-xs transition-all"
            style={{
              background: 'rgba(212, 175, 55, 0.08)',
              border: '1px solid rgba(212, 175, 55, 0.2)',
              color: '#D4AF37',
            }}
          >
            <i className="fa-solid fa-headset" style={{ color: '#D4AF37' }} />
            <span className="hidden md:inline">Support 24/7: 0814.666.040</span>
            <span className="md:hidden">Support</span>
          </a>

          <button
            onClick={onToggleLang}
            className="flex items-center gap-1.5 px-2.5 py-2 rounded-xl text-xs transition-all"
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(212, 175, 55, 0.12)',
              color: 'rgba(232, 224, 208, 0.7)',
            }}
          >
            <span>{uiLanguage === 'vi' ? 'VN' : 'EN'}</span>
            <span style={{ color: '#D4AF37', fontWeight: 700 }}>{uiLanguage === 'vi' ? 'EN' : 'VI'}</span>
          </button>

          <button
            onClick={onOpenSettings}
            className="flex items-center gap-1.5 px-2.5 py-2 rounded-xl text-xs transition-all"
            style={{
              background: keyCount > 0 ? 'rgba(212, 175, 55, 0.08)' : 'rgba(255, 255, 255, 0.03)',
              border: `1px solid ${keyCount > 0 ? 'rgba(212, 175, 55, 0.25)' : 'rgba(212, 175, 55, 0.12)'}`,
              color: '#D4AF37',
            }}
          >
            <i className="fa-solid fa-key" style={{ color: '#D4AF37', fontSize: '11px' }} />
            <span className="hidden sm:inline">Config</span>
            <span style={{
              padding: '1px 6px',
              borderRadius: '20px',
              fontSize: '9px',
              fontWeight: 700,
              background: keyCount > 0 ? 'rgba(212, 175, 55, 0.15)' : 'rgba(255,255,255,0.05)',
              color: keyCount > 0 ? '#D4AF37' : 'rgba(232,224,208,0.3)',
              border: `1px solid ${keyCount > 0 ? 'rgba(212,175,55,0.3)' : 'rgba(255,255,255,0.1)'}`,
            }}>
              {keyCount}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
