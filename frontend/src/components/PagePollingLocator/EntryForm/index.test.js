import React from 'react';
import { mountWithTheme } from 'test/_setup-theme-provider';
import toJson from 'enzyme-to-json';

import EntryForm from './index';

let wrapper;


beforeEach(() => {
  wrapper = mountWithTheme(
    <EntryForm
      title="Form Title"
      description="Form Description"
    >
      <div />
    </EntryForm>,
  );
});


describe('<EntryForm />', () => {
  it('renders <EntryForm />', () => {
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
