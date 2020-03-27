import React, { useState, useEffect } from 'react'
import queryString from 'query-string'
import get from 'lodash.get'
import fakeFetch from './fakeFetch'

import AnnularThrobber from 'wr/components/AnnularThrobber'
import useHeapEvent from 'wr/hooks/useHeapEvent'
import makeSourcedLink from '../../../utils/makeSourcedLink'
import localePath from '../../../utils/localePath'

import { replaceHistoryState } from '../pushHistoryState'
import { isTypeVoteByMail } from '../constants'

function pastExpiryDate(expiresAt) {
  return expiresAt ? new Date(expiresAt) < new Date() : false
}

function filterContentToEligibleTypes(votingTypes, votingLocations) {
  return votingTypes.filter(fields => {
    return (
      votingLocations &&
      (votingLocations[fields.votingType] ||
        fields.showNoDataFallbackCard ||
        isTypeVoteByMail(fields.votingType)) &&
      !pastExpiryDate(fields.expiresAt)
    )
  })
}

function appendGenericFallbackDataToSpecficContent(
  specificSettings,
  votingTypeFallbacks
) {
  return specificSettings.votingTypes.map(specificFields => {
    const fallbackVoteTypeModuleFields = votingTypeFallbacks.find(
      fallbackFields => fallbackFields.votingType === specificFields.votingType
    )

    return {
      ...fallbackVoteTypeModuleFields,
      ...specificFields,
    }
  })
}

function addQueryParams(address) {
  return `?${queryString.stringify({
    street_number: address.street_number,
    street: address.street,
    state: address.state,
    city: address.city,
    zip: address.zip5,
  })}`
}

function getFallbackFormOverridePath(fields, locationBody) {
  return makeSourcedLink(
    localePath(fields) + addQueryParams(locationBody.address)
  )
}

function LocationResultsDataContainer({
  children,
  locationOfVoter,
  goToPledge,
  specificSettings,
  votingTypeFallbacks,
}) {
  const [isLoading, setIsLoading] = useState(true)
  const [votingLocations, setVotingLocations] = useState(null)
  const heapEvent = useHeapEvent()

  const routeToDestinationPage = () => {
    if (specificSettings.fallbackFormOverride) {
      replaceHistoryState('')
      window.location.href = getFallbackFormOverridePath(
        specificSettings.fallbackFormOverride.fields,
        locationOfVoter
      )
      return
    }

    window.location.replace(`/`)

    // goToPledge()
  }

  async function fetchLocation() {
    setIsLoading(true)
    heapEvent('pollaris-request', {
      pollaris_search_id: get(locationOfVoter, 'metadata.pollaris_search_id'),
      query_params: get(locationOfVoter, 'metadata.query_params'),
      autocomplete_selected: get(
        locationOfVoter,
        'metadata.autocomplete_selected'
      ),
    })

    try {
      const body = await fakeFetch()
      // const req = await fetch(`${process.env.POLLARIS_URI}/search/address`, {
      //   method: 'POST',
      //   body: JSON.stringify(locationOfVoter),
      // })
      // const body = await req.json()
      const eligibleTypes = filterContentToEligibleTypes(
        specificSettings.votingTypes,
        body
      )

      if (!eligibleTypes.length) {
        throw new Error()
      }

      setVotingLocations(body)
      setIsLoading(false)
    } catch (err) {
      routeToDestinationPage()
    }
  }

  useEffect(() => {
    if (!specificSettings.whitelisted) {
      heapEvent('polling-location-not-whitelisted', {
        query_params: get(locationOfVoter, 'metadata.query_params'),
        autocomplete_selected: get(
          locationOfVoter,
          'metadata.autocomplete_selected'
        ),
      })

      routeToDestinationPage()
    } else {
      fetchLocation()
    }
  }, [])

  return isLoading ? (
    <AnnularThrobber />
  ) : (
    children({
      votingLocations,
      availableMethods: filterContentToEligibleTypes(
        appendGenericFallbackDataToSpecficContent(
          specificSettings,
          votingTypeFallbacks
        ),
        votingLocations
      ),
    })
  )
}

export default LocationResultsDataContainer
