self.addEventListener('push', (event) => {
  let data = {
    title: 'SnowAI',
    body:  'Trade update',
    icon:  '/icon-192.png',
    url:   '/',
    tag:   'snowai-trade',
  };

  try {
    if (event.data) data = { ...data, ...JSON.parse(event.data.text()) };
  } catch (e) {}

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body:     data.body,
      icon:     data.icon,
      badge:    '/logo192.png',
      vibrate:  [200, 100, 200],
      tag:      data.tag,       // use the tag from payload
      renotify: true,
      data:     { url: data.url },
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          return client.focus();
        }
      }
      return clients.openWindow(event.notification.data?.url || '/');
    })
  );
});