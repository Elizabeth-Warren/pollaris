import { css } from 'styled-components'

export default function createBreakpointStyles(breakpoint, styles) {
  return css`
    @media (min-width: ${breakpoint}) {
      ${styles}
    }
  `
}
