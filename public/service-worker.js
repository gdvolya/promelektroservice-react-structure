// service-worker.js

const CACHE_VERSION = 'v5';
const CACHE_NAME = `promelektroservice-cache-${CACHE_VERSION}`;
const OFFLINE_URL = '/index.html';

// Оставляем только реально существующие файлы
const urlsToCache = [
  '/',
  '/index.html',
  '/favicon.ico',
  '/manifest.json'
];

// Установка
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(async cache => {
      for (const url of urlsToCache) {
        try {
          await cache.add(url);
        } catch (e) {
          console.warn('Не удалось закешировать:', url, e);
        }
      }
    })
  );
});

// Фетч
self.addEventListener('fetch', event => {
  const { request } = event;
  if (request.method !== 'GET' || !request.url.startsWith('http')) return;

  // Внешние (Google Fonts, API) — network-first + cache fallback
  if (/\.(api|googleapis|gstatic)\.com/.test(request.url)) {
    event.respondWith(
      fetch(request)
        .then(resp => {
          if (resp && resp.ok) {
            const clone = resp.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
          }
          return resp;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // Наши ресурсы — cache-first + network update
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

// Очистка старых кешей
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
