import { useEffect } from 'react';

interface PerformanceMetrics {
  pageName: string;
  loadTime: number;
  renderTime: number;
  timestamp: number;
}

export function usePerformanceMonitoring(pageName: string) {
  useEffect(() => {
    // Only run in browser
    if (typeof window === 'undefined') return;

    const startTime = performance.now();

    // Measure page load time
    const handleWindowLoad = () => {
      const loadTime = performance.now() - startTime;
      const metrics: PerformanceMetrics = {
        pageName,
        loadTime,
        renderTime: loadTime,
        timestamp: Date.now(),
      };

      // Log to console in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`[Performance] ${pageName}:`, {
          loadTime: `${loadTime.toFixed(2)}ms`,
          ...metrics,
        });
      }

      // Send to analytics service (e.g., Google Analytics, Mixpanel)
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'page_load', {
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
export function useAnalyticsEvent(eventName: string, eventData?: Record<string, any>) {
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', eventName, eventData);
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
