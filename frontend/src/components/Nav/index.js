import React from 'react'
import NavigationBlocks from './style'
import LanguageSwitcher from './LanguageSwitcher'

function Nav({ pageNodes, locale }) {
  return (
    <NavigationBlocks.Header>
      <NavigationBlocks.HeaderInner isSimple>
        <NavigationBlocks.HeaderNav>
          <nav aria-label={'menu'}>
            <NavigationBlocks.List>
              <NavigationBlocks.ListItem showFirst navTheme={'LIGHT'}>
                <NavigationBlocks.NavLink
                  aria-label={'title'}
                  navTheme={'LIGHT'}
                />
              </NavigationBlocks.ListItem>
              <LanguageSwitcher
                navTheme={'LIGHT'}
                locale={locale}
                pageNodes={pageNodes}
              />
            </NavigationBlocks.List>
          </nav>
        </NavigationBlocks.HeaderNav>
      </NavigationBlocks.HeaderInner>
    </NavigationBlocks.Header>
  )
}

export default Nav
