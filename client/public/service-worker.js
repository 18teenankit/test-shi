// Service Worker for Shivanshi Enterprises PWA - DEACTIVATED FOR DEBUGGING
const CACHE_NAME = 'shivanshi-cache-v1';

// Clear all caches
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          return caches.delete(cacheName);
        })
      );
    })
  );
});

// Activate immediately and don't cache anything
self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Don't cache, bypass cache and go straight to network
self.addEventListener('fetch', (event) => {
  event.respondWith(fetch(event.request));
}); 