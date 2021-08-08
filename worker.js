const staticCacheName = "site-static";
const assets = [
  "/",
  "/index.html",
  "/js/app.js",
  "/js/ui.js",
  "/js/materialize.min.js",
  "/css/styles.css",
  "/css/materialize.min.css",
  "/img/dish.png",
  "https://fonts.googleapis.com/icon?family=Material+Icons",
  "https://fonts.gstatic.com/s/materialicons/v97/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2"
];

// install event
self.addEventListener("install", event => {
  // waituntil keeps the worker running until it's done caching (you don't want it to quit prematurely)
  event.waitUntil(
    // this opens the existing or creates a new cache with the provided name
    caches.open(staticCacheName).then(cache => {
      console.log("caching shell assets");
      // adds all of the files listed in the array to the cache
      cache.addAll(assets);
    })
  );
});

// activate event
self.addEventListener("activate", event => {
  //console.log("service worker has been activated");
});

// fetch event
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(cachedresponse => {
      return cachedresponse || fetch(event.request);
    })
  );
});