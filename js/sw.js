const CACHE_NAME = 'dontpage-v1';
const ASSETS = [
    '/',
    '/index.html',
    '/js/main.js',
    '/css/main.css'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(ASSETS))
    );
});

self.addEventListener('fetch', (event) => {
    // Para todas as requisições de navegação, retorne o index.html
    if (event.request.mode === 'navigate') {
        event.respondWith(caches.match('/index.html'));
        return;
    }
    
    // Para outros recursos, tente a rede primeiro, depois o cache
    event.respondWith(
        fetch(event.request)
            .then((response) => {
                // Faz cache da resposta
                const responseToCache = response.clone();
                caches.open(CACHE_NAME)
                    .then((cache) => cache.put(event.request, responseToCache));
                return response;
            })
            .catch(() => {
                return caches.match(event.request);
            })
    );
});