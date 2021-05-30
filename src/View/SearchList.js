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
  const { markerLoad, service } = props;
  const storeData = useSelector((state) => state.storeData);
  const mapMarkers = useSelector((state) => state.mapMarkers);

  // function handleStoreListClick(e) {
  //   storeData.forEach((product) => {
  //     if (e.target.id === product.name) {
  //       console.log(product);
  //       let a = mapMarkers.find((marker) => e.target.id === marker.storename);

  //       markerLoad.forEach((marker) => {
  //         const timer = () => {
  //           setTimeout(() => {
  //             marker.mrker.setAnimation(null);
  //           }, 400);
  //         };
  //         if (e.target.id === marker.storename) {
  //           marker.mrker.setAnimation(window.google.maps.Animation.BOUNCE);
  //           timer();
  //         }
  //       });
  //     }
  //   });
  // }

  return (
    <InformationBox>
      <SearchBg></SearchBg>
      {storeData.map((product) => (
        <StoreCardL key={product.place_id} product={product} id={product.name} service={service} />
      ))}
    </InformationBox>
  );
}

export default SearchList;
