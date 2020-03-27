import React from 'react'
import styled from 'styled-components'
import { theme as persist } from '@ewarren/persist'
import get from 'lodash.get'

import FormSelect from '../FormSelect'
import {
  createLocationId,
  getVotingTypefromIdentifier,
} from '../../../utils/locationIdUtils'

const StyledRadio = styled.label`
  ${({ theme }) => theme.fonts.regularBookBold}
  font-size: ${persist.spacing.sp2};
  ${({ disabled }) => disabled && 'opacity: 50%'};
  
  input {
    margin-right: ${persist.spacing.sp1};
  }
`

const RadioSelectGroup = styled.div`
  margin-bottom: ${persist.spacing.sp1};
`

function LocationSelect(props) {
  const {
    availableMethods,
    selectedVotingTypeOverride,
    setSelectedVotingTypeOverride,
    locationName,
    selectedLocationId,
    setSelectedLocationId,
    votingLocations,
    votingType,
    formLocationSelectText,
    disableSelectionIfNoData,
  } = props

  const isSelectedVotingType =
    votingType ===
    (selectedVotingTypeOverride ||
      (selectedLocationId && getVotingTypefromIdentifier(selectedLocationId)))

  return availableMethods.length === 1 ? (
    <FormSelect
      votingLocations={votingLocations[votingType]}
      selectedLocationId={selectedLocationId}
    />
  ) : (
    <RadioSelectGroup>
      <StyledRadio
        disabled={disableSelectionIfNoData && !votingLocations[votingType]}
      >
        <input
          type="radio"
          name={votingType}
          disabled={disableSelectionIfNoData && !votingLocations[votingType]}
          onChange={() =>
            votingLocations[votingType]
              ? setSelectedLocationId(
                  createLocationId(
                    votingType,
                    get(votingLocations, [votingType, 0, 'location_id'])
                  )
                )
              : setSelectedVotingTypeOverride(votingType)
          }
          checked={isSelectedVotingType}
        />
        {locationName}
      </StyledRadio>
      {isSelectedVotingType &&
        !selectedVotingTypeOverride &&
        get(votingLocations, [votingType, 'length']) > 1 && (
          <FormSelect
            votingType={votingType}
            votingLocations={votingLocations[votingType]}
            selectedLocationId={selectedLocationId}
            setSelectedLocationId={setSelectedLocationId}
            formLocationSelectText={formLocationSelectText}
          />
        )}
    </RadioSelectGroup>
  )
}

export default LocationSelect
