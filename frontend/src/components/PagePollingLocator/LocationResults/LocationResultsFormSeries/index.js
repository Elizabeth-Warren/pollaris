import React, { useState, useEffect } from 'react'
import styled from 'styled-components'

import { theme as persist } from '@ewarren/persist'
import useFade from 'wr/hooks/useFade'

import ScrollRefPositioning from '../ScrollRefPositioning'
import UserEmailForm from './UserEmailForm'
import UserVolunteerForm from './UserVolunteerForm'
import ShareSocial from './ShareSocial'

const FormContainer = styled.div`
  border: ${persist.spacing.sp2} solid ${({ theme }) => theme.colors.liberty};
  color: ${({ theme }) => theme.colors.navy};
  padding: 32px;
  transition: all 0.3s ease-out;

  h4 {
    margin-bottom: ${persist.spacing.sp2};
  }
`

const StickyFormWrapper = styled.div`
  position: sticky;
  top: 80px;
  margin-bottom: ${persist.spacing.sp3};
`

function LocationResultsFormSeries(props) {
  const {
    settings,
    specificSettings,
    availableMethods,
    selectedLocationId,
    selectedVotingTypeOverride,
    setSelectedLocationId,
    setSelectedVotingTypeOverride,
    votingLocations,
    locationOfVoter,
    formDestinationRef,
    userQueryParams,
  } = props
  const [step, setStep] = useState(0)
  const [nextStep, setNextStep] = useState(0)
  const [userDetails, setUserDetails] = useState(null)
  const [isFading, hasFaded, reset] = useFade(nextStep !== step)

  useEffect(() => {
    if (hasFaded) {
      setStep(nextStep)
      reset()
    }
  }, [hasFaded])

  const steps = [
    <UserEmailForm
      availableMethods={availableMethods}
      isFading={isFading}
      settings={settings}
      specificSettings={specificSettings}
      setStep={setNextStep}
      setUserDetails={setUserDetails}
      userQueryParams={userQueryParams}
      selectedLocationId={selectedLocationId}
      selectedVotingTypeOverride={selectedVotingTypeOverride}
      setSelectedVotingTypeOverride={setSelectedVotingTypeOverride}
      setSelectedLocationId={setSelectedLocationId}
      votingLocations={votingLocations}
      locationOfVoter={locationOfVoter}
    />,
    <UserVolunteerForm
      setStep={setNextStep}
      settings={settings}
      locationOfVoter={locationOfVoter}
      userDetails={userDetails}
      isFading={isFading}
    />,
    <ShareSocial settings={settings} />,
  ]

  return (
    <StickyFormWrapper>
      <ScrollRefPositioning ref={formDestinationRef} />
      <FormContainer>{steps[step]}</FormContainer>
    </StickyFormWrapper>
  )
}

export default LocationResultsFormSeries
