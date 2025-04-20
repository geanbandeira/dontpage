const CACHE_NAME = 'dontpage-v2';
const ASSETS = [
    '/',
    '/index.html',
    '/css/main.css',
    '/js/main.js',
    '/manifest.json',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/styles/base16/dracula.min.css',
    'https://cdn.jsdelivr.net/npm/@phosphor-icons/web@2.0.3/phosphor.css',
    'https://cdn.jsdelivr.net/npm/marked@5.0.2/marked.min.js'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(ASSETS))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        return caches.delete(cache);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') return;
    
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          // Retorna do cache se encontrado
          if (response) {
            return response;
          }
          
          // Para rotas de página, retorna o index.html
          if (event.request.mode === 'navigate') {
            return caches.match('/index.html');
          }
          
          // Para outros recursos, tenta buscar da rede
          return fetch(event.request).then((response) => {
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });
            
            return response;
          });
        })
    );
  });