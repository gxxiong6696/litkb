/* 文献知识库 Service Worker — cache-first, 版本与 APP_VERSION/versionCode 同步 */
const CACHE_NAME = "litkb-v17-20261003-1520";
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./vendor/jszip.min.js",
  "./vendor/pdfjs/pdf.min.js",
  "./vendor/pdfjs/pdf.worker.min.js",
  "./vendor/pptxgen.bundle.js",
  "./icons/icon-192.png",
  "./icons/icon-512.png"
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE_NAME).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then((hit) => hit || fetch(e.request))
  );
});
