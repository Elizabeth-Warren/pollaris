import React, { Fragment } from 'react'
import get from 'lodash.get'
import { Headline, WideHeadline, BodyCopy, Chevron } from '@ewarren/persist'
import ScrollRefPositioning from 'wr/components/PagePollingLocator/LocationResults/ScrollRefPositioning'

import useContent from 'wr/hooks/useContent'
import useSmoothScrollAndFocus from 'wr/hooks/useSmoothScrollAndFocus'

import Blocks from './style'
import SubjectHeader from './SubjectHeader'
import SubjectBody from './SubjectBody'
import FrequentlyAskedQuestions from './FrequentlyAskedQuestions'
// Removed for OS.
// import VoterEducationForm from './VoterEducationForm';

function isWordInStringTooLong(string, limit) {
  const words = string.split(' ')
  return words.find(word => word.length > limit)
}

function PageVoterEducation({ data }) {
  const {
    heading,
    headingButtonLinkCta,
    headingButtonLinkUrl,
    formCallToAction,
    bsdFormId,
    votingTypeHeading,
    formSubmitButtonText,
    formPostSubmissionMessage,
    onPrimaryDayHeading,
    onPrimaryDayContent,
    voteEarlyHeading,
    voteEarlyContent,
    voteByMailHeading,
    voteByMailContent,
    registeringToVoteHeading,
    registeringToVoteContent,
    voterIdRequirementsHeading,
    voterIdRequirementsContent,
    whoCanVoteHeading,
    whoCanVoteContent,
    frequentlyAskedQuestionsTitle,
    frequentlyAskedQuestionsContent,
    votingTypesOrdering,
    requirementsOrdering,
  } = data

  const addsScrollProps = types => ({
    scrollProps: useSmoothScrollAndFocus(),
    ...types,
  })

  const unorderedVotingTypes = [
    {
      id: 'primary-day',
      voteTypeHeading: onPrimaryDayHeading,
      contents: onPrimaryDayContent.childMarkdownRemark.rawMarkdownBody,
    },
    {
      id: 'vote-early',
      voteTypeHeading: voteEarlyHeading,
      contents: voteEarlyContent.childMarkdownRemark.rawMarkdownBody,
    },
    {
      id: 'vote-by-mail',
      voteTypeHeading: voteByMailHeading,
      contents: voteByMailContent.childMarkdownRemark.rawMarkdownBody,
    },
  ]
    .map(addsScrollProps)
    .filter(({ voteTypeHeading, contents }) => voteTypeHeading && contents)

  const unorderedRegistrationAndRequirements = [
    {
      id: 'voter-registration',
      requirementHeading: registeringToVoteHeading,
      requirementContent:
        registeringToVoteContent.childMarkdownRemark.rawMarkdownBody,
    },
    {
      id: 'who-can-vote',
      requirementHeading: whoCanVoteHeading,
      requirementContent: whoCanVoteContent.childMarkdownRemark.rawMarkdownBody,
    },
    {
      id: 'voter-id-requirements',
      requirementHeading: voterIdRequirementsHeading,
      requirementContent:
        voterIdRequirementsContent.childMarkdownRemark.rawMarkdownBody,
    },
  ]
    .map(addsScrollProps)
    .filter(
      ({ requirementHeading, requirementContent }) =>
        requirementHeading && requirementContent
    )

  const votingTypes = votingTypesOrdering
    ? votingTypesOrdering.map(type =>
        unorderedVotingTypes.find(({ id }) => id === type)
      )
    : unorderedVotingTypes

  const registrationAndRequirements = requirementsOrdering
    ? requirementsOrdering.map(type =>
        unorderedRegistrationAndRequirements.find(({ id }) => id === type)
      )
    : unorderedRegistrationAndRequirements

  const setIdAndScroll = (scrollFn, id) => event => {
    event.preventDefault()
    const { history } = window
    const hash = `#${id}`
    if (history.replaceState) {
      history.replaceState(null, null, hash)
    }
    scrollFn()
  }

  return (
    <Fragment>
      <div>
        <Blocks.PageContainer>
          <Blocks.Header>
            <Blocks.TitleHeaderColumn>
              <Headline
                as={
                  isWordInStringTooLong(heading, 8)
                    ? Blocks.MediumHeadline
                    : Blocks.LargeHeadline
                }
              >
                {heading}
              </Headline>
              {headingButtonLinkUrl && (
                <Blocks.HeadlineButtonWrapper>
                  <Blocks.HeadlineButton
                    href={headingButtonLinkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {headingButtonLinkCta}
                  </Blocks.HeadlineButton>
                </Blocks.HeadlineButtonWrapper>
              )}
            </Blocks.TitleHeaderColumn>
            <Blocks.HeaderColumn>
              <div>
                <Blocks.HeadlineWrapper>
                  <WideHeadline as={Blocks.Headline} size="sm">
                    {votingTypeHeading}
                  </WideHeadline>
                </Blocks.HeadlineWrapper>
                <div>
                  {votingTypes.map(
                    ({
                      id,
                      voteTypeHeading,
                      scrollProps: { scrollToDestination },
                    }) => (
                      <a
                        key={id}
                        href={`#${id}`}
                        onClick={setIdAndScroll(scrollToDestination, id)}
                      >
                        <Blocks.Anchor key={id}>
                          <Blocks.AnchorTitle>
                            <BodyCopy className="anchor-text" size="lg">
                              {voteTypeHeading}
                            </BodyCopy>
                          </Blocks.AnchorTitle>
                          <Chevron className="chevron" />
                        </Blocks.Anchor>
                      </a>
                    )
                  )}
                  {registrationAndRequirements.map(
                    ({
                      requirementHeading,
                      id,
                      scrollProps: { scrollToDestination },
                    }) => (
                      <Blocks.RequirementAnchor key={id}>
                        <Blocks.ChevronPointer
                          href={`#${id}`}
                          onClick={setIdAndScroll(scrollToDestination, id)}
                        >
                          {requirementHeading}
                        </Blocks.ChevronPointer>
                      </Blocks.RequirementAnchor>
                    )
                  )}
                </div>
              </div>
            </Blocks.HeaderColumn>
          </Blocks.Header>
          {/* <VoterEducationForm
            bsdFormId={bsdFormId}
            formCallToAction={formCallToAction}
            formSubmitButtonText={formSubmitButtonText}
            formPostSubmissionMessage={formPostSubmissionMessage}
          /> */}
          {votingTypes.map(
            ({
              id,
              voteTypeHeading,
              contents,
              scrollProps: { scrollDestinationRef },
            }) => (
              <Blocks.Subject key={id} id={id}>
                <ScrollRefPositioning
                  scrollOffset="-120px"
                  ref={scrollDestinationRef}
                />
                <SubjectHeader>{voteTypeHeading}</SubjectHeader>
                <SubjectBody>{contents}</SubjectBody>
              </Blocks.Subject>
            )
          )}
        </Blocks.PageContainer>
      </div>
      <Blocks.VoterRegistrationSection>
        <Blocks.PageContainer>
          {registrationAndRequirements.map(
            ({
              id,
              requirementHeading,
              requirementContent,
              scrollProps: { scrollDestinationRef },
            }) =>
              requirementContent && (
                <Blocks.Subject key={id} id={id}>
                  <ScrollRefPositioning
                    scrollOffset="-120px"
                    ref={scrollDestinationRef}
                  />
                  <SubjectHeader>{requirementHeading}</SubjectHeader>
                  <SubjectBody>{requirementContent}</SubjectBody>
                </Blocks.Subject>
              )
          )}
          {frequentlyAskedQuestionsTitle && frequentlyAskedQuestionsContent && (
            <FrequentlyAskedQuestions
              title={frequentlyAskedQuestionsTitle}
              richText={frequentlyAskedQuestionsContent.json}
            />
          )}
        </Blocks.PageContainer>
      </Blocks.VoterRegistrationSection>
    </Fragment>
  )
}

export default PageVoterEducation
