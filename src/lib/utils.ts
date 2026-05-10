export function safeJSONParse(str: string): unknown {
  if (!str) return null;
  let cleanStr = str.replace(/```json/gi, '').replace(/```/g, '').trim();
  const firstBrace = cleanStr.indexOf('{');
  const firstBracket = cleanStr.indexOf('[');
  let startIndex = -1;
  let endIndex = -1;
  if (firstBrace !== -1 && (firstBracket === -1 || firstBrace < firstBracket)) {
    startIndex = firstBrace;
    endIndex = cleanStr.lastIndexOf('}');
  } else if (firstBracket !== -1) {
    startIndex = firstBracket;
    endIndex = cleanStr.lastIndexOf(']');
  }
  if (startIndex !== -1 && endIndex !== -1) {
    cleanStr = cleanStr.substring(startIndex, endIndex + 1);
  } else {
    throw new Error("Invalid JSON structure");
  }
  try {
    return JSON.parse(cleanStr);
  } catch (e) {
    if (cleanStr.startsWith('{')) return JSON.parse(cleanStr + '}');
    if (cleanStr.startsWith('[')) return JSON.parse(cleanStr + ']');
    throw new Error("JSON Parse Error");
  }
}

export function downloadFile(content: string, fileName: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text).catch(() => {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
  });
}

export function extractVideoId(url: string): string | null {
  const match = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
}

export async function fetchYoutubeMeta(url: string, apiKey: string): Promise<{
  title: string;
  author: string;
  thumb: string;
  description?: string;
  tags?: string;
  viewCount?: string;
  likeCount?: string;
  publishDate?: string;
  fullData: boolean;
}> {
  const videoId = extractVideoId(url);
  if (!videoId) return { title: 'Invalid URL', author: 'Unknown', thumb: '', fullData: false };

  if (apiKey) {
    try {
      const apiUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoId}&key=${apiKey}`;
      const res = await fetch(apiUrl);
      if (res.ok) {
        const data = await res.json();
        if (data.items && data.items.length > 0) {
          const item = data.items[0];
          const snippet = item.snippet;
          const stats = item.statistics;
          return {
            title: snippet.title,
            author: snippet.channelTitle,
            thumb: snippet.thumbnails.maxres ? snippet.thumbnails.maxres.url : snippet.thumbnails.high.url,
            description: snippet.description,
            tags: snippet.tags ? snippet.tags.join(', ') : '',
            viewCount: stats.viewCount,
            likeCount: stats.likeCount,
            publishDate: snippet.publishedAt,
            fullData: true
          };
        }
      }
    } catch (e) {
      console.warn("YouTube Data API failed, falling back to oEmbed", e);
    }
  }

  try {
    const res = await fetch(`https://www.youtube.com/oembed?url=${url}&format=json`);
    if (res.ok) {
      const data = await res.json();
      return { title: data.title, author: data.author_name, thumb: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`, fullData: false };
    }
  } catch (e) {
    // fallback
  }
  return { title: 'Video', author: 'YouTube Channel', thumb: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`, fullData: false };
}

export function getTierColor(tier: string): string {
  const t = (tier || '').toLowerCase();
  if (t.includes('premium')) return 'bg-green-900/20 border-green-500/30 text-green-300';
  if (t.includes('high')) return 'bg-yellow-900/20 border-yellow-500/30 text-yellow-300';
  if (t.includes('medium')) return 'bg-orange-900/20 border-orange-500/30 text-orange-300';
  return 'bg-red-900/20 border-red-500/30 text-red-300';
}

export function getImpactColor(impact: string): string {
  const i = (impact || '').toLowerCase();
  if (i.includes('high')) return 'text-red-400 font-bold';
  if (i.includes('medium')) return 'text-yellow-400';
  return 'text-green-400';
}

export function cleanNoise(text: string): string {
  if (!text) return '';
  return text
    .replace(/,? ?Visual Style:.*$/gi, '')
    .replace(/,? ?Style:.*$/gi, '')
    .replace(/In the style of.*?,/gi, '')
    .replace(/^(A |An |The )?(beautiful |cinematic |stunning |serene |peaceful )?(scene of )?/gi, '')
    .replace(/^.*?style animation,?/gi, '')
    .trim();
}
