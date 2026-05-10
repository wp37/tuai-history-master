interface Props {
  error: string | null;
  onClose: () => void;
}

export default function ErrorToast({ error, onClose }: Props) {
  if (!error) return null;
  return (
    <div
      className="fixed top-20 right-4 md:right-6 z-[60] animate-fade-in"
      style={{
        background: 'rgba(10, 14, 23, 0.96)',
        border: '1px solid rgba(212, 175, 55, 0.35)',
        color: '#CD7F32',
        padding: '14px 18px',
        borderRadius: '12px',
        maxWidth: '380px',
        boxShadow: '0 0 30px rgba(212, 175, 55, 0.12), 0 10px 40px rgba(0,0,0,0.5)',
        backdropFilter: 'blur(10px)',
      }}
    >
      <div className="flex items-start gap-3">
        <i className="fa-solid fa-triangle-exclamation shrink-0 mt-0.5" style={{ color: '#D4AF37', fontSize: '16px' }} />
        <div style={{ color: '#E8E0D0', flex: 1 }}>
          <p className="text-xs leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>{error}</p>
          <button
            onClick={onClose}
            className="text-[10px] mt-2 transition-colors"
            style={{ color: 'rgba(212,175,55,0.6)' }}
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
