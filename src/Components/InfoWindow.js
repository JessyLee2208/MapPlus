import React, { useState, useEffect } from 'react';

import styled from 'styled-components';
import { InfoWindow } from '@react-google-maps/api';
import { useDispatch, useSelector } from 'react-redux';
import { SubTitle, Description } from './UIComponents/Typography';
import renderStar from '../Utils/renderStar';

const divStyle = {
  background: `white`,
  padding: 0
};

const StoreImg = styled.img`
  width: 160px;
  height: 80px;
  border-radius: 8px;
  object-fit: cover;
`;

const Img = styled.img`
  width: 16px;
  height: 16px;
`;

const RatingDiv = styled.div`
  display: flex;
  margin: 0;
  align-items: center;
  padding: 2px 0;
`;

function MapInforWindow() {
  const selectedStore = useSelector((state) => state.selectedStore);
  const informationWindow = useSelector((state) => state.informationWindow);
  const [position, setPosition] = useState(null);
  const dispatch = useDispatch();
  let starArry = [];

  const onInfoWindowLoad = (infoWindow) => {
    // console.log('infoWindow: ', infoWindow);
  };

  useEffect(() => {
    if (selectedStore) {
      setPosition({
        lat: selectedStore.geometry.location.lat(),
        lng: selectedStore.geometry.location.lng()
      });
    }
  }, [selectedStore]);

  if (selectedStore) renderStar(selectedStore.rating, starArry);

  function handleInfoWindow() {
    if (informationWindow) {
      dispatch({
        type: 'setInformationWindow',
        data: false
      });
    } else {
      dispatch({
        type: 'setInformationWindow',
        data: true
      });
    }
  }

  return (
    <div onClick={handleInfoWindow}>
      <InfoWindow onLoad={onInfoWindowLoad} position={position}>
        <div style={divStyle}>
          <StoreImg alt="" src={selectedStore.photos[0].getUrl()}></StoreImg>
          <SubTitle padding={'0'} margin={'0'} style={{ width: '160px' }}>
            {selectedStore.name}
          </SubTitle>
          <RatingDiv>
            <Description padding={'0px  4px 0  0'}>{selectedStore.rating}</Description>
            {starArry}
            <Description padding={'0px  0px 0  6px'}>{selectedStore.user_ratings_total}</Description>
          </RatingDiv>
        </div>
      </InfoWindow>
    </div>
  );
}

export default MapInforWindow;
