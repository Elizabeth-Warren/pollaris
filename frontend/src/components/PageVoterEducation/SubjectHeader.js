import React from 'react';
import styled, { css } from 'styled-components';
import { BodyCopy, theme as persist } from '@ewarren/persist';

import createBreakpointStyles from 'wr/styles/createBreakpointStyles';

const HeaderWrapper = styled.div`
  color: ${({ theme }) => theme.colors.navy};
  border-bottom: 2px solid ${({ theme }) => theme.colors.navy};
  margin-bottom: ${persist.spacing.sp4};
`;

const BodyHeader = styled.span`
  color: ${({ theme }) => theme.colors.navy};
  font-size: ${persist.fontSize.xl};

  ${({ theme }) => createBreakpointStyles(theme.breakpoints.desktopSmall, css`
    font-size: ${persist.fontSize['2xl']};
  `)}
`;

function SubjectHeader({ children }) {
  return (
    <HeaderWrapper>
      <BodyCopy as={BodyHeader} size="xl" weight="bold">
        {children}
      </BodyCopy>
    </HeaderWrapper>
  );
}

export default SubjectHeader;
