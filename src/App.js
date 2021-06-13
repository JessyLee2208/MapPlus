import React, { useEffect, useState, useCallback, useRef } from 'react';
import styled from 'styled-components';
import { GoogleMap, useLoadScript, StandaloneSearchBox, Marker } from '@react-google-maps/api';
import toast, { Toaster } from 'react-hot-toast';
import algoliasearch from 'algoliasearch';
import { useDispatch, useSelector } from 'react-redux';
import { SearchInput, SearchBox, Frame, SearchBoxShow } from './style';

import StoreDetail from './View/StoreDetail';
import DishDetail from './View/DishDetail';
import SearchList from './View/SearchList';
import SearchListS from './View/SearchListS';
import MemberPage from './View/MemberPage';
import CollectionList from './View/CollectionList';
import NotFound from './View/NotFount';

import { getMenuData, googleAccountSignIn, getStoreData, googleAccountStateChanged } from './Utils/firebase';
import { getStoreDetail } from './Utils/getMoreDetail';
import useMediaQuery from './Utils/useMediaQuery';
import { getStoreMenu } from './Utils/fetch';

import CommentModal from './Components/CommentModal';
import ReminderModal from './Components/ReminderModal';

import { Loading } from './Components/UIComponents/LottieAnimat';
import MapInforWindow from './Components/InfoWindow';
import Markers from './Components/Marker';
import { ButtonPrimaryFlat, ButtonPrimaryRoundIcon } from './Components/UIComponents/Button';
import { deviceSize } from './responsive/responsive';

import AddCollectionModal from './Components/AddCollectionModal';

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

const AuthorImg = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 12px;
  position: fixed;
  right: 47px;
  top: 11px;

  cursor: pointer;

  &:hover {
    box-shadow: 0 0px 6px rgba(0, 0, 0, 0.15);
  }

  @media screen and (max-width: ${deviceSize.mobile}px) {
    position: fixed;
    right: 18px;
    top: 15px;
    z-index: 4;
    width: 44px;
    height: 44px;
  }
`;

const Delete = styled.div`
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #757575;
  font-size: 24px;
  margin-bottom: 3px;

  cursor: pointer;

  &:hover {
    color: #185ee6;
  }
