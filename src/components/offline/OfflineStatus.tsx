'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';

type ServiceWorkerState = 'unsupported' | 'registering' | 'ready' | 'failed' | 'development';

function subscribeToOnlineStatus(callback: () => void): () => void {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);

  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}

function getOnlineStatus(): boolean {
  return window.navigator.onLine;
}

function getServerOnlineStatus(): boolean {
  return true;
}

export function OfflineStatus() {
  const online = useSyncExternalStore(subscribeToOnlineStatus, getOnlineStatus, getServerOnlineStatus);
  const [serviceWorkerState, setServiceWorkerState] = useState<ServiceWorkerState>(process.env.NODE_ENV === 'production' ? 'registering' : 'development');

  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      return undefined;
    }

    if (!('serviceWorker' in navigator)) {
      const timeoutId = window.setTimeout(() => setServiceWorkerState('unsupported'), 0);
      return () => window.clearTimeout(timeoutId);
    }

    let cancelled = false;

    navigator.serviceWorker.register('/sw.js', { scope: '/' })
      .then(() => navigator.serviceWorker.ready)
      .then((registration) => {
        if (cancelled) return;
        setServiceWorkerState('ready');
        registration.active?.postMessage({ type: 'CACHE_CURRENT_DOCUMENT', url: window.location.href });
      })
      .catch(() => {
        if (!cancelled) setServiceWorkerState('failed');
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const message = !online
    ? 'Offline — cached topics and local study state remain available.'
    : serviceWorkerState === 'ready'
      ? 'Online — offline cache ready.'
      : serviceWorkerState === 'development'
        ? 'Online — offline cache is enabled in production builds.'
        : serviceWorkerState === 'unsupported' || serviceWorkerState === 'failed'
          ? 'Online — offline cache unavailable in this browser.'
          : 'Online — preparing offline cache.';

  return (
    <div className={`offline-status${online ? ' is-online' : ' is-offline'}`} role="status" aria-live="polite" aria-atomic="true">
      <span className="offline-status-dot" aria-hidden="true" />
      {message}
    </div>
  );
}
