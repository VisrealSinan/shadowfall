// Shadowfall — offline service worker
const CACHE = 'shadowfall-v94';
const ASSETS = ['./assets/field-ui.js', './assets/field-ui.css', './assets/settings.css', './assets/selection-scenes.js', './assets/selection-scenes.css', './assets/achievement-hall.js', './assets/achievement-hall.css', './assets/run-prep.js', './assets/race-talents.js', './assets/journey-scenes.js', './assets/journey-scenes.css', './assets/nightforge.js', './assets/nightforge-ui.js', './assets/actor-outfits.js', './assets/expansion-content.js', './assets/expansion-rules.js', './assets/expansion-ui.js', './assets/progression.js', './assets/progression-ui.js', './assets/progression.css', './icon.ico', './assets/enemy-art-manifest.js', './assets/enemy-art.js', './assets/actor-animation-manifest.js', './assets/actor-animations.js', './assets/bearlina-races.png', './', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png', './icon-maskable-512.png', './apple-touch-icon.png'];
ASSETS.push('./assets/art-v85-manifest.js', './assets/rebirth-rules.js', './assets/rebirth-art.js', './assets/rebirth-content.js', './assets/rebirth-scenes.js', './assets/rebirth.css', './assets/graveshade-races.png', './assets/paired-survivor-races.png', './assets/druid-form-races.png', './assets/vendors-modern.png', './assets/summons-modern.png', './assets/map-vistas-modern.png', './assets/world-materials-modern.png', './assets/world-props-modern.png');
ASSETS.push('./assets/motion-rig.js', './assets/motion86-manifest.js', './assets/motion-completion.js');
ASSETS.push('./assets/motion88-manifest.js');
ASSETS.push('./assets/shaman92.js','./assets/shaman92.css','./assets/shaman92-art.js','./assets/shaman-skills-v92.png','./assets/shaman-trees-v92.png','./assets/shaman-totems-v92.png');
ASSETS.push('./assets/duo-escort91.js','./assets/dawn88.js','./assets/dawn88.css','./assets/dawn89-art.js','./assets/sanctuary-duo-v89.png','./assets/secret-origins-v89.png','./assets/duo-skills-v89.png');
ASSETS.push('./assets/art-v87-manifest.js', './assets/skill-art.js', './assets/polish87.js', './assets/polish87.css', './assets/skill-art-martial-v87.png', './assets/skill-art-arcane-v87.png', './assets/skill-art-wilds-v87.png', './assets/skill-art-boons-v87.png', './assets/town-shops-v87.png', './assets/world-props-strip-0-v87.png', './assets/world-props-strip-1-v87.png', './assets/world-props-strip-2-v87.png');
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  const url = new URL(req.url);
  // v17: never touch other origins (GitHub release downloads etc.) or anything under /downloads/: straight to network, never cached
  if (req.method !== 'GET' || url.origin !== location.origin || url.pathname.includes('/downloads/')) return;
  if (req.mode === 'navigate') {
    // network first for the page so updates arrive; fall back to cache offline
    e.respondWith(fetch(req).then(res => { const copy = res.clone(); caches.open(CACHE).then(c => c.put('./index.html', copy)); return res; })
      .catch(() => caches.match('./index.html', { ignoreSearch: true })));
    return;
  }
  e.respondWith(caches.match(req, { ignoreSearch: true }).then(hit => hit || fetch(req).then(res => {
    if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
    return res;
  })));
});
