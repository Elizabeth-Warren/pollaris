/* eslint-disable */

import styled, { css } from 'styled-components';
import { mobileColumnToTabletRow } from '../styles/flex';
import createBreakpointStyles from '../styles/createBreakpointStyles';

export const LIGHT_COLOR_SCHEME = 'LIGHT_COLOR_SCHEME';
export const DARK_COLOR_SCHEME = 'DARK_COLOR_SCHEME';
export const RED_COLOR_SCHEME = 'RED_COLOR_SCHEME';
export const BLACK_COLOR_SCHEME = 'RED_COLOR_SCHEME';

export const HALF_WIDTH = 'HALF_WIDTH';
export const FULL_WIDTH = 'FULL_WIDTH';

function switchBasedOnScheme(colorScheme, styles, field) {
  return styles[colorScheme] || '';
}

const standardTextInputStyles = css`
  ${({ field }) => switchBasedOnScheme(field.display.colorScheme, {
    [RED_COLOR_SCHEME]: css`
      color: ${({ theme }) => theme.colors.navy};
      border: 2px solid ${({ theme }) => theme.colors.white};
      background-color: ${({ theme }) => theme.colors.white};

      &:focus {
        background-color: ${({ theme }) => theme.colors.lightLiberty};
        border: 2px solid ${({ theme }) => theme.colors.lightLiberty};
      }
    `,
    [LIGHT_COLOR_SCHEME]: css`
      color: ${({ theme }) => theme.colors.navy};
      border: 2px solid ${({ theme }) => theme.colors.navy};
      background-color: ${({ theme }) => theme.colors.white};

      &:focus {
        background-color: ${({ theme }) => theme.colors.lightLiberty};
      }
    `,
    [DARK_COLOR_SCHEME]: css`
      color: ${({ theme }) => theme.colors.white};
      border: 2px solid ${({ theme }) => theme.colors.white};
      background-color: ${({ theme }) => theme.colors.navy};

      &:focus {
        background-color: ${({ theme }) => theme.colors.lightNavy};
      }
    `,
    [BLACK_COLOR_SCHEME]: css`
      color: ${({ theme }) => theme.colors.white};
      border: 2px solid ${({ theme }) => theme.colors.white};
      background-color: ${({ theme }) => theme.colors.bodyColor};
    `,
  })}

  ${({ field, hasError }) => hasError ? switchBasedOnScheme(field.display.colorScheme, {
    [LIGHT_COLOR_SCHEME]: css`
      border: 2px solid ${({ theme }) => theme.colors.red};
      background-color: ${({ theme }) => theme.colors.opaqueRed};
    `,
    [RED_COLOR_SCHEME]: css`
      border: 2px solid ${({ theme }) => theme.colors.white};
      background-color: ${({ theme }) => theme.colors.white};
    `,
    [DARK_COLOR_SCHEME]: css`
      border: 2px solid ${({ theme }) => theme.colors.sunriseYellow};
    `,
    [BLACK_COLOR_SCHEME]: css`
      border: 2px solid ${({ theme }) => theme.colors.sunriseYellow};
    `,
  }) : ''}

  ${({ theme }) => theme.fonts.regularBookBold}
  padding: 8px;
  border-radius: 0;
  font-size: 18px;
  appearance: none;
  -o-appearance: none;
  -ms-appearance: none;
  -moz-appearance: none;
  -webkit-appearance: none;
`;

const FieldTextInput = styled.input`
  ${standardTextInputStyles}
  width: 100%;
`;

const FieldTextInputAutocomplete = styled(FieldTextInput)`
  ${standardTextInputStyles}
  width: 100%;
  padding-right: ${({ icon }) => icon && '36px'};
`;

const FieldSelect = styled.select`
  ${standardTextInputStyles}
  padding-right: 28px;
`;

const PrimaryFormGrid = styled.div`
  ${mobileColumnToTabletRow}
  width: 100%;

  ${({ theme }) => createBreakpointStyles(theme.breakpoints.tablet, css`
    flex-wrap: wrap;
    justify-content: space-between;
  `)}
`;

