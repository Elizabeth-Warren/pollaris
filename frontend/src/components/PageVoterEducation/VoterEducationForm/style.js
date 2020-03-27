import styled, { css } from 'styled-components'
import { theme as persist } from '@ewarren/persist'
import { smallButton } from 'wr/styles/button'
import createBreakpointStyles from 'wr/styles/createBreakpointStyles'

const FormContainer = styled.div`
  border: 18px solid ${({ theme }) => theme.colors.liberty};
  padding: ${persist.spacing.sp2};
  ${({ theme }) =>
    createBreakpointStyles(
      theme.breakpoints.desktopSmall,
      css`
        padding: ${persist.spacing.sp4} ${persist.spacing.sp6};
      `
    )}
`

const FormWrapper = styled.div`
  ${({ theme }) =>
    createBreakpointStyles(
      theme.breakpoints.desktopSmall,
      css`
        margin: ${persist.spacing.sp3} ${persist.spacing.sp8};
      `
    )}

  p {
    color: ${({ theme }) => theme.colors.navy};
  }
`

const FormHeader = styled.div`
  text-align: center;
  margin-top: ${persist.spacing.sp2};
  margin-bottom: ${persist.spacing.sp2};
`

const FormHeaderText = styled.h2`
  font-size: ${persist.fontSize.md};

  ${({ theme }) =>
    createBreakpointStyles(
      theme.breakpoints.desktopSmall,
      css`
        font-size: ${persist.fontSize.xl};
      `
    )}
`

const Fieldset = styled.fieldset`
  margin-bottom: ${persist.spacing.sp0};
`

const PhoneField = styled.div`
  width: auto;
  flex: 0 0 calc(50% - 156px);
`

const FormSubmitButton = styled.button`
  ${({ theme }) =>
    smallButton(theme.colors.liberty, theme.colors.navy, theme.colors.navy)}
  margin-bottom: 28px;
  margin-top: 22px;
  width: 100%;

  ${({ theme }) =>
    createBreakpointStyles(
      theme.breakpoints.tablet,
      css`
        width: 132px;
      `
    )}
`

const Blocks = {
  FormContainer,
  FormHeader,
  FormHeaderText,
  FormWrapper,
  Fieldset,
  PhoneField,
  FormSubmitButton,
}

export default Blocks
