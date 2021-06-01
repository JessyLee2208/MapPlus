import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';

import StoreCardL from '../Components/StoreCardL';
import { deviceSize } from '../responsive/responsive';
import { SearchBg } from '../Components/UIComponents/common';

const InformationBox = styled.div`
  background: #fff;
  box-shadow: 0 2px 4px rgb(0 0 0 / 20%), 0 10px 10px rgb(0 0 0 / 10%);
  width: 435px;
  position: relative;
  height: calc(100vh - 70px);
  // top: 78px;
  overflow: auto;
  padding-top: 70px;
  @media screen and (max-width: ${deviceSize.mobile}px) {
    width: 100vw;
  }
`;

function SearchList(props) {
  const storeData = useSelector((state) => state.storeData);

  return (
    <InformationBox>
      <SearchBg></SearchBg>
      {storeData.map((product) => (
        <StoreCardL key={product.place_id} product={product} id={product.name} service={props.service} />
      ))}
    </InformationBox>
  );
}

export default SearchList;
