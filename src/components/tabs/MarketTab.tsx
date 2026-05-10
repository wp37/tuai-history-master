interface Props {
  marketTopic: string;
  setMarketTopic: (v: string) => void;
  results: unknown;
  loading: boolean;
  onAnalyze: () => void;
}

interface MarketData {
  customer_persona?: {
    demographics?: Record<string, string>;
    psychographics?: Record<string, string[]>;
  };
  market_potential?: Record<string, string>;
  product_recommendations?: Array<{
    category?: string;
    products?: Array<{ name?: string; price_range?: string; margin?: string }>;
    sourcing_links?: Array<{ url?: string; platform?: string }>;
  }>;
  sales_strategy?: Record<string, string>;
  profit_calculator?: Array<{ model?: string; monthly_sales?: string; profit?: string }>;
}

export default function MarketTab({ marketTopic, setMarketTopic, results, loading, onAnalyze }: Props) {
  const data = results as MarketData | null;
  const persona = data?.customer_persona;
  const potential = data?.market_potential;
  const products = data?.product_recommendations || [];
  const strategy = data?.sales_strategy;
  const calculator = data?.profit_calculator || [];

  return (
    <div className="p-8 animate-slide-in-right relative z-10">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-[32px] font-bold mb-3" style={{ fontFamily: "'Cinzel', serif", color: '#E8E0D0', lineHeight: 1.2 }}>
            Chiến Lược <span className="animate-shimmer">Kinh Doanh</span> Triệu Đô
          </h2>
          <p className="text-base" style={{ color: 'rgba(232,224,208,0.45)' }}>
            Mô hình kiếm tiền thụ động, phân tích thị trường và chân dung khách hàng
          </p>
        </div>

        <div className="mb-6 flex gap-3 items-center">
          <input
            value={marketTopic}
            onChange={e => setMarketTopic(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && onAnalyze()}
            placeholder="Nhập lĩnh vực (VD: Khóa học AI, Sản phẩm vật lý, Coaching)..."
            className="flex-1 glass-input px-6 text-[15px]"
            style={{ height: '56px' }}
          />
          <button onClick={onAnalyze} disabled={loading}
            className="btn-gold px-6 shrink-0 flex items-center gap-2 text-sm"
            style={{ height: '56px' }}>
            {loading ? <><i className="fa-solid fa-sync fa-spin" /> ĐANG...</> : <><i className="fa-solid fa-bullseye" /> PHÂN TÍCH</>}
          </button>
        </div>

        {!data ? (
          <div className="glass-card flex flex-col items-center justify-center py-20 text-center">
            <i className="fa-solid fa-money-bill-trend-up mb-4 text-3xl" style={{ color: 'rgba(212,175,55,0.3)' }}></i>
            <p className="text-base" style={{ fontFamily: "'Cinzel', serif", color: 'rgba(232,224,208,0.4)' }}>Nhập chủ đề để AI xây dựng chiến lược kinh doanh</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="result-grid-2">
              {persona && (
                <div className="glass-card p-5">
                  <h3 className="text-sm font-bold mb-4 flex items-center gap-2 uppercase tracking-wide" style={{ color: '#D4AF37', fontFamily: "'Cinzel', serif" }}>
                    <i className="fa-solid fa-user-astronaut"></i> CHÂN DUNG KHÁCH HÀNG
                  </h3>
                  {persona.demographics && (
                    <div className="mb-4">
                      <div className="text-[10px] font-bold uppercase mb-2" style={{ color: 'rgba(232,224,208,0.3)' }}>Demographics</div>
                      <div className="space-y-1">
                        {Object.entries(persona.demographics).map(([key, val]) => (
                          <div key={key} className="text-xs" style={{ color: 'rgba(232,224,208,0.7)' }}>
                            <span style={{ color: '#D4AF37', fontWeight: 500 }}>{key}:</span> {val}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {persona.psychographics && (
                    <div>
                      <div className="text-[10px] font-bold uppercase mb-2" style={{ color: 'rgba(232,224,208,0.3)' }}>Psychographics</div>
                      <div className="flex flex-wrap gap-1">
                        {Object.values(persona.psychographics).flat().filter(Boolean).map((item, i) => (
                          <span key={i} className="badge-gold">{String(item)}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {potential && (
                <div className="glass-card p-5">
                  <h3 className="text-sm font-bold mb-4 flex items-center gap-2 uppercase tracking-wide" style={{ color: '#D4AF37', fontFamily: "'Cinzel', serif" }}>
                    <i className="fa-solid fa-chart-line"></i> TIỀM NĂNG THỊ TRƯỜNG
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(potential).map(([key, val]) => (
                      <div key={key} className="p-3 rounded-xl" style={{ background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.1)' }}>
                        <div className="text-[10px] uppercase mb-1" style={{ color: 'rgba(232,224,208,0.3)' }}>{key}</div>
                        <div className="text-sm font-black" style={{ color: '#D4AF37', fontFamily: "'Cinzel', serif" }}>{val}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {products.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-widest flex items-center gap-2" style={{ color: '#D4AF37', fontFamily: "'Cinzel', serif" }}>
                  <i className="fa-solid fa-boxes-packing"></i> GỢI Ý SẢN PHẨM
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {products.map((cat, i) => (
                    <div key={i} className="glass-card overflow-hidden" style={{ borderColor: 'rgba(212,175,55,0.08)' }}>
                      <div className="p-3" style={{ background: 'rgba(212,175,55,0.05)', borderBottom: '1px solid rgba(212,175,55,0.08)' }}>
                        <div className="text-[10px] font-bold uppercase tracking-wider" style={{ color: '#D4AF37', fontFamily: "'Cinzel', serif" }}>{cat.category || 'Category'}</div>
                      </div>
                      <div className="p-3 space-y-3">
                        {cat.products?.map((p, j) => (
                          <div key={j} className="flex justify-between items-start gap-2 group">
                            <div className="text-xs font-medium" style={{ color: 'rgba(232,224,208,0.8)' }}>{p.name || 'Product'}</div>
                            <div className="text-[10px] text-right">
                              <div style={{ color: 'rgba(232,224,208,0.3)' }}>{p.price_range || 'N/A'}</div>
                              <div style={{ color: '#D4AF37', fontWeight: 700 }}>M: {p.margin || 'N/A'}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {strategy && Object.keys(strategy).length > 0 && (
                <div className="glass-card p-5">
                  <h3 className="text-sm font-bold mb-4 flex items-center gap-2 uppercase tracking-wide" style={{ color: '#CD7F32', fontFamily: "'Cinzel', serif" }}>
                    <i className="fa-solid fa-bullseye"></i> CHIẾN LƯỢC BÁN HÀNG
                  </h3>
                  <div className="space-y-4">
                    {Object.entries(strategy).map(([key, val]) => (
                      <div key={key} className="flex gap-3 items-start">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-1" style={{ background: 'rgba(205,127,50,0.1)', border: '1px solid rgba(205,127,50,0.2)' }}>
                          <i className="fa-solid fa-video" style={{ color: '#CD7F32', fontSize: '12px' }}></i>
                        </div>
                        <div>
                          <div className="text-[10px] font-bold uppercase" style={{ color: 'rgba(232,224,208,0.3)' }}>{key.replace(/_/g, ' ')}</div>
                          <div className="text-xs" style={{ color: 'rgba(232,224,208,0.7)' }}>{val}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {calculator.length > 0 && (
                <div className="glass-card p-5">
                  <h3 className="text-sm font-bold mb-4 flex items-center gap-2 uppercase tracking-wide" style={{ color: '#D4AF37', fontFamily: "'Cinzel', serif" }}>
                    <i className="fa-solid fa-calculator"></i> DỰ TOÁN LỢI NHUẬN
                  </h3>
                  <div className="space-y-3">
                    {calculator.map((scen, i) => (
                      <div key={i} className="p-3 rounded-lg flex justify-between items-center" style={{ background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.1)' }}>
                        <div>
                          <div className="text-xs font-bold" style={{ color: '#E8E0D0' }}>{scen.model || 'Model'}</div>
                          <div className="text-[10px]" style={{ color: 'rgba(232,224,208,0.3)' }}>{scen.monthly_sales || 'N/A'}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-black" style={{ color: '#D4AF37', fontFamily: "'Cinzel', serif" }}>{scen.profit || 'N/A'}</div>
                          <div className="text-[9px]" style={{ color: 'rgba(232,224,208,0.2)' }}>net profit/mo</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
