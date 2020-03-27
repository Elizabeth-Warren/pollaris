import { css } from 'styled-components';
import createBreakpointStyles from './createBreakpointStyles';

export const columnDirection = css`
  display: flex;
  flex-direction: column;
`;

export const rowDirection = css`
  display: flex;
  flex-direction: row;
`;

export const mobileColumnToTabletRow = css`
  display: flex;
  flex-direction: column;

  ${({ theme }) => createBreakpointStyles(theme.breakpoints.tablet, css`
    flex-direction: row;
  `)}
`;

export const mobileColumnToTabletRowWrap = css`
  ${mobileColumnToTabletRow}

  ${({ theme }) => createBreakpointStyles(theme.breakpoints.tablet, css`
    flex-wrap: wrap;
  `)}
`;
