import React from 'react';
import { action } from '@storybook/addon-actions';
import { select, text } from '@storybook/addon-knobs';
import startCase from 'lodash/startCase';
import TextLink, { TextLinkLevels } from './index';

const handleClick = (e) => {
  e.preventDefault();
  action('link clicked');
};

export default {
  title: 'Components/TextLink',
  component: TextLink,
  parameters: { jest: ['TextLink'] },
};

export const withKnobs = () => {
  const linkText = text('Text', 'Click me');
  const level = select('Level', Object.values(TextLinkLevels), TextLink.defaultProps.level);
  return (<TextLink level={level} onClick={handleClick} href="#">{linkText}</TextLink>);
};

export const gallery = () => (
  <div>
    {Object.values(TextLinkLevels).map((level) => (
      <p key={level}>
        <TextLink level={level} onClick={handleClick} href="#">
          { startCase(level) }
          {' '}
          Link Style
        </TextLink>

      </p>
    ))}
  </div>
);
