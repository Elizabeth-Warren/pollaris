import { useEffect } from 'react';

/**
 * Second iteration of `useKeyPress` but with simpler state management.
 *
 * Find the target key here: https://keycode.info/
 */

export default function useKeyPressEvent(targetKey, onPress, effects = [], preventDefault = false) {
  function downHandler(e) {
    const { key, code } = e;
    if ((key === targetKey) || (code === targetKey)) {
      if (preventDefault) {
        e.preventDefault();
      }

      onPress();
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', downHandler);
    return () => window.removeEventListener('keydown', downHandler);
  }, [onPress, ...effects]);
}
