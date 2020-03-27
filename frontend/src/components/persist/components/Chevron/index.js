import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

export const ChevronDirections = {
  UP: 'up',
  DOWN: 'down',
  LEFT: 'left',
  RIGHT: 'right',
};

const ChevronWrapper = styled.span`
  border-color: ${({ color }) => color};
  border-style: solid;
  border-width: 0.15em 0.15em 0 0;
  box-sizing: border-box;
  display: inline-block;
  height: 0.45em;
  left: ${({ direction }) => {
    switch (direction) {
      case ChevronDirections.RIGHT:
        return -0.15;
      case ChevronDirections.UP:
      case ChevronDirections.DOWN:
      case ChevronDirections.LEFT:
      default:
        return 0;
    }
  }}em;
  position: relative;
  top: ${({ direction }) => {
    switch (direction) {
      case ChevronDirections.UP:
        return -0.05;
      case ChevronDirections.DOWN:
        return -0.2;
      case ChevronDirections.LEFT:
      case ChevronDirections.RIGHT:
      default:
        return -0.1;
    }
  }}em;
  transform: rotate(${({ direction }) => {
    switch (direction) {
      case ChevronDirections.UP:
        return -45;
      case ChevronDirections.DOWN:
        return 135;
      case ChevronDirections.LEFT:
        return -135;
      case ChevronDirections.RIGHT:
      default:
        return 45;
    }
  }}deg);
  width: 0.45em;
`;

const Chevron = ({ color, direction, ...other }) => (
  <ChevronWrapper color={color} direction={direction} {...other} />
);

Chevron.propTypes = {
  /** Determines icon color. */
  color: PropTypes.string,
  /** Icon direction. one of 'up', 'left', or 'right. */
  direction: PropTypes.oneOf(Object.values(ChevronDirections)),
};

Chevron.defaultProps = {
  color: 'currentColor',
  direction: ChevronDirections.RIGHT,
};

export default Chevron;
