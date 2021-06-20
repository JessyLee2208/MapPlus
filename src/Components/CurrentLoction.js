import React, { useState } from 'react';
import styled from 'styled-components';
import { Marker } from '@react-google-maps/api';

import { customNotify } from '../utils/toasts';
import { deviceSize } from '../properties/properties';

const UserPositionCheck = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 4px;

  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  right: 10px;
  top: 64px;

  cursor: pointer;
  transition: all 150ms ease-in-out;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  @media screen and (max-width: ${deviceSize.mobile}px) {
    position: fixed;
    right: 10px;
    top: 396px;
    z-index: 6;
  }
`;

function CurrentLoction({ panTo, zoom, style }) {
  const [currentLoction, setcurrentLoction] = useState(null);
  const currentLoctionIconSize = new window.google.maps.Size(44, 44);

  function setMapZoomSize() {
    const updateZoom = 17;
    if (zoom.zoom === zoom.initZoom) {
      zoom.setZoom(updateZoom);
    } else if (zoom === updateZoom) {
      zoom.setZoom(zoom.initZoom);
    }
  }

  function getCurrentLoction() {
    if (navigator.geolocation) {
      customNotify();
      navigator.geolocation.getCurrentPosition((position) => {
        const positionObj = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setcurrentLoction(positionObj);
        panTo(positionObj);
        setMapZoomSize();
      });
    }
  }

  return (
    <>
      <UserPositionCheck onClick={getCurrentLoction} style={style}>
        <img src="/current.png" alt="" />
      </UserPositionCheck>
      {currentLoction && (
        <Marker
          position={{ lat: currentLoction.lat, lng: currentLoction.lng }}
          icon={{
            url: '/loction.png',
            scaledSize: currentLoctionIconSize
          }}
        />
      )}
    </>
  );
}

export default CurrentLoction;
