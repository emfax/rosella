/**
 * Creates a function that throttles and debounces the given function.
 * @param func The function to throttle and debounce.
 * @param wait The time in milliseconds to wait before calling the function.
 * @returns A throttled and debounced version of the given function.
 */
export function throttleAndDebounce<T extends (...args: any[]) => void>(func: T, wait: number): T {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  let lastCall = 0;

  return function (this: any, ...args: Parameters<T>) {
    const now = Date.now();

    if (lastCall + wait <= now) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      lastCall = now;
      func.apply(this, args);
    } else {
      if (timeout) {
        clearTimeout(timeout);
      }
      timeout = setTimeout(() => {
        lastCall = Date.now();
        timeout = null;
        func.apply(this, args);
      }, wait);
    }
  } as T;
}