import React from 'react';
import styled from 'styled-components';

import { SubItemTitle } from '../Components/UIComponents/Typography';
import { deviceSize } from '../properties/properties';

const SearchSeparator = styled.div`
  min-height: 1px;
  background: #efefef;
  z-index: 5;
  position: fixed;
  top: 58px;
  left: 16px;
  width: 400px;
  z-index: 5;
  @media screen and (max-width: ${deviceSize.mobile}px) {
    width: calc(100vw - 116px);
  }
`;

const Back = styled.div`
  background: #ffffff;

  border-radius: 8px;
  width: 376px;
  height: 86px;
  padding: 0 12px;

  position: fixed;
  left: 8px;
  top: 12px;
  margin-left: 8px;

  box-shadow: 0 2px 4px rgb(0 0 0 / 20%), 0 -1px 0px rgb(0 0 0 / 2%);
  z-index: 4;
  cursor: pointer;

  @media screen and (max-width: ${deviceSize.mobile}px) {
    width: calc(100vw - 140px);
    margin: 0px 8px;
  }
`;

const SearchBg = styled.div`
  background-image: linear-gradient(to bottom, rgb(19 19 19 / 50%), transparent 70%);
  border-radius: 0px;
  width: 435px;
  height: 106px;

  position: fixed;
  left: 0px;
  top: 0px;

  transition-property: background, box-shadow;
  transition-duration: 0.3s;
  z-index: 2;

  @media screen and (max-width: ${deviceSize.mobile}px) {
    width: 100vw;
  }
`;

function SearchBack({ children, onClick }) {
  const titleStyle = {
    position: 'relative',
    bottom: '-56px',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden'
  };
  return (
    <>
      <SearchSeparator />
      <Back>
        <SubItemTitle onClick={onClick} color={'185ee6'} style={titleStyle}>
          {children}
        </SubItemTitle>
      </Back>
      <SearchBg />
    </>
  );
}

export default SearchBack;
