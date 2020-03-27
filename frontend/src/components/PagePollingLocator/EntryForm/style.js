import styled, { css } from 'styled-components'
import createBreakpointStyles from 'wr/styles/createBreakpointStyles'
import SearchBarBlocks from 'wr/components/SearchBarBlocks'

import { theme as persist } from '../../persist'

const HeaderWrapper = styled.div`
  text-align: center;
  margin: 64px 0;
  h1 {
    color: ${({ theme }) => theme.colors.navy};
  }
`

const FormSection = styled.div`
  margin: 12px 0px 24px 0px;
  max-width: ${({ theme }) => theme.max.content};

  ${({ theme }) =>
    createBreakpointStyles(
      theme.breakpoints.tablet,
      css`
        padding: 0;
        max-width: ${theme.max.content};
        margin: 0 auto;
      `
    )}
`

const LowerCTA = styled.div`
  margin: 80px 0;
  text-align: center;

  p {
    color: ${({ theme }) => theme.colors.navy};
    line-height: 1.3;
  }

  a {
    color: ${({ theme }) => theme.colors.navy};
    ${({ theme }) => theme.fonts.regularBookBold};
  }
`

const FormHeader = styled.div`
  text-align: center;
  margin-bottom: 32px;

  h2 {
    ${({ theme }) => theme.fonts.regularBookBold}
  }
`

const EntryFormContainer = styled.div`
  border: ${persist.spacing.sp2} solid ${({ theme }) => theme.colors.liberty};
  color: ${({ theme }) => theme.colors.navy};
  padding: ${persist.spacing.sp4} ${persist.spacing.sp2};

  h4 {
    margin-bottom: ${persist.spacing.sp2};
  }

  ${SearchBarBlocks.FieldBlock} {
    margin-right: 0;
  }

  ${({ theme }) =>
    createBreakpointStyles(
      theme.breakpoints.tablet,
      css`
        padding: ${persist.spacing.sp4} ${persist.spacing.sp8};
      `
    )}
`

const EntryFormBlocks = {
  HeaderWrapper,
  FormSection,
  FormHeader,
  EntryFormContainer,
  LowerCTA,
}

export default EntryFormBlocks
