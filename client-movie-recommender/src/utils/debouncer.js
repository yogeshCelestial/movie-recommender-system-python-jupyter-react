import httpHelper from "./httpHelper";

function debounce(func, delay) {
    let timeoutId;
    return function(...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  }
  
  // Example usage
  const debouncedRequest = debounce(httpHelper, 500);
  
export default debouncedRequest;  