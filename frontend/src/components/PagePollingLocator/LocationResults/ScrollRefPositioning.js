import styled from 'styled-components';

const ScrollRefPositioning = styled.div`
  position: relative;
  top: ${({ scrollOffset = '-80px' }) => scrollOffset};
`;

export default ScrollRefPositioning;
