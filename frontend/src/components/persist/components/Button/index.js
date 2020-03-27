import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import theme from '../../theme';

export const ButtonLevels = {
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
  TERTIARY: 'tertiary',
  QUATERNARY: 'quaternary',
  INVERTED: 'inverted',
  WHITE: 'white',
};

export const ButtonSizes = {
  SM: 'sm',
  MD: 'md',
  LG: 'lg',
};

const ButtonWrapper = styled.button`
  appearance: none;
  background: ${({ level }) => {
    switch (level) {
      case ButtonLevels.SECONDARY:
        return theme.colors.navy;
      case ButtonLevels.TERTIARY:
        return theme.colors.liberty;
      case ButtonLevels.QUATERNARY:
        return theme.colors.purple;
      case ButtonLevels.INVERTED:
        return 'transparent';
      case ButtonLevels.WHITE:
        return theme.colors.white;
      case ButtonLevels.PRIMARY:
      default:
        return theme.colors.red;
    }
  }};
  border: 4px solid ${({ level }) => {
    switch (level) {
      case ButtonLevels.SECONDARY:
      case ButtonLevels.INVERTED:
        return theme.colors.navy;
      case ButtonLevels.TERTIARY:
        return theme.colors.liberty;
      case ButtonLevels.QUATERNARY:
        return theme.colors.purple;
      case ButtonLevels.WHITE:
        return theme.colors.white;
      case ButtonLevels.PRIMARY:
      default:
        return theme.colors.red;
    }
  }};
  border-radius: 0;
  color: ${({ level }) => {
    switch (level) {
      case ButtonLevels.TERTIARY:
      case ButtonLevels.INVERTED:
      case ButtonLevels.WHITE:
        return theme.colors.navy;
      case ButtonLevels.PRIMARY:
      case ButtonLevels.SECONDARY:
      case ButtonLevels.QUATERNARY:
      default:
        return theme.colors.white;
    }
  }};
  cursor: pointer;
  display: inline-block;
  font-family: ${theme.fontFamily.compressed};
  font-size: ${({ size }) => {
    switch (size) {
      case ButtonSizes.SM:
        return theme.fontSize.lg;
      case ButtonSizes.MD:
      case ButtonSizes.LG:
      default:
        return theme.fontSize.xl;
    }
  }};
  line-height: ${theme.leading.none};
  padding: ${({ size }) => {
    switch (size) {
      case ButtonSizes.LG:
        return `${theme.spacing.sp0} ${theme.spacing.sp2} ${theme.spacing.sp1}`;
      case ButtonSizes.SM:
      case ButtonSizes.MD:
      default:
        return `${theme.spacing.sp0} ${theme.spacing.sp2}`;
    }
  }};
  text-decoration: none;
  text-transform: uppercase;
  transition-duration: 150ms;
  transition-property: background-color, border-color, color, opacity;
  transition-timing-function: ease-in;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  &:hover:not(:disabled) {
    background-color: ${({ level }) => {
    switch (level) {
      case ButtonLevels.INVERTED:
        return theme.colors.navy;
      default:
        return 'transparent';
    }
  }};
    color: ${({ level }) => {
    switch (level) {
      case ButtonLevels.INVERTED:
      case ButtonLevels.WHITE:
        return theme.colors.white;
      case ButtonLevels.PRIMARY:
      case ButtonLevels.SECONDARY:
      case ButtonLevels.TERTIARY:
      case ButtonLevels.QUATERNARY:
      default:
        return theme.colors.navy;
    }
  }};
  }

  @media (min-width: ${theme.screens.md}) {
    font-size: ${({ size }) => size === ButtonSizes.LG && theme.fontSize['2xl']};
  }
`;

const Button = ({
  children, level, size, ...other
}) => (
  <ButtonWrapper level={level} size={size} {...other}>{children}</ButtonWrapper>
);

Button.propTypes = {
  /** Child text or elements */
  children: PropTypes.node.isRequired,
  /** Determines button color. One of 'primary', 'secondary', 'tertiary', 'inverted', or 'white'. */
  level: PropTypes.oneOf(Object.values(ButtonLevels)),
  /** Button size. one of 'sm', 'md', or 'lg. */
  size: PropTypes.oneOf(Object.values(ButtonSizes)),
};

Button.defaultProps = {
  level: ButtonLevels.PRIMARY,
  size: ButtonSizes.MD,
};

export default Button;
