import { useRef, useEffect } from 'react';

export default function useOnClickOutsideElement(onClick, effect = []) {
  const ref = useRef(null);

  useEffect(() => {
    function onPress(event) {
      if (!ref || !ref.current) {
        return;
      }

      if (!ref.current.contains(event.target)) {
        onClick();
      }
    }

    document.addEventListener('mousedown', onPress);
    document.addEventListener('touchstart', onPress);

    return () => {
      document.removeEventListener('mousedown', onPress);
      document.removeEventListener('touchstart', onPress);
    };
  }, [ref, ...(effect || [])]);

  return ref;
}