const invalidFieldContainerStyle = (isCompact) => css`
  &:before,
  &:after {
    content: '';
    display: block;
    position: absolute;
    bottom: ${isCompact ? '15px' : '20px'};
    right: 6px;
    width: 12px;
    height: 4px;
    transform: rotate(45deg);
    transform-origin: center;

    background-color: ${({ theme }) => theme.colors.red};

    ${({ field }) => switchBasedOnScheme(field.display.colorScheme, {
      [DARK_COLOR_SCHEME]: css`
        background-color: ${({ theme }) => theme.colors.sunriseYellow};
      `,
      [BLACK_COLOR_SCHEME]: css`
        background-color: ${({ theme }) => theme.colors.sunriseYellow};
      `,
    })}
  }

  &:after {
    transform: rotate(-45deg);
  }
`;

const fullWidthContainerStyle = css`
  width: 100%;
  max-width: 100%;

  ${({ theme }) => createBreakpointStyles(theme.breakpoints.tablet, css`
    width: auto;
    flex: 0 0 100%;
  `)}
`;

const halfFieldContainerStyle = css`
  width: 100%;
  max-width: 100%;

  ${({ theme }) => createBreakpointStyles(theme.breakpoints.tablet, css`
    width: auto;
    flex: 0 0 calc(50% - 8px);
    max-width: calc(50% - 8px);
  `)}
`;

function selectContainerWidthStyle(width) {
  switch (width) {
    case HALF_WIDTH: return halfFieldContainerStyle;
    case FULL_WIDTH: return fullWidthContainerStyle;
    default: return '';
  }
}

const FieldInputWrapper = styled.div`
  position: relative;
  ${({ hasError, isCompact }) => hasError ? invalidFieldContainerStyle(isCompact) : ''}
  width: 100%;
`;

const FieldContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 28px;
  position: relative;
  ${({ field }) => selectContainerWidthStyle(field.display.width)}
`;

const FieldSelectContainer = styled(FieldContainer)`
  ${({ hasError, isCompact }) => hasError ? invalidFieldContainerStyle(isCompact) : ''}
  ${({ hasError }) => hasError ? '' : css`
    &:after {
      ${({ field }) => switchBasedOnScheme(field.display.colorScheme, {
        [LIGHT_COLOR_SCHEME]: css`
          border-color: ${({ theme }) => theme.colors.navy} transparent transparent transparent;
        `,
        [RED_COLOR_SCHEME]: css`
          border-color: ${({ theme }) => theme.colors.white} transparent transparent transparent;
        `,
        [DARK_COLOR_SCHEME]: css`
          border-color: ${({ theme }) => theme.colors.white} transparent transparent transparent;
        `,
        [BLACK_COLOR_SCHEME]: css`
          border-color: ${({ theme }) => theme.colors.white} transparent transparent transparent;
        `,
      })}

      content: '';
      display: block;
      width: 0;
      height: 0;
      border-style: solid;
      -moz-transform: scale(.9999);
      border-width: 6px 6px 0 6px;
      position: absolute;
      top: calc(50% + 8px);
      right: 12px;
    }
  `}
`;

const FieldLabelRow = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  margin-bottom: 6px;

  ${({ theme }) => createBreakpointStyles(theme.breakpoints.mobileLarge, css`
    flex-direction: row;
    align-items: center;
  `)}
`;

const FieldLabel = styled.label`
  ${({ field }) => switchBasedOnScheme(field.display.colorScheme, {
    [LIGHT_COLOR_SCHEME]: css`
      color: ${({ theme }) => theme.colors.navy};
    `,
    [RED_COLOR_SCHEME]: css`
      color: ${({ theme }) => theme.colors.white};
    `,
    [DARK_COLOR_SCHEME]: css`
      color: ${({ theme }) => theme.colors.white};
    `,
    [BLACK_COLOR_SCHEME]: css`
      color: ${({ theme }) => theme.colors.white};
    `,
  })}

  ${({ theme }) => theme.fonts.regularBook}
  font-size: 16px;
  line-height: 1;
`;

