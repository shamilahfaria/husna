/* Push display for the installed Home Screen app.
   The page registers this file only after a tap that asks for notification permission.
   With no sender, no push arrives, and the app keeps working. */
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('push', (event) => {
  let data = { title: 'Dua Book', body: '', tag: 'dua-book' };
  try {
    if (event.data) data = Object.assign(data, event.data.json());
  } catch (e) {}
  const title = String(data.title || 'Dua Book');
  const options = {
    body: String(data.body || ''),
    tag: String(data.tag || 'dua-book'),
    renotify: false,
    icon: 'icons/icon-192.png',
    badge: 'icons/icon-192.png',
    data: { url: data.url || './#pray' }
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || './#pray';
  event.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
    for (const client of list) {
      if (client.url.indexOf(self.location.origin) === 0 && 'focus' in client) {
        client.navigate(url);
        return client.focus();
      }
    }
    if (self.clients.openWindow) return self.clients.openWindow(url);
  }));
});
