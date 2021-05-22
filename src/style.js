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

const SearchBoxNoShadow = styled.div`
  background: #ffffff;
  // border: 1px solid transparent;
  border-radius: 8px 8px 0 0;
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

  border-bottom: 1px solid #efefef;
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

const Back = styled.div`
  background: #ffffff;
  border: 1px solid transparent;
  border-radius: 8px;
  width: 392px;
  height: 86px;
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
  z-index: 4;
`;

const BackTitle = styled.p`
  font-family: Roboto, 'Noto Sans TC', Arial, sans-serif;
  font-size: 14px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: left;
  color: #185ee6;
  position: relative;
  left: 0px;
  bottom: -56px;
`;

const SearchBg = styled.div`
  background-image: linear-gradient(to bottom, rgb(19 19 19 / 50%), transparent 70%);
  // border: 1px solid transparent;
  border-radius: 0px;
  width: 435px;
  height: 106px;

  position: absolute;
  left: 0px;
  top: 0px;

  transition-property: background, box-shadow;

  transition-duration: 0.3s;

  z-index: 2;
`;

export {
  SearchInput,
  InformationBox,
  SearchBox,
  InformationBg,
  Frame,
  InformationBoxS,
  SingInBtn,
  Back,
  BackTitle,
  SearchBoxNoShadow,
  SearchBg
};
