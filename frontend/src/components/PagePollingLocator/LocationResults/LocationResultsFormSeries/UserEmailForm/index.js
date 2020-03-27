import React, { Fragment } from 'react'
import get from 'lodash.get'

import { BodyCopy } from '@ewarren/persist'

import LocationSelect from './LocationSelect'
import FormSelect from './FormSelect'
import Blocks from './style'

function LocationResultsForm(props) {
  const {
    availableMethods,
    isFading,
    setStep,
    settings,
    specificSettings,
    setUserDetails,
    selectedLocationId,
    selectedVotingTypeOverride,
    setSelectedVotingTypeOverride,
    setSelectedLocationId,
    votingLocations,
    locationOfVoter,
    userQueryParams,
  } = props
  const firstFieldAvailable = get(availableMethods, [0, 'fields', 'votingType'])

  return (
    <Blocks.FormWrapper isFading={isFading}>
      <BodyCopy size="md" as="h4">
        {specificSettings.sendToSelfFormTitleOverride ||
          settings.sendToSelfFormTitle}
      </BodyCopy>
      {availableMethods.length > 1 && (
        <Fragment>
          <BodyCopy size="md" as="h4">
            {specificSettings.sendToSelfFormVotingTypeText}
          </BodyCopy>
          <Blocks.Fieldset>
            {availableMethods.map(
              ({
                votingType,
                name,
                formLocationSelectText,
                disableSelectionIfNoData,
              }) => (
                <LocationSelect
                  key={votingType}
                  availableMethods={availableMethods}
                  disableSelectionIfNoData={disableSelectionIfNoData}
                  selectedVotingTypeOverride={selectedVotingTypeOverride}
                  setSelectedVotingTypeOverride={setSelectedVotingTypeOverride}
                  locationName={name}
                  selectedLocationId={selectedLocationId}
                  setSelectedLocationId={setSelectedLocationId}
                  votingLocations={votingLocations}
                  votingType={votingType}
                  formLocationSelectText={formLocationSelectText}
                />
              )
            )}
          </Blocks.Fieldset>
        </Fragment>
      )}
      {availableMethods.length === 1 &&
        get(votingLocations, [firstFieldAvailable, 'length'], 0) > 1 && (
          <Fragment>
            <BodyCopy size="md" as="h4">
              {specificSettings.sendToSelfFormLocationSelectText}
            </BodyCopy>
            <FormSelect
              votingLocations={
                selectedVotingType && votingLocations[selectedVotingType]
              }
              selectedLocationId={selectedLocationId}
              setSelectedLocationId={setSelectedLocationId}
              formLocationSelectText={
                availableMethods[0].fields.formLocationSelectText
              }
            />
          </Fragment>
        )}
      <Blocks.BSDFormWrapper>{/* <Form /> */}</Blocks.BSDFormWrapper>
    </Blocks.FormWrapper>
  )
}

export default LocationResultsForm
