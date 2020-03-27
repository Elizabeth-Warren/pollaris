import React from 'react';
import { color, select, text } from '@storybook/addon-knobs';
import Chevron, { ChevronDirections } from '.';
import theme from '../../theme';

export default {
  title: 'Components/Chevron',
  component: Chevron,
};

export const atDifferentSizes = () => {
  const direction = select('Chevron', Object.values(ChevronDirections), Chevron.defaultProps.direction);
  const exampleText = text('Text', 'This is some text.');
  const chevronColor = color('Color');
  return (
    <div>
      <p>
        The chevron sizing and thickness is based on relative font size. Color
        by default is inherited from font color.
      </p>
      {Object.entries(theme.fontSize).map(([name, fontSize]) => (
        <div style={{ fontSize, marginBottom: theme.spacing.sp2 }}>
          <b>{`${name} (${fontSize}): `}</b>
          {exampleText}
          {' '}
          <Chevron direction={direction} color={chevronColor} />
        </div>
      ))}
    </div>
  );
};
