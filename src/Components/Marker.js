import React, { useCallback, useRef, useEffect, useState } from 'react';
import { Marker } from '@react-google-maps/api';
import { useDispatch, useSelector } from 'react-redux';
import { getMenuData } from '../Utils/firebase';
import getMorereDetail from '../Utils/getMoreDetail';

function CollectionMarker(props) {
  const dispatch = useDispatch();
  const collectionList = useSelector((state) => state.collectionList);
  const collectionMarks = useSelector((state) => state.collectionMarks);
  const selectedStore = useSelector((state) => state.selectedStore);
  const storeHover = useSelector((state) => state.storeHover);

  const markerRef = useRef();

  let url = '';

  useEffect(() => {}, [storeHover, selectedStore]);

  // const timer = () => {
  //   setTimeout(() => {
  //     markerRef.current.setAnimation(null);
  //   }, 470);
  // };

  const handleCollectionMarker = (marker) => {
    // markerRef.current.setAnimation(window.google.maps.Animation.BOUNCE);
    // timer();
    dispatch({
      type: 'setSelectedTab',
      data: 'information'
    });

    collectionList.forEach((product) => {
      if (props.marker.storename === product.name) {
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

  const handleMapMarker = (marker) => {
    // markerRef.current.setAnimation(window.google.maps.Animation.BOUNCE);

    // timer();

    dispatch({
      type: 'setSelectedTab',
      data: 'information'
    });

    props.content.forEach((product) => {
      if (props.marker.storename === product.name) {
        getMorereDetail(product, props.service).then((res) => {
          dispatch({
            type: 'setSelectedStore',
            data: res
          });
        });
        dispatch({
          type: 'setSelectedDish',
          data: null
        });

        if (product.deliver.uberEatUrl) {
          const callback = (data) => {
            dispatch({
              type: 'setMenuData',
              data: data
            });
          };
          getMenuData(product.name, callback);
        }
      }
    });
  };
  // selectedStore.name === props.marker.storename || storeHover.name === props.marker.storename
  console.log(selectedStore, props.marker, storeHover);

  if (props.tag === '想去的地點') {
    url = '/falg_marker.png';
  } else if (props.tag === '喜愛的地點') {
    url = '/heart_marker.png';
  } else if (props.tag === '已加星號的地點') {
    url = '/star_marker.png';
  }
  const markeronLoad = useCallback((marker) => {
    markerRef.current = marker;
  }, []);

  return collectionMarks.length !== 0 ? (
    <Marker
      position={{ lat: props.marker.lat, lng: props.marker.lng }}
      icon={{
        url: url,
        scaledSize: storeHover
          ? storeHover.name === props.marker.storename
            ? new window.google.maps.Size(26, 38)
            : new window.google.maps.Size(20, 30)
          : new window.google.maps.Size(20, 30)
      }}
      onClick={handleCollectionMarker}
      onLoad={(marker) => {
        props.onLoad(marker, props.marker.storename);
        markeronLoad(marker);
      }}
    />
  ) : (
    <Marker
      position={{ lat: props.marker.lat, lng: props.marker.lng }}
      onClick={handleMapMarker}
      onLoad={(marker) => {
        props.onLoad(marker, props.marker.storename);
        markeronLoad(marker);
      }}
      icon={{
        url:
          selectedStore && storeHover
            ? selectedStore.place_id === props.marker.place_id || storeHover.place_id === props.marker.place_id
              ? '/Selectedmarker.png'
              : '/marker.png'
            : storeHover
            ? storeHover.place_id === props.marker.place_id
              ? '/Selectedmarker.png'
              : '/marker.png'
            : selectedStore
            ? selectedStore.place_id === props.marker.place_id
              ? '/Selectedmarker.png'
              : '/marker.png'
            : '/marker.png',
        scaledSize:
          selectedStore && storeHover
            ? selectedStore.place_id === props.marker.place_id || storeHover.place_id === props.marker.place_id
              ? new window.google.maps.Size(26, 38)
              : new window.google.maps.Size(20, 30)
            : storeHover
            ? storeHover.place_id === props.marker.place_id
              ? new window.google.maps.Size(26, 38)
              : new window.google.maps.Size(20, 30)
            : selectedStore
            ? selectedStore.place_id === props.marker.place_id
              ? new window.google.maps.Size(26, 38)
              : new window.google.maps.Size(20, 30)
            : new window.google.maps.Size(20, 30)
      }}
    />
  );
}

export default CollectionMarker;
