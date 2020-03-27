import { css } from 'styled-components';
import createBreakpointStyles from './createBreakpointStyles';

export const calloutBanner = css`
  width: 100%;
  border-bottom: 2px solid ${({ theme }) => theme.colors.white};
  margin-bottom: 24px;
  display: flex;
  flex-direction: column;

  ${({ theme }) => createBreakpointStyles(theme.breakpoints.tablet, css`
    flex-direction: row;
    justify-content: space-between;
  `)}
`;

export const calloutTitle = css`
  ${({ theme }) => theme.fonts.extraWide}
  font-size: 14px;
  line-height: 1.7;
  letter-spacing: 1.6px;

  text-transform: uppercase;
`;