const FieldValidationMessage = styled.span`
  ${({ field }) => switchBasedOnScheme(field.display.colorScheme, {
    [LIGHT_COLOR_SCHEME]: css`
      color: ${({ theme }) => theme.colors.red};
    `,
    [RED_COLOR_SCHEME]: css`
      color: ${({ theme }) => theme.colors.white};
    `,
    [DARK_COLOR_SCHEME]: css`
      color: ${({ theme }) => theme.colors.sunriseYellow};
    `,
    [BLACK_COLOR_SCHEME]: css`
      color: ${({ theme }) => theme.colors.sunriseYellow};
    `,
  })}


  ${({ theme }) => theme.fonts.regularBook}
  font-size: 14px;
  line-height: 1;

  ${({ theme }) => createBreakpointStyles(theme.breakpoints.mobileLarge, css`
    margin-left: 8px;
  `)}
`;

const DisclaimerCopy = styled.p`
  ${({ theme }) => theme.fonts.regularBook}
  font-size: 12px;
  line-height: 1.3;
  color: ${({ theme }) => theme.colors.bodyColor};
  margin-top: 4px;
  opacity: 0.8;

  ${({ overrideStyles }) => overrideStyles && overrideStyles}
`;

const CheckboxLayout = styled(PrimaryFormGrid)`
  margin-bottom: 24px;
  ${({ overrideStyles }) => overrideStyles}
`;

const CheckboxOptionLayout = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 34px;

  ${({ field, theme }) => field.display.columns === 2
    ? createBreakpointStyles(theme.breakpoints.tablet, css`flex: 0 0 calc(50% - 12px);`)
    : createBreakpointStyles(theme.breakpoints.tablet, css`flex: 0 0 100%;`)
  }

  ${({ overrideStyles }) => overrideStyles}
`;

const CheckboxLabel = styled.label`
  ${({ field }) => switchBasedOnScheme(field.display.colorScheme, {
    [LIGHT_COLOR_SCHEME]: css`
      color: ${({ theme }) => theme.colors.navy};
    `,
    [DARK_COLOR_SCHEME]: css`
      color: ${({ theme }) => theme.colors.white};
    `,
    [BLACK_COLOR_SCHEME]: css`
      color: ${({ theme }) => theme.colors.white};
    `,
  })}

  ${({ theme }) => theme.fonts.regularBookBold}
  font-size: 18px;
  line-height: 1;
  cursor: pointer;
  margin-left: 6px;
`;

const CheckboxGhostInput = styled.input`
  position: absolute;
  left: -100vw;
  opacity: 0;
`;

const CheckboxMark = styled.span`
  ${({ field }) => switchBasedOnScheme(field.display.colorScheme, {
    [LIGHT_COLOR_SCHEME]: css`
      border: 2px solid ${({ theme }) => theme.colors.navy};
      background-color: ${({ theme }) => theme.colors.white};
    `,
    [DARK_COLOR_SCHEME]: css`
      border: 2px solid ${({ theme }) => theme.colors.white};
      background-color: ${({ theme }) => theme.colors.navy};
    `,
    [BLACK_COLOR_SCHEME]: css`
      border: 2px solid ${({ theme }) => theme.colors.white};
      background-color: ${({ theme }) => theme.colors.bodyColor};
    `,
  })}

  display: block;
  position: relative;
  width: 22px;
  min-width: 22px;
  height: 22px;
  cursor: pointer;

  input:focus + & {
    outline: 1px dotted #212121;
    outline: 5px auto -webkit-focus-ring-color;
  }

  ${({ isChecked, field }) => isChecked ? css`
    &:before, &:after {
      display: block;
      position: absolute;
      content: '';
    }

    &:before {
      width: 5px;
      height: 3px;
      top: 10px;
      left: 2px;
      transform: rotate(45deg);
    }

    &:after {
      width: 15px;
      height: 3px;
      top: 8px;
      left: 4px;
      transform: rotate(-45deg);
    }

    ${switchBasedOnScheme(field.display.colorScheme, {
      [LIGHT_COLOR_SCHEME]: css`
        background-color: ${({ theme }) => theme.colors.navy};

        &:before, &:after {
          background-color: ${({ theme }) => theme.colors.white};
        }
      `,
      [DARK_COLOR_SCHEME]: css`
        background-color: ${({ theme }) => theme.colors.white};

        &:before, &:after {
          background-color: ${({ theme }) => theme.colors.navy};
        }
      `,
      [BLACK_COLOR_SCHEME]: css`
        background-color: ${({ theme }) => theme.colors.white};

        &:before, &:after {
          background-color: ${({ theme }) => theme.colors.bodyColor};
        }
      `,
    })}
  ` : ''}
