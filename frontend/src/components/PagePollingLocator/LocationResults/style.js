import styled, { css } from 'styled-components'
import { theme as persist } from '@ewarren/persist'

import { link } from 'wr/styles/typography'
import { smallButton } from 'wr/styles/button'
import createBreakpointStyles from 'wr/styles/createBreakpointStyles'

const HeadlineWrapper = styled.div`
  border-bottom: ${persist.spacing.sp0} solid
    ${({ theme }) => theme.colors.navy};
  margin: auto;
  max-width: ${({ theme }) => theme.max.section};
  margin-bottom: ${persist.spacing.sp3};

  h1 {
    margin-bottom: ${persist.spacing.sp1};
  }
`

const BackButtonWrapper = styled.div`
  margin: ${persist.spacing.sp2} 0;

  ${({ theme }) =>
    createBreakpointStyles(
      theme.breakpoints.desktopSmall,
      css`
        margin-top: 0;
      `
    )}
`

const BackButton = styled.button`
  ${({ theme }) => theme.fonts.regularBook}
  color: ${({ theme }) => theme.colors.navy};
  font-size: ${persist.fontSize.sm};
  cursor: pointer;
  margin-bottom: ${persist.spacing.sp2};

  &:hover {
    span {
      border-color: ${({ theme }) => theme.colors.red};
      left: -${persist.spacing.sp0};
      border-color: ${({ theme }) => theme.colors.red};
    }
  }

  span {
    margin-right: ${persist.spacing.sp0};
    transition: all 150ms ease-in-out;
  }
`

const ResultTextSection = styled.div`
  display: flex;
  margin-bottom: ${persist.spacing.sp2};
  color: ${({ theme }) => theme.colors.navy};
`

const FlexColumn = styled.div`
  flex: 1;
`

const FlexContainer = styled.div`
  display: flex;
  flex-direction: column;

  ${({ theme }) =>
    createBreakpointStyles(
      theme.breakpoints.desktopSmall,
      css`
        flex-direction: row;
        justify-content: space-between;
      `
    )}
`

const ResultSection = styled.div`
  ${({ theme }) =>
    createBreakpointStyles(
      theme.breakpoints.desktopSmall,
      css`
        margin-right: ${persist.spacing.sp4};
        flex: 0 0 calc(66.66% - 24px);
        padding-right: ${persist.spacing.sp4};
      `
    )}

  h1 {
    color: ${({ theme }) => theme.colors.navy};
    position: relative;
    margin-bottom: ${persist.spacing.sp1};
    font-size: ${({ theme }) => theme.fontSize.body.desktop};

    ${({ theme }) =>
      createBreakpointStyles(
        theme.breakpoints.tablet,
        css`
          font-size: ${persist.fontSize['2xl']};
        `
      )}
  }

  h4 {
    color: ${({ theme }) => theme.colors.navy};
    font-size: ${({ theme }) => theme.fontSize.body.mobile};

    ${({ theme }) =>
      createBreakpointStyles(
        theme.breakpoints.tablet,
        css`
          font-size: ${theme.fontSize.body.desktop};
        `
      )}
  }
`

const SubMapCta = styled.div`
  margin-top: 36px;
  margin-bottom: ${persist.spacing.sp3};
  text-align: center;

  ${({ theme }) =>
    createBreakpointStyles(
      theme.breakpoints.desktopSmall,
      css`
        text-align: left;
      `
    )}
`

const MapWrapper = styled.div`
  ${({ theme }) =>
    createBreakpointStyles(
      theme.breakpoints.desktopSmall,
      css`
        width: 70%;
      `
    )}
`

const BoldText = styled.h5`
  ${({ theme }) => theme.fonts.regularBookBold}
`

const ResultHeading = styled.h5`
  margin-bottom: ${persist.spacing.sp0};
`

const TextLink = styled.a`
  color: ${({ theme }) => theme.colors.navy};
`

const StyledHeadline = styled.h1`
  color: ${({ theme }) => theme.colors.navy};
  margin-bottom: ${persist.spacing.sp2};
`

const HeadlineContainer = styled.div`
  border-bottom: ${persist.spacing.sp0} solid
    ${({ theme }) => theme.colors.navy};
  margin-bottom: ${persist.spacing.sp3};

  ${({ theme }) =>
    createBreakpointStyles(
      theme.breakpoints.tablet,
      css`
        border-bottom: none;
        margin-bottom: ${persist.spacing.sp0};
      `
    )}
`

const FixedFooter = styled.div`
  position: fixed;
  background-color: ${persist.colors.liberty};
  left: 0;
  bottom: 0;
  width: 100%;
  display: flex;
  height: 56px;
  z-index: 1;

  ${({ theme }) =>
    createBreakpointStyles(
      theme.breakpoints.desktopSmall,
      css`
        display: none;
      `
    )}
`

const FixedFooterSmallButtonSection = styled.div`
  width: 96px;
  background-color: ${persist.colors.navy};
  color: ${({ theme }) => theme.colors.white};
  text-align: center;
  display: block;
`

const SmallText = styled.span`
  display: block;
  font-size: ${persist.fontSize.xs};
  ${({ theme }) => theme.fonts.regularBook}
`

const StyledButton = styled.button`
  ${({ theme }) =>
    smallButton(
      theme.colors.liberty,
      theme.colors.navy,
      theme.colors.navy,
      theme.colors.liberty
    )}
  width: 100%;
  height: 100%;

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.liberty};
  }
`

const StyledButtonSmall = styled.button`
  font-size: 24px;
  background-color: ${({ theme }) => theme.colors.navy};
`

const SmallTextWhite = styled(SmallText)`
  color: ${({ theme }) => theme.colors.white};
`

const SubHeader = styled.h5`
  color: ${({ theme }) => theme.colors.navy};
  font-size: ${persist.fontSize.md};
  a {
    ${({ theme }) => link(theme.colors.liberty)}
  }
`

const LocationResultsBlocks = {
  BackButton,
  BackButtonWrapper,
  ResultHeading,
  BoldText,
  HeadlineWrapper,
  MapWrapper,
  ResultTextSection,
  ResultSection,
  FlexContainer,
  FlexColumn,
  SubHeader,
  SubMapCta,
  TextLink,
  StyledButton,
  SmallTextWhite,
  StyledButtonSmall,
  FixedFooter,
  FixedFooterSmallButtonSection,
  HeadlineContainer,
  StyledHeadline,
}

export default LocationResultsBlocks
