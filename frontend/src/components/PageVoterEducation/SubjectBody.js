import React from 'react';
import styled, { css } from 'styled-components';
import { theme as persist } from '@ewarren/persist';

import compileMarkdown from 'wr/utils/compileMarkdown';
import createBreakpointStyles from 'wr/styles/createBreakpointStyles';
import chevron from 'wr/styles/icons/chevron';

const SubjectBodyWrapper = styled.div`
  font-size: ${persist.fontSize.md};

  ${({ theme }) => createBreakpointStyles(theme.breakpoints.desktopSmall, css`
    font-size: ${persist.fontSize.xl};
  `)}
  color: ${({ theme }) => theme.colors.navy};

  p, ul, ol {
    margin-bottom: ${persist.spacing.sp6};
  }

  ul {
    font-weight: 700;
  }

  a {
    ${({ theme }) => theme.fonts.regularBookBold}
    color: ${({ theme }) => theme.colors.navy};
    ${chevron('red', 10)}
  }

  h2 {
    ${({ theme }) => theme.fonts.regularBookBold}
  }

  h3 {
    margin-bottom: ${persist.spacing.sp1};
  }

  ol {
    margin-left: ${persist.spacing.sp4};
    ${({ theme }) => createBreakpointStyles(theme.breakpoints.desktopSmall, css`
      margin-left: ${persist.spacing.sp8};
    `)}

    li {
      margin-bottom: ${persist.spacing.sp2};
      font-size: ${persist.fontSize.base};

      ${({ theme }) => createBreakpointStyles(theme.breakpoints.desktopSmall, css`
        font-size: ${persist.fontSize.md};
      `)}
    }
  }
`;

function SubjectBody(props) {
  const { children } = props;

  return (
    <SubjectBodyWrapper>
      {compileMarkdown()(children || '')}
    </SubjectBodyWrapper>
  );
}

export default SubjectBody;
