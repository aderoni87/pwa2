const CACHE_NAME = "FootballTeamApps";
let urlsToCache = [
  "/",
  "/nav.html",
  "/index.html",
  "/pages/group.html",
  "/pages/match.html",
  "/pages/team.html",
  "/pages/savedMatch.html",
  "/pages/savedTeam.html",
  "/css/materialize.min.css",
  "/js/materialize.min.js",
  "/manifest.json",
  "/js/nav.js",
  "/js/api.js",
  "/js/idb.js",
  "/js/db.js",
  "/js/script.js",
  "/asset/icon512.png",
  "/asset/icon192.png",
  "/asset/icon.png",
  "/js/pushSW.js",
  "/push.js"
];

self.addEventListener("install", function (event) {
  event.waitUntil(
      caches.open(CACHE_NAME).then(function (cache) {
          return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener("fetch", function (event) {
    let base_url = "https://api.football-data.org/v2/";
    if (event.request.url.indexOf(base_url) > -1) {
        event.respondWith(
            caches.open(CACHE_NAME).then(function (cache) {
                return fetch(event.request).then(function (response) {
                    cache.put(event.request.url, response.clone());
                    return response;
                })
            })
        );
    } else {
        event.respondWith(
            caches.match(event.request, {
                ignoreSearch: true
            }).then(function (response) {
                return response || fetch(event.request);
            })
        )
    }
});


//Event Delete Cache
self.addEventListener("activate", function (event) {
  event.waitUntil(
      caches.keys().then(function (cacheNames) {
          return Promise.all(
              cacheNames.map(function (cacheName) {
                  if (cacheName != CACHE_NAME) {
                      console.log("ServiceWorker: Cache " + cacheName + " Dihapus");
                      return caches.delete(cacheName);
                  }
              })
          );
      })
  );
});


//Push Notification
self.addEventListener('push', function (event) {
  let body;

  if (event.data) {
      body = event.data.text();
  } else {
      body = 'Push Dengan Message Berhasil';
  }

  let options = {
      body: body,
      icon: 'asset/icon.png',
      vibrate: [100, 50, 100],
      data: {
          dataOfArrival: Date.now(),
          primaryKey: 1
      }
  };
  event.waitUntil(
      self.registration.showNotification('Push Notification', options)
  );

});