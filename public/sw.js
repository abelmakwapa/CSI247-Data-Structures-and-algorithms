/*
 * Algo Atlas offline cache.
 *
 * Documents use network-first so an online visit always gets fresh MDX output,
 * while the last successful response remains available offline. Static assets
 * use cache-first after their first request. Search/API requests are deliberately
 * left alone so Fumadocs search and local navigation keep their normal behavior.
 * Bump CACHE_VERSION when the cache contract changes.
 */
const CACHE_VERSION = 'v2';
const DOCUMENT_CACHE = `algo-atlas-documents-${CACHE_VERSION}`;
const STATIC_CACHE = `algo-atlas-static-${CACHE_VERSION}`;
const FALLBACK_CACHE = `algo-atlas-fallback-${CACHE_VERSION}`;
const OFFLINE_FALLBACK = '/offline.html';
const SHELL_ROUTES = ['/', '/review', '/docs/data-structures/arrays', OFFLINE_FALLBACK];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(FALLBACK_CACHE);

    await Promise.all(SHELL_ROUTES.map(async (route) => {
      try {
        const response = await fetch(route, { cache: 'no-store' });
        if (response.ok) await cache.put(route, response);
      } catch {
        // A failed install fetch can be retried by the next visit.
      }
    }));

    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const retainedCaches = new Set([DOCUMENT_CACHE, STATIC_CACHE, FALLBACK_CACHE]);
    const cacheNames = await caches.keys();

    await Promise.all(cacheNames
      .filter((name) => name.startsWith('algo-atlas-') && !retainedCaches.has(name))
      .map((name) => caches.delete(name)));

    await self.clients.claim();
  })());
});

function isSameOrigin(url) {
  return url.origin === self.location.origin;
}

function isStaticAsset(request, url) {
  return request.destination === 'script'
    || request.destination === 'style'
    || request.destination === 'font'
    || request.destination === 'image'
    || url.pathname.endsWith('.svg');
}

async function cacheCurrentDocument(request) {
  const url = new URL(request.url);
  if (!isSameOrigin(url) || url.pathname.startsWith('/api/')) return;

  const response = await fetch(request, { cache: 'no-store' });
  if (response.ok && response.type === 'basic') {
    const cache = await caches.open(DOCUMENT_CACHE);
    await cache.put(request, response.clone());
  }
}

async function networkFirstDocument(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(DOCUMENT_CACHE);
      await cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request, { ignoreSearch: true });
    return cached || caches.match(OFFLINE_FALLBACK) || new Response(
      'Algo Atlas is offline. This route has not been cached yet.',
      { status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
    );
  }
}

async function cacheFirstAsset(request) {
  const cached = await caches.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(STATIC_CACHE);
      await cache.put(request, response.clone());
    }
    return response;
  } catch {
    return new Response('', { status: 504, statusText: 'Offline asset unavailable' });
  }
}

self.addEventListener('message', (event) => {
  if (event.data?.type !== 'CACHE_CURRENT_DOCUMENT' || typeof event.data.url !== 'string') return;
  event.waitUntil(cacheCurrentDocument(new Request(event.data.url, { credentials: 'same-origin' })));
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (!isSameOrigin(url)) return;
  if (url.pathname === '/sw.js') return;

  if (request.mode === 'navigate') {
    event.respondWith(networkFirstDocument(request));
  } else if (isStaticAsset(request, url)) {
    event.respondWith(cacheFirstAsset(request));
  }
});
