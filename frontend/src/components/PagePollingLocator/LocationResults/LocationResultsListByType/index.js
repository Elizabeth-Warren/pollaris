import React, { Fragment, useState } from 'react'
import {
  WideHeadline,
  BodyCopy,
  TextLink,
  Chevron,
  theme as persist,
} from '@ewarren/persist'
import get from 'lodash.get'

import compileMarkdown from 'wr/utils/compileMarkdown'
import useSmoothScrollAndFocus from 'wr/hooks/useSmoothScrollAndFocus'
import replaceTemplateVars from 'wr/utils/replaceTemplateVars'

import { isTypeVoteByMail } from '../../constants'
import ScrollRefPositioning from '../ScrollRefPositioning'
import getResultLocationTime from '../utils/getResultLocationTime'
import VotingPlaceCard from './VotingPlaceCard'
import VoteByMailSteps from './VoteByMailSteps'
import Blocks from './style'

function getIncrementAmount(amountVisible, amountTotal, incrementAmount) {
  return Math.min(amountTotal - amountVisible, incrementAmount)
}

function getTotalLocationsAmount(availableMethods, votingLocations) {
  return availableMethods.reduce(
    (accum, fields) =>
      accum + (votingLocations[fields.votingType] || []).length,
    0
  )
}

function PollingTypeCollection(props) {
  const {
    locationOfVoter,
    votingLocations,
    availableMethods,
    setSelectedLocationId,
    settings,
    specificSettings,
    setSelectedVotingTypeOverride,
  } = props
  const [amountVisible, setAmountVisible] = useState(2)

  const scrollRefs = availableMethods.reduce(
    (prev, fields) => ({
      ...prev,
      [fields.votingType]: useSmoothScrollAndFocus(),
    }),
    {}
  )

  return (
    <div>
      <Blocks.AnchorList>
        {availableMethods.length > 1 &&
          availableMethods.map(({ votingType, name, subAnchorDescription }) => (
            <Blocks.TextLinkWrapper key={votingType}>
              <TextLink
                href={`#${votingType}`}
                as={Blocks.AnchorText}
                {...scrollRefs[votingType].scrollTriggerElementProps}
              >
                {name}
              </TextLink>
              <BodyCopy as={Blocks.SubAnchorDescription}>
                {subAnchorDescription}
              </BodyCopy>
            </Blocks.TextLinkWrapper>
          ))}
      </Blocks.AnchorList>
      {availableMethods.map(
        ({
          votingType,
          name,
          voteCardHeading,
          voteCardButtonText,
          voterEducationHeading,
          voterEducation,
          voteByMailContent,
          callsToAction,
          showNoDataFallbackCard,
          noDataFallbackText,
          noDataFallbackButtonText,
          descriptionSingleResult,
          descriptionMultipleResults,
          dateTimeOverride,
        }) => (
          <Blocks.PollingTypeContainer key={votingType} id={votingType}>
            <ScrollRefPositioning
              scrollOffset="-120px"
              ref={scrollRefs[votingType].scrollDestinationRef}
            />
            <Blocks.HeadlineWrapper>
              <WideHeadline as={Blocks.Headline} size="sm">
                {name}
              </WideHeadline>
            </Blocks.HeadlineWrapper>
            <Blocks.PollingTypeBody>
              <BodyCopy>
                {get(votingLocations, [votingType, 'length'], 0) > 1
                  ? descriptionMultipleResults
                  : descriptionSingleResult}
              </BodyCopy>
            </Blocks.PollingTypeBody>
            {isTypeVoteByMail(votingType) && (
              <Fragment>
                {availableMethods.length > 1 && (
                  <Blocks.VoteByMailButton
                    onClick={() => setSelectedVotingTypeOverride(votingType)}
                  >
                    {voteCardButtonText}
                  </Blocks.VoteByMailButton>
                )}
                <VoteByMailSteps voteByMailContent={voteByMailContent} />
              </Fragment>
            )}
            {showNoDataFallbackCard &&
            !get(votingLocations, [votingType, 'length'])
              ? noDataFallbackText && (
                  <Blocks.FallbackCard>
                    <Blocks.FallbackCardTextContainer>
                      <BodyCopy as={Blocks.FallbackCopy}>
                        {noDataFallbackText}
                      </BodyCopy>
                    </Blocks.FallbackCardTextContainer>
                    {noDataFallbackButtonText && (
                      <Blocks.Button
                        onClick={() =>
                          setSelectedVotingTypeOverride(votingType)
                        }
                      >
                        {noDataFallbackButtonText}
                      </Blocks.Button>
                    )}
                  </Blocks.FallbackCard>
                )
              : (votingLocations[votingType] || [])
                  .filter((l, index) => index < amountVisible)
                  .map((votingLocation, index, locations) => (
                    <VotingPlaceCard
                      key={votingLocation.location_id}
                      name={
                        locations.length === 1
                          ? settings.resultWhereLabel
                          : replaceTemplateVars(voteCardHeading, [
                              ['{{INDEX}}', index + 1],
                            ])
                      }
                      precinctCode={get(
                        votingLocations,
                        'precinct.precinct_code'
                      )}
                      whenLabel={settings.resultWhenLabel}
                      votingLocation={votingLocation}
                      votingType={votingType}
                      locationOfVoter={locationOfVoter}
                      setSelectedLocationId={setSelectedLocationId}
                      specificSettings={specificSettings}
                      buttonText={voteCardButtonText}
                      showVoteButton={
                        getTotalLocationsAmount(
                          availableMethods,
                          votingLocations
                        ) > 1
                      }
                      resultLocationTime={getResultLocationTime(
                        votingLocation.dates_hours,
                        dateTimeOverride
                      )}
                    />
                  ))}
            {(votingLocations[votingType] || []).length > amountVisible && (
              <Blocks.SeeMoreWrapper>
                <BodyCopy
                  as={Blocks.SeeMoreTrigger}
                  onClick={() =>
                    setAmountVisible(
                      amountVisible + settings.showMoreLocationsIncrement
                    )
                  }
                >
                  {replaceTemplateVars(settings.showMoreLocationsText, [
                    [
                      '{{INCREMENT}}',
                      getIncrementAmount(
                        amountVisible,
                        votingLocations[votingType].length,
                        settings.showMoreLocationsIncrement
                      ),
                    ],
                  ])}
                  <Chevron direction="down" color={persist.colors.red} />
                </BodyCopy>
              </Blocks.SeeMoreWrapper>
            )}
            {callsToAction && (
              <Blocks.CallsToAction>
                {compileMarkdown()(callsToAction)}
              </Blocks.CallsToAction>
            )}
            {voterEducation && (
              <div>
                <BodyCopy as={Blocks.RulesHeading}>
                  {voterEducationHeading}
                </BodyCopy>
                <BodyCopy as="p">{voterEducation}</BodyCopy>
              </div>
            )}
          </Blocks.PollingTypeContainer>
        )
      )}
    </div>
  )
}

export default PollingTypeCollection
