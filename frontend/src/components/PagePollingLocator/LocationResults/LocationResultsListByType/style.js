import styled, { css } from 'styled-components'

import { theme as persist } from '@ewarren/persist'
import chevron from 'wr/styles/icons/chevron'
import { smallButton } from 'wr/styles/button'
import createBreakpointStyles from 'wr/styles/createBreakpointStyles'
import { link } from 'wr//styles/typography'

const PollingTypeContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.offWhite};
  padding: ${persist.spacing.sp3};
  margin-top: ${persist.spacing.sp6};
  margin-bottom: ${persist.spacing.sp3};
`

const PollingTypeBody = styled.div`
  color: ${({ theme }) => theme.colors.navy};
  margin-bottom: ${persist.spacing.sp3};
`

const HeadlineWrapper = styled.div`
  border-bottom: 2px solid ${({ theme }) => theme.colors.navy};
  margin-bottom: ${persist.spacing.sp2};
  line-height: ${persist.spacing.sp3};
`

const Headline = styled.h3`
  line-height: ${persist.spacing.sp3};
  color: ${({ theme }) => theme.colors.navy};
`

const AnchorText = styled.a`
  cursor: pointer;
  font-size: ${persist.fontSize.lg};
  color: ${({ theme }) => theme.colors.navy};

  &:hover {
    span {
      border-color: ${({ theme }) => theme.colors.red};
    }
  }

  span {
    border-color: ${({ theme }) => theme.colors.liberty};
  }
`

const SeeMoreTrigger = styled.button`
  color: ${({ theme }) => theme.colors.navy};
  ${({ theme }) => theme.fonts.regularBookBold}

  span {
    margin-left: ${persist.spacing.sp1};
  }
`

const RulesHeading = styled.h5`
  ${({ theme }) => theme.fonts.regularBookBold}
`

const CallsToAction = styled.div`
  margin-top: ${persist.spacing.sp3};
  margin-bottom: ${persist.spacing.sp3};

  p a {
    ${({ theme }) => link(theme.colors.liberty)}
  }

  p + ul {
    margin-top: ${persist.spacing.sp2};
  }

  ul a {
    color: ${({ theme }) => theme.colors.navy};
    ${({ theme }) => theme.fonts.regularBookBold}
    ${chevron('red', 6)}
  }
`

const FallbackCard = styled.div`
  padding: ${persist.spacing.sp2} ${persist.spacing.sp1};
  background-color: white;
  margin-top: ${persist.spacing.sp1};
  text-align: center;

  ${({ theme }) =>
    createBreakpointStyles(
      theme.breakpoints.tablet,
      css`
        padding: ${persist.spacing.sp6};
      `
    )}
`

const FallbackCardTextContainer = styled.div`
  margin-bottom: ${persist.spacing.sp2};

  ${({ theme }) =>
    createBreakpointStyles(
      theme.breakpoints.tablet,
      css`
        padding: 0 ${persist.spacing.sp4};
      `
    )}
`

const FallbackCopy = styled.p`
  color: ${({ theme }) => theme.colors.navy};
  line-height: 1.3;
`

const Button = styled.button`
  ${({ theme }) =>
    smallButton(
      theme.colors.white,
      theme.colors.navy,
      theme.colors.navy,
      theme.colors.liberty
    )} 
  border-color: ${({ theme }) => theme.colors.navy};
  width: fit-content;

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.liberty};
  }
`

const VoteByMailButton = styled(Button)`
  margin-bottom: ${persist.spacing.sp4};
`

const TextLinkWrapper = styled.div`
  margin-bottom: ${persist.spacing.sp1};
`

const AnchorList = styled.div`
  margin-bottom: ${persist.spacing.sp4};
`

const SubAnchorDescription = styled.p`
  color: ${({ theme }) => theme.colors.navy};
  ${({ theme }) => theme.fonts.regularBook}
`

const SeeMoreWrapper = styled.div`
  a {
    cursor: pointer;
  }
`

const Blocks = {
  PollingTypeContainer,
  PollingTypeBody,
  HeadlineWrapper,
  Headline,
  AnchorList,
  AnchorText,
  SubAnchorDescription,
  SeeMoreTrigger,
  SeeMoreWrapper,
  RulesHeading,
  CallsToAction,
  FallbackCard,
  FallbackCardTextContainer,
  FallbackCopy,
  Button,
  VoteByMailButton,
  TextLinkWrapper,
}

export default Blocks