`;

const libraries = ['drawing', 'places'];
const center = {
  lat: 25.020397,
  lng: 121.533053
};

const searchOption = {
  fields: [
    'name',
    'formatted_address',
    'place_id',
    'geometry',
    'opening_hours',
    'utc_offset_minutes',
    'reviews',
    'formatted_phone_number',
    'website'
  ]
};

const searchClient = algoliasearch(process.env.REACT_APP_ALGOLIA_API_ID, process.env.REACT_APP_ALGOLIA_SEARCH_KEY);

const searchIndex = searchClient.initIndex('googlemap_search');
// const host_name = 'https://hsiaohan.cf';
const host_name = 'http://localhost:5000';

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

  const markerHover = useSelector((state) => state.markerHover);
  const searchMenu = useSelector((state) => state.searchMenu);

  const mapRef = useRef();
  const searchRef = useRef();

  const textInput = useRef();

  const [bounds, setBounds] = useState(null);
  const [mapStore, setMapStore] = useState([]);
  const [markerLoad, setMarkerLoad] = useState([]);

  const [currentLoction, setcurrentLoction] = useState(null);

  const [algoliaStore, setAlgoliaStore] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [placrCheck, setPlacrCheck] = useState(false);
  const [listCheck, setListCheck] = useState(false);

  const [memberPageShow, setMemberPageShow] = useState();

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

  // const style = ;

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
  const smileStoreExist = selectedStore && !collectionCheck && storeData.length > 1;

  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);
  const onSearchLoad = useCallback((search) => {
    searchRef.current = search;
  }, []);
  const markeronLoad = useCallback((marker, storename) => {
    setMarkerLoad((m) => [...m, { mrker: marker, storename: storename }]);
  }, []);

  useEffect(() => {
    if (mapStore.length > 1 && algoliaStore && mapStore) {
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
      const NewRes = [...collectionMarks];

      let removed = [];
      const count = NewRes.length / 10;
      const countNam = parseInt(count);

      let rule = countNam === 0 ? 1 : countNam;

      for (let i = 0; i < rule; i++) {
        let newArray = NewRes.slice(0, 10);

        newArray.forEach((placeMarkers) => {
          const markerArray = new Promise((res, rej) => {
            const request = {
              placeId: placeMarkers.place_id,
              fields: ['geometry']
            };
            service.getDetails(request, callback);
            function callback(place, status) {
              if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                const geometry = place.geometry;

                res({ ...placeMarkers, geometry: geometry });
              }
            }
          });
          newPlaceArray.push(markerArray);
        });
        removed = NewRes.splice(countNam * 10);
      }

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

  useEffect(() => {
    if (selectedStore) {
      if (selectedStore.geometry.lat) {
        panTo({
          lat: selectedStore.geometry.lat,
          lng: selectedStore.geometry.lng
        });
      }
      if (selectedStore.geometry.location) {
        panTo({
          lat: selectedStore.geometry.location.lat(),
          lng: selectedStore.geometry.location.lng()
        });
      }
    }
  }, [selectedStore]);

  useEffect(() => {
    let pathname = window.location.pathname;
    if (pathname !== '/') {
      window.location.pathname = '';
    }
  }, []);

  const panTo = useCallback(({ lat, lng }) => {
    mapRef.current.panTo({ lat, lng });
  }, []);

  const notify = () =>
    toast('成功登入', {
      style: {
        borderRadius: '4px',
        background: '#333',
        color: '#fff'
      }
    });

  useEffect(() => {
    function callback(user) {
      dispatch({
        type: 'setUserState',
        data: user
      });
    }

    return googleAccountStateChanged(callback);
  }, []);

  useEffect(() => {
    if (userStatus) {
      notify();
    }
  }, [userStatus]);

  const isMobile = useMediaQuery(`( max-width: ${deviceSize.mobile}px )`);

  const defaultMapOptions = {
    mapTypeControl: false
  };

  if (loadError) return 'ErrorLoading';
  if (!isLoaded) return 'Loading Maps';
  const service = new window.google.maps.places.PlacesService(mapRef.current);

  const onBoundsChanged = () => {
    setBounds(mapRef.current.getBounds());
  };
  const hanldePlacesChanged = () => {
    dispatch({
      type: 'setStoreHover',
      data: null
    });

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
    // console.log(places);
    if (places.length === 0) {
      setPlacrCheck(true);
    }

    const bounds = new window.google.maps.LatLngBounds();
    const placePromises = [];

    places.forEach(async (place) => {
      let set = place.name.replaceAll('/', ' ');
      let placeName = set.replaceAll('%', '%25');

      dispatch({
        type: 'setMapMarkers',
        data: place
      });

      if (place.geometry.viewport) {
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }

      const placePromise = fetch(`${host_name}/getStoreURL/${placeName}`).then(async (res) => {
        const a = await res.json();

        return {
          ...place,
          opening_hours: place.opening_hours
            ? {
                isOpen: place.opening_hours.isOpen(),
                weekday_text: place.weekday_text || '',
                periods: place.periods || ''
              }
            : { isOpen: null, weekday_text: null, periods: null },

          deliver: a
        };
      });

      placePromises.push(placePromise);
    });

    if (places.length > 0) mapRef.current.fitBounds(bounds);

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
        console.log(res[0]);
        console.log(res[0].photos[0].getUrl());

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
      setAlgoliaStore([]);
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

  function handleUserProfile() {
    setMemberPageShow(!memberPageShow);
    dispatch({
      type: 'setMarkerHover',
      data: null
    });
  }

  function handleSearchInput() {
    textInput.current.value = '';
    dispatch({
      type: 'setStoreData',
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
      type: 'setMenuData',
      data: null
    });
    dispatch({
      type: 'setSearchMenu',
      data: null
    });
    setMapStore([]);
    setPlacrCheck(false);
  }

  return (
    <Frame>
      {!storeListExist &&
        !storeDetailExist &&
        !dishDetailExist &&
        !collectionCheck &&
        !storeDetailOnlyOneExist &&
        searchMenu &&
        !isMobile && (
          <div style={{ width: '435px', height: '100vh' }}>
            {!placrCheck ? <Loading></Loading> : <NotFound searchText={searchText}></NotFound>}
          </div>
        )}

      <Toaster />
      {userStatus && memberPageShow && <MemberPage show={setMemberPageShow} check={setListCheck}></MemberPage>}

      {isMobile && !informationWindow ? (
        <ButtonPrimaryRoundIcon
          style={{ position: 'fixed', right: '40%', bottom: '24px', boxShadow: '0px 0px 7px rgb(0 0 0 / 25%)' }}
          onClick={closeInformation}
          zIndex={4}
          src="/map.png"
        >
          關閉map
        </ButtonPrimaryRoundIcon>
      ) : (
        isMobile &&
        informationWindow &&
        (storeListExist || storeDetailExist || collectionCheck || dishDetailExist) && (
          <ButtonPrimaryRoundIcon
            style={{ position: 'fixed', right: '40%', bottom: '24px', boxShadow: '0px 0px 7px rgb(0 0 0 / 25%)' }}
            onClick={closeInformation}
            zIndex={6}
            src="/map.png"
          >
            開啟map
          </ButtonPrimaryRoundIcon>
        )
      )}

      {userStatus && listCheck && <AddCollectionModal show={listCheck} check={setListCheck}></AddCollectionModal>}
      {show && userStatus && !listCheck && <CommentModal show={show}></CommentModal>}
      {show && !userStatus && !listCheck && <ReminderModal show={show}></ReminderModal>}
      <StandaloneSearchBox
        onLoad={onSearchLoad}
        onPlacesChanged={hanldePlacesChanged}
        bounds={bounds}
        options={searchOption}
      >
        <SearchBox
          onClick={() => {
            setMemberPageShow(false);
          }}
        >
          <SearchInput
            type="text"
            placeholder="搜尋 Google 地圖"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearch(searchText);
                setSearchText(e.target.value);
              }
            }}
            ref={textInput}
          />
          {searchText && <Delete onClick={handleSearchInput}>×</Delete>}
        </SearchBox>
      </StandaloneSearchBox>
      <SearchBoxShow></SearchBoxShow>
      {storeListExist ? (
        <SearchList markerLoad={markerLoad} service={service} panTo={panTo}></SearchList>
      ) : storeDetailOnlyOneExist ? (
        storeData.map((product, index) => (
          <StoreDetail key={index} product={product} menu={menuData} service={service} input={searchText}></StoreDetail>
        ))
      ) : storeDetailAndMenuExist ? (
        <StoreDetail product={selectedStore} menu={menuData}></StoreDetail>
      ) : storeDetailExist ? (
        <StoreDetail product={selectedStore}></StoreDetail>
      ) : dishDetailExist ? (
        <DishDetail dishdata={selectedDish} service={service} check={setListCheck}></DishDetail>
      ) : (
        collectionCheck && <CollectionList service={service} panTo={panTo}></CollectionList>
      )}
      {smileStoreExist && !isMobile && <SearchListS service={service}></SearchListS>}
      {!userStatus ? (
        <ButtonPrimaryFlat
          onClick={(e) => {
            googleAccountSignIn(e, dispatch, setMemberPageShow);
            // setloginToast(!loginToast);
            dispatch({
              type: 'setloginToast',
              data: true
            });
          }}
          style={
            !isMobile
              ? {
                  position: 'fixed',
                  right: '62px',
                  top: '11px'
                }
              : mobileStyle
          }
        >
          登入
        </ButtonPrimaryFlat>
      ) : (
        <AuthorImg src={userStatus.photoURL} alt="" onClick={handleUserProfile}></AuthorImg>
      )}
      <UserPositionCheck
        onClick={getCurrentLoction}
        panTo={panTo}
        style={{
          display:
            informationWindow && (storeListExist || storeDetailExist || collectionCheck || dishDetailExist) && isMobile
              ? 'none'
              : 'flex'
        }}
      >
        <img src="/current.png" alt=""></img>
      </UserPositionCheck>
      <GoogleMap
        mapContainerStyle={
          (storeListExist && !isMobile) || (searchMenu && !isMobile)
            ? mapContainerStyleWithSearch
            : storeListExist && isMobile
            ? mapContainerStyle
            : smileStoreExist && !isMobile
            ? mapContainerStyleWithStore
            : (storeDetailOnlyOneExist || collectionCheck) && !isMobile
            ? mapContainerStyleWithSearch
            : mapContainerStyle
        }
        zoom={16}
        center={center}
        onLoad={onMapLoad}
        onBoundsChanged={onBoundsChanged}
        options={defaultMapOptions}
        style={{ padding: 0 }}
        onClick={(e) => {
          e.stop();

          dispatch({
            type: 'setMarkerHover',
            data: null
          });
          setMemberPageShow(false);

          getStoreDetail(e.placeId, service).then((res) => {
            dispatch({
              type: 'setStoreData',
              data: [res]
            });
            dispatch({
              type: 'setSelectedDish',
              data: null
            });
            dispatch({
              type: 'setSelectedStore',
              data: null
            });
            dispatch({
              type: 'initMapMarkers',
              data: [
                {
                  lat: res.geometry.location.lat(),
                  lng: res.geometry.location.lng(),
                  place_id: res.place_id,
                  storename: res.name
                }
              ]
            });

            if (res.deliver.uberEatUrl || res.deliver.foodPandaUrl) {
              function setData(data) {
                dispatch({
                  type: 'setMenuData',
                  data: data
                });
              }
              getStoreMenu(res.deliver);
              getMenuData(res.name, setData);
            } else {
              dispatch({
                type: 'setMenuData',
                data: null
              });
            }

            textInput.current.value = res.name;
            setSearchText(res.name);
          });
        }}
      >
        {collectionMarks.length === 0
          ? mapMarkers.map((marker, key) => (
              <Markers service={service} marker={marker} content={storeData} key={key} onLoad={markeronLoad}></Markers>
            ))
          : collectionCheck &&
            collectionMarks.map((marker, key) => (
              <Markers tag={collectionCheck} marker={marker} key={key} onLoad={markeronLoad}></Markers>
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

        {selectedStore && isMobile && <MapInforWindow product={selectedStore} service={service}></MapInforWindow>}
        {markerHover && !isMobile && <MapInforWindow product={markerHover} service={service}></MapInforWindow>}
      </GoogleMap>
    </Frame>
  );
}

export default App;
