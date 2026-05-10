import { MODELS } from '../data/types';
import { safeJSONParse } from './utils';

export async function callAI(
  prompt: string,
  systemPrompt: string,
  keyPool: string[],
  _currentKeyIndex: number,
  onRotate: () => string,
  onError: (msg: string) => void
): Promise<unknown> {
  const hasKeys = keyPool.some(k => k && k.trim() !== '');
  if (!hasKeys) {
    throw new Error("❌ Vui lòng nhập API Key trong Settings!");
  }

  return await callGoogleWithRetry(prompt, systemPrompt, onRotate, onError);
}

async function callGoogleWithRetry(
  prompt: string,
  systemPrompt: string,
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

export function getNextKey(keyPool: string[], currentIndex: number): { key: string; nextIndex: number } {
  if (keyPool.length === 0 || (keyPool.length === 1 && !keyPool[0])) return { key: '', nextIndex: 0 };
  const nextIndex = (currentIndex + 1) % keyPool.length;
  return { key: keyPool[nextIndex], nextIndex };
}