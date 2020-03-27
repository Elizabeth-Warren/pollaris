import styled, { css } from 'styled-components';
import { theme as persist } from '@ewarren/persist';

import { calloutTitle, calloutBanner } from 'wr/styles/headings';
import createBreakpointStyles from 'wr/styles/createBreakpointStyles';
import chevron from 'wr/styles/icons/chevron';
import { smallButton, mediumButton } from 'wr/styles/button';

const LargeHeadline = styled.h1`
  font-size: ${persist.fontSize['2xl']};

  ${({ theme }) => createBreakpointStyles(theme.breakpoints.tablet, css`
    font-size: ${persist.fontSize['5xl']};
  `)}
`;

const MediumHeadline = styled.h1`
  font-size: ${persist.fontSize['2xl']};

  ${({ theme }) => createBreakpointStyles(theme.breakpoints.tablet, css`
    font-size: ${persist.fontSize['4xl']};
  `)}
`;

const ChevronPointer = styled.a`
  ${({ theme }) => theme.fonts.regularBookBold}
  color: ${({ theme }) => theme.colors.navy};
  ${chevron('navy', 5, false, 3, undefined, 'red')}
  margin-top: ${persist.spacing.sp3};
`;


const PageContainer = styled.div`
  padding: ${persist.spacing.sp3};
  max-width: ${({ theme }) => theme.max.section};
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  margin-bottom: ${persist.spacing.sp8};
  color: ${({ theme }) => theme.colors.navy};
  flex-direction: column;

  ${({ theme }) => createBreakpointStyles(theme.breakpoints.desktopSmall, css`
    flex-direction: row;
  `)}
`;

const HeaderColumn = styled.div`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.lighterLiberty};
  padding: 48px 24px;
  
  ${({ theme }) => createBreakpointStyles(theme.breakpoints.desktopSmall, css`
    padding: ${persist.spacing.sp6};
  `)}
`;

const TitleHeaderColumn = styled(HeaderColumn)`
  text-align: center;
  background-color: ${({ theme }) => theme.colors.liberty};

  ${({ theme }) => createBreakpointStyles(theme.breakpoints.desktopSmall, css`
    text-align: left;
  `)}
`;

const HeadlineButton = styled.a`
  ${({ theme }) => smallButton(theme.colors.red, theme.colors.white, theme.colors.navy, theme.colors.navy)}

  ${({ theme }) => createBreakpointStyles(theme.breakpoints.tablet, css`
    ${mediumButton(theme.colors.red, theme.colors.white, theme.colors.navy, theme.colors.navy)}
  `)}
`;

const HeadlineButtonWrapper = styled.div`
  margin-top: ${persist.spacing.sp4};
  text-align: center;

  ${({ theme }) => createBreakpointStyles(theme.breakpoints.desktopSmall, css`
    text-align: left;
  `)}
`;

const Anchor = styled.div`
  padding: ${persist.spacing.sp3} 0;
  border-bottom: 2px solid ${({ theme }) => theme.colors.liberty};
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.navy};

  &:hover {
    .anchor-text {
      font-weight: ${persist.fontWeight.bold};
    }

    .chevron {
      color: ${({ theme }) => theme.colors.red};
    }
  }

  .chevron {
    color: ${({ theme }) => theme.colors.liberty};
    font-size: ${persist.fontSize.xl};
  }
`;

const AnchorTitle = styled.div`
  flex: 1;
`;

const RequirementAnchor = styled.div`
  margin-top: ${persist.spacing.sp3};
`;

const VoteTypeHeading = styled.h2`
  color: ${({ theme }) => theme.colors.navy};
`;

const HeadlineWrapper = styled.div`
  ${calloutBanner}
  border-bottom-color: ${({ theme }) => theme.colors.navy};
  margin-bottom: 0;
`;

const Headline = styled.h2`
  ${calloutTitle}
`;

const Subject = styled.div`
  padding-top: ${persist.spacing.sp8};
`;

const VoterRegistrationSection = styled.div`
  background-color: ${({ theme }) => theme.colors.lighterLiberty};
  padding-bottom: 128px;
`;

const Blocks = {
  ChevronPointer,
  LargeHeadline,
  MediumHeadline,
  PageContainer,
  Header,
  HeaderColumn,
  TitleHeaderColumn,
  Headline,
  HeadlineButton,
  HeadlineButtonWrapper,
  HeadlineWrapper,
  Anchor,
  AnchorTitle,
  RequirementAnchor,
  Subject,
  VoterRegistrationSection,
  VoteTypeHeading,
};

export default Blocks;
