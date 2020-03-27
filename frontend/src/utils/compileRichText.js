import React from 'react'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import { INLINES, BLOCKS, MARKS } from '@contentful/rich-text-types'
import get from 'lodash.get'

import dashSeparatedString from 'wr/utils/dashSeparatedString'
import useSourcedLink from 'wr/hooks/useSourcedLink'
import RichTextBlocks from './RichTextBlocks'

function header(level, node, children) {
  const id = dashSeparatedString(node.content[0].value)
  const HeaderComponent = RichTextBlocks.Headers[level]

  return (
    <HeaderComponent>
      {children}
      <RichTextBlocks.HiddenAnchor id={id} />
    </HeaderComponent>
  )
}

export const defaultRenderOptions = {
  renderNode: {
    [BLOCKS.EMBEDDED_ASSET]: node => {
      const {
        title,
        description,
        file: { url },
      } = get(node, 'data.target.fields')

      return (
        <div className="wp-caption alignnone">
          <img src={url} alt={title} />
          <p className="wp-caption-text">{description}</p>
        </div>
      )
    },
    [BLOCKS.EMBEDDED_ENTRY]: node => {
      return null
    },
    [BLOCKS.HEADING_1]: (node, children) => header(1, node, children),
    [BLOCKS.HEADING_2]: (node, children) => header(2, node, children),
    [BLOCKS.HEADING_3]: (node, children) => header(3, node, children),
    [BLOCKS.HEADING_4]: (node, children) => header(4, node, children),
    [BLOCKS.HEADING_5]: (node, children) => header(5, node, children),
    [BLOCKS.PARAGRAPH]: (node, children) => {
      if (children) {
        const child = children[0]

        if (
          child &&
          typeof child === 'string' &&
          child.trim() === '[[CENTER_NEXT]]'
        ) {
          return <span className="center-next" />
        }
      }

      return <RichTextBlocks.Paragraph>{children}</RichTextBlocks.Paragraph>
    },
    [BLOCKS.QUOTE]: (node, children) => (
      <RichTextBlocks.BlockQuote>{children}</RichTextBlocks.BlockQuote>
    ),
    [INLINES.HYPERLINK]: (node, children) => {
      const {
        data: { uri: href },
      } = node

      const [makeSourcedLink] = useSourcedLink()

      const anchorProps = {
        href: makeSourcedLink(href, true),
        className: 'm-rte__anchor',
      }

      if (href.startsWith('http')) {
        anchorProps.target = '_blank'
      }

      return (
        <RichTextBlocks.Anchor {...anchorProps}>
          {children}
        </RichTextBlocks.Anchor>
      )
    },
  },
  renderMark: {
    [MARKS.BOLD]: text => <RichTextBlocks.Strong>{text}</RichTextBlocks.Strong>,
    [MARKS.ITALIC]: text => (
      <RichTextBlocks.Italic>{text}</RichTextBlocks.Italic>
    ),
  },
}

export default function compileRichText(customNodes = {}) {
  const renderOptions = {
    ...defaultRenderOptions,
  }

  if (customNodes) {
    Object.keys(customNodes || {}).forEach(blockType => {
      const defaultRenderFunction = renderOptions.renderNode[blockType]
      const customRenderFunction = customNodes[blockType]

      function finalRenderFunction() {
        // @NOTE: `shouldRender` is used over `!! result`
        // as the function might intentionally return `null`
        const { shouldRender, output } = customRenderFunction(...arguments)

        if (shouldRender) {
          return output || null
        }

        return defaultRenderFunction(...arguments)
      }

      renderOptions.renderNode[blockType] = finalRenderFunction
    })
  }

  function compile(content) {
    return documentToReactComponents(content, renderOptions)
  }

  return compile
}
