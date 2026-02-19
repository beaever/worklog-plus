/**
 * 성능 최적화 유틸리티
 *
 * @description
 * 애플리케이션 성능 최적화를 위한 유틸리티 함수들을 제공합니다.
 * 메모이제이션, 디바운싱, 쓰로틀링 등의 기능을 포함합니다.
 */

import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * 디바운스 훅
 *
 * @description
 * 입력 값의 변경을 지연시켜 불필요한 렌더링과 API 호출을 방지합니다.
 * 검색 입력, 자동완성 등에 사용됩니다.
 *
 * **동작 방식:**
 * - 값이 변경되면 타이머를 시작
 * - 지정된 delay 시간 내에 다시 값이 변경되면 타이머를 리셋
 * - delay 시간이 경과하면 최종 값을 반환
 *
 * @template T - 디바운스할 값의 타입
 * @param {T} value - 디바운스할 값
 * @param {number} delay - 지연 시간 (밀리초)
 * @returns {T} 디바운스된 값
 *
 * @example
 * const [searchTerm, setSearchTerm] = useState('');
 * const debouncedSearchTerm = useDebounce(searchTerm, 500);
 *
 * useEffect(() => {
 *   // API 호출은 사용자가 타이핑을 멈춘 후 500ms 후에만 실행됨
 *   fetchSearchResults(debouncedSearchTerm);
 * }, [debouncedSearchTerm]);
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // 타이머 설정
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // 클린업: 값이 변경되면 이전 타이머를 취소
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * 쓰로틀 훅
 *
 * @description
 * 함수 호출 빈도를 제한하여 성능을 최적화합니다.
 * 스크롤 이벤트, 리사이즈 이벤트 등에 사용됩니다.
 *
 * **동작 방식:**
 * - 함수가 호출되면 즉시 실행
 * - 지정된 limit 시간 동안은 추가 호출을 무시
 * - limit 시간이 경과하면 다시 호출 가능
 *
 * @template T - 함수 타입
 * @param {T} callback - 쓰로틀할 함수
 * @param {number} limit - 제한 시간 (밀리초)
 * @returns {T} 쓰로틀된 함수
 *
 * @example
 * const handleScroll = useThrottle(() => {
 *   console.log('Scrolled!');
 * }, 200);
 *
 * useEffect(() => {
 *   window.addEventListener('scroll', handleScroll);
 *   return () => window.removeEventListener('scroll', handleScroll);
 * }, [handleScroll]);
 */
export function useThrottle<T extends (...args: never[]) => unknown>(
  callback: T,
  limit: number = 200,
): T {
  const inThrottle = useRef(false);
  const lastRun = useRef(Date.now());

  return useCallback(
    ((...args: Parameters<T>) => {
      if (!inThrottle.current) {
        callback(...args);
        inThrottle.current = true;
        lastRun.current = Date.now();

        setTimeout(() => {
          inThrottle.current = false;
        }, limit);
      }
    }) as T,
    [callback, limit],
  );
}

/**
 * 교차 관찰자 훅 (Intersection Observer)
 *
 * @description
 * 요소가 뷰포트에 보이는지 감지합니다.
 * 무한 스크롤, 지연 로딩 등에 사용됩니다.
 *
 * **사용 사례:**
 * - 무한 스크롤 구현
 * - 이미지 지연 로딩
 * - 애니메이션 트리거
 * - 광고 노출 추적
 *
 * @param {IntersectionObserverInit} options - Intersection Observer 옵션
 * @returns {[React.RefCallback<Element>, boolean]} [ref, isIntersecting]
 *
 * @example
 * const [ref, isVisible] = useIntersectionObserver({
 *   threshold: 0.5,
 * });
 *
 * return (
 *   <div ref={ref}>
 *     {isVisible && <ExpensiveComponent />}
 *   </div>
 * );
 */
export function useIntersectionObserver(
  options: IntersectionObserverInit = {},
): [React.RefCallback<Element>, boolean] {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [element, setElement] = useState<Element | null>(null);

  useEffect(() => {
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, options);

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [element, options]);

  return [setElement, isIntersecting];
}

/**
 * 메모이제이션된 비동기 함수 훅
 *
 * @description
 * 비동기 함수의 결과를 캐싱하여 중복 호출을 방지합니다.
 *
 * @template T - 반환 타입
 * @param {() => Promise<T>} asyncFn - 비동기 함수
 * @param {any[]} deps - 의존성 배열
 * @returns {{ data: T | null; loading: boolean; error: Error | null }}
 *
 * @example
 * const { data, loading, error } = useAsyncMemo(
 *   async () => {
 *     const response = await fetch('/api/data');
 *     return response.json();
 *   },
 *   [userId]
 * );
 */
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
      .then((result) => {
        if (!cancelled) {
          setData(result);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, loading, error };
}

/**
 * 이전 값 추적 훅
 *
 * @description
 * 컴포넌트의 이전 렌더링에서의 값을 추적합니다.
 * 값의 변화를 감지하고 비교할 때 유용합니다.
 *
 * @template T - 값의 타입
 * @param {T} value - 추적할 값
 * @returns {T | undefined} 이전 값
 *
 * @example
 * const [count, setCount] = useState(0);
 * const prevCount = usePrevious(count);
 *
 * console.log(`Count changed from ${prevCount} to ${count}`);
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

/**
 * 마운트 상태 추적 훅
 *
 * @description
 * 컴포넌트가 마운트되어 있는지 추적합니다.
 * 비동기 작업 후 setState 호출 시 메모리 누수를 방지합니다.
 *
 * @returns {React.MutableRefObject<boolean>} 마운트 상태 ref
 *
 * @example
 * const isMounted = useIsMounted();
 *
 * const fetchData = async () => {
 *   const data = await api.getData();
 *   if (isMounted.current) {
 *     setData(data);
 *   }
 * };
 */
export function useIsMounted(): React.MutableRefObject<boolean> {
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  return isMounted;
}

/**
 * 윈도우 크기 추적 훅
 *
 * @description
 * 윈도우 크기 변화를 추적합니다.
 * 반응형 UI 구현에 사용됩니다.
 *
 * @returns {{ width: number; height: number }} 윈도우 크기
 *
 * @example
 * const { width, height } = useWindowSize();
 * const isMobile = width < 768;
 */
export function useWindowSize(): { width: number; height: number } {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    // 쓰로틀링 적용
    let timeoutId: NodeJS.Timeout;
    const throttledResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleResize, 150);
    };

    window.addEventListener('resize', throttledResize);
    return () => {
      window.removeEventListener('resize', throttledResize);
      clearTimeout(timeoutId);
    };
  }, []);

  return windowSize;
}

/**
 * 로컬 스토리지 동기화 훅
 *
 * @description
 * 상태를 로컬 스토리지와 동기화합니다.
 * 페이지 새로고침 후에도 상태가 유지됩니다.
 *
 * @template T - 값의 타입
 * @param {string} key - 로컬 스토리지 키
 * @param {T} initialValue - 초기값
 * @returns {[T, (value: T) => void]} [값, 설정 함수]
 *
 * @example
 * const [theme, setTheme] = useLocalStorage('theme', 'light');
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T) => {
      try {
        setStoredValue(value);
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(value));
        }
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key],
  );

  return [storedValue, setValue];
}
