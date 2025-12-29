import { useEffect } from 'react';

export function useServiceWorker() {
  useEffect(() => {
    // Only register in browser and production
    if (typeof window === 'undefined') return;
    if (process.env.NODE_ENV !== 'production') return;

    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((registration) => {
            console.log('Service Worker registered:', registration);
          })
          .catch((error) => {
            console.error('Service Worker registration failed:', error);
          });
      });
    }
  }, []);
}
