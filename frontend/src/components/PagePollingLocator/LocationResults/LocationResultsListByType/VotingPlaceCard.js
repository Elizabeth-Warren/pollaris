import React from 'react'
import styled, { css } from 'styled-components'
import { BodyCopy, theme as persist } from '@ewarren/persist'

import { smallButton } from 'wr/styles/button'
import createBreakpointStyles from 'wr/styles/createBreakpointStyles'
import compileMarkdown from 'wr/utils/compileMarkdown'

import getLocationName from '../utils/getLocationName'
import { createLocationId } from '../utils/locationIdUtils'

const BoldBodyCopy = styled.h5`
  color: ${({ theme }) => theme.colors.navy};
  font-weight: bold;
  font-size: ${persist.fontSize.base};
`

const VoteCardBodyCopy = styled.div`
  color: ${({ theme }) => theme.colors.navy};
  font-size: ${persist.fontSize.base};
`

const VoteCardBodyCopyLocation = styled(VoteCardBodyCopy)`
  ${({ theme }) =>
    createBreakpointStyles(
      theme.breakpoints.tablet,
      css`
        font-size: ${persist.fontSize.xl};
      `
    )}
`

const STATIC_MAP = 'https://maps.googleapis.com/maps/api/staticmap'
const GOOGLE_DIRECTIONS = 'https://www.google.com/maps/dir/?api=1'

function findMapLocation(loc) {
  if (loc.latitude && loc.longitude) {
    return `${loc.latitude},${loc.longitude}`
  }
  return `${loc.address} ${loc.city || ''}, ${loc.state_code} ${loc.zip}`
}

const PollingLocation = styled.div`
  background-color: ${({ theme }) => theme.colors.white};
  padding: ${persist.spacing.sp1} ${persist.spacing.sp2};
  display: flex;
  margin-bottom: ${persist.spacing.sp2};
  flex-direction: column;

  ${({ theme }) =>
    createBreakpointStyles(
      theme.breakpoints.tablet,
      css`
        flex-direction: row;
      `
    )}
`

const PollingLocationMapSection = styled.div`
  width: 100%;
  max-width: 360px;

  ${({ theme }) =>
    createBreakpointStyles(
      theme.breakpoints.tablet,
      css`
        width: 240px;
      `
    )}
`

const PollingLocationTextColumn = styled.div`
  flex: 1;
  padding-right: ${persist.spacing.sp1};
`

const PollingLocationText = styled.div`
  margin-bottom: ${persist.spacing.sp2};
`

const Button = styled.button`
  ${({ theme }) =>
    smallButton(
      theme.colors.white,
      theme.colors.navy,
      theme.colors.navy,
      theme.colors.liberty
    )}
  border-color: ${({ theme }) => theme.colors.navy};
  width: 100%;

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.liberty};
  }
`

function VotingPlaceCard(props) {
  const {
    precinctCode,
    votingLocation,
    locationOfVoter,
    votingType,
    setSelectedLocationId,
    whenLabel,
    name,
    showVoteButton,
    specificSettings,
    buttonText,
    resultLocationTime,
  } = props
  const { address: userAdd } = locationOfVoter
  return (
    <PollingLocation>
      <PollingLocationTextColumn>
        <PollingLocationText>
          <BodyCopy as={BoldBodyCopy}>{name}</BodyCopy>
          <BodyCopy as={VoteCardBodyCopyLocation}>
            {getLocationName(precinctCode, specificSettings, votingLocation)}
          </BodyCopy>
          <BodyCopy as={VoteCardBodyCopy}>{votingLocation.address}</BodyCopy>
          <BodyCopy as={VoteCardBodyCopy}>
            {`${votingLocation.city}, ${votingLocation.state_code}`}
          </BodyCopy>
          <BodyCopy as={VoteCardBodyCopy}>{votingLocation.zip}</BodyCopy>
        </PollingLocationText>
        {resultLocationTime && (
          <PollingLocationText>
            <BodyCopy as={BoldBodyCopy}>{whenLabel}</BodyCopy>
            {resultLocationTime.split(';').map(time => (
              <VoteCardBodyCopy>{compileMarkdown()(time)}</VoteCardBodyCopy>
            ))}
          </PollingLocationText>
        )}
      </PollingLocationTextColumn>
      <PollingLocationMapSection>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={`${GOOGLE_DIRECTIONS}&origin=${encodeURIComponent(
            `${userAdd.street_number}+${userAdd.street}+${userAdd.city}+${userAdd.state}+${userAdd.zip5}`
          )}&destination=${encodeURIComponent(
            `${votingLocation.address}+${votingLocation.city || ''},+${
              votingLocation.state_code
            }+${votingLocation.zip}`
          )}`}
        >
          <img
            alt="map"
            src={`${STATIC_MAP}?center=${findMapLocation(
              votingLocation
            )}&zoom=17&size=300x180&maptype=roadmap&markers=color:blue%7C${findMapLocation(
              votingLocation
            )}&key=${process.env.GOOGLE_CLOUD_KEY}`}
          />
        </a>
        {showVoteButton && (
          <Button
            onClick={() =>
              setSelectedLocationId(
                createLocationId(votingType, votingLocation.location_id)
              )
            }
          >
            {buttonText}
          </Button>
        )}
      </PollingLocationMapSection>
    </PollingLocation>
  )
}

export default VotingPlaceCard
