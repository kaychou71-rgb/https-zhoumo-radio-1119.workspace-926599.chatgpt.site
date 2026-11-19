const byId = id => document.getElementById(id);
const player = byId('player');
const playerTitle = byId('player-title');
const video = byId('video');
const search = byId('search');
const tracksList = byId('tracks');
const storageKey = 'weekly-radio-selection';
let playlist = loadPlaylist();
let activeTrack;
let activeQueue = [];

function loadPlaylist() {
  try {
    const ids = JSON.parse(localStorage.getItem(storageKey));
    if (Array.isArray(ids) && ids.length === WeeklyRadio.size && new Set(ids).size === ids.length) {
      const tracks = ids.map(id => WeeklyRadio.catalog.find(track => track.id === id));
      if (tracks.every(Boolean)) return tracks;
    }
  } catch {
    // Listening is available even when the browser disables storage.
  }
  const tracks = WeeklyRadio.refresh();
  savePlaylist(tracks);
  return tracks;
}

function savePlaylist(tracks) {
  try {
    localStorage.setItem(storageKey, JSON.stringify(tracks.map(track => track.id)));
  } catch {
    // Keep the current selection in memory.
  }
}

function renderTracks() {
  const query = search.value.trim().toLocaleLowerCase('zh-TW');
  const queue = playlist;
  const tracks = queue.filter(track =>
    (track.title + ' ' + track.artist).toLocaleLowerCase('zh-TW').includes(query)
  );
  byId('empty').hidden = tracks.length > 0;
  tracksList.replaceChildren(...tracks.map(track => {
    const row = document.createElement('li');
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'track';
    button.dataset.id = track.id;
    button.setAttribute('aria-current', String(track.id === activeTrack?.id));
    button.addEventListener('click', () => play(track, queue));
    const thumbnail = document.createElement('span');
    thumbnail.className = 'thumb';
    thumbnail.setAttribute('aria-hidden', 'true');
    thumbnail.textContent = '♫';
    const image = document.createElement('img');
    image.alt = '';
    image.loading = 'lazy';
    image.addEventListener('error', () => image.remove());
    image.src = 'https://i.ytimg.com/vi/' + track.id + '/mqdefault.jpg';
    thumbnail.append(image);
    const text = document.createElement('span');
    const title = document.createElement('strong');
    const artist = document.createElement('small');
    title.textContent = track.title;
    artist.textContent = track.artist;
    text.append(title, artist);
    const playIcon = document.createElement('span');
    playIcon.className = 'play-symbol';
    playIcon.setAttribute('aria-hidden', 'true');
    playIcon.textContent = '▶';
    button.append(thumbnail, text, playIcon);
    row.append(button);
    return row;
  }));
}

function play(track, queue) {
  activeTrack = track;
  activeQueue = queue;
  player.hidden = false;
  playerTitle.textContent = track.title;
  byId('player-artist').textContent = track.artist;
  byId('youtube').href = 'https://www.youtube.com/watch?v=' + track.id;
  const frame = document.createElement('iframe');
  frame.title = 'YouTube 播放器：' + track.title;
  frame.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen';
  frame.referrerPolicy = 'strict-origin-when-cross-origin';
  frame.src = 'https://www.youtube-nocookie.com/embed/' + track.id + '?autoplay=1&playsinline=1&rel=0';
  video.replaceChildren(frame);
  renderTracks();
  if (!player.contains(document.activeElement)) playerTitle.focus();
}

function step(offset) {
  const index = activeQueue.findIndex(track => track.id === activeTrack?.id);
  play(activeQueue[(index + offset + activeQueue.length) % activeQueue.length], activeQueue);
}

byId('refresh').addEventListener('click', () => {
  playlist = WeeklyRadio.refresh(playlist);
  savePlaylist(playlist);
  search.value = '';
  renderTracks();
  byId('playlist-status').textContent = '已換歌，現有 ' + playlist.length + ' 首。';
});
byId('start').addEventListener('click', () => play(playlist[0], playlist));
byId('previous').addEventListener('click', () => step(-1));
byId('next').addEventListener('click', () => step(1));
byId('close-player').addEventListener('click', () => {
  const previousId = activeTrack?.id;
  video.replaceChildren();
  player.hidden = true;
  activeTrack = undefined;
  renderTracks();
  (tracksList.querySelector('[data-id="' + previousId + '"]') ?? byId('start')).focus();
});
search.addEventListener('input', renderTracks);
renderTracks();
