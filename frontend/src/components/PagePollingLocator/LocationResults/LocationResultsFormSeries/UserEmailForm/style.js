import styled from 'styled-components'

import { theme as persist } from '@ewarren/persist'
import FormBlocks from 'wr/components/FormBlocks'

import fade from '../fade'

const BSDFormWrapper = styled.div`
  ${FormBlocks.FieldContainer} {
    margin-bottom: ${persist.spacing.sp1};
  }
`

const FormWrapper = styled.div`
  ${fade()}

  h4 {
    margin-bottom: ${persist.spacing.sp4};
  }
`

const Fieldset = styled.fieldset`
  margin-bottom: ${persist.spacing.sp0};
`

const Blocks = {
  BSDFormWrapper,
  FormWrapper,
  Fieldset,
}

export default Blocks
