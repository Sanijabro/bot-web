// ================== CONFIG ==================
const API_BASE = 'https://manul-official-tech.vercel.app'; // Change to your backend or leave as is
const FALLBACK_LOCAL = true; // If API fails, use localStorage fallback

// ================== DOM ==================
const html = document.documentElement;
const navLinks = document.getElementById('navLinks');
const hamburger = document.getElementById('hamburger');
const themeToggle = document.getElementById('themeToggle');
const backBtn = document.getElementById('backBtn');
const toTop = document.getElementById('toTop');

// Audio
const audio = document.getElementById('audio');
const playBtn = document.getElementById('playPauseBtn');
const nextBtn = document.getElementById('nextBtn');
const prevBtn = document.getElementById('prevBtn');
const muteBtn = document.getElementById('muteBtn');
const titleEl = document.getElementById('songTitle');
const albumArt = document.getElementById('albumArt');
const progressWrap = document.getElementById('progressWrap');
const progress = document.getElementById('progress');
const currentTimeEl = document.getElementById('currentTime');
const durationEl = document.getElementById('duration');

// Comments
const commentForm = document.getElementById('commentForm');
const postBtn = document.getElementById('postBtn');
const commentsDiv = document.getElementById('comments');

// ================== NAV / THEME ==================
backBtn.addEventListener('click', () => history.length > 1 ? history.back() : window.scrollTo({ top: 0, behavior: 'smooth' }));

hamburger.addEventListener('click', () => {
  const open = navLinks.classList.toggle('show');
  hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
});
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('show')));

function setTheme(mode) {
  html.setAttribute('data-theme', mode);
  themeToggle.textContent = mode === 'dark' ? '🌙' : '☀️';
  localStorage.setItem('theme', mode);
}
themeToggle.addEventListener('click', () => {
  const now = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  setTheme(now);
});
setTheme(localStorage.getItem('theme') || 'dark');

// Show back-to-top
window.addEventListener('scroll', () => {
  if (window.scrollY > 500) toTop.classList.add('show');
  else toTop.classList.remove('show');
});
toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// Active link on scroll
const sections = document.querySelectorAll('main section[id]');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => {
    const top = sec.offsetTop - 120;
    if (pageYOffset >= top) current = sec.getAttribute('id');
  });
  navLinks.querySelectorAll('a').forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
  });
});

// ================== CYBER VIBE ==================
(function createCyberVibe() {
  const container = document.getElementById('cyberVibe');
  const colors = ['#00f3ff', '#6e8efb', '#a777e3', '#4facfe'];
  for (let i = 0; i < 24; i++) {
    const line = document.createElement('div');
    line.className = 'cyber-line';
    line.style.left = `${-Math.random() * 40}vw`;
    line.style.top = `${Math.random() * 100}%`;
    line.style.width = `${Math.random() * 260 + 120}px`;
    line.style.animationDuration = `${Math.random() * 12 + 6}s`;
    line.style.animationDelay = `${Math.random() * 8}s`;
    line.style.background = `linear-gradient(90deg, transparent, ${colors[(Math.random()*colors.length)|0]}, transparent)`;
    container.appendChild(line);
  }
  for (let i = 0; i < 42; i++) {
    const dot = document.createElement('div');
    dot.className = 'cyber-dot';
    dot.style.left = `${Math.random() * 100}%`;
    dot.style.top = `${Math.random() * 100}%`;
    dot.style.animationDuration = `${Math.random() * 3 + 1}s`;
    dot.style.animationDelay = `${Math.random() * 2}s`;
    container.appendChild(dot);
  }
})();

// ================== AUDIO PLAYER ==================
const songs = [
  { title: "Ehemath Adarayak (එහෙමත් ආදරයක්)", src: "https://gitlab.com/UnexpectedX/v8-db/-/raw/main/Ehemath.mp3", cover: "https://i.ibb.co/1GVrwQC4/DiNuWhMd.jpg" },
  { title: "Manomaya (මනෝමායා)", src: "https://gitlab.com/UnexpectedX/v8-db/-/raw/main/Manomaya.mp3", cover: "https://i.ibb.co/1ffFKBZy/DiNuWhMd.jpg" },
  { title: "Mage Heena (මගේ හීන)", src: "https://gitlab.com/UnexpectedX/v8-db/-/raw/main/Magee.mp3", cover: "https://i.ibb.co/Jj41LC3P/DiNuWhMd.jpg" },
  { title: "මාගෙ දෑසින් — Viraj & Dilrukshi Perera", src: "https://gitlab.com/UnexpectedX/v8-db/-/raw/main/Mage.mp3", cover: "https://i.ibb.co/TqRgsPjB/Manul-Ofc-X.jpg" },
  { title: "Sumudu Walawaka — Thiwanka Mihiran", src: "https://gitlab.com/UnexpectedX/v8-db/-/raw/main/Sumudu.mp3", cover: "https://i.ibb.co/kgZGPJdL/Manul-Ofc-X.jpg" },
  { title: "මනෝපාරක් — Rap Mix 🥀💔", src: "https://gitlab.com/UnexpectedX/v8-db/-/raw/main/Manopara.mp3", cover: "https://i.ibb.co/Xx9DPCRT/Manul-Ofc-X.jpg" },
  { title: "KING LOTUSS — Top Hits", src: "https://gitlab.com/UnexpectedX/v8-db/-/raw/main/Lota.mp3", cover: "https://i.ibb.co/fzhW0qYC/Manul-Ofc-X.jpg" },
  { title: "Smokio x Costa — UKUZA", src: "https://gitlab.com/UnexpectedX/v8-db/-/raw/main/Ukuza.mp3", cover: "https://i.ibb.co/rR8ccgLG/Manul-Ofc-X.jpg" }
];

