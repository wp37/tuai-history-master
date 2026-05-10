# 🛠️ SKILL — TUAI HISTORY MASTER BUILD GUIDE
> Cập nhật: 2026-05-10 | Tham chiếu mỗi lần build/deploy.

---

## 1. CẤU TRÚC DỰ ÁN

```
tuai-history-master/
├── index.html                     # Entry HTML (ở ROOT, không phải /src/)
├── src/
│   ├── main.tsx                   # React entry point
│   ├── App.tsx                    # ⭐ MAIN — State, routing, 5 tabs, API calls
│   ├── App.css                    # App-specific CSS
│   ├── index.css                  # ⭐ Design system (glassmorphism, gold theme)
│   ├── components/
│   │   ├── Header.tsx             # Gold header bar
│   │   ├── SettingsModal.tsx      # Multi-API config modal
│   │   ├── ErrorToast.tsx         # Error notification
│   │   └── tabs/
│   │       ├── SpyTab.tsx         # Kết quả phân tích video
│   │       ├── StudioTab.tsx      # Video/Image prompts display + export
│   │       ├── SeoTab.tsx         # SEO + thumbnail prompts
│   │       └── MarketTab.tsx      # Market analysis
│   ├── lib/
│   │   ├── api.ts                 # ⭐ CORE — Multi-API client (REST, không SDK)
│   │   └── utils.ts               # JSON parse, clipboard, YouTube fetch
│   └── data/
│       ├── types.ts               # StoreState, MODELS, SECONDS_PER_SCENE
│       ├── countries.ts           # 40+ cultural contexts
│       ├── prompts.ts             # 4 system prompts + SEO checklist
│       └── visualStyles.ts        # 14 visual styles
├── .gitignore
├── vite.config.ts                 # Vite + React + TailwindCSS v4
├── vercel.json                    # Deploy config + SPA rewrites
├── package.json
├── .github/workflows/deploy.yml   # GitHub Actions → Vercel auto-deploy
└── SKILL.md                       # File này
```

---

## 2. TECH STACK

| Layer | Công nghệ | Version |
|---|---|---|
| Framework | React | 19.x |
| Build | Vite | 8.x |
| Language | TypeScript | 6.x |
| CSS | TailwindCSS v4 (local, @tailwindcss/vite) | 4.3 |
| Fonts | Cinzel (headings) + Inter (body) — Google Fonts |
| Icons | Font Awesome 6.5 CDN |
| AI Primary | Google Gemini REST API | v1beta |
| AI Model | `gemini-2.5-flash` |
| AI Backup | OpenRouter, OpenAI |
| Deploy | Vercel + GitHub Actions |

---

## 3. QUY TẮC API (BẮT BUỘC)

### 3.1 Kiến trúc API — Multi-provider REST (KHÔNG dùng SDK)

```
App dùng fetch() trực tiếp, KHÔNG import SDK.
Flow: Google Gemini → OpenRouter → OpenAI (fallback chain)
```

### 3.2 Google Gemini REST API

