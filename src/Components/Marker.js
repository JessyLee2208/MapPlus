import React, { useCallback, useRef } from 'react';
import { Marker } from '@react-google-maps/api';
import { useDispatch, useSelector } from 'react-redux';

import { getMenuData } from '../utils/firebase';
import getMorereDetail from '../utils/getMoreDetail';
import { collectionBasicLists } from '../properties/properties';

function Markers(props) {
  const dispatch = useDispatch();
  const collectionList = useSelector((state) => state.collectionList);
  const collectionMarks = useSelector((state) => state.collectionMarks);
  const selectedStore = useSelector((state) => state.selectedStore);
  const storeHover = useSelector((state) => state.storeHover);
  const storeData = useSelector((state) => state.storeData);

  const markerRef = useRef();

  let url = '';

  const handleCollectionMarker = (marker) => {
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

  const handleMarkerHover = (e) => {
    props.content.forEach((product) => {
      if (props.marker.place_id === product.place_id) {
        dispatch({
          type: 'setMarkerHover',
          data: product
        });
      }
    });
  };

  if (props.tag === collectionBasicLists.want.collectName) {
    url = collectionBasicLists.want.markerIcon;
  } else if (props.tag === collectionBasicLists.like.collectName) {
    url = collectionBasicLists.like.markerIcon;
  } else if (props.tag === collectionBasicLists.star.collectName) {
    url = collectionBasicLists.star.markerIcon;
  } else {
    url = '/custom_marker.png';
  }
  const markeronLoad = useCallback((marker) => {
    markerRef.current = marker;
  }, []);

  function checkMarkType() {
    if (storeData.length === 1 && !selectedStore)
      return { icon: '/Selectedmarker.png', size: new window.google.maps.Size(26, 38) };
    if (selectedStore && selectedStore.place_id === props.marker.place_id)
      return { icon: '/Selectedmarker.png', size: new window.google.maps.Size(26, 38) };
    if (storeHover && storeHover.place_id === props.marker.place_id)
      return { icon: '/Selectedmarker.png', size: new window.google.maps.Size(26, 38) };

    return { icon: '/marker.png', size: new window.google.maps.Size(20, 30) };
  }

  const markerChangeable = checkMarkType();

  if (collectionMarks.length !== 0) {
  }

  // function ponstionHandler() {

  //   const markerPostion = { lat: props.marker.lat, lng: props.marker.lng };
  // }

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
      onMouseOver={handleMarkerHover}
      icon={{
        url: markerChangeable.icon,
        scaledSize: markerChangeable.size
      }}
    />
  );
}

export default Markers;
