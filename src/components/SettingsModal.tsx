import { useState } from 'react';

interface Props {
  keyPool: string[];
  onSave: (keys: string[]) => void;
  onClose: () => void;
}

export default function SettingsModal({ keyPool, onSave, onClose }: Props) {
  const [keys, setKeys] = useState<string[]>(keyPool.length > 0 ? keyPool : ['']);

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

  const handleSave = () => {
    onSave(keys.filter(k => k.trim() !== ''));
    onClose();
  };

  const validCount = keys.filter(k => k.trim().startsWith('AIza')).length;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in"
      style={{ background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(8px)' }}
      onClick={(e) => { if (e.target === e.currentTarget && validCount > 0) onClose(); }}
    >
      <div
        className="w-full max-w-md rounded-2xl overflow-hidden"
        style={{
          background: 'rgba(10, 14, 23, 0.97)',
          border: '1px solid rgba(212, 175, 55, 0.15)',
          boxShadow: '0 0 60px rgba(212,175,55,0.08), 0 25px 80px rgba(0,0,0,0.6)',
        }}
      >
        {/* Header */}
        <div className="p-6 flex justify-between items-center" style={{ borderBottom: '1px solid rgba(212,175,55,0.1)' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.2), rgba(205,127,50,0.1))', border: '1px solid rgba(212,175,55,0.3)' }}>
              <i className="fa-solid fa-key" style={{ color: '#D4AF37', fontSize: '16px' }}></i>
            </div>
            <div>
              <h3 className="font-bold text-lg" style={{ fontFamily: "'Cinzel', serif", color: '#E8E0D0' }}>
                Gemini API Key
              </h3>
              <p style={{ fontSize: '11px', color: 'rgba(212,175,55,0.5)' }}>Nhập key để sử dụng AI</p>
            </div>
          </div>
          {validCount > 0 && (
            <button onClick={onClose} className="p-2 rounded-xl transition-all"
              style={{ color: 'rgba(232,224,208,0.4)', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(212,175,55,0.1)' }}>
              <i className="fa-solid fa-xmark"></i>
            </button>
          )}
        </div>

        {/* Guide */}
        <div className="px-6 pt-5">
          <div className="rounded-xl p-4 mb-4"
            style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.12)' }}>
            <div className="flex items-center gap-2 mb-3">
              <i className="fa-solid fa-circle-info" style={{ color: '#D4AF37', fontSize: '14px' }}></i>
              <span className="text-xs font-bold uppercase" style={{ color: '#D4AF37', fontFamily: "'Cinzel', serif", letterSpacing: '0.08em' }}>
                Hướng dẫn lấy API Key (Miễn phí)
              </span>
            </div>
            <ol className="space-y-2" style={{ fontSize: '12px', color: 'rgba(232,224,208,0.6)' }}>
              <li className="flex items-start gap-2">
                <span className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold"
                  style={{ background: 'rgba(212,175,55,0.15)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.3)' }}>1</span>
                <span>Vào <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer"
                  style={{ color: '#D4AF37', textDecoration: 'underline' }}>aistudio.google.com/app/apikey</a></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold"
                  style={{ background: 'rgba(212,175,55,0.15)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.3)' }}>2</span>
                <span>Đăng nhập Google → Bấm <strong style={{ color: '#D4AF37' }}>Create API Key</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold"
                  style={{ background: 'rgba(212,175,55,0.15)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.3)' }}>3</span>
                <span>Copy key (bắt đầu bằng <code style={{ color: '#CD7F32', fontSize: '11px' }}>AIza...</code>) và dán vào ô bên dưới</span>
              </li>
            </ol>
            <div className="mt-3 pt-3" style={{ borderTop: '1px solid rgba(212,175,55,0.08)' }}>
              <p style={{ fontSize: '10px', color: 'rgba(212,175,55,0.4)', fontStyle: 'italic' }}>
                <i className="fa-solid fa-lightbulb" style={{ marginRight: '4px' }}></i>
                Mẹo: Thêm nhiều key (từ nhiều Gmail) để tránh hết quota. Hệ thống tự động xoay key khi bị giới hạn.
              </p>
            </div>
          </div>
        </div>

        {/* Key Inputs */}
        <div className="px-6 pb-2">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase" style={{ color: 'rgba(232,224,208,0.5)', fontFamily: "'Cinzel', serif", letterSpacing: '0.08em' }}>
              <i className="fa-brands fa-google" style={{ color: '#D4AF37', marginRight: '6px' }}></i>
              Google Gemini API Keys
            </span>
            {validCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold"
                style={{ background: 'rgba(74,222,128,0.15)', color: '#4ADE80', border: '1px solid rgba(74,222,128,0.3)' }}>
                {validCount} key hoạt động
              </span>
            )}
          </div>
          <div className="space-y-2">
            {keys.map((k, i) => (
              <div key={i} className="flex gap-2">
                <input
                  type="password"
                  value={k}
                  onChange={e => updateKey(i, e.target.value)}
                  className="flex-1 glass-input p-3 text-xs font-mono"
                  placeholder="AIzaSy..."
                />
                <button
                  onClick={() => removeKey(i)}
                  className="p-3 rounded-xl transition-all shrink-0"
                  style={{ color: 'rgba(232,224,208,0.4)', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(212,175,55,0.08)' }}
                >
                  <i className="fa-solid fa-trash"></i>
                </button>
              </div>
            ))}
            <button
              onClick={addKey}
              className="text-xs flex items-center gap-1 mt-1 transition-colors"
              style={{ color: 'rgba(212,175,55,0.5)' }}
            >
              <i className="fa-solid fa-plus"></i> Thêm Key (Gmail khác)
            </button>
          </div>
        </div>

        {/* Warning if no valid key */}
        {validCount === 0 && (
          <div className="mx-6 mt-3 p-3 rounded-xl flex items-center gap-2"
            style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
            <i className="fa-solid fa-triangle-exclamation" style={{ color: '#EF4444', fontSize: '13px' }}></i>
            <span style={{ fontSize: '11px', color: '#F87171' }}>
              Bạn cần ít nhất 1 API Key để sử dụng app. Key bắt đầu bằng "AIza..."
            </span>
          </div>
        )}

        {/* Footer */}
        <div className="p-6">
          <p className="text-[10px] italic mb-4" style={{ color: 'rgba(212,175,55,0.3)' }}>
            <i className="fa-solid fa-shield-halved" style={{ marginRight: '4px' }}></i>
            Keys được lưu an toàn trong trình duyệt của bạn, không gửi đi đâu.
          </p>
          <button onClick={handleSave}
            className={`w-full py-3.5 rounded-xl font-bold uppercase tracking-widest text-sm flex items-center justify-center gap-2 transition-all ${validCount > 0 ? 'btn-gold' : ''}`}
            style={validCount === 0 ? { background: 'rgba(255,255,255,0.05)', color: 'rgba(232,224,208,0.3)', border: '1px solid rgba(212,175,55,0.08)', cursor: 'not-allowed' } : {}}
            disabled={validCount === 0}
          >
            <i className={`fa-solid ${validCount > 0 ? 'fa-check-circle' : 'fa-lock'}`}></i>
            {validCount > 0 ? 'Lưu & Bắt Đầu' : 'Nhập API Key để tiếp tục'}
          </button>
        </div>
      </div>
    </div>
  );
}
