import styled, { css, keyframes } from 'styled-components'

import createBreakpointStyles from '../../styles/createBreakpointStyles'
import warrenLogoNavy from '../../../assets/images/warren-logo--navy.svg'
import warrenLogoWhite from '../../../assets/images/warren-logo--white.svg'

export const LIGHT = 'LIGHT'
export const DARK = 'DARK'

// TODO: move to helper function
const switchBasedOnScheme = (colorScheme, styles) => styles[colorScheme] || ''

const boxShadow = css`
  box-shadow: 0 3px 0 0 rgba(228, 228, 228, 0.7);
`

const slideDown = keyframes`
  from { transform: translateY(-100%); }
  to { transform: translateY(0); }
`

const themedLinkStyles = {
  [LIGHT]: css`
    color: ${({ theme }) => theme.colors.navy};
    svg > g {
      stroke: ${({ theme }) => theme.colors.navy};
    }
    &:hover {
      color: ${({ theme }) => theme.colors.purple};
    }
  `,
  [DARK]: css`
    color: ${({ theme }) => theme.colors.white};
    svg > g {
      stroke: ${({ theme }) => theme.colors.white};
    }
    &:hover {
      color: ${({ theme }) => theme.colors.liberty};
    }
  `,
}

const themedLogo = {
  [LIGHT]: css`
    background-image: url(${warrenLogoNavy});
  `,
  [DARK]: css`
    background-image: url(${warrenLogoWhite});
  `,
}

export const FADE_IN = 'FADE_IN'
export const FADE_OUT = 'FADE_OUT'

const LangSwitchLink = styled.a`
  font-size: 12px;
  ${({ navTheme }) => switchBasedOnScheme(navTheme, themedLinkStyles)};
`

const navLinkStyles = css`
  ${({ theme }) => theme.fonts.compressedBold};
  font-size: 20px;
  font-weight: bold;
  line-height: 1;
  letter-spacing: 0.45px;
  vertical-align: top;
  white-space: nowrap;
  cursor: pointer;
  font-weight: 700;
  letter-spacing: 1.6px;
  text-transform: uppercase;
  transition: all 0.3s ease-in-out;
  letter-spacing: 0.5px;

  ${({ theme }) =>
    createBreakpointStyles(
      theme.breakpoints.desktopSmall,
      css`
        font-size: 22px;
      `
    )}
`

const stickyNavStyle = css`
  display: flex;
  width: 100%;
  flex-direction: row;
  display: flex;
  align-items: center;

  ${LangSwitchLink} {
    font-size: 14px;
  }
`

const HeaderNav = styled.div`
  ${({ isSticky }) => (isSticky ? stickyNavStyle : '')};
`

const stickyNavLinkStyle = css`
  line-height: inherit;
  margin-top: 0px;
`

const NavLink = styled.a`
  ${navLinkStyles};
  ${({ navTheme }) => switchBasedOnScheme(navTheme, themedLinkStyles)};
  transition: margin 0.1s ease-in;
  &:hover {
    margin-top: 4px;
  }

  ${({ isSticky }) => (isSticky ? stickyNavLinkStyle : '')}
`

const stickyHeader = css`
  ${boxShadow}
  animation: ${slideDown} 0.3s ease-in forwards;
  background-color: ${({ theme }) => theme.colors.white};
  left: 0;
  position: fixed;
  right: 0;
  top: 0;
  z-index: ${({ theme }) => theme.zIndices.stickyHeader};

  ${({ isTakeoverMenuOpen }) =>
    isTakeoverMenuOpen &&
    css`
      height: 100%;
    `}

  & ${NavLink} {
    ${({ theme }) =>
      createBreakpointStyles(
        theme.breakpoints.mobileLarge,
        css`
          font-size: 14px;
          line-height: 1;
        `
      )}

    ${({ theme }) =>
      createBreakpointStyles(
        theme.breakpoints.desktopSmall,
        css`
          font-size: 18px;
        `
      )}
  }

  ${({ theme }) =>
    createBreakpointStyles(
      theme.breakpoints.tablet,
      css`
        padding-bottom: 14px;

        ul {
          padding-left: 25px;
          padding-right: 25px;
        }
      `
    )}
`

