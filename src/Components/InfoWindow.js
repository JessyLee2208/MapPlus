import React, { useState, useEffect, useRef, useCallback } from 'react';

import styled from 'styled-components';
import { InfoWindow } from '@react-google-maps/api';
import { useDispatch, useSelector } from 'react-redux';
import { SubTitle, Description } from './UIComponents/Typography';

import StarRender from '../Utils/StarRender';
import getMorereDetail from '../Utils/getMoreDetail';
import useMediaQuery from '../Utils/useMediaQuery';
import { deviceSize } from '../responsive/responsive';

import './inforWindow.css';

const divStyle = {
  background: `white`,
  padding: 0
};

const StoreImg = styled.img`
  width: 200px;
  height: 100px;
  // border-radius: 8px;
  object-fit: cover;
`;

const RatingDiv = styled.div`
  display: flex;
  margin: 0;
  align-items: center;
  padding: 4px 10px 12px 10px;
`;

function MapInforWindow(props) {
  const informationWindow = useSelector((state) => state.informationWindow);
  const [position, setPosition] = useState(null);
  const dispatch = useDispatch();
  // let starArry = [];
  const infoWindowRef = useRef();

  const isMobile = useMediaQuery(`( max-width: ${deviceSize.mobile}px )`);

  const infoWindowonLoad = useCallback((infoWindow) => {
    infoWindowRef.current = infoWindow;
  }, []);

  useEffect(() => {
    if (props.product) {
      if (props.product.geometry.location) {
        setPosition({
          lat: props.product.geometry.location.lat(),
          lng: props.product.geometry.location.lng()
        });
      } else {
        setPosition({
          lat: props.product.geometry.lat,
          lng: props.product.geometry.lng
        });
      }
    }
  }, [props.product]);
  let star = 0;

  if (props.product) {
    star = StarRender(props.product.rating, { width: 16, height: 16 });
  }

  function handleInfoWindowClick() {
    if (isMobile) {
      dispatch({
        type: 'setInformationWindow',
        data: true
      });
    } else {
      getMorereDetail(props.product, props.service).then((res) => {
        dispatch({
          type: 'setSelectedStore',
          data: res
        });
      });
    }
  }

  return (
    <div onClick={handleInfoWindowClick}>
      <InfoWindow onLoad={infoWindowonLoad} position={position} onClick={handleInfoWindowClick}>
        <div style={divStyle}>
          {props.product.photos ? (
            <StoreImg alt="" src={props.product.photos[0].getUrl()}></StoreImg>
          ) : (
            <StoreImg alt="" src={props.product.photo ? props.product.photo[0] : ''}></StoreImg>
          )}

          <SubTitle padding={'4px 10px'} margin={'0'} style={{ width: '160px' }}>
            {props.product.name}
          </SubTitle>
          <RatingDiv>
            <Description padding={'0px  4px 0  0'}>{props.product.rating}</Description>
            {star}
            <Description padding={'0px  0px 0  6px'}>{props.product.user_ratings_total}</Description>
          </RatingDiv>
        </div>
      </InfoWindow>
    </div>
  );
}

export default MapInforWindow;
