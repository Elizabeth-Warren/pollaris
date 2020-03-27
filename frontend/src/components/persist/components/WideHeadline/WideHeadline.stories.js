import React from 'react';
import styled from 'styled-components';
import { select, text } from '@storybook/addon-knobs';
import WideHeadline, { WideHeadlineSizes } from './index';
import theme from '../../theme';

export default {
  title: 'Components/WideHeadline',
  component: WideHeadline,
  parameters: { jest: ['WideHeadline'] },
};

const sampleText = 'The quick brown fox jumps over the lazy dog.';

export const withKnobs = () => {
  const tag = text('Tag', 'h1');
  const copy = text('Text', sampleText);
  const size = select('Size', Object.values(WideHeadlineSizes), WideHeadline.defaultProps.size);
  const color = select('Color', Object.keys(theme.colors), WideHeadline.defaultProps.color);
  return (
    <div>
      <WideHeadline
        as={tag}
        size={size}
        color={color}
      >
        {copy}
      </WideHeadline>
    </div>
  );
};

export const gallery = () => {
  const copy = text('Text', sampleText);
  return (
    <div>
      {Object.entries(WideHeadlineSizes).reverse().map(([name, value], i) => (
        <WideHeadline as={`h${i + 1}`} size={value} key={name}>
          {`${name}: `}
          {copy}
        </WideHeadline>
      ))}
    </div>
  );
};

export const withStyledComponent = () => {
  const copy = text('Text', sampleText);
  const size = select('Size', Object.values(WideHeadlineSizes), WideHeadline.defaultProps.size);
  const StyledCopy = styled.div`
    color: ${theme.colors.red};
  `;
  return (
    <div>
      <WideHeadline
        as={StyledCopy}
        size={size}
      >
        {copy}
      </WideHeadline>
    </div>
  );
};
