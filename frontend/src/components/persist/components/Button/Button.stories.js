import React from 'react';
import styled from 'styled-components';
import { action } from '@storybook/addon-actions';
import { select, text } from '@storybook/addon-knobs';
import Button, { ButtonLevels, ButtonSizes } from './index';
import Chevron, { ChevronDirections } from '../Chevron';
import theme from '../../theme';

const getLevelOptions = () => select('Level', Object.values(ButtonLevels), Button.defaultProps.size);
const getSizeOptions = () => select('Size', Object.values(ButtonSizes), Button.defaultProps.size);
const handleClick = action('button clicked');

export default {
  title: 'Components/Button',
  component: Button,
  parameters: { jest: ['Button'] },
};

export const withKnobs = () => {
  const buttonText = text('Text', 'Click me');
  const level = getLevelOptions();
  const size = getSizeOptions();
  return (<Button level={level} size={size} onClick={handleClick}>{buttonText}</Button>);
};

export const asALink = () => {
  const level = getLevelOptions();
  const size = getSizeOptions();
  return (
    <Button
      level={level}
      size={size}
      onClick={handleClick}
      as="a"
      href="https://www.google.com"
      title="Opens in a new tab"
      target="_blank"
      rel="noreferrer"
    >
      Go to Google
    </Button>
  );
};

export const withChevron = () => {
  const buttonText = text('Text', 'Click me');
  const level = getLevelOptions();
  const size = getSizeOptions();
  const direction = select('Chevron', Object.values(ChevronDirections), Chevron.defaultProps.direction);
  return (
    <Button level={level} size={size} onClick={handleClick}>
      {buttonText}
      <Chevron direction={direction} style={{ marginLeft: '0.3em' }} />
    </Button>
  );
};

export const gallery = () => {
  const Wrapper = styled.div`
    display: grid;
    grid-gap: ${theme.spacing.sp3};
    grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  `;
  const Title = styled.h2`
    font-size: ${theme.fontSize.lg};
    margin: 0;
  `;
  const Size = styled.h3`
    margin-bottom: ${theme.spacing.sp1};
    margin-top: ${theme.fontSize.sp2};
  `;
  const buttonText = text('Text', 'Click me');
  return (
    <Wrapper>
      {Object.values(ButtonLevels).map((level) => (
        <div key={level}>
          <Title>{level}</Title>
          {Object.values(ButtonSizes).map((size) => (
            <React.Fragment key={`${level}-${size}`}>
              <Size>{size}</Size>
              <Button onClick={handleClick} level={level} size={size}>{buttonText}</Button>
              {' '}
              <Button onClick={handleClick} level={level} size={size} disabled>{buttonText}</Button>
            </React.Fragment>
          ))}
        </div>
      ))}
    </Wrapper>
  );
};
