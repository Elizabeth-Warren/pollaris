import { useState } from 'react';
import useKeyPressEvent from './useKeyPressEvent';

export default function useEnterOnPress(onPress, effects = []) {
  const [isFocused, setIsFocused] = useState(false);

  function onBlur() {
    setIsFocused(false);
  }

  function onFocus() {
    setIsFocused(true);
  }

  useKeyPressEvent('Enter', () => {
    if (isFocused) {
      onPress();
    }
  }, effects);

  return { onBlur, onFocus };
}
