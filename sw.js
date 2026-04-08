const CACHE_NAME = 'rydcare-v2-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/index-hi.html',
  '/index-ta.html',
  '/driver.html',
  '/driver-hi.html',
  '/driver-ta.html',
  '/css/styles.css',
  '/js/counter.js',
  '/assets/logo-rc-symbol.png',
  '/assets/logo-rc-car.png'
];

const CACHE_EXTERNAL = 'rydcare-v2-external';
const externalUrls = [
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Space+Grotesk:wght@500;600;700&display=swap'
];

self.addEventListener('install', event => {
  event.waitUntil(
    Promise.all([
      caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache)),
      caches.open(CACHE_EXTERNAL).then(cache => {
        return Promise.all(
          externalUrls.map(url => fetch(url, { mode: 'cors' }).then(response => {
            if (response.ok) cache.put(url, response);
          })).catch(() => {})
        );
      })
    ]).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME && cacheName !== CACHE_EXTERNAL) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  
  if (url.origin === 'https://fonts.googleapis.com' || 
      url.origin === 'https://cdnjs.cloudflare.com') {
    event.respondWith(
      caches.open(CACHE_EXTERNAL).then(cache => {
        return cache.match(event.request).then(response => {
          if (response) return response;
          return fetch(event.request).then(networkResponse => {
            if (networkResponse.ok) {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          });
        });
      })
    );
    return;
  }
  
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request).then(response => {
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          const responseToCache = response.clone();
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });
          return response;
        });
      })
  );
});
