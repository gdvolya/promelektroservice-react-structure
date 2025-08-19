// service-worker.js

const CACHE_VERSION = 'v4';
const CACHE_NAME = `promelektroservice-cache-${CACHE_VERSION}`;
const OFFLINE_URL = '/index.html';

const urlsToCache = [
  '/',
  '/index.html',
  '/favicon.ico',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

// Установка
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    }).catch(err => console.error('SW install cache error:', err))
  );
});

// Фетч
self.addEventListener('fetch', event => {
  const { request } = event;
  if (request.method !== 'GET' || !request.url.startsWith('http')) return;

  // Внешние (Google Fonts, API)
  if (/\.(api|googleapis|gstatic)\.com/.test(request.url)) {
    event.respondWith(
      caches.match(request).then(cached => {
        const fromNetwork = fetch(request).then(resp => {
          if (resp && resp.ok) {
            caches.open(CACHE_NAME).then(cache => cache.put(request, resp.clone()));
          }
          return resp;
        }).catch(() => cached);
        return cached || fromNetwork;
      })
    );
    return;
  }

  // Наши ресурсы
  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached;
      return fetch(request).then(resp => {
        if (!resp || resp.status !== 200 || resp.type !== 'basic') {
          return resp;
        }
        const clone = resp.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
        return resp;
      }).catch(() => {
        if (request.mode === 'navigate') {
          return caches.match(OFFLINE_URL);
        }
        return null;
      });
    })
  );
});

// Очистка старого кеша
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(names =>
      Promise.all(
        names
          .filter(n => n.startsWith('promelektroservice-cache-') && n !== CACHE_NAME)
          .map(n => caches.delete(n))
      )
    ).then(() => self.clients.claim())
  );
});
