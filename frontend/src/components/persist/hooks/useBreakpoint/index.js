import { useMediaQuery } from 'react-responsive';

export default function useBreakpoint(bpMap = {}) {
  const breakpoints = Object.entries(bpMap).sort((a, b) => parseInt(a[1], 10) - parseInt(b[1], 10));
  const current = breakpoints.reduce((bp, [name, value]) => (useMediaQuery({ minWidth: value }) ? name : bp), 'default');
  const currentIndex = breakpoints.findIndex(([name]) => name === current);
  const getBpIndex = (bpName) => breakpoints.findIndex(([name]) => name === bpName);

  const isAbove = (bpName, inclusive = true) => (
    inclusive ? getBpIndex(bpName) <= currentIndex : getBpIndex(bpName) < currentIndex
  );
  const isBelow = (bpName, inclusive = false) => (
    inclusive ? getBpIndex(bpName) >= currentIndex : getBpIndex(bpName) > currentIndex
  );
  return {
    current,
    isAbove,
    isBelow,
  };
}
