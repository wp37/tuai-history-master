import { MODELS } from '../data/types';
import { safeJSONParse } from './utils';

export async function callAI(
  prompt: string,
  systemPrompt: string,
  store: {
    keyPool: string[];
    currentKeyIndex: number;
    apiEnabled: { google: boolean; openrouter: boolean; openai: boolean; youtube: boolean };
    openRouterKey: string;
    openRouterModel: string;
    openAiKey: string;
    openAiModel: string;
  },
  onRotate: () => string,
  onError: (msg: string) => void
): Promise<unknown> {
  const anyEnabled = store.apiEnabled.google || store.apiEnabled.openrouter || store.apiEnabled.openai;
  if (!anyEnabled) {
    throw new Error("❌ Vui lòng bật ít nhất 1 API trong Config!");
  }

  const hasGoogleKeys = store.keyPool.some(k => k && k.trim() !== '');
  if (store.apiEnabled.google && hasGoogleKeys) {
    try {
      return await callGoogleWithRetry(prompt, systemPrompt, store, onRotate, onError);
    } catch (e) {
      console.warn("Google Gemini Failed:", e);
      if (!store.apiEnabled.openrouter && !store.apiEnabled.openai) throw e;
      onError("⚠️ Google API failed. Switching to backup...");
    }
  }

  if (store.apiEnabled.openrouter && store.openRouterKey) {
    try {
      return await callOpenRouter(prompt, systemPrompt, store.openRouterKey, store.openRouterModel);
    } catch (e) {
      console.warn("OpenRouter Failed:", e);
      if (!store.apiEnabled.openai) throw e;
      onError("⚠️ OpenRouter failed. Trying OpenAI...");
    }
  }

  if (store.apiEnabled.openai && store.openAiKey) {
    return await callOpenAI(prompt, systemPrompt, store.openAiKey, store.openAiModel);
  }

  throw new Error("❌ All enabled APIs failed or no valid API keys!");
}

async function callGoogleWithRetry(
  prompt: string,
  systemPrompt: string,
  _store: { keyPool: string[]; currentKeyIndex: number },
  onRotate: () => string,
  onError: (msg: string) => void,
  retries = 6
): Promise<unknown> {
  let lastError: Error | undefined;
  for (let i = 0; i < retries; i++) {
    const apiKey = onRotate();
    if (!apiKey) continue;
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODELS.text}:generateContent?key=${apiKey}`;
      const body = {
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        systemInstruction: { parts: [{ text: systemPrompt }] },
        generationConfig: { responseMimeType: "application/json" }
      };
      const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });

      if (res.status === 429) throw new Error("429 Quota Exceeded");
      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Google Error ${res.status}: ${errText}`);
      }

      const data = await res.json();
      if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) throw new Error("Invalid Gemini Response");

      return safeJSONParse(data.candidates[0].content.parts[0].text);
    } catch (e) {
      lastError = e as Error;
      const isQuota = (e as Error).message.includes('429');
      if (i < retries - 1) {
        const waitTime = isQuota ? 2000 * (i + 1) : 1000;
        if (i > 1) onError(`⚠️ Mạng bận (429). Đang thử lại với Key khác... (${i + 1}/${retries})`);
        await new Promise(r => setTimeout(r, waitTime));
      }
    }
  }
  throw lastError || new Error("All Google attempts failed.");
}

async function callOpenRouter(prompt: string, systemPrompt: string, apiKey: string, model: string) {
  const url = "https://openrouter.ai/api/v1/chat/completions";
  const body = {
    model: model || MODELS.openrouter_default,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: prompt }
    ],
    response_format: { type: "json_object" }
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json', 'HTTP-Referer': window.location.href, 'X-Title': 'NDGroup HistoryMaster' },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenRouter Error: ${err}`);
  }
  const data = await res.json();
  return safeJSONParse(data.choices[0].message.content);
}

async function callOpenAI(prompt: string, systemPrompt: string, apiKey: string, model: string) {
  const url = "https://api.openai.com/v1/chat/completions";
  const body = {
    model: model || 'gpt-4-turbo-preview',
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: prompt }
    ],
    response_format: { type: "json_object" },
    temperature: 0.7
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenAI Error: ${err}`);
  }
  const data = await res.json();
  return safeJSONParse(data.choices[0].message.content);
}

export function getNextKey(keyPool: string[], currentIndex: number): { key: string; nextIndex: number } {
  if (keyPool.length === 0 || (keyPool.length === 1 && !keyPool[0])) return { key: '', nextIndex: 0 };
  const nextIndex = (currentIndex + 1) % keyPool.length;
  return { key: keyPool[nextIndex], nextIndex };
}