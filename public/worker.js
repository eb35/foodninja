const staticCacheName = "site-static-v3.5";
const dynamicCacheName = "site-dynamic-v3.5";
const dynamicCacheLimit = 15;
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
  "https://fonts.gstatic.com/s/materialicons/v97/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2",
  "/pages/fallback.html"
];

const limitCacheSize = (name, size) => {
  caches.open(name).then(cache => {
    cache.keys().then(keys => {
      if (keys.length > size) {
        cache.delete(keys[0]).then(limitCacheSize(name, size));
      }
    });
  });
};

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
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(keys
        .filter(key => key !== staticCacheName && key !== dynamicCacheName)
        .map(key => caches.delete(key))
      );
    })
  );
});

// fetch event
self.addEventListener("fetch", event => {
  if (event.request.url.indexOf("firestore.googleapis.com") === -1) {
    event.respondWith(
      caches.match(event.request).then(cachedresponse => {
        // if the resource exists in ANY of the caches, it is returned
        // if the resource doesn't exist in ANY of the caches, then it is fetched from the server
        return cachedresponse || fetch(event.request).then(fetchresponse => {
          // before we return the fetched response, we add it to the dynamic cache
          return caches.open(dynamicCacheName).then(cache => {
            // we store the resource by url and clone the response, because once the response is used up, it doesn't exist anymore
            cache.put(event.request.url, fetchresponse.clone()).then(() => {
              limitCacheSize(dynamicCacheName, dynamicCacheLimit);
            });
            return fetchresponse;
          })
        });
      }).catch(() => {
        if (event.request.url.indexOf(".html") > -1) {
          return caches.match("/pages/fallback.html")
        }
      })
    );
  }
});

self.addEventListener("push", event => {
  console.log("push", event.data.text());
});