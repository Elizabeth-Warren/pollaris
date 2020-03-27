import styled, { css } from 'styled-components';
import { a11yOnly } from 'wr/styles/a11y';
import chevron from 'wr/styles/icons/chevron';
import createBreakpointStyles from 'wr/styles/createBreakpointStyles';

const HiddenA11yExp = styled.p`
  ${a11yOnly}
`;

const FieldBlock = styled.div`
  position: relative;

  ${({ theme }) => createBreakpointStyles(theme.breakpoints.mobileMedium, css`
    flex-grow: 1;
    margin-bottom: 0;
  `)}
`;

const Icon = styled.span`
  overflow: hidden;
  position: absolute;
  right: 10px;
  top: ${({ compact }) => (compact ? '9px' : '13px')};
  height: 20px;
  width: 20px;

  ${({ theme, compact }) => createBreakpointStyles(theme.breakpoints.tablet, css`
    right: ${compact ? '9px' : '12px'};
    top: ${compact ? '9px' : '13px'};
  `)}
`;

const AutoCompleteContainer = styled.ul`
  position: absolute;
  z-index: ${({ theme }) => theme.zIndices.searchAutoComplete};
  background: ${({ theme }) => theme.colors.lightLiberty};
  max-height: 275px;
  overflow: scroll;
  width: 100%;
  box-shadow: -2px 0 8px rgba(0,0,0,0.15);
  ${({ theme }) => theme.fonts.regularBookBold};
  color: ${({ theme }) => theme.colors.navy};
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const buttonStyles = css`
  display: block;
  width: 100%;
  font-size: 16px;
  line-height: 1.3;
  cursor: pointer;
  text-align: left;
  &:last-child {
    margin-bottom: 0;
  }
`;

const AutoCompleteLink = styled.a`
  width: 100%;
  display: block;
  ${chevron('navy', 5, false, 3)};
`;

const AutoCompleteListItem = styled.li`
  ${buttonStyles}
  width: 100%;
  padding: 6px 12px;
  &:focus, &:hover {
    background-color: ${({ theme }) => theme.colors.white};
    padding-left: 18px;
    transition: all 0.2s ease-in-out;
  }
`;

const AutoCompleteText = styled.span`
  width: 100%;
`;

const AutoCompleteButton = styled.button`
  ${buttonStyles}
`;

const blocks = {
  HiddenA11yExp,
  AutoCompleteLink,
  AutoCompleteListItem,
  AutoCompleteText,
  FieldBlock,
  Icon,
  AutoCompleteContainer,
  AutoCompleteButton,
};

export default blocks;
