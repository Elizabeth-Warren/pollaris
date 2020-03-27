/* eslint-disable */
import React from 'react';
import BodyCopy, { BodyCopySizes } from '../../components/BodyCopy';
import Headline, { HeadlineSizes } from '../../components/Headline';
import theme from '../../theme';
import useBreakpoint from './index';

export default {
  title: 'Hooks/useBreakpoint',
  parameters: { jest: ['useBreakpoint'] },
};

const Docs = () => (
  <>
    <p>
The
      {' '}
      <code>useBreakpoint</code>
      {' '}
hook takes a breakpoint map, which would be an object of key/value pairs where
the key is the name of the breakpoint and the value is the min-width for that value.
    </p>
    <p>
      The Persist breakpoint map looks like the object below, but any map can be
      passed in to this hook.
    </p>
    <pre>
const breakpoints = {JSON.stringify(theme.screens, null, 2)};
<br /><br />
const {`{ current, isAbove, isBelow }`} = useBreakpoint(breakpoints);
    </pre>
  </>
);

export const current = () => {
  const { current: currentBp } = useBreakpoint(theme.screens);
  return (
    <div>
      <Docs />
      <p>
The
        {' '}
        <code>current</code>
        {' '}
property exposed by
        {' '}
        <code>useBreakpoint</code>
        {' '}
returns the name of the current breakpoint.
      </p>
      <BodyCopy as="p" size={BodyCopySizes.XL}>
Current breakpoint is:
        {' '}
        <b>{currentBp}</b>
      </BodyCopy>
    </div>
  );
};

export const isAbove = () => {
  const { isAbove: isAboveBp } = useBreakpoint(theme.screens);
  return (
    <div>
      <Docs />
      <p>
        <code>isAbove</code>
        {' '}
        returns
        {' '}
        <code>true</code>
        {' '}
        if the current breakpoint
        is above or inclusively
        {' '}
        <em>matching</em>
        {' '}
        a specified breakpoint. Optionally, you
        can disable inslusivity by setting the second argument to
        <code>false</code>
        .
      </p>
      <pre>
const isTabletOrGreater = isAbove('md');
<br />
// => {isAboveBp('md') + ''}
<br /><br />
const isGreaterThanTablet = isAbove('md', false);
<br />
// => {isAboveBp('md', false) + ''}
      </pre>
      {Object.keys(theme.screens).map((bp) => (
        <>
          <p>
            Is above or matching
            {' '}
            <b>{bp}</b>
            :
            {' '}
            {isAboveBp(bp) ? 'true' : 'false'}
          </p>
          <p>
            Is above but not matching
            {' '}
            <b>{bp}</b>
            :
            {' '}
            {isAboveBp(bp, false) ? 'true' : 'false'}
          </p>
        </>
      ))}
    </div>
  );
};

export const isBelow = () => {
  const { isBelow: isBelowBp } = useBreakpoint(theme.screens);
  return (
    <div>
      <Docs />
      <p>
        <code>isBelow</code>
        {' '}
        returns
        {' '}
        <code>true</code>
        {' '}
        if the current breakpoint is below a specified breakpoint. Unlike
        {' '}
        <code>isAbove</code>
, this is
        {' '}
        <em>not</em>
        {' '}
inclusive by default because we want to be building components mobile-first.
        Optionally, you can enable inslusivity by setting the second argument to
        <code>true</code>
        .
      </p>
      <pre>
const isSmallerThanTablet = isBelow('md');
<br />
// => {isBelowBp('md') + ''}
<br /><br />
const isTabletOrSmaller = isBelow('md', true);
<br />
// => {isBelowBp('md', true) + ''}
      </pre>
      {Object.keys(theme.screens).map((bp) => (
        <>
          <p>
            Is below or matching
            {' '}
            <b>{bp}</b>
            :
            {' '}
            {isBelowBp(bp, true) ? 'true' : 'false'}
          </p>
          <p>
            Is below but not matching
            {' '}
            <b>{bp}</b>
            :
            {' '}
            {isBelowBp(bp) ? 'true' : 'false'}
          </p>
        </>
      ))}
    </div>
  );
};

export const withComponent = () => {
  const { current: breakpoint } = useBreakpoint(theme.screens);
  let size = null;
  switch (breakpoint) {
    case '2xl':
    case 'xl':
      size = BodyCopySizes.XL;
      break;
    case 'xs':
    case 'sm':
      size = BodyCopySizes.SM;
      break;
    default:
      size = BodyCopySizes.MD;
  }
  debugger;
  return(
    <div>
      <Headline size={HeadlineSizes.MD}>Code example</Headline>
      <pre>
const {'{ current: breakpoint }'} = useBreakpoint(theme.screens);<br />
let size = null;<br />
switch (breakpoint) {'{'}<br />
{'  '}case '2xl':<br />
{'  '}case 'xl':<br />
{'    '}size = BodyCopySizes.XL;<br />
{'    '}break;<br />
{'  '}case 'xs':<br />
{'  '}case 'sm':<br />
{'    '}size = BodyCopySizes.SM;<br />
{'    '}break;<br />
{'  '}default:<br />
{'    '}size = BodyCopySizes.MD;<br />
{'}'}<br />
return (<br />
{'  <BodyCopy as="p" size={size}>'}<br />
{'    <b>Breakpoint size: {breakpoint}:</b><br />'}<br />
{'    <b>BodyCopy size prop: {size}</b><br />'}<br />
{'    The quick brown fox jumped over the lazy dog.'}<br />
{'  </BodyCopy>'}<br />
);
</pre>
      <Headline size={HeadlineSizes.MD}>Result</Headline>
      <BodyCopy as="p" size={size}>
        <b>Breakpoint size: {breakpoint}</b><br />
        <b>BodyCopy size prop: {size}</b><br />
        The quick brown fox jumped over the lazy dog.
      </BodyCopy>
    </div>
  )
}
