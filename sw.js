const CACHE_NAME = 'horus-and-seth-v11';
const APP_SHELL = [
  './',
  './index.html',
  './dictionary.html',
  './sign-list.html',
  './wenamun.html',
  './horus-and-seth.html',
  './manifest.webmanifest',
  './site-update-check.js',
  './ship-creak.js',
  './divine-chime.js',
  './book-open.js',
  './sign-list-pling.js',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-192.png',
  './icons/icon-maskable-512.png',
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(APP_SHELL).catch(() => {
        // best-effort: individual failures (e.g. offline first install) shouldn't block activation
        return Promise.all(APP_SHELL.map((url) => cache.add(url).catch(() => {})));
      });
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(names.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);

  // version.json is the update-check heartbeat -- it must always come from
  // the network, never from this cache, or the on-page update checker would
  // just be comparing a stale cached copy against itself.
  if (url.pathname.endsWith('/version.json')) {
    event.respondWith(
      fetch(event.request).catch(
        () => new Response('{}', { headers: { 'Content-Type': 'application/json' } })
      )
    );
    return;
  }

  const isNavigation = event.request.mode === 'navigate' || event.request.destination === 'document';

  if (isNavigation) {
    // network-first for page loads: opening (or reopening) any page always
    // tries to fetch the latest deployed HTML first, and only falls back to
    // the cached copy when offline.
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response && response.status === 200 && response.type === 'basic') {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          }
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // cache-first for static assets (icons, manifest, the checker script itself)
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request)
        .then((response) => {
          if (response && response.status === 200 && response.type === 'basic') {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          }
          return response;
        })
        .catch(() => cached);
    })
  );
});
