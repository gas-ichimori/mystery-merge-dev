const CACHE_NAME = 'mystery-merge-v2';

// インストール時にコアファイルをキャッシュ
const CORE_ASSETS = [
  './index.html',
  './style.css',
  './game.js',
  './manifest.json',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(CORE_ASSETS))
  );
  self.skipWaiting();
});

// 古いキャッシュを削除
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// キャッシュファースト戦略（画像・音声など重いアセット向け）
// HTML/JS/CSS はネットワークを先に試してフォールバック
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // 外部リソース（Google Fonts など）はキャッシュするだけ
  const isExternal = url.origin !== self.location.origin;
  if (isExternal) {
    event.respondWith(
      caches.match(event.request).then(cached => {
        if (cached) return cached;
        return fetch(event.request).then(res => {
          if (!res || res.status !== 200) return res;
          const clone = res.clone();
          caches.open(CACHE_NAME).then(c => c.put(event.request, clone));
          return res;
        }).catch(() => cached);
      })
    );
    return;
  }

  const isImage = /\.(png|jpg|jpeg|gif|webp|svg)$/i.test(url.pathname);

  if (isImage) {
    // 画像: キャッシュファースト（初回アクセス時にキャッシュ）
    event.respondWith(
      caches.match(event.request).then(cached => {
        if (cached) return cached;
        return fetch(event.request).then(res => {
          if (!res || res.status !== 200) return res;
          const clone = res.clone();
          caches.open(CACHE_NAME).then(c => c.put(event.request, clone));
          return res;
        });
      })
    );
  } else {
    // HTML / JS / CSS: ネットワークファースト（更新を即反映）→ オフライン時はキャッシュ
    event.respondWith(
      fetch(event.request).then(res => {
        if (!res || res.status !== 200) return res;
        const clone = res.clone();
        caches.open(CACHE_NAME).then(c => c.put(event.request, clone));
        return res;
      }).catch(() => caches.match(event.request))
    );
  }
});
