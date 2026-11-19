import { writeFile } from 'node:fs/promises';
import '../site/radio.js';

const date = new Date();
let playlist = globalThis.WeeklyRadio.weekAt(date);
const key = process.env.YOUTUBE_API_KEY;

if (key) {
  const endpoint = new URL('https://www.googleapis.com/youtube/v3/videos');
  endpoint.search = new URLSearchParams({
    part: 'snippet,status,contentDetails',
    chart: 'mostPopular',
    videoCategoryId: '10',
    regionCode: 'TW',
    maxResults: '30',
    key
  });
  try {
    const response = await fetch(endpoint, { signal: AbortSignal.timeout(15000) });
    if (!response.ok) throw new Error('YouTube API 回應 HTTP ' + response.status);
    const { items } = await response.json();
    const tracks = items.filter(video => {
      const region = video.contentDetails?.regionRestriction;
      return video.status?.embeddable && video.status.privacyStatus === 'public'
        && !video.contentDetails?.contentRating?.ytRating
        && (!region?.allowed || region.allowed.includes('TW'))
        && !region?.blocked?.includes('TW');
    }).slice(0, 12).map(video => ({
      id: video.id, title: video.snippet.title, artist: video.snippet.channelTitle
    }));
    if (!tracks.length) throw new Error('台灣地區找不到可內嵌的熱門音樂影片');
    playlist = { name: '台灣熱門音樂', updatedAt: date.toISOString(), source: 'youtube', tracks };
  } catch (error) {
    console.warn('YouTube 熱門影片更新未完成，使用本週精選。', error.name);
  }
}

await writeFile(new URL('../site/playlist.json', import.meta.url), JSON.stringify(playlist, null, 2) + '\n');
console.log(playlist.name + ' · ' + playlist.tracks.length + ' 首');
