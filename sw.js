const CACHE_NAME = 'dontpage-v4';
const urlsToCache = [
  '/',
  '/index.html',
  '/404.html',
  '/app.js',
  'https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js',
  'https://www.gstatic.com/firebasejs/10.7.1/firebase-database-compat.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .catch(err => console.log('Falha ao instalar cache:', err))
  );
});

self.addEventListener('fetch', event => {
  // Para navegação (páginas), sempre tente buscar na rede primeiro
  if (event.request.mode === 'navigate') {
    return event.respondWith(
      fetch(event.request)
        .catch(() => {
          // Se falhar, retorne a página inicial para URLs desconhecidas
          if (event.request.url === new URL(event.request.url).origin + '/') {
            return caches.match('/index.html');
          }
          return caches.match('/404.html');
        })
    );
  }

  // Para outros recursos, use cache-first
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});