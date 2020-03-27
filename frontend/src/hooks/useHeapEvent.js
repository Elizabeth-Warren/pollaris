export default function useHeapEvent() {
  const experimentAttributes = Object.keys({}).reduce(
    (acc, key) => ({
      ...acc,
      [`experiment ${key}`]: experiments[key],
    }),
    {}
  )

  function heapEventWrapper(name, payload) {
    return null
  }

  return heapEventWrapper
}
