import { useEffect, useState, useCallback } from 'react';

// Simple in-memory cache for deduplicating requests
const requestCache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export function useDedupedFetch<T>(url: string, options?: RequestInit) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    // Check cache first
    const cached = requestCache.get(url);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      setData(cached.data as T);
      setLoading(false);
      return;
    }

    let isMounted = true;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(url, {
        credentials: 'include',
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const json = await response.json();

      if (isMounted) {
        // Update cache
        requestCache.set(url, { data: json, timestamp: Date.now() });
        setData(json);
      }
    } catch (err) {
      if (isMounted) {
        const error = err instanceof Error ? err : new Error('Unknown error');
        setError(error);
        console.error(`Failed to fetch ${url}:`, error);
      }
    } finally {
      if (isMounted) {
        setLoading(false);
      }
    }

    return () => {
      isMounted = false;
    };
  }, [url, options]);

  useEffect(() => {
    const cleanup = fetchData();
    return () => {
      cleanup.then(fn => fn && fn());
    };
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}
