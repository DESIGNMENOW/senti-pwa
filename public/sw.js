const CACHE_NAME = 'senti-app-v1'

const APP_SHELL = [
  '/',
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      cache.addAll(APP_SHELL),
    ),
  )

  // Neue Version beim nächsten Reload aktivieren.
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      // Alte Caches entfernen.
      caches.keys().then((keys) =>
        Promise.all(
          keys
            .filter(
              (key) => key !== CACHE_NAME,
            )
            .map((key) =>
              caches.delete(key),
            ),
        ),
      ),

      // Sofort Kontrolle über die geöffneten
      // Seiten übernehmen.
      self.clients.claim(),
    ]),
  )
})

self.addEventListener('fetch', (event) => {
  const request = event.request

  // Nur GET-Anfragen behandeln.
  if (request.method !== 'GET') {
    return
  }

  const url = new URL(request.url)

  // Fremde Origins niemals cachen.
  if (url.origin !== self.location.origin) {
    return
  }

  /*
   * PocketBase/API:
   *
   * Netzwerk bevorzugen und nicht aus dem
   * Service-Worker-Cache bedienen.
   */
  if (
    url.pathname.startsWith('/api/') ||
    url.pathname.startsWith('/_api/')
  ) {
    event.respondWith(
      fetch(request, {
        cache: 'no-store',
      }),
    )

    return
  }

  /*
   * Alle normalen App-Requests:
   *
   * Netzwerk zuerst.
   *
   * Falls offline, Cache verwenden.
   */
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (
          response.ok &&
          response.type === 'basic'
        ) {
          const responseClone =
            response.clone()

          caches
            .open(CACHE_NAME)
            .then((cache) =>
              cache.put(
                request,
                responseClone,
              ),
            )
        }

        return response
      })
      .catch(() =>
        caches.match(request).then(
          (cached) =>
            cached ??
            caches.match('/'),
        ),
      ),
  )
})
