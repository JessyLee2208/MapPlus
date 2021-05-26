import React, { useCallback, useRef, useEffect } from 'react';
import { Marker } from '@react-google-maps/api';
import { useDispatch, useSelector } from 'react-redux';
import { getMenuData } from '../Utils/firebase';
import getMorereDetail from '../Utils/getMoreDetail';

function CollectionMarker(porps) {
  const dispatch = useDispatch();
  const collectionList = useSelector((state) => state.collectionList);
  const collectionMarks = useSelector((state) => state.collectionMarks);
  const markerRef = useRef();

  let url = '';

  const handleCollectionMarker = (marker) => {
    dispatch({
      type: 'setSelectedTab',
      data: 'information'
    });

    collectionList.forEach((product) => {
      if (marker.storename === product.name) {
        const newMarker = {
          lat: product.geometry.lat,
          lng: product.geometry.lng,
          storename: product.name
        };

        dispatch({
          type: 'setSelectedStore',
          data: product
        });
        dispatch({
          type: 'initMapMarkers',
          data: [newMarker]
        });

        dispatch({
          type: 'setCollectionMarks',
          data: []
        });

        dispatch({
          type: 'setCollectionTitle',
          data: false
        });
        dispatch({
          type: 'setSelectedDish',
          data: null
        });
        dispatch({
          type: 'setStoreData',
          data: []
        });

        if (product.deliver.uberEatUrl || product.deliver.foodPandaUrl) {
          function setData(data) {
            dispatch({
              type: 'setMenuData',
              data: data
            });
          }
          getMenuData(product.name, setData);
        } else {
          dispatch({
            type: 'setMenuData',
            data: null
          });
        }
      }
    });
  };

  //   const markerTimer = useEffect(() => {
  //     const timer = setTimeout(() => {
  //       markerRef.current.setAnimation(window.google.maps.Animation.BOUNCE);
  //     }, 1000);
  //     return () => clearTimeout(timer);
  //   }, []);

  const timer = () => {
    setTimeout(() => {
      markerRef.current.setAnimation(null);
    }, 470);
  };

  const handleMapMarker = (marker) => {
    markerRef.current.setAnimation(window.google.maps.Animation.BOUNCE);
    timer();

    dispatch({
      type: 'setSelectedTab',
      data: 'information'
    });

    porps.content.forEach((product) => {
      if (marker.storename === product.name) {
        getMorereDetail(product, porps.service).then((res) => {
          dispatch({
            type: 'setSelectedStore',
            data: res
          });
        });
        dispatch({
          type: 'setSelectedDish',
          data: null
        });
      }
    });
  };

  if (porps.tag === '想去的地點') {
    url = '/falg_marker.png';
  } else if (porps.tag === '喜愛的地點') {
    url = '/heart_marker.png';
  } else if (porps.tag === '已加星號的地點') {
    url = '/star_marker.png';
  }
  const MarkeronLoad = useCallback((marker) => {
    markerRef.current = marker;
    // marker.setAnimation(window.google.maps.Animation.BOUNCE);
  }, []);

  return collectionMarks.length !== 0 ? (
    <Marker
      position={{ lat: porps.marker.lat, lng: porps.marker.lng }}
      icon={{
        url: url,
        scaledSize: new window.google.maps.Size(20, 30)
      }}
      onClick={() => {
        handleCollectionMarker(porps.marker);
      }}
      onLoad={MarkeronLoad}
    />
  ) : (
    <Marker
      position={{ lat: porps.marker.lat, lng: porps.marker.lng }}
      onClick={() => {
        handleMapMarker(porps.marker);
      }}
      onLoad={MarkeronLoad}
    />
  );
}

export default CollectionMarker;
