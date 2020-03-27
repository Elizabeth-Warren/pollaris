import React, { useState, useEffect } from 'react'
import CopyToClipboard from 'react-copy-to-clipboard'
import styled, { css, keyframes } from 'styled-components'

import { BodyCopy } from '@ewarren/persist'
import { theme as persist } from '@ewarren/persist'

import fade from './fade'
import createBreakpointStyles from 'wr/styles/createBreakpointStyles'
import makeSharePath from '../utils/makeSharePath'
import { openFacebookShare, openTwitterShare } from '../utils/openShareDialog'

const Share = styled.div`
  margin-bottom: 28px;
  text-align: center;

  ${({ theme }) =>
    createBreakpointStyles(
      theme.breakpoints.tablet,
      css`
        font-size: 22px;
      `
    )}
`

const fadeInAnimation = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`

const FormWrapper = styled.div`
  opacity: 0;
  animation: ease-in forwards 1s ${fadeInAnimation};
  ${fade()}

  h4 {
    margin-bottom: 32px;
  }
`

const ShareLabel = styled.p`
  color: ${({ theme }) => theme.colors.navy};

  ${({ theme }) =>
    createBreakpointStyles(
      theme.breakpoints.tablet,
      css`
        font-size: 22px;
        display: inline-block;
        margin-bottom: 0;
        margin-right: 1.2em;
      `
    )}
`

const ShareButton = styled.button`
  ${({ theme }) => theme.fonts.ewIcons};
  color: ${({ theme }) => theme.colors.navy};
  cursor: pointer;
  margin-right: 0.7em;
  font-size: 42px;
  vertical-align: middle;

  &:last-of-type {
    margin-right: 0;
  }
`

const BoldText = styled.h5`
  display: inline-block;
  ${({ theme }) => theme.fonts.regularBookBold}
  margin-right: 4px;
`

const ClickToCopy = styled.a`
  cursor: pointer;
  word-break: break-all;
  ${({ theme }) => theme.fonts.regularBook}
  font-size: ${persist.fontSize.sm};
`

function UpcomingEvents(props) {
  const { shareLabel, settings } = props
  const [copied, setCopied] = useState(false)
  const voteUrl = makeSharePath()
  const { copyUrl = {} } = settings

  useEffect(() => {
    let timeoutId
    if (copied) {
      timeoutId = setTimeout(() => {
        setCopied(false)
      }, 5000)
    }

    return () => clearTimeout(timeoutId)
  }, [copied])

  return (
    <FormWrapper>
      <BodyCopy size="md" as="h4">
        {settings.sharePrompt}
      </BodyCopy>
      <Share>
        <ShareLabel>{shareLabel}</ShareLabel>
        <ShareButton
          type="button"
          onClick={() => openFacebookShare(settings.facebookShareText)}
        >
          Facebook
        </ShareButton>
        <ShareButton
          type="button"
          onClick={() => openTwitterShare(settings.twitterShareText)}
        >
          Twitter
        </ShareButton>
      </Share>
      <div>
        <BodyCopy as={BoldText}>{copyUrl.label}</BodyCopy>
        {copied && <BodyCopy as="span">{copyUrl.afterVerb}</BodyCopy>}
      </div>
      <CopyToClipboard text={voteUrl} onCopy={() => setCopied(true)}>
        <ClickToCopy>{voteUrl}</ClickToCopy>
      </CopyToClipboard>
    </FormWrapper>
  )
}

export default UpcomingEvents
