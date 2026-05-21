import { useState, useEffect, useCallback } from 'react';

const BASE = 'https://backend-production-c0ab.up.railway.app';

// Convert the VAPID public key from base64url to Uint8Array
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  return new Uint8Array([...rawData].map(c => c.charCodeAt(0)));
}

export function usePushNotifications() {
  const [isSupported, setIsSupported]   = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading]       = useState(false);
  const [permission, setPermission]     = useState('default');
  const [error, setError]               = useState(null);

  useEffect(() => {
    const supported = 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
    setIsSupported(supported);
    if (supported) {
      setPermission(Notification.permission);
      checkExistingSubscription();
    }
  }, []);

  const checkExistingSubscription = async () => {
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      setIsSubscribed(!!sub);
    } catch (e) {
      console.warn('SW check error:', e);
    }
  };

  const subscribe = useCallback(async () => {
    if (!isSupported) { setError('Push not supported on this device'); return; }
    setIsLoading(true);
    setError(null);

    try {
      // 1. Ask permission
      const perm = await Notification.requestPermission();
      setPermission(perm);
      if (perm !== 'granted') {
        setError('Notification permission denied');
        setIsLoading(false);
        return;
      }

      // 2. Get VAPID public key from backend
      const keyRes = await fetch(`${BASE}/snowai-vapid-public-key/`);
      const { public_key } = await keyRes.json();

      // 3. Subscribe via push manager
      const reg = await navigator.serviceWorker.ready;
      const subscription = await reg.pushManager.subscribe({
        userVisibleOnly:      true,
        applicationServerKey: urlBase64ToUint8Array(public_key),
      });

      // 4. Send subscription to backend
      const subJson = subscription.toJSON();
      await fetch(`${BASE}/snowai-push-subscribe/`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(subJson),
      });

      setIsSubscribed(true);
    } catch (e) {
      setError(e.message || 'Subscription failed');
      console.error('Push subscribe error:', e);
    } finally {
      setIsLoading(false);
    }
  }, [isSupported]);

  const unsubscribe = useCallback(async () => {
    setIsLoading(true);
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      if (sub) {
        await fetch(`${BASE}/snowai-push-unsubscribe/`, {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify({ endpoint: sub.endpoint }),
        });
        await sub.unsubscribe();
      }
      setIsSubscribed(false);
    } catch (e) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { isSupported, isSubscribed, isLoading, permission, error, subscribe, unsubscribe };
}