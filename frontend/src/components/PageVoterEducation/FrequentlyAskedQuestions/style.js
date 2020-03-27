import styled, { css } from 'styled-components';
import { theme as persist } from '@ewarren/persist';

import { calloutTitle, calloutBanner } from 'wr/styles/headings';
import chevron, { downChevron, upChevron } from 'wr/styles/icons/chevron';
import createBreakpointStyles from 'wr/styles/createBreakpointStyles';

const QuestionsSection = styled.div`
  background-color: ${({ theme }) => theme.colors.white};
  padding: ${persist.spacing.sp2};

  ${({ theme }) => createBreakpointStyles(theme.breakpoints.tablet, css`
    padding: ${persist.spacing.sp6} ${persist.spacing.sp8};
  `)}
`;

const Header = styled.h1`
  ${calloutTitle}
  color: ${({ theme }) => theme.colors.navy};
`;

const Banner = styled.div`
  ${calloutBanner}
  width: 100%;
  border-bottom-color: ${({ theme }) => theme.colors.navy};
  margin-bottom: 0;
`;

const AccordionRow = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
`;

const RowContainer = styled.h3`
  width: 100%;
`;

const PillarTitle = styled.span`
  color: ${({ theme }) => theme.colors.navy};
  font-size: ${persist.fontSize.md};
  max-width: 90%;
  display: block;

  ${({ theme }) => createBreakpointStyles(theme.breakpoints.tablet, css`
    font-size: ${persist.fontSize.lg};
  `)}
`;

const PillarChevron = styled.span`
  display: block;
  top: -2px;
  ${chevron('navy', 9, false, 4)}
  ${({ isActive }) => (isActive ? upChevron : downChevron)};

  ${({ theme }) => createBreakpointStyles(theme.breakpoints.tablet, css`
    ${chevron('navy', 15, false, 4)}
    ${({ isActive }) => (isActive ? upChevron : downChevron)};
  `)}
`;

const HeaderButton = styled.button`
  width: 100%;
  cursor: pointer;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: ${persist.spacing.sp4} ${persist.spacing.sp2} ${persist.spacing.sp4} 0;
  border-top: solid 2px ${({ theme, isFirst }) => (isFirst ? 'none' : theme.colors.liberty)};
  border-bottom: ${({ theme, isLast, isActive }) => isLast && !isActive && `solid 2px ${theme.colors.liberty}`};
  text-align: left;

  &:hover {
    ${PillarTitle} {
      font-weight: ${persist.fontWeight.bold};
      letter-spacing: -0.02em;
    }
    ${PillarChevron}::after {
      color: ${({ theme }) => theme.colors.red};
    }
  }
`;

const PillarContentContainer = styled.div`
  display: flex;
  width: 100%;
  padding: ${persist.spacing.sp4};
  max-width: ${({ theme }) => `calc(${theme.max.section} - 70px)`};
  margin-right: auto;
  margin-left: auto;

  ${({ theme }) => createBreakpointStyles(theme.breakpoints.tablet, css`
    padding: ${persist.spacing.sp4} ${theme.spacing.contentGutter} ${persist.spacing.sp6};
    flex-direction: row;
  `)}
`;

const PillarContent = styled.div`
  width: 100%;
  display: block;

  h4 {
    font-size: ${persist.fontSize.md};
  }

  ol {
    margin-left: ${persist.spacing.sp8};
    font-size: ${persist.fontSize.md};

    li {
      margin-bottom: ${persist.spacing.sp2};
    }
  }
`;

const Blocks = {
  QuestionsSection,
  Header,
  Banner,
  AccordionRow,
  RowContainer,
  HeaderButton,
  PillarTitle,
  PillarChevron,
  PillarContentContainer,
  PillarContent,
};

export default Blocks;
