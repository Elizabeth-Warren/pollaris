import { createGlobalStyle } from 'styled-components';

const GlobalSiteStyles = createGlobalStyle`
  /*
  Copyright (C) Hoefler & Co.
  This software is the property of Hoefler & Co. (H&Co).
  Your right to access and use this software is subject to the
  applicable License Agreement, or Terms of Service, that exists
  between you and H&Co. If no such agreement exists, you may not
  access or use this software for any purpose.
  This software may only be hosted at the locations specified in
  the applicable License Agreement or Terms of Service, and only
  for the purposes expressly set forth therein. You may not copy,
  modify, convert, create derivative works from or distribute this
  software in any way, or make it accessible to any third party,
  without first obtaining the written permission of H&Co.
  For more information, please visit us at http://typography.com.
  */

  @font-face {
    font-family: 'Ringside Regular A';
    src: url('https://cdn.elizabethwarren.com/_public/fonts/RingsideRegular-Book_Web.woff2') format('woff2'), url('https://cdn.elizabethwarren.com/_public/fonts/RingsideRegular-Book_Web.woff') format('woff');
    font-weight: 400;
    font-style: normal;
  }

  @font-face {
    font-family: 'Ringside Regular A';
    src: url('https://cdn.elizabethwarren.com/_public/fonts/RingsideRegular-BookItalic_Web.woff2') format('woff2'), url('https://cdn.elizabethwarren.com/_public/fonts/RingsideRegular-BookItalic_Web.woff') format('woff');
    font-weight: 400;
    font-style: italic;
  }

  @font-face {
    font-family: 'Ringside Regular A';
    src: url('https://cdn.elizabethwarren.com/_public/fonts/RingsideRegular-Bold_Web.woff2') format('woff2'), url('https://cdn.elizabethwarren.com/_public/fonts/RingsideRegular-Bold_Web.woff') format('woff');
    font-weight: 700;
    font-style: normal;
  }

  @font-face {
    font-family: 'Ringside Regular A';
    src: url('https://cdn.elizabethwarren.com/_public/fonts/RingsideRegular-BoldItalic_Web.woff2') format('woff2'), url('https://cdn.elizabethwarren.com/_public/fonts/RingsideRegular-BoldItalic_Web.woff') format('woff');
    font-weight: 700;
    font-style: italic;
  }

  @font-face {
    font-family: 'Ringside Extra Wide SSm A';
    src: url('https://cdn.elizabethwarren.com/_public/fonts/RingsideExtraWideSSm-Black_Web.woff2') format('woff2'), url('https://cdn.elizabethwarren.com/_public/fonts/RingsideExtraWideSSm-Black_Web.woff') format('woff');
    font-weight: 800;
    font-style: normal;
  }

  @font-face {
    font-family: 'Ringside Compressed A';
    src: url('https://cdn.elizabethwarren.com/_public/fonts/RingsideCompressed-Bold_Web.woff2') format('woff2'), url('https://cdn.elizabethwarren.com/_public/fonts/RingsideCompressed-Bold_Web.woff') format('woff');
    font-weight: 700;
    font-style: normal;
  }

  @import url("https://use.typekit.net/yli8oct.css");
`;

export default GlobalSiteStyles;
