import React from 'react';
import renderer from 'react-test-renderer';
import Button, { ButtonLevels, ButtonSizes } from './index';

it('renders correctly', () => {
  const tree = renderer
    .create(
      <div>
        {Object.values(ButtonLevels).map((level) => (
          <div key={level}>
            {Object.values(ButtonSizes).map((size) => (
              <React.Fragment key={`${level}-${size}`}>
                <Button level={level} size={size}>Click me</Button>
                {' '}
                <Button level={level} size={size} disabled>Click me</Button>
              </React.Fragment>
            ))}
          </div>
        ))}
      </div>,
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
