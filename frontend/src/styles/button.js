import { css } from 'styled-components'
import createBreakpointStyles from './createBreakpointStyles'

export function button(
  backgroundColor,
  textColor,
  hoverTextColor,
  hoverBorderColor
) {
  return css`
    ${({ theme }) => theme.fonts.compressedBold}
    line-height: 0.92;
    color: ${textColor};
    background: ${backgroundColor};
    border: 4px solid ${backgroundColor};
    border-radius: 0;
    cursor: pointer;
    display: inline-block;
    line-height: 1;
    position: relative;
    text-transform: uppercase;
    transition: all ${({ theme }) => theme.timing.hover} linear;
    -webkit-appearance: none;

    &:hover:not(:disabled) {
      background-color: transparent;
      color: ${hoverTextColor};
      border: 4px solid ${hoverBorderColor || hoverTextColor};
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `
}

export function compactButton(
  backgroundColor,
  textColor,
  hoverTextColor,
  hoverBorderColor
) {
  return css`
    font-size: 22px;
    padding: 2px 16px 3px;
    ${button(backgroundColor, textColor, hoverTextColor, hoverBorderColor)}
  `
}

export function smallButton(
  backgroundColor,
  textColor,
  hoverTextColor,
  hoverBorderColor
) {
  return css`
    font-size: 22px;
    padding: 3px 16px 5px;
    ${button(backgroundColor, textColor, hoverTextColor, hoverBorderColor)}
  `
}

export function mediumButton(
  backgroundColor,
  textColor,
  hoverTextColor,
  hoverBorderColor
) {
  return css`
    font-size: 30px;
    padding: 2px 18px 4px;

    ${({ theme }) =>
      createBreakpointStyles(
        theme.breakpoints.tablet,
        `
      font-size: 32px;
    `
      )}

    ${button(backgroundColor, textColor, hoverTextColor, hoverBorderColor)}
  `
}

export function largeButton(
  backgroundColor,
  textColor,
  hoverTextColor,
  hoverBorderColor
) {
  return css`
    font-size: 32px;
    padding: 4px 14px 8px;

    ${({ theme }) =>
      createBreakpointStyles(
        theme.breakpoints.tablet,
        `
      font-size: 42px;
    `
      )}

    ${button(backgroundColor, textColor, hoverTextColor, hoverBorderColor)}
  `
}
