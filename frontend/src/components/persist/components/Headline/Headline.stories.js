import React from 'react';
import styled from 'styled-components';
import { boolean, select, text } from '@storybook/addon-knobs';
import Headline, { HeadlineSizes } from './index';
import theme from '../../theme';

export default {
  title: 'Components/Headline',
  component: Headline,
  parameters: { jest: ['Headline'] },
};

export const withKnobs = () => {
  const tag = text('Tag', 'h1');
  const headlineText = text('Text', 'The quick brown fox jumps over the lazy dog.');
  const size = select('Size', Object.values(HeadlineSizes), Headline.defaultProps.size);
  const allCaps = boolean('All caps', Headline.defaultProps.allCaps);
  const breakpoint = text('Breakpoint', Headline.defaultProps.breakpoint);
  const color = select('Color', Object.keys(theme.colors), Headline.defaultProps.color);
  return (
    <div>
      <Headline
        as={tag}
        size={size}
        allCaps={allCaps}
        breakpoint={breakpoint}
        color={color}
      >
        {headlineText}
      </Headline>
    </div>
  );
};

export const gallery = () => {
  const headlineText = text('Text', 'The quick brown fox jumps over the lazy dog.');
  return (
    <div>
      <p>
        Note that the font size for the XL and LG headlines changes depending
        between mobile and tablet breakpoints.
      </p>
      {Object.entries(HeadlineSizes).reverse().map(([name, value], i) => (
        <Headline as={`h${i + 1}`} size={value} key={name}>
          {`${name}: `}
          {headlineText}
        </Headline>
      ))}
    </div>
  );
};

export const withStyledComponent = () => {
  const headlineText = text('Text', 'The quick brown fox jumps over the lazy dog.');
  const size = select('Size', Object.values(HeadlineSizes), Headline.defaultProps.size);
  const allCaps = boolean('All caps', Headline.defaultProps.allCaps);
  const breakpoint = text('Breakpoint', Headline.defaultProps.breakpoint);
  const StyledHeadline = styled.div`
    color: ${theme.colors.red};
  `;
  return (
    <div>
      <Headline
        as={StyledHeadline}
        size={size}
        allCaps={allCaps}
        breakpoint={breakpoint}
      >
        {headlineText}
      </Headline>
    </div>
  );
};
