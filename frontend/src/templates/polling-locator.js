import React from 'react'
import { graphql } from 'gatsby'
import { ThemeProvider } from 'styled-components'
import Helmet from 'react-helmet'

import Nav from '../components/Nav'
import theme from '../theme'
import GlobalSiteStyles from '../styles/GlobalSiteStyles'
import PagePollingLocator from '../components/PagePollingLocator'

function PollingLocator({
  data: {
    contentfulPage,
    allContentfulPagePollingPlaceLocator: { nodes },
  },
}) {
  return (
    <div>
      <Helmet title={contentfulPage.metaTitle} />
      <GlobalSiteStyles />
      <ThemeProvider theme={theme}>
        <Nav pageNodes={nodes} locale={contentfulPage.node_locale} />
        <PagePollingLocator settings={contentfulPage.contentType} />
      </ThemeProvider>
    </div>
  )
}

export default PollingLocator

export const pageQuery = graphql`
  query PollingLocatorQuery($id: String!) {
    allContentfulPagePollingPlaceLocator {
      nodes {
        page {
          path
          node_locale
        }
      }
    }
    contentfulPage(id: { eq: $id }) {
      path
      metaDescription
      metaTitle
      node_locale
      contentType {
        __typename
        ... on ContentfulPagePollingPlaceLocator {
          stateSpecificResultContent {
            id
            resultTitle
            states
            userLocation
            whitelisted
            votingTypes {
              descriptionMultipleResults
              descriptionSingleResult
              disableSelectionIfNoData
              name
              expiresAt
              showNoDataFallbackCard
              subAnchorDescription
              noDataFallbackText {
                noDataFallbackText
              }
              voteByMailContent {
                json
              }
              voteCardButtonText
              voteCardHeading
              voterEducationHeading
              votingType
            }
          }
          copyUrl {
            afterVerb
            label
          }
          defaultResource
          description
          entryFormLabel
          errorState
          facebookShareText
          fallbackPrompt
          googleErrors {
            GOOGLE_ERROR
            NO_LOCATION
            NO_STRING
          }
          issuesFormBody
          issuesVerb
          mobileFooterBackToTopText
          mobileFooterSendToSelfText
          resultBackText
          resultTitleFallback
          resultWhenLabel
          resultWhereLabel
          sendToSelfFormButton
          sendToSelfFormTitle
          sharePrompt
          showMoreLocationsIncrement
          showMoreLocationsText
          submitButtonText
          title
          votingTypeFallbacks {
            descriptionMultipleResults
            descriptionSingleResult
            disableSelectionIfNoData
            name
            showNoDataFallbackCard
            subAnchorDescription
            voteCardButtonText
            voteCardHeading
            voterEducationHeading
            votingType
            voteByMailContent {
              voteByMailContent
            }
          }
        }
      }
    }
  }
`
