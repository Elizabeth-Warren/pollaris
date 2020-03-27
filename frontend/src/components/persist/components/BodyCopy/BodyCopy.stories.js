import React from 'react';
import styled from 'styled-components';
import { select, text } from '@storybook/addon-knobs';
import BodyCopy, { BodyCopySizes, BodyCopyWeights } from './index';
import theme from '../../theme';

export default {
  title: 'Components/BodyCopy',
  component: BodyCopy,
  parameters: { jest: ['BodyCopy'] },
};

const sampleText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ipsum augue, tempus at felis non, ullamcorper semper nisi. In quis erat lacus. Nunc dapibus risus a purus aliquet, ut maximus diam dapibus. Nunc eu urna ut sem lacinia mattis. Nunc imperdiet nisi bibendum, dapibus orci in, ullamcorper augue. Quisque dictum hendrerit augue, sed congue metus. Proin mattis nec enim et volutpat. Praesent lacinia consectetur nisi, at cursus erat porttitor non.';
export const withKnobs = () => {
  const tag = text('Tag', 'p');
  const copy = text('Text', sampleText);
  const size = select('Size', Object.values(BodyCopySizes), BodyCopy.defaultProps.size);
  const weight = select('Weight', Object.values(BodyCopyWeights), BodyCopy.defaultProps.weight);
  const color = select('Color', Object.keys(theme.colors), BodyCopy.defaultProps.color);
  return (
    <div>
      <BodyCopy
        as={tag}
        size={size}
        weight={weight}
        color={color}
      >
        {copy}
      </BodyCopy>
    </div>
  );
};

export const gallery = () => {
  const copy = text('Text', sampleText);
  return (
    <div>
      {Object.entries(BodyCopySizes).reverse().map(([name, value]) => (
        <BodyCopy as="p" size={value} key={name}>
          {`${name}: `}
          {copy}
        </BodyCopy>
      ))}
    </div>
  );
};

export const withStyledComponent = () => {
  const copy = text('Text', sampleText);
  const size = select('Size', Object.values(BodyCopySizes), BodyCopy.defaultProps.size);
  const StyledCopy = styled.div`
    color: ${theme.colors.red};
  `;
  return (
    <div>
      <BodyCopy
        as={StyledCopy}
        size={size}
      >
        {copy}
      </BodyCopy>
    </div>
  );
};
