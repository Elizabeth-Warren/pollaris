import React from 'react';
import renderer from 'react-test-renderer';
import BodyCopy, { BodyCopySizes } from './index';

it('renders correctly', () => {
  const tree = renderer
    .create(
      <div>
        {Object.entries(BodyCopySizes).reverse().map(([name, value]) => (
          <BodyCopy as="p" size={value} key={name}>
            {`${name}: `}
            Hello world
          </BodyCopy>
        ))}
      </div>,
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
