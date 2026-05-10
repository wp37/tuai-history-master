export interface ScriptSegment {
  scene_number: number;
  time: string;
  section: string;
  character: string;
  voice_text: string;
  visual_desc_vi: string;
  video_prompt: string;
  image_prompt: string;
  strategy_note?: string;
  chapter_voice_block?: string;
}

export interface StoreState {
  isVip: boolean;
  userPlan: string;
  keyPool: string[];
  currentKeyIndex: number;
  activeTab: 'spy' | 'script' | 'studio' | 'seo' | 'market';
  scriptTopic: string;
  durationMinutes: number;
  visualStyle: string;
  selectedVisualStyle: string;
  detectedStyle: string;
  detectedMode: string | null;
  scriptSegments: ScriptSegment[];
  productionMode: 'video' | 'image';
  renderedMedia: Record<string, string>;
  checklistState: Record<string, boolean>;
  activeLanguage: string;
  uiLanguage: 'vi' | 'en';
  renderingId: string | null;
  isLoading: boolean;
  openRouterKey: string;
  openRouterModel: string;
  youtubeApiKey: string;
  openAiKey: string;
  openAiModel: string;
  apiEnabled: {
    google: boolean;
    openrouter: boolean;
    openai: boolean;
    youtube: boolean;
  };
}

export const MODELS = {
  text: 'gemini-2.5-flash',
  image: 'imagen-3.0-generate-002',
  openrouter_default: 'google/gemini-2.0-flash-exp:free'
};

export const SECONDS_PER_SCENE = 8;