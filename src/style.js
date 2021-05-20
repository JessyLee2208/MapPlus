import styled from 'styled-components';

const SearchInput = styled.input`
  brackground: none;
  position: relative;
  height: 100%;
  width: 80%;
  padding: 0;
  border: none;
  outline: none;
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
  left: 10px;
  top: 20px;
  margin-left: 8px;
  transition-property: background, box-shadow;

  transition-duration: 0.3s;
  box-shadow: 0 2px 4px rgb(0 0 0 / 20%), 0 -1px 0px rgb(0 0 0 / 2%);
  z-index: 5;
`;

const InformationBox = styled.div`
  width: 435px;
  position: relative;
  top: 70px;
`;

const InformationBoxS = styled.div`
  background: #ffffff;
  width: calc(100vw - 435px);
  position: absolute;
  left: 435px;
  bottom: 0;
  z-index: -5;
  display: flex;
  overflow: auto;
  // padding: 0 10px;
`;

const InformationBg = styled.div`
  background: #ffffff;
  height: 100vh;
  width: 435px;
  position: relative;
  box-shadow: 0 2px 4px rgb(0 0 0 / 20%), 0 0px 10px rgb(0 0 0 / 10%);
  // z-index: 5;
  overflow: auto;
`;

const Frame = styled.div`
  position: absolute;
  top:0,
  left:0
`;

const SingInBtn = styled.button`
  position: fixed;
  right: 62px;
  top: 13px;

  background: #4285f4;
  color: #fff;
  outline: none;
  font-weight: bold;
  display: inline-block;
  line-height: 36px;
  padding: 0 16px;
  border-radius: 2px;
  border: 0;
`;

export { SearchInput, InformationBox, SearchBox, InformationBg, Frame, InformationBoxS, SingInBtn };
