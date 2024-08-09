import { useCallback } from "react";

// Debounce function
function debounce(callback, delay) {
  let timeoutId;

  return function (...args) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      callback.apply(this, args);
    }, delay);
  };
}

// Custom hook for debounced updates
export function useDebouncedUpdate(updateFunction, delay) {
  // Memoize the debounced update function
  const debouncedUpdate = useCallback(debounce(updateFunction, delay), [
    updateFunction,
    delay,
  ]);

  return debouncedUpdate;
}
