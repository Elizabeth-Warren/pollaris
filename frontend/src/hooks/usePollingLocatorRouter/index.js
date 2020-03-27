import React, { useEffect, useRef, useState } from 'react'
import get from 'lodash.get'
import queryString from 'query-string'

import initGoogle from 'wr/utils/initGoogle'
import parseGoogleAddressComponents from 'wr/utils/parseGoogleAddressComponents'
import InputAutocomplete from 'wr/components/InputAutocomplete'
import useAddressPredictions from 'wr/hooks/useAddressPredictions'

import { isZeroResults, isGoogleDown, LogErrors } from './constants'
import logError from './logError'

const googleToPollarisTypeMapping = {
  street_number: ['street_number'],
  street: ['route'],
  city: ['locality', 'sublocality'],
  backup_city: ['neighborhood'],
  state: ['administrative_area_level_1'],
  zip5: ['postal_code'],
  zip9: ['postal_code', 'postal_code_suffix'],
  county: ['administrative_area_level_2'],
}

function validBody(body, streetNumberFallback) {
  return [
    ...(streetNumberFallback ? [] : ['street_number']),
    'street',
    'city',
    'state',
    'zip5',
  ].every(key => Object.keys(body).includes(key))
}

function removeZip9IfShort(formattedData) {
  const { zip9 = '', ...rest } = formattedData
  return zip9.length === 9 ? formattedData : rest
}

function usePollingLocatorRouter(props) {
  const { errorDisplayTexts = {}, onSubmit, compact = false } = props

  const [errorMessage, setErrorMessage] = useState(null)
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false)
  const [placeFromAutoComplete, setPlaceFromAutoComplete] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const places = useRef(null)

  const { input, setInput, predictions } = useAddressPredictions(isGoogleLoaded)

  function getDetailsFromPlaceId(placeId, addressNumberFallback) {
    const request = {
      placeId,
      fields: ['address_components', 'geometry'],
    }

    places.current.getDetails(request, (body, status) => {
      if (isZeroResults(status)) {
        logError(
          LogErrors.NO_GOOGLE_RESULT,
          {
            place_id: request,
            search_string: input,
          },
          !!placeFromAutoComplete
        )

        setIsLoading(false)
        return setErrorMessage(errorDisplayTexts.NO_LOCATION)
      }

      if (isGoogleDown(status)) {
        logError(
          LogErrors.GOOGLE_UNAVAILABLE,
          {
            place_id: request,
            search_string: input,
          },
          !!placeFromAutoComplete
        )

        setIsLoading(false)
        return setErrorMessage(errorDisplayTexts.GOOGLE_ERROR)
      }

      const parsedData = removeZip9IfShort(
        parseGoogleAddressComponents(body, googleToPollarisTypeMapping)
      )

      if (parsedData && !parsedData.city) {
        parsedData.city = parsedData.backup_city
      }

      if (!validBody(parsedData, addressNumberFallback)) {
        logError(
          LogErrors.NO_GOOGLE_RESULT,
          {
            place_id: request,
            search_string: input,
            ...parsedData,
          },
          !!placeFromAutoComplete
        )

        setIsLoading(false)
        return setErrorMessage(errorDisplayTexts.NO_LOCATION)
      }

      setIsLoading(false)
      return onSubmit({
        queryStr: `?id=${placeId}${
          addressNumberFallback ? `&streetNumber=${addressNumberFallback}` : ''
        }`,
        parsedData,
        addressNumberFallback,
        isAutoComplete: !!placeFromAutoComplete,
      })
    })
  }

  function onQuerySearch(query, addressNumberFallback) {
    return places.current.textSearch(
      { query, fields: ['geometry'] },
      (body, status) => {
        if (isZeroResults(status)) {
          logError(LogErrors.NO_GOOGLE_RESULT, {
            search_string: input,
          })
          return setErrorMessage(errorDisplayTexts.NO_LOCATION)
        }
        if (isGoogleDown(status)) {
          logError(LogErrors.GOOGLE_UNAVAILABLE, {
            search_string: input,
          })
          return setErrorMessage(errorDisplayTexts.GOOGLE_ERROR)
        }
        const fallBack = addressNumberFallback || input.split(' ')[0]
        return getDetailsFromPlaceId(body[0].place_id, fallBack)
      }
    )
  }

  function onSearch(event) {
    if (event) {
      event.preventDefault()
    }
    setErrorMessage(null)

    if (placeFromAutoComplete) {
      return getDetailsFromPlaceId(
        placeFromAutoComplete.place_id,
        get(placeFromAutoComplete, ['terms', 0, 'value'])
      )
    }

    if (!input.length) {
      return setErrorMessage(errorDisplayTexts.NO_STRING)
    }
    return onQuerySearch(input)
  }

  useEffect(() => {
    initGoogle(() => {
      setIsGoogleLoaded(true)
    })
  }, [])

  useEffect(() => {
    if (isGoogleLoaded) {
      const { maps } = window.google
      places.current = new maps.places.PlacesService(
        document.createElement('div')
      )
    }
  }, [isGoogleLoaded])

  useEffect(() => {
    if (isGoogleLoaded) {
      const { id, streetNumber } = queryString.parse(window.location.search)
      if (id) {
        getDetailsFromPlaceId(id, streetNumber)
      } else {
        setIsLoading(false)
      }
    }
  }, [isGoogleLoaded])

  const pollingLocatorInput = ({ elementId }) => (
    <InputAutocomplete
      field={{ display: { useCompact: compact } }}
      elementId={elementId}
      preventOnSubmit={false}
      results={predictions}
      resultTextKey="description"
      resultValueKey="place_id"
      onOptionSelect={selResult => {
        setPlaceFromAutoComplete(selResult)
        setInput(selResult.description)
      }}
      value={input}
      onChange={({ target }) => {
        setPlaceFromAutoComplete(null)
        setInput(target.value)
      }}
    />
  )

  return {
    errorMessage,
    isLoading,
    pollingLocatorInput,
    onSearch,
    onQuerySearch,
  }
}

export default usePollingLocatorRouter
