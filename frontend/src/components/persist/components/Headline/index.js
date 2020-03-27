import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import theme from '../../theme';

export const HeadlineSizes = {
  XS: 'xs',
  SM: 'sm',
  MD: 'md',
  LG: 'lg',
  XL: 'xl',
};

const HeadlineWrapper = styled.div`
  color: ${({ textColor }) => theme.colors[textColor] || 'inherit'};
  font-family: ${theme.fontFamily.compressed};
  font-size: ${({ size }) => {
    switch (size) {
      case HeadlineSizes.XL:
        return theme.fontSize['4xl'];
      case HeadlineSizes.MD:
        return theme.fontSize['2xl'];
      case HeadlineSizes.SM:
        return theme.fontSize.xl;
      case HeadlineSizes.XS:
        return theme.fontSize.lg;
      case HeadlineSizes.LG:
      default:
        return theme.fontSize['3xl'];
    }
  }};
  font-weight: bold;
  letter-spacing: ${({ size }) => {
    switch (size) {
      case HeadlineSizes.XL:
        return '-0.38px';
      default:
        return '0';
    }
  }};
  line-height: ${theme.leading.sub};
  text-transform: ${({ allCaps }) => (allCaps ? 'uppercase' : 'none')};

  @media (min-width: ${({ breakpoint }) => breakpoint}) {
    font-size: ${({ size }) => {
    switch (size) {
      case HeadlineSizes.XL:
        return theme.fontSize['5xl'];
      case HeadlineSizes.MD:
        return theme.fontSize['2xl'];
      case HeadlineSizes.SM:
        return theme.fontSize.xl;
      case HeadlineSizes.XS:
        return theme.fontSize.lg;
      case HeadlineSizes.LG:
      default:
        return theme.fontSize['4xl'];
    }
  }};
    letter-spacing: ${({ size }) => {
    switch (size) {
      case HeadlineSizes.XL:
        return '-0.9px';
      case HeadlineSizes.LG:
        return '-0.38px';
      default:
        return '0';
    }
  }}
  }
`;

const Headline = ({
  children, size, as, breakpoint, allCaps, color, ...other
}) => (
  <HeadlineWrapper
    allCaps={allCaps}
    as={as}
    breakpoint={breakpoint}
    size={size}
    textColor={color}
    {...other}
  >
    {children}
  </HeadlineWrapper>
);

Headline.propTypes = {
  /** Child text or elements */
  children: PropTypes.node.isRequired,
  /** HTML tag name or React element. */
  as: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
  /** Size of the headline */
  size: PropTypes.oneOf(Object.values(HeadlineSizes)),
  /** Color of the headline */
  color: PropTypes.oneOf(['inherit', ...Object.keys(theme.colors)]),
  /**
   * Screen width at or above which the headline takes on a larger font size.
   * Should be an em, rem, or px value.
   */
  breakpoint: PropTypes.string,
  /** Whether the headline should be in all caps. */
  allCaps: PropTypes.bool,
};

Headline.defaultProps = {
  size: HeadlineSizes.LG,
  breakpoint: theme.screens.md,
  allCaps: true,
  color: 'inherit',
};

export default Headline;