`;

const CustomFieldTitle = styled.h4`
  ${({ field }) => switchBasedOnScheme(field.display.colorScheme, {
    [LIGHT_COLOR_SCHEME]: css`
      color: ${({ theme }) => theme.colors.navy};
    `,
    [DARK_COLOR_SCHEME]: css`
      color: ${({ theme }) => theme.colors.white};
    `,
    [BLACK_COLOR_SCHEME]: css`
      color: ${({ theme }) => theme.colors.white};
    `,
  })}

  ${({ theme }) => theme.fonts.compressedBold}
  font-size: 26px;
  line-height: 1;
  text-transform: uppercase;
  margin-bottom: 18px;
  width: 100%;
`;

const CustomFieldSubtext = styled.p`
  ${({ theme }) => theme.fonts.regularBook}
  font-size: 12px;
  line-height: 1.3;
  color: ${({ theme }) => theme.colors.navy};
  margin-bottom: 16px;
`;

const TextAreaLayout = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 16px;
`;

const TextArea = styled.textarea`
  ${({ field }) => switchBasedOnScheme(field.display.colorScheme, {
    [LIGHT_COLOR_SCHEME]: css`
      border: 2px solid ${({ theme }) => theme.colors.navy};
      background-color: ${({ theme }) => theme.colors.white};
      color: ${({ theme }) => theme.colors.navy};
    `,
    [DARK_COLOR_SCHEME]: css`
      border: 2px solid ${({ theme }) => theme.colors.white};
      background-color: ${({ theme }) => theme.colors.navy};
      color: ${({ theme }) => theme.colors.white};
    `,
    [BLACK_COLOR_SCHEME]: css`
      border: 2px solid ${({ theme }) => theme.colors.white};
      background-color: ${({ theme }) => theme.colors.bodyColor};
      color: ${({ theme }) => theme.colors.white};
    `,
  })}

  ${({ theme }) => theme.fonts.regularBook}
  display: block;
  width: 100%;
  min-height: 4em;
  resize: none;
  padding: 12px;
`;

const PostSignupMessage = styled.p`
  ${({ theme }) => theme.fonts.regularBook}
  font-size: 18px;
  line-height: 1;
  color: ${({ theme }) => theme.colors.bodyColor};
  margin-top: 24px;
`;

const hrBorderStyling = css`
  border: ${({ theme }) => `3px solid ${theme.colors.offWhite}`};
  width: 100%;
`;

const HR = {
  Top: styled.hr`
    ${hrBorderStyling}
    margin-bottom: 16px;`,
  Bottom: styled.hr`${hrBorderStyling}`,
};

const BaseButton = styled.button`
  width: 100%;
  ${({ overrideStyles }) => overrideStyles}
`;

const blocks = {
  PrimaryFormGrid,
  FieldContainer,
  FieldSelectContainer,
  FieldLabelRow,
  FieldLabel,
  FieldValidationMessage,
  FieldTextInput,
  FieldTextInputAutocomplete,
  FieldSelect,
  DisclaimerCopy,
  CheckboxLayout,
  CheckboxOptionLayout,
  CheckboxLabel,
  CheckboxGhostInput,
  CheckboxMark,
  TextAreaLayout,
  TextArea,
  CustomFieldTitle,
  CustomFieldSubtext,
  PostSignupMessage,
  HR,
  BaseButton,
  FieldInputWrapper,
};

export default blocks;
