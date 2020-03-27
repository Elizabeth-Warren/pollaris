import React from 'react';
import renderer from 'react-test-renderer';
import VisuallyHidden from './index';

it('renders correctly', () => {
  const tree = renderer
    .create(
      <VisuallyHidden>You can&apos;t see me.</VisuallyHidden>,
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
