// Service Worker for offline support and caching
const CACHE_NAME = 'teckstart-v1';
const urlsToCache = [
  '/',
  '/offline.html',
];

// Install event
self.addEventListener('install', (event: any) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache).catch(() => {
        // Gracefully handle if some URLs fail to cache
        return cache.addAll(['/']);
      });
    })
  );
  self.skipWaiting();
});

// Activate event
self.addEventListener('activate', (event: any) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - Network first, fall back to cache
self.addEventListener('fetch', (event: any) => {
  const { request } = event;

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip non-http(s) requests
  if (!request.url.startsWith('http')) {
    return;
  }

  event.respondWith(
    fetch(request)
      .then((response) => {
        // Cache successful responses for API calls
        if (
          response.ok &&
          (request.url.includes('/api/') || request.url.includes('/static/'))
        ) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // If network request fails, try cache
        return caches
          .match(request)
          .then((response) => {
            return (
              response ||
              caches
                .match('/offline.html')
                .then((offlineResponse) => offlineResponse as any)
            );
          });
      })
  );
});
