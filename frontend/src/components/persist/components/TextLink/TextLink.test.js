import React from 'react';
import renderer from 'react-test-renderer';
import startCase from 'lodash/startCase';
import TextLink, { TextLinkLevels } from './index';

it('renders correctly', () => {
  const tree = renderer
    .create(
      <div>
        {Object.values(TextLinkLevels).map((level) => (
          <p key={level}>
            <TextLink level={level} href="#">
              { startCase(level) }
              {' '}
              Link Style
            </TextLink>

          </p>
        ))}
      </div>,
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
