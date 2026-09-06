const CACHE_NAME = "app_cache_v1";

const urlsToCache = [

  "/",
  "/index.html",
  "/login.html",
  "/inicio.html",
  "/admin.html",

  "/manifest.json",

  "/imagen/app_icon_xxxhdpi.png",
  "/imagen/splash_icon_xxxhdpi.png"

];


// INSTALL
self.addEventListener("install", event => {

  event.waitUntil(

    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())

  );

});


// ACTIVATE
self.addEventListener("activate", event => {

  event.waitUntil(

    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )

  );

  self.clients.claim();

});


// FETCH
self.addEventListener("fetch", event => {

  event.respondWith(

    caches.match(event.request)
      .then(response => {

        return response || fetch(event.request)
          .catch(() => caches.match("/index.html"));

      })

  );

});