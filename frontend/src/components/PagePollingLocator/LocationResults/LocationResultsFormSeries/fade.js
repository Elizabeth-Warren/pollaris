import styled, { css, keyframes } from 'styled-components'

const fadeAnimation = keyframes`
  from { opacity: 1; }
  to { opacity: 0; }
`

const fade = (duration = '0.5s') => css`
  ${({ isFading }) =>
    isFading
      ? css`
          animation: ease-in forwards ${duration} ${fadeAnimation};
        `
      : ''}
`

export default fade
