import React from 'react'
import { graphql } from 'gatsby'
import { ThemeProvider } from 'styled-components'
import Helmet from 'react-helmet'

import Nav from '../components/Nav'
import theme from '../theme'
import GlobalSiteStyles from '../styles/GlobalSiteStyles'
import PageVoterEducation from '../components/PageVoterEducation'

function BlogPostTemplate({ data: { contentfulPage } }) {
  return (
    <div>
      <Helmet title={contentfulPage.metaTitle} />
      <GlobalSiteStyles />
      <ThemeProvider theme={theme}>
        {/* TODO: allContentfulPageVoterEducation 
        not returning correct page data for pageNodes*/}
        <Nav pageNodes={[]} locale={contentfulPage.node_locale} />
        <PageVoterEducation data={contentfulPage.contentType} />
      </ThemeProvider>
    </div>
  )
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query VoterEducationStateByID($id: String!) {
    contentfulPage(id: { eq: $id }) {
      path
      id
      internalTitle
      metaDescription
      metaTitle
      node_locale
      contentType {
        __typename
        ... on ContentfulPageVoterEducation {
          id
          onPrimaryDayHeading
          onPrimaryDayContent {
            childMarkdownRemark {
              rawMarkdownBody
            }
          }
          bsdFormId
          contentful_id
          createdAt
          formCallToAction
          formSubmitButtonText
          formPostSubmissionMessage
          headingButtonLinkUrl
          headingButtonLinkCta
          heading
          frequentlyAskedQuestionsTitle
          frequentlyAskedQuestionsContent {
            json
          }
          registeringToVoteHeading
          registeringToVoteContent {
            childMarkdownRemark {
              rawMarkdownBody
            }
          }
          voteByMailHeading
          voteEarlyHeading
          voteEarlyContent {
            childMarkdownRemark {
              rawMarkdownBody
            }
          }
          voteByMailContent {
            childMarkdownRemark {
              rawMarkdownBody
            }
          }
          votingTypeHeading
          voterIdRequirementsHeading
          whoCanVoteHeading
          whoCanVoteContent {
            childMarkdownRemark {
              rawMarkdownBody
            }
          }
          voterIdRequirementsContent {
            childMarkdownRemark {
              rawMarkdownBody
            }
          }
        }
      }
    }
  }
`
