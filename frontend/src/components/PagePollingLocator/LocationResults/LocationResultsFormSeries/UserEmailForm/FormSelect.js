import React from 'react'
import styled from 'styled-components'
import FormBlocks, {
  LIGHT_COLOR_SCHEME,
  FULL_WIDTH,
} from 'wr/components/FormBlocks'
import { theme as persist } from '@ewarren/persist'

import {
  createLocationId,
  getPollarisIdfromIdentifier,
} from '../../utils/locationIdUtils'

const field = {
  type: 'select',
  display: {
    colorScheme: LIGHT_COLOR_SCHEME,
    width: FULL_WIDTH,
  },
}

const SelectContainer = styled(FormBlocks.FieldSelectContainer)`
  margin-right: 0;
  margin-top: ${persist.spacing.sp1};
  margin-bottom: ${persist.spacing.sp1};
`

const FieldSelect = styled(FormBlocks.FieldSelect)`
  width: 100%;
  padding-right: ${persist.spacing.sp3};
`

function FormSelect(props) {
  const {
    votingType,
    votingLocations,
    selectedLocationId,
    setSelectedLocationId,
    formLocationSelectText,
  } = props

  return (
    <SelectContainer field={field}>
      <FormBlocks.FieldLabelRow>
        <FormBlocks.FieldLabel field={field}>
          {formLocationSelectText}
        </FormBlocks.FieldLabel>
      </FormBlocks.FieldLabelRow>
      <FieldSelect
        field={field}
        onChange={({ target }) =>
          setSelectedLocationId(createLocationId(votingType, target.value))
        }
        value={getPollarisIdfromIdentifier(selectedLocationId)}
      >
        {(votingLocations || []).map(value => (
          <option key={value.location_id} value={value.location_id}>
            {value.location_name}
          </option>
        ))}
      </FieldSelect>
    </SelectContainer>
  )
}

export default FormSelect
