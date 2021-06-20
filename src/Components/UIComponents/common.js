import styled from 'styled-components';

const Separator = styled.div`
  width: ${({ width }) => (width ? width : 'auto')};
  min-height: 1px;
  background: #efefef;
  margin: ${({ margin }) => (margin ? margin : 0)};
`;

export { Separator };
