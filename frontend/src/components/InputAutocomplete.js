import React, { useState, useEffect, useRef, createRef } from 'react'
import FormBlocks, { LIGHT_COLOR_SCHEME } from 'wr/components/FormBlocks'
import FormBlocksCompact from 'wr/components/FormBlocksCompact'
import InputAutocompleteBlocks from 'wr/components/InputAutocompleteBlocks'
import useOnClickOutsideElement from 'wr/hooks/useOnClickOutsideElement'
import useContent from 'wr/hooks/useContent'
import SearchIcon from 'wr/styles/icons/SearchIcon'
import replaceTemplateVars from 'wr/utils/replaceTemplateVars'

// TODO: Add back into CMS.
const a11yLabels = {
  close: 'Close',
  playVideo: 'Play video',
  breadcrumb: 'breadcrumb',
  linkNewWindow: 'opens in a new window',
  dropdownOptionCountLabel:
    '{{OPTIONS_COUNT}} options are available, use up and down arrow keys to navigate.',
  autocompleteResultCountLabel:
    '{{RESULTS_COUNT}} results are available, use up and down arrow keys to navigate.',
}

function InputAutocomplete(props) {
  const {
    results,
    value,
    onChange,
    onFocus = () => {},
    onBlur = () => {},
    placeholder,
    onInputEnter,
    hideIcon = false,
    autoFocus = false,
    hideAutocomplete = false,
    onOptionSelect,
    elementId,
    resultTextKey,
    resultValueKey,
    hasError = false,
    setAutocompleteClosed,
    preventOnSubmit = true,
    field,
    ...rest
  } = props

  const [isAutocompleteOpen, setIsAutocompleteOpen] = useState(false)
  const [focusIndex, setFocusIndex] = useState(null)
  const [resultCount, setResultCount] = useState(null)
  const inputRef = useRef(null)
  const itemsRef = useRef([])

  const showAutoComplete = Boolean(
    isAutocompleteOpen &&
      results &&
      !!results.length &&
      !hideAutocomplete &&
      value &&
      !!value.length
  )

  const templateVars = [['{{RESULTS_COUNT}}', resultCount]]
  const resultCountLabel =
    a11yLabels.autocompleteResultCountLabel &&
    replaceTemplateVars(a11yLabels.autocompleteResultCountLabel, templateVars)

  useEffect(() => {
    if (results) {
      setResultCount(results.length)
    }
  }, [results])

  useEffect(() => {
    if (results && results.length) {
      /* Creates a ref for every autocomplete result returned to enable keyboard a11y */
      itemsRef.current = results
        .filter(x => x[resultValueKey])
        .map(() => createRef())
    }
  }, [results])

  useEffect(() => {
    if (autoFocus) {
      inputRef.current.focus()
    }
  }, [autoFocus, inputRef])

  useEffect(() => {
    if (setAutocompleteClosed) {
      setAutocompleteClosed(!isAutocompleteOpen)
    }
  }, [isAutocompleteOpen])

  function onInputBlur() {
    onBlur()
  }

  function onInputFocus() {
    onFocus()
    setIsAutocompleteOpen(true)
  }

  const focusOnOption = (e, refs, index) => {
    e.preventDefault()
    setFocusIndex(index)
    if (refs[index] && refs[index].current) {
      refs[index].current.focus()
    }
  }

  const selectOption = (e, result, ref) => {
    e.preventDefault()
    setFocusIndex(null)
    if (typeof onOptionSelect === 'function') {
      onOptionSelect(result)
    }
    if (ref.current) {
      ref.current.focus()
      setIsAutocompleteOpen(false)
    }
  }

  const closeOptions = () => {
    setIsAutocompleteOpen(false)
    setFocusIndex(null)
  }

  const onInputKeyDown = e => {
    const { key } = e
    if (key === 'ArrowDown' && showAutoComplete) {
      focusOnOption(e, itemsRef.current, 0)
    }
    if (key === 'Escape' || key === 'Tab') {
      closeOptions()
    }
    if (key === 'Enter') {
      if (preventOnSubmit) {
        e.preventDefault()
        e.stopPropagation()
      }
      setIsAutocompleteOpen(false)
      if (typeof onInputEnter === 'function') {
        onInputEnter(e, value)
      }
    }
  }

  const onOptionKeyDown = (e, result, index) => {
    const { key } = e
    if (showAutoComplete) {
      if (key === 'ArrowDown' && index + 1 < resultCount) {
        focusOnOption(e, itemsRef.current, index + 1)
      }
      if (key === 'ArrowUp') {
        if (index > 0) {
          focusOnOption(e, itemsRef.current, index - 1)
        } else if (index === 0 && inputRef.current) {
          e.preventDefault()
          setFocusIndex(null)
          inputRef.current.focus()
        }
      }
      if (key === 'Enter' && showAutoComplete) {
        selectOption(e, result, inputRef)
      }
      if (key === 'Escape' || key === 'Tab') {
        closeOptions()
      }
    }
  }

  const autocompleteContainerRef = useOnClickOutsideElement(() =>
    closeOptions()
  )

  function mapAutoCompleteResults(result, index, text, key, compact) {
    if (result[text] && result[key]) {
      return (
        <InputAutocompleteBlocks.AutoCompleteListItem
          key={result[key]}
          role="option"
          aria-selected={index === focusIndex}
          id={result[key]}
          ref={itemsRef.current[index]}
          tabIndex={index === focusIndex ? 0 : -1}
          onClick={e => selectOption(e, result, inputRef)}
          onKeyDown={e => onOptionKeyDown(e, result, index)}
          onMouseDown={e => e.preventDefault()}
          compact={compact}
        >
          <InputAutocompleteBlocks.AutoCompleteText compact={compact}>
            {result[text]}
          </InputAutocompleteBlocks.AutoCompleteText>
        </InputAutocompleteBlocks.AutoCompleteListItem>
      )
    }
    return null
  }

  const resultMapper = mapAutoCompleteResults
  const compact = field && field.display && field.display.useCompact
  const colorScheme =
    (field && field.display && field.display.colorScheme) || LIGHT_COLOR_SCHEME
  const InputElement = compact
    ? FormBlocksCompact.FieldTextInputAutocomplete
    : FormBlocks.FieldTextInputAutocomplete

  return (
    <InputAutocompleteBlocks.FieldBlock ref={autocompleteContainerRef}>
      <InputElement
        field={{ display: { colorScheme } }}
        {...rest}
        value={value}
        onChange={e => {
          setIsAutocompleteOpen(true)
          onChange(e)
        }}
        onKeyDown={e => onInputKeyDown(e)}
        placeholder={placeholder}
        onFocus={onInputFocus}
        onBlur={onInputBlur}
        autoComplete="off"
        autoFocus={autoFocus}
        type="text"
        ref={inputRef}
        aria-label={placeholder}
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={showAutoComplete}
        aria-controls={`${elementId}--listbox`}
        aria-activedescendant={
          results && results[focusIndex] && results[focusIndex][resultValueKey]
        }
        hasError={hasError}
        icon={!hideIcon && !hasError}
      />
      {!hideIcon && !hasError && (
        <InputAutocompleteBlocks.Icon compact={compact}>
          <SearchIcon color="navy" />
        </InputAutocompleteBlocks.Icon>
      )}
      {showAutoComplete && results && (
        <React.Fragment>
          {resultCountLabel && (
            <InputAutocompleteBlocks.HiddenA11yExp
              role="status"
              aria-live="polite"
            >
              {resultCountLabel}
            </InputAutocompleteBlocks.HiddenA11yExp>
          )}
          <InputAutocompleteBlocks.AutoCompleteContainer
            compact
            role="listbox"
            id={`${elementId}--listbox`}
          >
            {results
              .filter(x => x[resultValueKey])
              .map((result, index) =>
                resultMapper(
                  result,
                  index,
                  resultTextKey,
                  resultValueKey,
                  compact
                )
              )}
          </InputAutocompleteBlocks.AutoCompleteContainer>
        </React.Fragment>
      )}
    </InputAutocompleteBlocks.FieldBlock>
  )
}

export default InputAutocomplete
