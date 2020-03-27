import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';

const Wrapper = styled.span`
  border: 0;
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  white-space: nowrap;
  width: 1px;

  &:active,
  &:focus {
    ${({ focusable }) => focusable
      && css`
        clip: auto;
        clip-path: none;
        height: auto;
        margin: 0;
        overflow: visible;
        position: static;
        white-space: inherit;
        width: auto;
      `}
  }
`;

const VisuallyHidden = ({ children, focusable }) => (
  <Wrapper focusable={focusable}>{children}</Wrapper>
);

VisuallyHidden.propTypes = {
  children: PropTypes.node.isRequired,
  focusable: PropTypes.bool,
};

VisuallyHidden.defaultProps = {
  focusable: false,
};

export default VisuallyHidden;
