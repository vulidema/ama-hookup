// Performance monitoring and optimization utilities

/**
 * Lazy load images with intersection observer
 */
export function observeImageLoading(
  img: HTMLImageElement,
  onVisible: () => void
) {
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      onVisible();
      observer.unobserve(img);
    }
  });
  observer.observe(img);
}

/**
 * Debounce function for expensive operations
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function for frequent events
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return function (this: any, ...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Measure performance of async operations
 */
export async function measurePerformance<T>(
  name: string,
  fn: () => Promise<T>
): Promise<T> {
  const start = performance.now();
  try {
    const result = await fn();
    const duration = performance.now() - start;
    console.log(`[Performance] ${name} took ${duration.toFixed(2)}ms`);
    return result;
  } catch (error) {
    const duration = performance.now() - start;
    console.error(`[Performance] ${name} failed after ${duration.toFixed(2)}ms`);
    throw error;
  }
}

/**
 * Cache with TTL (time-to-live)
 */
export class TTLCache<T> {
  private cache: Map<string, { value: T; expires: number }> = new Map();

  set(key: string, value: T, ttlMs: number) {
    this.cache.set(key, {
      value,
      expires: Date.now() + ttlMs,
    });
  }

  get(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;
    if (Date.now() > item.expires) {
      this.cache.delete(key);
      return null;
    }
    return item.value;
  }

  clear() {
    this.cache.clear();
  }
}

/**
 * Request deduplication
 */
export class RequestDeduplicator {
  private pending: Map<string, Promise<any>> = new Map();

  async execute<T>(
    key: string,
    fn: () => Promise<T>
  ): Promise<T> {
    if (this.pending.has(key)) {
      return this.pending.get(key)!;
    }

    const promise = fn();
    this.pending.set(key, promise);

    try {
      return await promise;
    } finally {
      this.pending.delete(key);
    }
  }
}

/**
 * Virtual scrolling for large lists
 */
export interface VirtualListItem {
  id: string;
  height?: number;
}

export function calculateVisibleRange(
  items: VirtualListItem[],
  scrollTop: number,
  containerHeight: number,
  itemHeight: number = 50
) {
  const startIndex = Math.max(
    0,
    Math.floor(scrollTop / itemHeight) - 2
  );
  const endIndex = Math.min(
    items.length,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + 2
  );
  return { startIndex, endIndex };
}
