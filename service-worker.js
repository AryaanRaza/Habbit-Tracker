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