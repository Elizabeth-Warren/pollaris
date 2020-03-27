import React from 'react';
import renderer from 'react-test-renderer';
import WideHeadline, { WideHeadlineSizes } from './index';

it('renders correctly', () => {
  const tree = renderer
    .create(
      <div>
        {Object.entries(WideHeadlineSizes).reverse().map(([name, value]) => (
          <WideHeadline as="h1" size={value} key={name}>
            {`${name}: `}
            Hello world
          </WideHeadline>
        ))}
      </div>,
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