const List = styled.ul`
  list-style: none;
  margin: 0;
  flex-grow: 1;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
`

const desktopLogoStyle = css`
  ${({ theme }) =>
    createBreakpointStyles(
      theme.breakpoints.tablet,
      css`
        height: 45px;
        width: 140px;
        margin-top: 6px;
      `
    )}
`

const ListItem = styled.li`
  z-index: 2;
  order: ${({ index }) => index};
  display: ${({ hideOnMobile }) => (hideOnMobile ? 'none' : 'flex')};
  height: 100%;
  align-items: center;
  letter-spacing: 0.6px;

  ${({ theme }) =>
    createBreakpointStyles(
      theme.breakpoints.tablet,
      css`
        display: flex;
      `
    )}

  &:first-of-type {
    order: ${({ showFirst }) => (showFirst ? 0 : 4)};
    display: flex;
    align-items: center;

    ${NavLink} {
      display: inline-block;
      font-size: 0px;
      ${({ navTheme }) => switchBasedOnScheme(navTheme, themedLogo)}
      background-position: center;
      background-repeat: no-repeat;
      background-size: cover;
      height: 29px;
      width: 92px;
      ${({ isSticky }) => (!isSticky ? desktopLogoStyle : null)}
    }
  }
`

const UtilityNav = styled.nav`
  display: flex;
  justify-content: space-between;
  width: 100%;
`

const MobileMenuButton = styled.button`
  ${navLinkStyles}
  display: block;
  z-index: ${({ theme }) => theme.zIndices.header};

  ${({ navTheme }) => switchBasedOnScheme(navTheme, themedLinkStyles)};

  ${({ theme }) =>
    createBreakpointStyles(
      theme.breakpoints.tablet,
      css`
        display: none;
      `
    )}
`

const LangSwitchContainer = styled.div`
  display: flex;
  align-items: center;
`

const HeaderInner = styled.div`
  max-width: ${({ theme }) => theme.max.section};
  padding: 17px 25px 14px;
  width: 100%;

  ${LangSwitchContainer} {
    display: ${({ isSimple }) => (isSimple ? 'block' : 'none')};
  }

  ${({ theme }) =>
    createBreakpointStyles(
      theme.breakpoints.tablet,
      css`
        padding: ${({ isSimple }) =>
          isSimple ? '38px 25px 0px' : '19px 25px 0px'};

        ${LangSwitchContainer}, {
          display: flex;
          z-index: ${theme.zIndices.header};
        }
      `
    )}
`

const regularHeader = css`
  margin-bottom: 0px;

  ${({ theme }) =>
    createBreakpointStyles(
      theme.breakpoints.tablet,
      css`
        margin-bottom: 40px;
      `
    )}

  ${({ theme }) =>
    createBreakpointStyles(
      theme.breakpoints.desktopMedium,
      css`
        margin-bottom: 83px;
      `
    )}
`

const StickyHeaderOffset = styled.div`
  margin-top: ${({ theme }) => `${theme.spacing.navOffset.small * 2}px`};
  display: block;
  width: 100%;
  animation: ${slideDown} 0.3s ease-in forwards;
`

const Header = styled.header`
  color: ${({ theme }) => theme.colors.navy};
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: ${({ theme }) => theme.zIndices.header};

  ${props => (props.isSticky ? stickyHeader : regularHeader)};
`

const SearchBarContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.lighterLiberty};
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  padding: 19px 30px;
`

const navBlocks = {
  Header,
  HeaderInner,
  HeaderNav,
  List,
  ListItem,
  NavLink,
  UtilityNav,
  StickyHeaderOffset,
  MobileMenuButton,
  LangSwitchContainer,
  LangSwitchLink,
  SearchBarContainer,
}

export default navBlocks
