import { useCallback, useEffect, useRef, useState } from 'react';

export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

export function useThrottle<T extends (...args: never[]) => unknown>(callback: T, limit: number = 200): T {
  const inThrottle = useRef(false);

  return useCallback(
    ((...args: Parameters<T>) => {
      if (!inThrottle.current) {
        callback(...args);
        inThrottle.current = true;
        setTimeout(() => { inThrottle.current = false; }, limit);
      }
    }) as T,
    [callback, limit],
  );
}

export function useIntersectionObserver(
  options: IntersectionObserverInit = {},
): [React.RefCallback<Element>, boolean] {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [element, setElement] = useState<Element | null>(null);

  useEffect(() => {
    if (!element) return;
    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0];
      if (entry) setIsIntersecting(entry.isIntersecting);
    }, options);
    observer.observe(element);
    return () => observer.disconnect();
  }, [element, options]);

  return [setElement, isIntersecting];
}

export function useAsyncMemo<T>(
  asyncFn: () => Promise<T>,
  deps: React.DependencyList,
): { data: T | null; loading: boolean; error: Error | null } {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    asyncFn()
      .then((result) => { if (!cancelled) { setData(result); setLoading(false); } })
      .catch((err) => { if (!cancelled) { setError(err); setLoading(false); } });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, loading, error };
}

export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined);
  useEffect(() => { ref.current = value; }, [value]);
  return ref.current;
}

export function useIsMounted(): React.MutableRefObject<boolean> {
  const isMounted = useRef(true);
  useEffect(() => () => { isMounted.current = false; }, []);
  return isMounted;
}

export function useWindowSize(): { width: number; height: number } {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let timeoutId: NodeJS.Timeout;
    const throttledResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setWindowSize({ width: window.innerWidth, height: window.innerHeight });
      }, 150);
    };

    window.addEventListener('resize', throttledResize);
    return () => { window.removeEventListener('resize', throttledResize); clearTimeout(timeoutId); };
  }, []);

  return windowSize;
}

// 민감하지 않은 UI 상태 전용 (토큰 저장 금지)
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback((value: T) => {
    try {
      setStoredValue(value);
      if (typeof window !== 'undefined') window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // 스토리지 쓰기 실패 무시
    }
  }, [key]);

  return [storedValue, setValue];
}
