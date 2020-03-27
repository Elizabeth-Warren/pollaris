import React from 'react'
import styled, { css } from 'styled-components'
import get from 'lodash.get'

import { theme as persist, BodyCopy } from '@ewarren/persist'
import createBreakpointStyles from 'wr/styles/createBreakpointStyles'
import compileRichText from 'wr/utils/compileRichText'
import chevron from 'wr/styles/icons/chevron'
import transformRichTextGrouping from 'wr/utils/transformRichTextGrouping'

const HEADING_TYPE = 'heading-1'

const Card = styled.div`
  padding: ${persist.spacing.sp2} ${persist.spacing.sp1};
  background-color: white;
  margin-top: ${persist.spacing.sp1};

  ${({ theme }) =>
    createBreakpointStyles(
      theme.breakpoints.tablet,
      css`
        padding: ${persist.spacing.sp2};
      `
    )}
`

const RichText = styled.div`
  p,
  a {
    color: ${({ theme }) => theme.colors.navy};
  }

  a {
    ${chevron('red', 5, false, 3, undefined, 'red')}
    ${({ theme }) => theme.fonts.regularBookBold}
    background: none;
    display: block;
    width: fit-content;
  }

  li {
    margin-bottom: ${persist.spacing.sp2};
  }

  p:last-of-type {
    margin-bottom: 0;
  }
`

function VoteByMailSteps(props) {
  const { voteByMailContent } = props

  const { headings, content } = transformRichTextGrouping(
    HEADING_TYPE,
    voteByMailContent.content
  )

  return headings.map((heading, index) => (
    <Card>
      <BodyCopy color="navy" weight="bold">
        {get(heading, ['content', '0', 'value'])}
      </BodyCopy>
      <RichText>
        {compileRichText()({
          ...voteByMailContent,
          content: content[index],
        })}
      </RichText>
    </Card>
  ))
}

export default VoteByMailSteps
