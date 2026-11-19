const byId = id => document.getElementById(id);
const player = byId('player');
const playerTitle = byId('player-title');
const video = byId('video');
const search = byId('search');
const tracksList = byId('tracks');
const dateFormat = new Intl.DateTimeFormat('zh-TW', {
  timeZone: 'Asia/Taipei', year: 'numeric', month: 'long', day: 'numeric'
});
let playlist = WeeklyRadio.weekAt();
let activeTrack;
let activeQueue = [];
let showAll = false;

function renderTracks() {
  const query = search.value.trim().toLocaleLowerCase('zh-TW');
  const queue = showAll ? WeeklyRadio.catalog : playlist.tracks;
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

function renderPlaylist() {
  byId('theme').textContent = playlist.name + ' · ' + playlist.tracks.length + ' 首';
  byId('date').textContent = showAll
    ? WeeklyRadio.catalog.length + ' 首精選歌曲'
    : '更新於 ' + dateFormat.format(new Date(playlist.updatedAt));
  renderTracks();
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

function selectView(all) {
  showAll = all;
  byId('show-week').setAttribute('aria-pressed', String(!all));
  byId('show-all').setAttribute('aria-pressed', String(all));
  renderPlaylist();
}

byId('show-week').addEventListener('click', () => selectView(false));
byId('show-all').addEventListener('click', () => selectView(true));
byId('start').addEventListener('click', () => play(playlist.tracks[0], playlist.tracks));
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
renderPlaylist();

if (location.protocol === 'https:' || location.protocol === 'http:') {
  fetch('./playlist.json', { cache: 'no-cache' })
    .then(response => response.ok ? response.json() : null)
    .then(data => {
      if (activeTrack || data?.source !== 'youtube' || !data.tracks?.length
          || !(Date.parse(data.updatedAt) >= Date.parse(playlist.updatedAt))
          || !data.tracks.every(track => /^[\w-]{11}$/.test(track.id)
            && typeof track.title === 'string' && typeof track.artist === 'string')) return;
      playlist = data;
      renderPlaylist();
    })
    .catch(() => {});
}
