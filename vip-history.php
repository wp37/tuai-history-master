<?php
// Start session if not already started
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Enable detailed error logging (disable in production)
error_reporting(E_ALL);
ini_set('log_errors', 1);
ini_set('display_errors', 0); // Set to 1 for debugging, 0 for production

// 1. KẾT NỐI HỆ THỐNG BẢO MẬT
require_once '../includes/functions.php';

// 2. KIỂM TRA ĐĂNG NHẬP
if (!isset($_SESSION['user_login']) || $_SESSION['user_login'] !== true) {
    header("Location: ../index.php");
    exit();
}

// 3. KIỂM TRA QUYỀN TRUY CẬP
check_permission('vip-history'); // Tool ID for vip-history Creator

// 4. TÍNH TRẠNG THÁI VIP (dựa trên keys.json giống dashboard)
$currentKey = $_SESSION['current_key'] ?? '';
$allKeys = loadDB('keys.json');
$keyData = $allKeys[$currentKey] ?? [];

// Chuẩn hoá type để tránh lỗi 'free ' / 'FREE' làm sai VIP
$expireDateStr = $keyData['expire'] ?? null;
$keyTypeRaw = $keyData['type'] ?? 'free';
$keyType = strtolower(trim((string)$keyTypeRaw));

$isVip = false;
// VIP = không phải free (và còn hạn nếu có expire)
if ($keyType !== 'free') {
    $isExpired = false;
    if (!empty($expireDateStr) && strtotime($expireDateStr) <= time()) {
        $isExpired = true;
    }
    if (!$isExpired) $isVip = true;
}
?>

