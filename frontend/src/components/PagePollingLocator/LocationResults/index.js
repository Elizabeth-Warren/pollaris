import React, { useState, useEffect, Fragment } from 'react'
import queryString from 'query-string'
import { lookup } from '@ewarren/unitedstatesofamerica'

import useSmoothScrollAndFocus from 'wr/hooks/useSmoothScrollAndFocus'

import { Headline, Chevron, BodyCopy } from '../../persist'

import makeSourcedLink from '../../../utils/localePath'
import replaceTemplateVars from '../../../utils/replaceTemplateVars'
import compileMarkdown from '../../../utils/compileMarkdown'
import Blocks from './style'
import LocationResultsDataContainer from './LocationResultsDataContainer'
import LocationResultsFormSeries from './LocationResultsFormSeries'
import LocationResultsListByType from './LocationResultsListByType'
import { replaceHistoryState } from '../pushHistoryState'

function addQueryParams(address) {
  return `?${queryString.stringify({
    street_number: address.street_number,
    street: address.street,
    state: address.state,
    city: address.city,
    zip: address.zip5,
  })}`
}

function findReferenceLink(contentReferences, key, defaultResource) {
  return (
    contentReferences.find(
      ({ fields }) => fields.contentType.fields.state === key
    ) || findReferenceLink(contentReferences, defaultResource)
  )
}

function findStateSpecificContent(references, state) {
  return references.find(fields => fields.states.includes(state))
}

function scrollToTop() {
  window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
}

function redirectToPledge(contentReferences, locationBody, defaultResource) {
  const { location } = window
  const ref = findReferenceLink(
    contentReferences,
    locationBody.address.state,
    defaultResource
  )

  replaceHistoryState('')
  location.href = makeSourcedLink(
    localePath((ref || {}).fields || {}) + addQueryParams(locationBody.address)
  )
}

function LocationResults(props) {
  const {
    contentReferences,
    backToSearch,
    settings,
    locationOfVoter,
    userQueryParams,
  } = props

  const [selectedLocationId, setSelectedLocationId] = useState(null)
  const [selectedVotingTypeOverride, setSelectedVotingTypeOverride] = useState(
    null
  )
  const specificSettings = findStateSpecificContent(
    settings.stateSpecificResultContent,
    locationOfVoter.address.state,
    settings.defaultResource
  )
  const fallbackContent = findStateSpecificContent(
    settings.stateSpecificResultContent,
    settings.defaultResource
  )

  const goToPledge = () =>
    redirectToPledge(
      contentReferences,
      locationOfVoter,
      settings.defaultResource
    )

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const {
    scrollDestinationRef: formScrollDestinationRef,
    scrollFocusRef: formScrollFocusRef,
    scrollToDestination,
  } = useSmoothScrollAndFocus()

  function setSelectedLocation(id, shouldScroll) {
    if (shouldScroll) {
      scrollToDestination()
    }
    setSelectedVotingTypeOverride(null)
    setSelectedLocationId(id)
  }

  function setSelectedVotingTypeAndRemoveLocation(votingType, shouldScroll) {
    if (shouldScroll) {
      scrollToDestination()
    }
    setSelectedLocationId(null)
    setSelectedVotingTypeOverride(votingType)
  }

  return (
    <LocationResultsDataContainer
      goToPledge={goToPledge}
      specificSettings={specificSettings}
      locationOfVoter={locationOfVoter}
      votingTypeFallbacks={settings.votingTypeFallbacks}
    >
      {({
        votingLocations,
        votingLocations: { home_address: homeAddress },
        availableMethods,
      }) => (
        <Fragment>
          <Blocks.BackButtonWrapper>
            <Blocks.BackButton onClick={backToSearch}>
              <Chevron direction="left" color="navy" />
              {settings.resultBackText}
            </Blocks.BackButton>
          </Blocks.BackButtonWrapper>
          <Blocks.FlexContainer>
            <Blocks.ResultSection>
              <Blocks.HeadlineContainer>
                <Headline as={Blocks.StyledHeadline} size="md">
                  {replaceTemplateVars(
                    specificSettings.resultTitle || fallbackContent.resultTitle,
                    [
                      [
                        '{{STATE}}',
                        lookup(locationOfVoter.address.state, 'en-US'),
                      ],
                    ]
                  )}
                </Headline>
                {(specificSettings.userLocation ||
                  fallbackContent.userLocation) && (
                  <BodyCopy color="navy" size="sm">
                    {replaceTemplateVars(
                      specificSettings.userLocation ||
                        fallbackContent.userLocation,
                      [
                        ['{{STREET_NUMBER}}', homeAddress.street_number],
                        ['{{STREET}}', homeAddress.street],
                        ['{{CITY}}', homeAddress.city],
                        ['{{STATE}}', homeAddress.state],
                        ['{{ZIP}}', homeAddress.zip5],
                      ]
                    )}
                  </BodyCopy>
                )}
              </Blocks.HeadlineContainer>
              {availableMethods.length === 1 &&
                specificSettings.resultSubHeaderForSingleVoteType && (
                  <BodyCopy as={Blocks.SubHeader}>
                    {compileMarkdown()(
                      specificSettings.resultSubHeaderForSingleVoteType
                    )}
                  </BodyCopy>
                )}
              <LocationResultsListByType
                votingLocations={votingLocations}
                locationOfVoter={locationOfVoter}
                availableMethods={availableMethods}
                setSelectedLocationId={locationId =>
                  setSelectedLocation(locationId, true)
                }
                settings={settings}
                specificSettings={specificSettings}
                setSelectedVotingTypeOverride={votingType =>
                  setSelectedVotingTypeAndRemoveLocation(votingType, true)
                }
              />
            </Blocks.ResultSection>
            <div>
              <LocationResultsFormSeries
                settings={settings}
                userQueryParams={userQueryParams}
                specificSettings={specificSettings}
                availableMethods={availableMethods}
                selectedVotingTypeOverride={selectedVotingTypeOverride}
                setSelectedVotingTypeOverride={
                  setSelectedVotingTypeAndRemoveLocation
                }
                locationOfVoter={locationOfVoter}
                votingLocations={votingLocations}
                selectedLocationId={selectedLocationId}
                setSelectedLocationId={setSelectedLocation}
                formDestinationRef={formScrollDestinationRef}
                formScrollFocusRef={formScrollFocusRef}
              />
            </div>
          </Blocks.FlexContainer>
          <Blocks.FixedFooter>
            <Blocks.FlexColumn>
              <Blocks.StyledButton onClick={() => scrollToDestination()}>
                {settings.mobileFooterSendToSelfText}
              </Blocks.StyledButton>
            </Blocks.FlexColumn>
            <Blocks.FixedFooterSmallButtonSection>
              <Blocks.StyledButtonSmall onClick={scrollToTop}>
                <Chevron direction="up" color="white" />
                <BodyCopy as={Blocks.SmallTextWhite}>
                  {settings.mobileFooterBackToTopText}
                </BodyCopy>
              </Blocks.StyledButtonSmall>
            </Blocks.FixedFooterSmallButtonSection>
          </Blocks.FixedFooter>
        </Fragment>
      )}
    </LocationResultsDataContainer>
  )
}

export default LocationResults
