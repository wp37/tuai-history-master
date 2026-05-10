# TUAI HISTORY MASTER

**AI Multicultural Historical Storytelling Suite** — Một công cụ AI mạnh mẽ để phân tích, sáng tạo và tối ưu nội dung lịch sử đa văn hóa trên mọi nền tảng.

## 5 Tính Năng Chính

| Tab | Mô Tả |
|-----|--------|
| **1. Phân Tích Lịch Sử Viral** | Phân tích chiến lược, revenue, audio, engagement của video lịch sử viral |
| **2. Kịch Bản Lịch Sử** | Tạo kịch bản đa văn hóa với voice + visual prompts theo phong cách 14 visual styles |
| **3. Studio Sáng Tạo** | Hiển thị và xuất video prompts + image prompts |
| **4. Phân Phối Đa Nền Tảng** | SEO checklist, keywords, viral titles, thumbnail prompts |
| **5. Chiến Lược Giáo Dục** | Phân tích thị trường, chân dung khách hàng, chiến lược kinh doanh |

## API Integration

Multi-provider với retry logic và round-robin:
1. **Google Gemini** (Priority 1) — Gemini 2.0 Flash
2. **OpenRouter** (Backup) — Claude, GPT-4, Llama, DeepSeek
3. **OpenAI** (Alternative) — GPT-4 Turbo, GPT-3.5

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite 8
- **Styling**: Tailwind CSS v4 với custom glassmorphism design system
- **Icons**: Font Awesome 6
- **Fonts**: Cinzel (headings) + Inter (body)

## Design System

- **Background**: Deep charcoal `#0A0E17`
- **Primary**: Antique Gold `#D4AF37`
- **Secondary**: Bronze `#CD7F32`
- **Accent**: Copper `#B87333`
- **Glassmorphism**: `backdrop-blur-20px`, `rgba(255,255,255,0.03)` bg, `rgba(212,175,55,0.15)` border

## Development

```bash
npm install
npm run dev     # http://localhost:5173
npm run build   # Production build
```

## Deployment

Đã thiết lập GitHub Actions → Vercel auto-deploy trên mỗi push to `main`.

Để kích hoạt Vercel deployment:
1. Tạo tài khoản Vercel tại https://vercel.com
2. Import repo `wp37/tuai-history-master`
3. Thêm Vercel credentials vào GitHub repo Settings → Secrets:
   - `VERCEL_TOKEN`
   - `VERCEL_ORG_ID`
   - `VERCEL_PROJECT_ID`

## Project Structure

```
src/
├── App.tsx              # Main layout, sidebar, all tabs
├── index.css            # Design system (glassmorphism, gold theme)
├── components/
│   ├── Header.tsx       # Gold/black header
│   ├── ErrorToast.tsx  # Error notification
│   ├── SettingsModal.tsx # API config modal
│   └── tabs/
│       ├── SpyTab.tsx    # Video analysis
│       ├── StudioTab.tsx # Prompt display/export
│       ├── SeoTab.tsx    # SEO + thumbnail
│       └── MarketTab.tsx # Market analysis
├── data/
│   ├── types.ts         # StoreState, MODELS, SECONDS_PER_SCENE
│   ├── countries.ts     # 40+ cultural contexts
│   ├── prompts.ts       # System prompts, SEO checklist
│   └── visualStyles.ts # 14 visual styles
└── lib/
    ├── api.ts           # Multi-API call with retry
    └── utils.ts        # JSON parse, clipboard, YouTube fetch
```
