import { css } from 'styled-components'

const breakpoints = {
  mobileSmall: '320px',
  mobileMedium: '375px',
  mobileLarge: '410px',
  tablet: '768px',
  desktopSmall: '1024px',
  desktopMedium: '1440px',
  desktopLarge: '2560px',
}

const colors = {
  black: '#000000',
  bodyColor: '#171717',
  liberty: '#B7E4CF',
  lightLiberty: '#E3F4EC',
  lighterLiberty: '#EFF8F6',
  blue: '#2A79AD',
  navy: '#232444',
  lightNavy: '#2E2F4D',
  purple: '#575893',
  offWhite: '#f7f7f7',
  red: '#B61B28',
  brightRed: '#EE2C3C',
  lightRed: '#EF3948',
  opaqueRed: 'rgba(182, 27, 40, 0.2)',
  sunriseYellow: '#FFAA3B',
  copper: '#D06B48',
  forestGreen: '#34635A',
  white: '#FFFFFF',
  cream: '#F8EFE0',
  lightGrey: '#cacaca',
  medGrey: '#717171',
}

const fonts = {
  regularBook: css`
    font-family: 'Ringside Regular A', 'Ringside Regular B';
    font-style: normal;
    font-weight: 400;
  `,
  regularBookItalic: css`
    font-family: 'Ringside Regular A', 'Ringside Regular B';
    font-style: italic;
    font-weight: 400;
  `,
  regularBookBold: css`
    font-family: 'Ringside Regular A', 'Ringside Regular B';
    font-style: normal;
    font-weight: 700;
  `,
  regularBookBoldItalic: css`
    font-family: 'Ringside Regular A', 'Ringside Regular B';
    font-style: italic;
    font-weight: 700;
  `,
  compressedBold: css`
    font-family: 'Ringside Compressed A', 'Ringside Compressed B';
    font-style: normal;
    font-weight: 700;
  `,
  wideLight: css`
    font-family: 'Ringside Wide A', 'Ringside Wide B';
    font-style: normal;
    font-weight: 300;
  `,
  wideBold: css`
    font-family: 'Ringside Wide A', 'Ringside Wide B';
    font-style: normal;
    font-weight: 700;
  `,
  extraWide: css`
    font-family: 'Ringside Extra Wide SSm A', 'Ringside Extra Wide SSm B';
    font-style: normal;
    font-weight: 800;
  `,
  serifBook: css`
    font-family: freight-text-pro, Georgia, serif;
    font-weight: 400;
    font-style: normal;
  `,
  serifBookItalic: css`
    font-family: freight-text-pro, Georgia, serif;
    font-weight: 400;
    font-style: italic;
  `,
  serifBold: css`
    font-family: freight-text-pro, Georgia, serif;
    font-weight: 700;
    font-style: normal;
  `,
  serifBoldItalic: css`
    font-family: freight-text-pro, Georgia, serif;
    font-weight: 700;
    font-style: italic;
  `,
  ewIcons: css`
    font-family: 'ew-icons' !important;
    speak: none;
    font-style: normal;
    font-weight: normal;
    font-variant: normal;
    text-transform: none;
    line-height: 1;

    /* Enable Ligatures ================ */
    letter-spacing: 0;
    -webkit-font-feature-settings: 'liga';
    -moz-font-feature-settings: 'liga=1';
    -moz-font-feature-settings: 'liga';
    -ms-font-feature-settings: 'liga' 1;
    font-feature-settings: 'liga';
    -webkit-font-variant-ligatures: discretionary-ligatures;
    font-variant-ligatures: discretionary-ligatures;

    /* Better Font Rendering =========== */
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  `,
}

const max = {
  site: '1400px',
  section: '1150px',
  content: '710px',
}

const twoColumns = {
  content: 825,
  maxWidth: 1261,
  desktop: {
    marginRight: 404,
    marginLeft: 32,
    calloutWidth: 275,
  },
  mobile: {
    marginRight: 32,
    marginLeft: 32,
  },
}

const spacing = {
  contentGutter: '35px',
  navOffset: {
    small: 61,
    medium: 130,
    large: 173,
  },
}

const fontSize = {
  body: {
    mobile: '18px',
    desktop: '26px',
  },
  title: {
    mobile: '42px',
    desktop: '72px',
  },
}

const timing = {
  hover: '0.15s',
  socialIconHover: '0.3s',
}

const fontSizes = {
  small: '14px',
}

const zIndices = [
  'thermometerProgress',
  'videoThumb',
  'videoPlayer',
  'searchAutoComplete',
  'filterMenu',
  'modal',
  'alert',
  'donateBar',
  'header',
  'thermometerDonateBar',
  'stickyHeader',
  'searchBar',
  'takeover',
  'adsPageDonateBar',
  'tabOnlyA11y',
].reduce((acc, name, index) => ({ ...acc, [name]: index + 10 }), {})

const theme = {
  colors,
  breakpoints,
  fonts,
  max,
  spacing,
  timing,
  fontSizes,
  fontSize,
  zIndices,
  twoColumns,
}

export default theme
