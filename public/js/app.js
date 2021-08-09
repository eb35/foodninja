if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/worker.js")
    .then((registration) => console.log("service worker registered", registration))
    .catch((error) => console.log("service worker NOT registered", error));
}