// ── Push notification handler ─────────────────────────────────────────────
self.addEventListener('push', (event) => {
  let data = { title: 'SnowAI', body: 'Trade update', icon: '/logo192.png', url: '/' };

  try {
    if (event.data) {
      data = { ...data, ...JSON.parse(event.data.text()) };
    }
  } catch (e) {
    console.warn('Push parse error:', e);
  }

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body:    data.body,
      icon:    data.icon,
      badge:   '/logo192.png',
      vibrate: [200, 100, 200],
      tag:     'snowai-trade',       // replaces previous notification instead of stacking
      renotify: true,
      data:    { url: data.url },
    })
  );
});

// ── Notification click → open/focus the app ───────────────────────────────
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