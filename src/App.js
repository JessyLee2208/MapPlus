import React, { useEffect, useState, useCallback, useRef } from 'react';
import styled from 'styled-components';
import useMediaQuery from './Utils/useMediaQuery';
import { ButtonPrimaryFlat, ButtonPrimaryRound } from './Components/UIComponents/Button';
import { deviceSize } from './responsive/responsive';
import { GoogleMap, useLoadScript, StandaloneSearchBox, Marker } from '@react-google-maps/api';
import { SearchInput, SearchBox, Frame, InformationBoxS, SearchBoxShow } from './style';

import StoreCardS from './Components/StoreCardS';
import StoreDetail from './View/StoreDetail';
import DishDetail from './View/DishDetail';
import { getMenuData, googleAccountSignIn, googleAccountLogOut, getStoreData } from './Utils/firebase';
import { useDispatch, useSelector } from 'react-redux';

import algoliasearch from 'algoliasearch';
import CommentModal from './Components/CommentModal';
import ReminderModal from './Components/ReminderModal';

import CollectionList from './View/CollectionList';
import CollectionMarker from './Components/Marker';

import SearchList from './View/SearchList';
import MapInforWindow from './Components/InfoWindow';

import { getStoreUrl } from './Utils/fetch';

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

const libraries = ['drawing', 'places'];
const center = {
  lat: 25.020397,
  lng: 121.533053
};

const searchClient = algoliasearch(process.env.REACT_APP_ALGOLIA_API_ID, process.env.REACT_APP_ALGOLIA_SEARCH_KEY);

const searchIndex = searchClient.initIndex('googlemap_search');
const host_name = 'https://hsiaohan.cf';
// const host_name = 'http://localhost:5000';

