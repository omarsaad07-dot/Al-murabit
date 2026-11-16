const C = 'murabit-v2';
const CORE = ['./', './index.html', './manifest.json', './icon-180.png', './icon-192.png', './icon-512.png', './poster.jpg',
  './rank1.jpg', './rank2.jpg', './rank3.jpg', './rank4.jpg', './rank5.jpg',
  './icons/helmet.png', './icons/chest.png', './icons/shield.png', './icons/sword.png', './icons/horse.png', './icons/banner.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(C).then(c => c.addAll(CORE)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== C).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  if (url.origin === location.origin && (url.pathname.endsWith('/') || url.pathname.endsWith('index.html'))) {
    e.respondWith(fetch(e.request).then(r => { const cp = r.clone(); caches.open(C).then(c => c.put(e.request, cp)); return r; }).catch(() => caches.match(e.request)));
    return;
  }
  e.respondWith(caches.match(e.request).then(hit => hit || fetch(e.request).then(r => { if (r.ok || r.type === 'opaque') { const cp = r.clone(); caches.open(C).then(c => c.put(e.request, cp)); } return r; })));
});
