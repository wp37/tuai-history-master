export interface HistoryContext {
  id: string;
  name: string;
  flag: string;
  voice_lang: string;
  culture: string;
  core_driver: string;
  writing_style: string;
  human_element: string;
  historical_periods?: string[];
  iconic_figures?: string[];
}

export const HISTORY_CONTEXTS: Record<string, HistoryContext> = {
  vn_aspiration: {
    id: 'vn_aspiration',
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
    human_element: "K-pop trainee's grit, researcher's sleepless nights, student's devotion."
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
    name: 'France (Liberté, Égalité, Fraternité)',
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
    iconic_figures: ['King Alfred', 'Queen Elizabeth I', 'Winston Churchill', 'Emmeline Pankhurst', 'Stephen Hawking']
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
    human_element: 'Social entrepreneur in favela, artist creating hope, athlete\'s passion.'
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
  es_passion: {
    id: 'es_passion',
    name: 'Spain (Pasión y Fiesta)',
    flag: '🇪🇸',
    voice_lang: 'Spanish (European)',
    culture: 'Passionate living, siesta wisdom, family centricity, regional diversity, crisis-to-innovation transformation.',
    core_driver: 'Passion, family, quality of life, cultural richness, resilience.',
    writing_style: 'Passionate, warm, family-focused, culturally rich, vibrant.',
    human_element: 'Family business guardian, startup founder with passion, cultural entrepreneur.'
  },
  mx_corazon: {
    id: 'mx_corazon',
    name: 'Mexico (Corazón Fuerte)',
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
  th_smile: {
    id: 'th_smile',
    name: 'Thailand (สยามเมืองยิ้ม - Land of Smiles)',
    flag: '🇹🇭',
    voice_lang: 'Thai',
    culture: 'Gracious resilience (Mai Pen Rai), Buddhist calm, royal heritage, creative adaptation, balance of joy and discipline.',
    core_driver: 'Harmony, prosperity, cultural pride, family honor, graceful success.',
    writing_style: 'Graceful, balanced, warm, respectful, flowing.',
    human_element: 'Entrepreneur with royal grace, monk-inspired business leader, creative adaptor.'
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
  pk_qaum: {
    id: 'pk_qaum',
    name: "Pakistan (Qaum Ki Ummeed - Nation's Hope)",
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
  ua_spirit: {
    id: 'ua_spirit',
    name: 'Ukraine (Незламність - Unbreakable Spirit)',
    flag: '🇺🇦',
    voice_lang: 'Ukrainian',
    culture: 'Unbreakable resilience, breadbasket heritage, IT outsourcing excellence, freedom fighting spirit, tech innovation despite adversity.',
    core_driver: 'Freedom, resilience, digital transformation, national independence, innovation.',
    writing_style: 'Resilient, defiant, innovative, freedom-focused, determined.',
    human_element: 'Tech entrepreneur building remotely, freedom fighter, agricultural innovator.'
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
};

export const countryList = Object.values(HISTORY_CONTEXTS);
