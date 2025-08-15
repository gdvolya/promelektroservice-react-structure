// service-worker.js
const CACHE_NAME = 'promelektroservice-cache-v2';
const OFFLINE_URL = '/index.html';

// Ресурсы, которые будут кэшированы при установке Service Worker
const urlsToCache = [
  '/',
  '/index.html',
  '/favicon.ico',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
];

// Событие `install`: вызывается, когда Service Worker устанавливается.
// Кэширует все необходимые статические ресурсы.
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache)));
});

// Событие `fetch`: перехватывает все сетевые запросы.
self.addEventListener('fetch', event => {
  // Игнорируем запросы, которые не являются GET-запросами или не начинаются с 'http'
  if (event.request.method !== 'GET' || !event.request.url.startsWith('http')) return;

  // Обрабатываем запросы к API отдельно: сначала отправляем запрос в сеть,
  // и только если он не удался, отдаём кэшированную страницу
  if (/\/(api|googleapis|gstatic)\//.test(event.request.url)) {
    event.respondWith(fetch(event.request).catch(() => caches.match(OFFLINE_URL)));
    return;
  }

  // Для всех остальных ресурсов используем стратегию "кэш, а затем сеть".
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      const fetchPromise = fetch(event.request)
        .then(networkResponse => {
          // Проверяем, что ответ валиден перед кэшированием
          if (
            networkResponse &&
            networkResponse.status === 200 &&
            networkResponse.type === 'basic'
          ) {
            // Клонируем ответ, чтобы использовать его в кэше и вернуть в браузер
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseToCache));
          }
          return networkResponse;
        })
        .catch(() => cachedResponse || (event.request.mode === 'navigate' && caches.match(OFFLINE_URL)));

      // Возвращаем либо кэшированный ответ, либо ждём ответа из сети
      return cachedResponse || fetchPromise;
    })
  );
});

// Событие `activate`: вызывается после установки.
// Удаляет старые версии кэша, чтобы избежать конфликтов.
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))
    ).then(() => self.clients.claim())
  );
});