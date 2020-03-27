import { css } from 'styled-components'

export const link = linkColor => css`
  ${({ theme }) => theme.fonts.regularBookBold}
  background: linear-gradient(to bottom, transparent 0%, transparent 65%, ${linkColor} 65%, ${linkColor} 100%);
  color: inherit;
  cursor: pointer;

  &:hover {
    background: none;
  }
`

export const simpleLink = ({ fontSize = '14px' }) => css`
  ${({ theme }) => theme.fonts.regularBookBold};
  font-size: ${fontSize};
  line-height: 1.38;
  transition: 0.5s;
  display: inline-block;
  cursor: pointer;
  text-decoration: underline;

  text-decoration-color: ${({ theme }) => theme.colors.liberty};

  &:hover {
    text-decoration-color: ${({ theme }) => theme.colors.bodyColor};
  }
`
