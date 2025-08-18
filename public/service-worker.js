// service-worker.js

// Збільшуємо версію кешу, щоб гарантувати оновлення
const CACHE_VERSION = 'v3';
const CACHE_NAME = `promelektroservice-cache-${CACHE_VERSION}`;
const OFFLINE_URL = '/index.html';

const urlsToCache = [
  '/',
  '/index.html',
  '/favicon.ico',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  // Зверніть увагу, тут не потрібно перелічувати JS/CSS файли з хешами,
  // оскільки вони будуть кешуватися динамічно.
];

// Обробник події `install`
// Завжди кешує базові файли
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('✅ Service Worker встановлено. Кешую базові ресурси.');
      return cache.addAll(urlsToCache);
    }).catch(error => {
      console.error('❌ Помилка при кешуванні базових ресурсів:', error);
    })
  );
});

// Обробник події `fetch`
// Створює стратегію "Cache-first, then Network" для всіх запитів
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET' || !event.request.url.startsWith('http')) {
    return;
  }

  // Запит до сторонніх ресурсів (Google Fonts, API)
  if (/\.(api|googleapis|gstatic)\.com/.test(event.request.url)) {
    event.respondWith(
      caches.match(event.request)
        .then(cachedResponse => {
          const fetchPromise = fetch(event.request).then(networkResponse => {
            if (networkResponse.ok) {
              const responseToCache = networkResponse.clone();
              caches.open(CACHE_NAME).then(cache => {
                cache.put(event.request, responseToCache);
              });
            }
            return networkResponse;
          }).catch(() => cachedResponse);
          return cachedResponse || fetchPromise;
        })
    );
    return;
  }

  // Стратегія для всіх інших (наших) ресурсів:
  // Спочатку спробувати отримати з кешу. Якщо не знайдено,
  // завантажити з мережі і закешувати.
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        if (cachedResponse) {
          console.log(`✅ ${event.request.url} взято з кешу.`);
          return cachedResponse;
        }

        return fetch(event.request)
          .then(networkResponse => {
            if (
              !networkResponse || 
              networkResponse.status !== 200 || 
              networkResponse.type !== 'basic' || 
              networkResponse.url.includes('google') // Виключити сторонні запити
            ) {
              return networkResponse;
            }

            // Динамічне кешування
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, responseToCache);
              console.log(`✅ ${event.request.url} закешовано.`);
            });

            return networkResponse;
          })
          .catch(() => {
            // Повертаємо офлайн-сторінку у випадку помилки мережі
            if (event.request.mode === 'navigate') {
              return caches.match(OFFLINE_URL);
            }
            return null;
          });
      })
  );
});

// Обробник події `activate`
// Очищує старий кеш
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(cacheName => cacheName.startsWith('promelektroservice-cache-') && cacheName !== CACHE_NAME)
          .map(cacheName => caches.delete(cacheName))
      );
    })
    .then(() => self.clients.claim())
  );
  console.log('✅ Service Worker активовано. Старий кеш очищено.');
});