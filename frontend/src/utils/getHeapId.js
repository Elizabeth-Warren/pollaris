import parseHeapCookie from './parseHeapCookie';

/**
 * Get the Heap Id from the browser cookie.
 *
 * @return {String|null}
 */
export default function getHeapId() {
  const data = parseHeapCookie();

  if (!data) {
    return null;
  }

  return String(data.userId);
}
