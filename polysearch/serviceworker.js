// Use a cacheName for cache versioning
var cacheName = 'v1:static';

// During the installation phase, you'll usually want to cache static assets.
self.addEventListener('install', function(e) {
    // Once the service worker is installed, go ahead and fetch the resources to make this work offline.
    e.waitUntil(
        caches.open(cacheName).then(function(cache) {
            return cache.addAll([
                './',
                './index.html',
                './history.html',
                './privacy.html',
                './faq.html',
                './main.js',
                './css/index.css',
                './css/history.css',
                './css/faq.css',
                './css/privacy.css',
                './img/favicon.ico',
                './js/index.js',
                './js/history.js',
                './js/darkmode.js',
                './js/courscommuns.js',
                './js/pcem1.js',
                './js/pcem1_titres.js',
                './js/pcem2.js',
                './js/pcem2_titres.js',
                './js/dcem1.js',
                './js/dcem1_titres.js',
                './js/dcem2.js',
                './js/dcem2_titres.js',
                './js/dcem3.js',
                './js/dcem3_titres.js',
            ]).then(function() {
                self.skipWaiting();
            });
        })
    );
});

// when the browser fetches a URL…
self.addEventListener('fetch', function(event) {
    // … either respond with the cached object or go ahead and fetch the actual URL
    event.respondWith(
        caches.match(event.request).then(function(response) {
            if (response) {
                // retrieve from cache
                return response;
            }
            // fetch as normal
            return fetch(event.request);
        })
    );
});
