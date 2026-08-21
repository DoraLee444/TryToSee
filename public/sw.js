// 極簡 service worker:只負責讓網站可以「加入主畫面」、離線時能開啟殼層畫面。
// /api/ 開頭的請求(讀寫手札資料)一律直接走網路,不快取,確保資料永遠是最新的。
const CACHE_NAME = 'travel-journal-shell-v1';
const SHELL_URLS = [
  '/',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL_URLS)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // 資料 API 一律直接打網路,不要碰快取,避免看到過期資料
  if (url.pathname.startsWith('/api/')) return;
  if (event.request.method !== 'GET') return;

  // 網頁本身:網路優先,離線時退回快取(確保線上永遠拿到最新版)
  event.respondWith(
    fetch(event.request)
      .then((res) => {
        const resClone = res.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, resClone)).catch(() => {});
        return res;
      })
      .catch(() => caches.match(event.request))
  );
});
