import styled, { css } from 'styled-components';
import FormBlocks from './FormBlocks';
import createBreakpointStyles from '../styles/createBreakpointStyles';
import chevron from '../styles/icons/chevron';

const FieldBlock = styled.div`
  position: relative;

  ${({ theme }) => createBreakpointStyles(theme.breakpoints.mobileMedium, css`
    margin-right: 12px;
    flex-grow: 1;
    margin-bottom: 0;
  `)}
`;

const SearchBar = styled(FormBlocks.FieldTextInput)`
  width: 100%;
`;

const Icon = styled.span`
  overflow: hidden;
  position: absolute;
  right: 10px;
  top: 10px;
  height: 15px;
  width: 15px;

  ${({ theme }) => createBreakpointStyles(theme.breakpoints.tablet, css`
    right: 12px;
    top: 13px;
  `)}
`;

const MobileSearchIcon = styled.span`
  overflow: hidden;
  position: absolute;
  left: 15px;
  top: 15px;
  height: 15px;
  width: 15px;
`;

const MobileSearchSubmit = styled.span`
  ${chevron('lightGrey', 10, true, 3.5)};
  overflow: hidden;
  position: absolute;
  top: 10px;
  right: -7px;
  height: 40px;
  width: 40px;
`;

const AutoCompleteContainer = styled.ul`
  position: absolute;
  z-index: ${({ theme }) => theme.zIndices.searchAutoComplete};
  background: ${({ theme }) => theme.colors.liberty};
  padding: 12px;
  max-height: 142px;
  overflow: scroll;
  width: 100%;
`;

const buttonStyles = css`
  display: block;
  width: 100%;
  font-size: 14px;
  line-height: 2.31;
  margin-bottom: 16px;
  line-height: 1.3;
  cursor: pointer;
  text-align: left;
  &:last-child {
    margin-bottom: 0;
  }
`;

const AutoCompleteLink = styled.a`
  ${buttonStyles}
`;

const AutoCompleteButton = styled.button`
  ${buttonStyles}
`;

const searchBlocks = {
  FieldBlock,
  SearchBar,
  Icon,
  MobileSearchIcon,
  MobileSearchSubmit,
  AutoCompleteContainer,
  AutoCompleteLink,
  AutoCompleteButton,
};

export default searchBlocks;
