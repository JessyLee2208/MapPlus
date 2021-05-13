import styled from 'styled-components';

const SearchInput = styled.input`
  brackground: none;
  position: relative;
  height: 100%;
  width: 80%;
  padding: 0;
  border: none;
`;

const SearchBox = styled.div`
  background: #ffffff;
  border: 1px solid transparent;
  border-radius: 8px;
  width: 392px;
  height: 48px;
  padding: 0 12px;

  boxshadow: 0 2px 6px rgba(0, 0, 0, 0.3);
  fontsize: 14px;
  outline: none;
  textoverflow: ellipses;
  position: absolute;
  left: 0;
  top: 20px;
  margin-left: 8px;
  transition-property: background, box-shadow;

  transition-duration: 0.3s;
  box-shadow: 0 2px 4px rgb(0 0 0 / 20%), 0 -1px 0px rgb(0 0 0 / 2%);
  z-index: 5;
`;

const InformationBox = styled.div`
  height: 100%;
  width: 435px;
  position: absolute;
  top: 85px;

  overflow: auto;
`;

const InformationBg = styled.div`
  background: #ffffff;
  height: 100%;
  width: 435px;
  position: absolute;
  box-shadow: 0 2px 4px rgb(0 0 0 / 20%), 0 0px 10px rgb(0 0 0 / 10%);
`;

export { SearchInput, InformationBox, SearchBox, InformationBg };