<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title> HISTORY MASTER - AI MULTICULTURAL HISTORICAL STORYTELLING SUITE</title>
    
    <!-- 1. CÔNG NGHỆ & THƯ VIỆN HỖ TRỢ -->
    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    <!-- Google Fonts 'Inter' -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
    <!-- FontAwesome (Thay thế Lucide Icons theo yêu cầu) -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <!-- Moment.js -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.4/moment.min.js"></script>
    
    <!-- Config Tailwind -->
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    fontFamily: { sans: ['Inter', 'sans-serif'] },
                    animation: {
                        'fade-in': 'fadeIn 0.5s ease-out',
                        'slide-in-right': 'slideInRight 0.5s ease-out',
                        'slide-in-bottom': 'slideInBottom 0.5s ease-out',
                    },
                    keyframes: {
                        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
                        slideInRight: { '0%': { transform: 'translateX(20px)', opacity: '0' }, '100%': { transform: 'translateX(0)', opacity: '1' } },
                        slideInBottom: { '0%': { transform: 'translateY(20px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
                    }
                }
            }
        }
    </script>

    <style>
        /* History Master Premium Palette - Heritage & Wisdom */
        :root {
            --primary-gold: #fbbf24;
            --primary-bronze: #92400e;
            --primary-amber: #d97706;
            --bg-dark: #0f172a;
            --bg-darker: #020617;
            --accent-teal: #14b8a6;
            --text-main: #f8fafc;
            --text-dim: #94a3b8;
        }

        /* Elegant Scrollbar */
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-track { 
            background: rgba(15, 23, 42, 0.5);
            border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb { 
            background: linear-gradient(180deg, var(--primary-gold), var(--primary-orange));
            border-radius: 10px;
            border: 2px solid transparent;
            background-clip: padding-box;
        }
        ::-webkit-scrollbar-thumb:hover { 
            background: linear-gradient(180deg, #fcd34d, #fbbf24);
        }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        
        body {
            background-color: var(--bg-darker);
            background-image: 
                radial-gradient(at 0% 0%, rgba(251, 191, 36, 0.1) 0, transparent 50%), 
                radial-gradient(at 50% 0%, rgba(220, 38, 38, 0.05) 0, transparent 50%),
                radial-gradient(at 100% 0%, rgba(56, 189, 248, 0.1) 0, transparent 50%);
            background-attachment: fixed;
            color: var(--text-main);
        }

        /* Animated background mesh */
        .bg-mesh {
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.02'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
            z-index: -1;
            pointer-events: none;
        }
    </style>
</head>
<body class="min-h-screen flex flex-col font-sans selection:bg-purple-500/30">

    <header class="bg-slate-900/80 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50 shadow-2xl">
        <div class="max-w-[1800px] mx-auto px-6 py-4 flex justify-between items-center">
            <div class="flex items-center gap-4">
                <div class="bg-gradient-to-br from-amber-600 via-amber-700 to-amber-900 p-3 rounded-2xl shadow-lg relative overflow-hidden group">
                    <div class="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <i class="fa-solid fa-landmark text-white text-xl relative z-10"></i>
                </div>
                <div>
                    <h1 class="text-2xl font-black tracking-tight">
                        <span class="text-white">EZTOOLS</span> 
                        <span class="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-700">HISTORY MASTER</span>
                    </h1>
                    <p class="text-[10px] text-amber-500 tracking-[0.2em] font-bold mt-0.5">IQ 180 • GLOBAL HISTORICAL STORYTELLING SUITE</p>
                </div>
            </div>
            <div class="flex items-center gap-4">
                <a href="https://zalo.me/0814666040" target="_blank" rel="noopener noreferrer" class="hidden md:flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold bg-teal-600 text-white border border-teal-500 hover:bg-teal-700 transition-all shadow-[0_2px_12px_rgba(20,184,166,0.3)] hover:shadow-[0_4px_20px_rgba(20,184,166,0.5)] group">
                    <i class="fa-solid fa-headset text-white"></i> 
                    <span class="group-hover:scale-105 transition-transform">Support 24/7: 0814.666.040</span>
                </a>
                <!-- Language Switcher -->
                <button onclick="switchLanguage()" class="flex items-center gap-2 px-3 py-2 rounded-full text-xs font-bold bg-[#260a0a] text-slate-300 border border-white/10 hover:bg-[#3d1212] transition-all hover:text-white">
                    <span id="currentLangFlag">🇻🇳</span>
                    <span id="currentLangCode" data-i18n="language_switch">English</span>
                </button>
                <button onclick="toggleSettings()" class="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold bg-[#260a0a] text-red-200/50 border border-red-900/30 hover:bg-[#3d1212] transition-all hover:text-red-200">
                    <i class="fa-solid fa-key"></i> Config <span id="keyCountBadge" class="ml-1 px-1.5 py-0.5 rounded-full text-[9px] bg-red-950 text-red-400">0</span>
                </button>
                <a href="../dashboard.php"
   class="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold
          bg-slate-700 text-slate-300
          hover:bg-red-600 hover:text-white
          transition-all shadow-sm">
    <i data-lucide="log-out" class="w-3.5 h-3.5"></i>
    Về Trang Chủ
</a>
            </div>
        </div>
    </header>

    <!-- ERROR TOAST -->
    <div id="errorToast" class="hidden fixed top-20 right-6 z-[60] bg-[#1a0505]/95 border border-red-500/50 text-red-200 p-4 rounded-xl shadow-[0_0_30px_rgba(220,38,38,0.2)] max-w-sm backdrop-blur-md animate-fade-in">
        <div class="flex items-start gap-3">
            <i class="fa-solid fa-triangle-exclamation shrink-0 text-red-500 mt-1"></i>
            <div>
                <p id="errorMessage" class="text-xs mt-1">Error message here</p>
                <button onclick="document.getElementById('errorToast').classList.add('hidden')" class="text-[10px] underline mt-2 hover:text-white">Đóng</button>
            </div>
        </div>
    </div>

    <!-- SETTINGS MODAL -->
    <div id="settingsModal" class="hidden fixed inset-0 bg-black/95 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
        <div class="bg-[#1a0505] border border-red-900/30 w-full max-w-lg rounded-2xl p-6 shadow-[0_0_50px_rgba(220,38,38,0.15)]">
            <div class="flex justify-between mb-4"><h3 class="font-bold text-red-100 flex items-center gap-2"><i class="fa-solid fa-file-contract text-red-500"></i> EVIDENCE LOCKER</h3><button onclick="toggleSettings()" class="text-red-500/50 hover:text-red-200"><i class="fa-solid fa-xmark"></i></button></div>
            <div class="space-y-4">
                <div class="bg-[#260a0a] p-3 rounded-xl border border-red-500/10 mb-4">
                    <div class="text-[10px] font-bold text-red-500/70 uppercase mb-2 flex items-center gap-1"><i class="fa-solid fa-key"></i> CLEARANCE KEYS</div>
                    <div class="flex gap-2">
                        <a href="https://aistudio.google.com/app/api-keys" target="_blank" rel="noopener noreferrer" class="flex-1 py-2 px-3 bg-red-900/10 text-red-400 border border-red-500/20 rounded-lg text-xs font-bold hover:bg-red-900/20 transition-all flex items-center justify-center gap-1">
                            <i class="fa-brands fa-google text-red-400"></i> Google AI Studio
                        </a>
                    </div>
                </div>
                <div>
                    <label class="text-xs font-bold text-red-500/70 block mb-2">Gemini API Keys</label>
                    <div id="keyInputsContainer" class="max-h-[200px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-red-900 scrollbar-track-[#260a0a]"></div>
                    <button onclick="addKeyInput('')" class="text-xs text-red-400 hover:underline flex items-center gap-1 mt-2"><i class="fa-solid fa-plus"></i> Add New Key</button>
                </div>
                <p class="text-[10px] text-red-600/50 italic">Keys are encrypted in classified storage.</p>
            </div>
        </div>
    </div>

    <!-- MAIN CONTENT -->
    <main class="flex-1 max-w-[1800px] mx-auto w-full p-6 flex flex-col md:flex-row gap-6 md:h-[calc(100vh-70px)] h-auto">
        
        <!-- SIDEBAR TABS -->
        <div class="w-full md:w-64 flex md:flex-col gap-2 shrink-0 overflow-x-auto md:overflow-visible pb-2 md:pb-0 scrollbar-thin">
                <button onclick="switchTab('spy')" id="tab-btn-spy" class="p-5 rounded-2xl text-left border-2 transition-all duration-200 shrink-0 min-w-[200px] md:min-w-0 bg-white/70 backdrop-blur-sm border-amber-400/50 text-amber-900 shadow-[0_2px_12px_rgba(212,165,116,0.2)] hover:bg-white/85 hover:border-amber-500/60 hover:shadow-[0_4px_20px_rgba(212,165,116,0.3)] relative">
                    <div class="flex items-center gap-3 mb-2"><i class="fa-solid fa-fire-alt text-xl text-amber-700"></i> <span class="font-black text-sm" data-i18n="tab_analyze">1. PHÂN TÍCH LỊCH SỬ VIRAL</span></div>
                    <p class="text-[10px] opacity-60" data-i18n="tab_analyze_desc">Phân Tích Video Lịch Sử & Nội Dung Truyền Cảm Hứng</p>
                </button>
                <button onclick="switchTab('script')" id="tab-btn-script" class="p-5 rounded-2xl text-left border-2 transition-all duration-200 shrink-0 min-w-[200px] md:min-w-0 bg-white/50 backdrop-blur-sm border-amber-200/30 text-amber-800/80 shadow-[0_2px_8px_rgba(212,165,116,0.1)] hover:bg-white/70 hover:border-orange-300/40 hover:text-amber-900 hover:shadow-[0_4px_16px_rgba(216,155,106,0.2)] relative">
                    <div class="flex items-center gap-3 mb-2"><i class="fa-solid fa-scroll text-xl"></i> <span class="font-black text-sm" data-i18n="tab_script">2. KỊCH BẢN LỊCH SỬ SÂNG TẠO</span></div>
                    <p class="text-[10px] opacity-60" data-i18n="tab_script_desc">Kịch bản kể chuyện lịch sử đa văn hóa</p>
                </button>
                <button onclick="switchTab('studio')" id="tab-btn-studio" class="p-5 rounded-2xl text-left border-2 transition-all duration-200 shrink-0 min-w-[200px] md:min-w-0 bg-white/50 backdrop-blur-sm border-amber-200/30 text-amber-800/80 shadow-[0_2px_8px_rgba(212,165,116,0.1)] hover:bg-white/70 hover:border-purple-300/40 hover:text-purple-900 hover:shadow-[0_4px_16px_rgba(155,126,189,0.2)] relative">
                    <div class="flex items-center gap-3 mb-2"><i class="fa-solid fa-clapperboard text-xl"></i> <span class="font-black text-sm" data-i18n="tab_studio">3. STUDIO SÁNG TẠO VÔ HẠN</span></div>
                    <p class="text-[10px] opacity-60" data-i18n="tab_studio_desc">Prompt Video & Ảnh Đỉnh Cao</p>
                </button>
                <button onclick="switchTab('seo')" id="tab-btn-seo" class="p-5 rounded-2xl text-left border-2 transition-all duration-200 shrink-0 min-w-[200px] md:min-w-0 bg-white/50 backdrop-blur-sm border-amber-200/30 text-amber-800/80 shadow-[0_2px_8px_rgba(212,165,116,0.1)] hover:bg-white/70 hover:border-teal-300/40 hover:text-teal-900 hover:shadow-[0_4px_16px_rgba(107,155,158,0.2)] relative">
                    <div class="flex items-center gap-3 mb-2"><i class="fa-solid fa-chart-line text-xl"></i> <span class="font-black text-sm">4. PHÂN PHỐI ĐA NỀN TẢNG</span></div>
                    <p class="text-[10px] opacity-60">SEO & Viral Content Strategy</p>
                </button>
                <button onclick="switchTab('market')" id="tab-btn-market" class="p-5 rounded-2xl text-left border-2 transition-all duration-200 shrink-0 min-w-[200px] md:min-w-0 bg-white/50 backdrop-blur-sm border-amber-200/30 text-amber-800/80 shadow-[0_2px_8px_rgba(212,165,116,0.1)] hover:bg-white/70 hover:border-rose-300/40 hover:text-rose-900 hover:shadow-[0_4px_16px_rgba(244,63,94,0.2)] relative">
                    <div class="flex items-center gap-3 mb-2"><i class="fa-solid fa-graduation-cap text-xl"></i> <span class="font-black text-sm">5. CHIẾN LƯỢC GIÁO DỤC</span></div>
                    <p class="text-[10px] opacity-60">Khóa học lịch sử & Nội dung tri thức</p>
                </button>
        </div>

        <!-- CONTENT AREA -->
        <div class="flex-1 bg-[#0a0a0a]/60 rounded-2xl border border-white/5 p-6 md:overflow-y-auto scrollbar-thin relative min-h-[500px] backdrop-blur-md shadow-[inset_0_0_50px_-20px_rgba(100,0,255,0.1)]">
            
            <!-- 1. SPY MODULE -->
            <div id="tab-content-spy" class="animate-slide-in-bottom">
                <div class="max-w-5xl mx-auto space-y-6">
                    <div class="bg-[#0f0f11] border border-white/10 p-6 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]">
                        <h2 class="text-xl font-bold text-white mb-4 flex items-center gap-2"><i class="fa-brands fa-youtube text-red-600"></i> Phân Tích Viral Historical Content & Video Storytelling</h2>
                        <div class="space-y-4">
                            <div class="flex gap-2">
                                <input id="ytUrlInput" placeholder="Dán link Video Lịch Sử / Tài liệu / Documentary / Historical Drama..." class="flex-1 bg-black border border-white/10 rounded-xl p-3 text-sm text-white outline-none focus:border-amber-500/50 placeholder-white/20">
                                <button onclick="clearSpy()" class="p-3 bg-[#1a1a1a] rounded-xl hover:bg-[#252525] border border-white/5"><i class="fa-solid fa-trash text-slate-400"></i></button>
                            </div>
                            <button id="btnSpyAnalyze" onclick="handleSpy()" class="w-full py-4 bg-amber-900/40 hover:bg-amber-800/40 border border-amber-500/30 text-amber-100 font-bold rounded-xl shadow-[0_0_20px_rgba(251,191,36,0.2)] flex items-center justify-center gap-2 transition-all">
                                <i class="fa-solid fa-brain text-lg"></i> PHÂN TÍCH CHIỀU SÂU LỊCH SỬ & CHIẾN LƯỢC
                            </button>
                        </div>
                    </div>
                    <!-- Spy Results Container -->
                    <div id="spyResultContainer" class="space-y-6 pb-10"></div>
                </div>
            </div>

            <!-- 2. SCRIPT MODULE -->
            <div id="tab-content-script" class="hidden animate-slide-in-right">
                <div class="max-w-5xl mx-auto space-y-6">
                    <div class="bg-[#0f0f11] border border-white/10 p-6 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]">
                        <h2 class="text-xl font-bold text-white mb-4 flex items-center gap-2"><i class="fa-solid fa-pen-fancy text-teal-400"></i> Quy Trình Sáng Tạo Kịch Bản Lịch Sử</h2>
                        
                        <div class="space-y-4 mb-6">
                            <!-- Topic -->
                            <div>
                                <div class="text-[10px] font-bold text-amber-500 uppercase mb-1">CHỦ ĐỀ LỊCH SỬ</div>
                                <input id="scriptTopicInput" class="w-full bg-black border border-amber-900/40 rounded-lg p-3 text-sm text-white outline-none focus:border-amber-500/50 placeholder-white/20" placeholder="VD: Chiến tranh Việt Nam, Đế chế La Mã, Cách mạng Công nghiệp, Thời kỳ Phục Hưng...">
                            </div>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div class="bg-[#151515] border border-white/5 rounded-xl p-4 relative overflow-hidden group">
                                    <div class="absolute top-0 left-0 w-1 h-full bg-blue-500/50"></div>
                                    <label class="text-xs font-bold text-slate-400 uppercase mb-3 block flex items-center gap-2"><i class="fa-solid fa-clock text-blue-400"></i> THỜI LƯỢNG (PHÚT)</label>
                                    <div class="flex items-center gap-5">
                                        <input type="number" id="durationInput" value="1" step="0.5" min="0.5" max="240" onchange="updateEstimations()" class="w-20 bg-black border border-white/10 rounded-lg p-3 text-2xl font-black text-white text-center outline-none focus:border-blue-500/50 shadow-inner">
                                        <div class="flex flex-col gap-1.5 text-xs">
                                            <div class="flex items-center gap-2"><span class="text-slate-500">Số cảnh (8s/shot):</span><span id="estScenes" class="font-bold text-green-400 text-base">~8 Cảnh</span></div>
                                            <div class="flex items-center gap-2"><span class="text-slate-500">Voice:</span><span id="estWords" class="font-bold text-purple-400 text-base">~130 từ</span></div>
                                        </div>
                                    </div>
                                </div>
                                <div class="bg-[#151515] border border-white/5 rounded-xl p-4 relative overflow-hidden flex flex-col justify-center">
                                    <label class="text-xs font-bold text-slate-400 uppercase mb-2 block flex items-center gap-2"><i class="fa-solid fa-globe text-orange-400"></i> THỊ TRƯỜNG MỤC TIÊU</label>
                                    <select id="languageSelect" class="w-full bg-black border border-white/10 rounded-lg p-3 text-sm text-white outline-none focus:border-purple-500/50 cursor-pointer">
                                        <!-- Options injected via JS -->
                                    </select>
                                </div>
                            </div>

                            <!-- Mode Display -->
                            <div id="modeDisplay" class="border rounded-xl p-4 transition-all flex items-start gap-4 bg-green-900/10 border-green-500/50">
                                <!-- Injected via JS -->
                            </div>

                            <!-- Visual Style -->
                            <div class="bg-[#151515] border border-white/5 rounded-xl p-4 relative overflow-hidden">
                                <label class="text-xs font-bold text-slate-400 uppercase mb-2 block flex items-center gap-2"><i class="fa-solid fa-palette text-pink-400"></i> PHONG CÁCH VISUAL</label>
                                <div id="styleButtons" class="grid grid-cols-2 md:grid-cols-3 gap-2">
                                    <!-- Injected via JS -->
                                </div>
                                <div id="styleRefContainer" class="mt-4 p-4 rounded-xl bg-pink-900/10 border-2 border-pink-500/40 hidden shadow-[0_0_20px_rgba(236,72,153,0.15)] animate-fade-in relative overflow-hidden">
                                    <div class="absolute top-0 right-0 p-2 opacity-10">
                                        <i class="fa-solid fa-om text-4xl"></i>
                                    </div>
                                    <div class="flex justify-between items-center mb-2">
                                        <div class="text-[11px] font-black text-pink-400 uppercase flex items-center gap-2 tracking-widest">
                                            <i class="fa-solid fa-signature"></i> MASTER STYLE TEMPLATE (SOURCE OF TRUTH)
                                        </div>
                                        <div class="text-[9px] px-2 py-0.5 rounded-full bg-pink-500 text-white font-bold animate-pulse">100% STANDARD</div>
                                    </div>
                                    <textarea id="styleRefPrompt" class="w-full bg-black/60 border border-pink-500/30 rounded-lg p-3 text-[12px] text-pink-50 font-medium italic leading-relaxed outline-none focus:border-pink-500 min-h-[80px] resize-none scrollbar-thin shadow-inner" placeholder="Describe the master style logic..."></textarea>
                                    <div class="mt-2 text-[10px] text-pink-300/80 flex justify-between items-center italic font-bold">
                                        <div class="flex items-center gap-2">
                                            <i class="fa-solid fa-shield-halved"></i> Hệ thống sẽ ÉP BUỘC dùng Prompt này làm nền tảng cho mọi cảnh quay.
                                        </div>
                                        <button onclick="applyStyleToCurrentScript()" class="px-2 py-1 bg-pink-600/30 hover:bg-pink-600/50 border border-pink-500/40 rounded text-[9px] text-pink-200 transition-all">
                                            <i class="fa-solid fa-wand-magic-sparkles"></i> Áp dụng cho kịch bản hiện tại
                                        </button>
                                    </div>
                                </div>
                                <div id="detectedStyle" class="mt-2 text-[10px] text-pink-300 italic flex items-center gap-1 hidden"></div>
                            </div>
                            
                            <button id="btnGenerateScript" onclick="handleGenerateScript()" class="w-full py-4 bg-gradient-to-r from-amber-600 to-amber-800 border border-amber-400/30 rounded-xl text-white font-bold shadow-[0_0_25px_rgba(251,191,36,0.3)] hover:shadow-[0_0_35px_rgba(251,191,36,0.5)] transition-all flex items-center justify-center gap-3 text-lg group">
                                <i class="fa-solid fa-scroll group-hover:scale-110 transition-transform"></i> TẠO KỊCH BẢN LỊCH SỬ ĐA VĂN HÓA
                            </button>
                        </div>
                    </div>
                    <!-- Script Results -->
                    <div id="scriptResultContainer" class="space-y-4 pb-10"></div>
                </div>
            </div>

            <!-- 3. STUDIO MODULE -->
            <div id="tab-content-studio" class="hidden h-full flex flex-col animate-slide-in-right">
                <div class="flex justify-between items-center mb-4">
                    <h2 class="text-xl font-bold text-white flex items-center gap-2"><i class="fa-solid fa-clapperboard text-cyan-500"></i> Studio Sáng Tạo Đa Phương Tiện</h2>
                    <div class="flex bg-[#1a1a1a] rounded p-1 border border-white/5">
                        <button onclick="setProductionMode('video')" id="prod-mode-video" class="px-4 py-1.5 rounded text-xs font-bold flex items-center gap-2 transition-colors bg-cyan-900/50 text-cyan-100 shadow"><i class="fa-solid fa-video"></i> VIDEO</button>
                        <button onclick="setProductionMode('image')" id="prod-mode-image" class="px-4 py-1.5 rounded text-xs font-bold flex items-center gap-2 transition-colors text-slate-400 hover:text-white"><i class="fa-solid fa-image"></i> ẢNH</button>
                        <div class="relative ml-2">
                            <button onclick="toggleExportMenu()" class="px-4 py-1.5 rounded text-xs font-bold flex items-center gap-2 transition-colors bg-green-900/40 text-green-300 hover:bg-green-800/50 border border-green-500/20"><i class="fa-solid fa-download"></i> Tải Dữ Liệu <i class="fa-solid fa-chevron-down text-[10px]"></i></button>
                            <!-- Dropdown Menu -->
                            <div id="exportDropdown" class="hidden absolute right-0 top-full mt-2 w-48 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-xl z-50 overflow-hidden">
                                <button onclick="exportScriptCSV()" class="w-full text-left px-4 py-2 text-xs text-slate-300 hover:bg-white/5 hover:text-white border-b border-white/5 flex items-center gap-2"><i class="fa-solid fa-file-excel text-green-500"></i> Excel Kịch Bản (Full)</button>
                                <button onclick="exportPromptsCSV('video')" class="w-full text-left px-4 py-2 text-xs text-slate-300 hover:bg-white/5 hover:text-white border-b border-white/5 flex items-center gap-2"><i class="fa-solid fa-file-video text-cyan-500"></i> Excel Prompt Video</button>
                                <button onclick="exportPromptsCSV('image')" class="w-full text-left px-4 py-2 text-xs text-slate-300 hover:bg-white/5 hover:text-white border-b border-white/5 flex items-center gap-2"><i class="fa-solid fa-file-image text-purple-500"></i> Excel Prompt Ảnh</button>
                                <button onclick="exportPromptsTXT('video')" class="w-full text-left px-4 py-2 text-xs text-slate-300 hover:bg-white/5 hover:text-white border-b border-white/5 flex items-center gap-2"><i class="fa-regular fa-file-lines text-cyan-500"></i> TXT Prompt Video</button>
                                <button onclick="exportPromptsTXT('image')" class="w-full text-left px-4 py-2 text-xs text-slate-300 hover:bg-white/5 hover:text-white flex items-center gap-2"><i class="fa-regular fa-file-lines text-purple-500"></i> TXT Prompt Ảnh</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="studioContainer" class="flex-1 overflow-y-auto scrollbar-thin space-y-4 pb-10">
                    <div class="text-center text-slate-500 py-10 italic">Chưa có dữ liệu kịch bản. Hãy tạo kịch bản trước.</div>
                </div>
            </div>

            <!-- 4. SEO MODULE -->
            <div id="tab-content-seo" class="hidden animate-slide-in-right">
                <div class="max-w-5xl mx-auto space-y-6">
                    <div class="bg-[#0f0f11] border border-white/10 p-6 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]">
                        <h2 class="text-xl font-bold text-white mb-4 flex items-center gap-2"><i class="fa-solid fa-magnifying-glass-arrow-right text-green-500"></i> Tối Ưu Tăng Trưởng & SEO Đa Nền Tảng</h2>
                        <div class="flex gap-4 mb-6">
                            <input id="seoTopicInput" class="flex-1 bg-black border border-white/10 rounded-lg p-3 text-sm text-white outline-none focus:border-green-500/50 placeholder-white/20" placeholder="Nhập chủ đề để tối ưu từ khóa viral...">
                            <button id="btnSeoAnalyze" onclick="handleGenerateSEO()" class="px-6 py-3 bg-green-900/40 hover:bg-green-800/40 border border-green-500/30 text-green-100 font-bold rounded-lg shadow-[0_0_20px_rgba(34,197,94,0.15)] flex items-center gap-2 transition-all">
                                <i class="fa-solid fa-rocket"></i> GROWTH HACKING
                            </button>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <!-- Checklist -->
                            <div class="bg-[#151515] border border-white/5 rounded-xl p-4">
                                <h3 class="text-sm font-bold text-slate-300 mb-3 flex items-center gap-2"><i class="fa-solid fa-check-square"></i> CHECKLIST UY TÍN (TRUST)</h3>
                                <div id="seoChecklistContainer" class="space-y-4 max-h-[400px] overflow-y-auto scrollbar-thin pr-2"></div>
                            </div>
                            <!-- Results -->
                            <div id="seoResultContainer" class="space-y-4">
                                <div class="h-full flex flex-col items-center justify-center text-slate-500 p-10 bg-white/5 border border-white/10 border-dashed rounded-xl">
                                    <i class="fa-solid fa-magic mb-2 opacity-50"></i>
                                    <p class="text-sm">Nhập chủ đề để phân tích từ khóa</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 5. MARKET MODULE -->
            <div id="tab-content-market" class="hidden animate-slide-in-right">
                <div class="max-w-5xl mx-auto space-y-6">
                    <div class="bg-[#0f0f11] border border-white/10 p-6 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]">
                        <h2 class="text-xl font-bold text-white mb-4 flex items-center gap-2"><i class="fa-solid fa-shop text-cyan-500"></i> Mô Hình Kinh Doanh & Kiếm Tiền Thụ Động</h2>
                        <div class="flex gap-4 mb-6">
                            <input id="marketTopicInput" class="flex-1 bg-black border border-white/10 rounded-lg p-3 text-sm text-white outline-none focus:border-cyan-500/50 placeholder-white/20" placeholder="Nhập lĩnh vực (VD: Khóa học AI, Sản phẩm vật lý, Coaching)...">
                            <button id="btnMarketAnalyze" onclick="handleAnalyzeMarket()" class="px-6 py-3 bg-cyan-900/40 hover:bg-cyan-800/40 border border-cyan-500/30 text-cyan-100 font-bold rounded-lg shadow-[0_0_20px_rgba(6,182,212,0.15)] flex items-center gap-2 transition-all">
                                <i class="fa-solid fa-bullseye"></i> PHÁT TRIỂN THỊ TRƯỜNG
                            </button>
                        </div>
                        <div id="marketResultContainer" class="space-y-6">
                            <div class="h-64 flex flex-col items-center justify-center text-slate-500 border border-white/10 border-dashed rounded-xl bg-white/5">
                                <i class="fa-solid fa-money-bill-trend-up mb-2 opacity-50"></i>
                                <p class="text-sm">Nhập chủ đề để AI xây dựng chiến lược kinh doanh triệu đô</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </main>

    <!-- LOGIC JAVASCRIPT -->
    <script>
        // ==================================================================================
        // CONFIGURATION & CONSTANTS
        // ==================================================================================
        // ==================================================================================
        // CONFIGURATION & CONSTANTS
        // ==================================================================================
        // ==================================================================================
        // CONFIGURATION & CONSTANTS
        // ==================================================================================
        const MODELS = { 
            text: "gemini-2.5-flash",  // Latest stable (Jan 2026) - Best price-performance
            image: "imagen-3.0-generate-002",
            openrouter_default: "google/gemini-2.0-flash-exp:free" 
        };
        const GOOGLE_LABS_URLS = { video: "https://aitestkitchen.withgoogle.com/tools/video-fx", image: "https://aitestkitchen.withgoogle.com/tools/image-fx" };

        const HISTORY_CONTEXTS = {
            vn_aspiration: {
                id: 'vn_history',
                name: 'Vietnam (Dân Tộc Nghìn Năm Văn Hiến)',
                flag: '🇻🇳',
                voice_lang: 'Vietnamese',
                culture: 'Bốn nghìn năm lịch sử chống giặc ngoại xâm, văn hiến Đại Việt, tinh thần đoàn kết dân tộc, anh hùng lịch sử như Hai Bà Trưng, Trần Hưng Đạo, Hồ Chí Minh.',
                core_driver: 'National independence, resistance spirit, cultural pride, ancestral heritage, unity through adversity.',
                writing_style: 'Passionate, patriotic, poetic, deeply emotional, rooted in Vietnamese epic storytelling tradition.',
                human_element: 'Chiến sĩ Điện Biên Phủ, nông dân vùng căn cứ địa, thanh niên xung phong, gia đình liệt sĩ.',
                historical_periods: ['Văn Lang - Âu Lạc', 'Bắc thuộc & Khởi nghĩa', 'Nhà Lý-Trần-Lê', 'Kháng chiến chống Pháp-Mỹ', 'Đổi mới & Hội nhập'],
                iconic_figures: ['Hai Bà Trưng', 'Lý Thường Kiệt', 'Trần Hưng Đạo', 'Nguyễn Trãi', 'Hồ Chí Minh', 'Võ Nguyên Giáp']
            },
            us_history: {
                id: 'us_history',
                name: 'USA (From Revolution to Innovation)',
                flag: '🇺🇸',
                voice_lang: 'English',
                culture: 'Founding Fathers vision, frontier spirit, Civil Rights struggle, moon landing ambition, tech revolution, melting pot diversity, manifest destiny.',
                core_driver: 'Liberty, pursuit of happiness, democratic ideals, innovation, individual heroism, American exceptionalism.',
                writing_style: 'Bold, inspirational, documentary-style, cinematic, focused on individual stories within grand narratives.',
                human_element: 'Immigrant at Ellis Island, Civil Rights marcher, Apollo astronaut, Silicon Valley pioneer, D-Day veteran.',
                historical_periods: ['Colonial Era & Revolution', 'Civil War & Reconstruction', 'Gilded Age', 'World Wars', 'Civil Rights Era', 'Space Age & Digital Revolution'],
                iconic_figures: ['George Washington', 'Abraham Lincoln', 'Martin Luther King Jr.', 'Rosa Parks', 'Neil Armstrong', 'Steve Jobs']
            },
            jp_history: {
                id: 'jp_history',
                name: 'Japan (侍から未来へ - Samurai to Silicon)',
                flag: '🇯🇵',
                voice_lang: 'Japanese',
                culture: 'Samurai code (Bushido), Meiji Restoration transformation, post-war economic miracle, harmony with nature, aesthetic refinement, tea ceremony philosophy.',
                core_driver: 'Honor, mastery, collective harmony, continuous improvement (Kaizen), resilience through catastrophe, cultural preservation.',
                writing_style: 'Aesthetic, philosophical, contemplative, balanced between tradition and modernity, deeply respectful, Zen-influenced.',
                human_element: '侍の子孫、明治維新の志士、戦後復興の職人、高度成長期のサラリーマン、テクノロジー革新者.',
                historical_periods: ['Heian Court Culture', 'Samurai Era (Kamakura-Edo)', 'Meiji Restoration', 'World War II', 'Economic Miracle', 'Modern Innovation'],
                iconic_figures: ['Tokugawa Ieyasu', 'Sakamoto Ryoma', 'Emperor Meiji', 'Akio Morita', 'Hayao Miyazaki']
            },
            kr_passion: {
                id: 'kr_passion',
                name: 'South Korea (Miracle on the Han River Spirit)',
                flag: '🇰🇷',
                voice_lang: 'Korean',
                culture: 'Pali-pali (hurry-hurry) culture, intense education, collective growth, overcoming war to tech leader, "Han" converted to motivation.',
                core_driver: 'Competitive excellence, family honor, national achievement, speed, aesthetics.',
                writing_style: 'Dynamic, intense, modern, visually focused, high-speed growth.',
                human_element: 'K-pop trainee’s grit, researcher’s sleepless nights, student’s devotion.'
            },
            de_discipline: {
                id: 'de_discipline',
                name: 'Germany (Efficiency & Long-term Vision)',
                flag: '🇩🇪',
                voice_lang: 'German',
                culture: 'Systematic approach, precision, reliability, "Vorsprung durch Technik", work-life balance for long-term sustainability.',
                core_driver: 'Quality, structure, logical success, engineering mindset, sustainability.',
                writing_style: 'Structured, logical, authoritative, calm, reliable.',
                human_element: 'Engineer optimizing a system, founder building "Mittelstand", marathon runner.'
            },
            sg_success: {
                id: 'sg_success',
                name: 'Singapore (Global Mindset & Excellence)',
                flag: '🇸🇬',
                voice_lang: 'English',
                culture: 'Efficiency, meritocracy, multi-cultural synergy, "can-do" attitude, small nation with big impact.',
                core_driver: 'Survival, prosperity, global leadership, education, smart living.',
                writing_style: 'Polished, international, efficient, professional, strategic.',
                human_element: 'Global executive, smart-city innovator, student in competitive environment.'
            },
            br_resilience: {
                id: 'br_resilience',
                name: 'Brazil (Joy & Resilience)',
                flag: '🇧🇷',
                voice_lang: 'Portuguese',
                culture: 'Overcoming obstacles with joy, community support, creativity, passion for life, emotional intelligence.',
                core_driver: 'Hope, happiness, community connection, passion, creativity.',
                writing_style: 'Vibrant, warm, heart-centered, rhythmic, inspirational.',
                human_element: 'Social entrepreneur in favela, artist creating hope, athlete’s passion.'
            },
            il_chutzpah: {
                id: 'il_chutzpah',
                name: 'Israel (Chutzpah & Innovation)',
                flag: '🇮🇱',
                voice_lang: 'Hebrew',
                culture: 'Audacity (Chutzpah), questioning the status quo, high-tech spirit, resilience through history, directness.',
                core_driver: 'Problem-solving, survival, breakthrough innovation, direct communication.',
                writing_style: 'Bold, questioning, innovative, direct, intellectually stimulating.',
                human_element: 'Cyber-security expert, social innovator, farmer turning desert green.'
            },
            cn_history: {
                id: 'cn_history',
                name: 'China (五千年文明 - Five Thousand Years)',
                flag: '🇨🇳',
                voice_lang: 'Chinese (Mandarin)',
                culture: 'Middle Kingdom legacy, Confucian philosophy, dynastic cycles, Great Wall symbolism, Silk Road heritage, Century of Humiliation to Rise of Dragon.',
                core_driver: 'Civilizational continuity, family honor, scholarly tradition, national rejuvenation, harmonious society, ancestral wisdom.',
                writing_style: 'Epic, profound, rich in classical references, poetic, strategic, emphasizing long-term vision and cycles.',
                human_element: '长城守卫者、丝绸之路商人、科举学子、红军长征战士、改革开放建设者.',
                historical_periods: ['Ancient Dynasties (Qin-Han-Tang)', 'Song Renaissance', 'Yuan-Ming-Qing Empire', 'Century of Humiliation', 'Revolution & Civil War', 'Reform & Opening Up'],
                iconic_figures: ['Qin Shi Huang', 'Confucius', 'Zheng He', 'Sun Yat-sen', 'Mao Zedong', 'Deng Xiaoping']
            },
            fr_history: {
                id: 'fr_history',
                name: 'France (Liberté, Égalité, Fraternité - Revolution to Republic)',
                flag: '🇫🇷',
                voice_lang: 'French',
                culture: 'French Revolution legacy, Enlightenment philosophy, artistic Renaissance, Napoléon empire, Resistance spirit, May 68 intellectualism.',
                core_driver: 'Liberty, equality, fraternity, intellectual freedom, cultural heritage, artistic expression, republican values.',
                writing_style: 'Elegant, philosophical, refined, passionate, culturally rich, revolutionary fervor balanced with sophistication.',
                human_element: 'Révolutionnaire de 1789, poîlu de Verdun, résistant de la Seconde Guerre, intellectuel de Mai 68, citoyen européen.',
                historical_periods: ['Medieval Kingdom', 'Renaissance & Enlightenment', 'Revolution & Empire', 'World Wars', 'Post-War Reconstruction', 'European Integration'],
                iconic_figures: ['Joan of Arc', 'Napoleon Bonaparte', 'Victor Hugo', 'Charles de Gaulle', 'Simone de Beauvoir']
            },
            uk_history: {
                id: 'uk_history',
                name: 'United Kingdom (Empire to Commonwealth)',
                flag: '🇬🇧',
                voice_lang: 'English (British)',
                culture: 'Industrial Revolution birthplace, British Empire legacy, parliamentary democracy evolution, WWII resilience (Blitz spirit), post-colonial transformation.',
                core_driver: 'Rule of law, parliamentary tradition, "keep calm and carry on", scientific enlightenment, global cultural influence.',
                writing_style: 'Understated elegance, dry wit, historically layered, BBC documentary tone, focus on institutions and individuals.',
                human_element: 'Victorian factory worker, suffragette campaigner, Battle of Britain pilot, NHS founder, multicultural London resident.',
                historical_periods: ['Medieval Kingdom', 'Tudor Dynasty', 'Industrial Revolution', 'Victorian Empire', 'World Wars', 'Post-Imperial Modern UK'],
                iconic_figures: ['King Alfred', 'Queen Elizabeth I', 'Winston Churchill', 'Emmeline Pankhurst', 'Stephen Hawking'],
                storytelling_style: 'BBC documentary aesthetic, understated heroism, institutional history focus, balance of tradition and modernity.'
            },
            in_jugaad: {
                id: 'in_jugaad',
                name: 'India (Jugaad Innovation & Dharma)',
                flag: '🇮🇳',
                voice_lang: 'Hindi',
                culture: 'Resourceful innovation (Jugaad), spiritual foundation, family duty, vibrant diversity, tech revolution from chaos.',
                core_driver: 'Family prosperity, spiritual growth, creative problem-solving, social mobility.',
                writing_style: 'Colorful, spiritual, dynamic, resourceful, story-driven.',
                human_element: 'Tech startup founder, street vendor becoming entrepreneur, student overcoming odds.'
            },
            au_noproblem: {
                id: 'au_noproblem',
                name: 'Australia (No Worries & Fair Go)',
                flag: '🇦🇺',
                voice_lang: 'English (Australian)',
                culture: 'Laid-back determination, egalitarianism, outdoor spirit, straightforward communication, "give it a go" attitude.',
                core_driver: 'Freedom, fairness, adventure, authenticity, work-life balance.',
                writing_style: 'Casual, honest, energetic, optimistic, down-to-earth.',
                human_element: 'Surfer entrepreneur, outback innovator, researcher with bold ideas.'
            },
            ca_multicultural: {
                id: 'ca_multicultural',
                name: 'Canada (Multicultural Mosaic & Resilience)',
                flag: '🇨🇦',
                voice_lang: 'English',
                culture: 'Inclusive excellence, quiet confidence, winter resilience, politeness with strength, multicultural harmony.',
                core_driver: 'Community, diversity, nature connection, peaceful progress, quality of life.',
                writing_style: 'Warm, inclusive, humble, nature-inspired, thoughtful.',
                human_element: 'Immigrant success story, tech innovator in Toronto, wilderness guide philosopher.'
            },
            mx_corazon: {
                id: 'mx_corazon',
                name: 'Mexico (Corazón Fuerte - Strong Heart)',
                flag: '🇲🇽',
                voice_lang: 'Spanish (Mexican)',
                culture: 'Passionate heart, family above all, colorful resilience, revolutionary spirit, joy despite hardship.',
                core_driver: 'Family legacy, cultural pride, emotional strength, community, celebration.',
                writing_style: 'Passionate, colorful, heartfelt, revolutionary, festive.',
                human_element: 'Family business growing generations, artist expressing identity, entrepreneur with passion.'
            },
            ru_depth: {
                id: 'ru_depth',
                name: 'Russia (Soul Depth - Русская Душа)',
                flag: '🇷🇺',
                voice_lang: 'Russian',
                culture: 'Deep soul (Dusha), endurance through hardship, intellectual intensity, vast horizons, poetic suffering transformed.',
                core_driver: 'Survival, intellectual depth, legacy, homeland, spiritual strength.',
                writing_style: 'Profound, intense, literary, dramatic, philosophical.',
                human_element: 'Scientist in harsh conditions, artist finding beauty in struggle, entrepreneur rebuilding.'
            },
            ae_vision: {
                id: 'ae_vision',
                name: 'UAE (Desert to Stars - رؤية الإمارات)',
                flag: '🇦🇪',
                voice_lang: 'Arabic',
                culture: 'Rapid transformation, visionary ambition, luxury meets tradition, global hub mentality, impossible made possible.',
                core_driver: 'Visionary achievement, world-class excellence, innovation, luxury, legacy.',
                writing_style: 'Ambitious, luxurious, forward-thinking, inspirational, global.',
                human_element: 'Architect of future cities, entrepreneur in free zone, innovator bridging cultures.'
            },
            sa_vision2030: {
                id: 'sa_vision2030',
                name: 'Saudi Arabia (رؤية 2030 - Vision 2030)',
                flag: '🇸🇦',
                voice_lang: 'Arabic',
                culture: 'Massive transformation, tradition meets modernity, mega-project mentality, youthful energy, bold reforms.',
                core_driver: 'National transformation, economic diversification, cultural pride, youth empowerment.',
                writing_style: 'Bold, transformative, heritage-conscious, ambitious, energetic.',
                human_element: 'Young reformer, mega-project engineer, entrepreneur in new economy.'
            },
            ng_hustle: {
                id: 'ng_hustle',
                name: 'Nigeria (Naija No Dey Carry Last)',
                flag: '🇳🇬',
                voice_lang: 'English (Nigerian)',
                culture: 'Unstoppable hustle, creative resilience, entrepreneurial spirit, Nollywood inspiration, tech hub emergence.',
                core_driver: 'Success against odds, family upliftment, creative innovation, determination.',
                writing_style: 'Energetic, colorful, entrepreneurial, creative, street-smart.',
                human_element: 'Tech founder in Lagos, artist creating globally, entrepreneur hustling daily.'
            },
            za_ubuntu: {
                id: 'za_ubuntu',
                name: 'South Africa (Ubuntu - I Am Because We Are)',
                flag: '🇿🇦',
                voice_lang: 'English',
                culture: 'Ubuntu philosophy, rainbow nation unity, resilience through apartheid, entrepreneurial diversity, natural beauty inspiration.',
                core_driver: 'Community upliftment, reconciliation, diversity strength, social justice, opportunity.',
                writing_style: 'Inspirational, communal, resilient, diverse, hopeful.',
                human_element: 'Township entrepreneur, reconciliation leader, innovator bridging divides.'
            },
            eg_heritage: {
                id: 'eg_heritage',
                name: 'Egypt (من أرض الحضارة - Land of Civilization)',
                flag: '🇪🇬',
                voice_lang: 'Arabic (Egyptian)',
                culture: '7000 years of heritage, Nile resilience, Arab leadership, entrepreneurial revival, ancient wisdom meets modern hustle.',
                core_driver: 'Historical pride, family honor, resilience, education, legacy.',
                writing_style: 'Historical, proud, resilient, poetic, strategic.',
                human_element: 'Startup founder in Cairo, teacher inspiring generations, entrepreneur honoring heritage.'
            },
            id_gotong: {
                id: 'id_gotong',
                name: 'Indonesia (Gotong Royong - Mutual Aid)',
                flag: '🇮🇩',
                voice_lang: 'Indonesian',
                culture: 'Community cooperation, archipelago unity, Islamic values, entrepreneurial creativity, diverse harmony.',
                core_driver: 'Community success, family prosperity, religious duty, creative enterprise.',
                writing_style: 'Community-focused, harmonious, creative, warm, spiritual.',
                human_element: 'Village entrepreneur, social innovator, startup founder uniting islands.'
            },
            th_smile: {
                id: 'th_smile',
                name: 'Thailand (Land of Smiles - สยามเมืองยิ้ม)',
                flag: '🇹🇭',
                voice_lang: 'Thai',
                culture: 'Gracious resilience (Mai Pen Rai), Buddhist calm, royal heritage, creative adaptation, balance of joy and discipline.',
                core_driver: 'Harmony, prosperity, cultural pride, family honor, graceful success.',
                writing_style: 'Graceful, balanced, warm, respectful, flowing.',
                human_element: 'Entrepreneur with royal grace, monk-inspired business leader, creative adaptor.'
            },
            ph_bayanihan: {
                id: 'ph_bayanihan',
                name: 'Philippines (Bayanihan Spirit)',
                flag: '🇵🇭',
                voice_lang: 'Filipino',
                culture: 'Community spirit (Bayanihan), resilience through disasters, OFW sacrifice, joy despite hardship, faith-driven strength.',
                core_driver: 'Family remittance, community uplift, faith, opportunity abroad, homeland pride.',
                writing_style: 'Warm, resilient, faith-filled, communal, hopeful.',
                human_element: 'OFW sending money home, startup founder, community organizer.'
            },
            my_truly: {
                id: 'my_truly',
                name: 'Malaysia (Malaysia Boleh - Malaysia Can)',
                flag: '🇲🇾',
                voice_lang: 'Malay',
                culture: 'Multicultural harmony, "Boleh" (can-do) spirit, Islamic moderation, tropical creativity, quiet achievement.',
                core_driver: 'Multiracial success, education, business growth, harmony, prosperity.',
                writing_style: 'Moderate, harmonious, practical, multicultural, optimistic.',
                human_element: 'Tech entrepreneur in Cyberjaya, trader in multicultural market, educator bridging cultures.'
            },
            pk_qaum: {
                id: 'pk_qaum',
                name: 'Pakistan (Qaum Ki Ummeed - Nation\'s Hope)',
                flag: '🇵🇰',
                voice_lang: 'Urdu',
                culture: 'Resilient faith, entrepreneurial necessity, family honor, cricket-inspired fighting spirit, youth revolution.',
                core_driver: 'Family prosperity, national pride, Islamic values, opportunity creation, honor.',
                writing_style: 'Passionate, faith-driven, poetic, resilient, ambitious.',
                human_element: 'Startup founder in Lahore, family business builder, youth tech innovator.'
            },
            bd_spirit: {
                id: 'bd_spirit',
                name: 'Bangladesh (জয় বাংলা - Victory Spirit)',
                flag: '🇧🇩',
                voice_lang: 'Bengali',
                culture: 'Liberation spirit, resilience against nature, garment industry determination, microfinance revolution, rising tiger.',
                core_driver: 'Family upliftment, economic mobility, resilience, community support, independence.',
                writing_style: 'Resilient, poetic, determined, community-focused, rising.',
                human_element: 'Garment entrepreneur, flood survivor building business, tech innovator.'
            },
            tr_bridge: {
                id: 'tr_bridge',
                name: 'Turkey (Iki Kıta Bir Ülke - Bridge of Continents)',
                flag: '🇹🇷',
                voice_lang: 'Turkish',
                culture: 'East-West synthesis, Ottoman legacy, entrepreneurial revival, passionate determination, strategic positioning.',
                core_driver: 'National resurgence, business empire building, cultural pride, strategic advantage.',
                writing_style: 'Strategic, passionate, historical, ambitious, bridge-building.',
                human_element: 'Exporter bridging markets, tech founder in Istanbul, traditional craft modernizer.'
            },
            ar_passion: {
                id: 'ar_passion',
                name: 'Argentina (Pasión y Coraje)',
                flag: '🇦🇷',
                voice_lang: 'Spanish (Argentine)',
                culture: 'Passionate intensity, tango resilience, football-inspired fighting spirit, European heritage in Latin America, economic survivor.',
                core_driver: 'Passion, resilience through crisis, cultural excellence, individual brilliance.',
                writing_style: 'Passionate, dramatic, artistic, resilient, intense.',
                human_element: 'Entrepreneur through economic crisis, tango artist, football-inspired leader.'
            },
            cl_resilience: {
                id: 'cl_resilience',
                name: 'Chile (Del Desierto a las Estrellas)',
                flag: '🇨🇱',
                voice_lang: 'Spanish (Chilean)',
                culture: 'Geographic extremes resilience, copper to innovation, earthquake survivor mentality, literary tradition, quiet strength.',
                core_driver: 'Stability, education, entrepreneurship, resilience, natural resource wisdom.',
                writing_style: 'Resilient, poetic, grounded, strategic, nature-inspired.',
                human_element: 'Mining engineer, earthquake survivor entrepreneur, wine innovator.'
            },
            co_viva: {
                id: 'co_viva',
                name: 'Colombia (Viva Colombia - Living Transformation)',
                flag: '🇨🇴',
                voice_lang: 'Spanish (Colombian)',
                culture: 'Peace transformation, coffee excellence, salsa energy, biodiversity richness, entrepreneurial revival.',
                core_driver: 'Transformation, peace prosperity, cultural richness, innovation, hope.',
                writing_style: 'Energetic, transformative, colorful, hopeful, rhythmic.',
                human_element: 'Peace entrepreneur, coffee grower innovating, Medellín tech founder.'
            },
            pe_inca: {
                id: 'pe_inca',
                name: 'Peru (El Oro de los Incas - Inca Gold)',
                flag: '🇵🇪',
                voice_lang: 'Spanish (Peruvian)',
                culture: 'Ancient Inca wisdom, culinary excellence, mountain resilience, heritage innovation, mystical pragmatism.',
                core_driver: 'Heritage pride, culinary mastery, entrepreneurial creativity, mountain strength.',
                writing_style: 'Mystical, proud, culinary, heritage-rich, resilient.',
                human_element: 'Chef creating world cuisine, entrepreneur honoring heritage, mountain guide philosopher.'
            },
            pl_solidarity: {
                id: 'pl_solidarity',
                name: 'Poland (Solidarność - Solidarity Spirit)',
                flag: '🇵🇱',
                voice_lang: 'Polish',
                culture: 'Solidarity movement legacy, Catholic resilience, EU success story, phoenix-from-ashes mentality, tech hub emergence.',
                core_driver: 'Freedom, solidarity, economic transformation, national pride, innovation.',
                writing_style: 'Resilient, solidarity-focused, transformative, proud, determined.',
                human_element: 'Tech founder in Warsaw, freedom fighter spirit, entrepreneur building new Poland.'
            },
            nl_pragmatic: {
                id: 'nl_pragmatic',
                name: 'Netherlands (Poldermodel Pragmatism)',
                flag: '🇳🇱',
                voice_lang: 'Dutch',
                culture: 'Below-sea-level determination, pragmatic innovation, direct communication, cooperative problem-solving, bicycle simplicity.',
                core_driver: 'Practical innovation, quality of life, environmental leadership, directness, cooperation.',
                writing_style: 'Direct, practical, innovative, cooperative, clear.',
                human_element: 'Engineer fighting water, startup founder scaling globally, designer creating sustainability.'
            },
            se_lagom: {
                id: 'se_lagom',
                name: 'Sweden (Lagom - Just Right Balance)',
                flag: '🇸🇪',
                voice_lang: 'Swedish',
                culture: 'Lagom philosophy, innovation from necessity, equality focus, design excellence, sustainable success.',
                core_driver: 'Balance, equality, innovation, sustainability, quality design.',
                writing_style: 'Balanced, design-focused, sustainable, egalitarian, minimalist.',
                human_element: 'Designer creating simplicity, tech founder, sustainability innovator.'
            },
            no_friluft: {
                id: 'no_friluft',
                name: 'Norway (Friluftsliv - Outdoor Life Philosophy)',
                flag: '🇳🇴',
                voice_lang: 'Norwegian',
                culture: 'Nature-connected strength, oil wealth wisdom, Viking heritage, outdoor resilience, egalitarian prosperity.',
                core_driver: 'Nature connection, sustainable wealth, equality, adventure, quality.',
                writing_style: 'Nature-inspired, balanced, adventurous, thoughtful, strong.',
                human_element: 'Oil engineer with environmental conscience, outdoor entrepreneur, sustainable innovator.'
            },
            dk_hygge: {
                id: 'dk_hygge',
                name: 'Denmark (Hygge Happiness & Innovation)',
                flag: '🇩🇰',
                voice_lang: 'Danish',
                culture: 'Hygge coziness, happiness focus, Viking-to-tech evolution, design excellence, work-life balance mastery.',
                core_driver: 'Happiness, balance, innovation, design, community.',
                writing_style: 'Warm, balanced, design-conscious, happy, innovative.',
                human_element: 'Happiness researcher, design entrepreneur, balanced tech founder.'
            },
            fi_sisu: {
                id: 'fi_sisu',
                name: 'Finland (Sisu - Extraordinary Determination)',
                flag: '🇫🇮',
                voice_lang: 'Finnish',
                culture: 'Sisu (resilient determination), sauna philosophy, winter strength, education excellence, tech from forests.',
                core_driver: 'Determination, education, innovation, resilience, quiet strength.',
                writing_style: 'Resilient, quiet, determined, education-focused, innovative.',
                human_element: 'Nokia engineer reinventing, educator innovating, winter entrepreneur.'
            },
            nz_kiwi: {
                id: 'nz_kiwi',
                name: 'New Zealand (Kiwi Can-Do & Kaitiakitanga)',
                flag: '🇳🇿',
                voice_lang: 'English (NZ)',
                culture: 'Number 8 wire ingenuity, environmental guardianship (Kaitiakitanga), All Blacks excellence, remote innovation.',
                core_driver: 'Innovation from isolation, environmental stewardship, excellence, adventure.',
                writing_style: 'Innovative, environmental, adventurous, humble, determined.',
                human_element: 'Remote entrepreneur, environmental guardian, rugby-inspired leader.'
            },
            ie_craic: {
                id: 'ie_craic',
                name: 'Ireland (The Craic & Celtic Tiger)',
                flag: '🇮🇪',
                voice_lang: 'English (Irish)',
                culture: 'Storytelling tradition, literary excellence, tech transformation, European gateway, warm resilience.',
                core_driver: 'Connection, storytelling, transformation, education, global bridge.',
                writing_style: 'Storytelling, warm, literary, transformative, connected.',
                human_element: 'Tech hub founder, storyteller entrepreneur, global connector.'
            },
            at_quality: {
                id: 'at_quality',
                name: 'Austria (Alpine Excellence & Gemütlichkeit)',
                flag: '🇦🇹',
                voice_lang: 'German (Austrian)',
                culture: 'Alpine precision, musical heritage, coffeehouse philosophy, quality obsession, hidden champion mindset.',
                core_driver: 'Quality, culture, precision, balance, excellence.',
                writing_style: 'Refined, precise, cultural, balanced, excellent.',
                human_element: 'Hidden champion CEO, coffeehouse philosopher, precision engineer.'
            },
            ch_precision: {
                id: 'ch_precision',
                name: 'Switzerland (Alpine Precision & Neutrality)',
                flag: '🇨🇭',
                voice_lang: 'German/French/Italian',
                culture: 'Watchmaker precision, multilingual harmony, banking excellence, neutral innovation, mountain discipline.',
                core_driver: 'Precision, excellence, reliability, discretion, quality.',
                writing_style: 'Precise, multilingual, excellent, discrete, refined.',
                human_element: 'Watchmaker perfecting craft, banker with integrity, alpine innovator.'
            },
            be_unity: {
                id: 'be_unity',
                name: 'Belgium (Unity in Diversity & EU Heart)',
                flag: '🇧🇪',
                voice_lang: 'Dutch/French',
                culture: 'Multicultural cooperation, EU capital mentality, chocolate-to-chips excellence, quiet achievement, pragmatic innovation.',
                core_driver: 'Unity, European leadership, quality, pragmatism, innovation.',
                writing_style: 'Cooperative, multicultural, pragmatic, quality-focused, diplomatic.',
                human_element: 'EU policy innovator, multicultural entrepreneur, quality craftsperson.'
            },
            gr_heritage: {
                id: 'gr_heritage',
                name: 'Greece (Φιλότιμο - Honor & Resilience)',
                flag: '🇬🇷',
                voice_lang: 'Greek',
                culture: 'Philotimo (love of honor), ancient wisdom, crisis resilience, family bonds, Mediterranean passion.',
                core_driver: 'Honor, heritage, family, resilience, philosophical depth.',
                writing_style: 'Philosophical, passionate, historical, resilient, honorable.',
                human_element: 'Entrepreneur honoring heritage, crisis survivor, philosopher entrepreneur.'
            },
            pt_saudade: {
                id: 'pt_saudade',
                name: 'Portugal (Saudade & Discoveries Spirit)',
                flag: '🇵🇹',
                voice_lang: 'Portuguese (European)',
                culture: 'Age of Discoveries legacy, saudade melancholy-hope, tech startup boom, Atlantic resilience, poetic pragmatism.',
                core_driver: 'Discovery, transformation, heritage, Atlantic bridge, innovation.',
                writing_style: 'Poetic, nostalgic-hopeful, adventurous, transformative, oceanic.',
                human_element: 'Navigator spirit entrepreneur, Lisbon tech founder, ocean innovator.'
            },
            es_passion: {
                id: 'es_passion',
                name: 'Spain (Pasión y Fiesta - Passion & Celebration)',
                flag: '🇪🇸',
                voice_lang: 'Spanish (European)',
                culture: 'Passionate living, siesta wisdom, family centricity, regional diversity, crisis-to-innovation transformation.',
                core_driver: 'Passion, family, quality of life, cultural richness, resilience.',
                writing_style: 'Passionate, warm, family-focused, culturally rich, vibrant.',
                human_element: 'Family business guardian, startup founder with passion, cultural entrepreneur.'
            },
            it_bella: {
                id: 'it_bella',
                name: 'Italy (La Dolce Vita & Made in Italy)',
                flag: '🇮🇹',
                voice_lang: 'Italian',
                culture: 'Beauty in everything, craftsmanship excellence, family business legacy, dolce far niente wisdom, Renaissance innovation.',
                core_driver: 'Beauty, craftsmanship, family legacy, quality, cultural excellence.',
                writing_style: 'Artistic, passionate, family-centered, quality-obsessed, beautiful.',
                human_element: 'Third-generation craftsman, fashion entrepreneur, family business innovator.'
            },
            cz_revolu: {
                id: 'cz_revolu',
                name: 'Czech Republic (Velvet Revolution Spirit)',
                flag: '🇨🇿',
                voice_lang: 'Czech',
                culture: 'Peaceful revolution legacy, beer philosophy, engineering excellence, literary tradition, Central European bridge.',
                core_driver: 'Freedom, innovation, quality, intellectual depth, transformation.',
                writing_style: 'Thoughtful, revolutionary-peaceful, quality-focused, intellectual, Central European.',
                human_element: 'Velvet entrepreneur, engineering innovator, cultural bridge builder.'
            },
            ua_spirit: {
                id: 'ua_spirit',
                name: 'Ukraine (Незламність - Unbreakable Spirit)',
                flag: '🇺🇦',
                culture: 'Unbreakable resilience, breadbasket heritage, IT outsourcing excellence, freedom fighting spirit, tech innovation despite adversity.',
                voice_lang: 'Ukrainian',
                core_driver: 'Freedom, resilience, digital transformation, national independence, innovation.',
                writing_style: 'Resilient, defiant, innovative, freedom-focused, determined.',
                human_element: 'Tech entrepreneur building remotely, freedom fighter, agricultural innovator.'
            },
            global_nomad: {
                id: 'global_nomad',
                name: '🌍 Global Nomad (Digital Citizen)',
                flag: '🌐',
                voice_lang: 'English',
                culture: 'Location-independent mindset, multicultural synthesis, digital-first living, global perspective, freedom-focused.',
                core_driver: 'Freedom, flexibility, global impact, location independence, continuous learning.',
                writing_style: 'Global, digital-native, flexible, borderless, future-focused.',
                human_element: 'Remote worker worldwide, digital nomad entrepreneur, global citizen.'
            }
        };

        // ============================================
        // TRANSLATIONS DICTIONARY (Vietnamese/English)
        // ============================================
        const TRANSLATIONS = {
            vi: {
                title: 'Motivation Master - Thở Cảm Hứng',
                subtitle: 'Tạo video động viên cá nhân hóa với AI',
                language_switch: 'English',
                tab_analyze: '1. PHÂN TÍCH TREND ĐỘNG LỰC',
                tab_analyze_desc: 'Phân Tích Video Viral & Content Truyền Cảm Hứng',
                tab_script: '2. KỊCH BẢN TRIỆU VIEW',
                tab_script_desc: 'Kịch bản truyền động lực theo tâm lý học hành vi',
                tab_studio: '3. STUDIO SÁNG TẠO VÔ HẠN',
                tab_studio_desc: 'Prompt Video & Ảnh Đỉnh Cao',
                tab_seo: '4. PHỦ SÓNG ĐA KÊNH',
                tab_seo_desc: 'SEO & Growth Hacking Content',
                tab_market: '5. CHIẾN LƯỢC KINH DOANH',
                tab_market_desc: 'Sản phẩm số & Khóa học chuyển đổi',
                select_market: 'Chọn thị trường/phong cách',
                input_goal: 'Nhập mục tiêu của bạn',
                placeholder_goal: 'Ví dụ: Tôi muốn giảm 10kg trong 3 tháng',
                select_model: 'Chọn mô hình AI',
                select_visual: 'Chọn phong cách hình ảnh',
                generate_btn: '⚡ Tạo Video Cảm Hứng',
                status_generating: 'Đang tạo...',
                error_input: 'Vui lòng nhập mục tiêu!',
                library_empty: 'Chưa có video nào. Hãy tạo video đầu tiên!',
                delete_confirm: 'Xóa video này?',
                prompts_intro: 'Gợi ý các mục tiêu phổ biến theo thị trường',
                copy_success: 'Đã sao chép!'
            },
            en: {
                title: 'Motivation Master - The Inspiration Engine',
                subtitle: 'Create personalized motivational videos with AI',
                language_switch: 'Tiếng Việt',
                tab_analyze: '1. VIRAL TREND ANALYSIS',
                tab_analyze_desc: 'Analyze Viral Videos & Inspirational Content',
                tab_script: '2. MILLION-VIEW SCRIPTS',
                tab_script_desc: 'Motivational scripts based on behavioral psychology',
                tab_studio: '3. INFINITE CREATIVE STUDIO',
                tab_studio_desc: 'Premium Video & Image Prompts',
                tab_seo: '4. MULTI-CHANNEL DISTRIBUTION',
                tab_seo_desc: 'SEO & Growth Hacking Content',
                tab_market: '5. BUSINESS STRATEGY',
                tab_market_desc: 'Digital products & High-conversion courses',
                select_market: 'Select market/style',
                input_goal: 'Enter your goal',
                placeholder_goal: 'Example: I want to lose 10kg in 3 months',
                select_model: 'Select AI model',
                select_visual: 'Select visual style',
                generate_btn: '⚡ Generate Motivation Video',
                status_generating: 'Generating...',
                error_input: 'Please enter your goal!',
                library_empty: 'No videos yet. Create your first one!',
                delete_confirm: 'Delete this video?',
                prompts_intro: 'Suggested popular goals by market',
                copy_success: 'Copied!'
            }
        };

        // Language state and helper function
        let currentLang = 'vi'; // Default to Vietnamese
        const t = (key) => TRANSLATIONS[currentLang][key] || key;

        // Language switcher function
        function switchLanguage() {
            currentLang = currentLang === 'vi' ? 'en' : 'vi';
            updateUILanguage();
        }

        function updateUILanguage() {
            // Update document title
            document.title = t('title');
            
            // Update language button
            const langCode = document.getElementById('currentLangCode');
            const langFlag = document.getElementById('currentLangFlag');
            if (langCode) langCode.textContent = t('language_switch');
            if (langFlag) langFlag.textContent = currentLang === 'vi' ? '🇻🇳' : '🇬🇧';
            
            // Update all elements with data-i18n attribute
            document.querySelectorAll('[data-i18n]').forEach(el => {
                const key = el.getAttribute('data-i18n');
                const translated = t(key);
                
                if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                    if (el.placeholder !== undefined) {
                        el.placeholder = translated;
                    }
                } else {
                    el.textContent = translated;
                }
            });
        }

        const VISUAL_STYLES = [
            // CATEGORY 1: MOTIVATION & HIGH PERFORMANCE
            { id: 'auto', name: '✨ AI Director Auto', desc: 'AI selects the best style for the motivational context.', prompt_enforce: '', reference_prompt: 'AI will determine the best visual style based on the motivational context provided.' },
            { 
                id: 'cinematic_success', 
                name: '🏆 Cinematic Success', 
                desc: 'High-end corporate/lifestyle aesthetic for peak performance.', 
                prompt_enforce: ', Visual Style: Cinematic High-Performance Lifestyle, luxury office/modern city/peak nature, sharp focus, anamorphic lens flares, rich color grading, 8k, no text, no watermark.',
                reference_prompt: 'Visual Style: Cinematic High-End Commercial, a confident visionary leader overlooking a futuristic city at sunrise, sharp suit, reflection on window, anamorphic lens flares, teal and orange color grading, 8k professional cinematography.'
            },
            { 
                id: 'grit_resilience', 
                name: '🔥 Raw Grit & Resilience', 
                desc: 'Dark, high-contrast, intense look at the struggle and victory.', 
                prompt_enforce: ', Visual Style: Raw Cinematic Grit, high contrast, heavy shadows, moody lighting, sweat and texture, intense facial expressions, cinematic grain, 8k, no text, no watermark.',
                reference_prompt: 'Visual Style: Dramatic Sports Documentary, an athlete training in a dark urban gym, heavy shadows, single light source, sweat glistening, high contrast, grainy film aesthetic, intense determination, 8k.'
            },
            { 
                id: 'abstract_growth', 
                name: '🌱 Abstract Growth', 
                desc: 'Symbolic representation of neural growth and potential.', 
                prompt_enforce: ', Visual Style: Abstract Growth Visualization, glowing neurons, expanding light patterns, fractal geometry, vibrant energy, ethereal atmosphere, 8k, no text, no captions.',
                reference_prompt: 'Visual Style: Ethereal Abstract Art, seeds turning into glowing trees of light, neural pathways firing, expanding golden energy, cosmic background, high-end motion graphics aesthetic, 8k.'
            },
            
            // CATEGORY 2: ANIMATION STYLES
            { 
                id: 'animated_2d_anime', 
                name: '🎨 Shonen Anime Style', 
                desc: 'Intense Japanese anime style, high energy (Naruto/Solo Leveling).', 
                prompt_enforce: ', Visual Style: Shonen Anime, high-energy animation style, dynamic speed lines, vibrant supernatural aura, clean line art, professional animation, no text.',
                reference_prompt: 'Visual Style: High-quality Shonen Anime, character powering up with glowing aura, dynamic camera angle, debris floating, vibrant colors, clean line art, epic atmosphere.'
            },
            { 
                id: 'modern_flat_design', 
                name: '📊 Modern Motion Graphics', 
                desc: 'Clean flat design for educational/business motivation.', 
                prompt_enforce: ', Visual Style: Modern Flat Design, vector illustration, vibrant primary colors, clean shapes, professional motion graphics aesthetic, no text, no subtitles.',
                reference_prompt: 'Visual Style: Premium Vector Illustration, minimalist character climbing a mountain of books, clean gradients, professional flat design, vibrant corporate colors, simple elegant shapes.'
            },
            { 
                id: 'stickman_dharma', 
                name: '👤 Stickman Buddhism', 
                desc: 'Simple stickman animation for clear conceptual teaching.', 
                prompt_enforce: ', Visual Style: Minimalist Stickman Animation, clean white background, black stick figures, smooth motion, simple visual metaphors, educational clarity, professional motion graphics, no text, no captions.',
                reference_prompt: 'Visual Style: Minimalist Stickman Animation, clean white background, black bold stick figures, simple circular heads, smooth vector motion, clear visual storytelling metaphors, educational clarity.'
            },
            { 
                id: 'ink_wash_painting', 
                name: '🖌️ Ink Wash Painting', 
                desc: 'Traditional East Asian sumi-e style, artistic and fluid.', 
                prompt_enforce: ', Visual Style: Traditional Chinese Ink Wash Painting, sumi-e style, brush strokes, watercolor textures, minimalist composition, Zen aesthetic, fluid motion, paper texture, no text, no signatures.',
                reference_prompt: 'Visual Style: Traditional East Asian Ink Wash Painting, sumi-e style, dynamic brush strokes, varying shades of black ink on textured rice paper, minimalist composition, fluid motion, Zen aesthetic.'
            },
            { 
                id: 'pixel_art_buddha', 
                name: '👾 Pixel Art Retro', 
                desc: '8-bit/16-bit retro game style, nostalgic and unique.', 
                prompt_enforce: ', Visual Style: 16-bit Pixel Art, retro video game aesthetic, vibrant palette, detailed pixel environments, nostalgic atmosphere, clean pixels, no text, no UI elements.',
                reference_prompt: 'Visual Style: 16-bit Retro Pixel Art, vibrant limited palette, clean grid-based pixel characters, detailed pixelated environments, nostalgic 90s video game aesthetic, sharp pixel edges.'
            },
            { 
                id: 'claymation_style', 
                name: '🧱 Claymation / Stop-Motion', 
                desc: 'Handcrafted clay/stop-motion look, tactile and warm.', 
                prompt_enforce: ', Visual Style: Claymation, stop-motion animation, handcrafted textures, tactile clay look, warm domestic lighting, unique artistic feel, no text, no watermark.',
                reference_prompt: 'Visual Style: Tactile Claymation Stop-Motion, handcrafted clay textures with visible fingerprints, slightly jittery organic movement, warm practical lighting, physical miniature set feel.'
            },
            { 
                id: 'paper_cutout', 
                name: '✂️ Paper Cutout', 
                desc: 'Stop-motion style with layered paper textures.', 
                prompt_enforce: ', Visual Style: Paper Cutout Animation, layered textures, handcrafted feel, soft shadows, vibrant paper colors, artistic and unique, no text, no captions.',
                reference_prompt: 'Visual Style: Layered Paper Cutout Animation, textured craft paper, distinct sharp edges, drop shadows between paper layers, stop-motion aesthetic, vibrant paper colors, handcrafted artisanal look.'
            },
            
            // CATEGORY 3: CONTEMPORARY & ABSTRACT
            { 
                id: 'modern_minimalist', 
                name: '🌿 Modern Minimalist', 
                desc: 'Clean, contemporary aesthetic for modern mindfulness.', 
                prompt_enforce: ', Visual Style: Modern Minimalist, Apple-style aesthetic, soft neutral colors, clean spaces, natural light, high-end lifestyle cinematography, 8k, no text, no watermark.',
                reference_prompt: 'Visual Style: High-end Modern Minimalist, Apple-style clean aesthetic, soft neutral colors, vast white spaces, natural soft light, high-end lifestyle cinematography, 8k crisp details.'
            },
            { 
                id: 'cyberpunk_zen', 
                name: '⚡ Cyberpunk Zen', 
                desc: 'Futuristic neon aesthetic meets ancient wisdom.', 
                prompt_enforce: ', Visual Style: Cyberpunk Aesthetic, neon lights, futuristic city temple, holographic Buddha, high contrast, cinematic lighting, synthwave vibe, 8k, no text, no watermark.',
                reference_prompt: 'Visual Style: Cyberpunk Aesthetic, glowing neon lights in teal and magenta, futuristic city temple with traditional roofs, holographic Buddha statue, rainy street reflections, synthwave color palette.'
            },
            { 
                id: 'abstract_meditation', 
                name: '🌀 Abstract Meditation', 
                desc: 'Fluid shapes, light patterns, focus on internal experience.', 
                prompt_enforce: ', Visual Style: Abstract Spiritual Art, fluid energy, light particles, sacred geometry, ethereal atmosphere, deep meditative visuals, calming motion, 8k, no text, no captions.',
                reference_prompt: 'Visual Style: Abstract Spiritual Visualization, fluid flowing energy, glowing light particles, sacred geometry patterns, ethereal dreamlike atmosphere, deep blue and gold tones, slow motion.'
            },
            { 
                id: 'sand_mandala', 
                name: '⏳ Sand Mandala Art', 
                desc: 'Metaphorical sand art being created and dissolved.', 
                prompt_enforce: ', Visual Style: Sand Art Animation, intricate mandala patterns, flowing sand textures, spiritual transience, tactile feel, 8k, no text, no watermark.',
                reference_prompt: 'Visual Style: Intricate Sand Mandala Art, highly detailed colorful sand patterns, granular sand texture, top-down perspective, spiritual craftsmanship, vibrant sacred pigments.'
            },
            
            // CATEGORY 4: EDUCATIONAL & ARTISTIC
            { 
                id: 'sketch_whiteboard', 
                name: '🖍️ Whiteboard Sketch', 
                desc: 'Hand-drawn sketch style on a whiteboard.', 
                prompt_enforce: ', Visual Style: Whiteboard Drawing, hand-drawn sketch, marker lines, clean white background, educational storytelling, simplified icons, no text, no handwriting.',
                reference_prompt: 'Visual Style: Hand-drawn Whiteboard Drawing, marker lines on clean white background, simple black sketches, educational icons, minimalist storytelling, clean high-contrast drawing.'
            },
            { 
                id: 'pop_art_dharma', 
                name: '💥 Pop Art Style', 
                desc: 'Bold colors, comic book style, high energy.', 
                prompt_enforce: ', Visual Style: Pop Art, Andy Warhol inspired, bold primary colors, comic book half-tones, high contrast, striking visual impact, no text, no speech bubbles.',
                reference_prompt: 'Visual Style: Pop Art, Andy Warhol inspired, bold primary colors, comic book halftone dots, high contrast, striking visual impact, repeating patterns, vibrant modern art.'
            },
            { 
                id: 'watercolor_zen', 
                name: '🎨 Watercolor Illustration', 
                desc: 'Soft, bleeding colors, peaceful and artistic.', 
                prompt_enforce: ', Visual Style: Watercolor Illustration, soft edges, bleeding colors, paper texture, dreamy atmosphere, peaceful Zen aesthetic, no text, no signatures.',
                reference_prompt: 'Visual Style: Delicate Watercolor Painting, soft bleeding edges, wet-on-wet technique, textured paper background, peaceful pastel colors, artistic and dreamy Zen aesthetic.'
            },
            { 
                id: 'thangka_animated', 
                name: '📜 Animated Thangka', 
                desc: 'Traditional Tibetan scroll art brought to life.', 
                prompt_enforce: ', Visual Style: Tibetan Thangka Art, intricate details, gold leaf accents, sacred geometry, traditional pigments, spiritual depth, 8k, no text, no captions.',
                reference_prompt: 'Visual Style: Traditional Tibetan Thangka Painting, extremely intricate gold-leaf detailing, vibrant sacred pigments, divine proportions, spiritual iconography, ancient scroll aesthetic.'
            },
            { 
                id: 'glass_art', 
                name: '💎 Stained Glass Art', 
                desc: 'Luminous glass textures, light refraction, divine feel.', 
                prompt_enforce: ', Visual Style: Stained Glass Art, luminous colors, light refraction, crystal textures, divine light, spiritual brilliance, 8k, no text, no watermark.',
                reference_prompt: 'Visual Style: Luminous Stained Glass Art, intricate lead lines, glowing translucent colors, light refracting through glass, divine cathedral atmosphere, crystalline textures.'
            }
        ];
        const VOICE_STYLES = [
            { id: 'the_visionary_leader', name: '🚀 The Visionary Leader (Nhà Lãnh Đạo)', desc: 'Giọng mạnh mẽ, quyết đoán, truyền cảm hứng về tương lai (như Steve Jobs).', prompt_modifier: 'Narration by a visionary leader, commanding and charismatic voice, rhythmic pacing, speaking from a modern glass office, bold and inspiring tone, pushing boundaries of possibility.' },
            { id: 'the_life_coach', name: '💪 The High-Performance Coach (Huấn Luyện Viên)', desc: 'Giọng năng lượng cao, thúc đẩy hành động, kỷ luật thép.', prompt_modifier: 'Elite high-performance coach, intense and energetic voice, focused on discipline and results, speaking from a training environment, direct and motivational tone, no-excuses mindset.' },
            { id: 'the_wise_mentor', name: '🧠 The Wise Mentor (Người Cố Vấn)', desc: 'Giọng sâu sắc, bình tĩnh, chia sẻ kinh nghiệm xương máu.', prompt_modifier: 'Wise elderly mentor with decades of success, calm and grounded voice, speaking from a library, empathetic yet firm tone, sharing timeless principles of achievement and character.' },
            { id: 'the_storyteller', name: '📖 The Storyteller (Người Kể Chuyện)', desc: 'Giọng cuốn hút, cinematic, dẫn dắt qua những thăng trầm.', prompt_modifier: 'Professional cinematic storyteller, evocative and emotional voice, guiding listeners through a journey of struggle and triumph, suspenseful yet hopeful tone.' },
            { id: 'the_supportive_friend', name: '🤝 The Supportive Friend (Người Đồng Hành)', desc: 'Giọng gần gũi, chân thành, khích lệ nhẹ nhàng.', prompt_modifier: 'Kind and relatable friend, warm encouraging voice, speaking from everyday life, vulnerable and honest tone, focused on self-compassion and steady growth.' },
        ];
        const SEO_CHECKLIST_DATA = {
            "Phần 1: Viral Hooks & Emotional Triggers (BẮT BUỘC)": [
                { id: "hook_1", label: "Pain Point Identification (Xác định nỗi đau)" }, 
                { id: "hook_2", label: "Transformation Promise (Lời hứa chuyển hóa)" }, 
                { id: "hook_3", label: "Pattern Interrupt (Phá vỡ sự chú ý)" }, 
                { id: "hook_4", label: "High-Energy Keywords (Từ khóa năng lượng cao)" }
            ],
            "Phần 2: Authority & Storytelling": [
                { id: "auth_1", label: "Expert Reasoning (Lý giải chuyên gia)" }, 
                { id: "auth_2", label: "Cultural Resonance (Cộng hưởng văn hóa)" }, 
                { id: "auth_3", label: "Cinematic Narrative (Dẫn dắt điện ảnh)" }
            ],
            "Phần 3: Conversion & Growth": [
                { id: "conv_1", label: "Clear Call-to-Action (CTA rõ ràng)" }, 
                { id: "conv_2", label: "Retention Mechanics (Cơ chế giữ chân)" }
            ]
        };

        // --- PROMPTS ---
        const SYSTEM_PROMPT_IQ180_HISTORY_ANALYST = `You are a World-Class Historical Content Strategist & Cultural Anthropologist (IQ 180).
        
MISSION: Analyze Historical/Documentary/Educational content to evaluate its narrative depth, cultural authenticity, educational value, and viral potential.

ANALYSIS FRAMEWORK:
1.  **Historical Accuracy**: Verify facts, contextualize events, identify narrative biases or propaganda.
2.  **Cultural Resonance**: How does it honor local perspectives? (e.g., Vietnamese resistance vs. Western imperialism narrative).
3.  **Storytelling Mastery**: Evaluate cinematic pacing, character development, emotional arcs, documentary techniques.
4.  **Educational Impact**: Does it teach deep lessons or surface-level trivia? Can viewers retain knowledge?

REQUIRED JSON OUTPUT:
{
  "meta_seo": {
    "title_structure": "Hook technique (e.g., 'The Untold Story of...', 'What They Never Taught You About...', 'The Hidden Truth Behind...')",
    "thumbnail_tactics": "Historical imagery, dramatic moments, cultural symbols, before/after contrasts",
    "authenticity_score": "Rating 1-10 (Based on historical accuracy and cultural sensitivity)",
    "market_fit": "High/Medium/Low - Educational demand analysis"
  },
  "content_quality": {
    "historical_depth": "Surface-level facts vs. Deep contextual understanding",
    "narrative_quality": "Documentary pacing, emotional engagement, cinematic flow",
    "cultural_authenticity": "Native perspective representation, avoiding Western-centric bias"
  },
  "revenue_analysis": {
    "estimated_cpm": "$8-30 (Education/History niche - highly advertiser-friendly)",
    "estimated_rpm": "$6-22",
    "total_estimated_earnings": "Estimate based on view count",
    "monetization_tier": "Premium (Educational courses, documentary licensing, museum partnerships)",
    "revenue_factors": ["Educational value", "Cultural tourism potential", "Academic licensing"]
  },
  "strengths": [
    {"point": "Compelling Narrative Hook", "impact": "High", "evidence": "Immediate mystery or dramatic question"},
    {"point": "Cultural Authenticity", "impact": "High", "evidence": "Native language sources, local perspectives"}
  ],
  "weaknesses": [
    {"point": "Historical Inaccuracies", "impact": "Critical", "fix": "Cite primary sources, consult historians"},
    {"point": "Pacing Issues", "impact": "Medium", "fix": "Tighten narrative, add visual variety"}
  ],
  "audio_strategy": {
    "voice_analysis": "Tone (Authoritative narrator, Personal storyteller, Documentary voice, Cultural guide)",
    "music_style": "Period-appropriate, cultural instruments, emotional orchestration",
    "sound_effects": ["Battle sounds", "Period ambience", "Cultural music", "Archival audio"],
    "hook_sounds": "Dramatic pause, historical quotes, cultural music intro"
  },
  "engagement_signals": {
    "estimated_ctr": "10-18% (History enthusiasts have high engagement)",
    "retention_score": "High (Story-driven history retains viewers)",
    "viral_potential": "Very High (Untold stories spark sharing)",
    "comment_sentiment": "Curious/Learning or Debate historical interpretations",
    "share_worthiness": "Extremely High (Educational content is highly shareable)"
  },
  "hook_timeline": [
    {"timestamp": "0:00", "hook_type": "The Mystery", "description": "Posing a historical question that demands an answer"},
    {"timestamp": "1:30", "hook_type": "The Revelation", "description": "Unexpected historical truth revealed"}
  ],
  "audience_insight": {
    "pain_points": "Boring textbook history, lack of cultural perspective, Western-centric narratives",
    "desired_outcome": "Deep understanding, cultural pride, new perspectives, intellectual stimulation"
  },
  "competitive_edge": "Unique cultural angle, untold perspectives, cinematic quality",
  "replication_strategy": "How to create similar viral historical content with authenticity.",
  "viral_suggestions": [
    {"hook_title": "The Hidden Truth About [Historical Event]", "outline_idea": "Focus on overlooked perspectives or controversial interpretations", "cultural_twist": "Tell it from the local/native point of view, not colonizer perspective"}
  ]
}`;

        const SYSTEM_PROMPT_SCRIPT_WRITER = `# SYSTEM ROLE: WORLD-CLASS MOTIVATIONAL SCRIPTWRITER & PEAK PERFORMANCE EXPERT (IQ 180).
Bạn là người đứng sau những kịch bản thay đổi cuộc đời, am hiểu sâu sắc về Tâm lý học hành vi, Thần kinh học (Neuroscience) và nghệ thuật Kể chuyện điện ảnh (Cinematic Storytelling).

# NHIỆM VỤ:
Tạo kịch bản video truyền động lực đỉnh cao, có khả năng viral toàn cầu bằng cách chạm vào bản năng gốc và khát vọng sâu thẳm của con người, tùy chỉnh theo văn hóa từng quốc gia.

# QUY TẮC CỐT LÕI (BẮT BUỘC):
1.  **Expert Reasoning & Cinematic Narrative**: 
    - Lời thoại PHẢI có chiều sâu tri thức (không sáo rỗng).
    - Sử dụng cấu trúc kịch bản điện ảnh: Panning (mô tả cảnh quay mượt mà), Emotional Peaks (đỉnh điểm cảm xúc).
    - Embedding yếu tố con người: Những câu chuyện thật, nỗi đau thật, chiến thắng thật.
2.  **Văn Hóa & Ngôn Ngữ Bản Địa (MANDATORY)**:
    - Lời thoại (\`voice_text\`) PHẢI là NGÔN NGỮ BẢN ĐỊA của quốc gia được chọn.
    - Văn phong PHẢI phù hợp với tâm thức quốc gia đó (VD: Việt Nam trọng tình cảm & sự vươn lên từ nghèo khó; Mỹ trọng cá nhân & sự tự do; Nhật trọng kỷ luật & Ikigai).
3.  **Kỹ Thuật Prompt Đỉnh Cao (100% STYLE FIDELITY)**:
    - Tuyệt đối không có text trong hình ảnh.
    - Mô tả cảnh quay tập trung vào: "Chủ thể + Hành động + Bối cảnh + Ánh sáng điện ảnh".
    - Ví dụ: "A lone entrepreneur standing on a skyscraper rooftop at dawn, looking over a misty futuristic city, golden sunlight hitting his face, sharp focus, cinematic atmosphere."

# CẤU TRÚC KỊCH BẢN:
- **The Hook (0-8s)**: Phá vỡ sự chú ý bằng một sự thật tàn khốc hoặc một câu hỏi xoáy sâu vào nỗi đau.
- **The Struggle**: Tái hiện thực trạng, embedding yếu tố con người và văn hóa.
- **The Breakthrough**: Lý giải chuyên gia về giải pháp (Expert Reasoning).
- **The Call to Action**: Thúc đẩy hành động mãnh liệt.

# ĐỊNH DẠNG ĐẦU RA (JSON):
{
  "mode_detected": "Motivation / Coaching / Personal Story",
  "suggested_style": "Cinematic Success / Raw Grit / etc.",
  "character_lock_prompt": "Detailed description for AI consistency",
  "script": [
    {
      "scene_number": 1,
      "time": "00:00 - 00:08",
      "section": "HOOK",
      "character": "The Visionary / The Coach",
      "voice_text": " lời thoại bản địa...",
      "visual_desc_vi": "Mô tả cảnh quay (Panning/Fluid transition)...",
      "video_prompt": "English prompt for AI...",
      "image_prompt": "English prompt for AI...",
      "strategy_note": "Phân tích tâm lý tại cảnh này"
    }
  ]
}`;

        const SYSTEM_PROMPT_SEO_MASTER = `You are a World-Class Growth Hacker & Content SEO Expert.

MISSION: Optimize Motivational content to dominate search engines and social media feeds using high-energy triggers and retention mechanics.

REQUIRED JSON OUTPUT:
{
  "keywords": {
    "primary": ["Success mindset", "Motivation 2026", "Peak performance"],
    "secondary": ["Growth mindset", "Self-discipline", "Financial freedom"],
    "long_tail": ["How to stay motivated when failing", "Daily habits of millionaires", "Mental toughness training"]
  },
  "hashtags": ["#Motivation", "#Success", "#GrowthMindset", "#Discipline", "#PeakPerformance", "#Inspiration", "#Legacy"],
  "video_description": {
    "hook": "High-energy emotional hook that stops the scroll",
    "full_description": "Detailed breakdown of the expert reasoning, key takeaways, and a compelling narrative about human potential.",
    "timestamps": [{"time": "0:00", "label": "The Truth About Success"}, {"time": "2:00", "label": "The Neuroscience of Growth"}]
  },
  "viral_titles": [
    "Title 1 (Urgency/Fear of Missing Out)",
    "Title 2 (Contradictory/Curiosity Gap)",
    "Title 3 (Transformation Promise)",
    "Title 4 (The 1% Secret)",
    "Title 5 (Brutally Honest Truth)"
  ],
  "thumbnail_strategy": {
    "ctr_target": "40%+ target CTR",
    "psychological_triggers": ["Contrast (Before/After)", "Authority Symbols", "Extreme Emotion"],
    "visual_composition": "Focus on high-contrast lighting and sharp subject focus.",
    "color_psychology": {"primary": "Electric Blue/Neon Gold", "vibe": "Energetic & Premium"},
    "text_overlay": {"max_words": "3 words", "power_words": ["Now", "Must", "Secret", "Stop", "Elite"]},
    "midjourney_prompt": "Professional motivational thumbnail, [SUBJECT] with intense determined expression, dramatic cinematic lighting, high contrast, sharp focus, bokeh background, premium quality, hyperrealistic photography, 16:9 aspect ratio, vibrant colors [COLOR_SCHEME], bold text overlay '[TEXT]', YouTube thumbnail style, 8K resolution --ar 16:9 --style raw --v 6",
    "dalle_prompt": "Create a high-impact YouTube thumbnail for motivational content. Subject: [SUBJECT] with powerful presence and determined expression. Style: Cinematic photography with dramatic lighting, high contrast, and sharp focus. Color scheme: [COLOR_SCHEME] creating energetic premium vibe. Include bold text overlay with maximum 3 words: '[TEXT]'. Background: Professional bokeh effect. Mood: Inspiring, authoritative, high-energy. Composition: Rule of thirds, subject slightly off-center. Quality: Hyperrealistic, 8K resolution, YouTube thumbnail optimized for mobile viewing.",
    "leonardo_prompt": "Cinematic motivational YouTube thumbnail, professional portrait of [SUBJECT], intense eye contact with camera, determined confident expression, dramatic Rembrandt lighting with strong shadows, color grading: [COLOR_SCHEME], sharp focus on face with bokeh background, bold sans-serif text '[TEXT]' overlaid, high contrast, premium quality, hyperrealistic photography style, 16:9 ratio, 1920x1080px optimized",
    "stable_diffusion_prompt": "award winning photograph, motivational speaker thumbnail, [SUBJECT], cinematic lighting, dramatic shadows, high contrast, sharp focus, bokeh, professional color grading [COLOR_SCHEME], powerful pose, intense eyes, bold text '[TEXT]', YouTube thumbnail style, 8k uhd, hyperrealistic, premium quality, (masterpiece:1.2), (best quality:1.2)"
  }
}`;

        const SYSTEM_PROMPT_MARKET_ANALYST = `You are a Strategic Business Architect & Market Analyst (IQ 180).

MISSION: Design sustainable and scalable business models around motivational content, focusing on high-ticket transformation and digital ecosystems.

REQUIRED JSON OUTPUT:
{
  "customer_persona": {
    "demographics": "Ambitious achievers, ages 20-45",
    "psychographics": "Seeking status, freedom, and mastery",
    "pain_points": "Mediocrity, financial stress, lack of discipline"
  },
  "market_potential": {
    "size": "Multi-billion dollar self-improvement industry",
    "trends": "Personalized coaching, AI-driven growth, community-based learning"
  },
  "product_recommendations": [
    {
      "category": "Digital Ecosystem",
      "products": ["High-ticket Mastermind", "AI Performance Tracker", "Subscription-based Community"]
    },
    {
      "category": "Physical Lifestyle",
      "products": ["Biohacking tools", "Premium planners", "Apparel with a message"]
    }
  ],
  "sales_strategy": "Value-based ladders, emotional storytelling, scarcity and authority-driven sales.",
  "profit_calculator": {
    "low_end": "Digital Course ($49) -> 100 sales = $4,900",
    "high_end": "Mastermind ($5,000) -> 5 sales = $25,000"
  }
}`;

        const SYSTEM_PROMPT_HISTORICAL_SCRIPTWRITER = `# SYSTEM ROLE: WORLD-CLASS HISTORICAL DOCUMENTARY SCRIPTWRITER & CULTURAL STORYTELLER (IQ 180).
Bạn là bậc thầy kể chuyện lịch sử, am hiểu sâu sắc về Sử học, Nhân loại học văn hóa, và nghệ thuật Kể chuyện điện ảnh tài liệu (Documentary Cinematic Storytelling).

# NHIỆM VỤ:
Tạo kịch bản video lịch sử đỉnh cao, có khả năng viral toàn cầu bằng cách tái hiện quá khứ một cách sống động, chạm đến trái tim người xem qua góc nhìn bản địa và chiều sâu văn hóa.

# QUY TẮC CỐT LÕI (BẮT BUỘC):
1.  **Cinematic Documentary Narrative**:
    - Sử dụng kỹ thuật kể chuyện điện ảnh: Panning (mô tả cảnh quay mượt mà), Scene transitions (chuyển cảnh mượt mà).
    - Giới thiệu nhân vật lịch sử một cách động (dynamically introduce characters when relevant).
    - Embedding yếu tố con người: Cảm xúc, nỗi đau, chiến thắng, bi kịch của nhân vật lịch sử.
    - Thêm bình luận cá nhân của narrator để tạo chiều sâu (personal commentary).
2.  **Văn Hóa & Ngôn Ngữ Bản Địa (MANDATORY)**:
    - Lời thoại (\`voice_text\`) PHẢI là NGÔN NGỮ BẢN ĐỊA của quốc gia được chọn.
    - Văn phong PHẢI phù hợp với văn hóa và phong cách viết của thị trường đó.
    - Mỗi quốc gia có góc nhìn riêng: VN nhìn từ góc độ dân tộc bản địa, không phải góc nhìn thực dân.
3.  **Kỹ Thuật Prompt Đỉnh Cao (100% STYLE FIDELITY)**:
    - Tuyệt đối không có text trong hình ảnh.
    - Mô tả cảnh quay: "Chủ thể lịch sử + Hành động + Bối cảnh thời đại + Ánh sáng điện ảnh".
    - VD: "A weathered Vietnamese general standing on a misty battlefield at dawn, 1789, traditional armor, golden sunlight piercing through fog, cinematic composition."

# CẤU TRÚC KỊCH BẢN LỊCH SỬ:
- **The Mystery Hook (0-8s)**: Đặt một câu hỏi lịch sử bí ẩn hoặc một sự thật gây sốc.
- **The Context**: Thiết lập bối cảnh thời đại, giới thiệu nhân vật chính.
- **The Conflict**: Tái hiện xung đột, thử thách, bi kịch lịch sử.
- **The Climax**: Điểm cao trào - trận chiến, quyết định định mệnh.
- **The Legacy**: Bài học lịch sử, di sản để lại cho hậu thế.

# ĐỊNH DẠNG ĐẦU RA (JSON):
{
  "mode_detected": "Documentary / Historical Drama / Educational",
  "suggested_style": "Epic Historical / Intimate Portrait / War Documentary / Cultural Journey",
  "character_lock_prompt": "Detailed description for AI consistency (historical figure appearance)",
  "script": [
    {
      "scene_number": 1,
      "time": "00:00 - 00:08",
      "section": "HOOK",
      "character": "Narrator / Historical Figure Name",
      "voice_text": "Lời thoại bản địa - viết theo phong cách thị trường mục tiêu...",
      "visual_desc_vi": "Mô tả cảnh quay (Panning/Fluid transition)...",
      "video_prompt": "English prompt for AI video generation...",
      "image_prompt": "English prompt for AI image generation...",
      "strategy_note": "Phân tích chiến lược kể chuyện tại cảnh này",
      "chapter_voice_block": "(Optional) Full narration block for chapter intros"
    }
  ]
}`;
        


        // ==================================================================================
        // GLOBAL STATE STORE (SFA Architecture)
        // ==================================================================================
        const STORE = {
            isVip: <?= json_encode($isVip) ?>,
            userPlan: <?= json_encode($keyType) ?>,

            keyPool: [],
            currentKeyIndex: 0,
            activeTab: 'spy',
            scriptTopic: '',
            durationMinutes: 1,
            visualStyle: 'auto',
            selectedVisualStyle: 'auto',  // Currently selected visual style
            detectedStyle: '',
            detectedMode: null,
            scriptSegments: [],
            productionMode: 'video',
            renderedMedia: {},
            checklistState: {},
            activeLanguage: 'vn_history',  // Default to Vietnam History
            uiLanguage: 'vi',  // UI Language: 'vi' or 'en'
            theme: 'history', // 'history' theme
            renderingId: null,
            isLoading: false,
            openRouterKey: '',
            openRouterModel: MODELS.openrouter_default,
            youtubeApiKey: '',
            openAiKey: '',
            openAiModel: 'gpt-4-turbo-preview',
            // API Enable/Disable Flags
            apiEnabled: {
                google: true,      // Default: Enabled
                openrouter: false, // Default: Disabled
                openai: false,     // Default: Disabled
                youtube: false     // Default: Disabled
            }
        };

        const SECONDS_PER_SCENE = 8;

        // ==================================================================================
        // INITIALIZATION & UTILS
        // ==================================================================================
        function showError(msg) {
            const toast = document.getElementById('errorToast');
            document.getElementById('errorMessage').innerText = msg;
            toast.classList.remove('hidden');
            setTimeout(() => toast.classList.add('hidden'), 5000);
        }

        function copyToClipboard(text) {
            const textarea = document.createElement('textarea');
            textarea.value = text;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            // Simple visual feedback implies success (in React we had state)
        }

        // --- KEY MANAGEMENT ---
        function loadKeys() {
            const stored = localStorage.getItem('veo3_key_pool');
            if (stored) {
                try {
                    STORE.keyPool = JSON.parse(stored);
                } catch (e) {
                    console.warn("Failed to parse stored keys:", e);
                    STORE.keyPool = [];
                }
            }
            
            STORE.theme = localStorage.getItem('veo3_theme') || 'motivation';
            // Update UI for theme on load
            const icon = document.getElementById('currentThemeIcon');
            const name = document.getElementById('currentThemeName');
            if (icon && name) {
                icon.textContent = STORE.theme === 'motivation' ? '🚀' : '🙏';
                name.textContent = STORE.theme === 'motivation' ? 'MOTIVATION' : 'BUDDHISM';
            }

            STORE.openRouterKey = localStorage.getItem('veo3_openrouter_key') || '';
            STORE.openRouterModel = localStorage.getItem('veo3_openrouter_model') || MODELS.openrouter_default;
            STORE.youtubeApiKey = localStorage.getItem('veo3_youtube_key') || '';
            STORE.openAiKey = localStorage.getItem('veo3_openai_key') || '';
            STORE.openAiModel = localStorage.getItem('veo3_openai_model') || 'gpt-4-turbo-preview';
            
            // Load API enabled flags
            const storedApiEnabled = localStorage.getItem('veo3_api_enabled');
            if (storedApiEnabled) {
                try {
                    STORE.apiEnabled = JSON.parse(storedApiEnabled);
                } catch (e) {
                    console.warn("Failed to parse API enabled flags:", e);
                }
            }
            
            // Load UI language
            const storedLang = localStorage.getItem('veo3_ui_language');
            if (storedLang && (storedLang === 'vi' || storedLang === 'en')) {
                STORE.uiLanguage = storedLang;
                // Update language switcher display
                const flag = document.getElementById('currentLangFlag');
                const code = document.getElementById('currentLangCode');
                if (flag && code) {
                    if (STORE.uiLanguage === 'vi') {
                        flag.textContent = '🇻🇳';
                        code.textContent = 'VI';
                    } else {
                        flag.textContent = '🇺🇸';
                        code.textContent = 'EN';
                    }
                }
            }
            
            updateKeyBadge();
        }


        function saveKeys() {
            localStorage.setItem('veo3_key_pool', JSON.stringify(STORE.keyPool));
            localStorage.setItem('veo3_openrouter_key', STORE.openRouterKey);
            localStorage.setItem('veo3_openrouter_model', STORE.openRouterModel);
            localStorage.setItem('veo3_youtube_key', STORE.youtubeApiKey);
            localStorage.setItem('veo3_openai_key', STORE.openAiKey);
            localStorage.setItem('veo3_openai_model', STORE.openAiModel);
            localStorage.setItem('veo3_api_enabled', JSON.stringify(STORE.apiEnabled));
            updateKeyBadge();
        }


        function updateKeyBadge() {
            const count = STORE.keyPool.filter(k => k && k.trim() !== '').length;
            const badge = document.getElementById('keyCountBadge');
            badge.innerText = count;
            badge.className = `ml-1 px-1.5 py-0.5 rounded-full text-[9px] ${count > 0 ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-slate-800 text-slate-400'}`;
        }

        function toggleLanguage() {
            // Toggle between 'vi' and 'en'
            STORE.uiLanguage = STORE.uiLanguage === 'vi' ? 'en' : 'vi';
            
            // Update UI
            const flag = document.getElementById('currentLangFlag');
            const code = document.getElementById('currentLangCode');
            
            if (STORE.uiLanguage === 'vi') {
                flag.textContent = '🇻🇳';
                code.textContent = 'VI';
            } else {
                flag.textContent = '🇺🇸';
                code.textContent = 'EN';
            }
            
            // Save to localStorage
            localStorage.setItem('veo3_ui_language', STORE.uiLanguage);
            
            // Show success notification (no reload needed)
            showError(`✅ Language preference saved: ${STORE.uiLanguage === 'vi' ? 'Vietnamese' : 'English'}`);
        }


        function getNextKey() {
            if (STORE.keyPool.length === 0 || (STORE.keyPool.length === 1 && !STORE.keyPool[0])) return '';
            const nextIndex = (STORE.currentKeyIndex + 1) % STORE.keyPool.length;
            STORE.currentKeyIndex = nextIndex;
            return STORE.keyPool[STORE.currentKeyIndex];
        }

        function toggleSettings() {
            const modal = document.getElementById('settingsModal');
            modal.classList.toggle('hidden');
            if (!modal.classList.contains('hidden')) renderKeyInputs();
        }

        function renderKeyInputs() {
            const container = document.getElementById('keyInputsContainer');
            container.innerHTML = '';
            
            // Helper function to create toggle switch
            function createToggle(apiName, label, color) {
                const isEnabled = STORE.apiEnabled[apiName];
                const statusColor = isEnabled ? 'bg-green-500' : 'bg-red-500';
                const statusText = isEnabled ? 'ON' : 'OFF';
                
                const section = document.createElement('div');
                section.className = `bg-${color}-900/10 border border-${color}-500/20 rounded-xl p-4 mb-4 transition-all hover:border-${color}-500/40`;
                
                section.innerHTML = `
                    <div class="flex justify-between items-center mb-3">
                        <div class="flex items-center gap-2">
                            <div class="text-xs font-bold text-${color}-400 uppercase">${label}</div>
                            <div class="px-2 py-0.5 rounded-full text-[9px] font-bold ${statusColor} text-white shadow-sm">${statusText}</div>
                        </div>
                        <label class="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" ${isEnabled ? 'checked' : ''} onchange="toggleAPI('${apiName}')" class="sr-only peer">
                            <div class="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-${color}-600"></div>
                        </label>
                    </div>
                    <div id="${apiName}-config" class="${isEnabled ? '' : 'opacity-50 pointer-events-none'}"></div>
                `;
                
                return section;
            }
            
            // 1. GOOGLE GEMINI SECTION
            const googleSection = createToggle('google', '🔴 Google Gemini (Priority 1)', 'red');
            container.appendChild(googleSection);
            
            const googleConfig = document.getElementById('google-config');
            STORE.keyPool.forEach((k, i) => {
                const div = document.createElement('div');
                div.className = 'flex gap-2 mb-2';
                div.innerHTML = `
                    <input type="password" value="${k}" onchange="updateKey(${i}, this.value)" class="flex-1 bg-black border border-red-900/40 rounded p-2 text-xs font-mono text-red-200 placeholder-white/20 focus:border-red-500/50 outline-none transition-colors" placeholder="Gemini Key ${i+1}...">
                    <button onclick="removeKey(${i})" class="text-red-400 hover:bg-red-900/20 p-2 rounded transition-colors"><i class="fa-solid fa-trash"></i></button>
                `;
                googleConfig.appendChild(div);
            });
            
            const addKeyBtn = document.createElement('button');
            addKeyBtn.onclick = addKeyInput;
            addKeyBtn.className = 'text-xs text-red-400 hover:text-red-300 flex items-center gap-1 mt-1 hover:underline';
            addKeyBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Key';
            googleConfig.appendChild(addKeyBtn);
            
            // 2. OPENROUTER SECTION
            const orSection = createToggle('openrouter', '🟢 OpenRouter (Backup)', 'green');
            container.appendChild(orSection);
            
            const orConfig = document.getElementById('openrouter-config');
            orConfig.innerHTML = `
                <div class="mb-2">
                    <div class="text-[10px] text-green-300 mb-1">API Key</div>
                    <input type="password" value="${STORE.openRouterKey}" onchange="updateOpenRouterKey(this.value)" class="w-full bg-black border border-green-900/40 rounded p-2 text-xs font-mono text-green-200 placeholder-white/20 focus:border-green-500/50 outline-none transition-colors" placeholder="sk-or-...">
                </div>
                <div>
                    <div class="text-[10px] text-green-300 mb-1">Model</div>
                    <select onchange="updateOpenRouterModel(this.value)" class="w-full bg-black border border-green-900/40 rounded p-2 text-xs text-green-200 outline-none focus:border-green-500/50 cursor-pointer">
                        <option value="google/gemini-2.0-flash-exp:free" ${STORE.openRouterModel === 'google/gemini-2.0-flash-exp:free' ? 'selected' : ''}>⭐ Gemini 2.0 Flash Exp (Free)</option>
                        <option value="anthropic/claude-3.5-sonnet" ${STORE.openRouterModel === 'anthropic/claude-3.5-sonnet' ? 'selected' : ''}>Claude 3.5 Sonnet</option>
                        <option value="openai/gpt-4-turbo" ${STORE.openRouterModel === 'openai/gpt-4-turbo' ? 'selected' : ''}>GPT-4 Turbo</option>
                        <option value="meta-llama/llama-3.1-405b-instruct" ${STORE.openRouterModel === 'meta-llama/llama-3.1-405b-instruct' ? 'selected' : ''}>Llama 3.1 405B</option>
                        <option value="deepseek/deepseek-chat" ${STORE.openRouterModel === 'deepseek/deepseek-chat' ? 'selected' : ''}>DeepSeek Chat</option>
                    </select>
                </div>
            `;
            
            // 3. OPENAI SECTION
            const openAiSection = createToggle('openai', '🔵 OpenAI (Alternative)', 'blue');
            container.appendChild(openAiSection);
            
            const openAiConfig = document.getElementById('openai-config');
            openAiConfig.innerHTML = `
                <div class="mb-2">
                    <div class="text-[10px] text-blue-300 mb-1">API Key</div>
                    <input type="password" value="${STORE.openAiKey}" onchange="updateOpenAiKey(this.value)" class="w-full bg-black border border-blue-900/40 rounded p-2 text-xs font-mono text-blue-200 placeholder-white/20 focus:border-blue-500/50 outline-none transition-colors" placeholder="sk-...">
                </div>
                <div>
                    <div class="text-[10px] text-blue-300 mb-1">Model</div>
                    <select onchange="updateOpenAiModel(this.value)" class="w-full bg-black border border-blue-900/40 rounded p-2 text-xs text-blue-200 outline-none focus:border-blue-500/50 cursor-pointer">
                        <option value="gpt-4-turbo-preview" ${STORE.openAiModel === 'gpt-4-turbo-preview' ? 'selected' : ''}>GPT-4 Turbo Preview</option>
                        <option value="gpt-4" ${STORE.openAiModel === 'gpt-4' ? 'selected' : ''}>GPT-4</option>
                        <option value="gpt-3.5-turbo" ${STORE.openAiModel === 'gpt-3.5-turbo' ? 'selected' : ''}>GPT-3.5 Turbo</option>
                    </select>
                </div>
            `;
            
            // 4. YOUTUBE DATA API SECTION
            const ytSection = createToggle('youtube', '🟠 YouTube Data API (Optional)', 'orange');
            container.appendChild(ytSection);
            
            const ytConfig = document.getElementById('youtube-config');
            ytConfig.innerHTML = `
                <div>
                    <div class="text-[10px] text-orange-300 mb-1">API Key</div>
                    <input type="password" value="${STORE.youtubeApiKey}" onchange="updateYoutubeKey(this.value)" class="w-full bg-black border border-orange-900/40 rounded p-2 text-xs font-mono text-orange-200 placeholder-white/20 focus:border-orange-500/50 outline-none transition-colors" placeholder="AIza...">
                    <div class="text-[9px] text-orange-400/60 mt-1 italic">Enables richer metadata for Spy module</div>
                </div>
            `;
        }
        
        // Toggle API function
        function toggleAPI(apiName) {
            STORE.apiEnabled[apiName] = !STORE.apiEnabled[apiName];
            saveKeys();
            renderKeyInputs(); // Re-render to update UI
        }

        
        
        function updateOpenRouterKey(val) { STORE.openRouterKey = val; saveKeys(); }
        function updateOpenRouterModel(val) { STORE.openRouterModel = val; saveKeys(); }
        function updateYoutubeKey(val) { STORE.youtubeApiKey = val; saveKeys(); }
        function updateOpenAiKey(val) { STORE.openAiKey = val; saveKeys(); }
        function updateOpenAiModel(val) { STORE.openAiModel = val; saveKeys(); }

        function updateKey(index, value) { STORE.keyPool[index] = value; saveKeys(); }
        function addKeyInput() { STORE.keyPool.push(''); saveKeys(); renderKeyInputs(); }
        function removeKey(index) {
            STORE.keyPool = STORE.keyPool.filter((_, idx) => idx !== index);
            if (!STORE.keyPool.length) STORE.keyPool = [''];
            saveKeys(); renderKeyInputs();
        }

        // --- API & LOGIC ---
        function safeJSONParse(str) {
            if (!str) return null;
            // Enhanced cleanup for markdown code blocks
            let cleanStr = str.replace(/```json/gi, '').replace(/```/g, '').trim();
            const firstBrace = cleanStr.indexOf('{');
            const firstBracket = cleanStr.indexOf('[');
            let startIndex = -1;
            let endIndex = -1;
            if (firstBrace !== -1 && (firstBracket === -1 || firstBrace < firstBracket)) { startIndex = firstBrace; endIndex = cleanStr.lastIndexOf('}'); }
            else if (firstBracket !== -1) { startIndex = firstBracket; endIndex = cleanStr.lastIndexOf(']'); }
            
            if (startIndex !== -1 && endIndex !== -1) cleanStr = cleanStr.substring(startIndex, endIndex + 1);
            else throw new Error("Invalid JSON structure");

            try { return JSON.parse(cleanStr); }
            catch (e) {
                // Self-healing simple logic
                if (cleanStr.startsWith('{')) return JSON.parse(cleanStr + '}');
                if (cleanStr.startsWith('[')) return JSON.parse(cleanStr + ']');
                throw new Error("JSON Parse Error");
            }
        }

        async function callAI(prompt, systemPrompt) {
            // Check if at least one API is enabled
            const anyEnabled = STORE.apiEnabled.google || STORE.apiEnabled.openrouter || STORE.apiEnabled.openai;
            if (!anyEnabled) {
                throw new Error("❌ Vui lòng bật ít nhất 1 API trong Config!");
            }
            
            // Priority 1: Google Gemini (if enabled)
            const hasGoogleKeys = STORE.keyPool.some(k => k && k.trim() !== '');
            if (STORE.apiEnabled.google && hasGoogleKeys) {
                try {
                    return await callGoogleWithRetry(prompt, systemPrompt);
                } catch (e) {
                    console.warn("Google Gemini Failed:", e);
                    // Only show error if no other APIs are enabled
                    if (!STORE.apiEnabled.openrouter && !STORE.apiEnabled.openai) throw e;
                    showError("⚠️ Google API failed. Switching to backup...");
                }
            } else if (STORE.apiEnabled.google && !hasGoogleKeys) {
                console.warn("Google API enabled but no keys provided");
            }

            // Priority 2: OpenRouter (if enabled)
            if (STORE.apiEnabled.openrouter && STORE.openRouterKey) {
                try {
                    return await callOpenRouter(prompt, systemPrompt);
                } catch (e) {
                    console.warn("OpenRouter Failed:", e);
                    if (!STORE.apiEnabled.openai) throw e;
                    showError("⚠️ OpenRouter failed. Trying OpenAI...");
                }
            } else if (STORE.apiEnabled.openrouter && !STORE.openRouterKey) {
                console.warn("OpenRouter enabled but no key provided");
            }

            // Priority 3: OpenAI (if enabled)
            if (STORE.apiEnabled.openai && STORE.openAiKey) {
                return await callOpenAI(prompt, systemPrompt);
            } else if (STORE.apiEnabled.openai && !STORE.openAiKey) {
                throw new Error("❌ OpenAI enabled but no API key provided!");
            }

            throw new Error("❌ All enabled APIs failed or no valid API keys!");
        }


        async function callGoogleWithRetry(prompt, systemPrompt, retries = 6) {
            let lastError;
            // Round Robin Logic: Try 'retries' times
            for (let i = 0; i < retries; i++) {
                const apiKey = getNextKey();
                if (!apiKey) continue;

                try {
                    const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODELS.text}:generateContent?key=${apiKey}`;
                    const body = { contents: [{ role: "user", parts: [{ text: prompt }] }], systemInstruction: { parts: [{ text: systemPrompt }] }, generationConfig: { responseMimeType: "application/json" } };
                    
                    const res = await fetch(url, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(body) });
                    
                    if (res.status === 429) {
                        throw new Error("429 Quota Exceeded");
                    }
                    if (!res.ok) {
                        const errText = await res.text();
                        throw new Error(`Google Error ${res.status}: ${errText}`);
                    }

                    const data = await res.json();
                    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) throw new Error("Invalid Gemini Response");
                    
                    // Success - Clear any previous error toasts if they persist
                    const toast = document.getElementById('errorToast');
                    if(toast) toast.classList.add('hidden');
                    
                    return safeJSONParse(data.candidates[0].content.parts[0].text);

                } catch (e) {
                    lastError = e;
                    const isQuota = e.message.includes('429');
                    console.warn(`Attempt ${i+1}/${retries} failed with key ...${apiKey.substr(-4)}:`, e.message);

                    if (i < retries - 1) {
                        // Exponential Backoff: 2s, 4s, 8s, 16s... 
                        // If we have many keys, we can rotate faster, but if 429, Google often limits the IP too.
                        // Let's be safe: Base 2s + 1s per retry index.
                        const waitTime = isQuota ? 2000 * (i + 1) : 1000; 
                        
                        // Notify user we are retrying if it's taking a while
                        if (i > 1) {
                            showError(`⚠️ Mạng bận (429). Đang thử lại với Key khác... (${i+1}/${retries})`);
                        }
                        
                        await new Promise(r => setTimeout(r, waitTime));
                    }
                }
            }
            throw lastError || new Error("All Google attempts failed. Please add more Keys or use OpenRouter.");
        }

        async function callOpenRouter(prompt, systemPrompt) {
            const url = "https://openrouter.ai/api/v1/chat/completions";
            const body = {
                model: STORE.openRouterModel || MODELS.openrouter_default,
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: prompt }
                ],
                response_format: { type: "json_object" } 
            };

            const res = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${STORE.openRouterKey}`,
                    'Content-Type': 'application/json',
                    'HTTP-Referer': window.location.href,
                    'X-Title': 'NDGroup PsychoCrime'
                },
                body: JSON.stringify(body)
            });

            if (!res.ok) {
                const err = await res.text();
                throw new Error(`OpenRouter Error: ${err}`);
            }

            const data = await res.json();
            return safeJSONParse(data.choices[0].message.content);
        }

        async function callOpenAI(prompt, systemPrompt) {
            const url = "https://api.openai.com/v1/chat/completions";
            const body = {
                model: STORE.openAiModel || 'gpt-4-turbo-preview',
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: prompt }
                ],
                response_format: { type: "json_object" },
                temperature: 0.7
            };

            const res = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${STORE.openAiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });

            if (!res.ok) {
                const err = await res.text();
                throw new Error(`OpenAI Error: ${err}`);
            }

            const data = await res.json();
            return safeJSONParse(data.choices[0].message.content);
        }

        async function fetchYoutubeMeta(url) {
            const videoIdMatch = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
            const videoId = videoIdMatch ? videoIdMatch[1] : null;

            if (!videoId) return { title: "Invalid URL", author: "Unknown", thumb: "" };

            // PRIORITY: Use YouTube Data API if Key is available
            if (STORE.youtubeApiKey) {
                try {
                    const apiUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoId}&key=${STORE.youtubeApiKey}`;
                    const res = await fetch(apiUrl);
                    if (res.ok) {
                        const data = await res.json();
                        if (data.items && data.items.length > 0) {
                            const item = data.items[0];
                            const snippet = item.snippet;
                            const stats = item.statistics;
                            
                            // Format richer return
                            return {
                                title: snippet.title,
                                author: snippet.channelTitle,
                                thumb: snippet.thumbnails.maxres ? snippet.thumbnails.maxres.url : snippet.thumbnails.high.url,
                                description: snippet.description, // Full description
                                tags: snippet.tags ? snippet.tags.join(', ') : '',
                                viewCount: stats.viewCount,
                                likeCount: stats.likeCount,
                                publishDate: snippet.publishedAt,
                                fullData: true // Flag to indicate rich data
                            };
                        }
                    }
                } catch (e) {
                    console.warn("YouTube Data API failed, falling back to oEmbed", e);
                }
            }

            // FALLBACK: oEmbed (Limited data)
            try {
                const res = await fetch(`https://www.youtube.com/oembed?url=${url}&format=json`);
                if (!res.ok) throw new Error("CORS");
                const data = await res.json();
                return { title: data.title, author: data.author_name, thumb: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`, fullData: false };
            } catch (e) {
                return { title: "Video/Kênh YouTube", author: "YouTube Channel", thumb: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`, fullData: false };
            }
        }

        // ==================================================================================
        // DOM MANIPULATION & RENDERERS
        // ==================================================================================
        
        
        // --- TABS ---
        
        function showVipToast() {
            const modalId = 'vip-upgrade-modal-ndg';
            let overlay = document.getElementById(modalId);
            if (!overlay) {
                overlay = document.createElement('div');
                overlay.id = modalId;
                overlay.className = 'fixed inset-0 z-[120] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4';
                overlay.innerHTML = `
                    <div class="w-full max-w-md rounded-2xl border border-yellow-300/20 bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 shadow-[0_20px_80px_rgba(0,0,0,0.8)]">
                        <div class="flex items-start justify-between p-5 border-b border-white/10">
                            <div class="flex items-center gap-3">
                                <div class="h-10 w-10 rounded-xl bg-yellow-400/10 border border-yellow-300/20 flex items-center justify-center">
                                    <span class="text-yellow-300 text-lg">★</span>
                                </div>
                                <div>
                                    <div class="text-white font-semibold text-lg">Tính năng VIP</div>
                                    <div class="text-white/60 text-sm">Nâng cấp để mở khóa đầy đủ công cụ</div>
                                </div>
                            </div>
                            <button type="button" id="vipModalCloseBtn" class="h-9 w-9 rounded-xl hover:bg-white/5 border border-white/10 text-white/70 hover:text-white flex items-center justify-center" aria-label="Đóng">
                                ✕
                            </button>
                        </div>

                        <div class="p-5 space-y-4">
                            <div class="rounded-xl bg-yellow-400/5 border border-yellow-300/15 p-4 text-white/80 text-sm leading-relaxed">
                                Tính năng bạn vừa chọn chỉ dành cho <b class="text-yellow-300">tài khoản VIP</b>.
                                Hãy nâng cấp để mở khóa các phần <b>2 · 3 · 4 · 5</b> và nhiều tính năng nâng cao khác.
                            </div>

                            <div class="grid grid-cols-2 gap-3">
                                <a href="../pricing.php"
                                   class="inline-flex items-center justify-center rounded-xl bg-yellow-400/15 hover:bg-yellow-400/20 border border-yellow-300/25 px-4 py-3 text-yellow-200 font-semibold">
                                    Nâng cấp ngay →
                                </a>
                                <button type="button" id="vipModalLaterBtn"
                                    class="inline-flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-3 text-white/80">
                                    Để sau
                                </button>
                            </div>

                            <div class="text-xs text-white/40 text-center">
                                Bạn có thể nâng cấp bất cứ lúc nào trong phần Bảng giá.
                            </div>
                        </div>
                    </div>
                `;

                const close = () => {
                    overlay.classList.add('hidden');
                    document.body.classList.remove('overflow-hidden');
                };

                overlay.addEventListener('click', (e) => {
                    if (e.target === overlay) close();
                });

                document.body.appendChild(overlay);

                const closeBtn = overlay.querySelector('#vipModalCloseBtn');
                const laterBtn = overlay.querySelector('#vipModalLaterBtn');
                closeBtn && closeBtn.addEventListener('click', close);
                laterBtn && laterBtn.addEventListener('click', close);

                document.addEventListener('keydown', (e) => {
                    if (e.key === 'Escape') close();
                });
            }

            overlay.classList.remove('hidden');
            document.body.classList.add('overflow-hidden');
        }

        function switchTab(tabId) {
            // VIP gating: chỉ VIP mới dùng tab 2-5
            if (tabId !== 'spy' && !STORE.isVip) {
                // thông báo nhẹ, không chặn toàn bộ UI
                showVipToast();
                return;
            }

            STORE.activeTab = tabId;
            
            // Color mapping for each tab (matching Criminal Mind Master theme)
            const tabColors = {
                spy: { bg: 'bg-[#2b1c0a]', border: 'border-amber-900/50', text: 'text-amber-400', shadow: 'shadow-[0_0_15px_rgba(245,158,11,0.1)]' },
                script: { bg: 'bg-[#1e1a2e]', border: 'border-purple-500/50', text: 'text-purple-300', shadow: 'shadow-[0_0_15px_rgba(168,85,247,0.15)]' },
                studio: { bg: 'bg-[#0f2129]', border: 'border-cyan-500/50', text: 'text-cyan-300', shadow: 'shadow-[0_0_15px_rgba(6,182,212,0.15)]' },
                seo: { bg: 'bg-[#0f2015]', border: 'border-green-500/50', text: 'text-green-300', shadow: 'shadow-[0_0_15px_rgba(34,197,94,0.15)]' },
                market: { bg: 'bg-[#291e0f]', border: 'border-yellow-500/50', text: 'text-yellow-300', shadow: 'shadow-[0_0_15px_rgba(234,179,8,0.15)]' }
            };
            
            ['spy', 'script', 'studio', 'seo', 'market'].forEach(t => {
                const contentEl = document.getElementById(`tab-content-${t}`);
                const btn = document.getElementById(`tab-btn-${t}`);
                
                if (!contentEl || !btn) return; // Safety check
                
                // Hide all content panels
                contentEl.classList.add('hidden');
                
                if (t === tabId) {
                    // Active tab styling
                    const colors = tabColors[t];
                    btn.className = `p-4 rounded-xl text-left border transition-all shrink-0 min-w-[200px] md:min-w-0 ${colors.bg} ${colors.border} ${colors.text} ${colors.shadow}`;
                } else {
                    // Inactive tab styling
                    btn.className = "p-4 rounded-xl text-left border transition-all shrink-0 min-w-[200px] md:min-w-0 bg-transparent border-transparent text-red-500/50 hover:bg-[#260a0a] hover:text-red-200";
                    
                    // Disable studio tab if no script data
                    if(t === 'studio' && STORE.scriptSegments.length === 0) {
                        btn.classList.add('opacity-30', 'cursor-not-allowed');
                    }
                }
            });
            
            // Show active tab content
            const activeContent = document.getElementById(`tab-content-${tabId}`);
            if (activeContent) activeContent.classList.remove('hidden');
        }


        // --- SPY MODULE ---
        function clearSpy() {
            document.getElementById('ytUrlInput').value = '';
            document.getElementById('spyResultContainer').innerHTML = '';
        }

        async function handleSpy() {
            const url = document.getElementById('ytUrlInput').value;
            if (!url) return showError("Nhập link YouTube!");
            
            const btn = document.getElementById('btnSpyAnalyze');
            btn.innerHTML = `<i class="fa-solid fa-sync fa-spin"></i> ĐANG QUÉT...`;
            btn.disabled = true;

            try {
                const meta = await fetchYoutubeMeta(url);
                let prompt = `URL: ${url}\nMETADATA: Title="${meta.title}", Channel="${meta.author}"`;
                
                if (meta.fullData) {
                    prompt += `\nDESCRIPTION: ${meta.description}\nTAGS: ${meta.tags}\nSTATS: ${meta.viewCount} views, ${meta.likeCount} likes.`;
                    prompt += `\nNOTE: Use the Description and Tags to dive deeper into the content topic and potential psychological hooks.`;
                }

                prompt += `\nANALYZE HISTORY & EDUCATIONAL CONTENT based on this metadata.`;
                const data = await callAI(prompt, SYSTEM_PROMPT_IQ180_HISTORY_ANALYST);
                
                // Render Logic - ADVANCED ANALYTICS UI
                const getTierColor = (tier) => {
                    const t = (tier || '').toLowerCase();
                    if (t.includes('premium')) return 'bg-green-900/20 border-green-500/30 text-green-300';
                    if (t.includes('high')) return 'bg-yellow-900/20 border-yellow-500/30 text-yellow-300';
                    if (t.includes('medium')) return 'bg-orange-900/20 border-orange-500/30 text-orange-300';
                    return 'bg-red-900/20 border-red-500/30 text-red-300';
                };
                
                const getImpactColor = (impact) => {
                    const i = (impact || '').toLowerCase();
                    if (i.includes('high')) return 'text-red-400 font-bold';
                    if (i.includes('medium')) return 'text-yellow-400';
                    return 'text-green-400';
                };
                
                let html = `
                    <!-- Video Metadata -->
                    <div class="bg-[#0f0f11] border border-white/10 p-4 rounded-xl flex gap-4 items-start flex-col sm:flex-row shadow-lg">
                        <img src="${meta.thumb}" class="w-full sm:w-48 rounded-lg shadow-lg border border-white/10 object-cover aspect-video" />
                        <div class="flex-1">
                            <h3 class="text-lg font-bold text-white leading-tight mb-2">${meta.title}</h3>
                            <div class="flex items-center gap-4 text-sm text-slate-400">
                                <span class="flex items-center gap-1 text-blue-200"><i class="fa-solid fa-user"></i> ${meta.author}</span>
                                ${meta.fullData ? `<span class="flex items-center gap-1 text-green-200"><i class="fa-solid fa-eye"></i> ${meta.viewCount || 'N/A'} views</span>` : ''}
                            </div>
                        </div>
                    </div>
                `;
                
                // 💰 REVENUE ANALYSIS (NEW)
                if (data?.revenue_analysis) {
                    const rev = data.revenue_analysis;
                    html += `
                        <div class="bg-gradient-to-br from-green-900/10 to-emerald-900/10 border border-green-500/20 rounded-xl p-5 shadow-[0_0_30px_rgba(34,197,94,0.1)]">
                            <h4 class="text-sm font-bold text-green-400 mb-4 flex items-center gap-2 uppercase tracking-wide">
                                <i class="fa-solid fa-dollar-sign"></i> 💰 REVENUE ANALYSIS
                            </h4>
                            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                <div class="bg-black/30 p-3 rounded border border-green-500/10">
                                    <div class="text-[10px] text-green-300 mb-1">Estimated CPM</div>
                                    <div class="text-xl font-bold text-white">${rev.estimated_cpm || 'N/A'}</div>
                                </div>
                                <div class="bg-black/30 p-3 rounded border border-green-500/10">
                                    <div class="text-[10px] text-green-300 mb-1">Estimated RPM</div>
                                    <div class="text-xl font-bold text-white">${rev.estimated_rpm || 'N/A'}</div>
                                </div>
                                <div class="bg-black/30 p-3 rounded border border-green-500/10">
                                    <div class="text-[10px] text-green-300 mb-1">Total Earnings</div>
                                    <div class="text-lg font-bold text-green-400">${rev.total_estimated_earnings || 'N/A'}</div>
                                </div>
                            </div>
                            <div class="flex items-center gap-2 mb-2">
                                <span class="text-xs text-slate-400">Tier:</span>
                                <span class="px-3 py-1 rounded-full text-xs font-bold ${getTierColor(rev.monetization_tier)}">${rev.monetization_tier || 'N/A'}</span>
                            </div>
                            ${Array.isArray(rev.revenue_factors) && rev.revenue_factors.length > 0 ? `
                                <div class="mt-3">
                                    <div class="text-[10px] text-green-300 mb-2">Revenue Factors:</div>
                                    <div class="flex flex-wrap gap-2">
                                        ${rev.revenue_factors.map(f => `<span class="bg-green-900/20 text-green-300 px-2 py-1 rounded text-[10px] border border-green-500/20">${f}</span>`).join('')}
                                    </div>
                                </div>
                            ` : ''}
                        </div>
                    `;
                }
                
                // Grid for Strengths + Weaknesses
                html += `<div class="grid grid-cols-1 md:grid-cols-2 gap-6">`;
                
                // ⚡ STRENGTHS (NEW)
                const strengths = Array.isArray(data?.strengths) ? data.strengths : [];
                if (strengths.length > 0) {
                    html += `
                        <div class="bg-[#0f0f11] p-5 rounded-xl border border-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.05)]">
                            <h4 class="text-sm font-bold text-blue-400 mb-4 flex items-center gap-2">
                                <i class="fa-solid fa-check-circle"></i> ⚡ STRENGTHS
                            </h4>
                            <div class="space-y-3">
                                ${strengths.map((s, idx) => `
                                    <div class="bg-blue-900/10 p-3 rounded border border-blue-500/20">
                                        <div class="flex items-start gap-2 mb-1">
                                            <span class="text-blue-400 font-bold text-xs">${idx + 1}.</span>
                                            <div class="flex-1">
                                                <div class="text-xs text-white font-medium mb-1">${s.point || 'N/A'}</div>
                                                <div class="flex items-center gap-2 text-[10px]">
                                                    <span class="text-slate-500">Impact:</span>
                                                    <span class="${getImpactColor(s.impact)}">${s.impact || 'N/A'}</span>
                                                </div>
                                                ${s.evidence ? `<div class="text-[10px] text-slate-400 mt-1 italic">💡 ${s.evidence}</div>` : ''}
                                            </div>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    `;
                }
                
                // ⚠️ WEAKNESSES (NEW)
                const weaknesses = Array.isArray(data?.weaknesses) ? data.weaknesses : [];
                if (weaknesses.length > 0) {
                    html += `
                        <div class="bg-[#0f0f11] p-5 rounded-xl border border-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.05)]">
                            <h4 class="text-sm font-bold text-red-400 mb-4 flex items-center gap-2">
                                <i class="fa-solid fa-exclamation-triangle"></i> ⚠️ WEAKNESSES
                            </h4>
                            <div class="space-y-3">
                                ${weaknesses.map((w, idx) => `
                                    <div class="bg-red-900/10 p-3 rounded border border-red-500/20">
                                        <div class="flex items-start gap-2 mb-1">
                                            <span class="text-red-400 font-bold text-xs">${idx + 1}.</span>
                                            <div class="flex-1">
                                                <div class="text-xs text-white font-medium mb-1">${w.point || 'N/A'}</div>
                                                <div class="flex items-center gap-2 text-[10px] mb-1">
                                                    <span class="text-slate-500">Impact:</span>
                                                    <span class="${getImpactColor(w.impact)}">${w.impact || 'N/A'}</span>
                                                </div>
                                                ${w.fix ? `<div class="text-[10px] text-green-300 bg-green-900/10 p-2 rounded border border-green-500/20 mt-2">✅ Fix: ${w.fix}</div>` : ''}
                                            </div>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    `;
                }
                
                html += `</div>`; // Close grid
                
                // 🎵 AUDIO STRATEGY (NEW)
                if (data?.audio_strategy) {
                    const audio = data.audio_strategy;
                    html += `
                        <div class="bg-gradient-to-br from-purple-900/10 to-pink-900/10 border border-purple-500/20 rounded-xl p-5 shadow-[0_0_30px_rgba(168,85,247,0.1)]">
                            <h4 class="text-sm font-bold text-purple-400 mb-4 flex items-center gap-2 uppercase tracking-wide">
                                <i class="fa-solid fa-music"></i> 🎵 AUDIO STRATEGY
                            </h4>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div class="bg-black/30 p-3 rounded border border-purple-500/10">
                                    <div class="text-[10px] text-purple-300 mb-2 font-bold">Voice Analysis</div>
                                    <div class="text-xs text-slate-300">${audio.voice_analysis || 'N/A'}</div>
                                </div>
                                <div class="bg-black/30 p-3 rounded border border-purple-500/10">
                                    <div class="text-[10px] text-purple-300 mb-2 font-bold">Music Style</div>
                                    <div class="text-xs text-slate-300">${audio.music_style || 'N/A'}</div>
                                </div>
                                <div class="bg-black/30 p-3 rounded border border-purple-500/10">
                                    <div class="text-[10px] text-purple-300 mb-2 font-bold">Hook Sounds</div>
                                    <div class="text-xs text-slate-300">${audio.hook_sounds || 'N/A'}</div>
                                </div>
                                <div class="bg-black/30 p-3 rounded border border-purple-500/10">
                                    <div class="text-[10px] text-purple-300 mb-2 font-bold">Sound Effects</div>
                                    <div class="flex flex-wrap gap-1 mt-1">
                                        ${Array.isArray(audio.sound_effects) ? audio.sound_effects.map(sfx => `<span class="bg-purple-900/20 text-purple-300 px-2 py-0.5 rounded text-[10px] border border-purple-500/20">${sfx}</span>`).join('') : 'N/A'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                }
                
                // 📊 ENGAGEMENT SIGNALS (NEW)
                if (data?.engagement_signals) {
                    const eng = data.engagement_signals;
                    html += `
                        <div class="bg-gradient-to-br from-cyan-900/10 to-blue-900/10 border border-cyan-500/20 rounded-xl p-5 shadow-[0_0_30px_rgba(6,182,212,0.1)]">
                            <h4 class="text-sm font-bold text-cyan-400 mb-4 flex items-center gap-2 uppercase tracking-wide">
                                <i class="fa-solid fa-chart-line"></i> 📊 ENGAGEMENT SIGNALS
                            </h4>
                            <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
                                <div class="bg-black/30 p-3 rounded border border-cyan-500/10 text-center">
                                    <div class="text-[10px] text-cyan-300 mb-1">Estimated CTR</div>
                                    <div class="text-lg font-bold text-white">${eng.estimated_ctr || 'N/A'}</div>
                                </div>
                                <div class="bg-black/30 p-3 rounded border border-cyan-500/10 text-center">
                                    <div class="text-[10px] text-cyan-300 mb-1">Retention</div>
                                    <div class="text-lg font-bold text-white">${eng.retention_score || 'N/A'}</div>
                                </div>
                                <div class="bg-black/30 p-3 rounded border border-cyan-500/10 text-center">
                                    <div class="text-[10px] text-cyan-300 mb-1">Viral Potential</div>
                                    <div class="text-lg font-bold text-white">${eng.viral_potential || 'N/A'}</div>
                                </div>
                                <div class="bg-black/30 p-3 rounded border border-cyan-500/10 text-center">
                                    <div class="text-[10px] text-cyan-300 mb-1">Comment Sentiment</div>
                                    <div class="text-sm font-bold text-white">${eng.comment_sentiment || 'N/A'}</div>
                                </div>
                                <div class="bg-black/30 p-3 rounded border border-cyan-500/10 text-center">
                                    <div class="text-[10px] text-cyan-300 mb-1">Share Score</div>
                                    <div class="text-2xl font-bold text-cyan-400">${eng.share_worthiness || 'N/A'}</div>
                                </div>
                            </div>
                        </div>
                    `;
                }
                
                // 🎯 HOOK TIMELINE (NEW)
                const hookTimeline = Array.isArray(data?.hook_timeline) ? data.hook_timeline : [];
                if (hookTimeline.length > 0) {
                    html += `
                        <div class="bg-gradient-to-br from-orange-900/10 to-red-900/10 border border-orange-500/20 rounded-xl p-5 shadow-[0_0_30px_rgba(249,115,22,0.1)]">
                            <h4 class="text-sm font-bold text-orange-400 mb-4 flex items-center gap-2 uppercase tracking-wide">
                                <i class="fa-solid fa-clock"></i> 🎯 HOOK TIMELINE
                            </h4>
                            <div class="space-y-3">
                                ${hookTimeline.map((hook, idx) => `
                                    <div class="bg-black/30 p-3 rounded border border-orange-500/10 flex items-start gap-3">
                                        <div class="bg-orange-900/30 text-orange-300 px-2 py-1 rounded text-[10px] font-bold border border-orange-500/20 shrink-0">${hook.timestamp || 'N/A'}</div>
                                        <div class="flex-1">
                                            <div class="text-xs font-bold text-white mb-1">${hook.hook_type || 'N/A'}</div>
                                            <div class="text-[10px] text-slate-400">${hook.description || 'N/A'}</div>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    `;
                }
                
                // 🔥 COMPETITIVE EDGE & REPLICATION (NEW)
                if (data?.competitive_edge || data?.replication_strategy) {
                    html += `
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            ${data.competitive_edge ? `
                                <div class="bg-[#0f0f11] p-5 rounded-xl border border-yellow-500/20">
                                    <h4 class="text-sm font-bold text-yellow-400 mb-3 flex items-center gap-2">
                                        <i class="fa-solid fa-trophy"></i> Competitive Edge
                                    </h4>
                                    <p class="text-xs text-slate-300 leading-relaxed">${data.competitive_edge}</p>
                                </div>
                            ` : ''}
                            ${data.replication_strategy ? `
                                <div class="bg-[#0f0f11] p-5 rounded-xl border border-green-500/20">
                                    <h4 class="text-sm font-bold text-green-400 mb-3 flex items-center gap-2">
                                        <i class="fa-solid fa-copy"></i> Replication Strategy
                                    </h4>
                                    <p class="text-xs text-slate-300 leading-relaxed">${data.replication_strategy}</p>
                                </div>
                            ` : ''}
                        </div>
                    `;
                }
                
                
                const viralSuggestions = Array.isArray(data.viral_suggestions) ? data.viral_suggestions : [];

                if(viralSuggestions.length > 0) {
                    html += `<div class="bg-gradient-to-r from-green-900/5 to-emerald-900/5 p-5 rounded-xl border border-green-500/20 shadow-[0_0_40px_rgba(34,197,94,0.05)] mt-6">
                        <h3 class="text-sm font-bold text-green-400 mb-4 flex items-center gap-2 uppercase tracking-wide"><i class="fa-solid fa-lightbulb text-green-500"></i> 05 Tiêu Đề Viral</h3>
                        <div class="grid grid-cols-1 gap-3">
                            ${viralSuggestions.map((idea, idx) => `
                                <div class="bg-[#0f0f11]/80 p-4 rounded-lg border border-white/5 hover:border-green-500/30 transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4 group hover:bg-[#151515]">
                                    <div class="flex-1">
                                        <div class="flex items-center gap-2 mb-1">
                                            <span class="bg-green-900/20 text-green-400 text-[10px] px-1.5 py-0.5 rounded border border-green-500/20 font-bold">OPTION ${idx+1}</span>
                                            <h4 class="text-sm font-bold text-white leading-tight">${idea.hook_title}</h4>
                                        </div>
                                        <div class="text-xs text-slate-400 mb-1 pl-1 border-l-2 border-slate-700">💡 ${idea.outline_idea}</div>
                                    </div>
                                    <button onclick="useStrategy('${idea.hook_title.replace(/'/g, "\\'")}')" class="shrink-0 bg-green-900/30 hover:bg-green-800/40 text-green-300 border border-green-500/30 px-4 py-2.5 rounded-lg font-bold text-xs flex items-center gap-2 transition-all hover:scale-105">
                                        <i class="fa-solid fa-bolt fill-green-300"></i> KÍCH HOẠT
                                    </button>
                                </div>
                            `).join('')}
                        </div>
                    </div>`;
                }

                document.getElementById('spyResultContainer').innerHTML = html;
            } catch (err) { showError(err.message); }
            finally { 
                btn.innerHTML = `<i class="fa-solid fa-eye"></i> PHÂN TÍCH INSIGHT`; 
                btn.disabled = false; 
            }
        }

        function useStrategy(title) {
            document.getElementById('scriptTopicInput').value = title;
            document.getElementById('seoTopicInput').value = title;
            document.getElementById('marketTopicInput').value = title;
            STORE.scriptTopic = title;
            switchTab('script');
            
            // [FIX UX] Scroll to top to focus Input
            const contentArea = document.querySelector('main > div.flex-1');
            if (contentArea) contentArea.scrollTo({ top: 0, behavior: 'smooth' });
        }

        // --- SCRIPT MODULE ---
        function applyStyleToCurrentScript() {
            if (STORE.scriptSegments.length === 0) return;
            
            const styleObj = VISUAL_STYLES.find(s => s.id === STORE.visualStyle);
            const masterTemplate = document.getElementById('styleRefPrompt').value;
            
            if (!styleObj || styleObj.id === 'auto' || !masterTemplate) {
                showError("Chọn phong cách cụ thể để áp dụng Template!");
                return;
            }

            const cleanNoise = (text) => {
                if (!text) return "";
                return text
                    .replace(/,? ?Visual Style:.*$/gi, "") 
                    .replace(/,? ?Style:.*$/gi, "")        
                    .replace(/In the style of.*?,/gi, "")   
                    .replace(/^(A |An |The )?(beautiful |cinematic |stunning |serene |peaceful )?(scene of )?/gi, "") 
                    .replace(/^.*?style animation,?/gi, "") 
                    .trim();
            };

            STORE.scriptSegments = STORE.scriptSegments.map(seg => {
                let cleanedVideo = cleanNoise(seg.video_prompt);
                let cleanedImage = cleanNoise(seg.image_prompt);
                
                return {
                    ...seg,
                    video_prompt: `${masterTemplate}, ${cleanedVideo}`.replace(/, ,/g, ",").trim(),
                    image_prompt: `${masterTemplate}, ${cleanedImage}`.replace(/, ,/g, ",").trim()
                };
            });

            renderScriptResult();
            renderStudioItems();
            showError("✅ Đã cập nhật phong cách cho toàn bộ kịch bản!");
        }

                function renderLanguageOptions() {
            const select = document.getElementById('languageSelect');
            if (!select) return;
            
            // Use HISTORY_CONTEXTS for historical markets
            select.innerHTML = Object.values(HISTORY_CONTEXTS).map(ctx => 
                `<option value="${ctx.id}" ${STORE.activeLanguage === ctx.id ? 'selected' : ''}>
                    ${ctx.flag} ${ctx.name}
                </option>`
            ).join('');
            
            // Re-bind change event
            const newSelect = select.cloneNode(true);
            select.parentNode.replaceChild(newSelect, select);
            newSelect.addEventListener('change', (e) => {
                STORE.activeLanguage = e.target.value;
            });
        }

        function updateEstimations() {
            const mins = parseFloat(document.getElementById('durationInput').value) || 1;
            STORE.durationMinutes = mins;
            const scenes = Math.ceil((Math.max(0.1, mins) * 60) / SECONDS_PER_SCENE);
            let mode = {};
            if(mins < 3) mode = { name: '🟢 DAILY WISDOM (<3m)', wpm: 130, code: 'DAILY' };
            else if(mins <= 10) mode = { name: '🔵 CONCEPT EXPLAINER (3-10m)', wpm: 140, code: 'EXPLAINER' };
            else mode = { name: '🟣 DEEP DIVE / THERAPY (>10m)', wpm: 120, code: 'DEEP_DIVE' };
            
            const words = Math.floor(mins * mode.wpm);
            document.getElementById('estScenes').innerText = `~${scenes} Cảnh`;
            document.getElementById('estWords').innerText = `~${words} từ`;
            
            const modeDiv = document.getElementById('modeDisplay');
            let colorClass = mins < 3 ? 'text-green-400' : (mins <= 10 ? 'text-blue-400' : 'text-purple-400');
            modeDiv.innerHTML = `<div class="font-bold ${colorClass}">${mode.name}</div>`;
        }

        async function handleGenerateScript() {
            const topic = document.getElementById('scriptTopicInput').value;
            if (!topic) return showError("Nhập chủ đề!");
            
            const btn = document.getElementById('btnGenerateScript');
            btn.innerHTML = `<i class="fa-solid fa-sync fa-spin"></i> ĐANG VIẾT...`;
            btn.disabled = true;

            try {
                const requiredScenes = Math.ceil((Math.max(0.1, STORE.durationMinutes) * 60) / SECONDS_PER_SCENE);
                const styleObj = VISUAL_STYLES.find(s => s.id === STORE.visualStyle);
                const styleName = styleObj ? styleObj.name : "Auto";
                // Get the latest customized reference prompt from UI
                const styleRef = document.getElementById('styleRefPrompt').value || (styleObj ? styleObj.reference_prompt : "");
                
                // Safe market access with fallback - USE HISTORY_CONTEXTS
                const contexts = HISTORY_CONTEXTS;
                const marketKey = contexts[STORE.activeLanguage] ? STORE.activeLanguage : Object.keys(contexts)[0];
                const lang = contexts[marketKey].voice_lang;
                const market = contexts[marketKey].name;

                const prompt = `TOPIC: "${topic}"
DURATION: ${STORE.durationMinutes}m
SCENE_COUNT: ${requiredScenes}
TARGET_LANGUAGE: ${lang}
TARGET_MARKET: ${market}
VISUAL_STYLE: ${styleName}
THEME: HISTORY
STYLE_REFERENCE_FRAMEWORK: ${styleRef}
GENERATE JSON OBJECT.`;
                const json = await callAI(prompt, SYSTEM_PROMPT_HISTORICAL_SCRIPTWRITER);

                let segments = json.script || (Array.isArray(json) ? json : []);
                
                // --- BẮT BUỘC ĐẠT CHUẨN PHONG CÁCH 100% ---
                const masterTemplate = document.getElementById('styleRefPrompt').value;
                
                if (styleObj && styleObj.id !== 'auto' && masterTemplate) {
                    segments = segments.map(seg => {
                        // 1. Dọn dẹp triệt để AI Hallucination và các tiền tố rác
                        const cleanNoise = (text) => {
                            if (!text) return "";
                            return text
                                .replace(/,? ?Visual Style:.*$/gi, "") // Xóa tag Visual Style của AI
                                .replace(/,? ?Style:.*$/gi, "")        // Xóa tag Style của AI
                                .replace(/In the style of.*?,/gi, "")   // Xóa "In the style of..."
                                .replace(/^(A |An |The )?(beautiful |cinematic |stunning |serene |peaceful )?(scene of )?/gi, "") // Xóa từ đệm đầu câu
                                .replace(/^.*?style animation,?/gi, "") // Xóa các biến thể "animation style"
                                .trim();
                        };
                        
                        let cleanedVideo = cleanNoise(seg.video_prompt);
                        let cleanedImage = cleanNoise(seg.image_prompt);
                        
                        // 2. ÉP BUỘC ĐẠT CHUẨN 100%: Master Template luôn là "DNA" đứng đầu
                        return {
                            ...seg,
                            video_prompt: `${masterTemplate}, ${cleanedVideo}`.replace(/, ,/g, ",").trim(),
                            image_prompt: `${masterTemplate}, ${cleanedImage}`.replace(/, ,/g, ",").trim()
                        };
                    });
                } else if (json.suggested_style) {
                    // Chế độ Auto: AI tự đề xuất style
                    let enforcement = `, Visual Style: ${json.suggested_style}`;
                    segments = segments.map(seg => ({
                        ...seg,
                        video_prompt: seg.video_prompt.includes("Visual Style:") ? seg.video_prompt : `${seg.video_prompt} ${enforcement}`,
                        image_prompt: seg.image_prompt.includes("Visual Style:") ? seg.image_prompt : `${seg.image_prompt} ${enforcement}`
                    }));
                }

                STORE.scriptSegments = segments;
                STORE.detectedStyle = json.suggested_style || '';
                
                // [FIX LOGIC INTEGRITY] Clear ghost media from previous session
                STORE.renderedMedia = {};

                renderScriptResult();
                renderStudioItems();
                document.getElementById('tab-btn-studio').disabled = false;
                document.getElementById('tab-btn-studio').classList.remove('opacity-30', 'cursor-not-allowed');
                switchTab('studio');

            } catch(e) { showError(e.message); }
            finally {
                btn.innerHTML = `<i class="fa-solid fa-pen-nib"></i> KIẾN TẠO KỊCH BẢN`;
                btn.disabled = false;
            }
        }

        function renderScriptResult() {
            const container = document.getElementById('scriptResultContainer');
            container.innerHTML = `
                <div class="flex justify-between items-center px-2">
                    <div class="text-xs text-slate-500 font-bold">Đã tạo: ${STORE.scriptSegments.length} phân đoạn</div>
                    <button onclick="copyAllScriptVoice()" class="text-xs font-bold px-3 py-1.5 rounded flex items-center gap-2 bg-white text-black hover:bg-slate-200"><i class="fa-solid fa-copy"></i> Copy Voice Toàn Bộ</button>
                </div>
            `;
            
            const safeSegments = Array.isArray(STORE.scriptSegments) ? STORE.scriptSegments : [];
            safeSegments.forEach((seg, idx) => {
                const isChapter = !!seg.chapter_voice_block;
                const div = document.createElement('div');
                div.className = `bg-[#0f0f11] border ${isChapter ? 'border-purple-500/50 shadow-[0_0_20px_rgba(168,85,247,0.1)]' : 'border-white/10'} p-4 rounded-xl flex flex-col sm:flex-row gap-4 hover:border-purple-500/30 transition-colors bg-purple-900/5 relative`;
                div.innerHTML = `
                    ${isChapter ? `<div class="absolute -top-3 left-4 bg-purple-600 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg z-10"><i class="fa-solid fa-book-open"></i> CHAPTER START</div>` : ''}
                    <div class="w-full sm:w-24 shrink-0 text-center pt-1 border-r border-white/5 pr-2">
                        <div class="text-[10px] bg-[#1a1a1a] px-2 py-1 rounded font-bold text-white mb-1">SCENE ${seg.scene_number || idx+1}</div>
                        <div class="text-[9px] text-slate-500 font-mono mb-1">${seg.time}</div>
                        <div class="text-[9px] text-purple-400 font-bold uppercase break-words">${seg.section}</div>
                    </div>
                    <div class="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div class="bg-[#151515]/50 p-3 rounded border border-white/5">
                            <div class="flex justify-between items-center mb-1">
                                <div class="text-[10px] text-blue-400 font-bold flex items-center gap-1"><i class="fa-solid fa-eye"></i> VISUAL & METAPHOR</div>
                                <div class="text-[9px] text-slate-500 font-mono">NV: <span class="text-white">${seg.character || 'N/A'}</span></div>
                            </div>
                            <p class="text-xs text-slate-300 mb-2">${seg.visual_desc_vi || seg.visual_desc}</p>
                            ${seg.strategy_note ? `<div class="mt-2 p-2 rounded bg-yellow-900/10 border border-yellow-500/20 text-[10px] text-yellow-200/80 italic">💡 <strong>Lưu ý:</strong> ${seg.strategy_note}</div>` : ''}
                        </div>
                        <div class="bg-[#151515]/50 p-3 rounded border border-white/5 flex flex-col relative">
                            <div class="flex justify-between items-center mb-1">
                                <div class="text-[10px] text-purple-400 font-bold flex items-center gap-1"><i class="fa-solid fa-microphone-alt"></i> VOICE</div>
                                <button onclick="copyToClipboard('${(seg.chapter_voice_block || seg.voice_text || "").replace(/'/g, "\\'")}')" class="text-slate-500 hover:text-white"><i class="fa-regular fa-copy"></i></button>
                            </div>
                            <p class="text-sm text-indigo-100 font-medium italic mb-2 leading-relaxed text-justify ${!seg.voice_text ? 'opacity-50' : ''}">"${seg.chapter_voice_block || seg.voice_text || '(Đọc tiếp...)'}"</p>
                        </div>
                    </div>
                `;
                container.appendChild(div);
            });
        }

        function copyAllScriptVoice() {
            const text = STORE.scriptSegments.map(s => s.chapter_voice_block || s.voice_text).join("\n\n");
            copyToClipboard(text);
        }

        // --- STUDIO MODULE ---
        function setProductionMode(mode) {
            STORE.productionMode = mode;
            document.getElementById('prod-mode-video').className = `px-4 py-1.5 rounded text-xs font-bold flex items-center gap-2 transition-colors ${mode==='video' ? 'bg-cyan-900/50 text-cyan-100 shadow' : 'text-slate-400 hover:text-white'}`;
            document.getElementById('prod-mode-image').className = `px-4 py-1.5 rounded text-xs font-bold flex items-center gap-2 transition-colors ${mode==='image' ? 'bg-purple-900/50 text-purple-100 shadow' : 'text-slate-400 hover:text-white'}`;
            renderStudioItems();
        }

        function renderStudioItems() {
            const container = document.getElementById('studioContainer');
            if(STORE.scriptSegments.length === 0) {
                container.innerHTML = `<div class="h-full flex flex-col items-center justify-center text-slate-500 py-20 border border-white/10 border-dashed rounded-xl bg-white/5">
                                <i class="fa-solid fa-layer-group mb-3 text-2xl opacity-50"></i>
                                <p class="text-sm">Hãy tạo kịch bản ở bước 2 để có dữ liệu Prompt</p>
                            </div>`;
                return;
            }
            
            container.innerHTML = '';
            const safeSegments = Array.isArray(STORE.scriptSegments) ? STORE.scriptSegments : [];
            safeSegments.forEach((seg, idx) => {
                const prompt = STORE.productionMode === 'video' ? seg.video_prompt : seg.image_prompt;
                const result = STORE.renderedMedia[`${idx}_${STORE.productionMode}`];
                const div = document.createElement('div');
                div.className = "bg-[#0f0f11] border border-white/10 p-4 rounded-xl flex flex-col sm:flex-row gap-4 items-start transition-colors hover:border-white/20";
                div.innerHTML = `
                    <div class="px-3 py-1.5 rounded text-xs font-bold text-white h-fit shadow-lg ${STORE.productionMode === 'video' ? 'bg-cyan-900/50' : 'bg-purple-900/50'}">CẢNH ${idx+1}</div>
                    <div class="flex-1 w-full">
                        <div class="flex justify-between items-center mb-1">
                            <div class="text-[10px] text-slate-500 font-bold uppercase flex items-center gap-1">
                                ${STORE.productionMode === 'video' ? '<i class="fa-solid fa-film"></i> VIDEO PROMPT' : '<i class="fa-solid fa-image"></i> ẢNH PROMPT'}
                            </div>
                        </div>
                        <div class="relative group/prompt">
                            <p class="text-xs text-slate-300 font-mono mb-3 bg-black/50 p-3 rounded border border-white/5 leading-relaxed pr-10">${prompt || seg.visual_desc || 'No prompt'}</p>
                            <button onclick="copyToClipboard('${(prompt||"").replace(/'/g, "\\'")}')" class="absolute top-2 right-2 p-1.5 bg-[#1a1a1a] text-slate-300 rounded hover:bg-blue-900/50 hover:text-white border border-white/5"><i class="fa-solid fa-copy"></i></button>
                        </div>
                    </div>
                `;
                container.appendChild(div);
            });
        }

        async function generateMedia(idx) {
            if(STORE.isLoading) return;
            STORE.isLoading = true;
            
            const seg = STORE.scriptSegments[idx];
            let prompt = STORE.productionMode === 'video' ? seg.video_prompt : seg.image_prompt;
            
            // Chỉ thêm hậu tố kỹ thuật nếu không dùng Template cố định (Auto mode)
            if (STORE.visualStyle === 'auto') {
                prompt += STORE.productionMode === 'video' ? ", 8k, cinematic lighting --no text" : ", masterpiece, 8k";
            }
            
            const apiKey = getNextKey();
            if(!apiKey) { showError("Nhập API Key!"); STORE.isLoading=false; return; }

            try {
                const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODELS.image}:predict?key=${apiKey}`;
                const body = { instances: [{ prompt: prompt }], parameters: { sampleCount: 1, aspectRatio: STORE.productionMode === 'video' ? "16:9" : "1:1" } };
                const res = await fetch(url, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(body) });
                const data = await res.json();
                
                if (data.predictions && data.predictions[0].bytesBase64Encoded) {
                    STORE.renderedMedia[`${idx}_${STORE.productionMode}`] = `data:image/png;base64,${data.predictions[0].bytesBase64Encoded}`;
                    renderStudioItems();
                } else {
                    showError("Lỗi Safety/API. Thử lại prompt khác.");
                }
            } catch(e) { showError(e.message); }
            finally { STORE.isLoading = false; }
        }



        // --- EXPORT FUNCTIONS ---
        function toggleExportMenu() {
            document.getElementById('exportDropdown').classList.toggle('hidden');
        }
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function(event) {
            const dropdown = document.getElementById('exportDropdown');
            const button = document.querySelector('button[onclick="toggleExportMenu()"]');
            if (dropdown && !dropdown.classList.contains('hidden') && !dropdown.contains(event.target) && !button.contains(event.target)) {
                dropdown.classList.add('hidden');
            }
        });

        function exportScriptCSV() {
            if(STORE.scriptSegments.length === 0) return;
            let csv = "\uFEFFScene,Time,Section,Character,Voice,Video Prompt,Image Prompt\n";
            STORE.scriptSegments.forEach((s, i) => {
                const vp = (s.video_prompt || "").replace(/"/g, '""');
                const ip = (s.image_prompt || "").replace(/"/g, '""');
                const v = (s.chapter_voice_block || s.voice_text || "").replace(/"/g, '""');
                csv += `${i+1},"${s.time}","${s.section}","${s.character}","${v}","${vp}","${ip}"\n`;
            });
            downloadFile(csv, `kich_ban_full_${Date.now()}.csv`, 'text/csv;charset=utf-8;');
        }

        function exportPromptsCSV(type) {
            if(STORE.scriptSegments.length === 0) return;
            let csv = `\uFEFFScene,${type === 'video' ? 'Video' : 'Image'} Prompt\n`;
            STORE.scriptSegments.forEach((s, i) => {
                const prompt = (type === 'video' ? s.video_prompt : s.image_prompt || "").replace(/"/g, '""');
                csv += `${i+1},"${prompt}"\n`;
            });
            downloadFile(csv, `prompts_${type}_${Date.now()}.csv`, 'text/csv;charset=utf-8;');
        }

        function exportPromptsTXT(type) {
            if(STORE.scriptSegments.length === 0) return;
            let content = "";
            STORE.scriptSegments.forEach((s) => {
                const prompt = (type === 'video' ? s.video_prompt : s.image_prompt) || "";
                if (prompt) content += prompt + "\n\n";
            });
            downloadFile(content, `prompts_${type}_${Date.now()}.txt`, 'text/plain;charset=utf-8;');
        }

        function downloadFile(content, fileName, mimeType) {
            const blob = new Blob([content], { type: mimeType });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = fileName;
            document.body.appendChild(link); link.click(); document.body.removeChild(link);
            document.getElementById('exportDropdown').classList.add('hidden');
        }

        // --- SEO & MARKET ---
        function renderSeoChecklist() {
            const container = document.getElementById('seoChecklistContainer');
            container.innerHTML = Object.entries(SEO_CHECKLIST_DATA).map(([sec, items]) => `
                <div class="bg-[#1a1a1a]/50 rounded-lg p-3 border border-white/5">
                    <div class="text-[10px] font-bold text-slate-500 uppercase mb-2">${sec}</div>
                    <div class="space-y-2">
                        ${items.map(item => `
                            <label class="flex items-start gap-2 cursor-pointer group" onclick="toggleChecklist('${item.id}')">
                                <div id="chk-${item.id}" class="w-4 h-4 rounded border flex items-center justify-center shrink-0 mt-0.5 border-white/20 bg-black"></div>
                                <span id="lbl-${item.id}" class="text-xs text-slate-400 group-hover:text-white">${item.label}</span>
                            </label>
                        `).join('')}
                    </div>
                </div>
            `).join('');
        }

        function toggleChecklist(id) {
            STORE.checklistState[id] = !STORE.checklistState[id];
            const chk = document.getElementById(`chk-${id}`);
            const lbl = document.getElementById(`lbl-${id}`);
            if (STORE.checklistState[id]) {
                chk.className = "w-4 h-4 rounded border flex items-center justify-center shrink-0 mt-0.5 bg-green-500 border-green-500";
                chk.innerHTML = '<i class="fa-solid fa-check text-white text-[10px]"></i>';
                lbl.className = "text-xs text-slate-500 line-through";
            } else {
                chk.className = "w-4 h-4 rounded border flex items-center justify-center shrink-0 mt-0.5 border-white/20 bg-black";
                chk.innerHTML = '';
                lbl.className = "text-xs text-slate-400 group-hover:text-white";
            }
        }

        async function handleGenerateSEO() {
            const topic = document.getElementById('seoTopicInput').value;
            if(!topic) return showError("Nhập chủ đề SEO!");
            
            const btn = document.getElementById('btnSeoAnalyze');
            btn.innerHTML = `<i class="fa-solid fa-sync fa-spin"></i> ĐANG TỐI ƯU...`;
            btn.disabled = true;

            try {
                // Safe market access with fallback - USE HISTORY_CONTEXTS
                const contexts = HISTORY_CONTEXTS;
                const marketKey = contexts[STORE.activeLanguage] ? STORE.activeLanguage : Object.keys(contexts)[0];
                const lang = contexts[marketKey].voice_lang;
                const market = contexts[marketKey].name;
                const prompt = `TOPIC: "${topic}"
TARGET_LANGUAGE: ${lang}
TARGET_MARKET: ${market}
THEME: HISTORY
GENERATE JSON.`;
                const json = await callAI(prompt, SYSTEM_PROMPT_SEO_MASTER);
                
                const viralTitles = Array.isArray(json.viral_titles) ? json.viral_titles : [];
                const keywords = json?.keywords || {};
                const hashtags = Array.isArray(json?.hashtags) ? json.hashtags : [];
                const description = json?.video_description || {};
                const engagement = json?.engagement_comments || {};
                
                // Detect content language (simple check)
                const contentLang = lang.toLowerCase().includes('vietnamese') || lang.toLowerCase().includes('việt') ? 'vi' : 'en';
                const translateToLang = contentLang === 'vi' ? 'en' : 'vi';
                const translateButtonText = contentLang === 'vi' ? '🇺🇸 Translate to English' : '🇻🇳 Dịch sang Tiếng Việt';

                document.getElementById('seoResultContainer').innerHTML = `
                    <!-- Translate Button -->
                    <div class="flex justify-end mb-4">
                        <button onclick="translateSEOContent('${translateToLang}')" class="px-4 py-2 bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-500/30 text-purple-300 rounded-lg text-xs font-bold hover:from-purple-900/50 hover:to-pink-900/50 transition-all flex items-center gap-2">
                            <i class="fa-solid fa-language"></i>
                            ${translateButtonText}
                        </button>
                    </div>
                    
                    <!-- Keywords Section -->
                    <div class="bg-gradient-to-br from-blue-900/10 to-cyan-900/10 border border-blue-500/20 rounded-xl p-5 shadow-[0_0_30px_rgba(59,130,246,0.1)]">
                        <h4 class="text-sm font-bold text-blue-400 mb-4 flex items-center gap-2 uppercase tracking-wide">
                            <i class="fa-solid fa-key"></i> 🔑 KEYWORDS (TỪ KHÓA)
                        </h4>
                        <div class="space-y-3">
                            ${keywords.primary && Array.isArray(keywords.primary) ? `
                                <div>
                                    <div class="text-[10px] text-blue-300 mb-2 font-bold">Primary Keywords (Chính)</div>
                                    <div class="flex flex-wrap gap-2">
                                        ${keywords.primary.map(k => `<span class="bg-blue-900/30 text-blue-200 px-3 py-1 rounded-full text-xs border border-blue-500/30 font-medium">${k}</span>`).join('')}
                                    </div>
                                </div>
                            ` : ''}
                            ${keywords.secondary && Array.isArray(keywords.secondary) ? `
                                <div>
                                    <div class="text-[10px] text-cyan-300 mb-2 font-bold">Secondary Keywords (Phụ)</div>
                                    <div class="flex flex-wrap gap-2">
                                        ${keywords.secondary.map(k => `<span class="bg-cyan-900/20 text-cyan-200 px-3 py-1 rounded-full text-xs border border-cyan-500/20">${k}</span>`).join('')}
                                    </div>
                                </div>
                            ` : ''}
                            ${keywords.long_tail && Array.isArray(keywords.long_tail) ? `
                                <div>
                                    <div class="text-[10px] text-slate-400 mb-2 font-bold">Long-tail Keywords (Dài)</div>
                                    <div class="flex flex-wrap gap-2">
                                        ${keywords.long_tail.map(k => `<span class="bg-slate-800 text-slate-300 px-3 py-1 rounded-full text-xs border border-slate-600">${k}</span>`).join('')}
                                    </div>
                                </div>
                            ` : ''}
                        </div>
                    </div>

                    <!-- Hashtags Section -->
                    ${hashtags.length > 0 ? `
                        <div class="bg-gradient-to-br from-purple-900/10 to-pink-900/10 border border-purple-500/20 rounded-xl p-5 shadow-[0_0_30px_rgba(168,85,247,0.1)]">
                            <h4 class="text-sm font-bold text-purple-400 mb-4 flex items-center gap-2 uppercase tracking-wide">
                                <i class="fa-solid fa-hashtag"></i> #️⃣ HASHTAGS
                            </h4>
                            <div class="flex flex-wrap gap-2">
                                ${hashtags.map(tag => `
                                    <button onclick="copyToClipboard('${tag.replace(/'/g, "\\\\'")}')" class="bg-purple-900/20 text-purple-300 px-3 py-1.5 rounded-lg text-sm border border-purple-500/20 hover:bg-purple-900/30 transition-all flex items-center gap-2 group">
                                        ${tag}
                                        <i class="fa-solid fa-copy text-[10px] opacity-0 group-hover:opacity-100 transition-opacity"></i>
                                    </button>
                                `).join('')}
                            </div>
                            <button onclick="copyToClipboard('${hashtags.join(' ').replace(/'/g, "\\\\'")}')" class="mt-3 text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1 hover:underline">
                                <i class="fa-solid fa-copy"></i> Copy All Hashtags
                            </button>
                        </div>
                    ` : ''}

                    <!-- Video Description Section -->
                    ${description.full_description ? `
                        <div class="bg-gradient-to-br from-green-900/10 to-emerald-900/10 border border-green-500/20 rounded-xl p-5 shadow-[0_0_30px_rgba(34,197,94,0.1)]">
                            <h4 class="text-sm font-bold text-green-400 mb-4 flex items-center gap-2 uppercase tracking-wide">
                                <i class="fa-solid fa-align-left"></i> 📝 VIDEO DESCRIPTION (MÔ TẢ)
                            </h4>
                            <div class="space-y-3">
                                ${description.hook ? `
                                    <div class="bg-green-900/20 p-3 rounded border border-green-500/20">
                                        <div class="text-[10px] text-green-300 mb-1 font-bold">Hook (First 150 chars)</div>
                                        <p class="text-sm text-white font-medium">${description.hook}</p>
                                    </div>
                                ` : ''}
                                <div class="bg-black/30 p-4 rounded border border-green-500/10">
                                    <div class="text-[10px] text-green-300 mb-2 font-bold">Full Description</div>
                                    <p class="text-xs text-slate-300 leading-relaxed whitespace-pre-line">${description.full_description}</p>
                                </div>
                                ${description.timestamps && Array.isArray(description.timestamps) && description.timestamps.length > 0 ? `
                                    <div class="bg-black/30 p-3 rounded border border-green-500/10">
                                        <div class="text-[10px] text-green-300 mb-2 font-bold">Timestamps</div>
                                        <div class="space-y-1">
                                            ${description.timestamps.map(ts => `<div class="text-xs text-slate-400"><span class="text-green-400 font-mono">${ts.time}</span> - ${ts.label}</div>`).join('')}
                                        </div>
                                    </div>
                                ` : ''}
                                <button onclick="copyToClipboard(\`${(description.full_description || '').replace(/`/g, '\\\\`').replace(/'/g, "\\\\'")}\`)" class="text-xs text-green-400 hover:text-green-300 flex items-center gap-1 hover:underline">
                                    <i class="fa-solid fa-copy"></i> Copy Description
                                </button>
                            </div>
                        </div>
                    ` : ''}

                    <!-- Viral Titles Section -->
                    ${viralTitles.length > 0 ? `
                        <div class="bg-[#151515] border border-white/5 rounded-xl p-4">
                            <div class="text-[10px] text-yellow-400 font-bold uppercase mb-2 flex items-center gap-1"><i class="fa-solid fa-bolt"></i> ⚡ VIRAL TITLES (TIÊU ĐỀ)</div>
                            <div class="space-y-2">
                                ${viralTitles.map((t, idx) => `<div class="flex justify-between items-center bg-black p-2 rounded border border-white/10"><span class="text-[10px] text-slate-500 mr-2">${idx+1}.</span><span class="text-sm text-white font-medium flex-1">${t}</span><button onclick="copyToClipboard('${t.replace(/'/g, "\\\\'")}')" class="text-slate-500 hover:text-white"><i class="fa-solid fa-copy"></i></button></div>`).join('')}
                            </div>
                        </div>
                    ` : ''}

                    <!-- Thumbnail Strategy Section -->
                    <div class="bg-[#151515] border border-white/5 rounded-xl p-4">
                        <div class="text-[10px] text-orange-400 font-bold uppercase mb-2 flex items-center gap-1"><i class="fa-solid fa-image"></i> 🎨 THUMBNAIL STRATEGY</div>
                        <div class="space-y-3">
                            <div><span class="text-xs text-slate-500">CTR Target:</span><p class="text-sm text-white font-medium">${json?.thumbnail_strategy?.ctr_target || '40%+'}</p></div>
                            <div class="flex gap-4">
                                <div class="flex-1 bg-black p-2 rounded border border-white/10"><span class="text-[10px] text-slate-500 block">Psychological Triggers</span><span class="text-sm text-yellow-400">${json?.thumbnail_strategy?.psychological_triggers ? json.thumbnail_strategy.psychological_triggers.slice(0,2).join(', ') : 'N/A'}</span></div>
                            </div>
                            ${json?.thumbnail_strategy?.color_psychology?.primary ? `<div class="text-xs text-slate-400"><span class="text-slate-500">Color:</span> ${json.thumbnail_strategy.color_psychology.primary} | ${json.thumbnail_strategy.color_psychology.secondary || ''}</div>` : ''}
                            
                            <!-- AI Image Generation Prompts -->
                            ${json?.thumbnail_strategy?.midjourney_prompt || json?.thumbnail_strategy?.dalle_prompt ? `
                                <div class="mt-4 space-y-3">
                                    <div class="text-[10px] text-orange-300 font-bold uppercase flex items-center gap-2">
                                        <i class="fa-solid fa-wand-magic-sparkles"></i> AI Image Generation Prompts
                                    </div>
                                    
                                    ${json?.thumbnail_strategy?.midjourney_prompt ? `
                                        <div class="bg-purple-900/20 border border-purple-500/30 rounded-lg p-3">
                                            <div class="flex items-center justify-between mb-2">
                                                <span class="text-xs font-bold text-purple-300 flex items-center gap-1">
                                                    <i class="fa-solid fa-robot"></i> Midjourney Prompt
                                                </span>
                                                <button onclick="copyToClipboard('${(json.thumbnail_strategy.midjourney_prompt || '').replace(/'/g, "\\'").replace(/\n/g, ' ')}')" 
                                                    class="px-2 py-1 bg-purple-600 hover:bg-purple-500 text-white text-[10px] rounded flex items-center gap-1 transition-all">
                                                    <i class="fa-solid fa-copy"></i> Copy
                                                </button>
                                            </div>
                                            <p class="text-xs text-slate-300 font-mono bg-black/50 p-2 rounded">${json.thumbnail_strategy.midjourney_prompt}</p>
                                        </div>
                                    ` : ''}
                                    
                                    ${json?.thumbnail_strategy?.dalle_prompt ? `
                                        <div class="bg-green-900/20 border border-green-500/30 rounded-lg p-3">
                                            <div class="flex items-center justify-between mb-2">
                                                <span class="text-xs font-bold text-green-300 flex items-center gap-1">
                                                    <i class="fa-solid fa-palette"></i> DALL-E / ChatGPT Prompt
                                                </span>
                                                <button onclick="copyToClipboard('${(json.thumbnail_strategy.dalle_prompt || '').replace(/'/g, "\\'").replace(/\n/g, ' ')}')" 
                                                    class="px-2 py-1 bg-green-600 hover:bg-green-500 text-white text-[10px] rounded flex items-center gap-1 transition-all">
                                                    <i class="fa-solid fa-copy"></i> Copy
                                                </button>
                                            </div>
                                            <p class="text-xs text-slate-300 font-mono bg-black/50 p-2 rounded">${json.thumbnail_strategy.dalle_prompt}</p>
                                        </div>
                                    ` : ''}
                                    
                                    ${json?.thumbnail_strategy?.leonardo_prompt ? `
                                        <div class="bg-blue-900/20 border border-blue-500/30 rounded-lg p-3">
                                            <div class="flex items-center justify-between mb-2">
                                                <span class="text-xs font-bold text-blue-300 flex items-center gap-1">
                                                    <i class="fa-solid fa-image"></i> Leonardo.AI Prompt
                                                </span>
                                                <button onclick="copyToClipboard('${(json.thumbnail_strategy.leonardo_prompt || '').replace(/'/g, "\\'").replace(/\n/g, ' ')}')" 
                                                    class="px-2 py-1 bg-blue-600 hover:bg-blue-500 text-white text-[10px] rounded flex items-center gap-1 transition-all">
                                                    <i class="fa-solid fa-copy"></i> Copy
                                                </button>
                                            </div>
                                            <p class="text-xs text-slate-300 font-mono bg-black/50 p-2 rounded">${json.thumbnail_strategy.leonardo_prompt}</p>
                                        </div>
                                    ` : ''}
                                    
                                    ${json?.thumbnail_strategy?.stable_diffusion_prompt ? `
                                        <div class="bg-orange-900/20 border border-orange-500/30 rounded-lg p-3">
                                            <div class="flex items-center justify-between mb-2">
                                                <span class="text-xs font-bold text-orange-300 flex items-center gap-1">
                                                    <i class="fa-solid fa-fire"></i> Stable Diffusion Prompt
                                                </span>
                                                <button onclick="copyToClipboard('${(json.thumbnail_strategy.stable_diffusion_prompt || '').replace(/'/g, "\\'").replace(/\n/g, ' ')}')" 
                                                    class="px-2 py-1 bg-orange-600 hover:bg-orange-500 text-white text-[10px] rounded flex items-center gap-1 transition-all">
                                                    <i class="fa-solid fa-copy"></i> Copy
                                                </button>
                                            </div>
                                            <p class="text-xs text-slate-300 font-mono bg-black/50 p-2 rounded">${json.thumbnail_strategy.stable_diffusion_prompt}</p>
                                        </div>
                                    ` : ''}
                                </div>
                            ` : `<p class="text-xs text-slate-400 italic bg-black/30 p-2 rounded border border-white/5">AI prompts will be generated after analysis</p>`}
                        </div>
                    </div>

                    <!-- Engagement Comments Section -->
                    ${engagement.pinned_comment || (engagement.discussion_starters && engagement.discussion_starters.length > 0) ? `
                        <div class="bg-gradient-to-br from-red-900/10 to-orange-900/10 border border-red-500/20 rounded-xl p-5 shadow-[0_0_30px_rgba(239,68,68,0.1)]">
                            <h4 class="text-sm font-bold text-red-400 mb-4 flex items-center gap-2 uppercase tracking-wide">
                                <i class="fa-solid fa-comments"></i> 💬 ENGAGEMENT COMMENTS (BÌNH LUẬN TƯƠNG TÁC)
                            </h4>
                            <div class="space-y-3">
                                ${engagement.pinned_comment ? `
                                    <div class="bg-red-900/20 p-4 rounded border border-red-500/20">
                                        <div class="text-[10px] text-red-300 mb-2 font-bold flex items-center gap-1">
                                            <i class="fa-solid fa-thumbtack"></i> Pinned Comment (Ghim lên đầu)
                                        </div>
                                        <p class="text-sm text-white font-medium mb-2">${engagement.pinned_comment}</p>
                                        <button onclick="copyToClipboard('${engagement.pinned_comment.replace(/'/g, "\\\\'")}')" class="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 hover:underline">
                                            <i class="fa-solid fa-copy"></i> Copy
                                        </button>
                                    </div>
                                ` : ''}
                                ${engagement.discussion_starters && Array.isArray(engagement.discussion_starters) && engagement.discussion_starters.length > 0 ? `
                                    <div class="bg-black/30 p-4 rounded border border-red-500/10">
                                        <div class="text-[10px] text-red-300 mb-3 font-bold">Discussion Starters (Câu mở đầu thảo luận)</div>
                                        <div class="space-y-2">
                                            ${engagement.discussion_starters.map((comment, idx) => `
                                                <div class="bg-red-900/10 p-2 rounded border border-red-500/10 flex justify-between items-start gap-2">
                                                    <span class="text-xs text-slate-300 flex-1">${idx+1}. ${comment}</span>
                                                    <button onclick="copyToClipboard('${comment.replace(/'/g, "\\\\'")}')" class="text-red-400 hover:text-red-300 shrink-0">
                                                        <i class="fa-solid fa-copy text-[10px]"></i>
                                                    </button>
                                                </div>
                                            `).join('')}
                                        </div>
                                    </div>
                                ` : ''}
                                ${engagement.call_to_action ? `
                                    <div class="bg-orange-900/20 p-3 rounded border border-orange-500/20">
                                        <div class="text-[10px] text-orange-300 mb-1 font-bold">Call to Action</div>
                                        <p class="text-xs text-white">${engagement.call_to_action}</p>
                                    </div>
                                ` : ''}
                            </div>
                        </div>
                    ` : ''}
                `;
            } catch(e) { showError(e.message); }
            finally { btn.innerHTML = `<i class="fa-solid fa-magic"></i> Tối Ưu SEO`; btn.disabled = false; }
        }

        async function handleAnalyzeMarket() {
            const topic = document.getElementById('marketTopicInput').value;
            if(!topic) return showError("Nhập chủ đề Market!");

            const btn = document.getElementById('btnMarketAnalyze');
            btn.innerHTML = `<i class="fa-solid fa-sync fa-spin"></i> ĐANG PHÂN TÍCH...`;
            btn.disabled = true;

            try {
                const prompt = `TOPIC: "${topic}"\nGENERATE JSON.`;
                const json = await callAI(prompt, SYSTEM_PROMPT_MARKET_ANALYST);
                
                const persona = json?.customer_persona || {};
                const potential = json?.market_potential || {};
                const products = Array.isArray(json?.product_recommendations) ? json.product_recommendations : [];
                const strategy = json?.sales_strategy || {};
                const calculator = json?.profit_calculator || {};

                document.getElementById('marketResultContainer').innerHTML = `
                    <div class="space-y-6">
                        <!-- Top Grid: Persona & Potential -->
                        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <!-- Customer Persona -->
                            <div class="bg-gradient-to-br from-pink-900/10 to-purple-900/10 border border-pink-500/20 rounded-xl p-5 shadow-lg">
                                <h3 class="text-sm font-bold text-pink-400 mb-4 flex items-center gap-2 uppercase tracking-wide">
                                    <i class="fa-solid fa-user-astronaut"></i> CHÂN DUNG KHÁCH HÀNG (PERSONA)
                                </h3>
                                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div class="space-y-2">
                                        <div class="text-[10px] text-slate-500 font-bold uppercase">Demographics</div>
                                        <div class="text-xs text-slate-300 flex flex-col gap-1">
                                            <span><b class="text-pink-300/70">Tuổi:</b> ${persona.demographics?.age_range || 'N/A'}</span>
                                            <span><b class="text-pink-300/70">Giới tính:</b> ${persona.demographics?.gender_split || 'N/A'}</span>
                                            <span><b class="text-pink-300/70">Thu nhập:</b> ${persona.demographics?.income_level || 'N/A'}</span>
                                        </div>
                                    </div>
                                    <div class="space-y-2">
                                        <div class="text-[10px] text-slate-500 font-bold uppercase">Psychographics</div>
                                        <div class="text-xs text-slate-300 flex flex-wrap gap-1">
                                            ${(persona.psychographics?.interests || []).slice(0, 3).map(i => `<span class="px-1.5 py-0.5 bg-pink-500/10 border border-pink-500/20 rounded text-[10px]">${i}</span>`).join('')}
                                        </div>
                                    </div>
                                </div>
                                <div class="mt-4 p-3 bg-black/40 rounded border border-white/5">
                                    <div class="text-[10px] text-pink-300 font-bold mb-1 italic">Nỗi đau (Pain Points):</div>
                                    <p class="text-[11px] text-slate-400">${(persona.psychographics?.pain_points || []).join(', ')}</p>
                                </div>
                            </div>

                            <!-- Market Potential -->
                            <div class="bg-gradient-to-br from-blue-900/10 to-cyan-900/10 border border-blue-500/20 rounded-xl p-5 shadow-lg">
                                <h3 class="text-sm font-bold text-blue-400 mb-4 flex items-center gap-2 uppercase tracking-wide">
                                    <i class="fa-solid fa-chart-line"></i> TIỀM NĂNG THỊ TRƯỜNG (POTENTIAL)
                                </h3>
                                <div class="grid grid-cols-2 gap-4">
                                    <div class="p-3 bg-black/40 rounded border border-white/5">
                                        <div class="text-[10px] text-slate-500 uppercase mb-1">Quy mô</div>
                                        <div class="text-sm text-white font-black font-mono">${potential.market_size || 'N/A'}</div>
                                    </div>
                                    <div class="p-3 bg-black/40 rounded border border-white/5">
                                        <div class="text-[10px] text-slate-500 uppercase mb-1">Tăng trưởng</div>
                                        <div class="text-sm text-green-400 font-black font-mono">${potential.growth_rate || 'N/A'}</div>
                                    </div>
                                </div>
                                <div class="mt-4 grid grid-cols-2 gap-2">
                                    <div class="text-[10px] text-slate-400 flex items-center gap-1"><i class="fa-solid fa-shield-halved text-blue-500"></i> Cạnh tranh: ${potential.competition_level || 'N/A'}</div>
                                    <div class="text-[10px] text-slate-400 flex items-center gap-1"><i class="fa-solid fa-money-bill-trend-up text-green-500"></i> Margin: ${potential.profit_margin || 'N/A'}</div>
                                </div>
                            </div>
                        </div>

                        <!-- Product Recommendations & Sourcing -->
                        <div class="space-y-4">
                            <h3 class="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                <i class="fa-solid fa-boxes-packing text-green-400"></i> GỢI Ý NGUỒN HÀNG VÀ SẢN PHẨM
                            </h3>
                            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                                ${products.map(cat => `
                                    <div class="bg-[#1a1a1a] border border-white/5 rounded-xl overflow-hidden flex flex-col hover:border-green-500/20 transition-colors">
                                        <div class="p-3 bg-white/5 border-b border-white/5">
                                            <div class="text-[10px] text-green-400 font-bold uppercase tracking-wider">${cat.category}</div>
                                        </div>
                                        <div class="p-3 flex-1 space-y-3">
                                            <!-- Products list -->
                                            <div class="space-y-2">
                                                ${(cat.products || []).map(p => `
                                                    <div class="flex justify-between items-start gap-2 group">
                                                        <div class="text-xs text-slate-300 font-medium group-hover:text-white transition-colors">${p.name}</div>
                                                        <div class="text-[10px] text-right">
                                                            <div class="text-slate-500">${p.price_range}</div>
                                                            <div class="text-green-500/70 font-bold">M: ${p.margin}</div>
                                                        </div>
                                                    </div>
                                                `).join('')}
                                            </div>
                                            <!-- Sourcing Links -->
                                            <div class="pt-2 border-t border-white/5 space-y-1">
                                                <div class="text-[9px] text-slate-600 font-bold">NGUỒN HÀNG:</div>
                                                ${(cat.sourcing_links || []).map(link => `
                                                    <a href="${link.url}" target="_blank" class="flex items-center justify-between p-1.5 rounded bg-black/40 hover:bg-green-900/20 border border-transparent hover:border-green-500/30 transition-all group/link">
                                                        <span class="text-[10px] text-slate-400 group-hover/link:text-green-400 font-bold">${link.platform}</span>
                                                        <i class="fa-solid fa-external-link text-[8px] text-slate-600"></i>
                                                    </a>
                                                `).join('')}
                                            </div>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>

                        <!-- Strategy & Profits -->
                        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <!-- Sales Strategy -->
                            <div class="bg-[#151515] border border-white/5 rounded-xl p-5">
                                <h3 class="text-sm font-bold text-orange-400 mb-4 flex items-center gap-2 uppercase tracking-wide">
                                    <i class="fa-solid fa-bullseye"></i> CHIẾN LƯỢC BÁN HÀNG
                                </h3>
                                <div class="space-y-4">
                                    <div class="flex gap-3 items-start">
                                        <div class="w-8 h-8 rounded-lg bg-orange-900/20 border border-orange-500/20 flex items-center justify-center shrink-0 mt-1"><i class="fa-solid fa-video text-orange-400 text-xs"></i></div>
                                        <div><div class="text-[10px] text-slate-500 font-bold uppercase">Content Marketing</div><div class="text-xs text-slate-300">${strategy.content_marketing || 'N/A'}</div></div>
                                    </div>
                                    <div class="flex gap-3 items-start">
                                        <div class="w-8 h-8 rounded-lg bg-blue-900/20 border border-blue-500/20 flex items-center justify-center shrink-0 mt-1"><i class="fa-solid fa-sack-dollar text-blue-400 text-xs"></i></div>
                                        <div><div class="text-[10px] text-slate-500 font-bold uppercase">Affiliate</div><div class="text-xs text-slate-300">${strategy.affiliate_approach || 'N/A'}</div></div>
                                    </div>
                                </div>
                            </div>

                            <!-- Profit Calculator -->
                            <div class="bg-gradient-to-br from-green-900/10 to-emerald-900/10 border border-green-500/20 rounded-xl p-5">
                                <h3 class="text-sm font-bold text-green-400 mb-4 flex items-center gap-2 uppercase tracking-wide">
                                    <i class="fa-solid fa-calculator"></i> DỰ TOÁN LỢI NHUẬN (ESTIMATED)
                                </h3>
                                <div class="space-y-3">
                                    ${Object.values(calculator).map(scen => `
                                        <div class="bg-black/50 p-3 rounded-lg border border-white/5 flex justify-between items-center group">
                                            <div>
                                                <div class="text-xs text-white font-bold group-hover:text-green-400 transition-colors">${scen.model}</div>
                                                <div class="text-[10px] text-slate-500">${scen.monthly_sales}</div>
                                            </div>
                                            <div class="text-right">
                                                <div class="text-sm text-green-400 font-black font-mono">${scen.profit}</div>
                                                <div class="text-[9px] text-slate-600">net profit/mo</div>
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            } catch(e) { showError(e.message); }
            finally { btn.innerHTML = `<i class="fa-solid fa-chart-line"></i> Phân Tích`; btn.disabled = false; }
        }
        
        // --- TRANSLATION HELPER ---
        function translateSEOContent(targetLang) {
            const langName = targetLang === 'vi' ? 'Tiếng Việt' : 'English';
            const marketSuggestion = targetLang === 'vi' ? 'Vietnam (Sử Việt & Văn Hóa)' : 'International (World History)';
            
            showError(`💡 Tip: To get content in ${langName}, select "${marketSuggestion}" market and regenerate SEO. Your current results will be preserved!`);
        }

        // --- RENDER FUNCTIONS FOR DROPDOWNS ---
                function renderVisualStyles() {
            const container = document.getElementById('styleButtons');
            if (!container) return;
            
            container.innerHTML = VISUAL_STYLES.map(style => 
                `<button 
                    onclick="selectVisualStyle('${style.id}')" 
                    id="style-${style.id}"
                    class="p-3 rounded-lg border border-white/10 bg-black/30 hover:bg-pink-900/20 hover:border-pink-500/30 transition-all text-left group"
                    title="${style.desc}">
                    <div class="text-xs font-bold text-white group-hover:text-pink-300">${style.name}</div>
                    <div class="text-[9px] text-slate-500 mt-1 line-clamp-2">${style.desc}</div>
                </button>`
            ).join('');
            
            // Select first style by default
            if (VISUAL_STYLES.length > 0) {
                selectVisualStyle(VISUAL_STYLES[0].id);
            }
        }
        
        function selectVisualStyle(styleId) {
            STORE.visualStyle = styleId;
            const styleObj = VISUAL_STYLES.find(s => s.id === styleId);
            
            // Update UI
            VISUAL_STYLES.forEach(s => {
                const btn = document.getElementById(`style-${s.id}`);
                if (btn) {
                    if (s.id === styleId) {
                        btn.className = 'p-3 rounded-lg border-2 border-pink-500 bg-pink-900/30 transition-all text-left group shadow-[0_0_15px_rgba(236,72,153,0.3)]';
                    } else {
                        btn.className = 'p-3 rounded-lg border border-white/10 bg-black/30 hover:bg-pink-900/20 hover:border-pink-500/30 transition-all text-left group';
                    }
                }
            });

            // Update Master Style Template Box (Critical for AI Standard)
            const refContainer = document.getElementById('styleRefContainer');
            const refPrompt = document.getElementById('styleRefPrompt');
            if (styleObj && styleObj.reference_prompt && styleId !== 'auto') {
                refPrompt.value = styleObj.reference_prompt;
                refContainer.classList.remove('hidden');
            } else {
                refContainer.classList.add('hidden');
            }
        }
        
        function renderSeoChecklist() {
            const container = document.getElementById('seoChecklistContainer');
            if (!container) return;
            
            container.innerHTML = Object.entries(SEO_CHECKLIST_DATA).map(([category, items]) => 
                `<div class="mb-4">
                    <div class="text-xs font-bold text-slate-400 uppercase mb-2">${category}</div>
                    <div class="space-y-2">
                        ${items.map(item => 
                            `<label class="flex items-center gap-2 text-sm text-slate-300 hover:text-white cursor-pointer">
                                <input type="checkbox" 
                                    onchange="STORE.checklistState['${item.id}'] = this.checked" 
                                    class="rounded border-white/20 bg-black/50">
                                <span>${item.label}</span>
                            </label>`
                        ).join('')}
                    </div>
                </div>`
            ).join('');
        }

        // --- INITIALIZATION ---
        function init() {
            loadKeys();
            renderKeyInputs();
            renderLanguageOptions();
            renderVisualStyles();
            renderSeoChecklist();
            updateEstimations();
            
            // Default to Vietnam aspiration context
            if (!STORE.activeLanguage) {
                STORE.activeLanguage = 'vn_aspiration';
            }
            
            // Set default tab
            switchTab('spy');
            
            // Set default view for keys
            if (!STORE.keyPool.length || (STORE.keyPool.length === 1 && !STORE.keyPool[0])) {
                document.getElementById('settingsModal').classList.remove('hidden');
            }
            
            // Initialize language UI
            updateUILanguage();
        }

        // Initialize App
        window.addEventListener('DOMContentLoaded', init);

    </script>
   <footer class="relative border-t border-slate-800/60 mt-16 py-8 bg-slate-900">
    <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800/20 via-slate-900 to-slate-900 pointer-events-none"></div>

    <div class="relative max-w-6xl mx-auto px-4 text-center z-10">
        <div class="text-slate-500 text-xs font-light tracking-wide">
            Copyright &copy; <?php echo date('Y'); ?> 
            <span class="text-slate-300 font-bold uppercase ml-1">CÔNG TY TNHH NDGROUP MEDIA VIỆT NAM</span>.
            <span class="hidden sm:inline text-slate-600 px-1">|</span> 
            <span class="block sm:inline mt-1 sm:mt-0 text-slate-600">All rights reserved.</span>
        </div>

        <div class="mt-5 flex items-center justify-center gap-4">
            <a href="https://www.youtube.com/@ndgroupvietnam/?sub_confirmation=1" 
               target="_blank" 
               class="group flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800 hover:bg-red-600/10 border border-slate-700 hover:border-red-500/50 transition-all duration-300">
                
                <div class="relative flex items-center justify-center">
                    <i class="fa-brands fa-youtube text-lg text-slate-400 group-hover:text-red-500 transition-colors"></i>
                    <div class="absolute inset-0 bg-red-500 blur-md opacity-0 group-hover:opacity-40 transition-opacity duration-300"></div>
                </div>

                <span class="text-xs font-medium text-slate-400 group-hover:text-red-400 transition-colors">
                    Xem trên Youtube
                </span>
            </a>
        </div>
    </div>
</footer>
</body>
</html>
