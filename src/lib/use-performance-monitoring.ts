import { useEffect } from 'react';

type Gtag = (...args: unknown[]) => void;
type AnalyticsWindow = typeof window & { gtag?: Gtag };

export function usePerformanceMonitoring(pageName: string) {
  useEffect(() => {
    // Only run in browser
    if (typeof window === 'undefined') return;

    const startTime = performance.now();

    // Measure page load time
    const handleWindowLoad = () => {
      const loadTime = performance.now() - startTime;
      // Log to console in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`[Performance] ${pageName}:`, {
          loadTimeMs: `${loadTime.toFixed(2)}ms`,
          renderTimeMs: `${loadTime.toFixed(2)}ms`,
        });
      }

      // Send to analytics service (e.g., Google Analytics, Mixpanel)
      const gtag = (typeof window !== 'undefined' && (window as AnalyticsWindow).gtag) || undefined;
      if (gtag) {
        gtag('event', 'page_load', {
          page_path: pageName,
          load_time: Math.round(loadTime),
        });
      }
    };

    if (document.readyState === 'complete') {
      handleWindowLoad();
    } else {
      window.addEventListener('load', handleWindowLoad);
      return () => window.removeEventListener('load', handleWindowLoad);
    }
  }, [pageName]);
}

// Hook to track custom events
export function useAnalyticsEvent(eventName: string, eventData?: Record<string, unknown>) {
  useEffect(() => {
    const gtag = (typeof window !== 'undefined' && (window as AnalyticsWindow).gtag) || undefined;
    if (gtag) {
      gtag('event', eventName, eventData);
    }

    if (process.env.NODE_ENV === 'development') {
      console.log(`[Analytics Event] ${eventName}:`, eventData);
    }
  }, [eventName, eventData]);
}

// Hook to track component render times
export function useRenderTimeTracking(componentName: string) {
  useEffect(() => {
    const renderTime = performance.now();

    return () => {
      const unmountTime = performance.now();
      const lifespan = unmountTime - renderTime;

      if (process.env.NODE_ENV === 'development') {
        console.log(
          `[Render Time] ${componentName} mounted for ${lifespan.toFixed(2)}ms`
        );
      }
    };
  }, [componentName]);
}