```typescript
// ✅ ĐÚNG — REST API trực tiếp
const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODELS.text}:generateContent?key=${apiKey}`;
const body = {
  contents: [{ role: "user", parts: [{ text: prompt }] }],
  systemInstruction: { parts: [{ text: systemPrompt }] },
  generationConfig: { responseMimeType: "application/json" }
};
const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
```

### 3.3 API Key Management

```
- User nhập keys qua SettingsModal
- Lưu vào localStorage (hm_key_pool, hm_openrouter_key, hm_openai_key, etc.)
- Hỗ trợ NHIỀU Google API keys với round-robin rotation
- Tự động rotate key khi gặp lỗi 429
```

### 3.4 Retry Logic (Google)

```
- 6 retries tối đa với key rotation
- 429 (quota)  →  Backoff: 2s, 4s, 6s... + rotate key
- Lỗi khác    →  Retry nhanh 1s + rotate key
- Thất bại    →  Fallback sang OpenRouter → OpenAI
```

### 3.5 OpenRouter & OpenAI

```
- OpenRouter: POST https://openrouter.ai/api/v1/chat/completions
- OpenAI: POST https://api.openai.com/v1/chat/completions
- Cả hai dùng messages format: [{ role: "system", content }, { role: "user", content }]
- response_format: { type: "json_object" }
```

---

## 4. 5 TABS & SYSTEM PROMPTS

| Tab | Prompt | Chức năng |
|-----|--------|-----------|
| SPY (Analyze) | `SYSTEM_PROMPT_IQ180_HISTORY_ANALYST` | Phân tích video lịch sử viral |
| SCRIPT | `SYSTEM_PROMPT_HISTORICAL_SCRIPTWRITER` | Tạo kịch bản đa văn hóa |
| STUDIO | (Không gọi API) | Hiển thị + export prompts |
| SEO | `SYSTEM_PROMPT_SEO_MASTER` | Tối ưu keywords, titles, thumbnails |
| MARKET | `SYSTEM_PROMPT_MARKET_ANALYST` | Phân tích thị trường, chiến lược KD |

---

## 5. DESIGN SYSTEM

```
Background:  #0B0F1A (deep charcoal)
Primary:     #D4AF37 (antique gold)
Secondary:   #CD7F32 (bronze)
Accent:      #B87333 (copper)
Text:        #E8E0D0 (cream)

Glass:       backdrop-blur-20px, rgba(255,255,255,0.04) bg
Borders:     rgba(212,175,55,0.12)
Font Display: 'Cinzel', serif
Font Body:    'Inter', sans-serif
```

CSS Classes: `glass-card`, `glass-input`, `glass-select`, `btn-gold`, `btn-gold-outline`, `section-label`, `stat-card`, `nav-item`, `badge-gold`, `gold-divider`, `animate-shimmer`

---

## 6. COMMANDS

```bash
npm run dev          # Dev server (port 5173)
npm run build        # tsc + vite build → /dist
npm run lint         # ESLint
```

---

## 7. CHECKLIST TRƯỚC DEPLOY

- [ ] Font Awesome CDN có trong `index.html`
- [ ] Không có `process.env` trong code
- [ ] `npm run build` thành công (0 TypeScript errors)
- [ ] `vercel.json` có `rewrites` cho SPA
- [ ] Test: mở app → Settings tự bật → nhập key → Spy module → kết quả JSON
- [ ] Export CSV/TXT hoạt động

---

## 8. VERCEL CONFIG

```json
{
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

**Vite config:**
```typescript
// vite.config.ts — Standard root (index.html ở root, KHÔNG trong /src/)
{
  plugins: [react(), tailwindcss()]
}
```

---

## 9. TROUBLESHOOTING

| Lỗi | Fix |
|---|---|
| Icons không hiển thị | Kiểm tra Font Awesome CDN trong index.html |
| Build fail `&&` trên Windows | Dùng `cmd` thay PowerShell, hoặc chạy `npx tsc -b` rồi `npx vite build` |
| Build fail TypeScript | Chạy `npx tsc -b --noEmit` để xem lỗi cụ thể |
| API 429 | Thêm nhiều Google API keys, hệ thống tự rotate |
| All APIs failed | Bật OpenRouter/OpenAI backup trong Settings |
| CSV header sai | Đảm bảo dùng backtick `` ` `` thay `"` cho template literals |

---

## 10. KHÁC BIỆT VỚI DHARMA MASTER

| Hạng mục | Dharma Master | History Master |
|----------|--------------|----------------|
| SDK | `@google/generative-ai` (import) | REST API (fetch) |
| API Keys | 1 key duy nhất | Multi-key pool + rotation |
| Backup API | Không | OpenRouter + OpenAI |
| CSS | TailwindCSS CDN | TailwindCSS v4 local |
| Vite root | `src/` | Root `/` (standard) |
| index.html | Trong `/src/` | Ở root `/` |
| Tabs | 3 (spy/script/studio) | 5 (+seo, +market) |
| Design | Amber/dark | Gold glassmorphism |

---

> 📌 Mọi tính năng cần AI → gọi `callAI()` từ `lib/api.ts`. KHÔNG tạo fetch call mới trực tiếp.
