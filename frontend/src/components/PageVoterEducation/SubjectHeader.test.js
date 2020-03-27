import React from 'react';
import { mountWithTheme } from 'test/_setup-theme-provider';
import toJson from 'enzyme-to-json';

import SubjectHeader from './SubjectHeader';

let wrapper;

beforeEach(() => {
  wrapper = mountWithTheme(
    <SubjectHeader>
      Voting On Primary Day
    </SubjectHeader>,
  );
});


describe('<SubjectHeader />', () => {
  it('renders <SubjectHeader />', () => {
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
