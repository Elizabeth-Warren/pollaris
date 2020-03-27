import React from 'react'

import EntryFormBlocks from './style'
import { Headline, BodyCopy } from '../../persist'

function EntryForm(props) {
  const { title, description, children } = props

  return (
    <React.Fragment>
      <EntryFormBlocks.HeaderWrapper>
        <Headline as="h1" size="lg">
          {title}
        </Headline>
      </EntryFormBlocks.HeaderWrapper>
      <EntryFormBlocks.FormSection>
        <EntryFormBlocks.EntryFormContainer>
          <EntryFormBlocks.FormHeader>
            <BodyCopy size="md" as="h2">
              {description}
            </BodyCopy>
          </EntryFormBlocks.FormHeader>
          {children}
        </EntryFormBlocks.EntryFormContainer>
      </EntryFormBlocks.FormSection>
    </React.Fragment>
  )
}

export default EntryForm
