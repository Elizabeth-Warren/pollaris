import React from 'react';
import renderer from 'react-test-renderer';
import Headline, { HeadlineSizes } from './index';

it('renders correctly', () => {
  const tree = renderer
    .create(
      <div>
        {Object.entries(HeadlineSizes).reverse().map(([name, value]) => (
          <Headline as="h1" size={value} key={name}>
            {`${name}: `}
            Hello world
          </Headline>
        ))}
      </div>,
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
