import { useEffect, useState } from 'react';

export default function useFade(condition, duration = 500, initialState = false) {
  const [hasFaded, setHasFaded] = useState(initialState);
  const isFading = condition && !hasFaded;

  useEffect(() => {
    let timeoutId = null;

    if (condition && !hasFaded) {
      timeoutId = setTimeout(() => {
        setHasFaded(true);
      }, duration);
    }

    return () => (timeoutId ? clearTimeout(timeoutId) : null);
  }, [condition, hasFaded]);

  function reset() {
    setHasFaded(false);
  }

  return [isFading, hasFaded, reset];
}
