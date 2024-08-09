// Debounce function
export function debounce(callback, delay) {
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

// Example of a delay function
export function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
