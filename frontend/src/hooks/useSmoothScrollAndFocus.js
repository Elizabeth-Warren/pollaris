import { useEffect, useRef } from 'react';

import useEnterOnFocus from './useEnterOnFocus';

/**
 * Orchestrates a scoll and focus event.
 */
function useSmoothScrollAndFocus() {
  const focusFunction = useRef();
  const scrollDestinationRef = useRef(null);
  const scrollFocusRef = useRef(null);

  useEffect(() => {
    focusFunction.current = () => {
      if (scrollFocusRef.current) {
        if (window.pageYOffset + 20 > scrollDestinationRef.current.offsetTop) {
          window.removeEventListener('scroll', focusFunction.current);
          scrollFocusRef.current.focus();
        }
      } else {
        window.removeEventListener('scroll', focusFunction.current);
      }
    };
    return () => window.removeEventListener('scroll', focusFunction.current);
  }, []);

  const scrollToDestination = (e) => {
    if (e) {
      e.preventDefault();
    }
    window.addEventListener('scroll', focusFunction.current);
    scrollDestinationRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  const focusProps = useEnterOnFocus(scrollToDestination);

  return {
    scrollTriggerElementProps: { ...focusProps, onClick: (e) => scrollToDestination(e) },
    scrollDestinationRef,
    scrollFocusRef,
    scrollToDestination,
  };
}

export default useSmoothScrollAndFocus;
