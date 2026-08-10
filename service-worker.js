const CACHE_NAME = "habitflow-v1";

const urlsToCache = [
  "index.html",
  "dashboard.html",
  "analytics.html",
  "settings.html",
  "css/base/reset.css",
  "css/base/root.css",
  "css/global.css",
  "css/components/buttons.css",
  "css/components/navigation.css",
  "css/pages/dashboard.css",
  "css/pages/stats.css",
  "js/core/storage.js",
  "js/shared/habit-utils.js",
  "js/shared/navigation.js",
  "js/dashboard/dashboard-data.js",
  "img/streakasaur-hero.png",
];
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});



self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  if (url.pathname.startsWith("/api/")) {
    event.respondWith(fetch(event.request));
    return;
  }

 