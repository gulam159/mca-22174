import { useEffect, useState } from "react";

export function useDebounce<T>(value: T, delay?: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay || 500);

    // Cleanup function to avoid overflow and memory leakage
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
