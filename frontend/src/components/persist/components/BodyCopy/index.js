import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import theme from '../../theme';

export const BodyCopySizes = {
  '2XS': '2xs',
  XS: 'xs',
  SM: 'sm',
  MD: 'md',
  LG: 'lg',
  XL: 'xl',
};

export const BodyCopyWeights = {
  LIGHT: 'light',
  NORMAL: 'normal',
  BOLD: 'bold',
};

const CopyWrapper = styled.span`
  color: ${({ textColor }) => theme.colors[textColor] || 'inherit'};
  font-family: ${theme.fontFamily.sans};
  font-size: ${({ size }) => {
    switch (size) {
      case BodyCopySizes.XL:
        return theme.fontSize['2xl'];
      case BodyCopySizes.LG:
        return theme.fontSize.xl;
      case BodyCopySizes.SM:
        return theme.fontSize.base;
      case BodyCopySizes.XS:
        return theme.fontSize.sm;
      case BodyCopySizes['2XS']:
        return theme.fontSize.xs;
      case BodyCopySizes.MD:
      default:
        return theme.fontSize.md;
    }
  }};
  font-weight: ${({ weight }) => {
    switch (weight) {
      case BodyCopyWeights.LIGHT:
        return theme.fontWeight.light;
      case BodyCopyWeights.NORMAL:
        return theme.fontWeight.normal;
      case BodyCopyWeights.BOLD:
        return theme.fontWeight.bold;
      default:
        return 'inherit';
    }
  }};
  line-height: ${({ size }) => {
    switch (size) {
      case BodyCopySizes.XL:
        return theme.leading.tight;
      default:
        return theme.leading.snug;
    }
  }};
`;

const BodyCopy = ({
  children, size, as, color, ...other
}) => (
  <CopyWrapper
    as={as}
    size={size}
    textColor={color}
    {...other}
  >
    {children}
  </CopyWrapper>
);

BodyCopy.propTypes = {
  /** Child text or elements */
  children: PropTypes.node.isRequired,
  /** HTML tag name or React element. */
  as: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
  /** Size of the body copy */
  size: PropTypes.oneOf(Object.values(BodyCopySizes)),
  /** Font weight of the body copy */
  weight: PropTypes.oneOf(['inherit', ...Object.values(BodyCopyWeights)]),
  /** Selected Color applied directly from theme */
  color: PropTypes.oneOf(['inherit', ...Object.keys(theme.colors)]),
};

BodyCopy.defaultProps = {
  size: BodyCopySizes.MD,
  weight: 'inherit',
  color: 'inherit',
};

export default BodyCopy;
