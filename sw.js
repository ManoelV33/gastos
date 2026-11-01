const CACHE = "gastos-v17";
const FILES = ["./", "./index.html", "./manifest.webmanifest", "./icon-180-v10.png", "./icon-192-v10.png", "./icon-512-v10.png",
  "./fonts/manrope-latin-400-normal.woff2", "./fonts/manrope-latin-600-normal.woff2", "./fonts/manrope-latin-700-normal.woff2"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES))); self.skipWaiting(); });
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return;
  // com internet: busca a versão mais nova; sem internet: usa a cópia guardada
  e.respondWith(fetch(e.request, { cache: "no-cache" }).then(r => { const c = r.clone(); caches.open(CACHE).then(k => k.put(e.request, c)); return r; })
    .catch(() => caches.match(e.request).then(r => r || caches.match("./index.html"))));
});
