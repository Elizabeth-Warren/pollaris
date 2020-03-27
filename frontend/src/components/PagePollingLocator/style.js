import styled, { css } from 'styled-components'

import { theme as persist } from '@ewarren/persist'
import createBreakpointStyles from 'wr/styles/createBreakpointStyles'

const Container = styled.div`
  margin: auto;
  max-width: ${({ theme }) => theme.max.content};
  min-height: 100vh;
  padding: 0 ${persist.spacing.sp3};

  ${({ theme }) =>
    createBreakpointStyles(
      theme.breakpoints.tablet,
      css`
        margin-top: ${persist.spacing.sp6};
        max-width: ${theme.max.section};
        padding: 0 ${persist.spacing.sp4};
      `
    )}

  ${({ theme }) =>
    createBreakpointStyles(
      theme.breakpoints.desktopSmall,
      css`
        margin-top: ${persist.spacing.sp6};
        max-width: ${theme.max.section};
      `
    )}

  ${({ theme }) =>
    createBreakpointStyles(
      theme.breakpoints.desktopMedium,
      css`
        margin-top: 0;
      `
    )}
`

const RouterBlocks = {
  Container,
}

export default RouterBlocks
