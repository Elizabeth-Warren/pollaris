import { css } from 'styled-components';

function getChevronColor(color, theme) {
  if (color.startsWith('#')) {
    return color;
  }

  return theme.colors[color];
}

const LIGHT = 'light';
const NORMAL = 'normal';
const DOWN = 'down';

export const animations = {
  [LIGHT]: css`transform: rotate(45deg) translateY(-60%) translateX(40%);`,
  [NORMAL]: css`transform: rotate(45deg) translateY(-135%) translateX(115%);`,
  [DOWN]: css`transform: rotate(135deg) translateY(-35%) translateX(35%);`,
};

const chevron = (
  color,
  size = 5,
  isStatic = false,
  lineWidth = '3',
  animationStyle = NORMAL,
  hoverColor = null,
) => ({ theme }) => css`
  position: relative;

  &:after {
    border-style: solid;
    border-width: ${lineWidth}px ${lineWidth}px 0 0;
    box-sizing: content-box;
    content: '';
    color: ${getChevronColor(color, theme)};
    display: inline-block;
    height: ${size}px;
    margin-left: 5px;
    position: relative;
    transform: rotate(45deg) ${isStatic ? '' : 'translateY(-25%)'};
    width: ${size}px;
    ${isStatic ? '' : css`transition: transform 0.15s ease-in-out;`}
  }

  &:hover:after {
    ${isStatic ? '' : animations[animationStyle]}

    ${hoverColor && css`
      color: ${getChevronColor(hoverColor, theme)};
    `}
  }
`;

// @NOTE: I think we need to just do a complete refactor of chevron, but for now
// this should make things slightly less annoying.
chevron.config = (config) => {
  const {
    color = 'liberty',
    size = 5,
    isStatic = false,
    lineWidth = '3',
    animationStyle = NORMAL,
    hoverColor = 'red',
  } = config || {};

  return chevron(
    color,
    size,
    isStatic,
    lineWidth,
    animationStyle,
    hoverColor,
  );
};

export default chevron;

export const upChevron = css`
  &:after {
    transform: rotate(-45deg);
  }
  &:hover:after {
    transform: rotate(-45deg);
  }
`;

export const downChevron = ({ isStatic = true }) => css`
  &:after {
    transform: rotate(135deg);
  }
  &:hover:after {
    transform: rotate(135deg);
    ${!isStatic && animations[DOWN]}
  }
`;

export const sideChevronNoHover = css`
  &:hover:after {
    transform: rotate(45deg) translateY(-25%);
  }
`;

export const reverseSideChevronNoHover = css`
  &:hover:after {
    transform: rotate(-135deg) translateY(-25%);
  }
`;

export const sideChevron = css`
  &:after {
    transform: rotate(45deg) translateY(-25%);
  }
  &:hover:after {
    transform: rotate(45deg) translateY(-25%);
  }
`;

export const reverseSideChevron = css`
  &:after {
    transform: rotate(-135deg) translateY(-25%);
  }
  &:hover:after {
    transform: rotate(-135deg) translateY(-25%);
  }
`;