let current = parseInt(localStorage.getItem('song_index') || '0', 10);
let wasPlaying = false;

function formatTime(sec) {
  if (!Number.isFinite(sec)) return '0:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}
function loadSong(index) {
  current = (index + songs.length) % songs.length;
  const song = songs[current];
  audio.src = song.src;
  titleEl.textContent = song.title;
  albumArt.src = song.cover;
  localStorage.setItem('song_index', current);
  audio.load();
}
function playPause() {
  if (audio.paused) { audio.play(); playBtn.textContent = '⏸️'; }
  else { audio.pause(); playBtn.textContent = '▶️'; }
}
function nextSong() { loadSong(current + 1); audio.play().catch(()=>{}); playBtn.textContent = '⏸️'; }
function prevSong() { loadSong(current - 1); audio.play().catch(()=>{}); playBtn.textContent = '⏸️'; }

playBtn.addEventListener('click', playPause);
nextBtn.addEventListener('click', nextSong);
prevBtn.addEventListener('click', prevSong);
muteBtn.addEventListener('click', () => {
  audio.muted = !audio.muted;
  muteBtn.textContent = audio.muted ? '🔇' : '🔊';
});

audio.addEventListener('loadedmetadata', () => {
  durationEl.textContent = formatTime(audio.duration);
  const savedTime = parseFloat(localStorage.getItem('song_time') || '0');
  if (!isNaN(savedTime) && savedTime > 0 && savedTime < audio.duration - 2) {
    audio.currentTime = savedTime;
  }
  if (wasPlaying) audio.play().catch(()=>{});
});
audio.addEventListener('timeupdate', () => {
  currentTimeEl.textContent = formatTime(audio.currentTime);
  const percent = (audio.currentTime / (audio.duration || 1)) * 100;
  progress.style.width = `${percent}%`;
  localStorage.setItem('song_time', audio.currentTime.toString());
});
audio.addEventListener('ended', nextSong);

progressWrap.addEventListener('click', (e) => {
  const rect = progressWrap.getBoundingClientRect();
  const ratio = (e.clientX - rect.left) / rect.width;
  audio.currentTime = ratio * audio.duration;
});

wasPlaying = localStorage.getItem('was_playing') === 'true';
window.addEventListener('beforeunload', () => localStorage.setItem('was_playing', (!audio.paused).toString()));
loadSong(current);

// ================== COMMENTS ==================
async function fetchComments() {
  try {
    const res = await fetch(`${API_BASE}/comments`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed');
    const data = await res.json();
    if (FALLBACK_LOCAL) localStorage.setItem('comments_backup', JSON.stringify(data));
    return data;
  } catch (e) {
    if (FALLBACK_LOCAL) {
      const backup = localStorage.getItem('comments_backup');
      return backup ? JSON.parse(backup) : [];
    }
    return [];
  }
}
function renderComments(list) {
  commentsDiv.innerHTML = '';
  if (!list.length) {
    commentsDiv.innerHTML = '<p style="color: var(--muted);">No comments yet. Be the first!</p>';
    return;
  }
  list.forEach(item => {
    const wrap = document.createElement('div');
    wrap.className = 'comment';

    const meta = document.createElement('div');
    meta.className = 'meta';
    const name = document.createElement('span');
    name.textContent = item.name || 'Anonymous';
    const date = document.createElement('span');
    const when = item.createdAt ? new Date(item.createdAt) : new Date();
    date.textContent = when.toLocaleString();
    meta.append(name, date);

    const msg = document.createElement('div');
    msg.className = 'message';
    msg.textContent = item.message || '';

    wrap.append(meta, msg);
    commentsDiv.appendChild(wrap);
  });
}
async function loadComments() {
  const data = await fetchComments();
  renderComments(data);
}
commentForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const message = document.getElementById('message').value.trim();
  if (!name || !message) return;

  postBtn.disabled = true;
  postBtn.textContent = 'Posting...';

  try {
    const res = await fetch(`${API_BASE}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, message })
    });
    if (!res.ok) throw new Error('Failed to post');
    commentForm.reset();
    await loadComments();
  } catch (err) {
    alert('Failed to post comment. Using local mode.');
    // local fallback
    if (FALLBACK_LOCAL) {
      const backup = JSON.parse(localStorage.getItem('comments_backup') || '[]');
      const newItem = { name, message, createdAt: new Date().toISOString() };
      backup.unshift(newItem);
      localStorage.setItem('comments_backup', JSON.stringify(backup));
      renderComments(backup);
    }
  } finally {
    postBtn.disabled = false;
    postBtn.textContent = 'Post Comment';
  }
});
loadComments();

// ================== SMALL UX ENHANCEMENTS ==================
// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href');
    if (!id || id === '#') return;
    const el = document.querySelector(id);
    if (!el) return;
    e.preventDefault();
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});
