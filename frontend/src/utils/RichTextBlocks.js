/* eslint-disable */

import styled, { css } from 'styled-components';
import { link } from '../styles/typography';
import createBreakpointStyles from '../styles/createBreakpointStyles';
import { mediumButton } from '../styles/button';

// TODO:
//  - All of this CSS should become individual styled components
//  - Custom modules should not be here by default

const Paragraph = styled.p`
  ${({ theme }) => theme.fonts.regularBook}
  font-size: 18px;
  line-height: 1.4;
  color: ${({ theme }) => theme.colors.bodyColor};
  margin-bottom: 28px;

  ${({ theme }) => createBreakpointStyles(theme.breakpoints.tablet, `
    line-height: 1.67;
  `)}
`;

const baseHeaderStyles = css`
  position: relative;
`;

const Header1 = styled.h1`
  ${baseHeaderStyles}
  ${({ theme }) => theme.fonts.compressedBold}
  font-size: 52px;
  letter-spacing: 0.3px;
  line-height: 0.92;
  margin-bottom: 32px;
  color: ${({ theme }) => theme.colors.navy};

  ${({ theme }) => createBreakpointStyles(theme.breakpoints.tablet, `
    font-size: 60px;
  `)}
`;

const Header2 = styled.h2`
  ${baseHeaderStyles}
  ${({ theme }) => theme.fonts.compressedBold}
  font-size: 26px;
  line-height: 0.94;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.bodyColor};
  margin-bottom: 28px;

  ${({ theme }) => createBreakpointStyles(theme.breakpoints.tablet, `
    margin-bottom: 32px;
  `)}
`;

const Header3 = styled.h3`
  ${baseHeaderStyles}
  ${({ theme }) => theme.fonts.extraWide}
  font-size: 16px;
  line-height: 1.59;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.navy};
  margin-bottom: 18px;

  ${({ theme }) => createBreakpointStyles(theme.breakpoints.tablet, `
    margin-bottom: 32px;
  `)}
`;

const Header4 = styled.h4`
  ${baseHeaderStyles}
  ${({ theme }) => theme.fonts.regularBook}
  font-size: 24px;
  line-height: 1.34;
  color: ${({ theme }) => theme.colors.navy};
`;

const Header5 = styled.h5`
  ${baseHeaderStyles}
  ${({ theme }) => theme.fonts.extraWide}
  font-weight: 700;
  font-size: 12px;
  letter-spacing: 0.86px;
  line-height: 1.17;
  text-transform: uppercase;
`;

const Anchor = styled.a`
  ${({ theme }) => link(theme.colors.liberty)}
`;

const HiddenAnchor = styled.span`
  position: absolute;
  top: -120px;
  display: block;
  width: 100%;
  height: 0;
`;

const Strong = styled.strong`
  ${({ theme }) => theme.fonts.regularBookBold}
  font-family: inherit;
`;

const Italic = styled.em`
  ${({ theme }) => theme.fonts.regularBookItalic}
  font-family: inherit;
`;

const Headers = {
  1: Header1,
  2: Header2,
  3: Header3,
  4: Header4,
  5: Header5,
};

const BlockQuote = styled.blockquote`
  border-bottom: 7px solid ${({ theme }) => theme.colors.liberty};
  border-top: 7px solid ${({ theme }) => theme.colors.liberty};
  margin: 38px 0;
  padding: 26px 50px;
  text-align: center;

  ${({ theme }) => createBreakpointStyles(theme.breakpoints.tablet, `
    margin: 60px 0;
    padding: 45px 12%;
  `)}

  p {
    ${({ theme }) => theme.fonts.regularBook}
    font-size: 18px;
    line-height: 1.4;
    margin-bottom: 0;
    max-width: none;
    color: ${({ theme }) => theme.colors.navy};

    ${({ theme }) => createBreakpointStyles(theme.breakpoints.tablet, css`
      font-size: 26px;
    `)}
  }
`;

