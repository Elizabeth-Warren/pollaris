import React from 'react';
import { withTheme } from 'styled-components';

const SearchIcon = (props) => {
  const { theme, color } = props;
  return (
    <svg width={20} height={20} version="1.1" xmlns="http://www.w3.org/2000/svg">
      <g id="Page-5" stroke="none" viewBox="0 0 20 20" strokeWidth="1" fill="none" fillRule="evenodd">
        <g id="EW_mobilizationToolkit_make3_va01" transform="translate(-1094.000000, -600.000000)" stroke={theme.colors[color]} strokeWidth="2">
          <g id="FILTER-OPEN" transform="translate(843.000000, 552.000000)">
            <g id="search" transform="translate(38.000000, 38.574219)">
              <g id="Group-23">
                <g id="Group-8" transform="translate(221.000000, 17.611328) rotate(-45.000000) translate(-221.000000, -17.611328) translate(215.000000, 9.611328)">
                  <circle id="Oval" cx="6.14644661" cy="5.93933983" r="5.5" />
                  <path d="M5.79289322,11.363961 L5.79289322,15.363961" id="Line-2" strokeLinecap="square" />
                </g>
              </g>
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
};

export default withTheme(SearchIcon);
