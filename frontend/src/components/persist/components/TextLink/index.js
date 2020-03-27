import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Chevron from '../Chevron';
import theme from '../../theme';

export const TextLinkLevels = {
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
  TERTIARY: 'tertiary',
};

const ChevronWrapper = styled.span`
  color: ${theme.colors.red};
  font-size: 1em;
  left: 0;
  position: relative;
  transition: all 150ms ease-in-out;
`;

const LinkWrapper = styled.a`
  background: ${({ level }) => (level === TextLinkLevels.SECONDARY
    ? `linear-gradient(to bottom,transparent 0%,transparent 65%,${theme.colors.liberty} 65%,${theme.colors.liberty} 100%)`
    : null)
};
  border-bottom: ${({ level }) => (level === TextLinkLevels.TERTIARY ? `2px solid ${theme.colors.liberty}` : 'none')};
  color: ${theme.colors.black};
  cursor: pointer;
  font-family: ${theme.fontFamily.sans};
  font-size: ${theme.fontSize.md};
  font-weight: bold;
  text-decoration: none;

  &:hover,
  &:focus {
    background: none;
    border-bottom: ${({ level }) => (level === TextLinkLevels.TERTIARY ? `2px solid ${theme.colors.black}` : 'none')};

    & ${ChevronWrapper} {
      left: 0.5em;
    }
  }

  &:active {
    background: none;
    border-bottom: ${({ level }) => (level === TextLinkLevels.SECONDARY ? `2px solid ${theme.colors.liberty}` : 'none')};
  }
`;

const TextLink = ({ children, level, ...other }) => (
  <LinkWrapper level={level} {...other}>
    {children}
    {level === TextLinkLevels.PRIMARY && ' '}
    {level === TextLinkLevels.PRIMARY && <ChevronWrapper as={Chevron} />}
  </LinkWrapper>
);

TextLink.propTypes = {
  /** Child text or elements */
  children: PropTypes.node.isRequired,
  /** Determines button color. One of 'primary', 'secondary', or 'tertiary'. */
  level: PropTypes.oneOf(Object.values(TextLinkLevels)),
};

TextLink.defaultProps = {
  level: TextLinkLevels.PRIMARY,
};

export default TextLink;
