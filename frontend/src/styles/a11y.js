import { css } from 'styled-components';

export const a11yOnly = css`
    border: 0;
    clip: rect(0 0 0 0);
    height: 1px;
    margin: -1px;
    overflow: hidden;
    padding: 0;
    position: absolute;
    width: 1px;
`;

export const a11yFocus = css`
   ${a11yOnly}

   &:focus {
    background-color: ${({ theme }) => theme.colors.lighterLiberty};
    ${({ theme }) => theme.fonts.regularBook}
    clip: auto !important;
    clip-path: none;
    color: ${({ theme }) => theme.colors.navy};
    display: block;
    font-size: 18px;
    height: auto;
    left: 5px;
    line-height: normal;
    padding: 15px 23px 14px;
    text-decoration: none;
    top: 5px;
    width: auto;
    z-index: ${({ theme }) => theme.zIndices.tabOnlyA11y};
   }
`;
