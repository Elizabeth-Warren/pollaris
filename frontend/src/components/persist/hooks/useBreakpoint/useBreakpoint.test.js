/* eslint-disable react/prop-types */
import React from 'react';
import { Context as ResponsiveContext } from 'react-responsive';
import { mount } from 'enzyme';
import theme from '../../theme';
import useBreakpoint from './index';

describe('current', () => {
  const CurrentBP = () => {
    const { current } = useBreakpoint(theme.screens);
    return (<div>{current}</div>);
  };
  const screensTable = Object.entries({ default: '0px', ...theme.screens });
  test.each(screensTable)('returns \'%s\' when screen width is \'%s\'', (bpName, screenWidth) => {
    const wrapper = mount(
      <ResponsiveContext.Provider value={{ width: parseInt(screenWidth, 10) }}>
        <CurrentBP />
      </ResponsiveContext.Provider>,
    );
    expect(wrapper.text()).toBe(bpName);
  });
});

describe(`isAbove inclusively at ${theme.screens.md}`, () => {
  const IsAboveBP = ({ bpName }) => {
    const { isAbove } = useBreakpoint(theme.screens);
    return (<div>{isAbove(bpName) ? 'true' : 'false'}</div>);
  };
  const screensTable = Object.entries(theme.screens)
    .map(([name, value]) => [parseInt(value, 10) <= parseInt(theme.screens.md, 10), name]);
  test.each(screensTable)('returns \'%s\' when breakpoint argument is \'%s\'', (expected, bpName) => {
    const wrapper = mount(
      <ResponsiveContext.Provider value={{ width: 768 }}>
        <IsAboveBP bpName={bpName} />
      </ResponsiveContext.Provider>,
    );
    expect(wrapper.text()).toBe(`${expected}`);
  });
});

describe(`isBelow at ${theme.screens.md}`, () => {
  const IsBelowBP = ({ bpName }) => {
    const { isBelow } = useBreakpoint(theme.screens);
    return (<div>{isBelow(bpName) ? 'true' : 'false'}</div>);
  };
  const screensTable = Object.entries(theme.screens)
    .map(([name, value]) => [parseInt(value, 10) > parseInt(theme.screens.md, 10), name]);
  test.each(screensTable)('returns \'%s\' when breakpoint argument is \'%s\'', (expected, bpName) => {
    const wrapper = mount(
      <ResponsiveContext.Provider value={{ width: 768 }}>
        <IsBelowBP bpName={bpName} />
      </ResponsiveContext.Provider>,
    );
    expect(wrapper.text()).toBe(`${expected}`);
  });
});
