var CACHE_NAME = 'my-site-cache-v1';
var urlsToCache = [
  '/service-worker.js',
  '/',
  '/fallback.json',
  '/bootstrap/css/bootstrap.css',
  '/js/app.js'
];

self.addEventListener('install', function(event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('install service worker in Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(cacheName){
          return cacheName != CACHE_NAME
        }).map(function(cacheName){
            return caches.delete(cacheName);
        })
      );
    })
  );
});

// self.addEventListener('activate', event => {
//   // delete any caches that aren't in expectedCaches
//   // which will get rid of static-v1
//   event.waitUntil(
//     caches.keys().then(keys => Promise.all(
//       keys.map(key => {
//         if (!expectedCaches.includes(key)) {
//           return caches.delete(key);
//         }
//       })
//     )).then(() => {
//       console.log('V2 now ready to handle fetches!');
//     })
//   );
// });

self.addEventListener('fetch', function (event) {

  let request = event.request;
  console.log(request);
  let url = new URL(request.url)


  if (url.origin === location.origin) {

    event.respondWith(
      caches.match(request).then(function (response) {
        return response || fetch(request);
      })
    );

  } else {
    event.respondWith(
      caches.open('product-cache').then(function (cache) {
        return fetch(request).then(function (liveResponse) {
          cache.put(request, liveResponse.clone())
          return liveResponse;
        }).catch(function () {
          return caches.match(request).then(function (response) {
            if (response) return response
            return caches.match('/fallback.json')
          })
        })
      })
    )
  }

  //pisahkan request api dan internal

});

