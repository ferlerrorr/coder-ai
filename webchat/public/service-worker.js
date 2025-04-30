const CACHE_NAME = "my-ai-app-cache-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/style.css",
  "/atom-one-dark.min.css",
  "/highlight.min.js",
  "/logo-coder.png", // Cache the logo image
  "/manifest.json", // Cache the manifest
  "/service-worker.js", // Cache the service worker itself
];

self.addEventListener("install", (event) => {
  // Pre-cache assets
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("activate", (event) => {
  // Clean up old caches
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Return cached response if available, else fetch from network
      return cachedResponse || fetch(event.request);
    })
  );
});
