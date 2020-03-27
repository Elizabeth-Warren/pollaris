import React, { useEffect, useState, useRef } from 'react'
import parseQueryString from 'query-string'

import AnnularThrobber from 'wr/components/AnnularThrobber'
import usePollingLocatorRouter from 'wr/hooks/usePollingLocatorRouter'

import RouterBlocks from './style'
import EntryForm from './EntryForm'
import AutoCompleteSearch from './EntryForm/AutocompleteSearch'
import LocationResults from './LocationResults'
import { pushHistoryState } from './pushHistoryState'

function getGeneratedId() {
  return window.crypto.getRandomValues(new Uint32Array(2)).join('')
}

function PagePollingLocator({ settings }) {
  const { contentReferences, googleErrors, submitButtonText } = settings
  const [queryString, setQueryString] = useState(window.location.search)
  const [locationBody, setLocationBody] = useState(null)
  const initialParams = useRef(null)

  const [userQueryParams, setUserQueryParams] = useState(null)

  const {
    isLoading,
    pollingLocatorInput,
    errorMessage,
    onSearch,
  } = usePollingLocatorRouter({
    errorDisplayTexts: googleErrors,
    onSubmit: ({
      queryStr,
      parsedData,
      addressNumberFallback,
      isAutoComplete,
    }) => {
      const queryParams = parseQueryString.parse(initialParams.current)
      const {
        email,
        phone_number: phone,
        first_name: firstName,
        last_name: lastName,
      } = queryParams

      setUserQueryParams({
        firstName,
        lastName,
        email,
        phone,
      })

      setQueryString(queryStr)
      pushHistoryState(queryStr)

      setLocationBody({
        address: {
          street_number: addressNumberFallback,
          ...parsedData,
        },
        metadata: {
          ...queryParams,
          referral_source: queryParams.source,
          query_params: initialParams.current,
          source: 'web',
          normalized_by_google: true,
          autocomplete_selected: isAutoComplete,
          // heap_id: getHeapId(),
          pollaris_search_id: getGeneratedId(),
        },
      })
    },
  })

  useEffect(() => {
    pushHistoryState(queryString)
    const { id } = parseQueryString.parse(queryString)
  }, [queryString])

  useEffect(() => {
    initialParams.current = window.location.search
  }, [])

  function backToSearch() {
    setLocationBody(null)
    setQueryString('')
  }

  useEffect(() => {
    window.onpopstate = backToSearch

    return () => {
      window.onpopstate = () => {}
    }
  }, [])

  return isLoading ? (
    <RouterBlocks.Container>
      <AnnularThrobber />
    </RouterBlocks.Container>
  ) : (
    <RouterBlocks.Container>
      {locationBody ? (
        <LocationResults
          backToSearch={backToSearch}
          locationOfVoter={locationBody}
          settings={settings}
          contentReferences={contentReferences}
          userQueryParams={userQueryParams}
        />
      ) : (
        <EntryForm title={settings.title} description={settings.description}>
          <AutoCompleteSearch
            formLabel={settings.entryFormLabel}
            onSearch={onSearch}
            errorMessage={errorMessage}
            submitButtonText={submitButtonText}
          >
            {pollingLocatorInput}
          </AutoCompleteSearch>
        </EntryForm>
      )}
    </RouterBlocks.Container>
  )
}

export default PagePollingLocator
