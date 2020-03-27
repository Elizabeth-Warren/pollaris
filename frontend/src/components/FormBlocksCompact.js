/* eslint-disable */

import styled, { css } from 'styled-components';
import createBreakpointStyles from '../styles/createBreakpointStyles';
import FormBlocks from './FormBlocks';

const compactTextInputStyles = css`
  padding: 6px;
  font-size: 16px;
`;

const FieldLabel = styled(FormBlocks.FieldLabel)`
  font-size: 14px;
`;

const FieldTextInput = styled(FormBlocks.FieldTextInput)`
  ${compactTextInputStyles}
`;

const FieldSelect = styled(FormBlocks.FieldSelect)`
  ${compactTextInputStyles}
`;

const FieldTextInputAutocomplete = styled(FormBlocks.FieldTextInputAutocomplete)`
  ${compactTextInputStyles}
  padding-right: ${({ icon }) => icon && '30px'};
`;

const FormGridOverride = styled(FormBlocks.PrimaryFormGrid)`
  flex-direction: row;
  align-items: flex-end;
  flex-wrap: wrap;

  ${({ theme }) => createBreakpointStyles(theme.breakpoints.tablet, css`
    flex-wrap: nowrap;
  `)}
`;

const FormEmailColumn = styled.div`
  flex: 0 0 100%;

  ${({ theme }) => createBreakpointStyles(theme.breakpoints.tablet, css`
    flex-grow: 1;
    flex-basis: auto;
    padding-right: 12px;

    ${FormBlocks.FieldContainer} {
      margin-bottom: 0;
    }
  `)}
`;

const FormZipColumn = styled.div`
  width: 50%;
  flex-grow: 1;
  padding-right: 12px;

  ${FormBlocks.FieldContainer} {
    margin-bottom: 0;
  }

  ${({ theme }) => createBreakpointStyles(theme.breakpoints.tablet, css`
    width: auto;
    flex-grow: auto;
    flex: 0 0 calc(35% - 12px);
    padding-right: 12px;
  `)}
`;

const SignupButtonColumn = styled.div`
  flex-shrink: 0;
`;

const compactBlocks = {
  FieldLabel,
  FieldTextInput,
  FieldTextInputAutocomplete,
  FieldSelect,
  SignupButtonColumn,
  FormEmailColumn,
  FormZipColumn,
  FormGridOverride,
  compactTextInputStyles,
}

export default compactBlocks;
