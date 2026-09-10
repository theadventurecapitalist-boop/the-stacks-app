const CACHE_NAME = 'the-stacks-v2';
const APP_SHELL = ['./', 'index.html', 'manifest.json', 'icon-192.png', 'icon-512.png'];

self.addEventListener('install', e=>{
  e.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', e=>{
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
  );
  self.clients.claim();
});

// network-first so live thumbnails/AI features stay fresh, falling back to the
// cached app shell when offline so the app still opens and shows saved links
self.addEventListener('fetch', e=>{
  e.respondWith(
    fetch(e.request).catch(()=> caches.match(e.request))
  );
});