function App() {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KRY,
    libraries
  });

  const dispatch = useDispatch();
  const show = useSelector((state) => state.modalShow);
  const userStatus = useSelector((state) => state.userStatus);
  const menuData = useSelector((state) => state.menuData);

  const storeData = useSelector((state) => state.storeData);
  const mapMarkers = useSelector((state) => state.mapMarkers);
  const selectedStore = useSelector((state) => state.selectedStore);
  const selectedDish = useSelector((state) => state.selectedDish);
  const collectionMarks = useSelector((state) => state.collectionMarks);
  const collectionCheck = useSelector((state) => state.collectionTitle);
  const informationWindow = useSelector((state) => state.informationWindow);
  const storeHover = useSelector((state) => state.storeHover);

  const mapRef = useRef();
  const searchRef = useRef();
  // const markerRef = useRef()

  const [bounds, setBounds] = useState(null);
  const [mapStore, setMapStore] = useState([]);
  const [markerLoad, setMarkerLoad] = useState([]);

  const [currentLoction, setcurrentLoction] = useState(null);

  const [algoliaStore, setAlgoliaStore] = useState(null);
  const [searchText, setSearchText] = useState('');

  const mapContainerStyle = {
    width: '100vw',
    height: '100vh',
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: informationWindow ? -10 : 3
  };

  const mapContainerStyleWithSearch = {
    width: 'calc(100vw - 435px)',
    height: '100vh',
    position: 'absolute',
    top: 0,
    left: '435px',
    zIndex: -10
  };

  const mapContainerStyleWithStore = {
    width: 'calc(100vw - 435px)',
    height: 'calc(100vh - 230px)',
    position: 'absolute',
    top: 0,
    left: '435px',
    zIndex: -10
  };

  const style = {
    position: 'fixed',
    right: '62px',
    top: '11px'
  };

  const mobileStyle = {
    position: 'fixed',
    right: '20px',
    top: '18px',
    zIndex: '4'
  };

  const storeListExist =
    storeData && storeData.length > 1 && selectedStore === null && selectedDish === null && !collectionCheck;
  const storeDetailOnlyOneExist =
    storeData && storeData.length === 1 && selectedStore === null && selectedDish === null && !collectionCheck;
  const storeDetailAndMenuExist =
    selectedStore !== null && menuData !== null && selectedDish === null && !collectionCheck;
  const storeDetailExist = selectedStore !== null && selectedDish === null && !collectionCheck;
  const dishDetailExist = selectedDish && !collectionCheck;
  const smileStoreExist = selectedStore && !collectionCheck;

  useEffect(() => {
    if (mapStore.length > 1 && algoliaStore && mapStore) {
      // console.log(mapStore[0].plus_code.compound_code);
      // console.log(mapStore, algoliaStore);

      algoliaStore.forEach((store) => {
        if (store) {
          const condition = mapStore.find((storename) => storename.name === store.name);

          if (!condition) {
            mapStore.unshift(store);

            dispatch({
              type: 'updateMapMarkers',
              data: store
            });
          }
        }
      });
      dispatch({
        type: 'setStoreData',
        data: mapStore
      });
    }
  }, [mapStore, algoliaStore]);

  useEffect(() => {
    let newPlaceArray = [];
    if (collectionMarks.length > 0) {
      collectionMarks.forEach((placeMarkers) => {
        const request = {
          placeId: placeMarkers.place_id,
          fields: ['geometry']
        };

        const c = new Promise((res, rej) => {
          service.getDetails(request, (place, status) => {
            if (status === window.google.maps.places.PlacesServiceStatus.OK) {
              const geometry = place.geometry;
              res({ ...placeMarkers, geometry: geometry });
            }
          });
        });
        newPlaceArray.push(c);
      });
      Promise.all(newPlaceArray).then((res) => {
        res.forEach((view) => {
          if (view.geometry.viewport) {
            bounds.union(view.geometry.viewport);
          } else {
            bounds.extend(view.geometry.location);
          }
        });
        mapRef.current.fitBounds(bounds);
      });
    }
  }, [collectionMarks]);

  //
  // useEffect(() => {
  //   if (selectedStore) {
  //     let selected = mapMarkers.find((marker) => marker.storename === selectedStore.name);
  //     console.log(selected);
  //     let condition = selected.storename === selectedStore.name;
  //     setSelectedMarker(selected);
  //     // let selected = mapMarkers.storename === selectedStore.name;
  //   }
  // }, [selectedStore]);
  // console.log(selectedMarker);

  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);
  const onSearchLoad = useCallback((search) => {
    searchRef.current = search;
  }, []);
  const markeronLoad = useCallback((marker, storename) => {
    setMarkerLoad((m) => [...m, { mrker: marker, storename: storename }]);
  }, []);

  const panTo = useCallback(({ lat, lng }) => {
    mapRef.current.panTo({ lat, lng });
  }, []);

  const isMobile = useMediaQuery(`( max-width: ${deviceSize.mobile}px )`);

  if (loadError) return 'ErrorLoading';
  if (!isLoaded) return 'Loading Maps';
  const service = new window.google.maps.places.PlacesService(mapRef.current);

  const onBoundsChanged = () => {
    setBounds(mapRef.current.getBounds());
  };
  const hanldePlacesChanged = () => {
    dispatch({
      type: 'setCollectionMarks',
      data: []
    });

    dispatch({
      type: 'initMapMarkers',
      data: []
    });
    dispatch({
      type: 'setSelectedStore',
      data: null
    });

    dispatch({
      type: 'setSelectedDish',
      data: null
    });
    dispatch({
      type: 'setSelectedTab',
      data: 'information'
    });
    dispatch({
      type: 'setStoreData',
      data: []
    });

    const places = searchRef.current.getPlaces();
    const bounds = new window.google.maps.LatLngBounds();
    const placePromises = [];

    places.forEach(async (place) => {
      let placeName = place.name.replaceAll('/', ' ');
      dispatch({
        type: 'setMapMarkers',
        data: place
      });

      if (place.geometry.viewport) {
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
      // const placePromise = getStoreUrl(placeName, place);
      // console.log(placePromise);
      const placePromise = fetch(`${host_name}/getStoreURL/${placeName}`).then(async (res) => {
        const a = await res.json();

        return { ...place, deliver: a };
      });

      placePromises.push(placePromise);
    });

    mapRef.current.fitBounds(bounds);

    const callback = (data) => {
      dispatch({
        type: 'setMenuData',
        data: data
      });
    };

    Promise.all(placePromises).then((res) => {
      setMapStore(res);
      if (res.length === 1) {
        dispatch({
          type: 'setStoreData',
          data: res
        });
        console.log(res[0].deliver);
        if (res[0].deliver.uberEatUrl) {
          getMenuData(res[0].name, callback);
        } else {
          dispatch({
            type: 'setMenuData',
            data: null
          });
        }
      }
    });
  };

  // function handleStoreListClick(e) {
  //   storeData.forEach((product) => {
  //     if (e.target.id === product.name) {
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

  function handleSearchText(e) {
    setSearchText(e.target.value);
  }

  const handleSearch = async (queryText) => {
    try {
      await searchIndex.search(queryText).then(({ hits }) => {
        dispatch({
          type: 'setSearchMenu',
          data: hits
        });

        let algoliaSearchData = [];
        hits.forEach((hit) => {
          const data = getStoreData(hit.storeCollectionID);
          algoliaSearchData.push(data);
        });
        Promise.all(algoliaSearchData).then((res) => {
          setAlgoliaStore(res);
        });
      });
    } catch (error) {
      console.log(error);
    }
  };

  function getCurrentLoction() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setcurrentLoction(pos);
        // console.log(pos);
        panTo({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      });
    }
  }

  function closeInformation() {
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
    <Frame>
      {isMobile && !informationWindow ? (
        <ButtonPrimaryRound
          style={{ position: 'fixed', right: '40%', bottom: '24px' }}
          onClick={closeInformation}
          zIndex={4}
        >
          關閉map
        </ButtonPrimaryRound>
      ) : (
        isMobile &&
        informationWindow &&
        (storeListExist || storeDetailExist || collectionCheck || dishDetailExist) && (
          <ButtonPrimaryRound
            style={{ position: 'fixed', right: '40%', bottom: '24px' }}
            onClick={closeInformation}
            zIndex={6}
          >
            開啟map
          </ButtonPrimaryRound>
        )
      )}

      {show && userStatus && <CommentModal show={show}></CommentModal>}
      {show && !userStatus && <ReminderModal show={show}></ReminderModal>}

      <StandaloneSearchBox onLoad={onSearchLoad} onPlacesChanged={hanldePlacesChanged} bounds={bounds}>
        <SearchBox>
          <SearchInput
            type="text"
            placeholder="搜尋 Google 地圖"
            onChange={handleSearchText}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearch(searchText);
              }
            }}
          ></SearchInput>
        </SearchBox>
      </StandaloneSearchBox>
      <SearchBoxShow></SearchBoxShow>

      {storeListExist ? (
        <SearchList markerLoad={markerLoad} service={service}></SearchList>
      ) : storeDetailOnlyOneExist ? (
        storeData.map((product, index) => (
          <StoreDetail key={index} product={product} menu={menuData} service={service}></StoreDetail>
        ))
      ) : storeDetailAndMenuExist ? (
        <StoreDetail product={selectedStore} menu={menuData}></StoreDetail>
      ) : storeDetailExist ? (
        <StoreDetail product={selectedStore}></StoreDetail>
      ) : dishDetailExist ? (
        <DishDetail dishdata={selectedDish} service={service}></DishDetail>
      ) : collectionCheck ? (
        <CollectionList service={service}></CollectionList>
      ) : (
        <></>
      )}

      {smileStoreExist && (
        <InformationBoxS>
          {/* <InformationBoxS onClick={handleStoreListClick}>*/}
          {storeData.length > 1 &&
            storeData.map((product, key) => (
              <StoreCardS key={key} product={product} id={product.name} service={service} />
            ))}
        </InformationBoxS>
      )}
      {!userStatus ? (
        <ButtonPrimaryFlat
          onClick={(e) => {
            googleAccountSignIn(e, dispatch);
          }}
          style={!isMobile ? style : mobileStyle}
        >
          登入
        </ButtonPrimaryFlat>
      ) : (
        <ButtonPrimaryFlat
          onClick={(e) => {
            googleAccountLogOut(e, dispatch);
          }}
          style={!isMobile ? style : mobileStyle}
        >
          登出
        </ButtonPrimaryFlat>
      )}

      <UserPositionCheck
        onClick={getCurrentLoction}
        panTo={panTo}
        style={{ display: informationWindow ? 'none' : 'flex' }}
      >
        <img src="/current.png" alt=""></img>
      </UserPositionCheck>

      <GoogleMap
        mapContainerStyle={
          storeListExist && !isMobile
            ? mapContainerStyleWithSearch
            : storeListExist && isMobile
            ? mapContainerStyle
            : smileStoreExist && !isMobile
            ? mapContainerStyleWithStore
            : mapContainerStyle
        }
        zoom={16}
        center={center}
        onLoad={onMapLoad}
        onBoundsChanged={onBoundsChanged}
        style={{ padding: 0 }}
      >
        {collectionMarks.length === 0
          ? mapMarkers.map((marker, key) => (
              <CollectionMarker
                service={service}
                marker={marker}
                content={storeData}
                key={key}
                onLoad={markeronLoad}
                // icon={{
                //   url:
                //     selectedStore && selectedMarker && selectedMarker.storename === selectedStore.name
                //       ? '/Selectedmarker.png'
                //       : '/marker.png',
                //   scaledSize: new window.google.maps.Size(20, 30)
                // }}
              ></CollectionMarker>
            ))
          : collectionCheck &&
            collectionMarks.map((marker, key) => (
              <CollectionMarker
                tag={collectionCheck}
                marker={marker}
                key={key}
                onLoad={markeronLoad}
              ></CollectionMarker>
            ))}
        {currentLoction && (
          <Marker
            position={{ lat: currentLoction.lat, lng: currentLoction.lng }}
            icon={{
              url: '/loction.png',
              scaledSize: new window.google.maps.Size(44, 44)
            }}
          ></Marker>
        )}
        {storeHover && (
          <Marker
            position={
              storeHover.geometry.location
                ? { lat: storeHover.geometry.location.lat(), lng: storeHover.geometry.location.lng() }
                : { lat: storeHover.geometry.lat, lng: storeHover.geometry.lng }
            }
            icon={{
              url: '/Selectedmarker.png',
              scaledSize: new window.google.maps.Size(26, 38)
            }}
            animation={(marker) => {
              const timer = () => {
                setTimeout(() => {
                  marker.setAnimation(null);
                }, 470);
              };
              marker.setAnimation(window.google.maps.Animation.BOUNCE);
              timer();
            }}
          ></Marker>
        )}
        {selectedStore && isMobile && <MapInforWindow></MapInforWindow>}
      </GoogleMap>
    </Frame>
  );
}

export default App;
