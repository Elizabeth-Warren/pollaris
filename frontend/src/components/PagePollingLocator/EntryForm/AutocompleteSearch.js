import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import { Button } from '@ewarren/persist';
import get from 'lodash.get';

import createBreakpointStyles from 'wr/styles/createBreakpointStyles';

const SearchBarWrapper = styled.div`
  display: flex;
  flex-direction: column;

  button {
    margin-top: 16px;
  }

  ${({ theme }) => createBreakpointStyles(theme.breakpoints.tablet, css`
    flex-direction: row;

    button {
      margin-left: 8px;
      margin-top: 0;
    }
  `)}
`;

const ErrorMessage = styled.span`
  margin-left: 8px;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.red};
`;

function AutoCompleteSearch(props) {
  const {
    formLabel,
    submitButtonText,
    errorMessage,
    children,
    onSearch,
  } = props;

  const elementId = 'vote-address-search';

  return (
    <form onSubmit={onSearch}>
      <label htmlFor={elementId}>
        {formLabel}
        {errorMessage && (
          <ErrorMessage aria-live="polite">{errorMessage}</ErrorMessage>)}
        <SearchBarWrapper>
          {children({ elementId })}
          <Button type="submit" level="tertiary" size="sm">{submitButtonText}</Button>
        </SearchBarWrapper>
      </label>
    </form>
  );
}

export default AutoCompleteSearch;
