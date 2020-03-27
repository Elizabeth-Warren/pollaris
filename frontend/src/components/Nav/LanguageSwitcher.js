import React from 'react'
import NavigationBlocks from './style'

function LanguageSwitcher({ locale, pageNodes }) {
  let altPage
  const alternativeNode = pageNodes.find(({ page: [{ node_locale }] }) => {
    return node_locale !== locale
  })

  if (alternativeNode) {
    const {
      page: [page],
    } = alternativeNode
    altPage = page
  }

  return (
    <NavigationBlocks.LangSwitchContainer>
      {alternativeNode && (
        <NavigationBlocks.LangSwitchLink
          navTheme={'LIGHT'}
          lang={altPage.node_locale}
          href={altPage.path}
        >
          {altPage.node_locale === 'es-MX' ? 'En Español' : 'In English'}
        </NavigationBlocks.LangSwitchLink>
      )}
    </NavigationBlocks.LangSwitchContainer>
  )
}

export default LanguageSwitcher
