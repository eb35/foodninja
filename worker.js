// install event
self.addEventListener("install", event => {
  console.log("service worker has been installed!");
});

// activate event
self.addEventListener("activate", event => {
  console.log("service worker has been activated");
});

// fetch event
self.addEventListener("fetch", event => {
  console.log("fetch event", event);
});