const Container = styled.article`
  display: block;
  width: 100%;
  max-width: ${({ theme }) => theme.max.content};
  margin: 0 auto 50px;
  overflow-wrap: break-word;
  word-wrap: break-word;

  > ${Paragraph},
  > ${Header1},
  > ${Header2},
  > ${Header3},
  > ${Header4},
  > ${Header5},
  > h6,
  > ${Anchor},
  > ul,
  > ol {
    padding-left: ${({ theme }) => theme.spacing.contentGutter};
    padding-right: ${({ theme }) => theme.spacing.contentGutter};
  }

  em {
    ${({ theme }) => theme.fonts.regularBookItalic}
  }

  strong em, em strong {
    ${({ theme }) => theme.fonts.regularBookBoldItalic}
  }

  ul,
  ol {
    font-size: 16px;
    line-height: 1.63;
    margin: 10px 0 40px 25px;

    ${({ theme }) => createBreakpointStyles(theme.breakpoints.tablet, css`
      margin-left: 50px;
    `)}

    li {
      margin-bottom: 20px;

      p {
        margin-bottom: 0;
      }
    }
  }

  ul {
    li {
      list-style-type: disc;
    }
  }

  ol {
    li {
      list-style-type: decimal;
    }
  }

  ${'' /* Lagacy Image Styles */}
  .wp-caption-text {
    ${({ theme }) => theme.fonts.regularBook}
    font-size: 14px;
    color: ${({ theme }) => theme.colors.navy};
    line-height: 1.21;
    margin: -10px 0 0 0;

    ${({ theme }) => createBreakpointStyles(theme.breakpoints.tablet, `
      line-height: 1.3;
    `)}
  }

  .alignright, .alignleft {
    margin-bottom: 35px;
    padding: 0 25px;
    float: none;
    margin-left: auto;
    margin-right: auto;

    ${({ theme }) => createBreakpointStyles(theme.breakpoints.tablet, `
      margin-top: 10px;
      padding: 0;
    `)}

    .wp-caption-text {
      background-color: ${({ theme }) => theme.colors.liberty};
      padding: 15px 20px;
    }
  }

  .alignright {
    ${({ theme }) => createBreakpointStyles(theme.breakpoints.tablet, `
      margin-left: 35px;
    `)}
  }

  .alignleft {
    margin-right: 35px;
  }

  .aligncenter {
    margin: 10px 0 20px;
    position: relative;
    max-width: none;
    width: 100vw;

    ${({ theme }) => createBreakpointStyles(theme.breakpoints.tablet, css`
      width: 100%;
      margin: 60px 0 80px;

      &::before {
        background-color: ${({ theme }) => theme.colors.navy};
        bottom: 0;
        content: "";
        height: 50%;
        left: -50px;
        position: absolute;
        width: calc(100% + 100px);
      }
    `)}

    img {
      ${({ theme }) => createBreakpointStyles(theme.breakpoints.tablet, `
        position: relative;
        z-index: 1;
      `)}
    }

    .wp-caption-text {
      background-color: ${({ theme }) => theme.colors.navy};
      color: ${({ theme }) => theme.colors.white};
      padding: 25px 35px;

      ${({ theme }) => createBreakpointStyles(theme.breakpoints.tablet, `
        background-color: transparent;
        padding: 25px 0;
        position: relative;
        z-index: 1;
      `)}
    }
  }

  ${'' /* Legacy Custom Markup Component Styles */}
  .center-next + * {
    text-align: center;
  }

  .m-rte__red-button {
    display: block;
    background: none;

    button {
      ${({ theme }) => mediumButton(theme.colors.red, theme.colors.white, theme.colors.red)}
      margin-bottom: 28px;
    }
  }

  ${'' /* Legacy Privacy Policy Styling */}
  .option-list {
    .option-list__option {
      margin-bottom: 40px;
    }

    .option-list__head {
      ${({ theme }) => theme.fonts.regularBookBold}
      font-size: 16px;
      line-height: 1.44;
      color: ${({ theme }) => theme.colors.bodyColor};
      margin-bottom: 0;
    }

    .option-list__copy {
      ${({ theme }) => theme.fonts.regularBook}
      font-size: 16px;
      line-height: 1.44;
      margin-bottom: 14px;
    }

    .form-label--checkbox {
      font-size: 16px;
    }

    .option-list__alert {
      ${({ theme }) => theme.fonts.regularBookItalic}
      display: block;
      font-size: 16px;
      margin: 6px 0 0;
      opacity: 1;
      position: absolute;
      transition: opacity 0.35s linear;
    }

    .form-field--checkbox {
      &:checked {
        & + .form-label--checkbox {
          .option-list__alert {
            opacity: 0;
          }
        }
      }
    }
  }

  .m-rte__custom-markup {
    padding-left: 35px;
    padding-right: 35px;
  }
`;

const blocks = {
  Container,
  Paragraph,
  Headers,
  Header1,
  Header2,
  Header3,
  Header4,
  Header5,
  BlockQuote,
  Anchor,
  HiddenAnchor,
  Strong,
  Italic,
};

export default blocks;
